require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { WebClient } = require("@slack/web-api");
const { logBroadcast } = require("./broadcast-log");

const ROOT = path.resolve(__dirname, "..");
const NOTES_PATH = path.join(ROOT, "PATCH_NOTES.md");
const TIMESTAMP_PATH = path.join(ROOT, ".patch-notes-last-sent");
const MIN_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

// 5-row emoji-art font. "1" → 🟥, "0" → ⬛. Inter-letter gap is one ⬛ column.
const FONT = {
  P: ["1110", "1001", "1110", "1000", "1000"],
  A: ["0110", "1001", "1111", "1001", "1001"],
  T: ["111",  "010",  "010",  "010",  "010"],
  C: ["0111", "1000", "1000", "1000", "0111"],
  H: ["1001", "1001", "1111", "1001", "1001"],
  N: ["1001", "1101", "1011", "1011", "1001"],
  O: ["0110", "1001", "1001", "1001", "0110"],
  E: ["1111", "1000", "1110", "1000", "1111"],
  S: ["0111", "1000", "0110", "0001", "1110"],
};

function renderBanner(text) {
  const rows = ["", "", "", "", ""];
  const upper = text.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    const glyph = FONT[upper[i]];
    if (!glyph) continue;
    for (let r = 0; r < 5; r++) {
      rows[r] += glyph[r].replace(/1/g, "🟥").replace(/0/g, "⬛");
      if (i < upper.length - 1) rows[r] += "⬛";
    }
  }
  return rows.join("\n");
}

function checkGuard(force) {
  if (!fs.existsSync(TIMESTAMP_PATH)) return;
  const last = new Date(fs.readFileSync(TIMESTAMP_PATH, "utf8").trim());
  const elapsed = Date.now() - last.getTime();
  if (elapsed >= MIN_INTERVAL_MS) return;
  const days = (elapsed / (24 * 60 * 60 * 1000)).toFixed(1);
  if (!force) {
    console.error(`Refusing: last patch-notes broadcast was ${days}d ago (min 7d).`);
    console.error(`Run with --force to override.`);
    process.exit(1);
  }
  console.log(`⚠️  --force: overriding 7-day guard (last sent ${days}d ago)`);
}

function readNotes() {
  if (!fs.existsSync(NOTES_PATH)) {
    console.error(`Missing ${NOTES_PATH}. Create it with one bullet per change.`);
    process.exit(1);
  }
  const body = fs.readFileSync(NOTES_PATH, "utf8").trim();
  if (!body) {
    console.error(`${NOTES_PATH} is empty.`);
    process.exit(1);
  }
  return body;
}

async function main() {
  const force = process.argv.includes("--force");
  const dryRun = process.argv.includes("--dry-run");

  checkGuard(force);
  const notes = readNotes();

  const banner = renderBanner("PATCH") + "\n\n" + renderBanner("NOTES");
  const mrkdwn = `${banner}\n\n${notes}`;

  if (dryRun) {
    console.log(mrkdwn);
    return;
  }

  const token = process.env.REDLINE_BOT_TOKEN;
  const channel = process.env.SLACK_CHANNEL_ID;
  if (!token || !channel) {
    console.error("Missing REDLINE_BOT_TOKEN or SLACK_CHANNEL_ID");
    process.exit(1);
  }

  logBroadcast({ destinations: [`Slack: ${channel}`], mrkdwn });
  const slack = new WebClient(token);
  await slack.chat.postMessage({
    channel,
    text: "Patch Notes",
    blocks: [{ type: "section", text: { type: "mrkdwn", text: mrkdwn } }],
  });

  fs.writeFileSync(TIMESTAMP_PATH, new Date().toISOString() + "\n");
  console.log("Patch notes sent.");
}

main().catch((e) => {
  console.error("Failed:", e.data || e.message || e);
  process.exit(1);
});
