angular.module('DTBS.main')
.controller('EditController', ['$scope', function ($scope) {
  $scope.edits = {};

  $scope.whatTable = function(table){
    console.log(table);
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