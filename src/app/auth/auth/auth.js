(function () {
    'use strict';

    angular
            .module('app.auth')
            .controller('LoginController', LoginController);

    LoginController.$inject = ['AuthService', 'logger', '$location', '$scope', 'SpinnerService'];
    function LoginController(AuthService, logger, $location, $scope, SpinnerService) {
        redirectIfNeededInThisCase();

        var vm = this;
        vm.login = login;
        vm.credentials = {password: ''};
        vm.isBusy = false;

        function login(credentials) {
            SpinnerService.showFor(
                AuthService.login(credentials).then(
                    function (pass) {
                        logger.success('logged in');
                        $location.path('/');
                    },
                    function (err) {
                        logger.info('failed to log in');
                    }
                ),
                $scope,
                vm
            );
        }

        function redirectIfNeededInThisCase() {
            if (!AuthService.passwordFileExists()) {
                $location.path('/newuser');
            }
        }
    }
})();