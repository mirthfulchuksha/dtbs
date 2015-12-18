var User = require('./db/models/user');
var Schema = require('./db/models/schema');
var db = require('./db/database');
var bcrypt = require('bcrypt-nodejs');

module.exports = {

  findUser: function (req, res, username, id) {
    username = req.body.userName || (username + '_gh');
    password = req.body.password || id;

    User.findOne({userName: username})
    .exec(function (err, user) {
      if (user || req.body.login) {
        module.exports.login(req, res, username, password, user);
      } else {
        module.exports.signup(req, res, username, password);
      }
    });
  },

  signup: function (req, res, username, password) {
    var newUser = new User({
      userName: username,
      password: password
    });
    newUser.save(function (err, newUser) {
      if (err) return console.error(err);
      console.log("saved!");
      module.exports.genSesh(req, res, newUser);
    });
  },

  login: function (req, res, username, password, user) {
    if (user) {
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) return console.error(err);
        else if (isMatch) module.exports.genSesh(req, res, user);
        else res.send(400, "noMatch");
      });
    } else {
      res.send(400, "noUser");
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
          data: req.body.tableStorage
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
    {name: req.body.dbName, language: req.body.dbLang, data: req.body.tableStorage},
    //options to return updated schema
    {'new': true},
    function (err, schema) {
      if (err) return res.send(500, err);
      //successful update on schema document
      res.send(200, schema);
    });
  },

  fetchSchemas: function (req, res) {
    console.log(req.query.username);
    Schema.find({user: req.query.username}, function (err, schemas) {
      if (err) return console.error(err);
      res.send(schemas);
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
