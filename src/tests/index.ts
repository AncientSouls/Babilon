import 'mocha';
require('source-map-support').install();

import validators from './validators';
import babilon from './babilon';
import protoSql from './proto-sql';
import protoMongo from './proto-mongo';

describe('AncientSouls/Babilon:', () => {
  validators();
  babilon();
  protoSql();
  protoMongo();
});
