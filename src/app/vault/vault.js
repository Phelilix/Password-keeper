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
        vm.filterAccountLabel = "";
        vm.filterPocketLabel = "";
        vm.addPocket = addPocket;
        vm.addItem = addItem;
        vm.removePocket = removePocket;
        vm.removeItem = removeItem;
        vm.saveData = saveData;
        vm.pockets = [];

        activate();

        function loadData() {
            AuthService.loadPockets(Session.getPassword()).then(pockets => {
                $scope.$apply(function () {
                    logger.success('Loading complete');
                    init(pockets);
                    vm.pockets = pockets;
                });
            });
        }

        function saveData() {
            AuthService.savePockets(vm.pockets, Session.getPassword()).then(() => {
                logger.success('Saving complete.');
                loadData();
            });
        }
        
        /**
         * adds empty properties if they are missing. 
         * which lessens the need to add null checks in other parts of the program.
         * @param (array of objects) pocketList All my preserved data is structured as a tree. The only accepted parameter is the 'trunk' of that tree.
         * @returns {undefined} This is a procedure, it does not return anything.
         */
        function init(pocketList){
            initPocketList(pocketList);
            
            //pocketList is an array, of objects. members of pocketList are referred to as: pocket
            function initPocketList(pocketList){
                pocketList = pocketList || [];
                angular.forEach(pocketList, function(pocket, key){
                    initPocketOuter(pocket);
                });
            }
            
            //pocketOuter has property salt, which is a string. Property data, which is an object (everything inside data is protected), data is referred to as: account
            function initPocketOuter(pocket){
                pocket.salt = pocket.salt || "";
                pocket.data = pocket.data || {};
                initPocketInner(pocket.data);
            }
            
            //pocketInner has property label, which is a string. Property contents which is an array, of objects. contents is referred to as: account
            function initPocketInner(pocket){
                pocket.label = pocket.label || "";
                pocket.contents = pocket.contents || [];
                angular.forEach(pocket.contents, function(account, key){
                    initAccount(account);
                });
            }
            
            //account has property label, which is a string. Property webLocation, which is a string.Property contents, which is an object. contents are referred to as: credentials
            function initAccount(account){
                account.label = account.label || "";
                account.webLocation = account.webLocation || "";
                account.contents = account.contents || {};
                initCredentials(account.contents);
            }
            
            //contents has property password, which is a string. Property username, which is a string.
            function initCredentials(contents){
                contents.password = contents.password || "";
                contents.username = contents.username || "";
            }
        }

        function addPocket(label) {
            var data = {label: label, contents: []};
            vm.pockets.unshift({data: data});
        }

        function removePocket(pocket) {
            vm.pockets.splice(vm.pockets.indexOf(pocket), 1);
        }

        function addItem(pocket, label, value, weblocation) {
            let newAccount = {label: label, contents: value, webLocation: weblocation};
            pocket.data.contents.push(newAccount);
        }

        function removeItem(pocket, account) {
            pocket.data.contents.splice(pocket.data.contents.indexOf(account), 1);
        }

        function activate() {
/*            Using a resolver on all routes or dataservice.ready in every controller */
/*            return dataservice.ready(promises).then(function(){ */
            loadData();
//            logger.info('Activated Vault View');
        }
    }
})();
