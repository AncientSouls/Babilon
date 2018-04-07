import { assert } from 'chai';

import {
  babilon,
} from '../lib/babilon';

export default () => {
  describe('babilon', () => {
    it('validation errors', () => {
      assert.deepEqual(
        babilon({
          exp: ['as', ['and', ['=', ['path', 'a'], ['path', 'b']], ['!=', ['path'], ['path', 'a']]], 'x'],
        }).errors,
        [
          {
            emitter: 'path',
            message: 'length < 2',
            path: [0,1,0],
          },
        ],
      );
    });
  });
};
