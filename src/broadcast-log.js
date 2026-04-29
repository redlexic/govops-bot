const ASCII_BROADCAST = [
  ` mmmmm  mmmmm   mmmm    mm   mmmm     mmm    mm    mmmm mmmmmmm`,
  ` #    # #   "# m"  "m   ##   #   "m m"   "   ##   #"   "   #   `,
  ` #mmmm" #mmmm" #    #  #  #  #    # #       #  #  "#mmm    #   `,
  ` #    # #   "m #    #  #mm#  #    # #       #mm#      "#   #   `,
  ` #mmmm" #    "  #mm#  #    # #mmm"   "mmm" #    # "mmm#"   #   `,
];

const DIVIDER = "#".repeat(63);

function logBroadcast({ destinations, mrkdwn }) {
  const lines = [
    DIVIDER,
    DIVIDER,
    "",
    ...ASCII_BROADCAST,
    "",
    ...destinations.map((d) => `→ ${d}`),
    "",
    "Sending the following:",
    "",
    mrkdwn,
    "",
    DIVIDER,
    DIVIDER,
  ];
  console.log(lines.join("\n"));
}

module.exports = { logBroadcast };
