var User = require('./db/models/user');
var Schema = require('./db/models/schema');
var db = require('./db/database');

module.exports = {

  createUserDoc: function (req, res, username) {
    User.findOne({userName: username})
    .exec(function (err, user) {
      if (user === null) {
        var newUser = new User({
          userName: username
        });
        newUser.save(function (err, newUser) {
          if (err) {
            return console.error('upload failed:', err);
          } else {
            console.log(newUser, ' Signed in!');
            if (req.session) module.exports.login(req, res, newUser);
          }
        });
      } else {
        console.log(user, ' Signed in!');
        if (req.session) module.exports.login(req, res, user);
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
            return console.error('upload failed:', err);
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

  isLoggedIn: function (req, res) {
    return req.session ? !!req.session.user : false;
  },

  checkUser: function (req, res) {
    if (!module.exports.isLoggedIn(req)) {
      return false;
    } else {
      console.log("User already logged in!");
      return true;
    }
  },

  login: function (req, res, user) {
    if (!module.exports.checkUser(req, res)) {
      return req.session.regenerate(function () {
        req.session.user = user;
        console.log("Session created!");
      });
    }
  },

  logOut: function (req, res) {
    req.session.destroy(function () {
      console.log("Session detroyed!");
    });
  }

};
