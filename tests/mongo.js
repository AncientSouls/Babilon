"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const babilon_1 = require("../lib/babilon");
const mongo_1 = require("../lib/mongo");
const resolver = mongo_1.createResolver({
    uniqueStringIsolation: () => '',
});
const babi = (exp, result) => {
    const b = babilon_1.babilon({ resolver, validators: mongo_1.validators, exp });
    chai_1.assert.deepEqual(b.errors, []);
    chai_1.assert.deepEqual(b.result, result);
};
exports.default = () => {
    describe('mongo', () => {
        it('select', () => {
            babi([
                'select',
                ['returns', ['path', 'a']],
                ['from', ['alias', 'a']],
                [
                    'and',
                    ['=', ['path', 'a'], ['data', 123]],
                    ['or', ['=', ['path', 'a'], ['data', 123]]],
                ],
                ['orders', ['order', ['path', 'a']], ['order', ['path', 'b'], false]],
                ['limit', 10], ['skip', 10],
            ], {
                collection: 'a',
                fields: { a: 1 },
                selector: { $and: [
                        { a: { $eq: 123 } },
                        { $or: [{ a: { $eq: 123 } }] },
                    ] },
                limit: 10,
                skip: 10,
                sort: { a: 1, b: -1 },
            });
        });
    });
};
//# sourceMappingURL=mongo.js.map