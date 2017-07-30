(function () {
    'use strict';
    
    angular
            .module('app.auth')
            .service('Session', Session);
    
//    Session.$inject = [];
    
    function Session() {
        this.user = null;
        
        const create = (user) => {
            this.user = user;
        };
        const destroy = () => {
            this.user = null;
        };
        const isAuthenticated = () => {
            return !!this.user;
        };
        const getRoles = () => {
            return this.user.roles;
        };
        const getPass = () => {
            return this.user.password;
        };
        
        return {
            create: create,
            destroy: destroy,
            isAuthenticated: isAuthenticated,
            getRoles: getRoles,
            getPassword: getPass
        };
    }
})();


        