import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('public/media/lemark/v5');
const result = JSON.parse(await readFile(resolve(root, 'start-frame-result.json'), 'utf8'));
const job = Array.isArray(result) ? result[0] : result;

if (!job?.result_url) throw new Error('Higgsfield start-frame result URL is missing.');

await mkdir(root, { recursive: true });
const response = await fetch(job.result_url);
if (!response.ok) throw new Error(`Could not download start frame: ${response.status}`);
const image = Buffer.from(await response.arrayBuffer());
await writeFile(resolve(root, 'start-frame.png'), image);
await writeFile(resolve(root, 'start-frame-manifest.json'), `${JSON.stringify({
  version: 'v5',
  purpose: 'New HPL-only HERO opening frame; no previous HERO video supplied as reference.',
  generator: 'Higgsfield GPT Image 2',
  job,
  output: '/media/lemark/v5/start-frame.png',
}, null, 2)}\n`);
