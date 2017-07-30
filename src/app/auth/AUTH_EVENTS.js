(function () {
    'use strict';
    
    angular
            .module('app.auth')
            .constant('AUTH_EVENTS', {
                loginSuccess: 'auth-login-success',
                loginFailed: 'auth-login-failed',
                logout: 'auth-logout',
                sessionTimeout: 'auth-session-timeout',
                notAuthenticated: 'auth-not-authenticated',
                notAuthorized: 'auth-not-authorized'
            });
})();