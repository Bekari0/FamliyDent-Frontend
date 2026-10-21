import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Link, MemoryRouter } from "react-router-dom";
import { Reveal, RevealGroup, RevealHeading } from "./reveal";

test("server-rendered entrances keep semantic headings, text and attributes visible", () => {
  const html = renderToStaticMarkup(
    <RevealHeading level={2} variant="display" id="care">
      Забота <em>о вашей улыбке</em>
    </RevealHeading>,
  );
  assert.match(html, /^<h2 id="care"/);
  assert.match(html, /Забота <em>о вашей улыбке<\/em>/);
  assert.equal((html.match(/Забота/g) ?? []).length, 1);
  assert.doesNotMatch(html, /opacity:0|hidden|aria-hidden|translate:/);
});

test("reveal groups preserve list and link semantics without introducing layout wrappers", () => {
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <RevealGroup as="ul" aria-label="Направления">
        <Reveal as="li" data-ui-scheme="default">
          <Reveal as={Link} to="/services" aria-label="Все услуги">
            Услуги
          </Reveal>
        </Reveal>
      </RevealGroup>
    </MemoryRouter>,
  );
  assert.match(html, /^<ul aria-label="Направления"/);
  assert.match(html, /<li data-ui-scheme="default"/);
  assert.match(html, /<a aria-label="Все услуги"[^>]*href="\/services"/);
  assert.doesNotMatch(html, /<div|role="button"|reveal-state="pending"/);
});
