export interface IRule {
    args?: string[];
    all?: string[];
    unique?: boolean;
    handle?: (last, flow) => any;
}
export interface IRules {
    types: {
        [name: string]: string[];
    };
    expressions: {
        [name: string]: IRule;
    };
}
export interface IRulesFinalized {
    [name: string]: IRuleFinalized;
}
export interface IRuleFinalized {
    args?: string[][];
    all?: string[];
    unique?: boolean;
}
export declare const finalizeVariants: (rules: IRules, variants: string[]) => any[];
export declare const finalize: (rules: IRules, name: string) => IRuleFinalized;
export declare const finalizeRules: (rules: IRules) => IRulesFinalized;
export declare const rules: IRules;
export declare const isType: (last: any, rules: any, exp: any, arg: any, i: any) => boolean;
export declare const isTypes: (last: any, rules: any, types: any, exp: any, i: any) => boolean;
export declare const isArg: (last: any, rules: any, arg: any, exp: any, i: any) => boolean;
export declare const createValidators: (rules: IRules) => {};
export declare const validators: {};
