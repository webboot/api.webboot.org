#!/usr/bin/env node

import path from 'path'

import cli from '@magic/cli'
import log from '@magic/log'

const cliArgs = {
  name: 'webboot',
  options: [
    ['--help', '-help', 'help', '--h', '-h'],
  ],
  commands: [
    'install',
    'database',
    'containers',
    'serve',
  ],
  help: {
    name: '@webboot api init',
    header: 'installs some dependencies and prepares the database.',
    commands: {
      install: 'install dependencies if they do not exist. (git, lxc)',
      database: 'git clone the databases from github and gitlab',
      containers: 'init the lxc container',
      serve: 'start serving the api using lxc'
    },
    example: `
# install dependencies
src/bin/init.mjs install

# git clone the database files
src/bin/init.mjs database

# build the lxc containers
src/bin/init.mjs containers

# serve the api using the containers.
src/bin/init.mjs serve

# run all tasks, one after another
src/bin/init.mjs all
`,
  },
}

const run = async () => {
  const { commands } = cli(cliArgs)

  try {
    console.log({ commands })
    if (commands.install) {
      console.log('install')
    }
  } catch (e) {
    log.error(e)
    process.exit(1)
  }

  log.success('@webboot api init done')
}

run()
