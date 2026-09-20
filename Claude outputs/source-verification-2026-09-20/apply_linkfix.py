# -*- coding: utf-8 -*-
"""Repair the 15 source links that do not reach their document.

Found on 20 September 2026 by fetching every link the bulk downloader failed on.
Thirteen EDPB Article 64 opinion URLs return HTTP 200 but serve the generic
Documents listing, because the slug omits "draft-decision-of-the"; two EDPB URLs
return a hard 404 because the document sits under a different section. Every
replacement was opened in a browser and confirmed to be the named document.

  python3 apply_linkfix.py <digest.json | items_corpus.json | all_merged.json>

Idempotent: a file already carrying the new URLs reports 0 applied.
"""
import json
import sys

FIX = json.load(open("linkfix.json", encoding="utf-8"))


def main(path):
    items = json.load(open(path, encoding="utf-8"))
    applied = 0
    for e in items:
        u = e.get("url")
        if u in FIX:
            e["url"] = FIX[u]
            applied += 1
    blob = json.dumps(items, ensure_ascii=False, indent=1)
    assert "—" not in blob, "em dash in output"
    for old in FIX:
        assert '"%s"' % old not in blob, "old URL still present: %s" % old
    open(path, "w", encoding="utf-8", newline="\n").write(blob)
    print("%s: %d links repaired, %d entries" % (path, applied, len(items)))


if __name__ == "__main__":
    main(sys.argv[1])
