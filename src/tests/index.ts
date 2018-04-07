import 'mocha';
require('source-map-support').install();

import validators from './validators';
import babilon from './babilon';
import pg from './pg';
import mongo from './mongo';

describe('AncientSouls/Babilon:', () => {
  validators();
  babilon();
  pg();
  mongo();
});
