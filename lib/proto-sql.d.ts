import { IRules } from './rules';
import { IValidator } from './babilon';
export declare const types: any;
export declare const rules: IRules;
export declare const validate: IValidator;
export declare const resolverOptions: {
    _column(name: any): string;
    _checks: {
        eq: string;
        not: string;
        gt: string;
        gte: string;
        lt: string;
        lte: string;
    };
    _operators: {
        add: string;
        plus: string;
        minus: string;
        multiply: string;
        divide: string;
    };
    _logic(last: any, flow: any): string;
    _check(last: any, flow: any): string;
    _operator(last: any, flow: any): string;
    _param(flow: any, data: any): string;
    data(last: any, flow: any): any;
    variable(last: any, flow: any): any;
    path(last: any, flow: any): string;
    alias(last: any, flow: any): string;
    as(last: any, flow: any): string;
    and(last: any, flow: any): any;
    or(last: any, flow: any): any;
    eq(last: any, flow: any): any;
    not(last: any, flow: any): any;
    gt(last: any, flow: any): any;
    gte(last: any, flow: any): any;
    lt(last: any, flow: any): any;
    lte(last: any, flow: any): any;
    add(last: any, flow: any): any;
    plus(last: any, flow: any): any;
    minus(last: any, flow: any): any;
    multiply(last: any, flow: any): any;
    divide(last: any, flow: any): any;
    order(last: any, flow: any): string;
    orders(last: any, flow: any): any;
    group(last: any, flow: any): any;
    groups(last: any, flow: any): any;
    limit(last: any, flow: any): any;
    skip(last: any, flow: any): any;
    returns(last: any, flow: any): any;
    from(last: any, flow: any): any;
    select(last: any, flow: any): string;
    union(last: any, flow: any): string;
    unionall(last: any, flow: any): string;
};
export declare const createResolver: (options: any) => (last: any, flow: any) => void;
