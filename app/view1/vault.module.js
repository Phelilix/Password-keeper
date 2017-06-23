'use strict';

angular.module('vault', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/vault', {
    templateUrl: 'vault/vault.html',
    controller: 'vault-controller'
  });
}]);