function buildSlackMessage(events, cycleWeek, spellDate) {
  const { notifyHour, week, day } = events[0];
  const dayNames = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const heading = `Spell ${spellDate} — W${week} ${dayNames[day]} ${String(notifyHour).padStart(2, "0")}:00 UTC`;

  const lines = events.map(
    (e) => `• *${e.responsible}*: ${e.stage} _(deadline ${e.time} UTC)_ — Source: N/A`
  );

  return {
    text: heading,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${heading}*\n\n${lines.join("\n")}`,
        },
      },
    ],
  };
}

module.exports = { buildSlackMessage };
