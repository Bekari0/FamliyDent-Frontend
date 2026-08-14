import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

function source(path: string): string {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

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
