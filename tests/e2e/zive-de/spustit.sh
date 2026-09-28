#!/usr/bin/env bash
# Živý běh s dočasnou němčinou (ADR-008, krok 5):
# překlad do dev DB → prod build s LIVE_LOCALES=cs,de → server 3102 → scénáře → stop → úklid DB.
# Zastavení serveru i úklid proběhnou VŽDY (trap), i když build nebo testy spadnou;
# selhaný úklid vrátí nenulový kód i při zelených testech (trap sám návratový kód nemění).
set -uo pipefail
cd "$(dirname "$0")/../../.."
export LIVE_LOCALES=cs,de NEXT_PUBLIC_SERVER_URL=http://localhost:3102 NODE_OPTIONS=--no-deprecation
LOG=${ZIVE_DE_LOG:-node_modules/.cache/zive-de/server.log}
mkdir -p "$(dirname "$LOG")"
PID=""
uklid() {
  local rc=$?
  if [ -n "$PID" ]; then kill "$PID" 2>/dev/null; wait "$PID" 2>/dev/null; fi
  ZBYTEK=$(lsof -ti tcp:3102 2>/dev/null); [ -n "$ZBYTEK" ] && kill $ZBYTEK 2>/dev/null
  npm run -s payload -- run tests/e2e/zive-de/preklad.ts uklidit || rc=1
  exit "$rc"
}
trap uklid EXIT
npm run -s payload -- run tests/e2e/zive-de/preklad.ts nastavit || exit 1
./node_modules/.bin/next build || exit 1
./node_modules/.bin/next start -p 3102 >"$LOG" 2>&1 &
PID=$!
for _ in $(seq 1 60); do curl -sfo /dev/null http://localhost:3102/robots.txt && break; sleep 1; done
curl -sfo /dev/null http://localhost:3102/robots.txt || { echo "server 3102 nenaběhl (log: $LOG)"; exit 1; }
NODE_OPTIONS="--no-deprecation --import=tsx/esm" ./node_modules/.bin/playwright test --config=playwright.de.config.ts "$@"
