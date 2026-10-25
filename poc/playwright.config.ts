import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', workers: 1, timeout: 120000,
  reporter: [['list'], ['json', {outputFile: 'test-results/browser-results.json'}]],
  use: {baseURL: 'http://127.0.0.1:4173', viewport: {width: 1366, height: 768}, launchOptions: {args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream']}},
  webServer: {command: 'npm run preview -- --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: false},
});
