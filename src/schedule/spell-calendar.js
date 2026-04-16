// 2026 spell publication calendar.
// Each entry is a W3 Thursday go-live date. Entries with crafter: null are skipped slots.
// This is the only file that changes year-to-year.

const SPELL_CALENDAR = [
  { publishDate: "2026-01-15", crafter: "Dewiz" },
  { publishDate: "2026-01-29", crafter: "Sidestream" },
  { publishDate: "2026-02-12", crafter: "Dewiz" },
  { publishDate: "2026-02-26", crafter: "Sidestream" },
  { publishDate: "2026-03-12", crafter: "Dewiz" },
  { publishDate: "2026-03-26", crafter: "Sidestream" },
  { publishDate: "2026-04-09", crafter: "Dewiz" },
  { publishDate: "2026-04-23", crafter: "Sidestream" },
  { publishDate: "2026-05-07", crafter: "Dewiz" },
  { publishDate: "2026-05-21", crafter: null, skipReason: "Dewiz offsite" },
  { publishDate: "2026-06-04", crafter: "Sidestream" },
  { publishDate: "2026-06-18", crafter: "Dewiz" },
  { publishDate: "2026-07-02", crafter: "Sidestream" },
  { publishDate: "2026-07-16", crafter: "Dewiz" },
  { publishDate: "2026-07-30", crafter: null, skipReason: "Sidestream offsite" },
  { publishDate: "2026-08-13", crafter: "Sidestream" },
  { publishDate: "2026-08-27", crafter: "Dewiz" },
  { publishDate: "2026-09-10", crafter: "Sidestream" },
  { publishDate: "2026-09-24", crafter: "Dewiz" },
  { publishDate: "2026-10-08", crafter: "Sidestream" },
  { publishDate: "2026-10-22", crafter: "Dewiz" },
  { publishDate: "2026-11-05", crafter: "Sidestream" },
  { publishDate: "2026-11-19", crafter: "Dewiz" },
  { publishDate: "2026-12-03", crafter: "Sidestream" },
  { publishDate: "2026-12-17", crafter: "Dewiz" },
  { publishDate: "2026-12-31", crafter: null, skipReason: "End of year" },
];

module.exports = { SPELL_CALENDAR };
