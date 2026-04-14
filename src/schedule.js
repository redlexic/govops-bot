// Spell Review — full 2-week cycle schedule
//
// Each entry: { responsible, label, time, week, day, notifyHour, link }
//   week: 1 or 2
//   day:  1 = Monday … 7 = Sunday  (ISO weekday)
//   time: "HH:MM" UTC — actual deadline (end of range where applicable)
//   notifyHour: hour (0–23) at which the bot sends the alert (minutes truncated)
//   link: URL or null

const EXEC_SHEET_URL = "https://docs.google.com/spreadsheets/d/1w_z5WpqxzwreCcaveB2Ye1PP5B8QAHDglzyxKHG3CHw/edit?gid=320756284#gid=320756284";

function entry(responsible, label, time, week, day, link = null) {
  const notifyHour = parseInt(time.split(":")[0], 10);
  return { responsible, label, time, week, day, notifyHour, link };
}

const events = [
  // ── Week 1 ──────────────────────────────────────────────────────────
  entry("Prime Agent", "Prime Agent Spell PR sharing",                       "09:00", 1, 1),
  entry("Governance",  "Exec sheet creation",                               "15:00", 1, 2, { url: EXEC_SHEET_URL, text: "sheet" }),
  entry("All",         "Agreement on spell content and roles",              "15:30", 1, 2),
  entry("Crafter",     "Spell cleanup for external contributions",          "16:00", 1, 3),
  entry("External",    "External code PR contribution",                     "23:59", 1, 5),
  entry("Governance",  "Exec sheet finalisation",                           "23:59", 1, 5, { url: EXEC_SHEET_URL, text: "sheet" }),
  entry("Prime Agent", "Prime Agent Spell handover to GovFac",             "17:00", 1, 5),

  // ── Week 2 ──────────────────────────────────────────────────────────
  entry("Crafter",     "Spell crafting (without Exec Hash)",                "16:00", 2, 1),
  entry("BA Labs",     "Final rate changes announcement",                   "12:00", 2, 2),
  entry("Reviewers",   "Spell code review (vs Exec Sheet)",                 "16:00", 2, 2),
  entry("Governance",  "Exec Doc merge",                                    "16:00", 2, 2),
  entry("Crafter",     "Code review resolution, Exec Hash addition",           "12:00", 2, 3),
  entry("Reviewers",   "Spell code review (vs Exec Doc)",                   "16:00", 2, 3),
  entry("Crafter",     "Spell deployment, Testnet creation",                "12:00", 2, 4),
  entry("Spell team",  "Spell development sync call",                       "14:30", 2, 4),
  entry("Reviewers",   "Spell deployment approval",                         "16:00", 2, 4),
  entry("Crafter",     "Spell address publication",                         "16:30", 2, 4),
  entry("Reviewers",   "Spell address confirmation",                        "16:30", 2, 4),
  entry("Governance",  "Spell address reception by Governance",              "16:30", 2, 4),
  entry("Reviewers",   "Spell PR approval",                                 "16:30", 2, 4),
  entry("Crafter",     "Spell PR merge",                                    "16:30", 2, 4),
  entry("Crafter",     "Spell retro kick-off",                              "16:30", 2, 4),
];

module.exports = events;
