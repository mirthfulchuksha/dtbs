angular.module('DTBS.main')
.controller('EditController', ['$scope', function ($scope) {
  $scope.edited = [];

  $scope.editTable = function(table){
    console.log($scope.tableStorage);
    for (var key in $scope.tableStorage){
      for (var stuff in $scope.tableStorage[key]){
        for (var actuals in $scope.tableStorage[key][stuff]){
          console.log($scope.tableStorage[key][stuff]);
        }
      }       
    }
  };
  // $scope.table = {};
  // //Table save function that clears form and pushes up to the parent
  // $scope.save = function (name) {
  //   $scope.id++;
  //   $scope.table.id = $scope.id;
  //   $scope.table.attrs = [];
  //   $scope.addTable($scope.table);
  //   $scope.table = {};
  //   //close window and open key modal
  //   $scope.toggleMyModal();
  //   $scope.toggleKeyModal();
  //   $scope.modalTitle(name);
  // };


}]);