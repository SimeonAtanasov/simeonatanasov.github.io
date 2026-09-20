# -*- coding: utf-8 -*-
"""Apply the 20 September 2026 closing pass on the last sixteen cookie digest entries.

These sixteen were the only entries in the 259 document cookie digest whose
takeaway had never been checked against its own source. Each earlier pass had
read the wrong file: a landing page linking several documents, an annex, a press
release rather than the decision. All sixteen were reached this time, so cookie
coverage is 259 of 259.

Eleven were confirmed as written. This applies what the other five needed, plus
the source links that now point at the document itself rather than a landing
page, a press release or a law firm note.

Run against the file the page builder reads:
  python3 apply_close16.py <all_merged.json>

Note the ordering trap: build_cookie_page.py overwrites cookie_digest.json, so
all_merged.json is the file to edit and the page is rebuilt from it afterwards.

British spelling, no em dashes. Each change carries the exact text it expects to
find, so a rerun after another edit fails loudly instead of writing the wrong
thing. A rerun on already current data is a no-op.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CHANGES = json.load(open(os.path.join(HERE, "close16_changes.json"), encoding="utf-8"))


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
    print("close16: %d fields applied, %d already current, across %d entries, %d in file"
          % (applied, skipped, len(CHANGES), len(items)))


if __name__ == "__main__":
    main()
