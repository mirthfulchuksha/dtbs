angular.module('DTBS.main')
.controller('sqlController', [
  '$scope',
  '$timeout',
  'CodeParser',
  'canvasData',
  'canvasSave',
  'AccessSchemaService',
  '$location',
  function ($scope, $timeout, CodeParser, canvasData, canvasSave, AccessSchemaService, $location) {

    //Object to store current collection of tables.
    $scope.tableStorage = {};
    $scope.positions = {};

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
    $scope.canAddForeign;
    $scope.edit = false;
    $scope.view = true; 
    $scope.typeEdit = 'none';
    $scope.user = {};
    $scope.user.userName = CodeParser.getUser() || localStorage.user;
    var secondsToWaitBeforeSave = 0;
    var secondsToWaitBeforeRender = 1;
    var storedRefresh = localStorage.schemas ? JSON.parse(localStorage.schemas) : null;
    CodeParser.update(null, null, $scope.user);

    $scope.savedSchemas = storedRefresh || [];
    var findSavedSchemas = function () {
      CodeParser.fetchSchemas(function (schemas) {
        $scope.savedSchemas = schemas;
        localStorage.schemas = JSON.stringify(schemas);
      });
    };
    findSavedSchemas();

    $scope.logOut = function () {
      localStorage.removeItem("user");
      localStorage.removeItem("schemas");
      $scope.user = null;
    };

    $scope.loadNewSchema = function (index) {
      CodeParser.fetchOneSchema($scope.savedSchemas[index].name, function (schema) {
        //update DB
        $scope.db.name = schema.name;
        $scope.db.lang = schema.language;

        //update table data and change d3
        if(schema.language === 'SQL') {
          $scope.tableStorage = schema.data;
          $scope.positions = schema.graph;
          $scope.interactCanvas();
        } else {
          //need to navigate to the other edit page, so put the data in local storage and redirect
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

   //Load a previously saved table for editing
    $scope.setTable = function (tableName) {

      for (var key in $scope.tableStorage) {
        if ($scope.tableStorage[key]['name'] === tableName){
          $scope.currentTable = $scope.tableStorage[key];
          $scope.primaryKeyPresent = true;
          $scope.edit = true;

        }
        if ($scope.tableStorage[key]["name"] !== tableName) {
          $scope.potentialFKs[$scope.tableStorage[key]['name']] = $scope.tableStorage[key]['primaryKey'];
          $scope.canAddForeign = true;
        }
      }

    };

    //Delete primary key and any associated foreign keys on other tables
    $scope.deletePrimaryKey = function () {

      var deleted = false;
      for (var key in $scope.tableStorage){
        for (var key2 in $scope.tableStorage[key]['foreignKeys']) {
          if ($scope.tableStorage[key]['foreignKeys'][key2]){
            if ($scope.tableStorage[key]['foreignKeys'][key2]['tableName'] === $scope.currentTable['name']){
              delete $scope.tableStorage[key]['foreignKeys'][key2];
              deleted = true;
            }
          }
        }

        if (deleted === true) {
          $scope.tableStorage[key]['attrs'] = [];
          $scope.tableStorage[key]['attrs'][0] = $scope.tableStorage[key]['primaryKey'];

          for (var key3 in $scope.tableStorage[key]['regFields']){
            if ($scope.tableStorage[key]['regFields'][key3]) {
              $scope.tableStorage[key]['attrs'].push($scope.tableStorage[key]['regFields'][key3]);
            }
          }
          for (var key4 in $scope.tableStorage[key]['foreignKeys']){
            if ($scope.tableStorage[key]['foreignKeys'][key4]){
              $scope.tableStorage[key]['attrs'].push($scope.tableStorage[key]['foreignKeys'][key4]);
            }
          }
        }
      }

      $scope.currentTable['primaryKey'] = {};
      $scope.primaryKeyPresent = false;
      $scope.interactCanvas();

    };

    //Delete a field
    $scope.deleteField = function (key) {

      delete $scope.currentTable['regFields'][key];

    };

    //Delete a foreign key
    $scope.deleteFK = function (key) {

      delete $scope.currentTable['foreignKeys'][key];

    };

    //Shows input fields/selections for adding a new field
    $scope.addField = function (tableName) {
      if (!$scope.currentTable['name']) {
        $scope.currentTable['name'] = name;
      }
      $scope.addingField = true;
    };

    //Saves required information to currentTable's primaryKey object
    $scope.savePrimaryKey = function (id, basicType, type, size, attributes, def, tableName) {
      tableName = tableName.replace('<script>', '').replace('</script>', '');
      $scope.currentTable['name'] = tableName;

      //If table is being edited when PK is created, set origin on fK format to the table's id # rather than $scope.id.
      if ($scope.edit === true) {
        var currentID = $scope.currentTable['id'];
      } else {
        var currentID = $scope.id;
      }

      $scope.currentTable.primaryKey = {

        id: id,
        basicType: basicType,
        type: type,
        size: size,
        tableName: tableName,
        fkFormat: {
          basicType: basicType,
          origin: currentID,
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

      $scope.primaryKeyPresent = true;

      $scope.addingField = false;


      //Adds all potential foreign keys (primary keys from all other tables) to $scope.potentialFKs
      for (var key in $scope.tableStorage){
        if ($scope.tableStorage[key]['name'] !== tableName) {
          $scope.potentialFKs[$scope.tableStorage[key]['name']] = $scope.tableStorage[key]['primaryKey'];
          $scope.canAddForeign = true;
        }
      }
    };

    //Saves required information to currentTable's regFields object
    $scope.saveField = function (id, basicType, type, size, attributes, def){
      $scope.currentTable.regFields[id] = {

        basicType: basicType,
        id: id.replace('<script>','').replace('</script>',''),
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

    };

    //Shows input fields/selections for adding a new foreign key
    $scope.addForeignKey = function () {

      $scope.seeForeignKeys = true;

    };

    //Saves required information to currentTable's foreignKeys object
    $scope.saveForeignKey = function (tableName, keyName) {
      keyName = keyName.replace('<script>','').replace('</script>', '');
      //working, foreign key can be saved with value that is in the PK, also add FK to the PK
      $scope.currentTable['foreignKeys'][keyName] = $scope.potentialFKs[tableName]['fkFormat'];
      $scope.currentTable['foreignKeys'][keyName]['id'] = keyName;
      $scope.seeForeignKeys = false;


    };

    //Saves all required information and resets variables once adding/editing a table id done
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
        //escaping
        $scope.currentTable['name'] = $scope.currentTable['name'].replace('<script>','').replace('</script>', '');

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

    //Clears attrs array and pushes contents of primaryKey object, regFields object, and foreignKeys object to the array
    $scope.setAttrsArray = function () {
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

      //if table has not been saved to tableStorage, just reset $scope.currentTable and other variables
      if ($scope.currentTable['attrs'].length === 0){
        $scope.currentTable = {primaryKey:{}, regFields:{}, foreignKeys: {}, attrs:[]};
        $scope.primaryKeyPresent = false;
        $scope.potentialFKs = {};
        $scope.seeForeignKeys = false;
      } else {
        //if table has been saved, delete primary key and any associated foreign keys
        $scope.deletePrimaryKey();

        //delete table and reset other variables
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
      var updatedData = {};
      updatedData.data = angular.copy($scope.tableStorage);
      updatedData.graph = angular.copy($scope.positions);
      canvasData.push(updatedData);
    };

    $scope.toggleCanvasView = function () {
      $('#designCanvas').find('svg').toggle();
      $scope.view = !$scope.view;
    };

    $scope.saveSVG = function () {

      if ($scope.view) {
        svg_xml = document.getElementById('svgout');
      } else {
        svg_xml = document.getElementById('designer');
      }
      var serializer = new XMLSerializer();
      var str = serializer.serializeToString(svg_xml);

      // Create a canvas
      var canvas = document.createElement('canvas');
      canvas.height = 650;
      canvas.width = 1000;
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
    };

    var changeTableStorage = function (newTable) {
      $scope.tableStorage = newTable;
    };

    /*
      THIS HAS TO BE HERE, IT RECOVERS THE TABLE ON RELOAD AND PAGE SWITCH
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
          $scope.positions = parsedRecovered.graph;
        }

        $scope.id = Object.keys($scope.tableStorage).length + 1;

        window.localStorage.removeItem('tempTable');

        var amount = Object.keys(parsedRecovered.data).length + 1;
        //rebuild visuals
        $timeout(changeTableStorage.bind(null, parsedRecovered.data), secondsToWaitBeforeRender * 500);
        $timeout($scope.interactCanvas, secondsToWaitBeforeRender * 500);
        $timeout(saveUpdates, secondsToWaitBeforeRender * 500);
        $timeout(changeTableID.bind(null, amount), secondsToWaitBeforeRender * 500);
      }
      //pull out existing schemas
      findSavedSchemas();
    };

    $scope.removeKeyFromTable = function (index, table) {
      $scope.tableStorage[table.id].attrs.splice(index,1);
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

    $scope.$on('canvas:save-data', function (e, data) {
      var graph = data;
    });

    $scope.$on('schemaService:new-data', function (e, data) {
      //for some reason the data is buried two levels deep in the response, no big deal
      $scope.tableStorage = data.data;
      $scope.id = Object.keys($scope.tableStorage).length + 1;
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
