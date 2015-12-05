angular.module('DTBS', [
  'DTBS.main',
  'DTBS.modal',
  // 'DTBS.directives',
  // 'DTBS.d3',
  'ngRoute'
  ])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: './views/main.html'
    });
});
