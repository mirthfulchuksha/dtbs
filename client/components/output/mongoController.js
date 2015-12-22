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
    //Depth information 

    $scope.depth = { 'Main': 1};
    //Array of choices for location

    $scope.nestedDocuments = ['Main'];

    //Object used to track location of keys for deleting purposes
    $scope.allKeys = {};

    //set initial value of location select box
    $scope.nestedLocation = 'Main';

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

    //Setting all relevant variables to the selected schema's information during editing.
    $scope.setSchema = function (schemaName) {

      for (var key in $scope.schemaStorage){
        if ($scope.schemaStorage[key]["name"] === schemaName){

          $scope.currentSchema = $scope.schemaStorage[key];
          $scope.depth = $scope.schemaStorage[key]['depth'];
          $scope.nestedDocuments = $scope.schemaStorage[key]['nestedDocuments'];
          $scope.allKeys = $scope.schemaStorage[key]['allKeys'];
          $scope.edit = true;
          $scope.showAddKey = true;
        }
      }
    };

    //When Add Key button is pressed, show the form fields for adding key/value pair.
    //If schema is new, set the selected name and current $scope.id on the currentSchema object.
    $scope.addKey = function (name) {

      if (!$scope.currentSchema['name']){ 
        $scope.currentSchema['name'] = name;
      };
      $scope.addingKey = true;
    };

    //Save each key/value pair to the correct location in the currentSchema object when save key button is pressed.
    //update depth and nestedDocuments
    $scope.saveKey = function (name, value, nested, location) {

      var insertValue;
      var currentLocation = location.split(' > ');
      var currentDepth = currentLocation.length;
      // console.log(value);
      // $scope.allKeys[name] = value + ' Location: ' + location;
      // console.log($scope.allKeys);
      //make one more object that holds name and location, refer to that for editing?

      if (nested){

        insertValue = {type: 'Nested Document', keys: {}};
        $scope.nestedDocuments.push(location + ' > ' + name);
        $scope.depth[$scope.nestedDocuments[$scope.nestedDocuments.length - 1]] = currentDepth + 1;
      } else {
        insertValue = {type: value};
      }

      $scope.allKeys[name] = insertValue.type + ' Location: ' + location;
      console.log($scope.allKeys);
      console.log(currentLocation);//gives the array of values
      console.log(currentDepth);

      if (currentDepth === 1){
        $scope.currentSchema['keys'][name] = insertValue; 
      } else if (currentDepth === 2) {
        $scope.currentSchema['keys'][currentLocation[1]]['keys'][name] = insertValue;
      } else if (currentDepth === 3) {
        $scope.currentSchema['keys'][currentLocation[1]]['keys'][currentLocation[2]]['keys'][name] = insertValue;
      } else if (currentDepth === 4) {
        $scope.currentSchema['keys'][currentLocation[1]]['keys'][currentLocation[2]]['keys'][currentLocation[3]]['keys'][name] = insertValue;
      } else if (currentDepth === 5) {
        $scope.currentSchema['keys'][currentLocation[1]]['keys'][currentLocation[2]]['keys'][currentLocation[3]]['keys'][currentLocation[4]]['keys'][name] = insertValue;
      } else if (currentDepth === 6) {
        $scope.currentSchema['keys'][currentLocation[1]]['keys'][currentLocation[2]]['keys'][currentLocation[3]]['keys'][currentLocation[4]]['keys'][currentLocation[5]]['keys'][name] = insertValue;
      } else if (currentDepth === 7) { 
        $scope.currentSchema['keys'][currentLocation[1]]['keys'][currentLocation[2]]['keys'][currentLocation[3]]['keys'][currentLocation[4]]['keys'][currentLocation[5]]['keys'][currentLocation[6]]['keys'][name] = insertValue;
      } else if (currentDepth === 8) {
        $scope.currentSchema['keys'][currentLocation[1]]['keys'][currentLocation[2]]['keys'][currentLocation[3]]['keys'][currentLocation[4]]['keys'][currentLocation[5]]['keys'][currentLocation[6]]['keys'][currentLocation[7]]['keys'][name] = insertValue;
      } else if (currentDepth === 9) {
        $scope.currentSchema['keys'][currentLocation[1]]['keys'][currentLocation[2]]['keys'][currentLocation[3]]['keys'][currentLocation[4]]['keys'][currentLocation[5]]['keys'][currentLocation[6]]['keys'][currentLocation[7]]['keys'][currentLocation[8]]['keys'][name] = insertValue;
      } else if (currentDepth === 10) {
        $scope.currentSchema['keys'][currentLocation[1]]['keys'][currentLocation[2]]['keys'][currentLocation[3]]['keys'][currentLocation[4]]['keys'][currentLocation[5]]['keys'][currentLocation[6]]['keys'][currentLocation[7]]['keys'][currentLocation[8]]['keys'][currentLocation[9]]['keys'][name] = insertValue;
      }
   
      $scope.addingKey = false;
      console.log($scope.currentSchema);
    };

    //Delete key/value pairs on the currentSchema object when delete key button is pressed.
    $scope.deleteKey = function (key, val) {

      //first, process val to get location information
      var location = val.split(': ');
      var locateString = location[1];
      var locateArray = locateString.split(' > ');
      var locateDepth = locateArray.length;
      //fix nested documents

      console.log($scope.allKeys);
      //delete all keys from $scope.allKeys that are nested in the item being deleted
      for (var item in $scope.allKeys){
        var place = $scope.allKeys[item].split(': ');
        console.log(place);
        var placeString = place[1];
        var placeArray = placeString.split(' > ');
        console.log(placeArray);
        console.log(locateArray);
        if (placeArray === locateArray || placeArray.slice(0, locateDepth) === locateArray) {
          delete $scope.allKeys[item];
        }
      }
      console.log($scope.allKeys);
      //need to remove from nestedDocuments list as well, can build a list of that as we go along with the above.
      // for (var i = 1; i < nestedDocuments.length; i++){

      // }

      if (locateDepth === 1){
        delete $scope.currentSchema['keys'][key]; 
      } else if (locateDepth === 2) {
        delete $scope.currentSchema['keys'][locateArray[1]]['keys'][key];
      } else if (locateDepth === 3) {
        delete $scope.currentSchema['keys'][locateArray[1]]['keys'][locateArray[2]]['keys'][key];
      } else if (locateDepth === 4) {
        delete $scope.currentSchema['keys'][locateArray[1]]['keys'][locateArray[2]]['keys'][locateArray[3]]['keys'][key];
      } else if (locateDepth === 5) {
        delete $scope.currentSchema['keys'][locateArray[1]]['keys'][locateArray[2]]['keys'][locateArray[3]]['keys'][locateArray[4]]['keys'][key];
      } else if (locateDepth === 6) {
        delete $scope.currentSchema['keys'][locateArray[1]]['keys'][locateArray[2]]['keys'][locateArray[3]]['keys'][locateArray[4]]['keys'][locateArray[5]]['keys'][key];
      } else if (locateDepth === 7) { 
        delete $scope.currentSchema['keys'][locateArray[1]]['keys'][locateArray[2]]['keys'][locateArray[3]]['keys'][locateArray[4]]['keys'][locateArray[5]]['keys'][locateArray[6]]['keys'][key];
      } else if (locateDepth === 8) {
        delete $scope.currentSchema['keys'][locateArray[1]]['keys'][locateArray[2]]['keys'][locateArray[3]]['keys'][locateArray[4]]['keys'][locateArray[5]]['keys'][locateArray[6]]['keys'][locateArray[7]]['keys'][key];
      } else if (locateDepth === 9) {
        delete $scope.currentSchema['keys'][locateArray[1]]['keys'][locateArray[2]]['keys'][locateArray[3]]['keys'][locateArray[4]]['keys'][locateArray[5]]['keys'][locateArray[6]]['keys'][locateArray[7]]['keys'][locateArray[8]]['keys'][key];
      } else if (locateDepth === 10) {
        delete $scope.currentSchema['keys'][locateArray[1]]['keys'][locateArray[2]]['keys'][locateArray[3]]['keys'][locateArray[4]]['keys'][locateArray[5]]['keys'][locateArray[6]]['keys'][locateArray[7]]['keys'][locateArray[8]]['keys'][locateArray[9]]['keys'][key];
      }

      delete $scope.allKeys[key];

    };
  
    //Delete the selected schema from the storage object if present.  
    $scope.deleteSchema = function (schema) {

      var id = $scope.currentSchema['id']; 
      delete $scope.schemaStorage[id];
      $scope.resetAndUpdate();
    };

    //If currentSchema has an id set, replace it on the storage object. If the currentSchema does not have an id, set id and add to the storage object.
    $scope.editDone = function () {

      if ($scope.edit === true){  
        $scope.schemaStorage[$scope.currentSchema['id']] = $scope.currentSchema;
        $scope.schemaStorage[$scope.currentSchema['id']]['depth'] = $scope.depth;
        $scope.schemaStorage[$scope.currentSchema['id']]['nestedDocuments'] = $scope.nestedDocuments;
        $scope.schemaStorage[$scope.currentSchema['id']]['allKeys'] = $scope.allKeys;

      } else if ($scope.currentSchema['id'] === undefined) {
        $scope.currentSchema['id'] = $scope.id;
        $scope.schemaStorage[$scope.id] = $scope.currentSchema; 
        $scope.schemaStorage[$scope.id]['depth'] = $scope.depth;
        $scope.schemaStorage[$scope.id]['nestedDocuments'] = $scope.nestedDocuments;
        $scope.schemaStorage[$scope.id]['allKeys'] = $scope.allKeys;
        $scope.id++;
      }
      $scope.resetAndUpdate();

      console.log($scope.schemaStorage);
    };

    //reset variables, hide form elements and modal, update d3
    $scope.resetAndUpdate = function () { 

      //reset currentSchema, depth, and nested documents array.  Hide form elements and modal.
      $scope.currentSchema = {keys: {}};
      $scope.depth = { 'Main': 1};
      $scope.nestedDocuments = ['Main'];
      $scope.allKeys = {};
      $scope.edit = false;    
      $scope.showAddKey = false;
      $scope.addingKey = false;
      $scope.toggleEditModal('none');

      //update visualization
      $scope.interactCanvas();
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
