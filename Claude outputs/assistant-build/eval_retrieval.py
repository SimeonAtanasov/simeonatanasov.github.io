#!/usr/bin/env python3
"""
Compares retrieval variants on a fixed set of questions with expected hits.

  bm25            keyword search as the widget implements it
  static-<dims>   static token table (Model2Vec style), both sides
  full            all-MiniLM-L6-v2 on both sides (the reference, never ships)
  hybrid-<dims>   reciprocal rank fusion of bm25 and static

Prints hit@3, hit@5, hit@10 and MRR per variant. Expected hits are regular
expressions over the chunk id or title, so any of several chunks count.
"""
import json
import math
import os
import re
import sys
import time
from collections import Counter, defaultdict

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from build_index import SYNONYMS  # noqa: E402

TESTS = [
    ("when does the fundamental rights impact assessment apply", r"^aia-art-27|^tool-fria|^cw-r\d+$"),
    ("which assessment should I use for a customer chatbot", r"^tool-cat-(aipath|genai)|^faq-start|^aipath-guide-customer"),
    ("how long do I have to notify a data breach", r"^pp-pp-data-breach|^tool-incident"),
    ("how is the DPIA risk level calculated", r"^tool-dpia-scoring"),
    ("legitimate interests balancing test", r"^tool-lia"),
    ("cookie consent rules in Germany", r"^ck-d.*", "Germany"),
    ("CNIL guidelines on cookies", r"^ck-d.*", "France"),
    ("consent or pay models", r"^ed-d154|^ck-d001|^ck-d011|^ck-d100|^ck-d008"),
    ("general purpose AI model with systemic risk", r"^aia-art-51|^aia-art-55|^aia-annex-13"),
    ("which AI systems are high risk", r"^aia-annex-3|^aia-art-6|^aiaadv-aia-high-risk"),
    ("AI literacy obligation for staff", r"^aia-art-4$|^cw-r01|^aiaadv-aia-building-ai-literacy"),
    ("do I have to label deepfakes", r"^aia-art-50"),
    ("penalties under the AI Act", r"^aia-art-99|^aiaadv-aia-governance-enforcement"),
    ("can my employer read my mailbox", r"^pp-pp-accessing-another-person-s-mailbox"),
    ("recording meetings with AI notetakers", r"^pp-pp-meetings"),
    ("sending personal data to the US", r"^tool-tia|^ed-d38[0-4]|^privacy-notice-transfers|^tool-cat-tia"),
    ("standard contractual clauses", r"^ed-d366|^ed-d367|^tool-tia|^ed-d503|^tool-cat-tia"),
    ("how much could my company be fined", r"^calc-|^tool-cat-calculator"),
    ("appeal against a fine in Spain", r"^enforce-ge-c-es"),
    ("who enforces privacy law in Brazil", r"^world-ge-c-br"),
    ("do I need to appoint a DPO", r"^readiness-act-g2|^readiness-act-g3"),
    ("records of processing activities", r"^readiness-act-i1|^readiness-act-i2"),
    ("right to be forgotten requests", r"^readiness-act-r6|^pp-pp-handling-requests"),
    ("ISO 42001 mapped to the AI Act", r"^cw-|^tool-cat-crosswalk|^aipath-guide-7"),
    ("NIST AI RMF govern function", r"^cw-|^aipath-guide-7|^aipath-guide-3"),
    ("do my answers leave my device", r"^faq-device"),
    ("how do I save my assessment and continue later", r"^faq-save"),
    ("use the site offline", r"^faq-install"),
    ("ENISA severity scale for breaches", r"^tool-incident"),
    ("assessing a vendor's security", r"^tool-tpsa|^tool-cat-tpsa"),
    ("what are the scope questions in the readiness assessment", r"^readiness-the-13-scope|^readiness-gdpr-readiness"),
    ("age of consent for children online", r"^readiness-act-e5|^pp-pp-consent"),
    ("dark patterns in cookie banners", r"^ed-d012|^ck-d018|^ck-d045|^ck-d057|^ck-d007"),
    ("facial recognition technology", r"^ed-d008|^ed-d151"),
    ("emotion recognition of employees", r"^aipath-guide-emotion|^aia-art-5$|^aia-art-5-|^cw-r0[2-9]"),
    ("prohibited AI practices", r"^aia-art-5$|^aia-art-5-|^aiaadv-aia-prohibited"),
    ("what cookies does this website set", r"^cookie-notice"),
    ("DSA and GDPR interplay", r"^ed-d001"),
    ("new application dates for high-risk systems after the omnibus", r"^aia-doc-01|^aia-art-113|omnibus"),
    ("google analytics without consent", r"^ck-d070"),
    ("lead supervisory authority in cross-border cases", r"^enforce-ge-cross"),
    ("tracking users without asking them", r"^ck-d|^pp-pp-website"),
    ("can I reuse data for a new purpose", r"^pp-pp-secondary-use"),
    ("staff monitoring with cameras", r"^pp-pp-video-surveillance"),
    ("what is the impact level in the pathway", r"^aipath-guide-6|^tool-aipath"),
    ("copyright and training data for generative AI", r"^aiaadv-aia-copyright|^tool-genai"),
    ("marketing emails opt out", r"^pp-pp-marketing"),
    ("processor contract requirements", r"^readiness-act-(c|t)\d|^pp-pp-records"),
    ("Binding corporate rules approval", r"^ed-d\d+"),
    ("explain the Article 35 triggers", r"^tool-privacy|^tool-dpia"),
]


def tokenize(text):
    """Mirrors the widget's tokenizer: lowercase, split on non-alphanumerics,
    drop one-letter tokens, light plural stripping, synonym expansion."""
    text = text.lower().replace("'", "")
    toks = re.findall(r"[a-z0-9]+(?:-[a-z0-9]+)*", text)
    out = []
    for t in toks:
        if len(t) < 2:
            continue
        out.append(stem(t))
        exp = SYNONYMS.get(t)
        if exp:
            out.extend(stem(x) for x in re.findall(r"[a-z0-9]+", exp))
    return out


def stem(t):
    if len(t) > 4 and t.endswith("ies"):
        return t[:-3] + "y"
    if len(t) > 4 and t.endswith("sses"):
        return t[:-2]
    if len(t) > 3 and t.endswith("s") and not t.endswith("ss") and not t.endswith("us") and not t.endswith("is"):
        return t[:-1]
    return t


class BM25:
    def __init__(self, docs, k1=1.2, b=0.75):
        self.k1, self.b = k1, b
        self.tf = []
        self.df = Counter()
        self.len = []
        for d in docs:
            toks = tokenize(d["t"]) * 2 + tokenize(d["x"])
            c = Counter(toks)
            self.tf.append(c)
            self.len.append(len(toks))
            for t in c:
                self.df[t] += 1
        self.n = len(docs)
        self.avg = sum(self.len) / self.n
        self.idf = {t: math.log(1 + (self.n - df + 0.5) / (df + 0.5)) for t, df in self.df.items()}

    def scores(self, q):
        qt = tokenize(q)
        s = np.zeros(self.n)
        for t in set(qt):
            idf = self.idf.get(t)
            if not idf:
                continue
            for i in range(self.n):
                f = self.tf[i].get(t)
                if f:
                    s[i] += idf * f * (self.k1 + 1) / (f + self.k1 * (1 - self.b + self.b * self.len[i] / self.avg))
        return s


def rrf(*rankings, k=60):
    s = defaultdict(float)
    for r in rankings:
        for pos, i in enumerate(r):
            s[i] += 1.0 / (k + pos + 1)
    return sorted(s, key=lambda i: -s[i])


def main():
    import onnxruntime as ort
    from tokenizers import Tokenizer
    from sklearn.decomposition import PCA

    chunks = json.load(open(os.path.join(HERE, "work", "chunks.json")))
    ids = [c["id"] for c in chunks]
    bm = BM25(chunks)

    tok = Tokenizer.from_file(os.path.join(HERE, "model", "tokenizer.json"))
    tok.no_truncation()
    tok.no_padding()
    sess = ort.InferenceSession(os.path.join(HERE, "model", "model.onnx"), providers=["CPUExecutionProvider"])
    keep = json.load(open(os.path.join(HERE, "work", "keep.json")))
    kept_index = {tid: j for j, tid in enumerate(keep)}
    tokvecs_full = np.load(os.path.join(HERE, "work", "tokvecs_full.npy"))

    def full_embed(texts):
        tok.enable_padding(pad_id=0, pad_token="[PAD]")
        tok.enable_truncation(512)
        enc = tok.encode_batch(texts)
        ids_ = np.array([e.ids for e in enc], dtype=np.int64)
        mask = np.array([e.attention_mask for e in enc], dtype=np.int64)
        out = sess.run(None, {"input_ids": ids_, "attention_mask": mask, "token_type_ids": np.zeros_like(ids_)})[0]
        m = mask[..., None].astype(np.float32)
        v = (out * m).sum(1) / m.sum(1)
        tok.no_padding()
        tok.no_truncation()
        return v / np.linalg.norm(v, axis=1, keepdims=True)

    cache = os.path.join(HERE, "work", "docvecs_full.npy")
    if os.path.exists(cache):
        docs_full = np.load(cache)
    else:
        t0 = time.time()
        docs_full = np.concatenate([full_embed([c["t"] + ". " + c["x"] for c in chunks[i:i + 64]]) for i in range(0, len(chunks), 64)])
        np.save(cache, docs_full)
        print("full doc embeddings: %.1fs" % (time.time() - t0))

    # token ids per chunk, once
    doc_tok_rows = []
    for c in chunks:
        tids = tok.encode(c["t"] + ". " + c["x"], add_special_tokens=False).ids
        doc_tok_rows.append([kept_index[i] for i in tids if i in kept_index])

    def static_tables(dims, weighting):
        pca = PCA(n_components=dims, random_state=0)
        red = pca.fit_transform(tokvecs_full).astype(np.float32)
        if weighting == "zipf":
            w = np.log1p(np.array(keep, dtype=np.float32))
        elif weighting == "none":
            w = np.ones(len(keep), dtype=np.float32)
        elif weighting == "idf":
            df = np.zeros(len(keep))
            for rows in doc_tok_rows:
                for r in set(rows):
                    df[r] += 1
            w = np.log(1 + (len(chunks) + 1) / (df + 1)).astype(np.float32)
            w = np.maximum(w, 1.0)
        red = red * w[:, None]
        # int8 quantisation, as shipped
        scale = np.abs(red).max() / 127.0
        red = np.clip(np.round(red / scale), -127, 127) * scale
        return red

    def static_doc(red, rows):
        if not rows:
            return np.zeros(red.shape[1], dtype=np.float32)
        v = red[rows].mean(0)
        n = np.linalg.norm(v)
        return v / n if n else v

    def static_query(red, q):
        qq = q.lower()
        for t in re.findall(r"[a-z0-9]+", qq):
            if t in SYNONYMS:
                qq += " " + SYNONYMS[t]
        tids = tok.encode(qq, add_special_tokens=False).ids
        return static_doc(red, [kept_index[i] for i in tids if i in kept_index])

    def evaluate(name, rank_fn):
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
                if hit < 5:
                    h5 += 1
                if hit < 3:
                    h3 += 1
            else:
                misses.append((q, [chunks[i]["id"] for i in ranking[:3]]))
        n = len(TESTS)
        print("%-14s hit@3 %.2f  hit@5 %.2f  hit@10 %.2f  MRR %.2f" % (name, h3 / n, h5 / n, h10 / n, mrr / n))
        return misses

    def bm25_rank(q):
        return list(np.argsort(-bm.scores(q)))

    misses = evaluate("bm25", bm25_rank)
    for q, top in misses:
        print("    miss:", q, "->", top)

    def full_rank(q):
        qv = full_embed([q])[0]
        return list(np.argsort(-(docs_full @ qv)))

    evaluate("full", full_rank)

    def hybrid_full_rank(q):
        return rrf(bm25_rank(q)[:50], full_rank(q)[:50])

    evaluate("hybrid-full", hybrid_full_rank)

    results = {}
    for dims in (64, 128, 192, 256):
        for weighting in ("zipf", "idf"):
            red = static_tables(dims, weighting)
            docs_static = np.stack([static_doc(red, rows) for rows in doc_tok_rows])

            def static_rank(q, red=red, docs_static=docs_static):
                qv = static_query(red, q)
                return list(np.argsort(-(docs_static @ qv)))

            def hybrid_rank(q, static_rank=static_rank):
                return rrf(bm25_rank(q)[:50], static_rank(q)[:50])

            evaluate("static-%d-%s" % (dims, weighting), static_rank)
            m = evaluate("hybrid-%d-%s" % (dims, weighting), hybrid_rank)
            results[(dims, weighting)] = m
    for q, top in results[(128, "zipf")]:
        print("    hybrid-128 miss:", q, "->", top)


if __name__ == "__main__":
    main()
