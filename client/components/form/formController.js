angular.module('DTBS.main')
.controller('FormController', [
  '$scope',
  '$timeout',
  'CodeParser',
  'canvasData',
  'd3TableClass',
  'AccessSchemaService',
  function ($scope, $timeout, CodeParser, canvasData, d3TableClass, AccessSchemaService) {
    //object for table storage
    $scope.tableStorage = {};
    //incrementing id for table creation in child scopes
    $scope.id = 0;
    $scope.db = {};
    $scope.selectedTable = 0;
    $scope.primaryKeyPresent;
    $scope.view = true;
    var secondsToWaitBeforeSave = 0;
    var secondsToWaitBeforeRender = 1;

    $scope.addTable = function (table) {
      //window.localStorage.removeItem('tempTable');
      $scope.tableStorage[table.id] = table;
      //set selected table to allow for correcting editing window
      $scope.selectedTable = table.id;
    };

    $scope.deleteTable = function (table) {
      delete $scope.tableStorage[table.id];
      $scope.interactCanvas();
      $scope.toggleKeyModal();
    };

    //parent scope function to add keys to tables
    $scope.addTableAttr = function (keys, table, pkeyIndex) {
      keys.forEach(function (key){
        $scope.tableStorage[table.id].attrs.push(key);
       // var updatedData = angular.copy($scope.tableStorage);
       // d3Data.push(updatedData);
      });
      var pkey = $scope.tableStorage[table.id].attrs.splice(pkeyIndex, 1);
      $scope.tableStorage[table.id].attrs.unshift(pkey[0]);

      //updated rendering
      $scope.interactCanvas();
      $scope.selectedTable = 0;
    };

    $scope.addPrimaryKey = function (newPK, table){
      $scope.tableStorage[table.id].primaryKey = newPK;
      $scope.primaryKeyPresent = true;
    };

    $scope.interactCanvas = function () {
      //info to send to d3, all manipulation needs to be finished before calling this.
      var updatedData = angular.copy($scope.tableStorage);
      canvasData.push(updatedData);
    };

    var changeTableID = function (num) {
      $scope.id = num;
    }
    
    $scope.toggleCanvasView = function () {
      $('#designCanvas').find('svg').toggle();
      $scope.view = !$scope.view;
    };

    $scope.saveSVG = function () {
      if ($scope.view) {
        svg_xml = document.getElementById('designer');
      } else {
        svg_xml = document.getElementById('svgout');
      }  
      var serializer = new XMLSerializer();
      var str = serializer.serializeToString(svg_xml);

      // Create a canvas
      var canvas = document.createElement('canvas');
      canvas.height = 350;
      canvas.width = 640;
      canvas.style.background = 'white';

      canvg(canvas, str);
      context = canvas.getContext("2d");

      // set to draw behind current content
      context.globalCompositeOperation = "destination-over";

      // set background color
      context.fillStyle = '#fff';

      // draw background / rect on entire canvas
      context.fillRect(0, 0, canvas.width, canvas.height);
      var a = document.createElement('a');
      a.href = canvas.toDataURL("schemas/png");
      a.download = 'schemas.png';
      a.click();
      a.remove();
      canvas.remove();
    };

    /*
      THIS HAS TO BE HERE, IT RECOVERS THE TABLE ON RELOAD
    */
    $scope.recoverInfo = function () {
      var recovered = window.localStorage.getItem('tempTable');
      if(recovered) {
        var parsedRecovered = JSON.parse(recovered);
        $scope.tableStorage = parsedRecovered;
        $scope.id = Object.keys($scope.tableStorage).length;

        window.localStorage.removeItem('tempTable');  

        var amount = Object.keys(parsedRecovered).length;
        //rebuild visuals        
        $timeout($scope.interactCanvas, secondsToWaitBeforeRender * 1000);
        $timeout(saveUpdates, secondsToWaitBeforeRender * 1000);
        $timeout(changeTableID.bind(null, amount), secondsToWaitBeforeRender * 1000);
      } else {
        $scope.tableStorage = {};
      }
    };

    $scope.removeKeyFromTable = function (index, table) {
      $scope.tableStorage[table.id].attrs.splice(index,1);
    };

    $scope.seeKeyModal = false;
    $scope.toggleKeyModal = function () {
      $scope.seeKeyModal = !$scope.seeKeyModal;
      console.log($scope.seeKeyModal);
    };

    $scope.editModal = false;
    $scope.toggleEditModal = function () {
      $scope.editModal = !$scope.editModal;
    };

    $scope.modalTitle = function (name) {
      $("#tableTitle .modal-title").html("Add/Edit Fields for '" + name + "'");
    };

    var timeout = null;
    var saveUpdates = function() {
     if ($scope.tableStorage) {
       //update the factory's representation of table storage and fetch code of the current structure
       CodeParser.update($scope.db, $scope.tableStorage);
       CodeParser.fetchCode();

       //save table to factory
       AccessSchemaService.setTempSchema($scope.tableStorage);
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
      console.log("selecting ", parsedNum);
      var obj = $scope.tableStorage[$scope.selectedTable];
      $scope.modalTitle(obj.name);
    });

    $scope.$on('schemaService:new-data', function (e, data) {
      //for some reason the data is buried two levels deep in the response, no big deal
      $scope.tableStorage = data.data;
      $scope.id = Object.keys($scope.tableStorage).length;
      $scope.interactCanvas();
    });
    //event listener for updating or server side calls on save
    $scope.$watch('tableStorage', debounceUpdate, true);
    
    //on set up to check local storage
    $timeout($scope.recoverInfo());

  }]);
