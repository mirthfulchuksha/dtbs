var db = require('../database');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var userModel = mongoose.Schema({
  _id: Number,
  userName: {type: String, required: true}
});

userModel.plugin(autoIncrement.plugin, 'User');
var User = mongoose.model('User', userModel);

module.exports = User;
