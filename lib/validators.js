"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.createValidate = (rules) => (last, flow) => {
    if (!_.isArray(last.exp) || !_.isString(last.exp[0])) {
        return flow.throw('validate', 'is not expression');
    }
    if (!rules[last.exp[0]]) {
        return flow.throw('validate', `unexpected exp ${last.exp[0]}`);
    }
    flow.validateMemory = flow.validateMemory || { aliases: [], selects: [] };
    last.validateMemory = last.validateMemory || { expressions: {} };
    const rule = rules[last.exp[0]];
    if (rule.args) {
        let a;
        args: for (a = 0; a < rule.args.length; a++) {
            const arg = rule.args[a];
            const exp = last.exp[a + 1];
            if (last.exp.length < a + 2) {
                if (!arg.optional) {
                    flow.throw(last.exp[0], `arg [${a}] types ${arg.optional ? '?' : ''}[${arg.variants}] is not defined`);
                }
            }
            else {
                let v;
                for (v in arg.variants) {
                    const variant = arg.variants[v];
                    if (variant[0] === '!') {
                        if (_.isArray(exp) && '!' + exp[0] === variant) {
                            last.args[a] = exp;
                            continue args;
                        }
                    }
                    else if (_.includes(['undefined', 'string', 'number', 'boolean', 'object', 'array'], variant)) {
                        if (_[`is${_.capitalize(variant)}`](exp)) {
                            last.args[a] = undefined;
                            continue args;
                        }
                    }
                }
                flow.throw(last.exp[0], `arg [${a}] is not ${arg.optional ? '?' : ''}[${arg.variants}]`);
            }
        }
    }
    if (rule.all) {
        const repeats = {};
        let a;
        args: for (a = 1; a < last.exp.length; a++) {
            const exp = last.exp[a];
            let v;
            if (_.isArray(exp)) {
                repeats[exp[0]] = repeats[exp[0]] + 1 || 1;
                if (repeats[exp[0]] > 1 && rule.unique) {
                    flow.throw(last.exp[0], `arg [${a - 1}] duplicates "${exp[0]}"`);
                }
            }
            last.validateMemory.expressions[exp[0]] = true;
            if (rule.all) {
                for (v in rule.all) {
                    const variant = rule.all[v];
                    if (variant[0] === '!') {
                        if (_.isArray(exp) && '!' + exp[0] === variant) {
                            last.args[a - 1] = exp;
                            continue args;
                        }
                    }
                    else if (_.includes(['undefined', 'string', 'number', 'boolean', 'object', 'array'], variant)) {
                        if (_[`is${_.capitalize(variant)}`](exp)) {
                            last.args[a - 1] = undefined;
                            continue args;
                        }
                    }
                }
                flow.throw(last.exp[0], `arg [${a - 1}] not all correspond to [${rule.all}]`);
            }
        }
    }
    if (last.exp[0] === 'select')
        flow.validateMemory.selects.push(last);
    if (last.exp[0] === 'alias')
        flow.validateMemory.aliases.push(last);
    if (rule.handle)
        rule.handle(last, flow);
};
//# sourceMappingURL=validators.js.map