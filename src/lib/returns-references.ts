import * as _ from 'lodash';

import { TExp } from './babilon';

// convert select or union/unionall selects to union selects returns each pair from/id
// helps realize subscriptions

export const generateReturnsString = (separator: string = '/', idField: string = 'id') => (select, from) => {
  return ['returns', ['add', ['data', from[1]], ['data', '/'], ['path', from[1], idField]]];
};

export const generateReturnsAs = (asFrom: string = 'from', asId: string = 'id', idField: string = 'id') => (select, from) => {
  return ['returns', ['as', ['data', from[1]], asFrom], ['as', ['path', from[1], idField], asId]];
};

export const returnsReferencesSelect = (exp: TExp, createReturns = generateReturnsAs()): TExp[] => {
  const i: any = {};
  _.each(exp, (exp, e) => e ? i[exp[0]] = e : null);
  i.returns = i.returns || exp.length;
  const selects = [];
  _.each(exp[i.from], (from, f) => {
    if (f) {
      const select = _.clone(exp);
      select[i.returns] = createReturns(exp, from);
      selects.push(select);
    }
  });
  return selects;
};

export const returnsReferences = (exp: TExp, createReturns = generateReturnsAs()): TExp => {
  if (exp[0] === 'select') {
    return ['union',...returnsReferencesSelect(exp, createReturns)];
  }
  if (exp[0] === 'union' || exp[0] === 'unionall') {
    const result = [exp[0]];
    _.each(exp.slice(1), select => result.push(...returnsReferencesSelect(select, createReturns)));
    return result;
  }
  throw new Error(`unexpected root exp ${exp[0]}`);
};
