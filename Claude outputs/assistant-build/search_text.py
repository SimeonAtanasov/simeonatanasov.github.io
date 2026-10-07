"""Query and document tokenisation, mirrored by assets/js/assistant.js.

lowercase, split on anything that is not a letter or digit (so hyphenated
words become their parts), drop stop words and one-character tokens,
normalise -ise spellings to -ize, Porter stem, and append the synonym
expansion of each raw or stemmed token."""
import re

from porter import stem as porter

STOP = set("""a an and are as at be been being but by can could do does for from has have how i if in into is it its
me my of on or our should that the their them then there these they this to us was we were what when where which who
why will with would you your about also any just more most not no only other some such than too very s t""".split())

_ise = re.compile(r"^(.{3,})is(e|ed|es|ing|ation|ations)$")


def stem(t):
    m = _ise.match(t)
    if m:
        t = m.group(1) + "iz" + m.group(2)
    return porter(t)


def tokenize(text, synonyms=None):
    text = text.lower().replace("'", "").replace("’", "")
    out = []
    for t in re.findall(r"[a-z0-9]+", text):
        if len(t) < 2 or t in STOP:
            continue
        s = stem(t)
        out.append(s)
        if synonyms:
            exp = synonyms.get(t) or synonyms.get(s)
            if exp:
                for x in re.findall(r"[a-z0-9]+", exp):
                    if x not in STOP and len(x) > 1:
                        out.append(stem(x))
    return out
