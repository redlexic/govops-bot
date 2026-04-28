const { DAY_NAMES, MONTH_ABBR, formatDuration, formatTimeUTC, todayUTC } = require("./time");
const { formatActor } = require("./actor-emoji");

function formatPointerLine(now, nextDatetime) {
  const msUntil = nextDatetime - now;
  return `👉 *now ${formatTimeUTC(now)} · next in ${formatDuration(msUntil)}*`;
}

function formatLongDate(date) {
  return `${MONTH_ABBR[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

function formatShortDate(date) {
  return `${MONTH_ABBR[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

function formatRow(event) {
  const date = formatShortDate(event.datetime);
  const slot = `${DAY_NAMES[event.day]} ${date}, ${event.time}`;
  const linkSuffix = event.link ? `  <${event.link.url}|${event.link.text}>` : "";
  const wrapupSuffix = event.isWrapup ? ` _(${event.cycleLabel} wrapup)_` : "";
  return `   \`${slot}\` ${formatActor(event.actor)}  ${event.label}${linkSuffix}${wrapupSuffix}`;
}

function mondayOfWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - (day - 1));
  return d;
}

function dateForWeeklyEvent(baseMonday, dayOfWeek) {
  const d = new Date(baseMonday);
  d.setUTCDate(d.getUTCDate() + (dayOfWeek - 1));
  return d;
}

function renderSkippedCycleSection(cycle, now) {
  const skippedSpellDate = formatLongDate(new Date(`${cycle.publishDate}T00:00:00Z`));
  const nextW0MondayDate = formatLongDate(new Date(`${cycle.nextW0MondayISO}T00:00:00Z`));
  const header =
    `*5 Week Executive Cycle (Cycle skipped due to ${cycle.skipReason})*\n` +
    `*There will be no executive spell on: ${skippedSpellDate}*\n` +
    `Next new cycle begins ${nextW0MondayDate}.`;

  const lines = [];
  for (let i = 0; i < cycle.events.length; i++) {
    const e = cycle.events[i];
    if (i === cycle.nextIdx) lines.push(formatPointerLine(now, e.datetime));
    lines.push(formatRow(e));
  }

  return `${header}\n\n${lines.join("\n")}`;
}

function renderCycleSection(cycle, now) {
  const reviewer = cycle.crafter === "Dewiz" ? "Sidestream" : "Dewiz";
  const spellDate = formatLongDate(new Date(`${cycle.publishDate}T00:00:00Z`));
  const todayDate = formatLongDate(now);
  const header =
    `*5 Week Executive Cycle (${cycle.crafter} coding, ${reviewer} reviewing)*\n` +
    `*Executive Spell Date: ${spellDate}. Today's Date: ${todayDate} ${formatTimeUTC(now)}*`;
  const nextIdx = cycle.nextIdx;

  const weekGroups = [0, 1, 2, 3].map((w) => {
    const lines = [];
    for (let i = 0; i < cycle.events.length; i++) {
      const e = cycle.events[i];
      const eventWeek = e.displayWeek ?? e.week;
      if (eventWeek !== w) continue;
      if (i === nextIdx) lines.push(formatPointerLine(now, e.datetime));
      lines.push(formatRow(e));
    }
    if (lines.length === 0) return null;
    return `_Week ${w}_\n${lines.join("\n")}`;
  }).filter(Boolean);

  return `${header}\n${weekGroups.join("\n\n")}`;
}

function renderSchedule(scheduleData) {
  const { cycles, now } = scheduleData;
  const heading = `*Spell Review — Active Cycles*\n${todayUTC(now)} ${formatTimeUTC(now)}`;

  const blocks = [
    { type: "section", text: { type: "mrkdwn", text: heading } },
  ];

  for (const cycle of cycles) {
    blocks.push({ type: "divider" });
    const text = cycle.skipped
      ? renderSkippedCycleSection(cycle, now)
      : renderCycleSection(cycle, now);
    blocks.push({ type: "section", text: { type: "mrkdwn", text } });
  }

  if (scheduleData.weekly) {
    const { weekly } = scheduleData;
    const nextStr = weekly.next
      ? `Next: ${DAY_NAMES[weekly.next.event.day]} ${weekly.next.event.time} UTC (in ${formatDuration(weekly.next.msUntil)})`
      : "";
    const nextIdx = weekly.next ? weekly.next.idx : -1;
    const baseMonday = mondayOfWeek(weekly.next ? weekly.next.event.datetime : now);

    const weeklyLines = [];
    for (let i = 0; i < weekly.events.length; i++) {
      if (i === nextIdx) weeklyLines.push(formatPointerLine(now, weekly.next.event.datetime));
      const e = weekly.events[i];
      const date = formatShortDate(dateForWeeklyEvent(baseMonday, e.day));
      weeklyLines.push(`   \`${DAY_NAMES[e.day]} ${date}, ${e.time}\` ${formatActor(e.actor)}  ${e.label}`);
    }
    blocks.push({ type: "divider" });
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Weekly — ${weekly.label}*\n${nextStr}\n${weeklyLines.join("\n")}` },
    });
  }

  if (cycles.length === 0) {
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: "_No active cycles right now._" },
    });
  }

  return {
    text: `Spell Review — ${cycles.length} active cycle(s)`,
    blocks,
  };
}

module.exports = { renderSchedule };
