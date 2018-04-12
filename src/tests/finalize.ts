import { assert } from 'chai';

import {
  rules,
  finalize,
} from '../lib/rules';

export default () => {
  it('finalize', () => {
    assert.deepEqual(
      finalize(rules, 'as'),
      {
        name: 'as',
        rule: { args: [':get', '?string'] },
        args: [
          [
            '!data',
            '!variable',
            '!path',
            '!and',
            '!or',
            '!eq',
            '!not',
            '!gt',
            '!gte',
            '!lt',
            '!lte',
            '!add',
            '!plus',
            '!minus',
            '!multiply',
            '!divide',
            '!select',
            '!union',
            '!unionall',
          ],
          [
            'string',
          ],
        ],
      },
    );
    assert.deepEqual(
      finalize(rules, 'and'),
      {
        name: 'and',
        rule: {
          all: [':get'],
        },
        all: [
          '!data',
          '!variable',
          '!path',
          '!and',
          '!or',
          '!eq',
          '!not',
          '!gt',
          '!gte',
          '!lt',
          '!lte',
          '!add',
          '!plus',
          '!minus',
          '!multiply',
          '!divide',
          '!select',
          '!union',
          '!unionall',
        ],
      },
    );
  });
};
