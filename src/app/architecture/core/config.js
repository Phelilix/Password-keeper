(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[Error] ', /* Configure the exceptionHandler decorator */
        appTitle: 'Password keeper',
        version: '1.0.0'
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', '$routeProvider', 'routehelperConfigProvider', 'exceptionHandlerProvider'];
    function configure($logProvider, $routeProvider, routehelperConfigProvider, exceptionHandlerProvider) {
        /* turn debugging off/on (no info or warn) */
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        /* Configure the common route provider */
        routehelperConfigProvider.config.$routeProvider = $routeProvider;
        routehelperConfigProvider.config.docTitle = 'Password Keeper: ';
/*        var resolveAlways = { */
/*            ready: function(dataservice) { */
/*                return dataservice.ready(); */
/*            } */
/*            // ready: ['dataservice', function (dataservice) { */
/*            //    return dataservice.ready(); */
/*            // }] */
/*        }; */
/*        routehelperConfigProvider.config.resolveAlways = resolveAlways; */

        /* Configure the common exception handler */
        exceptionHandlerProvider.configure(config.appErrorPrefix);
    }
})();
