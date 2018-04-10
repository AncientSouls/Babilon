export declare const generateReturnsString: (separator?: string, idField?: string) => (select: any, from: any) => (string | (string | any[])[])[];
export declare const generateReturnsAs: (asFrom?: string, asId?: string, idField?: string) => (select: any, from: any) => (string | (string | any[])[])[];
export declare const returnsReferencesSelect: (exp: any[], createReturns?: (select: any, from: any) => (string | (string | any[])[])[]) => any[][];
export declare const returnsReferences: (exp: any[], createReturns?: (select: any, from: any) => (string | (string | any[])[])[]) => any[];
