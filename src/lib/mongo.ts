import * as _ from 'lodash';

import { error } from './babilon';
import {
  allowedExpressions as defaultAllowedExpressions,
  logics, checks, operators, newValidators,
} from './validators';

export interface IAllowedExpressions {
  [name: string]: { [index: number]: string[] };
}

export const getters = ['data', 'path', ...logics, ...checks];

export const allowedExpressions = Object.create(defaultAllowedExpressions);
allowedExpressions.check = {
  1: ['path'],
  2: ['data'],
};
allowedExpressions.and = {
  all: [...logics, ...checks],
};
allowedExpressions.or = {
  all: [...logics, ...checks],
};
allowedExpressions.order = {
  1: ['path'],
};
allowedExpressions.returns = {
  all: ['path'],
};
allowedExpressions.from = {
  all: ['alias'],
};
allowedExpressions.select = {
  unique: true,
  all: ['returns', 'from', 'and', 'orders', 'limit', 'skip'],
};

const defaultValidators = newValidators(allowedExpressions);
export const validators = Object.create(defaultValidators);

validators.path = (last, flow) => {
  if (last.exp.length !== 2) return error(last.exp[0], `length !== 2`, flow);
  defaultValidators.path(last, flow);
};

validators.from = (last, flow) => {
  if (last.exp.length !== 2) return error(last.exp[0], `length !== 2`, flow);
  defaultValidators.from(last, flow);
};

const not = (last, flow) => error(last.exp[0], 'not supported', flow);

validators.as = not;
_.each(operators, name => validators[name] = not);

export const toCheck = {
  '=': '$eq',
  '!=': '$ne',
  '>': '$gt',
  '>=': '$gte',
  '<': '$lt',
  '<=': '$lte',
};

export const createResolver = options => (last, flow) => {
  let result: any;

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
      result = { [last.memory[0]]: { [toCheck[last.exp[0]]]: last.memory[1] } };
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
      _.each(last.memory, (v,k) => result[v.path] = v.direction);
      break;
    case 'select':
      result = {};
      const temp: any = {};
      _.each(last.exps, (exp, i) => temp[exp[0]] = last.memory[i]);
      if (_.has(temp, 'returns')) result.fields = temp.returns;
      if (_.has(temp, 'from')) result.collection = temp.from;
      result.selector = _.has(temp, 'and') ? temp.and : { };
      if (_.has(temp, 'orders')) result.sort = temp.orders;
      if (_.has(temp, 'limit')) result.limit = temp.limit;
      if (_.has(temp, 'skip')) result.skip = temp.skip;
      break;
    default:
      throw new Error(`Unexpected exp: ${last.exp[0]}`);
  }

  if (flow.path[flow.path.length - 2]) {
    flow.path[flow.path.length - 2].memory = flow.path[flow.path.length - 2].memory || [];
    flow.path[flow.path.length - 2].memory.push(result);
  }
  else flow.result = result;
};

export const resolver = createResolver({
});
