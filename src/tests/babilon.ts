import { assert } from 'chai';

import {
  babilon,
} from '../lib/babilon';

export default () => {
  describe('babilon', () => {
    it('validation errors', () => {
      assert.deepEqual(
        babilon({
          exp: ['as', ['and', ['eq', ['path', 'a'], ['path', 'b']], ['not', ['path'], ['path', 'a']]], 'x'],
        }).errors,
        [
          {
            emitter: 'path',
            message: 'arg [0] string is not defined',
            path: [0,1,0],
          },
        ],
      );
    });
  });
};
