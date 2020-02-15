import path from 'path'

import fs from '@magic/fs'
import is from '@magic/types'

import crypto from '@webboot/crypto'

const libName = '@webboot/api/v1/release'

export default async (req, res) => {
  if (req.method !== 'POST') {
    const code = 405
    const body = `${libName}: Method not allowed. use POST`

    return {
      body,
      code,
    }
  }

  const { sig, signed } = req.body

  const queueDir = path.join(process.cwd(), 'queue')

  const fullPath = path.join(queueDir, signed.domain, signed.version)

  const exists = await fs.exists(fullPath)

  if (exists) {
    const code = 403
    const body = `${libName}: This version of the homepage is in the queue already.`

    return {
      body,
      code,
    }
  }

  await fs.mkdirp(path.dirname(fullPath))

  const jsonPath = `${fullPath}.json`
  await fs.writeFile(jsonPath, JSON.stringify(signed))

  const sigPath = `${fullPath}.sig`
  await fs.writeFile(sigPath, sig)

  const importKey = await crypto.gpg.import(signed.key)

  if (!importKey) {
    const code = 500
    const body = `${libName}: internal error, could not import gpg key`
    return {
      body,
      code,
    }
  }

  const verified = await crypto.gpg.verify({ sig: sigPath, file: jsonPath })

  if (!verified) {
    const code = 403
    const body = `${libName}: signature could not be verified`

    return {
      body,
      code,
    }
  }

  const code = 200
  const href = 'https://builds.webboot.org/'
  const body = `received request and added it to the queues. to see the status visit: ${href}/TO_BE_DONE`

  return {
    body,
    code,
  }
}
