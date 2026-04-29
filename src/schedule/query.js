const { todayUTC } = require("../time");
const { SPELL_CALENDAR } = require("./spell-calendar");
const { WEEKLY_EVENTS } = require("./atlas-weekly-cycle");
const { getW0Monday, expandCycle, getActiveCycles } = require("./cycle");

const ONE_HOUR_MS = 60 * 60 * 1000;

// Cron is scheduled `55 * * * *` so notifications arrive 5 minutes before
// each top-of-hour deadline. cronTick returns the most recent HH:55 ≤ now —
// the logical fire time of the cron we're inside, independent of Railway's
// delivery drift.
function cronTick(now) {
  const t = new Date(now);
  if (t.getUTCMinutes() < 55) {
    t.setUTCHours(t.getUTCHours() - 1);
  }
  t.setUTCMinutes(55, 0, 0);
  return t;
}

// Returns "24h" | "1h" | "now" | null based on event time relative to cronTick.
function notificationTier(eventDatetime, now) {
  const delta = eventDatetime - cronTick(now);
  if (delta >= 0 && delta < ONE_HOUR_MS) return "now";
  if (delta >= ONE_HOUR_MS && delta < 2 * ONE_HOUR_MS) return "1h";
  if (delta >= 24 * ONE_HOUR_MS && delta < 25 * ONE_HOUR_MS) return "24h";
  return null;
}

// Find the first event whose datetime is strictly after `now`, in a
// chronologically-sorted event list. Returns { event, idx, msUntil } or null.
function findNextAfter(events, now) {
  for (let i = 0; i < events.length; i++) {
    if (events[i].datetime > now) {
      return { event: events[i], idx: i, msUntil: events[i].datetime - now };
    }
  }
  return null;
}

function makeWeeklyEvent(tmpl, datetime) {
  return {
    datetime,
    label: tmpl.label,
    actor: tmpl.actor,
    cycleLabel: "Weekly",
    week: null,
    day: tmpl.day,
    time: tmpl.time,
    link: tmpl.link || null,
    publishDate: null,
    crafter: null,
  };
}

// Project a weekly template onto its next concrete datetime strictly after `now`.
function nextOccurrenceAfter(tmpl, now) {
  const nowDay = now.getUTCDay() || 7;
  const nowHour = now.getUTCHours();
  const nowMin = now.getUTCMinutes();
  const [eH, eM] = tmpl.time.split(":").map(Number);

  let daysAhead = tmpl.day - nowDay;
  if (daysAhead < 0 || (daysAhead === 0 && (eH < nowHour || (eH === nowHour && eM <= nowMin)))) {
    daysAhead += 7;
  }
  const datetime = new Date(now.getTime());
  datetime.setUTCDate(datetime.getUTCDate() + daysAhead);
  datetime.setUTCHours(eH, eM, 0, 0);
  return datetime;
}

function getWeeklyEventsForHour(now) {
  const tick = cronTick(now);
  const lookbackPoint = new Date(tick.getTime() - 25 * ONE_HOUR_MS);
  const due = [];
  for (const tmpl of WEEKLY_EVENTS) {
    const datetime = nextOccurrenceAfter(tmpl, lookbackPoint);
    const tier = notificationTier(datetime, now);
    if (tier) due.push({ ...makeWeeklyEvent(tmpl, datetime), notificationTier: tier });
  }
  return due;
}

function getNextWeeklyEvent(now) {
  let best = null;
  for (let i = 0; i < WEEKLY_EVENTS.length; i++) {
    const tmpl = WEEKLY_EVENTS[i];
    const datetime = nextOccurrenceAfter(tmpl, now);
    const msUntil = datetime - now;
    if (!best || msUntil < best.msUntil) {
      best = { event: makeWeeklyEvent(tmpl, datetime), idx: i, msUntil };
    }
  }
  return best;
}

function getEventsForHour(now = new Date()) {
  const cycles = getActiveCycles(now);
  const due = [];
  for (const cycle of cycles) {
    for (const event of cycle.events) {
      const tier = notificationTier(event.datetime, now);
      if (tier) due.push({ ...event, notificationTier: tier });
    }
  }
  due.push(...getWeeklyEventsForHour(now));
  return due;
}

function getActiveSchedule(now = new Date()) {
  const cycles = getActiveCycles(now);
  for (const cycle of cycles) {
    const next = findNextAfter(cycle.events, now);
    cycle.nextIdx = next ? next.idx : -1;
  }

  const weekly = {
    label: "Atlas Edit Weekly Cycle",
    events: WEEKLY_EVENTS.map((e) => ({ ...e, cycleLabel: "Weekly" })),
    next: getNextWeeklyEvent(now),
  };

  return { cycles, weekly, now };
}

function getNextEvent(now = new Date()) {
  const cycles = getActiveCycles(now);

  let best = null;
  for (const cycle of cycles) {
    const next = findNextAfter(cycle.events, now);
    if (next && (!best || next.msUntil < best.msUntil)) best = next;
  }

  const weeklyNext = getNextWeeklyEvent(now);
  if (weeklyNext && (!best || weeklyNext.msUntil < best.msUntil)) best = weeklyNext;

  if (best) return best;

  // Nothing active — look ahead to the next not-yet-started cycle.
  for (const spell of SPELL_CALENDAR) {
    if (!spell.crafter) continue;
    const pubDate = new Date(`${spell.publishDate}T00:00:00Z`);
    if (getW0Monday(pubDate) > now) {
      const events = expandCycle(spell);
      return events.length ? { event: events[0], idx: 0, msUntil: events[0].datetime - now } : null;
    }
  }
  return null;
}

module.exports = {
  findNextAfter,
  getEventsForHour,
  getActiveSchedule,
  getNextEvent,
  getNextWeeklyEvent,
};
