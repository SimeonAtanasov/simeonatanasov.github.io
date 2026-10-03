# AI Assessment Pathway: impact level (Phase 4, for review)

Status: for review, 3 October 2026. Code: `AIPATH_TIER_FACTORS`, `AIPATH_TIER_BANDS` and
`aipathTier()` in `Claude outputs/ai-pathway-build/aipath_part2.js`; test:
`tier_test.js` over the eight Phase 8 scenarios in `scenarios.js`.

## Method

Taken from the Government of Canada Algorithmic Impact Assessment (method only): a raw
score from weighted answers, as a share of the maximum, banded I up to 25 percent, II up
to 50, III up to 75, IV above. Factors and weights are the pathway's own. Every factor is
an intake answer, so the tier costs no extra question.

Two departures from the AIA, both stated on the page:
1. **No mitigation deduction.** The level is set before mitigations are asked; they show
   in the residual rating of the Impact step.
2. **Two floors.** A use in an Annex III area, or a system that makes significant
   decisions on its own, is never below level III, whatever the score.

An unanswered factor scores 0 and the result says the level is provisional, naming the
missing factors.

## Factors and weights (maximum 29)

| Factor | Question | Points |
|---|---|---|
| Effect of the output on people | `aipDecisionEffect` | none 0; supports, minor effects 1; supports, legal or similarly significant effects 3; makes such decisions on its own 4; not sure 3 |
| Reversibility of a wrong output | `aipReversibility` | easily 0; with effort 2; not, or with great difficulty 4; not applicable 0; not sure 2 |
| Number of people affected each year | `affectedScale` | under 100: 0; to 10,000: 1; to 1 million: 2; over 1 million: 3 |
| People in a vulnerable situation | `friaVulnerable` | none 0; any 2; children 3 |
| Actions taken without human approval | `autonomyLevel` | none 0; low-impact only 1; broad 3 |
| When a human acts on a case | `oversightMode` | before every decision 0; flagged or contested 1; sampling after the fact 2; no review 3 |
| Use area | `annexIIIArea` | not Annex III 0; not sure 2; Annex III 3; biometrics, law enforcement, migration, justice 4 |
| Who uses it | `gaiUsers` | staff 0; business partners 1; the public 2 |
| Sensitivity of the data | `gaiPromptData` | none 0; confidential or credentials 1; personal 2; special category 3 |

The factors cover the five areas of impact the Canadian Directive names (rights;
equality, dignity, privacy and autonomy; health or well-being; economic interests;
ecosystem) through effect, reversibility, vulnerability, sector and scale, and add the
three the plan asked for: autonomy, public exposure and data sensitivity.

Cut points in raw points: **I 0 to 7, II 8 to 14, III 15 to 21, IV 22 to 29.**

## The eight scenarios

| Scenario | Raw | % | Scored | Final | Floor |
|---|---|---|---|---|---|
| Demand forecasting model, classic ML, internal | 3 | 10 | I | I | |
| Internal assistant over company documents (RAG) | 3 | 10 | I | I | |
| Customer service chatbot for the public, EU, no human review | 14 | 48 | II | II | |
| LLM screening of job applications | 15 | 52 | III | III | Annex III (not needed) |
| Benefit eligibility scoring by a public body (FRIA in scope) | 18 | 62 | III | III | Annex III |
| Provider of a general-purpose model by API | 9 | 31 | II | II | |
| Emotion recognition of staff at work (prohibited) | 18 | 62 | III | III | Annex III |
| Coding assistant used only outside the EU | 2 | 7 | I | I | |

Level IV needs 22 points. Two checks: the benefits case made fully automatic and
irreversible scores 21 (72 percent, III); the same in law enforcement with children
affected scores 23 (79 percent, IV). IV is rare by design, as in the AIA.

## What each level changes

| | I and II | III and IV |
|---|---|---|
| Core | 10 questions | 13 (adds business-critical data, competitor exposure, automation bias) |
| Impact | 6 (harms, inherent and residual rating, mitigations) | 12 (adds rights engaged, provider information, when a risk materialises, complaints, explanation, effects on society and the environment) |
| GenAI | 19 | 24 (adds input filtering, vector store, rate limits, threat model, energy) |
| Governance | 8 | 10 (adds evidence references, suspension and reporting route) |
| Findings | | Significant decisions without a human making the final decision become a finding (the AIA requires a human final decision from level III) |
| Level IV only | | No named approver is a high finding; the help asks for approval at the most senior level that owns the risk (NIST GOVERN 2.3) |

## Points to decide

1. **The public chatbot lands at II (48 percent)**, one point under III. At II the GenAI
   module skips input filtering and rate limits, which matter most for a public system.
   Options: (a) keep II, and show those five GenAI questions at every level whenever the
   system is public-facing (`gaiUsers` public or a customer-facing chat pattern); (b) raise
   the "the public" weight from 2 to 3, which lifts this case to 15 points, level III.
   Recommendation: (a). It fixes the depth problem where it arises without inflating the
   impact level of every public system.
2. **The internal RAG assistant lands at I.** With personal data in the documents it could
   argue for II, but nothing in it decides about people. Recommendation: keep I.
3. **The public body case is III, not IV.** IV and III ask the same questions; IV only
   adds the senior approval finding. Recommendation: keep the bands, rather than lower IV
   to fit one case.
4. **Floors.** Recommendation: keep both. Without the Annex III floor, a low-volume
   Annex III use with good oversight would score II and skip rights, complaints and
   explanation, which Article 27 and Article 86 ask about.
