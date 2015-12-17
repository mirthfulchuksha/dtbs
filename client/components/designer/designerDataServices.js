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
.service('d3Data', ['$rootScope', function($rootScope) {
  var data;

  var emit = function(data) { $rootScope.$broadcast('d3:new-data', data); }
  var api = {
    push: function(datum) {
      data = datum;
      emit(data);
      return data;
    }
  }
  return api;
}])
.service('snapData', ['$rootScope', function($rootScope) {
  var data;

  var emit = function(data) { $rootScope.$broadcast('snap:new-data', data); }
  var api = {
    push: function(datum) {
      data = datum;
      emit(data);
      return data;
    }
  }
  return api;
}])