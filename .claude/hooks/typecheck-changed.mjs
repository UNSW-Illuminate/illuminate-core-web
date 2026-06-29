// Stop hook: runs `tsc --noEmit` when TypeScript files have changed.
// Adapted from Ripple's pnpm/turbo version for this npm single-app repo.
import { execFileSync } from 'node:child_process';

const shell = process.platform === 'win32';

function gitLines(args) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
      shell,
    })
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

function hasUpstream(ref) {
  try {
    execFileSync('git', ['rev-parse', '--verify', ref], { stdio: 'ignore', shell });
    return true;
  } catch {
    return false;
  }
}

// Gather changed files: uncommitted (staged + unstaged) plus anything diverging
// from origin/main when that ref exists.
const changed = new Set([
  ...gitLines(['diff', '--name-only', 'HEAD']),
  ...gitLines(['diff', '--name-only', '--cached']),
  ...(hasUpstream('origin/main') ? gitLines(['diff', '--name-only', 'origin/main']) : []),
]);

const hasRelevantChanges = [...changed].some((f) => /\.(ts|tsx)$/.test(f));

if (!hasRelevantChanges) {
  process.exit(0);
}

try {
  execFileSync('npx', ['tsc', '--noEmit'], {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell,
  });
} catch {
  process.exit(1);
}
