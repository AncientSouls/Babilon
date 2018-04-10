import * as _ from 'lodash';

import { TExp } from './babilon';

// add to root select or to root union/unionall selects one conditions per one alias

export interface IRestricting {
  (exp: TExp, from: TExp, alias: TExp): TExp;
}

export const restrictSelect = (exp: TExp, restricting: IRestricting): TExp => {
  const select = _.clone(exp);
  const i: any = {};
  _.each(exp, (exp, e) => e ? i[exp[0]] = e : null);
  select[i.from] = _.clone(exp[i.from]);
  select[i.and] = ['and',
    exp[i.and],
    _.map(exp[i.from], alias => restricting(exp, select[i.from], alias)),
  ];
  return select;
};

export const restrict = (exp: TExp, restricting: IRestricting): TExp => {
  if (exp[0] === 'select') {
    return restrictSelect(exp, restricting);
  }
  if (exp[0] === 'union' || exp[0] === 'unionall') {
    return _.map(exp, (exp, e) => e ? restrictSelect(exp, restricting) : exp);
  }
  throw new Error(`unexpected root exp ${exp[0]}`);
};
