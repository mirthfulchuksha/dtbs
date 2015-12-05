
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
        " + keys[key].name + " " + keys[key].type;

        //NOTE: the order of these checks is important
        //size of key's value
        if(keys[key].size) {
          schema += "(" + keys[key].size + ")"; 
        }

        //NOT NULL for required keys
        if(keys[key].required) {
          schema += " NOT NULL"
        }

        //Auto incrementing keys
        if(keys[key].autoInc) {
          schema += " AUTO_INCREMENT"
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
  }

};
