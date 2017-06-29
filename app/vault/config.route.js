(function() {
    'use strict';

    angular
        .module('app.vault')
        .run(appRun);

    // appRun.$inject = ['routehelper']

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/vault',
                config: {
                    templateUrl: 'vault/vault.html',
                    controller: 'Vault',
                    controllerAs: 'vm',
                    title: 'the vault',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-lock"></i> Vault'
                    }
                }
            }
        ];
    }
})();
