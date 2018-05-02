"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
require('source-map-support').install();
describe('AncientSouls/Babilon:', () => {
    require('./validators').default();
    require('./proto-sql').default();
    require('./proto-mongo').default();
    require('./returns-references').default();
    require('./restrict').default();
});
//# sourceMappingURL=index.js.map