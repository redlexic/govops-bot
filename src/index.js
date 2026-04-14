require("dotenv").config();
const { WebClient } = require("@slack/web-api");
const cron = require("node-cron");
const events = require("./schedule");
const { getCurrentCycleWeek, getSpellDate } = require("./cycle");
const { buildSlackMessage } = require("./message");

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const channel = process.env.SLACK_CHANNEL_ID;

// ISO weekday: 1 = Mon … 7 = Sun
function isoWeekday(date) {
  return date.getUTCDay() || 7;
}

async function tick() {
  const now = new Date();
  const hour = now.getUTCHours();
  const day = isoWeekday(now);
  const cycleWeek = getCurrentCycleWeek(now);

  const due = events.filter(
    (e) => e.week === cycleWeek && e.day === day && e.notifyHour === hour
  );

  if (due.length === 0) return;

  const spellDate = getSpellDate(now);
  const msg = buildSlackMessage(due, cycleWeek, spellDate);
  try {
    await slack.chat.postMessage({ channel, text: msg.text, blocks: msg.blocks });
    console.log(`[${now.toISOString()}] Sent ${due.length} event(s) for W${cycleWeek} day=${day} hour=${hour}`);
  } catch (err) {
    console.error(`[${now.toISOString()}] Failed:`, err.message);
  }
}

// Run every hour on the hour, UTC
cron.schedule("0 * * * *", tick, { timezone: "UTC" });

console.log(`govops-bot started — checking ${events.length} events every hour`);
