export declare type TExp = any[];
export interface IStep {
    exp: TExp;
    args?: any[];
    index?: number;
    validateMemory?: any;
    hasErrors?: true;
}
export interface IValidator {
    (last: IStep, flow: IFlow): void;
}
export interface IResolver {
    (last: IStep, flow: IFlow): void;
}
export interface IError {
    path: number[];
    emitter: string;
    message: string;
}
export interface IThrow {
    (emitter: string, message: string): any;
}
export interface IFlow {
    exp: TExp;
    variables?: {};
    path?: IStep[];
    validate?: IValidator;
    resolver?: IResolver;
    errors?: IError[];
    throw?: IThrow;
    result?: any;
    resolveMemory?: any;
    validateMemory?: any;
}
export interface IBabilon {
    (flow: IFlow): IFlow;
}
export declare const defaultThrow: IThrow;
export declare const back: (last: any, flow: any) => void;
export declare const babilon: IBabilon;
export default babilon;
