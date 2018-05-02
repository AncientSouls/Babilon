"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const returns_references_1 = require("../lib/returns-references");
const babilon_1 = require("../lib/babilon");
const proto_sql_1 = require("../lib/proto-sql");
exports.default = () => {
    it('returnsReferences no returns', () => {
        const exp = returns_references_1.returnsReferences(['select',
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
        ], returns_references_1.generateReturnsAs());
        chai_1.assert.lengthOf(exp, 3);
        chai_1.assert.deepEqual(exp[1][6], ['returns',
            ['as', ['data', 'x'], 'from'],
            ['as', ['path', 'x', 'id'], 'id'],
        ]);
        chai_1.assert.deepEqual(exp[2][6], ['returns',
            ['as', ['data', 'y'], 'from'],
            ['as', ['path', 'y', 'id'], 'id'],
        ]);
        const resolver = proto_sql_1.createResolver(proto_sql_1.resolverOptions);
        const b = babilon_1.babilon({ resolver, validate: proto_sql_1.validate, exp });
        chai_1.assert.deepEqual(b.errors, []);
    });
    it('returnsReferencesAs', () => {
        const exp = returns_references_1.returnsReferences(['select',
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
        ], returns_references_1.generateReturnsAs());
        chai_1.assert.lengthOf(exp, 3);
        chai_1.assert.deepEqual(exp[1][1], ['returns',
            ['as', ['data', 'x'], 'from'],
            ['as', ['path', 'x', 'id'], 'id'],
        ]);
        chai_1.assert.deepEqual(exp[2][1], ['returns',
            ['as', ['data', 'y'], 'from'],
            ['as', ['path', 'y', 'id'], 'id'],
        ]);
        const resolver = proto_sql_1.createResolver(proto_sql_1.resolverOptions);
        const b = babilon_1.babilon({ resolver, validate: proto_sql_1.validate, exp });
        chai_1.assert.deepEqual(b.errors, []);
    });
    it('returnsReferencesString', () => {
        const exp = returns_references_1.returnsReferences(['select',
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
        ], returns_references_1.generateReturnsString());
        chai_1.assert.lengthOf(exp, 3);
        chai_1.assert.deepEqual(exp[1][1], ['returns',
            ['add', ['data', 'x'], ['data', '/'], ['path', 'x', 'id']],
        ]);
        chai_1.assert.deepEqual(exp[2][1], ['returns',
            ['add', ['data', 'y'], ['data', '/'], ['path', 'y', 'id']],
        ]);
        const resolver = proto_sql_1.createResolver(proto_sql_1.resolverOptions);
        const b = babilon_1.babilon({ resolver, validate: proto_sql_1.validate, exp });
        chai_1.assert.deepEqual(b.errors, []);
    });
};
//# sourceMappingURL=returns-references.js.map