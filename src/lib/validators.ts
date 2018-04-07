import * as _ from 'lodash';

import { error } from './babilon';

export interface IAllowedExpressions {
  [name: string]: {
    unique?: boolean;
    all?: string[];
    [index: number]: string[];
  };
}

export const logics = ['and', 'or'];
export const checks = ['=', '!=', '>', '>=', '<', '<='];
export const operators = ['+', '-', '*', '/', ':'];
export const getters = ['data', 'path', ...logics, ...checks, ...operators];
export const allowedExpressions = {
  as: {
    1: getters,
  },
  check: {
    1: getters,
    2: getters,
  },
  operator: {
    1: getters,
    2: getters,
  },
  and: {
    all: getters,
  },
  or: {
    all: getters,
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

export const newValidators = (allowedExpressions: IAllowedExpressions) => {
  const check = (last, flow) => {
    if (last.exp.length !== 3) return error(last.exp[0], `length !== 3`, flow);
    if (!_.isArray(last.exp[1])) return error(last.exp[0], `[1] is not exp`, flow);
    if (!_.includes(allowedExpressions['check'][1], last.exp[1][0])) return error(last.exp[0], `[1] is not allowed exp`, flow);
    if (!_.isArray(last.exp[2])) return error(last.exp[0], `[2] is not exp`, flow);
    if (!_.includes(allowedExpressions['check'][2], last.exp[2][0])) return error(last.exp[0], `[2] is not allowed exp`, flow);
    last.exps = [last.exp[1], last.exp[2]];
  };
  
  const operator = (last, flow) => {
    if (last.exp.length !== 3) return error(last.exp[0], `length !== 3`, flow);
    if (!_.isArray(last.exp[1])) return error(last.exp[0], `[1] is not exp`, flow);
    if (!_.includes(allowedExpressions['operator'][1], last.exp[1][0])) return error(last.exp[0], `[1] is not allowed exp`, flow);
    if (!_.isArray(last.exp[2])) return error(last.exp[0], `[2] is not exp`, flow);
    if (!_.includes(allowedExpressions['operator'][2], last.exp[2][0])) return error(last.exp[0], `[2] is not allowed exp`, flow);
    last.exps = [last.exp[1], last.exp[2]];
  };
  
  const numeric = (last, flow) => {
    if (last.exp.length !== 2) return error(last.exp[0], `length !== 2`, flow);
    if (!_.isNumber(last.exp[1])) return error(last.exp[0], `[1] is not number`, flow);
  };
  
  const exps = (last, flow) => {
    const allow = allowedExpressions[last.exp[0]];
    const uniques = {};
    _.times(last.exp.length - 1, (l) => {
      if (allow.unique) {
        if (uniques[last.exp[l + 1][0]]) return error(last.exp[0], `[${l + 1}] not unique ${last.exp[l + 1][0]}`, flow);
        uniques[last.exp[l + 1][0]] = 1;
      }

      if (!_.isArray(last.exp[l + 1])) return error(last.exp[0], `[${l + 1}] is not exp`, flow);
      if (!_.includes(allow.all, last.exp[l + 1][0]) && !_.includes(allow[l + 1], last.exp[l + 1][0])) return error(last.exp[0], `[${l + 1}] is not allowed exp`, flow);
      last.exps = last.exp.slice(1);
    });
  };

  const validators = {
    data(last, flow) {
      if (last.exp.length !== 2) return error(last.exp[0], `length !== 2`, flow);
    },
    path(last, flow) {
      if (last.exp.length < 2) return error(last.exp[0], `length < 2`, flow);
      _.times(last.exp.length - 1, (l) => {
        if (!_.isString(last.exp[l + 1])) error(last.exp[0], `[${l + 1}] is not string`, flow);
      });
    },
    alias(last, flow) {
      if (last.exp.length < 2 || last.exp.length > 3) return error(last.exp[0], `length not in 2...3`, flow);
      _.times(last.exp.length - 1, (l) => {
        if (!_.isString(last.exp[l + 1])) error(last.exp[0], `[${l + 1}] is not string`, flow);
      });
    },
    as(last, flow) {
      if (last.exp.length !== 3) return error(last.exp[0], `length !== 3`, flow);
      if (!_.isArray(last.exp[1])) return error(last.exp[0], `[1] is not exp`, flow);
      if (!_.includes(allowedExpressions[last.exp[0]][1], last.exp[1][0])) return error(last.exp[0], `[1] is not allowed exp`, flow);
      if (!_.isString(last.exp[2])) return error(last.exp[0], `[2] is not string`, flow);
      last.exps = [last.exp[1]];
    },
    order(last, flow) {
      if (last.exp.length < 2 || last.exp.length > 3) return error(last.exp[0], `length not in 2...3`, flow);
      if (!_.isArray(last.exp[1])) return error(last.exp[0], `[1] is not exp`, flow);
      if (!_.includes(allowedExpressions[last.exp[0]][1], last.exp[1][0])) return error(last.exp[0], `[1] is not allowed exp`, flow);
      if (last.exp.length === 3) {
        if (!_.isBoolean(last.exp[2])) return error(last.exp[0], `[2] is not boolean`, flow);
      }
      last.exps = [last.exp[1]];
    },
    group(last, flow) {
      if (last.exp.length !== 2) return error(last.exp[0], `length !== 2`, flow);
      if (!_.isArray(last.exp[1])) return error(last.exp[0], `[1] is not exp`, flow);
      if (!_.includes(allowedExpressions[last.exp[0]][1], last.exp[1][0])) return error(last.exp[0], `[1] is not allowed exp`, flow);
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

  _.each(logics, name => validators[name] = exps);
  _.each(operators, name => validators[name] = operator);
  _.each(checks, name => validators[name] = check);

  return validators;
};

export const validators = newValidators(allowedExpressions);
