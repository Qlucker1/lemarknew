import { load } from 'cheerio';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const before=load(await readFile('artifacts/original/home.html','utf8'));
const after=load(JSON.parse(await readFile('src/content/original-home.json','utf8')).html);
const normalize=(dom,selector)=>{
  const copy=load(dom(selector).toArray().map(el=>dom.html(el)).join(''));
  copy('a[href]').each((_,el)=>{
    const href=copy(el).attr('href');
    if(!/^(#|mailto:|tel:|javascript:)/i.test(href))copy(el).attr('href',new URL(href,'https://lemarkllc.ru/').href);
  });
  return copy('body').html();
};
for(const selector of ['main > .section-m','main > .contacts-2','.text-section','footer'])assert.equal(normalize(after,selector),normalize(before,selector),`${selector} changed`);
const manifest=JSON.parse(await readFile('src/content/original-source-manifest.json','utf8'));
for(const resource of manifest.resources.filter(r=>r.sha256)){
  const hash=createHash('sha256').update(await readFile('public'+decodeURIComponent(resource.path))).digest('hex');
  assert.equal(hash,resource.sha256,resource.path);
}
console.log(`Original lower markup: exact match after URL normalization. All ${manifest.resources.filter(r=>r.sha256).length} mirrored resource hashes match.`);
