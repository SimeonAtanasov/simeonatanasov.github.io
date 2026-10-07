#!/usr/bin/env python3
"""Fast evaluation of the keyword ranker alone, with the tokenizer the widget uses."""
import json
import math
import os
import re
import sys
from collections import Counter, defaultdict

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from build_index import SYNONYMS  # noqa: E402
from eval_retrieval import TESTS  # noqa: E402
from search_text import tokenize  # noqa: E402


class BM25:
    def __init__(self, docs, k1=1.2, b=0.75, title_w=2, syn=True, doc_syn=False, exp_w=1.0):
        self.k1, self.b = k1, b
        self.post = defaultdict(list)   # term -> [(doc, tf)]
        self.len = []
        self.exp_w = exp_w
        s = SYNONYMS if (syn and doc_syn) else None
        self.bigrams = []
        for i, d in enumerate(docs):
            tt = tokenize(d["t"], s)
            tx = tokenize(d["x"], s)
            toks = tt * title_w + tx
            c = Counter(toks)
            self.len.append(len(toks))
            for t, f in c.items():
                self.post[t].append((i, f))
            self.bigrams.append(set(zip(tt + tx, (tt + tx)[1:])))
        self.n = len(docs)
        self.avg = sum(self.len) / self.n
        self.idf = {t: math.log(1 + (self.n - len(p) + 0.5) / (len(p) + 0.5)) for t, p in self.post.items()}
        self.syn = SYNONYMS if syn else None

    def scores(self, q, bigram_bonus=0.0):
        base = set(tokenize(q, None))
        qt = tokenize(q, self.syn)
        s = np.zeros(self.n)
        for t in set(qt):
            idf = self.idf.get(t)
            if not idf:
                continue
            w = 1.0 if t in base else self.exp_w
            for i, f in self.post[t]:
                s[i] += w * idf * f * (self.k1 + 1) / (f + self.k1 * (1 - self.b + self.b * self.len[i] / self.avg))
        if bigram_bonus:
            raw = tokenize(q, None)
            pairs = set(zip(raw, raw[1:]))
            if pairs:
                for i in range(self.n):
                    hits = len(pairs & self.bigrams[i])
                    if hits:
                        s[i] *= 1 + bigram_bonus * hits
        return s


def evaluate(name, chunks, rank_fn, verbose=False):
    h3 = h5 = h10 = 0
    mrr = 0.0
    misses = []
    for test in TESTS:
        q, rx = test[0], test[1]
        meta_rx = test[2] if len(test) > 2 else None
        ranking = rank_fn(q)[:10]
        hit = None
        for pos, i in enumerate(ranking):
            c = chunks[i]
            ok = re.search(rx, c["id"]) or re.search(rx, c["t"], re.I)
            if ok and meta_rx and not re.search(meta_rx, c["m"] + " " + c["t"] + " " + c["x"][:120], re.I):
                ok = False
            if ok:
                hit = pos
                break
        if hit is not None:
            mrr += 1.0 / (hit + 1)
            h10 += 1
            h5 += hit < 5
            h3 += hit < 3
        else:
            misses.append((q, [chunks[i]["id"] for i in ranking[:3]]))
    n = len(TESTS)
    print("%-28s hit@3 %.2f  hit@5 %.2f  hit@10 %.2f  MRR %.2f" % (name, h3 / n, h5 / n, h10 / n, mrr / n))
    if verbose:
        for q, top in misses:
            print("    miss:", q, "->", top)
    return misses


def main():
    chunks = json.load(open(os.path.join(HERE, "work", "chunks.json")))
    # inputs for test_tokenizer.js: every word in the corpus, and the questions
    words = set()
    for x in chunks:
        for w in re.findall(r"[a-z0-9]+", (x["t"] + " " + x["x"]).lower().replace("'", "")):
            words.add(w)
    json.dump(sorted(words), open(os.path.join(HERE, "work", "words.json"), "w"))
    json.dump([{"q": t[0], "rx": t[1], "meta": (t[2] if len(t) > 2 else None)} for t in TESTS],
              open(os.path.join(HERE, "work", "tests.json"), "w"))
    for doc_syn in (True, False):
        for exp_w in (1.0, 0.5, 0.3):
            for title_w in (2, 3):
                bm = BM25(chunks, title_w=title_w, syn=True, doc_syn=doc_syn, exp_w=exp_w, k1=1.5)
                evaluate("docsyn=%s expw=%.1f title=%d" % (doc_syn, exp_w, title_w), chunks, lambda q, bm=bm: list(np.argsort(-bm.scores(q, 0.1))))
    bm = BM25(chunks, title_w=3, syn=True, doc_syn=False, exp_w=0.5, k1=1.5)
    for bb in (0.1, 0.25, 0.5):
        evaluate("bigram %.2f" % bb, chunks, lambda q, bm=bm, bb=bb: list(np.argsort(-bm.scores(q, bb))))
    for k1, b in ((0.9, 0.4), (1.2, 0.5), (1.5, 0.75), (2.0, 0.75)):
        bm2 = BM25(chunks, k1=k1, b=b, title_w=3, syn=True, doc_syn=False, exp_w=0.5)
        evaluate("k1=%.1f b=%.2f" % (k1, b), chunks, lambda q, bm=bm2: list(np.argsort(-bm.scores(q, 0.1))))
    evaluate("final", chunks, lambda q, bm=bm: list(np.argsort(-bm.scores(q, 0.1))), verbose=True)


if __name__ == "__main__":
    main()
