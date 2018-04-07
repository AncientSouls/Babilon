"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const babilon_1 = require("../lib/babilon");
const pg_1 = require("../lib/pg");
const resolver = pg_1.createResolver({
    uniqueStringIsolation: () => '',
});
const babi = (exp, result) => {
    const b = babilon_1.babilon({ resolver, validators: pg_1.validators, exp });
    chai_1.assert.deepEqual(b.errors, []);
    chai_1.assert.deepEqual(b.result, result);
};
exports.default = () => {
    describe('pg', () => {
        it('data', () => {
            babi(['data', true], 'true');
            babi(['data', false], 'false');
            babi(['data', 123], '123');
            babi(['data', 'abc'], '$$abc$$');
        });
        it('path', () => {
            babi(['path', 'a'], '"a"');
            babi(['path', 'a', 'b'], '"a"."b"');
        });
        it('alias', () => {
            babi(['alias', 'a'], '"a"');
            babi(['alias', 'a', 'b'], '"a" as "b"');
        });
        it('as', () => {
            babi(['as', ['data', 123], 'x'], '123 as "x"');
        });
        it('check', () => {
            babi(['=', ['data', 123], ['data', 123]], '123 = 123');
            babi(['!=', ['data', 123], ['data', 123]], '123 != 123');
            babi(['>', ['data', 123], ['data', 123]], '123 > 123');
            babi(['>=', ['data', 123], ['data', 123]], '123 >= 123');
            babi(['<', ['data', 123], ['data', 123]], '123 < 123');
            babi(['<=', ['data', 123], ['data', 123]], '123 <= 123');
        });
        it('operators', () => {
            babi(['+', ['data', 123], ['data', 123]], '123 + 123');
            babi(['-', ['data', 123], ['data', 123]], '123 - 123');
            babi(['*', ['data', 123], ['data', 123]], '123 * 123');
            babi(['/', ['data', 123], ['data', 123]], '123 / 123');
            babi([':', ['data', 'abc'], ['data', 'def']], '$$abc$$ || $$def$$');
        });
        it('logic', () => {
            babi(['and', ['data', 123], ['=', ['data', 123], ['data', 123]], ['path', 'a', 'b']], '(123) and (123 = 123) and ("a"."b")');
            babi(['or', ['data', 123], ['=', ['data', 123], ['data', 123]], ['path', 'a', 'b']], '(123) or (123 = 123) or ("a"."b")');
        });
        it('order', () => {
            babi(['order', ['path', 'a']], '"a" ASC');
            babi(['order', ['path', 'a'], true], '"a" ASC');
            babi(['order', ['path', 'a'], false], '"a" DESC');
        });
        it('group', () => {
            babi(['group', ['path', 'a']], '"a"');
        });
        it('limit skip', () => {
            babi(['limit', 7], '7');
            babi(['skip', 7], '7');
        });
        it('returns', () => {
            babi(['returns', ['path', 'a'], ['as', ['data', 123], 'x']], '"a",123 as "x"');
        });
        it('from', () => {
            babi(['from', ['alias', 'a'], ['alias', 'a', 'b']], '"a","a" as "b"');
        });
        it('select', () => {
            babi([
                'select',
                ['returns', ['path', 'a'], ['as', ['data', 123], 'x']],
                ['from', ['alias', 'a'], ['alias', 'a', 'b']],
                ['and', ['data', 123], ['data', 123]],
                ['orders', ['order', ['path', 'a']], ['order', ['path', 'b', 'c'], false]],
                ['limit', 10], ['skip', 10],
            ], 'select "a",123 as "x" from "a","a" as "b" where (123) and (123) order by "a" ASC,"b"."c" DESC limit 10 offset 10');
        });
    });
};
//# sourceMappingURL=pg.js.map