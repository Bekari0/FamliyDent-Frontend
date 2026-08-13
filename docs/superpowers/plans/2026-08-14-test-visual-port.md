# Family Dent Visual Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the complete `split-front-back` frontend visually match `test@845f7b0`, add the approved reference routes and assets, and retain all application behavior from `split-front-back@4d12f20`.

**Architecture:** Treat `4d12f20` as the immutable functional baseline and layer the `845f7b0` presentation system onto its existing contexts, API calls, routes, and page structure. Build the port from global tokens outward: shared primitives, brand/media, shell, home, public routes, new routes, and operational screens. Static reference data is allowed only for newly added reference-only routes; existing functional screens remain API-driven.

**Tech Stack:** React 18, TypeScript 5.8, React Router 7, Vite 6, Tailwind CSS 4, Motion, Lucide React, Base UI/shadcn primitives, Axios, Node `node:test`, `tsx`.

## Global Constraints

- Visual reference is exactly `845f7b0a73c9ef334e584402156d1f412ce58fd6`.
- Functional baseline is exactly `4d12f203b36f5d695516400c9f79762eeaeaec97` plus the approved design-spec commit.
- Do not merge, rebase, or cherry-pick `test`; do not move the `test` branch.
- Preserve `AuthProvider`, `BookingProvider`, `ProtectedRoute`, current API endpoints, route parameters, payloads, validation, loading/error behavior, roles, and callbacks.
- Do not edit `backend/**`, `deploy/**`, `.github/**`, `.env*`, nginx, bots, database code, integrations, or CI/CD.
- Do not copy `package.json`, lockfiles, TypeScript config, or Vite config from the reference.
- Do not downgrade or broadly upgrade React, Vite, Tailwind, or other dependencies.
- Existing routes remain valid. Add `/people`, `/about/clinic-tour`, `/about/equipment`, `/results`, `/tourism`, `/academy`, and `/contacts`.
- `/contacts` must use the current contact workflow; `/contact` remains valid.
- Use reference static datasets only for new routes without current API-driven equivalents.
- Use `Geologica`, `Golos Text`, and `IBM Plex Mono` through the existing frontend font-loading mechanism; do not add a package if the Google Fonts links suffice.
- Video belongs in the clinic metrics section as in `845f7b0`; the hero uses the reference ambient background, central logo, and orbit animation.
- Respect `prefers-reduced-motion`, keyboard focus, semantic controls, touch targets, and readable contrast.
- No `any`, `@ts-ignore`, or `@ts-nocheck` may be introduced. Existing intentional `any` usage is not expanded.
- Each task must end with `npm run lint` and the task-specific tests. Run `npm run build` at shell, routing, and final milestones.
- Before each commit, run `git diff --check` and confirm no prohibited files are staged.

---

### Task 1: Capture Baseline and Lock the Route Contract

**Files:**
- Create: `src/lib/site-navigation.ts`
- Create: `src/lib/site-navigation.test.ts`
- Modify: `src/App.tsx`
- Modify: `src/components/Header.tsx`

**Interfaces:**
- Consumes: current route list in `src/App.tsx`, current role/auth behavior in `Header`, approved new routes from the design spec.
- Produces: `PUBLIC_ROUTE_PATHS: readonly string[]`, `PRIMARY_NAV_ITEMS: readonly NavigationItem[]`, `ABOUT_NAV_ITEMS`, `PEOPLE_NAV_ITEMS`, `MORE_NAV_ITEMS`, and `isKnownRoute(pathname: string): boolean`.

- [ ] **Step 1: Record the clean functional baseline**

Run:

```powershell
git status --short --branch
npm.cmd ci
npm.cmd run lint
npm.cmd run build
rg -n "axios\.|fetch\(|onSubmit|openBooking|login\(|register\(|ProtectedRoute" src
```

Expected: branch `split-front-back`, clean worktree, lint exit `0`, build exit `0`. Save any pre-existing warning text in the implementation notes; do not fix unrelated warnings.

- [ ] **Step 2: Write the failing navigation test**

Create `src/lib/site-navigation.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  PUBLIC_ROUTE_PATHS,
  PRIMARY_NAV_ITEMS,
  isKnownRoute,
} from "./site-navigation";

const requiredExistingRoutes = [
  "/", "/about", "/contact", "/faq", "/reviews", "/pricing",
  "/services", "/doctors", "/blog", "/profile", "/book",
  "/admin", "/doctor",
];

const requiredReferenceRoutes = [
  "/people", "/about/clinic-tour", "/about/equipment", "/results",
  "/tourism", "/academy", "/contacts",
];

test("keeps every functional route and adds approved reference routes", () => {
  for (const route of [...requiredExistingRoutes, ...requiredReferenceRoutes]) {
    assert.equal(isKnownRoute(route), true, route);
  }
  assert.equal(new Set(PUBLIC_ROUTE_PATHS).size, PUBLIC_ROUTE_PATHS.length);
});

test("primary navigation exposes booking-safe public destinations", () => {
  assert.ok(PRIMARY_NAV_ITEMS.some((item) => item.href === "/services"));
  assert.ok(PRIMARY_NAV_ITEMS.some((item) => item.href === "/doctors"));
  assert.ok(PRIMARY_NAV_ITEMS.some((item) => item.href === "/contacts"));
});
```

- [ ] **Step 3: Verify the test fails for the missing module**

Run:

```powershell
node.exe --import tsx --test src/lib/site-navigation.test.ts
```

Expected: FAIL because `./site-navigation` does not exist.

- [ ] **Step 4: Implement the typed navigation manifest**

Create `src/lib/site-navigation.ts` with this public shape:

```ts
export interface NavigationItem {
  label: string;
  href: string;
}

export const PRIMARY_NAV_ITEMS = [
  { label: "Главная", href: "/" },
  { label: "Услуги", href: "/services" },
  { label: "Врачи", href: "/doctors" },
  { label: "Результаты", href: "/results" },
  { label: "Цены", href: "/pricing" },
  { label: "Контакты", href: "/contacts" },
] as const satisfies readonly NavigationItem[];

export const PEOPLE_NAV_ITEMS = [
  { label: "Врачи", href: "/doctors" },
  { label: "Вся команда", href: "/people" },
] as const satisfies readonly NavigationItem[];

export const ABOUT_NAV_ITEMS = [
  { label: "О клинике", href: "/about" },
  { label: "Экскурсия по клинике", href: "/about/clinic-tour" },
  { label: "Оборудование", href: "/about/equipment" },
] as const satisfies readonly NavigationItem[];

export const MORE_NAV_ITEMS = [
  { label: "Отзывы", href: "/reviews" },
  { label: "Блог", href: "/blog" },
  { label: "Туризм", href: "/tourism" },
  { label: "Академия", href: "/academy" },
  { label: "FAQ", href: "/faq" },
] as const satisfies readonly NavigationItem[];

export const PUBLIC_ROUTE_PATHS = [
  "/", "/about", "/contact", "/contacts", "/faq", "/reviews",
  "/pricing", "/services", "/doctors", "/blog", "/people",
  "/about/clinic-tour", "/about/equipment", "/results", "/tourism",
  "/academy", "/profile", "/book", "/admin", "/doctor",
] as const;

export function isKnownRoute(pathname: string): boolean {
  return PUBLIC_ROUTE_PATHS.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(`${route}/`)),
  );
}
```

Replace the duplicate `validRoutes` logic in `App.tsx` with `isKnownRoute`. Replace `NAV_ITEMS` in `Header.tsx` with imports from the manifest, while leaving auth, logout, role, mobile-sheet, scroll, and click behavior untouched.

- [ ] **Step 5: Verify the contract and baseline behavior**

Run:

```powershell
node.exe --import tsx --test src/lib/site-navigation.test.ts
npm.cmd run lint
git diff --check
git diff -- src/App.tsx src/components/Header.tsx src/lib/site-navigation.ts
```

Expected: tests PASS, lint exit `0`, no changes to auth callbacks or protected routes.

- [ ] **Step 6: Commit the route contract**

```powershell
git add src/lib/site-navigation.ts src/lib/site-navigation.test.ts src/App.tsx src/components/Header.tsx
git commit -m "refactor: centralize frontend route manifest"
```

---

### Task 2: Install the Reference Design Tokens and Shared Editorial Primitives

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`
- Modify: `src/styles/theme.css`
- Modify: `src/styles/base.css`
- Modify: `src/styles/utilities.css`
- Create: `src/styles/design-system.test.ts`
- Create: `src/components/shared/editorial-page-hero.tsx`
- Create: `src/components/shared/scroll-animate.tsx`
- Create: `src/components/shared/functional-page-shell.tsx`
- Create: `src/components/shared/shared-primitives.test.tsx`

**Interfaces:**
- Consumes: Tailwind v4 theme structure and Motion already in the target.
- Produces: `EditorialPageHero`, `ScrollAnimate`, and `FunctionalPageShell` used by all later page tasks.

- [ ] **Step 1: Write the failing token test**

Create `src/styles/design-system.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const theme = readFileSync(new URL("./theme.css", import.meta.url), "utf8");

test("defines the canonical Family Dent visual tokens", () => {
  for (const token of [
    "--color-paper", "--color-ink", "--color-accent", "--color-trust",
    "--font-display", "--font-body", "--font-mono", "--radius-pill",
    "--shadow-card", "--dur-section",
  ]) {
    assert.match(theme, new RegExp(token.replaceAll("-", "\\-")));
  }
});
```

- [ ] **Step 2: Write the failing primitive rendering test**

Create `src/components/shared/shared-primitives.test.tsx`:

```tsx
import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EditorialPageHero } from "./editorial-page-hero";
import { FunctionalPageShell } from "./functional-page-shell";

test("renders the editorial hierarchy", () => {
  const html = renderToStaticMarkup(
    <EditorialPageHero badge="Раздел" title="Заголовок" description="Описание" />,
  );
  assert.match(html, /Раздел/);
  assert.match(html, /Заголовок/);
  assert.match(html, /font-display/);
});

test("renders functional content without owning its behavior", () => {
  const html = renderToStaticMarkup(
    <FunctionalPageShell eyebrow="Кабинет" title="Пациенты">
      <button type="button">Действие</button>
    </FunctionalPageShell>,
  );
  assert.match(html, /Действие/);
  assert.match(html, /Кабинет/);
});
```

- [ ] **Step 3: Verify both tests fail**

Run:

```powershell
node.exe --import tsx --test src/styles/design-system.test.ts src/components/shared/shared-primitives.test.tsx
```

Expected: FAIL because the new tokens and components are absent.

- [ ] **Step 4: Port tokens without replacing current semantic aliases**

Update `theme.css` with the exact `paper/ink/accent/trust` roles, fluid type scale, spacing, radius, shadow, and motion variables from `845f7b0:src/index.css`. Keep the target aliases (`--background`, `--foreground`, `--primary`, `--secondary`, `--error`, `--success`, sidebar roles) mapped to the new palette so existing components remain functional while they are migrated.

Add to `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geologica:wght@300;400;500;600;700;800;900&family=Golos+Text:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

Add base rules for `bg-paper`, `text-ink`, body typography, selection, focus-visible, reduced motion, and the reference `liquid-glass`, gradient-text, and reveal utilities. Do not remove component stylesheet imports until their consumers have migrated.

- [ ] **Step 5: Implement the shared components**

Port `EditorialPageHero` and `ScrollAnimate` from the reference presentation layer. Implement `FunctionalPageShell` with this interface:

```tsx
interface FunctionalPageShellProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  width?: "normal" | "wide";
}
```

It renders only layout and content slots; it must not fetch data, navigate, submit forms, or own auth state.

- [ ] **Step 6: Verify tokens, primitives, lint, and build**

Run:

```powershell
node.exe --import tsx --test src/styles/design-system.test.ts src/components/shared/shared-primitives.test.tsx
npm.cmd run lint
npm.cmd run build
git diff --check
```

Expected: all commands exit `0`; existing CSS imports still resolve.

- [ ] **Step 7: Commit the design foundation**

```powershell
git add index.html src/index.css src/styles src/components/shared
git commit -m "feat: add Family Dent editorial design system"
```

---

### Task 3: Port Brand Artwork, Clinic Media, and Static Frontend Assets

**Files:**
- Create: `public/images/clinic_about.jpg`
- Create: `public/videos/familydent.mp4`
- Create: `src/assets/images/clinic_about_real_1785880931165.jpg`
- Create: `src/assets/images/clinic_about_real_v2_1785881103614.jpg`
- Create: `src/assets/images/dental_clinic_about_1785880362895.jpg`
- Create: `src/components/BackgroundVideo.tsx`
- Create: `src/components/CentralLogo.tsx`
- Create: `src/components/OrbitalRings.tsx`
- Create: `src/components/media/clinic-background-media.tsx`
- Create: `src/components/media/brand-media.test.tsx`

**Interfaces:**
- Consumes: reference assets from `845f7b0`, design tokens from Task 2.
- Produces: `CentralLogo`, `OrbitalRings`, `BackgroundVideo`, and `ClinicBackgroundMedia` for the hero and metrics section.

- [ ] **Step 1: Write the failing brand/media test**

Create `src/components/media/brand-media.test.tsx`:

```tsx
import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CentralLogo } from "../CentralLogo";
import { ClinicBackgroundMedia } from "./clinic-background-media";

test("renders the orbital Family Dent mark", () => {
  const html = renderToStaticMarkup(<CentralLogo />);
  assert.match(html, /aria-label="Family Dent"/);
  assert.match(html, /data-orbital-rings="true"/);
});

test("renders clinic video with mobile-safe attributes and poster", () => {
  const html = renderToStaticMarkup(<ClinicBackgroundMedia visible />);
  assert.match(html, /autoplay=""/);
  assert.match(html, /muted=""/);
  assert.match(html, /loop=""/);
  assert.match(html, /playsinline=""/);
  assert.match(html, /preload="metadata"/);
  assert.match(html, /poster="\/images\/clinic_about.jpg"/);
  assert.match(html, /src="\/videos\/familydent.mp4"/);
});
```

- [ ] **Step 2: Verify the brand/media test fails**

Run:

```powershell
node.exe --import tsx --test src/components/media/brand-media.test.tsx
```

Expected: FAIL because the components do not exist.

- [ ] **Step 3: Extract only the approved static blobs**

Use a path-limited archive, not a directory checkout:

```powershell
git archive --format=tar 845f7b0 public/images/clinic_about.jpg public/videos/familydent.mp4 src/assets/images/clinic_about_real_1785880931165.jpg src/assets/images/clinic_about_real_v2_1785881103614.jpg src/assets/images/dental_clinic_about_1785880362895.jpg | tar -xf -
```

Verify hashes against the reference:

```powershell
git hash-object public/images/clinic_about.jpg public/videos/familydent.mp4 src/assets/images/*.jpg
git ls-tree -r 845f7b0 -- public/images/clinic_about.jpg public/videos/familydent.mp4 src/assets/images
```

Expected: each local blob hash matches its `845f7b0` blob hash. Do not extract the duplicate `public/videos/familydent  .mp4` with spaces.

- [ ] **Step 4: Port brand components and implement media wrapper**

Port the reference SVG/path content from `CentralLogo.tsx` and `OrbitalRings.tsx`, adding `aria-label="Family Dent"` to the central mark and `data-orbital-rings="true"` to the outer SVG wrapper. Port `BackgroundVideo.tsx` as the hero ambient layer.

Implement `ClinicBackgroundMedia` with this interface:

```tsx
interface ClinicBackgroundMediaProps {
  visible: boolean;
  onReady?: () => void;
  onError?: () => void;
}
```

When `visible` is false, render only the poster background. When true, render the video with `autoPlay`, `muted`, `loop`, `playsInline`, `preload="metadata"`, poster, source, `object-cover`, and a single `bg-black/30` overlay.

- [ ] **Step 5: Verify assets and presentation components**

Run:

```powershell
node.exe --import tsx --test src/components/media/brand-media.test.tsx
npm.cmd run lint
npm.cmd run build
git diff --check
```

Expected: PASS; build emits no missing-asset warning.

- [ ] **Step 6: Commit frontend media only**

```powershell
git add public/images/clinic_about.jpg public/videos/familydent.mp4 src/assets/images src/components/BackgroundVideo.tsx src/components/CentralLogo.tsx src/components/OrbitalRings.tsx src/components/media
git commit -m "feat: port Family Dent brand media"
```

---

### Task 4: Adapt the Application Shell, Header, Breadcrumbs, and Footer

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/Footer.styles.ts`
- Modify: `src/components/Breadcrumbs.tsx`
- Modify: `src/components/Breadcrumbs.module.css`
- Modify: `src/components/ChatWidget.module.css`
- Modify: `src/styles/components/header.css`
- Modify: `src/styles/components/footer.css`
- Create: `src/components/application-shell.test.tsx`

**Interfaces:**
- Consumes: navigation manifest, design tokens, current auth/role state, `logout`, router location, mobile sheet, current footer data.
- Produces: reference-style global shell used by every route.

- [ ] **Step 1: Write the failing shell contract test**

Create `src/components/application-shell.test.tsx` as a source contract test:

```tsx
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const header = readFileSync(new URL("./Header.tsx", import.meta.url), "utf8");
const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");

test("header retains auth and role actions while adopting grouped navigation", () => {
  assert.match(header, /useAuth\(\)/);
  assert.match(header, /handleLogout/);
  assert.match(header, /isAdmin/);
  assert.match(header, /isDoctor/);
  assert.match(header, /ABOUT_NAV_ITEMS/);
  assert.match(header, /MORE_NAV_ITEMS/);
  assert.match(header, /data-ui="reference-header"/);
});

test("application shell retains providers and operational widgets", () => {
  for (const contract of ["AuthProvider", "BookingProvider", "Seo", "Analytics", "ChatWidget", "Toaster"]) {
    assert.match(app, new RegExp(contract));
  }
});
```

- [ ] **Step 2: Verify the shell test fails only on new presentation markers**

Run:

```powershell
node.exe --import tsx --test src/components/application-shell.test.tsx
```

Expected: FAIL because grouped navigation imports and `data-ui="reference-header"` are absent; existing provider assertions pass.

- [ ] **Step 3: Adapt the header without replacing behavior**

Retain `useAuth`, `logout`, role-specific links, mobile sheet state, route state, and scroll listeners. Recompose markup to match the reference fixed ink header:

```tsx
<motion.header data-ui="reference-header" className="fixed inset-x-0 top-0 z-[60] border-b border-rule/20 bg-ink/95 text-paper backdrop-blur-xl">
```

Use `PRIMARY_NAV_ITEMS`, grouped dropdowns for people/about/more, the current user dropdown, real login/register links, and current phone link. Implement reference hide-on-scroll/reveal-on-up behavior without removing the target `isScrolled` route treatment.

- [ ] **Step 4: Adapt breadcrumbs, footer, and shell spacing**

Keep breadcrumb generation and valid link targets. Restyle with paper/ink/rule roles and hide only on the same auth/not-found states already controlled by `App.tsx`.

Recompose `Footer.tsx` with the reference dark editorial columns, but preserve the current phone, addresses, social links, email, and current-year logic. Add links to approved new routes. Update `App.tsx` main top padding to match the fixed 64/72px header without altering provider or route-guard placement.

- [ ] **Step 5: Verify shell behavior and build**

Run:

```powershell
node.exe --import tsx --test src/lib/site-navigation.test.ts src/components/application-shell.test.tsx
npm.cmd run lint
npm.cmd run build
git diff --check
rg -n "useAuth|logout|isAdmin|isDoctor|AuthProvider|BookingProvider|ProtectedRoute" src/App.tsx src/components/Header.tsx
```

Expected: tests PASS; every functional contract remains present.

- [ ] **Step 6: Commit the application shell**

```powershell
git add src/App.tsx src/components/Header.tsx src/components/Footer.tsx src/components/Footer.styles.ts src/components/Breadcrumbs.tsx src/components/Breadcrumbs.module.css src/components/ChatWidget.module.css src/styles/components/header.css src/styles/components/footer.css src/components/application-shell.test.tsx
git commit -m "feat: adapt application shell to editorial design"
```

---

### Task 5: Port the Home Composition While Preserving Dynamic Workflows

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/Hero.styles.ts`
- Modify: `src/components/Services.tsx`
- Modify: `src/components/Services.styles.ts`
- Modify: `src/components/Doctors.tsx`
- Modify: `src/components/Doctors.styles.ts`
- Modify: `src/components/Reviews.tsx`
- Modify: `src/components/ReviewCard.tsx`
- Modify: `src/components/FAQ.tsx`
- Modify: `src/components/Contact.tsx`
- Modify: corresponding files under `src/styles/components/`
- Create: `src/components/home/clinic-metrics-section.tsx`
- Create: `src/components/home/treatment-results-section.tsx`
- Create: `src/components/home/home-contract.test.tsx`
- Create: `src/lib/reference-content/types.ts`
- Create: `src/lib/reference-content/metrics.ts`
- Create: `src/lib/reference-content/treatment-cases.ts`

**Interfaces:**
- Consumes: current `/api/services`, `/api/doctors`, `/api/reviews/public`, `/api/urgent-requests`, `useBooking`, detail modal, reference brand/media.
- Produces: the complete reference home ordering and responsive composition.

- [ ] **Step 1: Write the failing home presentation/logic contract test**

Create `src/components/home/home-contract.test.tsx`:

```tsx
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

function source(path: string): string {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("home hero adds reference composition and retains urgent submission", () => {
  const hero = source("../Hero.tsx");
  assert.match(hero, /CentralLogo/);
  assert.match(hero, /BackgroundVideo/);
  assert.match(hero, /axios\.post\('\/api\/urgent-requests', form\)/);
  assert.match(hero, /trackGoal\('urgent_request_submit'\)/);
});

test("dynamic home sections retain production data sources", () => {
  assert.match(source("../Services.tsx"), /axios\.get\('\/api\/services'\)/);
  assert.match(source("../Doctors.tsx"), /axios\.get\(`\$\{API_URL\}\/doctors`\)/);
  assert.match(source("../Doctors.tsx"), /openBooking\(doctorId\)/);
  assert.match(source("../Reviews.tsx"), /axios\.get\('\/api\/reviews\/public'\)/);
});

test("home page includes reference section order", () => {
  const page = source("../../pages/HomePage.tsx");
  const order = ["<Hero", "<ClinicMetricsSection", "<Services", "<Doctors", "<TreatmentResultsSection", "<Reviews", "<FAQ", "<Contact"];
  let cursor = -1;
  for (const marker of order) {
    const next = page.indexOf(marker);
    assert.ok(next > cursor, marker);
    cursor = next;
  }
});
```

- [ ] **Step 2: Verify the home contract fails on missing reference composition**

Run:

```powershell
node.exe --import tsx --test src/components/home/home-contract.test.tsx
```

Expected: FAIL for missing `CentralLogo`, `BackgroundVideo`, `ClinicMetricsSection`, and `TreatmentResultsSection`; existing endpoint assertions pass.

- [ ] **Step 3: Recompose Hero around current urgent-request behavior**

Move the reference three-column hero JSX into the current `Hero` component. Keep `urgentOpen`, `UrgentRequestModal`, the exact `/api/urgent-requests` payload, validation, analytics, toast, and submitting state. The primary booking CTA calls `useBooking().openBooking()` or links through the current protected booking flow; the urgent CTA still opens the existing modal.

Use `BackgroundVideo` as the ambient layer and `CentralLogo` in the center. Preserve desktop columns at `lg`, stack in readable order on mobile, add a reduced-motion fallback, and retain the reference bottom watermark.

- [ ] **Step 4: Add clinic metrics and treatment results**

Define `ClinicMetric` and `TreatmentCase` in `src/lib/reference-content/types.ts`, then implement metrics values and cases in typed `src/lib/reference-content/*` files. `ClinicMetricsSection` mounts `ClinicBackgroundMedia` only after intersection and skips motion/video for reduced-motion or save-data users. `TreatmentResultsSection` uses a typed before/after card and does not call backend endpoints.

- [ ] **Step 5: Restyle dynamic services, doctors, reviews, FAQ, and contact**

Port reference layout/classes into the current components while retaining:

```text
Services: GET /api/services, loading state, category/service mapping
Doctors: GET /api/doctors, fallback data, detail modal, openBooking(doctorId)
Reviews: GET /api/reviews/public, horizontal wheel behavior, empty state
FAQ: current state and content behavior
Contact: current field names, validation, endpoint/callback behavior
```

Fix visible mojibake copy in JSX as presentation text only; do not change response contracts.

- [ ] **Step 6: Verify home contracts, lint, and build**

Run:

```powershell
node.exe --import tsx --test src/components/home/home-contract.test.tsx src/components/media/brand-media.test.tsx
npm.cmd run lint
npm.cmd run build
git diff --check
rg -n "\/api\/services|\/api\/doctors|\/api\/reviews\/public|\/api\/urgent-requests|openBooking" src/components
```

Expected: tests PASS and all production data paths remain present.

- [ ] **Step 7: Commit the home port**

```powershell
git add src/pages/HomePage.tsx src/components/Hero.tsx src/components/Hero.styles.ts src/components/Services.tsx src/components/Services.styles.ts src/components/Doctors.tsx src/components/Doctors.styles.ts src/components/Reviews.tsx src/components/ReviewCard.tsx src/components/FAQ.tsx src/components/Contact.tsx src/components/home src/lib/reference-content src/styles/components
git commit -m "feat: port reference home experience"
```

---

### Task 6: Adapt Existing Public Listing and Detail Pages

**Files:**
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/pages/AboutPage.styles.ts`
- Modify: `src/pages/DoctorsPage.tsx`
- Modify: `src/pages/DoctorsPage.styles.ts`
- Modify: `src/pages/DoctorDetailPage.tsx`
- Modify: `src/pages/DoctorDetailPage.styles.ts`
- Modify: `src/pages/ServicesPage.tsx`
- Modify: `src/pages/ServicesPage.styles.ts`
- Modify: `src/pages/ServiceDetailPage.tsx`
- Modify: `src/pages/PricingPage.tsx`
- Modify: `src/pages/PricingPage.styles.ts`
- Modify: `src/pages/ReviewsPage.tsx`
- Modify: `src/pages/BlogPage.tsx`
- Modify: `src/pages/BlogPage.styles.ts`
- Modify: `src/pages/ArticleDetailPage.tsx`
- Modify: `src/pages/FAQPage.tsx`
- Modify: `src/pages/ContactPage.tsx`
- Create: `src/pages/public-pages-contract.test.ts`

**Interfaces:**
- Consumes: `EditorialPageHero`, existing Axios calls, current route params, current form handlers, current review submission/moderation rules.
- Produces: reference editorial presentation for all existing public routes.

- [ ] **Step 1: Write a public-page functional contract test before edits**

Create `src/pages/public-pages-contract.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

test("detail pages retain route parameters", () => {
  assert.match(read("DoctorDetailPage.tsx"), /useParams/);
  assert.match(read("ServiceDetailPage.tsx"), /useParams/);
  assert.match(read("ArticleDetailPage.tsx"), /useParams/);
});

test("API-driven public pages retain their endpoints", () => {
  assert.match(read("DoctorsPage.tsx"), /\/api\/doctors/);
  assert.match(read("ServicesPage.tsx"), /\/api\/services/);
  assert.match(read("ReviewsPage.tsx"), /\/api\/reviews/);
  assert.match(read("BlogPage.tsx"), /\/api\/articles/);
});

test("public pages use the editorial design system", () => {
  for (const page of ["AboutPage.tsx", "DoctorsPage.tsx", "ServicesPage.tsx", "PricingPage.tsx", "ReviewsPage.tsx", "BlogPage.tsx", "FAQPage.tsx", "ContactPage.tsx"]) {
    assert.match(read(page), /EditorialPageHero|data-ui="editorial-page"/, page);
  }
});
```

- [ ] **Step 2: Verify the design assertion fails and functional assertions pass**

Run:

```powershell
node.exe --import tsx --test src/pages/public-pages-contract.test.ts
```

Expected: endpoint/parameter assertions PASS; editorial design assertion FAILS.

- [ ] **Step 3: Adapt listing pages**

Apply reference hero, container, card, filter, typography, spacing, and responsive patterns to About, Doctors, Services, Pricing, Reviews, Blog, FAQ, and Contact. Keep all hooks, endpoint calls, fallback data, `.map()` loops, filter state, submissions, and error states.

For `/contact`, keep the current form and map behavior. Do not replace it with the reference placeholder map.

- [ ] **Step 4: Adapt detail pages**

Use reference editorial layout, media framing, metadata labels, and pill CTAs around the current doctor/service/article data. Keep `useParams`, endpoint IDs/slugs, not-found/loading handling, doctor booking callback, and current rich content.

- [ ] **Step 5: Verify public pages**

Run:

```powershell
node.exe --import tsx --test src/pages/public-pages-contract.test.ts
npm.cmd run lint
npm.cmd run build
git diff --check
```

Expected: PASS, with no route or endpoint changes.

- [ ] **Step 6: Commit public page styling**

```powershell
git add src/pages/AboutPage* src/pages/DoctorsPage* src/pages/DoctorDetailPage* src/pages/ServicesPage* src/pages/ServiceDetailPage.tsx src/pages/PricingPage* src/pages/ReviewsPage.tsx src/pages/BlogPage* src/pages/ArticleDetailPage.tsx src/pages/FAQPage.tsx src/pages/ContactPage.tsx
git commit -m "feat: adapt public pages to reference design"
```

---

### Task 7: Add the Approved Reference Routes and Static Frontend Data

**Files:**
- Modify: `src/App.tsx`
- Create: `src/pages/PeoplePage.tsx`
- Create: `src/pages/ClinicTourPage.tsx`
- Create: `src/pages/EquipmentPage.tsx`
- Create: `src/pages/ResultsPage.tsx`
- Create: `src/pages/TourismPage.tsx`
- Create: `src/pages/AcademyPage.tsx`
- Create: `src/pages/ContactsPage.tsx`
- Create: `src/components/clinic/clinic-space-selector.tsx`
- Create: `src/components/clinic/clinic-tour.tsx`
- Create: `src/components/equipment/equipment-explorer.tsx`
- Create: `src/components/results/before-after-slider.tsx`
- Create: `src/components/results/treatment-case-card.tsx`
- Create: `src/components/team/team-category-nav.tsx`
- Create: `src/components/team/team-member-card.tsx`
- Modify: `src/lib/reference-content/types.ts`
- Create: `src/lib/reference-content/team.ts`
- Create: `src/lib/reference-content/clinic-spaces.ts`
- Create: `src/lib/reference-content/equipment.ts`
- Create: `src/lib/reference-content/tourism.ts`
- Create: `src/lib/reference-content/academy.ts`
- Create: `src/pages/reference-routes.test.ts`

**Interfaces:**
- Consumes: approved route manifest, reference-only static datasets, `EditorialPageHero`, current contact component/workflow.
- Produces: seven buildable lazy routes without removing or aliasing away existing routes.

- [ ] **Step 1: Write the failing route-wiring test**

Create `src/pages/reference-routes.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");

test("wires every approved reference route", () => {
  for (const route of [
    "/people", "/about/clinic-tour", "/about/equipment", "/results",
    "/tourism", "/academy", "/contacts",
  ]) {
    assert.match(app, new RegExp(`path=["']${route.replaceAll("/", "\\/")}["']`), route);
  }
});

test("keeps the original contact route", () => {
  assert.match(app, /path="\/contact"/);
});
```

- [ ] **Step 2: Verify route wiring fails**

Run:

```powershell
node.exe --import tsx --test src/pages/reference-routes.test.ts
```

Expected: FAIL because the seven route elements are absent.

- [ ] **Step 3: Port reference-only typed content and presentational components**

Port the reference `TeamMember`, `ClinicSpace`, `EquipmentItem`, `TreatmentCase`, `TourismFeature`, and `AcademyProgram` shapes into `src/lib/reference-content/types.ts`. Port only static content required for these new pages. Keep file names under `reference-content` to prevent confusion with API services.

Port the listed team, clinic, equipment, and results components. They may own local presentation state such as selected category, selected clinic space, and before/after slider position; they must not call backend endpoints.

- [ ] **Step 4: Implement new pages and route wiring**

Port the reference page compositions. For `ContactsPage`, render the current `Contact` workflow inside the reference contact composition rather than using the reference placeholder-only map.

Add lazy imports and exact route elements to `App.tsx`. Keep `/contact` unchanged and add `/contacts` as the new full editorial contact route.

- [ ] **Step 5: Verify routes, lint, and build**

Run:

```powershell
node.exe --import tsx --test src/lib/site-navigation.test.ts src/pages/reference-routes.test.ts
npm.cmd run lint
npm.cmd run build
git diff --check
```

Expected: PASS; all new lazy imports resolve.

- [ ] **Step 6: Commit new frontend routes**

```powershell
git add src/App.tsx src/pages/PeoplePage.tsx src/pages/ClinicTourPage.tsx src/pages/EquipmentPage.tsx src/pages/ResultsPage.tsx src/pages/TourismPage.tsx src/pages/AcademyPage.tsx src/pages/ContactsPage.tsx src/components/clinic src/components/equipment src/components/results src/components/team src/lib/reference-content src/pages/reference-routes.test.ts
git commit -m "feat: add reference editorial routes"
```

---

### Task 8: Restyle Authentication, Profile, Booking, and Medical Workflows

**Files:**
- Modify: `src/pages/LoginPage.tsx`
- Modify: `src/pages/LoginPage.styles.ts`
- Modify: `src/pages/RegisterPage.tsx`
- Modify: `src/pages/ForgotPasswordPage.tsx`
- Modify: `src/pages/ResetPasswordPage.tsx`
- Modify: `src/pages/VerifyEmailPage.tsx`
- Modify: `src/pages/ProfilePage.tsx`
- Modify: `src/pages/MyBookingsPage.tsx`
- Modify: `src/pages/BookingWizardPage.tsx`
- Modify: `src/pages/PatientRecordsPage.tsx`
- Modify: `src/components/BookingModal.tsx`
- Modify: `src/components/BookingModal.module.css`
- Modify: `src/components/medical/PatientMedicalCard.tsx`
- Create: `src/pages/patient-workflows-contract.test.ts`

**Interfaces:**
- Consumes: `AuthContext`, `BookingContext`, current auth and booking endpoints, form payloads, validation, patient data and medical data.
- Produces: reference-styled patient workflows with unchanged behavior.

- [ ] **Step 1: Write workflow-preservation tests**

Create `src/pages/patient-workflows-contract.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

test("auth pages retain current context methods", () => {
  assert.match(read("LoginPage.tsx"), /login\(/);
  assert.match(read("RegisterPage.tsx"), /register\(/);
  assert.match(read("VerifyEmailPage.tsx"), /verifyCode|resendCode/);
});

test("booking and patient pages retain current integrations", () => {
  assert.match(read("BookingWizardPage.tsx"), /\/api\//);
  assert.match(read("ProfilePage.tsx"), /useAuth\(\)/);
  assert.match(read("PatientRecordsPage.tsx"), /\/api\//);
});

test("workflow pages use the shared functional shell", () => {
  for (const page of ["LoginPage.tsx", "RegisterPage.tsx", "ProfilePage.tsx", "MyBookingsPage.tsx", "BookingWizardPage.tsx", "PatientRecordsPage.tsx"]) {
    assert.match(read(page), /FunctionalPageShell|data-ui="functional-page"/, page);
  }
});
```

- [ ] **Step 2: Verify only the presentation assertion fails**

Run:

```powershell
node.exe --import tsx --test src/pages/patient-workflows-contract.test.ts
```

Expected: functional assertions PASS; shell assertion FAILS.

- [ ] **Step 3: Adapt auth and recovery screens**

Wrap existing forms with the reference paper/ink modal-card vocabulary. Preserve exact field names, validation, query-state handling, context calls, navigation, disabled states, and server error messages. Style error/success states with `error-soft` and `success-soft` tokens.

- [ ] **Step 4: Adapt patient and booking screens**

Use `FunctionalPageShell` and reference cards for profile, appointments, booking wizard, patient records, and medical cards. Preserve step state, selected doctor/service/date/time, request payloads, upload behavior, PDF/export behavior, and API error recovery.

- [ ] **Step 5: Verify workflows and build**

Run:

```powershell
node.exe --import tsx --test src/pages/patient-workflows-contract.test.ts
npm.cmd run lint
npm.cmd run build
git diff --check
git diff -- src/context src/services backend deploy .github
```

Expected: tests PASS; the final diff command is empty.

- [ ] **Step 6: Commit patient workflow presentation**

```powershell
git add src/pages/LoginPage* src/pages/RegisterPage.tsx src/pages/ForgotPasswordPage.tsx src/pages/ResetPasswordPage.tsx src/pages/VerifyEmailPage.tsx src/pages/ProfilePage.tsx src/pages/MyBookingsPage.tsx src/pages/BookingWizardPage.tsx src/pages/PatientRecordsPage.tsx src/components/BookingModal* src/components/medical/PatientMedicalCard.tsx src/pages/patient-workflows-contract.test.ts
git commit -m "feat: restyle patient workflows"
```

---

### Task 9: Restyle Admin, Doctor, and System Screens

**Files:**
- Modify: `src/pages/AdminDashboard.tsx`
- Modify: `src/pages/AdminBookings.tsx`
- Modify: `src/pages/AdminDoctors.tsx`
- Modify: `src/pages/AdminPatients.tsx`
- Modify: `src/pages/AdminBlog.tsx`
- Modify: `src/pages/AdminBlog.module.css`
- Modify: `src/pages/AdminReviews.tsx`
- Modify: `src/pages/DoctorDashboard.tsx`
- Modify: `src/pages/DoctorDashboard.styles.ts`
- Modify: `src/pages/DoctorDashboard.module.css`
- Modify: `src/pages/NotFoundPage.tsx`
- Create: `src/pages/operational-pages-contract.test.ts`

**Interfaces:**
- Consumes: current admin/doctor endpoints, mutations, confirmations, uploads, review moderation, patient detail dialogs, role guards.
- Produces: coherent reference-styled operational screens without changing permissions or contracts.

- [ ] **Step 1: Write operational contract tests**

Create `src/pages/operational-pages-contract.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

test("admin pages keep API mutations and dynamic reads", () => {
  for (const page of ["AdminBookings.tsx", "AdminDoctors.tsx", "AdminPatients.tsx", "AdminBlog.tsx", "AdminReviews.tsx"]) {
    assert.match(read(page), /axios\.(get|post|put|patch|delete)/, page);
  }
});

test("patient administration retains detail and delete actions", () => {
  const page = read("AdminPatients.tsx");
  assert.match(page, /fetchPatientDetails/);
  assert.match(page, /handleDelete/);
  assert.match(page, /\/api\/admin\/patients/);
});

test("operational screens use the shared visual shell", () => {
  for (const page of ["AdminDashboard.tsx", "AdminBookings.tsx", "AdminDoctors.tsx", "AdminPatients.tsx", "AdminBlog.tsx", "AdminReviews.tsx", "DoctorDashboard.tsx"]) {
    assert.match(read(page), /FunctionalPageShell|data-ui="functional-page"/, page);
  }
});
```

- [ ] **Step 2: Verify the visual shell assertion fails**

Run:

```powershell
node.exe --import tsx --test src/pages/operational-pages-contract.test.ts
```

Expected: API/action assertions PASS; shell assertion FAILS.

- [ ] **Step 3: Adapt admin screens**

Use `FunctionalPageShell` with wide layout. Restyle stat cards, filters, tables, cards, dialogs, badges, destructive confirmations, file inputs, empty/loading states, and responsive overflow. Preserve all Axios calls, payloads, optimistic updates, confirmation prompts, selected entities, and toasts.

- [ ] **Step 4: Adapt doctor dashboard and system pages**

Apply the same system to doctor appointments/records and the not-found page. Preserve role-sensitive actions, medical record mutation, navigation destinations, and 404 behavior.

- [ ] **Step 5: Verify operational pages and prohibited-file diff**

Run:

```powershell
node.exe --import tsx --test src/pages/operational-pages-contract.test.ts
npm.cmd run lint
npm.cmd run build
git diff --check
git diff -- backend deploy .github .env.example src/context src/services
```

Expected: all checks PASS and prohibited-file diff is empty.

- [ ] **Step 6: Commit operational presentation**

```powershell
git add src/pages/AdminDashboard.tsx src/pages/AdminBookings.tsx src/pages/AdminDoctors.tsx src/pages/AdminPatients.tsx src/pages/AdminBlog.tsx src/pages/AdminBlog.module.css src/pages/AdminReviews.tsx src/pages/DoctorDashboard.tsx src/pages/DoctorDashboard.styles.ts src/pages/DoctorDashboard.module.css src/pages/NotFoundPage.tsx src/pages/operational-pages-contract.test.ts
git commit -m "feat: restyle operational dashboards"
```

---

### Task 10: Responsive, Accessibility, Media, and Interaction Audit

**Files:**
- Modify: only frontend files identified by failed checks under `src/**`, `public/**`, or `index.html`
- Create: `src/accessibility-contract.test.ts`

**Interfaces:**
- Consumes: completed frontend.
- Produces: keyboard-safe, reduced-motion-safe, overflow-safe UI across desktop, tablet, and mobile.

- [ ] **Step 1: Write the accessibility/media source contract test**

Create `src/accessibility-contract.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./index.css", import.meta.url), "utf8");
const media = readFileSync(new URL("./components/media/clinic-background-media.tsx", import.meta.url), "utf8");

test("global styles provide focus and reduced-motion behavior", () => {
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("clinic media retains fallback and safe playback attributes", () => {
  for (const contract of ["playsInline", "muted", "autoPlay", "loop", "poster", "onError"]) {
    assert.match(media, new RegExp(contract));
  }
});
```

- [ ] **Step 2: Run the complete test set**

Run:

```powershell
node.exe --import tsx --test src/**/*.test.ts src/**/*.test.tsx
```

Expected: PASS. If PowerShell glob expansion is incomplete, enumerate with:

```powershell
$tests = rg --files src | Where-Object { $_ -match '\.test\.tsx?$' }
node.exe --import tsx --test $tests
```

- [ ] **Step 3: Start frontend and backend for smoke testing**

Run the project’s real development command with a valid local `.env` supplied by the user/environment:

```powershell
npm.cmd run dev
```

If external services are unavailable, keep the servers running, record the exact unavailable dependency, and test frontend fallback/error states rather than changing application code or inventing secrets.

- [ ] **Step 4: Exercise route and asset HTTP checks**

Check all public routes at `360`, `768`, `1024`, and `1440` viewport widths:

```text
/
/about
/doctors
/services
/pricing
/reviews
/blog
/faq
/contact
/contacts
/people
/about/clinic-tour
/about/equipment
/results
/tourism
/academy
```

Check direct HTTP responses for:

```text
/videos/familydent.mp4
/images/clinic_about.jpg
```

Confirm no horizontal overflow, clipped navigation, unreadable video text, broken image, missing focus ring, trapped dialog focus, or inaccessible mobile action.

- [ ] **Step 5: Exercise protected interactions without bypassing guards**

Verify:

```text
unauthenticated booking redirects to /login with the current toast
login/register/recovery forms retain payloads and validation
authenticated booking retains doctor/service/date/time selection
admin and doctor routes remain role-protected
urgent request retains submit/disabled/error/success behavior
menus, dropdowns, dialogs, before/after slider, filters, and mobile navigation work
```

Do not seed roles or modify authentication to make these checks pass.

- [ ] **Step 6: Fix only concrete frontend audit failures**

For every failure, write the smallest failing test when it is representable in DOM/source behavior, verify it fails, patch the owning frontend component, and rerun that test. CSS-only viewport corrections are verified by the failing viewport reproduction plus lint/build.

- [ ] **Step 7: Verify the complete audit**

Run:

```powershell
$tests = rg --files src | Where-Object { $_ -match '\.test\.tsx?$' }
node.exe --import tsx --test $tests
npm.cmd run lint
npm.cmd run build
git diff --check
```

Expected: all commands exit `0`.

- [ ] **Step 8: Commit audit fixes**

```powershell
git add src public index.html
git commit -m "fix: complete responsive visual audit"
```

Skip the commit if the audit required no changes.

---

### Task 11: Final Functional and Git-Diff Verification

**Files:**
- Modify: none unless a verification failure produces a scoped frontend fix with a failing regression test.

**Interfaces:**
- Consumes: all completed tasks.
- Produces: evidence for the final report.

- [ ] **Step 1: Run every automated check fresh**

```powershell
$tests = rg --files src | Where-Object { $_ -match '\.test\.tsx?$' }
node.exe --import tsx --test $tests
npm.cmd run lint
npm.cmd run build
```

Record exact test count, failures, lint exit code, build exit code, bundle warnings, and build output directory.

- [ ] **Step 2: Verify Git scope**

Run:

```powershell
git status --short
git diff 4d12f20 --name-status
git diff 4d12f20 -- backend deploy .github .env.example package.json package-lock.json tsconfig.json vite.config.ts
git diff --check 4d12f20
```

Expected: frontend/design/docs changes only. The prohibited/config diff must be empty unless a strictly necessary font/frontend asset line was approved and documented; this plan requires no such config change.

- [ ] **Step 3: Verify functional contracts by search**

Run:

```powershell
rg -n "\/api\/|axios\.|fetch\(|onSubmit|openBooking|useAuth|ProtectedRoute|UserRole" src
git diff 4d12f20 -- src/context src/services src/types.ts
```

Expected: functional call sites remain; context/service/type diff is empty.

- [ ] **Step 4: Perform final HTTP smoke checks**

With the application running, request every public route and both media assets. Record status codes. For protected routes, record the expected redirect/guard result rather than forcing HTTP `200` behind authorization.

- [ ] **Step 5: Review every changed frontend file**

Run:

```powershell
git diff 4d12f20 --stat
git diff 4d12f20 -- src public index.html
```

Review the full diff for deleted handlers, changed endpoints, changed field names, hard-coded dynamic data, accidental uploads, mojibake, missing alt text, and unresolved conflict markers.

- [ ] **Step 6: Prepare the final report**

Report exactly:

```text
Transferred: pages, components, shell, hero, routes, responsive and motion work
Assets: exact added video, poster/image, SVG/brand files, and fonts
Preserved logic: API-driven sections, booking, auth, forms, admin, medical, role guards, errors
Untouched: backend, API implementation, bots, database, auth internals, integrations, infrastructure
Checks: exact test/lint/build/HTTP results
Git diff: major changed frontend files and commits
```

Do not state that a check passed unless its command was run in this final task and exited successfully.
