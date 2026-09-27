/* CS School shared runtime.
   Every lesson page loads this file, then calls CS.lesson({...}) once.
   Components: lesson chrome (top bar, background, footer nav), progress storage,
   task lists, notes, steer-the-AI cards, quizzes, a practice terminal and a code lab. */
(function () {
  'use strict';
  const CS = (window.CS = {});

  /* ---------------- curriculum ---------------- */
  CS.LEVELS = [
    { n: 1, name: 'Intro', sub: 'The foundations: what computers, code and AI tools actually do.', color: 'var(--l2)' },
    { n: 2, name: 'Core', sub: 'Systems, architecture and UX: the choices behind every project.', color: 'var(--l1)' },
    { n: 3, name: 'Theory electives', sub: 'The math behind computing and AI, made visual.', color: 'var(--l5)' }
  ];
  CS.COURSES = [
    { id: '101', slug: 'how-the-internet-works', title: 'How computers & the internet work', short: 'How the internet works', blurb: 'Follow a click from your laptop to a server on the other side of the world and back.', minutes: 15 },
    { id: '102', slug: 'what-code-is', title: 'What code actually is', short: 'What code is', blurb: 'Variables, conditions, loops and functions, stepped through one line at a time.', minutes: 15 },
    { id: '103', slug: 'how-ai-coding-tools-work', title: 'How AI coding tools work', short: 'How AI coding tools work', blurb: 'Tokens, context windows, and why an AI can be confidently wrong.', minutes: 15 },
    { id: '201', slug: 'thinking-in-systems', title: 'Thinking in systems', short: 'Thinking in systems', blurb: 'Sketch any app as parts and connections, and see where it breaks.', minutes: 15 },
    { id: '202', slug: 'anatomy-of-an-app', title: 'Anatomy of an app', short: 'Anatomy of an app', blurb: 'Frontend, backend, database and hosting, taken apart layer by layer.', minutes: 15 },
    { id: '203', slug: 'git', title: 'Git & version control', short: 'Git', blurb: 'Save points, branches and merges, so you and your AI can experiment without fear.', minutes: 15 },
    { id: '204', slug: 'libraries-and-dependencies', title: 'Libraries & dependencies', short: 'Libraries & dependencies', blurb: 'When adding a package is wise, and why version numbers matter.', minutes: 15 },
    { id: '205', slug: 'data-and-databases', title: 'Data & databases', short: 'Data & databases', blurb: 'Tables, documents, key-value and vector stores, and how to pick one.', minutes: 15 },
    { id: '206', slug: 'apis-and-integrations', title: 'APIs & integrations', short: 'APIs', blurb: 'How apps talk to each other: requests, responses, keys and webhooks.', minutes: 15 },
    { id: '207', slug: 'security-essentials', title: 'Security essentials', short: 'Security', blurb: 'Secrets, logins, permissions, and the holes AI-written code often leaves.', minutes: 15 },
    { id: '208', slug: 'testing-and-debugging', title: 'Testing & debugging', short: 'Testing & debugging', blurb: 'Read an error, write a test, and ask the AI for the right fix.', minutes: 15 },
    { id: '209', slug: 'shipping-and-running-software', title: 'Shipping & running software', short: 'Shipping', blurb: 'Deploys, environments, costs, scaling and knowing when things break.', minutes: 15 },
    { id: '210', slug: 'designing-for-people', title: 'Designing for people', short: 'Designing for people', blurb: 'Users, goals and flows: design starts before anything is drawn.', minutes: 15 },
    { id: '211', slug: 'visual-design-basics', title: 'Visual design basics', short: 'Visual design', blurb: 'Hierarchy, spacing, color and type, tuned live with sliders.', minutes: 15 },
    { id: '212', slug: 'accessibility', title: 'Accessibility & inclusive design', short: 'Accessibility', blurb: 'See your product through different eyes, hands and situations.', minutes: 15 },
    { id: '213', slug: 'design-intent-for-ai', title: 'Communicating design intent to AI', short: 'Design intent for AI', blurb: 'Briefs, references and precise feedback that get the design you meant.', minutes: 15 },
    { id: '214', slug: 'capstone-directing-the-ai', title: 'Capstone: Directing the AI', short: 'Capstone', blurb: 'Take a product from idea to launch by steering an AI through every decision.', minutes: 20 },
    { id: '301', slug: 'logic', title: 'Logic & how computers decide', short: 'Logic', blurb: 'True, false, AND, OR, NOT, and the circuits built from them.', minutes: 15 },
    { id: '302', slug: 'algorithms-and-speed', title: 'Algorithms & speed', short: 'Algorithms & speed', blurb: 'Why some programs crawl as data grows, and what Big-O really means.', minutes: 15 },
    { id: '303', slug: 'data-structures', title: 'Data structures', short: 'Data structures', blurb: 'Lists, hash tables, trees and graphs as objects you can touch.', minutes: 15 },
    { id: '304', slug: 'probability-for-ai', title: 'Probability & statistics for AI', short: 'Probability', blurb: 'Chance, uncertainty and sampling: the math of an AI picking its next word.', minutes: 15 },
    { id: '305', slug: 'vectors-and-embeddings', title: 'Vectors & embeddings', short: 'Embeddings', blurb: 'How AI turns meaning into points in space you can measure.', minutes: 15 },
    { id: '306', slug: 'how-neural-networks-learn', title: 'How neural networks learn', short: 'How neural nets learn', blurb: 'Weights, errors and gradient descent: a ball rolling downhill.', minutes: 15 }
  ];
  CS.COURSES.forEach((c, i) => {
    c.level = +c.id[0]; c.index = i; c.file = `${c.id}-${c.slug}.html`;
    if (c.level === 2) c.group = +c.id >= 214 ? 'Capstone' : +c.id >= 210 ? 'UX design' : 'Systems & architecture';
  });
  CS.course = id => CS.COURSES.find(c => c.id === String(id));

  /* ---------------- helpers ---------------- */
  CS.$ = (s, r = document) => r.querySelector(s);
  CS.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  CS.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  CS.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  CS.hex = (n = 7) => Array.from({ length: n }, () => '0123456789abcdef'[Math.random() * 16 | 0]).join('');
  CS.tokenize = s => {
    s = s.replace(/[“”„]/g, '"').replace(/[‘’]/g, "'").replace(/[—–]/g, '--');
    const t = []; const re = /"([^"]*)"|'([^']*)'|(\S+)/g; let m;
    while ((m = re.exec(s))) t.push(m[1] ?? m[2] ?? m[3]);
    return t;
  };
  CS.lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
  CS.PALETTE = ['#E5484D', '#3E63DD', '#12A594', '#F5A524', '#8E4EC6'];

  /* ---------------- progress storage (per browser) ---------------- */
  const KEY = 'cs-school:v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { lessons: {} }; } catch (e) { return { lessons: {} }; } };
  const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage unavailable */ } };
  CS.progress = {
    get(id) { return load().lessons[id] || null; },
    all() { return load().lessons; },
    status(id) { const r = this.get(id); if (!r || !r.parts || !r.parts.length) return 'new'; return r.done ? 'complete' : 'progress'; },
    markPart(id, pid, total) {
      const s = load(); const r = s.lessons[id] || (s.lessons[id] = { parts: [], total });
      if (!r.parts.includes(pid)) r.parts.push(pid);
      r.total = total; r.t = Date.now(); r.done = r.parts.length >= total;
      save(s); return r;
    },
    last() { const all = load().lessons; let best = null; for (const id in all) if (!best || all[id].t > all[best].t) best = id; return best; },
    reset() { save({ lessons: {} }); }
  };

  /* ---------------- toast & confetti ---------------- */
  let toastT;
  CS.toast = text => {
    let el = CS.$('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = text; el.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2400);
  };
  CS.confetti = () => {
    if (CS.reduce) return;
    let cv = CS.$('#confetti');
    if (!cv) { cv = document.createElement('canvas'); cv.id = 'confetti'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv); }
    const ctx = cv.getContext('2d');
    cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    const ps = Array.from({ length: 150 }, () => ({
      x: innerWidth / 2 + (Math.random() - .5) * 240, y: innerHeight * .35,
      vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, w: Math.random() * 14 + 8,
      a: Math.random() * 6, va: (Math.random() - .5) * .25, c: CS.PALETTE[Math.random() * 5 | 0]
    }));
    let t = 0;
    (function frame() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ps.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -2.5, p.w, 5); ctx.restore(); });
      if (++t < 170) requestAnimationFrame(frame); else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })();
  };

  /* ---------------- page chrome ---------------- */
  const LOGO = `<svg width="30" height="26" viewBox="0 0 30 26" aria-hidden="true"><path d="M4 19H26" style="stroke:var(--ink)" stroke-width="2.5" stroke-linecap="round" opacity=".35"/><path d="M6 19C13 19 12 7 20 7H26" style="stroke:var(--l2)" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="5" cy="19" r="3.5" style="fill:var(--ink)"/><circle cx="25" cy="7" r="3.5" style="fill:var(--l2)"/><circle cx="25" cy="19" r="3.5" style="fill:var(--l1)"/></svg>`;
  const AMBIENT = `<div class="ambient" aria-hidden="true"><svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke-width="90" stroke-linecap="round">
    <path d="M-120 260C300 170 520 540 900 440S1400 290 1560 360" style="stroke:var(--l1)"/>
    <path d="M-120 730C260 640 520 400 860 520S1300 780 1560 640" style="stroke:var(--l2)"/>
    <path d="M180 -120C110 220 540 360 470 640S620 980 700 1040" style="stroke:var(--l3)"/>
    <path d="M1060 1040C1120 820 1300 700 1560 620" style="stroke:var(--l4)"/>
    <path d="M820 -120C860 130 1100 230 1560 170" style="stroke:var(--l5)"/></g></svg></div>`;
  CS.chrome = ({ home = '../index.html', crumb = '', progressHTML = '' } = {}) => {
    if (!CS.$('.ambient')) document.body.insertAdjacentHTML('afterbegin', AMBIENT);
    if (!CS.$('.topbar')) {
      CS.$('.ambient').insertAdjacentHTML('afterend', `<header class="topbar"><div class="wrap">
        <a class="brand" href="${home}" aria-label="CS School home">${LOGO}<span>CS School</span></a>
        <span class="crumb">${crumb}</span>${progressHTML}</div></header>`);
    }
  };

  /* ---------------- lesson ---------------- */
  let L = null;
  CS.lesson = cfg => {
    const course = CS.course(cfg.id);
    const parts = cfg.parts;
    const lvl = CS.LEVELS[course.level - 1];
    const stored = CS.progress.get(cfg.id);
    L = { id: cfg.id, course, parts, done: new Set(stored ? stored.parts : []), onComplete: cfg.onComplete };
    const segs = parts.map((p, i) => `<button class="stop" data-go="${p.id}" title="Part ${i + 1}: ${CS.esc(p.title)}"><span class="vh">Part ${i + 1}: ${CS.esc(p.title)}</span></button>`).join('');
    CS.chrome({
      crumb: `<a href="../index.html">${lvl.name}</a> · Course ${course.id}: ${CS.esc(course.short)}`,
      progressHTML: `<nav class="stops" aria-label="Lesson progress"><div class="stops-line">${segs}</div><span class="stops-count" id="stopsCount" aria-live="polite"></span></nav>`
    });
    CS.$$('.stop').forEach(s => s.addEventListener('click', () => { const t = document.getElementById(s.dataset.go); if (t) t.scrollIntoView({ behavior: CS.reduce ? 'auto' : 'smooth' }); }));
    // footer navigation to neighbouring lessons
    const prev = CS.COURSES[course.index - 1], next = CS.COURSES[course.index + 1];
    const navLink = (c, cls, label) => c ? `<a class="nav glass ${cls}" href="${c.file}"><small>${label}</small><span>${c.id} ${CS.esc(c.short)}</span></a>` : '<span></span>';
    if (!CS.$('.lesson-foot')) document.body.insertAdjacentHTML('beforeend', `<footer class="lesson-foot"><div class="wrap">${navLink(prev, 'prev', 'Previous')}<a class="btn home" href="../index.html">All courses</a>${navLink(next, 'next', 'Next up')}</div></footer>`);
    if (!document.title.includes('CS School')) document.title = `${document.title || course.title} · CS School`;
    paintProgress();
    return L;
  };
  function paintProgress() {
    if (!L) return;
    L.parts.forEach(p => {
      const done = L.done.has(p.id);
      const s = CS.$(`.stop[data-go="${p.id}"]`); if (s) s.classList.toggle('done', done);
      const b = CS.$(`.bullet[data-p="${p.id}"]`); if (b) b.classList.toggle('done', done);
    });
    const c = CS.$('#stopsCount'); if (c) c.textContent = `${L.done.size} of ${L.parts.length}`;
  }
  CS.completePart = pid => {
    if (!L || L.done.has(pid)) return;
    L.done.add(pid);
    const r = CS.progress.markPart(L.id, pid, L.parts.length);
    paintProgress();
    const idx = L.parts.findIndex(p => p.id === pid) + 1;
    if (L.done.size === L.parts.length) {
      CS.toast(`Course ${L.id} complete. Nice work!`);
      setTimeout(CS.confetti, 250);
      if (L.onComplete) L.onComplete(r);
    } else CS.toast(`Part ${idx} done`);
  };
  CS.isPartDone = pid => !!(L && L.done.has(pid));

  /* task lists: <div class="task glass" data-part="p1"><ol><li data-t="key"><span>…</span></li></ol></div> */
  CS.tick = (part, key) => {
    const li = CS.$(`.task[data-part="${part}"] li[data-t="${key}"]`);
    if (li) li.classList.add('done');
    const all = CS.$$(`.task[data-part="${part}"] li`);
    if (all.length && all.every(l => l.classList.contains('done'))) CS.completePart(part);
  };
  CS.ticked = (part, key) => { const li = CS.$(`.task[data-part="${part}"] li[data-t="${key}"]`); return !!(li && li.classList.contains('done')); };

  /* notes: CS.say(el, '<strong>Nice.</strong> …', 'good' | 'bad' | 'info' | '') */
  CS.say = (el, html, kind = '') => {
    el.classList.add('note'); el.classList.remove('good', 'bad', 'info');
    if (kind) el.classList.add(kind);
    el.innerHTML = html; el.hidden = false;
  };

  /* ---------------- steer the AI ---------------- */
  // scenarios: [{ who?, ai: 'text', opts: [[text, isBest(0|1), why], …] }]
  CS.steer = (root, scenarios, { part, counter } = {}) => {
    root.classList.add('cards');
    root.innerHTML = scenarios.map((s, i) => `<div class="qcard glass" data-s="${i}">
      <div class="said"><span class="who">${CS.esc(s.who || 'AI assistant')}</span>${CS.esc(s.ai)}</div>
      <div class="label">Your reply</div>
      <div class="opts">${s.opts.map((o, j) => `<button class="opt" data-o="${j}">${CS.esc(o[0])}</button>`).join('')}</div>
      <div class="note" hidden aria-live="polite"></div></div>`).join('');
    const good = new Set();
    const paint = () => { if (counter) counter.textContent = `${good.size} of ${scenarios.length} answered well`; };
    paint();
    root.addEventListener('click', e => {
      const b = e.target.closest('.opt'); if (!b || b.disabled) return;
      const card = b.closest('.qcard'); const o = scenarios[+card.dataset.s].opts[+b.dataset.o];
      const note = CS.$('.note', card);
      if (o[1]) {
        b.classList.add('right'); CS.$$('.opt', card).forEach(x => x.disabled = true);
        CS.say(note, `<strong>Good steer.</strong> ${CS.esc(o[2])}`, 'good');
        good.add(card.dataset.s); paint();
        if (good.size === scenarios.length && part) CS.completePart(part);
      } else {
        b.classList.add('wrong'); b.disabled = true;
        CS.say(note, `<strong>Not quite.</strong> ${CS.esc(o[2])} Try another reply.`, 'bad');
      }
    });
  };

  /* ---------------- quiz ---------------- */
  // questions: [{ q, a: [[text, isRight(0|1)], …], why }]
  CS.quiz = (root, questions, { part, doneCard, doneTitle, doneText } = {}) => {
    root.classList.add('cards');
    root.innerHTML = questions.map((q, i) => `<div class="qcard glass" data-q="${i}"><div class="kicker">Question ${i + 1} of ${questions.length}</div><h3>${CS.esc(q.q)}</h3>
      <div class="opts">${q.a.map((o, j) => `<button class="opt" data-o="${j}">${CS.esc(o[0])}</button>`).join('')}</div><div class="note" hidden aria-live="polite"></div></div>`).join('');
    const answered = {};
    root.addEventListener('click', e => {
      const b = e.target.closest('.opt'); if (!b || b.disabled) return;
      const card = b.closest('.qcard'); const i = +card.dataset.q; const q = questions[i]; const ok = !!q.a[+b.dataset.o][1];
      CS.$$('.opt', card).forEach((x, j) => { x.disabled = true; if (q.a[j][1]) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      answered[i] = ok;
      CS.say(CS.$('.note', card), `<strong>${ok ? 'Correct.' : 'Not quite.'}</strong> ${CS.esc(q.why)}`, ok ? 'good' : 'bad');
      if (Object.keys(answered).length === questions.length) {
        const score = Object.values(answered).filter(Boolean).length;
        if (doneCard) {
          const course = L ? L.course : null;
          const next = course ? CS.COURSES[course.index + 1] : null;
          doneCard.innerHTML = `<div class="kicker">${course ? `Course ${course.id} complete` : 'Complete'}</div>
            <h2>${score === questions.length ? 'Perfect score.' : `${score} of ${questions.length} right.`} ${CS.esc(doneTitle || '')}</h2>
            <p>${CS.esc(doneText || 'Nice work.')}</p>
            <div class="row" style="margin-top:12px">${next ? `<a class="btn primary" href="${next.file}">Next: ${next.id} ${CS.esc(next.short)}</a>` : ''}<a class="btn" href="../index.html">All courses</a></div>`;
          doneCard.classList.add('glass', 'done-card', 'show');
        }
        if (part) CS.completePart(part);
      }
    });
  };

  /* ---------------- mission list (shared by terminal and code lab) ---------------- */
  function renderMission(ol, steps, step) {
    if (!ol) return;
    ol.classList.add('mission');
    ol.innerHTML = steps.map((s, i) => `<li class="${i < step ? 'done' : i === step ? 'cur' : ''}"><span class="ck">${i < step ? '✓' : i + 1}</span><div><b>${s.t}</b>${i === step ? `<span class="how">${s.how}</span>` : ''}</div></li>`).join('');
  }
  function stepBanner(el, steps, step, doneHTML) {
    el.innerHTML = step < steps.length ? `<b>Step ${step + 1} of ${steps.length}: ${steps[step].t}.</b> ${steps[step].how}` : (doneHTML || '<b>Mission complete.</b> Keep exploring if you like.');
  }

  /* ---------------- practice terminal ----------------
     CS.terminal(rootEl, {
       part: 'p3', mission: olEl, title: 'lemonade',
       prompt: () => '~/app $', intro: 'html shown first',
       steps: [{ t, how, cmd: 'text' | () => 'text', done: (action) => bool }],
       run: (argv, line, io) => action object | null   // lesson-specific command handling
       onStep: (index, action, api) => {}, doneHTML: 'banner when finished', doneTutor: 'tutor line when finished'
     })
     io: print(html, cls), tutor(html), ai(html), clear()                                              */
  let uidN = 0;
  CS.terminal = (root, cfg) => {
    const uid = `cs-term-${++uidN}`;
    root.innerHTML = `<div class="term">
      <div class="term-step" aria-live="polite"></div>
      <div class="term-out" aria-live="polite"></div>
      <form class="term-in" autocomplete="off"><span class="ps"></span><label class="vh" for="${uid}">Command</label><input id="${uid}" type="text" spellcheck="false" autocapitalize="off" autocorrect="off" placeholder="type here, then press Enter"></form>
      <div class="term-tools"><button class="btn" type="button" data-a="hint">Show a hint</button><button class="btn" type="button" data-a="type">Type it for me</button></div></div>`;
    const input = CS.$('input', root);
    const out = CS.$('.term-out', root), ps = CS.$('.ps', root), banner = CS.$('.term-step', root);
    const steps = cfg.steps || []; let step = 0;
    const io = {
      print(html, cls = '') { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; out.appendChild(d); out.scrollTop = out.scrollHeight; },
      tutor(html) { io.print(`<b>Tutor:</b> ${html}`, 'tutor'); },
      ai(html, who = 'AI assistant') { io.print(`<b>${who}:</b> ${html}`, 'ai'); },
      clear() { out.innerHTML = ''; }
    };
    const cmdOf = s => typeof s.cmd === 'function' ? s.cmd() : s.cmd;
    const refresh = () => { ps.textContent = cfg.prompt ? cfg.prompt() : '$'; renderMission(cfg.mission, steps, step); stepBanner(banner, steps, step, cfg.doneHTML); };
    const hint = () => { if (step < steps.length) io.tutor(`Type <b>${CS.esc(cmdOf(steps[step]))}</b> and press Enter.`); else io.tutor(cfg.doneTutor || 'You finished the mission. Keep experimenting if you like.'); };
    const advance = action => {
      let moved = false;
      while (step < steps.length && steps[step].done(action || {})) { const a = action || {}; step++; moved = true; action = {}; if (cfg.onStep) cfg.onStep(step - 1, a, api); }
      if (moved && step === steps.length) {
        if (cfg.doneTutor) setTimeout(() => io.tutor(cfg.doneTutor), 250);
        if (cfg.part) CS.completePart(cfg.part);
      }
      refresh();
    };
    const hist = []; let hi = 0;
    CS.$('form', root).addEventListener('submit', e => {
      e.preventDefault();
      const line = input.value; input.value = '';
      if (line.trim()) { hist.push(line); hi = hist.length; }
      io.print(`<span class="ps">${CS.esc(ps.textContent)}</span> ${CS.esc(line.trim())}`, 'cmd');
      if (!line.trim()) return;
      const argv = CS.tokenize(line.trim());
      if (argv[0] === 'clear') { io.clear(); return; }
      if (argv[0] === 'hint') { hint(); return; }
      let action = cfg.run ? cfg.run(argv, line.trim(), io, api) : undefined;
      if (action === undefined) { io.print(`command not found: ${CS.esc(argv[0])}`, 'r'); io.tutor('Type <b>help</b> to see the commands you can use here, or press "Show a hint".'); action = null; }
      advance(action);
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' && hi > 0) { hi--; input.value = hist[hi]; e.preventDefault(); }
      if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; e.preventDefault(); }
    });
    CS.$('[data-a="hint"]', root).addEventListener('click', hint);
    CS.$('[data-a="type"]', root).addEventListener('click', () => { if (step < steps.length) { input.value = cmdOf(steps[step]); input.focus({ preventScroll: true }); } });
    CS.$('.term', root).addEventListener('click', e => { if (!e.target.closest('button') && !getSelection().toString()) input.focus({ preventScroll: true }); });
    if (cfg.intro) io.print(`<span class="dim">${cfg.intro}</span>`);
    const api = { io, refresh, advance, get step() { return step; }, input };
    refresh();
    return api;
  };

  /* ---------------- code lab ----------------
     CS.codeLab(rootEl, {
       part: 'p3', mission: olEl, language: 'JavaScript', starter: 'code',
       steps: [{ t, how, hint: 'html', check: (result) => bool }],
       run: (code) => result      // optional; default runs JavaScript and captures console.log
     })
     default result: { code, logs: [strings], error: string|null, value }                          */
  CS.runJS = code => {
    const logs = []; const fmt = v => typeof v === 'string' ? v : (() => { try { return JSON.stringify(v); } catch (e) { return String(v); } })();
    const con = { log: (...a) => logs.push(a.map(fmt).join(' ')), error: (...a) => logs.push(a.map(fmt).join(' ')) };
    let error = null, value;
    const guarded = code.replace(/\b(for|while)\s*\(([^)]*)\)\s*\{/g, (m) => m + ' if (++__g > 5000000) throw new Error("Stopped: this loop ran more than 5 million times. Is it infinite?");');
    try { value = new Function('console', '"use strict"; let __g = 0;\n' + guarded)(con); } catch (e) { error = e.name + ': ' + e.message; }
    return { code, logs, error, value };
  };
  CS.codeLab = (root, cfg) => {
    const uid = `cs-code-${++uidN}`;
    root.innerHTML = `<div class="term">
      <div class="term-step" aria-live="polite"></div>
      <div class="cl-editor"><div class="cl-lines" aria-hidden="true"></div><label class="vh" for="${uid}">${CS.esc(cfg.language || 'Code')} editor</label><textarea id="${uid}" spellcheck="false" autocapitalize="off" autocorrect="off"></textarea></div>
      <div class="term-tools"><button class="btn primary" type="button" data-a="run">Run</button><button class="btn" type="button" data-a="hint">Show a hint</button><button class="btn" type="button" data-a="reset">Reset code</button></div>
      <div class="cl-out term-out" style="height:auto" aria-live="polite"><span class="lbl">Output</span><span class="dim">Press Run to see what your code does.</span></div></div>`;
    const ta = CS.$('textarea', root), lines = CS.$('.cl-lines', root), out = CS.$('.cl-out', root), banner = CS.$('.term-step', root);
    const steps = cfg.steps || []; let step = 0;
    const syncLines = () => { const n = ta.value.split('\n').length; lines.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n'); };
    ta.value = cfg.starter || ''; syncLines();
    ta.addEventListener('input', syncLines);
    ta.addEventListener('scroll', () => { lines.scrollTop = ta.scrollTop; });
    ta.addEventListener('keydown', e => {
      if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText('  ', s, ta.selectionEnd, 'end'); syncLines(); }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); run(); }
    });
    const refresh = () => { renderMission(cfg.mission, steps, step); stepBanner(banner, steps, step, cfg.doneHTML); };
    const print = (html) => { out.innerHTML = `<span class="lbl">Output</span>${html}`; };
    const tutor = html => { out.insertAdjacentHTML('beforeend', `<span class="tutor"><b>Tutor:</b> ${html}</span>`); };
    function run() {
      const res = (cfg.run || CS.runJS)(ta.value);
      let html = '';
      if (res.logs && res.logs.length) html += res.logs.map(l => `<div>${CS.esc(l)}</div>`).join('');
      if (res.html) html += res.html;
      if (res.error) html += `<div class="r">${CS.esc(res.error)}</div>`;
      if (!html) html = '<span class="dim">(No output yet. Use console.log(...) to print something.)</span>';
      print(html);
      if (res.error && cfg.explainError) { const x = cfg.explainError(res.error); if (x) tutor(x); }
      let moved = false;
      while (step < steps.length && steps[step].check(res)) { step++; moved = true; }
      if (moved) {
        tutor(step < steps.length ? `Nice, that worked. Next: <b>${steps[step].t}</b>.` : (cfg.doneTutor || '<b>All steps done!</b>'));
        if (step === steps.length && cfg.part) CS.completePart(cfg.part);
      } else if (!res.error && step < steps.length && steps[step].nudge) { const n = steps[step].nudge(res); if (n) tutor(n); }
      refresh();
      return res;
    }
    CS.$('[data-a="run"]', root).addEventListener('click', run);
    CS.$('[data-a="hint"]', root).addEventListener('click', () => { const s = steps[step]; tutor(s ? (s.hint || s.how) : 'You finished every step. Try changing the code and running it again.'); });
    CS.$('[data-a="reset"]', root).addEventListener('click', () => { ta.value = cfg.starter || ''; syncLines(); });
    refresh();
    return { run, get step() { return step; }, textarea: ta };
  };

  /* ---------------- home page ---------------- */
  CS.home = root => {
    CS.chrome({ home: 'index.html', crumb: 'Computer science for people who build with AI' });
    const all = CS.progress.all();
    const complete = CS.COURSES.filter(c => all[c.id] && all[c.id].done).length;
    const lastId = CS.progress.last();
    const next = (lastId && !(all[lastId] || {}).done) ? CS.course(lastId) : CS.COURSES.find(c => !(all[c.id] && all[c.id].done)) || CS.COURSES[0];
    CS.$('#overallCount').textContent = `${complete} of ${CS.COURSES.length} courses complete`;
    CS.$('#overallMeter').style.width = `${(complete / CS.COURSES.length) * 100}%`;
    const lm = CS.$('#levelMeters');
    if (lm) lm.innerHTML = CS.LEVELS.map(l => {
      const cs = CS.COURSES.filter(c => c.level === l.n); const d = cs.filter(c => all[c.id] && all[c.id].done).length;
      return `<a class="lvl-meter" href="#level-${l.n}" style="--c:${l.color}"><span class="lvl-name"><i></i>${l.name}</span><span class="lvl-count">${d} of ${cs.length}</span><span class="meter"><i style="width:${d / cs.length * 100}%"></i></span></a>`;
    }).join('');
    const cont = CS.$('#continueBtn');
    cont.href = `lessons/${next.file}`;
    cont.textContent = (lastId && !(all[lastId] || {}).done) ? `Continue ${next.id}: ${next.short}` : (complete ? `Next: ${next.id} ${next.short}` : 'Start with 101');
    root.innerHTML = CS.LEVELS.map(l => {
      const cs = CS.COURSES.filter(c => c.level === l.n);
      const groups = [];
      cs.forEach(c => { const g = groups.find(x => x.name === c.group); if (g) g.list.push(c); else groups.push({ name: c.group, list: [c] }); });
      return `<section class="level" id="level-${l.n}"><div class="level-head" style="--c:${l.color}"><span class="dot"></span><h2>${l.name}</h2><span class="muted">${l.sub}</span></div>
      ${groups.map(g => `${g.name ? `<h3 class="group-title">${CS.esc(g.name)}</h3>` : ''}<div class="course-grid${g.list.length === 4 ? ' n4' : ''}">${g.list.map(c => {
        const r = all[c.id]; const st = CS.progress.status(c.id);
        const label = st === 'complete' ? 'Complete' : st === 'progress' ? `${r.parts.length} of ${r.total} parts` : 'Not started';
        return `<a class="course glass" href="lessons/${c.file}"><span class="num"><span>Course ${c.id}</span><span class="status ${st}">${label}</span></span><h3>${CS.esc(c.title)}</h3><p>${CS.esc(c.blurb)}</p><span class="meta"><span>${c.minutes} minutes · 5 parts</span></span></a>`;
      }).join('')}</div>`).join('')}</section>`;
    }).join('');
  };
})();
