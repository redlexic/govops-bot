const { DAY_NAMES } = require("./spell-engine");

function formatTime12h(time24) {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")}${suffix} UTC`;
}

function buildSlackMessage(event) {
  const heading = `🔔 ${event.cycleLabel} · W${event.week} ${DAY_NAMES[event.day]} ${event.time} UTC`;

  const link = event.link
    ? `<${event.link.url}|${event.link.text}>`
    : "N/A";

  const body = [
    `• *${event.label}*`,
    `     ◦ Owner: ${event.actor}`,
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
