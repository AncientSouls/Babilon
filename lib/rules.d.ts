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