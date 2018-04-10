import * as _ from 'lodash';

import { TExp } from './babilon';

export const generateReturnsString = (separator: string = '/', idField: string = 'id') => (select, from) => {
  return ['returns', ['add', ['data', from[1]], ['data', '/'], ['path', from[1], idField]]];
};

export const generateReturnsAs = (asFrom: string = 'from', asId: string = 'id', idField: string = 'id') => (select, from) => {
  return ['returns', ['as', ['data', from[1]], asFrom], ['as', ['path', from[1], idField], asId]];
};

export const returnsReferencesSelect = (exp: TExp, generateReturns = generateReturnsAs()) => {
  const i: any = {};
  _.each(exp, (exp, e) => e ? i[exp[0]] = e : null);
  const selects = [];
  _.each(exp[i.from], (from, f) => {
    if (f) {
      const select = _.clone(exp);
      select[i.returns] = generateReturns(exp, from);
      selects.push(select);
    }
  });
  return selects;
};

export const returnsReferences = (exp: TExp, generateReturns = generateReturnsAs()) => {
  if (exp[0] === 'select') {
    return ['union',...returnsReferencesSelect(exp, generateReturns)];
  }
  if (exp[0] === 'union' || exp[0] === 'unionall') {
    const result = [exp[0]];
    _.each(exp.slice(1), select => result.push(...returnsReferencesSelect(select, generateReturns)));
    return result;
  }
  throw new Error(`unexpected root exp ${exp[0]}`);
};
