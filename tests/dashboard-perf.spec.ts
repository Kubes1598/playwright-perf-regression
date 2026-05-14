import { test, expect } from "@playwright/test";
import { measure } from "../helpers/measure";

test.describe("Dashboard performance budgets", () => {
  test("login submit < 600ms", async ({ page }, info) => {
    await page.goto("/login");

    const elapsed = await measure(info, "login_submit", async () => {
      await page.fill("[name=email]", "qa@example.com");
      await page.fill("[name=password]", process.env.QA_PW ?? "fixture-pw");
      await Promise.all([
        page.waitForURL("/dashboard"),
        page.click("[type=submit]"),
      ]);
    });

    expect(elapsed, "login round-trip exceeded budget").toBeLessThan(600);
  });

  test("dashboard first paint < 1200ms", async ({ page }, info) => {
    await page.goto("/login");
    await page.fill("[name=email]", "qa@example.com");
    await page.fill("[name=password]", process.env.QA_PW ?? "fixture-pw");

    const elapsed = await measure(info, "dashboard_first_paint", async () => {
      await page.click("[type=submit]");
      await page.waitForSelector("[data-testid=dashboard-ready]");
    });

    expect(elapsed).toBeLessThan(1200);
  });

  test("search interaction < 250ms", async ({ page }, info) => {
    await page.goto("/dashboard");

    const elapsed = await measure(info, "search_keystroke", async () => {
      await page.fill("[data-testid=search]", "load test");
      await page.waitForSelector("[data-testid=search-results]");
    });

    expect(elapsed).toBeLessThan(250);
  });
});
