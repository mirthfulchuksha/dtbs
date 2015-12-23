angular.module('DTBS.main')

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
}])
.service('mongoData', ['$rootScope', function($rootScope) {
  var data;

  var emit = function(data) { $rootScope.$broadcast('mongo:new-data', data); }
  var api = {
    push: function(datum) {
      data = datum;
      emit(data);
      return data;
    }
  }
  return api;
}]);











