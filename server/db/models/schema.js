var db = require('../database');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var schemaModel  = mongoose.Schema({
  _id: Number,
  user: String,
  name: String,
  language: String,
  data: {}
});

schemaModel.plugin(autoIncrement.plugin, 'Schema');
var Schema = mongoose.model('Schema', schemaModel);

module.exports = Schema;
