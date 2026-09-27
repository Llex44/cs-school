# CS School

A free, interactive course in the computer science and software engineering ideas you need to build with AI tools and steer the AI.

- **Intro (101 to 103):** how computers, code and AI coding tools work.
- **Core (201 to 214):** systems thinking, app architecture, Git, dependencies, databases, APIs, security, testing, shipping, and UX design, ending in a capstone.
- **Theory electives (301 to 306):** logic, algorithms, data structures, probability, embeddings and neural networks, taught visually.

Every course follows the same loop: a real problem, an interactive toy, a hands-on exercise, "Steer the AI" scenarios, and a quick check. Progress is saved in the browser.

## Run it

It's a static site with no build step. Open `index.html`, or serve the folder:

```
npx http-server .
```

To publish with GitHub Pages: repository Settings → Pages → Build and deployment → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.

## Structure

- `index.html`: the course catalog with overall progress.
- `lessons/`: one self-contained HTML page per course.
- `assets/cs-school.css`: the shared design system (frosted glass over a soft drifting color field).
- `assets/cs-school.js`: shared runtime (course list, progress, top bar, task lists, practice terminal, code lab, Steer the AI, quizzes).
- `LESSON_GUIDE.md`: how to write a lesson, including the style rules.
- `tests/check.js`: smoke test for every page at desktop and phone widths in light and dark mode (`node tests/check.js`).
