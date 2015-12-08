angular.module('DTBS.main')
.controller('FormController', ['$scope', '$timeout', 'CodeParser', 'd3DeleteTable', function ($scope, $timeout, CodeParser, d3DeleteTable) {
    //object for table storage
    $scope.tableStorage = {};
    //incrementing id for table creation in child scopes
    $scope.id = 0;

    var secondsToWaitBeforeSave = 0;

    $scope.addTable = function (table) {
      $scope.tableStorage[table.id] = table;
    };

    $scope.deleteTable = function (table) {
      var idToDelete = angular.copy(table.id);
      d3DeleteTable.push(idToDelete);
      delete $scope.tableStorage[table.id];
    }
    
    //parent scope function to add keys to tables
    $scope.addTableAttr = function (keys, table) {
      keys.forEach(function (key){
       $scope.tableStorage[table.id].attrs.push(key);
      });
    };

    $scope.removeKeyFromTable = function (index, table) {
      $scope.tableStorage[table.id].attrs.splice(index,1);
    };

    var timeout = null;
    var saveUpdates = function() {
     if ($scope.tableStorage) {
       console.log("Saving updates to item #" + Object.keys($scope.tableStorage).length + "...");
       CodeParser.fetchCode($scope.tableStorage);
     } else {
       console.log("Tried to save updates to item #" + ($scope.tableStorage.length) + " but the form is invalid.");
     }
    };
    var debounceUpdate = function(newVal, oldVal) {
      console.log("debouncing");
     if (newVal != oldVal) {
      //waits for timeout to apply the changes on the server side
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
    $scope.table = {};
    //Table save function that clears form and pushes up to the parent
    $scope.save = function (name) {
      $scope.id++;
      $scope.table.id = $scope.id;
      $scope.table.attrs = [];
      $scope.addTable($scope.table);
      $scope.table = {};      
    };

  }])
  .factory('CodeParser', function ($http) {
    
    var fetchCode = function (tables) {
      var dataObj = {data: []};
      for(var table in tables) {
        dataObj.data.push(tables[table]);
      }
      console.log(dataObj);

      return $http({
        method: 'POST', 
        url: '/update',
        data : dataObj
      }).then(function (res) {
        //places data on editor
        var editor = ace.edit("editor");
        //sets the value to the parsed code and places the cursor at the end
        editor.setValue(res.data, 1);
        return res.data;
      });
    };

    return {
      fetchCode: fetchCode
    };
  });