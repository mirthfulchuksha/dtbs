angular.module('DTBS.services', [])
.factory('AddTable', function () {
  var newTable = function ($scope) {
    $scope.added = true;
    console.log('new table added');
  };
  return {
    newTable: newTable
  };
});