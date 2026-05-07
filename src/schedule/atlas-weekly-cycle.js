// Atlas Edit Weekly Cycle — recurring weekly events, listed in calendar order (Mon → Fri).
// day: ISO weekday (1=Mon … 5=Fri)
// time: UTC HH:MM
//
// A full logical cycle spans ~1.5 weeks:
//   Tue heads-up → Wed feedback → Thu 20:00 submission → Fri forum post →
//   next Mon 16:00 polls posted → next Thu 16:00 polls close.
// So within any given week, Mon 16:00 and Thu 16:00 concern the PREVIOUS
// week's proposal, while Tue–Fri concern the current week's cycle.

const WEEKLY_EVENTS = [
  { day: 1, time: "16:00", label: "CF publishes Governance Polls", actor: "CF" },
  { day: 2, time: "17:00", label: "Heads up to AA on edits", actor: "OF" },
  { day: 3, time: "20:00", label: "Feedback request deadline (OF → AA)", actor: "OF" },
  { day: 4, time: "16:00", label: "Governance Polls close", actor: "Delegates" },
  { day: 4, time: "20:00", label: "Edit submission deadline", actor: "OF" },
  { day: 5, time: "08:00", label: "AA publishes Proposal to Forum", actor: "AA" },
];

module.exports = { WEEKLY_EVENTS };
