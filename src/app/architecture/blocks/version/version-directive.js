'use strict';

angular.module('blocks.version.version-directive', [])

        .directive('blocksVersion', ['version', function (version) {
                return function (scope, elm, attrs) {
                    elm.text(version);
                };
            }]);
