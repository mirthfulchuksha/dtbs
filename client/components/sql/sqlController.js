angular.module('DTBS.main')
.controller('sqlController', [
  '$scope',
  '$timeout',
  'CodeParser',
  'canvasData',
  'AccessSchemaService',
  function ($scope, $timeout, CodeParser, canvasData, AccessSchemaService) {
  
    //from Form Controller

    //Object to store current collection of tables.
    $scope.tableStorage = {};

    //Object for storing table that is being created or edited.
    $scope.currentTable = {primaryKey:{}, regFields:{}, foreignKeys: {}, attrs:[]}; 

    //list of potential foreign keys that populates when a primary key is chosen or when 
    //a table is chosen for editing
    $scope.potentialFKs = {};
    //incrementing id for table creation
    $scope.id = 0;
    $scope.db = {}; //??
    $scope.selectedTable = 0; //??
    $scope.primaryKeyPresent;
    $scope.addingField = false;

    $scope.edit = false;
    $scope.view = true; //related to visualization display
    $scope.typeEdit = 'none'; 
    var secondsToWaitBeforeSave = 0;
    var secondsToWaitBeforeRender = 1;

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
      //this function loads a previously saved table for editing
      for (var key in $scope.tableStorage) {
        if ($scope.tableStorage[key]["name"] === tableName){
          $scope.currentTable = $scope.tableStorage[key];
          //?? more fields necessary????

          //GOING TO TAKE EVERYTHING OUT OF ATTR AND PUSH INTO 2 OBJ, ONE
          //FOR ALL FIELDS EXCEPT PRIMARY KEY, ONE FOR JUST PRIMARY KEY.
          //THIS SHOULD ALLOW VERY CLEAR DESIGNATION OF PRIMARY KEY IN FIELDS
          //AVAILABLE FOR DELETION AND SHOULD ALSO MAKE PRIMARY KEY FIELD POP UP

          $scope.edit = true; //this field tells the editDone function that it's an edit, not new
          $scope.showAddField = true;//this field shows the button to add field         
        }
        if ($scope.tableStorage[key]["name"] !== tableName) {
          //grab the primary key object and put a copy into the potential FK object for use
        }
      }

    };

    $scope.deletePrimaryKey = function () {

      //this will handle 
      //  1) deleting foreign keys in other tables (using FKList obj)
      //  2) setting the pK object to {}
      //  3) reactivating the choose pK button, deactivating adding other
      //     fields, regular or fK.  required.

      //change values for what is visible so primary key selection shows
      //and add field/add foreign key does not.

      //  at end of editing, will clear out attrs array which will delete
      //  the pK and replace with the new one.

    };

    $scope.deleteField = function (columnID) {

      //go into the regFields object and delete this item.

      //at end of editing, will clear out attrs array and refill so this field
      //will be deleted from the list that is displayed.

    };

    $scope.deleteFK = function (key) {
      //first, look at the key.origin which gives you the # id of the pK table
      //go to the pK table, reach into PK table object on the FK List
      //look up the currentTable.name in this list object and delete it.
      //then delete the FK from the fK fields object.

      //at the end of editing, will clear out the attrs array and refill it which will delete the
      //fK from the list that is displayed.
    }

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
        fkFormat: {
          basicType: basicType,
          id: tableName + '_' + id,
          origin: $scope.id,
          type: type,
          tableName: tableName
        },
        fkList: {}
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

      //SET UP POTENTIAL FOREIGN KEYS HERE????  ***************************
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

    $scope.addForeignKey = function() {

      //FOREIGN KEY STUFF WILL BE SET UP PRIOR SO IT WILL BE AVAILABLE
      //will use this the same as save field except save different info
      //and will refer to the PK table for the object to save.
      //aso need to save the key value pair onto the FK list that is on the
      //primaryKey table.
    };

    $scope.editDone = function (currentTable, oldTable) {

      if ($scope.currentTable['name'] === '' || $scope.currentTable['name'] === undefined){
        console.log($scope.currentTable['name']);
        console.log('first if');
        $scope.toggleEditModal('none');
      } else if ($scope.edit === true) {
        console.log('editing.....');
        $scope.toggleEditModal('none');
        $scope.edit = false;
      } else if ($scope.currentTable['tableID'] === undefined && $scope.currentTable['name']!== undefined) {
        console.log('where we want');
        $scope.currentTable['id'] = $scope.id;

        $scope.setAttrsArray();
        $scope.tableStorage[$scope.id] = $scope.currentTable;
        $scope.id++;

        //resets

        $scope.currentTable = {primaryKey:{}, regFields:{}, foreignKeys: {}, attrs:[]}; 
        $scope.toggleEditModal('none'); 
      }

      $scope.potentialFKs = {};
      $scope.primaryKeyPresent = false;
      $scope.interactCanvas();
      console.log($scope.tableStorage);

    };

    $scope.setAttrsArray = function () {
      console.log('setting attrs array');
      $scope.currentTable['attrs'][0] = $scope.currentTable.primaryKey;

      for (var key in $scope.currentTable.regFields){
        $scope.currentTable['attrs'].push($scope.currentTable.regFields[key]);
      }
      for (var key in $scope.currentTable.foreignKeys){
        $scope.currentTable['attrs'].push($scope.currentTable.foreignKeys[key]);
      }
    };

    $scope.deleteTable = function (currentTable) {
      //if table is deleted, need to look at primaryKey and at any fKs, delete them.
      //then, delete table in the storage object
      //reset all variables.

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

    // $scope.seeKeyModal = false;
    // $scope.toggleKeyModal = function () {
    //   $scope.seeKeyModal = !$scope.seeKeyModal;
    //   console.log($scope.seeKeyModal);
    // };


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

    //listener for selection event in d3 service to choose tables
    // $scope.$on('d3:table-class', function (e, data) {
    //   //regex to extract the table number in case of additional classes
    //   var parsedNum = data.match(/\d+/)[0];
    //   $scope.selectedTable = parsedNum;
    //   console.log("selecting ", parsedNum);
    //   var obj = $scope.tableStorage[$scope.selectedTable];
    //   $scope.modalTitle(obj.name);
    // });

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
  }
]);