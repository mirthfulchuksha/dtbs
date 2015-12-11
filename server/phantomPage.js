var page = require("webpage").create();
page.viewportSize = {
  width: 1600,
  height: 1200
};


var getElementBounds = function (elementId) {
  return page.evaluate(function (id) {
    var clipRect = document.getElementById(id).getBoundingClientRect();
    return {
      top: clipRect.top,
      left: clipRect.left,
      width: clipRect.width,
      height: clipRect.height
    };
  }, elementId);
};

var url = 'http://dtbs.herokuapp.com/#/';
page.open(url, function (status) {
    setTimeout(function () {
        var clipRect = getElementBounds('designer');
        page.clipRect = clipRect;
        page.render('schemas.png');
        phantom.exit();
    }, 10000);
});

