# Task 5 Report: Game Entry Point

## Status
- Completed: `src/index.js` rewritten as game state machine (placement → battle → gameover)
- Completed: `src/components/Player.js` updated — fixed import path, added `placeShipsRandomly()`
- Game loop: ship placement click → computer auto-place → battle clicks → computer response (600ms delay) → win/loss detection
- Orientation toggle, restart (clear placement / full re-init), status messages

## Commits
- `865522f` feat: add game state machine and ship placement

## Test Summary
- 3 suites, 17 tests: all passed (no regressions)

## Build
- Webpack build: successful (bundle.js + index.html emitted)

## Files Modified
- `src/index.js` — 103 lines (complete rewrite)
- `src/components/Player.js` — 42 lines (import fix + placeShipsRandomly)
