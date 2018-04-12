import * as _ from 'lodash';

import { error } from './babilon';
import { IRules, rules } from './rules';

export const isType = (last, rules, exp, arg, i) => {
  if (arg[0] === ':') {
    const type = _.trimStart(arg, ':');
    if (!rules.types[type]) throw new Error(`type ${arg} is not defined`);
    if (isTypes(last, rules, rules.types[type], exp, i)) {
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
      flow.validateMemory = flow.validateMemory || { aliases: [], selects: [] };
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
            return error(last.exp[0], `arg [${e - 1}] not all correspond to the type [${rule.all}]`, flow);
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
      if (name === 'select') flow.validateMemory.selects.push(last);
      if (name === 'alias') flow.validateMemory.aliases.push(last);
      if (rule.handle) rule.handle(last, flow);
    };
  });

  return validators;
};

export const validators = createValidators(rules);
