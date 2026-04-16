// Canonical 4-week spell cycle (W0–W3).
// day: ISO weekday (1=Mon … 5=Fri)
// time: UTC HH:MM — notification fires at this hour
// Events without a specific time use 09:00 (start of business).

const EXEC_SHEET_URL = "https://docs.google.com/spreadsheets/d/1w_z5WpqxzwreCcaveB2Ye1PP5B8QAHDglzyxKHG3CHw/edit?gid=320756284#gid=320756284";

const CYCLE_EVENTS = [
  // ── Week 0 — Propose & Prioritize ──────────────────────────────
  { week: 0, day: 3, time: "16:00", label: "Spell Coordinator delivers to CC Tracker", actor: "Spell Coordinator" },
  { week: 0, day: 5, time: "23:00", label: "Rune prioritizes", actor: "Rune" },

  // ── Week 1 — Finalize Scope ────────────────────────────────────
  { week: 1, day: 2, time: "17:00", label: "Communicate deviations from Stars' proposed actions", actor: "CF → EPL → Star" },
  { week: 1, day: 3, time: "09:00", label: "Forum posts due (Stars)", actor: "Star" },
  { week: 1, day: 3, time: "09:00", label: "Deployment parameters due", actor: "Star" },
  { week: 1, day: 4, time: "16:00", label: "CC Risk Advisor review", actor: "CC Risk Advisor" },
  { week: 1, day: 4, time: "18:00", label: "Atlas Axis drafts Atlas Edit", actor: "AA" },
  { week: 1, day: 4, time: "18:00", label: "OF prepares Spark Artifact Edit", actor: "OF (Endgame Edge)" },
  { week: 1, day: 5, time: "08:00", label: "Atlas Axis submits Atlas Edit", actor: "AA" },
  { week: 1, day: 5, time: "08:00", label: "OF submits Spark Artifact Edit", actor: "OF (Endgame Edge)" },

  // ── Week 2 — Governance ────────────────────────────────────────
  { week: 2, day: 1, time: "09:00", label: "Star delivers signed-off PR", actor: "Star" },
  { week: 2, day: 1, time: "09:00", label: "Star Spell review begins (Mon–Thu)", actor: "Reviewers" },
  { week: 2, day: 1, time: "16:00", label: "Governance Poll launched", actor: "CF" },
  { week: 2, day: 2, time: "14:30", label: "CF/EPL review", actor: "CF, EPL" },
  { week: 2, day: 2, time: "16:00", label: "Sky Core GovOps meeting", actor: "Sky Core" },
  { week: 2, day: 4, time: "23:00", label: "Atlas / Artifacts updated (if poll passed)", actor: "AA / OF" },
  { week: 2, day: 5, time: "16:00", label: "Star delivers Spell code", actor: "Star" },
  { week: 2, day: 5, time: "16:00", label: "Star Spell info added to exec sheet", actor: "Star / EPL", link: { url: EXEC_SHEET_URL, text: "exec sheet" } },
  { week: 2, day: 5, time: "16:00", label: "Spell address confirmed in exec sheet", actor: "EPL", link: { url: EXEC_SHEET_URL, text: "exec sheet" } },

  // ── Week 3 — Crafting & Publication ────────────────────────────
  { week: 3, day: 1, time: "09:00", label: "Star Spell Retro", actor: "EPL, Star Team, Reviewers" },
  { week: 3, day: 1, time: "09:00", label: "Core Spell crafting begins (Mon–Thu)", actor: "Crafter" },
  { week: 3, day: 2, time: "16:00", label: "Merge the Executive Document", actor: "Governance" },
  { week: 3, day: 4, time: "16:00", label: "Publish Executive Vote", actor: "CF" },
];

module.exports = { CYCLE_EVENTS };
