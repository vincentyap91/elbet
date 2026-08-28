(function (Nexa) {
  const daily = [
    { place: 1, nick: "wong2087", region: "MY", winning: "18300.00", prize: "100", you: false },
    { place: 2, nick: "jeychang", region: "MY", winning: "12539.26", prize: "40", you: false },
    { place: 3, nick: "wei1996", region: "MY", winning: "7644.05", prize: "25", you: false },
    { place: 4, nick: "hongzai1993", region: "MY", winning: "4287.14", prize: "20", you: false },
    { place: 5, nick: "kevinchong0526", region: "MY", winning: "3045.24", prize: "20", you: true },
    { place: 6, nick: "aixxandor1", region: "MY", winning: "2770.91", prize: "20", you: false },
    { place: 7, nick: "chang885", region: "MY", winning: "2195.01", prize: "15", you: false },
    { place: 8, nick: "wilson8888", region: "MY", winning: "1868.93", prize: "12.5", you: false },
    { place: 9, nick: "lkokeah81", region: "MY", winning: "1814.29", prize: "10", you: false },
    { place: 10, nick: "happyyy", region: "MY", winning: "1321.31", prize: "10", you: false },
  ];

  function shift(rows, factor) {
    return rows.map(function (row, i) {
      const win = (parseFloat(row.winning) * factor + i * 11.4).toFixed(2);
      const prize = (parseFloat(row.prize) * (factor > 1 ? 1.2 : 0.85)).toFixed(row.prize.indexOf(".") >= 0 ? 1 : 0);
      return Object.assign({}, row, { winning: win, prize: prize, you: false });
    });
  }

  Nexa.RANKING_BOARD = {
    currentUser: "elbet_player",
    boards: {
      ranking: {
        daily: { live: daily, sport: shift(daily, 0.42), esport: shift(daily, 0.28), slots: shift(daily, 0.71) },
        yesterday: { live: shift(daily, 0.88), sport: shift(daily, 0.35), esport: shift(daily, 0.22), slots: shift(daily, 0.6) },
        last2: { live: shift(daily, 1.45), sport: shift(daily, 0.7), esport: shift(daily, 0.5), slots: shift(daily, 1.1) },
      },
      winners: {
        daily: { live: daily.slice(0, 5), sport: shift(daily, 0.42).slice(0, 5), esport: shift(daily, 0.28).slice(0, 5), slots: shift(daily, 0.71).slice(0, 5) },
        yesterday: { live: shift(daily, 0.88).slice(0, 5), sport: shift(daily, 0.35).slice(0, 5), esport: shift(daily, 0.22).slice(0, 5), slots: shift(daily, 0.6).slice(0, 5) },
        last2: { live: shift(daily, 1.45).slice(0, 5), sport: shift(daily, 0.7).slice(0, 5), esport: shift(daily, 0.5).slice(0, 5), slots: shift(daily, 1.1).slice(0, 5) },
      },
    },
    me: { rank: null, turnover: 0 },
  };
})(window.Nexa = window.Nexa || {});
