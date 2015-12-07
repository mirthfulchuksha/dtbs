angular.module('DTBS.main')
.controller('OutputController', ['$scope', function ($scope) {
    //child scope function needed to clear the forms on submit
    $scope.keys = [];

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

    $scope.cancelAdd = function (indexToDelete){
      console.log(indexToDelete);
      $scope.keys.splice(indexToDelete, 1);
    };

    $scope.addTableAttrChildScope = function (keyArr, table) {
      $scope.addTableAttr(keyArr, table);
      //is this the desired behavior
      $scope.keys = [];
    };
  }])