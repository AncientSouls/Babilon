import * as _ from 'lodash';

import { error } from './babilon';

export interface IRules {
  types: { [name: string]: string[] };
  expressions: {
    [name: string]: {
      args?: string[];
      all?: string[];
      unique?: boolean;
      validate?: (last, flow) => any;
    };
  };
}

export const rules: IRules = {
  types: {
    data: ['undefined','string','number','boolean','object','array'],
    get: ['!data','!path',':logic',':check',':operator'],
    logic: ['!and','!or'],
    check: ['!eq','!not','!gt','!gte','!lt','!lte'],
    operator: ['!add','!plus','!minus','!multiply','!divide'],
  },
  expressions: {
    data: { args: [':data'] },
    path: { args: ['string'], all: ['string'] },
    alias: { args: ['string', '?string'] },
    as: { args: [':get','?string'] },

    and: { all: [':get'] },
    or: { all: [':get'] },

    eq: { args: [':get',':get'] },
    not: { args: [':get',':get'] },
    gt: { args: [':get',':get'] },
    gte: { args: [':get',':get'] },
    lt: { args: [':get',':get'] },
    lte: { args: [':get',':get'] },

    add: { args: [':get',':get'] },
    plus: { args: [':get',':get'] },
    minus: { args: [':get',':get'] },
    multiply: { args: [':get',':get'] },
    divide: { args: [':get',':get'] },
    
    order: { args: ['!path','?boolean'] },
    orders: { all: ['!order'] },
    
    group: { args: ['!path'] },
    groups: { all: ['!group'] },

    limit: { args: ['number'] },
    skip: { args: ['number'] },

    returns: { all: ['!as','!path'] },
    from: { all: ['!alias'] },

    select: {
      unique: true,
      all: ['!returns','!from','!and','!orders','!groups','!limit','!skip'], 
      validate(last, flow) {
        if (!last.validateMemory.expressions.from) {
          error(last.exp[0], `select required expression from`, flow);
        }
      },
    },
  },
};

// ?(!:)name

export const isType = (last, rules, exp, arg, i) => {
  if (arg[0] === ':') {
    if (isTypes(last, rules, rules.types[_.trimStart(arg, ':')], exp, i)) {
      return true;
    }
  } else if (arg[0] === '!') {
    if (_.isArray(exp) && exp[0] === _.trimStart(arg, '!')) {
      last.args[i] = exp;
      last.validateMemory.expressions[exp[0]] = true;
      return true;
    }
  } else if (_.includes(['undefined','string','number','boolean','object','array'], arg)) {
    if (_[`is${_.capitalize(arg)}`](exp)) {
      last.args[i] = undefined;
      return true;
    }
  }
};

export const isTypes = (last, rules, types, exp, i) => {
  let t;
  for (t = 0; t < types.length; t++) {
    if (isType(last, rules, exp, types[t], i)) return true;
  }
  return false;
};

export const isArg = (last, rules, arg, exp, i) => {
  const _arg = _.trimStart(arg, '?');
  if (isType(last, rules, exp, _arg, i)) return true;
  return false;
};

export const createValidators = (rules: IRules) => {
  const validators = {};
  _.each(rules.expressions, (rule, name) => {
    validators[name] = (last, flow) => {
      flow.validateMemory = flow.validateMemory || { sources: [] };
      last.validateMemory = last.validateMemory || { expressions: {} };

      if (rule.args) {
        let a;
        for (a = 0; a < rule.args.length; a++) {
          if (last.exp.length < a + 2) {
            if (rule.args[a][0] !== '?') {
              return error(last.exp[0], `arg [${a}] ${rule.args[a]} is not defined`, flow);
            }
          } else {
            if (!isArg(last, rules, rule.args[a], last.exp[a + 1], a)) {
              return error(last.exp[0], `arg [${a}] is not ${rule.args[a]}`, flow);
            }
          }
        }
      }
      if (rule.all) {
        let e;
        const repeats = {};
        for (e = 1; e < last.exp.length; e++) {
          if (!isTypes(last, rules, rule.all, last.exp[e], e - 1)) {
            return error(last.exp[0], `arg [${e - 1}] is not any of all [${rule.all}]`, flow);
          }
          if (_.isArray(last.exp[e])) {
            repeats[last.exp[e][0]] = repeats[last.exp[e][0]] || 0;
            repeats[last.exp[e][0]]++;
            if (repeats[last.exp[e][0]] > 1 && rule.unique) {
              return error(last.exp[0], `arg [${e - 1}] has duplicates of ${last.exp[e][0]}`, flow);
            }
          }
        }
      }
      if (rule.validate) rule.validate(last, flow);
    };
  });

  return validators;
};

export const validators = createValidators(rules);
