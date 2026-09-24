import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const input = 'C:/Users/bigas/Downloads/hf_20260922_094057_32d36e9d-a008-4f2d-846e-ef9936752587.mp4';
const root = 'public/media/lemark/v6';

await mkdir(root, { recursive: true });
await copyFile(input, `${root}/source.mp4`);

const { stdout: probeRaw } = await run('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration,size:stream=codec_name,width,height,r_frame_rate', '-of', 'json', `${root}/source.mp4`,
]);
const probe = JSON.parse(probeRaw);
const duration = Number(probe.format.duration);
const common = [
  '-y', '-i', `${root}/source.mp4`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-pix_fmt', 'yuv420p',
  '-g', '4', '-keyint_min', '4', '-sc_threshold', '0', '-bf', '0', '-movflags', '+faststart',
];
const outputs = [
  { name: 'desktop.mp4', args: [...common, '-vf', 'scale=1152:-2,fps=24', '-crf', '29', `${root}/desktop.mp4`] },
  { name: 'mobile.mp4', args: [...common, '-vf', 'scale=-2:960,crop=540:960,fps=24', '-crf', '30', `${root}/mobile.mp4`] },
];
for (const output of outputs) await run('ffmpeg', output.args, { maxBuffer: 5e6 });
for (const name of ['desktop', 'mobile']) {
  await run('ffmpeg', ['-y', '-i', `${root}/${name}.mp4`, '-frames:v', '1', '-q:v', '3', `${root}/poster-${name}.jpg`]);
}
await run('ffmpeg', ['-y', '-i', `${root}/desktop.mp4`, '-vf', 'fps=1,scale=384:-2,tile=5x2', '-frames:v', '1', `${root}/contact-sheet.jpg`]);

const files = ['source.mp4', 'desktop.mp4', 'mobile.mp4', 'poster-desktop.jpg', 'poster-mobile.jpg', 'contact-sheet.jpg'];
const assets = await Promise.all(files.map(async name => {
  const content = await readFile(`${root}/${name}`);
  return {
    path: `/media/lemark/v6/${name}`,
    bytes: (await stat(`${root}/${name}`)).size,
    sha256: createHash('sha256').update(content).digest('hex'),
    ...(outputs.find(output => output.name === name) ? { ffmpegArgs: outputs.find(output => output.name === name).args } : {}),
  };
}));

await writeFile(`${root}/manifest.json`, `${JSON.stringify({
  version: 6,
  purpose: 'User-supplied HPL HERO film, processed for scroll-scrubbing.',
  source: { type: 'user-provided', originalFile: input, probe },
  durationSeconds: duration,
  playback: { muted: true, keyframeIntervalFrames: 4, bFrames: 0, desktop: '/media/lemark/v6/desktop.mp4', mobile: '/media/lemark/v6/mobile.mp4' },
  assets,
}, null, 2)}\n`);

console.log(JSON.stringify({ duration, assets }, null, 2));
