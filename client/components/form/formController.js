angular.module('DTBS.main')
.controller('FormController', [
  '$scope',
  '$timeout',
  'CodeParser',
  'd3Data',
  'd3TableClass',
  function ($scope, $timeout, CodeParser, d3Data, d3TableClass) {
    //object for table storage
    $scope.tableStorage = {};
    //incrementing id for table creation in child scopes
    $scope.id = 0;
    $scope.db = {};
    $scope.selectedTable = 0;
    var secondsToWaitBeforeSave = 0;

    $scope.downloadCode = function () {
      CodeParser.saveCode();
    };

    $scope.updateFactory = function (language) {
      $scope.db.lang = language;
      CodeParser.update($scope.db);
    };

    $scope.addTable = function (table) {
      $scope.tableStorage[table.id] = table;
      //set selected table to allow for correcting editing window
      $scope.selectedTable = table.id;
    };

    $scope.deleteTable = function (table) {
      delete $scope.tableStorage[table.id];
      $scope.toggleKeyModal();
    };

    //parent scope function to add keys to tables
    $scope.addTableAttr = function (keys, table) {
      keys.forEach(function (key){
       $scope.tableStorage[table.id].attrs.push(key);
       // var updatedData = angular.copy($scope.tableStorage);
       // d3Data.push(updatedData);
      });
      $scope.selectedTable = 0;
    };

    $scope.addPrimaryKey = function (newPK, table){
      $scope.tableStorage[table.id].primaryKey = newPK;
      var updatedData = angular.copy($scope.tableStorage);
      d3Data.push(updatedData);
    };

    $scope.changePrimaryKey = function (newPK, table) {
      var foundKey;
      $scope.tableStorage[table.id].attrs.forEach( function (key){
        if(key.name === newPK){
          foundKey = key;
        }
      });
      console.log("newpk", foundKey);
      $scope.tableStorage[table.id].primaryKey = foundKey;
    };

    $scope.removeKeyFromTable = function (index, table) {
      $scope.tableStorage[table.id].attrs.splice(index,1);
    };

    $scope.seeKeyModal = false;
    $scope.toggleKeyModal = function () {
      $scope.seeKeyModal = !$scope.seeKeyModal;
    };

    $scope.modalTitle = function (name) {
      $("#tableTitle .modal-title").html("Add/Edit Fields for '" + name + "'");
    };

    var timeout = null;
    var saveUpdates = function() {
     if ($scope.tableStorage) {
       // console.log("Saving updates to item #" + Object.keys($scope.tableStorage).length + "...");
       CodeParser.update($scope.db, $scope.tableStorage);
       CodeParser.fetchCode();
     } else {
       console.log("Tried to save updates to item #" + ($scope.tableStorage.length) + " but the form is invalid.");
     }
    };
    var debounceUpdate = function(newVal, oldVal) {
     if (newVal !== oldVal) {
      //waits for timeout to apply the changes on the server side
       if (timeout) {
         $timeout.cancel(timeout);
       }
       timeout = $timeout(saveUpdates, secondsToWaitBeforeSave * 1000);
     }
    };

    //listener for selection event in d3 service to choose tables
    $scope.$on('d3:table-class', function (e, data) {
      //regex to extract the table number in case of additional classes
      var parsedNum = data.match(/\d+/)[0];
      $scope.selectedTable = parsedNum;

      var obj = $scope.tableStorage[$scope.selectedTable];
      $scope.modalTitle(obj.name);
    });
    //event listener for updating or server side calls on save (NOT WORKING)
    $scope.$watch('tableStorage', debounceUpdate, true);

  }])
  .controller('TableController', ['$scope', function ($scope) {
    $scope.table = {};
    //Table save function that clears form and pushes up to the parent
    $scope.save = function (name) {
      $scope.id++;
      $scope.table.id = $scope.id;
      $scope.table.attrs = [];
      $scope.addTable($scope.table);
      $scope.table = {};
      //close window and open key modal
      $scope.toggleMyModal();
      $scope.toggleKeyModal();
      $scope.modalTitle(name);
    };

    $scope.seeModal = false;
    $scope.toggleMyModal = function () {
      $scope.seeModal = !$scope.seeModal;
    };

  }])
  .directive('tablemodal', function () {
    return {
      template: '<div class="modal fade">' +
          '<div class="modal-dialog">' +
            '<div class="modal-content">' +
              '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                '<h4 class="modal-title">{{ title }}</h4>' +
              '</div>' +
              '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
          '</div>' +
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink (scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function (value) {
          if (value === true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function () {
          scope.$apply(function () {
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function () {
          scope.$apply(function () {
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  })
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
        return res.data;
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
    };

    var update = function (db, storage) {
      dbName = db.name;
      dbLang = db.lang;
      dbFilename = db.fileName;
      if (dbStorage) fetchCode();
      else if (storage) dbStorage = storage;
    };

    return {
      fetchCode: fetchCode,
      saveCode: saveCode,
      update: update
    };
  });
