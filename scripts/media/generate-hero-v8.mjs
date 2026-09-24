import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = 'public/media/lemark/v8';
const sourceReference = 'public/media/lemark/v7/source.mp4';
const startReference = 'artifacts/hero-v8-start.jpg';
const endReference = 'artifacts/hero-v8-end.jpg';

const prompt = [
  'Create a silent, photorealistic, premium 10-second architectural material film in one continuous forward camera move. Use the supplied video strictly as the shot choreography, framing and timing reference; improve fine texture, lighting, glass, edges, micro-contrast and physical realism, never introduce a different story or extra scenes.',
  'Use the supplied start image as the exact opening composition and the supplied end image as the exact final composition. The first frame and last frame must match their references closely. Preserve the calm pacing and the three soft, dark physical occlusion transitions; do not use fades to black, flash frames, jump cuts, time-lapse, captions, logos, text or people.',
  '0-2.8 seconds: a calm contemporary kitchen, slow lateral camera movement, showing a thin architectural compact HPL worktop with a straight 10 mm exposed edge. The two broad faces carry a refined warm-grey mineral decor; the full exposed 10 mm cut edge is one homogeneous, perfectly straight matte black phenolic strip. It is never chipboard, MDF, plywood, solid timber, thick stone, metal cap or a layered edge.',
  '2.8-3.2 seconds: a close dark panel passes the lens as a smooth physical wipe. 3.2-5.8 seconds: a precise contemporary facade clad in the same compact HPL, subtle black panel joints, believable exterior daylight, trees and reflection detail. 5.8-6.3 seconds: another gentle dark panel wipe. 6.3-8.1 seconds: a spotless research laboratory with compact HPL work surfaces, all exposed 10 mm edges uniformly matte black. 8.1-10 seconds: a quiet modern train interior, the same compact HPL tabletop with thin black edge visible, ending calm and sharp on the supplied final composition.',
  'Keep every plane straight and architectural, camera movement slow and stable, no warping, no flicker, no excess depth of field, no artificial lens flare, no text. Leave the left third visually calm for live HTML typography and keep essential geometry in the central 40 percent for the mobile crop. Render high-detail commercial cinematography at true 4K quality.',
].join('\n');

await mkdir(root, { recursive: true });
const manifest = {
  version: 8,
  createdAt: new Date().toISOString(),
  purpose: '4K visual enhancement candidate for the approved v7 HERO choreography, with fixed opening and final compositions.',
  model: 'seedance_2_0',
  prompt,
  parameters: { duration: 10, resolution: '4k', aspect_ratio: '16:9', bitrate_mode: 'high', generate_audio: false },
  references: [
    { path: '/media/lemark/v7/source.mp4', role: 'video', purpose: 'Approved story rhythm, camera path and scene order' },
    { path: '/artifacts/hero-v8-start.jpg', role: 'start_image', purpose: 'Locked opening composition' },
    { path: '/artifacts/hero-v8-end.jpg', role: 'end_image', purpose: 'Locked train ending composition' },
  ],
  materialSpec: { product: 'compact HPL', thicknessMm: 10, exposedCutEdge: 'homogeneous matte black phenolic cross-section' },
};
await writeFile(`${root}/generation.json`, `${JSON.stringify(manifest, null, 2)}\n`);

const cli = process.platform === 'win32' ? `${process.env.APPDATA}/npm/node_modules/@higgsfield/cli/bin/higgsfield.js` : 'higgsfield';
const command = process.platform === 'win32' ? process.execPath : cli;
const args = process.platform === 'win32' ? [cli, 'generate', 'create', 'seedance_2_0'] : ['generate', 'create', 'seedance_2_0'];
args.push(
  '--prompt', prompt,
  '--video', sourceReference, '--start-image', startReference, '--end-image', endReference,
  '--duration', '10', '--resolution', '4k', '--aspect_ratio', '16:9', '--bitrate_mode', 'high',
  '--generate_audio', 'false', '--wait', '--wait-timeout', '30m', '--json',
);
const { stdout } = await run(command, args, { maxBuffer: 10 * 1024 * 1024, timeout: 1_850_000 });
await writeFile(`${root}/generation-result.json`, stdout);
const job = (JSON.parse(stdout))[0];
if (!job?.result_url) throw new Error('Higgsfield result URL is missing.');
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
  ...manifest,
  job: { id: job.id, resultUrl: job.result_url },
  generatedSource: { path: '/media/lemark/v8/source.mp4', sha256: sourceHash },
  playback: { muted: true, keyframeIntervalFrames: 4, bFrames: 0, desktop: '/media/lemark/v8/desktop.mp4', mobile: '/media/lemark/v8/mobile.mp4' },
  assets,
}, null, 2)}\n`);
console.log(JSON.stringify({ jobId: job.id, assets }, null, 2));
