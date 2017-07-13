(function() {
    'use strict';

    angular
        .module('app.account')
        .run(appRun);

    // appRun.$inject = ['routehelper']

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'account/account.html',
                    controller: 'Account',
                    controllerAs: 'vm',
                    title: 'account settings',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-lock"></i> Account'
                    }
                }
            }
        ];
    }
})();
