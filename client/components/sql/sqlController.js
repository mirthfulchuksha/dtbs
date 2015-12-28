angular.module('DTBS.main')
.controller('sqlController', [
  '$scope',
  '$timeout',
  'CodeParser',
  'canvasData',
  'canvasSave',
  'AccessSchemaService',
<<<<<<< HEAD
  '$location',
  function ($scope, $timeout, CodeParser, canvasData, AccessSchemaService, $location) {
=======
  function ($scope, $timeout, CodeParser, canvasData, canvasSave, AccessSchemaService) {
>>>>>>> Starts on saving positions with new service for broadcasting save event
  
    //from Form Controller

    //Object to store current collection of tables.
    $scope.tableStorage = {};

    //Object for storing table that is being created or edited.
    $scope.currentTable = {primaryKey:{}, regFields:{}, foreignKeys: {}, attrs:[]}; 

    //list of potential foreign keys that populates when a primary key is chosen or when 
    //a table is chosen for editing
    $scope.potentialFKs = {};
    //incrementing id for table creation
    $scope.id = 1;
    $scope.db = {};
    $scope.primaryKeyPresent = false;
    $scope.addingField = false;
    $scope.seeForeignKeys = false;
    $scope.edit = false;
    $scope.view = true; //related to visualization display
    $scope.typeEdit = 'none'; 
    var secondsToWaitBeforeSave = 0;
    var secondsToWaitBeforeRender = 1;

    $scope.savedSchemas = [];
    var findSavedSchemas = function () {
      CodeParser.fetchSchemas(function (schemas) {
        $scope.savedSchemas = schemas;
      });
    };

    $scope.loadNewSchema = function (index) {
      CodeParser.fetchOneSchema($scope.savedSchemas[index].name, function (schema) {
        //update DB
        $scope.db.name = schema.name;
        $scope.db.lang = schema.language;

        //update table data and change d3
        if(schema.language === 'SQL') {
          $scope.tableStorage = schema.data;
          $scope.interactCanvas();  
        } else {
          window.localStorage.setItem('tempTable', JSON.stringify(schema));
          $location.path('/mongo');
        }
      });
    };

    $scope.options = {
      Numeric: [
        {name: "TINYINT"},
        {name: "SMALLINT"},
        {name: "MEDIUMINT"},
        {name: "INT"},
        {name: "BIGINT"},
        {name: "FLOATp"},
        {name: "FLOATMD"},
        {name: "DOUBLE"},
        {name: "DECIMAL"}
      ],
      String: [
        {name: "CHAR"},
        {name: "VARCHAR"},
        {name: "TINYTEXT2"},
        {name: "TEXT2"},
        {name: "MEDIUMTEXT2"},
        {name: "LONGTEXT2"},
        {name: "BINARY"},
        {name: "VARBINARY"},
        {name: "TINYBLOB"},
        {name: "BLOB"},
        {name: "MEDIUMBLOB"},
        {name: "LONGBLOB"},
        {name: "ENUM2"},
        {name: "SET2"}
      ],
      Bit: [
        {name: "BIT"}
      ],
      DateTime: [
        {name: "DATE"},
        {name: "DATETIME"},
        {name: "TIME"},
        {name: "TIMESTAMP"},
        {name: "YEAR"}
      ]
    };

    $scope.attributes = {
      TINYINT: [
        {attr: "AUTO_INCREMENT"},
        {attr: "UNSIGNED"},
        {attr: "ZEROFILL"},
        {attr: "SERIAL DEFAULT VALUE"}
      ],
      SMALLINT: [
        {attr: "AUTO_INCREMENT"},
        {attr: "UNSIGNED"},
        {attr: "ZEROFILL"},
        {attr: "SERIAL DEFAULT VALUE"}
      ],
      MEDIUMINT: [
        {attr: "AUTO_INCREMENT"},
        {attr: "UNSIGNED"},
        {attr: "ZEROFILL"},
        {attr: "SERIAL DEFAULT VALUE"}
      ],
      INT: [
        {attr: "AUTO_INCREMENT"},
        {attr: "UNSIGNED"},
        {attr: "ZEROFILL"},
        {attr: "SERIAL DEFAULT VALUE"}
      ],
      BIGINT: [
       {attr: "AUTO_INCREMENT"},
       {attr: "UNSIGNED"},
       {attr: "ZEROFILL"}
      ],
      FLOATp: [
        {attr: "UNSIGNED"},
        {attr: "ZEROFILL"}
      ],
      FLOATMD: [
        {attr: "UNSIGNED"},
        {attr: "ZEROFILL"}
      ],
      DOUBLE: [
        {attr: "UNSIGNED"},
        {attr: "ZEROFILL"}
      ],
      DECIMAL: [
        {attr: "UNSIGNED"},
        {attr: "ZEROFILL"}
      ],
      CHAR: [
        {attr: "BINARY"},
        {attr: "CHARACTER SET"}
      ],
      VARCHAR: [
        {attr: "BINARY"},
        {attr: "CHARACTER SET"}
      ],
      TINYTEXT2: [
        {attr: "BINARY"},
        {attr: "CHARACTER SET"}
      ],
      TEXT2: [
        {attr: "BINARY"},
        {attr: "CHARACTER SET"}
      ],
      MEDIUMTEXT2: [
        {attr: "BINARY"},
        {attr: "CHARACTER SET"}
      ],
      LONGTEXT2: [
        {attr: "BINARY"},
        {attr: "CHARACTER SET"}
      ]
    };

    //Show the modal for adding/editing tables
    $scope.visibleEditModal = false;
    $scope.toggleEditModal = function (value) {
      if (value) {
        $scope.typeEdit = value;
      }
      $scope.visibleEditModal = !$scope.visibleEditModal; 
    };

    $scope.setTable = function (tableName) {
      console.log(tableName);
      //this function loads a previously saved table for editing
      for (var key in $scope.tableStorage) {
        console.log($scope.tableStorage[key]['name']);
        if ($scope.tableStorage[key]['name'] === tableName){
          $scope.currentTable = $scope.tableStorage[key];
          //?? more fields necessary????
          //if not originally created via add modal, need to make the regFields and ForeignKey objects
          //so editing is possible
          $scope.primaryKeyPresent = true;
          $scope.edit = true; //this field tells the editDone function that it's an edit, not new
                
        }
        if ($scope.tableStorage[key]["name"] !== tableName) {
          $scope.potentialFKs[$scope.tableStorage[key]['name']] = $scope.tableStorage[key]['primaryKey'];
        }
      }

    };

    $scope.deletePrimaryKey = function () {

      //need to delete foreign keys in other tables prior to steps below
      //may want to hide any additional editing functions until PK selected
      // for (var key in $scope.tableStorage){
      //   if ($scope.tableStorage.key['foreignKeys'] !== {}){
      //     for (var key2 in $scope.tableStorage[key]['foreignKeys']) {
      //       if ($scope.tableStorage.key['foreignKeys'].key2['tableName'] === $scope.currentTable['name']){
      //         console.log('locating foreign key to delete');
      //       }
      //     }
      //   }
        
      // }

      $scope.currentTable['primaryKey'] = {};
      $scope.primaryKeyPresent = false;

    };

    //Delete a field
    $scope.deleteField = function (key) {

      delete $scope.currentTable['regFields'][key];

    };

    //Delete a foreign key
    $scope.deleteFK = function (key) {

      //need to do something here to replace it in the $scope.potentialFKs object ****************
      delete $scope.currentTable['foreignKeys'][key];

    };

    //when Add Field button is clicked, sets currentTable.name and shows inputs to add field
    $scope.addField = function (tableName) {
      if (!$scope.currentTable['name']) {
        $scope.currentTable['name'] = name;
      }
      $scope.addingField = true;

    };

    //when save primary key button is pressed, sets all required information for currentTable's primaryKey object
    $scope.savePrimaryKey = function (id, basicType, type, size, attributes, def, tableName) {
      $scope.currentTable['name'] = tableName;
      $scope.currentTable.primaryKey = {

        id: id,
        basicType: basicType,
        type: type,
        size: size,
        tableName: tableName,
        fkFormat: {
          basicType: basicType,
          origin: $scope.id,
          type: type,
          tableName: tableName
        }
      }

      if (attributes !== undefined){
        $scope.currentTable.primaryKey.attributes = attributes;
      }

      if (def !== undefined){
        $scope.currentTable.primaryKey.default = def;
      }
      
      $scope.primaryKeyPresent = true;//also, needs to set primaryKeyPresent to TRUE

      $scope.addingField = false;
      console.log($scope.currentTable);

      //add all potential foreign keys (primary keys from all other tables) to $scope.potentialFKs
      for (var key in $scope.tableStorage){
        if ($scope.tableStorage[key]['name'] !== tableName) {
          $scope.potentialFKs[$scope.tableStorage[key]['name']] = $scope.tableStorage[key]['primaryKey'];
        }
      }
      console.log($scope.potentialFKs);
    };

    $scope.saveField = function (id, basicType, type, size, attributes, def){

      $scope.currentTable.regFields[id] = {

        basicType: basicType,
        id: id,
        type: type,
        size: size,

      };

      if (attributes !== undefined){
        $scope.currentTable.regFields[id].attributes = attributes;
      }

      if (def !== undefined){
        $scope.currentTable.regFields[id].default = def;
      }

      $scope.addingField = false;

      console.log($scope.currentTable);
    };

    $scope.addForeignKey = function () {

      $scope.seeForeignKeys = true;

    };

    $scope.saveForeignKey = function (tableName, keyName) {

      //working, foreign key can be saved with value that is in the PK, also add FK to the PK
      $scope.currentTable['foreignKeys'][keyName] = $scope.potentialFKs[tableName]['fkFormat'];
      $scope.currentTable['foreignKeys'][keyName]['id'] = keyName;
      console.log($scope.currentTable);
      $scope.seeForeignKeys = false;


    };

    $scope.editDone = function (currentTable, oldTable) {

      if ($scope.currentTable['name'] === '' || $scope.currentTable['name'] === undefined){

        $scope.toggleEditModal('none');

      } else if ($scope.edit === true) {

        $scope.toggleEditModal('none');
        $scope.edit = false;
        $scope.setAttrsArray();
        $scope.tableStorage[$scope.currentTable['id']] = $scope.currentTable;
        $scope.currentTable = {primaryKey:{}, regFields:{}, foreignKeys: {}, attrs:[]}; 
        $scope.potentialFKs = {};
        $scope.seeForeignKeys = false;
        $scope.primaryKeyPresent = false;

      } else if ($scope.currentTable['tableID'] === undefined && $scope.currentTable['name']!== undefined) {
        $scope.currentTable['id'] = $scope.id;
        $scope.setAttrsArray();
        $scope.tableStorage[$scope.id] = $scope.currentTable;
        $scope.id++;

        $scope.currentTable = {primaryKey:{}, regFields:{}, foreignKeys: {}, attrs:[]}; 
        $scope.toggleEditModal('none'); 
        $scope.primaryKeyPresent = false;
        $scope.potentialFKs = {};
        $scope.seeForeignKeys = false;
      }

      $scope.interactCanvas();

    };

    $scope.setAttrsArray = function () {
      console.log('setting attrs array');
      $scope.currentTable['attrs'] = [];
      $scope.currentTable['attrs'][0] = $scope.currentTable.primaryKey;

      for (var key in $scope.currentTable.regFields){
        $scope.currentTable['attrs'].push($scope.currentTable.regFields[key]);
      }
      for (var key in $scope.currentTable.foreignKeys){
        $scope.currentTable['attrs'].push($scope.currentTable.foreignKeys[key]);
      }
    };

    $scope.deleteTable = function (currentTable) {

      $scope.toggleEditModal('none');

      //if table has not been saved to tableStorage, just reset $scope.currentTable
      if ($scope.currentTable['attrs'].length === 0){
        $scope.currentTable = {primaryKey:{}, regFields:{}, foreignKeys: {}, attrs:[]}; 
        $scope.primaryKeyPresent = false;
        $scope.potentialFKs = {};
        $scope.seeForeignKeys = false;
      } else {

        //needs work ****************************************
        for (var key in $scope.tableStorage){
          console.log($scope.tableStorage);
          if ($scope.tableStorage[key]['foreignKeys'][currentTable]){
            console.log('found it');
            for (var i = $scope.tableStorage[key]['attrs'].length - 1; i < 0; i--) {
              if ($scope.tableStorage[key]['attrs'][i] === $scope.currentTable['primaryKey']['fkFormat']){
                $scope.tableStorage[key]['attrs'].slice(i, 1);
                console.log('sliced out fk');
              }
            }
            delete $scope.tableStorage.key['foreignKeys'][currentTable];
            console.log('deleted fk from fk obj')
          }
        }
        delete $scope.tableStorage[$scope.currentTable['id']];

        $scope.currentTable = {primaryKey:{}, regFields:{}, foreignKeys: {}, attrs:[]}; 
        $scope.primaryKeyPresent = false;
        $scope.potentialFKs = {};
        $scope.seeForeignKeys = false;

      }
      $scope.interactCanvas();

    };

    $scope.interactCanvas = function () {
      //info to send to d3, all manipulation needs to be finished before calling this.
      var updatedData = angular.copy($scope.tableStorage);
      canvasData.push(updatedData);
    };
    
    $scope.toggleCanvasView = function () {
      $('#designCanvas').find('svg').toggle();
      $scope.view = !$scope.view;
    };

    $scope.saveSVG = function () {
      canvasSave.alertSave();
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

    var changeTableID = function (num) {
      $scope.id = num;
    }

    /*
      THIS HAS TO BE HERE, IT RECOVERS THE TABLE ON RELOAD
    */
    $scope.recoverInfo = function () {
      var recovered = window.localStorage.getItem('tempTable');
      if(recovered) {
        var parsedRecovered = JSON.parse(recovered);

        if(parsedRecovered.data) {
          //if the recovered data is the record of an entire schema and not just the table storage
          $scope.db.name = parsedRecovered.name;
          $scope.db.lang = parsedRecovered.language;
          $scope.tableStorage = parsedRecovered.data;
        } else {
          $scope.tableStorage = parsedRecovered;
        }

        $scope.id = Object.keys($scope.tableStorage).length;

        window.localStorage.removeItem('tempTable');  

        var amount = Object.keys(parsedRecovered.data).length;
        //rebuild visuals        
        $timeout($scope.interactCanvas, secondsToWaitBeforeRender * 1000);
        $timeout(saveUpdates, secondsToWaitBeforeRender * 1000);
        $timeout(changeTableID.bind(null, amount), secondsToWaitBeforeRender * 1000);
      } else {
        $scope.tableStorage = {};
      }

      //pull out existing schemas
      findSavedSchemas();
    };

    $scope.removeKeyFromTable = function (index, table) {
      $scope.tableStorage[table.id].attrs.splice(index,1);
    };


    // $scope.modalTitle = function (name) {
    //   $("#tableTitle .modal-title").html("Add/Edit Fields for '" + name + "'");
    // };

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

    $scope.$on('canvas:save-data', function (e, data) {
      var graph = data;
    });

    $scope.$on('schemaService:new-data', function (e, data) {
      //for some reason the data is buried two levels deep in the response, no big deal
      $scope.tableStorage = data.data;
      $scope.id = Object.keys($scope.tableStorage).length;
      $scope.interactCanvas();
    });

    $scope.$on('codeParser:new-code-saved', function (e, data) {
      findSavedSchemas();
    });
    //event listener for updating or server side calls on save
    $scope.$watch('tableStorage', debounceUpdate, true);
    
    //on set up to check local storage
    $timeout($scope.recoverInfo());
  }
]);