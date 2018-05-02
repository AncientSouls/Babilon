import { IRules } from './rules';
import { IValidator } from './babilon';
export declare const types: any;
export declare const rules: IRules;
export declare const validate: IValidator;
export declare const resolverOptions: {
    _logic(last: any, flow: any): {
        [x: string]: any;
    };
    _check(last: any, flow: any): {
        [x: number]: {
            [x: string]: any;
        };
    };
    data(last: any, flow: any): any;
    variable(last: any, flow: any): any;
    path(last: any, flow: any): any;
    alias(last: any, flow: any): any;
    and(last: any, flow: any): any;
    or(last: any, flow: any): any;
    eq(last: any, flow: any): any;
    not(last: any, flow: any): any;
    gt(last: any, flow: any): any;
    gte(last: any, flow: any): any;
    lt(last: any, flow: any): any;
    lte(last: any, flow: any): any;
    order(last: any, flow: any): any[];
    orders(last: any, flow: any): {};
    limit(last: any, flow: any): any;
    skip(last: any, flow: any): any;
    returns(last: any, flow: any): {};
    from(last: any, flow: any): any;
    select(last: any, flow: any): any;
};
export declare const createResolver: (options: any) => (last: any, flow: any) => void;
