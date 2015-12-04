angular.module('DTBS.test', [])
  .controller('ParentController', ['$scope', function ($scope) {
    $scope.tableStorage = [];
    $scope.id = 0;
    $scope.addTable = function (table) {
      $scope.tableStorage.push(table);
    };
  }])
  .controller('TableController', ['$scope', '$timeout', function ($scope, $timeout) {
    var secondsToWaitBeforeSave = 3;
    $scope.table = {};
    $scope.save = function () {
      $scope.id++;
      $scope.table.id = $scope.id;
      $scope.addTable($scope.table);
    };

    var timeout = null;
    var saveUpdates = function() {
     if ($scope['table_' + $scope.table.id + '_form'].$valid) {
       console.log("Saving updates to item #" + ($scope.table.id) + "...", $scope.table);
     } else {
       console.log("Tried to save updates to item #" + ($scope.table.id) + " but the form is invalid.");
     }
    };
    var debounceUpdate = function(newVal, oldVal) {
     if (newVal != oldVal) {
       if (timeout) {
         $timeout.cancel(timeout);
       }
       timeout = $timeout(saveUpdates, secondsToWaitBeforeSave * 1000);
     }
    };
    $scope.$watch('table.name', debounceUpdate);
    $scope.$watch('table.info', debounceUpdate);
  }])
  .controller('TableViewController', ['$scope', function ($scope) {
    $scope.tableList;
  }]);

