var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var util = require('./utility');

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));


app.post('/update', function (req, res, next) {
  util.parseTable(req, res, next);
});

app.post('/parse', function (req, res, next) {
  util.parseORMSequelize(req, res, next);
});

app.post('/bookshelf', function (req, res, next) {
  util.parseORMBookshelf(req, res, next);
});

app.listen(port);

console.log('Server listening on port: ' + port);

module.exports = app;
