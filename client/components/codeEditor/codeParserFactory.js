angular.module('DTBS.main')
  .factory('CodeParser', [ '$http', '$rootScope', 'canvasSave', function ($http, $rootScope, canvasSave) {
    var dbName = "",
        dbLang = "",
        dbFilename = "",
        dbStorage,
        dbUser;

    var emit = function(data) {
      $rootScope.$broadcast('codeParser:new-db-data', data);
    };

    var fetchCode = function () {
      var dataObj = {data: []};
      for (var table in dbStorage) {
        dataObj.data.push(dbStorage[table]);
      }

      var url;
      switch (dbLang) {
        case "SQL":
          url = '/update';
          break;
        case "Bookshelf":
          url = '/bookshelf';
          break;
        case "Sequelize":
          url = '/sequelize';
          break;
        default:
          url = '/update';
      }

      return $http({
        method: 'POST',
        url: url,
        data : dataObj
      }).then(function (res) {
        //places data on editor
        var editor = ace.edit("editor");

        if(dbLang === 'SQL') {
          editor.getSession().setMode("ace/mode/sql");
        } else {
          editor.getSession().setMode("ace/mode/javascript");
        }
        //sets the value to the parsed code and places the cursor at the end
        editor.setValue(res.data, 1);
        // return res.data;
      });
    };

    var fetchMongo = function () {
      var dataObj = {data: []};
      for (var table in dbStorage) {
        dataObj.data.push(dbStorage[table]);
      }

      console.log('pre parse mongo', dataObj);

      return $http({
        method: 'POST',
        url: '/mongoose',
        data: dataObj
      }).then(function (res) {
        //places data on editor
        var editor = ace.edit("editor");
        editor.getSession().setMode("ace/mode/javascript");
        //sets the value to the parsed code and places the cursor at the end
        editor.setValue(res.data, 1);
      });
    };

    var saveCode = function () {
      var editor = ace.edit("editor");
      var codeBase = {};
      var extension;

      codeBase.code = editor.getValue();
      codeBase.codeType = dbLang;
      codeBase.ext = extension;

      var formBlob = new Blob([codeBase.code], {type: 'text/plain'});
      document.getElementById("download").href = window.URL.createObjectURL(formBlob);
      document.getElementById("download").download = dbFilename;
      console.log(dbFilename);
    };

    var saveSchema = function (graphLayout) {
      //console.log('sending scheme to server');
      var saveStuff = {
        dbUser: dbUser,
        dbName: dbName,
        dbLang: dbLang,
        tableStorage: dbStorage,
        graphLayout: graphLayout
      };
      $http({
        url: '/saveSchema',
        method: 'POST',
        data: saveStuff
      }).success(function (data, status, headers, config) {
        console.log("Saved!");
        //send out message for controllers to refresh load menu
        $rootScope.$broadcast('codeParser:new-code-saved', data);
      }).error(function (data, status, headers, config) {
        console.log("Cannot save");
      });
    };

    var fetchSchemas = function (cb) {
      var user;
      if(dbUser) {
        $http({
          url: '/setup?username=' + dbUser,
          method: 'GET',
        }).success(function (res) {
          //callback to display saved schemas in modal controller
          cb(res);
        }).error(function (res) {
          console.log("Cannot fetch schemas");
        });
      } else {
        //return empty set if dbuser is undefined (wrong controller start up)
        cb([]);
      }
    };

    var fetchOneSchema = function (schemaName, cb) {
      $http({
        url: '/loadSchema?username=' + dbUser + '&schema=' + schemaName,
        method: 'GET'
      }).success(function (res) {
        //callback with single loaded schema
        cb(res);
      }).error(function (res) {
        console.error("No schema found");
      })
    };

    var update = function (db, storage, user) {
      dbUser = user ? user.userName : dbUser;
      if (db) {
        dbName = db.name ? db.name : dbName;
        dbLang = db.lang ? db.lang : dbLang;
        dbFilename = db.fileName ? db.fileName : dbFilename;
      }
      if (storage) {
        //if storage is provided, it has been updated and needs to be reflected here for fetching
        dbStorage = storage;
        emit(db);
      }
    };

    return {
      fetchCode: fetchCode,
      saveCode: saveCode,
      saveSchema: saveSchema,
      fetchSchemas: fetchSchemas,
      update: update,
      fetchMongo: fetchMongo,
      fetchOneSchema: fetchOneSchema
    };
  }]);