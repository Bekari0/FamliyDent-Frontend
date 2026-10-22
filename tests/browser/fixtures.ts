import { test as base, expect, type Page } from "@playwright/test";
import { loadSeedContent } from "../../backend/scripts/seeds/index";

// Public bootstrap content is deterministic. Browser tests never touch the clinic database.
export const test = base.extend({
  page: async ({ page }, use) => {
    const content = await loadSeedContent();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      localStorage.setItem("familydent-cookie-consent-v1", "necessary");
    });
    await page.route("**/*", (route) => {
      const url = new URL(route.request().url());
      return url.hostname === "127.0.0.1" ? route.fallback() : route.abort();
    });
    await page.route("**/api/content/*", async (route) => {
      const type = new URL(route.request().url()).pathname.split("/").pop()!;
      await route.fulfill({ json: { data: content[type] ?? [] } });
    });
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({ json: { user: null, csrfToken: null } }),
    );
    await use(page);
    expect(errors, "browser JavaScript errors").toEqual([]);
  },
});
export { expect };

export async function openPage(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("main h1")).toHaveCount(1);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
}

export async function expectTextFits(page: Page) {
  const clipped = await page
    .locator("main h1, main h2, main h3, .service-tile strong")
    .evaluateAll((elements) =>
      elements
        .filter(
          (element) =>
            element.clientWidth > 0 &&
            element.scrollWidth > element.clientWidth + 2,
        )
        .map((element) => element.textContent?.trim()),
    );
  expect(
    clipped,
    "headings and service names must stay inside their boxes",
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "document overflow",
  ).toBe(true);
}
