import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const theme = readFileSync(new URL("./theme.css", import.meta.url), "utf8");

test("defines the canonical Family Dent visual tokens", () => {
  for (const token of [
    "--color-paper", "--color-ink", "--color-accent", "--color-trust",
    "--font-display", "--font-body", "--font-mono", "--radius-pill",
    "--shadow-card", "--dur-section",
  ]) {
    assert.match(theme, new RegExp(token.replaceAll("-", "\\-")));
  }
});

test("keeps the target muted surface separate from editorial muted text", () => {
  assert.match(theme, /--color-editorial-muted:\s*oklch\(49% 0\.012 85\)/);
  assert.match(theme, /--color-muted:\s*var\(--muted\)/);
  assert.match(theme, /--muted:\s*oklch\(97\.8% 0\.006 85\)/);
});
