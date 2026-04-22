const { DAY_NAMES, formatTimeUTC } = require("./time");
const { formatActor } = require("./actor-emoji");

function formatTime12h(time24) {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")}${suffix} UTC`;
}

function buildSlackMessage(event) {
  const now = new Date();
  const nowTime = formatTimeUTC(now);

  const cycleName = event.week != null
    ? `🔔 ${event.cycleLabel} · W${event.week} ${DAY_NAMES[event.day]} ${event.time} UTC`
    : `🔔 Weekly Governance Poll Cycle · ${DAY_NAMES[event.day]} ${event.time} UTC`;

  const link = event.link
    ? `<${event.link.url}|${event.link.text}>`
    : "N/A";

  const body = [
    `Current Time: ${nowTime}`,
    ``,
    `• *${event.label}*`,
    `     ◦ Owner: ${formatActor(event.actor)}`,
    `     ◦ Deadline: ${formatTime12h(event.time)}`,
    `     ◦ Link: ${link}`,
  ].join("\n");

  return {
    text: cycleName,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${cycleName}*\n${body}`,
        },
      },
    ],
  };
}

module.exports = { buildSlackMessage };
