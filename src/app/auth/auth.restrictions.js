(function () {
    'use strict';
    
    angular
            .module('app.auth')
            .run(AuthRestrictions);
    
    AuthRestrictions.$inject = ['$rootScope', 'AuthEventBroadcastService', 'AuthService', 'Session', '$location'];
    
    function AuthRestrictions($rootScope, AuthEventBroadcastService, AuthService, Session, $location) {
        $rootScope.$on('$routeChangeStart', function (event, next) {
            var authorizedRoles = next.settings.authorizedRoles;
            
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (Session.isAuthenticated()) {
                    /* user is not allowed */
                    AuthEventBroadcastService.notAuthorized();
                } else {
                    /* user is not logged in */
                    AuthEventBroadcastService.notAuthenticated();
                }
                $location.path('/login');
            }
        });
    }
    
})();