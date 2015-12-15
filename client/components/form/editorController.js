angular.module('DTBS.main')
  .controller('EditorController', [ '$scope', 'CodeParser', 'AccessSchemaService', function ($scope, CodeParser, AccessSchemaService) {
    $scope.downloadCode = function () {
      CodeParser.saveCode();
    };

    $scope.saveSchema = function () {
      CodeParser.saveSchema();
    };

    $scope.updateFactory = function (language) {
      $scope.db.lang = language;
      CodeParser.update($scope.db);
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

      console.log(separatedTables);
      //call the factory function with newly constructed object
      AccessSchemaService.schemaBuilder(separatedTables, function (data) {
        console.log(data.data);
        //$scope.tableStorage = data.data;

        // CodeParser.update($scope.db, $scope.tableStorage);
        // CodeParser.fetchCode();
        //$scope.interactd3();
      });
    };
  }]);