(function () {
    'use strict';
    
    angular
            .module('app.account')
            .run(LogoutListener);
    
    LogoutListener.$inject = ['$rootScope', 'logger', 'Session', '$location'];
    
    function LogoutListener($rootScope, logger, Session, $location) {
        $rootScope.$on('auth-logout', function () {
            Session.destroy();
            $location.path('/login');
            logger.info('logoutListener was here');
        });
    }
    
})();