angular.module('DTBS', [
  'DTBS.services',
  'DTBS.test',
  'DTBS.modal',
  'DTBS.directives',
  'DTBS.d3',
  'ngRoute'
  ])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: './views/main.html'
    });
});
