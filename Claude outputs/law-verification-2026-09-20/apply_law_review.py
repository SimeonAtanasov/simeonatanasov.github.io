# -*- coding: utf-8 -*-
"""Apply the 20 September 2026 primary-law review of the AI Act digest, Part 1.

Every entry was checked against the official consolidated text of Regulation
(EU) 2024/1689 as amended by Regulation (EU) 2026/1744, CELEX 02024R1689-20260727
on EUR-Lex. Each change below carries the exact text it expects to find, so a
rerun after another edit fails loudly instead of writing the wrong thing.

Run from the AI Act build folder:
  python3 apply_law_review.py items_a.json items_b.json items_c.json items_d.json items_e.json

British spelling, no em dashes. Idempotent: a field already carrying the new
value is counted as applied and skipped.
"""
import json
import sys
import os

HERE = os.path.dirname(os.path.abspath(__file__))
CHANGES = json.load(open(os.path.join(HERE, "law_review_changes.json"), encoding="utf-8"))


def main():
    paths = sys.argv[1:]
    assert paths, "give the items_*.json files to patch"
    applied = skipped = 0
    seen = set()
    for path in paths:
        items = json.load(open(path, encoding="utf-8"))
        dirty = False
        for entry in items:
            fields = CHANGES.get(entry["id"])
            if not fields:
                continue
            seen.add(entry["id"])
            for field, c in fields.items():
                cur = entry.get(field, "")
                if cur == c["new"]:
                    skipped += 1
                    continue
                assert cur == c["old"], (
                    "%s / %s: value on disk does not match the expected text\n"
                    "  on disk : %r\n  expected: %r" % (entry["id"], field, cur, c["old"]))
                entry[field] = c["new"]
                applied += 1
                dirty = True
        if dirty:
            blob = json.dumps(items, ensure_ascii=False, indent=1)
            assert chr(0x2014) not in blob, "em dash in %s" % path
            open(path, "w", encoding="utf-8", newline="\n").write(blob)
        print("%-16s %d entries" % (os.path.basename(path), len(items)))
    missing = set(CHANGES) - seen
    assert not missing, "entries not found in the files given: %s" % sorted(missing)
    total = sum(len(v) for v in CHANGES.values())
    assert applied + skipped == total, "matched %d of %d field changes" % (applied + skipped, total)
    print("law review: %d fields applied, %d already current, across %d entries" % (applied, skipped, len(CHANGES)))


if __name__ == "__main__":
    main()
