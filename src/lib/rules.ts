import * as _ from 'lodash';

import { error } from './babilon';

export interface IRule {
  args?: string[];
  all?: string[];
  unique?: boolean;
  handle?: (last, flow) => any;
}

export interface IRules {
  types: { [name: string]: string[] };
  expressions: {
    [name: string]: IRule;
  };
}

export interface IRulesFinalized {
  [name: string]: IRuleFinalized;
}

export interface IRuleFinalized {
  args?: string[][];
  all?: string[];
  unique?: boolean;
}

export const finalizeVariants = (rules: IRules, variants: string[]) => {
  const results = [];
  _.each(variants, (variant) => {
    if (variant[0] === ':') results.push(...finalizeVariants(rules, rules.types[_.trimStart(variant, ':')]));
    else results.push(variant);
  });
  return results;
};

export const finalize = (rules: IRules, name: string): IRuleFinalized => {
  if (!rules.expressions[name]) return;
  const result: any = {
    name,
    rule: rules.expressions[name],
  };
  if (rules.expressions[name].args) {
    result.args = [];
    _.each(rules.expressions[name].args, (a) => {
      const variants = [];
      const arg = _.trimStart(a, '?');
      if (arg[0] === ':') {
        variants.push(...finalizeVariants(rules, rules.types[_.trimStart(arg, ':')]));
      } else {
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
        result.all.push(...finalizeVariants(rules, rules.types[_.trimStart(arg, ':')]));
      } else {
        result.all.push(arg);
      }
    });
  }
  return result;
};

export const finalizeRules = (rules: IRules): IRulesFinalized => {
  const finalized = {};
  _.each(rules.expressions, (rule, name) => {
    finalized[name] = finalize(rules, name);
  });
  return finalized;
};

export const rules: IRules = {
  types: {
    data: ['undefined','string','number','boolean','object','array'],
    get: ['!data','!variable','!path',':logic',':check',':operator',':fetch'],
    logic: ['!and','!or'],
    check: ['!eq','!not','!gt','!gte','!lt','!lte'],
    operator: ['!add','!plus','!minus','!multiply','!divide'],
    fetch: ['!select',':unions'],
    unions: ['!union','!unionall'],
  },
  expressions: {
    data: { args: [':data'] },
    variable: { args: ['string'] },
    path: { args: ['string'], all: ['string'] },
    alias: {
      args: ['string', '?string'],
    },
    as: { args: [':get','?string'] },

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
    
    order: { args: ['!path','?boolean'] },
    orders: { all: ['!order'] },
    
    group: { args: ['!path'] },
    groups: { all: ['!group'] },

    limit: { args: ['number'] },
    skip: { args: ['number'] },

    returns: { all: ['!as','!path',':get'] },
    from: { all: ['!alias'] },

    select: {
      unique: true,
      all: ['!returns','!from','!and','!orders','!groups','!limit','!skip'],

      handle(last, flow) {
        if (!last.validateMemory.expressions.from) {
          error(last.exp[0], `select required expression from`, flow);
        }
      },
    },

    union: { all: [':fetch'] },
    unionall: { all: [':fetch'] },
  },
};
