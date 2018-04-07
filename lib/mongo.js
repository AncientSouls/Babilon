"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const babilon_1 = require("./babilon");
const validators_1 = require("./validators");
exports.getters = ['data', 'path', ...validators_1.logics, ...validators_1.checks];
exports.allowedExpressions = Object.create(validators_1.allowedExpressions);
exports.allowedExpressions.check = {
    1: ['path'],
    2: ['data'],
};
exports.allowedExpressions.and = {
    all: [...validators_1.logics, ...validators_1.checks],
};
exports.allowedExpressions.or = {
    all: [...validators_1.logics, ...validators_1.checks],
};
exports.allowedExpressions.order = {
    1: ['path'],
};
exports.allowedExpressions.returns = {
    all: ['path'],
};
exports.allowedExpressions.from = {
    all: ['alias'],
};
exports.allowedExpressions.select = {
    unique: true,
    all: ['returns', 'from', 'and', 'orders', 'limit', 'skip'],
};
const defaultValidators = validators_1.newValidators(exports.allowedExpressions);
exports.validators = Object.create(defaultValidators);
exports.validators.path = (last, flow) => {
    if (last.exp.length !== 2)
        return babilon_1.error(last.exp[0], `length !== 2`, flow);
    defaultValidators.path(last, flow);
};
exports.validators.from = (last, flow) => {
    if (last.exp.length !== 2)
        return babilon_1.error(last.exp[0], `length !== 2`, flow);
    defaultValidators.from(last, flow);
};
const not = (last, flow) => babilon_1.error(last.exp[0], 'not supported', flow);
exports.validators.as = not;
_.each(validators_1.operators, name => exports.validators[name] = not);
exports.toCheck = {
    '=': '$eq',
    '!=': '$ne',
    '>': '$gt',
    '>=': '$gte',
    '<': '$lt',
    '<=': '$lte',
};
exports.createResolver = options => (last, flow) => {
    let result;
    switch (last.exp[0]) {
        case 'data':
            result = last.exp[1];
            break;
        case 'path':
        case 'alias':
            result = last.exp[1];
            break;
        case '=':
        case '!=':
        case '>':
        case '>=':
        case '<':
        case '<=':
            result = { [last.memory[0]]: { [exports.toCheck[last.exp[0]]]: last.memory[1] } };
            break;
        case 'and':
        case 'or':
            result = { [`$${last.exp[0]}`]: last.memory };
            break;
        case 'order':
            result = { path: last.memory[0], direction: last.exp[2] === false ? -1 : 1 };
            break;
        case 'limit':
        case 'skip':
            result = last.exp[1];
            break;
        case 'returns':
            result = _.extend({}, ..._.map(last.memory, m => ({ [m]: 1 })));
            break;
        case 'from':
            result = last.memory[0];
            break;
        case 'orders':
            result = {};
            _.each(last.memory, (v, k) => result[v.path] = v.direction);
            break;
        case 'select':
            result = {};
            const temp = {};
            _.each(last.exps, (exp, i) => temp[exp[0]] = last.memory[i]);
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
            break;
        default:
            throw new Error(`Unexpected exp: ${last.exp[0]}`);
    }
    if (flow.path[flow.path.length - 2]) {
        flow.path[flow.path.length - 2].memory = flow.path[flow.path.length - 2].memory || [];
        flow.path[flow.path.length - 2].memory.push(result);
    }
    else
        flow.result = result;
};
exports.resolver = exports.createResolver({});
//# sourceMappingURL=mongo.js.map