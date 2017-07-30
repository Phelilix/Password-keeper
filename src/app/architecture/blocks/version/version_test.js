'use strict';

describe('blocks.version module', function () {
    beforeEach(module('blocks.version'));

    describe('version service', function () {
        it('should return current version', inject(function (version) {
            expect(version).toEqual('0.1');
        }));
    });
});
