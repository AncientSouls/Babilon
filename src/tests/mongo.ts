import { assert } from 'chai';

import {
  babilon,
} from '../lib/babilon';

import {
  createResolver,
  validators,
} from '../lib/mongo';

const resolver = createResolver({
  uniqueStringIsolation: () => '',
});

const babi = (exp, result) => {
  const b = babilon({ resolver, validators, exp });
  assert.deepEqual(b.errors, []);
  assert.deepEqual(b.result, result);
};

export default () => {
  describe('mongo', () => {
    it('select', () => {
      babi(
        [
          'select',
          ['returns', ['path', 'a']],
          ['from', ['alias', 'a']],
          [
            'and',
            ['=', ['path', 'a'], ['data', 123]],
            ['or', ['=', ['path', 'a'], ['data', 123]]],
          ],
          ['orders', ['order', ['path', 'a']], ['order', ['path', 'b'], false]],
          ['limit', 10], ['skip', 10],
        ],
        {
          collection: 'a',
          fields: { a: 1 },
          selector: { $and: [
            { a: { $eq: 123 } },
            { $or: [{ a: { $eq: 123 } }] },
          ] },
          limit: 10,
          skip: 10,
          sort: { a: 1, b: -1 },
        },
      );
    });
  });
};
