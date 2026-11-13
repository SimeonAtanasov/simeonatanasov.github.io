"""All privacy-notice scenarios up to Singapore: the 245 of scen_all6.py, the 20 Singapore scenarios and the
30 Singapore review scenarios (295). Baseline for the Australia regression diff."""
import importlib.util, sys
spec = importlib.util.spec_from_file_location("t6", "/tmp/scen_all6.py")
t6 = importlib.util.module_from_spec(spec); spec.loader.exec_module(t6)
sys.path.insert(0, "/home/claude/ng-build/build/sg")
from scen_sg import SCEN_SG
from scen_sg_review import SCEN_RV
SCEN = dict(t6.SCEN)
for d in (SCEN_SG, SCEN_RV):
    for k, val in d.items():
        assert k not in SCEN, k
        SCEN[k] = val
