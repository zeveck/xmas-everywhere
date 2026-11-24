#!/bin/bash
# The whole game in one go: New Xmas from the title to Silent Night, real input, no jumps, the reference strategy at 10 taps/s.
here="$(cd "$(dirname "$0")/.." && pwd)"; port=$1; s=whole; log="$here/.gamegen/whole-game.log"
cd "$here/.." && playwright-cli -s=$s open "http://127.0.0.1:$port/" >/dev/null 2>&1 && playwright-cli -s=$s resize 1280 800 >/dev/null
playwright-cli -s=$s localstorage-clear >/dev/null 2>&1; playwright-cli -s=$s reload >/dev/null 2>&1; sleep 3
playwright-cli -s=$s click "#btnNew" >/dev/null 2>&1; sleep 3
echo "start $(date +%T)" > "$log"
"$here/tools/run-proof.sh" $s '{"policy":"clear","tps":10,"limit":700,"total":5400,"onWin":"next"}' >> "$log" 2>&1
sleep 25; playwright-cli -s=$s eval "JSON.stringify({log: window.__runLog, state: window.__game.state(), frames: window.__game.frames().slice(-12)})" >> "$log" 2>&1
echo "done $(date +%T)" >> "$log"; playwright-cli -s=$s screenshot --filename=xmas-everywhere/design/screenshots/whole-game-end.png >/dev/null 2>&1; playwright-cli -s=$s close >/dev/null 2>&1
