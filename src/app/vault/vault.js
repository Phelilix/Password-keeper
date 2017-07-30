(function () {
    'use strict';

    angular
            .module('app.vault')
            .controller('Vault', Vault);

    Vault.$inject = ['AuthService', 'logger', '$scope', '$route', '$location', 'Session'];
    function Vault(AuthService, logger, $scope, $route, $location, Session) {
        /*jshint validthis: true */

        var vm = this;
        vm.title = 'Vault';
        vm.loggedIn = false;
        vm.addPocket = addPocket;
        vm.addItem = addItem;
        vm.removePocket = removePocket;
        vm.removeItem = removeItem;
        vm.saveData = saveData;
        vm.data = [];

        activate();

        function loadData() {
            logger.info('loading...');
            AuthService.loadPockets(Session.getPassword()).then(pockets => {
                $scope.$apply(function () {
                    vm.data = pockets;
                });
                logger.success('loading complete.')
            });
        }

        function saveData() {
            logger.info('saving...');
            AuthService.savePockets(vm.data, Session.getPassword()).then(() => {
                logger.success('Saving complete.');
                loadData();
            });
        }

        function addPocket(subject) {
            var data = {subject: subject};
            vm.data.push({data: data});
        }

        function removePocket(index) {
            vm.data.splice(index, 1);
        }

        function addItem(index, item, value) {
            vm.data[index].data[item] = value;
        }

        function removeItem(pocketIndex, itemKey) {
            delete vm.data[pocketIndex].data[itemKey];
        }

        function activate() {
/*            Using a resolver on all routes or dataservice.ready in every controller */
/*            return dataservice.ready(promises).then(function(){ */
            loadData();
            logger.info('Activated Vault View');
        }
    }
})();
