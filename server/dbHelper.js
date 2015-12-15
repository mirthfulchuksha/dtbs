var User = require('./db/models/user');
var Schema = require('./db/models/schema');
var db = require('./db/database');
var bcrypt = require('bcrypt-nodejs');

module.exports = {

  createUserDoc: function (req, res, next, username, id) {
    username = req.body.userName || (username + '_gh');
    password = req.body.password || id;
    User.findOne({userName: username})
    .exec(function (err, user) {
      if (user === null) {
        var newUser = new User({
          userName: username,
          password: password
        });
        newUser.save(function (err, newUser) {
          if (err) return console.error(err);
          console.log("saved!");
          module.exports.login(req, res, newUser);
        });
      } else {
        bcrypt.compare(password, user.password, function (err, isMatch) {
          if (err) return console.error(err);
          else if (isMatch) module.exports.login(req, res, user);
        });
      }
    });
  },

  createSchemaDoc: function (req, res) {
    Schema.find({name:req.body.dbName})
    .exec(function (err, schema) {
      if (schema === null) {
        var newSchema = new Schema({
          name: req.body.name,
          language: req.body.lang,
          data: req.body.tableStorage
        });
        newSchema.save(function (err, newSchema) {
          if (err) {
            return console.error(err);
          } else {
            console.log(newSchema, 'saved!');
          }
        });
      } else {
        module.exports.updateSchemaDoc(req, res);
      }
    });
  },

  updateSchemaDoc: function (req, res) {
    Schema.findOneAndUpdate({
      name: req.body.dbName,
      language: req.body.dbLang,
      data: req.body.tableStorage
    }, function (err, schema) {
      if (err) return res.send(500, err);
      console.log("Updated Schema!");
    });
  },

  login: function (req, res, user) {
    if (req.session) {
      req.session.regenerate(function () {
        req.session.user = user;
        console.log("Session created! ", req.session.user, "WOO");
        if (req.body.userName) res.send(200);
      });
    }
  }

};
