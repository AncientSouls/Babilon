"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const babilon_1 = require("../lib/babilon");
const proto_mongo_1 = require("../lib/proto-mongo");
const resolver = proto_mongo_1.createResolver(proto_mongo_1.resolverOptions);
const babi = (exp, result) => {
    const b = babilon_1.babilon({ resolver, validators: proto_mongo_1.validators, exp });
    chai_1.assert.deepEqual(b.errors, []);
    chai_1.assert.deepEqual(b.result, result);
    return b;
};
exports.default = () => {
    describe('mongo', () => {
        it('select', () => {
            babi(['select',
                ['returns',
                    ['path', 'a'],
                    ['path', 'b'],
                    ['path', 'c'],
                ],
                ['from',
                    ['alias', 'x'],
                ],
                ['and',
                    ['gt', ['path', 'a'], ['data', 10]],
                    ['or',
                        ['eq', ['path', 'b'], ['data', 123]],
                        ['eq', ['path', 'c'], ['data', 123]],
                    ],
                ],
                ['orders', ['order', ['path', 'a']], ['order', ['path', 'b'], false]],
                ['limit', 10], ['skip', 10],
            ], {
                collection: 'x',
                fields: { a: 1, b: 1, c: 1 },
                selector: { $and: [
                        { a: { $gt: 10 } },
                        { $or: [{ b: { $eq: 123 } }, { c: { $eq: 123 } }] },
                    ] },
                limit: 10,
                skip: 10,
                sort: { a: 1, b: -1 },
            });
        });
    });
};
//# sourceMappingURL=proto-mongo.js.map