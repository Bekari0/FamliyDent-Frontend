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
