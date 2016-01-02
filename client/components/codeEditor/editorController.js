angular.module('DTBS.main')
  .controller('EditorController', [ '$scope', 'CodeParser', 'AccessSchemaService', 'canvasSave', function ($scope, CodeParser, AccessSchemaService, canvasSave) {

    $scope.db = {};
    $scope.positions;
    $scope.downloadCode = function () {
      CodeParser.saveCode();
    };

    var mongoORMS = ['Mongo', 'Mongoose', 'Active Record'];

    $scope.$on('canvas:save-data', function (e, data) {
      $scope.positions = data;
    });

    $scope.saveSchema = function () {
      // The call to code parser is made in the snap sql directive
      canvasSave.alertSave();
      CodeParser.saveSchema($scope.positions);
    };

    $scope.updateFactory = function (language) {
      $scope.db.lang = language;
      switch ($scope.db.lang) {
        case "SQL":
          $scope.db.fileName = $scope.db.lang + '_Schema.sql';
          break;
        case "Bookshelf":
          $scope.db.fileName = $scope.db.lang + '_Schema.js';
          break;
        case "Sequelize":
          $scope.db.fileName = $scope.db.lang + '_Schema.js';
          break;
        case "Mongoose":
          $scope.db.fileName = $scope.db.lang + '_Schema.js';
          break;
        case "Mongo":
          $scope.db.fileName = $scope.db.lang + '_Schema.txt';
          break;
        default:
          $scope.db.fileName = $scope.db.lang + '_Schema.sql';
      }
      CodeParser.update($scope.db);
      if(mongoORMS.indexOf($scope.db.lang) > -1) {
        CodeParser.fetchMongo();
      } else {
        CodeParser.fetchCode();
      }
    };

    $scope.rebuildMongoSchema = function () {
      var editor = ace.edit("editor");
      var newCode = editor.getValue();
      newCode = newCode.trim();
      AccessSchemaService.mongoBuilder(newCode);
    };

    $scope.rebuildSchema = function () {
      var editor = ace.edit("editor");
      var newCode = editor.getValue();
      newCode = newCode.split('\n');

      var separatedTables = {};
      var id = 1;
      var currentTable = [];
      for(var i = 0; i < newCode.length; i++) {
        if(newCode[i].includes('CREATE') && i > 0 || newCode[i].includes('create') && i > 0) {
          //found keyword for new table, save the current and increment id var
          separatedTables[id] = currentTable;
          id++;
          currentTable = [];
        }
        var trimmedInput = newCode[i].trim();
        if(trimmedInput !== '') {
          currentTable = currentTable.concat(trimmedInput);
        }
      }
      //one more for the last item in the list
      separatedTables[id] = currentTable;

      //call the factory function with newly constructed object
      AccessSchemaService.schemaBuilder(separatedTables, function (data) {
        //this callback is never used
      });
    };
  }]);
