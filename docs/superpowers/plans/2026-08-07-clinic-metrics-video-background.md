# Clinic Metrics Video Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Display the existing clinic video as the visible, playing background of the home page's second section.

**Architecture:** Keep the background layers inside `ClinicMetricsSection`. The video is the bottom layer, one translucent overlay is the middle layer, and the existing content containers remain above both.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Vite 6

## Global Constraints

- Use only `public/videos/familydent.mp4`; do not create, copy, rename, or replace video assets.
- Preserve section copy, layout, card dimensions, heading styles, all other sections, Header, and Footer.
- Display the video at every viewport size without adding responsive playback conditions.

---

### Task 1: Correct the Clinic Metrics Background Layers

**Files:**
- Modify: `src/components/home/clinic-metrics-section.tsx`

**Interfaces:**
- Consumes: the public asset URL `/videos/familydent.mp4`
- Produces: `ClinicMetricsSection` with one background video and one overlay

- [ ] **Step 1: Run the failing static regression assertion**

Run a Node assertion that reads the component and requires no opaque section background, exact video attributes/classes, exactly one overlay, `bg-black/30 z-[1]`, and existing content at `relative z-10`.

Expected: FAIL because the section has `bg-[#1A1A1A]`, the overlay stack has three layers, and no overlay uses `z-[1]`.

- [ ] **Step 2: Implement the minimal layer correction**

Remove `bg-[#1A1A1A]` from the section. Keep the existing video and its required attributes and sizing classes at `z-0`. Replace all three overlay nodes with:

```tsx
<div className="absolute inset-0 bg-black/30 pointer-events-none z-[1]" />
```

Do not alter copy, layout, card styling, or motion behavior.

- [ ] **Step 3: Re-run the static regression assertion**

Expected: PASS.

- [ ] **Step 4: Verify compilation and build**

Run `npm run lint` and `npm run build`.

Expected: both exit with status 0.

- [ ] **Step 5: Verify in a browser**

Start Vite, confirm `/videos/familydent.mp4` returns HTTP 200, then inspect the second section at desktop and mobile widths. Confirm the video reports `paused === false`, `readyState >= 2`, and increasing `currentTime`; compare screenshots captured at different times to verify moving frames and readable foreground content.
