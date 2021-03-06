var mymodal = angular.module('DTBS.modal', []);


mymodal.controller('ModalCtrl', ['$scope', 'CodeParser', 'SaveAndRedirectFactory', '$http', '$location', function ($scope, CodeParser, SaveAndRedirectFactory, $http, $location) {
  $scope.showModal = false;
  $scope.loggingIn = true;

  $scope.db = {lang: "SQL"};

  $scope.toggleModal = function (){
    $scope.showModal = !$scope.showModal;
  };

  $scope.savedSchemas = [];
  var showSavedSchemas = function () {
    CodeParser.fetchSchemas(function (res) {
      $scope.savedSchemas = res;
    });
  };

  //this loads user schema and needs to be run on init
  showSavedSchemas();

  $scope.loadSchema = function () {
    CodeParser.fetchOneSchema($scope.dbpicker, function (schema) {
      //put retrieved schema into local storage to be pulled out by recoverinfo()
      window.localStorage.setItem('tempTable', JSON.stringify(schema));
      if(schema.language === 'SQL') {
        $location.path('/sql');
      } else {
        $location.path('/mongo');
      }
    });
  };

  $scope.saveSVG = function () {
    var svg_xml = document.getElementById('designer');
    var serializer = new XMLSerializer();
    var str = serializer.serializeToString(svg_xml);

    // Create a canvas
    var canvas = document.createElement('canvas');
    canvas.height = 350;
    canvas.width = 640;
    canvas.style.background = 'white';

    canvg(canvas, str);
    context = canvas.getContext("2d");

    // set to draw behind current content
    context.globalCompositeOperation = "destination-over";

    // set background color
    context.fillStyle = '#fff';

    // draw background / rect on entire canvas
    context.fillRect(0, 0, canvas.width, canvas.height);
    var a = document.createElement('a');
    a.href = canvas.toDataURL("schemas/png");
    a.download = 'schemas.png';
    a.click();
    a.remove();
    canvas.remove();
  };

  $scope.sendUserData = function (options, cb1, cb2) {
    $http(options).success(cb1).error(cb2);
  };

  $scope.user = {};
  $scope.login = function () {
      $scope.user.login = true;
      localStorage.user = $scope.user.userName;
      CodeParser.update(null, null, $scope.user);
      $scope.sendUserData({
        url: '/login',
        method: 'POST',
        data: $scope.user
      }, function (res) {
        $scope.notValid = false;
        $scope.loggedIn = true;
        $location.path('/setup');
        //trying to fetch
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
      case "Mongoose":
        $scope.db.fileName = $scope.db.lang + '_Schema.js';
        break;
      case "Mongo":
        $scope.db.fileName = $scope.db.lang + '_Schema.txt';
        break;
      default:
        $scope.db.fileName = $scope.db.lang + '_Schema.sql';
    }
    $scope.toggleModal();
    CodeParser.update($scope.db);
  };

  $scope.setup = function () {
    $scope.updateFactory();
    var path = $scope.db.lang === 'SQL' ? '/sql' : '/mongo';
    $location.path(path);
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
