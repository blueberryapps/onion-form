#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');

const cwd = process.cwd();
const mochaBin = path.resolve(__dirname, '../node_modules/.bin/mocha');
const mochaOpts = path.resolve(cwd, './test/mocha.opts');
const testDir = path.resolve(cwd, './test');


process.env.NODE_PATH = [path.resolve(cwd, './node_modules'), path.resolve(cwd, '../../node_modules')].join(':');
process.env.BABEL_ENV = 'test';

const task = childProcess.spawnSync(
  mochaBin,
  ['-c', '--opts', mochaOpts, '--recursive', testDir],
  { stdio: ['inherit', 'inherit', 'inherit'] }
);

process.exit(task.status);
