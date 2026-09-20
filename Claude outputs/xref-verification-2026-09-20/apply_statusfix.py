# -*- coding: utf-8 -*-
"""State the legal status in two AI Act Part 2 takeaways that did not say it.

A reader of Part 2 has three questions to answer about any document: is it law, is
it in force, and does it apply yet. Reviewing how the page answers them on
20 September 2026 turned up two entries whose takeaway never said whether the
document binds anyone:

  doc-25, the Commission's enforcement framework page, which describes binding
    rules but is itself only a description
  doc-37, EDPB Opinion 28/2024, which the takeaway identified as an Article 64(2)
    opinion without saying whether that binds

Sixteen of the other seventeen "final" entries already open with "Non-binding" or
similar. doc-11 looked like a third case and is not: its takeaway opens with
"Mandatory template", which states the status correctly, since Article 53(1)(d)
requires providers to use the template the AI Office provides.

Paired with a one line change in build_aia_page.py and build_aia_pdf.py, which
stop suppressing the status chip for "in force" so the nine binding instruments
are visibly binding. "final" stays suppressed: it is the default for guidance and
says nothing about legal force.

Run against the file the page builder reads:
  python3 apply_statusfix.py <items_corpus.json>

British spelling, no em dashes. Each change carries the exact text it expects to
find, so a rerun after another edit fails loudly instead of writing the wrong
thing. A rerun on already current data is a no-op.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CHANGES = json.load(open(os.path.join(HERE, "statusfix_changes.json"), encoding="utf-8"))


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
                "entry %d / %s: value on disk does not match the expected text\n"
                "  on disk : %r\n  expected: %r" % (i, field, cur, c["old"]))
            entry[field] = c["new"]
            applied += 1
    total = sum(len(v) for v in CHANGES.values())
    assert applied + skipped == total, "matched %d of %d field changes" % (applied + skipped, total)
    blob = json.dumps(items, ensure_ascii=False, indent=1)
    assert chr(0x2014) not in blob, "em dash in output"
    open(path, "w", encoding="utf-8", newline="\n").write(blob)
    print("statusfix: %d fields applied, %d already current, across %d entries, %d in file"
          % (applied, skipped, len(CHANGES), len(items)))


if __name__ == "__main__":
    main()
