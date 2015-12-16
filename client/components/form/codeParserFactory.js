angular.module('DTBS.main')
  .factory('CodeParser', [ '$http', '$rootScope', function ($http, $rootScope) {
    var dbName = "",
        dbLang = "",
        dbFilename = "",
        dbStorage,
        dbUser;

    var emit = function(data) {
      $rootScope.$broadcast('codeParser:new-db-data', data);
    }

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
        //sets the value to the parsed code and places the cursor at the end
        editor.setValue(res.data, 1);
        // return res.data;
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

    var saveSchema = function () {
      var saveStuff = {
        dbUser: dbUser,
        dbName: dbName,
        dbLang: dbLang,
        tableStorage: dbStorage
      };

      $http({
        url: '/saveSchema',
        method: 'POST',
        data: saveStuff
      }).success(function (data, status, headers, config) {
        console.log("Saved!");
      }).error(function (data, status, headers, config) {
        console.log("Cannot save");
      });
    };

    var fetchSchemas = function () {
      $http({
        url: '/setup?username=' + dbUser,
        method: 'GET',
      }).success(function (res) {
        console.log("RESPPP", res);
      }).error(function (res) {
        console.log("Cannot fetch schemas");
      });
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
      update: update
    };
  }]);
