export interface IAllowedExpressions {
    [name: string]: {
        [index: number]: string[];
    };
}
export declare const allowedExpressions: {
    as: {
        1: string[];
    };
    check: {
        1: string[];
        2: string[];
    };
    operator: {
        1: string[];
        2: string[];
    };
    and: {
        all: string[];
    };
    or: {
        all: string[];
    };
    order: {
        1: string[];
    };
    group: {
        1: string[];
    };
    returns: {
        all: string[];
    };
    from: {
        all: string[];
    };
    orders: {
        all: string[];
    };
    groups: {
        all: string[];
    };
    select: {
        unique: boolean;
        all: string[];
    };
};
export declare const validators: any;
export declare const createResolver: (options: any) => (last: any, flow: any) => void;
export declare const resolver: (last: any, flow: any) => void;
