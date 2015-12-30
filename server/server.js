
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var util = require('./utility');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

var helper = require('./dbHelper');
var session = require('express-session');

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/../client'));
app.use(session({
  secret: 'nyan cat',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//env variables for oauth
var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'nope';
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'nope';

/*
  passport initialization
*/

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//GITHUB STRATEGY
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://dtbs.herokuapp.com/auth/callback",
    passReqToCallback: true
  },
  function (req, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // passes profile to callback for user creation or login
      return done(null, profile);
    });
  }
));

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

app.get('/auth/callback',
  passport.authenticate('github', { failureRedirect: '/#/login' }),
  function(req, res) {
    var username = res.req.user.username;
    var id = res.req.user.id;
    //special function to handle github logins because they have no password
    helper.githubHandler(req, res, username, id);
    res.redirect('/#/setup');
  });

app.post('/login', function (req, res) {
  helper.findUser(req, res);
});

app.get('/logout', function (req, res) {
  //access token revocation needed for oauth users
  req.session.destroy(function () {
    res.redirect('/');
  });
});

app.post('/signup', function (req, res) {
  helper.signup(req, res);
});

app.get('/setup', function (req, res) {
  console.log("HERE")
  helper.fetchSchemas(req, res);
});

app.get('/loadSchema', function (req, res) {
  helper.fetchOneSchema(req, res);
});

/*
  Parsing paths
*/

app.post('/update', function (req, res, next) {
  util.parseTable(req, res, next);
});

app.post('/mongoCode', function (req, res, next) {
  util.parseMongo(req, res, next);
});

app.post('/mongoose', function (req, res, next) {
  util.parseORMMongoose(req, res, next);
});

app.post('/build', function (req, res, next) {
  util.buildTables(req, res, next);
});

app.post('/bookshelf', function (req, res, next) {
  util.parseORMBookshelf(req, res, next);
});

app.post('/sequelize', function (req, res, next){
  util.parseORMSequelize(req, res, next);
});

app.post('/saveSchema', helper.createSchemaDoc);

app.listen(port);

console.log('Server listening on port: ' + port);

module.exports = app;