(function() {
    'use strict';

    angular
        .module('app.vault')
        .controller('Vault', Vault);

        Vault.$inject = ['vaultService', 'logger', '$scope', '$route', '$location'];
        
    /* @ngInject */
    function Vault(vaultService, logger, $scope, $route, $location) {
        /*jshint validthis: true */
//        var pockets = vaultService.fetchPockets('src/app/vault/data.json');
//        var fetchPocketsVar = vaultService.fetchPockets('src/app/vault/data.json');
//        var getInformatiVar = vaultService.getInformation();
//        var promiseInforVar = vaultService.promiseInformation(location, pockets, pass);
        
        var vm = this;
        vm.title = 'Vault';
        vm.loggedIn = false;
        vm.pass = '20060003238870DaeNhem10';
        vm.addPocket = addPocket;
        vm.addItem = addItem;
        vm.removePocket = removePocket;
        vm.removeItem = removeItem;
        vm.saveData = saveData;
        
        activate();
        
        function loadData(){
            logger.info('loading...')
            vaultService.fetchPockets().then(function(pockets){
                $scope.$apply(function(){
                    vm.data = vaultService.decryptPockets(pockets,vm.pass);
                });
                logger.success('loading complete.')
            });
        }
        
        function saveData(){
            logger.info('saving...')
            vaultService.encryptPockets(vm.data, vm.pass).then((pockets) => {
                vaultService.savePockets(pockets);
                logger.success('Save complete.');
                loadData();
            });
        }
        
        function addPocket(subject){
            var data = {subject: subject};
            vm.data.push({data: data});
        }
        
        function removePocket(index){
            vm.data.splice(index, 1);
        }
        
        function addItem(index, item, value){
            vm.data[index].data[item] = value;
        }
        
        function removeItem(pocketIndex, itemKey){
            delete vm.data[pocketIndex].data[itemKey];
        }
        
//        function changePassword(){
//            vaultService.readFile('account/passDigest')
//        }

        function activate() {
            console.log(window.location);
            console.log($location.url());
            console.log($location.path());
            console.log($route.current);
//            Using a resolver on all routes or dataservice.ready in every controller
//            return dataservice.ready(promises).then(function(){
            logger.info('Activated Vault View');
//            vaultService.fetch();
        }
    }
})();
