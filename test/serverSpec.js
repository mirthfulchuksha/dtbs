var expect = require('chai').expect;
var request = require('request');

describe('basic test setup', function () {
  var server = 'http://localhost:3000';
  it('can run the test suite', function (done) {
    expect(1).to.equal(1);
    done();
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
})