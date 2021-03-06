"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const babilon_1 = require("../lib/babilon");
const validators_1 = require("../lib/validators");
const rules_1 = require("../lib/rules");
const babi = (exp, errors) => {
    const b = babilon_1.babilon({ exp, validate: validators_1.createValidate(rules_1.rules) });
    chai_1.assert.deepEqual(b.errors, errors);
    return b;
};
exports.default = () => {
    describe('validators', () => {
        it('data', () => {
            babi(['data', true], []);
            babi(['data', false], []);
            babi(['data', 123], []);
            babi(['data', 'abc'], []);
            babi(['data', [1, 2, 3]], []);
            babi(['data', { a: 1, b: 2, c: 3 }], []);
            babi(['data'], [{ path: [], emitter: 'data', message: 'arg [0] types [undefined,string,number,boolean,object,array] is not defined' }]);
        });
        it('data', () => {
            babi(['variable', 'a.b.c'], []);
        });
        it('path', () => {
            babi(['path', 'a'], []);
            babi(['path', 'a', 'b'], []);
            babi(['path', 'a', 'b', 'c'], []);
            babi(['path'], [{ path: [], emitter: 'path', message: 'arg [0] types [string] is not defined' }]);
            babi(['path', 123], [{ path: [], emitter: 'path', message: 'arg [0] is not [string]' }, { path: [], emitter: 'path', message: 'arg [0] not all correspond to [string]' }]);
            babi(['path', {}], [{ path: [], emitter: 'path', message: 'arg [0] is not [string]' }, { path: [], emitter: 'path', message: 'arg [0] not all correspond to [string]' }]);
        });
        it('alias', () => {
            babi(['alias', 'a'], []);
            babi(['alias', 'a', 'b'], []);
            babi(['alias', 123], [{ path: [], emitter: 'alias', message: 'arg [0] is not [string]' }]);
            babi(['alias'], [{ path: [], emitter: 'alias', message: 'arg [0] types [string] is not defined' }]);
        });
        it('as', () => {
            babi(['as', ['data', 123], 'x'], []);
            babi(['as'], [{ path: [], emitter: 'as', message: `arg [0] types [${rules_1.types.get}] is not defined` }]);
            babi(['as', 123, 'x'], [{ path: [], emitter: 'as', message: `arg [0] is not [${rules_1.types.get}]` }]);
            babi(['as', ['data', 123], 123], [{ path: [], emitter: 'as', message: 'arg [1] is not ?[string]' }]);
        });
        it('logic', () => {
            babi(['and', ['data', 123], ['data', 123]], []);
            babi(['or', ['data', 123], ['data', 123]], []);
        });
        it('check', () => {
            babi(['eq', ['data', 123], ['data', 123]], []);
            babi(['not', ['data', 123], ['data', 123]], []);
            babi(['gt', ['data', 123], ['data', 123]], []);
            babi(['gte', ['data', 123], ['data', 123]], []);
            babi(['lt', ['data', 123], ['data', 123]], []);
            babi(['lte', ['data', 123], ['data', 123]], []);
        });
        it('operators', () => {
            babi(['add', ['data', 123], ['data', 123]], []);
            babi(['plus', ['data', 123], ['data', 123]], []);
            babi(['minus', ['data', 123], ['data', 123]], []);
            babi(['multiply', ['data', 123], ['data', 123]], []);
            babi(['divide', ['data', 123], ['data', 123]], []);
        });
        it('order orders', () => {
            babi(['order', ['path', 'a']], []);
            babi(['order', ['path', 'a'], true], []);
            babi(['order', ['path', 'a'], false], []);
            babi(['orders', ['order', ['path', 'a']], ['order', ['path', 'a']]], []);
        });
        it('group groups', () => {
            babi(['group', ['path', 'a']], []);
            babi(['groups', ['group', ['path', 'a']], ['group', ['path', 'a']]], []);
        });
        it('limit skip', () => {
            babi(['limit', 7], []);
            babi(['skip', 7], []);
        });
        it('returns', () => {
            babi(['returns', ['path', 'a'], ['as', ['data', 123], 'x']], []);
        });
        it('from', () => {
            babi(['from', ['alias', 'a'], ['alias', 'a', 'b']], []);
        });
        it('select', () => {
            babi(['select',
                ['returns',
                    ['path', 'z', 'a'],
                    ['as', ['data', 123], 'q'],
                    ['as',
                        ['or',
                            ['eq', ['path', 'x', 'b'], ['data', 123]],
                            ['eq', ['path', 'x', 'c'], ['data', 123]],
                        ],
                        'w',
                    ],
                ],
                ['from',
                    ['alias', 'x'],
                    ['alias', 'y', 'z'],
                ],
                ['and',
                    ['gt', ['path', 'z', 'a'], ['data', 10]],
                    ['or',
                        ['eq', ['path', 'x', 'b'], ['data', 123]],
                        ['eq', ['path', 'x', 'c'], ['data', 123]],
                    ],
                ],
                ['orders', ['order', ['path', 'z', 'a']], ['order', ['path', 'x', 'b'], false]],
                ['limit', 10], ['skip', 10],
            ], []);
            babi([
                'select',
                ['returns', ['path', 'a'], ['as', ['data', 123], 'x']],
                ['returns', ['path', 'a'], ['as', ['data', 123], 'x']],
            ], [
                {
                    emitter: 'select',
                    message: 'arg [1] duplicates "returns"',
                    path: [],
                },
                {
                    emitter: 'select',
                    message: '"select" required "from"',
                    path: [],
                },
            ]);
            babi([
                'select',
                ['returns', ['path', 'a'], ['as', ['data', 123], 'x']],
            ], [
                {
                    emitter: 'select',
                    message: '"select" required "from"',
                    path: [],
                },
            ]);
        });
        it('union unionall', () => {
            const b = babi([
                'union',
                ['select', ['from', ['alias', 'a']]],
                ['select', ['from', ['alias', 'b']]],
                ['select', ['from', ['alias', 'c']]],
            ], []);
            babi([
                'unionall',
                ['select', ['from', ['alias', 'a']]],
                ['select', ['from', ['alias', 'b']]],
                ['select', ['from', ['alias', 'c']]],
            ], []);
        });
    });
};
//# sourceMappingURL=validators.js.map