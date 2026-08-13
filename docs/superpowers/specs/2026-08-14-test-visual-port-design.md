# Visual Port from `test@845f7b0` to `split-front-back@4d12f20`

## Objective

Port the visual design of `test@845f7b0` into the current `split-front-back` application while preserving the architecture, data flow, routes, API contracts, authentication, booking behavior, administrative workflows, and backend implementation from `split-front-back@4d12f20`.

The governing rule is:

> Design from `845f7b0`; logic from `4d12f20`.

The result must look consistently like the reference on public, authenticated, administrative, and newly added reference routes without reverting the project to the older frontend architecture.

## Baselines and Git Safety

- Target branch: local `split-front-back`.
- Functional baseline: `4d12f203b36f5d695516400c9f79762eeaeaec97`.
- Visual reference: `845f7b0a73c9ef334e584402156d1f412ce58fd6`.
- The `test` branch is read-only for this task.
- The former local `split-front-back` head `b42a23c` is preserved as `backup/split-front-back-b42a23c`.
- Do not merge, rebase, or cherry-pick the reference branch.
- Inspect reference files with read-only Git commands and port presentation details deliberately.

## Non-goals

The visual port must not redesign or replace:

- backend code, server routes, API contracts, models, database access, bots, webhooks, or integrations;
- authentication, authorization, roles, cookies, JWT handling, contexts, or protected-route behavior;
- deployment configuration, nginx, CI/CD, environment files, secrets, or frontend/backend separation;
- current field names, form payloads, validation rules, loading logic, error handling, analytics, or navigation callbacks;
- current package versions unless a minimal frontend-only dependency is demonstrably required.

Unrelated refactoring is outside scope.

## Chosen Approach

Use a token-first presentation adapter, followed by controlled component and page adaptation.

1. Establish the reference design system in the current Tailwind v4/CSS structure.
2. Adapt shared shell components and reusable UI primitives.
3. Port page composition while retaining current component logic and data sources.
4. Add reference-only routes and their static frontend content without changing existing URLs.
5. Apply the same visual language to functional pages that have no direct reference equivalent.

This approach is preferred over a page-by-page style fork because it produces a coherent result, and over a CSS-only overlay because the reference requires meaningful layout and composition changes.

## Design System

The target UI will adopt the reference visual vocabulary:

- paper, paper-2, paper-3, surface, ink, ink-2, muted, rule, accent, trust, success, warning, and error color roles;
- `Geologica` for display typography, `Golos Text` for body typography, and `IBM Plex Mono` where the reference uses metadata labels;
- fluid type scales based on `clamp()`;
- reference spacing scale, container widths, pill and editorial radii, thin rules, soft shadows, and card shadows;
- reference easing and duration tokens;
- dark ink surfaces, warm accent surfaces, restrained gradients, liquid-glass treatment, and editorial whitespace;
- consistent focus-visible, hover, active, disabled, loading, empty, success, and error states.

Existing semantic colors required by current workflows remain available. Target components should consume the new semantic roles rather than hard-coded one-off values where practical.

## Application Shell

### Header and navigation

Adapt the current `Header` to match the fixed dark reference header, including dimensions, logo treatment, dropdown presentation, spacing, hide/reveal scroll motion, mobile menu, active states, keyboard focus, and booking/auth actions.

The current auth state, route awareness, callbacks, mobile behavior, and booking integration remain authoritative. Reference navigation items are added for the approved new routes.

### Breadcrumbs

Keep current breadcrumb generation and routing logic. Restyle it as a restrained editorial navigation aid that fits the reference system. It may be visually suppressed on layouts where the reference composition makes it redundant, but route behavior must remain intact.

### Footer

Adapt the current footer to the reference dark editorial footer, retaining valid current links and contact behavior. Add links to approved new routes without deleting current destinations.

### Chat and global utilities

Keep the current chat widget, analytics, SEO, notifications, providers, and loading boundaries. Restyle only visible presentation.

## Home Page

The home page will follow the reference composition:

- full-viewport hero with the reference background video and fallback treatment;
- central glowing logo and orbital animation;
- left/right editorial messaging and reference CTA placement;
- service, doctor, metrics, results, reviews, FAQ, and booking sections arranged and styled like the reference;
- reference transitions, reveal motion, hover behavior, and responsive transformations.

Current API-driven data, booking callbacks, modals, validation, and submission behavior remain in place. Static reference data must not replace dynamic target data where the target already has a functional data source.

## Existing Public Routes

Apply the reference visual system and closest matching reference composition to:

- `/about`;
- `/doctors` and `/doctors/:id`;
- `/services` and `/services/:id`;
- `/pricing`;
- `/reviews`;
- `/blog` and `/blog/:id`;
- `/faq`;
- `/contact`.

Detail pages without exact reference counterparts will use the reference editorial hero, card, typography, action, and media patterns while preserving current route parameters and API requests.

## New Approved Routes

Add the following reference routes and corresponding frontend pages:

- `/people`;
- `/about/clinic-tour`;
- `/about/equipment`;
- `/results`;
- `/tourism`;
- `/academy`;
- `/contacts`.

Reference-only pages may use the static frontend content and datasets from `845f7b0` because no current functional equivalents exist. `/contacts` must remain compatible with the current contact workflow; `/contact` remains valid and is not removed. Existing routes always retain priority over reference route structure.

## Functional Pages Without Direct Reference Equivalents

Apply the design system without replacing structure or logic on:

- login, registration, verification, forgotten-password, and reset-password pages;
- profile, bookings, medical records, and booking wizard;
- admin dashboard, appointments, doctors, patients, blog, and reviews;
- doctor dashboard;
- not-found and other system states.

These screens keep their current information architecture, tables, forms, permissions, state, hooks, and API calls. Their surfaces, hierarchy, typography, controls, spacing, responsive behavior, and feedback states are restyled using the reference patterns.

## Data and Behavior Preservation

- `AuthProvider`, `BookingProvider`, `ProtectedRoute`, route guards, role checks, lazy loading, SEO, analytics, and toasts remain active.
- Existing `useState`, `useEffect`, `useMemo`, `useCallback`, contexts, router hooks, event handlers, Axios/fetch calls, validation, and error paths remain authoritative.
- Booking CTAs use the current booking context and real submission flow rather than the reference demonstration modal logic.
- Current doctor, service, review, blog, medical, and admin data remain API-driven where currently implemented.
- Reference static datasets are limited to genuinely new frontend-only routes or decorative content.
- Existing loading, disabled, empty, success, and failure behavior is preserved and restyled.

## Assets and Media

Selectively port the reference frontend assets required by the approved design:

- background videos and their poster/fallback imagery;
- central logo and orbit artwork/animation;
- clinic imagery, before/after imagery, team imagery, icons, and decorative SVGs used by the reference layouts;
- frontend fonts required by the design system.

Do not remove current assets that support functionality. Do not move or repurpose backend public files, uploads, or user-generated media.

Background video must use `autoPlay`, `muted`, `loop`, `playsInline`, and `preload="metadata"`, preserve aspect ratio with appropriate `object-fit`, provide a poster or visual fallback, and remain legible under its overlay on desktop and mobile.

## Responsive, Motion, and Accessibility

- Reproduce the reference desktop composition rather than expanding a mobile stack.
- Define deliberate tablet and mobile layouts for header, hero, grids, forms, tables, dialogs, and dashboards.
- Prevent horizontal overflow and preserve usable touch targets.
- Maintain semantic controls, labels, keyboard navigation, visible focus, and dialog behavior.
- Respect `prefers-reduced-motion`; essential content must remain available without animation.
- Preserve readable contrast over video, dark surfaces, and accent backgrounds.

## Implementation Sequence

1. Capture baseline lint/build results, route inventory, and functional hotspots from `4d12f20`.
2. Add design tokens, typography, global styles, and shared presentational primitives.
3. Add required static frontend assets and media.
4. Adapt header, navigation, breadcrumbs, footer, and application shell.
5. Adapt hero and home-page sections.
6. Adapt existing public pages and detail pages.
7. Add approved new routes and reference-only pages.
8. Adapt auth, profile, booking, medical, admin, and doctor workflows.
9. Audit responsive behavior, motion, focus, loading, empty, success, and error states.
10. Run all available verification and inspect the complete Git diff.

## Verification

Use the actual project commands:

- `npm run lint` for TypeScript validation;
- `npm run build` for the production frontend build.

The project has no general unit-test script at the baseline. Add focused tests only where the implementation introduces testable presentation helpers or route configuration, using the existing stack rather than inventing a dependency-heavy test setup.

Also perform:

- HTTP smoke checks for every existing and newly approved public route;
- authenticated-route checks at the routing/guard level without bypassing authorization;
- interaction checks for booking, authentication, menus, dialogs, forms, and API error states;
- desktop, tablet, and mobile visual checks;
- asset-request checks for video, poster, SVG, logo, and images;
- a final `git diff` audit confirming that backend, API, bots, database, auth internals, integrations, infrastructure, `.env`, deployment, and CI/CD were not changed without strict frontend necessity.

The external notification script is not a general test suite and must not be run as a substitute for application verification.

## Acceptance Criteria

The work is complete only when:

1. The complete frontend uses a coherent visual system matching `845f7b0` across public, functional, administrative, desktop, tablet, and mobile views.
2. The approved reference routes and assets are present.
3. Existing `4d12f20` routes, API interactions, booking, forms, auth, roles, admin workflows, medical workflows, dynamic data, loading, and error handling remain operational.
4. TypeScript validation and the production build pass.
5. No unrelated backend, infrastructure, integration, dependency, or architectural changes appear in the final diff.

