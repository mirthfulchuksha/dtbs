
angular.module('DTBS.d3', [])
  .factory('d3Service', ['$document', '$q', '$rootScope',
    function($document, $q, $rootScope) {
      var d = $q.defer();
      function onScriptLoad() {
        // Load client in the browser
        $rootScope.$apply(function() { d.resolve(window.d3); });
      }
      // Create a script tag with d3 as the source
      // and call our onScriptLoad callback when it
      // has been loaded
      var scriptTag = $document[0].createElement('script');
      scriptTag.type = 'text/javascript'; 
      scriptTag.async = true;
      scriptTag.src = 'http://d3js.org/d3.v3.min.js';
      scriptTag.onreadystatechange = function () {
        if (this.readyState == 'complete') onScriptLoad();
      }
      scriptTag.onload = onScriptLoad;
 
      var s = $document[0].getElementsByTagName('body')[0];
      s.appendChild(scriptTag);
 
      return {
        d3: function() { return d.promise; }
      };
}]);

angular.module('DTBS.directives', [])
  .directive('d3Bars', ['d3Service', function (d3Service) {
    return {
      restrict: 'EA',
      scope: {
        // locations: '=locations'
      },
      link: function(scope, element, attrs) {
        d3Service.d3().then(function (d3) {
          // d3 code goes here
          var svg = d3.select(element[0])
          .append("svg")
          .style('width', '100%');
        });
      }};
  }])
  .directive('d3Schema', ['d3Service', function (d3Service) {
    return {
      restrict: 'EA',
      scope: {},
      link: function(scope, element, attrs) {
        d3Service.d3().then(function (d3) {
          scope.locations = [
            {x: 10, title: 'table1'},
            {x: 210, title: 'table2'},
            {x: 410, title: 'table3'}
          ];
          scope.render = function (locations) {
            // d3 code goes here
            var svg = d3.select('svg');
            svg.selectAll('rect')
            .data(locations)
            .enter().append('rect')
            .attr("x", function (d) { return d.x; })
            .attr("y", 30)
            .attr("width", 50)
            .attr("height", 50)
            .attr("fill", "red")
            .attr("id", "rectLabel");

            svg.selectAll('text')
            .data(locations)
            .enter().append('text')
            .attr("y", 30)
            .attr("x", function (d) {return d.x; })
            .attr("fill", 'black')
            .style({"font-size":"18px","z-index":"999999999"})
            .style("text-anchor", "middle")
            .text(function(d) { return d.title; });

            var rect = d3.selectAll('rect')
            var drag = d3.behavior.drag();

            drag.on('dragstart', function(){
              d3.event.sourceEvent.stopPropagation(); 
              d3.event.sourceEvent.preventDefault(); 
            }); 

            drag.on('drag', function(d){
              var x = d3.event.x; 
              var y = d3.event.y; 
              d3.select(this).attr('x', x).attr('y', y);
            });

            rect.call(drag);
          };
          scope.$watch('locations', function(newVals, oldVals) {
            console.log("table data changed")
            return scope.render(scope.locations);
          }, true);
        });
      }};
  }]);




