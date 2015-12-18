angular.module('DTBS.main')

.service('d3TableClass', ['$rootScope', function($rootScope) {
  var data;

  var emit = function(data) { $rootScope.$broadcast('d3:table-class', data); }
  var api = {
    push: function(datum) {
      data = datum;
      emit(data);
      return data;
    }
  }
  return api;
}])
.service('canvasData', ['$rootScope', function($rootScope) {
  var data;

  var emit = function(data) { $rootScope.$broadcast('canvas:new-data', data); }
  var api = {
    push: function(datum) {
      data = datum;
      emit(data);
      return data;
    }
  }
  return api;
}]);