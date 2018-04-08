export declare const rules: {
    types: {
        data: string[];
        logic: string[];
        check: string[];
    };
    expressions: {
        data: {
            args: string[];
        };
        path: {
            args: string[];
            all: string[];
        };
        alias: {
            args: string[];
        };
        and: {
            all: string[];
        };
        or: {
            all: string[];
        };
        eq: {
            args: string[];
        };
        not: {
            args: string[];
        };
        gt: {
            args: string[];
        };
        gte: {
            args: string[];
        };
        lt: {
            args: string[];
        };
        lte: {
            args: string[];
        };
        order: {
            args: string[];
        };
        orders: {
            all: string[];
        };
        limit: {
            args: string[];
        };
        skip: {
            args: string[];
        };
        returns: {
            all: string[];
        };
        from: {
            args: string[];
        };
        select: {
            unique: boolean;
            all: string[];
            handle: (last: any, flow: any) => any;
        };
    };
};
export declare const validators: {};
export interface IResolverOptions {
    [name: string]: any;
}
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
