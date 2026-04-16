// Atlas Edit Weekly Cycle — recurring weekly events.
// day: ISO weekday (1=Mon … 5=Fri)
// time: UTC HH:MM
//
// Full cycle: Tue heads-up → Wed feedback request → Thu submission →
//             Fri proposal published → Mon polls posted → Thu polls close

const WEEKLY_EVENTS = [
  { day: 2, time: "17:00", label: "Early heads-up: flag expected edits for this week's cycle", actor: "OF" },
  { day: 3, time: "20:00", label: "Feedback request deadline (OF → AA, if review needed before submission)", actor: "OF" },
  { day: 4, time: "20:00", label: "Edit submission deadline (complete, reviewed, SH signed-off)", actor: "OF" },
  { day: 5, time: "08:00", label: "AA publishes Atlas Edit Weekly Cycle Proposal to Forum", actor: "AA" },
  { day: 1, time: "16:00", label: "CF publishes Governance Polls (Atlas Edit Weekly Cycle)", actor: "CF" },
  { day: 4, time: "16:00", label: "Governance Polls close (3-day vote concludes)", actor: "Delegates" },
];

module.exports = { WEEKLY_EVENTS };
