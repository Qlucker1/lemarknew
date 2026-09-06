import { expect, test, type Page } from '@playwright/test';
import { load } from 'cheerio';
import original from '../src/content/original-home.json';

async function ready(page: Page) {
  await page.goto('/', {waitUntil:'domcontentloaded'});
  await expect(page.locator('.lm-story')).toHaveAttribute('data-ready','true');
  await page.waitForTimeout(3200);
  const cookies = page.locator('#cookies_accept_button');
  const cookieBox = await cookies.boundingBox();
  if (cookieBox && cookieBox.y >= 0 && cookieBox.y < page.viewportSize()!.height) await cookies.click();
  await page.waitForTimeout(500);
  const popup = page.locator('.gbp-float__close');
  if (await popup.isVisible()) await popup.click();
}
async function progress(page: Page, value: number) {
  await page.locator('.lm-story').evaluate((el, p) => {
    const stage = el.querySelector('.lm-story__stage') as HTMLElement;
    const start = el.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(stage).top);
    window.scrollTo({top:start + ((el as HTMLElement).offsetHeight-stage.offsetHeight)*p,behavior:'instant'});
  }, value);
  await page.waitForFunction(p => Math.abs(Number((document.querySelector('.lm-story') as HTMLElement)?.dataset.presentedProgress)-p)<.015,value);
}

test('new 10-second media, stable chapters, empty pauses, forward and reverse seeking', async ({page},info) => {
  const errors:string[]=[];
  page.on('pageerror', e=>errors.push(e.message));
  await ready(page);
  const video=page.locator('.lm-story__video');
  await expect(video).toHaveAttribute('src',info.project.name.includes('mobile')?/v3\/mobile.mp4/:/v3\/desktop.mp4/);
  await expect.poll(()=>video.evaluate(v=>(v as HTMLVideoElement).duration)).toBeCloseTo(10,0);
  const tops=[];
  for (const [p,index] of [[.05,0],[.48,1],[.9,2]]) {
    await progress(page,p);
    const chapter=page.locator(`[data-chapter="${index}"]`);
    expect(await chapter.evaluate(el=>Number(getComputedStyle(el).opacity))).toBeGreaterThan(.98);
    tops.push((await chapter.locator('h1,h2').boundingBox())!.y);
    await page.screenshot({path:info.outputPath(`chapter-${index}.png`)});
  }
  expect(Math.max(...tops)-Math.min(...tops)).toBeLessThan(2);
  const end=await video.evaluate(v=>(v as HTMLVideoElement).currentTime);
  await progress(page,.32);
  const opacities=await page.locator('[data-chapter]').evaluateAll(els=>els.map(el=>Number(getComputedStyle(el).opacity)));
  expect(Math.max(...opacities)).toBeLessThan(.01);
  await page.screenshot({path:info.outputPath('quiet-transition.png')});
  await progress(page,.1);
  expect(await video.evaluate(v=>(v as HTMLVideoElement).currentTime)).toBeLessThan(end-5);
  expect(errors).toEqual([]);
});

test('wheel scrolling eases through intermediate positions and skip exits story',async({page},info)=>{
  test.skip(info.project.name.includes('mobile'),'native touch momentum remains on mobile');
  await ready(page);
  await page.mouse.move(1100,500);
  await page.mouse.wheel(0,600);
  const samples=await page.evaluate(async()=>{
    const values=[];
    for(let i=0;i<12;i++) {await new Promise(resolve=>setTimeout(resolve,60));values.push(scrollY);}
    return values;
  });
  expect(new Set(samples.map(Math.round)).size).toBeGreaterThan(5);
  expect(samples[0]).toBeGreaterThan(0);
  expect(samples[0]).toBeLessThan(450);
  expect(samples.at(-1)!).toBeGreaterThan(samples[0]+100);
  await page.locator('.lm-story__skip').click();
  await page.waitForTimeout(1600);
  expect(await page.locator('.lm-story').evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThan(120);
});

test('all original sections, resources, navigation and menu are preserved',async({page},info)=>{
  await ready(page);
  const reference=load(original.html);
  for(const selector of ['.composition','.about','.advantages','.factory','.partners','.contacts-2','.text-section','footer']) {
    const expected=reference(selector).first().text().replace(/\s+/g,' ').trim();
    const actual=await page.locator(selector).first().evaluate(el=>el.textContent!.replace(/\s+/g,' ').trim());
    expect(actual).toBe(expected);
  }
  expect(await page.locator('header').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(255, 255, 255)');
  await expect(page.locator('.header__navigation a').filter({hasText:'Каталог декоров'})).toHaveAttribute('href','https://lemarkllc.ru/katalog-dekorov-hpl/');
  await page.locator('.header__menu-button').click();
  await expect(page.locator('.menu')).toHaveClass(/menu_opened/);
  await page.screenshot({path:info.outputPath('original-menu.png')});
  await page.locator('.menu__close-button').click();
  await expect(page.locator('.menu')).not.toHaveClass(/menu_opened/);
  for (const selector of ['.composition','.about','.factory','.partners','.contacts-2']) {
    await page.locator(selector).first().evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-84,behavior:'instant'}));
    await page.waitForTimeout(1700);
    const popup=page.locator('.gbp-float__close');
    if(await popup.isVisible())await popup.click();
    await page.screenshot({path:info.outputPath(`original-${selector.slice(1)}.png`)});
  }
});

test('responsive matrix stays within viewport',async({page},info)=>{
  test.skip(info.project.name.includes('mobile'),'one matrix');
  await ready(page);
  for(const [width,height] of [[360,800],[390,844],[430,932],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]]) {
    await page.setViewportSize({width,height});
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(250);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    await expect(page.locator('.lm-story__cta')).toBeInViewport();
    await page.screenshot({path:info.outputPath(`viewport-${width}.png`)});
  }
});

test('reduced motion and video failure retain a short readable poster',async({page},info)=>{
  test.skip(info.project.name.includes('mobile'),'one fallback suite');
  await page.emulateMedia({reducedMotion:'reduce'});
  await ready(page);
  await expect(page.locator('.lm-story')).toHaveClass(/lm-story--static/);
  await expect(page.locator('.lm-story__video')).not.toHaveAttribute('src');
  await expect(page.locator('.lm-story__chapter').first().locator('h2')).toBeVisible();
  expect(await page.locator('.lm-story').evaluate(el=>(el as HTMLElement).offsetHeight)).toBeLessThan(900);
  await page.screenshot({path:info.outputPath('reduced-motion.png')});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.route('**/media/lemark/v3/desktop.mp4',route=>route.abort());
  await ready(page);
  await expect(page.locator('.lm-story')).toHaveClass(/lm-story--static/);
  await expect(page.locator('.lm-story__poster')).toBeVisible();
});

test('original form controls validate locally without submitting a lead',async({page},info)=>{
  test.skip(info.project.name.includes('mobile'),'one form validation suite');
  await ready(page);
  const form=page.locator('.gbp-form');
  await expect(form.locator('[type=submit]')).toBeDisabled();
  const response=await page.request.post('/assets/components/ajaxform/action.php',{form:{af_action:'invalid-qa-token'}});
  expect(response.status()).toBe(200);
  expect((await response.json()).success).toBe(false);
});
