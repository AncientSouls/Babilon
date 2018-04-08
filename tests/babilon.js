"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const babilon_1 = require("../lib/babilon");
exports.default = () => {
    describe('babilon', () => {
        it('validation errors', () => {
            chai_1.assert.deepEqual(babilon_1.babilon({
                exp: ['as', ['and', ['eq', ['path', 'a'], ['path', 'b']], ['not', ['path'], ['path', 'a']]], 'x'],
            }).errors, [
                {
                    emitter: 'path',
                    message: 'arg [0] string is not defined',
                    path: [0, 1, 0],
                },
            ]);
        });
    });
};
//# sourceMappingURL=babilon.js.map