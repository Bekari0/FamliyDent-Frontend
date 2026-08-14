import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (name: string) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

test("public pages use the editorial design system", () => {
  for (const page of ["AboutPage.tsx", "DoctorsPage.tsx", "ServicesPage.tsx", "PricingPage.tsx", "ReviewsPage.tsx", "BlogPage.tsx", "FAQPage.tsx", "ContactPage.tsx"]) {
    assert.match(read(page), /EditorialPageHero|data-ui="editorial-page"/, page);
  }
});

test("pricing definition groups directly own their terms and definitions", () => {
  assert.match(
    read("PricingPage.tsx"),
    /className=\{styles\.serviceItem\}>\s*<dt>[\s\S]*<\/dt>\s*<dd className=\{styles\.priceRow\}>/,
  );
});
