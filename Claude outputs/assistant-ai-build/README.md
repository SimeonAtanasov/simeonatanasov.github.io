# AI answers in the Ask panel (SA-02): build folder

Built and tested 16 November 2026. Cloudflare set up and tested on 22 November 2026, the
site files changed the same night (Step 2 below), and live since the morning of 22 November
2026, when Simeon deployed the new `worker.js` and pushed.

## What it is

An optional "Ask AI to answer from these results" button above the search results of the
Ask panel. Until it is pressed nothing changes: the search runs in the browser and nothing
leaves it. On a press, the question and the top five passages go to a Cloudflare Worker,
which asks an open model on Cloudflare Workers AI to answer from those passages only. One
follow-up question is allowed. It runs on the free allowance of the Cloudflare account
(10,000 Neurons a day on Workers Free), so it cannot cost money on that plan.

## Decisions (Simeon, 12 and 16 November 2026)

| Question | Decision |
|---|---|
| Build it | Yes |
| Cost | Free tier only. No paid API, no card charge possible on Workers Free |
| Model | An open model on Workers AI. Default `@cf/meta/llama-3.3-70b-instruct-fp8-fast`; compare two or three after deployment by changing the `MODEL` variable |
| Follow-up | One |
| Robot check | Cloudflare Turnstile, loaded only on the press |
| Button | Shown to every visitor, whenever a search has results |
| Host | Cloudflare Worker in the existing account |
| Protections | All of the list below, built in |

## Files

| File | What it is |
|---|---|
| `worker.js` | The Worker. One file, no dependencies, pasted into Cloudflare as it is |
| `panel_ai.js`, `panel_ai.css` | The code and the styles added to the Ask panel |
| `apply_sa02.py` | Applies the panel change to `assistant.js`, `assistant.css` and `sw.js`, with guards |
| `apply_sa02_notices.py` | The notices and the index text, with guards: the privacy notice block, the robot check in the cookie notice and in `cookie-consent.js`, the two FAQ entries of `build_index.py` |
| `test_worker.mjs` | 97 checks on the Worker, run in Node with stand-ins. No network |
| `test_stack.mjs`, `test_panel.mjs` | 47 Playwright checks on the patched panel against the real Worker code |

## Protections, and where each one lives

| Risk | Protection | Where |
|---|---|---|
| A bill | Workers Free: above the daily allowance Workers AI fails, it does not charge. **Never move this account to Workers Paid without first setting a spend limit for Workers** | Cloudflare plan |
| Bots using up the allowance | Turnstile token required for every request, checked server side with hostname and action; 5 answers per visitor per day (one IPv4 address or one IPv6 /64); 30 a day in total; once Cloudflare reports the allowance used up, no further model calls that day | `worker.js` |
| Other sites using the Worker | Only requests whose Origin is the site are answered; no CORS header for anyone else | `worker.js` |
| The Worker used as a free general chatbot | Every passage must occur word for word, title and text, in the site's published index; anything else is dropped, and with no genuine passage the model is not called | `worker.js`, `genuine()` |
| Prompt injection | Fixed system prompt; the question is flattened to one line; the model sees only genuine site passages; a follow-up must carry the first answer as signed by the Worker | `worker.js` |
| Harmful output on the page | The Worker strips markup, links and code and keeps only citation numbers that exist; the page writes the answer as text nodes and builds links from its own results, never from the model | both |
| A confident wrong answer | Answers only from passages; an answer that cites no passage is not shown; label "AI-generated answer", a warning under it, the passages listed | both |
| Long chats | One follow-up; the second answer carries no signature, so a third turn cannot be built | `worker.js` |
| Oversized requests | Body read up to a byte limit; question 500 characters; 6 passages; output 450 tokens; 25 second timeout | `worker.js` |
| Privacy | No question in any log or key; the IP address only as a keyed hash in a counter that expires within two days; answers stored 30 days under a hash; Turnstile loaded only on the press | `worker.js`, `panel_ai.js` |
| Misconfiguration | Without both secrets and both bindings the Worker answers "off" and calls nothing; `ENABLED=0` is the off switch | `worker.js` |

Known limits, stated plainly: KV counters are eventually consistent, so a burst inside one
minute can overshoot the two caps by a few answers (an in-memory count narrows that); the
hard stop is Cloudflare's own daily allowance. The allowance is shared by everything on the
account that uses Workers AI.

## Step 1: Cloudflare (Simeon, done 22 November 2026)

What was set, and the traps met on the way, are in `claude/sa-02-ai-answers.md` (project doc).

Menu names are as of late 2026 and may differ slightly.

1. **KV namespace.** Storage & Databases, KV, Create. Name: `site-assistant-ai`.
2. **Turnstile widget.** Turnstile, Add widget. Name: `site-assistant-ai`. Hostname:
   `simeonatanasov.com`. Mode: Managed. Pre-clearance: off. Copy the **site key** (public)
   and the **secret key**.
3. **Worker.** Workers & Pages, Create, start from "Hello World", name `site-assistant-ai`,
   Deploy. Then Edit code, replace everything with the content of `worker.js`, Deploy.
4. **Bindings** (the Worker, Bindings, Add): a KV namespace binding named `KV` pointing at
   the namespace of step 1; a Workers AI binding named `AI`.
5. **Secrets** (the Worker, Settings, Variables and Secrets, Add, type Secret):
   `TURNSTILE_SECRET` = the secret key of step 2; `SIGNING_SECRET` = any long random string
   (40 characters or more; it is never needed again, do not save it anywhere).
6. Open the Worker's address in a browser (`https://site-assistant-ai.<your-subdomain>.workers.dev/`).
   It must show `{"ok":true,"service":"site-assistant-ai"}`.
7. Give Claude two things: the Worker's address and the Turnstile **site key**. Never the
   secret key.

## Step 2: activation (done 22 November 2026)

1. Baselines of every file changed in the outside folder, `tool-baselines/2026-11-22-SA-02/`,
   with `patch_build.py` (the build changes of point 2) and `patch_docs.py` (TODO and READMEs).
2. Build changes first: `worker.js` gained prompt rule 3 (keep every number, limit and
   condition as the passage states it; "lifetime of thirteen months" had lost its "at most" in
   the live test) and puts the prompt into the stored-answer key, so a changed prompt never
   serves an old answer; `panel_ai.js` sets Turnstile's `retry`, `refresh-expired` and
   `refresh-timeout` to `never`, so the check runs only on a press; `test_worker.mjs` has four
   checks for this.
3. `python3 "Claude outputs/assistant-ai-build/apply_sa02.py" --repo . --endpoint https://site-assistant-ai.sim-atanasov.workers.dev/ask --sitekey 0x4AAAAAAGMdJuOMqnbTYc_u`
4. `python3 "Claude outputs/assistant-ai-build/apply_sa02_notices.py" --repo .`
5. `assistant-build/questions_written.json`: seven questions for each of the two new privacy
   notice chunks and one more for `faq-assistant`; then the index rebuild (2,198 chunks, 8,800
   questions, every chunk with written questions).
6. Tests: `test_worker.mjs` 97 of 97 in the sandbox and in the device shell on the rebuilt
   index; `test_panel.mjs` 47 of 47 on a patched copy with the rebuilt index and the new notices.

| File | Before (bytes, md5) | After (bytes, md5) |
|---|---|---|
| `assets/js/assistant.js` | 48,420, 8d68385d1f737ab9ec696a0f8c65e290 | 59,969, f5d87f5cd0e7c7b61c967dd7e6051cda |
| `assets/css/assistant.css` | 15,028, c5ed593732b11b28baef15184ff329f5 | 19,395, e9686c42073890ccd548ee6358985907 |
| `sw.js` | 5,094, db087ccd4e2ef9742d219052bec43995 | 5,276, 15677339c5013a1a892afe14589442af (`v13`) |
| `privacy-notice.html` | 19,738, dfb2fcc066c8a57c57bde7f079d3d34d | 23,238, 74710e14d3969ea22c98b2308b9ad525 |
| `cookie-notice.html` | 17,883, 3f48f3a018fcf7c8a384e42dfcde0ab9 | 19,202, d13e616111181513fb8447c7b6613341 |
| `assets/js/cookie-consent.js` | 26,281, 519dcacdfeaca64ac1afff1437f973fd | 26,759, 3ed4309963d75d60428dfc495d0d9859 |
| `assistant-build/build_index.py` | 91,701, faae94c63a5f01d04e93de954f75e7af | 92,121, 54656d0b96f8d4b441b099525b977048 |
| `assistant-build/questions_written.json` | 574,814, fa506792353c233941b5f17aacf93b07 | 575,723, 1e2892e215ea414ddb5e8e62f1903698 |
| `assets/assistant/index.json` | 2,115,395, b646b7d27f747289949faf7f41446582 | 2,120,192, 303eb1986d07cad9ce261766a6b368e5 |
| `assets/assistant/questions.json` | 845,399, 61cfe44556b14f252ba426f6ad5285fe | 847,095, 3519649a72cb54b01117cb77835b9808 |
| `worker.js` (this folder) | 21,050, d78d94b219fbbc23b9e5a6b13f9c7447 | 21,334, 80075eddb822849dcb3178fbb5bce67d |
| `panel_ai.js` | 10,107, 9379a9884fbfb0eca3ed0121a9dc4f0c | 10,426, ede88c1753b49ff9f8389503ee400bfa |
| `apply_sa02.py` | 7,803, 1d0bba059935eadbc07e18b16b6aaeee | 7,873, bf212c4363bdfc1e7d9b1d10aef354e6 |
| `test_worker.mjs` | 21,466, be8bdabf3f1549527cd0e6db6acde095 | 22,561, c7fe2d136ce3cda661e2b1672ba8a8b0 |

Left:

- Done the same morning: `worker.js` (md5 80075eddb822849dcb3178fbb5bce67d) deployed to the
  Worker; the site pushed; one real question in the live panel in Chrome (answered with
  citations, no tick needed). DevTools, Application, Cookies, `https://challenges.cloudflare.com`
  showed only `.cloudflare.com` cookies from Simeon's own visits to Cloudflare's dashboard and
  website (`__cf_logged_in`, `CF_VERIFIED_DEVICE_*`, `OptanonAlertBoxClosed`, `OptanonConsent`),
  none partitioned: the robot check set no cookie. The cookie notice says so since SA-02b.
- Compare models on ten real questions (`MODEL` variable: `@cf/google/gemma-4-26b-a4b-it`,
  `@cf/qwen/qwen3.8-27b`, `@cf/openai/gpt-oss-120b` were the candidates beside the default).
- The Worker's CPU time was checked on 22 November 2026: 614 microseconds (Metrics tab), far
  under the 10 ms of the free plan, so the passage check stays as it is.

## Tests

```
node test_worker.mjs ../../assets/assistant/index.json          # 97 checks

# panel: a patched copy on 8765, an unpatched copy on 8766, the stand on 8788
python3 apply_sa02.py --repo <copy> --endpoint http://localhost:8788/ask --sitekey test-site-key-000 \
        --turnstile-src http://localhost:8788/turnstile.js --test
python3 -m http.server 8765 --directory <copy> &
python3 -m http.server 8766 --directory <unpatched copy> &
node test_stack.mjs <copy> &
node test_panel.mjs                                              # 47 checks
```

Both ran clean on 16 November 2026 against the index of that day (2,196 entries, every
one recognised by the passage check), and again on 22 November 2026 against the rebuilt
index (2,198 entries, every one recognised).

## The notices as shipped (22 November 2026)

- `privacy-notice.html`: dated 22 November 2026. The short version names four places where data
  moves. A block "Asking for an AI answer in the Ask panel" (`id="ai-answers"`, the target of
  the panel's link, with a scroll margin for the sticky header) after the scanner block: data,
  purpose, legal basis (Article 6(1)(f)), who else sees it (Cloudflare as processor; Workers AI
  with Llama 3.3 on Cloudflare's servers, no training, no retention; Turnstile, where Cloudflare
  is also controller for improving its bot detection), how long (the question is not stored; the
  answer up to 30 days under a code and able to repeat words of the question; the counter until
  two days after the last request of the day; both in the EU, with short-lived copies possibly
  elsewhere; Cloudflare's request log, seven days), worth knowing. The strictly necessary line
  of "Your cookie choice" now names the robot check. The draft's "I do not see your question:
  it is not written to any log" was not used: the request itself is logged.
- `cookie-notice.html`: a line in the short version; `cf.turnstile.u` (local storage of
  challenges.cloudflare.com, seen in Chrome on 22 November 2026, no expiry, content not
  documented by Cloudflare) under "Storage that is not a cookie"; Cloudflare's Turnstile privacy
  addendum among the providers' documents. The "last verified against a full site scan" date
  stays 21 September 2026; the new entry says it comes from a browser check.
- `cookie-consent.js`: the same entry in the Strictly necessary group (C0001), whose description
  names it. `sw.js` `v13` covers this file too.
- `build_index.py`: `faq-assistant` and `faq-device` no longer say that nothing typed leaves the
  browser; both name the button.

## AI Act

Article 50(1): the button reads "Ask AI to answer from these results", the note under it says
before anything is sent that the question goes to an AI model, and the answer carries the label
"AI-generated answer" and the line "Written by an AI model". Under the Commission's Article 50
guidelines an organisation that builds a chatbot and puts it into service under its own name is
its provider (`claude/notice-generators-matrix.md`, row A01), so the duty is Simeon's, and it is
met. Article 50(2): the answer element carries `data-ai-generated="true"`, a machine-readable
mark in the page; metadata is among the marking techniques the guidelines accept. Not done: a
reading in full of the guidelines' section on marking text (C(2026) 7702).
