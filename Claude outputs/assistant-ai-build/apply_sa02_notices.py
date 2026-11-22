#!/usr/bin/env python3
"""SA-02 activation, second step (22 November 2026): the notices and the index text.

Run from the repo root after apply_sa02.py, which bumps sw.js to v13 for the
assistant pair and for the cookie-consent.js change made here.

  privacy-notice.html           date, short version (four places), a block for the
                                AI answers with id="ai-answers" (the panel links to
                                it), its scroll margin, and the strictly necessary line
  cookie-notice.html            the robot check's local storage entry cf.turnstile.u,
                                a line in the short version, Cloudflare's addendum
  assets/js/cookie-consent.js   cf.turnstile.u in the Strictly necessary list (C0001)
  Claude outputs/assistant-build/build_index.py
                                the Ask panel's two FAQ entries (faq-assistant, faq-device)
                                mention the AI button; rebuild the index afterwards

Stops without writing when a file is not the version this was written for.
  python3 "Claude outputs/assistant-ai-build/apply_sa02_notices.py" --repo . [--dry-run]
"""
import argparse
import hashlib
import os
import sys

EXPECT = {
    'privacy-notice.html': (19738, 'dfb2fcc066c8a57c57bde7f079d3d34d'),
    'cookie-notice.html': (17883, '3f48f3a018fcf7c8a384e42dfcde0ab9'),
    'assets/js/cookie-consent.js': (26281, '519dcacdfeaca64ac1afff1437f973fd'),
    'Claude outputs/assistant-build/build_index.py': (91701, 'faae94c63a5f01d04e93de954f75e7af'),
}
EM_DASH = b'\xe2\x80\x94'
T = b'\t'


def md5(b):
    return hashlib.md5(b).hexdigest()


def stop(msg):
    sys.exit('stop: ' + msg)


def once(b, old, new, label):
    n = b.count(old)
    if n != 1:
        stop('%s: expected once, found %d times' % (label, n))
    return b.replace(old, new)


def lines(indent, *rows):
    return b''.join(T * indent + r + b'\n' for r in rows)


def privacy(b):
    b = once(b, b'<p class="pn-meta">Last updated 24 September 2026</p>',
             b'<p class="pn-meta">Last updated 22 November 2026</p>', 'date')
    b = once(b, lines(10,
                      b'There are three places where data does move: the contact form, the cookie',
                      b'banner scanner, and content embedded from other organisations. Each is set out',
                      b'below with its legal basis and how long anything is kept.'),
             lines(10,
                   b'There are four places where data does move: the contact form, the cookie',
                   b'banner scanner, the optional AI answers in the Ask panel, and content embedded',
                   b'from other organisations. Each is set out below with its legal basis and how',
                   b'long anything is kept.'), 'short version')
    css = lines(2, b'.pn-activity {', b'\tborder-top: 1px solid rgba(255, 255, 255, 0.18);',
                b'\tpadding: 1.25rem 0 0.5rem 0;', b'}')
    b = once(b, css, css + b'\n' + lines(2, b'.pn-activity[id] {', b'\tscroll-margin-top: 6rem;', b'}'),
             'scroll margin')
    block = lines(7, b'<div class="pn-activity" id="ai-answers">') + lines(8,
        b'<h3>Asking for an AI answer in the Ask panel</h3>',
        b'<ul class="pn-facts">') + lines(9,
        b"<li><strong>Data</strong>Nothing, until you press the button that asks an AI to answer from your search results. "
        b"Then your question, the text of the top results (passages from this site, five at most) and a one-time code from the robot check "
        b"are sent to a small service of mine, with the technical connection data any server receives: your IP address, the time of the "
        b"request and your browser's user agent string. A follow-up question also sends the first question and its answer.</li>",
        b"<li><strong>Purpose</strong>Writing a short answer from those passages that cites the passages it rests on, and keeping the "
        b"service from being used up by robots or by any one visitor, which is why requests are checked and counted.</li>",
        b"<li><strong>Legal basis</strong>Article 6(1)(f), legitimate interests: giving you the answer you asked for, and protecting the "
        b"service from abuse. The robot check also keeps an entry in your browser's storage. That happens only after you press the button "
        b"and is part of the service you asked for, so it needs no separate consent; the <a href=\"cookie-notice.html\">cookie notice</a> "
        b"lists it.</li>",
        b"<li><strong>Who else sees it</strong>The service runs on Cloudflare, as my processor. Cloudflare Workers runs it, and Workers AI "
        b"writes the answer with Meta's openly published Llama 3.3 model on Cloudflare's own servers, so nothing is sent to Meta. Cloudflare "
        b"states that it does not keep what is sent to Workers AI once it is no longer needed to return the answer, and does not use it to "
        b"train models. The robot check is Cloudflare Turnstile: Cloudflare runs it for me as processor, and also uses its signals (your IP "
        b"address and details of your browser and connection) as a controller in its own right to improve its bot detection, under its "
        b"<a href=\"https://www.cloudflare.com/turnstile-privacy-policy/\" target=\"_blank\" rel=\"noopener noreferrer\">Turnstile privacy "
        b"addendum</a>, which says they are not used to identify, profile or target anyone. Cloudflare is established in the United States; "
        b"see transfers, below.</li>",
        b"<li><strong>How long</strong>Your question is not stored. The answer is, for up to 30 days, filed under a code worked out from the "
        b"question and the passages, so that the same question is answered again without running the model; an answer can repeat words "
        b"from your question. A count of your requests for the day, filed under a keyed code made from your network address rather than the "
        b"address itself, is deleted two days after your last request that day. Both are stored in the EU, although Cloudflare can hold "
        b"short-lived copies elsewhere on its network. Separately, Cloudflare's request log for my account records each request to the "
        b"service (the time, your IP address, your browser and the address requested, not your question) and keeps it for seven days. I "
        b"look at it only to deal with abuse or a fault.</li>",
        b"<li><strong>Worth knowing</strong>The answer is written by an AI system and labelled as AI-generated. It can be wrong or "
        b"incomplete, so check it against the passages it cites, which link to the full text. It is not legal advice. Do not put personal "
        b"or confidential information in a question.</li>") + lines(8, b'</ul>') + lines(7, b'</div>')
    anchor = lines(7, b'<div class="pn-activity">') + lines(8, b'<h3>Simply visiting a page</h3>')
    b = once(b, anchor, block + anchor, 'AI block')
    b = once(b, b'so no consent is needed for these two. That is also why they are the only things in the strictly necessary category.',
             b'so no consent is needed for these two. The only other entry in the strictly necessary category is the robot check of the AI '
             b'answers, above.', 'strictly necessary line')
    return b


def cookie_notice(b):
    old = lines(6, b'link at the bottom of every page.') + lines(5, b'</p>') + lines(4, b'</section>')
    new = lines(6, b'link at the bottom of every page.') + lines(5, b'</p>', b'<p>') + lines(6,
        b'One more thing touches your device, and only if you ask for it: pressing the',
        b'button in the Ask panel that asks an AI to answer from your search results runs',
        b"Cloudflare's robot check, which keeps one entry in your browser's local storage.",
        b'It is described under storage that is not a cookie, below.') + lines(5, b'</p>') + lines(4, b'</section>')
    b = once(b, old, new, 'short version')
    old = lines(6, b'powerbi.com.') + lines(5, b'</p>')
    new = old + lines(5, b'<p>') + lines(6,
        b'<strong>Set by the robot check of the AI answers.</strong> The Ask panel can have an',
        b'AI write an answer from its search results, but only when you press its button (see',
        b'the <a href="privacy-notice.html#ai-answers">privacy notice</a>). Pressing it loads',
        b"Cloudflare's Turnstile check, which keeps one entry, <code>cf.turnstile.u</code>, in",
        b'local storage under challenges.cloudflare.com. Its value is a code whose content',
        b'Cloudflare does not document, and this site cannot read it. It has no expiry date and',
        b'goes when you clear site data. Because it is part of a service you asked for, it needs',
        b'no consent and is listed under Strictly necessary (C0001). It was added from a check in',
        b'the browser on 22 November 2026, after the last full scan.') + lines(5, b'</p>')
    b = once(b, old, new, 'storage paragraph')
    old = lines(6, b'the Wikimedia Foundation in its')
    new = lines(6, b'Cloudflare in its',
                b'<a href="https://www.cloudflare.com/turnstile-privacy-policy/" target="_blank" rel="noopener noreferrer">Turnstile privacy addendum</a>,') + old
    b = once(b, old, new, 'providers')
    return b


def consent(b):
    b = once(b, b"description: 'Needed for the site to work. At present this covers only the record of the choice you make here, "
                b"which is kept in your browser and is not a cookie and is not sent anywhere.',",
             b"description: 'Needed for the site to work, or for something you ask for. It covers the record of the choice you make "
             b"here, which is kept in your browser, is not a cookie and is not sent anywhere, and the robot check that runs only when "
             b"you ask the Ask panel for an AI answer.',", 'C0001 description')
    old = lines(4, b'}') + lines(3, b']') + lines(2, b'},', b'{') + lines(3, b"id: 'C0002',")
    new = lines(4, b'},', b'{') + lines(5,
        b"name: 'cf.turnstile.u',",
        b"kind: 'Local storage, not a cookie',",
        b"host: 'challenges.cloudflare.com',",
        b"duration: 'No expiry date; it goes when you clear site data',",
        b"purpose: 'Kept by Cloudflare\xe2\x80\x99s Turnstile robot check, which loads only when you press the AI button in the Ask "
        b"panel. Cloudflare does not document its content, and this site cannot read it.'") + old
    b = once(b, old, new, 'C0001 item')
    return b


def build_index(b):
    b = once(b, b'This assistant also runs entirely in your browser: what you type is matched against an index downloaded with the page '
                b'and is not transmitted anywhere. The only pages that contact another service',
             b"This assistant's search also runs entirely in your browser: what you type is matched against an index downloaded with "
             b'the page and is not transmitted anywhere, unless you press its optional button that asks an AI to answer from the '
             b'results, which sends your question and those results to Cloudflare. Otherwise the only pages that contact another '
             b'service', 'FAQ device')
    return once(b, b'links you to them; it does not write answers of its own. Nothing you type leaves your browser.",',
                b'links you to them. The search runs in your browser and nothing you type leaves it, unless you press the optional '
                b'button that asks an AI to answer from the top results. That sends your question and those results to an AI model '
                b'hosted by Cloudflare, after a check that you are not a robot, and the answer cites the passages it uses (see the '
                b'privacy notice).",', 'FAQ text')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', required=True)
    ap.add_argument('--dry-run', action='store_true')
    a = ap.parse_args()
    files = {}
    for rel, (size, digest) in EXPECT.items():
        p = os.path.join(a.repo, rel)
        data = open(p, 'rb').read()
        if len(data) != size or md5(data) != digest:
            stop('%s is not the version this patch was written for (%d bytes, md5 %s; expected %d, %s)'
                 % (rel, len(data), md5(data), size, digest))
        files[rel] = data
    out = {
        'privacy-notice.html': privacy(files['privacy-notice.html']),
        'cookie-notice.html': cookie_notice(files['cookie-notice.html']),
        'assets/js/cookie-consent.js': consent(files['assets/js/cookie-consent.js']),
        'Claude outputs/assistant-build/build_index.py': build_index(files['Claude outputs/assistant-build/build_index.py']),
    }
    for rel, data in out.items():
        if EM_DASH in data:
            stop('%s would contain an em dash' % rel)
        if rel.endswith('.html'):
            try:
                data.decode('ascii')
            except UnicodeDecodeError:
                stop('%s would no longer be ASCII' % rel)
        print('%-46s %6d -> %6d bytes  md5 %s -> %s' % (rel, len(files[rel]), len(data), md5(files[rel]), md5(data)))
    if a.dry_run:
        print('dry run: nothing written')
        return
    for rel, data in out.items():
        with open(os.path.join(a.repo, rel), 'wb') as f:
            f.write(data)
    print('written')


if __name__ == '__main__':
    main()
