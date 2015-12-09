var mymodal = angular.module('DTBS.modal', []);

mymodal.controller('ModalCtrl', ['$scope', 'CodeParser', function ($scope, CodeParser) {
  $scope.showModal = false;
  $scope.toggleModal = function(){
      $scope.showModal = !$scope.showModal;
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
    CodeParser.setDb($scope.db);
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
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });
