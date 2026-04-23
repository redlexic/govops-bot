// Public API for the schedule module. Callers should import from here,
// not from the sibling files directly.

const { getEventsForHour, getActiveSchedule, getNextEvent } = require("./query");

module.exports = {
  getEventsForHour,
  getActiveSchedule,
  getNextEvent,
};
