(function () {
    'use strict';

    angular
            .module('app.auth')
            .controller('NewUserController', NewUserController);

    NewUserController.$inject = ['AuthService', 'logger', '$location', '$scope'];
    function NewUserController(AuthService, logger, $location, $scope) {
        var vm = this;
        vm.title = '(re)creating user account';
        vm.updateIsPassEqual = isPasswordEqualToConfirmation;
        vm.isPassEqual = true;
        vm.changePass = changePass;
        vm.password = '';
        vm.confirmation = '';
        
        function changePass(pass){
            AuthService.createNewUser(pass).then(() => {
                $scope.$apply($location.path('/'));
            },() => {
                logger.error('An unexpected error happened while attempting to change password.');
            });
        }

        function isPasswordEqualToConfirmation() {
            vm.isPassEqual = vm.password === vm.confirmation;
        }
    }
})();