import { load } from 'cheerio';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const origin = 'https://lemarkllc.ru/';
const html = await (await fetch(origin)).text();
await mkdir('src/content', { recursive: true });
await mkdir('artifacts/original', { recursive: true });
await writeFile('artifacts/original/home.html', html);
const $ = load(html);
const intro = $('main > .intro');
if (intro.length !== 1) throw new Error(`Expected one original intro, got ${intro.length}`);
const lower = intro.nextAll().toArray().map(el => $.html(el)).join('');
intro.replaceWith('<!--LEMARK_HERO-->');
$('header.header').addClass('header_white');
const resources = new Set();
const records = [];
for (const el of $('script[src]').toArray()) {
  const url = new URL($(el).attr('src'), origin);
  if (!['cdn.jsdelivr.net','cdnjs.cloudflare.com'].includes(url.hostname)) continue;
  const local = `/vendor/${url.hostname}/${url.pathname.split('/').pop()}`;
  const response = await fetch(url, {signal:AbortSignal.timeout(30000)});
  if (!response.ok) throw new Error(`Library download failed: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname('public' + local), {recursive:true});
  await writeFile('public' + local, bytes);
  $(el).attr('src', local);
  records.push({url:url.href,path:local,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const enqueue = (value, base = origin) => {
  if (!value || /^(data:|#|mailto:|tel:|javascript:|\/vendor\/)/i.test(value)) return;
  try {
    const url = new URL(value, base);
    if (url.origin === new URL(origin).origin && !/\.php$/i.test(url.pathname)) resources.add(url.href);
  } catch {}
};
$('img,script,source,video,input[type=image]').each((_, el) => {
  for (const attr of ['src','data-src','poster']) enqueue($(el).attr(attr));
  for (const entry of ($(el).attr('srcset') || '').split(',')) enqueue(entry.trim().split(/\s+/)[0]);
});
$('link').each((_, el) => {
  if (/stylesheet|icon|preload/.test($(el).attr('rel') || '')) enqueue($(el).attr('href'));
});
$('[style],style').each((_, el) => {
  const css = $(el).attr('style') || $(el).text();
  for (const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) enqueue(match[1]);
});
// Inner-page links continue to the existing official URLs; anchors remain on this page.
$('a[href]').each((_, el) => {
  const href = $(el).attr('href');
  if (href && !/^(#|mailto:|tel:|javascript:)/i.test(href)) $(el).attr('href', new URL(href, origin).href);
});
$('[onclick]').each((_, el) => {
  $(el).attr('onclick', $(el).attr('onclick').replace(/window\.location\.href='(\/[^']*)'/g, (_, path) => `window.location.href='${new URL(path, origin).href}'`));
});
$('form').each((_, el) => {
  const action = $(el).attr('action');
  if (action && !action.startsWith('#')) $(el).attr('action', new URL(action, origin).href);
});
$('head').append('<link rel="stylesheet" href="/hero-v3.css"><script defer src="/hero-v3.js"></script>');
const completed = new Set();
while ([...resources].some(url => !completed.has(url))) {
  const batch = [...resources].filter(url => !completed.has(url)).slice(0, 8);
  await Promise.all(batch.map(async url => {
    completed.add(url);
    const u = new URL(url);
    const path = resolve('public', '.' + decodeURIComponent(u.pathname));
    if (!path.startsWith(resolve('public') + '\\') && !path.startsWith(resolve('public') + '/')) throw new Error('Unsafe resource path');
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, bytes);
      records.push({ url, path: u.pathname, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
      if (/\.css$/i.test(u.pathname)) {
        for (const match of bytes.toString().matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)) enqueue(match[1], url);
      }
    } catch (error) { records.push({ url, error: String(error), fallback: 'official-origin rewrite' }); }
  }));
}
await writeFile('src/content/original-home.json', JSON.stringify({ html: $.html() }));
await writeFile('src/content/original-source-manifest.json', JSON.stringify({ source: origin, fetchedAt: new Date().toISOString(), originalSha256: createHash('sha256').update(html).digest('hex'), lowerMarkupSha256: createHash('sha256').update(lower).digest('hex'), resources: records }, null, 2));
console.log(JSON.stringify({ resources: records.length, failed: records.filter(r => r.error), lowerSections: $('main > .section-m').length }));
