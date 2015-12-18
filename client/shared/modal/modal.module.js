var mymodal = angular.module('DTBS.modal', []);


mymodal.controller('ModalCtrl', ['$scope', 'CodeParser', 'SaveAndRedirectFactory', '$http', function ($scope, CodeParser, SaveAndRedirectFactory, $http) {
  $scope.showModal = false;
  $scope.showLoginModal = true;
  $scope.loggingIn = true;
  $scope.db = {lang: "SQL"};

  $scope.$watch(function() { return $location.path(); }, function(newValue, oldValue){
    switch (newValue) {
      case '/login':
        $('#loginModal').openModal();
        break;
      case '/setup':
        $('#setupModal').openModal();
        break;
      default:
    }
  });

  $scope.toggleModal = function (){
    $scope.showModal = !$scope.showModal;
  };

  $scope.toggleLoginModal = function () {
    $scope.showLoginModal = !$scope.showLoginModal;
  };

  $scope.sendUserData = function (options, cb1, cb2) {
    $http(options).success(cb1).error(cb2);
  };

  $scope.user = {};
  $scope.login = function () {
      $scope.user.login = true;
      CodeParser.update(null, null, $scope.user);
      $scope.sendUserData({
        url: '/login',
        method: 'POST',
        data: $scope.user
      }, function (res) {
        $('#loginModal').closeModal();
        $scope.notValid = false;
        $location.path('/setup');
      }, function (res) {
        if (res === 'noUser') {
          $scope.noUser = true;
          $scope.notValid = false;
        } else {
          $scope.notValid = true;
        }
      });
      $scope.user = {};
  };

  $scope.signup = function () {
    CodeParser.update(null, null, $scope.user);
    if ($scope.isMatch()) {
      $scope.sendUserData({
        url: '/signup',
        method: 'POST',
        data: $scope.user
      }, function () {
        $('#loginModal').closeModal();
        $scope.notValid = false;
        $scope.userExist = false;
        $location.path('/setup');
      }, function () {
        $scope.userExist = true;
      });
      $scope.user = {};
    }
  };

  $scope.fetchDBs = function () {
    CodeParser.fetchSchemas();
  };

  $scope.isMatch = function () {
    if ($scope.user.password !== $scope.pass2) {
      $scope.notMatch = true;
      $scope.noUser = false;
      $scope.notValid = false;
      return false;
    } else {
      $scope.notMatch = false;
      return true;
    }
  };

  $scope.githubRedirect = function () {
    SaveAndRedirectFactory.stashTables();
  };

  $scope.updateFactory = function () {
    switch ($scope.db.lang) {
      case "SQL":
        $scope.db.fileName = $scope.db.lang + '_Schema.sql';
        break;
      case "Bookshelf":
        $scope.db.fileName = $scope.db.lang + '_Schema.js';
        break;
      case "Sequelize":
        $scope.db.fileName = $scope.db.lang + '_Schema.js';
        break;
      default:
        $scope.db.fileName = $scope.db.lang + '_Schema.sql';
    }
    $scope.toggleModal();
    CodeParser.update($scope.db);
  };
}]);

mymodal.factory('SaveAndRedirectFactory', ['AccessSchemaService', '$http', function (AccessSchemaService, $http) {

  var stashTables = function () {
    var tables = AccessSchemaService.getTempSchema();
    window.localStorage.setItem('tempTable', JSON.stringify(tables));
  };

  return {
    stashTables: stashTables
  };
}]);

mymodal.directive('modal', function () {
    return {
      template: '<div class="modal fade">' +
          '<div class="modal-dialog">' +
            '<div class="modal-content">' +
              '<div class="modal-header">' +
          '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
          '<h4 class="modal-title">{{ title }}</h4>' +
              '</div>' +
              '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
          '</div>' +
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink (scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function (value) {
          if (value === true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function () {
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function () {
          scope.$apply(function () {
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });
