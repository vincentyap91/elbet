(function (Nexa) {
  function pad4(n) {
    return String(n).padStart(4, "0");
  }

  function buildRecord(count) {
    const rows = [];
    for (let i = 0; i < count; i++) {
      const day = String((i % 28) + 1).padStart(2, "0");
      const hour = String(i % 24).padStart(2, "0");
      const min = String((i * 7) % 60).padStart(2, "0");
      rows.push({
        no: i + 1,
        predicted: pad4((i * 137 + 42) % 10000),
        datetime: day + "-09-2026 " + hour + ":" + min,
      });
    }
    return rows;
  }

  function buildPredictions(seed, count) {
    const nicks = [
      "xianiaw",
      "kelvin7974",
      "iTher99",
      "catimelb21",
      "jpr001",
      "alien151",
      "Tom Holland",
      "ming88",
      "lucky4d",
      "neoplay",
    ];
    const regions = ["MY", "SG", "VN"];
    const rows = [];
    for (let i = 0; i < count; i++) {
      const nick = nicks[i % nicks.length];
      rows.push({
        nick: nick,
        region: regions[i % regions.length],
        predicted: pad4((seed + i * 173) % 10000),
        you: nick === "Tom Holland",
      });
    }
    return rows;
  }

  Nexa.NUMBER_GAME = {
    iteration: 698,
    grandUsd: 250000,
    grandLocal: 997500,
    localCurrency: "MYR",
    drawHour: 23,
    drawMinute: 30,
    ticketsLeft: 1,
    youNick: "Tom Holland",
    pity: {
      current: 32,
      max: 300,
      attemptsSuffix: "Attempt(s)",
      subtitle: "Number of Incorrect or Predictions",
      reward: 500,
      currency: "MYR",
      note: "Reward will be automatically credited upon meeting the requirement",
      scale: [0, 100, 200, 300],
    },
    nets: [
      { id: "eth", label: "ETH", amount: 2000, address: "ETH Address on 28/08/2026", icon: "assets/images/number-game/eth.png", cls: "eth" },
      { id: "trc", label: "TRC20", amount: 2000, address: "TRC20 Address on 28/08/2026", icon: "assets/images/number-game/trc20.png", cls: "trc" },
      { id: "bep", label: "BEP20", amount: 2000, address: "BEP20 Address on 28/08/2026", icon: "assets/images/number-game/bep20.png", cls: "bep" },
    ],
    latest: [
      { nick: "xianiaw", region: "MY", predicted: "1212" },
      { nick: "kelvin7974", region: "MY", predicted: "1277" },
      { nick: "kelvin7974", region: "MY", predicted: "6265" },
      { nick: "kelvin7974", region: "MY", predicted: "7056" },
      { nick: "kelvin7974", region: "MY", predicted: "8162" },
      { nick: "kelvin7974", region: "MY", predicted: "2965" },
      { nick: "kelvin7974", region: "MY", predicted: "6512" },
      { nick: "kelvin7974", region: "MY", predicted: "4974" },
      { nick: "kelvin7974", region: "MY", predicted: "5801" },
      { nick: "kelvin7974", region: "MY", predicted: "3430" },
      { nick: "kelvin7974", region: "MY", predicted: "7014" },
      { nick: "kelvin7974", region: "MY", predicted: "0385" },
      { nick: "kelvin7974", region: "MY", predicted: "4929" },
      { nick: "iTher99", region: "MY", predicted: "3614" },
      { nick: "iTher99", region: "MY", predicted: "4675" },
      { nick: "iTher99", region: "MY", predicted: "0034" },
      { nick: "iTher99", region: "MY", predicted: "9922" },
      { nick: "iTher99", region: "MY", predicted: "0336" },
      { nick: "catimelb21", region: "MY", predicted: "6726" },
      { nick: "catimelb21", region: "MY", predicted: "6940" },
    ],
    past: [
      {
        batch: 707,
        period: "September 2026",
        endedLabel: "September 6th, 2026",
        grandUsd: 250000,
        miniUsd: 6000,
        totalPredicted: 12840,
        eth: "4821",
        trc: "1903",
        bep: "7740",
      },
      {
        batch: 706,
        period: "September 2026",
        endedLabel: "September 5th, 2026",
        grandUsd: 248500,
        miniUsd: 6000,
        totalPredicted: 11902,
        eth: "0558",
        trc: "3312",
        bep: "9184",
      },
      {
        batch: 705,
        period: "September 2026",
        endedLabel: "September 4th, 2026",
        grandUsd: 247200,
        miniUsd: 6000,
        totalPredicted: 11044,
        eth: "7609",
        trc: "2447",
        bep: "1036",
      },
      {
        batch: 704,
        period: "August 2026",
        endedLabel: "September 3rd, 2026",
        grandUsd: 245000,
        miniUsd: 6000,
        totalPredicted: 10412,
        eth: "3310",
        trc: "8821",
        bep: "4509",
      },
    ],
    history: [
      { date: "27/08/2026", eth: "4821", trc: "1903", bep: "7740" },
      { date: "26/08/2026", eth: "0558", trc: "3312", bep: "9184" },
      { date: "25/08/2026", eth: "7609", trc: "2447", bep: "1036" },
    ],
    myRecord: buildRecord(36),
    predictions: buildPredictions(2400, 90),
    rules:
      "Predict a 4-digit number for the daily draw at 23:30 (GMT+8). Matching ETH, TRC20, or BEP20 wins that network mini jackpot. Matching all three wins the Grand Jackpot. If nobody hits the grand prize, the pool carries forward. Each ticket uses 1 Available Ticket.",
    tutorialUrl: "https://www.youtube.com/embed/JoNilBoABI8",
  };
})(window.Nexa = window.Nexa || {});
