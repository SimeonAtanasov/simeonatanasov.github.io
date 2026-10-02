# Brief: how privacy enforcement works outside Europe, jurisdiction by jurisdiction

You are researching, for a public reference page aimed at privacy practitioners, how a privacy
complaint or violation turns into a penalty (or not) in a specific jurisdiction outside Europe,
and how the courts connect. It is the companion of a page that already covers the GDPR in the
EEA. Accuracy matters more than volume. Every non-obvious claim needs a source URL, and the best
source is primary: the statute, the regulator's own website (complaint page, enforcement page,
annual report), or a court or legislation portal. Secondary sources (law firm notes, DLA Piper
Data Protection Laws of the World, IAPP, OneTrust DataGuidance) can locate facts but mark them
`secondary` in `source_type`.

Budget: at most 6 WebSearch calls in total for your whole packet. Use WebFetch freely on URLs
you found or know (it is not budgeted): regulator sites and statute portals first. The shell has
no internet; do not use curl.

Today is 2 October 2026. Describe the law as it stands now. Many of these regimes changed
recently (for example India's DPDP Act and Rules, Vietnam's 2025 Personal Data Protection Law,
Australia's 2024 Privacy Act amendments, Indonesia's PDP Law transition, Saudi PDPL, Nigeria's
NDPA 2023, Kenya, Japan's APPI reviews, Korea's PIPA amendments, US state laws and the CPPA's
enforcement). Say what is in force, what is phased in, and when. If the regulator foreseen by a
law does not exist yet or has no fining power yet, say so plainly.

## Questions to answer for each jurisdiction

1. `dpa`: the regulator(s) that enforce privacy law, English and native names, abbreviation,
   URL, structure (independent authority, ministry department, commission), and any other bodies
   that enforce privacy in practice (consumer, telecom, sector regulators, prosecutors).
2. `law`: the main privacy statute(s) with year and link; in force dates.
3. `complaint`: how a person complains (form, fee, language), whether they must go to the
   organisation first, time limits, and the regulator's deadlines.
4. `procedure`: stages from complaint or own-initiative investigation to a decision; who decides;
   settlements, undertakings, consent orders; limitation periods.
5. `fines`: who legally imposes a monetary penalty (the regulator by administrative decision; or
   the regulator must apply to a court; or prosecutors and criminal courts); the maximum, and
   whether it is a fixed amount or turnover-based; can public bodies be penalised; criminal
   offences; other sanctions (orders, suspension of processing, naming).
6. `appeal`: which court or tribunal hears a challenge to the regulator's decision, deadline,
   whether it suspends payment, further appeals; and how a complainant challenges regulator
   inaction or a rejected complaint.
7. `private`: can individuals sue the organisation for damages or an injunction (private right of
   action), in which courts, statutory damages, class or collective actions.
8. `cases`: 2 or 3 notable enforcement examples with amounts, years and court outcomes, with
   sources.
9. `quirks`: anything a European practitioner would find surprising.
10. `plain`: two or three sentences in plain English describing the journey of a complaint, as
    you would explain it to a non-lawyer.

## Output

Write ONE JSON file per jurisdiction to the results folder given in your task, named
`<code>.json` using the code given in your task, in exactly the same shape as the European files:

```json
{
  "code": "us",
  "country": "United States",
  "membership": "World",
  "region": "Americas | Asia-Pacific | Middle East | Africa",
  "dpa": {"name_en": "", "name_native": "", "abbr": "", "url": "", "structure": "", "regional": ""},
  "law": {"name": "", "url": ""},
  "complaint": {"how": "", "contact_controller_first": "", "deadlines": "", "complainant_status": ""},
  "procedure": {"stages": ["", ""], "decision_maker": "", "limitation": ""},
  "fines": {"imposed_by": "", "public_bodies": "", "quirks": ""},
  "appeal": {"court": "", "deadline": "", "suspensive": "", "further": "", "inaction": ""},
  "private": {"courts": "", "damages": "", "collective": ""},
  "cases": [{"title": "", "year": "", "summary": "", "url": ""}],
  "quirks": ["", ""],
  "plain": "",
  "map": {"who_penalises": "regulator | regulator-court | court | none-yet",
          "cap": "turnover | fixed | none",
          "private_action": "yes | limited | no"},
  "confidence": "high | medium | low, with one sentence on what you could not confirm",
  "sources": [{"title": "", "url": "", "source_type": "primary | secondary"}]
}
```

`map` definitions, used for a map; pick the one that fits best and justify it in `fines.imposed_by`
or `private.courts`:
- `who_penalises`: `regulator` = the regulator imposes monetary penalties itself by decision;
  `regulator-court` = the regulator investigates but must ask a court to impose a civil penalty
  (or can only settle); `court` = penalties come mainly through criminal prosecution or courts
  with no regulator fining power; `none-yet` = the law exists but no body can yet penalise.
- `cap`: `turnover` = the maximum is linked to turnover or revenue; `fixed` = a fixed maximum
  amount (per violation counts as fixed); `none` = no statutory monetary penalty.
- `private_action`: `yes` = individuals can sue for damages for privacy-law breaches generally;
  `limited` = only in narrow cases (for example US data breach claims under the CCPA, or only
  after a regulator's finding); `no` = no private damages action under the privacy law.

Rules:
- Unknown is an acceptable answer: write "not confirmed" rather than guessing. Never invent a
  court name, an article number, an amount or a deadline.
- Cite section or article numbers where you have them.
- No em dashes anywhere (use commas, colons or hyphens). British spelling.
- Each text field one to four sentences. Company names in cases are fine; this is public
  enforcement.
- Return a short message when done: the files you wrote and your three least certain claims.
