import assert from "node:assert/strict";
import test from "node:test";
import {
  PUBLIC_ROUTE_PATHS,
  PRIMARY_NAV_ITEMS,
  isKnownRoute,
} from "./site-navigation";

const requiredExistingRoutes = [
  "/", "/about", "/contact", "/faq", "/reviews", "/pricing",
  "/services", "/doctors", "/blog", "/profile", "/book",
  "/admin", "/doctor",
];

const requiredReferenceRoutes = [
  "/people", "/about/clinic-tour", "/about/equipment", "/results",
  "/tourism", "/academy", "/contacts",
];

test("keeps every functional route and adds approved reference routes", () => {
  for (const route of [...requiredExistingRoutes, ...requiredReferenceRoutes]) {
    assert.equal(isKnownRoute(route), true, route);
  }
  assert.equal(new Set(PUBLIC_ROUTE_PATHS).size, PUBLIC_ROUTE_PATHS.length);
});

test("primary navigation exposes booking-safe public destinations", () => {
  assert.ok(PRIMARY_NAV_ITEMS.some((item) => item.href === "/services"));
  assert.ok(PRIMARY_NAV_ITEMS.some((item) => item.href === "/doctors"));
  assert.ok(PRIMARY_NAV_ITEMS.some((item) => item.href === "/contacts"));
});
