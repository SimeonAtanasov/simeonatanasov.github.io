# To do

Future work on simeonatanasov.com that is not started. Each item says what it is, what it
needs and what has to be decided before work begins. Finished work is recorded in the
`Claude outputs/` READMEs and in the project's change log, not here. Updated 7 October 2026.

## 1. AI answers in the Ask panel (SA-02): to be decided

**What it adds.** The Ask panel keeps today's search. Under the results an "Ask AI" button
appears; nothing is sent until it is clicked. On click the page sends the question plus the
top five or six passages (about 4,000 tokens) to a Cloudflare Worker that holds the API
key, checks the caps and calls Claude with a system prompt that allows answering only from
those passages, with a link per claim, or says "the site does not cover this". The answer
streams into the panel, labelled as AI-generated. One follow-up at most; no long chats.

**What the visitor gains.** An answer in sentences; two passages combined into one answer;
questions in words the site never uses; comparisons and plain-language explanations of a
scoring rule. **What stays impossible by design**: inventing, because the model only sees
the retrieved passages; reading a visitor's saved assessment answers automatically.

**Cost.** Claude Haiku 4.5 is USD 1 per million input tokens and USD 5 per million output
tokens (platform.claude.com pricing, read 7 October 2026). One answer is about 4,500 input
and 300 output tokens, roughly 0.6 cents; USD 5 covers about 800 answers. Caching the fixed
system prompt cuts the input part further. Sonnet 5.5 is double (USD 2 and USD 10).

**Caps, in order of importance.**
1. Prepaid credits with auto-reload off, in a workspace of their own with a monthly limit.
   Worst case the button stops working; search keeps working.
2. In the Worker: a daily total (for example 30 answers) and a per-visitor limit by hashed
   IP (for example 5), both falling back to search with a short note.
3. Cloudflare Turnstile on the AI button only (bots are what drain budgets); requests
   accepted from the site's origin only; questions capped at 500 characters.
4. A cache keyed by the normalised question, so a repeat is served free.

**Legal checklist before it goes live.**
- Article 50(1) AI Act (applies since 2 August 2026; the site is the provider): the panel
  says at the first interaction that the answer comes from an AI system. Today's search
  needs no such notice.
- `privacy-notice.html`: a section for the AI part. The question goes to Cloudflare and
  Anthropic; legal basis Article 6(1)(f); Anthropic's API retention period, checked and
  stated; the transfer mechanism named.
- "Not legal advice" and "do not paste confidential information" next to the button.
- Turnstile is a third-party service: load it only on use, add it to `cookie-notice.html`
  and to the `items` arrays in `cookie-consent.js` after the next scan.
- Never read saved assessment answers automatically. An "explain my result" feature, if
  ever, is a deliberate click that shows exactly what will be sent.

**Needs from Simeon.** A Cloudflare account (free tier is enough), an Anthropic API key
with prepaid credit, and the key pasted into the Worker's settings. Claude writes the
Worker and the panel changes; the two accounts are the only steps it cannot do.

**Decisions to take first.**
1. Do it at all, and when.
2. Monthly budget, and from it the daily and per-visitor caps.
3. Model: Haiku 4.5 (cheaper, fine for summarising retrieved text) or Sonnet 5.5.
4. One follow-up question allowed, or none.
5. Turnstile yes or no (a third party in the cookie notice, against bot drain).
6. Show the AI button to every visitor, or only once search has returned results.
7. Cloudflare Worker, or another host for the key.

**Build steps, once decided.** Worker (key, caps, origin check, cache, Turnstile check,
streaming); panel changes (button, answer area, disclosure, follow-up limit); notice
updates; tests (caps hit, origin refused, no passages means "not covered", no request
before the click); change log entry SA-02; design record in `claude/site-assistant.md`
(project doc), which already holds the full design.

## 2. Assistant follow-ups (small)

- Untrack `Claude outputs/assistant-build/work/` and add it to `.gitignore`: committed by
  accident on 7 October 2026 (868bde8), harmless, but `chunks.json` adds a 2.5 MB diff on
  every rebuild.
- Rule, not a task: rebuild the index after any content change
  (`python3 "Claude outputs/assistant-build/build_index.py" --repo .`). A freshness check
  could join the rerun order in `claude/verification-method.md`.
- A query rule for "how is X calculated / scored / worked out" that prefers the
  `*-scoring` chunks over a tool's overview.
- Ids on the blocks inside the enforcement country cards, so a result can link to the
  block rather than the card.
- Replace the 50 test questions in `eval_retrieval.py` with real ones as they come up.
- Written questions for new content: a new digest entry or section gets only template
  suggestions until two or three questions are written for its chunk id in
  `questions_written.json`; the build prints how many chunks are in that state.
- Monthly, five minutes: add the questions people actually asked you (email, calls, the
  contact form) to `Claude outputs/assistant-build/questions_asked.json`, in their words,
  with the id of the passage that answers each (ids in `work/chunks.json`), then rebuild
  the index. Those rank above every generated question; the file is empty at launch.

## 3. Roadmap from 2 October 2026, not started

- AI Readiness Assessment: a copy of the readiness engine in its own folder; GDPR
  Readiness stays frozen and untouched.
- GDPR to ISO/IEC 27701 to NIST Privacy Framework crosswalk page, on the pattern of the AI
  governance crosswalk.

## 4. Deferred tool changes

- TC-04: WP248 and CNIL criteria in the Full DPIA screening, to be done together with the
  alignment to the EDPB harmonised DPIA template once the final version lands.
- Incident & Breach Severity (ENISA), one change: the malicious intent +0.5 factor; the
  AEPD "volume x type x impact" cross-check needs a traceable source or removal; align the
  intake fields with the EDPB breach notification template when final.
- "Pseudonymisation" listed twice in `DPIA_CONTROLS` (a modifying change to verified tools;
  log it when done).
- Crosswalk: a harmonised standards column once standards are cited in the Official
  Journal (the monthly check reports this); re-check the NIST texts when the AI RMF
  revision is published.

## 5. Site housekeeping, decisions pending

- Home page third-party logos are not consent gated. They sit inside the Career & Education
  section, which is off limits without an explicit go-ahead. Self-hosting the five images
  is the better fix; gating in place is five attribute swaps.
- `CNAME` says www; check that every canonical tag, `og:url`, `sitemap.xml` and
  `robots.txt` now agree (they read www on 3 October 2026).
- From the September link audit: meta descriptions over 160 characters on 15 pages; Open
  Graph tags only on the home page; the resume button pointing at the GitHub raw URL;
  `Privacy Assessment.txt`, `draft-about.txt` and unused risk matrix images served publicly.
- British spelling in the digests, American in the advice pages: qualify the rule or
  convert the advice pages (which means regenerating `pages.json` and the study pack).
- `onetrust-cookie-banner/`, `draft.html`, `elements.html`, `test-page.html`: delete or keep.
- Four unreferenced source PNGs in `images/`, about 7 MB: keep as sources or remove.
- Service worker: the digests are not precached; revisit if offline use matters.
- `images/pic04.jpg` is a banner in a tall slot; it wants a tile made for the slot.
- Search Console is not set up, so index coverage and backlinks are unknown.

## 6. Re-verification when sources land

- Full DPIA against the final EDPB harmonised DPIA template, step by step.
- AI Act Digest: 5 of 57 corpus entries marked "not fetched"; re-read the high-risk
  classification guidelines and the serious incident guidance when final.
- Cookie Digest: 16 entries on secondary sources; SB 690 (California); Digital Omnibus
  status.
- Cookie notice and the banner's `items` arrays after each site rescan, plus the "last
  verified" date on the notice.
- `privacy-notice.html`: confirm the transfer mechanism per provider (Formspree, Render,
  GitHub) and the scanner's actual logging in `scan-banner-api`.
