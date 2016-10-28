#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const command = process.argv[2] ? process.argv.slice(2) : [];

let exitCode = 0;

if (!command) return;

const packagesPath = path.resolve(__dirname, '../packages');

fs.readdirSync(packagesPath).map((file) => {
  const testPath = path.join(packagesPath, file);
  if (fs.statSync(testPath).isDirectory()) {
    console.log('------------------------------------------------------------');
    console.log(testPath);
    console.log('------------------------------------------------------------');
    process.chdir(testPath);
    const task = childProcess.spawnSync(
      'npm',
      command,
      { stdio: ['inherit', 'inherit', 'inherit'] }
    );
    exitCode = task.status > 0 ? 1 : exitCode;
  }
});

process.chdir(path.resolve(__dirname, '../'));

process.exit(exitCode);
