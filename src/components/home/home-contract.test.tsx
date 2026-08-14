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
