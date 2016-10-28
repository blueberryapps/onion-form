#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');
const rimraf = require('rimraf');

const cwd = process.cwd();
const mochaBin = path.resolve(__dirname, '../node_modules/.bin/_mocha');
const istanbulBin = path.resolve(__dirname, '../node_modules/.bin/istanbul');
const mochaOpts = path.resolve(cwd, './test/mocha.opts');
const testDir = path.resolve(cwd, './test');
const destDir = path.resolve(cwd, './coverage');


process.env.NODE_PATH = [path.resolve(cwd, './node_modules'), path.resolve(cwd, '../../node_modules')].join(':');
process.env.BABEL_ENV = 'test';

childProcess.spawnSync(
  path.resolve(__dirname, '../node_modules/.bin/rimraf'),
  [destDir],
  { stdio: ['inherit', 'inherit', 'inherit'] }
);

const task = childProcess.spawnSync(
  istanbulBin,
  ['cover', mochaBin, '--', '-c', '--opts', mochaOpts, '--recursive', testDir],
  { stdio: ['inherit', 'inherit', 'inherit'] }
);

process.exit(task.status);
