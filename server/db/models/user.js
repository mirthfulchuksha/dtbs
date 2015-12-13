var db = require('../database');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var userModel = mongoose.Schema({
  _id: Number,
  userName: {type: String, required: true},
  password: {
    type: String,
    required: true
  },
  salt: String
});

userModel.methods.comparePasswords = function (password) {
  var savedPassword = this.password;
  // Load hash from your password DB.
  bcrypt.compare(password, savedPassword, function(err, res) {
    if (err) { console.error(err) }
    return res;
  });
};

userModel.pre('save', function (next) {
  if (!this.isModified('password')) {
    return;
  }

  bcrypt.genSalt(function (err, salt) {
    if (err) { console.error(err) }

    bcrypt.hash(this.password, salt, null, function (err, hash) {
      if (err) { console.error(err) }
      this.password = hash;
      this.salt = salt;
    });
  });
});

userModel.plugin(autoIncrement.plugin, 'User');
var User = mongoose.model('User', userModel);

module.exports = User;
