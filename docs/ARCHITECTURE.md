# Architecture notes (showcase)

This document describes the **frontend layering** only. It does not document proprietary data sourcing or production pipelines.

## Layers

1. **Entry** — [`web/src/main.js`](../web/src/main.js) loads Tailwind-compiled CSS and starts [`bootstrapApp()`](../web/src/app/bootstrap.js).
2. **State** — [`web/src/state/appState.js`](../web/src/state/appState.js) holds route, status, selection, and UI flags. Mutations go through exported setters / `updateState` so the UI stays consistent with a single subscription-driven render.
3. **Orchestration** — [`web/src/app/bootstrap.js`](../web/src/app/bootstrap.js) wires loaders, handlers, and the render function; it coordinates views and services without embedding HTML strings for user-controlled text.
4. **Views** — [`web/src/views/`](../web/src/views/) isolate DOM queries and visibility for input, result, and share steps.
5. **Services** — [`web/src/services/filmService.js`](../web/src/services/filmService.js) loads `daily_classics.json` and resolves films by date.

## Data

The showcase ships a **small sample** JSON under `web/public/`. The production application uses a larger dataset produced outside this repository.
