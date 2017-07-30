(function () {
    'use strict';

    angular
            .module('app.services')
            .factory('AuthEventBroadcastService', AuthEventBroadcastService);

    AuthEventBroadcastService.$inject = ['$rootScope', 'AUTH_EVENTS'];
    function AuthEventBroadcastService($rootScope, AUTH_EVENTS) {
        return {
            loginSuccess: loginSuccess,
            loginFailed: loginFailed,
            notAuthenticated: notAuthenticated,
            notAuthorized: notAuthorized,
            logOut: logOut
        };

        function loginSuccess() {
            return $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }

        function loginFailed() {
            return $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        }
        
        function notAuthorized(){
            return $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
        }
        
        function notAuthenticated(){
            return $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        }
        
        function logOut(){
            return $rootScope.$broadcast(AUTH_EVENTS.logout);
        }
    }
})();