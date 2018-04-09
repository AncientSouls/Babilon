import { assert } from 'chai';

import {
  rules,
  finalize,
} from '../lib/validators';

export default () => {
  it('finalize', () => {
    assert.deepEqual(
      finalize(rules, 'as'),
      {
        name: 'as',
        rule: { args: [':get', '?string'] },
        unique: undefined,
        args: [
          [
            '!data',
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
    console.log(
      finalize(rules, 'and'),
      {
        name: 'and',
        rule: {
          all: [':get'],
        },
        unique: undefined,
        all: [
          '!data',
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
