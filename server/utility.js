var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var _ = require('underscore');

var sequelizeTypeDict = {
  'Numeric': 'INTEGER',
  'String': 'STRING',
  'DateTime': 'DATE',
  'Bit': 'INTEGER'
};

var bookshelfTypeDict = {
  'Numeric': 'integer',
  'String': 'string',
  'DateTime': 'integer',
  'Bit': 'integer'
};

var mongooseTypeDict = {
  'Number' : 'Number',
  'Numeric': 'Number',
  'String': 'String',
  'Date': 'Date',
  'Buffer': 'Buffer',
  'Boolean' : 'Boolean',
  'Mixed' : 'Mixed',
  'ObjectID' : 'ObjectID',
  'Array' : 'Array' 
};

var basicTypes = { 
    Numeric: [
      "TINYINT", 
      "SMALLINT", 
      "MEDIUMINT",
      "INT",
      "INTEGER",
      "BIGINT",
      "FLOATp",
      "FLOATMD",
      "DOUBLE",
      "DECIMAL"     
    ], 
    String: [
      "CHAR",
      "VARCHAR",
      "TINYTEXT2",
      "TEXT",
      "TEXT2",
      "MEDIUMTEXT2",
      "LONGTEXT2",
      "BINARY",
      "VARBINARY",
      "TINYBLOB",
      "BLOB",
      "MEDIUMBLOB",
      "LONGBLOB",
      "ENUM2",
      "SET2"
    ],
    Bit: [
      "BIT"
    ],
    DateTime: [
      "DATE",
      "DATETIME",
      "TIME",
      "TIMESTAMP",
      "YEAR"
    ]
  }

module.exports = {

  parseTable: function (req, res, next) {
    var tables = req.body.data;
    console.log(tables);

    var schema = "";
    for(var i = 0; i < tables.length; i++){
      schema += "\
  CREATE TABLE " + tables[i].name + " (\n";

      //need to keep track of foreign keys to add references at the end
      var keys = tables[i].attrs;
      var foreignKeys = [];
      for (var key = 0; key < keys.length; key++) {
        //Build structured string of SQL table's keys
        if(keys[key].origin){
          foreignKeys.push(keys[key]);
        }

        schema += "\
    " + keys[key].id + " " + keys[key].type.replace(/,/g, '');

        //NOTE: the order of these checks is important
        //size of key's value
        if (keys[key].size) {
          schema += "(" + keys[key].size + ")";
        }

        //primary key tracking
        if (tables[i].primaryKey && tables[i].primaryKey.id === keys[key].id) {
          schema += " PRIMARY KEY";
        }

        //NOT NULL for required keys
        if (keys[key].default === "NOT NULL") {
          schema += " " + keys[key].default;
        }

        //Auto incrementing keys
        if (keys[key].attributes) {
          for (var quality = 0; quality < keys[key].attributes.length; quality++) {
            schema += " " + keys[key].attributes[quality];
          }
        }
        //add comma if there are more keys
        if (key !== keys.length -1 || foreignKeys.length > 0) {
          schema +=",";
        }
        schema += "\n";
      }

      for(var j = 0; j < foreignKeys.length; j++){
        schema += "\
    FOREIGN KEY (" + foreignKeys[j].id + ") REFERENCES " + tables[+(foreignKeys[j].origin) - 1].name + "(" + tables[+(foreignKeys[j].origin) - 1].primaryKey.id + ")";
        if(j !== foreignKeys.length - 1){
          schema += ",";
        }
        schema += "\n";
      }
      /*
        PRIMARY KEY (uID)\n\
        */
      schema += "\
  );\n\n";
    }
    schema += '\n';
    res.send(schema, 200);

  },

  parseMongo: function (req, res, next) {
    var schema = "";
    var dbName = req.body.dbName;
    console.log(req.body);
    var tableStructArray = req.body.data;
    schema += "use " + dbName + "\n\n";

    for(var tableNum = 0; tableNum < tableStructArray.length; tableNum++) {
      var currTable = tableStructArray[tableNum];
      //this can also be done with options to fix the size of the collection (TODO)
      schema += "db.createCollection(" + currTable.name + ")\n\n";
    }
    res.send(schema, 200);
  },

  parseORMMongoose: function (req, res, next) {
    var schema = "";
    var dbName = req.body.dbName;
    var mongoStruct = req.body.data;
    console.log(mongoStruct);

    schema += "\
  var mongoose = require('mongoose');\n\n";

    for(var collectionNum = 0; collectionNum < mongoStruct.length; collectionNum++){
      var currentCollection = mongoStruct[collectionNum];

      var modelTitle = currentCollection.name + "Model";
      schema += "\
  var " + modelTitle + " = mongoose.Schema({\n";
      for(var key in currentCollection.keys) {
        schema += "\
    "+ key + ": " + mongooseTypeDict[currentCollection.keys[key].type] + ",\n"
      }
      schema +="\
  });\n\n";

      var capitalizedTitle = capitalize(currentCollection.name);
      schema += "\
  var " + capitalizedTitle + " = mongoose.model('" + capitalizedTitle + "', " + modelTitle + ");\n\n"; 
    }
    res.send(schema, 200);
  },

  parseORMSequelize: function (req, res, next) {
    var expr = req.body.data;

    var scheme = 'var Sequelize = require("sequelize"); \n';
    scheme += 'var sequelize = new Sequelize("DB_name", "username", "DB_password");\n\n';

    var tables = req.body.data;
    for (var i = 0; i < tables.length; i++) {
      scheme += 'var ' + tables[i].name + ' = sequelize.define("' + tables[i].name + '", {\n';

      //TODO: keys here
      var keys = tables[i].attrs;
      for (var key = 0; key < keys.length; key++) {
        scheme += '\
  ' + keys[key].id + ': Sequelize.' + sequelizeTypeDict[keys[key].basicType];

        if (key !== keys.length - 1) {
          scheme += ',';
        }
        scheme += '\n';
      }
      //close statement
      scheme += '});\n\n';
    }

    res.send(scheme, 200);
  },

  parseORMBookshelf: function (req, res, next) {
    var tables = req.body.data, relationship;

    var schema = "var knex = require('knex')({client: 'mysql', connection: process.env.MYSQL_DATABASE_CONNECTION });\n";
    schema += "var bookshelf = require('bookshelf')(knex);\n\n";

    _.each(tables, function (table) {
      schema += "db.knex.schema.hasTable('" + table.name.toLowerCase() + "').then(function(exists) {\n" +
        "\tif (!exists) { \n\t\tdb.knex.schema.createTable('" + table.name.toLowerCase() + "', function (table) { \n";
      _.each(table.attrs, function (attr) {
        schema += "\t\t\ttable." + bookshelfTypeDict[attr.basicType] +  "('" + attr.id.toLowerCase() +
          (attr.size ? "', " + Number(attr.size) + ")" : "')");
        if (attr.primary) schema += ".primary()";
        schema += ";\n";
      });
      schema += "\t\t}).then(function (table) {\n\t\t\tconsole.log('Created Table', table);\n\t\t});\n\t}\n});\n\n";
    });

    _.each(tables, function (table) {
      relationship = table.hasMany ? "this.hasMany(" + table.hasMany + ")" :
        table.belongsToMany ? "this.belongsToMany(" + table.belongsToMany + ")" :
          table.belongsTo ? "this.belongsTo(" + table.belongsTo + ")" : null;

      schema += "var " + table.name + " = bookshelf.Model.extend({\n\ttableName: '" + table.name.toLowerCase() + "'";
      if (relationship !== null) {
        schema += ",\n\t" + (table.hasMany ? table.hasMany.toLowerCase() :
          table.belongsToMany ? table.belongsToMany.toLowerCase() : table.belongsTo.toLowerCase()) +
          ": function () {\n\t\treturn " + relationship + "; \n\t}";
      }
      schema += "\n});\n\n";
    });

    res.send(schema, 200);
  },

  buildTables: function (req, res, next) {
    var rawTableData = req.body.data;
    var finishedTableStorage = {};

    //loop through raw data and process it via inputParser()
    for(var tableId in rawTableData) {
      finishedTableStorage[tableId] = inputParser(rawTableData[tableId], tableId);
    }

    //fix for foreign keys pointing to the wrong table
    for(var tableId in finishedTableStorage) {
      var keys = finishedTableStorage[tableId].attrs;
      //init for reference objects
      finishedTableStorage[tableId].foreignKeys = {};
      finishedTableStorage[tableId].regFields = {};

      var fkObj = finishedTableStorage[tableId].foreignKeys; 
      for(var key = 0; key < keys.length; key++) {
        //only execute this mess if the key is a foreign key
        if(keys[key].origin) {
          var originTableName = keys[key].origin;
          //ading to fk obj for the table
          keys[key]["tableName"] = originTableName;
          fkObj[originTableName] = keys[key];
          //find origin
          for(var foreignKeyTable in finishedTableStorage) {
            if(finishedTableStorage[foreignKeyTable].name === originTableName) {
              //change origin to be a table id number instead of a name
              keys[key].origin = parseInt(foreignKeyTable);
            }
          }
        } else if(keys[key] !== finishedTableStorage[tableId].primaryKey) {
          finishedTableStorage[tableId].regFields[keys[key].id] = keys[key];
        }
      }
    }

    res.send({data: finishedTableStorage}, 200);
  }
};

var inputParser = function (inputTable, tableId) {
  var inputArr = inputTable; // placeholder
  // splitting and trimming is already done on the client side
  var table = {};
  table.attrs = [];
  var fks = buildFks(inputArr);
  var endIndex = inputArr.length-1;
  if (fks.length > 0) {
    endIndex = inputArr.length-1-fks.length;
  }
  var title = inputArr[0].split(" ");
  title = title[2];
  table.name = title;
  //this will be passed in from raw data object
  table.id = parseInt(tableId);

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
    line = line.split(" ");
    attr.id = line[0];
    //This is actually not correct, it is too specific for basic type
    attr.type = typeFormatter(line[1]).replace(/,/g, '');
    
    //use type to create basic type attr
    for(var type in basicTypes) {
      if(basicTypes[type].indexOf(attr.type.toUpperCase()) > -1) {
        attr.basicType = type;
      }
    }
    //attr.basicType = typeFormatter(line[1]);
    
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
      //create the format object for FKs
      attr.fkFormat = {
        id: table.name + '_' + attr.id,
        origin: table.id,
        basicType: attr.basicType,
        type: attr.type,
        tableName: table.name
      }
      //place on object
      attr.tableName = table.name;
      table.primaryKey = attr;
    }
    for (var j = 0; j < fks.length; j++) {
      // check if in foreign keys array, if yes, assign origin
      if (fks[j][0] === attr.id) {
        attr.origin = fks[j][1];
      }
    }
    table.attrs.push(attr);
  }
  return table;
};

// Helper functions
var buildFks = function (inputArr) {
  var fks = [];
  for (var i = 1; i < inputArr.length; i++) {
    var line = inputArr[i];
    var lineCopy = line.slice();
    // Build up all fks for table
    if (isForeignKey(line)) {
      var field = sizeFormatter(lineCopy);
      var isolateTableName = lineCopy.split(' ')[4];
      var spot = isolateTableName.indexOf("(");
      var origin = isolateTableName.slice(0, spot);
      fks.push([field, origin]);
    }
  }
  return fks;
};

var capitalize = function (string) {
  return string[0].toUpperCase() + string.slice(1);
}

var sizeFormatter = function (basicType) {
  var insideParens = /\(([^)]+)\)/;
  var executedParse = insideParens.exec(basicType);
  var finalSize;
  if(executedParse) {
    finalSize = executedParse[1];
  } else {
    finalSize = '';
  }
  return finalSize;
};
var typeFormatter = function (basicType) {
  var i = basicType.indexOf("(");
  if(i > 0) {
    return basicType.slice(0, i);
  } else {
    return basicType;
  }                       
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

