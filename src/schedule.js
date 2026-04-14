// Spell Review — full 2-week cycle schedule
//
// Each entry: { responsible, stage, time, week, day, notifyHour }
//   week: 1 or 2
//   day:  1 = Monday … 7 = Sunday  (ISO weekday)
//   time: "HH:MM" UTC — original deadline from the coordination table
//   notifyHour: hour (0–23) at which the bot sends the alert (minutes truncated)

function entry(responsible, stage, time, week, day) {
  const notifyHour = parseInt(time.split(":")[0], 10);
  return { responsible, stage, time, week, day, notifyHour };
}

const events = [
  // ── Week 1 ──────────────────────────────────────────────────────────
  entry("Governance", "Exec Sheet is created",                              "15:00", 1, 2),
  entry("All",        "Agreement is reached on the content and roles",      "15:00", 1, 2),
  entry("Crafter",    "Spell is cleaned up (for external contributions)",   "16:00", 1, 3),
  entry("External",   "External code is contributed via PR (if needed)",    "23:59", 1, 5),
  entry("Governance", "Exec Sheet is finalised and fully confirmed",        "23:59", 1, 5),

  // ── Week 2 ──────────────────────────────────────────────────────────
  entry("Crafter",    "Spell is crafted (without the Exec Hash)",           "16:00", 2, 1),
  entry("BA Labs",    "Announce final rate changes (if needed)",            "12:00", 2, 2),
  entry("Reviewers",  "Spell code is reviewed (against the Exec Sheet)",    "16:00", 2, 2),
  entry("Governance", "Exec Doc is merged",                                 "16:00", 2, 2),
  entry("Crafter",    "Spell code review is addressed, Exec Hash is added", "12:00", 2, 3),
  entry("Reviewers",  "Spell code is reviewed (against the Exec Doc)",      "16:00", 2, 3),
  entry("Crafter",    "Spell is deployed, Testnet is created",              "12:00", 2, 4),
  entry("Spell team", "Spell development team having a sync call",          "14:00", 2, 4),
  entry("Reviewers",  "Spell deployment is approved",                       "16:00", 2, 4),
  entry("Crafter",    "Spell address is published",                         "16:00", 2, 4),
  entry("Reviewers",  "Spell address is confirmed",                         "16:00", 2, 4),
  entry("Governance", "Spell address is received",                          "16:00", 2, 4),
  entry("Reviewers",  "Spell PR is approved",                               "16:00", 2, 4),
  entry("Crafter",    "Spell PR is merged",                                 "16:00", 2, 4),
  entry("Crafter",    "Spell retro is started",                             "16:30", 2, 4),
];

module.exports = events;
