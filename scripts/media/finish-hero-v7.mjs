import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = 'public/media/lemark/v7';
const input = 'public/media/lemark/v6/source.mp4';
const liveEnd = 8.625;
const holdDuration = 1.375;
await mkdir(root, { recursive: true });

// The supplied film fades to black after the train. Trim before that fade,
// then clone the last clean train frame so the scroll ends on a meaningful image.
await run('ffmpeg', [
  '-y', '-i', input,
  '-vf', `trim=end=${liveEnd},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=${holdDuration},fps=24`,
  '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${root}/source.mp4`,
], { maxBuffer: 5e6 });

const { stdout: probeRaw } = await run('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration,size:stream=codec_name,width,height,r_frame_rate', '-of', 'json', `${root}/source.mp4`,
]);
const probe = JSON.parse(probeRaw);
const common = [
  '-y', '-i', `${root}/source.mp4`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-pix_fmt', 'yuv420p',
  '-g', '4', '-keyint_min', '4', '-sc_threshold', '0', '-bf', '0', '-movflags', '+faststart',
];
const outputs = [
  { name: 'desktop.mp4', args: [...common, '-vf', 'scale=1280:-2,fps=24', '-crf', '25', `${root}/desktop.mp4`] },
  { name: 'mobile.mp4', args: [...common, '-vf', 'scale=-2:960,crop=540:960,fps=24', '-crf', '27', `${root}/mobile.mp4`] },
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
    path: `/media/lemark/v7/${name}`,
    bytes: (await stat(`${root}/${name}`)).size,
    sha256: createHash('sha256').update(content).digest('hex'),
    ...(outputs.find(output => output.name === name) ? { ffmpegArgs: outputs.find(output => output.name === name).args } : {}),
  };
}));
const original = await readFile(input);
await writeFile(`${root}/manifest.json`, `${JSON.stringify({
  version: 7,
  purpose: 'High-quality user-supplied HPL HERO film ending on the train, processed for reversible scroll-scrubbing.',
  input: { path: '/media/lemark/v6/source.mp4', sha256: createHash('sha256').update(original).digest('hex') },
  finalFrameFix: { liveVideoEndsAtSeconds: liveEnd, heldFrame: 'last clean train frame', holdDurationSeconds: holdDuration, removes: 'generated black fade at source end' },
  probe,
  playback: { muted: true, keyframeIntervalFrames: 4, bFrames: 0, desktop: '/media/lemark/v7/desktop.mp4', mobile: '/media/lemark/v7/mobile.mp4' },
  assets,
}, null, 2)}\n`);

console.log(JSON.stringify({ duration: probe.format.duration, assets }, null, 2));
