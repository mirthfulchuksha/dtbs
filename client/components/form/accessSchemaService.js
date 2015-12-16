angular.module('DTBS.main')
.factory('AccessSchemaService', ['$rootScope', '$http', function ($rootScope, $http) {
    var tempSchema;

    //function to broadcast new parsed table from the server
    var emit = function(data) { 
      $rootScope.$broadcast('schemaService:new-data', data); 
    }

    var setTempSchema = function (schema) {
      tempSchema = schema;
      console.log("schema saved in factory");
    };

    var getTempSchema = function () {
      return tempSchema;
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