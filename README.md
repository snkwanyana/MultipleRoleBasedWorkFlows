# Multiple-role Playwright and Cucumber workflows

This project uses Cucumber.js for Gherkin scenarios, Playwright for browser
automation, page objects for UI interactions, and Allure for test results and
HTML reporting.

## Structure

- `features/` contains business-readable Gherkin scenarios.
- `src/stepdefinitions/` maps feature steps to workflow behavior.
- `src/pages/` contains page objects for the application.
- `src/support/` contains the Cucumber World and browser lifecycle hooks.
- `cucumber.cjs` configures feature discovery, TypeScript loading, and the
  Allure formatter.
- `tests/` and `config/playwright.config.ts` remain available for standalone
  Playwright Test suites; they are separate from the Cucumber runner.

## Run the role workflow and generate the report

Install dependencies with `npm install`, then add the admin credentials to a
local `.env` file in the project root. For example:

```dotenv
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=your-admin-password
```

The `.env` file is loaded by Cucumber and ignored by Git. The workflow creates
a unique User A email and password on each run. Cucumber results are written
to `allure-results/`, and the generated HTML report is written to
`allure-report/`.

To rerun the steps separately, use `npm run test:bdd:workflow` and then
`npm run allure:generate`. Set `HEADLESS=false` to run Chromium visibly.
