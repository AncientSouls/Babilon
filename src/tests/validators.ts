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
      babi(['data'], [{ path: [], emitter: 'data', message: 'arg [0] :data is not defined' }]);
    });
    it('path', () => {
      babi(['path', 'a'], []);
      babi(['path', 'a', 'b'], []);
      babi(['path', 'a', 'b', 'c'], []);
      babi(['path'], [{ path: [], emitter: 'path', message: 'arg [0] string is not defined' }]);
      babi(['path', 123], [{ path: [], emitter: 'path', message: 'arg [0] is not string' }]);
      babi(['path', {}], [{ path: [], emitter: 'path', message: 'arg [0] is not string' }]);
    });
    it('alias', () => {
      babi(['alias', 'a'], []);
      babi(['alias', 'a', 'b'], []);
      babi(['alias', 123], [{ path: [], emitter: 'alias', message: 'arg [0] is not string' }]);
      babi(['alias'], [{ path: [], emitter: 'alias', message: 'arg [0] string is not defined' }]);
    });
    it('as', () => {
      babi(['as', ['data', 123], 'x'], []);
      babi(['as'], [{ path: [], emitter: 'as', message: 'arg [0] :get is not defined' }]);
      babi(['as', 123, 'x'], [{ path: [], emitter: 'as', message: 'arg [0] is not :get' }]);
      babi(['as', ['data', 123], 123], [{ path: [], emitter: 'as', message: 'arg [1] is not ?string' }]);
    });
    it('check', () => {
      babi(['eq', ['data', 123], ['data', 123]], []);
      babi(['not', ['data', 123], ['data', 123]], []);
      babi(['gt', ['data', 123], ['data', 123]], []);
      babi(['gte', ['data', 123], ['data', 123]], []);
      babi(['lt', ['data', 123], ['data', 123]], []);
      babi(['lte', ['data', 123], ['data', 123]], []);
    });
    it('operators', () => {
      babi(['add', ['data', 123], ['data', 123]], []);
      babi(['plus', ['data', 123], ['data', 123]], []);
      babi(['minus', ['data', 123], ['data', 123]], []);
      babi(['multiply', ['data', 123], ['data', 123]], []);
      babi(['divide', ['data', 123], ['data', 123]], []);
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
            message: 'arg [1] has duplicates of returns',
            path: [],
          },
        ],
      );
      babi(
        [
          'select',
          ['returns', ['path', 'a'], ['as', ['data', 123], 'x']],
        ],
        [
          {
            emitter: 'select',
            message: 'select required expression from',
            path: [],
          },
        ],
      );
    });
  });
};
