import * as _ from 'lodash';

import { rules as _rules, createValidators } from './validators';

export const rules = {
  types: {
    data: ['string','number','boolean'],
    get: ['!data','!path',':logic',':check',':operator',':fetch'],
    logic: ['!and','!or'],
    check: ['!eq','!not','!gt','!gte','!lt','!lte'],
    operator: ['!add','!plus','!minus','!multiply','!divide'],
    fetch: ['!select',':unions'],
    unions: ['!union','!unionall'],
  },
  expressions: {
    data: { args: [':data'] },
    path: { args: ['string'], all: ['string'] },
    alias: { args: ['string', '?string'] },

    and: { all: [':get'] },
    or: { all: [':get'] },

    eq: { args: [':get',':get'] },
    not: { args: [':get',':get'] },
    gt: { args: [':get',':get'] },
    gte: { args: [':get',':get'] },
    lt: { args: [':get',':get'] },
    lte: { args: [':get',':get'] },

    add: { all: [':get'] },
    plus: { all: [':get'] },
    minus: { all: [':get'] },
    multiply: { all: [':get'] },
    divide: { all: [':get'] },

    as: { args: [':get','?string'] },
    
    order: { args: ['!path','?boolean'] },
    orders: { all: ['!order'] },
    
    group: { args: ['!path'] },
    groups: { all: ['!group'] },

    limit: { args: ['number'] },
    skip: { args: ['number'] },

    returns: { all: ['!as','!path',':get'] },
    from: { all: ['!alias'] },

    select: {
      unique: true, all: ['!returns','!from','!and','!orders','!groups','!limit','!skip'],
      handle: _rules.expressions.select.handle,
    },

    union: { all: [':fetch'] },
    unionall: { all: [':fetch'] },
  },
};

export const validators = createValidators(rules);

export const resolverOptions = {
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
  data(last, flow) {
    if (_.isBoolean(last.exp[1]) || _.isNumber(last.exp[1])) {
      return last.exp[1].toString();
    }
    if (_.isString(last.exp[1])) {
      flow.resolveMemory.params.push(last.exp[1]);
      return `$${flow.resolveMemory.params.length - 1}`;
    }
  },
  path(last, flow) {
    if (last.exp.length === 2) return `${this._column(last.exp[1])}`;
    return `${this._column(last.exp[1])}.${this._column(last.exp[2])}`;
  },
  alias(last, flow) {
    if (last.exp.length === 2) return `${this._column(last.exp[1])}`;
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
    const temp: any = {};
    _.each(last.args, (exp, i) => temp[exp[0]] = last.resolveMemory[i]);
    result += ` ${_.has(temp, 'returns') ? temp.returns : '*'}`;
    if (_.has(temp, 'from')) result += ` from ${temp.from}`;
    if (_.has(temp, 'and')) result += ` where ${temp.and}`;
    if (_.has(temp, 'orders')) result += ` order by ${temp.orders}`;
    if (_.has(temp, 'groups')) result += ` group by ${temp.groups}`;
    if (_.has(temp, 'limit')) result += ` limit ${temp.limit}`;
    if (_.has(temp, 'skip')) result += ` offset ${temp.skip}`;
    result += ')';
    return result;
  },

  union(last, flow) { return _.map(last.resolveMemory, m => `${m}`).join(' union '); },
  unionall(last, flow) { return _.map(last.resolveMemory, m => `${m}`).join(' union all '); },
};

export const createResolver = options => (last, flow) => {
  flow.resolveMemory = flow.resolveMemory || { params: [] };
  
  const result = options[last.exp[0]](last, flow);

  if (flow.path[flow.path.length - 2]) {
    flow.path[flow.path.length - 2].resolveMemory = flow.path[flow.path.length - 2].resolveMemory || [];
    flow.path[flow.path.length - 2].resolveMemory.push(result);
  }
  else flow.result = result;
};
