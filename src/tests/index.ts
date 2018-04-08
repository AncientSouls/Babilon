import 'mocha';
require('source-map-support').install();

import validators from './validators';
import babilon from './babilon';
import sql from './sql';
// import mongo from './mongo';

describe('AncientSouls/Babilon:', () => {
  validators();
  babilon();
  sql();
  // mongo();
});
