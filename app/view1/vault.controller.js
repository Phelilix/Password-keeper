(function() {
    'use strict';
    angular
        .module('vault')
        .controller('vault-controller', vaultController);
//    vaultController.$inject = [];
    
    function vaultController($scope) {
        var vm = this;
        vm.title = 'vault';
        $scope.somevariable = 'habhaio';
        activate();
        ////////////////
        function activate() {
        }
    }
})();
