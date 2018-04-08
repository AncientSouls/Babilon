"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const babilon_1 = require("../lib/babilon");
const sql_1 = require("../lib/sql");
const resolver = sql_1.createResolver(sql_1.resolverOptions);
const babi = (exp, result) => {
    const b = babilon_1.babilon({ resolver, validators: sql_1.validators, exp });
    chai_1.assert.deepEqual(b.errors, []);
    chai_1.assert.deepEqual(b.result, result);
    return b;
};
exports.default = () => {
    describe('sql', () => {
        it('data', () => {
            babi(['data', true], 'true');
            babi(['data', false], 'false');
            babi(['data', 123], '123');
            const b = babi(['data', 'abc'], '$0');
            chai_1.assert.deepEqual(b.resolveMemory.params, ['abc']);
        });
        it('path', () => {
            babi(['path', 'a'], '[a]');
            babi(['path', 'a', 'b'], '[a].[b]');
        });
        it('alias', () => {
            babi(['alias', 'a'], '[a]');
            babi(['alias', 'a', 'b'], '[a] as [b]');
        });
        it('as', () => {
            babi(['as', ['data', 123], 'x'], '123 as [x]');
        });
        it('check', () => {
            babi(['eq', ['data', 123], ['data', 123]], '123 = 123');
            babi(['not', ['data', 123], ['data', 123]], '123 != 123');
            babi(['gt', ['data', 123], ['data', 123]], '123 > 123');
            babi(['gte', ['data', 123], ['data', 123]], '123 >= 123');
            babi(['lt', ['data', 123], ['data', 123]], '123 < 123');
            babi(['lte', ['data', 123], ['data', 123]], '123 <= 123');
        });
        it('operators', () => {
            babi(['add', ['data', 'abc'], ['data', 'def']], '$0 || $1');
            babi(['plus', ['data', 123], ['data', 123]], '123 + 123');
            babi(['minus', ['data', 123], ['data', 123]], '123 - 123');
            babi(['multiply', ['data', 123], ['data', 123]], '123 * 123');
            babi(['divide', ['data', 123], ['data', 123]], '123 / 123');
        });
        it('logic', () => {
            babi(['and', ['data', 123], ['eq', ['data', 123], ['data', 123]], ['path', 'a', 'b']], '(123) and (123 = 123) and ([a].[b])');
            babi(['or', ['data', 123], ['eq', ['data', 123], ['data', 123]], ['path', 'a', 'b']], '(123) or (123 = 123) or ([a].[b])');
        });
        it('order', () => {
            babi(['order', ['path', 'a']], '[a] ASC');
            babi(['order', ['path', 'a'], true], '[a] ASC');
            babi(['order', ['path', 'a'], false], '[a] DESC');
        });
        it('group', () => {
            babi(['group', ['path', 'a']], '[a]');
        });
        it('limit skip', () => {
            babi(['limit', 7], '7');
            babi(['skip', 7], '7');
        });
        it('returns', () => {
            babi(['returns', ['path', 'a'], ['as', ['data', 123], 'x']], '[a],123 as [x]');
            babi(['returns'], '*');
        });
        it('from', () => {
            babi(['from', ['alias', 'a'], ['alias', 'a', 'b']], '[a],[a] as [b]');
        });
        it('select', () => {
            babi([
                'select',
                ['returns', ['path', 'a'], ['as', ['data', 123], 'x']],
                ['and', ['data', 123], ['data', 123]],
                ['orders', ['order', ['path', 'a']], ['order', ['path', 'b', 'c'], false]],
                ['limit', 10], ['skip', 10],
            ], 'select [a],123 as [x] from [a],[a] as [b] where (123) and (123) order by [a] ASC,[b].[c] DESC limit 10 offset 10');
        });
    });
};
//# sourceMappingURL=sql.js.map