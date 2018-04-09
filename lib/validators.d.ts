export interface IRules {
    types: {
        [name: string]: string[];
    };
    expressions: {
        [name: string]: {
            args?: string[];
            all?: string[];
            unique?: boolean;
            handle?: (last, flow) => any;
        };
    };
}
export declare const rules: IRules;
export declare const isType: (last: any, rules: any, exp: any, arg: any, i: any) => boolean;
export declare const isTypes: (last: any, rules: any, types: any, exp: any, i: any) => boolean;
export declare const isArg: (last: any, rules: any, arg: any, exp: any, i: any) => boolean;
export declare const createValidators: (rules: IRules) => {};
export declare const validators: {};
