# -*- coding: utf-8 -*-
"""Apply the 20 September 2026 live-source recheck of the cookie digest.

The 149 entries with no downloaded PDF copy were rechecked against the source
page itself, by fetch where the site allowed it and in a real browser where it
did not. This applies the resulting takeaway corrections and the source links
that were found to point at an index, a dead page or a host that no longer
serves the document.

Run from the cookie build folder, against the file the page builder reads:
  python3 apply_recheck.py all_merged.json

Note the build trap: build_cookie_page.py reads all_merged.json and OVERWRITES
cookie_digest.json, so edits belong here and nowhere else.

British spelling, no em dashes. Each change carries the exact text it expects to
find, so a rerun after another edit fails loudly instead of writing the wrong
thing. A rerun on already-current data is a no-op.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CHANGES = json.load(open(os.path.join(HERE, "recheck_changes.json"), encoding="utf-8"))


def main():
    path = sys.argv[1]
    items = json.load(open(path, encoding="utf-8"))
    applied = skipped = 0
    for i, entry in enumerate(items):
        fields = CHANGES.get(str(i))
        if not fields:
            continue
        for field, c in fields.items():
            cur = entry.get(field, "")
            if cur == c["new"]:
                skipped += 1
                continue
            assert cur == c["old"], (
                "entry %d / %s: value on disk does not match the expected text\n"
                "  on disk : %r\n  expected: %r" % (i, field, cur, c["old"]))
            entry[field] = c["new"]
            applied += 1
    total = sum(len(v) for v in CHANGES.values())
    assert applied + skipped == total, "matched %d of %d field changes" % (applied + skipped, total)
    blob = json.dumps(items, ensure_ascii=False, indent=1)
    assert chr(0x2014) not in blob, "em dash in output"
    open(path, "w", encoding="utf-8", newline="\n").write(blob)
    print("recheck: %d fields applied, %d already current, across %d entries, %d in file"
          % (applied, skipped, len(CHANGES), len(items)))


if __name__ == "__main__":
    main()
