"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
exports.defaultThrow = function (emitter, message) {
    const last = _.last(this.path);
    const path = [];
    _.each(this.path, p => _.isNumber(p.index) ? path.push(p.index) : null);
    const error = { emitter, message, path };
    last.hasErrors = true;
    this.errors.push(error);
};
exports.back = (last, flow) => {
    flow.path.pop();
    if (last.hasErrors && flow.path[flow.path.length - 1])
        flow.path[flow.path.length - 1].hasErrors = true;
};
exports.babilon = (flow) => {
    flow.path = [{ exp: flow.exp, args: [] }];
    flow.errors = [];
    flow.throw = flow.throw || exports.defaultThrow;
    flow.toString = () => {
        if (flow.errors.length) {
            throw new Error(`${flow.errors[0].emitter} ${flow.errors[0].path.map(p => `[${p}]`).join('')}: ${flow.errors[0].message}`);
        }
        return flow.result;
    };
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
exports.default = exports.babilon;
//# sourceMappingURL=babilon.js.map