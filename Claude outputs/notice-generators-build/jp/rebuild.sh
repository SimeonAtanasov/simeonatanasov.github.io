#!/bin/bash
# Re-splices can_module.js (CANADA marker to INDIA marker) and in_module.js (INDIA marker to CHINA marker) cn_module.js (CHINA marker to JAPAN marker) and jp_module.js (JAPAN marker to "var PN = {")
# into pn_block.js, then pn_block.js into ng.js, copies to ng-test and dumps the Japan scenarios.
set -e
cd /home/claude/ng-build
python3 - <<'PY'
can=open('build/can/can_module.js').read(); ind=open('build/in/in_module.js').read(); cn=open('build/cn/cn_module.js').read(); jp=open('build/jp/jp_module.js').read()
assert all(ord(c)<128 for c in can+ind+cn+jp)
assert jp.startswith('\t/* ========================================================= JAPAN === */\n')
assert ind.startswith('\t/* ========================================================= INDIA === */\n')
assert cn.startswith('\t/* ========================================================= CHINA === */\n')
p='build/pn_block.js'; t=open(p).read()
M_CAN='\t/* ======================================================== CANADA === */'; M_IN='\t/* ========================================================= INDIA === */'; M_CN='\t/* ========================================================= CHINA === */'
i=t.index(M_CAN); k=t.index(M_IN); l=t.index(M_CN); j=t.index('\tvar PN = {\n')
assert i<k<l<j
t=t[:i]+can+ind+cn+jp+t[j:]
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
cd /tmp && PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers timeout 300 python3 /home/claude/ng-build/build/jp/dump_jp.py /home/claude/ng-test /tmp/jp_out
