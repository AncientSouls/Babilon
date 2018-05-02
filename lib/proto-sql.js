"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const validators_1 = require("./validators");
const rules_1 = require("./rules");
exports.types = {};
exports.types.data = ['string', 'number', 'boolean'];
exports.types.logic = ['!and', '!or'];
exports.types.check = ['!eq', '!not', '!gt', '!gte', '!lt', '!lte'];
exports.types.operator = ['!add', '!plus', '!minus', '!multiply', '!divide'];
exports.types.unions = ['!union', '!unionall'];
exports.types.fetch = ['!select', ...exports.types.unions];
exports.types.get = ['!data', '!variable', '!path', ...exports.types.logic, ...exports.types.check, ...exports.types.operator, ...exports.types.fetch];
exports.rules = rules_1.createRules(exports.types);
exports.validate = validators_1.createValidate(exports.rules);
exports.resolverOptions = {
    _column(name) {
        return `[${name}]`;
    },
    _checks: {
        eq: '=',
        not: '!=',
        gt: '>',
        gte: '>=',
        lt: '<',
        lte: '<=',
    },
    _operators: {
        add: '||',
        plus: '+',
        minus: '-',
        multiply: '*',
        divide: '/',
    },
    _logic(last, flow) {
        return _.map(last.resolveMemory, m => `(${m})`).join(` ${last.exp[0]} `);
    },
    _check(last, flow) {
        return `${last.resolveMemory[0]} ${this._checks[last.exp[0]]} ${last.resolveMemory[1]}`;
    },
    _operator(last, flow) {
        return _.map(last.resolveMemory, m => `(${m})`).join(`${this._operators[last.exp[0]]}`);
    },
    _param(flow, data) {
        flow.resolveMemory.params.push(data);
        return `$${flow.resolveMemory.params.length - 1}`;
    },
    data(last, flow) {
        if (_.isBoolean(last.exp[1]) || _.isNumber(last.exp[1])) {
            return last.exp[1].toString();
        }
        if (_.isString(last.exp[1])) {
            return this._param(flow, last.exp[1]);
        }
    },
    variable(last, flow) {
        const path = last.exp[1];
        const data = path.length ? _.get(flow.variables, path) : flow.variables;
        if (_.isBoolean(data) || _.isNumber(data)) {
            return data.toString();
        }
        if (_.isString(data)) {
            return this._param(flow, data);
        }
    },
    path(last, flow) {
        if (last.exp.length === 2)
            return `${this._column(last.exp[1])}`;
        return `${this._column(last.exp[1])}.${this._column(last.exp[2])}`;
    },
    alias(last, flow) {
        if (last.exp.length === 2)
            return `${this._column(last.exp[1])}`;
        return `${this._column(last.exp[1])} as ${this._column(last.exp[2])}`;
    },
    as(last, flow) {
        return `${last.resolveMemory[0]} as ${this._column(last.exp[2])}`;
    },
    and(last, flow) { return this._logic(last, flow); },
    or(last, flow) { return this._logic(last, flow); },
    eq(last, flow) { return this._check(last, flow); },
    not(last, flow) { return this._check(last, flow); },
    gt(last, flow) { return this._check(last, flow); },
    gte(last, flow) { return this._check(last, flow); },
    lt(last, flow) { return this._check(last, flow); },
    lte(last, flow) { return this._check(last, flow); },
    add(last, flow) { return this._operator(last, flow); },
    plus(last, flow) { return this._operator(last, flow); },
    minus(last, flow) { return this._operator(last, flow); },
    multiply(last, flow) { return this._operator(last, flow); },
    divide(last, flow) { return this._operator(last, flow); },
    order(last, flow) { return `${last.resolveMemory[0]} ${last.exp[2] === false ? 'DESC' : 'ASC'}`; },
    orders(last, flow) { return last.resolveMemory.join(','); },
    group(last, flow) { return last.resolveMemory[0]; },
    groups(last, flow) { return last.resolveMemory.join(','); },
    limit(last, flow) { return last.exp[1].toString(); },
    skip(last, flow) { return last.exp[1].toString(); },
    returns(last, flow) { return last.resolveMemory && last.resolveMemory.length ? last.resolveMemory.join(',') : '*'; },
    from(last, flow) { return last.resolveMemory.join(','); },
    select(last, flow) {
        let result = `(select`;
        const temp = {};
        _.each(last.args, (exp, i) => temp[exp[0]] = last.resolveMemory[i]);
        result += ` ${_.has(temp, 'returns') ? temp.returns : '*'}`;
        if (_.has(temp, 'from'))
            result += ` from ${temp.from}`;
        if (_.has(temp, 'and'))
            result += ` where ${temp.and}`;
        if (_.has(temp, 'orders'))
            result += ` order by ${temp.orders}`;
        if (_.has(temp, 'groups'))
            result += ` group by ${temp.groups}`;
        if (_.has(temp, 'limit'))
            result += ` limit ${temp.limit}`;
        if (_.has(temp, 'skip'))
            result += ` offset ${temp.skip}`;
        result += ')';
        return result;
    },
    union(last, flow) { return _.map(last.resolveMemory, m => `${m}`).join(' union '); },
    unionall(last, flow) { return _.map(last.resolveMemory, m => `${m}`).join(' union all '); },
};
exports.createResolver = options => (last, flow) => {
    flow.resolveMemory = flow.resolveMemory || { params: [] };
    const result = options[last.exp[0]](last, flow);
    if (flow.path[flow.path.length - 2]) {
        flow.path[flow.path.length - 2].resolveMemory = flow.path[flow.path.length - 2].resolveMemory || [];
        flow.path[flow.path.length - 2].resolveMemory.push(result);
    }
    else
        flow.result = result;
};
//# sourceMappingURL=proto-sql.js.map