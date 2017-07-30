(function () {
    'use strict';
    angular
            .module('app.auth')
            .constant('USER_ROLES', {
                all: '*',
                accountHolder: 'accountHolder',
                public: 'public'
            })
            ;
})();