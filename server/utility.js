var bodyParser = require('body-parser');
var _ = require('underscore');

module.exports = {

  parseTable: function (req, res, next) {
    var tables = req.body.data;
    console.log("req", req.body.data);

    var schema = "";
    for(var i = 0; i < tables.length; i++){
      schema += "\
      CREATE TABLE " + tables[i].name + " (\n";

      var keys = tables[i].attrs;
      for(var key = 0; key < keys.length; key++){
        //Build structured string of SQL table's keys
        schema += "\
        " + keys[key].id + " " + keys[key].type;

        //NOTE: the order of these checks is important
        //size of key's value
        if(keys[key].size) {
          schema += "(" + keys[key].size + ")";
        }

        //NOT NULL for required keys
        if(keys[key].default === "NOT NULL") {
          schema += " " + keys[key].default;
        }

        //Auto incrementing keys
        for(var quality = 0; quality < keys[key].attributes.length; quality++) {
          schema += " " + keys[key].attributes[quality];
        }
        //add comma if there are more keys
        if(key !== keys.length -1){
          schema +=",";
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
    console.log(req.body.data);
    var expr = req.body.data;

    var lineArray = expr.split('\n');

    res.send(lineArray[0], 200);
  },

  parseORMBookshelf: function (req, res, next) {
    var tableList = req.body, relationship;

    var requires = "\
      var knex = require('knex')({client: 'mysql', connection: process.env.MYSQL_DATABASE_CONNECTION }); \n\
      var bookshelf = require('bookshelf')(knex);\n \n";

    var bookshelfStr = _.reduce(tableList, function (str, item) {
      relationship = item.hasMany ? "this.hasMany(" + item.hasMany + ")" : item.belongsToMany ?
        "this.belongsToMany(" + item.belongsToMany + ")" : "this.belongsTo(" + item.belongsTo + ")";
      return str + "\
      db.knex.schema.hasTable('" + item.name.toLowerCase() + "').then(function(exists) { \n\
        if (!exists) { \n\
          db.knex.schema.createTable('" + item.name.toLowerCase() + "', function (table) { \n"
           + _.reduce(item.attrs, function (str, attr) {
                if (attr.primary) {
                  return str + "            table." + attr.type.toLowerCase()
                   + "('" + attr.name.toLowerCase() + "', " + attr.size + ").primary();" + "\n";
                } else {
                  return str + "            table." + attr.type.toLowerCase()
                   + "('" + attr.name.toLowerCase() + "', " + attr.size + ");" + "\n";
                }
              }, "") + "\
          }).then(function (table) { \n\
            console.log('Created Table', table); \n\
          }); \n\
        } \n\
      }); \n \n\
      var " + item.name + " = bookshelf.Model.extend({ \n\
        tableName: '" + item.name.toLowerCase() + "', \n\
        " + (item.hasMany ? item.hasMany.toLowerCase() : item.belongsToMany ?
              item.belongsToMany.toLowerCase() : item.belongsTo.toLowerCase()) +": function() { \n\
            return " + relationship + "; \n\
          } \n\
        });\n \n";
    }, "");

    res.send(requires + bookshelfStr, 200);
  }


};
