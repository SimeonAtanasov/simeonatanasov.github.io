# -*- coding: utf-8 -*-
"""Markdown version of a digest print HTML, the way the 23 October 2026 study-guide Markdown
files were made: pandoc -f html -t markdown_strict+pipe_tables --wrap=none, with the chip
spans of each entry turned into " · " separated text, entry headings at ###, and the vault
front matter (title, date, source, tags) on top.

usage: python3 md_from_print.py <print.html> <out.md> <title> <date YYYY-MM-DD> <pdf name>
"""
import re, subprocess, sys, html

src, out, title, date, pdfname = sys.argv[1:6]
s = open(src, encoding="utf-8").read()
s = re.sub(r"<style>.*?</style>", "", s, flags=re.S)
# entry heading h4 -> h3 (pandoc writes ### for h3)
s = s.replace('<div class="entry"><h4>', '<div class="entry"><h3>').replace('</h4><p class="meta">', '</h3><p class="meta">')

def meta(m):
    inner = m.group(1)
    inner = inner.replace("&middot;", "·")
    inner = re.sub(r'<span class="ref">(\[\d+\])</span>', r"\1", inner)
    inner = re.sub(r'<span class="tag[^"]*">([^<]*)</span>', " · \\1", inner)
    inner = re.sub(r"\s*·\s*", " · ", inner).strip()
    return '<p class="meta">%s</p>' % inner

s = re.sub(r'<p class="meta">(.*?)</p>', meta, s, flags=re.S)
# cover statistics: <span class="n">80</span><span class="l">legislation</span> -> **80** legislation
s = re.sub(r'<span class="n">([^<]*)</span><span class="l">([^<]*)</span>', r"<strong>\1</strong> \2", s)
assert chr(0x2014) not in s
r = subprocess.run(["pandoc", "-f", "html", "-t", "markdown_strict+pipe_tables", "--wrap=none"], input=s.encode("utf-8"), capture_output=True, check=True)
body = r.stdout.decode("utf-8")
front = '---\ntitle: "%s"\ndate: %s\nsource: "simeonatanasov.github.io/Claude outputs/study-guides/%s"\ntags: [study-guide]\n---\n\n' % (title, date, pdfname)
text = front + body
assert chr(0x2014) not in text
open(out, "w", encoding="utf-8", newline="\n").write(text)
print(out, len(text.encode("utf-8")), "bytes")
