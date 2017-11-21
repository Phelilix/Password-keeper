(function () {
    'use strict';
    
    angular
            .module('app.vault')
            .filter('filterOR', function() {
                return function(filtereds, filterObj, excluding) {
                    var out = [];
                    
                    if(filterObj.label !== "" || filterObj.webLocation !== "" && !excluding){
                        angular.forEach(filtereds, function(obj, key){
                            if(obj.label.indexOf(filterObj.label) > -1){
                                out.push(filtereds[key]);
                            }else if(obj.webLocation.indexOf(filterObj.webLocation) > -1) {
                                out.push(filtereds[key]);
                            }
                        });
                    }else{
                        out = filtereds;
                    }
                    return out;
                };
            });
})();