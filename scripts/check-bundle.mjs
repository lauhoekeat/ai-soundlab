import { readdir, readFile } from 'node:fs/promises';
async function scan(path) {
  for (const item of await readdir(path, { withFileTypes: true })) {
    const name = `${path}/${item.name}`;
    if (item.isDirectory()) await scan(name);
    else {
      const text = await readFile(name, 'utf8');
      if (/sk-(?:proj-)?[A-Za-z0-9_-]{20,}|OPENAI_API_KEY|IP_HASH_SECRET|api\.openai\.com|Bearer\s/.test(text)) throw new Error('Server credential boundary violated in frontend build');
    }
  }
}
await scan('dist'); console.log('PASS: no provider credential names, endpoint or key patterns in frontend bundle.');
