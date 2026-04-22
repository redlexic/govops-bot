require("dotenv").config();
const { App } = require("@slack/bolt");
const { DAY_NAMES, formatDuration } = require("./time");
const { getActiveSchedule, getNextEvent } = require("./schedule-query");
const { renderSchedule } = require("./render-schedule");
const { formatActor } = require("./actor-emoji");

const app = new App({
  token: process.env.REDLINE_BOT_TOKEN,
  appToken: process.env.REDLINE_BOT_APP_TOKEN,
  socketMode: true,
});

app.command("/redline-schedule", async ({ ack, respond }) => {
  await ack();
  const now = new Date();
  const scheduleData = getActiveSchedule(now);
  const msg = renderSchedule(scheduleData);
  await respond({ response_type: "in_channel", text: msg.text, blocks: msg.blocks });
});

app.command("/redline-next", async ({ ack, respond }) => {
  await ack();
  const now = new Date();
  const result = getNextEvent(now);

  if (!result) {
    await respond({ response_type: "in_channel", text: "No upcoming events found." });
    return;
  }

  const { event, msUntil } = result;
  const slot = `W${event.week} ${DAY_NAMES[event.day]} ${event.time} UTC`;
  const dateStr = event.datetime.toISOString().replace("T", " ").slice(0, 16);
  const linkSuffix = event.link ? `  <${event.link.url}|${event.link.text}>` : "";
  const text =
    `*Next: ${event.cycleLabel} · ${event.label}*\n` +
    `• Owner: ${formatActor(event.actor)}\n` +
    `• When: ${slot} (${dateStr} UTC)\n` +
    `• In: *${formatDuration(msUntil)}*${linkSuffix}`;
  await respond({
    response_type: "in_channel",
    text: `Next event: ${event.cycleLabel} — ${event.label} in ${formatDuration(msUntil)}`,
    blocks: [{ type: "section", text: { type: "mrkdwn", text } }],
  });
});

app.command("/redline-help", async ({ ack, respond }) => {
  await ack();
  const text =
    "*redline-bot commands*\n" +
    "• `/redline-schedule` — show both active 4-week spell cycles with current position\n" +
    "• `/redline-next` — show the next scheduled event and countdown\n" +
    "• `/redline-help` — show this message";
  await respond({
    response_type: "ephemeral",
    text: "redline-bot commands",
    blocks: [{ type: "section", text: { type: "mrkdwn", text } }],
  });
});

(async () => {
  await app.start();
  console.log("redline-bot listener running (Socket Mode)");
})();
