export interface IAllowedExpressions {
    [name: string]: {
        [index: number]: string[];
    };
}
export declare const getters: string[];
export declare const allowedExpressions: any;
export declare const validators: any;
export declare const toCheck: {
    '=': string;
    '!=': string;
    '>': string;
    '>=': string;
    '<': string;
    '<=': string;
};
export declare const createResolver: (options: any) => (last: any, flow: any) => void;
export declare const resolver: (last: any, flow: any) => void;
