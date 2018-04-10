"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
require('source-map-support').install();
const validators_1 = require("./validators");
const finalize_1 = require("./finalize");
const babilon_1 = require("./babilon");
const proto_sql_1 = require("./proto-sql");
const proto_mongo_1 = require("./proto-mongo");
const returns_references_1 = require("./returns-references");
describe('AncientSouls/Babilon:', () => {
    validators_1.default();
    finalize_1.default();
    babilon_1.default();
    proto_sql_1.default();
    proto_mongo_1.default();
    returns_references_1.default();
});
//# sourceMappingURL=index.js.map