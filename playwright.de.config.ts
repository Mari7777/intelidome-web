import { defineConfig, devices } from '@playwright/test'
import 'dotenv/config'

/**
 * Živý běh s dočasně živou němčinou (ADR-008, krok 5): produkční build
 * s `LIVE_LOCALES=cs,de` na portu 3102 a dočasným de překladem v dev DB.
 * Není součástí `npm run test:e2e` (ten má vlastní config a `zive-de`
 * ignoruje) — spouští se přes `npm run test:e2e:de` (build + server + úklid).
 */
export default defineConfig({
  testDir: './tests/e2e/zive-de',
  globalSetup: './tests/e2e/zive-de/global-setup.ts',
  globalTeardown: './tests/e2e/zive-de/global-teardown.ts',
  forbidOnly: !!process.env.CI,
  retries: 0,
  // Scénáře jdou po sobě: sdílejí jeden server a jednu DB, výstup čitelný v pořadí čísel.
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.ZIVE_DE_URL ?? 'http://localhost:3102',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
