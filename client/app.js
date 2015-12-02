angular.module('DTBS', ['ngRoute'])
  .config(function ($routeProvider, $httpProvider) {

    $routeProvider
      .when('/', {
        templateUrl: './views/main.html'
      });
  });