export declare type TExp = any[];
export interface IStep {
    exp: TExp;
    exps?: TExp[];
    memory?: any;
    index?: number;
    hasErrors?: true;
}
export interface IValidator {
    (last: IStep, flow: IFlow): void;
}
export interface IValidators {
    [exp: string]: IValidator;
}
export interface IResolver {
    (last: any, flow: any): void;
}
export interface IError {
    path: number[];
    emitter: string;
    message: string;
}
export interface IFlow {
    exp: TExp;
    path?: IStep[];
    validators?: IValidators;
    validate?: IValidator;
    resolver?: IResolver;
    errors?: IError[];
    result?: any;
    memory?: any;
}
export interface IBabilon {
    (flow: IFlow): IFlow;
}
export declare const router: (flow: any) => void;
export declare const validate: (last: IStep, flow: IFlow) => void;
export declare const error: (emitter: any, message: any, flow: IFlow) => void;
export declare const back: (last: any, flow: any) => void;
export declare const babilon: IBabilon;
