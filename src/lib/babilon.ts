import * as _ from 'lodash';

import { validators } from './validators';

export type TExp = any[];

export interface IStep {
  exp: TExp;
  args?: any[];
  index?: number;
  validateMemory?: any;
  hasErrors?: true;
}

export interface IValidator {
  (last: IStep, flow: IFlow): void;
}

export interface IValidators {
  [exp: string]: IValidator;
}

export interface IResolver {
  (last, flow): void;
}

export interface IError {
  path: number[];
  emitter: string;
  message: string;
}

export interface IFlow {
  exp: TExp;
  variables?: {};
  path?: IStep[];
  validators?: IValidators;
  validate?: IValidator;
  resolver?: IResolver;
  errors?: IError[];
  result?: any;
  resolveMemory?: any;
  validateMemory?: any;
}

export interface IBabilon {
  (flow: IFlow): IFlow;
}

export const router = (flow) => {
};

export const validate = (last: IStep, flow: IFlow) => {
  if (!_.isArray(last.exp) || !_.isString(last.exp[0])) {
    error('validate', 'is not expression', flow);
  } else {
    if (!flow.validators[last.exp[0]]) {
      error('validate', `unexpected exp ${last.exp[0]}`, flow);
    } else {
      flow.validators[last.exp[0]](last, flow);
    }
  }
};

export const error = (emitter, message, flow: IFlow) => {
  const last = _.last(flow.path);
  const path = [];
  _.each(flow.path, p => _.isNumber(p.index) ? path.push(p.index) : null);
  const error = { emitter, message, path };
  last.hasErrors = true;
  flow.errors.push(error);
};

export const back = (last, flow) => {
  flow.path.pop();
  if (last.hasErrors && flow.path[flow.path.length - 1]) flow.path[flow.path.length - 1].hasErrors = true;
};

export const babilon: IBabilon = (flow) => {
  flow.path = [{ exp: flow.exp, args: [] }];
  flow.validate = flow.validate || validate;
  flow.validators = flow.validators || validators;
  flow.errors = [];

  let last;
  while (true) {
    if (!flow.path.length) return flow;
    last = _.last(flow.path);

    if (_.isNumber(last.index)) {
      last.index++;
      if (last.args.length > last.index) {
        if (last.args[last.index]) {
          flow.path.push({ exp: last.args[last.index], args: [] });
        }
      } else {
        if (flow.resolver) flow.resolver(last, flow);
        back(last, flow);
      }
    } else {
      flow.validate(last, flow);
      if (last.hasErrors) {
        back(last, flow);
      } else {
        if (last.args && last.args.length) {
          last.index = -1;
        } else {
          if (flow.resolver) flow.resolver(last, flow);
          back(last, flow);
        }
      }
    }
  }
};

export default babilon;
