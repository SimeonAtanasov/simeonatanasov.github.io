"""SA-04 (2026-10-07): stricter suggestion ranking, live results while typing,
visible question box. Asserts the input md5 of both files and that every anchor
occurs once. Run from the repo root."""
import hashlib
JS, CSS = "assets/js/assistant.js", "assets/css/assistant.css"

def sub(t, a, b, label):
    assert t.count(a) == 1, (label, t.count(a))
    return t.replace(a, b)

js = open(JS, "rb").read()
assert hashlib.md5(js).hexdigest() == "bc4389a304538455e232494d3a6621e9", "assistant.js changed since baseline"
js = js.decode("utf-8")

js = sub(js, "\tvar CANDIDATES = 60;\n",
 "\tvar CANDIDATES = 60;\n\tvar LIVE_DELAY = 250;   // ms after the last keystroke before the results refresh\n", "const")

js = sub(js,
 "\t\t\tvar score = item.s + 0.4 * (item.k.length ? covered / item.k.length : 0) + 0.3 * (typed ? direct / typed : 0) + (starts ? 0.3 : 0) + (item.l.indexOf(first) === 0 ? 0.1 : 0);\n\t\t\thits.push({ item: item, score: score });\n",
 "\t\t\tvar score = item.s + 0.4 * (item.k.length ? covered / item.k.length : 0) + 0.5 * (typed ? direct / typed : 0) + (starts ? 0.3 : 0) + (item.l.indexOf(first) === 0 ? 0.1 : 0);\n\t\t\thits.push({ item: item, score: score, exact: direct === typed });\n",
 "score")

js = sub(js,
 "\t\thits.sort(function (a, b) { return b.score - a.score; });\n\t\tvar out = [], seenDoc = {};\n",
 "\t\thits.sort(function (a, b) { return b.score - a.score; });\n"
 "\t\t/* SA-04: when enough answers contain every typed word as written, drop the\n"
 "\t\t   ones that only match through a synonym, so \"deployer obligation\" no\n"
 "\t\t   longer offers notified bodies. Counted per answer passage. */\n"
 "\t\tvar exactDocs = {}, exactCount = 0;\n"
 "\t\tfor (var e = 0; e < hits.length && exactCount < SUGGESTIONS; e++) {\n"
 "\t\t\tif (hits[e].exact && !exactDocs[hits[e].item.d]) { exactDocs[hits[e].item.d] = true; exactCount++; }\n"
 "\t\t}\n"
 "\t\tif (exactCount >= SUGGESTIONS) hits = hits.filter(function (x) { return x.exact; });\n"
 "\t\tvar out = [], seenDoc = {};\n",
 "filter")

js = sub(js, "\tvar activeSuggestion = -1, suggestTimer = null, pinnedDoc = -1;\n",
 "\tvar activeSuggestion = -1, suggestTimer = null, liveTimer = null, pinnedDoc = -1;\n", "vars")

js = sub(js,
 "\t\t\te.preventDefault();\n\t\t\tif (activeSuggestion >= 0",
 "\t\t\te.preventDefault();\n\t\t\tclearTimeout(liveTimer);\n\t\t\tif (activeSuggestion >= 0", "submit")

js = sub(js,
 "\t\tinput.addEventListener('input', function () {\n\t\t\tclearTimeout(suggestTimer);\n\t\t\tsuggestTimer = setTimeout(showSuggestions, 60);\n\t\t});\n",
 "\t\tinput.addEventListener('input', function () {\n"
 "\t\t\tpinnedDoc = -1;   // a picked answer no longer applies once the text changes\n"
 "\t\t\tclearTimeout(suggestTimer);\n"
 "\t\t\tsuggestTimer = setTimeout(showSuggestions, 60);\n"
 "\t\t\tclearTimeout(liveTimer);\n"
 "\t\t\tliveTimer = setTimeout(liveSearch, LIVE_DELAY);\n"
 "\t\t});\n", "input")

js = sub(js,
 "\tfunction pick(li) {\n\t\tvar text = li.querySelector('.sa-suggest-q').textContent;\n",
 "\t/* SA-04: results follow the typing, without pressing Search. Three\n"
 "\t   characters at least, so one or two letters do not flood the list. */\n"
 "\tfunction liveSearch() {\n"
 "\t\tvar q = input.value.trim();\n"
 "\t\tif (q.length >= 3) run(q, '');\n"
 "\t\telse if (lastQuery) run('', '');\n"
 "\t}\n\n"
 "\tfunction pick(li) {\n\t\tclearTimeout(liveTimer);\n\t\tvar text = li.querySelector('.sa-suggest-q').textContent;\n",
 "pick")

js = sub(js,
 "\t\t\t\tif (label === FINDER_LABEL) finder(TOOL_FINDER, []);\n",
 "\t\t\t\tclearTimeout(liveTimer);\n\t\t\t\tif (label === FINDER_LABEL) finder(TOOL_FINDER, []);\n", "chip")

assert "\u2014" not in js
open(JS, "wb").write(js.encode("utf-8"))

css = open(CSS, "rb").read()
assert hashlib.md5(css).hexdigest() == "9c40155db6169e3a418aface3755036b", "assistant.css changed since the SA-04 list fix"
css = css.decode("utf-8")
css = sub(css, "\n.sa-input {\n",
 "\n/* SA-04: the template's input[type=\"text\"] rule outranks a bare class and drew\n"
 "   the box white on white; the extra selector parts win without !important. */\n"
 ".sa-panel input.sa-input {\n", "input rule")
css = sub(css, "\n.sa-input:focus {", "\n.sa-panel input.sa-input:focus {", "focus rule")
assert "\u2014" not in css
open(CSS, "wb").write(css.encode("utf-8"))
print("patched", hashlib.md5(js.encode()).hexdigest(), hashlib.md5(css.encode()).hexdigest())
