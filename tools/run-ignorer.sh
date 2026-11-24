#!/bin/bash
# The lock-ignorer run: from a3-carried (locks carried from Act 2) to the Act 4 act-win card, never clearing a lock, real input.
here="$(cd "$(dirname "$0")/.." && pwd)"; port=$1; s=ign; log="$here/.gamegen/ignorer.log"
cd "$here/.." && playwright-cli -s=$s open "http://127.0.0.1:$port/?debug" >/dev/null 2>&1 && playwright-cli -s=$s resize 1280 800 >/dev/null
echo "start $(date +%T)" > "$log"
"$here/tools/run-proof.sh" $s '{"level":"a4-carried","policy":"ignore","tps":10,"limit":700,"total":3000,"onWin":"next"}' >> "$log" 2>&1
playwright-cli -s=$s eval "JSON.stringify(window.__runLog)" >> "$log" 2>&1
echo "done $(date +%T)" >> "$log"; playwright-cli -s=$s close >/dev/null 2>&1
