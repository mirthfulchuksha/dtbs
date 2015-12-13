angular.module('DTBS.main')
  .factory('CodeParser', function ($http) {
    var dbName = "",
        dbLang = "",
        dbFilename = "",
        dbStorage;

    var fetchCode = function () {
      var dataObj = {data: []};
      for (var table in dbStorage) {
        dataObj.data.push(dbStorage[table]);
      }

      var url;
      switch (dbLang) {
        case "mySQL":
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

    var update = function (db, storage) {
      dbName = db.name ? db.name : dbName;
      dbLang = db.lang ? db.lang : dbLang;
      dbFilename = db. fileName ? db.fileName : dbFilename;
      if (dbStorage) fetchCode();
      else if (storage) dbStorage = storage;
    };

    return {
      fetchCode: fetchCode,
      saveCode: saveCode,
      saveSchema: saveSchema,
      update: update
    };
  });
