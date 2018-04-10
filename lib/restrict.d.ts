import { TExp } from './babilon';
export interface IRestricting {
    (exp: TExp, and: TExp, from: TExp): any;
}
export declare const restrictSelect: (exp: any[], restricting: IRestricting) => any[];
export declare const restrict: (exp: any[], restricting: IRestricting) => any[];
