"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
require('source-map-support').install();
const validators_1 = require("./validators");
const babilon_1 = require("./babilon");
const pg_1 = require("./pg");
const mongo_1 = require("./mongo");
describe('AncientSouls/Babilon:', () => {
    validators_1.default();
    babilon_1.default();
    pg_1.default();
    mongo_1.default();
});
//# sourceMappingURL=index.js.map