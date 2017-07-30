(function () {
    'use strict';

    angular
            .module('app.account')
            .run(appRun);

     appRun.$inject = ['routehelper', 'USER_ROLES'];

    function appRun(routehelper, USER_ROLES) {
        routehelper.configureRoutes(getRoutes(USER_ROLES));
    }

    function getRoutes(USER_ROLES) {
        return [
            {
                url: '/account',
                config: {
                    templateUrl: 'account/account.html',
                    controller: 'Account',
                    controllerAs: 'vm',
                    title: 'account settings',
                    settings: {
                        authorizedRoles: [USER_ROLES.accountHolder]
                    }
                }
            }
        ];
    }
})();
