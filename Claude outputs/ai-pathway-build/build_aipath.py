# Assembles the TC-08 block (AI Assessment Pathway) from aipath_part*.js and fills the
# generated framework texts from the crosswalk data. Writes aipath_block.js.
import json, re, glob, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.environ.get("XW", os.path.join(HERE, "..", "ai-crosswalk-build"))
parts = sorted(glob.glob(os.path.join(HERE, "aipath_part*.js")))
js = "".join(open(p, encoding="utf-8").read() for p in parts)

nist = {}
for f in json.load(open(os.path.join(SRC, "nist_ai_rmf.json"), encoding="utf-8"))["functions"]:
    for c in f["categories"]:
        for s in c["subcategories"]:
            nist[s["id"]] = s["text"]
iso = {}
def walk(x):
    if isinstance(x, list):
        for i in x: walk(i)
    elif isinstance(x, dict):
        if "id" in x and "title" in x: iso[x["id"]] = x["title"]
        for v in x.values():
            if isinstance(v, (list, dict)): walk(v)
d = json.load(open(os.path.join(SRC, "iso42001.json"), encoding="utf-8"))
walk(d["clauses"]); walk(d["annex_a"])

m = re.search(r"var AIPATH_FRAMEWORK_MAP = \{(.*?)\n\t\};", js, re.S)
body = m.group(1)
nist_ids, iso_ids = set(), set()
for row in re.finditer(r"(\w+): \[\[(.*?)\], \[(.*?)\], \[(.*?)\]\]", body):
    nist_ids |= set(re.findall(r'"([^"]+)"', row.group(2)))
    iso_ids |= set(re.findall(r'"([^"]+)"', row.group(3)))
bad = [i for i in nist_ids if i not in nist] + [i for i in iso_ids if i not in iso]
if bad: sys.exit("unknown ids: %s" % bad)

def obj(dct, ids):
    # NIST uses en dashes in a few subcategories; kept as published (not em dashes).
    return "{\n" + ",\n".join("\t\t%s: %s" % (json.dumps(k), json.dumps(dct[k], ensure_ascii=False)) for k in sorted(ids)) + "\n\t}"
js = js.replace("/*@@NIST_TEXT@@*/{}", obj(nist, nist_ids)).replace("/*@@ISO_TITLES@@*/{}", obj(iso, iso_ids))
assert chr(0x2014) not in js, "em dash"
open(os.path.join(HERE, "aipath_block.js"), "w", encoding="utf-8").write(js)
print("aipath_block.js", len(js.encode("utf-8")), "bytes;", len(nist_ids), "NIST ids,", len(iso_ids), "ISO ids")
