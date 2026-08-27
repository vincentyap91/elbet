(function (Nexa) {
  let settle;

  Nexa.ready = new Promise(function (resolve) {
    settle = resolve;
  });

  Nexa.markReady = function markReady() {
    settle();
  };
})(window.Nexa = window.Nexa || {});
