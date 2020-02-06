import path from 'path'

import fs from '@magic/fs'
import log from '@magic/log'
import mimes from '@magic/mime-types'

const staticDir = path.join(process.cwd(), 'static')

export const getContents = async () => {
  const files = await fs.getFiles(staticDir)

  const contents = {}

  await Promise.all(
    files.map(async file => {
      const content = await fs.readFile(file)
      const url = file.replace(staticDir, '')

      contents[url] = content
    }),
  )

  return contents
}

export const maybeServeFile = (res, files, pathname) => {
  const filePath = path.join(staticDir, pathname)

  if (files[pathname]) {
    const ext = path.extname(pathname).substr(1)
    const mime = mimes[ext]
    res.writeHead(200, { 'Content-Type': mime })
    res.end(files[pathname])
    return true
  }

  return false
}
