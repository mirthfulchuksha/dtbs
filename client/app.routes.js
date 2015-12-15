angular.module('DTBS', [
  'DTBS.main',
  'DTBS.modal',
  'ngRoute'
  ])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: './components/getStarted/splash/splash.html'
    })
    .when('/start', {
      templateUrl: './components/getStarted/start/start.html'
    })
    .when('/login', {
      templateUrl: './components/getStarted/login/login.html',
      controller: 'ModalCtrl'
    })
    .when('/signup', {
      templateUrl: './components/getStarted/signup/signup.html'
    })
    .when('/try', {
      templateUrl: './components/getStarted/setup/setup.html'
    })
    .when('/new', {
      templateUrl: './components/getStarted/setup/setup.html'
    })
    .when('/saved', {
      templateUrl: './components/getStarted/saved/saved.html'
    })
    .when('/mongo', {
      templateUrl: './components/mongo/mongo.html'
    })
    .when('/sql', {
      templateUrl: './components/sql/sql.html'
    })
    .when('/table', {
      templateUrl: './components/form/formView.html'
    });
});
