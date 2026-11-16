# AI answers in the Ask panel (SA-02): build folder

Built and tested 16 November 2026. **Not live.** Nothing on the site has changed yet: the
panel change is applied by `apply_sa02.py` once the Worker exists, because it needs the
Worker's address and the Turnstile site key.

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
| `test_worker.mjs` | 93 checks on the Worker, run in Node with stand-ins. No network |
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

## Step 1: Cloudflare (about ten minutes, Simeon)

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

## Step 2: activation (Claude, same session)

1. Baselines of `assistant.js`, `assistant.css`, `sw.js`, `privacy-notice.html`,
   `cookie-notice.html`, `cookie-consent.js` and `build_index.py` to the outside folder,
   `tool-baselines/<date>-SA-02/`.
2. `python3 "Claude outputs/assistant-ai-build/apply_sa02.py" --repo . --endpoint https://<worker>/ask --sitekey <site key>`.
   Expected: `assistant.css` 15,028 to 19,395 bytes (md5 `e9686c42073890ccd548ee6358985907`),
   `sw.js` 5,094 to 5,223 bytes (md5 `766e1bbce9eddfabe8c8e2cfa5664ecf`), `VERSION` v13;
   `assistant.js` grows by about 11,160 bytes (its md5 depends on the two values).
3. The notices (drafts below), the FAQ line of the Ask panel index that says nothing leaves
   the browser (`FAQ` in `assistant-build/build_index.py`), then an index rebuild.
4. Rerun both test files; then one real question end to end in the built-in browser on the
   live site after the push.
5. Compare models on ten real questions (`MODEL` variable: `@cf/google/gemma-4-26b-a4b-it`,
   `@cf/qwen/qwen3.8-27b`, `@cf/openai/gpt-oss-120b` are the candidates beside the default)
   and check the Worker's CPU time in its Metrics tab: the free plan allows 10 ms per
   request, and the passage check on the 2 MB index is the heavy part (about 6 ms measured
   in Node). If it sits near the limit, replace the check by a hash list built with the index.
6. Change log entry SA-02, `site-context.md`, root `README.md`, `TODO.md`.
7. After the push: a site scan, then the Turnstile row of the cookie notice from what the
   scan finds.

## Tests

```
node test_worker.mjs ../../assets/assistant/index.json          # 93 checks

# panel: a patched copy on 8765, an unpatched copy on 8766, the stand on 8788
python3 apply_sa02.py --repo <copy> --endpoint http://localhost:8788/ask --sitekey test-site-key-000 \
        --turnstile-src http://localhost:8788/turnstile.js --test
python3 -m http.server 8765 --directory <copy> &
python3 -m http.server 8766 --directory <unpatched copy> &
node test_stack.mjs <copy> &
node test_panel.mjs                                              # 47 checks
```

Both ran clean on 16 November 2026 against the index of that day (2,196 entries, every
one recognised by the passage check).

## Drafts for the notices (for Simeon's review; applied at activation)

### privacy-notice.html

"The short version", third paragraph, to read:

> There are four places where data does move: the contact form, the cookie banner scanner,
> content embedded from other organisations, and the optional AI answer in the Ask panel.
> Each is set out below with its legal basis and how long anything is kept.

New block after "Using the cookie banner scanner", with the id `ai-answers`:

> ### Asking the AI in the Ask panel
>
> - **What it is** The Ask panel searches this site inside your browser, and nothing you type
>   leaves it. Under the results there is an optional button, "Ask AI to answer from these
>   results". Only if you press it does the following happen.
> - **Data** Your question, the passages of this site that the search found for it, and the
>   technical connection data any server receives: your IP address and the time of the
>   request. Before the question is sent, Cloudflare Turnstile checks that the request comes
>   from a person and not a script; for that it reads technical signals from your browser.
> - **Purpose** Writing the answer you asked for, and keeping the service from being used up
>   by automated requests.
> - **Legal basis** Article 6(1)(f), legitimate interests: providing the answer you chose to
>   ask for and protecting a free service from abuse.
> - **Who else sees it** Cloudflare, which runs the robot check, the small service of mine
>   that receives the question, and the AI model that writes the answer. The model is an
>   open model run on Cloudflare's own systems. Cloudflare states that it does not use
>   this content to train AI models. I do not see your question: it is not written to any
>   log and not stored.
> - **How long** The question is used to write the answer and is not kept. The answer is
>   kept for up to 30 days under a code that cannot be turned back into the question, so
>   that the same question is not computed twice. To limit use to a few answers per visitor
>   per day, a counter is kept under a keyed code derived from your IP address; it is deleted
>   within two days and I cannot turn it back into the address.
> - **Worth knowing** The answer is written by an AI system. It is built only from passages
>   of this site, which are listed under it, and it can still be wrong or incomplete. It is
>   not legal advice. Do not put personal or confidential information in a question.

"Last updated" to the activation date.

Points to confirm before this goes live: Cloudflare's current certification under the EU-US
Data Privacy Framework (the "Transfers outside the EEA" section already covers both routes);
the role Cloudflare takes for Turnstile data in its Turnstile privacy addendum; the Workers
AI data usage page, read on 16 November 2026 (no retention of inputs or outputs once no
longer needed, no training on customer content).

### cookie-notice.html

New entry under "Every other page" or as its own heading, wording to be completed from the
scan after activation:

> **The robot check of the Ask panel (Cloudflare Turnstile).** Loaded from
> challenges.cloudflare.com only when you press "Ask AI" in the Ask panel, never before. It
> exists to confirm that a request comes from a person. Strictly necessary for that feature,
> which you start yourself, so it is not behind the banner. [What it stores, if anything:
> from the scan.]

The `items` arrays in `cookie-consent.js` follow the same scan.

### AI Act

The button and the answer both say "AI": the button is labelled "Ask AI", the answer
carries the label "AI-generated answer" and `data-ai-generated="true"` in the markup, and
the note under the button says so before anything is sent (Article 50(1), information at
the first interaction). Whether the marking duty of Article 50(2) reaches a short text
answer on a site like this is worth one check against the site's own AI Act Digest and the
Commission guidelines of November 2026 before activation; the markup attribute is there
either way.
