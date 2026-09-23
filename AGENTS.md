# Pass Demo agent instructions

Build this standalone Angular application with small, maintainable changes.
Keep the existing Angular CLI setup, npm package manager, directory structure,
and installed dependency versions. Do not introduce Nx, new state frameworks,
SSR, PWA infrastructure, or heavy dependencies without an explicit requirement.

## Before editing

- Read `README.md`, `package.json`, `package-lock.json`, `angular.json`, and the
  affected source and tests. Check for nested `AGENTS.md` or override files.
- Confirm the actual project name, scripts, test runner, and configured targets;
  do not assume that a display name implies a CLI target.
- Inspect the owning implementation, its consumers, and a nearby test before
  changing behavior. Stop exploring once ownership, constraints, and a focused
  validation check are clear.
- Check `git status` and preserve unrelated user changes. Never reset, checkout,
  commit, push, merge, deploy, or publish unless explicitly authorized.

For a low-risk local change, implement after this inspection. For a feature that
crosses components, routes, stores, or contracts, state a short plan and run
focused plus affected checks. Pause for approval before dependency changes,
security or authentication work, persistence, migrations, infrastructure,
destructive actions, or an unclear architecture/ownership decision.

## Architecture and Angular

- Keep bootstrap, providers, routes, and layout composition thin. Put feature
  behavior under the relevant feature folder; keep data access separate from UI.
- Use standalone components, functional providers, strict TypeScript, typed
  forms, signals, and Angular built-in control flow where supported by the
  installed version. Preserve existing compatible patterns outside the task.
- Prefer `inject`, readonly references, signal inputs/outputs, `computed`, and
  native HTML controls. Avoid `any`, unsafe casts, non-null assertions, and
  class lifecycle hooks in new application code unless an integration requires
  them and the exception is documented.
- Track repeated domain data by stable identity. Keep derived values in
  `computed`, update signal-held arrays and objects immutably, and use effects
  only for imperative synchronization. Use render callbacks and `DestroyRef`
  for DOM work and cleanup where needed.
- Keep browser code independent of server-only code. Map transport data at the
  data-access boundary and validate untrusted payloads when correctness or
  security depends on their shape.
- Lazy-load routed feature screens where the existing route structure supports
  it. Resolve only essential route-blocking data.

## State and security

`VaultStore` uses NgRx SignalStore (`@ngrx/signals`) and is provided at the
application root so the demo vault survives component recreation and navigation
until refresh. Keep shared feature state in that store, expose readonly state,
and change it through named methods with immutable updates. Keep search,
category selection, form state, and password visibility local to the component.
Do not migrate unrelated state or add classic NgRx Store/Effects without a
specific requirement.

SignalStore does not provide authentication, encryption, or persistence. Keep
passwords out of browser persistence, logs, fixtures, and state-inspection
tools. Use synthetic credentials only; masking a password is a display feature,
not encryption. Client guards and validation do not replace server authorization.
Never place secrets, tokens, real personal data, or private network details in
the repository or browser bundle.

## UI and accessibility

- Use semantic elements and accessible names, keyboard operation, visible focus,
  sufficient contrast, associated errors, and synchronized ARIA state.
- Represent loading, empty, error, retry, and stale states when applicable.
  Preserve user input after recoverable failures and prevent duplicate submits.
- Keep components focused and styles scoped to the component where practical.
  Check desktop and mobile layouts for changed user journeys and respect reduced
  motion. Do not add custom accessibility infrastructure when native controls
  already provide it.

## Validation

Use the local npm scripts and configured Angular CLI targets. For executable
changes, run the narrowest relevant test first, then the affected production
build and formatting checks. The current repeatable checks are:

```text
npm test -- --watch=false
npm run build
npm run format:check
```

The project has unit/component tests, formatting, and a production build. It
does not currently configure lint or end-to-end/browser-test targets; report
those checks as unavailable rather than inventing commands. Exercise changed
browser journeys manually when useful, including console errors, responsive
layout, keyboard focus, and loading/empty/error behavior.

When a check fails, diagnose it, make the smallest task-related repair, and
rerun that check. Do not disable checks, weaken assertions, loosen compiler
settings, suppress diagnostics, or increase timeouts to obtain a pass. Review
the final diff, including untracked files, for unrelated edits and sensitive
content. Report passed, failed, blocked, and not-run checks accurately.

## Documentation and style

- Keep `README.md` accurate when setup, commands, or product scope changes.
- Use kebab-case filenames and the existing suffix conventions. Preserve LF
  endings, existing formatting, and public APIs unless the task requires a
  change. Add comments only when they explain non-obvious reasoning.
- Keep changes focused and reversible. Do not broaden the task into speculative
  cleanup or dependency upgrades.
