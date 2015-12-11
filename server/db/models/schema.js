var db = require('../database');
var mongoose = require('mongoose');

var schemaModel  = mongoose.Schema({
  user: String,
  name: String,
  language: String,
  data: {}
});

var Schema = mongoose.model('Schema', schemaModel);

module.exports = Schema;
