(function (Nexa) {
  Nexa.ACHIEVEMENTS = {
    games: {
      live: { label: "Live Casino", turnover: 0 },
      sport: { label: "Sportbook", turnover: 0 },
      esport: { label: "Esport", turnover: 0 },
      slots: { label: "Slot Games", turnover: 0 },
    },
    lastWeek: {
      live: { label: "Live Casino", turnover: 620000 },
      sport: { label: "Sportbook", turnover: 42000 },
      esport: { label: "Esport", turnover: 0 },
      slots: { label: "Slot Games", turnover: 88000 },
    },
    tiers: [
      { id: "t1", turnover: 500000, bonus: 100, art: "assets/images/achievements/gold-1.png" },
      { id: "t2", turnover: 1000000, bonus: 300, art: "assets/images/achievements/gold-2.png" },
      { id: "t3", turnover: 3000000, bonus: 1500, art: "assets/images/achievements/gold-3.png" },
      { id: "t4", turnover: 10000000, bonus: 3000, art: "assets/images/achievements/gold-4.png" },
      { id: "t5", turnover: 20000000, bonus: 5000, art: "assets/images/achievements/gold-5.png" },
    ],
  };
})(window.Nexa = window.Nexa || {});
