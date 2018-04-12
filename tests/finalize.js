"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rules_1 = require("../lib/rules");
exports.default = () => {
    it('finalize', () => {
        chai_1.assert.deepEqual(rules_1.finalize(rules_1.rules, 'as'), {
            name: 'as',
            rule: { args: [':get', '?string'] },
            args: [
                [
                    '!data',
                    '!variable',
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
        chai_1.assert.deepEqual(rules_1.finalize(rules_1.rules, 'and'), {
            name: 'and',
            rule: {
                all: [':get'],
            },
            all: [
                '!data',
                '!variable',
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