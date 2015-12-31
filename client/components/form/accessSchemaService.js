angular.module('DTBS.main')
.factory('AccessSchemaService', ['$rootScope', '$http', function ($rootScope, $http) {
    var tempSchema;

    //function to broadcast new parsed table from the server
    var emit = function(data) { 
      $rootScope.$broadcast('schemaService:new-data', data); 
    }

    var setTempSchema = function (schema) {
      //stores in the case of github login
      tempSchema = schema;
    };

    var getTempSchema = function () {
      return tempSchema;
    };

    var getTempSchemaSize = function () {
      return Object.keys(tempSchema).length;
    };

    var mongoBuilder = function (code) {
      return $http({
        method: 'POST',
        url: '/buildMongo',
        data: code
      }).then(function (res) {
        console.log(res.data);
      });
    };

    var schemaBuilder = function (structObject, callback) {
      var dataObj = {data: structObject};
      return $http({
        method: 'POST',
        url: '/build',
        data : dataObj
      }).then(function (res) {
        //response containing structure from editor code
        //data is emitted to be grabbed by the form controller
        emit(res.data);
        callback(res.data);
      });
    };

    return {
      setTempSchema: setTempSchema,
      getTempSchema: getTempSchema,
      schemaBuilder: schemaBuilder
    };
  }]);