# Saolei Static Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playable static Minesweeper web game in the `ARIUM-hub/saolei` repository.

**Architecture:** Keep game state in a pure JavaScript module so core behavior can be tested with Node's built-in test runner. Keep DOM rendering in a thin browser module and style the app as a small, responsive single-screen game.

**Tech Stack:** HTML, CSS, JavaScript ES modules, Node built-in `node:test`, Python static server for local preview.

---

## File Structure

- Create `package.json` for `npm test` and a simple `npm start` command.
- Create `index.html` for the browser entry point.
- Create `styles.css` for layout, responsive board sizing, focus states, and game states.
- Create `src/game.mjs` for pure Minesweeper state and actions.
- Create `src/main.mjs` for DOM rendering and event handling.
- Create `tests/game.test.mjs` for core game behavior.
- Create `README.md` with run and deploy instructions.
- Preserve existing `代码.txt`.

### Task 1: Core Game Tests

**Files:**
- Create: `tests/game.test.mjs`
- Create: `package.json`

- [ ] **Step 1: Write failing tests**

Create tests for board dimensions, safe first reveal, flagging, losing on a mine, and winning after all safe cells are revealed.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because `src/game.mjs` does not exist yet.

### Task 2: Game Engine

**Files:**
- Create: `src/game.mjs`

- [ ] **Step 1: Implement game state**

Create a pure module with `createGame`, `revealCell`, `toggleFlag`, `getRemainingMines`, and `DIFFICULTIES`.

- [ ] **Step 2: Run tests**

Run: `npm test`
Expected: PASS.

### Task 3: Browser UI

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `src/main.mjs`

- [ ] **Step 1: Build the static page**

Create the single-screen app with difficulty selector, timer, mine counter, restart button, status text, and board region.

- [ ] **Step 2: Connect DOM events**

Left click reveals cells. Right click toggles flags. Restart resets game and timer.

- [ ] **Step 3: Run tests again**

Run: `npm test`
Expected: PASS.

### Task 4: Documentation and Manual Verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Document usage**

Document `npm test`, `npm start`, and GitHub Pages deployment.

- [ ] **Step 2: Start a static server**

Run: `python -m http.server 5173`
Expected: local preview available at `http://localhost:5173`.

- [ ] **Step 3: Verify the app loads**

Fetch `http://localhost:5173` and confirm it returns the HTML page.

- [ ] **Step 4: Check git status**

Run: `git status --short`
Expected: only intentional new files plus preserved existing files.
