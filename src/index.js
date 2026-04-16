require("dotenv").config();
const { WebClient } = require("@slack/web-api");
const { getEventsForHour } = require("./spell-engine");
const { buildSlackMessage } = require("./message");

const slack = new WebClient(process.env.REDLINE_BOT_TOKEN);
const channel = process.env.SLACK_CHANNEL_ID;

async function main() {
  const now = new Date();
  const due = getEventsForHour(now);

  if (due.length === 0) {
    console.log(`[${now.toISOString()}] No events due`);
    return;
  }

  for (const event of due) {
    const msg = buildSlackMessage(event);
    await slack.chat.postMessage({ channel, text: msg.text, blocks: msg.blocks });
  }
  console.log(`[${now.toISOString()}] Sent ${due.length} message(s)`);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
