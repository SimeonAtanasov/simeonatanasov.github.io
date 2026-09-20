# -*- coding: utf-8 -*-
"""Apply the 20 September 2026 source verification corrections.

Checks every takeaway against the downloaded official text of the document it
describes (EDPB, cookie and AI Act collections in edpb-downloads). Each entry
below is keyed by the exact current takeaway, so a rerun after another edit
fails loudly instead of writing the wrong thing.

Run from the build folder that holds the data file:
  python3 apply_source_review.py edpb   <digest.json>
  python3 apply_source_review.py cookie <all_merged.json>
  python3 apply_source_review.py aia    <items_corpus.json>

British spelling, no em dashes. Idempotent: an entry already carrying the new
text is counted as applied and skipped.
"""
import json
import sys

DATA = json.load(open("source_review_changes.json", encoding="utf-8"))


def key_for(digest, i, entry):
    if digest == "aia":
        return entry.get("id")
    return str(i)


def main():
    digest, path = sys.argv[1], sys.argv[2]
    changes = DATA[digest]
    items = json.load(open(path, encoding="utf-8"))
    applied = skipped = 0
    for i, entry in enumerate(items):
        k = key_for(digest, i, entry)
        c = changes.get(str(k))
        if not c:
            continue
        cur = entry["takeaway"]
        if cur == c["new"]:
            skipped += 1
            continue
        assert cur == c["old"], "entry %s: takeaway does not match the expected text\n  on disk: %s\n  expected: %s" % (k, cur[:160], c["old"][:160])
        entry["takeaway"] = c["new"]
        applied += 1
    assert applied + skipped == len(changes), "matched %d of %d changes" % (applied + skipped, len(changes))
    blob = json.dumps(items, ensure_ascii=False, indent=1)
    assert "—" not in blob, "em dash in output"
    open(path, "w", encoding="utf-8", newline="\n").write(blob)
    print("%s: %d applied, %d already current, %d entries" % (digest, applied, skipped, len(items)))


if __name__ == "__main__":
    main()
