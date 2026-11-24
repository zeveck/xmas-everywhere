#!/bin/bash
# tools/replay-act.sh <act> <port> [rounds]: replays every rank solution of one act (design/solutions/level-*.json) in its own
# browser session (-s=a<act>), with real input, <rounds> times (default 2), and logs one line per rank to .gamegen/replay-a<act>.log.
act=$1; port=$2; rounds=${3:-2}; here="$(cd "$(dirname "$0")/.." && pwd)"; log="$here/.gamegen/replay-a$act.log"; s="a$act"
cd "$here/.." && playwright-cli -s=$s open "http://127.0.0.1:$port/?debug" >/dev/null 2>&1 && playwright-cli -s=$s resize 1280 800 >/dev/null
echo "start $(date +%T)" > "$log"
for round in $(seq 1 $rounds); do
  for r in $(seq 1 10); do
    n=$(( (act - 1) * 10 + r )); opts=$(node -e "console.log(JSON.stringify(require('$here/design/solutions/level-$n.json').opts))")
    start=$(date +%s); out=$("$here/tools/run-proof.sh" $s "$opts" 2>&1 | sed -n '/### Result/{n;p}'); secs=$(( $(date +%s) - start ))
    ok=$(node -e "const o=JSON.parse(process.argv[1]||'{}'); const r=$r; console.log(r<10 ? (o.act===$act && o.rank===r+1 ? 'PASS' : 'FAIL') : (o.phase==='actwin' && o.levelComplete ? 'PASS' : 'FAIL'))" "$out")
    echo "round $round level $n (act $act rank $r): $ok in ${secs}s $out" >> "$log"
    playwright-cli -s=$s reload >/dev/null 2>&1; sleep 2
  done
done
echo "done $(date +%T)" >> "$log"
playwright-cli -s=$s close >/dev/null 2>&1
