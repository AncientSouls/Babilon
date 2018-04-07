"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const babilon_1 = require("./babilon");
exports.logics = ['and', 'or'];
exports.checks = ['=', '!=', '>', '>=', '<', '<='];
exports.operators = ['+', '-', '*', '/', ':'];
exports.getters = ['data', 'path', ...exports.logics, ...exports.checks, ...exports.operators];
exports.allowedExpressions = {
    as: {
        1: exports.getters,
    },
    check: {
        1: exports.getters,
        2: exports.getters,
    },
    operator: {
        1: exports.getters,
        2: exports.getters,
    },
    and: {
        all: exports.getters,
    },
    or: {
        all: exports.getters,
    },
    order: {
        1: ['path'],
    },
    group: {
        1: ['path'],
    },
    returns: {
        all: ['path', 'as'],
    },
    from: {
        all: ['alias'],
    },
    orders: {
        all: ['order'],
    },
    groups: {
        all: ['group'],
    },
    select: {
        unique: true,
        all: ['returns', 'from', 'and', 'orders', 'groups', 'limit', 'skip'],
    },
};
exports.newValidators = (allowedExpressions) => {
    const check = (last, flow) => {
        if (last.exp.length !== 3)
            return babilon_1.error(last.exp[0], `length !== 3`, flow);
        if (!_.isArray(last.exp[1]))
            return babilon_1.error(last.exp[0], `[1] is not exp`, flow);
        if (!_.includes(allowedExpressions['check'][1], last.exp[1][0]))
            return babilon_1.error(last.exp[0], `[1] is not allowed exp`, flow);
        if (!_.isArray(last.exp[2]))
            return babilon_1.error(last.exp[0], `[2] is not exp`, flow);
        if (!_.includes(allowedExpressions['check'][2], last.exp[2][0]))
            return babilon_1.error(last.exp[0], `[2] is not allowed exp`, flow);
        last.exps = [last.exp[1], last.exp[2]];
    };
    const operator = (last, flow) => {
        if (last.exp.length !== 3)
            return babilon_1.error(last.exp[0], `length !== 3`, flow);
        if (!_.isArray(last.exp[1]))
            return babilon_1.error(last.exp[0], `[1] is not exp`, flow);
        if (!_.includes(allowedExpressions['operator'][1], last.exp[1][0]))
            return babilon_1.error(last.exp[0], `[1] is not allowed exp`, flow);
        if (!_.isArray(last.exp[2]))
            return babilon_1.error(last.exp[0], `[2] is not exp`, flow);
        if (!_.includes(allowedExpressions['operator'][2], last.exp[2][0]))
            return babilon_1.error(last.exp[0], `[2] is not allowed exp`, flow);
        last.exps = [last.exp[1], last.exp[2]];
    };
    const numeric = (last, flow) => {
        if (last.exp.length !== 2)
            return babilon_1.error(last.exp[0], `length !== 2`, flow);
        if (!_.isNumber(last.exp[1]))
            return babilon_1.error(last.exp[0], `[1] is not number`, flow);
    };
    const exps = (last, flow) => {
        const allow = allowedExpressions[last.exp[0]];
        const uniques = {};
        _.times(last.exp.length - 1, (l) => {
            if (allow.unique) {
                if (uniques[last.exp[l + 1][0]])
                    return babilon_1.error(last.exp[0], `[${l + 1}] not unique ${last.exp[l + 1][0]}`, flow);
                uniques[last.exp[l + 1][0]] = 1;
            }
            if (!_.isArray(last.exp[l + 1]))
                return babilon_1.error(last.exp[0], `[${l + 1}] is not exp`, flow);
            if (!_.includes(allow.all, last.exp[l + 1][0]) && !_.includes(allow[l + 1], last.exp[l + 1][0]))
                return babilon_1.error(last.exp[0], `[${l + 1}] is not allowed exp`, flow);
            last.exps = last.exp.slice(1);
        });
    };
    const validators = {
        data(last, flow) {
            if (last.exp.length !== 2)
                return babilon_1.error(last.exp[0], `length !== 2`, flow);
        },
        path(last, flow) {
            if (last.exp.length < 2)
                return babilon_1.error(last.exp[0], `length < 2`, flow);
            _.times(last.exp.length - 1, (l) => {
                if (!_.isString(last.exp[l + 1]))
                    babilon_1.error(last.exp[0], `[${l + 1}] is not string`, flow);
            });
        },
        alias(last, flow) {
            if (last.exp.length < 2 || last.exp.length > 3)
                return babilon_1.error(last.exp[0], `length not in 2...3`, flow);
            _.times(last.exp.length - 1, (l) => {
                if (!_.isString(last.exp[l + 1]))
                    babilon_1.error(last.exp[0], `[${l + 1}] is not string`, flow);
            });
        },
        as(last, flow) {
            if (last.exp.length !== 3)
                return babilon_1.error(last.exp[0], `length !== 3`, flow);
            if (!_.isArray(last.exp[1]))
                return babilon_1.error(last.exp[0], `[1] is not exp`, flow);
            if (!_.includes(allowedExpressions[last.exp[0]][1], last.exp[1][0]))
                return babilon_1.error(last.exp[0], `[1] is not allowed exp`, flow);
            if (!_.isString(last.exp[2]))
                return babilon_1.error(last.exp[0], `[2] is not string`, flow);
            last.exps = [last.exp[1]];
        },
        order(last, flow) {
            if (last.exp.length < 2 || last.exp.length > 3)
                return babilon_1.error(last.exp[0], `length not in 2...3`, flow);
            if (!_.isArray(last.exp[1]))
                return babilon_1.error(last.exp[0], `[1] is not exp`, flow);
            if (!_.includes(allowedExpressions[last.exp[0]][1], last.exp[1][0]))
                return babilon_1.error(last.exp[0], `[1] is not allowed exp`, flow);
            if (last.exp.length === 3) {
                if (!_.isBoolean(last.exp[2]))
                    return babilon_1.error(last.exp[0], `[2] is not boolean`, flow);
            }
            last.exps = [last.exp[1]];
        },
        group(last, flow) {
            if (last.exp.length !== 2)
                return babilon_1.error(last.exp[0], `length !== 2`, flow);
            if (!_.isArray(last.exp[1]))
                return babilon_1.error(last.exp[0], `[1] is not exp`, flow);
            if (!_.includes(allowedExpressions[last.exp[0]][1], last.exp[1][0]))
                return babilon_1.error(last.exp[0], `[1] is not allowed exp`, flow);
            last.exps = [last.exp[1]];
        },
        limit: numeric,
        skip: numeric,
        returns: exps,
        from: exps,
        orders: exps,
        groups: exps,
        select: exps,
    };
    _.each(exports.logics, name => validators[name] = exps);
    _.each(exports.operators, name => validators[name] = operator);
    _.each(exports.checks, name => validators[name] = check);
    return validators;
};
exports.validators = exports.newValidators(exports.allowedExpressions);
//# sourceMappingURL=validators.js.map