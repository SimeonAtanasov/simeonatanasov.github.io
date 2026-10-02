"""Converts a digest PDF to a Markdown text version beside it.
Usage: python3 pdf_to_md.py <file.pdf> [...]. Needs pymupdf4llm.
Running heads, page numbers and soft line-break hyphens are removed; tables become
Markdown tables. About 4.6 percent of words differ from the PDF text, nearly all
running heads and rejoined hyphenations. The PDF stays the reference."""
import pymupdf4llm, pymupdf, re, sys, collections
def convert(pdf, title):
    doc = pymupdf.open(pdf)
    # running heads: short lines repeated on many pages
    pages = pymupdf4llm.to_markdown(pdf, page_chunks=True, show_progress=False, use_ocr=False, write_images=False, embed_images=False, ignore_images=True)
    cnt = collections.Counter()
    for p in pages:
        for l in set(x.strip() for x in p["text"].splitlines() if x.strip()):
            cnt[l] += 1
    n = len(pages)
    heads = {l for l, c in cnt.items() if c >= max(5, n // 4) and len(l) < 90 and not l.startswith("|") and not l.startswith("#") and not l.startswith("-")}
    top = collections.Counter()
    for p in pages:
        firsts = [x.strip() for x in p["text"].splitlines() if x.strip()][:4]
        for l in firsts:
            if not l.startswith(("#", "-", "|", "**[")) and len(l) < 70 and not l.endswith(".") and not l[:1].isdigit(): top[l] += 1
    heads |= {l for l, c in top.items() if c >= 2}
    out = []
    for p in pages:
        for l in p["text"].splitlines():
            s = l.strip()
            if s in heads and (p is not pages[0] or s.startswith("_")): continue
            if re.fullmatch(r"\d{1,3}", s): continue
            if s in ("-", "- ", "*", "-  "): continue
            out.append(l.rstrip())
    t = "\n".join(out)
    t = t.replace("<mark>", "").replace("</mark>", "")
    t = re.sub(r"(\w)‐ (\w)", r"\1\2", t)      # soft line-break hyphens from the PDF
    t = re.sub(r"(\w)- \n?(\w)", lambda m: m.group(1)+"-"+m.group(2) if False else m.group(0), t)
    t = re.sub(r"\n{3,}", "\n\n", t)
    t = re.sub(r"^=== Document parser messages ===.*?\n", "", t, flags=re.S|re.M)
    t = t.replace("—", "-")
    head = "<!-- Text version of %s, converted from the PDF. The PDF is the reference; tables and layout are simplified here. -->\n\n" % pdf
    return head + t.strip() + "\n", heads
for pdf in sys.argv[1:]:
    md, heads = convert(pdf, pdf)
    open(pdf[:-4] + ".md", "w", encoding="utf-8").write(md)
    print(pdf, len(md), "dropped running heads:", sorted(heads)[:8])
