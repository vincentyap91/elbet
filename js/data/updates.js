(function (Nexa) {
  Nexa.UPDATES = {
    hero: {
      desktop: "assets/images/update/hero.webp",
      mobile: "assets/images/update/hero-mobile.webp",
      title: "Updates",
      subtitle: "Stay Ahead with the Latest News & Insights",
    },
    items: [
      {
        id: "pity-bar",
        date: "27/08/2026",
        title: "Important Update: Pity Bar Changes – Effective 1st October 2026",
        summary:
          "From 1 October 2026, Pity Bar maximum attempts and rewards will be adjusted across MYR, SGD, and VND.",
        thumb: "assets/images/icons/update.svg",
        thumbClass: "content-update__thumb--icon",
        effectiveDate: "Effective Date: 1st October 2026",
        body: [
          "We would like to inform all our valued users about upcoming changes to our Pity Bar system. These adjustments are made to enhance the overall experience and ensure fairness for everyone.",
        ],
        actionTitle: "What should you do?",
        actionBody:
          "If you're close to reaching the pity bar, we recommend completing your attempts before 30th September 2026 to enjoy the current reward rates. After that, the new rates will apply.",
        closing: [
          "We appreciate your continued support and understanding. If you have any questions, feel free to contact our customer service team anytime!",
        ],
        table: {
          caption: "What's Changing?",
          headers: ["Item", "Current", "New (from 1 Oct 2026)"],
          rows: [
            ["Maximum Attempts", "300", "500"],
            ["Pity Bar Reward (RM)", "RM500", "RM300"],
            ["Pity Bar Reward (SGD)", "SGD150", "SGD 100"],
            ["Pity Bar Reward (VND)", "2,500,000 VND", "2,000,000 VND"],
          ],
        },
      },
      {
        id: "server-maintenance",
        date: "20/08/2026",
        title: "Scheduled Server Maintenance",
        summary: "Brief maintenance window for platform stability. Some services may be temporarily unavailable.",
        thumb: "assets/images/icons/update.svg",
        thumbClass: "content-update__thumb--icon",
        body: [
          "We will perform scheduled server maintenance to improve stability and performance.",
          "During the window, login, deposit, and game launch may be intermittent.",
          "Balances and pending bets remain safe.",
        ],
        closing: ["Thank you for your patience."],
        table: null,
      },
      {
        id: "fifa-prediction",
        date: "15/08/2026",
        title: "FIFA World Cup Prediction Event Now Live",
        summary: "Join the Prediction board and compete for seasonal prizes on selected World Cup fixtures.",
        thumb: "assets/images/prediction/hero.webp",
        body: [
          "The FIFA World Cup Prediction event is live on the Prediction page.",
          "Submit picks before kick-off. Leaderboard updates after each settled matchday.",
        ],
        closing: ["Open Prediction from Events to join."],
        table: null,
      },
      {
        id: "nba-prediction",
        date: "12/08/2026",
        title: "NBA Season Prediction Board Open",
        summary: "Predict tip-offs and climb the Ranking Board with weekly NBA markets.",
        thumb: "assets/images/ranking/hero.webp",
        body: [
          "NBA prediction markets are open for the new season.",
          "Score points for correct picks and track progress on Ranking Board.",
        ],
        closing: ["Good luck this season."],
        table: null,
      },
      {
        id: "ticket-center",
        date: "08/08/2026",
        title: "Ticket Center Improvements",
        summary: "Faster ticket submission and clearer status tracking for support cases.",
        thumb: "assets/images/ticket-center/hero.webp",
        body: [
          "Ticket Center now shows clearer status labels and faster acknowledgements.",
          "Attach screenshots when reporting deposit or game issues for quicker resolution.",
        ],
        closing: ["Visit Ticket Center from Function → Account tools."],
        table: null,
      },
      {
        id: "withdrawal-limit",
        date: "01/08/2026",
        title: "Updated Daily Withdrawal Limits",
        summary: "Daily withdrawal count and amount caps have been refreshed by VIP tier.",
        thumb: "assets/images/banners/06-crypto-withdrawal.jpg",
        body: [
          "Daily withdrawal limits are updated by VIP tier.",
          "Crypto withdrawals remain available with priority processing where eligible.",
        ],
        closing: ["Check Account → Withdrawal for your current limits."],
        table: {
          caption: "Daily Limits Overview",
          headers: ["VIP Tier", "Daily Amount (MYR)", "Daily Count"],
          rows: [
            ["Bronze", "30,000", "3"],
            ["Silver", "50,000", "5"],
            ["Gold", "100,000", "8"],
            ["Platinum", "200,000", "10"],
          ],
        },
      },
      {
        id: "chitchat-angpow",
        date: "28/07/2026",
        title: "ChitChat Angpow Campaign",
        summary: "Join ChitChat rooms during campaign hours for limited angpow drops.",
        thumb: "assets/images/banners/07-desktop-en.jpg",
        body: [
          "Limited angpow drops run in ChitChat during campaign hours.",
          "Follow room rules. Spam or account trading leads to removal.",
        ],
        closing: ["Open ChitChat from the header to participate."],
        table: null,
      },
      {
        id: "password-reset",
        date: "20/07/2026",
        title: "Password Reset Flow Update",
        summary: "Forgot-password flow now supports email and SMS verification with clearer error messages.",
        thumb: "assets/images/icons/update.svg",
        thumbClass: "content-update__thumb--icon",
        body: [
          "Password reset supports email and SMS verification.",
          "Use Forgot password on the login page if you cannot sign in.",
        ],
        closing: ["Contact Live Chat if verification codes do not arrive."],
        table: null,
      },
    ],
  };

  Nexa.UPDATES.byId = function byId(id) {
    if (String(id) === "42") id = "pity-bar";
    return Nexa.UPDATES.items.find(function (item) {
      return item.id === id;
    });
  };
})(window.Nexa = window.Nexa || {});
