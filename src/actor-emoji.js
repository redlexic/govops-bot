const ACTOR_EMOJI = {
  "CF": "🔵",
  "Core Facilitator": "🔵",
  "EPL": "🟣",
  "Star": "⭐",
  "AA": "🔶",
  "Atlas Axis": "🔶",
  "OF": "🟢",
  "OF (Endgame Edge)": "🟢",
  "Rune": "⚡",
  "CC Risk Advisor": "🛡️",
  "SRC": "🛡️",
  "Reviewers": "🔍",
  "Delegates": "🗳️",
  "Sky Core": "🏛️",
  "Governance": "⚖️",
  "Joint": "🤝",
  "Core Spell Team": "🟢",
  "Crafter": "🟢",
  "Dewiz": "🟢",
  "Sidestream": "🟢",
};

function formatActor(actor) {
  const primary = actor.split(",")[0].split("→")[0].split("/")[0].trim();
  const emoji = ACTOR_EMOJI[primary] || "⬜";
  return `${emoji} \`[${actor}]\``;
}

module.exports = { formatActor, ACTOR_EMOJI };
