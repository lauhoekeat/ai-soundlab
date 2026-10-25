import { execFileSync, spawnSync } from 'node:child_process';
// Search captured content, never print matches or secret-bearing source lines.
const pattern = /sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}/;
const revisions = execFileSync('git', ['rev-list', '--all'], { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
for (const revision of revisions) {
  const result = spawnSync('git', ['grep', '-I', '-h', '-e', 'sk-', revision], { encoding: 'utf8', maxBuffer: 10_000_000, stdio: ['ignore', 'pipe', 'ignore'] });
  if (result.error || ![0, 1].includes(result.status)) throw new Error('History scan failed; publication blocked.');
  const content = result.stdout;
  if (pattern.test(content)) throw new Error('Potential provider key in repository history. Publication blocked.');
}
console.log('PASS: no OpenAI key patterns in reachable tracked history.');
