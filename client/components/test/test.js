angular.module('foundationDemoApp', ['mm.foundation']);
angular.module('foundationDemoApp').controller('ModalDemoCtrl', function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function () {

    var modalInstance = $modal.open({
      template: '<h3>Im a modal!</h3>'+
                      '<ul>'+
                        '<li ng-repeat="item in items">' +
                          '<a ng-click="selected.item = item">{{ item }}</a>' +
                        '</li>' +
                      '</ul>' +
                      '<p>Selected: <b>{{ selected.item }}</b></p>' +
                      '<button class="button secondary" ng-click="reposition()">Reset top position</button>' +
                      '<button class="button" ng-click="ok()">OK</button>' +
                      '<a class="close-reveal-modal" ng-click="cancel()">&#215;</a>',

      controller: 'ModalInstanceCtrl',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('foundationDemoApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.reposition = function () {
    $modalInstance.reposition();
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
