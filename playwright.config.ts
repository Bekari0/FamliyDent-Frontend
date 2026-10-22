import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  timeout: 45_000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
});
