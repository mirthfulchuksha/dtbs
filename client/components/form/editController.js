angular.module('DTBS.main')
.controller('EditController', ['$scope', function ($scope) {

  $scope.keyEdit = [];

  $scope.editKeysModal = false;
  $scope.toggleEditKeysModal = function () {
    $scope.editKeysModal = !$scope.editKeysModal;
  };

  $scope.editTable = function(table){
    for (var key in $scope.tableStorage){
      if ($scope.tableStorage[key]["name"] === table) {
        for (var key2 in $scope.tableStorage[key]["attrs"]){
          $scope.keyEdit.push($scope.tableStorage[key]["attrs"][key2]);
        }
      }  
    }

    $scope.toggleEditModal();
    $scope.toggleEditKeysModal();
  };

  $scope.editDone = function () {
    $scope.keyEdit = [];
    $scope.toggleEditKeysModal();
  };

}]);