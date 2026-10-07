"""Porter stemmer (1980 algorithm), mirrored line for line by the JavaScript
in assets/js/assistant.js. Keep the two in step: test_tokenizer.py checks
that node and Python stem a word list identically."""
import re

_c = "[^aeiou]"
_v = "[aeiouy]"
_C = _c + "[^aeiouy]*"
_V = _v + "[aeiou]*"
_mgr0 = re.compile("^(" + _C + ")?" + _V + _C)
_meq1 = re.compile("^(" + _C + ")?" + _V + _C + "(" + _V + ")?$")
_mgr1 = re.compile("^(" + _C + ")?" + _V + _C + _V + _C)
_s_v = re.compile("^(" + _C + ")?" + _v)

_step2 = {
    "ational": "ate", "tional": "tion", "enci": "ence", "anci": "ance", "izer": "ize", "bli": "ble",
    "alli": "al", "entli": "ent", "eli": "e", "ousli": "ous", "ization": "ize", "ation": "ate",
    "ator": "ate", "alism": "al", "iveness": "ive", "fulness": "ful", "ousness": "ous", "aliti": "al",
    "iviti": "ive", "biliti": "ble", "logi": "log",
}
_step3 = {"icate": "ic", "ative": "", "alize": "al", "iciti": "ic", "ical": "ic", "ful": "", "ness": ""}
_re2 = re.compile("^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$")
_re3 = re.compile("^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$")
_re4 = re.compile("^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$")
_re4b = re.compile("^(.+?)(s|t)(ion)$")
_re1a1 = re.compile("^(.+?)(ss|i)es$")
_re1a2 = re.compile("^(.+?)([^s])s$")
_re1b1 = re.compile("^(.+?)eed$")
_re1b2 = re.compile("^(.+?)(ed|ing)$")
_re1b3 = re.compile("(at|bl|iz)$")
_re1b4 = re.compile("([^aeiouylsz])\\1$")
_re1b5 = re.compile("^" + _C + _v + "[^aeiouwxy]$")
_re1c = re.compile("^(.+?)y$")
_re5 = re.compile("^(.+?)e$")
_re5b = re.compile("ll$")


def stem(w):
    if len(w) < 3:
        return w
    first = w[0]
    if first == "y":
        w = "Y" + w[1:]
    # step 1a
    m = _re1a1.match(w)
    if m:
        w = m.group(1) + m.group(2)
    else:
        m = _re1a2.match(w)
        if m:
            w = m.group(1) + m.group(2)
    # step 1b
    m = _re1b1.match(w)
    if m:
        if _mgr0.match(m.group(1)):
            w = w[:-1]
    else:
        m = _re1b2.match(w)
        if m:
            stem_ = m.group(1)
            if _s_v.match(stem_):
                w = stem_
                if _re1b3.search(w):
                    w = w + "e"
                elif _re1b4.search(w):
                    w = w[:-1]
                elif _re1b5.match(w):
                    w = w + "e"
    # step 1c
    m = _re1c.match(w)
    if m and _s_v.match(m.group(1)):
        w = m.group(1) + "i"
    # step 2
    m = _re2.match(w)
    if m and _mgr0.match(m.group(1)):
        w = m.group(1) + _step2[m.group(2)]
    # step 3
    m = _re3.match(w)
    if m and _mgr0.match(m.group(1)):
        w = m.group(1) + _step3[m.group(2)]
    # step 4
    m = _re4.match(w)
    if m:
        if _mgr1.match(m.group(1)):
            w = m.group(1)
    else:
        m = _re4b.match(w)
        if m and _mgr1.match(m.group(1) + m.group(2)):
            w = m.group(1) + m.group(2)
    # step 5
    m = _re5.match(w)
    if m:
        s = m.group(1)
        if _mgr1.match(s) or (_meq1.match(s) and not _re1b5.match(s)):
            w = s
    if _re5b.search(w) and _mgr1.match(w):
        w = w[:-1]
    if first == "y":
        w = "y" + w[1:]
    return w
