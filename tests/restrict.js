"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _ = require("lodash");
const restrict_1 = require("../lib/restrict");
const babilon_1 = require("../lib/babilon");
const proto_sql_1 = require("../lib/proto-sql");
exports.default = () => {
    describe('restrict', () => {
        it('restrictions field', () => {
            const generateRestricting = (subjects) => {
                return (exp, and, from) => {
                    const byAliases = ['or', ..._.map(from.slice(1), (alias) => {
                            return ['or', ..._.map(subjects, subject => ['eq',
                                    ['path', (alias.length === 3 ? alias[2] : alias[1]), 'restriction'],
                                    ['data', subject],
                                ])];
                        })];
                    and.push(byAliases);
                };
            };
            const exp = restrict_1.restrict(['select',
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
            ], generateRestricting(['abc', 'def']));
            chai_1.assert.deepEqual(exp[3][3], ['or', ['or', ['eq', ['path', 'x', 'restriction'], ['data', 'abc']], ['eq', ['path', 'x', 'restriction'], ['data', 'def']]], ['or', ['eq', ['path', 'z', 'restriction'], ['data', 'abc']], ['eq', ['path', 'z', 'restriction'], ['data', 'def']]]]);
            const resolver = proto_sql_1.createResolver(proto_sql_1.resolverOptions);
            const b = babilon_1.babilon({ resolver, validate: proto_sql_1.validate, exp });
            chai_1.assert.deepEqual(b.errors, []);
        });
        it('restrictions alias', () => {
            const generateRestricting = (subjects) => {
                return (exp, and, from) => {
                    const _r = '_restrictions';
                    const bySubjects = ['or', ..._.map(subjects, (subject) => {
                            return ['eq', ['path', _r, 'subject'], ['data', subject]];
                        })];
                    and.push(bySubjects);
                    const byAliases = ['or', ..._.map(from.slice(1), (alias) => {
                            return ['eq', ['path', _r, 'from'], ['path', (alias.length === 3 ? alias[2] : alias[1]), 'id']];
                        })];
                    and.push(byAliases);
                    from.push(['alias', 'restrictions', _r]);
                };
            };
            const exp = restrict_1.restrict(['select',
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
            ], generateRestricting(['abc', 'def']));
            chai_1.assert.deepEqual(exp[2], ['from', ['alias', 'x'], ['alias', 'y', 'z'], ['alias', 'restrictions', '_restrictions']]);
            chai_1.assert.deepEqual(exp[3][3], ['or', ['eq', ['path', '_restrictions', 'subject'], ['data', 'abc']], ['eq', ['path', '_restrictions', 'subject'], ['data', 'def']]]);
            chai_1.assert.deepEqual(exp[3][4], ['or', ['eq', ['path', '_restrictions', 'from'], ['path', 'x', 'id']], ['eq', ['path', '_restrictions', 'from'], ['path', 'z', 'id']]]);
            const resolver = proto_sql_1.createResolver(proto_sql_1.resolverOptions);
            const b = babilon_1.babilon({ resolver, validate: proto_sql_1.validate, exp });
            chai_1.assert.deepEqual(b.errors, []);
        });
    });
};
//# sourceMappingURL=restrict.js.map