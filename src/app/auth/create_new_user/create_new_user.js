(function () {
    'use strict';

    angular
            .module('app.auth')
            .controller('NewUserController', NewUserController);

    NewUserController.$inject = ['AuthService', 'logger', '$location', '$scope', 'SpinnerService'];
    function NewUserController(AuthService, logger, $location, $scope, SpinnerService) {
        var vm = this;
        vm.title = '(re)creating user account';
        vm.updateIsPassEqual = isPasswordEqualToConfirmation;
        vm.isPassEqual = true;
        vm.changePass = changePass;
        vm.password = '';
        vm.confirmation = '';
        vm.isBusy = false;
        
        function changePass(pass){
            SpinnerService.showFor(
                AuthService.createNewUser(pass).then(() => {
                    $location.path('/');
                },() => {
                    logger.error('An unexpected error happened while attempting to change password.');
                }),
                $scope,
                vm);
        }

        function isPasswordEqualToConfirmation() {
            vm.isPassEqual = vm.password === vm.confirmation;
        }
    }
})();