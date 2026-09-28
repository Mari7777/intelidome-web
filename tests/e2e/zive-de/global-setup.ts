import type { FullConfig } from '@playwright/test'
import { execFileSync } from 'node:child_process'

/**
 * Brána živého běhu: překlad musí být v DB UŽ PŘED buildem (cs stránky
 * a `/posts` se pečou při buildu i s recipročním hreflang), proto tu
 * `nastavit` jen potvrdí stav — bez něj skončí s návodem. Server 3102
 * spouští volající (`spustit.sh`), ne Playwright.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL ?? 'http://localhost:3102'
  execFileSync('npm', ['run', '-s', 'payload', '--', 'run', 'tests/e2e/zive-de/preklad.ts', 'nastavit'], { stdio: 'inherit' })
  try {
    const res = await fetch(new URL('/robots.txt', baseURL))
    if (!res.ok) throw new Error(String(res.status))
  } catch (e) {
    throw new Error(
      `Server ${baseURL} neběží (${String(e)}). Spusť \`npm run test:e2e:de\` nebo postup z tests/e2e/zive-de/README.md.`,
    )
  }
}
