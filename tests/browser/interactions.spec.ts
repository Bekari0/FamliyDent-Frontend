import { test, expect, openPage } from "./fixtures";
import { loadSeedContent } from "../../backend/scripts/seeds/index";

test("booking contains keyboard focus, closes with Escape and restores its opener", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await openPage(page, "/services");
  const opener = page
    .getByRole("button", { name: /Записаться на консультацию/ })
    .first();
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Запись на приём" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Ваше имя", { exact: false })).toBeVisible();
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate(
        (element) =>
          element.contains(document.activeElement) ||
          document.activeElement === document.body,
      ),
    ).toBe(true);
  }
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  const submit = dialog.getByRole("button", {
    name: "Записаться на консультацию",
  });
  await submit.scrollIntoViewIfNeeded();
  const bounds = await dialog.boundingBox();
  const button = await submit.boundingBox();
  expect(button!.x + button!.width).toBeLessThanOrEqual(
    bounds!.x + bounds!.width,
  );
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("a doctor on the homepage opens their profile and carries the selection into booking", async ({
  page,
}) => {
  await openPage(page, "/");
  await page
    .getByRole("button", { name: /Подробнее о враче/ })
    .first()
    .click();
  const profile = page.getByRole("dialog");
  const name = await profile.locator("#doctor-profile-title").innerText();
  await profile.getByRole("button", { name: "Записаться к врачу" }).click();
  const booking = page.getByRole("dialog", { name: "Запись на приём" });
  await expect(booking).toBeVisible();
  await expect(booking.locator("select")).toHaveValue(name);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const genericBooking = page
    .locator("header")
    .getByRole("button", { name: "Записаться", exact: true });
  await genericBooking.focus();
  await genericBooking.click();
  await expect(
    page.getByRole("dialog", { name: "Запись на приём" }).locator("select"),
  ).toHaveValue("");
});

test("the comparison slider handles Home and End without scrolling the document", async ({
  page,
}) => {
  await openPage(page, "/results");
  const slider = page.getByRole("slider").first();
  await slider.focus();
  await page.waitForTimeout(50);
  const top = await page.evaluate(() => scrollY);
  await page.keyboard.press("End");
  await expect(slider).toHaveAttribute("aria-valuenow", "100");
  expect(await page.evaluate(() => scrollY)).toBe(top);
  await page.keyboard.press("Home");
  await expect(slider).toHaveAttribute("aria-valuenow", "0");
  expect(await page.evaluate(() => scrollY)).toBe(top);
});

test("an unknown page offers a working route back to the homepage", async ({
  page,
}) => {
  await openPage(page, "/missing-page");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Страница не найдена",
  );
  await page.getByRole("link", { name: "На главную", exact: true }).click();
  await expect(page).toHaveURL("/");
});

test("an article shows loading until the request finishes", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/content/blogPosts", async (route) => {
    await gate;
    await route.fallback();
  });
  await page.goto("/blog/kak-vybrat-viniry");
  await expect(page.getByRole("status")).toHaveText("Загрузка статьи…");
  await expect(
    page.getByText("Статья не найдена", { exact: true }),
  ).toHaveCount(0);
  release();
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(
    "Статья не найдена",
  );
});

test("desktop reviews remain scrollable and keyboard reachable without duplicate cards", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPage(page, "/");
  const region = page.getByRole("region", {
    name: "Отзывы пациентов на картах",
  });
  await region.focus();
  await page.keyboard.press("End");
  await expect
    .poll(() => region.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
  const content = await loadSeedContent();
  await expect(region.locator("article")).toHaveCount(content.reviews.length);
});
