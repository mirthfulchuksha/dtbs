var User = require('./db/models/user');
var Schema = require('./db/models/schema');
var db = require('./db/database');

module.exports = {

  createUserDoc: function (req, res, username) {
    username = username || req.body.userName;
    User.findOne({userName: username})
    .exec(function (err, user) {
      if (user === null) {
        var newUser = new User({
          userName: username,
          password: req.body.password
        });
        newUser.save(function (err, newUser) {
          if (err) {
            return console.error('upload failed:', err);
          } else {
            console.log(newUser, ' Signed in!');
          }
        });
      } else {
        if (req.session && user.comparePasswords(req.body.password)) {
          module.exports.login(req, res, user);
        }
      }
    });
  },

  createSchemaDoc: function (req, res) {
    Schema.findOne({name:req.body.dbName})
    .exec(function (err, schema) {
      if (schema === null) {
        var newSchema = new Schema({
          name: req.body.dbName,
          language: req.body.dbLang,
          data: req.body.tableStorage
        });
        newSchema.save(function (err, newSchema) {
          if (err) {
            return console.error('upload failed:', err);
          } else {
            console.log('saved!');
          }
        });
      } else {
        req.body._id = schema._id;
        module.exports.updateSchemaDoc(req, res);
      }
    });
  },

  updateSchemaDoc: function (req, res) {
    Schema.findOneAndUpdate({
      name: req.body.dbName,
    },
    {
      language: req.body.dbLang,
      data: req.body.tableStorage
    }, function (err, schema) {
      if (err) return res.send(500, err);
      console.log("updated!");
    });
  },

  isLoggedIn: function (req, res) {
    return req.session ? !!req.session.user : false;
  },

  login: function (req, res, user) {
    if (!module.exports.isLoggedIn(req, res)) {
      return req.session.regenerate(function () {
        req.session.user = user;
        console.log("Session created!");
        res.send(200);
      });
    } else {
      console.log("User already logged in!");
      res.send(200);
    }
  },

  logOut: function (req, res) {
    req.session.destroy(function () {
      console.log("Session detroyed!");
    });
  }

};
