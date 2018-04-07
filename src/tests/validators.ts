import { assert } from 'chai';

import {
  babilon,
} from '../lib/babilon';

const babi = (exp, errors) => {
  assert.deepEqual(babilon({ exp }).errors, errors);
};

export default () => {
  describe('validators', () => {
    it('data', () => {
      babi(['data', true], []);
      babi(['data', false], []);
      babi(['data', 123], []);
      babi(['data', 'abc'], []);
      babi(['data', [1,2,3]], []);
      babi(['data', { a: 1, b: 2, c: 3 }], []);
      babi(['data'], [{ path: [], emitter: 'data', message: 'length !== 2' }]);
    });
    it('path', () => {
      babi(['path', 'a'], []);
      babi(['path', 'a', 'b'], []);
      babi(['path', 'a', 'b', 'c'], []);
      babi(['path'], [{ path: [], emitter: 'path', message: 'length < 2' }]);
      babi(['path', 123], [{ path: [], emitter: 'path', message: '[1] is not string' }]);
      babi(['path', {}], [{ path: [], emitter: 'path', message: '[1] is not string' }]);
    });
    it('alias', () => {
      babi(['alias', 'a'], []);
      babi(['alias', 'a', 'b'], []);
      babi(['alias', 'a', 'b', 'c'], [{ path: [], emitter: 'alias', message: 'length not in 2...3' }]);
      babi(['alias', 123], [{ path: [], emitter: 'alias', message: '[1] is not string' }]);
      babi(['alias'], [{ path: [], emitter: 'alias', message: 'length not in 2...3' }]);
    });
    it('as', () => {
      babi(['as', ['data', 123], 'x'], []);
      babi(['as'], [{ path: [], emitter: 'as', message: 'length !== 3' }]);
      babi(['as', 123, 'x'], [{ path: [], emitter: 'as', message: '[1] is not exp' }]);
      babi(['as', ['data', 123], 123], [{ path: [], emitter: 'as', message: '[2] is not string' }]);
    });
    it('check', () => {
      babi(['=', ['data', 123], ['data', 123]], []);
      babi(['!=', ['data', 123], ['data', 123]], []);
      babi(['>', ['data', 123], ['data', 123]], []);
      babi(['>=', ['data', 123], ['data', 123]], []);
      babi(['<', ['data', 123], ['data', 123]], []);
      babi(['<=', ['data', 123], ['data', 123]], []);
    });
    it('operators', () => {
      babi(['+', ['data', 123], ['data', 123]], []);
      babi(['-', ['data', 123], ['data', 123]], []);
      babi(['*', ['data', 123], ['data', 123]], []);
      babi(['/', ['data', 123], ['data', 123]], []);
      babi([':', ['data', 123], ['data', 123]], []);
    });
    it('logic', () => {
      babi(['and', ['data', 123], ['data', 123]], []);
      babi(['or', ['data', 123], ['data', 123]], []);
    });
    it('order', () => {
      babi(['order', ['path','a']], []);
      babi(['order', ['path','a'], true], []);
      babi(['order', ['path','a'], false], []);
    });
    it('group', () => {
      babi(['group', ['path','a']], []);
    });
    it('limit skip', () => {
      babi(['limit', 7], []);
      babi(['skip', 7], []);
    });
    it('returns', () => {
      babi(['returns', ['path', 'a'], ['as', ['data', 123], 'x']], []);
    });
    it('from', () => {
      babi(['from', ['alias', 'a'], ['alias', 'a', 'b']], []);
    });
    it('select', () => {
      babi(
        [
          'select',
          ['returns', ['path', 'a'], ['as', ['data', 123], 'x']],
          ['from', ['alias', 'a'], ['alias', 'a', 'b']],
          ['and', ['data', 123], ['data', 123]],
          ['orders', ['order', ['path', 'a']], ['order', ['path', 'b', 'c'], false]],
          ['limit', 10], ['skip', 10],
        ],
        [],
      );
      babi(
        [
          'select',
          ['returns', ['path', 'a'], ['as', ['data', 123], 'x']],
          ['returns', ['path', 'a'], ['as', ['data', 123], 'x']],
        ],
        [
          {
            emitter: 'select',
            message: '[2] not unique returns',
            path: [],
          },
        ],
      );
    });
  });
};
