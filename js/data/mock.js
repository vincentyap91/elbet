(function (Nexa) {
  function dataUrl(file) {
    return Nexa.asset("data/" + file);
  }

  Nexa.mockGetGames = async function getGames() {
    const res = await fetch(dataUrl("games.json"));
    return res.json();
  };

  Nexa.mockGetSports = async function getSports() {
    const res = await fetch(dataUrl("sports.json"));
    return res.json();
  };

  Nexa.mockGetPromotions = async function getPromotions() {
    const res = await fetch(dataUrl("promotions.json"));
    return res.json();
  };
})(window.Nexa = window.Nexa || {});
