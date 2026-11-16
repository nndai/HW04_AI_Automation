import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'node:path';

const sut = resolve(__dirname, '../eshop-sut');
const storefrontPort = Number(process.env.ESHOP_STOREFRONT_PORT ?? 5173);
const storefront = `http://localhost:${storefrontPort}`;
const admin = 'http://localhost:5174';
const runTimestamp = new Date().toISOString();

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['html', { open: 'never', title: `Run by: 23120226 | ${runTimestamp}` }],
  ],
  use: { baseURL: storefront },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: [
    {
      command: 'node server.js',
      cwd: resolve(sut, 'backend'),
      url: 'http://localhost:3000/api/products',
    },
    {
      command: `node node_modules/vite/bin/vite.js --port ${storefrontPort} --strictPort`,
      cwd: resolve(sut, 'frontend-web'),
      url: storefront,
    },
    {
      command: 'node node_modules/vite/bin/vite.js --port 5174 --strictPort',
      cwd: resolve(sut, 'frontend-admin'),
      url: admin,
    },
  ],
});
