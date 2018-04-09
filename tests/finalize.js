"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const validators_1 = require("../lib/validators");
exports.default = () => {
    it('finalize', () => {
        chai_1.assert.deepEqual(validators_1.finalize(validators_1.rules, 'as'), {
            name: 'as',
            rule: { args: [':get', '?string'] },
            unique: undefined,
            args: [
                [
                    '!data',
                    '!path',
                    '!and',
                    '!or',
                    '!eq',
                    '!not',
                    '!gt',
                    '!gte',
                    '!lt',
                    '!lte',
                    '!add',
                    '!plus',
                    '!minus',
                    '!multiply',
                    '!divide',
                    '!select',
                    '!union',
                    '!unionall',
                ],
                [
                    'string',
                ],
            ],
        });
        console.log(validators_1.finalize(validators_1.rules, 'and'), {
            name: 'and',
            rule: {
                all: [':get'],
            },
            unique: undefined,
            all: [
                '!data',
                '!path',
                '!and',
                '!or',
                '!eq',
                '!not',
                '!gt',
                '!gte',
                '!lt',
                '!lte',
                '!add',
                '!plus',
                '!minus',
                '!multiply',
                '!divide',
                '!select',
                '!union',
                '!unionall',
            ],
        });
    });
};
//# sourceMappingURL=finalize.js.map