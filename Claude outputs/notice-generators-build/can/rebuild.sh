#!/bin/bash
# Re-splices can_module.js into pn_block.js (between the CANADA marker and "var PN = {"), then pn_block.js into ng.js, and copies to ng-test.
set -e
cd /home/claude/ng-build
python3 - <<'PY'
mod=open('build/can/can_module.js').read()
assert all(ord(c)<128 for c in mod)
p='build/pn_block.js'; t=open(p).read()
i=t.index('\t/* ======================================================== CANADA === */'); j=t.index('\tvar PN = {\n')
t=t[:i]+mod+t[j:]
open(p,'w').write(t)
g=open('pages/notice-generators/ng.js').read()
i=g.index('\t/* ===================================================== PRIVACY NOTICE === */'); j=g.index('\t/* =============================================== AI TRANSPARENCY NOTICE === */')
g=g[:i]+t.rstrip('\n')+'\n\n'+g[j:]
assert all(ord(c)<128 for c in g)
open('pages/notice-generators/ng.js','w').write(g)
PY
node --check pages/notice-generators/ng.js
node --check pages/notice-generators/ng-data.js
cp pages/notice-generators/ng.js pages/notice-generators/ng-data.js /home/claude/ng-test/pages/notice-generators/
cd /tmp && PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers timeout 300 python3 /home/claude/ng-build/build/can/dump_can.py /home/claude/ng-test /tmp/can_out
