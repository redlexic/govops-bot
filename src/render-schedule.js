const { DAY_NAMES, formatDuration } = require("./spell-engine");
const { formatActor } = require("./actor-emoji");

function formatTimeUTC(now) {
  return `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;
}

function formatPointerLine(now, nextDatetime) {
  const msUntil = nextDatetime - now;
  return `👉 *now ${formatTimeUTC(now)} · next in ${formatDuration(msUntil)}*`;
}

function formatRow(event) {
  const slot = `W${event.week} ${DAY_NAMES[event.day]} ${event.time}`;
  const linkSuffix = event.link ? `  <${event.link.url}|${event.link.text}>` : "";
  return `   \`${slot}\` ${formatActor(event.actor)}  ${event.label}${linkSuffix}`;
}

function renderCycleSection(cycle, now) {
  const header = `*${cycle.cycleLabel} (${cycle.crafter}) — currently W${cycle.currentWeek} · ${formatTimeUTC(now)}*`;
  const nextIdx = cycle.nextIdx;

  const weekGroups = [0, 1, 2, 3].map((w) => {
    const lines = [];
    for (let i = 0; i < cycle.events.length; i++) {
      const e = cycle.events[i];
      if (e.week !== w) continue;
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
  const dateStr = now.toISOString().slice(0, 10);
  const heading = `*Spell Review — Active Cycles*\n${dateStr} ${formatTimeUTC(now)}`;

  const blocks = [
    { type: "section", text: { type: "mrkdwn", text: heading } },
  ];

  for (const cycle of cycles) {
    blocks.push({ type: "divider" });
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: renderCycleSection(cycle, now) },
    });
  }

  if (scheduleData.weekly) {
    const { weekly } = scheduleData;
    const nextStr = weekly.next
      ? `Next: ${DAY_NAMES[weekly.next.event.day]} ${weekly.next.event.time} UTC (in ${formatDuration(weekly.next.msUntil)})`
      : "";
    const nextDay = weekly.next ? weekly.next.event.day : null;
    const nextTime = weekly.next ? weekly.next.event.time : null;

    const weeklyLines = [];
    for (const e of weekly.events) {
      if (e.day === nextDay && e.time === nextTime) {
        weeklyLines.push(formatPointerLine(now, weekly.next.event.datetime));
      }
      weeklyLines.push(`   \`${DAY_NAMES[e.day]} ${e.time}\` ${formatActor(e.actor)}  ${e.label}`);
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
