# Builds claude/ai-pathway-overlap.md from assessment.json plus the dispositions below.
import json
D = json.load(open('../assessment.json'))
TOOLS = [('ai','AI_STEPS','AI Risk Assessment'),('genai','GAI_STEPS','Generative AI Risk Assessment'),
         ('fria','FRIA_STEPS','Fundamental Rights Impact Assessment'),('dpia','DPIA_STEPS','Full DPIA')]

# disposition codes
# I intake, T triggers, C core, P impact, G genai, A ai act, V governance, D derived, H handover only, X dropped
DISP = {
 # ---- AI Risk Assessment
 ('ai','name'):('Same id: all four','I','Intake','all',''),
 ('ai','description'):('Same id: all four','I','Intake','all',''),
 ('ai','aiType'):('Same topic: trigger questions','X','Not asked','','Replaced by the generation, foundation model and free-prompt triggers, which open the GenAI module more precisely. `aiResult` reads `aiType` only to show its own GenAI step, which the pathway does not use.'),
 ('ai','lifecycle'):('Unique','I','Intake','all','Note (dates placed on the market) kept.'),
 ('ai','ownersAssigned'):('Same topic: governance owner fields','D','Governance','','Derived: Yes when `aipSystemOwner` is filled. `aiResult` does not read it.'),
 ('ai','prohibitedUse'):('Same id reused','A','AI Act','all','Art. 5 gate. A Yes ends the module.'),
 ('ai','highRiskAnnexIII'):('Same topic: FRIA `annexIIIArea`','D','AI Act','','Derived from `annexIIIArea` (intake): an Annex III area gives Yes, "Not an Annex III high-risk system" gives No, "Not sure" gives Unsure. The Art. 6(3) exception is a new question in the AI Act module.'),
 ('ai','highRiskAnnexI'):('Same id reused','A','AI Act','all',''),
 ('ai','humanOversight'):('Same topic: FRIA `oversightAssigned`, `oversightCompetence`','D','Core','','Derived for `aiResult`: Yes when `oversightAssigned` is Yes, No when it is No.'),
 ('ai','autonomyLevel'):('Same topic: GenAI `gaiToolPermissions` (partial)','I','Intake','all','Tier factor. GenAI keeps `gaiToolPermissions`, which asks what the tools can do, not whether a human approves.'),
 ('ai','loggingInPlace'):('Same topic: GenAI `gaiMonitoring` (partial)','C','Core','all','Logging of actions and data access. `gaiMonitoring` (prompts, outputs, incident route) stays in GenAI.'),
 ('ai','multiAgent'):('Unique','C','Core','all',''),
 ('ai','multiAgentDocumented'):('Unique','C','Core','all','Shown when `multiAgent` is Yes, as today.'),
 ('ai','broadDataAccess'):('Unique','C','Core','all',''),
 ('ai','thirdPartyData'):('Same topic: GenAI `gaiTrainingDataVetted` (partial)','C','Core','all','Source of data; vetting of fine-tuning data stays in GenAI.'),
 ('ai','providerTraining'):('Same topic: GenAI `gaiProviderUse`','D','Core','','Derived from `gaiProviderUse`, which Core asks instead because it has the richer options: Yes gives Yes, Not sure gives Unsure, anything else gives No.'),
 ('ai','businessCriticalData'):('Unique (also in Privacy Assessment)','C','Core','III+',''),
 ('ai','competitorExposure'):('Unique','C','Core','III+',''),
 ('ai','contextSafeguards'):('Same topic: GenAI injection, leakage and RAG checks','X','Not asked','','Context poisoning and leakage are owned by the GenAI module (`gaiInjectionTested`, `gaiOutputLeakCheck`, `gaiRagPermissions`, `gaiEmbeddingStore`), which ask them in finer grain.'),
 ('ai','outputGuardrails'):('Same topic: GenAI `gaiContentFilters`','X','Not asked','','Owned by GenAI `gaiContentFilters`.'),
 ('ai','legalReview'):('Unique','V','Governance','all',''),
 ('ai','auditFrequency'):('Same topic: governance review date','D','Governance','','Derived: Yes when `aipReviewDate` is set.'),
 # ---- GenAI
 ('genai','name'):('Same id: all four','I','Intake','all',''),
 ('genai','description'):('Same id: all four','I','Intake','all',''),
 ('genai','gaiPatterns'):('Unique','G','GenAI','all','First question of the module; drives RAG and agent questions.'),
 ('genai','gaiModelSource'):('Unique','G','GenAI','all',''),
 ('genai','gaiUsers'):('Same topic: FRIA `affectedCategories` (partial)','I','Intake','all','Asked in intake for every system (tier factor: public exposure). Who uses it, not who is affected.'),
 ('genai','gaiPromptData'):('Same topic: DPIA `specialCategory`, plan trigger "personal data"','I','Intake','all','Asked in intake for every system with a pathway label ("What data does the system take in, retrieve or produce?"). Gives the personal data trigger and the data sensitivity tier factor, so no separate trigger question.'),
 ('genai','gaiUntrustedContent'):('Unique','G','GenAI','all',''),
 ('genai','gaiInjectionTested'):('Unique (Security: GenAI adds prompt injection)','G','GenAI','all',''),
 ('genai','gaiSystemPromptSecrets'):('Unique','G','GenAI','all',''),
 ('genai','gaiInputFiltering'):('Unique','G','GenAI','III+',''),
 ('genai','gaiProviderUse'):('Same topic: AI `providerTraining`','C','Core','all','Moved to Core (Privacy and Third parties are Core topics) with a pathway label not specific to prompts. Read by `gaiResult` under the same id.'),
 ('genai','gaiOutputLeakCheck'):('Unique (Privacy: GenAI adds leakage)','G','GenAI','all',''),
 ('genai','gaiRagPermissions'):('Unique','G','GenAI','all','RAG only, as today.'),
 ('genai','gaiEmbeddingStore'):('Unique','G','GenAI','III+','RAG only, as today.'),
 ('genai','gaiIpCheck'):('Unique','G','GenAI','all',''),
 ('genai','gaiOutputHandling'):('Unique','G','GenAI','all',''),
 ('genai','gaiGrounding'):('Unique (Accuracy: GenAI adds hallucination controls)','G','GenAI','all',''),
 ('genai','gaiHumanReview'):('Same topic: FRIA `oversightMode`','D','Intake','','Derived from `oversightMode`: before every decision gives Always, flagged or contested cases gives For high-impact uses, sampling after the fact or no review gives No.'),
 ('genai','gaiContentFilters'):('Same topic: AI `outputGuardrails`','G','GenAI','all',''),
 ('genai','gaiDisclosure'):('Same topic: AI Act Art. 50 step','G','GenAI or AI Act','all','Owner is the AI Act module when the EU trigger is Yes (Art. 50 questions; `gaiDisclosure` derived from them). With no EU nexus the GenAI module asks `gaiDisclosure` itself, so the NIST information integrity row is still assessed.'),
 ('genai','gaiToolPermissions'):('Same topic: AI `autonomyLevel` (partial)','G','GenAI','all','Agent pattern only, as today.'),
 ('genai','gaiApproval'):('Same topic: AI `autonomyLevel` (partial)','G','GenAI','all','Agent with write actions only, as today.'),
 ('genai','gaiProvenance'):('Unique (Third parties: GenAI adds model dependency)','G','GenAI','all',''),
 ('genai','gaiTrainingDataVetted'):('Same topic: AI `thirdPartyData` (partial)','G','GenAI','all','Fine-tuned or own model only, as today.'),
 ('genai','gaiRateLimits'):('Unique','G','GenAI','III+',''),
 ('genai','gaiRedTeam'):('Unique','G','GenAI','all',''),
 ('genai','gaiThreatModel'):('Unique','G','GenAI','III+',''),
 ('genai','gaiBiasEval'):('Same topic: FRIA `biasEvaluated` (partial)','G','GenAI','all','Bias in generated content. Unequal outcomes of decisions stay with Core `biasEvaluated`.'),
 ('genai','gaiUserGuidance'):('Same topic: FRIA `automationBias`, AI Act Art. 4','C','Core','all','Moved to Core with a pathway label covering every system ("Are the people who use or oversee the system trained on its limits?"). Feeds the Art. 4 AI literacy line in the AI Act module and is read by `gaiResult` under the same id.'),
 ('genai','gaiMonitoring'):('Same topic: AI `loggingInPlace` (partial), FRIA `suspensionProcess` (partial)','G','GenAI','all',''),
 ('genai','gaiEnergy'):('Unique','G','GenAI','III+',''),
 # ---- FRIA
 ('fria','name'):('Same id: all four','I','Intake','all',''),
 ('fria','description'):('Same id: all four','I','Intake','all',''),
 ('fria','deployerType'):('Unique','A','AI Act','all','Role step, shown when the role includes deployer. With `annexIIIArea` it feeds `friaApplicability()` for the FRIA handover.'),
 ('fria','annexIIIArea'):('Same topic: AI `highRiskAnnexIII`','I','Intake','all','Asked in intake as the use area (tier factor: sector). Settles `highRiskAnnexIII`.'),
 ('fria','provider'):('Unique','I','Intake','all','Vendor and model, version assessed.'),
 ('fria','firstUseDate'):('Same topic: DPIA `goLiveDate`','I','Intake','all',''),
 ('fria','deployerProcess'):('Same topic: `description`','H','FRIA handover','','Seeded from `description`.'),
 ('fria','intendedPurposeAligned'):('Unique','A','AI Act','all','Deployers only (Art. 25(1) role shift).'),
 ('fria','usePeriod'):('Unique','H','FRIA handover','',''),
 ('fria','useFrequency'):('Unique','H','FRIA handover','',''),
 ('fria','affectedCategories'):('Same topic: GenAI `gaiUsers` (partial)','I','Intake','all',''),
 ('fria','friaVulnerable'):('Same topic: DPIA trigger "vulnerable individuals"','I','Intake','all','Tier factor.'),
 ('fria','affectedScale'):('Same topic: DPIA trigger "large scale"','I','Intake','all','Tier factor.'),
 ('fria','affectedAware'):('Same topic: AI Act transparency','A','AI Act','all','Art. 26(11): deployers of an Annex III system deciding about people.'),
 ('fria','rightsAtRisk'):('Same topic: DPIA `harms` (partial)','P','Impact','III+',''),
 ('fria','harmsDescription'):('Same topic: DPIA `harmsDetail`','P','Impact','all','Seeds DPIA `harmsDetail`.'),
 ('fria','providerInfoReviewed'):('Unique','P','Impact','III+',''),
 ('fria','biasEvaluated'):('Same topic: GenAI `gaiBiasEval` (partial)','C','Core','all','Fairness owner is Core. Shown when the output supports decisions about people.'),
 ('fria','friaInherentSeverity'):('Same topic: DPIA `inherentSeverity`','P','Impact','all','Rated on `RISK_MATRIX` through `riskLevelFor`, as the FRIA does.'),
 ('fria','friaInherentLikelihood'):('Same topic: DPIA `inherentLikelihood`','P','Impact','all',''),
 ('fria','oversightAssigned'):('Same topic: AI `humanOversight`','C','Core','all',''),
 ('fria','oversightCompetence'):('Same topic: AI `humanOversight`','C','Core','all',''),
 ('fria','oversightMode'):('Same topic: GenAI `gaiHumanReview`','I','Intake','all','Gives the "output reaches people without review" trigger, so no separate trigger question. Tier factor with `autonomyLevel`.'),
 ('fria','automationBias'):('Same topic: GenAI `gaiUserGuidance` (partial)','C','Core','III+',''),
 ('fria','mitigationMeasures'):('Same topic: DPIA `controlsInPlace` (partial)','P','Impact','all',''),
 ('fria','materialiseMeasures'):('Unique','P','Impact','III+',''),
 ('fria','suspensionProcess'):('Same topic: GenAI `gaiMonitoring` (partial)','V','Governance','III+','Pathway label generalised to "suspend use and report where the system presents a risk or a serious incident occurs".'),
 ('fria','complaintMechanism'):('Unique','P','Impact','III+',''),
 ('fria','explanationProcess'):('Same topic: DPIA rights questions (partial)','P','Impact','III+','Art. 86.'),
 ('fria','friaGovernance'):('Same topic: governance owner and approver','H','FRIA handover','','Seeded from `aipApprover`.'),
 ('fria','friaResidualSeverity'):('Same topic: DPIA `residualSeverity`','P','Impact','all',''),
 ('fria','friaResidualLikelihood'):('Same topic: DPIA `residualLikelihood`','P','Impact','all',''),
 ('fria','friaDpia'):('Same topic: DPIA handover','H','FRIA handover','','Seeded "In progress" when the pathway offers the DPIA handover, left blank otherwise.'),
 ('fria','priorAssessmentReused'):('Unique','H','FRIA handover','',''),
 ('fria','authorityNotified'):('Unique','H','FRIA handover','',''),
 ('fria','friaReviewDate'):('Same topic: governance review date','H','FRIA handover','','Seeded from `aipReviewDate`.'),
}
# DPIA: handover only, with a few seeds
DPIA_SEED = {
 'name':('Same id: all four','I','Intake','all',''),
 'description':('Same id: all four','I','Intake','all',''),
 'goLiveDate':('Same topic: FRIA `firstUseDate`','H','DPIA handover','','Seeded from `firstUseDate`.'),
 'dpiaTriggers':('Same topic: intake and tier answers','H','DPIA handover','','Pre-ticked from intake: innovative technology (always, for an AI system), vulnerable individuals (`friaVulnerable`), large scale (`affectedScale` 10,000 or more), special category data (`gaiPromptData`), automated decision with legal or similar effect (`aipDecisionEffect` plus `oversightMode` "No human review"), evaluation or scoring (`aipDecisionEffect`).'),
 'specialCategory':('Same topic: `gaiPromptData`','H','DPIA handover','','Seeded Yes when `gaiPromptData` includes special category data.'),
 'harmsDetail':('Same topic: FRIA `harmsDescription`','H','DPIA handover','','Seeded from `harmsDescription`.'),
 'processorsInvolved':('Same topic: `gaiModelSource`, `provider`','H','DPIA handover','','Seeded Yes when the model is a third-party API.'),
 'harms':('Same topic: FRIA `rightsAtRisk` (partial)','H','DPIA handover','','Not seeded: the DPIA list is harm to individuals from processing, a different vocabulary.'),
 'inherentSeverity':('Same topic: FRIA `friaInherentSeverity`','H','DPIA handover','','Not seeded: same four bands, but the DPIA rates harm from the processing, so the assessor rates it there.'),
 'inherentLikelihood':('Same topic: FRIA `friaInherentLikelihood`','H','DPIA handover','','Not seeded, as above.'),
 'residualSeverity':('Same topic: FRIA `friaResidualSeverity`','H','DPIA handover','','Not seeded.'),
 'residualLikelihood':('Same topic: FRIA `friaResidualLikelihood`','H','DPIA handover','','Not seeded.'),
 'controlsInPlace':('Same topic: FRIA `mitigationMeasures` (partial)','H','DPIA handover','',''),
 'reviewDate':('Same topic: governance review date','H','DPIA handover','','Seeded from `aipReviewDate`.'),
 'rightsAccess':('Same topic: FRIA `explanationProcess` (partial)','H','DPIA handover','',''),
 'rightsObject':('Same topic: FRIA `complaintMechanism` (partial)','H','DPIA handover','',''),
}
for s in D['DPIA_STEPS']:
    for q in s['questions']:
        DISP[('dpia',q['id'])] = DPIA_SEED.get(q['id'], ('Unique to the DPIA','H','DPIA handover','',''))

NEW = [
 # id, step, label, depth, purpose
 ('aipDecisionEffect','Intake','Does the output make or support decisions about people? (no; supports decisions with minor effects; supports decisions with legal or similarly significant effects; makes such decisions on its own)','all','Tier factor (decision impact); Core `biasEvaluated` visibility; DPIA trigger seeds.'),
 ('aipReversibility','Intake','If an output is wrong, can its effect on a person be reversed? (easily; with effort; not, or only with great difficulty; not applicable)','all','Tier factor (reversibility).'),
 ('aipGenerates','Triggers','Does it generate text, images, audio, video or code?','all','Opens GenAI; derives Art. 50(2) synthetic content.'),
 ('aipFoundationModel','Triggers','Is it built on, or does it call, a foundation or general-purpose model?','all','Opens GenAI.'),
 ('aipFreePrompts','Triggers','Can users give it free-form prompts?','all','Opens GenAI.'),
 ('aipEu','Triggers','Is it placed on the EU market or put into service in the EU, used in the EU, or is its output used in the EU (Art. 2(1))? (yes; no; not sure)','all','Opens the AI Act module ("Not sure" opens it too).'),
 ('aipSocietalImpact','Impact','Effects beyond individuals: on groups, communities, society or the environment','III+','ISO/IEC 42005 asks for these; the FRIA does not.'),
 ('aiaRole','AI Act','Role: provider, deployer, importer, distributor, product manufacturer, provider of a general-purpose AI model','all','Sets which obligations are listed.'),
 ('aiaArt63','AI Act','If Annex III: does an Art. 6(3) condition apply, and does the system profile natural persons?','all','Only when `annexIIIArea` is an Annex III area.'),
 ('aiaGpai*','AI Act','GPAI model duties: systemic risk status, Art. 53(1) documentation, copyright policy, training content summary, open-source exemption (Art. 53(2)); Art. 55 evaluation, incidents, cybersecurity if systemic','all','Only when the role includes GPAI model provider.'),
 ('aiaInteracts','AI Act','Is it intended to interact directly with people? (Art. 50(1))','all','Skipped when `gaiPatterns` already says chat.'),
 ('aiaEmotion','AI Act','Emotion recognition or biometric categorisation? (Art. 50(3))','all',''),
 ('aiaDeepfake','AI Act','Deep fakes, or text published to inform the public on matters of public interest? (Art. 50(4))','all','Only when `aipGenerates` is Yes.'),
 ('aiaTransparencyDone','AI Act','Are the transparency measures that apply in place? (yes; partially; no)','all','Gives `gaiDisclosure` for `gaiResult`.'),
 ('aipSystemOwner','Governance','System owner','all',''),
 ('aipAssessor','Governance','Assessor','all',''),
 ('aipApprover','Governance','Approver','all','Seeds FRIA `friaGovernance`.'),
 ('aipDecision','Governance','Decision: approve, approve with conditions, reject, not yet decided','all',''),
 ('aipConditions','Governance','Conditions','all','Shown for approve with conditions.'),
 ('aipEvidence','Governance','Evidence references','III+',''),
 ('aipReviewDate','Governance','Review date','all','Gives `auditFrequency`; seeds FRIA and DPIA review dates.'),
 ('aipReassessTriggers','Governance','Trigger events for reassessment','all',''),
]

out = []
P = out.append
P("# AI Assessment Pathway: overlap matrix (Phase 1)\n")
P("Status: for review. Written 3 October 2026 from `assessment.js` 320,255 bytes, md5\n`c048ea27185c481dd2f8bc2ca53db99a`, dumped with `study-pack-build/dump_assessment.js`.\nGenerated by `Claude outputs/ai-pathway-build/overlap.py`, so the tables cover every\nquestion of the four tools and cannot drift from the source.\n")
P("## How to read it\n")
P("- **Overlap**: same id (shared answer already), same topic under another id, or unique.")
P("- **Placement**: where the pathway asks it. Intake and triggers always; Core always; Impact\n  always (short at levels I and II); GenAI when a GenAI trigger is Yes; AI Act when the EU\n  trigger is Yes or Not sure; Governance always. \"Derived\" means the pathway does not ask\n  it but computes the value from the owner's answer, so the standalone result functions\n  (`aiResult`, `gaiResult`) still see it. \"Handover\" means it stays in the DPIA or the FRIA,\n  reached by a seeded handover. \"Not asked\" means the owner module covers the topic.")
P("- **Depth**: `all` shown at every impact level, `III+` only at levels III and IV.")
P("- Question ids are kept wherever a question is reused, so the FRIA and DPIA seeds are\n  mostly a copy of the answers under the same id. Pathway-only labels are allowed on a\n  reused id (the question object is copied, the standalone tool's object is untouched).\n")

# owners table
P("## Owner per topic\n")
P("| Topic | Owner | Questions in the owner | GenAI adds only | Change from the plan |")
P("|---|---|---|---|---|")
rows = [
 ("Accuracy","Core (via GenAI for generative systems)","none in Core for classic ML beyond `biasEvaluated`","`gaiGrounding` (hallucination controls)","Classic ML accuracy has no question in `ai` today; none added (see open point 3)"),
 ("Privacy","Core (and DPIA)","`gaiPromptData` (intake), `gaiProviderUse`","`gaiOutputLeakCheck`, `gaiRagPermissions`, `gaiEmbeddingStore`","`gaiProviderUse` moves to Core and replaces `providerTraining`"),
 ("Security","Core","`broadDataAccess`, `loggingInPlace`, `competitorExposure`, `businessCriticalData`","`gaiUntrustedContent`, `gaiInjectionTested`, `gaiSystemPromptSecrets`, `gaiInputFiltering`, `gaiOutputHandling`, `gaiRedTeam`, `gaiThreatModel`, `gaiRateLimits`","`contextSafeguards` not asked: GenAI covers it in finer grain"),
 ("Fairness","Core","`biasEvaluated`","`gaiBiasEval` (bias in generated content)","none"),
 ("Effects on people","Impact step (and FRIA)","`affectedCategories`, `friaVulnerable`, `affectedScale` (intake), `rightsAtRisk`, `harmsDescription`, `aipSocietalImpact`, inherent and residual ratings, `mitigationMeasures`, `materialiseMeasures`, `complaintMechanism`, `explanationProcess`","`gaiContentFilters` (harm from generated content)","`aipSocietalImpact` added for ISO/IEC 42005"),
 ("Transparency","AI Act module; GenAI when no EU nexus","`aiaInteracts`, `aiaEmotion`, `aiaDeepfake`, `aiaTransparencyDone`, `affectedAware`","`gaiDisclosure` only when the AI Act module is closed","Split owner, so non-EU GenAI systems still get a disclosure check"),
 ("Third parties","Core","`provider` (intake), `thirdPartyData`, `gaiProviderUse`, `multiAgent`, `multiAgentDocumented`","`gaiModelSource`, `gaiProvenance`, `gaiTrainingDataVetted`","none"),
 ("Human oversight","Core","`oversightMode`, `autonomyLevel` (intake), `oversightAssigned`, `oversightCompetence`, `automationBias`, `gaiUserGuidance`","`gaiToolPermissions`, `gaiApproval` (agent actions)","`gaiHumanReview` derived from `oversightMode`; `gaiUserGuidance` moves to Core and doubles as the Art. 4 literacy check"),
 ("Ownership and review","Governance step","`aipSystemOwner`, `aipAssessor`, `aipApprover`, `aipDecision`, `aipConditions`, `aipEvidence`, `aipReviewDate`, `aipReassessTriggers`, `legalReview`, `suspensionProcess`","nothing","`ownersAssigned` and `auditFrequency` derived; `suspensionProcess` joins governance"),
 ("Legal classification","AI Act module","`prohibitedUse`, `highRiskAnnexI`, `annexIIIArea` (intake), `aiaArt63`, `aiaRole`, `deployerType`, `intendedPurposeAligned`, GPAI questions","nothing","New topic row: the plan's table had no owner for it"),
]
for r in rows: P("| " + " | ".join(r) + " |")
P("")

# per tool tables
import collections
summary = collections.Counter()
per_tool = {}
for mod, arr, label in TOOLS:
    P(f"## {label} (`{mod}`)\n")
    P("| Step | Id | Question | Overlap | Placement | Depth | Note |")
    P("|---|---|---|---|---|---|---|")
    c = collections.Counter()
    for s in D[arr]:
        for q in s['questions']:
            key = (mod, q['id'])
            if key not in DISP: raise SystemExit("missing " + str(key))
            ov, code, place, depth, note = DISP[key]
            lab = q['label'].replace('|','/')
            if len(lab) > 110: lab = lab[:107].rsplit(' ',1)[0] + '...'
            P(f"| {s['title']} | `{q['id']}` | {lab} | {ov} | {place} | {depth} | {note} |")
            c[code] += 1
    per_tool[mod] = c
    P("")
names = {'I':'Intake','T':'Triggers','C':'Core','P':'Impact','G':'GenAI','A':'AI Act','V':'Governance','D':'Derived','H':'Handover only','X':'Not asked'}
P("## Counts\n")
P("| Tool | Questions | " + " | ".join(names[k] for k in 'ICPGAVDHX') + " |")
P("|---|---|" + "---|"*9)
for mod,_,label in TOOLS:
    c = per_tool[mod]
    P(f"| {label} | {sum(c.values())} | " + " | ".join(str(c.get(k,0)) for k in 'ICPGAVDHX') + " |")
P("\n`name` and `description` are counted once per tool but asked once in the pathway.\n")

P("## New pathway questions\n")
P("Ids `aip*` (pathway steps) and `aia*` (AI Act module). Checked against every id in the nine\ntools: none is in use.\n")
P("| Id | Step | Question | Depth | Why |")
P("|---|---|---|---|---|")
for n in NEW: P(f"| `{n[0]}` | {n[1]} | {n[2]} | {n[3]} | {n[4]} |")
P("")
doc = "\n".join(out).rstrip() + "\n\n" + open('overlap-tail.md').read()
assert '\u2014' not in doc
open('ai-pathway-overlap.md','w').write(doc)
print("ok", {m: dict(c) for m,c in per_tool.items()})
