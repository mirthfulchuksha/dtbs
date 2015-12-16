angular.module('DTBS.main')
.directive('snapSql', function () {
  return {
    restrict: 'EA',
    scope: {},
    link: function(scope, element, attrs) {
      var s = Snap(element[0]);
      var bigCircle = s.circle(150, 150, 100);
      bigCircle.attr({
        fill: "#bada55",
        stroke: "#000",
        strokeWidth: 5
      });
      var smallCircle = s.circle(100, 150, 70);
    }};
});


