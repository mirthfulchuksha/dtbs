angular.module('DTBS', [
  'DTBS.main',
  'DTBS.modal',
  'ngRoute'
  ])
.config(function ($routeProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: './components/form/formView.html'
    });
});
