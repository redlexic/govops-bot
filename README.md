The bot has two runtime modes, deploy this repo twice with different config.  

One will do Cron jobs on a schedule and post updates to the slack channel. 

The other will listen for slash commands. 

- **Cron** (`src/index.js`, `npm start`) — a short-lived script triggered hourly by Railway's cron feature (`0 * * * *`). Each run checks whether we are in **Week 1** or **Week 2** of the current cycle, and if the current UTC hour matches any scheduled events, posts them to the configured Slack channel.
- **Listener** (`src/listener.js`, `npm run listener`) — a long-lived Bolt app in Socket Mode that responds to slash commands (`/redline-schedule`, `/redline-next`) with the current schedule and countdown to the next event.


**Cron** Runs 24h, 1 hr and at the event time (scheduled 5m before to account for delay).  


**Listener** prints out something like the below when you type /redline-schedule to the bot, (imagine it with colorful emojis). 
Shows all event deadlines, 
shows who is responsible for each, 
shows the date/time of NOW at the right spot in the schedule, 
tells how long until the next event.

Sample /redline-schedule output:

![schedule screenshot](/img/sched_shot.png)

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
