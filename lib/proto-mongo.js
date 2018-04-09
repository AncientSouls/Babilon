"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const validators_1 = require("./validators");
exports.rules = {
    types: {
        data: ['undefined', 'string', 'number', 'boolean', 'object', 'array'],
        logic: ['!and', '!or'],
        check: ['!eq', '!not', '!gt', '!gte', '!lt', '!lte'],
    },
    expressions: {
        data: { args: [':data'] },
        path: { args: ['string'], all: ['string'] },
        alias: { args: ['string'] },
        and: { all: [':logic', ':check'] },
        or: { all: [':logic', ':check'] },
        eq: { args: ['!path', '!data'] },
        not: { args: ['!path', '!data'] },
        gt: { args: ['!path', '!data'] },
        gte: { args: ['!path', '!data'] },
        lt: { args: ['!path', '!data'] },
        lte: { args: ['!path', '!data'] },
        order: { args: ['!path', '?boolean'] },
        orders: { all: ['!order'] },
        limit: { args: ['number'] },
        skip: { args: ['number'] },
        returns: { all: ['!path'] },
        from: { args: ['!alias'] },
        select: {
            unique: true, all: ['!returns', '!from', '!and', '!orders', '!limit', '!skip'],
            handle: validators_1.rules.expressions.select.handle,
        },
    },
};
exports.validators = validators_1.createValidators(exports.rules);
exports.resolverOptions = {
    _logic(last, flow) {
        return { [`$${last.exp[0]}`]: last.resolveMemory };
    },
    _check(last, flow) {
        return { [last.resolveMemory[0]]: { [`$${[last.exp[0]]}`]: last.resolveMemory[1] } };
    },
    data(last, flow) {
        return last.exp[1];
    },
    path(last, flow) { return last.exp[1]; },
    alias(last, flow) { return last.exp[1]; },
    and(last, flow) { return this._logic(last, flow); },
    or(last, flow) { return this._logic(last, flow); },
    eq(last, flow) { return this._check(last, flow); },
    not(last, flow) { return this._check(last, flow); },
    gt(last, flow) { return this._check(last, flow); },
    gte(last, flow) { return this._check(last, flow); },
    lt(last, flow) { return this._check(last, flow); },
    lte(last, flow) { return this._check(last, flow); },
    order(last, flow) { return [last.resolveMemory[0], last.exp[2] === false ? -1 : 1]; },
    orders(last, flow) {
        const result = {};
        _.each(last.resolveMemory, (v, k) => result[v[0]] = v[1]);
        return result;
    },
    limit(last, flow) { return last.exp[1]; },
    skip(last, flow) { return last.exp[1]; },
    returns(last, flow) { return _.extend({}, ..._.map(last.resolveMemory, m => ({ [m]: 1 }))); },
    from(last, flow) { return last.resolveMemory[0]; },
    select(last, flow) {
        const result = {};
        const temp = {};
        _.each(last.args, (exp, i) => temp[exp[0]] = last.resolveMemory[i]);
        if (_.has(temp, 'returns'))
            result.fields = temp.returns;
        if (_.has(temp, 'from'))
            result.collection = temp.from;
        result.selector = _.has(temp, 'and') ? temp.and : {};
        if (_.has(temp, 'orders'))
            result.sort = temp.orders;
        if (_.has(temp, 'limit'))
            result.limit = temp.limit;
        if (_.has(temp, 'skip'))
            result.skip = temp.skip;
        return result;
    },
};
exports.createResolver = options => (last, flow) => {
    const result = options[last.exp[0]](last, flow);
    if (flow.path[flow.path.length - 2]) {
        flow.path[flow.path.length - 2].resolveMemory = flow.path[flow.path.length - 2].resolveMemory || [];
        flow.path[flow.path.length - 2].resolveMemory.push(result);
    }
    else
        flow.result = result;
};
//# sourceMappingURL=proto-mongo.js.map