angular.module('DTBS.main')
.controller('FormController', ['$scope', '$timeout', 'CodeParser', 'd3DeleteTable', function ($scope, $timeout, CodeParser, d3DeleteTable) {
    //object for table storage
    $scope.tableStorage = {};
    //incrementing id for table creation in child scopes
    $scope.id = 0;
    $scope.db = {};

    var secondsToWaitBeforeSave = 0;

    $scope.downloadCode = function () {
      CodeParser.saveCode();
    };

    $scope.addTable = function (table) {
      $scope.tableStorage[table.id] = table;
    };

    $scope.deleteTable = function (table) {
      var idToDelete = angular.copy(table.id);
      d3DeleteTable.push(idToDelete);
      delete $scope.tableStorage[table.id];
    }
    
    //parent scope function to add keys to tables
    $scope.addTableAttr = function (keys, table) {
      keys.forEach(function (key){
       $scope.tableStorage[table.id].attrs.push(key);
      });
    };

    $scope.removeKeyFromTable = function (index, table) {
      $scope.tableStorage[table.id].attrs.splice(index,1);
    };


    $scope.seeKeyModal = false;
    $scope.toggleKeyModal = function(){
      $scope.seeKeyModal = !$scope.seeKeyModal;
    };

    var timeout = null;
    var saveUpdates = function() {
     if ($scope.tableStorage) {
       console.log("Saving updates to item #" + Object.keys($scope.tableStorage).length + "...");
       CodeParser.fetchCode($scope.tableStorage);
     } else {
       console.log("Tried to save updates to item #" + ($scope.tableStorage.length) + " but the form is invalid.");
     }
    };
    var debounceUpdate = function(newVal, oldVal) {
      console.log("debouncing");
     if (newVal != oldVal) {
      //waits for timeout to apply the changes on the server side
       if (timeout) {
         $timeout.cancel(timeout);
       }
       timeout = $timeout(saveUpdates, secondsToWaitBeforeSave * 1000);
     }
    };

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
      //close window 
      $scope.toggleMyModal();
      $scope.toggleKeyModal();
    };

    $scope.seeModal = false;
    $scope.toggleMyModal = function(){
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
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  })
  .factory('CodeParser', function ($http) {
    var dbName = "";
    var dbLang = "";

    var fetchCode = function (tables) {
      var dataObj = {data: []};
      for(var table in tables) {
        dataObj.data.push(tables[table]);
      }
      console.log(dataObj);

      return $http({
	method: 'POST',
        url: '/update',
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

      switch (dbLang) {
	case "mySQL":
	  extension = '.sql';
	  break;
	case "Bookshelf":
	  extension = '.js';
	  break;
	case "Sequelize":
	  extension = '.js';
	  break;
	default:
	  extension = '.sql';
      }

      codeBase.code = editor.getValue();
      codeBase.codeType = dbLang;
      codeBase.ext = extension;

      return $http({
	method: 'POST',
	url: '/download',
	data: codeBase
      }).then(function (res) {
	return res.data;
      });
    }

    var setDb = function (db) {
      dbName = db.name;
      dbLang = db.lang;
    };

    return {
      fetchCode: fetchCode,
      saveCode: saveCode,
      setDb: setDb,
      dbLang: dbLang,
      dbName: dbName
    };
  });
