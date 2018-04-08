"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const validators_1 = require("./validators");
exports.router = (flow) => {
};
exports.validate = (last, flow) => {
    if (!_.isArray(last.exp) || !_.isString(last.exp[0])) {
        exports.error('validate', 'is not expression', flow);
    }
    else {
        if (!flow.validators[last.exp[0]]) {
            exports.error('validate', `unexpected exp ${last.exp[0]}`, flow);
        }
        else {
            flow.validators[last.exp[0]](last, flow);
        }
    }
};
exports.error = (emitter, message, flow) => {
    const last = _.last(flow.path);
    const path = [];
    _.each(flow.path, p => _.isNumber(p.index) ? path.push(p.index) : null);
    const error = { emitter, message, path };
    last.hasErrors = true;
    flow.errors.push(error);
};
exports.back = (last, flow) => {
    flow.path.pop();
    if (last.hasErrors && flow.path[flow.path.length - 1])
        flow.path[flow.path.length - 1].hasErrors = true;
};
exports.babilon = (flow) => {
    flow.path = [{ exp: flow.exp, args: [] }];
    flow.validate = flow.validate || exports.validate;
    flow.validators = flow.validators || validators_1.validators;
    flow.errors = [];
    let last;
    while (true) {
        if (!flow.path.length)
            return flow;
        last = _.last(flow.path);
        if (_.isNumber(last.index)) {
            last.index++;
            if (last.args.length > last.index) {
                if (last.args[last.index]) {
                    flow.path.push({ exp: last.args[last.index], args: [] });
                }
            }
            else {
                if (flow.resolver)
                    flow.resolver(last, flow);
                exports.back(last, flow);
            }
        }
        else {
            flow.validate(last, flow);
            if (last.hasErrors) {
                exports.back(last, flow);
            }
            else {
                if (last.args && last.args.length) {
                    last.index = -1;
                }
                else {
                    if (flow.resolver)
                        flow.resolver(last, flow);
                    exports.back(last, flow);
                }
            }
        }
    }
};
//# sourceMappingURL=babilon.js.map