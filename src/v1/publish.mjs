import crypto from '@webboot/crypto'

import is from '@magic/types'

const libName = '@webboot/api/v1/publish'

export const publish = async (req, res) => {
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

  const { key, fingerprint, sig } = req.body

  const importKey = await crypto.gpg.import({ fingerprint, key })

  console.log({importKey})
  if (!importKey) {
    const code = 500
    const body = `${libName}: internal error, could not import gpg key`
    return {
      body,
      code,
      headers
    }
  }

  const data = await crypto.gpg('--decrypt ${sig}')

  console.log({
    key,
    fingerprint,
    sig,
  }, req.body)

  const code = 200
  const body = 'received request. started computations.'

  return {
    body,
    code,
    headers,
  }
}
