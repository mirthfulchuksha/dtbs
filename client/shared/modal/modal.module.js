var mymodal = angular.module('DTBS.modal', []);


mymodal.controller('ModalCtrl', ['$scope', 'CodeParser', 'd3Save', 'SaveAndRedirectFactory', '$http', function ($scope, CodeParser, d3Save, SaveAndRedirectFactory, $http) {
  $scope.showModal = false;
  $scope.showLoginModal = false;

  $scope.toggleModal = function (){
    $scope.showModal = !$scope.showModal;
  };

  $scope.toggleLoginModal = function () {
    $scope.showLoginModal = !$scope.showLoginModal;
  };

  $scope.saveSVG = function () {    
    // Get the d3js SVG element
    // var tmp = document.getElementById("designer");
    // var svg = tmp.getElementsByTagName("svg")[0];
    // Extract the data as SVG text string
    // var svg_xml = (new XMLSerializer).serializeToString(svg);
    var svg_xml = document.getElementById('designer'); // or whatever you call it
    var serializer = new XMLSerializer();
    var str = serializer.serializeToString(svg_xml);
    // Submit the <FORM> to the server.
    // The result will be an attachment file to download.
    var form = {};
    form['output_format'] = 'pdf';
    form['data'] = str;
    console.log(form);
    d3Save.saveSVG(form);
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
