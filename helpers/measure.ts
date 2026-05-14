import type { Page, TestInfo } from "@playwright/test";

/**
 * Measure how long an interaction takes from start to "ready" marker.
 * Attaches the result as a test annotation so it shows up in the report.
 */
export async function measure(
  testInfo: TestInfo,
  label: string,
  fn: () => Promise<void>
): Promise<number> {
  const start = Date.now();
  await fn();
  const elapsed = Date.now() - start;
  testInfo.annotations.push({ type: "timing", description: `${label}: ${elapsed}ms` });
  return elapsed;
}

/**
 * Pull a Performance API measurement out of the page context.
 * Useful for paint timings or custom user-timing marks the app emits.
 */
export async function getPerformanceEntry(
  page: Page,
  name: string
): Promise<number> {
  return page.evaluate((n) => {
    const entries = performance.getEntriesByName(n);
    return entries.length ? entries[entries.length - 1].duration : 0;
  }, name);
}
