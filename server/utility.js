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
}

module.exports = {

  parseTable: function (req, res, next) {
    var tables = req.body.data;
    console.log("req", req.body.data);

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
          console.log("found a fkey", foreignKeys);
        }

        schema += "\
    " + keys[key].id + " " + keys[key].type;

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
  }
};
