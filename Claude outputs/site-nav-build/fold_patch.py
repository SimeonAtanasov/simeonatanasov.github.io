"""Floating Expand all / Collapse all control for the side contents (bottom left).

Usage:
  python3 fold_patch.py page <html> <css> <prefix>      shipped page and its stylesheet
  python3 fold_patch.py navmod <digest_nav.py>          the shared module (top_button, _JS, _CSS)
  python3 fold_patch.py aiabuild <build_aia_page.py>    the AI Act builder (inline copies)

Version 2 (20 September 2026, evening): two small stacked buttons, icon plus EXP / COL,
narrow enough to sit in the gutter left of the contents column; they appear once the
contents has scrolled into the upper half of the viewport, like the Top button on the
right. A file that carries version 1 (the wide two-label pill) is upgraded in place; a
file without the control gets it added. Every edit asserts its anchor occurs exactly
once. No em dashes. LF only.
"""
import sys

# ---------------------------------------------------------------- version 1 (to strip)

def v1_html(P):
    return ('<div class="%s-toc-fold" id="%s-toc-fold" role="group" aria-label="Contents blocks">'
            '<button type="button" class="%s-toc-fold-btn" id="%s-expand" title="Open every block in the contents"><i class="fas fa-angle-double-down"></i> Expand all</button>'
            '<button type="button" class="%s-toc-fold-btn" id="%s-collapse" title="Close every block in the contents"><i class="fas fa-angle-double-up"></i> Collapse all</button></div>' % (P, P, P, P, P, P))


V1_VIEW = "\t\tgrouped.hidden = v !== 'grouped'; flat.hidden = v !== 'flat'; fold.hidden = v !== 'grouped';\n"


def v1_handlers(sel, byid):
    return ("\n\t/* expand or collapse every block in the contents (floating control, bottom left) */\n"
            "\tfunction setAll(open) {\n"
            "\t\tArray.prototype.forEach.call(toc.querySelectorAll(%s), function (b) { setOpen(b, open); });\n"
            "\t\tif (!open) toc.scrollTop = 0;\n"
            "\t}\n"
            "\t%s.addEventListener('click', function () { setAll(true); });\n"
            "\t%s.addEventListener('click', function () { setAll(false); });\n"
            % (sel, byid % 'expand', byid % 'collapse'))


V1_CSS_MAIN = """.ai-toc-fold { position: fixed; left: 1.25em; bottom: 1.25em; z-index: 1150; display: flex; border-radius: 2em; overflow: hidden; box-shadow: 0 0.3em 1em rgba(0,0,0,0.4); }
.ai-toc-fold[hidden] { display: none; }
.ai-toc-fold-btn { height: auto; line-height: 1.4; padding: 0.6em 0.9em; font-size: 0.8em; letter-spacing: 0.05em; text-transform: uppercase; background: rgba(66,103,166,0.95); border: 0 !important; border-radius: 0 !important; box-shadow: none !important; white-space: nowrap; }
.ai-toc-fold-btn + .ai-toc-fold-btn { border-left: solid 1px rgba(255,255,255,0.3) !important; }
.ai-toc-fold-btn:hover, .ai-toc-fold-btn:focus { background: #4267a6; color: #fff !important; }
.ai-toc-fold-btn::after { display: none; }
#ai-toc-grouped { padding-bottom: 3.2em; }
"""
V1_CSS_MEDIA = "\t.ai-toc-fold { display: none; }\n\tbody.ai-toc-drawer .ai-toc-fold { display: flex; }\n\tbody.ai-toc-drawer .ai-toc-fold[hidden] { display: none; }\n"

# ---------------------------------------------------------------- version 2 (current)

def html_block(P):
    return ('<div class="%s-toc-fold" id="%s-toc-fold" role="group" aria-label="Contents blocks" hidden>'
            '<button type="button" class="%s-toc-fold-btn" id="%s-expand" title="Expand all blocks in the contents" aria-label="Expand all"><i class="fas fa-angle-double-down"></i><span>Exp</span></button>'
            '<button type="button" class="%s-toc-fold-btn" id="%s-collapse" title="Collapse all blocks in the contents" aria-label="Collapse all"><i class="fas fa-angle-double-up"></i><span>Col</span></button></div>' % (P, P, P, P, P, P))


JS_DECL = "\tvar fold = %s, foldGrouped = true, foldMq = window.matchMedia('(max-width: 1100px)');\n"

VIEW_ANCHOR = "\t\tgrouped.hidden = v !== 'grouped'; flat.hidden = v !== 'flat';\n"
VIEW_NEW = "\t\tgrouped.hidden = v !== 'grouped'; flat.hidden = v !== 'flat'; foldGrouped = v === 'grouped'; syncFold();\n"

TOP_ANCHOR = "\twindow.addEventListener('scroll', function () { topBtn.hidden = window.scrollY < 600; }, { passive: true });\n"


def js_handlers(sel, byid):
    return ("\n\t/* expand or collapse every block in the contents: two small floating buttons at the bottom left,\n"
            "\t   shown once the contents has scrolled into the upper half of the screen (in the drawer: whenever it is open) */\n"
            "\tfunction setAll(open) {\n"
            "\t\tArray.prototype.forEach.call(toc.querySelectorAll(%s), function (b) { setOpen(b, open); });\n"
            "\t\tif (!open) toc.scrollTop = 0;\n"
            "\t}\n"
            "\tfunction syncFold() { fold.hidden = !foldGrouped || (!foldMq.matches && toc.getBoundingClientRect().top > window.innerHeight * 0.5); }\n"
            "\t%s.addEventListener('click', function () { setAll(true); });\n"
            "\t%s.addEventListener('click', function () { setAll(false); });\n"
            "\twindow.addEventListener('scroll', syncFold, { passive: true });\n"
            "\twindow.addEventListener('resize', syncFold);\n"
            "\tsyncFold();\n"
            % (sel, byid % 'expand', byid % 'collapse'))


CSS_TOP_ANCHOR = ".ai-top[hidden] { display: none; }\n"
CSS_MAIN = """.ai-toc-fold { position: fixed; left: 0.6em; bottom: 1.25em; z-index: 1150; display: flex; flex-direction: column; border-radius: 1.1em; overflow: hidden; box-shadow: 0 0.3em 1em rgba(0,0,0,0.4); }
.ai-toc-fold[hidden] { display: none; }
.ai-toc-fold-btn { display: flex !important; flex-direction: column; align-items: center; justify-content: center; gap: 0.2em; width: 2.6em; height: auto; line-height: 1; padding: 0.55em 0 0.5em 0; font-size: 1em; letter-spacing: 0; background: rgba(66,103,166,0.95); border: 0 !important; border-radius: 0 !important; box-shadow: none !important; white-space: nowrap; }
.ai-toc-fold-btn i { font-size: 0.9em; }
.ai-toc-fold-btn span { font-size: 0.5em; letter-spacing: 0.1em; text-transform: uppercase; }
.ai-toc-fold-btn + .ai-toc-fold-btn { border-top: solid 1px rgba(255,255,255,0.3) !important; }
.ai-toc-fold-btn:hover, .ai-toc-fold-btn:focus { background: #4267a6; color: #fff !important; }
.ai-toc-fold-btn::after { display: none; }
"""
CSS_MEDIA_ANCHOR = "\t.ai-top { bottom: 4.6em; }\n"
CSS_MEDIA = "\t.ai-toc-fold { display: none; }\n\tbody.ai-toc-drawer .ai-toc-fold { display: flex; }\n\tbody.ai-toc-drawer .ai-toc-fold[hidden] { display: none; }\n\t#ai-toc-grouped { padding-bottom: 5em; }\n"


def rep(s, old, new, label):
    n = s.count(old)
    assert n == 1, "%s: anchor found %d times" % (label, n)
    return s.replace(old, new)


def check(s, name):
    assert "\r" not in s, name + ": CRLF"
    assert chr(0x2014) not in s, name + ": em dash"
    assert s.count('-toc-fold" id="') == 1 and s.count('-expand" title=') == 1 and s.count('-collapse" title=') == 1, name + ": control count"


def sub_for(P):
    return lambda t: t.replace(".ai-", ".%s-" % P).replace("#ai-", "#%s-" % P).replace("body.ai-", "body.%s-" % P)


def upgrade_js(h, had_v1, decl_v1, decl_v2, sel, byid):
    """Strip version 1 script pieces if present, then add version 2."""
    if had_v1:
        h = rep(h, decl_v1, "", "v1 decl")
        h = rep(h, V1_VIEW, VIEW_ANCHOR, "v1 view line")
        h = rep(h, v1_handlers(sel, byid), "", "v1 handlers")
    h = rep(h, "\tfunction setView(v) {\n", decl_v2 + "\tfunction setView(v) {\n", "setView")
    h = rep(h, VIEW_ANCHOR, VIEW_NEW, "view line")
    h = rep(h, TOP_ANCHOR, TOP_ANCHOR + js_handlers(sel, byid), "top handlers")
    return h


def upgrade_css(c, had_v1, sub):
    if had_v1:
        c = rep(c, sub(V1_CSS_MAIN), "", "v1 css main")
        c = rep(c, sub(V1_CSS_MEDIA), "", "v1 css media")
    c = rep(c, sub(CSS_TOP_ANCHOR), sub(CSS_TOP_ANCHOR + CSS_MAIN), "css top")
    c = rep(c, sub(CSS_MEDIA_ANCHOR), sub(CSS_MEDIA_ANCHOR + CSS_MEDIA), "css media")
    return c


def patch_page(html_path, css_path, P):
    h = open(html_path, "rb").read().decode("utf-8")
    c = open(css_path, "rb").read().decode("utf-8")
    top = '<button type="button" class="%s-top" id="%s-top" aria-label="Back to top" hidden>' % (P, P)
    had_v1 = "-toc-fold" in h
    if had_v1:
        h = rep(h, v1_html(P), "", "v1 html")
    h = rep(h, top, html_block(P) + top, "top button")
    if P == "ai":
        h = upgrade_js(h, had_v1, "\tvar fold = document.getElementById('ai-toc-fold');\n", JS_DECL % "document.getElementById('ai-toc-fold')",
                       "'.ai-toc-ch, .ai-toc-sec'", "document.getElementById('ai-%s')")
    else:
        h = upgrade_js(h, had_v1, "\tvar fold = $('toc-fold');\n", JS_DECL % "$('toc-fold')",
                       "'.' + P + '-toc-ch, .' + P + '-toc-sec'", "$('%s')")
    c = upgrade_css(c, had_v1, sub_for(P))
    check(h, html_path); assert "\r" not in c and chr(0x2014) not in c
    open(html_path, "wb").write(h.encode("utf-8"))
    open(css_path, "wb").write(c.encode("utf-8"))
    print("patched", html_path, len(h.encode("utf-8")), css_path, len(c.encode("utf-8")))


def patch_navmod(path):
    s = open(path, "rb").read().decode("utf-8")
    base_top = ("            '<button type=\"button\" class=\"%s-top\" id=\"%s-top\" aria-label=\"Back to top\" hidden><i class=\"fas fa-arrow-up\"></i> Top</button>'\n"
                "            '<div class=\"%s-toc-backdrop\" id=\"%s-toc-backdrop\" hidden></div><button type=\"button\" class=\"%s-toc-fab\" id=\"%s-toc-open\" aria-controls=\"%s-toc\" aria-expanded=\"false\"><i class=\"fas fa-list\"></i> Contents</button>'")
    v0 = "    return (" + base_top.lstrip(" ") + " % (P, P, P, P, P, P, P))\n"
    v1 = ("    return ('<div class=\"%s-toc-fold\" id=\"%s-toc-fold\" role=\"group\" aria-label=\"Contents blocks\">'\n"
          "            '<button type=\"button\" class=\"%s-toc-fold-btn\" id=\"%s-expand\" title=\"Open every block in the contents\"><i class=\"fas fa-angle-double-down\"></i> Expand all</button>'\n"
          "            '<button type=\"button\" class=\"%s-toc-fold-btn\" id=\"%s-collapse\" title=\"Close every block in the contents\"><i class=\"fas fa-angle-double-up\"></i> Collapse all</button></div>'\n"
          + base_top + " % (P, P, P, P, P, P, P, P, P, P, P, P, P))\n")
    v2 = ("    return ('<div class=\"%s-toc-fold\" id=\"%s-toc-fold\" role=\"group\" aria-label=\"Contents blocks\" hidden>'\n"
          "            '<button type=\"button\" class=\"%s-toc-fold-btn\" id=\"%s-expand\" title=\"Expand all blocks in the contents\" aria-label=\"Expand all\"><i class=\"fas fa-angle-double-down\"></i><span>Exp</span></button>'\n"
          "            '<button type=\"button\" class=\"%s-toc-fold-btn\" id=\"%s-collapse\" title=\"Collapse all blocks in the contents\" aria-label=\"Collapse all\"><i class=\"fas fa-angle-double-up\"></i><span>Col</span></button></div>'\n"
          + base_top + " % (P, P, P, P, P, P, P, P, P, P, P, P, P))\n")
    had_v1 = "-toc-fold" in s
    if had_v1:
        s = rep(s, v1, v2, "top_button v1")
    else:
        s = rep(s, v0, v2, "top_button")
    s = upgrade_js(s, had_v1, "\tvar fold = $('toc-fold');\n", JS_DECL % "$('toc-fold')", "'.' + P + '-toc-ch, .' + P + '-toc-sec'", "$('%s')")
    s = upgrade_css(s, had_v1, lambda t: t)
    check(s, path)
    open(path, "wb").write(s.encode("utf-8"))
    print("patched", path, len(s.encode("utf-8")))


def patch_aiabuild(path):
    s = open(path, "rb").read().decode("utf-8")
    top = "    out.append('<button type=\"button\" class=\"ai-top\" id=\"ai-top\" aria-label=\"Back to top\" hidden><i class=\"fas fa-arrow-up\"></i> Top</button>')\n"
    had_v1 = "-toc-fold" in s
    if had_v1:
        s = rep(s, "    out.append('%s')\n" % v1_html("ai"), "", "v1 html")
    s = rep(s, top, "    out.append('%s')\n" % html_block("ai") + top, "top button")
    s = upgrade_js(s, had_v1, "\tvar fold = document.getElementById('ai-toc-fold');\n", JS_DECL % "document.getElementById('ai-toc-fold')",
                   "'.ai-toc-ch, .ai-toc-sec'", "document.getElementById('ai-%s')")
    s = upgrade_css(s, had_v1, lambda t: t)
    check(s, path)
    open(path, "wb").write(s.encode("utf-8"))
    print("patched", path, len(s.encode("utf-8")))


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "page":
        patch_page(sys.argv[2], sys.argv[3], sys.argv[4])
    elif mode == "navmod":
        patch_navmod(sys.argv[2])
    elif mode == "aiabuild":
        patch_aiabuild(sys.argv[2])
    else:
        raise SystemExit("unknown mode")
