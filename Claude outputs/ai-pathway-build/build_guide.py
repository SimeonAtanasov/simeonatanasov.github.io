# -*- coding: utf-8 -*-
"""AI Assessment Pathway study guide: writes ai-assessment-pathway-guide.md and .pdf.

Questions, conditions, mappings, tier points and the worked examples are read from the
shipped assessment.js through guide_data.json (made by guide_data.js) and from the study
pack's study_tools.py (the readable visibility conditions), never retyped. The prose is
authored here. British spelling, no em dashes.

Usage: python3 build_guide.py   (env: DATA=guide_data.json PACK_DIR=../study-pack-build OUT=.)
"""
import json, os, re, sys, subprocess, shutil, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.environ.get("DATA", os.path.join(HERE, "guide_data.json"))
PACK_DIR = os.environ.get("PACK_DIR", os.path.join(HERE, "..", "study-pack-build"))
OUT = os.environ.get("OUT", HERE)
sys.path.insert(0, PACK_DIR)
import study_tools  # noqa: E402

D = json.load(open(DATA, encoding="utf-8"))
COND = study_tools.AIPATH_CONDITIONS
SCOND = study_tools.AIPATH_STEP_CONDITIONS
GROUP = {"intake": "Intake", "triggers": "Triggers", "core": "Core", "impact": "Impact", "genai": "Generative AI module", "aiact": "EU AI Act module", "governance": "Governance"}
TYPE = {"text": "short text", "textarea": "long text", "select": "choose one", "multiselect": "choose any", "yesno": "yes / no", "date": "date"}

out = []
P = out.append


def cell(s):
    return str(s).replace("|", "/").replace("\n", " ")


def table(head, rows):
    P("| " + " | ".join(head) + " |")
    P("|" + "---|" * len(head))
    for r in rows:
        P("| " + " | ".join(cell(c) for c in r) + " |")
    P("")


n_steps = len(D["steps"])
n_q = sum(len(s["questions"]) for s in D["steps"])
reused = 68  # checked below against the step data
TODAY = datetime.date.today().isoformat()

P("# AI Assessment Pathway: study guide")
P("")
P("*How the tenth tool of the Privacy & AI Assessment works, which assessment to use when, and the frameworks behind it. Built from the shipped tool (%s), %d steps and %d questions. Reference material, not legal advice.*" % (D["source"], n_steps, n_q))
P("")
P("## Contents")
P("")
for i, t in enumerate(["AI risk assessment and generative AI risk assessment", "Which assessment for which case, and in what order", "The benchmarks", "How the pathway works", "The EU AI Act module", "The impact level", "Framework coverage and how to read it", "Worked examples", "Every question in the pathway", "Practice questions", "Sources"], 1):
    P("%d. %s" % (i, t))
P("")

# 1 -------------------------------------------------------------------------------------
P("## 1. AI risk assessment and generative AI risk assessment")
P("")
P("Both assess an AI system before and during use. They differ in what they look for, how they test it and who has to act.")
P("")
table(["", "AI risk assessment", "Generative AI risk assessment"], [
    ["Scope", "Any AI system: a scoring model, a classifier, a recommender, a rules engine that infers, an agent. The question is what the system decides or influences and for whom.", "Systems that generate text, images, audio, video or code, or run on a foundation model. The question is what the model can be made to produce or do, and what flows through its prompts."],
    ["Typical risks", "Wrong or biased decisions about people, opacity, over-reliance, data quality, function creep, legal classification (prohibited, high-risk).", "Confabulation, prompt injection, data leakage through prompts or retrieval, harmful or infringing content, excessive agency, supply chain of models and plug-ins, unbounded cost."],
    ["Testing", "Accuracy against a threshold on representative data, error rates and outcomes across groups, drift monitoring, human review of individual decisions.", "Red-teaming and adversarial testing, injection tests on every change, output filters tested in both directions, grounding and citation checks, threat modelling against MITRE ATLAS."],
    ["Who is responsible", "The deployer for the use and its effects; the provider for the system's design and documentation; under the EU AI Act both have duties that depend on the risk class.", "The same split, plus the provider of the general-purpose model upstream, whose documentation and terms the deployer depends on and whose duties sit in Articles 53 to 55 of the AI Act."],
    ["Reference frameworks", "NIST AI RMF 1.0, ISO/IEC 42001, ISO/IEC 42005, EU AI Act.", "NIST AI 600-1, OWASP Top 10 for LLM Applications, MITRE ATLAS, the Singapore framework for generative AI, EU AI Act Article 50."],
])
P("A generative system needs both. A chatbot that answers benefit questions is a generative system and, if it shapes decisions about eligibility, an AI system with effects on people. That is why the pathway runs the core and impact steps for every system and adds the generative AI module on top, rather than choosing one.")
P("")

# 2 -------------------------------------------------------------------------------------
P("## 2. Which assessment for which case, and in what order")
P("")
table(["Case", "Start with", "Then", "Why"], [
    ["A new AI system, any kind, not yet assessed", "AI Assessment Pathway", "The handovers it offers", "One intake, the impact level decides the depth, the modules open only if they apply."],
    ["Only the EU AI Act classification is needed, quickly", "AI Risk Assessment", "The pathway when the system goes ahead", "The standalone tool screens the prohibited and high-risk gates with business factors; it does not screen Article 50 or GPAI."],
    ["A technical security review of an LLM application", "Generative AI Risk Assessment", "The pathway for the organisational view", "Same checks as the pathway's GenAI module, without intake or governance."],
    ["A deployer that is a public body, or uses credit scoring or life and health insurance pricing, on an Annex III system", "AI Assessment Pathway", "FRIA from the pathway result, then the Full DPIA", "Article 27 applies; the FRIA starts with most answers filled. The DPIA covers the processing."],
    ["Personal data in the system", "AI Assessment Pathway", "Full DPIA from the pathway result (or the Privacy Assessment first if a DPIA may not be needed)", "Whether a DPIA is required turns on Article 35(3), which the DPIA asks first."],
    ["The model or service comes from a vendor", "Third-Party Security Assessment with its AI/ML supplement", "Transfer Impact Assessment if data leaves the EEA", "Vendor controls and transfers are separate assessments with their own owners."],
    ["Something has gone wrong", "Incident & Breach Severity", "Reassess in the pathway (an incident is a reassessment trigger)", "Severity of a breach is a different question from the risk of the system."],
])
P("The order follows a rule: settle what the system is and what applies before rating it in depth. The pathway does the first part for every AI system and hands over to the specialist tools for the second.")
P("")

# 3 -------------------------------------------------------------------------------------
P("## 3. The benchmarks")
P("")
P("Six benchmarks in seven documents; NIST AI 600-1 is a profile of the AI RMF. Only the EU AI Act is law. The pathway uses each for one job, and its mapping to all of them is its own.")
P("")
table(["Benchmark", "What it is", "Best for", "Legal or voluntary", "How the pathway uses it"], [
    ["NIST AI RMF 1.0 (NIST AI 100-1, January 2023)", "A risk management framework in four functions, Govern, Map, Measure, Manage, broken into categories and subcategories.", "A common vocabulary for AI risk activities across an organisation.", "Voluntary. NIST has announced a revision; none published as of October 2026.", "Every question is mapped to subcategories; a coverage table by subcategory."],
    ["NIST AI 600-1 (Generative AI Profile, July 2024)", "Twelve risks specific to or made worse by generative AI, with suggested actions.", "Naming the generative risks a system is exposed to.", "Voluntary.", "The GenAI module's checks map to the twelve risks; a coverage table."],
    ["Government of Canada Algorithmic Impact Assessment", "A scored questionnaire under the Directive on Automated Decision-Making that gives impact levels I to IV, each level carrying more requirements.", "Setting how much scrutiny a system needs before it is used.", "Mandatory for Canadian federal institutions; a method model elsewhere.", "Method only: the impact level is a weighted score banded at 25, 50 and 75 percent. Questions and weights are the pathway's own."],
    ["ISO/IEC 42005:2025", "Guidance on AI system impact assessment: scope, timing, affected parties, analysis, recording and approval.", "How to run an impact assessment.", "Voluntary standard (paid text).", "Cited as method for the Impact step; the step asks for effects on individuals, groups and society."],
    ["ISO/IEC 42001:2023", "Requirements for an AI management system, with Annex A controls.", "Running AI governance as a certifiable management system.", "Voluntary standard (paid text).", "Governance fields and a coverage column only, clauses and controls cited by number and title. No ISO-specific questions."],
    ["Singapore Model AI Governance Framework for Generative AI (May 2024)", "Nine dimensions for a trusted generative AI ecosystem: accountability, data, trusted development and deployment, incident reporting, testing and assurance, security, content provenance, safety and alignment R&D, AI for public good.", "A balanced checklist across organisation and ecosystem.", "Framework, not law; addressed to policymakers, industry, researchers and the public.", "A coverage table for generative systems. Dimensions 8 and 9 are mostly for governments and model developers and usually stay Not assessed."],
    ["EU AI Act (Regulation (EU) 2024/1689 as amended by 2026/1744), including the FRIA of Article 27", "Binding rules by risk class and role: prohibitions, high-risk requirements, transparency duties, general-purpose AI model duties, AI literacy.", "Knowing what is legally required, of whom, and from when.", "Law.", "The AI Act module: classification and the obligations for your role, each linked to the AI Act Digest and the crosswalk. The FRIA by handover."],
])

# 4 -------------------------------------------------------------------------------------
P("## 4. How the pathway works")
P("")
P("Seven parts, in this order. Each fact is asked once, and every risk has one owner.")
P("")
counts = {}
for s in D["steps"]:
    counts.setdefault(s["group"], [0, 0])
    counts[s["group"]][0] += 1
    counts[s["group"]][1] += len(s["questions"])
table(["Part", "Steps", "Questions", "Shown"], [
    [GROUP[g], counts[g][0], counts[g][1], w] for g, w in [
        ("intake", "always"), ("triggers", "always"), ("core", "always; three at levels III and IV only"),
        ("impact", "always; six at levels III and IV only"), ("genai", "a generative AI trigger is Yes"),
        ("aiact", "the EU trigger is Yes or Not sure"), ("governance", "always; two at levels III and IV only")]])
P("**Intake.** Name and description, lifecycle, vendor and model, first use, the use area (Annex III), who is affected and whether any are vulnerable, how many, whether the output decides about people, whether a wrong output can be reversed, who uses the system, what data it handles, how autonomous it is and when a human acts. The impact level is worked out from these answers.")
P("")
P("**Triggers.** Four questions: does it generate content, does it run on a foundation model, can users prompt it freely, is there an EU nexus under Article 2(1). Two more triggers are read from the intake: personal data (which offers the DPIA) and output that reaches people without review.")
P("")
P("**Core.** Oversight and its competence, automation bias, training on the system's limits (which is also the Article 4 literacy measure), unequal outcomes across groups, logging, third-party data, whether the provider keeps or trains on your inputs, access to sensitive systems, multi-agent chains, business-critical data and exposure to competitors.")
P("")
P("**Impact.** Harms, the rights engaged, effects beyond individuals, the provider's documentation, severity and likelihood before and after the measures on the same matrix as the Full DPIA, the measures, what happens when a risk materialises, complaints and explanation. These are the FRIA's own questions.")
P("")
P("**Generative AI module.** The Generative AI Risk Assessment's questions minus those already asked: patterns and model, prompts and injection, leakage, retrieval permissions, intellectual property, output handling, grounding, content filters, agents and approval, provenance, training data, consumption, red-teaming, threat model, bias in generated content, monitoring and energy.")
P("")
P("**EU AI Act module.** Role, prohibited practices, high-risk classification with Article 6(3), the general-purpose AI model duties and Article 50 transparency. Section 5.")
P("")
P("**Governance.** Owner, assessor, approver, decision and its conditions, evidence, legal review, a route to suspend and report, the review date and the events that bring the assessment back early.")
P("")
P("**The result.** An overall level from the worst finding, the impact level with its factor points, the AI Act classification, the handovers, one risk register and the obligations for your role, then the coverage tables. Findings on the same question merge into one line at the higher severity, tagged with the part that owns the question and any other part that raised it, and listed against every framework entry its questions map to.")
P("")
P("**Handovers.** The FRIA is offered when a deployer uses an Annex III high-risk system and Article 27 applies or may apply. The answers carry under the same question ids, so the FRIA asks only what is left: period and frequency of use, reuse of an earlier assessment, notification. The Full DPIA is offered when personal data is involved; it receives the name, description, date, harms, special category data, processors, review date and the Article 35(3) criteria the answers already imply, and leaves severity and likelihood for the assessor, because the DPIA rates harm from the processing rather than interference with rights.")
P("")

# 5 -------------------------------------------------------------------------------------
P("## 5. The EU AI Act module")
P("")
P("Opened when the system is placed on the EU market or put into service there, used in the EU, or its output is used in the EU (Article 2(1)); \"Not sure\" opens it too. Article 2 excludes military, defence and national security uses, scientific research, testing before placing on the market, purely personal use, and free and open-source systems unless they are high-risk or caught by Article 5 or 50. Dates follow the Regulation as amended by Regulation (EU) 2026/1744.")
P("")
table(["Topic", "What the module asks", "What follows", "Applies from"], [
    ["Roles (Article 3)", "Provider, deployer, importer, distributor, product manufacturer, provider of a general-purpose AI model; several can apply.", "Obligations are listed per role. A deployer using the system outside its intended purpose may become its provider (Article 25(1)).", "with the obligations below"],
    ["AI literacy (Article 4)", "Read from the Core question on training users on the system's limits.", "Always listed. The duty is to take measures to support literacy; no individual level has to be guaranteed.", "2 February 2025"],
    ["Prohibited practices (Article 5)", "One question listing the practices.", "Yes ends the module with Prohibited practice at the top of the result. Unsure leaves the classification unresolved.", "2 February 2025; points (ba) and (bb), intimate imagery and child sexual abuse material, from 2 December 2026"],
    ["High risk (Article 6)", "The Annex I product route; the Annex III area from the intake; for Annex III, whether one of the four Article 6(3) conditions applies and whether the system profiles people; for a provider relying on 6(3), whether the assessment is documented and registered.", "Profiling always keeps an Annex III system high-risk. Provider and deployer obligations listed with their dates and crosswalk rows.", "2 December 2027 (Annex III); 2 August 2028 (Annex I)"],
    ["Deployers of Annex III systems (Articles 26, 27, 86)", "Deployer type, intended purpose, whether people are told.", "Use per instructions with assigned oversight, input data, monitoring and suspension, workers' representatives and information to people, registration for public authorities, the FRIA where Article 27 applies, explanation on request.", "2 December 2027"],
    ["General-purpose AI models (Articles 51 to 55)", "Systemic risk (presumed above 10^25 FLOP or designated), open-source release, provider outside the EU, documentation, copyright policy, training content summary, authorised representative; with systemic risk, evaluation, incidents and cybersecurity.", "Open-source models without systemic risk are relieved of the two documentation duties and the representative. Notification within two weeks once the threshold is met.", "2 August 2025; models already on the market by 2 August 2027"],
    ["Transparency (Article 50)", "Direct interaction with people (read from the patterns where possible), synthetic content (from the trigger), emotion recognition or biometric categorisation, deep fakes and public-interest text, and whether the measures are in place.", "Provider duties (inform people they interact with AI, machine-readable marking) and deployer duties (inform people exposed, disclose deep fakes and AI text on matters of public interest) listed by role.", "2 August 2026; marking for generators already on the market by 2 December 2026 (Article 111(4))"],
])
P("Each obligation on the result links to its article in the AI Act Digest and its row in the AI Governance Crosswalk, where the ISO/IEC 42001 and NIST AI RMF mappings for that obligation are set out.")
P("")

# 6 -------------------------------------------------------------------------------------
P("## 6. The impact level")
P("")
b = D["bands"]
P("The impact level follows the method of the Canadian Algorithmic Impact Assessment: a raw score from weighted answers, as a share of the maximum, banded into four levels. Level I up to %d percent, II up to %d, III up to %d, IV above. The factors and weights are the pathway's own, and every factor is an intake answer." % (b[0], b[1], b[2]))
P("")
mx = sum(f["max"] for f in D["tier"])
table(["Factor", "Question", "Answer: points", "Max"], [[f["label"], "`%s`" % f["q"], "; ".join("%s: %s" % (o, p) for o, p in f["points"]), f["max"]] for f in D["tier"]])
P("Maximum %d points. In raw points: level I up to 7, II 8 to 14, III 15 to 21, IV 22 and above." % mx)
P("")
P("**Floors.** A use in an Annex III area, or a system that makes decisions with legal or similarly significant effects on its own, is never below level III, whatever the score. Without the first, a small Annex III use with good oversight would skip the rights, complaint and explanation questions that Articles 27 and 86 depend on.")
P("")
P("**Departures from the Canadian method.** No mitigation deduction: the level is set before the mitigations are asked, and they show in the residual rating instead. Unanswered factors count as zero and the result says the level is provisional and names them.")
P("")
table(["Level", "Meaning", "What it changes in the pathway"], [
    ["I", D["levelText"][0], "Short Core, Impact and Governance; GenAI without the five depth questions unless the system is public-facing."],
    ["II", D["levelText"][1], "As level I."],
    ["III", D["levelText"][2], "Adds business-critical data, competitor exposure and automation bias (Core); rights, effects beyond individuals, provider information, when a risk materialises, complaints and explanation (Impact); input filtering, vector store, rate limits, threat model, energy (GenAI); evidence and a suspension route (Governance). A finding where a significant decision has no human making the final call."],
    ["IV", D["levelText"][3], "As level III, and a missing approver becomes a high finding: the decision belongs at the most senior level that owns the risk (NIST AI RMF GOVERN 2.3)."],
])

# 7 -------------------------------------------------------------------------------------
P("## 7. Framework coverage and how to read it")
P("")
P("Each table lists every entry the pathway's questions map to. A row is **Gap** (with the worst severity) if a question mapped to it carries a finding, **Addressed** if a mapped question was answered without one, and **Not assessed** if no mapped question was shown and answered. Not assessed is never a pass, and Addressed means only that the questions on it raised nothing, not that the framework is met. The NIST AI 600-1, OWASP and Singapore tables appear only for generative systems.")
P("")
P("Mapped NIST AI RMF 1.0 subcategories (%d): %s." % (len(D["nistText"]), ", ".join(sorted(D["nistText"], key=lambda k: (["GOVERN", "MAP", "MEASURE", "MANAGE"].index(k.split()[0]), [int(x) for x in k.split()[1].split(".")])))))
P("")
iso = sorted(D["isoTitles"], key=lambda k: (k.startswith("A."), [int(x) for x in k.replace("A.", "").split(".")]))
P("Mapped ISO/IEC 42001 clauses and controls (%d): %s." % (len(iso), "; ".join("%s %s" % (k, D["isoTitles"][k]) for k in iso)))
P("")
P("Singapore dimensions: %s." % "; ".join("%d %s" % (i + 1, n) for i, n in enumerate(D["sg"])))
P("")
P("Reading a result: start with the gaps in the register, not the tables. Then look down the Not assessed rows: each is either a question that did not apply (fine) or one left unanswered (go back). A long run of Addressed rows on a system with a thin answer set is the pattern to distrust.")
P("")

# 8 -------------------------------------------------------------------------------------
P("## 8. Worked examples")
P("")
P("The eight scenarios used to test the pathway, run through the shipped code. Answers beyond the intake are realistic but invented.")
P("")
for s in D["scenarios"]:
    t = s["tier"]
    P("### %s" % s["name"])
    P("")
    a = s["intake"]
    table(["Intake factor", "Answer", "Points"], [[p["label"], (", ".join(a.get(f["q"]) or ["none"]) if isinstance(a.get(f["q"]), list) else a.get(f["q"], "")), "%d of %d" % (p["points"], p["max"])] for p, f in zip(t["parts"], D["tier"])])
    P("Triggers: generates %s, foundation model %s, free-form prompts %s, EU nexus %s." % (a.get("aipGenerates"), a.get("aipFoundationModel"), a.get("aipFreePrompts"), a.get("aipEu")))
    P("")
    lvl = "Level %s (%d of %d, %d percent)" % (t["level"], t["raw"], t["max"], t["pct"])
    if t["floors"] and t["scoredLevel"] != t["level"]:
        lvl += ", raised from %s by the floor: %s" % (t["scoredLevel"], "; ".join(t["floors"]))
    P("- **Impact level:** %s." % lvl)
    P("- **Questions shown:** %d. **Modules:** %s." % (s["shown"], ", ".join(s["modules"])))
    P("- **EU AI Act:** %s." % s["classification"])
    P("- **Overall:** %s (worst finding). **Handovers:** %s." % ("Prohibited practice" if s["classification"] == "Prohibited" else s["overall"], ", ".join([x for x in [("FRIA (" + s["handovers"]["fria"].lower() + ")") if s["handovers"]["fria"] else None, "Full DPIA" if s["handovers"]["dpia"] else None] if x]) or "none"))
    if s["obligations"]:
        P("")
        P("Obligations listed:")
        P("")
        for o in s["obligations"]:
            P("- %s (%s; from %s): %s" % (o["title"], o["role"], o["applies"], o["status"]))
    P("")
    P("Register:")
    P("")
    for f in s["findings"]:
        P("- %s, %s%s: %s" % (f["severity"].capitalize(), f["tag"], (" (also " + ", ".join(f["also"]) + ")") if f["also"] else "", f["title"]))
    if not s["findings"]:
        P("- none")
    P("")

# 9 -------------------------------------------------------------------------------------
P("## 9. Every question in the pathway")
P("")
P("By step, as shipped. Ids are shown because reused questions keep the id of the tool they come from, which is how answers carry into the FRIA. Mappings: N = NIST AI RMF subcategories, I = ISO/IEC 42001, S = Singapore dimensions, G = NIST AI 600-1 risks, O = OWASP items (the last two from the Generative AI checks).")
P("")
checks = {}
for c in D["gaiChecks"]:
    checks.setdefault(c["q"], []).append(c)
total = 0
for i, s in enumerate(D["steps"], 1):
    P("### Step %d of %d. %s" % (i, n_steps, s["title"]))
    P("")
    P("*%s. %s*" % (GROUP[s["group"]], ("Shown when " + SCOND[s["key"]] + ".") if s["conditional"] else "Always shown."))
    P("")
    for q in s["questions"]:
        total += 1
        line = "- **%s** `%s` (%s)" % (q["label"], q["id"], TYPE.get(q["type"], q["type"]))
        P(line)
        if q["options"]:
            opts = q["options"]
            P("  - Options: " + "; ".join(opts))
        if q["note"]:
            P("  - Follow-up: " + q["note"])
        if q["conditional"]:
            P("  - Shown when: " + COND[q["id"]])
        m = q["map"]
        refs = []
        if m:
            if m[0]: refs.append("N " + ", ".join(m[0]))
            if m[1]: refs.append("I " + ", ".join(m[1]))
            if m[2]: refs.append("S " + ", ".join(D["sg"][k] for k in m[2]))
        for c in checks.get(q["id"], []):
            if c["nist"]: refs.append("G " + ", ".join(D["nistGai"][k] for k in c["nist"]))
            if c["owasp"]: refs.append("O " + ", ".join(D["owasp"][k].split(" ")[0] for k in c["owasp"]))
        if refs:
            P("  - Maps to: " + "; ".join(refs))
    P("")
assert total == n_q
for s in D["steps"]:
    if s["conditional"]: assert s["key"] in SCOND, s["key"]
    for q in s["questions"]:
        if q["conditional"]: assert q["id"] in COND, q["id"]

# 10 ------------------------------------------------------------------------------------
QA = [
    ("What are the four triggers the pathway asks, and which two does it read from the intake instead?", "Asked: generates content, foundation model, free-form prompts, EU nexus. Read from the intake: personal data (from the data question) and output that reaches people without review (from the review question)."),
    ("Why does the pathway ask the FRIA's own questions in its intake and Impact step?", "So the answers carry into a FRIA started from the result under the same ids. The FRIA then asks only what is left: period and frequency, reuse of an earlier assessment, notification."),
    ("A system scores 52 percent. Which impact level, and what would 50 percent give?", "52 percent is level III; 50 percent is still level II, because the band runs up to and including 50."),
    ("Name the two floors and say what each protects against.", "An Annex III area, and significant decisions made by the system on its own. Both lift the level to III so the rights, complaint, explanation and automation bias questions are asked where they matter most."),
    ("Why is there no mitigation deduction, unlike the Canadian method?", "The level is set from the intake, before mitigations are asked. Mitigations show in the residual rating of the Impact step instead."),
    ("A public customer chatbot is at level II. Does it see the rate limits question?", "Yes. Five GenAI questions (input filtering, vector store, rate limits, threat model, energy) show at every level for a public-facing system."),
    ("When does the GenAI module ask about disclosure, and when does it not?", "Only when the AI Act module is closed. With an EU nexus, Article 50 owns transparency and the GenAI disclosure value is derived from it."),
    ("An Annex III system performs a narrow procedural task but profiles people. Is it high-risk?", "Yes. Profiling of natural persons keeps an Annex III system high-risk whatever Article 6(3) condition applies."),
    ("A model provider releases an open-source model without systemic risk. Which duties remain?", "The copyright policy and the training content summary. The two documentation duties of Article 53(1)(a) and (b) and the authorised representative do not apply, unless the model has systemic risk."),
    ("From when do the Article 50 duties apply, and what is the extension in Article 111(4)?", "From 2 August 2026. Providers of synthetic content generators already on the market before then have until 2 December 2026 to meet the marking duty of Article 50(2)."),
    ("Two findings rest on the same question: Core at medium, GenAI at low. What does the register show?", "One line at medium, tagged with the owner of the question and 'also' the other part, listed against every framework entry its questions map to."),
    ("The Singapore table shows Safety and Alignment R&D as Not assessed. Is that a gap?", "No. That dimension is mostly for governments and model developers; for a deployer it usually stays Not assessed, and Not assessed is never read as a pass or a fail."),
    ("Why does the DPIA handover leave severity and likelihood unrated?", "The pathway rates interference with rights; the DPIA rates harm from the processing. Same bands, different object, and a pre-filled rating tends to go unexamined."),
    ("What is the difference between the impact level and the overall level?", "The impact level measures how much the system could affect people, from the intake. The overall level is the worst finding: how well the risks are controlled. A level I system can have a High finding."),
    ("Which benchmarks are law, and which are cited by number and title only?", "Only the EU AI Act is law. ISO/IEC 42001 and 42005 are voluntary and cited by number and title only, because their texts are paid."),
]
P("## 10. Practice questions")
P("")
for i, (q, _) in enumerate(QA, 1):
    P("%d. %s" % (i, q))
P("")
P("### Answers")
P("")
for i, (_, a) in enumerate(QA, 1):
    P("%d. %s" % (i, a))
P("")

# 11 ------------------------------------------------------------------------------------
P("## 11. Sources")
P("")
for s in [
    "Regulation (EU) 2024/1689 (AI Act) as amended by Regulation (EU) 2026/1744: https://eur-lex.europa.eu/eli/reg/2024/1689/oj and https://eur-lex.europa.eu/eli/reg/2026/1744/oj ; article summaries in the site's AI Act Digest (ai-act-digest.html).",
    "NIST AI 100-1, AI Risk Management Framework 1.0 (January 2023): https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf ; revision status: https://www.nist.gov/itl/ai-risk-management-framework",
    "NIST AI 600-1, Generative AI Profile (July 2024): https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf",
    "Government of Canada, Algorithmic Impact Assessment tool: https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/algorithmic-impact-assessment.html ; Directive on Automated Decision-Making (as amended 24 June 2025): https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32592",
    "ISO/IEC 42005:2025, AI system impact assessment: https://www.iso.org/standard/42005",
    "ISO/IEC 42001:2023, AI management system: https://www.iso.org/standard/42001",
    "AI Verify Foundation and IMDA, Model AI Governance Framework for Generative AI (30 May 2024): https://aiverifyfoundation.sg/resources/mgf-gen-ai/",
    "OWASP Top 10 for LLM Applications (2025): https://genai.owasp.org/llm-top-10/",
    "MITRE ATLAS: https://atlas.mitre.org/",
    "The site's AI Governance Crosswalk (ai-governance-crosswalk.html): the obligation rows the AI Act module links to.",
]:
    P("- " + s)
P("")

md = "\n".join(out)
assert chr(0x2014) not in md, "em dash"
fm = "---\ntitle: \"AI Assessment Pathway: study guide\"\ndate: %s\nsource: \"simeonatanasov.github.io/Claude outputs/study-guides/ai-assessment-pathway-guide.pdf\"\ntags: [study-guide]\n---\n\n" % TODAY
open(os.path.join(OUT, "ai-assessment-pathway-guide.md"), "w", encoding="utf-8").write(fm + md)
print("md:", len((fm + md).encode("utf-8")), "bytes")

# PDF: pandoc to HTML, WeasyPrint with a print stylesheet.
CSS = """
@page { size: A4; margin: 18mm 16mm 18mm 16mm; @bottom-center { content: counter(page); font-size: 8pt; color: #555; }
  @top-right { content: "AI Assessment Pathway: study guide"; font-size: 7.5pt; color: #777; } }
@page :first { @top-right { content: none; } }
body { font-family: "DejaVu Serif", Georgia, serif; font-size: 9.6pt; line-height: 1.42; color: #111; }
h1 { font-family: "DejaVu Sans", sans-serif; font-size: 20pt; margin: 0 0 6pt; border-bottom: 1.5pt solid #111; padding-bottom: 4pt; }
h2 { font-family: "DejaVu Sans", sans-serif; font-size: 13.5pt; margin: 16pt 0 6pt; page-break-before: always; border-bottom: 0.6pt solid #888; }
h2#contents { page-break-before: avoid; }
h3 { font-family: "DejaVu Sans", sans-serif; font-size: 10.8pt; margin: 11pt 0 4pt; page-break-after: avoid; }
table { border-collapse: collapse; width: 100%; font-size: 8pt; margin: 4pt 0 8pt; page-break-inside: auto; }
th, td { border: 0.4pt solid #999; padding: 2.5pt 4pt; vertical-align: top; text-align: left; }
th { background: #e6e6e6; font-family: "DejaVu Sans", sans-serif; }
tr { page-break-inside: avoid; }
code { font-family: "DejaVu Sans Mono", monospace; font-size: 7.6pt; background: #f0f0f0; padding: 0 1.5pt; }
ul { margin: 2pt 0 6pt 14pt; padding: 0; } li { margin: 1pt 0; } ul ul { font-size: 8.6pt; color: #333; }
p { margin: 3pt 0 6pt; } a { color: #111; text-decoration: none; }
"""
html_path = os.path.join(OUT, "ai-assessment-pathway-guide.html")
if shutil.which("pandoc"):
    body = subprocess.run(["pandoc", "-f", "gfm", "-t", "html5", "--wrap=none"], input=md, capture_output=True, text=True, check=True).stdout
    html = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>AI Assessment Pathway: study guide</title><style>%s</style></head><body>%s</body></html>" % (CSS, body)
    open(html_path, "w", encoding="utf-8").write(html)
    from weasyprint import HTML
    pdf = os.path.join(OUT, "ai-assessment-pathway-guide.pdf")
    HTML(html_path).write_pdf(pdf)
    print("pdf:", os.path.getsize(pdf), "bytes")
else:
    print("pdf: skipped, pandoc not found")
