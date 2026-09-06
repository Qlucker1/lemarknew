import { readFile, writeFile, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
const run = promisify(execFile);
const root = 'public/media/lemark/v3';
const [job] = JSON.parse(await readFile(`${root}/generation-result.json`, 'utf8'));
if (job.status !== 'completed' || !job.result_url) throw new Error('Generation not complete');
const response = await fetch(job.result_url);
if (!response.ok) throw new Error(`Download ${response.status}`);
await writeFile(`${root}/source.mp4`, Buffer.from(await response.arrayBuffer()));
const common = ['-y','-i',`${root}/source.mp4`,'-an','-t','10','-c:v','libx264','-preset','slow','-pix_fmt','yuv420p','-g','4','-keyint_min','4','-sc_threshold','0','-bf','0','-movflags','+faststart'];
const jobs = [
  {name:'desktop.mp4', args:[...common,'-vf','scale=1280:-2,fps=24','-crf','26',`${root}/desktop.mp4`]},
  {name:'mobile.mp4', args:[...common,'-vf','scale=-2:960,crop=540:960,fps=24','-crf','27',`${root}/mobile.mp4`]},
];
for (const job of jobs) await run('ffmpeg', job.args, {maxBuffer: 5e6});
for (const name of ['desktop','mobile']) await run('ffmpeg',['-y','-i',`${root}/${name}.mp4`,'-frames:v','1','-q:v','3',`${root}/poster-${name}.jpg`]);
await run('ffmpeg',['-y','-i',`${root}/desktop.mp4`,'-vf','fps=1,scale=384:-2,tile=5x2','-frames:v','1',`${root}/contact-sheet.jpg`]);
const manifest = JSON.parse(await readFile(`${root}/generation.json`,'utf8'));
manifest.jobs = [job];
manifest.outputs = [];
for (const name of ['source.mp4','desktop.mp4','mobile.mp4','poster-desktop.jpg','poster-mobile.jpg','contact-sheet.jpg']) {
  const bytes = await readFile(`${root}/${name}`);
  manifest.outputs.push({ path:`/media/lemark/v3/${name}`, bytes:(await stat(`${root}/${name}`)).size, sha256:createHash('sha256').update(bytes).digest('hex'), ...(jobs.find(j => j.name === name) ? { ffmpegArgs:jobs.find(j => j.name === name).args } : {}) });
}
await writeFile(`${root}/manifest.json`, JSON.stringify(manifest,null,2));
console.log(JSON.stringify(manifest.outputs,null,2));
