import { build } from 'esbuild';

const source = new URL('../client/site.ts', import.meta.url).pathname;
const destination = new URL('../../dist/site.js', import.meta.url).pathname;

async function main() {
  await build({
    entryPoints: [source],
    outfile: destination,
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: ['chrome120', 'firefox121', 'safari17'],
    logLevel: 'silent',
  });

  process.stdout.write('client.ts: wrote dist/site.js\n');
}

main().catch(error => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});