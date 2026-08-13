import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BackgroundVideo } from "../BackgroundVideo";
import { CentralLogo } from "../CentralLogo";
import { ClinicBackgroundMedia } from "./clinic-background-media";

test("renders the orbital Family Dent mark", () => {
  const html = renderToStaticMarkup(<CentralLogo />);
  assert.match(html, /aria-label="Family Dent"/);
  assert.match(html, /data-orbital-rings="true"/);
});

test("disables the ambient background pulse for reduced-motion users", () => {
  const html = renderToStaticMarkup(<BackgroundVideo />);
  assert.match(html, /motion-reduce:animate-none/);
});

test("renders distinct documented central-logo color modes", () => {
  const emerald = renderToStaticMarkup(<CentralLogo colorMode="emerald-gradient" />);
  const white = renderToStaticMarkup(<CentralLogo colorMode="white" />);
  const glowingWhite = renderToStaticMarkup(<CentralLogo colorMode="glowing-white" />);

  assert.match(emerald, /data-color-mode="emerald-gradient"/);
  assert.match(emerald, /fill="url\(#family-dent-emerald-gradient\)"/);
  assert.match(white, /data-color-mode="white"/);
  assert.match(white, /data-logo-glow="false"/);
  assert.match(glowingWhite, /data-color-mode="glowing-white"/);
  assert.match(glowingWhite, /data-logo-glow="true"/);
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
