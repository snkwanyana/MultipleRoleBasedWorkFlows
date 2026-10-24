const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const shell = process.platform === 'win32';

fs.rmSync(path.resolve(__dirname, '..', 'allure-results'), { recursive: true, force: true });
fs.rmSync(path.resolve(__dirname, '..', 'allure-report'), { recursive: true, force: true });

const test = spawnSync(npm, ['run', 'test:bdd:workflow'], { stdio: 'inherit', shell });
if (test.error) {
  console.error('Could not start the Cucumber test run:', test.error.message);
  process.exit(1);
}

const report = spawnSync(npm, ['run', 'allure:generate'], { stdio: 'inherit', shell });
if (report.error) {
  console.error('Could not generate the Allure report:', report.error.message);
  process.exit(1);
}

if (report.status !== 0) {
  process.exit(report.status ?? 1);
}
process.exit(test.status ?? 1);
