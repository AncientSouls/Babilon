import * as _ from 'lodash';

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

export interface IResolver {
  (last: IStep, flow: IFlow): void;
}

export interface IError {
  path: number[];
  emitter: string;
  message: string;
}

export interface IThrow {
  (emitter: string, message: string);
}

export interface IFlow {
  exp: TExp;
  variables?: {};
  path?: IStep[];
  validate?: IValidator;
  resolver?: IResolver;
  errors?: IError[];
  throw?: IThrow;
  result?: any;

  resolveMemory?: any;
  validateMemory?: any;
}

export interface IBabilon {
  (flow: IFlow): IFlow;
}

export const defaultThrow: IThrow = function (emitter, message) {
  const last: IStep = _.last(this.path);
  const path = [];
  _.each(this.path, p => _.isNumber(p.index) ? path.push(p.index) : null);
  const error = { emitter, message, path };
  last.hasErrors = true;
  this.errors.push(error);
};

export const back = (last, flow) => {
  flow.path.pop();
  if (last.hasErrors && flow.path[flow.path.length - 1]) flow.path[flow.path.length - 1].hasErrors = true;
};

export const babilon: IBabilon = (flow) => {
  flow.path = [{ exp: flow.exp, args: [] }];
  flow.errors = [];
  flow.throw = flow.throw || defaultThrow;

  flow.toString = () => {
    if (flow.errors.length) {
      throw new Error(`${flow.errors[0].emitter} ${flow.errors[0].path.map(p => `[${p}]`).join('')}: ${flow.errors[0].message}`);
    }
    return flow.result;
  };

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
