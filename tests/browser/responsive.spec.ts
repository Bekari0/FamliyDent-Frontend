import { test, expect, openPage, expectTextFits } from "./fixtures";

for (const [width, size] of [
  [767, 32],
  [768, 44],
  [1023, 44],
  [1024, 48],
]) {
  test(`the heading scale switches to ${size}px at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await openPage(page, "/services");
    await expect(page.locator("main h1")).toHaveCSS("font-size", `${size}px`);
  });
}

const paths = [
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
];

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  for (const path of paths) {
    test(`${path} fits at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 720 : 900 });
      await openPage(page, path);
      await expectTextFits(page);
      await expect(page.locator("main")).toHaveCount(1);
      // Lazy images must not resize galleries or create overflow further down the page.
      await page.evaluate(() =>
        scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
      );
      await expectTextFits(page);
    });
  }
}

for (const path of [
  "/",
  "/services",
  "/services/therapy",
  "/doctors",
  "/about",
  "/contacts",
  "/blog",
  "/results",
  "/reviews",
  "/blog/kak-vybrat-viniry",
  "/tourism",
]) {
  test(`${path} reflows when the default text size is doubled`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 720 });
    await openPage(page, path);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await expectTextFits(page);
    const clippedHero = await page
      .locator("main section")
      .first()
      .evaluate((section) => {
        const box = section.getBoundingClientRect();
        return [...section.querySelectorAll("h1, h2, p, button")]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return (
              rect.width > 0 &&
              (rect.top < box.top - 1 || rect.bottom > box.bottom + 1)
            );
          })
          .map((element) => element.textContent?.trim());
      });
    expect(clippedHero, "hero content must grow with the font size").toEqual(
      [],
    );
  });
}

test("tablet hero uses the available width and regular sections share a compact rhythm", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await openPage(page, "/");
  const hero = await page.locator(".home-hero").boundingBox();
  expect(hero!.height).toBeLessThanOrEqual(700);
  const heading = page.locator("main h1");
  expect(
    await heading.evaluate((element) => getComputedStyle(element).fontSize),
  ).toBe("40px");
  const services = page.locator("main section").filter({
    has: page.getByRole("heading", { name: "Основные услуги клиники" }),
  });
  expect(
    await services.evaluate((element) => getComputedStyle(element).paddingTop),
  ).toBe("64px");
});

test("tourism hero keeps all text on a short landscape screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await openPage(page, "/tourism");
  const bounds = await page.locator(".tourism-hero").boundingBox();
  const title = await page.locator("main h1").boundingBox();
  expect(title!.y).toBeGreaterThanOrEqual(bounds!.y);
  expect(title!.y + title!.height).toBeLessThanOrEqual(
    bounds!.y + bounds!.height,
  );
});

test("clinic gallery geometry does not depend on image loading", async ({
  page,
}) => {
  await page.route("**/images/**", (route) => route.abort());
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPage(page, "/about");
  const first = page.locator("figure").first();
  const before = await first.boundingBox();
  expect(before!.width / before!.height).toBeCloseTo(4 / 3, 1);
  await page.evaluate(() =>
    scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
  );
  const after = await first.boundingBox();
  expect(after!.height).toBeCloseTo(before!.height, 0);
});
