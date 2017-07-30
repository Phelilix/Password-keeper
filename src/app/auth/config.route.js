(function () {
    'use strict';

    angular
            .module('app.auth')
            .run(appRun);

     appRun.$inject = ['routehelper', 'USER_ROLES'];

    /* @ngInject */
    function appRun(routehelper, USER_ROLES) {
        routehelper.configureRoutes(getRoutes(USER_ROLES));
    }

    function getRoutes(USER_ROLES) {
        return [
            {
                url: '/login',
                config: {
                    templateUrl: 'auth/auth.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'Signing in',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Log in',
                        authorizedRoles: [USER_ROLES.public]
                    }
                }
            }
        ];
    }
})();
