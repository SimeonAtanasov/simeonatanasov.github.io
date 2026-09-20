# -*- coding: utf-8 -*-
"""Apply the 20 September 2026 live-source recheck of the EDPB and AI Act digests.

The entries with no downloaded PDF copy were checked against the source page
itself, by fetch where the site allowed it and in a real browser where it did
not. This applies the resulting takeaway corrections and the few source links
that pointed at an index or a superseded version.

Run once per digest, against the file the page builder reads:
  python3 apply_recheck2.py edpb <digest.json>
  python3 apply_recheck2.py aia  <items_corpus.json>

Note the EDPB trap: oneliners_build.py regenerates digest.json, so this has to
be rerun after it, together with fix_edpb_review.py, add_consultations.py,
apply_source_review.py and apply_linkfix.py.

British spelling, no em dashes. Each change carries the exact text it expects to
find, so a rerun after another edit fails loudly instead of writing the wrong
thing. A rerun on already-current data is a no-op.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CHANGES = json.load(open(os.path.join(HERE, "recheck2_changes.json"), encoding="utf-8"))


def main():
    digest, path = sys.argv[1], sys.argv[2]
    changes = CHANGES[digest]
    items = json.load(open(path, encoding="utf-8"))
    applied = skipped = 0
    for i, entry in enumerate(items):
        fields = changes.get(str(i))
        if not fields:
            continue
        for field, c in fields.items():
            cur = entry.get(field, "")
            if cur == c["new"]:
                skipped += 1
                continue
            assert cur == c["old"], (
                "%s entry %d / %s: value on disk does not match the expected text\n"
                "  on disk : %r\n  expected: %r" % (digest, i, field, cur, c["old"]))
            entry[field] = c["new"]
            applied += 1
    total = sum(len(v) for v in changes.values())
    assert applied + skipped == total, "matched %d of %d field changes" % (applied + skipped, total)
    blob = json.dumps(items, ensure_ascii=False, indent=1)
    assert chr(0x2014) not in blob, "em dash in output"
    open(path, "w", encoding="utf-8", newline="\n").write(blob)
    print("%s recheck: %d fields applied, %d already current, across %d entries, %d in file"
          % (digest, applied, skipped, len(changes), len(items)))


if __name__ == "__main__":
    main()
