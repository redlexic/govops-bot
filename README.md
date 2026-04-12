# govops-bot

Slack bot that sends recurring notifications for the **Spell Review** process — the biweekly cycle through which Sky Governance prepares, reviews, deploys, and publishes Executive Vote spells.

## How it works

The bot runs a long-lived Node.js process with cron jobs. Every Monday through Friday, each job checks whether we are in **Week 1** or **Week 2** of the current cycle (relative to a configurable anchor date) and, if the timing matches, posts a Slack message listing the events due at that moment.

Events that share the same time slot are grouped into a single message. The bot currently tracks **19 events** across **11 notification slots**.

### Notification schedule

| Week | Day | Time (UTC) | Events |
|------|-----|------------|--------|
| 1 | Tue | 15:00 | Exec Sheet created, Agreement on content and roles |
| 1 | Wed | 16:00 | Spell cleaned up for external contributions |
| 1 | Fri | 23:59 | External code contributed via PR, Exec Sheet finalised |
| 2 | Mon | 16:00 | Spell crafted |
| 2 | Tue | 12:00 | BA Labs rate changes announced |
| 2 | Tue | 16:00 | Spell code reviewed (vs Exec Sheet), Exec Doc merged |
| 2 | Wed | 12:00 | Code review addressed, Exec Hash added |
| 2 | Wed | 16:00 | Spell code reviewed (vs Exec Doc) |
| 2 | Thu | 12:00 | Spell deployed, Testnet created |
| 2 | Thu | 16:00 | Deployment approved, address published/confirmed/received, PR approved/merged |
| 2 | Thu | 16:30 | Spell retro started |

The full event list — including 32 additional events identified from the diagram and Atlas that do not yet have notification times — is documented in [`CROSS_REFERENCE.md`](CROSS_REFERENCE.md).

## Project structure

```
govops-bot/
├── src/
│   ├── index.js        # entry point — groups events into cron jobs
│   ├── schedule.js     # all 19 events with week, day, time, responsible party
│   ├── cycle.js        # determines current cycle week (1 or 2)
│   └── message.js      # builds Slack Block Kit messages
├── references/         # source material used to build the schedule
│   ├── coordination-table.md
│   ├── spell_cycle.jpg
│   └── atlas-A1.10-weekly-governance-cycle.md
├── CROSS_REFERENCE.md  # 51 events cross-referenced across all 3 sources
├── railway.toml        # Railway deployment config
├── .env.example
└── package.json
```

## Setup

### 1. Create a Slack app

Create a Slack app with the `chat:write` bot scope and install it to your workspace. Copy the **Bot User OAuth Token** (`xoxb-...`).

### 2. Configure environment variables

| Variable | Description |
|----------|-------------|
| `SLACK_BOT_TOKEN` | Slack bot token (`xoxb-...`) |
| `SLACK_CHANNEL_ID` | Target channel ID (e.g. `C0123456789`) |
| `CYCLE_START_DATE` | The Monday of any known **Week 1** (e.g. `2026-04-13`) |

### 3. Run locally

```sh
npm install
SLACK_BOT_TOKEN=xoxb-... SLACK_CHANNEL_ID=C... CYCLE_START_DATE=2026-04-13 npm start
```

### 4. Deploy to Railway

Set the three environment variables in your Railway project. Push to the connected repo — Railway builds via Nixpacks and starts with `npm start`. The process restarts automatically on failure (`restartPolicyType = "always"`).

## References

The notification schedule was built by cross-referencing three sources:

| Source | File |
|--------|------|
| Coordination Table | [`references/coordination-table.md`](references/coordination-table.md) |
| Spell Cycle Diagram | [`references/spell_cycle.jpg`](references/spell_cycle.jpg) |
| Atlas A.1.10 | [`references/atlas-A1.10-weekly-governance-cycle.md`](references/atlas-A1.10-weekly-governance-cycle.md) |

See [`CROSS_REFERENCE.md`](CROSS_REFERENCE.md) for the full comparison (51 events, 20 with notification times, 31 pending).
