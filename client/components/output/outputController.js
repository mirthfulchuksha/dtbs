angular.module('DTBS.main')
.controller('OutputController', ['$scope', function ($scope) {
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
  }])