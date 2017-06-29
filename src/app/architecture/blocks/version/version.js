'use strict';

angular.module('blocks.version', [
  'blocks.version.interpolate-filter',
  'blocks.version.version-directive'
])

.value('version', '0.1');
