angular.module('DTBS', ['ngRoute', 'DTBS.test', 'DTBS.modal'])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: './views/main.html'
    });
});
