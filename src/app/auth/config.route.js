(function () {
    'use strict';

    angular
            .module('app.auth')
            .run(appRun);

    appRun.$inject = ['routehelper', 'USER_ROLES'];
    function appRun(routehelper, USER_ROLES) {
        routehelper.configureRoutes(getRoutes(USER_ROLES));
    }

    function getRoutes(USER_ROLES) {
        return [
            {
                url: '/login',
                config: {
                    templateUrl: 'auth/auth/auth.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    title: 'Signing in',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Log in',
                        authorizedRoles: [USER_ROLES.public]
                    }
                }
            },
            {
                url: '/newuser',
                config: {
                    templateUrl: 'auth/create_new_user/create_new_user.html',
                    controller: 'NewUserController',
                    controllerAs: 'vm',
                    title: '(re)creating your account',
                    settings: {
                        authorizedRoles: [USER_ROLES.public]
                    }
                }
            }
        ];
    }
})();
