(function () {
    'use strict';

    angular
            .module('app.layout')
            .controller('Sidebar', Sidebar);

    Sidebar.$inject = ['$route', 'routehelper', 'AuthService', '$filter', '$rootScope', '$scope'];

    function Sidebar($route, routehelper, AuthService, $filter, $rootScope, $scope) {
        /*jshint validthis: true */
        var vm = this;
        var routes = routehelper.getRoutes();
        var refinedRoutes = null;
        vm.isCurrent = isCurrent;
        /* vm.sidebarReady = function(){console.log('done animating menu')}; // example */

        activate();

        function activate() {
            refinedRoutes = getNavRoutes();
            vm.navRoutes = $filter('filter')(refinedRoutes, authorizeds);
            eventListeners();
        }

        function getNavRoutes() {
            return routes.filter(function (r) {
                return r.settings && r.settings.nav;
            }).sort(function (r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
        
        function authorizeds(value, index, array){
            return AuthService.isAuthorized(value.settings.authorizedRoles);
        }
        
        
        function eventListeners() {
            $rootScope.$on('auth-login-success', function (event) {
                updateNavRoutes();
            });
            $rootScope.$on('auth-logout', function(){
                updateNavRoutes();
            })
            
            function updateNavRoutes(){
                $scope.$apply(function(){
                    vm.navRoutes = $filter('filter')(refinedRoutes, authorizeds);
                    console.log('updated navroutes');
                })
            }
        }
    }
})();