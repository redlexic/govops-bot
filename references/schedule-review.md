# Spell Cycle Schedule — Review Document

This is a **review document** to align on the schedule before encoding it into
`src/schedule.js`. It combines `spell-cycle.md` (the per-cycle event timeline)
and `SpellPlan.png` (the 2026 yearly calendar with team rotation and weeks off).

Nothing in this file is consumed by the bot yet. Once you've corrected the
errors and answered the open questions at the bottom, we'll translate it into
the app's event format.

---

## 1. Model overview

- **Each spell has a 4-week production cycle**, numbered **W0 → W3**.
- **W3 Thursday 16:00 UTC** is the spell go-live — "Publish Executive Vote". The
  spell executes the following Monday.
- **A new spell publishes every 2 weeks**, so **two cycles are always in flight
  simultaneously**. When cycle A is in W2, cycle B (publishing 2 weeks later)
  is in W0. When A is in W3, B is in W1.
- **Two crafting teams alternate**: **Dewiz** and **Sidestream**. Each team
  owns the full cycle (W0–W3) for the spells they craft. While one team is
  crafting (W3), the other is usually in W1 of their next spell.
- **Some weeks are off** (offsites, year-end). During an off week, no spell
  publishes that slot at all — the gap is skipped, not rescheduled.

---

## 2. Roles / actors

These are the actors I identified from `spell-cycle.md`. I've flagged ones I'm
unsure about as **[?]** — please correct or expand.

| Role | Responsibilities | Notes |
|---|---|---|
| **Star Spell Team** | Proposes spell, publishes forum post, delivers PR, delivers spell payload, attends retro | "Star" appears to be a role/team name, not a person |
| **Spell Coordinator** | Delivers to CC Tracker (W0 Wed 16:00) | Is this a sub-role of Star? |
| **EPL** | Reviews & prioritizes, pre-reviews forum post, validates address, joins CF/EPL review | Executive Process Liaison |
| **Rune** | Prioritizes spells (W0 Fri 23:59) | Individual person or role? |
| **CC Risk Advisor** | Reviews spell (W1 Thu 16:00) | SPARK spells use SRC internally instead |
| **AA** | Drafts + submits Atlas Edit (W1 Thu 18:00 / Fri 08:00) | Atlas Axis |
| **OF** | SPARK variant only — prepares + submits Spark Artifact Edit | Operational Facilitator - note that there are 2: Redline and Endgame Edge.  Endgame Edge handles Spark, Grove Keel and Redline handles the rest of the stars.  This creates a divergence as well, depending on which kind of items are in the spell and which stars/facilitator teams are responsible |
| **CF** | Creates governance poll, does CF/EPL review, publishes Executive Vote (W3 Thu 16:00) | Core Facilitator |
| **Sky Core / Core Spell Team** | Crafting, review, handover (W3 Mon–Thu). **In practice this is Dewiz or Sidestream — see §3.** | |
| **Dewiz** | Crafter team, owns half the cycles (see §4) | |
| **Sidestream** | Crafter team, owns the other half of cycles (see §4) | |
| **Delegates** | Vote on governance poll (W2 Mon–Thu) | |
| **StarGuard** | Optional spell executor (mentioned in first half of `spell-cycle.md`) | Unclear if this generates a notification |

---

## 3. Per-cycle event timeline (canonical W0–W3)

This is one cycle's worth of events. It repeats for every spell, with times
relative to **that spell's own W3 Thu 16:00 publication**.

Events marked **[SPARK-only]** only apply when the spell is a Spark spell.
Events without that tag apply to standard Stars spells.

I've used `—` for events where the source didn't specify a time and marked them
as **[day-level]** — we'll need to decide whether to fire a morning-of
notification or skip them from the bot.

### Week 0 — Propose & Prioritize

| Day | Time (UTC?) | Event | Actor |
|---|---|---|---|
| Wed | 16:00 | Spell Coordinator delivers to CC Tracker | Spell Coordinator |
| Fri | 23:59 | Rune prioritizes | Rune |

### Week 1 — Finalize Scope

| Day | Time | Event | Actor |
|---|---|---|---|
| Tue | 17:00 | Communicate decision if deviations from Stars' proposed actions | CF → EPL → Star |
| Wed | — [day-level] | Forum posts due (standard Stars using Sky Governance) | Star |
| Wed | — [day-level] | Deployment parameters | **[?] Who?** |
| Thu | 16:00 | CC Risk Advisor review (SPARK uses SRC internally) | CC Risk Advisor / SRC |
| Thu | 18:00 | AA drafts Atlas Edit | AA |
| Thu | 18:00 | OF prepares Spark Artifact Edit **[SPARK-only]** | OF |
| Fri | 08:00 | AA submits Atlas Edit | AA |
| Fri | 08:00 | OF submits Spark Artifact Edit **[SPARK-only]** | OF |
| Fri | — [day-level] | Forum posts due (Spark — later deadline) **[SPARK-only]** | Star (Spark) |

### Week 2 — Governance

| Day | Time | Event | Actor |
|---|---|---|---|
| Mon | — [day-level, "morning"] | Star delivers signed-off PR | Star |
| Mon | 16:00 | Governance Poll launched (SPARK: Snapshot vote via OF) | CF / OF |
| Mon–Thu | — | Star Spell is reviewed (ongoing) | Reviewers |
| Mon–Thu | — | Delegates vote on poll (concludes Thu) | Delegates |
| Tue | 14:30 | CF/EPL review | CF, EPL |
| Tue | 16:00 | Sky Core GovOps meeting | Sky Core |
| Thu | 23:59 | Atlas / Artifacts updated (if poll passed) | AA / OF |
| Fri | 16:00 | Star delivers Spell code | Star |
| Fri | 16:00 | Star Spell info added to exec sheet | Star / EPL |
| Fri | 16:00 | Spell address confirmed in exec sheet | EPL |

### Week 3 — Crafting & Publication

| Day | Time | Event | Actor |
|---|---|---|---|
| Mon | — [day-level] | Star Spell Retro | EPL, Star Team, Reviewers |
| Mon–Thu | — | Core Spell crafting, review, handover (ongoing) | Crafter team (Dewiz or Sidestream) |
| Tue | 16:00 | Merge the Executive Document | Governance |
| Thu | 16:00 | **Publish Executive Vote** | CF |

**Event count:** 20 distinct events (12 time-pinned, 8 day-level/ongoing), of
which 4 are SPARK-only variants of the standard events.

**Open question on time zone:** `spell-cycle.md` says "Concludes Thursday 4PM
(Question: What time zone?)". The existing `src/schedule.js` treats everything
as UTC. **Are all these times UTC, or local?** Assuming UTC below.

---

## 4. 2026 spell calendar (from SpellPlan.png)

Each row is a W3 Thursday publication. Crafter team is the one doing the W3
handover/publish that week. All dates are 2026 and Thursdays.

| Publish Date (W3 Thu 16:00 UTC) | Crafter | Notes |
|---|---|---|
| Jan 15 | Dewiz | |
| Jan 29 | Sidestream | |
| Feb 12 | Dewiz | |
| Feb 26 | Sidestream | |
| Mar 12 | Dewiz | |
| Mar 26 | Sidestream | |
| Apr 9 | Dewiz | |
| Apr 23 | Sidestream | |
| May 7 | Dewiz | |
| ~~May 21~~ | — | **Skipped** — Dewiz's offsite |
| Jun 4 | Sidestream | |
| Jun 18 | Dewiz | |
| Jul 2 | Sidestream | |
| Jul 16 | Dewiz | |
| ~~Jul 30~~ | — | **Skipped** — Sidestream offsite |
| Aug 13 | Sidestream | |
| Aug 27 | Dewiz | |
| Sep 10 | Sidestream | |
| Sep 24 | Dewiz | |
| Oct 8 | Sidestream | |
| Oct 22 | Dewiz | |
| Nov 5 | Sidestream | |
| Nov 19 | Dewiz | |
| Dec 3 | Sidestream | |
| Dec 17 | Dewiz | |
| ~~Dec 31~~ | — | **Skipped** — end of year |

**Scheduled spells in 2026:** 23. **Skipped slots:** 3.

**Note on skip behavior:** after a skip, the alternation "resumes" — the team
that was going to publish the skipped slot loses that turn, and the next
scheduled slot goes to whoever the table says. I'm reading this as a simple
lookup table, not a derivable pattern, because the skipped slots don't cleanly
interrupt the D/S alternation. **The calendar in the bot will be a hardcoded
list of `(publish_date, team)` pairs, not a formula.**

---

## 5. Overlapping cycles — worked example

To make sure we agree on how the overlap works, here's the week of **Apr 6–10,
2026** (a Monday-through-Friday).

Two cycles are active that week:

- **Dewiz-Apr9** (publishes Thu Apr 9) → **W3** of its cycle
- **Sidestream-Apr23** (publishes Thu Apr 23) → **W1** of its cycle

Events that fire in the Slack channel that week, chronologically:

| Date | Time UTC | Cycle | Week | Event |
|---|---|---|---|---|
| Mon Apr 6 | day-level | Dewiz-Apr9 | W3 | Star Spell Retro |
| Mon Apr 6 | — | Dewiz-Apr9 | W3 | Core Spell crafting begins (Dewiz) |
| Tue Apr 7 | 16:00 | Dewiz-Apr9 | W3 | Merge the Executive Document |
| Tue Apr 7 | 17:00 | Sidestream-Apr23 | W1 | Communicate deviations |
| Wed Apr 8 | day-level | Sidestream-Apr23 | W1 | Forum posts due (standard) |
| Wed Apr 8 | day-level | Sidestream-Apr23 | W1 | Deployment parameters |
| Thu Apr 9 | 16:00 | Sidestream-Apr23 | W1 | CC Risk Advisor review |
| Thu Apr 9 | 16:00 | **Dewiz-Apr9** | **W3** | **Publish Executive Vote** ← spell go-live |
| Thu Apr 9 | 18:00 | Sidestream-Apr23 | W1 | AA drafts Atlas Edit |
| Fri Apr 10 | 08:00 | Sidestream-Apr23 | W1 | AA submits Atlas Edit |

That's **~10 notifications in a single week from two overlapping cycles**.

**Key design implication:** every notification needs to be labeled with
(a) which cycle it belongs to (`Dewiz-Apr9` or `Sidestream-Apr23`) and
(b) which week of that cycle it is (`W1` / `W3`), or users won't know which
spell the reminder is about. The current bot's "W1 Tue 15:00 UTC" format
wouldn't distinguish the two cycles.

**Proposed format for notifications:**

```
🔔 Sidestream-Apr23 · W1 Thu 16:00 UTC
Communicate decision if deviations from Stars' proposed actions
Owner: CF → EPL → Star
```

And `/redline-schedule` would show two columns or two sections, one per active
cycle, with the "you are here" marker on whichever row matches now across both
cycles.

---

## 6. Open questions

Before encoding this into `src/schedule.js`, I need answers on:

### Role / acronym clarifications
1. **EPL** — what does it stand for?
2. **AA** — what does it stand for? (Atlas Author?)
3. **OF** — what does it stand for?
4. **CF** — what does it stand for? (Core Facilitator?)
5. **Spell Coordinator** — is this a sub-role of "Star", or a separate person?
6. **Rune** — is this a person's name or a role?
7. **StarGuard** — does this generate notifications, or just a passing mention?

### Schedule details
8. **Time zone** — are all times UTC, or some other zone (US East? CET?)?
9. **Day-level events** (Wed forum posts, Mon retro, etc.) — do you want a
   notification for these, and if so at what time (09:00 UTC? EoD?)?
10. **"Mon-Thu" ongoing events** (Star Spell review, Delegates vote, Core Spell
    crafting) — do these generate daily notifications, a single
    start-of-period notification, or none?
11. **Deployment parameters (W1 Wed)** — who is the actor? Star? EPL?
12. **SPARK-variant events** — should the bot post BOTH the standard and SPARK
    notifications regardless of which spell is active, or do we need to tag
    each cycle as standard-vs-Spark to route correctly?

### Team assignment
13. **Crafter role for non-crafting events** — when the table says "Sky Core"
    or "Core Spell team", is that *always* the crafter team for that cycle
    (Dewiz or Sidestream), or a separate general team?
14. **Cross-team events** — e.g. during Dewiz's W3, Sidestream is in W1 — do
    any W1 events involve Dewiz (review duties for Sidestream's upcoming
    spell), or are W0/W1 events owned entirely by the "other" team?

### Calendar
15. **Off weeks effect on cycles** — when May 21 is skipped (Dewiz's offsite),
    does that mean: (a) no spell publishes that slot and the affected team's
    next cycle still proceeds normally, or (b) the whole 4-week cycle leading
    up to that date is cancelled and the team starts fresh for the next slot?
    The distinction matters for what the bot posts during the W0/W1/W2 weeks
    leading up to a skipped slot.
16. **Earliest spell to model** — do you want the bot tracking from Jan 15
    onward (retrospective), or only from "now forward"? The memory cost of
    past events is negligible; the question is whether `/redline-schedule`
    should let users look backward.

### Presentation
17. **Slash command output** — with two cycles overlapping, do you want
    `/redline-schedule` to show: (a) only the current 4 weeks (both active
    cycles, side-by-side), (b) the next 8 weeks (4 cycles), or
    (c) the entire 2026 calendar?
18. **"You are here" marker** — should it mark the latest event that has
    fired, or the *next upcoming* event, or both?

---

## 7. Proposed data shape (draft — subject to change based on answers)

Once the questions above are resolved, I'd encode this as two data structures:

```js
// src/spell-calendar.js  — the 2026 yearly table
const SPELL_CALENDAR = [
  { publishDate: "2026-01-15", crafter: "Dewiz" },
  { publishDate: "2026-01-29", crafter: "Sidestream" },
  // ...
  { publishDate: "2026-05-21", crafter: null, skipReason: "Dewiz offsite" },
  // ...
];

// src/cycle-template.js  — the W0-W3 events, relative to W3 Thursday
const CYCLE_EVENTS = [
  { week: 0, day: "Wed", time: "16:00", label: "Deliver to CC Tracker", actor: "Spell Coordinator" },
  { week: 0, day: "Fri", time: "23:59", label: "Rune prioritizes", actor: "Rune" },
  { week: 1, day: "Tue", time: "17:00", label: "Communicate deviations", actor: "CF → EPL → Star" },
  // ...
  { week: 3, day: "Thu", time: "16:00", label: "Publish Executive Vote", actor: "CF" },
];
```

At runtime the cron joins these: for each upcoming `publishDate` in
`SPELL_CALENDAR`, it computes W0/W1/W2/W3 dates by subtracting weeks, and for
each `CYCLE_EVENTS` entry produces a concrete `(datetime, cycle_label, event)`
tuple. The bot filters those tuples to "events in this UTC hour" for cron
firing, and "all events in the current and next cycle" for `/redline-schedule`.

This keeps the calendar and the template cleanly separated — adding next
year's spells is appending rows to `SPELL_CALENDAR`; fixing a time or adding
a new type of event is editing `CYCLE_EVENTS`.

---

## 8. Next steps

1. **You**: walk through §2 (roles), §3 (timeline), §4 (calendar), §5 (overlap
   example) and flag anything wrong.
2. **You**: answer the open questions in §6.
3. **Me**: update this document, then translate it into the data structures
   in §7, wire them into the cron and `/redline-schedule` renderer.
4. **Me**: also fix the currently-broken Railway listener deploy
   (`RAILWAY_CONFIG_FILE` issue from earlier) so the new `/redline-schedule`
   output is actually visible.

Open question - 
* when does the 4 day delegate poll close exactly?
* Regular star spell performs parameter changes on existing modules - deploys a new instance of a module that is on production
by the same star or other star without bringing novel code into the deployment
* SPell coordinator vs EPL
* 2 Forum posts on Wednesday? Star post & also AA's Tech Scope & Risk Assessments?
* When it said "Monday Morning Deliver PR" I put 10:00
* is Thursday "Atlas/Artifacts Updated or Incorporate in Atlas" by AA/OF or CC Risk Advisor?
* Confirm Actor for: Friday 16:00 - Add Spell info to Executive Sheet - CF
Friday 16:00 - Confirm Spell Address in Exec Sheet - Star
* W2 Tue 14:30 CF/EPL review Missing — in W1 Tue 14:30 instead. Did it move from │ W2 to W1?

Manual composition of all schedule events:

Week 0 (Propose & Prioritize)
Monday Midnight - Submit Spell Form - AA
Tuesday Midnight - Discuss content & blockers - Joint
Wednesday 16:00 - Deliver to CC Tracker - EPL
Friday EOD - Prioritize Core & Star Content - Rune

Week 1 (Finalize Scope)
Tuesday 14:30 - Review items in CC Tracker - Core Spell Team
Tuessday 17:00 (EOD) - Communicate deviations (CF to EPL)
Wed 16:00: Poston Forum (Tech Scope, Risk Assessments) - AA
Wed EOD - Complete deployment parameters table - EPL
Thursday 16:00: CC Risk Advisor reviews Financial Risk - CC Risk Advisor
Thursday 18:00 - AA Drafts Atlas Edit Proposal- AA
Friday 08:00 - AA Submits Atlas Edit Proposal - AA

Week 2 (Governance)
Monday 10:00: Deliver signed-off PR for review - Star
Monday 0:00 - Begin Star Spell Review - Core Spell Team
Monday 0:00 - Aligned Delegate Vote Begins - Delegates
Monday 16:00 - Publish Governance Poll - CF
Tuesday 16:00: Sky Core GovOps Meeting - Core Spell Team
Tuesday 0:00 - Star Spell Review Continues (day 2 of 5) - Core Spell Team
Tuesday 0:00 - Aligned Delegate Vote Continues (day 2 of 4) - Delegates
Wednesday 0:00 - Star Spell Review Continues (day 3 of 5) - Core Spell Team
Wednesday 0:00 - Aligned Delegate Vote Continues (day 3 of 4) - Delegates
Thursday 0:00 - Star Spell Review Continues (day 4 of 5) - Core Spell Team
Thursday 0:00 - Aligned Delegate Vote Concludes (day 4 of 4) - Delegates 
Thursday 23:59: Incorporate in Atlas (if passed) - CC Risk Advisor
Friday 0:00 - Star Spell Review Concludes (day 5 of 5) - Core Spell Team
Friday 16:00: Deliver Star Spell Code - Star
Friday 16:00 - Add Spell info to Executive Sheet - CF
Friday 16:00 - Confirm Spell Address in Exec Sheet - Star

Week 3 (Crafting & Publication)
Monday 0:00 - Core Spell Crafting & Review Begins (day 1 of 4) - (Core Spell Team)
Monday 0:00 - Star Spell Retrospective - EPL, Star, Reviewers
Tuesday 0:00 - Core Spell Crafting & Review Continues (day 2 of 4)  (Core Spell Team)
Tuesday 16:00 - Merge Exectuve Document
Tuesday 16:00 -- Publish Executive Vote
Wednesday 0:00 - Core Spell Crafting & Review Continues (day 3 of 4)  (Core Spell Team)
Thursday 0:00 - Core Spell Crafting & Review Concludes (day 4 of 4)  (Core Spell Team)