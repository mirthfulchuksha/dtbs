var expect = require('chai').expect;
var request = require('request');

var Schema = require('../server/db/models/schema');

describe('basic test setup', function () {
  var server = 'http://localhost:3000';

  //cleans out test schemas
  beforeEach(function (done) {
    Schema.find({user:"testUser"}).remove(function () {
      done();
    });
  });

  it('can find the index', function (done) {
    request(server + '/', function (err, res) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });

  it('can sign up a user', function (done) {
    var newUser = {
      method: 'POST',
      followAllRedirects: true,
      userName: "testUser",
      password: "testPass"
    }
    request.post({url: server + '/signup', form: newUser}, function (err, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('can save a schema', function (done) {
    var newSchema = {
      method: 'POST',
      followAllRedirects: true,
      dbUser: "testUser",
      dbLang: "mySQL",
      dbName: "testDB",
      tableStorage: {
        name: 'testTable',
        id: 1,
        attrs: [
          {id: 'key1', type: 'integer'}
        ],
        primaryKey : {id: 'key1', type: 'integer'}
      }
    }

    request.post({url: server + '/saveSchema', form: newSchema}, function (err, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('can fetch schemas', function (done) {
    var username = "testUser";
    request(server + "/setup?username=" + username, function (err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
})