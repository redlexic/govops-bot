require("dotenv").config();
const { WebClient } = require("@slack/web-api");
const events = require("./schedule");
const { getCurrentCycleWeek, getSpellDate } = require("./cycle");
const { buildSlackMessage } = require("./message");

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const channel = process.env.SLACK_CHANNEL_ID;

// ISO weekday: 1 = Mon … 7 = Sun
function isoWeekday(date) {
  return date.getUTCDay() || 7;
}

async function main() {
  const now = new Date();
  const hour = now.getUTCHours();
  const day = isoWeekday(now);
  const cycleWeek = getCurrentCycleWeek(now);

  const due = events.filter(
    (e) => e.week === cycleWeek && e.day === day && e.notifyHour === hour
  );

  if (due.length === 0) {
    console.log(`[${now.toISOString()}] No events due (W${cycleWeek} day=${day} hour=${hour})`);
    return;
  }

  const spellDate = getSpellDate(now);
  for (const event of due) {
    const msg = buildSlackMessage(event, spellDate);
    await slack.chat.postMessage({ channel, text: msg.text, blocks: msg.blocks });
  }
  console.log(`[${now.toISOString()}] Sent ${due.length} message(s) for W${cycleWeek} day=${day} hour=${hour}`);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
