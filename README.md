The bot has two runtime modes:

- **Cron** (`src/index.js`, `npm start`) — a short-lived script triggered hourly by Railway's cron feature (`0 * * * *`). Each run checks whether we are in **Week 1** or **Week 2** of the current cycle, and if the current UTC hour matches any scheduled events, posts them to the configured Slack channel.
- **Listener** (`src/listener.js`, `npm run listener`) — a long-lived Bolt app in Socket Mode that responds to slash commands (`/redline-schedule`, `/redline-next`) with the current schedule and countdown to the next event.


**Cron** Runs 24h, 1 hr and 5m before the event time.  


**Listener** prints out something like the below when you type /redline-schedule to the bot, (imagine it with colorful emojis). 
Shows all event deadlines, 
shows who is responsible for each, 
shows the date/time of NOW at the right spot in the schedule, 
tells how long until the next event.

Sample /redline-schedule output:
```
Spell Review — Active Cycles
2026-04-29 18:32 UTC5 Week Executive Cycle (Dewiz coding, Sidestream reviewing)
Executive Spell Date: May 7, 2026. Today's Date: Apr 29, 2026 18:32 UTCWeek 0
   Mon Apr 13, 09:00 :large_orange_diamond: [AA]  Submit Spell Form
   Mon Apr 13, 14:00 :large_blue_circle: [CF]  Execute Spell (Dewiz-Apr9 wrapup)
   Tue Apr 14, 09:00 :handshake: [Joint]  Discuss content & blockers
   Wed Apr 15, 16:00 :large_purple_circle: [EPL]  Deliver to CC Tracker
   Thu Apr 16, 23:59 :large_blue_circle: [CF]  Incorporate in Atlas (if passed) (Dewiz-Apr9 wrapup)
   Fri Apr 17, 17:00 :zap: [Rune]  Prioritize Core & Star ContentWeek 1
   Tue Apr 21, 14:30 :large_blue_circle: [CF]  Review items in CC Tracker
   Tue Apr 21, 17:00 :large_blue_circle: [CF]  Communicate deviations (CF → EPL)
   Wed Apr 22, 16:00 :large_orange_diamond: [AA]  Post on Forum (Tech Scope, Risk Assessments)
   Wed Apr 22, 17:00 :large_purple_circle: [EPL]  Complete deployment parameters table
   Thu Apr 23, 16:00 :shield: [CC Risk Advisor]  CC Risk Advisor reviews Financial Risk
   Thu Apr 23, 18:00 :large_orange_diamond: [AA]  AA drafts Atlas Edit Proposal
   Fri Apr 24, 08:00 :large_orange_diamond: [AA]  AA submits Atlas Edit ProposalWeek 2
   Mon Apr 27, 08:00 :star: [Star]  Deliver signed-off PR for review
   Mon Apr 27, 09:00 :large_yellow_circle: [Sidestream]  Star Spell Review begins (day 1 of 5)
   Mon Apr 27, 16:00 :ballot_box_with_ballot: [Delegates]  Aligned Delegate Vote begins (day 1 of 4)
   Mon Apr 27, 16:00 :large_blue_circle: [CF]  Publish Governance Poll
   Tue Apr 28, 09:00 :large_yellow_circle: [Sidestream]  Star Spell Review continues (day 2 of 5)
   Tue Apr 28, 09:00 :ballot_box_with_ballot: [Delegates]  Aligned Delegate Vote continues (day 2 of 4)
   Tue Apr 28, 16:00 :classical_building: [Sky Core]  Sky Core GovOps Meeting
   Wed Apr 29, 09:00 :large_yellow_circle: [Sidestream]  Star Spell Review continues (day 3 of 5)
   Wed Apr 29, 09:00 :ballot_box_with_ballot: [Delegates]  Aligned Delegate Vote continues (day 3 of 4)
:point_right: now 18:32 UTC · next in 14h 27m
   Thu Apr 30, 09:00 :large_yellow_circle: [Sidestream]  Star Spell Review continues (day 4 of 5)
   Thu Apr 30, 16:00 :ballot_box_with_ballot: [Delegates]  Aligned Delegate Vote concludes (day 4 of 4)
   Fri May 1, 09:00 :large_yellow_circle: [Sidestream]  Star Spell Review concludes (day 5 of 5)
   Fri May 1, 16:00 :star: [Star]  Deliver Star Spell Code
   Fri May 1, 16:00 :large_blue_circle: [CF]  Add Spell info to Executive Sheet  exec sheet
   Fri May 1, 16:00 :large_purple_circle: [EPL]  Confirm Spell Address in Exec Sheet  exec sheetWeek 3
   Mon May 4, 09:00 :large_green_circle: [Dewiz]  Core Spell Crafting & Review begins (day 1 of 4)
   Mon May 4, 09:00 :large_purple_circle: [EPL, Star, Reviewers]  Star Spell Retrospective
   Tue May 5, 09:00 :large_green_circle: [Dewiz]  Core Spell Crafting & Review continues (day 2 of 4)
   Tue May 5, 16:00 :scales: [Governance]  Merge Executive Document
   Wed May 6, 09:00 :large_green_circle: [Dewiz]  Core Spell Crafting & Review continues (day 3 of 4)
   Thu May 7, 09:00 :large_green_circle: [Dewiz]  Core Spell Crafting & Review concludes (day 4 of 4)
   Thu May 7, 16:00 :large_blue_circle: [CF]  Publish Executive Vote5 Week Executive Cycle (Cycle skipped due to Dewiz offsite)
There will be no executive spell on: May 21, 2026
Next new cycle begins May 11, 2026.

   Mon Apr 27, 14:00 :large_blue_circle: [CF]  Execute Spell (Sidestream-Apr23 wrapup)
:point_right: now 18:32 UTC · next in 1d 5h 26m
   Thu Apr 30, 23:59 :large_blue_circle: [CF]  Incorporate in Atlas (if passed) (Sidestream-Apr23 wrapup)
   Mon May 11, 00:00 :large_yellow_circle: [Sidestream]  New cycle beginsWeekly — Atlas Edit Weekly Cycle
Next: Wed 20:00 UTC (in 1h 27m)
   Mon Apr 27, 16:00 :large_blue_circle: [CF]  CF publishes Governance Polls (vote on previous week's Atlas Edit proposal opens)
   Tue Apr 28, 17:00 :crystal_ball: [OF]  Early heads-up: flag expected edits for this week's cycle
:point_right: now 18:32 UTC · next in 1h 27m
   Wed Apr 29, 20:00 :crystal_ball: [OF]  Feedback request deadline (OF → AA, if review needed before submission)
   Thu Apr 30, 16:00 :ballot_box_with_ballot: [Delegates]  Governance Polls close (vote on previous week's proposal concludes, 3-day vote)
   Thu Apr 30, 20:00 :crystal_ball: [OF]  Edit submission deadline (complete, reviewed, SH signed-off)
   Fri May 1, 08:00 :large_orange_diamond: [AA]  AA publishes Atlas Edit Weekly Cycle Proposal to Forumredline-bot  [11:53 AM]
Spell Review — Active Cycles
2026-04-29 18:53 UTC4 Week Executive Cycle (Dewiz coding, Sidestream reviewing)
Executive Spell Date: May 7, 2026. Today's Date: Apr 29, 2026 18:53 UTCWeek 0
   Mon Apr 13, 09:00 :large_orange_diamond: [AA]  Submit Spell Form
   Mon Apr 13, 14:00 :large_blue_circle: [CF]  Execute Spell (Dewiz-Apr9 wrapup)
   Tue Apr 14, 09:00 :handshake: [Joint]  Discuss content & blockers
   Wed Apr 15, 16:00 :large_purple_circle: [EPL]  Deliver to CC Tracker
   Thu Apr 16, 23:59 :large_blue_circle: [CF]  Incorporate in Atlas (if passed) (Dewiz-Apr9 wrapup)
   Fri Apr 17, 17:00 :zap: [Rune]  Prioritize Core & Star ContentWeek 1
   Tue Apr 21, 14:30 :large_blue_circle: [CF]  Review items in CC Tracker
   Tue Apr 21, 17:00 :large_blue_circle: [CF]  Communicate deviations (CF → EPL)
   Wed Apr 22, 16:00 :large_orange_diamond: [AA]  Post on Forum (Tech Scope, Risk Assessments)
   Wed Apr 22, 17:00 :large_purple_circle: [EPL]  Complete deployment parameters table
   Thu Apr 23, 16:00 :shield: [CC Risk Advisor]  CC Risk Advisor reviews Financial Risk
   Thu Apr 23, 18:00 :large_orange_diamond: [AA]  AA drafts Atlas Edit Proposal
   Fri Apr 24, 08:00 :large_orange_diamond: [AA]  AA submits Atlas Edit ProposalWeek 2
   Mon Apr 27, 08:00 :star: [Star]  Deliver signed-off PR for review
   Mon Apr 27, 09:00 :large_yellow_circle: [Sidestream]  Star Spell Review begins (day 1 of 5)
   Mon Apr 27, 16:00 :ballot_box_with_ballot: [Delegates]  Aligned Delegate Vote begins (day 1 of 4)
   Mon Apr 27, 16:00 :large_blue_circle: [CF]  Publish Governance Poll
   Tue Apr 28, 09:00 :large_yellow_circle: [Sidestream]  Star Spell Review continues (day 2 of 5)
   Tue Apr 28, 09:00 :ballot_box_with_ballot: [Delegates]  Aligned Delegate Vote continues (day 2 of 4)
   Tue Apr 28, 16:00 :classical_building: [Sky Core]  Sky Core GovOps Meeting
   Wed Apr 29, 09:00 :large_yellow_circle: [Sidestream]  Star Spell Review continues (day 3 of 5)
   Wed Apr 29, 09:00 :ballot_box_with_ballot: [Delegates]  Aligned Delegate Vote continues (day 3 of 4)
:point_right: now 18:53 UTC · next in 14h 6m
   Thu Apr 30, 09:00 :large_yellow_circle: [Sidestream]  Star Spell Review continues (day 4 of 5)
   Thu Apr 30, 16:00 :ballot_box_with_ballot: [Delegates]  Aligned Delegate Vote concludes (day 4 of 4)
   Fri May 1, 09:00 :large_yellow_circle: [Sidestream]  Star Spell Review concludes (day 5 of 5)
   Fri May 1, 16:00 :star: [Star]  Deliver Star Spell Code
   Fri May 1, 16:00 :large_blue_circle: [CF]  Add Spell info to Executive Sheet  exec sheet
   Fri May 1, 16:00 :large_purple_circle: [EPL]  Confirm Spell Address in Exec Sheet  exec sheetWeek 3
   Mon May 4, 09:00 :large_green_circle: [Dewiz]  Core Spell Crafting & Review begins (day 1 of 4)
   Mon May 4, 09:00 :large_purple_circle: [EPL, Star, Reviewers]  Star Spell Retrospective
   Tue May 5, 09:00 :large_green_circle: [Dewiz]  Core Spell Crafting & Review continues (day 2 of 4)
   Tue May 5, 16:00 :scales: [Governance]  Merge Executive Document
   Wed May 6, 09:00 :large_green_circle: [Dewiz]  Core Spell Crafting & Review continues (day 3 of 4)
   Thu May 7, 09:00 :large_green_circle: [Dewiz]  Core Spell Crafting & Review concludes (day 4 of 4)
   Thu May 7, 16:00 :large_blue_circle: [CF]  Publish Executive Vote4 Week Executive Cycle (Cycle skipped due to Dewiz offsite)
There will be no executive spell on: May 21, 2026
Next new cycle begins May 11, 2026.

   Mon Apr 27, 14:00 :large_blue_circle: [CF]  Execute Spell (Sidestream-Apr23 wrapup)
:point_right: now 18:53 UTC · next in 1d 5h 5m
   Thu Apr 30, 23:59 :large_blue_circle: [CF]  Incorporate in Atlas (if passed) (Sidestream-Apr23 wrapup)
   Mon May 11, 00:00 :large_yellow_circle: [Sidestream]  New cycle beginsWeekly — Atlas Edit Weekly Cycle
Next: Wed 20:00 UTC (in 1h 6m)
   Mon Apr 27, 16:00 :large_blue_circle: [CF]  CF publishes Governance Polls (vote on previous week's Atlas Edit proposal opens)
   Tue Apr 28, 17:00 :crystal_ball: [OF]  Early heads-up: flag expected edits for this week's cycle
:point_right: now 18:53 UTC · next in 1h 6m
   Wed Apr 29, 20:00 :crystal_ball: [OF]  Feedback request deadline (OF → AA, if review needed before submission)
   Thu Apr 30, 16:00 :ballot_box_with_ballot: [Delegates]  Governance Polls close (vote on previous week's proposal concludes, 3-day vote)
   Thu Apr 30, 20:00 :crystal_ball: [OF]  Edit submission deadline (complete, reviewed, SH signed-off)
   Fri May 1, 08:00 :large_orange_diamond: [AA]  AA publishes Atlas Edit Weekly Cycle Proposal to Forum
```

## Setup

### 1. Create the Slack app

Create a new Slack app **From a manifest** at https://api.slack.com/apps and paste the contents of [`slack-manifest.json`](slack-manifest.json). This configures the bot user, scopes (`chat:write`, `commands`), the `/redline-schedule` and `/redline-next` slash commands, and enables Socket Mode in one step.

After creating the app:

1. **Install App** → **Install to Workspace** → copy the **Bot User OAuth Token** (`xoxb-...`).
2. **Basic Information → App-Level Tokens** → **Generate Token and Scopes** with the `connections:write` scope → copy the resulting `xapp-...` token.
3. In Slack, invite the bot to your target channel: `/invite @redline-bot`.

### 2. Configure environment variables

| Variable | Description |
|----------|-------------|
| `REDLINE_BOT_TOKEN` | Bot User OAuth Token (`xoxb-...`), used by cron and listener |
| `REDLINE_BOT_APP_TOKEN` | App-Level Token (`xapp-...`), used by the Socket Mode listener only |
| `SLACK_CHANNEL_ID` | Target channel ID (e.g. `C0123456789`), used by cron only |

The 2-week cycle anchor is hardcoded in `src/cycle.js` as `CYCLE_START_DATE` — update it there if the cycle shifts.

### 3. Run locally

```sh
npm install
cp .env.example .env   # then fill in real values
npm run hello          # smoke test: posts "Hello from redline-bot" to SLACK_CHANNEL_ID
npm start              # cron run: posts events due at the current UTC hour (usually a no-op)
npm run listener       # Socket Mode listener: responds to /redline-schedule and /redline-next
```

### 4. Deploy to Railway

The repo runs as **two Railway services** sharing the same codebase, each driven by its own config file:

| Service | Config file | Start command | Cron schedule | Env vars |
|---------|-------------|---------------|---------------|----------|
| Cron (e.g. `redline-bot-cron`) | `railway.toml` (default) | `npm start` | `0 * * * *` | `REDLINE_BOT_TOKEN`, `SLACK_CHANNEL_ID` |
| Listener (e.g. `redline-bot-listener`) | `railway.listener.toml` | `npm run listener` | *(none — always on)* | `REDLINE_BOT_TOKEN`, `REDLINE_BOT_APP_TOKEN`, `RAILWAY_CONFIG_FILE=railway.listener.toml` |

The listener service picks up its config by setting the service variable `RAILWAY_CONFIG_FILE=railway.listener.toml`; without this variable, Railway would fall back to `railway.toml` and run the listener as a cron (wrong). The cron service has no `RAILWAY_CONFIG_FILE` set, so it uses the default `railway.toml`.

Both services auto-rebuild on every push to the connected branch. Rotating `REDLINE_BOT_TOKEN` means updating it in **both** services' variable tabs — there is no shared secret store.

## References

The notification schedule was built by cross-referencing three sources:

| Source | File |
|--------|------|
| Coordination Table | [`references/coordination-table.md`](references/coordination-table.md) |
| Spell Cycle Diagram | [`references/spell_cycle.jpg`](references/spell_cycle.jpg) |
| Atlas A.1.10 | [`references/atlas-A1.10-weekly-governance-cycle.md`](references/atlas-A1.10-weekly-governance-cycle.md) |

See [`CROSS_REFERENCE.md`](CROSS_REFERENCE.md) for the full comparison (51 events, 20 with notification times, 31 pending).
