angular.module('DTBS', ['ngRoute', 'DTBS.test',])
  .config(function ($routeProvider, $httpProvider) {

    $routeProvider
      .when('/', {
        templateUrl: './views/main.html'
      });
  });
