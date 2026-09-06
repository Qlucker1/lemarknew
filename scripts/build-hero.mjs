import { build } from 'esbuild';
await build({ entryPoints:['src/hero/client.ts'], outfile:'public/hero-v3.js', bundle:true, minify:true, target:['es2020'], format:'iife' });
