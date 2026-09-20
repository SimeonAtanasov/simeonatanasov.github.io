"""Floating Prev / Next control that steps through the entries a filter is showing.

Usage:
  python3 prevnext_patch.py page <html> <css> <prefix>      shipped page and its stylesheet
  python3 prevnext_patch.py navmod <digest_nav.py>          the shared module (top_button, _JS, _CSS)
  python3 prevnext_patch.py aiabuild <build_aia_page.py>    the AI Act builder (inline copies)

Added 20 September 2026. A second small column beside the Expand / Collapse pair at the
bottom left, shown only while a filter or search is narrowing the page and at least one
entry matches, exactly when "Go to first result" is shown. Between the two buttons sits
the position of the entry you are on, for example 13/44. "The entry you are on" is the
last match whose top has passed the reading line at 30 percent of the viewport, which is
the rule the side contents highlights by, so Next always moves one match further down.
Below 1101px the pair moves to the left edge, where the Expand / Collapse pair is hidden,
and it steps aside while the contents drawer is open.

Every edit asserts its anchor occurs exactly once. No em dashes. LF only.
"""
import sys

# ------------------------------------------------------------------------ markup


def html_block(P):
    return ('<div class="%s-step" id="%s-step" role="group" aria-label="Move through the matching entries" hidden>'
            '<button type="button" class="%s-step-btn" id="%s-prev" title="Previous matching entry" aria-label="Previous match"><i class="fas fa-chevron-up"></i><span>Prev</span></button>'
            '<span class="%s-step-n" id="%s-step-n">-</span>'
            '<button type="button" class="%s-step-btn" id="%s-next" title="Next matching entry" aria-label="Next match"><i class="fas fa-chevron-down"></i><span>Next</span></button></div>'
            % (P, P, P, P, P, P, P, P))


# ---------------------------------------------------------------------------- js

APPLY_ANCHOR = "\t\tfirstBtn.hidden = !(active && shown);\n"
APPLY_NEW = APPLY_ANCHOR + "\t\tstepShow(!!(active && shown));\n"

FOLD_ANCHOR = "\tsyncFold();\n"


def js_handlers(entrysel, byid):
    return ("\n"
            "\t/* step through the entries the filter is showing: Prev and Next at the bottom left,\n"
            "\t   beside the contents control, with the position of the entry you are on between them.\n"
            "\t   That entry is the last match whose top has passed the reading line, the same rule the\n"
            "\t   side contents highlights by, so Next always moves one match further down the page. */\n"
            "\tvar step = %s, stepN = %s, stepMatches = [], stepTick = false;\n"
            "\tfunction stepIndex() {\n"
            "\t\tvar line = window.innerHeight * 0.3, idx = -1;\n"
            "\t\tfor (var i = 0; i < stepMatches.length; i++) { if (stepMatches[i].getBoundingClientRect().top <= line + 8) idx = i; else break; }\n"
            "\t\treturn idx;\n"
            "\t}\n"
            "\tfunction stepSync() {\n"
            "\t\tif (step.hidden) return;\n"
            "\t\tvar i = stepIndex();\n"
            "\t\tstepN.textContent = (i < 0 ? '-' : i + 1) + '/' + stepMatches.length;\n"
            "\t\tstep.title = (i < 0 ? 'Before the first of ' : 'Entry ' + (i + 1) + ' of ') + stepMatches.length + ' matching';\n"
            "\t}\n"
            "\tfunction stepShow(on) {\n"
            "\t\tstepMatches = on ? Array.prototype.filter.call(document.querySelectorAll(%s), function (el) { return !el.hidden; }) : [];\n"
            "\t\tstep.hidden = !on;\n"
            "\t\tstepSync();\n"
            "\t}\n"
            "\tfunction stepGo(d) {\n"
            "\t\tif (!stepMatches.length) return;\n"
            "\t\tvar i = Math.max(0, Math.min(stepMatches.length - 1, stepIndex() + d));\n"
            "\t\tvar el = stepMatches[i], dt = el.closest('details');\n"
            "\t\tif (dt && !dt.open) dt.open = true;\n"
            "\t\tel.scrollIntoView({ block: 'start' });\n"
            "\t\thistory.replaceState(null, '', '#' + el.id);\n"
            "\t\tsetTimeout(stepSync, 80);\n"
            "\t}\n"
            "\t%s.addEventListener('click', function () { stepGo(-1); });\n"
            "\t%s.addEventListener('click', function () { stepGo(1); });\n"
            "\twindow.addEventListener('scroll', function () {\n"
            "\t\tif (stepTick) return;\n"
            "\t\tstepTick = true;\n"
            "\t\twindow.requestAnimationFrame(function () { stepTick = false; stepSync(); });\n"
            "\t}, { passive: true });\n"
            % (byid % 'step', byid % 'step-n', entrysel, byid % 'prev', byid % 'next'))


# --------------------------------------------------------------------------- css

CSS_ANCHOR = ".ai-toc-fold-btn::after { display: none; }\n"
CSS_MAIN = """.ai-step { position: fixed; left: 3.6em; bottom: 1.25em; z-index: 1150; display: flex; flex-direction: column; border-radius: 1.1em; overflow: hidden; box-shadow: 0 0.3em 1em rgba(0,0,0,0.4); }
.ai-step[hidden] { display: none; }
.ai-step-btn { display: flex !important; flex-direction: column; align-items: center; justify-content: center; gap: 0.2em; min-width: 2.6em; width: auto; max-width: none; height: auto; line-height: 1; padding: 0.55em 0.35em 0.5em 0.35em; font-size: 1em; letter-spacing: 0; background: rgba(66,103,166,0.95); border: 0 !important; border-radius: 0 !important; box-shadow: none !important; white-space: nowrap; }
.ai-step-btn i { font-size: 0.9em; }
.ai-step-btn span { font-size: 0.5em; letter-spacing: 0.1em; text-transform: uppercase; }
.ai-step-btn:hover, .ai-step-btn:focus { background: #4267a6; color: #fff !important; }
.ai-step-btn::after { display: none; }
.ai-step-n { display: block; padding: 0.35em 0.4em; font-size: 0.55em; line-height: 1; letter-spacing: 0.05em; text-align: center; white-space: nowrap; color: #fff; background: #2a3860; border-top: solid 1px rgba(255,255,255,0.3); border-bottom: solid 1px rgba(255,255,255,0.3); }
"""

CSS_MEDIA_ANCHOR = "\tbody.ai-toc-drawer .ai-toc-fold[hidden] { display: none; }\n"
CSS_MEDIA = "\t.ai-step { left: 0.6em; }\n\tbody.ai-toc-drawer .ai-step { display: none; }\n"


# ------------------------------------------------------------------------- tools

def rep(s, old, new, label):
    n = s.count(old)
    assert n == 1, "%s: anchor found %d times" % (label, n)
    return s.replace(old, new)


def sub_for(P):
    return lambda t: t.replace(".ai-", ".%s-" % P).replace("#ai-", "#%s-" % P).replace("body.ai-", "body.%s-" % P)


def check(s, name):
    assert "\r" not in s, name + ": CRLF"
    assert chr(0x2014) not in s, name + ": em dash"


def patch_js(h, entrysel, byid):
    h = rep(h, APPLY_ANCHOR, APPLY_NEW, "apply hook")
    h = rep(h, FOLD_ANCHOR, FOLD_ANCHOR + js_handlers(entrysel, byid), "fold tail")
    return h


def patch_css(c, sub):
    c = rep(c, sub(CSS_ANCHOR), sub(CSS_ANCHOR + CSS_MAIN), "css main")
    c = rep(c, sub(CSS_MEDIA_ANCHOR), sub(CSS_MEDIA_ANCHOR + CSS_MEDIA), "css media")
    return c


def patch_page(html_path, css_path, P):
    h = open(html_path, "rb").read().decode("utf-8")
    c = open(css_path, "rb").read().decode("utf-8")
    assert 'id="%s-step"' % P not in h, html_path + ": already patched"
    fold = '<div class="%s-toc-fold" id="%s-toc-fold" role="group" aria-label="Contents blocks" hidden>' % (P, P)
    h = rep(h, fold, html_block(P) + fold, "fold html")
    if P == "ai":
        h = patch_js(h, "'.ai-entry'", "document.getElementById('ai-%s')")
    else:
        h = patch_js(h, "entrySel", "$('%s')")
    c = patch_css(c, sub_for(P))
    check(h, html_path)
    check(c, css_path)
    open(html_path, "wb").write(h.encode("utf-8"))
    open(css_path, "wb").write(c.encode("utf-8"))
    print("patched", html_path, len(h.encode("utf-8")), css_path, len(c.encode("utf-8")))


def patch_navmod(path):
    s = open(path, "rb").read().decode("utf-8")
    assert '-step"' not in s, path + ": already patched"
    fold = ("    return ('<div class=\"%s-toc-fold\" id=\"%s-toc-fold\" role=\"group\" aria-label=\"Contents blocks\" hidden>'\n")
    new = ("    return ('<div class=\"%s-step\" id=\"%s-step\" role=\"group\" aria-label=\"Move through the matching entries\" hidden>'\n"
           "            '<button type=\"button\" class=\"%s-step-btn\" id=\"%s-prev\" title=\"Previous matching entry\" aria-label=\"Previous match\"><i class=\"fas fa-chevron-up\"></i><span>Prev</span></button>'\n"
           "            '<span class=\"%s-step-n\" id=\"%s-step-n\">-</span>'\n"
           "            '<button type=\"button\" class=\"%s-step-btn\" id=\"%s-next\" title=\"Next matching entry\" aria-label=\"Next match\"><i class=\"fas fa-chevron-down\"></i><span>Next</span></button></div>'\n"
           "            '<div class=\"%s-toc-fold\" id=\"%s-toc-fold\" role=\"group\" aria-label=\"Contents blocks\" hidden>'\n")
    s = rep(s, fold, new, "top_button")
    s = rep(s, " % (P, P, P, P, P, P, P, P, P, P, P, P, P))\n", " % (P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P))\n", "top_button args")
    s = patch_js(s, "entrySel", "$('%s')")
    s = patch_css(s, lambda t: t)
    check(s, path)
    open(path, "wb").write(s.encode("utf-8"))
    print("patched", path, len(s.encode("utf-8")))


def patch_aiabuild(path):
    s = open(path, "rb").read().decode("utf-8")
    assert 'id="ai-step"' not in s, path + ": already patched"
    fold = "    out.append('<div class=\"ai-toc-fold\" id=\"ai-toc-fold\""
    s = rep(s, fold, "    out.append('%s')\n" % html_block("ai") + fold, "fold html")
    s = patch_js(s, "'.ai-entry'", "document.getElementById('ai-%s')")
    s = patch_css(s, lambda t: t)
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
