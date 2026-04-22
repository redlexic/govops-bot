const { MS_PER_DAY, MS_PER_HOUR, MS_PER_MIN, MONTH_ABBR } = require("./time");
const { SPELL_CALENDAR } = require("./schedule/spell-calendar");
const { CYCLE_EVENTS } = require("./schedule/spell-review-cycle");

// publishDate is W3 Thu. W0 Mon = publishDate − 24 days; W3 Fri = publishDate + 1 day − 1 ms.
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

function resolveActor(tmplActor, crafter) {
  if (tmplActor === "Crafter") return crafter;
  if (tmplActor === "Reviewer") return crafter === "Dewiz" ? "Sidestream" : "Dewiz";
  return tmplActor;
}

function makeCycleEvent(tmpl, { spell, w0Monday, cycleLabel }) {
  const [hours, mins] = tmpl.time.split(":").map(Number);
  const dayOffset = tmpl.week * 7 + (tmpl.day - 1);
  const datetime = new Date(
    w0Monday.getTime() + dayOffset * MS_PER_DAY + hours * MS_PER_HOUR + mins * MS_PER_MIN
  );
  return {
    datetime,
    label: tmpl.label,
    actor: resolveActor(tmpl.actor, spell.crafter),
    cycleLabel,
    week: tmpl.week,
    day: tmpl.day,
    time: tmpl.time,
    link: tmpl.link || null,
    publishDate: spell.publishDate,
    crafter: spell.crafter,
  };
}

function expandCycle(spell) {
  const pubDate = new Date(`${spell.publishDate}T00:00:00Z`);
  const w0Monday = getW0Monday(pubDate);
  const cycleLabel = buildCycleLabel(spell);
  return CYCLE_EVENTS
    .map((tmpl) => makeCycleEvent(tmpl, { spell, w0Monday, cycleLabel }))
    .sort((a, b) => a.datetime - b.datetime);
}

function getActiveCycles(now) {
  const active = [];
  for (const spell of SPELL_CALENDAR) {
    if (!spell.crafter) continue;
    const pubDate = new Date(`${spell.publishDate}T00:00:00Z`);
    const w0Monday = getW0Monday(pubDate);
    const w3Friday = getW3Friday(pubDate);
    if (now < w0Monday || now > w3Friday) continue;

    const weeksSinceW0 = Math.floor((now - w0Monday) / (7 * MS_PER_DAY));
    active.push({
      spell,
      cycleLabel: buildCycleLabel(spell),
      crafter: spell.crafter,
      publishDate: spell.publishDate,
      currentWeek: Math.min(weeksSinceW0, 3),
      events: expandCycle(spell),
    });
  }
  active.sort((a, b) => a.publishDate.localeCompare(b.publishDate));
  return active;
}

module.exports = {
  getW0Monday,
  getW3Friday,
  buildCycleLabel,
  makeCycleEvent,
  expandCycle,
  getActiveCycles,
};
