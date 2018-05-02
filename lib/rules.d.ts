export interface IArg {
    variants: string[];
    optional?: boolean;
}
export interface IRule {
    args?: IArg[];
    all?: string[];
    unique?: boolean;
    handle?: (last, flow) => any;
}
export interface IRules {
    [name: string]: IRule;
}
export declare const types: any;
export declare const createRules: (types: any) => {
    data: {
        args: {
            variants: any;
        }[];
    };
    variable: {
        args: {
            variants: string[];
        }[];
    };
    path: {
        args: {
            variants: string[];
        }[];
        all: string[];
    };
    alias: {
        args: ({
            variants: string[];
            optional?: undefined;
        } | {
            variants: string[];
            optional: boolean;
        })[];
    };
    as: {
        args: ({
            variants: any;
            optional?: undefined;
        } | {
            variants: string[];
            optional: boolean;
        })[];
    };
    and: {
        all: any;
    };
    or: {
        all: any;
    };
    eq: {
        args: {
            variants: any;
        }[];
    };
    not: {
        args: {
            variants: any;
        }[];
    };
    gt: {
        args: {
            variants: any;
        }[];
    };
    gte: {
        args: {
            variants: any;
        }[];
    };
    lt: {
        args: {
            variants: any;
        }[];
    };
    lte: {
        args: {
            variants: any;
        }[];
    };
    add: {
        all: any;
    };
    plus: {
        all: any;
    };
    minus: {
        all: any;
    };
    multiply: {
        all: any;
    };
    divide: {
        all: any;
    };
    order: {
        args: ({
            variants: string[];
            optional?: undefined;
        } | {
            variants: string[];
            optional: boolean;
        })[];
    };
    orders: {
        all: string[];
    };
    group: {
        args: {
            variants: string[];
        }[];
    };
    groups: {
        all: string[];
    };
    limit: {
        args: {
            variants: string[];
        }[];
    };
    skip: {
        args: {
            variants: string[];
        }[];
    };
    returns: {
        all: any[];
    };
    from: {
        all: string[];
    };
    select: {
        unique: boolean;
        all: string[];
        handle(last: any, flow: any): void;
    };
    union: {
        all: any;
    };
    unionall: {
        all: any;
    };
};
export declare const rules: IRules;
