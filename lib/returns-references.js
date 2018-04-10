"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.generateReturnsString = (separator = '/', idField = 'id') => (select, from) => {
    return ['returns', ['add', ['data', from[1]], ['data', '/'], ['path', from[1], idField]]];
};
exports.generateReturnsAs = (asFrom = 'from', asId = 'id', idField = 'id') => (select, from) => {
    return ['returns', ['as', ['data', from[1]], asFrom], ['as', ['path', from[1], idField], asId]];
};
exports.returnsReferencesSelect = (exp, generateReturns = exports.generateReturnsAs()) => {
    const i = {};
    _.each(exp, (exp, e) => e ? i[exp[0]] = e : null);
    const selects = [];
    _.each(exp[i.from], (from, f) => {
        if (f) {
            const select = _.clone(exp);
            select[i.returns] = generateReturns(exp, from);
            selects.push(select);
        }
    });
    return selects;
};
exports.returnsReferences = (exp, generateReturns = exports.generateReturnsAs()) => {
    if (exp[0] === 'select') {
        return ['union', ...exports.returnsReferencesSelect(exp, generateReturns)];
    }
    if (exp[0] === 'union' || exp[0] === 'unionall') {
        const result = [exp[0]];
        _.each(exp.slice(1), select => result.push(...exports.returnsReferencesSelect(select, generateReturns)));
        return result;
    }
    throw new Error(`unexpected root exp ${exp[0]}`);
};
//# sourceMappingURL=returns-references.js.map