# AI Assessment Pathway: source notes (Phase 2)

Checked 3 October 2026. AI Act and ISO items were checked locally against the site's own
verified data (`ai-act-digest-build/ai_act_digest.json`, Regulation as amended by
2026/1744; `ai-crosswalk-build/iso42001.json`, `iso42005.json`, `nist_ai_rmf.json`,
`rows.py`). NIST, Singapore and Canada were checked by three subagents with WebFetch on
the primary pages. WebFetch returns text through a summarising model, so any wording that
ships as a quote was taken from the site's own data files where they hold it, not from the
fetch.

## 1. EU AI Act (against `ai_act_digest.json`)

| Point | What the pathway uses | Digest says | Use |
|---|---|---|---|
| Scope, Art. 2(1) | EU trigger: placed on the EU market or put into service, used in the EU, or output used in the EU | Providers placing on the Union market wherever established, deployers in the Union, third-country operators whose output is used in the Union, importers, distributors, product manufacturers, authorised representatives | Trigger wording confirmed. Exclusions (Art. 2(3) to (12): military, defence, national security, scientific research, pre-market testing, personal use, free and open-source unless high-risk or caught by Art. 5 or 50) go in the module help, not as questions |
| AI literacy, Art. 4 | Always listed | Providers and deployers take measures to support literacy; no individual level guaranteed (amended); applies from 2 February 2025 | Wording "support", not "ensure". Crosswalk row `r01` |
| Prohibitions, Art. 5 | Reuse `prohibitedUse` | Ten practices; points (ba) and (bb) (non-consensual intimate imagery, CSAM) from 2 December 2026 | `prohibitedUse` label already carries the 2 December 2026 date. Row `r02` |
| High risk, Art. 6 | `annexIIIArea`, `highRiskAnnexI`, new Art. 6(3) question | Art. 6(1) Annex I route with third-party conformity; Art. 6(2) Annex III; Art. 6(3) four conditions (narrow procedural task, improve a completed human activity, detect decision patterns or deviations, preparatory task); profiling always high-risk; Art. 6(4) document and register under Art. 49(2); new 6(1a) to (1c) non-safety aspects are not safety components | Art. 6(3) options use these four conditions. Row `r03` |
| Dates, Art. 113 | Application dates on every obligation | Annex III high-risk 2 December 2027; Annex I 2 August 2028; GPAI (Chapter V) 2 August 2025; general application 2 August 2026 | Confirmed |
| Role shift, Art. 25 | `intendedPurposeAligned` finding | Name on the system, substantial modification, or change of intended purpose makes a deployer, importer or distributor the provider | Row `r04` |
| Deployer duties, Art. 26 | Listed for deployers of high-risk systems | Instructions for use (1), oversight (2), input data (4), monitor, report, suspend (5), logs 6 months (6), workers' representatives (7), public authority registration (8), inform persons (11) | Rows `r16` to `r20` |
| FRIA, Art. 27 | Handover through `friaApplicability()` | Public law bodies, private operators of public services, Annex III 5(b) and 5(c); not point 2; Art. 27(4) cross-refer or incorporate DPIA | Confirmed; row `r21` |
| Transparency, Art. 50 | `aiaInteracts`, synthetic content from `aipGenerates`, `aiaEmotion`, `aiaDeepfake` | (1) provider: people know they interact with AI unless obvious; (2) provider: machine-readable marking of synthetic audio, image, video, text; (3) deployer: inform people exposed to emotion recognition or biometric categorisation; (4) deployer: disclose deep fakes and AI text published on matters of public interest (exceptions: artistic works, editorial responsibility); (5) at first interaction. Applies from 2 August 2026 | Provider duties (1), (2) and deployer duties (3), (4) split by role. Rows `r23` (provider), `r24` (deployer) |
| Art. 111(4) | Date note on Art. 50(2) | Generators placed on the market before 2 August 2026 comply with Art. 50(2) by 2 December 2026 | Shown on the Art. 50(2) obligation |
| GPAI, Art. 51 and 52 | Systemic risk question | Presumed above 10^25 FLOP cumulative training compute, or Commission designation; notify within two weeks (Art. 52, row `r28`) | Confirmed |
| GPAI, Art. 53 | Four duties | (1)(a) Annex XI documentation; (b) Annex XII information to downstream providers; (c) copyright policy (Art. 4(3) Directive 2019/790); (d) training content summary on the AI Office template; (2) (a) and (b) do not apply to free and open-source models with public weights unless systemic risk | Open-source question needed. Row `r25` |
| GPAI, Art. 54 | Third-country providers | Authorised representative in the Union before placing on the market; not for open-source unless systemic | Listed when the provider is outside the EU (new question `aiaGpaiOutsideEu`) |
| GPAI, Art. 55 | Systemic risk only | Evaluation including adversarial testing; assess and mitigate systemic risks; serious incidents to the AI Office; cybersecurity | Row `r26` |
| Pre-existing models, Art. 111(3) | Date note | GPAI models on the market before 2 August 2025 comply by 2 August 2027 | Shown on the GPAI obligations |
| Explanation, Art. 86 | Impact `explanationProcess` | Deployer decisions on Annex III output with legal or similarly significant effects; digest lists it as applying from 2 August 2026 | The digest dates the article 2 August 2026; crosswalk row `r22` dates it with the high-risk rules. Pathway follows the crosswalk wording, since the right attaches to Annex III systems whose rules apply from 2 December 2027, and says so |

Links: each obligation links to `ai-governance-crosswalk.html#cw-rNN` and to
`ai-act-digest.html#art-N` (the digest's entry ids are `art-N`).

## 2. NIST AI RMF 1.0 (NIST AI 100-1, January 2023)

- Subcategory texts: the 22 checked by the subagent match `nist_ai_rmf.json` (which is the
  site's verified copy from the PDF). The pathway maps to subcategory ids and takes texts
  from that file, never retyped.
- **Revision announced, not published.** nist.gov (modified 13 August 2026): "The AI RMF 1.0
  is being revised as part of the White House AI Action Plan." No draft as of 3 October
  2026. The coverage table is labelled "NIST AI RMF 1.0" and the guide notes the revision.
- Sources: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf ,
  https://www.nist.gov/itl/ai-risk-management-framework ,
  https://airc.nist.gov/airmf-resources/airmf/

## 3. NIST AI 600-1 (Generative AI Profile, July 2024)

- Twelve risks, order confirmed, names match `NIST_GAI_RISKS` in `assessment.js`.
- Risk 6 is spelt two ways in the source: "Harmful Bias or Homogenization" in the section 2
  list, "Harmful Bias and Homogenization" in the 2.6 heading and every action table. The
  tool's "Harmful bias and homogenization" follows the tables; no change.
- No revision or successor. Related, not replacing it: NIST IR 8596 iprd (Cyber AI Profile,
  December 2025).
- Source: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

## 4. Singapore Model AI Governance Framework for Generative AI (30 May 2024)

- Nine dimensions confirmed, names and order: Accountability; Data; Trusted Development and
  Deployment; Incident Reporting; Testing and Assurance; Security; Content Provenance;
  Safety and Alignment R&D; AI for Public Good.
- Addressed to "policymakers, industry, the research community and the broader public".
  Non-binding framework; the text does not use the word "voluntary", so the page says
  "framework, not law" rather than quoting it as voluntary.
- **Dimensions 8 and 9 are mostly ecosystem and policy level.** Mapping: Safety and
  Alignment R&D only through the GPAI systemic-risk evaluation question; AI for Public Good
  only through `aipSocietalImpact`. Most deployments will show both as "Not assessed", which
  is correct and is explained on the page.
- **URL:** the PDF most sources cite (`.../uploads/2024/06/...`) now returns 404. Use the
  landing page https://aiverifyfoundation.sg/resources/mgf-gen-ai/ as the link; the
  current PDF is
  https://aiverifyfoundation.sg/wp-content/uploads/2026/06/Model-AI-Governance-Framework-for-Generative-AI-19-June-2024.pdf
- Companion, not used: IMDA Model AI Governance Framework for Agentic AI (v1.0, 22 January
  2026, updated 20 May 2026 per secondary sources). Noted in the guide as a candidate for
  the agentic questions later.

## 5. Government of Canada Algorithmic Impact Assessment (method only)

- Directive on Automated Decision-Making, current text dated 24 June 2025
  (https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32592); AIA page modified 28 May 2026
  (https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/algorithmic-impact-assessment.html).
- Method taken: a raw impact score from weighted answers, expressed as a percentage of the
  maximum, banded into four levels: I 0 to 25 percent, II 26 to 50, III 51 to 75, IV 76 to
  100. The AIA deducts 15 percent from the raw score when the mitigation score reaches 80
  percent of its maximum.
- **Pathway choice:** no mitigation deduction. The tier sets depth before mitigations are
  asked, so a deduction would need answers the pathway has not collected yet; mitigations
  show in the residual rating of the Impact step instead. Stated on the page.
- Level definitions (Appendix B): impacts that are "little to no, easily reversible, and
  brief" (I), "moderate, likely reversible and short-term" (II), "high, difficult to
  reverse and potentially ongoing" (III), "very high, irreversible and perpetual" (IV).
  Five areas of impact: rights of individuals or communities; equality, dignity, privacy
  and autonomy; health or well-being; economic interests; sustainability of an ecosystem.
  The tier factors cover these through reversibility, decision effect, vulnerability,
  sector and scale.
- What higher levels require in the Directive (Appendix C), used only as the model for
  "what each level changes": more peer review, notice with explanation, human makes the
  final decision from level III, recurring training, higher approval level. The pathway's
  equivalent: more questions in Core, Impact and GenAI at III and IV, a stated expectation
  of human final decision and a named approver at III and IV.
- The Directive's questions and weights are not used. The pathway's own weights are set in
  Phase 4.

## 6. ISO/IEC 42001:2023 and ISO/IEC 42005:2025

- 42001 clause and Annex A titles from `iso42001.json` (numbers and titles only, as on the
  crosswalk). Governance step maps to 6.1.2 AI risk assessment, 6.1.4 AI system impact
  assessment, 8.2 AI risk assessment, 8.3 AI risk treatment, 8.4 AI system impact
  assessment, plus A.3.2 AI roles and responsibilities, A.5.2 to A.5.5 (impact assessment
  process, documentation, individuals or groups, societal impacts), A.6.2.6 operation and
  monitoring, A.8.4 communication of incidents.
- 42005: the crosswalk data holds clause numbers from the DIS draft only, so the pathway
  cites 42005 by title as method guidance and gives no clause numbers.
- Both labelled voluntary on the page.

## Effect on the build

1. Art. 50 obligations split by role, Art. 111(4) date on 50(2).
2. GPAI questions add an open-source exemption and an outside-EU provider question.
3. Art. 6(3) options are the four conditions plus profiling.
4. Singapore link to the landing page; dimensions 8 and 9 expected "Not assessed".
5. Tier without mitigation deduction.
6. NIST AI RMF table labelled 1.0 with the revision noted in the guide.
