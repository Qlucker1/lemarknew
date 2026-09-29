import Lenis from 'lenis';

const root = document.querySelector<HTMLElement>('.lm-story');
const video = root?.querySelector<HTMLVideoElement>('video');
if (root && video) initialize(root, video);

function initialize(root: HTMLElement, video: HTMLVideoElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 767px)');
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const chapters = [...root.querySelectorAll<HTMLElement>('[data-chapter]')];
  const bar = root.querySelector<HTMLElement>('.lm-story__progress span')!;
  let lenis: Lenis | undefined;
  let raf = 0;
  let target = 0;
  let displayed = 0;
  let range = 1;
  let start = 0;
  let duration = 9.96;
  let active = true;
  let staticMode = reduced.matches || !!connection?.saveData;
  let snapTimer: number | undefined;
  let mobileReleaseTimer: number | undefined;
  let mobileTouchStartY = 0;
  let mobileGestureOwnsScroll = false;
  let mobileStepping = false;
  let scrollDirection = 1;
  // Four settled visual scenes: kitchen, facade, laboratory, train.
  const storyStops = [0, .40, .70, .90];

  const clamp = (n: number) => Math.min(1, Math.max(0, n));
  const fade = (n: number, a: number, b: number) => {
    const t = clamp((n - a) / (b - a));
    return t * t * (3 - 2 * t);
  };
  function render(progress: number) {
    const opacity = [1 - fade(progress, .20, .28), fade(progress, .33, .39) * (1 - fade(progress, .57, .63)), fade(progress, .64, .70)];
    chapters.forEach((chapter, index) => {
      chapter.style.opacity = String(opacity[index]);
      chapter.setAttribute('aria-hidden', String(opacity[index] < .1));
    });
    root.dataset.presentedProgress = progress.toFixed(4);
  }
  function measure() {
    const stage = root.querySelector<HTMLElement>('.lm-story__stage')!;
    start = root.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(stage).top) || 0);
    range = root.offsetHeight - stage.offsetHeight;
  }
  function setup() {
    lenis?.destroy();
    staticMode = reduced.matches || !!connection?.saveData;
    root.classList.toggle('lm-story--static', staticMode);
    if (staticMode) {
      video.removeAttribute('src');
      video.load();
      render(0);
    } else {
      if (!mobile.matches) {
        lenis = new Lenis({ smoothWheel: true, duration: .9, wheelMultiplier: .75, syncTouch: false, anchors: false, autoRaf: true,
          prevent: node => !!node.closest('.popup, .menu, .gbp-overlay') });
        root.dataset.smoothWheel = 'true';
      } else {
        delete root.dataset.smoothWheel;
      }
      const src = `/media/lemark/v8/${mobile.matches ? 'mobile' : 'desktop'}.mp4`;
      if (!video.src.endsWith(src)) {
        root.classList.remove('lm-story--loaded');
        video.src = src;
        video.preload = 'auto';
        video.load();
      }
    }
    measure();
    root.dataset.ready = 'true';
  }
  video.addEventListener('loadedmetadata', () => { duration = Math.max(.1, video.duration - 1 / 24); });
  video.addEventListener('loadeddata', () => { root.classList.add('lm-story--loaded'); });
  video.addEventListener('error', () => {
    root.classList.remove('lm-story--loaded');
    root.classList.add('lm-story--static');
    staticMode = true;
    render(0);
    measure();
  });
  video.addEventListener('seeked', () => {
    displayed = video.currentTime / duration;
    render(displayed);
  });
  function tick() {
    if (!staticMode && active) {
      target = clamp((window.scrollY - start) / Math.max(1, range));
      root.dataset.targetProgress = target.toFixed(4);
      bar.style.transform = `scaleX(${target})`;
      const time = target * duration;
      // Keep one seek in flight, so slow decoders do not accumulate stale requests.
      if (video.readyState >= 2 && !video.seeking && Math.abs(video.currentTime - time) > 1 / 48) video.currentTime = time;
    }
    raf = requestAnimationFrame(tick);
  }
  function snapToStoryStop() {
    snapTimer = undefined;
    if (!lenis || staticMode || mobile.matches || !active || target <= .015 || target >= .985) return;
    const candidates = scrollDirection > 0 ? storyStops : [...storyStops].reverse();
    const stop = candidates.find(point => scrollDirection > 0 ? point > target + .01 : point < target - .01);
    if (stop === undefined) return;
    const distance = Math.abs(stop - target);
    const snapDuration = Math.min(3.4, Math.max(1.8, 1.2 + distance * 5));
    lenis.scrollTo(start + range * stop, { duration: snapDuration });
  }
  function mobileControlZone() {
    const position = window.scrollY;
    // The final stop deliberately remains escapable: the next gesture continues into the page.
    return position >= start - 2 && position < start + range * .985;
  }
  function moveMobileStory(direction: number) {
    if (!mobile.matches || staticMode || !active || mobileStepping || !mobileControlZone()) return false;
    const current = clamp((window.scrollY - start) / Math.max(1, range));
    const stops = direction > 0 ? [...storyStops.slice(1), 1] : [...storyStops].reverse();
    const next = stops.find(point => direction > 0 ? point > current + .015 : point < current - .015);
    if (next === undefined) return false;
    mobileStepping = true;
    window.scrollTo({ top: start + range * next, behavior: 'smooth' });
    if (mobileReleaseTimer !== undefined) window.clearTimeout(mobileReleaseTimer);
    mobileReleaseTimer = window.setTimeout(() => { mobileStepping = false; }, 850);
    return true;
  }
  function scheduleStorySnap(event: WheelEvent) {
    if (event.deltaY === 0 || staticMode || !active) return;
    if (mobile.matches) {
      if (moveMobileStory(Math.sign(event.deltaY))) event.preventDefault();
      return;
    }
    scrollDirection = Math.sign(event.deltaY);
    if (snapTimer !== undefined) window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(snapToStoryStop, 320);
  }
  function beginMobileGesture(event: TouchEvent) {
    const targetElement = event.target instanceof Element ? event.target : null;
    mobileGestureOwnsScroll = mobile.matches && mobileControlZone() && !targetElement?.closest('a,button,input,textarea,select,label');
    mobileTouchStartY = event.touches[0]?.clientY ?? 0;
  }
  function holdMobileGesture(event: TouchEvent) {
    if (mobileGestureOwnsScroll) event.preventDefault();
  }
  function endMobileGesture(event: TouchEvent) {
    if (!mobileGestureOwnsScroll) return;
    mobileGestureOwnsScroll = false;
    const endY = event.changedTouches[0]?.clientY ?? mobileTouchStartY;
    const distance = mobileTouchStartY - endY;
    if (Math.abs(distance) > 28) moveMobileStory(Math.sign(distance));
  }
  const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; }, {rootMargin: '200px'});
  observer.observe(root);
  root.querySelector('.lm-story__skip')?.addEventListener('click', () => {
    const y = root.getBoundingClientRect().top + window.scrollY + root.offsetHeight - document.querySelector('header')!.offsetHeight;
    if (lenis) lenis.scrollTo(y, {duration: 1.1});
    else window.scrollTo({top:y, behavior:'instant'});
  });
  window.addEventListener('resize', measure, {passive:true});
  window.addEventListener('wheel', scheduleStorySnap, {passive:false});
  window.addEventListener('touchstart', beginMobileGesture, {passive:true});
  window.addEventListener('touchmove', holdMobileGesture, {passive:false});
  window.addEventListener('touchend', endMobileGesture, {passive:true});
  window.addEventListener('load', measure, {once:true});
  reduced.addEventListener('change', setup);
  mobile.addEventListener('change', setup);
  document.fonts.ready.then(measure);
  window.addEventListener('pagehide', () => { if (snapTimer !== undefined) window.clearTimeout(snapTimer); if (mobileReleaseTimer !== undefined) window.clearTimeout(mobileReleaseTimer); cancelAnimationFrame(raf); lenis?.destroy(); observer.disconnect(); });
  window.addEventListener('pageshow', event => {
    if (event.persisted) { setup(); observer.observe(root); tick(); }
  });
  setup();
  tick();
}
