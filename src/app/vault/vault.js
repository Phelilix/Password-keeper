(function() {
    'use strict';

    angular
        .module('app.vault')
        .controller('Vault', Vault);

    /* @ngInject */
    function Vault(dataservice, logger) {
        /*jshint validthis: true */
        var vm = this;
        vm.avengers = [];
        vm.title = 'Vault';

        activate();

        function activate() {
//            Using a resolver on all routes or dataservice.ready in every controller
//            var promises = [getAvengers()];
//            return dataservice.ready(promises).then(function(){
//            return getAvengers().then(function() {
                logger.info('Activated Vault View');
//            });
        }

//        function getAvengers() {
//            return dataservice.getAvengers().then(function(data) {
//                vm.avengers = data;
//                return vm.avengers;
//            });
//        }
    }
})();
