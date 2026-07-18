# Task 2: Gameboard Logic Fixes

## Status: DONE

## Changes Made

### `src/components/Gameboard.js`
- Added `attackedCells` Set to constructor
- `placeShip`: boundary checking (rejects ships extending beyond 10x10), overlap checking (rejects cells already occupied), returns `boolean`
- `receiveAttack`: returns `'hit'` | `'miss'` | `'duplicate'`
- `allShipsSunk`: added guard for empty ships array

### `src/tests/Gameboard.test.js`
Added 5 new test cases:
- rejects out-of-bounds ship placement
- rejects overlapping ship placement
- rejects duplicate attack
- receiveAttack returns 'hit' when ship is hit
- receiveAttack returns 'miss' when no ship

## Test Results
- **17/17 tests passing** (all existing + new)
- All 3 test suites pass

## Commits
- `e16a87a` - fix: add boundary checks, duplicate attack prevention, and return values to Gameboard

## Concerns
- `dist/bundle.js` and `dist/index.html` were included in the commit (pre-existing build artifacts, not part of this task)
