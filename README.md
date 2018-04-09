# Ancient Babilon

:large_orange_diamond: One data select language will rule them all.

[![NPM](https://img.shields.io/npm/v/ancient-babilon.svg)](https://www.npmjs.com/package/ancient-babilon)
[![Build Status](https://travis-ci.org/AncientSouls/PostgreSQL.svg?branch=master)](https://travis-ci.org/AncientSouls/PostgreSQL)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/59e712651c484fb2a179961c3ee9fc23)](https://www.codacy.com/app/ivansglazunov/babilon?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=AncientSouls/babilon&amp;utm_campaign=Badge_Grade)
[![Read the Docs](https://img.shields.io/readthedocs/pip.svg)](https://ancientsouls.github.io/)

## SQL

```js
import babilon from '../lib/babilon';

import {
  createResolver,
  resolverOptions,
  validators,
} from '../lib/sql';

const flow = babilon({
  resolver: createResolver(resolverOprions),
  validators,
  exp: ['select',
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
});

flow.result
// '(select [z].[a],123 as [q],([x].[b] = 123) or ([x].[c] = 123) as [w] from [x],[y] as [z] where ([z].[a] > 10) and (([x].[b] = 123) or ([x].[c] = 123)) order by [z].[a] ASC,[x].[b] DESC limit 10 offset 10)',
```

## Mongo

```js
import babilon from '../lib/babilon';

import {
  createResolver,
  resolverOptions,
  validators,
} from '../lib/mongo';

const flow = babilon({
  resolver: createResolver(resolverOprions),
  validators,
  exp: ['select',
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
});

flow.result
/*
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
}
*/
```