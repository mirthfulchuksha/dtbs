angular.module('DTBS.main')
.controller('EditController', ['$scope', function ($scope) {

  $scope.keyEdit = [];

  $scope.tablename;

  $scope.editKeysModal = false;
  $scope.toggleEditKeysModal = function () {
    $scope.editKeysModal = !$scope.editKeysModal;
  };

  $scope.editTable = function(table){
    $scope.tablename = table;
    for (var key in $scope.tableStorage){
      if ($scope.tableStorage[key]["name"] === table) {
        for (var key2 in $scope.tableStorage[key]["attrs"]){
          $scope.keyEdit.push($scope.tableStorage[key]["attrs"][key2]);
        }
      }  
    }

    $scope.editModal = false;

    $scope.toggleEditKeysModal();
  };

  $scope.editDone = function () {
    $scope.keyEdit = [];
    $scope.toggleEditKeysModal();
  };

  $scope.deleteField = function (fieldId) {

    var foreign = $scope.tablename + "_" + fieldId;
    
    //delete requested field and foreign keys linking to the field, if any
    for (var key2 in $scope.tableStorage){
      for (var key3 in $scope.tableStorage[key2]){
        for (var i = 0; i < $scope.tableStorage[key2][key3].length; i++){
          if ($scope.tableStorage[key2][key3][i].id === fieldId || $scope.tableStorage[key2][key3][i].id === foreign){
            $scope.tableStorage[key2][key3].splice(i, 1);
          }
        }
      }
    }
    
    //to remove items from editKeyModal as they are removed:
    for (var i = 0; i < $scope.keyEdit.length; i++){
      if ($scope.keyEdit[i].id === fieldId){
        $scope.keyEdit.splice(i, 1);
      }
    }
    
    //update d3 with edits
    $scope.interactd3();

  };

  $scope.editDeleteTable = function (tableName) {
    for (var key in $scope.tableStorage){
      if ($scope.tableStorage[key].name === tableName){
        console.log($scope.tableStorage[key]);
        delete $scope.tableStorage[key];
      }
    }
    $scope.interactd3();
    console.log($scope.tableStorage);
    //delete $scope.tableStorage[table.id];

  };

}]);