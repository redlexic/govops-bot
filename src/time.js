const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_MIN = 60 * 1000;

const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatTimeUTC(now) {
  return `${pad2(now.getUTCHours())}:${pad2(now.getUTCMinutes())} UTC`;
}

function todayUTC(now) {
  return now.toISOString().slice(0, 10);
}

function formatDuration(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
}

module.exports = {
  MS_PER_DAY,
  MS_PER_HOUR,
  MS_PER_MIN,
  MONTH_ABBR,
  DAY_NAMES,
  pad2,
  formatTimeUTC,
  todayUTC,
  formatDuration,
};
