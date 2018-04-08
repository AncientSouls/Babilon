"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
require('source-map-support').install();
const validators_1 = require("./validators");
const babilon_1 = require("./babilon");
const sql_1 = require("./sql");
describe('AncientSouls/Babilon:', () => {
    validators_1.default();
    babilon_1.default();
    sql_1.default();
});
//# sourceMappingURL=index.js.map