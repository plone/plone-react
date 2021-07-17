global.__CLIENT__ = true;
global.__SERVER__ = false;
global.__DEVELOPMENT__ = false;

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };
