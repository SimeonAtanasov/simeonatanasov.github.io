# Brief: how GDPR enforcement works, country by country

You are researching, for a public reference page aimed at privacy practitioners, how a GDPR
complaint becomes a fine (or not) in specific European countries, and how the courts connect.
Accuracy matters more than volume. Every non-obvious claim needs a source URL, and the best
source is primary: the national implementing law, the DPA's own website (complaint page,
procedure page, annual report), or a court/legislation portal. Secondary sources (law firm
notes, DLA Piper / CMS guides, IAPP, GDPRhub at gdprhub.eu, enforcementtracker.com) are
acceptable to locate facts, but say so in `source_type`.

Tooling budget: at most 15 WebSearch calls in total for your whole packet. Use WebFetch
freely on URLs you found (it is not budgeted). GDPRhub (gdprhub.eu) has a page per DPA and per
country with procedure info, a good first stop: e.g. https://gdprhub.eu/index.php?title=AEPD_(Spain).
The shell has no internet; do not use curl.

Today is 2 October 2026. Prefer the current state of the law. If something changed recently
(e.g. a new implementing act, new DPA structure, new appeal court), say so with the date.

## Questions to answer for each country

1. `dpa`: name in English and native language, abbreviation, website URL. Is it a single
   authority, or are there regional ones (Germany Länder, Spain's Catalan/Basque/Andalusian
   authorities, etc.)? Is it a collegial body or a single commissioner?
2. `law`: the national GDPR implementing act (name, number/year, link).
3. `complaint`: how a person files (online form, post, language, any fee), whether they are
   expected to contact the controller first, any time limit for complaining, whether the
   complainant is a party to the proceedings, statutory deadlines the DPA has to decide.
4. `procedure`: stages from complaint to decision (admissibility, mediation/amicable
   settlement, investigation, draft decision/hearing, final decision). Who inside the DPA
   decides on sanctions (e.g. a restricted committee, litigation chamber, college, the
   commissioner). Limitation periods for infringements.
5. `fines`: who legally imposes the fine (the DPA itself by administrative decision, or a
   court as in Denmark/Estonia; any court confirmation step like Ireland). Can public bodies be
   fined, and with what cap? Any national quirks (fines on individuals, reductions for prompt
   payment like Spain, criminal offences in the national law).
6. `appeal`: which court hears an appeal against a DPA decision (first instance), deadline to
   appeal, whether the appeal suspends payment, further appeal levels. Also: how a complainant
   challenges DPA inaction (Art. 78(2)).
7. `private`: where an individual sues a controller directly (Art. 79) and for compensation
   (Art. 82): which courts, any notable national case law on damages amounts, collective or
   representative actions available (Art. 80, Representative Actions Directive transposition).
8. `cases`: 2 or 3 notable enforcement examples, ideally including one that was appealed, with
   the outcome in court (amounts, years, source).
9. `quirks`: anything distinctive a practitioner should know (e.g. Belgium's Litigation
   Chamber, Austria's no fines on public bodies, Hungary's procedure, Norway/Iceland/
   Liechtenstein via EEA, etc.).
10. `plain`: two or three sentences in plain English describing the journey of a complaint in
    this country, as you would explain it to a non-lawyer.

## Output

Write ONE JSON file per country to the results folder given in your task, named
`<ISO2 lowercase>.json` (Greece = `gr`, UK = `uk`), using this exact shape:

```json
{
  "code": "es",
  "country": "Spain",
  "membership": "EU",
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
  "confidence": "high | medium | low, with one sentence on what you could not confirm",
  "sources": [{"title": "", "url": "", "source_type": "primary | secondary"}]
}
```

Rules:
- Unknown is an acceptable answer: write "not confirmed" rather than guessing. Never invent a
  court name, an article number or a deadline.
- Cite article numbers of the national law where you have them (e.g. "Art. 77 LOPDGDD").
- No em dashes anywhere in the text (use commas, colons or hyphens). British spelling.
- Keep each text field tight: one to four sentences.
- Return a short message when done: which files you wrote, and your three least certain claims.
