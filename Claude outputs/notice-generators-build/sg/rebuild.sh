#!/bin/bash
# Re-splices the can, in, cn, jp, kr and sg modules (CANADA marker to "var PN = {") into pn_block.js, then
# pn_block.js into ng.js, copies to ng-test and dumps the Singapore scenarios.
set -e
cd /home/claude/ng-build
# sg_module.js = marker + sg_body.js
python3 -c "b=open('build/sg/sg_body.js').read(); open('build/sg/sg_module.js','w').write('\t/* ' + '='*53 + ' SINGAPORE === */\n' + b)"
python3 - <<'PY'
dirs=('can','in','cn','jp','kr','sg'); heads=['CANADA','INDIA','CHINA','JAPAN','KOREA','SINGAPORE']
mods=[open('build/%s/%s_module.js'%(d,d)).read() for d in dirs]
assert all(ord(c)<128 for m in mods for c in m)
for m,h in zip(mods,heads):
    assert m.startswith('\t/* ' + '='*(62-len(h)) + ' ' + h + ' === */\n'), h
p='build/pn_block.js'; t=open(p).read()
i=t.index('\t/* ======================================================== CANADA === */'); j=t.index('\tvar PN = {\n')
assert i<j
t=t[:i]+''.join(mods)+t[j:]
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
cd /tmp && PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers timeout 300 python3 /home/claude/ng-build/build/sg/dump_sg.py /home/claude/ng-test /tmp/sg_out
