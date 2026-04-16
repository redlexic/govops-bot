const { SPELL_CALENDAR } = require("./spell-calendar");
const { CYCLE_EVENTS } = require("./cycle-template");
const { WEEKLY_EVENTS } = require("./weekly-events");

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_MIN = 60 * 1000;
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// W0 Monday = publishDate (W3 Thu) minus 24 days
// W3 Friday = publishDate + 1 day
function getW0Monday(publishDate) {
  return new Date(publishDate.getTime() - 24 * MS_PER_DAY);
}

function getW3Friday(publishDate) {
  return new Date(publishDate.getTime() + MS_PER_DAY + (24 * MS_PER_HOUR) - 1);
}

function buildCycleLabel(spell) {
  const d = new Date(`${spell.publishDate}T00:00:00Z`);
  return `${spell.crafter}-${MONTH_ABBR[d.getUTCMonth()]}${d.getUTCDate()}`;
}

function expandCycle(spell) {
  const pubDate = new Date(`${spell.publishDate}T00:00:00Z`);
  const w0Monday = getW0Monday(pubDate);
  const cycleLabel = buildCycleLabel(spell);

  return CYCLE_EVENTS.map((tmpl) => {
    const [hours, mins] = tmpl.time.split(":").map(Number);
    const dayOffset = tmpl.week * 7 + (tmpl.day - 1);
    const datetime = new Date(w0Monday.getTime() + dayOffset * MS_PER_DAY + hours * MS_PER_HOUR + mins * MS_PER_MIN);

    const actor = tmpl.actor === "Crafter" ? spell.crafter : tmpl.actor;

    return {
      datetime,
      label: tmpl.label,
      actor,
      cycleLabel,
      week: tmpl.week,
      day: tmpl.day,
      time: tmpl.time,
      link: tmpl.link || null,
      publishDate: spell.publishDate,
      crafter: spell.crafter,
    };
  }).sort((a, b) => a.datetime - b.datetime);
}

function getActiveCycles(now) {
  const active = [];
  for (const spell of SPELL_CALENDAR) {
    if (!spell.crafter) continue;
    const pubDate = new Date(`${spell.publishDate}T00:00:00Z`);
    const w0Monday = getW0Monday(pubDate);
    const w3Friday = getW3Friday(pubDate);
    if (now >= w0Monday && now <= w3Friday) {
      const weeksSinceW0 = Math.floor((now - w0Monday) / (7 * MS_PER_DAY));
      const currentWeek = Math.min(weeksSinceW0, 3);
      active.push({
        spell,
        cycleLabel: buildCycleLabel(spell),
        crafter: spell.crafter,
        publishDate: spell.publishDate,
        currentWeek,
        events: expandCycle(spell),
      });
    }
  }
  active.sort((a, b) => a.publishDate.localeCompare(b.publishDate));
  return active;
}

function getWeeklyEventsForHour(now) {
  const nowDay = now.getUTCDay() || 7;
  const nowHour = now.getUTCHours();
  const nowDate = now.toISOString().slice(0, 10);

  return WEEKLY_EVENTS
    .filter((e) => e.day === nowDay && parseInt(e.time, 10) === nowHour)
    .map((e) => ({
      datetime: new Date(`${nowDate}T${e.time}:00Z`),
      label: e.label,
      actor: e.actor,
      cycleLabel: "Weekly",
      week: null,
      day: e.day,
      time: e.time,
      link: e.link || null,
      publishDate: null,
      crafter: null,
    }));
}

function getNextWeeklyEvent(now) {
  const nowDay = now.getUTCDay() || 7;
  const nowHour = now.getUTCHours();
  const nowMin = now.getUTCMinutes();

  for (const e of WEEKLY_EVENTS) {
    const [eH, eM] = e.time.split(":").map(Number);
    let daysAhead = e.day - nowDay;
    if (daysAhead < 0 || (daysAhead === 0 && (eH < nowHour || (eH === nowHour && eM <= nowMin)))) {
      daysAhead += 7;
    }
    const datetime = new Date(now.getTime());
    datetime.setUTCDate(datetime.getUTCDate() + daysAhead);
    datetime.setUTCHours(eH, eM, 0, 0);

    return {
      event: {
        datetime,
        label: e.label,
        actor: e.actor,
        cycleLabel: "Weekly",
        week: null,
        day: e.day,
        time: e.time,
        link: e.link || null,
        publishDate: null,
        crafter: null,
      },
      msUntil: datetime - now,
    };
  }
  return null;
}

function getEventsForHour(now = new Date()) {
  const cycles = getActiveCycles(now);
  const nowHour = now.getUTCHours();
  const nowDate = now.toISOString().slice(0, 10);

  const due = [];
  for (const cycle of cycles) {
    for (const event of cycle.events) {
      if (event.datetime.toISOString().slice(0, 10) === nowDate &&
          event.datetime.getUTCHours() === nowHour) {
        due.push(event);
      }
    }
  }

  due.push(...getWeeklyEventsForHour(now));
  return due;
}

function getActiveSchedule(now = new Date()) {
  const cycles = getActiveCycles(now);
  for (const cycle of cycles) {
    let currentIdx = -1;
    for (let i = 0; i < cycle.events.length; i++) {
      if (cycle.events[i].datetime <= now) currentIdx = i;
      else break;
    }
    cycle.currentIdx = currentIdx;
  }

  const weeklyNext = getNextWeeklyEvent(now);
  const weekly = {
    label: "Atlas Edit Weekly Cycle",
    events: WEEKLY_EVENTS.map((e) => ({ ...e, cycleLabel: "Weekly" })),
    next: weeklyNext,
  };

  return { cycles, weekly, now };
}

function getNextEvent(now = new Date()) {
  const cycles = getActiveCycles(now);

  let best = null;
  for (const cycle of cycles) {
    for (const event of cycle.events) {
      if (event.datetime > now) {
        const msUntil = event.datetime - now;
        if (!best || msUntil < best.msUntil) {
          best = { event, msUntil };
        }
        break;
      }
    }
  }

  const weeklyNext = getNextWeeklyEvent(now);
  if (weeklyNext && (!best || weeklyNext.msUntil < best.msUntil)) {
    best = weeklyNext;
  }

  if (!best) {
    for (const spell of SPELL_CALENDAR) {
      if (!spell.crafter) continue;
      const pubDate = new Date(`${spell.publishDate}T00:00:00Z`);
      const w0Monday = getW0Monday(pubDate);
      if (w0Monday > now) {
        const events = expandCycle(spell);
        if (events.length > 0) {
          best = { event: events[0], msUntil: events[0].datetime - now };
        }
        break;
      }
    }
  }

  return best;
}

function formatDuration(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
}

module.exports = {
  getEventsForHour,
  getActiveSchedule,
  getNextEvent,
  formatDuration,
  expandCycle,
  buildCycleLabel,
  getActiveCycles,
  DAY_NAMES,
};
