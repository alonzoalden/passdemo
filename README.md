# Pass Demo

An Angular starter for a password-storage interview demo. It includes a responsive vault, search, Work/Personal filters, an add-entry form with validation, password reveal/hide, and deletion.

## Run locally

```sh
npm ci
npm start
```

Open http://localhost:4200. Node.js 24.18.0 and npm 11.16.0 were used for setup; `.nvmrc` records the Node version.

```sh
npm run build        # Production output: dist/pass-demo/browser
npm test -- --watch=false
npm run format
npm run format:check
```

## Angular version

Angular framework/compiler packages are pinned to **22.1.7**, CLI/build packages to **22.1.8**, and NgRx Signals to **22.0.1**. These stable releases were verified on npm on September 18, 2026. Vitest **4.1.11** satisfies the stable Angular build tooling's peer requirement; Node.js 24.18.0, TypeScript 6.0.3, and RxJS 7.8.2 remain compatible.

The project originally used Angular 22.2.0-rc.0. As approved for the NgRx migration, it now uses stable Angular 22.1 because NgRx's `^22.0.0` peer range excludes that prerelease. Dependencies are resolved without peer overrides or force flags. Commit `package-lock.json` to retain reproducible installs.

## Where to extend the app

- `src/app/core/models/vault-entry.ts`: typed entry and category models.
- `src/app/features/vault/data-access/vault-store.ts`: NgRx SignalStore, sample data, and add/remove operations. Introduce a data-access service alongside it when adding a backend.
- `src/app/features/vault/`: standalone vault screen, reactive form, search, and category filtering.
- `src/app/app.routes.ts`: lazy-loaded route and fallback, ready for additional screens.
- `src/styles.scss`: shared styles; `vault.scss`: screen-specific styles.

The scaffold uses strict TypeScript, standalone components, Angular signals, reactive forms, SCSS, routing, and the CLI's Vitest test setup.

## State management

The project standard in `AGENTS.md` is NgRx SignalStore (`@ngrx/signals`) for new shared feature/domain state and complex feature workflows. Simple view state stays in component-local Angular signals, with `computed` for derived values. Scope stores to their required lifetime rather than making all state global.

`VaultStore` uses `signalStore`, a typed `withState` factory, and `withMethods` with immutable `patchState` updates. Its state is protected from external updates; components read `entries()` and call `add()` or `remove()`. A fresh application instance receives its own sample data. Root provision deliberately preserves the existing vault lifetime across component recreation and navigation, until refresh. Search, category selection, form state, and password visibility remain local to the vault component.

This state-management choice does not add backend persistence or password encryption. Lint and automated end-to-end targets are not configured; unit/component tests, formatting, and production builds have repeatable commands above. Browser journeys are checked separately.

## Demo scope

All credentials are fictional. Entries exist only in application memory and reset on page refresh. There is no authentication, encryption, backend, or persistent storage; do not enter real passwords. Masking a password on screen is a display feature, not encryption. No credentials are written to localStorage or sent to a server.

## Possible live-demo additions

Choose one small feature at a time: edit an entry, generate a sample password, add favorites, or add sorting. Authentication and encrypted persistence are separate future work before this could store real credentials.
