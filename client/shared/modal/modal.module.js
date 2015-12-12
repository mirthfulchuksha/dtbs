var mymodal = angular.module('DTBS.modal', []);


mymodal.controller('ModalCtrl', ['$scope', 'CodeParser', 'SaveAndRedirectFactory', '$http', function ($scope, CodeParser, SaveAndRedirectFactory, $http) {
  $scope.showModal = false;
  $scope.showLoginModal = false;

  $scope.toggleModal = function (){
    $scope.showModal = !$scope.showModal;
  };

  $scope.toggleLoginModal = function () {
    $scope.showLoginModal = !$scope.showLoginModal;
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

  $scope.user = {};
  $scope.login = function () {
    $scope.toggleLoginModal();
    $http({
      url: '/login',
      method: 'POST',
      data: $scope.user
    }).success(function (data, status, headers, config) {
      console.log("Logged in!")
    }).error(function (data, status, headers, config) {
      console.log("Cannot log in")
    });
  };

  $scope.githubRedirect = function () {
    console.log("in the redirect");
    SaveAndRedirectFactory.stashTables();
  };

  $scope.db = {};
  $scope.updateFactory = function () {
    switch ($scope.db.lang) {
      case "mySQL":
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
    console.log(tables);
    window.localStorage.setItem('tempTable', JSON.stringify(tables));

    // return $http({
    //     method: 'GET',
    //     url: '/auth/github'
    //   }).then(function (res) {
    //     //???
    //     console.log("does this get called??!");
    //     return res.data;
    //   });
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
