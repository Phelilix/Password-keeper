(function () {
    'use strict';

    angular
            .module('app.vault')
            .run(appRun);

     appRun.$inject = ['routehelper', 'USER_ROLES'];

    function appRun(routehelper, USER_ROLES) {
        routehelper.configureRoutes(getRoutes(USER_ROLES));
    }

    function getRoutes(USER_ROLES) {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'vault/vault.html',
                    controller: 'Vault',
                    controllerAs: 'vm',
                    title: 'the vault',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-lock"></i> Vault',
                        authorizedRoles: [USER_ROLES.accountHolder]
                    }
                }
            }
        ];
    }
})();
