// Canonical 4-week spell cycle (W0–W3).
// day: ISO weekday (1=Mon … 5=Fri)
// time: UTC HH:MM — notification fires at this hour
// Deadlines marked "Midnight" or "EOD" in the source use 09:00 or 17:00 respectively.
// Daily tracking events (day X of N) notify at 09:00.
// Actors marked [?] need confirmation — see open questions in schedule-review.md §6.

const EXEC_SHEET_URL = "https://docs.google.com/spreadsheets/d/1w_z5WpqxzwreCcaveB2Ye1PP5B8QAHDglzyxKHG3CHw/edit?gid=320756284#gid=320756284";

const CYCLE_EVENTS = [
  // ── Week 0 — Propose & Prioritize ──────────────────────────────
  { week: 0, day: 1, time: "09:00", label: "Submit Spell Form", actor: "AA" },
  { week: 0, day: 2, time: "09:00", label: "Discuss content & blockers", actor: "Joint" },
  { week: 0, day: 3, time: "16:00", label: "Deliver to CC Tracker", actor: "EPL" },
  { week: 0, day: 5, time: "17:00", label: "Prioritize Core & Star Content", actor: "Rune" },

  // ── Week 1 — Finalize Scope ────────────────────────────────────
  { week: 1, day: 2, time: "14:30", label: "Review items in CC Tracker", actor: "CF" },
  { week: 1, day: 2, time: "17:00", label: "Communicate deviations (CF → EPL)", actor: "CF" },
  { week: 1, day: 3, time: "16:00", label: "Post on Forum (Tech Scope, Risk Assessments)", actor: "AA" },
  { week: 1, day: 3, time: "17:00", label: "Complete deployment parameters table", actor: "EPL" },
  { week: 1, day: 4, time: "16:00", label: "CC Risk Advisor reviews Financial Risk", actor: "CC Risk Advisor" },
  { week: 1, day: 4, time: "18:00", label: "AA drafts Atlas Edit Proposal", actor: "AA" },
  { week: 1, day: 5, time: "08:00", label: "AA submits Atlas Edit Proposal", actor: "AA" },

  // ── Week 2 — Governance ────────────────────────────────────────
  // "Reviewer" resolves at runtime to the OTHER team (e.g. Dewiz reviews Sidestream's spell)
  { week: 2, day: 1, time: "09:00", label: "Star Spell Review begins (day 1 of 5)", actor: "Reviewer" },
  { week: 2, day: 1, time: "16:00", label: "Aligned Delegate Vote begins (day 1 of 4)", actor: "Delegates" },
  { week: 2, day: 1, time: "08:00", label: "Deliver signed-off PR for review", actor: "Star" },
  { week: 2, day: 1, time: "16:00", label: "Publish Governance Poll", actor: "CF" },
  { week: 2, day: 2, time: "09:00", label: "Star Spell Review continues (day 2 of 5)", actor: "Reviewer" },
  { week: 2, day: 2, time: "09:00", label: "Aligned Delegate Vote continues (day 2 of 4)", actor: "Delegates" },
  { week: 2, day: 2, time: "16:00", label: "Sky Core GovOps Meeting", actor: "Sky Core" },
  { week: 2, day: 3, time: "09:00", label: "Star Spell Review continues (day 3 of 5)", actor: "Reviewer" },
  { week: 2, day: 3, time: "09:00", label: "Aligned Delegate Vote continues (day 3 of 4)", actor: "Delegates" },
  { week: 2, day: 4, time: "09:00", label: "Star Spell Review continues (day 4 of 5)", actor: "Reviewer" },
  { week: 2, day: 4, time: "16:00", label: "Aligned Delegate Vote concludes (day 4 of 4)", actor: "Delegates" },
  { week: 2, day: 4, time: "23:59", label: "Incorporate in Atlas (if passed)", actor: "CF" },
  { week: 2, day: 5, time: "09:00", label: "Star Spell Review concludes (day 5 of 5)", actor: "Reviewer" },
  { week: 2, day: 5, time: "16:00", label: "Deliver Star Spell Code", actor: "Star" },
  { week: 2, day: 5, time: "16:00", label: "Add Spell info to Executive Sheet", actor: "CF", link: { url: EXEC_SHEET_URL, text: "exec sheet" } },
  { week: 2, day: 5, time: "16:00", label: "Confirm Spell Address in Exec Sheet", actor: "EPL", link: { url: EXEC_SHEET_URL, text: "exec sheet" } },

  // ── Week 3 — Crafting & Publication ────────────────────────────
  { week: 3, day: 1, time: "09:00", label: "Core Spell Crafting & Review begins (day 1 of 4)", actor: "Crafter" },
  { week: 3, day: 1, time: "09:00", label: "Star Spell Retrospective", actor: "EPL, Star, Reviewers" },
  { week: 3, day: 2, time: "09:00", label: "Core Spell Crafting & Review continues (day 2 of 4)", actor: "Crafter" },
  { week: 3, day: 2, time: "16:00", label: "Merge Executive Document", actor: "Governance" },
  { week: 3, day: 3, time: "09:00", label: "Core Spell Crafting & Review continues (day 3 of 4)", actor: "Crafter" },
  { week: 3, day: 4, time: "09:00", label: "Core Spell Crafting & Review concludes (day 4 of 4)", actor: "Crafter" },
  { week: 3, day: 4, time: "16:00", label: "Publish Executive Vote", actor: "CF" },
];

module.exports = { CYCLE_EVENTS };
