export interface IAllowedExpressions {
    [name: string]: {
        unique?: boolean;
        all?: string[];
        [index: number]: string[];
    };
}
export declare const logics: string[];
export declare const checks: string[];
export declare const operators: string[];
export declare const getters: string[];
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
export declare const newValidators: (allowedExpressions: IAllowedExpressions) => {
    data(last: any, flow: any): void;
    path(last: any, flow: any): void;
    alias(last: any, flow: any): void;
    as(last: any, flow: any): void;
    order(last: any, flow: any): void;
    group(last: any, flow: any): void;
    limit: (last: any, flow: any) => void;
    skip: (last: any, flow: any) => void;
    returns: (last: any, flow: any) => void;
    from: (last: any, flow: any) => void;
    orders: (last: any, flow: any) => void;
    groups: (last: any, flow: any) => void;
    select: (last: any, flow: any) => void;
};
export declare const validators: {
    data(last: any, flow: any): void;
    path(last: any, flow: any): void;
    alias(last: any, flow: any): void;
    as(last: any, flow: any): void;
    order(last: any, flow: any): void;
    group(last: any, flow: any): void;
    limit: (last: any, flow: any) => void;
    skip: (last: any, flow: any) => void;
    returns: (last: any, flow: any) => void;
    from: (last: any, flow: any) => void;
    orders: (last: any, flow: any) => void;
    groups: (last: any, flow: any) => void;
    select: (last: any, flow: any) => void;
};
