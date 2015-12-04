angular.module('DTBS.test', [])
  .controller('ParentController', ['$scope', '$timeout', function ($scope, $timeout) {
    //object for table storage
    $scope.tableStorage = {};
    //incrementing id for table creation in child scopes
    $scope.id = 0;

    var secondsToWaitBeforeSave = 3;

    $scope.addTable = function (table) {
      $scope.tableStorage[table.name] = table;
    };

    //parent scope function to add keys to tables
    $scope.addTableAttr = function (key, table) {
      $scope.tableStorage[table.name].attrs.push(key);
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
  .controller('TableController', ['$scope', '$timeout', function ($scope, $timeout) {
    var secondsToWaitBeforeSave = 3;
    $scope.table = {};
    //Table save function that clears form and pushes up to the parent
    $scope.save = function () {
      $scope.id++;
      $scope.table.id = $scope.id;
      $scope.table.attrs = [];
      $scope.addTable($scope.table);
      $scope.table = {};
    };

    /*
    var timeout = null;
    var saveUpdates = function() {
     if ($scope['table_' + $scope.table.id + '_form'].$valid) {
       console.log("Saving updates to item #" + ($scope.table.id) + "...", $scope.table);
     } else {
       console.log("Tried to save updates to item #" + ($scope.table.id) + " but the form is invalid.");
     }
    };

    $scope.$watch('table.name', debounceUpdate);
    $scope.$watch('table.info', debounceUpdate);
    */
  }])
  .controller('TableViewController', ['$scope', function ($scope) {
    //child scope function needed to clear the forms on submit
    $scope.addTableAttrChildScope = function (key, table) {
      $scope.addTableAttr(key, table);
      $scope.key = {};
    };
  }]);

