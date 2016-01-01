var User = require('./db/models/user');
var Schema = require('./db/models/schema');
var db = require('./db/database');
var bcrypt = require('bcrypt-nodejs');

module.exports = {

  findUser: function (req, res, username, id) {
    
    username = req.body.userName;
    password = req.body.password;
    User.findOne({userName: username})
    .exec(function (err, user) {
      if (user) {
        module.exports.login(req, res, username, password, user);
      } else {
        //they're coming from github but making a new profile
        res.send(403, "incorrect username");
      }
    });
  },

  githubHandler: function (req, res, username, id) {
    User.findOne({userName: username + '_gh'})
    .exec(function (err, user) {
      if(user) {
        module.exports.login(req, res, username, id, user);
      } else {
        var newUser = new User({
          userName: username + '_gh',
          password: id
        });
        newUser.save(function (err, newUser) {
          if (err) return console.error(err);

          console.log("saved!");
          module.exports.genSesh(req, res, newUser);
        });
      }
    });
  },

  signup: function (req, res) {
    var newUser = new User({
      userName: req.body.userName,
      password: req.body.password
    });

    User.findOne({userName: req.body.userName})
    .exec(function (err, user) {
      if (user) {
        res.send(403, "User already exists");
      } else {
        newUser.save(function (err, newUser) {
          if (err) return console.error(err);
          
          console.log("saved!");
          module.exports.genSesh(req, res, newUser);
        });
      }
    });
  },

  login: function (req, res, username, password, user) {
    if (user) {
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) return console.error(err);
        else if (isMatch) module.exports.genSesh(req, res, user);
        else res.send(401, "incorrect password");
      });
    } else {
      res.send(401, "noUser");
    }
  },

  createSchemaDoc: function (req, res) {
    Schema.findOne({name:req.body.dbName})
    .exec(function (err, schema) {
      if (schema === null) {
        var newSchema = new Schema({
          user: req.body.dbUser,
          name: req.body.dbName,
          language: req.body.dbLang,
          data: req.body.tableStorage,
          graph: req.body.graphLayout
        });
        newSchema.save(function (err, newSchema) {
          if (err) {
            return console.error(err);
          } else {
            console.log(newSchema, 'saved!');
            res.send(201, newSchema);
          }
        });
      } else {
        module.exports.updateSchemaDoc(req, res);
      }
    });
  },

  updateSchemaDoc: function (req, res) {
    Schema.findOneAndUpdate(
    //query
    {name: req.body.dbName}, 
    //update
    {user: req.body.dbUser, name: req.body.dbName, language: req.body.dbLang, data: req.body.tableStorage, graph: req.body.graphLayout},
    //options to return updated schema
    {'new': true},
    function (err, schema) {
      if (err) return res.send(304, err);
      //successful update on schema document
      res.send(200, schema);
    });
  },

  fetchSchemas: function (req, res) {
    Schema.find({user: req.query.username}, function (err, schemas) {
      if (err) return console.error(err);
      res.send(schemas);
    });
  },

  fetchOneSchema: function (req, res) {
    Schema.findOne({user: req.query.username, name: req.query.schema}, function (err, schema) {
      res.send(200, schema);
    });
  },

  genSesh: function (req, res, user) {
    if (req.session) {
      req.session.regenerate(function () {
        req.session.user = user;
        console.log("Session created! ", req.session.user, "WOO");
        if (req.body.userName) res.send(200);
      });
    }
  }

};
