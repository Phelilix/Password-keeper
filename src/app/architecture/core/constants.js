/* global toastr:false, moment:false */
(function () {
    'use strict';

    angular
            .module('app.core')
            .constant('toastr', require('toastr'))
            .constant('moment', require('moment'))
//        .constant('readline', require('readline'))
            ;
})();
