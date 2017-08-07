(function () {
    'use strict';

    angular
            .module('app.services')
            .factory('SpinnerService', SpinnerService);

    SpinnerService.$inject = ['$rootScope'];
    function SpinnerService($rootScope) {

        const showSpinner = (ob) => {
            ob.isBusy = !(ob.isBusy);
            return $rootScope.$broadcast('showSpinner');
        };
        
        const hideSpinner = (ob) => {
            ob.isBusy = !(ob.isBusy);
            return $rootScope.$broadcast('hideSpinner');
        };
        
        const showFor = (promise, scope, ob) => {
            showSpinner(ob);
            
            return promise.then((resolve) => {
                scope.$apply(() => {
                    hideSpinner(ob);
                });
                return resolve;
            },
            (err) => {
                scope.$apply(() => {
                    hideSpinner(ob);
                });
                return reject(err);
            });
        };
        
        return {
            showFor: showFor
        };
    }
})();