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
.service('canvasSave', ['$rootScope', function($rootScope) {
  var data;

  var save = function(data) { $rootScope.$broadcast('canvas:save-data', data); }
  var alert = function() { $rootScope.$broadcast('canvas:alert-data'); }
  var api = {
    push: function(datum) {
      data = datum;
      save(data);
      return data;
    },
    alertSave: function () {
      alert();
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











