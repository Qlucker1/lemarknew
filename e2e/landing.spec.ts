import { expect, test } from "@playwright/test";

test("desktop landing renders, scrubs both directions and stays console-clean", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("desktop"), "desktop-only flow");
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle(/Производитель HPL/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Производство HPL пластиков");
  const video = page.locator(".hero-video");
  await expect(video).toHaveAttribute("src", /hero-v2-desktop\.mp4/);
  await page.waitForFunction(() => (document.querySelector("video") as HTMLVideoElement)?.readyState >= 2);
  await expect(page.locator(".scroll-hero")).toHaveAttribute("data-scroll-ready", "true");
  await page.screenshot({ path: testInfo.outputPath("playwright-desktop-hero.png") });

  const heroHeight = await page.locator(".scroll-hero").evaluate((element) => element.scrollHeight);
  const heroRange = heroHeight - (await page.evaluate(() => window.innerHeight));

  const headingTops: number[] = [];
  for (const progress of [0.03, 0.23, 0.43, 0.63, 0.83]) {
    await page.evaluate(([y]) => window.scrollTo(0, y), [Math.round(heroRange * progress)]);
    await page.waitForFunction((expected) => {
      const rendered = Number((document.querySelector(".scroll-hero") as HTMLElement)?.dataset.renderedProgress);
      return Math.abs(rendered - expected) < 0.004;
    }, progress);
    await page.waitForTimeout(400);
    const visibleTop = await page.locator(".hero-chapter h1").evaluateAll((headings) => {
      const heading = headings.find((item) => Number.parseFloat(getComputedStyle(item.closest(".hero-chapter") as Element).opacity) > 0.5);
      return heading?.getBoundingClientRect().top ?? null;
    });
    expect(visibleTop).not.toBeNull();
    headingTops.push(visibleTop!);
  }
  expect(Math.max(...headingTops) - Math.min(...headingTops)).toBeLessThanOrEqual(1);

  await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroRange * 0.185));
  await page.waitForFunction(() => {
    const progress = Number((document.querySelector(".scroll-hero") as HTMLElement)?.dataset.presentedProgress);
    return progress > 0.175 && progress < 0.195;
  });
  await page.waitForTimeout(450);
  const quietOpacity = await page.locator(".hero-chapter").evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity));
  expect(quietOpacity).toBeLessThan(0.08);

  await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroRange * 0.52));
  await page.waitForTimeout(1000);
  const midTime = await video.evaluate((element) => (element as HTMLVideoElement).currentTime);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Безупречное качество");

  await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroRange * 0.96));
  await page.waitForTimeout(1000);
  const endTime = await video.evaluate((element) => (element as HTMLVideoElement).currentTime);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Трудногорючий");

  await page.evaluate((y) => window.scrollTo(0, y), Math.round(heroRange * 0.42));
  await page.waitForTimeout(1000);
  const reverseTime = await video.evaluate((element) => (element as HTMLVideoElement).currentTime);
  expect(endTime).toBeGreaterThan(midTime);
  expect(reverseTime).toBeLessThan(endTime);
  expect(errors).toEqual([]);
});

test("desktop interactions and honest form error state work", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("desktop"), "desktop-only flow");
  await page.goto("/#products", { waitUntil: "domcontentloaded" });
  await page.getByRole("tab", { name: "CP Compact" }).click();
  await expect(page.locator(".product-copy h3")).toHaveText("Compact");

  await page.goto("/#faq", { waitUntil: "domcontentloaded" });
  const faq = page.locator(".faq-list article").filter({ hasText: "Чем Compact отличается" });
  await faq.getByRole("button").click();
  await expect(faq.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  await expect(faq.locator("div")).toBeVisible();

  await page.goto("/#contact", { waitUntil: "domcontentloaded" });
  const form = page.locator("#lead-form");
  await form.locator("#attachment").setInputFiles({ name: "qa-brief.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 LEMARK QA") });
  await expect(form.locator(".file-control label span")).toHaveText("qa-brief.pdf");
  await form.getByRole("button", { name: "Удалить" }).click();
  await expect(form.locator(".file-control label span")).toHaveText("Прикрепить ТЗ или чертёж");
  await form.getByRole("button", { name: "Получить расчёт" }).click();
  await expect(form.getByText("Укажите имя")).toBeVisible();
  await expect(form.getByText("Нужно согласие на обработку данных")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("playwright-desktop-form.png") });

  const response = await page.request.post("/api/lead", {
    multipart: { name: "Тест", company: "LEMARK QA", phone: "+74950000000", email: "qa@example.com", direction: "Мебельное производство", volume: "10 листов", comment: "QA", consent: "true", samples: "false", website: "" },
  });
  expect(response.status()).toBe(503);
  expect((await response.json()).message).toContain("не настроена");
});

test("mobile uses mobile media, menu and responsive sections", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "mobile-only flow");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const video = page.locator(".hero-video");
  await expect(video).toHaveAttribute("src", /hero-v2-mobile\.mp4/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("playwright-mobile-390-hero.png") });

  await page.getByRole("button", { name: "Открыть меню" }).click();
  const menu = page.getByRole("dialog", { name: "Навигация" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Образцы", exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("playwright-mobile-390-menu.png") });
  await page.getByRole("button", { name: "Закрыть меню" }).click();

  await page.goto("/#applications", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".application-card")).toHaveCount(4);
  await page.screenshot({ path: testInfo.outputPath("playwright-mobile-390-applications.png") });
  expect(errors).toEqual([]);
});

test("responsive viewport matrix has no page-level horizontal overflow", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("desktop"), "single-browser viewport matrix");
  const viewports = [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `${viewport.width}x${viewport.height} horizontal overflow`).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath(`viewport-${viewport.width}x${viewport.height}.png`) });
  }
});

test("reduced motion renders static chapters without video", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("desktop"), "desktop-only reduced-motion flow");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".reduced-hero")).toBeVisible();
  await expect(page.locator(".reduced-hero-cover h1")).toBeVisible();
  await expect(page.locator(".reduced-chapters article")).toHaveCount(4);
  await expect(page.locator(".hero-video")).toHaveCount(0);
  await expect(page.locator(".process-window video")).toHaveCount(1);
  await page.screenshot({ path: testInfo.outputPath("playwright-reduced-motion.png") });
});

test("hero keeps a readable poster when video loading fails", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("desktop"), "desktop-only fallback flow");
  await page.route("**/hero-v2-desktop.mp4", (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".hero-poster")).not.toHaveClass(/is-hidden/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
