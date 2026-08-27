(function (Nexa) {
  Nexa.getGames = function getGames() {
    return Nexa.mockGetGames();
  };

  Nexa.getSports = function getSports() {
    return Nexa.mockGetSports();
  };

  Nexa.getPromotions = function getPromotions() {
    return Nexa.mockGetPromotions();
  };
})(window.Nexa = window.Nexa || {});
