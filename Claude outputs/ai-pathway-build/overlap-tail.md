## What the pathway asks, roughly

| Step | Questions | Shown |
|---|---|---|
| Intake | 15 (`name`, `description`, `lifecycle`, `provider`, `firstUseDate`, `annexIIIArea`, `affectedCategories`, `friaVulnerable`, `affectedScale`, `gaiUsers`, `gaiPromptData`, `autonomyLevel`, `oversightMode`, `aipDecisionEffect`, `aipReversibility`) | always |
| Triggers | 4 (`aipGenerates`, `aipFoundationModel`, `aipFreePrompts`, `aipEu`) | always |
| Core | 13, 10 at levels I and II | always |
| Impact | 12, 6 at levels I and II | always |
| GenAI | up to 24, 19 at levels I and II, fewer without RAG or an agent | a GenAI trigger is Yes |
| AI Act | about 8 for a deployer, up to 19 for a GPAI model provider | EU trigger Yes or Not sure |
| Governance | 10, 8 at levels I and II | always |

The three standalone tools together hold 89 questions (`ai` 22, `genai` 31, `fria` 36) with
the overlaps above. A classic ML system at level II with no EU nexus answers about 43; a
public GenAI chatbot in the EU at level III about 80, every one of them once. Exact counts
come from the Phase 8 scenarios.

## Open points for review

1. **Two of the six triggers are derived, not asked.** "Personal data involved" comes from
   `gaiPromptData` and "output reaches people without human review" from `oversightMode`,
   both asked in intake anyway. Asking them again as triggers would break the ask-once rule.
2. **`aiType` is not asked.** The three GenAI triggers replace it and are more precise (an
   agent built on rules is not generative; a predictive model fine-tuned on an LLM is).
3. **Accuracy has no question for non-generative systems.** `ai` never asked one; `genai`
   asks grounding. Proposal: one Core question, `aipAccuracy` ("Has accuracy been measured
   against a defined threshold on data like the data it meets in use, and is it monitored
   after release?"), mapped to NIST AI RMF MEASURE 2.5 and ISO/IEC 42001 A.6.2.4. It is a
   NIST question, not an ISO-specific one. Not in the counts above. Yes or no?
4. **`annexIIIArea` sits in intake for every system**, EU or not, because it is the best
   sector signal the tools have and the tier needs one. For a non-EU system the page labels
   it as a use-area question and the AI Act reading is not shown.
5. **Transparency has a split owner**: the AI Act module when the EU trigger is Yes or Not
   sure, the GenAI module (`gaiDisclosure`) otherwise.
6. **The DPIA handover does not seed severity and likelihood.** The FRIA and DPIA use the
   same four bands, but one rates interference with rights and the other harm from the
   processing; a pre-filled rating tends to survive unexamined. Name, description, dates,
   harms text, special category, processors, review date and the Art. 35(3) criteria are
   seeded.
7. **The Impact step reuses the FRIA ids**, so the FRIA handover is a copy of the answers
   under the same ids plus `deployerProcess` (from `description`), `friaGovernance` (from
   `aipApprover`), `friaReviewDate` (from `aipReviewDate`) and `friaDpia`. In the FRIA the
   user sees those answers filled and completes period, frequency, reuse and notification.
8. **`suspensionProcess` moves to Governance** with a general label, since a route to stop
   and report applies to every system, not only to high-risk deployers.
9. **Findings from the standalone result functions are filtered in the pathway**: the
   regulatory factors of `aiResult` (prohibited, Annex III, Annex I, Unresolved, Minimal)
   are replaced by `aiActResult`, and `aiResult` "No output guardrails" and "No
   context/memory safeguards" cannot fire because their questions are not asked.
