"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const babilon_1 = require("./babilon");
exports.finalizeVariants = (rules, variants) => {
    const results = [];
    _.each(variants, (variant) => {
        if (variant[0] === ':')
            results.push(...exports.finalizeVariants(rules, rules.types[_.trimStart(variant, ':')]));
        else
            results.push(variant);
    });
    return results;
};
exports.finalize = (rules, name) => {
    if (!rules.expressions[name])
        return;
    const result = {
        name,
        rule: rules.expressions[name],
    };
    if (rules.expressions[name].args) {
        result.args = [];
        _.each(rules.expressions[name].args, (a) => {
            const variants = [];
            const arg = _.trimStart(a, '?');
            if (arg[0] === ':') {
                variants.push(...exports.finalizeVariants(rules, rules.types[_.trimStart(arg, ':')]));
            }
            else {
                variants.push(arg);
            }
            result.args.push(variants);
        });
    }
    if (rules.expressions[name].all) {
        result.all = [];
        _.each(rules.expressions[name].all, (a) => {
            const arg = _.trimStart(a, '?');
            if (arg[0] === ':') {
                result.all.push(...exports.finalizeVariants(rules, rules.types[_.trimStart(arg, ':')]));
            }
            else {
                result.all.push(arg);
            }
        });
    }
    return result;
};
exports.finalizeRules = (rules) => {
    const finalized = {};
    _.each(rules.expressions, (rule, name) => {
        finalized[name] = exports.finalize(rules, name);
    });
    return finalized;
};
exports.rules = {
    types: {
        data: ['undefined', 'string', 'number', 'boolean', 'object', 'array'],
        get: ['!data', '!variable', '!path', ':logic', ':check', ':operator', ':fetch'],
        logic: ['!and', '!or'],
        check: ['!eq', '!not', '!gt', '!gte', '!lt', '!lte'],
        operator: ['!add', '!plus', '!minus', '!multiply', '!divide'],
        fetch: ['!select', ':unions'],
        unions: ['!union', '!unionall'],
    },
    expressions: {
        data: { args: [':data'] },
        variable: { args: ['string'] },
        path: { args: ['string'], all: ['string'] },
        alias: {
            args: ['string', '?string'],
        },
        as: { args: [':get', '?string'] },
        and: { all: [':get'] },
        or: { all: [':get'] },
        eq: { args: [':get', ':get'] },
        not: { args: [':get', ':get'] },
        gt: { args: [':get', ':get'] },
        gte: { args: [':get', ':get'] },
        lt: { args: [':get', ':get'] },
        lte: { args: [':get', ':get'] },
        add: { all: [':get'] },
        plus: { all: [':get'] },
        minus: { all: [':get'] },
        multiply: { all: [':get'] },
        divide: { all: [':get'] },
        order: { args: ['!path', '?boolean'] },
        orders: { all: ['!order'] },
        group: { args: ['!path'] },
        groups: { all: ['!group'] },
        limit: { args: ['number'] },
        skip: { args: ['number'] },
        returns: { all: ['!as', '!path', ':get'] },
        from: { all: ['!alias'] },
        select: {
            unique: true,
            all: ['!returns', '!from', '!and', '!orders', '!groups', '!limit', '!skip'],
            handle(last, flow) {
                if (!last.validateMemory.expressions.from) {
                    babilon_1.error(last.exp[0], `select required expression from`, flow);
                }
            },
        },
        union: { all: [':fetch'] },
        unionall: { all: [':fetch'] },
    },
};
//# sourceMappingURL=rules.js.map