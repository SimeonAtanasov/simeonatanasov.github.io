"""Add the floating Expand all / Collapse all control for the side contents.

Usage:
  python3 fold_patch.py page <html> <css> <prefix>      shipped page and its stylesheet
  python3 fold_patch.py navmod <digest_nav.py>          the shared module (top_button, _JS, _CSS)
  python3 fold_patch.py aiabuild <build_aia_page.py>    the AI Act builder (inline copies)

Every edit asserts its anchor occurs exactly once and refuses files that already carry the control.
No em dashes. LF only.
"""
import sys


def html_block(P):
    return ('<div class="%s-toc-fold" id="%s-toc-fold" role="group" aria-label="Contents blocks">'
            '<button type="button" class="%s-toc-fold-btn" id="%s-expand" title="Open every block in the contents"><i class="fas fa-angle-double-down"></i> Expand all</button>'
            '<button type="button" class="%s-toc-fold-btn" id="%s-collapse" title="Close every block in the contents"><i class="fas fa-angle-double-up"></i> Collapse all</button></div>' % (P, P, P, P, P, P))


JS_DECL = "\tvar fold = %s;\n"

JS_VIEW_OLD = "\t\tgrouped.hidden = v !== 'grouped'; flat.hidden = v !== 'flat';\n"
JS_VIEW_NEW = "\t\tgrouped.hidden = v !== 'grouped'; flat.hidden = v !== 'flat'; fold.hidden = v !== 'grouped';\n"

JS_TOP_ANCHOR = "\twindow.addEventListener('scroll', function () { topBtn.hidden = window.scrollY < 600; }, { passive: true });\n"


def js_handlers(sel, byid):
    return ("\n\t/* expand or collapse every block in the contents (floating control, bottom left) */\n"
            "\tfunction setAll(open) {\n"
            "\t\tArray.prototype.forEach.call(toc.querySelectorAll(%s), function (b) { setOpen(b, open); });\n"
            "\t\tif (!open) toc.scrollTop = 0;\n"
            "\t}\n"
            "\t%s.addEventListener('click', function () { setAll(true); });\n"
            "\t%s.addEventListener('click', function () { setAll(false); });\n"
            % (sel, byid % 'expand', byid % 'collapse'))


CSS_TOP_ANCHOR = ".ai-top[hidden] { display: none; }\n"
CSS_MAIN = """.ai-toc-fold { position: fixed; left: 1.25em; bottom: 1.25em; z-index: 1150; display: flex; border-radius: 2em; overflow: hidden; box-shadow: 0 0.3em 1em rgba(0,0,0,0.4); }
.ai-toc-fold[hidden] { display: none; }
.ai-toc-fold-btn { height: auto; line-height: 1.4; padding: 0.6em 0.9em; font-size: 0.8em; letter-spacing: 0.05em; text-transform: uppercase; background: rgba(66,103,166,0.95); border: 0 !important; border-radius: 0 !important; box-shadow: none !important; white-space: nowrap; }
.ai-toc-fold-btn + .ai-toc-fold-btn { border-left: solid 1px rgba(255,255,255,0.3) !important; }
.ai-toc-fold-btn:hover, .ai-toc-fold-btn:focus { background: #4267a6; color: #fff !important; }
.ai-toc-fold-btn::after { display: none; }
#ai-toc-grouped { padding-bottom: 3.2em; }
"""
CSS_MEDIA_ANCHOR = "\t.ai-top { bottom: 4.6em; }\n"
CSS_MEDIA = "\t.ai-toc-fold { display: none; }\n\tbody.ai-toc-drawer .ai-toc-fold { display: flex; }\n\tbody.ai-toc-drawer .ai-toc-fold[hidden] { display: none; }\n"


def rep(s, old, new, label):
    n = s.count(old)
    assert n == 1, "%s: anchor found %d times" % (label, n)
    return s.replace(old, new)


def check(s, name):
    assert "\r" not in s, name + ": CRLF"
    assert "—" not in s, name + ": em dash"


def patch_page(html_path, css_path, P):
    h = open(html_path, "rb").read().decode("utf-8")
    c = open(css_path, "rb").read().decode("utf-8")
    assert "-toc-fold" not in h and "-toc-fold" not in c, "already patched"
    top = '<button type="button" class="%s-top" id="%s-top" aria-label="Back to top" hidden>' % (P, P)
    h = rep(h, top, html_block(P) + top, "top button")
    if P == "ai":
        decl = JS_DECL % "document.getElementById('ai-toc-fold')"
        handlers = js_handlers("'.ai-toc-ch, .ai-toc-sec'", "document.getElementById('ai-%s')")
    else:
        decl = JS_DECL % "$('toc-fold')"
        handlers = js_handlers("'.' + P + '-toc-ch, .' + P + '-toc-sec'", "$('%s')")
    h = rep(h, "\tfunction setView(v) {\n", decl + "\tfunction setView(v) {\n", "setView")
    h = rep(h, JS_VIEW_OLD, JS_VIEW_NEW, "view line")
    h = rep(h, JS_TOP_ANCHOR, JS_TOP_ANCHOR + handlers, "top handlers")
    sub = lambda t: t.replace(".ai-", ".%s-" % P).replace("#ai-", "#%s-" % P).replace("body.ai-", "body.%s-" % P)
    c = rep(c, sub(CSS_TOP_ANCHOR), sub(CSS_TOP_ANCHOR + CSS_MAIN), "css top")
    c = rep(c, sub(CSS_MEDIA_ANCHOR), sub(CSS_MEDIA_ANCHOR + CSS_MEDIA), "css media")
    check(h, html_path); check(c, css_path)
    open(html_path, "wb").write(h.encode("utf-8"))
    open(css_path, "wb").write(c.encode("utf-8"))
    print("patched", html_path, len(h.encode("utf-8")), css_path, len(c.encode("utf-8")))


def patch_navmod(path):
    s = open(path, "rb").read().decode("utf-8")
    assert "-toc-fold" not in s, "already patched"
    old_top = ("    return ('<button type=\"button\" class=\"%s-top\" id=\"%s-top\" aria-label=\"Back to top\" hidden><i class=\"fas fa-arrow-up\"></i> Top</button>'\n"
               "            '<div class=\"%s-toc-backdrop\" id=\"%s-toc-backdrop\" hidden></div><button type=\"button\" class=\"%s-toc-fab\" id=\"%s-toc-open\" aria-controls=\"%s-toc\" aria-expanded=\"false\"><i class=\"fas fa-list\"></i> Contents</button>' % (P, P, P, P, P, P, P))\n")
    new_top = ("    return ('<div class=\"%s-toc-fold\" id=\"%s-toc-fold\" role=\"group\" aria-label=\"Contents blocks\">'\n"
               "            '<button type=\"button\" class=\"%s-toc-fold-btn\" id=\"%s-expand\" title=\"Open every block in the contents\"><i class=\"fas fa-angle-double-down\"></i> Expand all</button>'\n"
               "            '<button type=\"button\" class=\"%s-toc-fold-btn\" id=\"%s-collapse\" title=\"Close every block in the contents\"><i class=\"fas fa-angle-double-up\"></i> Collapse all</button></div>'\n"
               "            '<button type=\"button\" class=\"%s-top\" id=\"%s-top\" aria-label=\"Back to top\" hidden><i class=\"fas fa-arrow-up\"></i> Top</button>'\n"
               "            '<div class=\"%s-toc-backdrop\" id=\"%s-toc-backdrop\" hidden></div><button type=\"button\" class=\"%s-toc-fab\" id=\"%s-toc-open\" aria-controls=\"%s-toc\" aria-expanded=\"false\"><i class=\"fas fa-list\"></i> Contents</button>' % (P, P, P, P, P, P, P, P, P, P, P, P, P))\n")
    s = rep(s, old_top, new_top, "top_button")
    s = rep(s, "\tfunction setView(v) {\n", (JS_DECL % "$('toc-fold')") + "\tfunction setView(v) {\n", "setView")
    s = rep(s, JS_VIEW_OLD, JS_VIEW_NEW, "view line")
    s = rep(s, JS_TOP_ANCHOR, JS_TOP_ANCHOR + js_handlers("'.' + P + '-toc-ch, .' + P + '-toc-sec'", "$('%s')"), "top handlers")
    s = rep(s, CSS_TOP_ANCHOR, CSS_TOP_ANCHOR + CSS_MAIN, "css top")
    s = rep(s, CSS_MEDIA_ANCHOR, CSS_MEDIA_ANCHOR + CSS_MEDIA, "css media")
    check(s, path)
    open(path, "wb").write(s.encode("utf-8"))
    print("patched", path, len(s.encode("utf-8")))


def patch_aiabuild(path):
    s = open(path, "rb").read().decode("utf-8")
    assert "-toc-fold" not in s, "already patched"
    top = "    out.append('<button type=\"button\" class=\"ai-top\" id=\"ai-top\" aria-label=\"Back to top\" hidden><i class=\"fas fa-arrow-up\"></i> Top</button>')\n"
    s = rep(s, top, "    out.append('%s')\n" % html_block("ai") + top, "top button")
    s = rep(s, "\tfunction setView(v) {\n", (JS_DECL % "document.getElementById('ai-toc-fold')") + "\tfunction setView(v) {\n", "setView")
    s = rep(s, JS_VIEW_OLD, JS_VIEW_NEW, "view line")
    s = rep(s, JS_TOP_ANCHOR, JS_TOP_ANCHOR + js_handlers("'.ai-toc-ch, .ai-toc-sec'", "document.getElementById('ai-%s')"), "top handlers")
    s = rep(s, CSS_TOP_ANCHOR, CSS_TOP_ANCHOR + CSS_MAIN, "css top")
    s = rep(s, CSS_MEDIA_ANCHOR, CSS_MEDIA_ANCHOR + CSS_MEDIA, "css media")
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
