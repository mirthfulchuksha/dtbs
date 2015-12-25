angular.module('DTBS.main')
.controller('EditController', ['$scope', function ($scope) {

  $scope.keyEdit = [];

  $scope.tablename;

  $scope.showPKSelection = false;

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

  $scope.editDone = function (newPrimaryKey) {
 
    console.log(newPrimaryKey);
    //if a new Primary Key has been selected, set primaryKey for table to the new PK object and move the object to the 0 position in attrs array
    if ($scope.showPKSelection === true) {
      for (var key in $scope.tableStorage){
        for (var i = 0; i < $scope.tableStorage[key]["attrs"].length; i++) {
          if ($scope.tableStorage[key]["attrs"][i].id === newPrimaryKey) {
            var pkObject = $scope.tableStorage[key]["attrs"].id;
            $scope.tableStorage[key]["attrs"].slice(i, 1);
            $scope.tableStorage[key]["attrs"].unshift(pkObject);
            $scope.tableStorage[key]["primaryKey"] = pkObject;            
          }
        }
      }
      $scope.keyEdit = [];
      $scope.showPKSelection = false;
      $scope.interactCanvas();
    }
    
    $scope.toggleEditKeysModal();

  };

  $scope.deleteField = function (fieldId) {
    var foreign = $scope.tablename + "_" + fieldId;
    console.log($scope.tableStorage);
    //delete requested field and foreign keys linking to the field, if any
    for (var key in $scope.tableStorage){
      for (var i = 0; i < $scope.tableStorage[key]["attrs"].length; i++){  

        if ($scope.tableStorage[key]["attrs"][i].id === fieldId || $scope.tableStorage[key]["attrs"][i].id === foreign){
          $scope.tableStorage[key]["attrs"].splice(i, 1);
        }
        // if field you are deleting is the primary key, show the field to choose a primary key
        if ($scope.tableStorage[key]["primaryKey"]["id"] === fieldId){
          $scope.tableStorage[key]["primaryKey"] = {};
          $scope.showPKSelection = true;
        }
      }
    }

    //to remove items from editKeyModal as they are removed:
    for (var i = 0; i < $scope.keyEdit.length; i++){
      if ($scope.keyEdit[i].id === fieldId){
        $scope.keyEdit.splice(i, 1);
      }
    }
    
    //re-render visualization after each field deletion
    $scope.interactCanvas();

  };

  $scope.newPrimaryKey = function () {

  };

  $scope.editDeleteTable = function (tableName) {
    for (var key in $scope.tableStorage){
      if ($scope.tableStorage[key].name === tableName){
        console.log($scope.tableStorage[key]);
        delete $scope.tableStorage[key];
      }
    }
    $scope.interactCanvas();

  };

}]);