(function (Nexa) {
  Nexa.TICKET_CENTER = {
    available: 13,
    max: 200,
    progress: 0,
    progressMax: 500,
    depositPerTicket: 500,
    currency: "MYR",
    history: [
      { date: "21/08/2026", time: "06:12:55 PM", type: "received", label: "+1 Ticket from Deposit Reward", amount: "+1 Ticket" },
      { date: "21/08/2026", time: "06:12:55 PM", type: "used", label: "-1 Ticket used for Number Game Event", amount: "-1 Ticket" },
      { date: "21/08/2026", time: "06:12:55 PM", type: "received", label: "+1 Ticket from Deposit Reward", amount: "+1 Ticket" },
      { date: "21/08/2026", time: "06:12:55 PM", type: "used", label: "-1 Ticket used for Number Game Event", amount: "-1 Ticket" },
      { date: "21/08/2026", time: "06:12:55 PM", type: "received", label: "+1 Ticket from Deposit Reward", amount: "+1 Ticket" },
      { date: "20/08/2026", time: "03:44:12 PM", type: "received", label: "+1 Ticket from Deposit Reward", amount: "+1 Ticket" },
      { date: "20/08/2026", time: "01:08:41 PM", type: "used", label: "-1 Ticket used for Number Game Event", amount: "-1 Ticket" },
      { date: "19/08/2026", time: "09:22:03 AM", type: "received", label: "+1 Ticket from Deposit Reward", amount: "+1 Ticket" },
      { date: "18/08/2026", time: "08:15:30 PM", type: "used", label: "-1 Ticket used for Ranking Board Event", amount: "-1 Ticket" },
      { date: "17/08/2026", time: "11:05:18 AM", type: "received", label: "+1 Ticket from Deposit Reward", amount: "+1 Ticket" },
    ],
    pageSize: 5,
    rules:
      "<p>Every " +
      "MYR500 deposit earns 1 free ticket.</p>" +
      "<p>Maximum holding limit is 200 tickets per account. Additional deposits after the cap do not generate extra tickets.</p>" +
      "<p>Tickets can be used on eligible Events pages such as Number Game.</p>",
  };
})(window.Nexa = window.Nexa || {});
