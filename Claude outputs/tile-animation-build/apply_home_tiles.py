"""HOME-01: wires the home page tile scenes into index.html.

Adds two lines to the head, after the home-extra.css link: the stylesheet
assets/css/home-tiles.css and the deferred script assets/js/home-tiles.js. Nothing else
in the file changes; everything from <section id="two" onwards (Career & Education) is
asserted byte-identical before the write. Refuses to run on a file whose md5 is not the
one it was written for, so an edit made in between is never overwritten.

Usage: python apply_home_tiles.py <path to index.html> [--check]
  --check   verify only: report whether the file is the before or the after version."""
import hashlib, sys

BEFORE_MD5 = "7375cdabcf8b185af5dac524e5683574"
ANCHOR = '\t\t<link rel="stylesheet" href="assets/css/home-extra.css" />\n'
INSERT = ('\t\t<link rel="stylesheet" href="assets/css/home-tiles.css" />\n'
          '\t\t<script src="assets/js/home-tiles.js" defer></script>\n')
TWO = '<section id="two"'

def md5(b):
    return hashlib.md5(b).hexdigest()

def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    path = sys.argv[1]; check = "--check" in sys.argv
    raw = open(path, "rb").read()
    h = md5(raw)
    if h != BEFORE_MD5:
        if INSERT.encode() in raw and raw.count(INSERT.encode()) == 1:
            print("already applied:", h, len(raw), "bytes")
            return
        raise SystemExit("refusing: index.html md5 is %s, expected %s" % (h, BEFORE_MD5))
    if check:
        print("before version:", h, len(raw), "bytes"); return
    s = raw.decode("utf-8")
    assert "\r" not in s, "CRLF in index.html"
    assert s.count(ANCHOR) == 1, "anchor line not found once"
    assert INSERT not in s
    out = s.replace(ANCHOR, ANCHOR + INSERT)
    i, j = s.index(TWO), out.index(TWO)
    assert s[i:] == out[j:], "text from <section id=\"two\" onwards changed"
    assert out.count("<section id=") == s.count("<section id=")
    assert "\u2014" not in out
    b = out.encode("utf-8")
    open(path, "wb").write(b)
    back = open(path, "rb").read()
    assert back == b, "write did not land"
    print("applied:", md5(b), len(b), "bytes (was", len(raw), "bytes)")

if __name__ == "__main__":
    main()
