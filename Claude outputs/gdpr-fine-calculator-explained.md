# The GDPR Fine Calculator, explained

A walkthrough for explaining the tool to someone else. The first half needs no
technical background. The second half, marked **Implementation**, is the code and
the file layout; skip it when the audience is a privacy or legal one.

Companion documents: `claude/gdpr-fine-calculator.md` in the Claude project is the
build log, organised by what was discovered when, and is where the decisions are
justified in detail. The page's own "How the number is worked out" section is the
public version of this explanation.

---

## 1. What it does, in one paragraph

Supervisory authorities do not publish a formula for setting fines. They publish
decisions. The calculator takes every published decision where the fined
organisation's turnover is known, finds the ones closest to your own size,
and reports what those organisations actually paid as a proportion of turnover,
next to the maximum the Regulation allows. It answers "what has happened to
organisations like us" and not "what will happen to us". That distinction is the
whole tool, and it is worth saying out loud early, because the natural
expectation is a prediction.

## 2. The one idea everything rests on

**Index = fine divided by annual turnover.**

A EUR 3,000 fine in Romania and a EUR 225 million fine in Ireland cannot be
compared directly. Expressed as a share of the organisation's turnover, they can.
That ratio is the only unit in the tool. Every number on the page is either an
index, or an index multiplied by the turnover you typed in.

This is not a novel idea. It is the same method used in the earlier Excel and
PowerPoint work. What the tool adds is a disciplined answer to the question that
method leaves open: **which other organisations do you compare yourself to**.
That choice, and nothing else, is what made the earlier analysis produce
EUR 7.65m, EUR 19.48m and EUR 59.75m for the same company.

## 3. One calculation, start to finish

Take an organisation with **EUR 20 billion turnover** that has had a **security
failure**, and follow what the page does.

**Step one: find comparable organisations.** Look for published fines against
organisations with turnover between EUR 10bn and EUR 30bn (within 50% of yours)
where the violation was a security failure. That yields **9 decisions against
5 organisations**. Not enough: the tool requires at least eight organisations
before it will report a number.

**Step two: relax, in a fixed order.** Drop the violation type, keep the size
band. Now **52 decisions against 25 organisations**. Enough, so it stops here and
says on screen exactly what it ended up comparing you against.

Why drop the violation type rather than widen the size band? Because the data
says size matters and violation type does not, which is covered in section 4.

**Step three: one vote per organisation.** Those 52 decisions are not 52
independent data points. Some organisations appear repeatedly. Each organisation
is collapsed to a single number, the median of its own cases, before anything
else happens. That leaves 25 values:

| Organisation | Median index | Cases |
|---|---|---|
| Uber Technologies | 2.783% | 1 |
| TikTok Technology | 2.478% | 1 |
| LinkedIn | 2.036% | 1 |
| Uber Technologies / Uber B.V. | 0.506% | 2 |
| H&M Hennes & Mauritz | 0.292% | 1 |
| TIM | 0.155% | 1 |
| ... | ... | ... |
| BBVA | 0.00024% | 2 |
| STU ERGO Hestia | 0.00017% | 1 |
| Iberia | 0.00014% | 1 |

Note the spread: **the top of this list is roughly twenty thousand times the
bottom, for organisations of comparable size.** That is the real finding, and it
is why the output is a range.

**Step four: percentiles, not an average.**

| | Index | At EUR 20bn |
|---|---|---|
| 25th percentile | 0.00289% | EUR 577,933 |
| Median | 0.01000% | EUR 1,999,600 |
| 90th percentile | 1.4241% | EUR 284,825,930 |

**Step five: the statutory ceiling.** For this violation type the relevant tier
is 2%, so the maximum is the higher of 2% of EUR 20bn and EUR 10 million, which
is **EUR 400 million**.

The page shows three numbers: EUR 2.0m typical, EUR 578k to EUR 285m realistic
range, EUR 400m legal maximum. Plus the count of organisations behind it, the
full list of cases used, and a chart of where you sit.

### Why this matters: the same peers, averaged

Run the identical peer set through an average instead of a median:

| Method | Result at EUR 20bn |
|---|---|
| Median across organisations | **EUR 2.0m** |
| Mean across organisations | EUR 68.4m |
| Mean across all 52 raw decisions | EUR 41.7m |

**A factor of 34 between the median and the mean, on identical data.** The
distribution is so skewed that the mean is really just reporting Uber, TikTok and
LinkedIn. This single comparison explains the earlier EUR 7.65m to EUR 59.75m
range better than anything else: that was not three answers, it was one answer
seen through three different peer sets, all averaged.

## 4. The five decisions, and why the data forced each

Useful when someone asks "why did you do it that way". None of these were
preferences; each was measured.

**1. Median, not average.** Shown above. The index distribution is heavily
right skewed because a small organisation with a modest fine produces an enormous
ratio. Across the whole dataset the 25th percentile is 0.0008% of turnover and
the 90th is 0.73%, a spread of three orders of magnitude.

**2. Compare by size before anything else.** Fines scale far less than
proportionally with size. Fitting the whole dataset gives an elasticity of
**0.344**, meaning an organisation ten times larger draws a fine only about twice
as large, not ten times. So a small organisation's index is simply not comparable
with a large one's, and averaging across sizes is meaningless.

**3. Size beats violation type, by a lot.** Inside the EUR 1bn to 100bn band, the
five well evidenced violation types have median indices between 0.000020 and
0.000023. That is no difference at all. Inside a single violation type, moving
from the EUR 1m-100m band to the EUR 10bn+ band moves the median by several
hundred times. So when the tool has to relax something, it drops sector first,
then violation type, and widens the size band last. The first version of the code
had this backwards and was comparing a EUR 20bn organisation against a EUR 2bn to
EUR 200bn peer set.

**4. One vote per organisation.** One Spanish operator appears 70 times in the
data under a single normalised name. Without collapsing per organisation, that
one operator would decide the answer for its entire size band.

**5. Turnover barely predicts the fine, and the tool says so.** The fit is
`log10(fine) = 1.858 + 0.344 x log10(turnover)`, **R squared = 0.10**. Turnover
explains about a tenth of the variation. The residual spread is 1.13 orders of
magnitude, roughly a thirteenfold band. Everything a regulator actually weighs
under Art. 83(2), how many people were affected, negligence versus intent,
mitigation, cooperation, prior history, is absent from any structured source.
That is stated plainly on the page rather than buried.

Point five is worth being candid about: the fit got **weaker** as the data got
better. An earlier version showed R squared 0.19, which was an artefact of a
small sample dominated by big tech.

## 5. Two legal points people get wrong

**The cap is not a percentage.** Art. 83(4) is 2% of worldwide annual turnover
**or EUR 10 million, whichever is higher**. Art. 83(5) is 4% **or EUR 20 million**.
An organisation needs roughly **EUR 500 million of turnover before 4% of it
exceeds the EUR 20 million floor**. Below that, the ceiling is a flat EUR 20
million and turnover does not enter into it. For 15% of the tier one cases in this
data the binding ceiling is the flat amount. This is also why an index above 4% is
not automatically an error: a Romanian micro-company paid 6% of its turnover
entirely lawfully.

**Cookie fines are not GDPR fines.** Five of the largest decisions in the data,
including the CNIL's EUR 200 million and EUR 125 million against Google and
EUR 60 million against Facebook, cite Art. 82 of the French loi Informatique et
Libertes, not any GDPR Article. They are national ePrivacy enforcement. They are
quoted as GDPR records everywhere, including in the earlier deck. They are kept in
the comparison because they are real privacy enforcement at a known turnover, they
are tagged in the peer table, and a toggle removes them. The toggle is not
cosmetic: at EUR 40bn turnover, excluding them moves the median estimate from
EUR 2.0m to EUR 196,792, because those three cases dominate that size band.

## 6. Where the data comes from, and what is weak about it

**3,088 cases. 357 of them carry both a fine and a turnover, across 170
organisations.**

Fines, dates, countries, sectors, Articles and the violation classification come
from the public GDPR enforcement tracker, by way of the Power BI export.
**Turnover is not in that source.** It had to be attached separately from annual
reports, statutory filings and national company registers.

That is the weak point, and it should be volunteered rather than defended:

- **100 rows** were researched with a recorded financial year, a basis, and a
  source URL.
- **257 rows** were carried over from the earlier spreadsheets with no source
  recorded. They are labelled "unsourced" in the peer table and a toggle
  restricts the calculation to sourced rows only.

Three further honest limits:

- **Only about one case in nine has a turnover.** Most fined organisations are
  public bodies, micro-entities, or private companies whose accounts are not
  published for free. That is not laziness; it is what is obtainable.
- **Four violation types cannot be benchmarked at all** (information obligations,
  breach notification, DPO involvement, processing agreements). They are enforced
  overwhelmingly against public bodies and very small organisations with no
  published turnover. More research will not fix this. They are marked "thin" on
  the page.
- **Which turnover** is a real judgement call. The denominator is the nearest
  consolidating parent that actually trades in the EEA, not the ultimate global
  holding company. Indexing an Italian IT subsidiary on its Japanese parent rather
  than its European arm changes its index by a factor of 150.

## 7. What to say when challenged

Three questions will come up. Short answers:

**"So what fine would we get?"** The tool does not answer that and nothing can.
It tells you what organisations of your size actually paid, as a range, and what
the legal maximum is. Use the range as the scale of exposure.

**"Your range is enormous, is it any use?"** The range is the finding. Fines for
comparable conduct at comparable size vary by three orders of magnitude, and any
tool that returns a single confident figure is hiding that. A wide honest range
is more useful for a risk register than a narrow invented one, provided the
caveat travels with it.

**"Where did the turnover numbers come from?"** Every peer row shows its
confidence and, where one exists, its source. Roughly a third are sourced with a
URL and a financial year; the rest are inherited from earlier work without a
recorded source, and the tool can exclude them.

---

# Implementation

Everything below is for a technical audience.

## Files

| File | What it is |
|---|---|
| `gdpr-fine-calculator.html` | The page. Site chrome, inputs, an empty results container, and the method copy. |
| `pages/gdpr-fine-calculator/calculator-data.js` | The dataset. `FINE_ROWS` (357 arrays), `ARTICLE_NAMES`, `FINE_TYPES`, `FINE_SECTORS`. About 65 KB. |
| `pages/gdpr-fine-calculator/calculator.js` | All the logic. One IIFE, no dependencies. |
| `pages/gdpr-fine-calculator/calculator.css` | Page styling on the site's dark template. |

No framework, no build step, no network calls, no state. The same shape as
`gdpr-readiness`. Everything runs in the visitor's browser and nothing they type
leaves the page, which is worth saying since the input is a turnover figure.

## Data shape

Each row is a positional array, which keeps the file small:

```
["etid","company","country","year","fine","turnover","type","sector",
 "articles","tier","conf","fin","tyear","tbasis","tsource","ep"]
```

`conf` is 3 high, 2 medium, 1 low, 0 unsourced. `fin` marks banks and insurers,
whose revenue is total operating income rather than turnover. `ep` marks national
ePrivacy cases. `tier` is 2% or 4%, derived from the Articles cited.

## The peer selection ladder

```js
var BANDS = [
    { lo: 0.50, hi: 1.5 },   // within 50%
    { lo: 0.25, hi: 4   },   // a quarter to four times
    { lo: 0.10, hi: 10  }    // a tenth to ten times
];
var MIN_COMPANIES = 8;
```

Steps are generated **band-major**: for each band, try sector plus type, then
type alone, then neither, before moving to the next band. The first step that
yields at least eight distinct organisations wins. If nothing does, the last step
is returned with `enough: false` and the page shows a blunt warning instead of a
confident number.

This ordering is the point. Generating the steps type-major, which is the obvious
way to write it, protects the violation type at the expense of the size band, and
section 4 shows that is exactly backwards.

## The statistics

```js
function byCompany(rows) { /* group by normalised name, take each group's median */ }
```

Names are normalised by stripping accents, punctuation and legal-form suffixes
(`S.A.U.`, `GmbH`, `Ltd`, and so on). **This is imperfect and worth knowing:**
"Uber Technologies Inc." and "Uber Technologies Inc., Uber B.V." normalise to
different keys and count as two organisations in the worked example above. The
error is conservative here, since it dilutes rather than concentrates, but it is
a real limitation.

Percentiles use linear interpolation between the two nearest ranks, computed over
the per-organisation medians rather than the raw rows.

The ceiling is independent of the peer set and comes from the violation type:

```js
tier === 4 ? Math.max(0.04 * turnover, 20000000)
           : Math.max(0.02 * turnover, 10000000)
```

Both the median and the range are capped at that ceiling before display, so the
tool never shows an unlawful figure.

## The chart

Hand-written inline SVG, no charting library. Log-log scatter of fine against
turnover: every case as a recessive dot, the selected peers highlighted, your
position marked with a dashed guide and a direct label. Each dot carries a
`<title>` so hovering gives the case.

Colours were validated against the dark chart surface `#1e2a4d` rather than
chosen by eye: peers `#199e70`, your organisation `#d95926`, other cases
`#5c6684`. Worst all-pairs colour-vision-deficiency separation delta E 9.4,
normal vision 26.5, contrast above 3:1 for both series. The site's usual
`#8fd3c8` accent fails the lightness band and the chroma floor on a dark surface,
so it is deliberately not used here.

## Refreshing the data

Five steps, in order, described fully in `claude/gdpr-fine-calculator.md` in the
Claude project:

1. Export from Power BI to `data.csv` (apply the date fix first, or 174 fined
   cases stay missing).
2. `rebuild_union.py` merges it with the previous master, carrying turnover
   forward by ETid then by normalised name.
3. `reparse_master.py` re-derives Articles, the tier, and the ePrivacy flag.
4. `build_data_v4.py` writes `calculator-data.js`.
5. Re-run the checks: no row above `max(percentage, absolute floor)`, the
   log-log fit, per-band peer counts, then the Playwright harness.

Two traps recorded there: `calculator-data.js` contains more than one `\n];`, so
patching it by splitting on that string silently truncates the footer; and the
site template hides native checkboxes and forces a tall `button` height, both of
which the page CSS has to undo.

---

*This file is a copy. The master lives in the Claude project "Simeon" as
`claude/gdpr-fine-calculator-explained.md`, which is what future Claude sessions
read. If you edit one, the other drifts.*
