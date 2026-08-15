import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const login = readFileSync(new URL("../pages/LoginPage.styles.ts", import.meta.url), "utf8");
const services = readFileSync(new URL("../components/Services.styles.ts", import.meta.url), "utf8");
const faq = readFileSync(new URL("../components/FAQ.styles.ts", import.meta.url), "utf8");
const profile = readFileSync(new URL("../pages/ProfilePage.tsx", import.meta.url), "utf8");

test("login card and heading fit narrow viewports", () => {
  assert.match(login, /w-full max-w-md/);
  assert.match(login, /text-\[clamp\(1\.65rem,6vw,2\.25rem\)\]/);
  assert.doesNotMatch(login, /break-words/);
});

test("service and FAQ copy use the readable editorial text token", () => {
  assert.doesNotMatch(services, /text-muted/);
  assert.match(services, /text-editorial-muted/);
  assert.match(faq, /accordionContent[^\n]*text-editorial-muted/);
});

test("FAQ uses a neutral visible keyboard focus treatment", () => {
  assert.match(faq, /focus-visible:ring-2/);
  assert.match(faq, /focus-visible:ring-ink\/20/);
});

test("profile uses the desktop canvas and an asymmetric responsive grid", () => {
  assert.match(profile, /max-w-\[1440px\]/);
  assert.match(profile, /lg:grid-cols-\[minmax\(360px,0\.85fr\)_minmax\(0,1\.75fr\)\]/);
});
