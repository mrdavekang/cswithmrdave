(() => {
  'use strict';
  const day = Number(document.body.dataset.day);
  const opens = Date.parse('2026-11-25T07:00:00+08:00');
  let serverTime = null, checkedAt = 0, checking = false;
  const now = () => serverTime === null ? Date.now() : serverTime + performance.now() - checkedAt;
  const open = () => now() >= opens;
  window.coverDay2Open = open;
  const home = document.getElementById('home');
  const lang = document.getElementById('lang');
  const main = document.getElementById('main');
  let started = false, timer;
  let bilingual = false;
  try { bilingual = JSON.parse(localStorage.getItem('y9-cover-zh')) === true; } catch {}
  function waiting() {
    home.hidden = true;
    lang.textContent = bilingual ? 'English only' : 'English + 中文';
    lang.setAttribute('aria-pressed', String(bilingual));
    main.innerHTML = '<section class="panel"><p class="kicker">Year 9E · Day 2</p><h1>Day 2 opens on Wednesday</h1><p><strong>25 November at 7:00 am (Malaysia time)</strong></p><p>You can carry on with Day 1. Use the same browser and device to reopen your saved work.</p>' +
      (bilingual ? '<p lang="zh-Hans">第二天的课程将于 11 月 25 日星期三早上 7 点（马来西亚时间）开放。你可以先继续第一天的活动。请用同一台设备和同一浏览器打开已保存的进度。</p>' : '') +
      '<a class="btn primary" href="../year9-cover-day1/#resume">Continue Day 1'+(bilingual?' · 继续第一天':'')+'</a></section>';
    lang.onclick = () => { bilingual = !bilingual; try { localStorage.setItem('y9-cover-zh',JSON.stringify(bilingual)); } catch {} waiting(); };
  }
  function enter() {
    if (started) return;
    clearTimeout(timer);
    if (day === 2 && (serverTime === null || !open())) {
      waiting();
      timer = setTimeout(checkRelease, Math.min(2147483647, Math.max(1, serverTime === null ? 15000 : opens - now())));
      return;
    }
    started = true;
    home.hidden = false;
    [day===1?'cards.js?v=day1':'day2-cards.js','arcade-art.js?v=type2','jam-guides.js?v=vector1','jam.js?v=resume1','studio.js?v=resume1'].forEach(file => {
      const s = document.createElement('script');
      s.async = false;
      s.src = '../year9-cover-shared/' + file;
      s.onerror = () => { main.textContent = 'The lesson could not load. Refresh to try again. 课程未能加载，请刷新后重试。'; };
      document.body.append(s);
    });
  }
  async function checkRelease() {
    if(started || checking)return;
    if(day===1){enter();return;}
    checking=true;
    try {
      const url=new URL(location.pathname,location.origin);
      url.searchParams.set('release-check',Date.now());
      const response=await fetch(url,{method:'HEAD',cache:'no-store',signal:globalThis.AbortSignal?.timeout?.(6000)});
      const stamp=Date.parse(response.headers.get('Date'));
      if(response.ok && Number.isFinite(stamp)){serverTime=stamp;checkedAt=performance.now();}
    } catch { /* Keep the last confirmed time or retry from the waiting screen. */ }
    finally {checking=false;enter();}
  }
  window.addEventListener('pageshow',checkRelease);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkRelease();});
  checkRelease();
})();
