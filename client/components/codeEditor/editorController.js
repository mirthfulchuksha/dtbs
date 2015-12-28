angular.module('DTBS.main')
  .controller('EditorController', [ '$scope', 'CodeParser', 'AccessSchemaService', 'canvasSave', function ($scope, CodeParser, AccessSchemaService, canvasSave) {
    var graph;
    $scope.db = {};
    $scope.downloadCode = function () {
      CodeParser.saveCode();
    };
    $scope.$on('canvas:save-data', function (e, data) {
      graph = data;
    });
    $scope.saveSchema = function () {
      canvasSave.alertSave();
      console.log(graph, "graph");
      CodeParser.saveSchema(graph);
    };

    $scope.updateFactory = function (language) {
      $scope.db.lang = language;
      CodeParser.update($scope.db);
      CodeParser.fetchCode();
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