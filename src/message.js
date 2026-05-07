const { DAY_NAMES } = require("./time");
const { formatActor } = require("./actor-emoji");

function formatTime12h(time24) {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")}${suffix} UTC`;
}

function buildSlackMessage(event) {
  const title = `⏰ In 1 hour — ${event.label}`;

  const cycleLine = event.week != null
    ? `Cycle: ${event.cycleLabel} · W${event.week} · ${DAY_NAMES[event.day]} ${formatTime12h(event.time)}`
    : `Cycle: Weekly Governance Poll Cycle · ${DAY_NAMES[event.day]} ${formatTime12h(event.time)}`;

  const link = event.link
    ? `<${event.link.url}|${event.link.text}>`
    : "N/A";

  const body = [
    cycleLine,
    `Owner: ${formatActor(event.actor)}`,
    `Link: ${link}`,
  ].join("\n");

  return {
    text: title,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${title}*\n${body}`,
        },
      },
    ],
  };
}

module.exports = { buildSlackMessage };
