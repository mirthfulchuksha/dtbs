// function to transform data into dummyData format
var dataBuilder = function (data) {
  // initialize empty graph
  var graph = {nodes: [], links: []};
  // build up primary key field indices for linking reference
  var primaryKeys = [];
  // build up foreign key indexes
  var foreignKeys = [];
  // initialize group number
  var groupNumber = 1;
  // loop through tables
  for (var i = 0; i < data.length; i++) {
    var table = data[i];
    // build up the central table node
    var centralNode = {
      name: table.name,
      type: "title",
      pk: table.primaryKey,
      group: groupNumber,
      size: 32,
      id: table.id
    };
    // push the central node onto the graph
    graph.nodes.push(centralNode);
      //[tableid: index]
    primaryKeys.push([table.id, graph.nodes.length-1]);
    var currentLength = graph.nodes.length-1;
    var fieldCounter = i;
    // loop through the current table's fields
    for (var j = 0; j < table.attrs.length; j++) {
      var field = table.attrs[j];
      fieldCounter++;
      var fieldNode = {
        name: field.id,
        type: "field",
        origin: field.origin,
        group: groupNumber,
        size: 16,
        id: table.id
      };
      // push the field node onto the graph
      graph.nodes.push(fieldNode);
      // push the table/field link onto the graph
      var fieldToTableLink = {"source": currentLength, "target": graph.nodes.length-1, "value": 40};
      graph.links.push(fieldToTableLink);
      // if the field has an origin property, then it must be a FK linked to a PK field
      if (field.origin) {
        // we want to store the current index to check after all tables have been parsed
        // [fieldname: index]
        console.log(field.id.toString()+"-"+(graph.nodes.length-1).toString());
        foreignKeys.push([field.id.toString()+":"+(graph.nodes.length-1).toString(), (graph.nodes.length-1).toString()]);
      }
    }
    groupNumber++; 
  }
  var container = {};
  container.graph = graph;
  container.primaryKeys = primaryKeys;
  container.foreignKeys = foreignKeys;
  return container;
};
var fkLinks = function (graphContainer, data) {
  var primaryKeys = graphContainer.primaryKeys;
  var foreignKeys = graphContainer.foreignKeys;
  console.log(primaryKeys, "PKS");
  console.log(foreignKeys, "FKS")
  var graph = graphContainer.graph;
  data.forEach(function (table) {
    table.attrs.forEach(function (field) {
      var source, target;
      // if it has a defined origin, it is a foreign key to a primary key in another table
      if (field.origin !== undefined) {
        // find the index in nodes of the primary key for that table id
        primaryKeys.forEach(function (pk) {
          if (pk[0] === parseInt(field.origin)) {
            source = pk[1] + 1;
            return;
          }
        });
        // find the index in nodes of the foreign key for that field
        var counter = 0;
        foreignKeys.forEach(function (fk) {
          // [fieldname: index]
          if (field.id.toString()+":"+(fk[1]).toString() === fk[0]) {
            console.log(fk, "FK Match");
            target = fk[1];
            foreignKeys.splice(counter,1);
            counter++;
            return;
          }
        });
      var fieldToFKLink = {"source": source, "target": target, "value": 40};
      graph.links.push(fieldToFKLink);
      }
    });
  });
  return graph;
};

// var testString =   "CREATE TABLE shop (,
//     article INT(4) PRIMARY KEY NOT NULL UNSIGNED ZEROFILL,
//     dealer CHAR(20) NOT NULL,
//     price DOUBLE(16,2) NOT NULL
//   );";
// func to read sql - call on each table
/*{
  "1": {
    "name": "shop",
    "id": 1,
    "attrs": [
      {
        "id": "article",
        "basicType": "Numeric",
        "type": "INT",
        "size": "4",
        "default": "NOT NULL",
        "attributes": [
          "UNSIGNED",
          "ZEROFILL"
        ]
      },
      {
        "id": "dealer",
        "basicType": "String",
        "type": "CHAR",
        "size": "20",
        "default": "NOT NULL"
      },
      {
        "id": "price",
        "basicType": "Numeric",
        "type": "DECIMAL",
        "size": "16,2",
        "default": "NOT NULL"
      }
    ],
    "primaryKey": {
      "id": "article",
      "basicType": "Numeric",
      "type": "INT",
      "size": "4",
      "default": "NOT NULL",
      "attributes": [
        "UNSIGNED",
        "ZEROFILL"
      ]
    }
  }
}*/

// var table1 = "CREATE TABLE shop (
//     item_name CHAR(45) PRIMARY KEY NOT NULL CHARACTER SET,
//     price INT(5) NOT NULL ZEROFILL
//   );"

// var table2 = "CREATE TABLE seller (
//     seller_id INT(45) PRIMARY KEY NOT NULL,
//     shop_item_name CHAR,
//     FOREIGN KEY (shop_item_name) REFERENCES shop(item_name)
//   );";

// Takes in one table and formats it to go into table storage
var inputParser = function (inputTable) {
  var inputArr = inputTable; // placeholder
  // var inputArr = inputTable.split("\n");
  var table = {};
  table.attrs = [];
  var fks = buildFks(inputArr);
  var endIndex = inputArr.length-1;
  if (fks.length > 0) {
    endIndex = inputArr.length-1-fks.length;
  }
  console.log(fks);
  var title = inputArr[0].split(" ");
  title = title[2];
  table.title = title;
  table.id = 1;
  table.primaryKey = {};
  for (var i = 1; i <= endIndex-1; i++) {
    var line = inputArr[i];
    var attr = {};
    var isPrimary = isPrimaryKey(line);
    var zeroFill = hasZeroFill(line);
    var unsigned = isUnsigned(line);
    var notNull = isNotNull(line);
    var autoinc = autoIncrement(line);
    var explicitNull = !notNull && isNull(line);
    var hasOrigin = isForeignKey(line);
    line = line.split(" ");
    attr.id = line[0];
    attr.basicType = typeFormatter(line[1]);
    attr.type = line[1];
    attr.size = sizeFormatter(line[1]);
    // attr.default = ; we aren't supporting defaults currently?
    attr.attributes = [];
    if (zeroFill) {
      attr.attributes.push("ZEROFILL");
    }
    if (unsigned) {
      attr.attributes.push("UNSIGNED");
    }
    if (notNull) {
      attr.attributes.push("NOT NULL");
    }
    if (explicitNull) {
      attr.attributes.push("NULL");
    }
    if (autoinc) {
      attr.attributes.push("AUTO_INCREMENT");
    }
    if (isPrimary) {
      table.primaryKey = attr;
    }
    if (hasOrigin) {
      for (var i = 0; i < fks.length; i++) {
        // check if in foreign keys array, if yes, assign origin
        if (fks[i][0] === attr.id) {
          attr.origin = fks[i][1];
        }
      }
    }
    table.attrs.push(attr);
  }
  return table;
};

// Helper functions
var buildFks = function (inputArr) {
  var fks = [];
  for (var i = 1; i < inputArr.length-1; i++) {
    var line = inputArr[i];
    var lineCopy = line.slice();
    // Build up all fks for table
    if (isForeignKey(line)) {
      var field = sizeFormatter(lineCopy);
      var i = lineCopy.indexOf(")");
      var origin = sizeFormatter(lineCopy.slice(i));
      fks.push([field, origin]);
    }
  }
  return fks;
};
var sizeFormatter = function (basicType) {
  var insideParens = /\(([^)]+)\)/;
  var size = insideParens.exec(basicType)[1];
  return size;
};
var typeFormatter = function (basicType) {
  var i = basicType.indexOf("(");
  return i > 0 ? basicType.slice(0, i) : "";                          
};

var isPrimaryKey = function (string) {
  return string.indexOf("PRIMARY KEY") !== -1;
};
var isNull = function (string) {
  return string.indexOf("NULL") !== -1;
};
var isNotNull = function (string) {
  return string.indexOf("NOT NULL") !== -1;
};
var isUnsigned = function (string) {
  return string.indexOf("UNSIGNED") !== -1;
};
var hasZeroFill = function (string) {
  return string.indexOf("ZEROFILL") !== -1;
};
var autoIncrement = function (string) {
  return string.indexOf("AUTO_INCREMENT") !== -1;
};
var isForeignKey = function (string) {
  return string.indexOf("FOREIGN KEY") !== -1;
};
var inputArr1 = ["CREATE TABLE shop (,","article INT(4) PRIMARY KEY NOT NULL UNSIGNED ZEROFILL,","dealer CHAR(20) NOT NULL,","price DOUBLE(16,2) NULL","FOREIGN KEY (shop_item_name) REFERENCES shop(item_name)", ");"];
var inputArr2 = ["CREATE TABLE shop (,","article INT(4) PRIMARY KEY NOT NULL UNSIGNED ZEROFILL,","dealer CHAR(20) NOT NULL,","price DOUBLE(16,2) NULL", ");"];
var inputArr3 = ["CREATE TABLE seller (", "seller_id INT(45) PRIMARY KEY NOT NULL,", "shop_item_name CHAR(30),", "FOREIGN KEY (shop_item_name) REFERENCES shop(item_name)", ");"];

console.log(inputParser(inputArr2));


























