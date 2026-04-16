const { DAY_NAMES } = require("./spell-engine");
const { formatActor } = require("./actor-emoji");

function formatRow(event, isCurrent) {
  const prefix = isCurrent ? "▶ " : "   ";
  const slot = `W${event.week} ${DAY_NAMES[event.day]} ${event.time}`;
  const label = isCurrent ? `*${event.label}*` : event.label;
  const linkSuffix = event.link ? `  <${event.link.url}|${event.link.text}>` : "";
  return `${prefix}\`${slot}\`  ${label}  ${formatActor(event.actor)}${linkSuffix}`;
}

function renderCycleSection(cycle) {
  const header = `*${cycle.cycleLabel} (${cycle.crafter}) — currently W${cycle.currentWeek}*`;
  const rows = cycle.events.map((event, idx) =>
    formatRow(event, idx === cycle.currentIdx)
  );

  const weekGroups = [0, 1, 2, 3].map((w) => {
    const weekRows = rows.filter((_, idx) => cycle.events[idx].week === w);
    if (weekRows.length === 0) return null;
    return `_Week ${w}_\n${weekRows.join("\n")}`;
  }).filter(Boolean);

  return `${header}\n${weekGroups.join("\n\n")}`;
}

function renderSchedule(scheduleData) {
  const { cycles, now } = scheduleData;
  const timeStr = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;
  const dateStr = now.toISOString().slice(0, 10);
  const heading = `*Spell Review — Active Cycles*\n${dateStr} ${timeStr} UTC`;

  const blocks = [
    { type: "section", text: { type: "mrkdwn", text: heading } },
  ];

  for (const cycle of cycles) {
    blocks.push({ type: "divider" });
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: renderCycleSection(cycle) },
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
