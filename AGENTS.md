# Pass Demo agent instructions

Build Pass Demo with current, stable Angular practices and small, maintainable
changes. Carry each task through implementation, validation, correction, and
verification. This file is self-contained and belongs at the project root.

## Start with project context

- Read the README, package manifest, lockfile, workspace configuration, and any
  nested `AGENTS.md` files that apply to the files being changed.
- Inspect existing components, shared controls, routes, and tests before adding
  new patterns. Keep naming, formatting, and architecture consistent.
- Identify the installed Angular, CLI, TypeScript, Node.js, and RxJS versions;
  identify Nx and its executors when present. Use the existing package manager.
- Discover actual project names, scripts, build configurations, and test targets.
  Do not assume the display name "Pass Demo" is a CLI target or package name.
- Define the user-visible acceptance criteria and the checks that will prove
  them before implementation. For bugs, reproduce the failure when feasible.
- Preserve unrelated work. Make reasonable, reversible implementation choices;
  clarify ambiguity only when it materially changes the requested outcome.

## Keep Angular standards current

- For initial scaffolding, verify the latest stable Angular release and its
  compatibility requirements using official documentation. Use compatible
  stable dependencies and record the selected versions in the project files.
- For existing code, respect the installed versions and lockfile. "Latest
  standards" does not authorize incidental dependency upgrades or migrations.
- Verify API availability, stability, and deprecation status against the
  installed Angular version before adopting an unfamiliar or recently changed
  feature. Use official Angular documentation and the Angular CLI MCP server
  when available. Disclose unavailable documentation access instead of guessing.
- Preview or experimental APIs require an explicit project decision. Prefer
  stable alternatives when the installed version does not support a feature.
- Keep framework and CLI versions aligned. For a requested upgrade, use the
  official update guide or Nx migrations as appropriate, then run the full
  affected validation loop.
- Recheck version-sensitive guidance when scaffolding, upgrading, or using a
  new API. Do not mechanically rewrite established code on every task.

Verified against official Angular documentation on 2026-09-17: Angular 22 is
the active major; standalone is the default in modern Angular, zoneless is the
default from v21, and OnPush is the default from v22. Signal Forms are stable
from v22. Reverify these facts when adopting a future release.

## Architecture and TypeScript

- Keep the app shell focused on bootstrap, providers, routing, and layout.
  Organize behavior by feature, with clear UI, data-access, and domain boundaries.
- In Nx workspaces, put reusable behavior in appropriately scoped libraries,
  use public entry points and aliases, and enforce dependency tags. In a single
  app, use feature folders without introducing a monorepo solely for structure.
- Keep browser code independent of server implementations. Map transport DTOs
  to frontend models at the data-access boundary.
- Enable and preserve strict TypeScript and Angular template checking. Prefer
  inferred types where obvious, `unknown` with appropriate narrowing at untrusted
  boundaries, and explicit domain models.
  Avoid `any`, unsafe casts, and non-null assertions that hide missing states.
- Use kebab-case filenames and PascalCase class names, preserving existing file
  suffix conventions.
- Reuse the established UI system and design tokens. Do not introduce a second
  component suite, additional state library, or heavy dependency without a clear
  need. NgRx SignalStore is the approved default described below.
- Add SSR, PWA/offline synchronization, or other infrastructure only for an
  actual requirement. Prefer CSR for private/demo surfaces; choose rendering
  per route when SEO or first-render requirements justify it.

## Components, templates, and routing

- Use standalone components, directives, and pipes. Add NgModules only where
  required by an integration. Omit redundant `standalone: true` on versions
  where standalone is already the default.
- Bootstrap with `bootstrapApplication` and functional providers such as
  `provideRouter` and `provideHttpClient`.
- Keep components small. Prefer `inject`, signal inputs and required inputs,
  `output`, `model` for intentional two-way binding, and signal view/content
  queries. Keep injected dependencies private unless the template needs them.
- Mark Angular-initialized members `readonly` and template-only members
  `protected` where practical. Put host bindings/listeners in `host` metadata.
- Preserve zoneless operation. Use explicit OnPush on older supported versions
  where it is not the default; omit the redundant setting on Angular 22+.
- Use native `@if`, `@else`, `@for`, `@empty`, `@switch`, and `@let`. Track
  domain collections by stable identity, never by index when items can reorder.
- Import only the template dependencies in use. Prefer direct class/style
  bindings and native CSS. Move filtering, sorting, and aggregation to `computed`.
- Prefer component-scoped CSS/SCSS while preserving approved global styles.
- Use `animate.enter` and `animate.leave` for new animation work when supported;
  respect reduced-motion preferences.
- Lazy-load routed feature screens, including the primary feature route, with
  `loadComponent` or `loadChildren`. Use functional guards and resolvers.
- Prefer `withComponentInputBinding` and signal inputs for route parameters,
  query parameters, route data, and resolved data. Resolve only essential
  route-blocking data; load other data after navigation.
- Scope providers to the feature or route when their state should have that
  lifetime. Use the current stable singleton service API for the installed
  version: prefer `@Service` on v22+; use `@Injectable` as appropriate for other
  versions and provider lifetimes.
- Use `@defer` for useful heavy-content boundaries with intentional placeholder,
  loading, and error states. Measure performance before custom optimization.

## State management standard

Project decision, 2026-09-18: use **NgRx SignalStore** (`@ngrx/signals`) as the
default for new shared feature/domain state and complex feature workflows.

- Keep simple temporary view state, such as an open panel or password visibility,
  in component-local Angular signals. Use `computed` for derived values. A store
  is not required for every component or form field.
- Organize SignalStores by feature, colocated with feature data-access code.
  Expose readonly state and derived signals; change state through named domain
  methods. Preserve immutable updates and a single source of truth.
- Scope stores to the component or route when that matches the required lifetime.
  Use application-wide provision only when state must be shared across features
  or retained across navigation. Do not make every store global by default.
- Keep HTTP requests and DTO mapping in data-access services. Let stores
  coordinate feature state, including loading, errors, retries, and mutations.
  Use RxJS where cancellation or asynchronous composition requires it.
- Do not introduce classic NgRx Store/Effects or ComponentStore by default.
  Document a specific requirement before choosing another state pattern.
- Before installing `@ngrx/signals` or adopting its APIs, verify stable releases,
  Angular peer compatibility, and API support against official NgRx documentation.
  Use the existing package manager and preserve the lockfile.
- `VaultStore` uses NgRx SignalStore in `src/app/features/vault/data-access`.
  It is provided at the application root to preserve the demo vault across
  navigation until page refresh. Keep temporary view state in the component.
  Migrate other existing state only within a requested feature's scope,
  preserving behavior and adding focused store tests.
- SignalStore manages application state; it does not add persistence, encryption,
  or authentication. Keep passwords out of persisted browser state, logs, and
  state-inspection tooling; continue using synthetic credentials in this demo.

## Lifecycle, state, and asynchronous work

The no-class-lifecycle-hook rule below is a Pass Demo convention, not an Angular
deprecation claim.

- Do not introduce `ngOnInit`, `ngOnChanges`, `ngDoCheck`,
  `ngAfterContentInit`, `ngAfterContentChecked`, `ngAfterViewInit`,
  `ngAfterViewChecked`, or `ngOnDestroy` in application code. Document a specific
  integration constraint before making an exception.
- Initialize non-DOM dependencies in fields or an injection context. Use
  `afterNextRender` for one-time rendered-DOM work and `afterEveryRender` only
  when every render requires it. Separate DOM write/read phases where possible.
- Use `DestroyRef.onDestroy`, effect cleanup, and `takeUntilDestroyed` for
  teardown. Respect injection-context requirements or pass the relevant ref.
- Use `signal` for owned state, `computed` for pure derivations, and
  `linkedSignal` for writable state that reconciles with changing sources.
  Update objects and arrays immutably.
- Reserve `effect` and `afterRenderEffect` for imperative synchronization.
  Do not use effects as an event bus or to copy derived state between signals.
  Signal reads after an asynchronous boundary are not tracked dependencies.
- Keep temporary view state local. Expose shared feature state through NgRx
  SignalStore with readonly signal APIs, following the state management standard.
- Use stable `resource`/`httpResource` APIs for suitable read operations, never
  for writes. Use HttpClient/RxJS for mutations, uploads/progress, event streams,
  cancellation-heavy flows, and multi-source asynchronous composition.
- Use Angular RxJS interop at boundaries: `toSignal`, `toObservable`,
  `outputFromObservable`, `outputToObservable`, and `takeUntilDestroyed`.
  Reuse conversions; avoid duplicate subscriptions or competing sources of truth.

## Forms and HTTP

- Prefer Signal Forms for new signal-first forms when stable in the installed
  version. Use typed reactive forms for compatibility or complex observable
  workflows. Avoid template-driven forms for core application workflows.
- Keep form models typed. Display validation and server errors accessibly,
  prevent duplicate submission, and retain input after recoverable failures.
- In zoneless reactive forms, ensure programmatic updates notify the view through
  a signal bridge or an appropriate change-detection notification.
- Encapsulate requests and DTO mapping in data-access code. Use functional
  interceptors with `withInterceptors` and preserve XSRF protection unless a
  documented backend architecture makes it unnecessary.
- Respect the installed version's HTTP backend defaults. Modern Angular uses
  Fetch by default; opt into `withXhr` only for requirements such as upload
  progress, after confirming version support.
- Model loading, empty, success, error, and retry explicitly; add stale/partial
  states when relevant. Prevent stale responses from overwriting current state.
- TypeScript types do not validate runtime payloads. Validate untrusted data at
  boundaries where its shape affects security or correctness.

## Accessibility, performance, and security

- Target WCAG 2.2 AA: semantic controls, accessible names, keyboard operation,
  visible focus, sufficient contrast, associated errors, and reduced motion.
  Keep focus and ARIA state synchronized with visible UI behavior.
- Check phone and desktop layouts. Use automated accessibility checks where
  configured plus manual keyboard/focus checks; automation alone is insufficient.
- Use `NgOptimizedImage` where compatible, intrinsic dimensions or an intentional
  fill container, responsive assets, and priority only for the actual LCP image.
- Measure bundle size and runtime behavior using build budgets and browser
  tooling. Defer heavy editors, charts, and viewers when not initially needed.
- Never ship secrets or real private data in browser bundles, fixtures, logs,
  screenshots, or demos. Use synthetic fixtures and clearly identify mock data.
- Use Angular sanitization. Never construct templates from user input or bypass
  security trust checks without a documented security review. Keep production
  AOT enabled; use CSP and Trusted Types where deployment supports them.
- Route guards are UX controls, not server authorization. Verify authorization
  at the backend boundary when working on protected data or actions.

## Required validation loop

Repeat **understand -> implement -> validate -> inspect -> fix -> revalidate**
until the acceptance criteria and required checks pass, or the blocker/repair
limit below is reached. Generating code is not completion.

1. **Understand and establish a baseline.** Read relevant source/tests, identify
   acceptance criteria, and identify the required validation set from applicable
   instructions and configured commands. Treat formatting, lint, tests,
   type/template compilation, builds, and relevant browser/integration checks as
   distinct requirements; a configured build may also cover compilation. Record
   pre-existing failures separately from regressions, with evidence supporting
   that distinction; do not assume a failure is pre-existing.
2. **Implement a small complete change.** Include meaningful regression coverage
   for changed logic or behavior. Test observable outcomes rather than private
   methods or assertions that merely reproduce the implementation. Cosmetic or
   documentation-only changes do not need artificial unit tests.
3. **Run focused checks first.** Run the relevant unit/component tests and inspect
   their actual results. Fix failures before broadening verification.
4. **Validate the affected scope.** Check changed-file formatting, lint, tests,
   and a production build for TypeScript and Angular template compilation. Include
   consuming apps when shared code changes. Run a separate type-check target if
   the project has one; plain `tsc` alone does not check Angular templates.
5. **Exercise changed user journeys.** Run focused Playwright tests for UI behavior.
   Inspect browser console/network errors, loading/empty/error/retry states,
   keyboard/focus behavior, and responsive layouts as relevant. Read the test
   configuration first to know which services are real or mocked.
6. **Verify real boundaries where required.** For authentication, API contracts,
   or persistence changes, use real test services and synthetic data to verify
   authorization, round trips, and persistence after reload. Mocked UI tests do
   not establish server correctness. Never use production mutations as test data.
7. **Inspect and repair.** Review the diff against this file and acceptance
   criteria. Diagnose failures and make the smallest correct task-related repair;
   do not hand ordinary, safely fixable errors back to the user. Never silence
   diagnostics, disable checks, skip failing tests, weaken assertions, loosen
   compiler settings, add suppressions, or increase timeouts merely to obtain a
   pass. Rerun the failed check after each repair. After the last repair, rerun
   the required validation set for the final affected scope, including consuming
   applications when shared code can affect them. Broaden beyond that set only
   when new changes or unresolved risks warrant it.
8. **Close with evidence.** Report what changed, exact commands and outcomes,
   each command's scope, browser journeys exercised, and remaining limitations.
   Separate passed, failed, blocked, and not-run checks. Never claim validation
   that was not performed or declare implementation complete or fully verified
   while required checks have failed or could not run.

If blocked, first investigate reasonable local remedies. When credentials,
services, tooling, or a required decision remain unavailable, stop and report
the blocker. Also stop if three repair attempts at the same failure produce no
meaningful progress. State the failure, repairs attempted, what was verified,
and the exact next step. Do not retry indefinitely, make unrelated changes, or
declare blocked work fully validated.

### Command discovery and test conventions

- Prefer existing package scripts and the workspace-local tools. Do not install
  a different CLI implicitly just to run validation.
- For Angular CLI projects, inspect `angular.json` and scripts. Typical commands
  are `ng test <project> --no-watch` and
  `ng build <project> --configuration production`, invoked through the local CLI.
  Lint, formatting, and end-to-end targets must actually be configured.
- For Nx, use the local `nx show project <project>` to inspect targets, then
  `nx lint <project>`, `nx test <project>`, `nx build <app>`, and
  `nx e2e <e2e-project>` where those targets exist. Inspect executor-specific
  options before choosing filters or non-watch flags.
- When scaffolding is in scope, establish repeatable formatting, lint, unit-test,
  production-build, and browser-test commands and document them in the README.
  In existing projects, report missing checks rather than inventing passing ones.
- Prefer Vitest for a new Angular CLI project's unit tests. Respect existing
  supported runners; runner migrations are separate work. Co-locate `.spec.ts`.
- Prefer zoneless tests and `await fixture.whenStable()`; avoid masking missing
  render notifications with forced change detection.
- For HTTP tests, configure `provideHttpClient` before
  `provideHttpClientTesting` when both are used, and use `HttpTestingController`.
- Test signal derivations, validation, DTO mapping, error/cancellation behavior,
  route-bound inputs, and cleanup when those behaviors change.
- Use accessible Playwright locators and waiting assertions, not arbitrary sleeps.
  Use supported filters for focused runs and report which tests actually ran.
- For documentation-only changes, review formatting, links, consistency, and
  the diff. Application builds are unnecessary.

## Working agreements

- Keep changes focused, portable, and reviewable. Preserve LF line endings.
- Preserve unrelated user edits; obtain user approval before overwriting custom
  configuration.
- Do not launch persistent development servers unless requested. Required
  automated tests may manage temporary servers for the duration of the run;
  ensure test-owned servers are cleaned up. Do not stop or replace user-owned
  servers.
- Do not change dependencies, architecture, or public behavior outside task scope.
- Do not commit, push, merge, deploy, or publish without user authorization.
- Keep README setup and verification instructions accurate when commands change.
  Record durable architectural decisions in the project's chosen decision log.
- If multiple agents work concurrently, use separate worktrees for independent
  writing tasks or explicit non-overlapping ownership within a shared task.

## Living references

Use official documentation matching the installed version. The dated notes above
are a starting point; verify defaults and API status when relevant.

- [Angular releases](https://angular.dev/reference/releases)
- [Version compatibility](https://angular.dev/reference/versions)
- [Angular AI guidance](https://angular.dev/ai/develop-with-ai)
- [Style guide](https://angular.dev/style-guide)
- [Signals](https://angular.dev/guide/signals)
- [NgRx SignalStore](https://ngrx.io/guide/signals/signal-store)
- [Zoneless](https://angular.dev/guide/zoneless)
- [Signal Forms](https://angular.dev/guide/forms/signals/overview)
- [HTTP setup](https://angular.dev/guide/http/setup)
- [Service API](https://angular.dev/api/core/Service)
- [Testing](https://angular.dev/guide/testing)
- [Update guide](https://angular.dev/update-guide)
