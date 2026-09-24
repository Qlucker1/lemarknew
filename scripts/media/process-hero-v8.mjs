import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = 'public/media/lemark/v8';
const jobId = process.argv[2];
if (!jobId) throw new Error('Pass the completed Higgsfield job ID.');
const cli = process.platform === 'win32' ? `${process.env.APPDATA}/npm/node_modules/@higgsfield/cli/bin/higgsfield.js` : 'higgsfield';
const command = process.platform === 'win32' ? process.execPath : cli;
const args = process.platform === 'win32' ? [cli, 'generate', 'get', jobId, '--json'] : ['generate', 'get', jobId, '--json'];
const { stdout } = await run(command, args, { maxBuffer: 10 * 1024 * 1024 });
const job = JSON.parse(stdout);
if (job.status !== 'completed' || !job.result_url) throw new Error(`Job ${jobId} is not ready: ${job.status}`);

await writeFile(`${root}/generation-result.json`, `${JSON.stringify(job, null, 2)}\n`);
const response = await fetch(job.result_url);
if (!response.ok) throw new Error(`Could not download generated source: ${response.status}`);
const source = Buffer.from(await response.arrayBuffer());
await writeFile(`${root}/source.mp4`, source);
const sourceHash = createHash('sha256').update(source).digest('hex');

const common = [
  '-y', '-i', `${root}/source.mp4`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-pix_fmt', 'yuv420p',
  '-g', '4', '-keyint_min', '4', '-sc_threshold', '0', '-bf', '0', '-movflags', '+faststart',
];
const outputs = [
  { name: 'desktop.mp4', args: [...common, '-vf', 'scale=1280:-2:flags=lanczos,fps=24', '-crf', '23', `${root}/desktop.mp4`] },
  { name: 'mobile.mp4', args: [...common, '-vf', 'scale=-2:960:flags=lanczos,crop=540:960,fps=24', '-crf', '25', `${root}/mobile.mp4`] },
];
for (const output of outputs) await run('ffmpeg', output.args, { maxBuffer: 5e6 });
for (const name of ['desktop', 'mobile']) {
  await run('ffmpeg', ['-y', '-i', `${root}/${name}.mp4`, '-frames:v', '1', '-q:v', '3', `${root}/poster-${name}.jpg`]);
}
await run('ffmpeg', ['-y', '-i', `${root}/desktop.mp4`, '-vf', 'fps=1,scale=384:-2,tile=5x2', '-frames:v', '1', `${root}/contact-sheet.jpg`]);

const manifestDraft = JSON.parse(await readFile(`${root}/generation.json`, 'utf8'));
const files = ['source.mp4', 'desktop.mp4', 'mobile.mp4', 'poster-desktop.jpg', 'poster-mobile.jpg', 'contact-sheet.jpg'];
const assets = await Promise.all(files.map(async name => {
  const content = await readFile(`${root}/${name}`);
  return {
    path: `/media/lemark/v8/${name}`,
    bytes: (await stat(`${root}/${name}`)).size,
    sha256: createHash('sha256').update(content).digest('hex'),
    ...(outputs.find(output => output.name === name) ? { ffmpegArgs: outputs.find(output => output.name === name).args } : {}),
  };
}));
await writeFile(`${root}/manifest.json`, `${JSON.stringify({
  ...manifestDraft,
  job: { id: job.id, resultUrl: job.result_url },
  generatedSource: { path: '/media/lemark/v8/source.mp4', sha256: sourceHash },
  playback: { muted: true, keyframeIntervalFrames: 4, bFrames: 0, desktop: '/media/lemark/v8/desktop.mp4', mobile: '/media/lemark/v8/mobile.mp4' },
  assets,
}, null, 2)}\n`);
console.log(JSON.stringify({ jobId, assets }, null, 2));
