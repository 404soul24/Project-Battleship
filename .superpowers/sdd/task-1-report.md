# Task 1: Webpack and Build Setup

## What I implemented

- Installed webpack, webpack-cli, webpack-dev-server, html-webpack-plugin, css-loader, style-loader as devDependencies
- Created `webpack.config.cjs` (used `.cjs` extension because `package.json` has `"type": "module"` — a `.js` file with `require()` would fail in ESM mode)
- Created `src/template.html` with standard HTML5 boilerplate and `<div id="app">` mount point
- Added `"build": "webpack"` and `"dev": "webpack serve --open"` scripts to `package.json`

## Test results

```
Test Suites: 3 passed, 3 total
Tests:       12 passed, 12 total
```

All existing Jest tests pass after adding webpack dependencies.

## Files changed

- `package.json` — added build/dev scripts, webpack devDependencies
- `package-lock.json` — updated with new dependencies
- `webpack.config.cjs` — new file, webpack configuration
- `src/template.html` — new file, HTML template for HtmlWebpackPlugin

## Build verification

`npm run build` succeeded, generating `dist/bundle.js` and `dist/index.html`.

## Issues / concerns

None.
