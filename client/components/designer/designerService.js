angular.module('DTBS.main')

.service('d3UpdateTable', ['$rootScope', function($rootScope) {
  var data;

  var emit = function(data) { $rootScope.$broadcast('d3:update-table', data); }
  var api = {
    get: function() {
      return data;
    },
    set: function(data) {
      data = data;
      emit(data);
      return data;
    },
    push: function(datum) {
      data = datum;
      emit(data);
      return data;
    }
  }
  return api;
}])
.service('d3TableClass', ['$rootScope', function($rootScope) {
  var data;

  var emit = function(data) { $rootScope.$broadcast('d3:table-class', data); }
  var api = {
    get: function() {
      return data;
    },
    set: function(data) {
      data = data;
      emit(data);
      return data;
    },
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
    get: function() {
      return data;
    },
    set: function(data) {
      data = data;
      emit(data);
      return data;
    },
    push: function(datum) {
      data = datum;
      emit(data);
      return data;
    }
  }
  return api;
}]);