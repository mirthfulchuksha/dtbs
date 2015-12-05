angular.module('DTBS.test', [])
  .controller('ParentController', ['$scope', '$timeout', function ($scope, $timeout) {
    //object for table storage
    $scope.tableStorage = {};
    //incrementing id for table creation in child scopes
    $scope.id = 0;
    $scope.locations = [
      {x: 10, title: 'table1'},
      {x: 210, title: 'table2'},
      {x: 410, title: 'table3'}
    ];

    var secondsToWaitBeforeSave = 3;

    $scope.addTable = function (table) {
      $scope.tableStorage[table.id] = table;
    };

    //parent scope function to add keys to tables
    $scope.addTableAttr = function (keys, table) {
      keys.forEach(function (key){
	     $scope.tableStorage[table.id].attrs.push(key);
      });
    };

    $scope.removeKeyFromTable = function (index, table) {
      $scope.tableStorage[table.id].attrs.splice(index,1);
      console.log("deleted!");
    };

    var timeout = null;
    var saveUpdates = function() {
     if ($scope.tableStorage) {
       console.log("Saving updates to item #" + Object.keys($scope.tableStorage).length + "...", $scope.tableStorage);
     } else {
       console.log("Tried to save updates to item #" + ($scope.tableStorage.length) + " but the form is invalid.");
     }
    };
    var debounceUpdate = function(newVal, oldVal) {
      console.log("debouncing");
     if (newVal != oldVal) {
      console.log("val is different");
       if (timeout) {
         $timeout.cancel(timeout);
       }
       timeout = $timeout(saveUpdates, secondsToWaitBeforeSave * 1000);
     }
    };

    //event listener for updating or server side calls on save (NOT WORKING)
    $scope.$watch('tableStorage', debounceUpdate, true);

  }])
  .controller('TableController', ['$scope', 'd3Data', function ($scope, d3Data) {
    var secondsToWaitBeforeSave = 3;
    $scope.table = {};
    //Table save function that clears form and pushes up to the parent
    $scope.save = function () {
      $scope.id++;
      $scope.table.id = $scope.id;
      $scope.table.attrs = [];
      $scope.addTable($scope.table);
      $scope.table = {};
      data = angular.copy($scope.locations);
      d3Data.push(data);
    };

  }])
  .controller('TableViewController', ['$scope', function ($scope) {
    //child scope function needed to clear the forms on submit
    $scope.keys = [];

    $scope.addField = function () {
      $scope.keys.push({});
    };

    $scope.cancelAdd = function (indexToDelete){
      console.log(indexToDelete);
      $scope.keys.splice(indexToDelete, 1);
    };

    $scope.addTableAttrChildScope = function (keyArr, table) {
      $scope.addTableAttr(keyArr, table);
      //is this the desired behavior
      $scope.keys = [];
    };
  }])
  // ALL THE D3 STUFF =================================================
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
          scope.$on('d3:new-data', function(e, data) {
            scope.render(data);
          });
        });
      }};
  }]);

