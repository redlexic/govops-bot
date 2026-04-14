function formatTime12h(time24) {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")}${suffix} UTC`;
}

function buildSlackMessage(event, spellDate) {
  const dayNames = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const heading = `Spell ${spellDate} — W${event.week} ${dayNames[event.day]} ${String(event.notifyHour).padStart(2, "0")}:00 UTC`;

  const link = event.link
    ? `<${event.link.url}|${event.link.text}>`
    : "N/A";

  const body = [
    `• *${event.label}*`,
    `     ◦ Owner: ${event.responsible}`,
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
