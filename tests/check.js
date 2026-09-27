/* Smoke test for CS School pages.
   Usage: node tests/check.js [page ...]      e.g. node tests/check.js lessons/203-git.html
   With no arguments it checks index.html and every file in lessons/.
   For each page, at desktop (1280px) and phone (390px) widths, in light and dark mode, it checks:
   - no JavaScript errors
   - no sideways scrolling on the page
   - the lesson skeleton is present (hero, parts p1..p5, task lists placed before their playgrounds)
   Screenshots go to tests/shots/ (ignored by git). */
const path = require('path');
const fs = require('fs');
const http = require('http');
const { execSync } = require('child_process');

const pwPath = (() => { try { return require.resolve('playwright'); } catch (e) { return path.join(execSync('npm root -g').toString().trim(), 'playwright'); } })();
const { chromium } = require(pwPath);
const CHROME = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', process.env.CHROME_PATH].find(p => p && fs.existsSync(p));

const ROOT = path.resolve(__dirname, '..');
const SHOTS = path.join(__dirname, 'shots');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { rsp.writeHead(404); rsp.end('not found'); return; }
      rsp.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(rsp);
    }).listen(0, () => res(srv));
  });
}

(async () => {
  let pages = process.argv.slice(2);
  if (!pages.length) pages = ['index.html', ...fs.readdirSync(path.join(ROOT, 'lessons')).filter(f => f.endsWith('.html')).map(f => 'lessons/' + f)];
  fs.mkdirSync(SHOTS, { recursive: true });
  const srv = await serve();
  const base = `http://localhost:${srv.address().port}/`;
  const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
  let failures = 0;
  for (const page of pages) {
    const isLesson = page.startsWith('lessons/');
    for (const [label, width, height] of [['desktop', 1280, 900], ['phone', 390, 844]]) {
      for (const scheme of ['light', 'dark']) {
        const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, reducedMotion: 'reduce' });
        const pg = await ctx.newPage();
        const errors = [];
        pg.on('pageerror', e => errors.push('page error: ' + e.message));
        pg.on('console', m => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)|ERR_CERT|net::ERR/.test(m.text())) { if (!/Failed to load resource/.test(m.text())) errors.push('console: ' + m.text()); } });
        pg.on('response', r => { if (r.status() >= 400 && !/favicon\.ico/.test(r.url())) errors.push('HTTP ' + r.status() + ': ' + r.url()); });
        pg.on('requestfailed', r => { if (!/fonts\.(googleapis|gstatic)/.test(r.url())) errors.push('failed request: ' + r.url()); });
        await pg.goto(base + page, { waitUntil: 'load' });
        await pg.waitForTimeout(400);
        const r = await pg.evaluate((isLesson) => {
          const out = { overflow: document.documentElement.scrollWidth - innerWidth, problems: [] };
          if (!document.querySelector('.topbar')) out.problems.push('no top bar (did the page call CS.lesson / CS.home?)');
          if (!isLesson) return out;
          if (!document.querySelector('.hero h1')) out.problems.push('no hero h1');
          for (let i = 1; i <= 5; i++) if (!document.getElementById('p' + i)) out.problems.push('missing part #p' + i);
          if (document.querySelectorAll('.stop').length !== 5) out.problems.push('progress bar should have 5 parts');
          if (!document.querySelector('.lesson-foot')) out.problems.push('no footer navigation');
          // every task list must appear before the next interactive element in reading order
          document.querySelectorAll('.task').forEach(t => {
            const r = t.getBoundingClientRect();
            if (r.width === 0) out.problems.push('a task list is hidden');
          });
          // no colored side or top borders on anything (Alex's rule)
          const bad = [];
          document.querySelectorAll('main *').forEach(el => {
            const cs = getComputedStyle(el);
            ['Left', 'Top', 'Right', 'Bottom'].forEach(s => {
              const w = parseFloat(cs['border' + s + 'Width']);
              if (w >= 3 && cs['border' + s + 'Style'] !== 'none') bad.push(el.tagName.toLowerCase() + '.' + [...el.classList].join('.') + ' border-' + s.toLowerCase());
            });
          });
          if (bad.length) out.problems.push('thick borders (3px or more) found, avoid accent borders: ' + [...new Set(bad)].slice(0, 5).join(', '));
          return out;
        }, isLesson);
        const shot = path.join(SHOTS, `${path.basename(page, '.html')}-${label}-${scheme}.png`);
        await pg.screenshot({ path: shot, fullPage: true });
        const problems = [...errors, ...r.problems];
        if (r.overflow > 1) problems.push(`page scrolls sideways by ${r.overflow}px`);
        const tag = `${page} [${label}, ${scheme}]`;
        if (problems.length) { failures++; console.log(`FAIL ${tag}\n  - ${problems.join('\n  - ')}`); }
        else console.log(`ok   ${tag}`);
        await ctx.close();
      }
    }
  }
  await browser.close();
  srv.close();
  console.log(failures ? `\n${failures} check(s) failed.` : '\nAll checks passed.');
  process.exit(failures ? 1 : 0);
})();
