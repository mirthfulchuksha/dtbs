angular.module('DTBS.main')
.controller('MongoController', [
  '$scope',
  '$timeout',
  'CodeParser',
  'mongoData',
  'AccessSchemaService',
  function ($scope, $timeout, CodeParser, mongoData, AccessSchemaService) {

    //Object to store current collection of schemas.
    $scope.schemaStorage = {};
    //Object for storing schema that is being created or edited.
    $scope.currentSchema = {keys: {}}; 
    //Unique number used as key for each schema saved to $scope.schemaStorage.
    $scope.id = 0;

    //Not sure about how this will be used for nested objects yet. *************************
    //$scope.nestedList = []; 

    //Variables used to show/hide form fields and d3/canvas elements.
    $scope.typeEdit = 'none'; 
    $scope.addingKey = false;
    $scope.edit = false;
    $scope.view = true;

    //Variables used to saving and visualization renering
    var secondsToWaitBeforeSave = 0; 
    var secondsToWaitBeforeRender = 1; 

    //Show the modal for adding/editing schemas
    $scope.visibleEditModal = false;
    $scope.toggleEditModal = function (value) {
      if (value){
        $scope.typeEdit = value;
      }
      $scope.visibleEditModal = !$scope.visibleEditModal;
    };

    //Setting a schema during editing to the currentSchema object.
    $scope.setSchema = function (schemaName) {

      for (var key in $scope.schemaStorage){
        if ($scope.schemaStorage[key]["name"] === schemaName){
          $scope.currentSchema = $scope.schemaStorage[key];
          console.log($scope.currentSchema);
          console.log($scope.schemaStorage);
          $scope.edit = true;
          $scope.showAddKey = true;
        }
      }
    };

    //When Add Key button is pressed, show the form fields for adding key/value pair.
    //If schema is new, set the selected name and current $scope.id on the currentSchema object.
    $scope.addKey = function (name) {
      console.log($scope.currentSchema['name'], "watch this when first creating and then when editing the same thing");
      console.log($scope.id);  //need to increment scope being ++ here, or maybe implement a switch like, kkkkkkl
      if (!$scope.currentSchema['name']){ 
        $scope.currentSchema['id'] = $scope.id; 
        $scope.currentSchema['name'] = name;
        console.log($scope.currentSchema['name']);
      };
      $scope.addingKey = true;
    };

    //Save each key/value pair to the currentSchema object when save key button is pressed.
    $scope.saveKey = function (name, value) {

      $scope.currentSchema['keys'][name] = {type: value}; 

      $scope.addingKey = false;
    }

    //Delete key/value pairs on the currentSchema object when delete key button is pressed.
    $scope.deleteKey = function (keyName, schema) {

      delete $scope.currentSchema['keys'][keyName];

    };
  
    //Delete the selected schema from the storage object if present.  Hide add/editing forms.
    $scope.deleteSchema = function (schema) {

      var id = $scope.currentSchema['id'];
   
      delete $scope.schemaStorage[id];

      $scope.currentSchema = {keys: {}};

      $scope.edit = false;
      $scope.showAddKey = false;
      $scope.toggleEditModal('none');
      $scope.interactCanvas();

    };

    //If currentSchema has an id set, add to the storage object. If the schema already exists on the storage object, replace it.
    $scope.editDone = function () {

      if ($scope.edit === true){
        $scope.schemaStorage[$scope.currentSchema['id']] = $scope.currentSchema;

      } else if ($scope.currentSchema.id !== undefined) {
        $scope.schemaStorage[$scope.id] = $scope.currentSchema; //this is part of the prob because at this point the scope is incremented.
      }

      $scope.toggleEditModal('none');
      $scope.currentSchema = {keys: {}};
      $scope.edit = false;  
      $scope.showAddKey = false;
      $scope.interactCanvas();

      console.log($scope.schemaStorage);
    };

    $scope.interactCanvas = function () {
      //info to send to d3, all manipulation needs to be finished before calling this.
      var updatedData = angular.copy($scope.schemaStorage);
      mongoData.push(updatedData);
    };

    $scope.toggleCanvasView = function () {
      $('#mongoDesignCanvas').find('svg').toggle();
      $scope.view = !$scope.view;
    };

    $scope.saveSVG = function () {
      if ($scope.view) {
        svg_xml = document.getElementById('tree');
      } else {
        svg_xml = document.getElementById('dendro');
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
  }
]);
