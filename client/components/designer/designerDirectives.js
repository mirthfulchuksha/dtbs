angular.module('DTBS.main')
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
}])
  .service('d3Data', ['$rootScope', function($rootScope) {
      var data = [];
      var emit = function(data) { $rootScope.$broadcast('d3:new-data', data); }
      var api = {
        get: function() {
          return data;
        },
        set: function(data) {
          data = data;
          emit(data);
          return data;
        },
        push: function(datum) {
          data.push(datum);
          emit(data);
          return data;
        }
      }
      return api;
    }])
  .directive('d3Bars', ['d3Service', 'd3Data', function (d3Service, d3Data) {
    return {
      restrict: 'EA',
      scope: {},
      link: function(scope, element, attrs) {
        d3Service.d3().then(function (d3) {
          var svg = d3.select(element[0])
          .append("svg")
          .style('width', '100%');

          scope.render = function (name) {
            var svg = d3.select('svg');

            svg.selectAll('text')
            .data(name)
            .enter().append('text')
            .attr("y", 30)
            .attr("x", 100)
            .attr("fill", 'grey')
            .style({"font-size":"18px","z-index":"999999999"})
            .style("text-anchor", "middle")
            .text(function(d) { return d; });

            var table = d3.selectAll('text')
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

            table.call(drag);
          };
          scope.$on('d3:new-data', function(e, data) {
            scope.render(data);
          });
        });
      }};
  }]);




