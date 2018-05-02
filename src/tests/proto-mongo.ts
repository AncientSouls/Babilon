import { assert } from 'chai';

import {
  babilon,
} from '../lib/babilon';

import {
  createResolver,
  resolverOptions,
  validate,
} from '../lib/proto-mongo';

const resolver = createResolver(resolverOptions);

const babi = (exp, result) => {
  const b = babilon({ resolver, validate, exp });
  assert.deepEqual(b.errors, []);
  assert.deepEqual(b.result, result);
  return b;
};

export default () => {
  describe('mongo', () => {
    it('select', () => {
      babi(
        ['select',
          ['returns',
            ['path','a'],
            ['path','b'],
            ['path','c'],
          ],
          ['from',
            ['alias','x'],
          ],
          ['and',
            ['gt',['path','a'],['data',10]],
            ['or',
              ['eq',['path','b'],['data',123]],
              ['eq',['path','c'],['data',123]],
            ],
          ],
          ['orders', ['order', ['path','a']], ['order', ['path','b'], false]],
          ['limit', 10], ['skip', 10],
        ],
        {
          collection: 'x',
          fields: { a: 1, b: 1, c: 1 },
          selector: { $and: [
            { a: { $gt: 10 } },
            { $or: [{ b: { $eq: 123 } }, { c: { $eq: 123 } }] },
          ] },
          limit: 10,
          skip: 10,
          sort: { a: 1, b: -1 },
        },
      );
    });
  });
};
