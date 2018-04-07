"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const uuid_1 = require("uuid");
const babilon_1 = require("./babilon");
const validators_1 = require("./validators");
exports.allowedExpressions = validators_1.allowedExpressions;
const defaultValidators = validators_1.newValidators(exports.allowedExpressions);
exports.validators = Object.create(defaultValidators);
exports.validators.from = (last, flow) => {
    if (last.exp.length < 2)
        return babilon_1.error(last.exp[0], `length < 2`, flow);
    defaultValidators.from(last, flow);
};
exports.validators.data = (last, flow) => {
    if (_.isBoolean(last.exp[1]) || _.isNumber(last.exp[1]) || _.isString(last.exp[1]))
        defaultValidators.data(last, flow);
    else
        babilon_1.error(last.exp[0], `[0] is not boolean or number or string`, flow);
};
exports.createResolver = options => (last, flow) => {
    let result;
    switch (last.exp[0]) {
        case 'data':
            if (_.isBoolean(last.exp[1]) || _.isNumber(last.exp[1])) {
                result = last.exp[1].toString();
            }
            else if (_.isString(last.exp[1])) {
                const uniqueStringIsolation = options.uniqueStringIsolation();
                result = `$${uniqueStringIsolation}$${last.exp[1]}$${uniqueStringIsolation}$`;
            }
            else
                throw new Error(`Unexpected data type.`);
            break;
        case 'path':
            if (last.exp.length === 2)
                result = `"${last.exp[1]}"`;
            else
                result = `"${last.exp[1]}"."${last.exp[2]}"`;
            break;
        case 'alias':
            if (last.exp.length === 2)
                result = `"${last.exp[1]}"`;
            else
                result = `"${last.exp[1]}" as "${last.exp[2]}"`;
            break;
        case 'as':
            result = `${last.memory[0]} as "${last.exp[2]}"`;
            break;
        case '=':
        case '!=':
        case '>':
        case '>=':
        case '<':
        case '<=':
            result = `${last.memory[0]} ${last.exp[0]} ${last.memory[1]}`;
            break;
        case '+':
        case '-':
        case '*':
        case '/':
            result = `${last.memory[0]} ${last.exp[0]} ${last.memory[1]}`;
            break;
        case ':':
            result = `${last.memory[0]} || ${last.memory[1]}`;
            break;
        case 'and':
        case 'or':
            result = _.map(last.memory, m => `(${m})`).join(` ${last.exp[0]} `);
            break;
        case 'order':
            result = `${last.memory[0]} ${last.exp[2] === false ? 'DESC' : 'ASC'}`;
            break;
        case 'group':
            result = last.memory[0];
            break;
        case 'limit':
        case 'skip':
            result = last.exp[1].toString();
            break;
        case 'returns':
        case 'from':
        case 'orders':
        case 'groups':
            result = last.memory.join(',');
            break;
        case 'select':
            result = `select`;
            const temp = {};
            _.each(last.exps, (exp, i) => temp[exp[0]] = last.memory[i]);
            if (_.has(temp, 'returns'))
                result += ` ${temp.returns}`;
            if (_.has(temp, 'from'))
                result += ` from ${temp.from}`;
            if (_.has(temp, 'and'))
                result += ` where ${temp.and}`;
            if (_.has(temp, 'orders'))
                result += ` order by ${temp.orders}`;
            if (_.has(temp, 'groups'))
                result += ` group by ${temp.groups}`;
            if (_.has(temp, 'limit'))
                result += ` limit ${temp.limit}`;
            if (_.has(temp, 'skip'))
                result += ` offset ${temp.skip}`;
            break;
        default:
            throw new Error(`Unexpected exp: ${last.exp[0]}`);
    }
    if (flow.path[flow.path.length - 2]) {
        flow.path[flow.path.length - 2].memory = flow.path[flow.path.length - 2].memory || [];
        flow.path[flow.path.length - 2].memory.push(result);
    }
    else
        flow.result = result;
};
exports.resolver = exports.createResolver({
    uniqueStringIsolation: () => uuid_1.v4(),
});
//# sourceMappingURL=pg.js.map