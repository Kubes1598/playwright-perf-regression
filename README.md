# playwright-perf-regression

Playwright tests that check both behaviour and speed in the same spec. If a button still works but the click takes 1.4 seconds instead of 400ms, the test fails. Traces auto-attach on failure so you can open them in the Trace Viewer and see exactly where the time went.

I built this because I kept seeing E2E suites pass while real users complained the app felt sluggish. A test that asserts "the form submits and returns 200" doesn't catch that the form now takes a second longer than last week. So I added timing assertions where they matter.

## What it asserts

| Flow                       | Budget    |
| -------------------------- | --------- |
| Login form submit          | < 600 ms  |
| Dashboard first paint      | < 1200 ms |
| Search interaction         | < 250 ms  |
| Modal open                 | < 150 ms  |
| Settings save              | < 800 ms  |

Budgets sit right next to the assertion in the test file. That makes them obvious in code review and easy to tune — no separate config to hunt down.

## How the timing works

Two patterns:

- `Date.now()` deltas around an interaction — for things like "user clicks submit, dashboard becomes interactive". This is what users actually feel.
- `page.evaluate(() => performance.measure(...))` for in-page marks the app emits — useful when you want to attribute time to a specific phase, like "the chart rendered in 80ms but the data fetch took 600ms".

Helper functions in `helpers/measure.ts` keep the timing wrapper consistent and write annotations to the test report.

## Run it

```bash
npm install
npx playwright install --with-deps
npm test
```

## Traces

`playwright.config.ts` sets `trace: 'on-first-retry'`. When a test fails, retries once with full tracing, and uploads the trace.zip as a GitHub Actions artifact. Open it at [trace.playwright.dev](https://trace.playwright.dev/) for a flame graph. Failures stop being "flaky" once you can see exactly what happened.

## CI

`.github/workflows/playwright.yml` runs the suite on every PR. On failure it uploads `playwright-report/` and `test-results/` for one-click debugging from the GitHub Checks tab.

## Companion

- Lab-side performance gating: [lighthouse-ci-budgets](https://github.com/Kubes1598/lighthouse-ci-budgets).
- Portfolio case study: [ajimati-portfolio](https://github.com/Kubes1598/ajimati-portfolio).

## License

MIT. See [LICENSE](./LICENSE).
