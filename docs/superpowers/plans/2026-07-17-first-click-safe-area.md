# First-Click Safe Area Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the first random reveal protect the clicked cell and its neighbors whenever the configured mine density allows it.

**Architecture:** Keep the feature entirely inside the pure game engine by changing the candidate indexes used by lazy random mine placement. Reuse the existing neighbor calculation, fall back to protecting only the clicked cell for ultra-dense custom boards, and leave fixed mine positions and browser event handling unchanged.

**Tech Stack:** JavaScript ES modules, Node.js built-in `node:test`, static HTML/CSS frontend.

---

## File Structure

- Modify `tests/game.test.mjs` to define center, corner, dense-board fallback, and fixed-mine expectations.
- Modify `src/game.mjs` to exclude the first cell's neighborhood from random mine candidates when capacity permits.
- Modify `README.md` to document the first-click safe-area behavior and dense-board fallback.

### Task 1: Define first-click safety behavior with tests

**Files:**
- Modify: `tests/game.test.mjs`
- Test: `tests/game.test.mjs`

- [ ] **Step 1: Replace the existing first-click test and add center, corner, and fixed-mine cases**

Use the following tests in `tests/game.test.mjs`:

```js
test('keeps the clicked cell and its neighbors safe on the first random reveal', () => {
  const game = createGame(
    { rows: 5, cols: 5, mines: 5 },
    { random: () => 0.5 },
  );

  revealCell(game, 12);

  const protectedIndexes = [6, 7, 8, 11, 12, 13, 16, 17, 18];
  assert.equal(
    protectedIndexes.every((index) => !game.cells[index].isMine),
    true,
  );
});

test('keeps the valid neighboring cells safe when the first reveal is a corner', () => {
  const game = createGame(
    { rows: 4, cols: 4, mines: 3 },
    { random: () => 0 },
  );

  revealCell(game, 0);

  const protectedIndexes = [0, 1, 4, 5];
  assert.equal(
    protectedIndexes.every((index) => !game.cells[index].isMine),
    true,
  );
});

test('falls back to protecting only the clicked cell on an ultra-dense board', () => {
  const game = createGame(
    { rows: 2, cols: 2, mines: 3 },
    { random: () => 0 },
  );

  revealCell(game, 0);

  assert.equal(game.cells[0].isMine, false);
  assert.equal(game.cells.filter((cell) => cell.isMine).length, 3);
  assert.equal(game.status, 'won');
});

test('does not apply the random safe area to fixed mine positions', () => {
  const game = createGame(
    { rows: 3, cols: 3, mines: 1 },
    { minePositions: [1] },
  );

  revealCell(game, 0);

  assert.equal(game.cells[1].isMine, true);
  assert.equal(game.cells[0].adjacentMines, 1);
  assert.equal(game.status, 'active');
});
```

- [ ] **Step 2: Run the focused test file and verify the new safety tests fail**

Run: `node --test tests/game.test.mjs`

Expected: the center and corner safety tests fail because current random placement excludes only the clicked cell; the dense-board and fixed-mine tests continue to pass.

- [ ] **Step 3: Commit the failing behavior specification**

```powershell
git add tests/game.test.mjs
git commit -m "test: define first-click safe area"
```

### Task 2: Implement adaptive random-mine protection

**Files:**
- Modify: `src/game.mjs`
- Test: `tests/game.test.mjs`

- [ ] **Step 1: Update `placeRandomMines` to prefer the complete neighborhood**

Replace the current candidate construction at the start of `placeRandomMines` with:

```js
function placeRandomMines(game, safeIndex) {
  const protectedIndexes = new Set([
    safeIndex,
    ...getNeighborIndexes(game, safeIndex),
  ]);
  let available = game.cells
    .map((cell) => cell.index)
    .filter((index) => !protectedIndexes.has(index));

  if (available.length < game.mines) {
    available = game.cells
      .map((cell) => cell.index)
      .filter((index) => index !== safeIndex);
  }

  for (let placed = 0; placed < game.mines; placed += 1) {
    const nextIndex = Math.floor(game.random() * available.length);
    const [mineIndex] = available.splice(nextIndex, 1);
    game.cells[mineIndex].isMine = true;
  }

  game.minesPlaced = true;
  updateAdjacentCounts(game);
}
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`

Expected: all existing and new tests pass with zero failures.

- [ ] **Step 3: Commit the implementation**

```powershell
git add src/game.mjs
git commit -m "feat: protect first-click safe area"
```

### Task 3: Document and verify the user-visible behavior

**Files:**
- Modify: `README.md`
- Test: `tests/game.test.mjs`

- [ ] **Step 1: Add the safety rule to the README feature list**

Add this bullet after the difficulty list:

```markdown
- 首次点击优先保证点击格及相邻区域无雷；极端高密度棋盘至少保证点击格安全
```

- [ ] **Step 2: Run automated verification**

Run: `npm test`

Expected: all tests pass with zero failures.

- [ ] **Step 3: Start the static server and verify the page responds**

Run: `npm start`

Expected: the static server listens on `http://localhost:5173` and `index.html` loads without console errors. Manually start games at multiple difficulties and confirm the first click opens a safe starting region while restart, difficulty selection, flagging, and terminal states remain functional.

- [ ] **Step 4: Check formatting and scope**

Run: `git diff --check`

Expected: no whitespace errors.

Run: `git status --short`

Expected: only `README.md` is uncommitted at this step.

- [ ] **Step 5: Commit the documentation**

```powershell
git add README.md
git commit -m "docs: explain first-click safety"
```

### Task 4: Final branch verification and publication

**Files:**
- Verify: `docs/superpowers/specs/2026-07-17-first-click-safe-area-design.md`
- Verify: `docs/superpowers/plans/2026-07-17-first-click-safe-area.md`
- Verify: `tests/game.test.mjs`
- Verify: `src/game.mjs`
- Verify: `README.md`

- [ ] **Step 1: Run the complete verification suite from a clean worktree**

Run: `npm test`

Expected: all tests pass with zero failures.

Run: `git diff --check main...HEAD`

Expected: no whitespace errors.

Run: `git status -sb`

Expected: the branch is clean.

- [ ] **Step 2: Push the feature branch**

```powershell
git push -u origin codex/first-click-safe-area
```

- [ ] **Step 3: Open a draft pull request**

Create a Draft PR from `codex/first-click-safe-area` into `main` titled `[codex] protect the first-click safe area`. The body must summarize the adaptive 3×3 protection, the ultra-dense fallback, user impact, and the automated and manual checks performed.
