#!/usr/bin/env python3
"""
SA-02: adds the "Ask AI" button to the Ask panel.

  python3 apply_sa02.py --repo <repo root> --endpoint https://<worker>/ask --sitekey <Turnstile site key>

Patches three files in place and nothing else:
  assets/js/assistant.js    settings, the AI block (panel_ai.js), four small hooks
  assets/css/assistant.css  the styles of the AI block appended (panel_ai.css)
  sw.js                     VERSION v12 -> v13, so no visitor runs the old pair

It stops without writing anything when a file is not exactly the version this
patch was written against (md5 below), when the patch is already there, or
when an anchor is not found exactly once. Binary read and write: line endings
are left as they are.

--test allows an http://localhost endpoint and a stand-in for the Turnstile
script (--turnstile-src); it is for the tests and never for the site.
--dry-run prints what would be written.
"""
import argparse, hashlib, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))

BEFORE = {
    'assets/js/assistant.js': (48420, '8d68385d1f737ab9ec696a0f8c65e290'),
    'assets/css/assistant.css': (15028, 'c5ed593732b11b28baef15184ff329f5'),
    'sw.js': (5094, 'db087ccd4e2ef9742d219052bec43995'),
}

TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
EM_DASH = b'\xe2\x80\x94'   # the character itself is not allowed in this repo, so it is spelled as bytes


def md5(b):
    return hashlib.md5(b).hexdigest()


def stop(msg):
    print('STOP: ' + msg)
    sys.exit(1)


def once(data, old, new, what):
    n = data.count(old)
    if n != 1:
        stop('%s: anchor found %d times, expected 1' % (what, n))
    return data.replace(old, new)


def js_string(s):
    if "'" in s or '\\' in s or '\n' in s or '<' in s:
        stop('unsafe character in a setting: %r' % s)
    return "'" + s + "'"


def patch_js(src, block, endpoint, sitekey, ts_src):
    b = src
    settings = (
        "\n"
        "\t/* SA-02: AI answers. With either of the first two empty the feature is\n"
        "\t   off and nothing of it is drawn. AI_ENDPOINT is the /ask address of the\n"
        "\t   site's own Cloudflare Worker, AI_SITEKEY the public site key of its\n"
        "\t   Turnstile widget (the secret key lives in the Worker, never here). */\n"
        "\tvar AI_ENDPOINT = %s;\n"
        "\tvar AI_SITEKEY = %s;\n"
        "\tvar AI_TURNSTILE_SRC = %s;\n"
        "\tvar AI_PASSAGES = 5;\n"
    ) % (js_string(endpoint), js_string(sitekey), js_string(ts_src))
    anchor = b"\tvar LIVE_DELAY = 250;   // ms after the last keystroke before the results refresh\n"
    b = once(b, anchor, anchor + settings.encode('utf-8'), 'settings')

    old = b"intro = el('p', { class: 'sa-intro', text: 'Searches the digests, the assessment tools, the guides and the enforcement pages. Runs in your browser: nothing you type leaves it.' });"
    new = (b"intro = el('p', { class: 'sa-intro', text: AI_ON\n"
           b"\t\t\t? 'Searches the digests, the assessment tools, the guides and the enforcement pages. The search runs in your browser: nothing you type leaves it unless you press the Ask AI button.'\n"
           b"\t\t\t: 'Searches the digests, the assessment tools, the guides and the enforcement pages. Runs in your browser: nothing you type leaves it.' });")
    b = once(b, old, new, 'intro line')

    old = b"\t\tpanel.appendChild(status);\n"
    new = old + b"\t\tif (AI_ON) { tsBox = el('div', { class: 'sa-ts' }); panel.appendChild(tsBox); }\n"
    b = once(b, old, new, 'Turnstile holder')

    old = b"\t\tlastFilter = filter || '';\n\t\thidePreview();\n\t\tresults.innerHTML = '';\n\t\tfilterRow.hidden = true;\n"
    new = b"\t\tlastFilter = filter || '';\n\t\taiRun++;   // SA-02: an AI answer still on its way belongs to the previous search\n\t\thidePreview();\n\t\tresults.innerHTML = '';\n\t\tfilterRow.hidden = true;\n"
    b = once(b, old, new, 'run() reset')

    old = b"\t\tshown.forEach(function (x) { results.appendChild(card(x.doc, r.terms, x.pinned)); });\n"
    new = old + (b"\t\t/* SA-02: the optional AI answer, from the passages shown first */\n"
                 b"\t\tif (AI_ON && query.length >= 3) results.insertBefore(aiBox(query, shown.slice(0, AI_PASSAGES).map(function (x) { return x.doc; })), results.firstChild);\n")
    b = once(b, old, new, 'run() AI block')

    anchor = b"\t/* ------------------------------------------------------- boot */\n"
    b = once(b, anchor, block + anchor, 'AI block')
    return b


def patch_sw(src):
    b = once(src, b"var VERSION = 'v12';", b"var VERSION = 'v13';", 'sw VERSION')
    old = b"live suggestions (assistant.js changed). The reason"
    new = (b"live suggestions (assistant.js changed), v10 to v12 the SA-04 to SA-07\n"
           b"\tfixes of the panel, v13 its optional AI answers (SA-02; assistant.js and\n"
           b"\tassistant.css changed). The reason")
    return once(b, old, new, 'sw comment')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', required=True)
    ap.add_argument('--endpoint', required=True)
    ap.add_argument('--sitekey', required=True)
    ap.add_argument('--turnstile-src', default=TURNSTILE_SRC)
    ap.add_argument('--test', action='store_true')
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()

    if a.test:
        if not re.match(r'^http://localhost:\d+/ask$', a.endpoint) and not re.match(r'^https://[a-z0-9.-]+/ask$', a.endpoint):
            stop('test endpoint must be http://localhost:<port>/ask')
    else:
        if not re.match(r'^https://[a-z0-9][a-z0-9.-]*\.[a-z]{2,}/ask$', a.endpoint):
            stop('endpoint must look like https://<host>/ask')
        if a.turnstile_src != TURNSTILE_SRC:
            stop('--turnstile-src is for tests only')
        if a.sitekey.startswith(('1x', '2x', '3x')):
            stop('that is one of Cloudflare\'s dummy test site keys')
    if not re.match(r'^[0-9A-Za-z_-]{8,80}$', a.sitekey):
        stop('site key has unexpected characters')

    files = {}
    for rel, (size, digest) in BEFORE.items():
        p = os.path.join(a.repo, *rel.split('/'))
        with open(p, 'rb') as f:
            data = f.read()
        if b'SA-02' in data and rel != 'sw.js' or b"VERSION = 'v13'" in data:
            stop(rel + ' already carries this patch')
        if len(data) != size or md5(data) != digest:
            stop('%s is not the version this patch was written for (%d bytes, md5 %s; expected %d, %s)' % (rel, len(data), md5(data), size, digest))
        files[rel] = data

    with open(os.path.join(HERE, 'panel_ai.js'), 'rb') as f:
        block = f.read()
    with open(os.path.join(HERE, 'panel_ai.css'), 'rb') as f:
        css = f.read()
    for name, data in (('panel_ai.js', block), ('panel_ai.css', css)):
        if b'\r' in data or EM_DASH in data:
            stop(name + ' has a CR or an em dash')

    out = {}
    js = files['assets/js/assistant.js']
    crlf = b'\r\n' in js
    if crlf:
        stop('assistant.js has CRLF line endings; this patch expects LF')
    out['assets/js/assistant.js'] = patch_js(js, block, a.endpoint, a.sitekey, a.turnstile_src)
    out['assets/css/assistant.css'] = files['assets/css/assistant.css'] + css
    out['sw.js'] = patch_sw(files['sw.js'])

    for rel, data in out.items():
        if EM_DASH in data and EM_DASH not in files[rel]:
            stop(rel + ': the patch would add an em dash')
        print('%-26s %6d -> %6d bytes  md5 %s -> %s' % (rel, len(files[rel]), len(data), md5(files[rel]), md5(data)))
        if not a.dry_run:
            with open(os.path.join(a.repo, *rel.split('/')), 'wb') as f:
                f.write(data)
    print('dry run, nothing written' if a.dry_run else 'written')


if __name__ == '__main__':
    main()
