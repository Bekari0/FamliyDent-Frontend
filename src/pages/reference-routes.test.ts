import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");

test("wires every approved reference route", () => {
  for (const route of [
    "/people", "/about/clinic-tour", "/about/equipment", "/results",
    "/tourism", "/academy", "/contacts",
  ]) {
    assert.match(app, new RegExp(`path=["']${route.replaceAll("/", "\\/")}["']`), route);
  }
});

test("keeps the original contact route", () => {
  assert.match(app, /path="\/contact"/);
});

test("loads every approved page through a named lazy import", async () => {
  const pages = [
    "PeoplePage", "ClinicTourPage", "EquipmentPage", "ResultsPage",
    "TourismPage", "AcademyPage", "ContactsPage",
  ] as const;

  for (const page of pages) {
    assert.match(
      app,
      new RegExp(`const ${page} = lazy\\(\\(\\) => import\\(["']\\./pages/${page}["']\\)`),
      page,
    );
    const module = await import(`./${page}.tsx`);
    assert.equal(typeof module[page], "function", page);
  }
});

test("ships typed, frontend-only reference datasets", async () => {
  const files = ["team", "clinic-spaces", "equipment", "tourism", "academy"];
  for (const file of files) {
    const url = new URL(`../lib/reference-content/${file}.ts`, import.meta.url);
    assert.equal(existsSync(url), true, `${file}.ts is missing`);
    const source = readFileSync(url, "utf8");
    assert.doesNotMatch(source, /axios|fetch\s*\(|\/api\//, file);
  }

  const [{ teamMembers }, { clinicSpaces }, { equipmentItems }, { tourismFeatures }, { academyPrograms }] = await Promise.all([
    import("../lib/reference-content/team.ts"),
    import("../lib/reference-content/clinic-spaces.ts"),
    import("../lib/reference-content/equipment.ts"),
    import("../lib/reference-content/tourism.ts"),
    import("../lib/reference-content/academy.ts"),
  ]);

  assert.ok(teamMembers.some((member) => member.category === "doctors"));
  assert.ok(teamMembers.some((member) => member.category === "nurses"));
  assert.ok(clinicSpaces.length >= 5);
  assert.ok(equipmentItems.length >= 5);
  assert.ok(tourismFeatures.length >= 4);
  assert.ok(academyPrograms.length >= 4);
});

test("selection models keep clinic, equipment, slider, and team interactions bounded", async () => {
  const [{ resolveClinicSpace }, { resolveEquipmentItem }, { moveSliderPosition }, { getVisibleTeamCategories }] = await Promise.all([
    import("../components/clinic/clinic-tour.tsx"),
    import("../components/equipment/equipment-explorer.tsx"),
    import("../components/results/before-after-slider.tsx"),
    import("../components/team/team-category-nav.tsx"),
  ]);
  const { clinicSpaces } = await import("../lib/reference-content/clinic-spaces.ts");
  const { equipmentItems } = await import("../lib/reference-content/equipment.ts");

  assert.equal(resolveClinicSpace(clinicSpaces, clinicSpaces[2].id)?.id, clinicSpaces[2].id);
  assert.equal(resolveClinicSpace(clinicSpaces, "missing")?.id, clinicSpaces[0].id);
  assert.equal(resolveEquipmentItem(equipmentItems, equipmentItems[3].id)?.id, equipmentItems[3].id);
  assert.equal(resolveEquipmentItem(equipmentItems, "missing")?.id, equipmentItems[0].id);
  assert.equal(moveSliderPosition(3, "ArrowLeft"), 0);
  assert.equal(moveSliderPosition(98, "ArrowRight"), 100);
  assert.equal(moveSliderPosition(50, "Home"), 0);
  assert.deepEqual(getVisibleTeamCategories("nurses"), ["nurses"]);
  assert.equal(getVisibleTeamCategories("all").length, 5);
});

test("interactive reference controls expose semantic state and reduced-motion fallbacks", async () => {
  const [{ ClinicSpaceSelector }, { EquipmentExplorer }, { BeforeAfterSlider }, { TeamCategoryNav }] = await Promise.all([
    import("../components/clinic/clinic-space-selector.tsx"),
    import("../components/equipment/equipment-explorer.tsx"),
    import("../components/results/before-after-slider.tsx"),
    import("../components/team/team-category-nav.tsx"),
  ]);
  const { clinicSpaces } = await import("../lib/reference-content/clinic-spaces.ts");
  const { equipmentItems } = await import("../lib/reference-content/equipment.ts");

  const clinic = renderToStaticMarkup(React.createElement(ClinicSpaceSelector, {
    spaces: clinicSpaces.slice(0, 2), activeSpaceId: clinicSpaces[0].id, onSelectSpace: () => undefined,
  }));
  assert.match(clinic, /aria-label="Зоны клиники"/);
  assert.match(clinic, /aria-pressed="true"/);

  const equipment = renderToStaticMarkup(React.createElement(EquipmentExplorer, { items: equipmentItems.slice(0, 2) }));
  assert.match(equipment, /aria-label="Оборудование клиники"/);
  assert.match(equipment, /aria-pressed="true"/);

  const slider = renderToStaticMarkup(React.createElement(BeforeAfterSlider, { beforeImage: "/before.jpg", afterImage: "/after.jpg" }));
  assert.match(slider, /role="slider"/);
  assert.match(slider, /aria-valuenow="50"/);

  const team = renderToStaticMarkup(React.createElement(TeamCategoryNav, { activeCategory: "all", onSelectCategory: () => undefined }));
  assert.match(team, /aria-label="Категории команды"/);
  assert.match(team, /aria-pressed="true"/);

  for (const path of [
    "../components/clinic/clinic-space-selector.tsx",
    "../components/equipment/equipment-explorer.tsx",
    "../components/team/team-category-nav.tsx",
  ]) {
    assert.match(readFileSync(new URL(path, import.meta.url), "utf8"), /motion-reduce:transition-none/);
  }
});

test("contacts reuses the real contact workflow without a duplicate request client", () => {
  const contacts = readFileSync(new URL("./ContactsPage.tsx", import.meta.url), "utf8");
  assert.match(contacts, /ContactPage/);
  assert.doesNotMatch(contacts, /axios|fetch\s*\(|\/api\//);
});
