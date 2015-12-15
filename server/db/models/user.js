var db = require('../database');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var bcrypt = require('bcrypt-nodejs');

var userModel = mongoose.Schema({
  _id: Number,
  userName: {type: String, required: true},
  password: {
    type: String,
    required: true
  },
  salt: String
});

userModel.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {
    return;
  }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { console.error(err); }

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) { console.error(err); }
      user.password = hash;
      user.salt = salt;
      return next(user);
    });
  });
});

userModel.plugin(autoIncrement.plugin, 'User');
var User = mongoose.model('User', userModel);

module.exports = User;
