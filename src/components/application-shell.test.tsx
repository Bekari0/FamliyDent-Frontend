import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const header = readFileSync(new URL("./Header.tsx", import.meta.url), "utf8");
const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const headerStyles = readFileSync(new URL("../styles/components/header.css", import.meta.url), "utf8");

test("header retains auth and role actions while adopting grouped navigation", () => {
  assert.match(header, /useAuth\(\)/);
  assert.match(header, /handleLogout/);
  assert.match(header, /isAdmin/);
  assert.match(header, /isDoctor/);
  assert.match(header, /ABOUT_NAV_ITEMS/);
  assert.match(header, /MORE_NAV_ITEMS/);
  assert.match(header, /data-ui="reference-header"/);
});

test("application shell retains providers and operational widgets", () => {
  for (const contract of ["AuthProvider", "BookingProvider", "Seo", "Analytics", "ChatWidget", "Toaster"]) {
    assert.match(app, new RegExp(contract));
  }
});

test("mobile navigation remains named, closable, and keyboard visible", () => {
  assert.match(header, /<SheetTitle[^>]*>Меню<\/SheetTitle>/);
  assert.match(header, /const handleLogout = async \(\) => \{\s*setMobileMenuOpen\(false\);\s*await logout\(\)/);
  assert.match(header, /onFocusCapture=\{\(\) => setIsVisible\(true\)\}/);
  assert.match(headerStyles, /\.header-nav-group\[data-popup-open\] \.header-nav-group-icon/);
});
