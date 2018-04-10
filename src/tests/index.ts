import 'mocha';
require('source-map-support').install();

import validators from './validators';
import finalize from './finalize';
import babilon from './babilon';
import protoSql from './proto-sql';
import protoMongo from './proto-mongo';
import returnsReferences from './returns-references';
import restrict from './restrict';

describe('AncientSouls/Babilon:', () => {
  validators();
  finalize();
  babilon();
  protoSql();
  protoMongo();
  returnsReferences();
  restrict();
});
