import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = new URL('../../public/media/lemark/v5/', import.meta.url);
const startImage = new URL('../../public/media/lemark/v5/start-frame.png', import.meta.url);
await mkdir(root, { recursive: true });

const prompt = [
  'Create one continuous, silent, 10-second photorealistic architectural product film. Use the supplied NEW start image only as the first frame and exact material reference. Do not reference, imitate or reuse any previous video.',
  'NON-NEGOTIABLE MATERIAL: the product is a self-supporting COMPACT HPL panel exactly 10 mm thick. It has warm oak decor only on its two broad flat faces. Every visible cut edge is one continuous, flat, homogeneous MATTE DEEP BLACK phenolic-laminate cross-section through the full 10 mm thickness. The edge is a crisp 10 mm black strip, never beige, brown, woody, layered, fibrous, chipped or speckled. Never show chipboard, particleboard, MDF, plywood, veneer substrate, solid timber, wood core, edge banding, black metal cap, aluminium profile, plastic trim or a thick tabletop. Preserve the thin black-edged geometry in every shot.',
  '0-3 seconds: begin exactly at the supplied frame. Slow precision lateral dolly along the slim 10 mm black front cut edge of the oak-decor compact HPL panel, in a calm sunlit mineral gallery. The camera stays close enough that the long uniformly black edge reads unmistakably. Two black steel trestles remain behind the edge; no other material is exposed.',
  'At 3 seconds, a second identical 10 mm HPL panel with the same black cut edge glides across the lens from right to left for a single smooth, physically motivated foreground occlusion transition. No flash, dissolve, jump cut, warping or rapid edit.',
  '3-6.5 seconds: reveal three freestanding vertical oak-decor compact HPL planes in the same room. Their slim black cut edges and narrow shadow joints are visible; every panel is 10 mm, all cores black. Camera carries the same graceful sideways motion. Composition stays simple, premium and legible.',
  'At 6.5 seconds, one 10 mm black-edged panel passes close across lens for a second gentle physical wipe.',
  '6.5-10 seconds: reveal the same refined warm public interior with large oak-decor compact HPL wall panels, each panel thin and each exposed cut edge uniformly black. Pale stone floor, warm daylight, graphite details. Camera eases to a quiet final wide view. Put the material geometry within central 40 percent for mobile crop and leave the left side calm for HTML headline. No people, no text, no logos, no labels, no measurements, no music, no sound.',
].join('\n');

const manifest = {
  version: 5,
  createdAt: new Date().toISOString(),
  intent: 'New HPL-only HERO film. New generated still used as start frame; no prior HERO video used as a reference.',
  model: 'seedance_2_0',
  prompt,
  parameters: { duration: 10, resolution: '1080p', aspect_ratio: '16:9', generate_audio: false },
  references: [{ path: '/media/lemark/v5/start-frame.png', role: 'image', purpose: 'First frame and HPL edge geometry reference' }],
  materialSpec: { panel: 'compact HPL', thicknessMm: 10, exposedCutEdge: 'continuous homogeneous matte black' },
  jobs: [],
};
await writeFile(new URL('generation.json', root), `${JSON.stringify(manifest, null, 2)}\n`);

const cli = process.platform === 'win32' ? `${process.env.APPDATA}/npm/node_modules/@higgsfield/cli/bin/higgsfield.js` : 'higgsfield';
const args = process.platform === 'win32'
  ? [cli, 'generate', 'create', 'seedance_2_0']
  : ['generate', 'create', 'seedance_2_0'];
args.push('--prompt', prompt, '--start-image', fileURLToPath(startImage), '--duration', '10', '--resolution', '1080p', '--aspect_ratio', '16:9', '--generate_audio', 'false', '--wait', '--wait-timeout', '20m', '--json');
const command = process.platform === 'win32' ? process.execPath : cli;
const { stdout } = await run(command, args, { maxBuffer: 10 * 1024 * 1024, timeout: 1_250_000 });
await writeFile(new URL('generation-result.json', root), stdout);
console.log(stdout);
