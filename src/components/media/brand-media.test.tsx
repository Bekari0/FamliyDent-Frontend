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
