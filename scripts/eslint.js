#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');

const cwd = process.cwd();
const srcDir = path.resolve(cwd, './src');
const testDir = path.resolve(cwd, './test');
const eslintBin = path.resolve(__dirname, '../node_modules/.bin/eslint');
const eslintSrcConf = path.resolve(__dirname, '../.eslintrc');
const eslintTestConf = path.resolve(__dirname, '../.eslintrc-test');

process.env.BABEL_ENV = 'test';

const eslintSrc = childProcess.spawnSync(
  eslintBin,
  ['-c', eslintSrcConf, `${srcDir}/**/*.js`],
  { stdio: ['inherit', 'inherit', 'inherit'] }
);

const eslintTest = childProcess.spawnSync(
  eslintBin,
  ['-c', eslintTestConf, `${testDir}/**/*.js`],
  { stdio: ['inherit', 'inherit', 'inherit'] }
);

process.exit(eslintSrc.status + eslintTest.status);
