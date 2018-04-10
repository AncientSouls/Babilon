"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.restrictSelect = (exp, restricting) => {
    const select = _.clone(exp);
    const i = {};
    _.each(exp, (exp, e) => e ? i[exp[0]] = e : null);
    select[i.from] = _.clone(exp[i.from]);
    select[i.and] = exp[i.and] ? _.clone(exp[i.and]) : ['and'];
    restricting(exp, select[i.and], select[i.from]);
    return select;
};
exports.restrict = (exp, restricting) => {
    if (exp[0] === 'select') {
        return exports.restrictSelect(exp, restricting);
    }
    if (exp[0] === 'union' || exp[0] === 'unionall') {
        return _.map(exp, (exp, e) => e ? exports.restrictSelect(exp, restricting) : exp);
    }
    throw new Error(`unexpected root exp ${exp[0]}`);
};
//# sourceMappingURL=restrict.js.map