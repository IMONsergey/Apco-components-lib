import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {timeout: 8000},
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4276',
    ...devices['Desktop Chrome'],
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4276 --strictPort',
    url: 'http://127.0.0.1:4276/Apco-components-lib/',
    reuseExistingServer: false,
    timeout: 60000,
  },
});
