(function () {
    'use strict';

    angular
            .module('app.layout')
            .controller('Shell', Shell);

    Shell.$inject = ['$timeout', 'config', 'logger', 'Session', '$rootScope', '$scope'];

    function Shell($timeout, config, logger, Session, $rootScope, $scope) {
        /*jshint validthis: true */
        var vm = this;

        vm.title = config.appTitle;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;
        vm.isAuthenticated = Session.isAuthenticated();
        
        activate();

        function activate() {
            logger.success(config.appTitle + ' loaded!', null);
/*            Using a resolver on all routes or dataservice.ready in every controller */
/*            dataservice.ready().then(function(){ */
/*                hideSplash(); */
/*            }); */
            eventListeners();
            hideSplash();
        }

        function hideSplash() {
            /* Force a 1 second delay so we can see the splash. */
            $timeout(function () {
                vm.showSplash = false;
            }, 1000);
        }
        
        function eventListeners() {
            $rootScope.$on('auth-login-success', function (event) {
                updateIsAuthenticated();
            });
            $rootScope.$on('auth-logout', function(){
                updateIsAuthenticated();
            });
            
            function updateIsAuthenticated(){
                $scope.$apply(function(){
                    vm.isAuthenticated = Session.isAuthenticated();
                });
            }
        }
    }
})();
