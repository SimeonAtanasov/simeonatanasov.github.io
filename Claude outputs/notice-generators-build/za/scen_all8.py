"""All privacy-notice scenarios up to Australia: the 295 of scen_all7.py, the 28 Australia scenarios and the
28 Australia review scenarios (351). Baseline for the South Africa regression diff."""
import importlib.util, sys
spec = importlib.util.spec_from_file_location("t7", "/tmp/scen_all7.py")
t7 = importlib.util.module_from_spec(spec); spec.loader.exec_module(t7)
sys.path.insert(0, "/home/claude/ng-build/build/au")
from scen_au import SCEN_AU
from scen_au_review import SCEN_RV
SCEN = dict(t7.SCEN)
for d in (SCEN_AU, SCEN_RV):
    for k, val in d.items():
        assert k not in SCEN, k
        SCEN[k] = val
