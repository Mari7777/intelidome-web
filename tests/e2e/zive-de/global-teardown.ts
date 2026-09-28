import { execFileSync } from 'node:child_process'

/** Úklid dočasného překladu — vždy, i po pádu testů (Playwright teardown běží i při chybě). */
export default function globalTeardown() {
  execFileSync('npm', ['run', '-s', 'payload', '--', 'run', 'tests/e2e/zive-de/preklad.ts', 'uklidit'], { stdio: 'inherit' })
}
