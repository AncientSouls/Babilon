import { assert } from 'chai';

import {
  returnsReferences,
  generateReturnsAs,
  generateReturnsString,
} from '../lib/returns-references';

import {
  babilon,
} from '../lib/babilon';

import {
  createResolver,
  resolverOptions,
  validators,
} from '../lib/proto-sql';

export default () => {
  it('returnsReferences no returns', () => {
    const exp = returnsReferences(
      ['select',
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
      generateReturnsAs(),
    );
    assert.lengthOf(exp, 3);
    assert.deepEqual(exp[1][6], ['returns',
      ['as', ['data', 'x'], 'from'],
      ['as', ['path', 'x', 'id'], 'id'],
    ]);
    assert.deepEqual(exp[2][6], ['returns',
      ['as', ['data', 'y'], 'from'],
      ['as', ['path', 'y', 'id'], 'id'],
    ]);
    const resolver = createResolver(resolverOptions);
    const b = babilon({ resolver, validators, exp });
    assert.deepEqual(b.errors, []);
  });
  it('returnsReferencesAs', () => {
    const exp = returnsReferences(
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
      generateReturnsAs(),
    );
    assert.lengthOf(exp, 3);
    assert.deepEqual(exp[1][1], ['returns',
      ['as', ['data', 'x'], 'from'],
      ['as', ['path', 'x', 'id'], 'id'],
    ]);
    assert.deepEqual(exp[2][1], ['returns',
      ['as', ['data', 'y'], 'from'],
      ['as', ['path', 'y', 'id'], 'id'],
    ]);
    const resolver = createResolver(resolverOptions);
    const b = babilon({ resolver, validators, exp });
    assert.deepEqual(b.errors, []);
  });
  it('returnsReferencesString', () => {
    const exp = returnsReferences(
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
      generateReturnsString(),
    );
    assert.lengthOf(exp, 3);
    assert.deepEqual(exp[1][1], ['returns',
      ['add', ['data', 'x'], ['data', '/'], ['path', 'x', 'id']],
    ]);
    assert.deepEqual(exp[2][1], ['returns',
      ['add', ['data', 'y'], ['data', '/'], ['path', 'y', 'id']],
    ]);
    const resolver = createResolver(resolverOptions);
    const b = babilon({ resolver, validators, exp });
    assert.deepEqual(b.errors, []);
  });
};
