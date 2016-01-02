angular.module('DTBS.main')

.factory('saveImage', function () {
  var saveToPng = function (elementId) {
    var svg_xml = document.getElementById(elementId);
    var serializer = new XMLSerializer();
    var str = serializer.serializeToString(svg_xml);

    // Create a canvas
    var canvas = document.createElement('canvas');
    canvas.height = 650;
    canvas.width = 1200;
    canvas.style.background = 'white';

    canvg(canvas, str);
    context = canvas.getContext("2d");

    // set to draw behind current content
    context.globalCompositeOperation = "destination-over";

    // set background color
    context.fillStyle = '#fff';

    // draw background / rect on entire canvas
    context.fillRect(0, 0, canvas.width, canvas.height);
    var a = document.createElement('a');
    a.href = canvas.toDataURL("schemas/png");
    a.download = 'schemas.png';
    a.click();
    a.remove();
    canvas.remove();
  };
  return {
    saveToPng: saveToPng
  }
});