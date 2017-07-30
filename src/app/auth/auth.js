(function () {
    'use strict';

    angular
            .module('app.auth')
            .controller('LoginController', LoginController);

    LoginController.$inject = ['AuthService', 'logger', '$location', '$scope'];

    function LoginController(AuthService, logger, $location, $scope) {
        var vm = this;
        vm.login = login;
        vm.credentials = {password: ''};
        
        function login(credentials) {
            AuthService.login(credentials).then(function (pass) {
                logger.success('logged in');
                console.log('succeeded in logging in');
                $scope.$apply($location.path('/'));
            }, function () {
                logger.info('failed to log in');
                console.log('failed in logging in');
            });
        }
    }
})();