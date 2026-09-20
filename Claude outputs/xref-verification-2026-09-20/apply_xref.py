# -*- coding: utf-8 -*-
"""Apply the 20 September 2026 article cross-reference check on AI Act Digest Part 2.

Every article and annex reference in the 57 corpus entries, 162 chips and 91
citations inside the takeaways, was checked against the consolidated Regulation
(EU) 2024/1689 as amended by Regulation (EU) 2026/1744, CELEX 02024R1689-20260727.
53 entries came back clean. This applies what the other four needed.

Run against the file the page builder reads:
  python3 apply_xref.py <items_corpus.json>

British spelling, no em dashes. Each change carries the exact value it expects to
find, so a rerun after another edit fails loudly instead of writing the wrong
thing. A rerun on already current data is a no-op.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CHANGES = json.load(open(os.path.join(HERE, "xref_changes.json"), encoding="utf-8"))


def main():
    path = sys.argv[1]
    items = json.load(open(path, encoding="utf-8"))
    applied = skipped = 0
    for i, entry in enumerate(items):
        fields = CHANGES.get(str(i))
        if not fields:
            continue
        for field, c in fields.items():
            cur = entry.get(field)
            if cur == c["new"]:
                skipped += 1
                continue
            assert cur == c["old"], (
                "entry %d / %s: value on disk does not match the expected value\n"
                "  on disk : %r\n  expected: %r" % (i, field, cur, c["old"]))
            entry[field] = c["new"]
            applied += 1
    total = sum(len(v) for v in CHANGES.values())
    assert applied + skipped == total, "matched %d of %d field changes" % (applied + skipped, total)
    blob = json.dumps(items, ensure_ascii=False, indent=1)
    assert chr(0x2014) not in blob, "em dash in output"
    open(path, "w", encoding="utf-8", newline="\n").write(blob)
    print("xref: %d fields applied, %d already current, across %d entries, %d in file"
          % (applied, skipped, len(CHANGES), len(items)))


if __name__ == "__main__":
    main()
