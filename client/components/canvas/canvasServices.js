angular.module('DTBS.main')

// Service to interact with angular front end via events on the rootScope
.service('canvasData', ['$rootScope', function($rootScope) {
  var data;

  var emit = function(eventName, data) { $rootScope.$broadcast(eventName, data); }
  var alert = function() { $rootScope.$broadcast('canvas:alert-data'); }

  var api = {
    push: function(eventName, datum) {
      data = datum;
      emit(eventName, data);
      return data;
    },
    alertSave: function () {
      alert();
    }
  }
  return api;
}]);











