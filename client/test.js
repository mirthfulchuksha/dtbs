angular.module('DTBS.test', [])
  .controller('ParentController', ['$scope', '$timeout', function ($scope, $timeout) {
    //object for table storage
    $scope.tableStorage = {};
    //incrementing id for table creation in child scopes
    $scope.id = 0;
    // $scope.locations = [
    //   {x: 10, title: 'table1'},
    //   {x: 210, title: 'table2'},
    //   {x: 410, title: 'table3'}
    // ];

    var secondsToWaitBeforeSave = 3;

    $scope.addTable = function (table) {
      $scope.tableStorage[table.id] = table;
    };

    // $scope.generateDiv = function () {
    //   $('<d3-bars info="test">TEST</d3-bars>').appendTo('.parent');
    // };

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
  .controller('TableController', ['$scope', function ($scope) {
    var secondsToWaitBeforeSave = 3;
    $scope.table = {};
    //Table save function that clears form and pushes up to the parent
    $scope.save = function () {
      $scope.id++;
      $scope.table.id = $scope.id;
      $scope.table.attrs = [];
      $scope.addTable($scope.table);
      $scope.table = {};
      // $scope.generateDiv();
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
  }]);
