var bodyParser = require('body-parser');

module.exports = {

  parseTable: function (req, res, next) {
    var table = req.body;

    var schema = "\
    CREATE TABLE users (\n\
      uID int NOT NULL AUTO_INCREMENT,\n\
      username varchar(20),\n\
      PRIMARY KEY (uID)\n\
    );";

    res.send(schema, 200);

  }

};
