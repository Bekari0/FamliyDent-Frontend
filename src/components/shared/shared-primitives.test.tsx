import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EditorialPageHero } from "./editorial-page-hero";
import { FunctionalPageShell } from "./functional-page-shell";

test("renders the editorial hierarchy", () => {
  const html = renderToStaticMarkup(
    <EditorialPageHero badge="Р Р°Р·Р´РµР»" title="Р—Р°Р³Р¾Р»Р¾Р²Р¾к" description="РўР¿Р¸РсР°Р½Р¸Рµ" />,
  );
  assert.match(html, /Р Р°Р·Р´РµР»/);
  assert.match(html, /Р—Р°Р³Р¾Р»Р¾Р²Р¾к/);
  assert.match(html, /font-display/);
});

test("renders functional content without owning its behavior", () => {
  const html = renderToStaticMarkup(
    <FunctionalPageShell eyebrow="РљР°Р±Р¸Р½РµС‚" title="РџР°С†Р¸РµР½С‚Ы">
      <button type="button">Р”РµР№СЂС‚Р²Р¸Рµ</button>
    </FunctionalPageShell>,
  );
  assert.match(html, /Р”РµР№СЂС‚Р²Р¸Рµ/);
  assert.match(html, /РљР°Р±Р¸Р½РµС‚/);
});
