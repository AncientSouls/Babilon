import * as _ from 'lodash';

import { createValidate } from './validators';
import { createRules, IRules, rules as defaultRules } from './rules';
import { IValidator } from './babilon';

export const types: any = {};
types.data = ['undefined','string','number','boolean','object','array'];
types.logic = ['!and','!or'];
types.check = ['!eq','!not','!gt','!gte','!lt','!lte'];
types.get = ['!data','!variable'];

export const rules: IRules = {
  data: { args: [{ variants: types.data }] },
  variable: { args: [{ variants: ['string'] }] },
  path: { args: [{ variants: ['string'] }], all: ['string'] },
  alias: { args: [{ variants: ['string'] }, { variants: ['string'], optional: true }] },

  and: { all: [...types.logic,...types.check] },
  or: { all: [...types.logic,...types.check] },

  eq: { args: [{ variants: ['!path'] },{ variants: types.get }] },
  not: { args: [{ variants: ['!path'] },{ variants: types.get }] },
  gt: { args: [{ variants: ['!path'] },{ variants: types.get }] },
  gte: { args: [{ variants: ['!path'] },{ variants: types.get }] },
  lt: { args: [{ variants: ['!path'] },{ variants: types.get }] },
  lte: { args: [{ variants: ['!path'] },{ variants: types.get }] },
  
  order: { args: [{ variants: ['!path'] }, { variants: ['boolean'], optional: true }] },
  orders: { all: ['!order'] },

  limit: { args: [{ variants: ['number'] }] },
  skip: { args: [{ variants: ['number'] }] },

  returns: { all: ['!path'] },
  from: { all: ['!alias'] },

  select: {
    unique: true,
    all: ['!returns','!from','!and','!orders','!limit','!skip'],
    handle: defaultRules.select.handle,
  },
};
export const validate = createValidate(rules);

export const resolverOptions = {
  _logic(last, flow) {
    return { [`$${last.exp[0]}`]: last.resolveMemory };
  },
  _check(last, flow) {
    return { [last.resolveMemory[0]]: { [`$${[last.exp[0]]}`]: last.resolveMemory[1] } };
  },
  data(last, flow) {
    return last.exp[1];
  },
  variable(last, flow) {
    const path = last.exp[1];
    return path.length ? _.get(flow.variables, path) : flow.variables;
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
    _.each(last.resolveMemory, (v,k) => result[v[0]] = v[1]);
    return result;
  },

  limit(last, flow) { return last.exp[1]; },
  skip(last, flow) { return last.exp[1]; },

  returns(last, flow) { return _.extend({}, ..._.map(last.resolveMemory, m => ({ [m]: 1 }))); },
  from(last, flow) { return last.resolveMemory[0]; },

  select(last, flow) {
    const result: any = {};
    const temp: any = {};
    _.each(last.args, (exp, i) => temp[exp[0]] = last.resolveMemory[i]);
    if (_.has(temp, 'returns')) result.fields = temp.returns;
    if (_.has(temp, 'from')) result.collection = temp.from;
    result.selector = _.has(temp, 'and') ? temp.and : { };
    if (_.has(temp, 'orders')) result.sort = temp.orders;
    if (_.has(temp, 'limit')) result.limit = temp.limit;
    if (_.has(temp, 'skip')) result.skip = temp.skip;
    return result;
  },
};

export const createResolver = options => (last, flow) => {
  const result = options[last.exp[0]](last, flow);

  if (flow.path[flow.path.length - 2]) {
    flow.path[flow.path.length - 2].resolveMemory = flow.path[flow.path.length - 2].resolveMemory || [];
    flow.path[flow.path.length - 2].resolveMemory.push(result);
  }
  else flow.result = result;
};
