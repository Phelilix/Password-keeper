(function () {
    'use strict';

    angular
            .module('app.account')
            .controller('Account', Account);

    Account.$inject = ['$q', 'AuthService', 'logger', '$scope', '$location'];

    function Account($q, AuthService, logger, $scope, $location) {

        /*jshint validthis: true */
        var vm = this;
        vm.title = 'Account';
        vm.isPassEqual = true;
        vm.isEqual = isPasswordEqualToConfirmation;
        vm.changePass = changePassword;
        vm.password = {password: '', confirmation: ''};
        vm.oldPassword = '';

        activate();

        function activate() {
            var promises = [Promise.resolve(true)];
            /*Using a resolver on all routes or dataservice.ready in every controller*/
            /*return dataservice.ready(promises).then(function(){*/
            return $q.all(promises).then(function () {
                logger.info('Activated Account View');
            });
        }

        function changePassword() {
            
                AuthService.changePassword(vm.oldPassword, vm.password.password).then(function(){
                    logger.success('changed password');
                    $location.path('/login');
                }, function(){
                    logger.info('could not change password.');
                });
        }

        function isPasswordEqualToConfirmation() {
                vm.isPassEqual = vm.password.password === vm.password.confirmation;
        }
    }
})();