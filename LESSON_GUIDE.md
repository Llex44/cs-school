# CS School lesson guide

How to build a lesson for CS School. Every lesson must feel like it was made by the same careful hand as `lessons/203-git.html`, which is the reference lesson. **Open it and study it before you write anything.**

## Who the lessons are for

- People who build software by directing AI tools (Claude, Cursor, Copilot, Lovable and the like). Some have never coded, some code a little.
- The promise: you won't become a programmer, you'll become a sharp *director* of software. Every lesson answers "what choice is the AI making here, and how do I steer it?"
- Plain language first. Every technical word is explained the first time it appears. Deeper detail for light coders goes in optional `details.deeper` panels titled "Under the hood: …".

## The lesson loop (always 5 parts)

| Part | id | What it is |
|---|---|---|
| Hero | – | Kicker, h1 (a memorable one-sentence idea, not the course title), lede, facts list, "Start the lesson" button, and an **animated, generated visual** on the right. |
| 1 | `p1` | **Hook + play.** A short chat between the learner and an AI (`.chat`) showing a real moment, then a task list, then an interactive toy the learner pokes at. Explanation comes right after they have felt it. |
| 2 | `p2` | **Go deeper.** A second concept with its own task list and interactive. Explain with pictures, tables, or small visual models. |
| 3 | `p3` | **Try it.** A small, easy hands-on exercise: the practice terminal (`CS.terminal`), the code lab (`CS.codeLab`), or a custom simulation. A mission list comes first. |
| 4 | `p4` | **Steer the AI.** Four scenarios. Each shows something an AI said or proposed and three possible replies; exactly one is best. Every option has a one-sentence explanation. |
| 5 | `p5` | **Check.** Five quiz questions with explanations, then the done card. |
| After | – | A "Cheat sheet" table or a "Key terms" list (`dl.terms`) summarising the lesson. |

Each part is completed by the learner doing things, never by scrolling. Part 1 and 2 complete when every item of their task list is ticked (`CS.tick`). Part 3 completes when the mission is done. Parts 4 and 5 complete through `CS.steer` and `CS.quiz`.

About 15 minutes per lesson. Aim for depth and craft over volume: two excellent interactives beat five shallow ones.

## Hard style rules (from Alex, the product owner)

These are not suggestions. Breaking them means the lesson gets rejected.

1. **Never use colored accent borders or accent lines**, vertical or horizontal: no left-edge stripes on notes or cards, no colored top bars on cards, no colored rules beside sections. Alex calls them "AI generic slop". Use tinted backgrounds, dots, or glass instead.
2. **No cards with hard, high-contrast outlines.** Cards are frosted glass (`.glass`) floating over the soft drifting background: translucent fill, blur, soft shadow, faint white edge.
3. **Subheaders must look like titles.** A small bold label floating in empty space is not enough. Put a control group in its own glass card with a real title (`.ctl` + `.ctl-title`), or use a proper `h3`.
4. **Tasks come before the thing you act on, at every screen width.** On phones the mission/task list must appear above the terminal, toy or buttons. Use the `.pg` / `.pg-col` / `.oN` reorder pattern or the `.lab` grid, both of which already handle this.
5. **Legible.** Body text is 18px Atkinson Hyperlegible. Don't shrink text below `.9rem`. Keep contrast high in both light and dark mode.
6. **Not generic.** No emoji as icons, no stock "feature card" grids with icons, no gradient text, no purple-to-blue gradient blobs as decoration, no rotated badges, no dotted-grid backgrounds, no chunky offset shadows. Visuals are drawn with SVG or canvas in code, sleek and specific to the concept, using thin smooth lines, small solid dots, glass pills, and the five palette colors.
7. **No train, metro, transit or station-stop visuals.** Alex rejected that motif.
8. **Playful and bright**, like Brilliant or Duolingo: things animate when you act, feedback is immediate and friendly, there is confetti when you finish. But keep motion purposeful and respect `prefers-reduced-motion` (`CS.reduce`).

## Writing style

- Short sentences. Active voice. Talk to the learner as "you".
- No em-dashes in lesson copy. Use a period, comma, or colon.
- Concrete over abstract: a lemonade stand, a bakery's order app, a bookshop, a recipe site. Give each lesson one running example and stick with it.
- Every feedback message says what happened and why, never just "Correct!".
- Wrong-answer feedback is kind and teaches. The learner can retry in Steer the AI.
- Don't claim things you are not sure are true. Keep technical facts accurate.

## Files

- Your lesson is one self-contained HTML file: `lessons/<id>-<slug>.html`. The id and slug are fixed in `CS.COURSES` in `assets/cs-school.js` (for example `lessons/204-libraries-and-dependencies.html`).
- **Do not edit** `assets/cs-school.css`, `assets/cs-school.js`, `index.html` or other lessons. Put lesson-specific CSS in the page's own `<style>` and lesson-specific JS in the page's own `<script>`. If you believe the shared files need a change, say so in your final report instead.
- No external libraries, no images from the web. Everything is generated with HTML, CSS, SVG, canvas and vanilla JS.

## Page skeleton

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Libraries &amp; dependencies · CS School</title>
<meta name="description" content="One sentence about the course.">
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/cs-school.css">
<style>
/* lesson-specific styles only */
</style>
</head>
<body>
<main id="top">
  <section class="wrap hero">
    <div>
      <div class="kicker">Core curriculum · Course 204 · Libraries &amp; dependencies</div>
      <h1>Every app is built on other people's code.</h1>
      <p class="lede">…</p>
      <ul class="facts"><li>About 15 minutes</li><li>5 parts</li><li>Code lab</li><li>No coding experience needed</li></ul>
      <div class="row hero-cta"><a class="btn primary" href="#p1">Start the lesson</a></div>
    </div>
    <figure style="margin:0">
      <div class="hero-visual glass"><svg id="heroArt" role="img" aria-label="…"></svg><div class="legend">…</div></div>
      <div class="hero-caption glass" aria-hidden="true"><span>$</span><span id="heroCap">npm install</span></div>  <!-- optional -->
    </figure>
  </section>

  <div class="wrap">
    <section class="part" id="p1">
      <span class="bullet glass" data-p="p1">1</span>
      <div class="part-head">
        <div class="kicker">Part 1 of 5</div>
        <h2>Part title</h2>
        <p>One or two sentences introducing the idea.</p>
      </div>
      <div class="chat" aria-label="Example conversation">
        <div class="msg ai"><span class="who">AI assistant</span>…</div>
        <div class="msg me"><span class="who">You</span>…</div>
      </div>
      <div class="task glass" data-part="p1">
        <h3>Your task</h3>
        <ol>
          <li data-t="first"><span>Do the first thing.</span></li>
          <li data-t="second"><span>Do the second thing.</span></li>
        </ol>
      </div>
      <!-- the interactive, using .pg/.pg-col/.oN if it has two columns -->
      <!-- explanation, "Under the hood" panel -->
    </section>

    <section class="part" id="p2"> … </section>

    <section class="part" id="p3">
      <span class="bullet glass" data-p="p3">3</span>
      <div class="part-head">…</div>
      <div class="lab">
        <div class="a-mission ctl glass"><h3 class="ctl-title">Your mission</h3><p class="ctl-sub" style="margin-top:0">…</p><ol id="mission"></ol></div>
        <div class="a-work" id="lab"></div>
        <div class="a-side">…optional side panel…</div>
        <div class="a-extra">…optional…</div>
      </div>
    </section>

    <section class="part" id="p4">
      <span class="bullet glass" data-p="p4">4</span>
      <div class="part-head"><div class="kicker">Part 4 of 5</div><h2>Steer the AI</h2><p>…</p></div>
      <p class="counter" id="steerCount"></p>
      <div id="steer"></div>
    </section>

    <section class="part" id="p5">
      <span class="bullet glass" data-p="p5">5</span>
      <div class="part-head"><div class="kicker">Part 5 of 5</div><h2>Check your understanding</h2><p>Five quick questions. Each answer explains itself.</p></div>
      <div id="quiz"></div>
      <div id="doneCard" aria-live="polite"></div>
    </section>
  </div>

  <section class="after">
    <div class="wrap stack">
      <h2>Cheat sheet</h2>
      <div class="table-wrap glass"><table>…</table></div>
      <!-- or: <dl class="terms"><div class="glass"><dt>Term</dt><dd>Meaning</dd></div>…</dl> -->
    </div>
  </section>
</main>
<script src="../assets/cs-school.js"></script>
<script>
(() => {
const { $, $$, esc, reduce } = CS;
CS.lesson({ id: '204', parts: [
  { id: 'p1', title: 'Short title' }, { id: 'p2', title: 'Short title' }, { id: 'p3', title: 'Try it' },
  { id: 'p4', title: 'Steer the AI' }, { id: 'p5', title: 'Check' }
] });
// … lesson code …
})();
</script>
</body>
</html>
```

`CS.lesson` adds the drifting background, the top bar with the 5-part progress bar, and the previous/next footer. Don't add those yourself.

Kickers: Intro lessons use "Intro · Course 10x · Title", Core uses "Core curriculum · Course 2xx · Title", electives use "Theory elective · Course 30x · Title".

## Shared CSS you can use (`assets/cs-school.css`)

Layout: `.wrap`, `.stack`, `.row`, `.split` (2 columns), `.cards` (2 columns), `.cards-3`, `.pg` + `.pg-col` + `.o1`…`.o9` (two columns on desktop that dissolve into one ordered column on phones), `.lab` with `.a-mission`, `.a-work`, `.a-side`, `.a-extra`.

Surfaces: `.glass` (frosted card, add your own `border-radius`, usually 16 to 20px), `.glass-strong`, `.ctl` + `.ctl-title` + `.ctl-sub` (a titled control card: use with `.glass`).

Text: `.kicker`, `.label`, `.muted`, `.small`, `h1`–`h3`, `.lede` (in hero), `code`, `kbd`.

Controls: `.btn`, `.btn.primary`, `.btn.danger`, `.btn.on`, `.input`, `.select`, `.range` (sliders), `.seg-control` (a segmented toggle: buttons with `aria-pressed`), `.chip` with `style="--c:var(--l2)"` and an inner `<i></i>` dot.

Feedback: `.note` (amber tip), `.note.good`, `.note.bad`, `.note.info`. They are tinted, never bordered. `details.deeper.glass` with `<summary>Under the hood: … <small>optional</small></summary><div>…</div>`.

Code display: `.code` (dark block; spans `.c` comment, `.k` keyword, `.s` string, `.n` number, `.f` function, `.r` removed, `.hl` highlight).

Other: `.chat` with `.msg.ai` / `.msg.me`, `.task`, `.table-wrap` + `table`, `dl.terms`, `.legend`, `.hero-visual`, `.hero-caption`.

Colors (CSS variables, light and dark versions are automatic): `--ink`, `--ink-2`, `--paper`, `--panel`, `--panel-2`, `--hair`, `--glass`, `--glass-strong`, `--l1` red, `--l2` blue, `--l3` teal, `--l4` amber, `--l5` violet, `--good`/`--good-bg`, `--bad`/`--bad-bg`, `--tip`/`--tip-bg`, `--term` (dark terminal background). **Always use variables, never hard-coded colors that break in dark mode.** Test both modes. The only exception is inside a mock "device" or mock website preview that is meant to look like a specific page.

Fonts: `var(--f-display)` Overpass for titles and labels, `var(--f-body)` Atkinson Hyperlegible, `var(--f-mono)` Overpass Mono.

Breakpoints: 900px (tablet, most grids collapse to one column) and 640px (phone).

## Shared JS you can use (`assets/cs-school.js`)

```js
CS.lesson({ id, parts, onComplete })     // call once, first
CS.tick('p1', 'key')                      // ticks <li data-t="key"> in .task[data-part="p1"]; completes the part when all are ticked
CS.ticked('p1', 'key')                    // is it ticked?
CS.completePart('p3')                     // complete a part directly
CS.say(el, '<strong>Nice.</strong> Because…', 'good' | 'bad' | 'info' | '')   // turn an element into a feedback note
CS.toast('text')   CS.confetti()
CS.$  CS.$$  CS.esc  CS.reduce  CS.hex(n)  CS.tokenize(line)  CS.lev(a, b)   CS.PALETTE (hex colors for canvas)

CS.steer(el, [ { who: 'AI assistant', ai: 'What the AI said', opts: [[replyText, isBest 0|1, why], …3 options] } ×4 ],
         { part: 'p4', counter: $('#steerCount') })

CS.quiz(el, [ { q, a: [[text, isRight 0|1], …], why } ×5 ],
        { part: 'p5', doneCard: $('#doneCard'), doneTitle: 'Short line.', doneText: 'What you can now do.' })

CS.terminal(el, {                        // a fake shell with a mission list, hints, history (↑/↓), "type it for me"
  part: 'p3', mission: $('#mission'),
  prompt: () => '~/shop $',
  intro: 'Shown first (html)',
  steps: [ { t: 'Step title', how: 'One-line instruction', cmd: 'the command' | () => 'cmd', done: action => bool } ],
  run: (argv, line, io, api) => action | null | undefined,   // your command handler. Return an object describing what happened
                                                              // (it is passed to steps[i].done), null if handled with nothing to report,
                                                              // or undefined for "command not found". io.print(html, 'g'|'r'|'y'|'b'|'dim'), io.tutor(html), io.ai(html)
  onStep: (index, action, api) => {},
  doneHTML: 'banner when the mission is finished', doneTutor: 'tutor message when finished'
})

CS.codeLab(el, {                         // a small code editor with Run, hints and a checked mission
  part: 'p3', mission: $('#mission'), language: 'JavaScript', starter: 'code…',
  steps: [ { t, how, hint, check: result => bool, nudge: result => 'optional tutor html when not yet passing' } ],
  run: code => result,                  // optional: default CS.runJS(code) runs JavaScript and returns { code, logs, error, value }
  explainError: err => 'optional friendly explanation of an error message',
  doneTutor: 'html'
})
```

A custom `run` for `CS.codeLab` can interpret something other than JavaScript (for example a tiny SQL subset, a JSON object, or a prompt) and return `{ logs: [...], html: '…', error }`. Keep exercises small and forgiving: accept reasonable variations, and use `nudge` to explain what's still missing.

## Pedagogy checklist

- The hook names a moment the learner will actually meet when building with AI.
- The learner acts before being told. Explanations follow the interaction.
- Each interactive has a clear goal (the task list) and reacts visibly to every action.
- Mistakes are safe and instructive. Show what went wrong, then how to recover.
- Link concepts to what AI tools actually say and do ("When the AI says '…', it means …").
- Steer the AI scenarios are realistic, specific, and teach judgment: the wrong options are tempting, not silly.
- Quiz questions test understanding and application, not trivia.
- The cheat sheet / key terms is something a learner would screenshot.

## Accessibility

- Every interactive is usable with a keyboard (real `<button>`s, labelled inputs).
- SVGs that carry meaning have `role="img"` and an `aria-label`. Decorative ones have `aria-hidden="true"`.
- Feedback regions use `aria-live="polite"`.
- Touch targets at least 44px tall.
- Respect reduced motion: `if (CS.reduce)` skip or shorten animations.

## Testing

Run from the repo root:

```
node tests/check.js lessons/204-libraries-and-dependencies.html
```

It checks desktop and phone widths in light and dark mode for JavaScript errors, sideways scrolling, the lesson skeleton, and thick accent borders, and saves screenshots to `tests/shots/`. **Look at the screenshots** (desktop and phone, light and dark) and fix anything ugly, cramped, overlapping or illegible.

Also write a quick Playwright walkthrough in a scratch folder (not in the repo) that completes every part of your lesson by clicking and typing like a learner, and confirm `#stopsCount` reads "5 of 5" at the end with no page errors. Playwright is installed globally: `require('/opt/node22/lib/node_modules/playwright')`, launch with `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`. Google Fonts fail to load in the sandbox; that's expected.
