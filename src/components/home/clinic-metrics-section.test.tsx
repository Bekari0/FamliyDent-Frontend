import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ClinicMetricsSection } from "./clinic-metrics-section";

test("renders the existing clinic video below one translucent overlay", () => {
  const markup = renderToStaticMarkup(<ClinicMetricsSection />);

  assert.match(
    markup,
    /<section[^>]*class="[^"]*relative[^"]*overflow-hidden[^"]*"/,
  );
  assert.doesNotMatch(markup, /<section[^>]*class="[^"]*bg-\[#1A1A1A\][^"]*"/);
  assert.doesNotMatch(markup, /<video[^>]*>/);
  assert.match(
    markup,
    /<div class="absolute inset-0 bg-black\/30 pointer-events-none z-\[1\]"><\/div>/,
  );
  assert.equal((markup.match(/pointer-events-none z-\[1\]/g) ?? []).length, 1);
  assert.ok((markup.match(/relative z-10/g) ?? []).length >= 2);
});
