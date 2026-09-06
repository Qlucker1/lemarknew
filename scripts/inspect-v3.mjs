import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('artifacts/v3', {recursive:true});
const browser = await chromium.launch();
const report = [];
for (const [name, url, width, height] of [['local-desktop','http://127.0.0.1:3000',1440,900],['original-desktop','https://lemarkllc.ru/',1440,900],['local-mobile','http://127.0.0.1:3000',390,844]]) {
  const page = await browser.newPage({viewport:{width,height}});
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(url, {waitUntil:'domcontentloaded'});
  await page.waitForTimeout(4500);
  const accept = page.locator('#cookies_accept_button');
  if (await accept.isVisible()) await accept.click();
  const close = page.locator('.gbp-float__close');
  if (await close.isVisible()) await close.click();
  const info = await page.evaluate(() => ({title:document.title,header:getComputedStyle(document.querySelector('header')).backgroundColor,overflow:document.documentElement.scrollWidth-innerWidth,hero:document.querySelector('.lm-story')?.getBoundingClientRect().toJSON(),forms:[...document.forms].map(f=>({class:f.className,action:f.action})),buttons:[...document.querySelectorAll('[class*=close],.menu-button')].map(x=>({class:x.className,text:x.textContent.slice(0,50)}))}));
  await page.screenshot({path:`artifacts/v3/${name}-hero.png`});
  for (const section of ['composition','about','advantages','factory','partners','contacts-2']) {
    const element=page.locator('.'+section).first();
    await element.evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY-80));
    await page.waitForTimeout(1800);
    if (await close.isVisible()) await close.click();
    await page.screenshot({path:`artifacts/v3/${name}-${section}.png`});
  }
  report.push({name,info,errors});
  await page.close();
}
await browser.close();
await writeFile('artifacts/v3/inspection.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
