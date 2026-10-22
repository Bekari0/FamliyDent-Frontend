import AxeBuilder from "@axe-core/playwright";
import { test, expect, openPage } from "./fixtures";

for (const width of [390, 1440]) {
  for (const path of [
    "/",
    "/services",
    "/services/therapy",
    "/doctors",
    "/results",
    "/reviews",
    "/about",
    "/contacts",
    "/blog",
    "/blog/kak-vybrat-viniry",
    "/tourism",
  ]) {
    test(`${path} accessibility at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await openPage(page, path);
      // Visit every section so lazy content participates in the audit.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          scrollTo({ top: y, behavior: "instant" });
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => resolve()),
          );
        }
      });
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        result.violations.map((violation) => ({
          rule: violation.id,
          nodes: violation.nodes.map((node) => ({
            target: node.target,
            reason: node.failureSummary,
          })),
        })),
      ).toEqual([]);
    });
  }
}

test("booking dialog has an accessible name and labelled controls", async ({
  page,
}) => {
  await openPage(page, "/services");
  await page
    .getByRole("button", { name: /Записаться на консультацию/ })
    .first()
    .click();
  await expect(
    page.getByRole("dialog", { name: "Запись на приём" }),
  ).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});
