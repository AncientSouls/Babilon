import 'mocha';
require('source-map-support').install();

describe('AncientSouls/Babilon:', () => {
  require('./validators').default();
  require('./proto-sql').default();
  require('./proto-mongo').default();
  require('./returns-references').default();
  require('./restrict').default();
});
