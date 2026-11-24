#!/bin/bash
# tools/run-proof.sh <session> '<json opts>' : runs tools/proof-bot.js in a playwright-cli session (from the project root above).
# opts: { level, toRank, toAct, policy: clear|ignore|noel, tps, limit, total, onWin: stop|next }
here="$(cd "$(dirname "$0")" && pwd)"; s=$1; opts=$2
code="$(sed "s|__OPTS__|$opts|" "$here/proof-bot.js" | grep -v '^//')"
cd "$here/../.." && playwright-cli -s="$s" run-code "$code"
