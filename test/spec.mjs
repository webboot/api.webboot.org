import { is } from '@magic/test'

import { release, key, fingerprint } from '../src/v1/index.mjs'

export default [
  { fn: () => release, expect: is.function },
  { fn: () => key, expect: is.function },
  { fn: () => fingerprint, expect: is.function },
]
