(function() {
    'use strict';

    angular
        .module('app.account')
        .controller('Account', Account);

    Account.$inject = ['$q', 'accountService', 'logger', '$scope', '$location'];

    function Account($q, accountService, logger, $scope, $location) {

        /*jshint validthis: true */
        var vm = this;
        vm.title = 'Account';
        vm.isPassIdentical = true;
        vm.checkPassword = checkPassword;

        activate();

        function activate() {
            console.log(window.location);
            console.log($location.url());
            console.log($location.path());
            var promises = [Promise.resolve(true)];
//            Using a resolver on all routes or dataservice.ready in every controller
//            return dataservice.ready(promises).then(function(){
            return $q.all(promises).then(function() {
                logger.info('Activated Account View');
            });
        }
        
        function changePassword(){
            accountService.changePassword()
        }
        
        function checkPassword(){
            if(vm.password != vm.passwordDoubleCheck){
                vm.isPassIdentical = false;
            }else{
                vm.isPassIdentical = true;
            }
        }
        
        function verifyPass(){
            logger.info('logging in...');
            accountService.verifyPass(vm.pass).then(isLoggedIn => {
                $scope.$apply(function(){
                    vm.loggedIn = isLoggedIn;
                });
                if(isLoggedIn){
                    logger.success('logged in');
                    loadData();
                }else{
                    logger.warning('failed to log in');
                }
            });
        }
    }
})();