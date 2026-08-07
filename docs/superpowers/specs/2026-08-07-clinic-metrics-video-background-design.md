# Clinic Metrics Video Background Design

## Scope

Update only `src/components/home/clinic-metrics-section.tsx`, the second section of the home page. Use the existing `public/videos/familydent.mp4` asset through `src="/videos/familydent.mp4"`.

## Design

The section remains the positioning context and clips the background with `relative overflow-hidden`. The video fills the section with `absolute inset-0 w-full h-full object-cover object-center`, stays non-interactive, and occupies `z-0`. A single `bg-black/30` overlay occupies `z-[1]`. Existing text and metric-card containers remain at `relative z-10`.

Remove the section's opaque background and the existing extra dark/gradient overlays because they obscure the video. Preserve all text, layout, sizing, heading styles, metric-card styling, animation behavior, and every other component.

## Verification

Run a static regression assertion for the required markup, then run TypeScript and the production build. Start Vite and verify `/videos/familydent.mp4` returns HTTP 200. In a browser, verify the video is playing, its `currentTime` advances between observations, moving frames are visible, and the content remains readable over the single overlay.
