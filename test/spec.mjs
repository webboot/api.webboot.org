import { is } from '@magic/test'

import { publish, key, fingerprint } from '../src/v1/index.mjs'

export default [
  { fn: () => publish, expect: is.function },
  { fn: () => key, expect: is.function },
  { fn: () => fingerprint, expect: is.function },
]
