import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendDir = resolve(__dirname, '..');
const repoRoot = resolve(frontendDir, '..');
const envPath = resolve(frontendDir, '.env');
const examplePath = resolve(frontendDir, '.env.example');
const lastTrackedEnvCommit = 'bc59343c7ff5df56a7477a29c26b140943736277';

if (existsSync(envPath)) {
  console.log('frontend/.env already exists. Nothing changed.');
  process.exit(0);
}

try {
  const previousEnv = execFileSync(
    'git',
    ['show', `${lastTrackedEnvCommit}:frontend/.env`],
    { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  );

  writeFileSync(envPath, previousEnv);
  console.log('Restored frontend/.env from the last tracked version.');
  process.exit(0);
} catch (error) {
  if (existsSync(examplePath)) {
    const exampleEnv = execFileSync(
      process.execPath,
      ['-e', "process.stdout.write(require('node:fs').readFileSync(process.argv[1], 'utf8'))", examplePath],
      { encoding: 'utf8' }
    );
    writeFileSync(envPath, exampleEnv);
    console.log('Created frontend/.env from frontend/.env.example. Replace placeholder values before running the app.');
    process.exit(0);
  }

  mkdirSync(dirname(envPath), { recursive: true });
  writeFileSync(envPath, '');
  console.log('Created an empty frontend/.env. Add the required VITE_APP_* values before running the app.');
}
