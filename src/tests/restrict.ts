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
  validate,
} from '../lib/proto-sql';

export default () => {
  describe('restrict', () => {
    it('restrictions field', () => {
      const generateRestricting = (subjects: string[]): IRestricting => {
        return (exp: TExp, and: TExp, from: TExp) => {
          const byAliases = ['or',..._.map(from.slice(1), (alias) => {
            return ['or', ..._.map(subjects, subject => ['eq',
              ['path',(alias.length === 3 ? alias[2] : alias[1]),'restriction'],
              ['data',subject],
            ])];
          })];
          and.push(byAliases);
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
        generateRestricting(['abc', 'def']),
      );
      assert.deepEqual(exp[3][3], ['or',['or',['eq',['path','x','restriction'],['data','abc']],['eq',['path','x','restriction'],['data','def']]],['or',['eq',['path','z','restriction'],['data','abc']],['eq',['path','z','restriction'],['data','def']]]]);
      const resolver = createResolver(resolverOptions);
      const b = babilon({ resolver, validate, exp });
      assert.deepEqual(b.errors, []);
    });
    it('restrictions alias', () => {
      const generateRestricting = (subjects: string[]): IRestricting => {
        return (exp: TExp, and: TExp, from: TExp) => {
          const _r = '_restrictions';

          const bySubjects = ['or',..._.map(subjects, (subject) => {
            return ['eq',['path',_r,'subject'],['data',subject]];
          })];
          and.push(bySubjects);

          const byAliases = ['or',..._.map(from.slice(1), (alias) => {
            return ['eq',['path',_r,'from'],['path',(alias.length === 3 ? alias[2] : alias[1]),'id']];
          })];
          and.push(byAliases);

          from.push(['alias','restrictions',_r]);
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
        generateRestricting(['abc', 'def']),
      );
      assert.deepEqual(exp[2], ['from',['alias','x'],['alias','y','z'],['alias','restrictions','_restrictions']]);
      assert.deepEqual(exp[3][3], ['or',['eq',['path','_restrictions','subject'],['data','abc']],['eq',['path','_restrictions','subject'],['data','def']]]);
      assert.deepEqual(exp[3][4], ['or',['eq',['path','_restrictions','from'],['path','x','id']],['eq',['path','_restrictions','from'],['path','z','id']]]);
      const resolver = createResolver(resolverOptions);
      const b = babilon({ resolver, validate, exp });
      assert.deepEqual(b.errors, []);
    });
  });
};
