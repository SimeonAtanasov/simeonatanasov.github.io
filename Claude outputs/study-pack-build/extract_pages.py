import re, json, sys
from bs4 import BeautifulSoup, NavigableString, Tag

SRC = "/home/claude/fix/"


def inline(node):
    out = []
    for c in node.children:
        if isinstance(c, NavigableString):
            out.append(str(c))
        elif isinstance(c, Tag):
            if c.name in ("strong", "b"):
                out.append("**" + inline(c).strip() + "**")
            elif c.name in ("em", "i"):
                out.append("*" + inline(c).strip() + "*")
            elif c.name == "code":
                out.append("`" + inline(c).strip() + "`")
            elif c.name == "br":
                out.append(" ")
            elif c.name == "a":
                out.append(inline(c))
            else:
                out.append(inline(c))
    t = "".join(out)
    t = re.sub(r"\s+", " ", t)
    return t


def block(node, depth=0):
    """Return list of markdown block strings."""
    out = []
    for c in node.children:
        if isinstance(c, NavigableString):
            if c.strip():
                out.append(re.sub(r"\s+", " ", c.strip()))
            continue
        if not isinstance(c, Tag):
            continue
        n = c.name
        if n == "p":
            t = inline(c).strip()
            if t:
                out.append(t)
        elif n in ("h1", "h2", "h3", "h4", "h5", "h6"):
            lvl = int(n[1])
            out.append("#" * max(3, lvl) + " " + inline(c).strip())
        elif n in ("ul", "ol"):
            out.append(listmd(c, 0))
        elif n == "table":
            out.append(tablemd(c))
        elif n == "blockquote":
            t = " ".join(block(c))
            out.append("> " + t)
        elif n in ("div", "section", "figure", "span"):
            out.extend(block(c, depth + 1))
        elif n == "details":
            s = c.find("summary")
            title = inline(s).strip() if s else ""
            if title:
                out.append("#### " + title)
            body = [x for x in c.children if isinstance(x, Tag) and x.name != "summary"]
            for b in body:
                out.extend(block(b, depth + 1))
        elif n in ("script", "style", "nav", "noscript"):
            continue
        else:
            out.extend(block(c, depth + 1))
    return [o for o in out if o.strip()]


def listmd(ul, indent):
    lines = []
    ordered = ul.name == "ol"
    i = 0
    for li in ul.find_all("li", recursive=False):
        i += 1
        subs = [x for x in li.find_all(["ul", "ol"], recursive=False)]
        for s in subs:
            s.extract()
        text = inline(li).strip()
        marker = f"{i}. " if ordered else "- "
        lines.append("  " * indent + marker + text)
        for s in subs:
            lines.append(listmd(s, indent + 1))
    return "\n".join(lines)


def tablemd(tb):
    rows = []
    for tr in tb.find_all("tr"):
        cells = [inline(td).strip() for td in tr.find_all(["th", "td"])]
        rows.append(cells)
    if not rows:
        return ""
    head = rows[0]
    body = rows[1:]
    w = len(head)
    out = ["| " + " | ".join(head) + " |", "|" + "|".join(["---"] * w) + "|"]
    for r in body:
        r = (r + [""] * w)[:w]
        out.append("| " + " | ".join(r) + " |")
    return "\n".join(out)


def extract(fname, prefix):
    soup = BeautifulSoup(open(SRC + fname, encoding="utf-8").read(), "html.parser")
    h1 = soup.find("h1").get_text(strip=True)
    intro = soup.find("div", class_=f"{prefix}-intro")
    intro_md = block(intro) if intro else []
    acc = soup.find("div", class_=f"{prefix}-accordion") or soup.find(
        "section", id=re.compile(prefix)
    )
    items = []
    for d in soup.find_all("details", class_=f"{prefix}-item"):
        s = d.find("summary")
        num = s.find("span", class_=f"{prefix}-num")
        numtxt = num.get_text(strip=True) if num else ""
        if num:
            num.extract()
        title = re.sub(r"\s+", " ", s.get_text(" ", strip=True)).strip()
        body = d.find("div", class_=f"{prefix}-body")
        items.append(
            {
                "num": numtxt.strip(". "),
                "title": title,
                "id": d.get("id", ""),
                "blocks": block(body) if body else [],
            }
        )
    return {"title": h1, "intro": intro_md, "items": items}


if __name__ == "__main__":
    pp = extract("practical-privacy.html", "pp")
    ai = extract("practical-ai-act-advice.html", "aia")
    json.dump(
        {"practical_privacy": pp, "ai_act": ai},
        open("/home/claude/pack/src/pages.json", "w", encoding="utf-8"),
        ensure_ascii=False,
        indent=1,
    )
    for k, d in (("PP", pp), ("AIA", ai)):
        print(k, d["title"], "| items:", len(d["items"]))
        for it in d["items"]:
            wc = sum(len(b.split()) for b in it["blocks"])
            print("  ", it["num"], it["title"][:70], "->", len(it["blocks"]), "blocks", wc, "words")
