angular.module('DTBS', [
  'DTBS.main',
  'DTBS.modal',
  'ngRoute'
  ])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    // .when('/', {
    //   templateUrl: './components/form/formView.html'
    // });
  .when('/', {
    templateUrl: './components/getStarted/splash/splash.html'
  })
  .when('/login', {
    templateUrl: './components/getStarted/login/login.html',
    controller: 'ModalCtrl'
  })
  .when('/signup', {
    templateUrl: './components/getStarted/signup/signup.html',
    controller: 'ModalCtrl'
  })
  .when('/setup', {
    templateUrl: './components/getStarted/setup/setup.html',
    controller: 'ModalCtrl'
  })
  .when('/mongo', {
    templateUrl: './components/mongo/mongo.html',
    controller: 'MongoController'
  })
  .when('/sql', {
    templateUrl: './components/sql/sql.html'
  })
  .when('/table', {
    templateUrl: './components/form/formView.html'
  })
  .when('/test', {
    templateUrl: './components/test/test.html'
  });
});
