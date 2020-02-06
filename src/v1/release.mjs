import crypto from '@webboot/crypto'

import is from '@magic/types'

const libName = '@webboot/api/v1/release'

export const release = async (req, res) => {
  const headers = { 'Content-Type': 'text/plain' }

  if (req.method !== 'POST' || is.empty(req.body)) {
    const code = 405
    const body = `${libName}: Method not allowed. use POST`

    return {
      body,
      code,
      headers,
    }
  }

  const { version, key, fingerprint } = req.body.signed

  console.log(req.body.signed)

  // const importKey = await crypto.gpg.import(key)

  // if (!importKey) {
    // const code = 500
    // const body = `${libName}: internal error, could not import gpg key`
    // return {
      // body,
      // code,
      // headers
    // }
  // }

  // const code = 200
  // const body = 'received request. started computations.'

  // return {
    // body,
    // code,
    // headers,
  // }
}
