const { DAY_NAMES } = require("./spell-engine");
const { formatActor } = require("./actor-emoji");

function formatRow(event, isCurrent) {
  const prefix = isCurrent ? "👉 " : "   ";
  const slot = `W${event.week} ${DAY_NAMES[event.day]} ${event.time}`;
  const label = isCurrent ? `*${event.label}*` : event.label;
  const linkSuffix = event.link ? `  <${event.link.url}|${event.link.text}>` : "";
  return `${prefix}\`${slot}\` ${formatActor(event.actor)}  ${label}${linkSuffix}`;
}

function renderCycleSection(cycle, now) {
  const timeStr = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;
  const header = `*${cycle.cycleLabel} (${cycle.crafter}) — currently W${cycle.currentWeek} · ${timeStr}*`;
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
      text: { type: "mrkdwn", text: renderCycleSection(cycle, now) },
    });
  }

  if (scheduleData.weekly) {
    const { weekly } = scheduleData;
    const { formatDuration } = require("./spell-engine");
    const nowDay = now.getUTCDay() || 7;
    const nowKey = nowDay * 100 + now.getUTCHours();

    let currentIdx = -1;
    for (let i = 0; i < weekly.events.length; i++) {
      const e = weekly.events[i];
      const eKey = e.day * 100 + parseInt(e.time, 10);
      if (eKey <= nowKey) currentIdx = i;
    }

    const nextStr = weekly.next
      ? `Next: ${DAY_NAMES[weekly.next.event.day]} ${weekly.next.event.time} UTC (in ${formatDuration(weekly.next.msUntil)})`
      : "";
    const weeklyRows = weekly.events.map((e, i) => {
      const prefix = i === currentIdx ? "👉 " : "   ";
      const label = i === currentIdx ? `*${e.label}*` : e.label;
      return `${prefix}\`${DAY_NAMES[e.day]} ${e.time}\` ${formatActor(e.actor)}  ${label}`;
    }).join("\n");
    blocks.push({ type: "divider" });
    blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*Weekly — ${weekly.label}*\n${nextStr}\n${weeklyRows}` },
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
