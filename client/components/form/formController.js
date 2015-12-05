angular.module('DTBS.main')
.controller('FormController', ['$scope', '$timeout', function ($scope, $timeout) {
    //object for table storage
    $scope.tableStorage = {};
    //incrementing id for table creation in child scopes
    $scope.id = 0;

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
    $scope.save = function (name) {
      $scope.id++;
      $scope.table.id = $scope.id;
      $scope.table.attrs = [];
      $scope.addTable($scope.table);
      $scope.table = {};
      data = angular.copy(name);
      d3Data.push(data);
      // $scope.table = {};
    };

  }])