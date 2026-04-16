const { DAY_NAMES } = require("./spell-engine");
const { formatActor } = require("./actor-emoji");

function formatTime12h(time24) {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")}${suffix} UTC`;
}

function buildSlackMessage(event) {
  const now = new Date();
  const nowTime = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")} UTC`;
  const slot = event.week != null
    ? `W${event.week} ${DAY_NAMES[event.day]} ${event.time} UTC`
    : `${DAY_NAMES[event.day]} ${event.time} UTC`;
  const heading = `🔔 ${event.cycleLabel} · ${slot} · ${nowTime}`;

  const link = event.link
    ? `<${event.link.url}|${event.link.text}>`
    : "N/A";

  const body = [
    `• *${event.label}*`,
    `     ◦ Owner: ${formatActor(event.actor)}`,
    `     ◦ Deadline: ${formatTime12h(event.time)}`,
    `     ◦ Link: ${link}`,
  ].join("\n");

  return {
    text: heading,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${heading}*\n\n${body}`,
        },
      },
    ],
  };
}

module.exports = { buildSlackMessage };
