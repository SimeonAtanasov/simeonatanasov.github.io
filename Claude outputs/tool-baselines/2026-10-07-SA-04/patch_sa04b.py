"""SA-04 part 2: live results complete a half-typed last word. Run from the repo root."""
import hashlib
JS = "assets/js/assistant.js"
t = open(JS, "rb").read()
assert hashlib.md5(t).hexdigest() == "eed35622e04e4f04a6436cd5230b1a15", "assistant.js not at SA-04 part 1"
t = t.decode("utf-8")
a1 = "\tvar questions = null;   // [{t:"
assert t.count(a1) == 1
add = (
"\t/* SA-04: while the last word is still being typed it is usually not a word\n"
"\t   yet (\"germ\"), so live results complete it to the most frequent word on\n"
"\t   the site that starts with it. The word list is built once, on first use. */\n"
"\tvar vocab = null;\n"
"\tfunction completeLast(q) {\n"
"\t\tif (!docs || /\\s$/.test(q)) return q;\n"
"\t\tvar m = q.toLowerCase().match(/([a-z0-9]+)$/);\n"
"\t\tif (!m || m[1].length < 2 || STOP[m[1]] || postings[stem(m[1])]) return q;\n"
"\t\tif (!vocab) {\n"
"\t\t\tvocab = Object.create(null);\n"
"\t\t\tfor (var i = 0; i < docs.length; i++) {\n"
"\t\t\t\tvar ws = (docs[i].t + ' ' + docs[i].x).toLowerCase().match(wordRe) || [];\n"
"\t\t\t\tfor (var j = 0; j < ws.length; j++) vocab[ws[j]] = (vocab[ws[j]] || 0) + 1;\n"
"\t\t\t}\n"
"\t\t}\n"
"\t\tvar w = m[1], best = null, bestN = 0;\n"
"\t\tfor (var v in vocab) if (vocab[v] > bestN && v.length > w.length && v.indexOf(w) === 0) { best = v; bestN = vocab[v]; }\n"
"\t\treturn best ? q.slice(0, q.length - w.length) + best : q;\n"
"\t}\n\n")
t = t.replace(a1, add + a1)
a2 = "\t\tif (q.length >= 3) run(q, '');\n"
assert t.count(a2) == 1
t = t.replace(a2, "\t\tif (q.length >= 3) run(completeLast(q), '');\n")
assert "\u2014" not in t
open(JS, "wb").write(t.encode("utf-8"))
print("patched", hashlib.md5(t.encode()).hexdigest())
