angular.module('DTBS.main')
.controller('OutputController', ['$scope','d3Data', function ($scope, d3Data) {
  //child scope function needed to clear the forms on submit
  $scope.keys = [];
  $scope.foreignKeys = [];

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

  $scope.addField = function () {
    $scope.keys.push({});
  };

  $scope.deleteKeys = function (table) {
    $scope.keys = [];
    $scope.foreignKeys = [];
    $scope.deleteTable(table);
  };

  $scope.addForeignKey = function () {
    $scope.foreignKeys.push({});
  };

  $scope.cancelAdd = function (indexToDelete){
    $scope.keys.splice(indexToDelete, 1);
  };

  $scope.addTableAttrChildScope = function (keyArr, foreignKeyArr, table, primaryKey) {
    foreignKeyArr.forEach(function (fkey) {
      _.each($scope.tableStorage, function (tbl, index) {
        //iterate through every table to retrieve the id of the foreign keys origin
        console.log(tbl);
        if(fkey.origin === tbl.name){
          fkey.origin = tbl.id;
        }
      });
      //create attributes on the foreign key obj so it can be treated like other keys
      fkey.id = $scope.tableStorage[fkey.origin].name + "_" + $scope.tableStorage[fkey.origin].primaryKey.id;
      fkey.type = $scope.tableStorage[fkey.origin].primaryKey.type;
      fkey.basicType = $scope.tableStorage[fkey.origin].primaryKey.basicType;
    });

    //This loop will find the correct index for the primary key and set it on the parent scope table
    //this is run every time any update is made to the table to make sure relationships and variable names are consistent
    var pkeyIndex = 0;
    $scope.tableStorage[$scope.selectedTable].attrs.concat(keyArr).forEach( function (newKey, index){
      if(newKey.id === primaryKey){
        pkeyIndex = index;
        $scope.addPrimaryKey(newKey, table);
      }
    });
    //combine new keys and new foreign keys to be added to parent scope
    //this has to be run after the above b/c it resets the selected table
    $scope.addTableAttr(keyArr.concat(foreignKeyArr), table, pkeyIndex);

    //reset fields in the form
    $scope.keys = [];
    $scope.foreignKeys =[];

    //close window
    $scope.toggleKeyModal();
  };

}])
//editing modal window
.directive('keymodal', function () {
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
});
