import { assert } from 'chai';
import * as _ from 'lodash';
import { v4 } from 'uuid';

import {
  restrictSelect,
  restrict,
  IRestricting,
} from '../lib/restrict';

import {
  babilon,
  TExp,
} from '../lib/babilon';

import {
  createResolver,
  resolverOptions,
  validators,
} from '../lib/proto-sql';

export default () => {
  describe('restrict', () => {
    it('restrictions field', () => {
      const generateRestricting = (subject: string): IRestricting => {
        return (exp: TExp, from: TExp, alias: TExp) => {
          return ['and', exp, ['eq',
            ['path',(alias.length === 3 ? alias[2] : alias[1]),'restriction'],
            ['data',subject],
          ]];
        };
      };
      const exp = restrict(
        ['select',
          ['returns',
            ['path','z','a'],
            ['as',['data',123],'q'],
            ['as',
              ['or',
                ['eq',['path','x','b'],['data',123]],
                ['eq',['path','x','c'],['data',123]],
              ],
              'w',
            ],
          ],
          ['from',
            ['alias','x'],
            ['alias','y','z'],
          ],
          ['and',
            ['gt',['path','z','a'],['data',10]],
            ['or',
              ['eq',['path','x','b'],['data',123]],
              ['eq',['path','x','c'],['data',123]],
            ],
          ],
          ['orders', ['order', ['path', 'z', 'a']], ['order', ['path', 'x', 'b'], false]],
          ['limit', 10], ['skip', 10],
        ],
        generateRestricting('abc'),
      );
      console.log(JSON.stringify(exp));
    });
  });
};
