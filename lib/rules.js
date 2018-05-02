"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = {};
exports.types.data = ['undefined', 'string', 'number', 'boolean', 'object', 'array'];
exports.types.logic = ['!and', '!or'];
exports.types.check = ['!eq', '!not', '!gt', '!gte', '!lt', '!lte'];
exports.types.operator = ['!add', '!plus', '!minus', '!multiply', '!divide'];
exports.types.unions = ['!union', '!unionall'];
exports.types.fetch = ['!select', ...exports.types.unions];
exports.types.get = ['!data', '!variable', '!path', ...exports.types.logic, ...exports.types.check, ...exports.types.operator, ...exports.types.fetch];
exports.createRules = types => ({
    data: { args: [{ variants: types.data }] },
    variable: { args: [{ variants: ['string'] }] },
    path: { args: [{ variants: ['string'] }], all: ['string'] },
    alias: { args: [{ variants: ['string'] }, { variants: ['string'], optional: true }] },
    as: { args: [{ variants: types.get }, { variants: ['string'], optional: true }] },
    and: { all: types.get },
    or: { all: types.get },
    eq: { args: [{ variants: types.get }, { variants: types.get }] },
    not: { args: [{ variants: types.get }, { variants: types.get }] },
    gt: { args: [{ variants: types.get }, { variants: types.get }] },
    gte: { args: [{ variants: types.get }, { variants: types.get }] },
    lt: { args: [{ variants: types.get }, { variants: types.get }] },
    lte: { args: [{ variants: types.get }, { variants: types.get }] },
    add: { all: types.get },
    plus: { all: types.get },
    minus: { all: types.get },
    multiply: { all: types.get },
    divide: { all: types.get },
    order: { args: [{ variants: ['!path'] }, { variants: ['boolean'], optional: true }] },
    orders: { all: ['!order'] },
    group: { args: [{ variants: ['!path'] }] },
    groups: { all: ['!group'] },
    limit: { args: [{ variants: ['number'] }] },
    skip: { args: [{ variants: ['number'] }] },
    returns: { all: ['!as', '!path', ...types.get] },
    from: { all: ['!alias'] },
    select: {
        unique: true,
        all: ['!returns', '!from', '!and', '!orders', '!groups', '!limit', '!skip'],
        handle(last, flow) {
            if (!last.validateMemory.expressions.from) {
                flow.throw(last.exp[0], `"select" required "from"`, flow);
            }
        },
    },
    union: { all: types.fetch },
    unionall: { all: types.fetch },
});
exports.rules = exports.createRules(exports.types);
//# sourceMappingURL=rules.js.map