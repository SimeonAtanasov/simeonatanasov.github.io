# -*- coding: utf-8 -*-
"""Clear the "not fetched" chip from the five AI Act Part 2 entries that have since
been verified.

At build time on 19 September 2026 five corpus entries could not be fetched and were
written from the linking page or from prior knowledge, so they carry source "knowledge",
which the page builder renders as a dashed "not fetched" chip and the PDF builder as a
"not fetched" tag. All five were read against their own sources on 20 September 2026:
doc-32 (Implementing Regulation 2025/454) and doc-40 (EDPB-EDPS Joint Opinion 1/2026)
were corrected, doc-36 (MDCG 2025-6) and doc-38 (EDPB Statement 3/2024) were confirmed,
and doc-45 (EDPS generative AI orientations) was tightened. The chip understated what had
been checked, so it goes.

Run against the file the page builder reads:
  python3 apply_srcfix.py <items_corpus.json>

British spelling, no em dashes. Each change carries the exact value it expects to find, so
a rerun after another edit fails loudly instead of writing the wrong thing. A rerun on
already current data is a no-op.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CHANGES = json.load(open(os.path.join(HERE, "srcfix_changes.json"), encoding="utf-8"))


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
    left = [e["id"] for e in items if e.get("source") == "knowledge"]
    assert not left, "entries still marked not fetched: %s" % left
    blob = json.dumps(items, ensure_ascii=False, indent=1)
    assert chr(0x2014) not in blob, "em dash in output"
    open(path, "w", encoding="utf-8", newline="\n").write(blob)
    print("srcfix: %d fields applied, %d already current, across %d entries, %d in file"
          % (applied, skipped, len(CHANGES), len(items)))


if __name__ == "__main__":
    main()
