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
      scope: {},
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
    link: function (scope, element, attrs) {
      d3Service.d3().then(function (d3) {
        scope.render = function (data) {
          // remove all previous items before render
          var svg = d3.selectAll('svg');
          svg.selectAll('*').remove();
          // If we don't pass any data, return out of the element
          if (!data) return;
          svg.selectAll('rect')
          .data(data).enter()
          .append('rect')
          .attr('height', 50)
          .attr('width', 50)
          .style('background-color', red)
        };

        // set up watch to see if button clicked; add rectangle with render func
        scope.$watch('data', function(newVals, oldVals) {
          console.log("hey")
          return scope.render(newVals);
        }, true);

      })
    }
  }
}]);




