import http from 'http'
import path from 'path'
import URL from 'url'

import error from '@magic/error'
import fs from '@magic/fs'
import log from '@magic/log'
import mimes from '@magic/mime-types'
import is from '@magic/types'

import * as middleware from './middleware/index.mjs'
import * as v1 from './v1/index.mjs'

const versions = {
  v1,
}

const run = async () => {
  const files = await middleware.static.getContents()

  const server = http.createServer(async (req, res) => {
    const startTime = log.hrtime()

    const url = URL.parse(req.url)

    const isStatic = middleware.static.maybeServeFile(res, files, url.pathname)
    if (isStatic) {
      log.timeTaken(startTime, 'served static file in')
      return
    }

    const [version, fn] = url.pathname.split('/').filter(a => a)

    const versionKeys = Object.keys(versions)

    if (!versionKeys.includes(version)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end(`Api request urls must start with a version. supported: ${versionKeys.join(' ')}`)
      return
    }

    const api = versions[version]

    if (!is.fn(api[fn])) {
      const apiKeys = Object.keys(api)

      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end(`function not found. Got: ${fn}. Supported: ${apiKeys.join(' ')}`)
      return
    }

    if (req.method === 'POST') {
      req.body = await middleware.body(req)

      if (is.error(req.body)) {
        log.error('E_REQ_BODY_PARSE', req.body)
        req.body = ''
      }
    }

    const lambda = api[fn]

    const { code = 200, headers = {}, body } = await lambda(req, res)

    res.writeHead(code, headers)
    res.end(body)

    log.timeTaken(startTime, 'request took')
  })

  server.listen(8080, () => {
    console.log('server listening on port 8080')
  })
}

run()
