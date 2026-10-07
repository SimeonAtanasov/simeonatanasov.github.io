#!/usr/bin/env python3
"""
Builds the search index behind the site assistant (assets/assistant/).

Two stages, both offline:

  1. Chunks. Every digest entry, advice section, assessment tool explanation
     and question step, readiness activity, crosswalk row, enforcement section
     and country card, calculator section and site notice becomes one record
     with a deep link into the page it lives on. Written to work/chunks.json
     for inspection and to assets/assistant/index.json for the site.

  2. Vectors (experiment only, --embed). A static embedding table distilled
     from all-MiniLM-L6-v2 (the Model2Vec method). Measured on 7 October 2026
     and not shipped: see README.md for the numbers. The keyword ranker in
     assets/js/assistant.js, with query expansion, scored higher on its own.

Usage:
  python3 build_index.py --repo <repo root> [--out <dir>]

Needs: beautifulsoup4 and lxml, plus node on PATH (dump_js_data.js evaluates
the site's data scripts). The --embed experiment also needs numpy,
scikit-learn, onnxruntime, tokenizers and the model files in model/.
"""

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import time
import unicodedata
from datetime import date

from bs4 import BeautifulSoup

HERE = os.path.dirname(os.path.abspath(__file__))

# --------------------------------------------------------------------------
# Hand-written content: the tool catalogue and the site FAQ.
# Keep it company-agnostic; it ships on the site.
# --------------------------------------------------------------------------

TOOLS = [
    {
        "id": "privacy", "name": "Privacy Assessment", "url": "privacy-ai-assessment.html#tool-privacy",
        "what": "Screens a process or project end to end: what personal data, whose, for what purposes, on what lawful basis, with what retention, who it is shared with and where it goes.",
        "when": "Use it first for any new or changed activity that touches personal data. It is the front door to the other assessments.",
        "returns": "A risk level (Low, Medium, High or Not Applicable), a DPIA verdict (Required, Recommended or Not required), the Article 35(3) triggers selected and a factor list. Hands over to the Full DPIA when one is required.",
        "shape": "11 steps, 62 questions.",
    },
    {
        "id": "dpia", "name": "Full DPIA", "url": "privacy-ai-assessment.html#tool-dpia",
        "what": "A full data protection impact assessment under Article 35 GDPR: scope, necessity and proportionality, transparency and rights, systems and suppliers, three risk scenarios scored by severity and likelihood, mitigation and residual risk.",
        "when": "Use it when the Privacy Assessment says a DPIA is required, or when you already know the processing is high risk.",
        "returns": "A residual risk level per scenario and overall, with a conclusion on whether prior consultation with the supervisory authority is needed.",
        "shape": "11 steps.",
    },
    {
        "id": "lia", "name": "Legitimate Interest Test", "url": "privacy-ai-assessment.html#tool-lia",
        "what": "The three-part balancing test for Article 6(1)(f): purpose, necessity and the balance against the individual's interests, with safeguards.",
        "when": "Use it when legitimate interests is the lawful basis you intend to rely on, including for marketing, analytics or security processing.",
        "returns": "A conclusion on whether legitimate interests can be relied on, with the factors that drove it.",
        "shape": "8 steps.",
    },
    {
        "id": "ai", "name": "AI Risk Assessment", "url": "privacy-ai-assessment.html#tool-ai",
        "what": "Screens an AI system against the EU AI Act: inventory, regulatory screening (prohibited, high-risk, transparency, general-purpose AI), autonomy, data sourcing and governance.",
        "when": "Use it to classify one AI system under the AI Act and to see which obligations follow for your role.",
        "returns": "An AI Act classification, a risk level and the obligations that apply.",
        "shape": "6 steps.",
    },
    {
        "id": "incident", "name": "Incident & Breach Severity", "url": "privacy-ai-assessment.html#tool-incident",
        "what": "Scores a personal data breach with the ENISA severity method: data processing context, ease of identification and circumstances of the breach.",
        "when": "Use it after an incident, to decide whether to notify the supervisory authority within 72 hours and whether to tell the people affected.",
        "returns": "A severity level with the notification recommendation.",
        "shape": "Runs on a breach rather than a plan.",
    },
    {
        "id": "tpsa", "name": "Third-Party Security Assessment", "url": "privacy-ai-assessment.html#tool-tpsa",
        "what": "Assesses a vendor or supplier: the data at stake, the vendor's controls, certifications and contract terms, combined through a lookup table rather than a product so strong controls never erase a critical amount of data at stake.",
        "when": "Use it before onboarding a processor or any supplier that will hold or access personal data.",
        "returns": "An inherent and a residual risk level for the vendor with the gaps to close.",
        "shape": "Runs on a vendor rather than a process.",
    },
    {
        "id": "fria", "name": "Fundamental Rights Impact Assessment", "url": "privacy-ai-assessment.html#tool-fria",
        "what": "The assessment Article 27 of the AI Act requires from certain deployers of high-risk AI systems: the deployment context, the people affected, the risks to their rights, human oversight and the measures taken. It can start from a saved DPIA.",
        "when": "Use it when you deploy a high-risk AI system as a public body, a body providing public services, or for creditworthiness or life and health insurance pricing.",
        "returns": "A completed FRIA record with the risk picture and the measures, ready to notify the market surveillance authority.",
        "shape": "Added October 2026.",
    },
    {
        "id": "genai", "name": "Generative AI Risk Assessment", "url": "privacy-ai-assessment.html#tool-genai",
        "what": "Screens the risks specific to generative models: prompts and inputs, training data and intellectual property, outputs and accuracy, agency and supply chain, testing and monitoring. Gaps are mapped to NIST AI 600-1 and the OWASP Top 10 for LLM applications.",
        "when": "Use it for any system built on a large language model or other generative model, next to the AI Risk Assessment, which classifies the system under the AI Act.",
        "returns": "A risk level and a gap list mapped to NIST AI 600-1 and OWASP.",
        "shape": "Added October 2026.",
    },
    {
        "id": "tia", "name": "Transfer Impact Assessment", "url": "privacy-ai-assessment.html#tool-tia",
        "what": "The transfer impact assessment the EDPB's Recommendations 01/2020 describe for transfers resting on standard contractual clauses or another Article 46 tool: the transfer, the laws and practices of the destination, the supplementary measures, with a contract action per importer.",
        "when": "Use it when personal data goes to a country without an adequacy decision and the transfer relies on standard contractual clauses or binding corporate rules.",
        "returns": "A conclusion per importer on whether the transfer can proceed and what supplementary measures it needs.",
        "shape": "Added October 2026.",
    },
    {
        "id": "aipath", "name": "AI Assessment Pathway", "url": "privacy-ai-assessment.html#tool-aipath",
        "what": "One run for an AI system: a shared intake, an impact level from I to IV that decides how deep the rest goes, generative AI and EU AI Act modules that open only when they apply, and one register mapped to the NIST AI RMF, NIST AI 600-1, ISO/IEC 42001 and the Singapore framework for generative AI. It hands over to the FRIA and the Full DPIA rather than replacing them.",
        "when": "Use it when you want one assessment that covers an AI system end to end instead of running the AI tools one by one.",
        "returns": "An impact level, the applicable AI Act obligations with links, and a register of findings mapped to the frameworks.",
        "shape": "18 steps, added October 2026.",
    },
    {
        "id": "readiness", "name": "GDPR Readiness Assessment", "url": "gdpr-readiness.html",
        "what": "Measures demonstrable accountability. You record which of 71 privacy management activities you perform, in 13 categories, and the tool derives which GDPR Articles they evidence. 13 scope questions first remove what does not apply.",
        "when": "Use it to assess an organisation's privacy programme as a whole, rather than one process. Each activity has a Privacy Office question and an Operational Unit question, so it works for both views.",
        "returns": "An overall percentage, a score per category and per Article, and a gap list ordered worst first. Save, Load, Clear, Forget and an Excel export; everything stays in the browser.",
        "shape": "13 scope questions, 71 activities.",
    },
    {
        "id": "crosswalk", "name": "AI Governance Crosswalk", "url": "ai-governance-crosswalk.html",
        "what": "28 EU AI Act obligations by role, each mapped to ISO/IEC 42001 clauses and Annex A controls and to NIST AI RMF subcategories, with gaps marked, plus reverse views by ISO and by NIST.",
        "when": "Use it when you already run a management system or the NIST framework and want to see which AI Act obligations it covers and which it does not.",
        "returns": "A reference table with deep links per obligation. No state is kept.",
        "shape": "Reference page.",
    },
    {
        "id": "calculator", "name": "GDPR Fine Calculator", "url": "gdpr-fine-calculator.html",
        "what": "Estimates the fine exposure of an organisation from its sector, size and turnover, using what supervisory authorities have actually imposed on comparable organisations.",
        "when": "Use it to put a figure on exposure for a risk discussion or a budget, not to predict a specific case.",
        "returns": "An estimated range with the peer cases it rests on and the method explained step by step.",
        "shape": "Three sections: how to use it, your organisation, how the number is worked out.",
    },
    {
        "id": "enforcement", "name": "GDPR Enforcement in Europe", "url": "gdpr-enforcement.html",
        "what": "How enforcement actually runs in each European country: who fines, whether public bodies can be fined, whether an appeal suspends payment, which court hears the appeal, and how a complaint travels from filing to fine, with the CJEU judgments that shape it.",
        "when": "Use it to understand what happens after a complaint or a fine in a given country, or to compare countries.",
        "returns": "A map, a comparison table and a card per country.",
        "shape": "Reference page.",
    },
    {
        "id": "world", "name": "Privacy Enforcement Worldwide", "url": "privacy-enforcement-worldwide.html",
        "what": "The same enforcement questions for 23 jurisdictions outside Europe: the regulator, the law, who imposes penalties, the appeal route and private claims.",
        "when": "Use it when a process reaches people outside Europe and you need the local enforcement picture.",
        "returns": "A map, a comparison and a card per jurisdiction.",
        "shape": "Reference page.",
    },
    {
        "id": "analytics", "name": "GDPR Fines Analytics", "url": "gdpr-fines-analytics.html",
        "what": "Charts of GDPR fines over time, by country, by type of organisation and by the Articles breached, built from the same fines data as the calculator.",
        "when": "Use it to see enforcement trends before a risk discussion.",
        "returns": "Interactive charts with filters by year and type.",
        "shape": "Reference page.",
    },
    {
        "id": "dashboard", "name": "GDPR Fines Dashboard", "url": "power-bi.html",
        "what": "An embedded Power BI dashboard of GDPR fines in Europe.",
        "when": "Use it to explore the fines data visually. It loads from Microsoft only after you allow it in the cookie banner.",
        "returns": "An interactive dashboard.",
        "shape": "Embedded, consent gated.",
    },
    {
        "id": "riskmatrix", "name": "Interactive Risk Matrix", "url": "risk-matrix-original.html",
        "what": "A risk matrix over a library of privacy and security risks: rate likelihood and impact, add your own risks, keep notes.",
        "when": "Use it to record and rank risks for a project or a register.",
        "returns": "A plotted matrix and a saved list in the browser.",
        "shape": "Tool, state in the browser.",
    },
    {
        "id": "scanner", "name": "Cookie Banner Scanner", "url": "cookie-banner-scanner.html",
        "what": "Scans a website and reports which cookies and trackers are set before and after consent, and how the banner behaves.",
        "when": "Use it to check a site's cookie banner against the consent rules. The URL you scan is sent to the scanner service, so do not scan internal or staging addresses you cannot share.",
        "returns": "A report per URL.",
        "shape": "Front end for a scanner service.",
    },
    {
        "id": "edpb", "name": "EDPB Digest", "url": "edpb-digest.html",
        "what": "Every European Data Protection Board document with one takeaway each: guidelines, opinions, binding decisions, statements, letters and the consultation versions, with filters by type, year and topic.",
        "when": "Use it to find what the Board has said on a topic and to go straight to the source document.",
        "returns": "A filterable list with a link to each document.",
        "shape": "Reference page.",
    },
    {
        "id": "cookie", "name": "Cookie Compliance Digest", "url": "cookie-digest.html",
        "what": "Laws, guidance, court decisions, enforcement actions and standards on cookies and tracking across 66 jurisdictions, each with a written takeaway and a link to the source.",
        "when": "Use it to check the consent and tracking rules of a jurisdiction, or what a regulator has enforced.",
        "returns": "A filterable list by jurisdiction, type and year.",
        "shape": "Reference page.",
    },
    {
        "id": "aiact", "name": "AI Act Digest", "url": "ai-act-digest.html",
        "what": "The EU AI Act as amended by Regulation (EU) 2026/1744, article by article and annex by annex with a takeaway, the application dates, the roles bound and the amendment notes, plus the guidance and implementation documents around it, a high-level summary and an obligations checker.",
        "when": "Use it to read what an article requires, when it applies and whom it binds, or to find the Commission guidance on a topic.",
        "returns": "A filterable reference with deep links per article, annex and document.",
        "shape": "Reference page.",
    },
    {
        "id": "pp", "name": "Practical Privacy", "url": "practical-privacy.html",
        "what": "Practitioner guidance on the situations that come up inside an organisation: surveillance and monitoring, offboarding, mailbox access, meeting recordings, remote work, surveys, the talent lifecycle, rights requests, special-category data, consent, secondary use, external requests, AI and analytics, regulators, websites, breaches, records management and marketing.",
        "when": "Use it when you need a practical answer to an everyday privacy question, with the key actions and pitfalls.",
        "returns": "18 sections with why it matters, key actions and pitfalls.",
        "shape": "Reference page.",
    },
    {
        "id": "aiaadv", "name": "Practical AI Act Advice", "url": "practical-ai-act-advice.html",
        "what": "The EU AI Act as a practitioner needs it: scope and definitions, prohibited practices, high-risk systems, provider and deployer obligations, general-purpose AI, conformity assessment, governance and enforcement, building a governance programme, assessing AI risk, vetting vendors, AI literacy and copyright.",
        "when": "Use it to orient yourself before reading the Regulation itself.",
        "returns": "13 sections with what the law requires, key actions and pitfalls.",
        "shape": "Reference page.",
    },
]

FAQ = [
    {
        "id": "faq-device", "title": "Do my answers leave my device?",
        "text": "No. The assessment tools keep your answers, scores and exports in your browser's local storage and never send them to a server. This assistant also runs entirely in your browser: what you type is matched against an index downloaded with the page and is not transmitted anywhere. The only pages that contact another service are the Cookie Banner Scanner, which sends the URL you ask it to scan to the scanner service, and the GDPR Fines Dashboard, which loads from Microsoft only after you allow it in the cookie banner.",
        "url": "privacy-notice.html",
    },
    {
        "id": "faq-save", "title": "How do I save, export or restore an assessment?",
        "text": "Progress is kept in the browser automatically. In the Privacy & AI Assessment every finished assessment offers Download my answers as JSON or CSV, and the overview page has Restore from file so you can carry a saved assessment to another browser or device. The GDPR Readiness Assessment has Save, Load, Clear and Forget buttons and an Excel export. Clearing your browser data removes saved progress, so export anything you want to keep.",
        "url": "privacy-ai-assessment.html",
    },
    {
        "id": "faq-advice", "title": "Is this legal advice?",
        "text": "No. The site is practitioner reference material and self-assessment tooling, written to be organisation-agnostic. It is a starting point for your own analysis, not a substitute for it. If a specific obligation could change the outcome of a real decision, have that decision checked by counsel who knows your facts.",
        "url": "terms.html",
    },
    {
        "id": "faq-start", "title": "Which assessment should I start with?",
        "text": "For a process or project that uses personal data, start with the Privacy Assessment: it screens everything and hands over to the Full DPIA when one is required. If the lawful basis is legitimate interests, run the Legitimate Interest Test as well. For an AI system, the AI Assessment Pathway covers the system end to end and opens the generative AI and EU AI Act modules when they apply; the standalone AI Risk Assessment, Generative AI Risk Assessment and Fundamental Rights Impact Assessment remain for a narrower question. For a vendor, the Third-Party Security Assessment; for a transfer outside the EEA on standard contractual clauses, the Transfer Impact Assessment; after a breach, the Incident & Breach Severity tool; for the organisation as a whole, the GDPR Readiness Assessment.",
        "url": "privacy-ai-assessment.html",
    },
    {
        "id": "faq-sources", "title": "How are the digests kept accurate?",
        "text": "Every digest entry links to its source document. The takeaways were checked claim by claim against those documents in September 2026, with corrections applied; entries that rest on a secondary source, or whose source could not be fetched, are marked as such on the page. The AI Act Digest reflects the Regulation as amended by Regulation (EU) 2026/1744 and is the reference used for AI Act wording elsewhere on the site.",
        "url": "edpb-digest.html",
    },
    {
        "id": "faq-install", "title": "Can I install the site as an app or use it offline?",
        "text": "Yes. Where the browser supports it, an Install app entry appears in the menu. On an iPhone or iPad use Share, then Add to Home Screen. Pages you have opened are kept for offline use; the large digests are fetched again when you are online.",
        "url": "index.html",
    },
    {
        "id": "faq-cookies", "title": "How do I change my cookie choices?",
        "text": "Open Cookie settings in the footer of any page. The preference centre lists each category with the cookies it would set. Nothing from a third party loads until you allow its category; the embedded dashboard shows a placeholder until then.",
        "url": "cookie-notice.html",
    },
    {
        "id": "faq-assistant", "title": "What does this assistant search?",
        "text": "The three digests (EDPB, cookie compliance and AI Act), the two advice pages, the explanation and question bank of each assessment tool, the GDPR readiness activities, the AI governance crosswalk, the enforcement pages for Europe and the rest of the world, the fine calculator method and the site's own notices. It finds the passages that match your question by keyword and by meaning and links you to them; it does not write answers of its own. Nothing you type leaves your browser.",
        "url": "index.html",
    },
]

# Synonyms and abbreviations expanded on both sides (index and query).
# The expansion is appended, never substituted, so the original term still matches.
SYNONYMS = {
    "dpia": "data protection impact assessment",
    "pia": "privacy impact assessment",
    "lia": "legitimate interest assessment balancing test",
    "fria": "fundamental rights impact assessment",
    "tia": "transfer impact assessment",
    "gpai": "general purpose ai model",
    "llm": "large language model generative ai",
    "genai": "generative ai",
    "dpo": "data protection officer",
    "dpa": "data protection authority supervisory authority",
    "sa": "supervisory authority",
    "edpb": "european data protection board",
    "edps": "european data protection supervisor",
    "cjeu": "court of justice european union judgment",
    "ecj": "court of justice european union judgment",
    "scc": "standard contractual clauses",
    "sccs": "standard contractual clauses",
    "bcr": "binding corporate rules",
    "bcrs": "binding corporate rules",
    "dpf": "data privacy framework adequacy",
    "eprivacy": "e-privacy directive cookies",
    "cmp": "consent management platform cookie banner",
    "pii": "personal data",
    "pet": "privacy enhancing technology",
    "pets": "privacy enhancing technologies",
    "ropa": "record of processing activities article 30",
    "dsar": "data subject access request right of access",
    "dsr": "data subject request rights",
    "adm": "automated decision making profiling",
    "nis2": "network and information security directive",
    "dsa": "digital services act",
    "dma": "digital markets act",
    "gdpr": "general data protection regulation",
    "aia": "ai act artificial intelligence act",
    "nist": "nist ai risk management framework",
    "iso": "iso iec 42001 management system",
    "owasp": "owasp llm top 10",
    "enisa": "enisa breach severity",
    "cnil": "france french regulator",
    "ico": "united kingdom uk regulator",
    "aepd": "spain spanish regulator",
    "garante": "italy italian regulator",
    "dpc": "ireland irish data protection commission",
    "ap": "netherlands dutch regulator autoriteit persoonsgegevens",
    "bfdi": "germany german federal regulator",
    "dsk": "germany german datenschutzkonferenz",
    "ccpa": "california consumer privacy act united states",
    "cpra": "california privacy rights act united states",
    "lgpd": "brazil brazilian data protection law",
    "pipl": "china personal information protection law",
    "pdpa": "personal data protection act",
    "popia": "south africa protection of personal information act",
    "hipaa": "united states health insurance portability act",
    "coppa": "united states children online privacy",
    "tracking": "trackers cookies pixels fingerprinting",
    "tracker": "trackers cookies pixels",
    "fine": "fines penalty sanction",
    "fines": "fine penalty sanction",
    "penalty": "fine fines sanction",
    "breach": "incident data breach notification",
    "vendor": "supplier processor third party",
    "supplier": "vendor processor third party",
    "processor": "vendor supplier third party",
    "chatbot": "generative ai assistant llm",
    "children": "child minors age",
    "minors": "children child age",
    "employee": "employees staff workers hr workplace",
    "employees": "employee staff workers hr workplace",
    "staff": "employees workers hr workplace",
    "monitoring": "surveillance tracking cctv",
    "surveillance": "monitoring cctv cameras",
    "deepfake": "deep fake synthetic content article 50",
    "deepfakes": "deep fake synthetic content article 50",
    "watermark": "marking synthetic content article 50",
    "transfer": "transfers international third country",
    "transfers": "transfer international third country",
    "adequacy": "adequacy decision transfer third country",
    "consent": "consent banner opt in",
    "reject": "refuse decline reject all",
    "optout": "opt out",
    "retention": "retention storage period delete",
    "erasure": "deletion delete right to be forgotten",
    "sanction": "fine penalty",
    "turnover": "revenue annual turnover fine calculation",
    "revenue": "turnover annual turnover fine calculation",
    "appeal": "appeal court review",
    "calculated": "scoring score worked out method",
    "calculate": "scoring score worked out method",
    "calculation": "scoring score worked out method",
    "scoring": "calculated worked out",
    "fined": "fine fines penalty exposure calculator",
    "company": "organisation organization",
    "business": "organisation organization company",
    "firm": "organisation organization company",
    "label": "mark marking disclose transparency",
    "labelling": "mark marking disclose transparency",
    "labeling": "mark marking disclose transparency",
    "notify": "notification report inform",
    "report": "notify notification",
    "deadline": "within days time limit",
    "hours": "72 hours deadline notification",
    "camera": "cctv video surveillance monitoring",
    "cameras": "cctv video surveillance monitoring",
    "cctv": "video surveillance cameras monitoring",
    "recording": "record transcript meetings",
    "email": "e-mail mailbox electronic mail marketing",
    "emails": "e-mail mailbox electronic mail marketing",
    "newsletter": "marketing email direct marketing",
    "ad": "advertising adverts targeting",
    "ads": "advertising adverts targeting",
    "advert": "advertising targeting",
    "profiling": "profile automated decision targeting",
    "kid": "children child minors",
    "kids": "children child minors",
    "teen": "children minors age",
    "anonymisation": "anonymous pseudonymisation de-identification",
    "anonymization": "anonymous pseudonymisation de-identification",
    "pseudonymisation": "pseudonymous anonymisation",
    "encryption": "encrypt security technical measures",
    "mfa": "multi factor authentication security",
    "ransomware": "security incident breach malware",
    "phishing": "security incident breach",
    "hr": "human resources employees staff talent",
    "recruitment": "hiring candidates talent lifecycle job applications",
    "hiring": "recruitment candidates talent lifecycle job applications",
    "candidate": "recruitment hiring talent applicants",
    "candidates": "recruitment hiring talent applicants",
    "offboarding": "leaver leaving employee exit",
    "leaver": "offboarding leaving employee exit",
    "biometric": "biometrics fingerprint facial recognition special category",
    "biometrics": "biometric fingerprint facial recognition special category",
    "health": "medical special category",
    "medical": "health special category",
    "sensitive": "special category article 9",
    "lawful": "legal basis lawfulness article 6",
    "legal": "lawful basis",
    "basis": "lawful legal basis article 6",
    "purpose": "purposes purpose limitation",
    "repurpose": "secondary use new purpose compatibility",
    "reuse": "secondary use new purpose compatibility",
    "subcontractor": "sub-processor processor vendor",
    "cloud": "hosting provider processor transfer",
    "saas": "cloud provider processor vendor",
    "api": "general purpose model provider integration",
    "model": "ai model system",
    "robot": "ai system automated",
    "automation": "automated decision ai",
    "bias": "fairness discrimination",
    "fairness": "bias discrimination",
    "explainability": "transparency explanation human oversight",
    "oversight": "human oversight review",
    "sandbox": "regulatory sandbox innovation",
    "conformity": "conformity assessment ce marking",
    "ce": "ce marking conformity",
    "importer": "importers distributors supply chain",
    "distributor": "distributors importers supply chain",
    "deployer": "deployers user operator",
    "provider": "providers developer manufacturer",
    "worker": "workers employees staff",
    "workplace": "employees staff hr work",
    "union": "trade union special category",
    "whistleblowing": "whistleblower reporting",
    "cctv": "video surveillance cameras monitoring",
    "geolocation": "location tracking gps",
    "gps": "location tracking geolocation",
    "wifi": "tracking location mac address",
    "fingerprinting": "tracking device fingerprint",
    "pixel": "pixels trackers tracking",
    "pixels": "pixel trackers tracking",
    "tag": "tags trackers tag manager",
    "analytics": "measurement statistics audience",
    "statistics": "analytics measurement audience",
    "measurement": "analytics statistics audience",
    "exempt": "exemption strictly necessary",
    "exemption": "exempt strictly necessary",
    "banner": "cookie banner consent",
    "wall": "cookie wall consent or pay",
    "paywall": "cookie wall consent or pay",
    "withdraw": "withdrawal revoke consent",
    "revoke": "withdraw withdrawal consent",
    "age": "children minors age verification",
    "verification": "verify age check",
    "complaint": "complain complaints supervisory authority",
    "complain": "complaint complaints supervisory authority",
    "court": "courts judicial appeal",
    "judge": "court judicial",
    "lawsuit": "sue suing private claim court damages",
    "sue": "suing private claim court damages lawsuit",
    "damages": "compensation private claim court",
    "compensation": "damages private claim article 82",
    "class": "collective action representative action",
    "collective": "class action representative action",
    "injunction": "order corrective measure",
    "audit": "audits inspection investigation",
    "inspection": "audit investigation",
    "investigation": "audit inspection procedure",
    "procedure": "process procedural steps",
    "timeline": "deadline time limit duration",
    "statute": "law act legislation",
    "legislation": "law act statute",
    "regulation": "law regulation",
    "directive": "law directive",
    "omnibus": "regulation 2026/1744 amendment amended",
    "amendment": "omnibus amended 2026/1744",
    "amended": "omnibus amendment 2026/1744",
    "delay": "postponed application dates omnibus",
    "postponed": "delay application dates omnibus",
    "timeline": "application dates deadline",
    "literacy": "ai literacy training competence article 4",
    "training": "literacy competence awareness",
    "dataset": "data training data governance",
    "datasets": "data training data governance",
    "copyright": "intellectual property training data generative",
    "ip": "intellectual property copyright",
    "hallucination": "accuracy outputs generative",
    "hallucinations": "accuracy outputs generative",
    "prompt": "prompts inputs generative injection",
    "injection": "prompt injection inputs owasp",
    "jailbreak": "prompt injection security generative",
    "agent": "agentic agency autonomy",
    "agentic": "agency autonomy agent",
    "rag": "retrieval augmented generation internal assistant documents",
    "fine-tuning": "training model modification provider",
    "finetuning": "training model modification provider",
    "open": "open source open weights",
    "weights": "open weights model",
    "foundation": "general purpose model gpai",
    "frontier": "general purpose model systemic risk",
    "compute": "flop training compute systemic risk",
    "flop": "compute training compute systemic risk",
    "device": "browser local storage on device",
    "offline": "install app offline pwa",
    "app": "install app pwa",
    "export": "download excel csv json export",
    "download": "export excel csv json",
    "excel": "export xlsx download",
    "save": "saved progress restore local storage",
    "restore": "restore from file saved progress",
    "print": "pdf export print",
    "pdf": "study guide pdf download",
    "guide": "study guide explainer",
    "study": "study guide pack",
    "help": "how to use guide assistant",
    "start": "begin which assessment first",
    "begin": "start which assessment first",
    "choose": "which assessment pick select",
    "pick": "which assessment choose select",
    "difference": "compare versus differ between",
    "versus": "compare difference between",
    "vs": "versus compare difference between",
    "website": "site web page",
    "websites": "site web page",
    "site": "website web page",
    "page": "website site",
}

# --------------------------------------------------------------------------
# Text helpers
# --------------------------------------------------------------------------

EM_DASH = chr(0x2014)  # never written literally: the site bans the character


def clean(s):
    """Markdown and whitespace to plain text. En dashes stay; em dashes are
    reported by the caller and replaced with a colon-less hyphen."""
    if not s:
        return ""
    s = unicodedata.normalize("NFC", s)
    s = re.sub(r"\\\[(\d+)\\\]", "", s)           # study pack source refs \[3\]
    s = re.sub(r"\[(\d+)\]", "", s)               # [3]
    s = re.sub(r"\*\*(.+?)\*\*", r"\1", s)
    s = re.sub(r"(?<!\w)\*(.+?)\*(?!\w)", r"\1", s)
    s = re.sub(r"`([^`]*)`", r"\1", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)  # links
    s = re.sub(r"^\s*[-*]\s+", "", s, flags=re.M)   # bullets
    s = re.sub(r"^\s*\d+\.\s+", "", s, flags=re.M)  # numbered lists
    s = re.sub(r"^\s*#+\s*", "", s, flags=re.M)     # stray headings
    s = re.sub(r"^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$", "", s, flags=re.M)  # table rules
    s = s.replace("|", " ")
    s = s.replace(" ", " ")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\s*\n\s*\n\s*", "\n", s)
    s = re.sub(r" ?\n ?", " ", s)
    return s.strip()


def split_text(text, cap=1500, minimum=300):
    """Split at sentence boundaries into pieces of at most `cap` characters."""
    text = text.strip()
    if len(text) <= cap:
        return [text]
    sentences = re.split(r"(?<=[.!?])\s+(?=[A-Z0-9(\"'])", text)
    units = []
    for s in sentences:
        while len(s) > cap:
            # no sentence boundary in reach: cut at the last clause or word boundary
            cut = max(s.rfind("; ", 0, cap), s.rfind(", ", 0, cap), s.rfind(" ", 0, cap))
            if cut < minimum:
                cut = cap
            units.append(s[:cut + 1].strip())
            s = s[cut + 1:].strip()
        if s:
            units.append(s)
    pieces, cur = [], ""
    for s in units:
        if cur and len(cur) + 1 + len(s) > cap:
            pieces.append(cur)
            cur = s
        else:
            cur = (cur + " " + s).strip()
    if cur:
        if pieces and len(cur) < minimum:
            pieces[-1] = pieces[-1] + " " + cur
        else:
            pieces.append(cur)
    return pieces


class Chunks:
    def __init__(self):
        self.items = []
        self.ids = set()
        self.em_dashes = 0

    def add(self, cid, kind, page, title, url, text, meta=""):
        text = clean(text)
        title = clean(title)
        if len(text) > 1700:
            self.add_split(cid, kind, page, title, url, text, meta, cap=1500)
            return
        self._store(cid, kind, page, title, url, text, meta)

    def _store(self, cid, kind, page, title, url, text, meta=""):
        if EM_DASH in text or EM_DASH in title:
            self.em_dashes += text.count(EM_DASH) + title.count(EM_DASH)
            text = text.replace(EM_DASH, "-")
            title = title.replace(EM_DASH, "-")
        if not text:
            return
        if cid in self.ids:
            raise ValueError("duplicate chunk id " + cid)
        self.ids.add(cid)
        self.items.append({"id": cid, "k": kind, "p": page, "t": title, "u": url, "x": text, "m": clean(meta)})

    def add_split(self, cid, kind, page, title, url, text, meta="", cap=1500):
        parts = split_text(clean(text), cap=cap)
        if len(parts) == 1:
            self._add_one(cid, kind, page, title, url, parts[0], meta)
            return
        for i, part in enumerate(parts, 1):
            self._add_one("%s-%d" % (cid, i), kind, page, "%s (%d/%d)" % (title, i, len(parts)), url, part, meta)

    def _add_one(self, cid, kind, page, title, url, text, meta=""):
        text = clean(text)
        title = clean(title)
        self._store(cid, kind, page, title, url, text, meta)


# --------------------------------------------------------------------------
# Sources
# --------------------------------------------------------------------------

def read(repo, rel):
    with open(os.path.join(repo, rel), encoding="utf-8") as f:
        return f.read()


def soup(repo, rel):
    return BeautifulSoup(read(repo, rel), "lxml")


def edpb(repo, out):
    data = json.loads(read(repo, "Claude outputs/edpb-digest-build/digest.json"))
    by_url = {}
    for e in data:
        by_url.setdefault(e.get("url"), e)
    page = soup(repo, "edpb-digest.html")
    n = 0
    for art in page.select("article.ed-entry[id]"):
        cid = art["id"]
        a = art.select_one(".ed-title a")
        title = a.get_text(" ", strip=True) if a else art.select_one(".ed-title").get_text(" ", strip=True)
        href = a["href"] if a else ""
        date_el = art.select_one(".ed-date")
        d = date_el.get_text(strip=True) if date_el else ""
        take = art.select_one(".ed-take")
        take = take.get_text(" ", strip=True) if take else ""
        j = by_url.get(href, {})
        typ = j.get("type", "")
        where = j.get("where", "")
        status = j.get("status", "")
        topics = ", ".join(j.get("topics", []) or [])
        meta = " · ".join(x for x in [typ, d] if x)
        text = take
        extra = []
        if where:
            extra.append(where)
        if topics:
            extra.append("Topics: " + topics)
        if status and status != "current":
            extra.append("Status: " + status)
        if extra:
            text = text + " " + " ".join(extra)
        out.add_split(cid, "edpb", "EDPB Digest", title, "edpb-digest.html#" + cid, text, meta)
        n += 1
    return n


def cookie(repo, out):
    data = json.loads(read(repo, "Claude outputs/cookie-digest-build/cookie_digest.json"))
    by_url = {}
    for e in data:
        by_url.setdefault(e.get("url"), e)
    page = soup(repo, "cookie-digest.html")
    n = 0
    for art in page.select("article.ck-entry[id]"):
        cid = art["id"]
        a = art.select_one(".ck-title a")
        title = a.get_text(" ", strip=True) if a else art.select_one(".ck-title").get_text(" ", strip=True)
        href = a["href"] if a else ""
        j = by_url.get(href, {})
        jur = art.get("data-jur") or j.get("jurisdiction", "")
        typ = art.get("data-type") or j.get("type", "")
        status = art.get("data-status") or j.get("status", "")
        date_el = art.select_one(".ck-date")
        d = date_el.get_text(strip=True) if date_el else j.get("date", "")
        take = art.select_one(".ck-take")
        take = take.get_text(" ", strip=True) if take else j.get("takeaway", "")
        topics = ", ".join(j.get("topics", []) or [])
        meta = " · ".join(x for x in [jur, typ, d] if x)
        text = "%s. %s" % (jur, take) if jur else take
        if topics:
            text += " Topics: " + topics + "."
        if status and status not in ("in force", "current"):
            text += " Status: " + status + "."
        out.add_split(cid, "cookie", "Cookie Digest", title, "cookie-digest.html#" + cid, text, meta)
        n += 1
    return n


def ai_act(repo, out):
    data = json.loads(read(repo, "Claude outputs/ai-act-digest-build/ai_act_digest.json"))
    html = read(repo, "ai-act-digest.html")
    ids = set(re.findall(r'id="([^"]+)"', html))
    n = 0
    for e in data["regulation"]:
        cid = e["id"]
        url = "ai-act-digest.html#" + (cid if cid in ids else "")
        title = "%s: %s" % (e.get("number", cid), e.get("title", ""))
        binds = ", ".join(e.get("binds", []) or [])
        meta = " · ".join(x for x in [e.get("chap_label", e.get("chapter", "")), "applies from " + e["applies_from"] if e.get("applies_from") else ""] if x)
        text = e.get("takeaway", "")
        if binds:
            text += " Binds: " + binds + "."
        if e.get("applies_from"):
            text += " Applies from " + e["applies_from"] + "."
        out.add_split("aia-" + cid, "aia", "AI Act Digest", title, url, text, meta)
        om = e.get("omnibus")
        if om and len(om) > 40:
            out.add_split("aia-" + cid + "-omnibus", "aia", "AI Act Digest", title + " (amended by Regulation 2026/1744)", url, om, meta)
        n += 1
    for e in data["corpus"]:
        cid = e["id"]
        url = "ai-act-digest.html#" + (cid if cid in ids else "")
        meta = " · ".join(x for x in [e.get("issuer", ""), e.get("type", ""), e.get("date", "")] if x)
        text = e.get("takeaway", "")
        arts = ", ".join(e.get("articles", []) or [])
        if arts:
            text += " Covers: " + arts + "."
        if e.get("status") and e["status"] not in ("in force", "current"):
            text += " Status: " + e["status"] + "."
        out.add_split("aia-" + cid, "aiadoc", "AI Act Digest", e["title"], url, text, meta)
        n += 1
    return n


def advice(repo, out):
    data = json.loads(read(repo, "Claude outputs/study-pack-build/pages.json"))
    n = 0
    for key, kind, page, pagefile in [("practical_privacy", "pp", "Practical Privacy", "practical-privacy.html"),
                                      ("ai_act", "aiaadv", "AI Act Advice", "practical-ai-act-advice.html")]:
        sec = data[key]
        for item in sec["items"]:
            title = "%s. %s" % (item["num"], item["title"])
            url = pagefile + "#" + item["id"]
            # group blocks into pieces of about 1400 characters at block boundaries
            pieces, cur = [], ""
            for b in item["blocks"]:
                b = clean(b)
                if not b:
                    continue
                if cur and len(cur) + len(b) > 1400:
                    pieces.append(cur)
                    cur = b
                else:
                    cur = (cur + " " + b).strip()
            if cur:
                pieces.append(cur)
            if len(pieces) == 1:
                out.add(kind + "-" + item["id"], kind, page, title, url, pieces[0])
            else:
                for i, p in enumerate(pieces, 1):
                    out.add("%s-%s-%d" % (kind, item["id"], i), kind, page, "%s (%d/%d)" % (title, i, len(pieces)), url, p)
            n += 1
    return n


TOOL_ANCHORS = {
    "Privacy Assessment": "privacy", "Full DPIA": "dpia", "Legitimate Interest Test": "lia",
    "AI Risk Assessment": "ai", "Incident & Breach Severity": "incident",
    "Third-Party Security Assessment": "tpsa", "Fundamental Rights Impact Assessment": "fria",
    "Generative AI Risk Assessment": "genai", "Transfer Impact Assessment": "tia",
    "AI Assessment Pathway": "aipath",
}


def md_lines_between(text, start_re, end_re):
    lines = text.split("\n")
    s = next(i for i, l in enumerate(lines) if re.match(start_re, l))
    e = next((i for i, l in enumerate(lines) if i > s and re.match(end_re, l)), len(lines))
    return lines[s:e]


def sections(lines, level_re=r"^(#{1,4})\s+(.*)$"):
    """Yield (level, heading, body) in order."""
    cur_level, cur_head, body = 0, "", []
    for l in lines:
        m = re.match(level_re, l)
        if m:
            if cur_head or body:
                yield cur_level, cur_head, "\n".join(body)
            cur_level, cur_head, body = len(m.group(1)), m.group(2).strip(), []
        else:
            body.append(l)
    if cur_head or body:
        yield cur_level, cur_head, "\n".join(body)


def study_pack_tools(repo, out):
    md = read(repo, "Claude outputs/study-guides/privacy-ai-act-assessments-study-pack-v2.md")
    lines = md_lines_between(md, r"^# The Assessment Suite\s*$", r"^# The GDPR Readiness Model\s*$")
    tool = None
    anchor = ""
    n = 0
    intro_added = False
    for level, head, body in sections(lines):
        body_c = clean(body)
        if level == 1 and head == "The Assessment Suite":
            out.add_split("tools-suite", "tool", "Privacy & AI Assessment", "How the ten assessment tools fit together",
                          "privacy-ai-assessment.html", body_c)
            continue
        if level == 1:
            tool = head
            anchor = TOOL_ANCHORS.get(head)
            if not anchor:
                raise ValueError("unknown tool heading " + head)
            url = "privacy-ai-assessment.html#tool-" + anchor
            out.add_split("tool-%s-about" % anchor, "tool", "Privacy & AI Assessment", tool + ": what it is for", url, body_c)
            n += 1
            continue
        if tool is None:
            continue
        url = "privacy-ai-assessment.html#tool-" + anchor
        if head == "How the scoring works":
            out.add_split("tool-%s-scoring" % anchor, "tool", "Privacy & AI Assessment", tool + ": how the scoring works", url, body_c)
        elif head == "Where people get it wrong":
            out.add_split("tool-%s-pitfalls" % anchor, "tool", "Privacy & AI Assessment", tool + ": where people get it wrong", url, body_c)
        elif re.match(r"^Step \d+ of \d+", head):
            step = re.sub(r"\s*·\s*", ": ", head)
            step_id = re.sub(r"[^a-z0-9]+", "-", head.lower()).strip("-")
            out.add_split("tool-%s-%s" % (anchor, step_id), "toolstep", "Privacy & AI Assessment",
                          "%s, %s" % (tool, step), url, body_c, meta="Question bank")
        elif head.startswith("The question bank") or "self-test" in head.lower():
            continue
        else:
            # other level 3/4 sections: ENISA scales, worked tables, etc.
            if len(body_c) > 80:
                sid = re.sub(r"[^a-z0-9]+", "-", head.lower()).strip("-")
                out.add_split("tool-%s-%s" % (anchor, sid), "tool", "Privacy & AI Assessment", "%s: %s" % (tool, head), url, body_c)
    return n


def study_pack_readiness(repo, out):
    md = read(repo, "Claude outputs/study-guides/privacy-ai-act-assessments-study-pack-v2.md")
    lines = md_lines_between(md, r"^# The GDPR Readiness Model\s*$", r"^# The 71 activities\s*$")
    url = "gdpr-readiness.html#ra-how"
    for level, head, body in sections(lines):
        body_c = clean(body)
        if not body_c or len(body_c) < 60:
            continue
        sid = re.sub(r"[^a-z0-9]+", "-", head.lower()).strip("-")
        title = "GDPR Readiness: " + head.replace("The method", "the method")
        if head == "The GDPR Readiness Model":
            title = "GDPR Readiness Assessment: the model"
        out.add_split("readiness-" + sid, "readiness", "GDPR Readiness", title, url, body_c)


def readiness_activities(repo, out, work):
    data = json.load(open(os.path.join(work, "readiness.json"), encoding="utf-8"))
    titles = {int(k): v for k, v in data["ARTICLE_TITLES"].items()}
    conds = {c["id"]: c["text"] for c in data["CONDITIONS"]}
    cats = data["CATEGORIES"]
    for a in data["ACTIVITIES"]:
        cat = cats[a["cat"]]
        arts = ", ".join("Article %d (%s)" % (x, titles.get(x, "")) for x in a.get("articles", []))
        text = "%s. Category: %s. Privacy Office question: %s" % (a["activity"], cat, a.get("po", ""))
        if a.get("ou"):
            text += " Operational Unit question: %s" % a["ou"]
        if arts:
            text += " Evidences %s." % arts
        if a.get("cond"):
            text += " Only in scope if: %s" % conds.get(a["cond"], a["cond"])
        out.add("readiness-act-" + a["id"].lower(), "readiness", "GDPR Readiness", "%s %s" % (a["id"], a["activity"]),
                "gdpr-readiness.html#ra-step-2", text, meta=cat)
    return len(data["ACTIVITIES"])


def crosswalk(repo, out, work):
    data = json.load(open(os.path.join(work, "crosswalk.json"), encoding="utf-8"))
    roles = data.get("roles", {})
    themes = {t["id"]: t["label"] for t in data.get("themes", [])}
    for r in data["rows"]:
        arts = "; ".join("%s %s" % (a.get("label", ""), a.get("title", "")) for a in r.get("aia", []))
        role = roles.get(r.get("role", ""), r.get("role", ""))
        text = "%s (%s). %s" % (arts, role, r.get("obligation", ""))
        if r.get("iso"):
            text += " ISO/IEC 42001: %s." % ", ".join(r["iso"])
        if r.get("nist"):
            text += " NIST AI RMF: %s." % ", ".join(r["nist"])
        if r.get("note"):
            text += " " + r["note"]
        if r.get("gap"):
            text += " Gap: " + r["gap"]
        if r.get("applies"):
            text += " Applies from %s." % r["applies"]
        title = "AI Act obligation %s: %s" % (r["id"][1:].lstrip("0"), arts.split(";")[0])
        out.add_split("cw-" + r["id"], "crosswalk", "AI Governance Crosswalk", title,
                      "ai-governance-crosswalk.html#cw-" + r["id"], text, meta=themes.get(r.get("theme", ""), ""))
    return len(data["rows"])


def enforcement(repo, out, rel, kind, page_label):
    page = soup(repo, rel)
    main = page.find(id="main") or page
    n = 0
    for sec in main.select("section.ge-block[id]"):
        sid = sec["id"]
        if sid in ("ge-countries", "ge-map"):
            continue
        h = sec.find(["h2", "h3"])
        head = h.get_text(" ", strip=True) if h else sid
        parts = []
        for el in sec.find_all(["p", "li", "th", "td", "h3", "h4"]):
            if el.find_parent("details"):
                continue
            t = el.get_text(" ", strip=True)
            if t:
                parts.append(t)
        text = " ".join(parts)
        if len(text) < 80:
            continue
        out.add_split("%s-%s" % (kind, sid), kind, page_label, head, rel + "#" + sid, text, cap=1600)
        n += 1
    for d in main.select("details.ge-country[id]"):
        cid = d["id"]
        name = d.select_one(".ge-cname")
        name = name.get_text(strip=True) if name else cid
        abbr = d.select_one(".ge-cabbr")
        abbr = abbr.get_text(strip=True) if abbr else ""
        mem = d.select_one(".ge-cmem")
        mem = mem.get_text(strip=True) if mem else ""
        body = d.select_one(".ge-cbody") or d
        plain = body.select_one(".ge-plain p")
        plain = plain.get_text(" ", strip=True) if plain else ""
        out.add_split("%s-%s-plain" % (kind, cid), kind, page_label, name + ": enforcement in plain words",
                      rel + "#" + cid, "%s (%s). %s" % (name, abbr, plain) if abbr else "%s. %s" % (name, plain), meta=mem)
        # the rest: one chunk per h4 block, small blocks merged into the next
        blocks, cur_head, cur = [], "", []
        for el in body.find_all(["h4", "p", "li", "dt", "dd"]):
            if el.find_parent(class_="ge-plain"):
                continue
            if el.name == "h4":
                if cur:
                    blocks.append((cur_head, " ".join(cur)))
                cur_head, cur = el.get_text(" ", strip=True), []
            else:
                t = el.get_text(" ", strip=True)
                if t:
                    cur.append(t)
        if cur:
            blocks.append((cur_head, " ".join(cur)))
        merged = []
        for h, t in blocks:
            if merged and len(merged[-1][1]) < 220:
                ph, pt = merged[-1]
                merged[-1] = (ph + " and " + h.lower() if h else ph, pt + " " + (h + ": " if h else "") + t)
            else:
                merged.append((h, t))
        for h, t in merged:
            if len(t) < 60:
                continue
            hid = re.sub(r"[^a-z0-9]+", "-", h.lower()).strip("-")[:40] or "detail"
            out.add_split("%s-%s-%s" % (kind, cid, hid), kind, page_label, "%s: %s" % (name, h.lower() if h else "details"),
                          rel + "#" + cid, "%s. %s: %s" % (name, h, t) if h else name + ". " + t, meta=mem, cap=1500)
        n += 1
    return n


def md_guide(repo, out, rel, kind, page_label, url, prefix, skip_heads=(), min_level=2, title_prefix=""):
    md = read(repo, rel)
    n = 0
    for level, head, body in sections(md.split("\n")):
        if level < min_level and n > 0:
            pass
        body_c = clean(body)
        if not head or len(body_c) < 80:
            continue
        if any(re.match(s, head) for s in skip_heads):
            continue
        sid = re.sub(r"[^a-z0-9]+", "-", head.lower()).strip("-")[:60]
        out.add_split("%s-%s" % (prefix, sid), kind, page_label, title_prefix + head, url, body_c)
        n += 1
    return n


def notices(repo, out):
    n = 0
    for rel, kind, label in [("cookie-notice.html", "notice", "Cookie notice"), ("privacy-notice.html", "notice", "Privacy notice")]:
        page = soup(repo, rel)
        main = page.find(id="main") or page
        cur_head, cur_id, cur = "", "", []
        blocks = []
        for el in main.find_all(["h2", "h3", "p", "li", "summary", "dt", "dd", "td", "th"]):
            if el.name in ("h2", "h3"):
                if cur:
                    blocks.append((cur_head, cur_id, " ".join(cur)))
                cur_head, cur = el.get_text(" ", strip=True), []
                cur_id = el.get("id") or (el.find_parent(id=True).get("id") if el.find_parent(id=True) and el.find_parent(id=True).get("id") not in ("main", "wrapper") else "")
            else:
                t = el.get_text(" ", strip=True)
                if t:
                    cur.append(t)
        if cur:
            blocks.append((cur_head, cur_id, " ".join(cur)))
        for i, (h, hid, t) in enumerate(blocks):
            if len(t) < 60 or not h:
                continue
            sid = re.sub(r"[^a-z0-9]+", "-", h.lower()).strip("-")[:50]
            out.add_split("%s-%s" % (rel.split(".")[0], sid), kind, label, "%s: %s" % (label, h), rel + ("#" + hid if hid else ""), t)
            n += 1
    return n


def catalogue(out):
    for t in TOOLS:
        text = "%s %s %s" % (t["what"], t["when"], t["returns"])
        if t.get("shape"):
            text += " " + t["shape"]
        out.add("tool-cat-" + t["id"], "page", "Tools and pages", t["name"], t["url"], text)
    for f in FAQ:
        out.add(f["id"], "faq", "About this site", f["title"], f["url"], f["text"])


# --------------------------------------------------------------------------
# Embeddings
# --------------------------------------------------------------------------

def embed_all(chunks, model_dir, dims, workdir, out_dir):
    import numpy as np
    import onnxruntime as ort
    from tokenizers import Tokenizer
    from sklearn.decomposition import PCA

    tok = Tokenizer.from_file(os.path.join(model_dir, "tokenizer.json"))
    sess = ort.InferenceSession(os.path.join(model_dir, "model.onnx"), providers=["CPUExecutionProvider"])
    vocab = tok.get_vocab()
    inv = [None] * len(vocab)
    for t, i in vocab.items():
        inv[i] = t

    # 1. Which tokens to keep: ASCII wordpieces only. The tokenizer lowercases
    #    and strips accents, so nothing else can occur in an encoded query.
    keep = []
    for i, t in enumerate(inv):
        core = t[2:] if t.startswith("##") else t
        if t.startswith("[") and t.endswith("]"):
            continue
        if not core or any(ord(c) > 126 or ord(c) < 33 for c in core):
            continue
        keep.append(i)
    print("vocab kept: %d of %d" % (len(keep), len(inv)))

    # 2. Pass every kept token through the full model on its own.
    def run(ids_batch):
        ids = np.array(ids_batch, dtype=np.int64)
        mask = np.ones_like(ids)
        out = sess.run(None, {"input_ids": ids, "attention_mask": mask, "token_type_ids": np.zeros_like(ids)})[0]
        return out.mean(axis=1)

    cls_id, sep_id = vocab["[CLS]"], vocab["[SEP]"]
    tokvecs = np.zeros((len(keep), 384), dtype=np.float32)
    t0 = time.time()
    B = 512
    for s in range(0, len(keep), B):
        batch = [[cls_id, i, sep_id] for i in keep[s:s + B]]
        tokvecs[s:s + len(batch)] = run(batch)
    print("token pass: %.1fs" % (time.time() - t0))

    # 3. PCA, then rank weighting (later tokens in the vocabulary are rarer).
    pca = PCA(n_components=dims, random_state=0)
    red = pca.fit_transform(tokvecs).astype(np.float32)
    ranks = np.array(keep, dtype=np.float32)
    weights = np.log1p(ranks)
    red = red * weights[:, None]
    print("pca explained: %.3f" % pca.explained_variance_ratio_.sum())

    # 4. Encode every chunk as the mean of its (weighted) token vectors.
    kept_index = {tid: j for j, tid in enumerate(keep)}
    tok.no_truncation()
    tok.no_padding()

    def encode_static(text):
        ids = tok.encode(text, add_special_tokens=False).ids
        rows = [kept_index[i] for i in ids if i in kept_index]
        if not rows:
            return np.zeros(dims, dtype=np.float32)
        v = red[rows].mean(axis=0)
        n = np.linalg.norm(v)
        return v / n if n > 0 else v

    docvecs = np.stack([encode_static(c["t"] + ". " + c["x"]) for c in chunks])
    print("doc vectors:", docvecs.shape)

    # 5. Quantise to int8 with one scale per table.
    def quant(m):
        scale = float(np.abs(m).max()) / 127.0
        q = np.clip(np.round(m / scale), -127, 127).astype(np.int8)
        return q, scale

    tq, tscale = quant(red)
    dq, dscale = quant(docvecs)
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "tokens.bin"), "wb") as f:
        f.write(tq.tobytes())
    with open(os.path.join(out_dir, "vectors.bin"), "wb") as f:
        f.write(dq.tobytes())
    meta = {
        "dims": dims,
        "tokens": [inv[i] for i in keep],
        "tokenScale": tscale,
        "vectorScale": dscale,
        "count": len(chunks),
        "model": "all-MiniLM-L6-v2, distilled to a static table (PCA %d, rank weighted)" % dims,
    }
    with open(os.path.join(out_dir, "tokens.json"), "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, separators=(",", ":"))
    # keep the float versions for evaluation
    np.save(os.path.join(workdir, "tokvecs_full.npy"), tokvecs)
    np.save(os.path.join(workdir, "tokvecs_static.npy"), red)
    np.save(os.path.join(workdir, "docvecs_static.npy"), docvecs)
    json.dump(keep, open(os.path.join(workdir, "keep.json"), "w"))
    return meta


# --------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True)
    ap.add_argument("--out", default=None, help="defaults to <repo>/assets/assistant")
    ap.add_argument("--model", default=os.path.join(HERE, "model"))
    ap.add_argument("--work", default=os.path.join(HERE, "work"))
    ap.add_argument("--dims", type=int, default=256)
    ap.add_argument("--embed", action="store_true", help="also distil the static vector tables (experiment, not shipped)")
    args = ap.parse_args()
    repo = args.repo
    out_dir = args.out or os.path.join(repo, "assets", "assistant")
    os.makedirs(args.work, exist_ok=True)

    subprocess.check_call(["node", os.path.join(HERE, "dump_js_data.js"), repo, args.work])

    out = Chunks()
    counts = {}
    counts["edpb"] = edpb(repo, out)
    counts["cookie"] = cookie(repo, out)
    counts["ai_act"] = ai_act(repo, out)
    counts["advice"] = advice(repo, out)
    counts["tools"] = study_pack_tools(repo, out)
    study_pack_readiness(repo, out)
    counts["readiness"] = readiness_activities(repo, out, args.work)
    counts["crosswalk"] = crosswalk(repo, out, args.work)
    counts["enforcement"] = enforcement(repo, out, "gdpr-enforcement.html", "enforce", "GDPR Enforcement")
    counts["world"] = enforcement(repo, out, "privacy-enforcement-worldwide.html", "world", "Enforcement Worldwide")
    counts["pathway_guide"] = md_guide(repo, out, "Claude outputs/study-guides/ai-assessment-pathway-guide.md", "tool",
                                       "Privacy & AI Assessment", "privacy-ai-assessment.html#tool-aipath", "aipath-guide",
                                       skip_heads=(r"^Contents", r"^\d+\. Every question", r"^Step \d+ of", r"^\d+\. Practice", r"^Answers", r"^\d+\. Sources"),
                                       title_prefix="AI Assessment Pathway: ")
    counts["calculator"] = md_guide(repo, out, "Claude outputs/study-guides/gdpr-fine-calculator-explained.md", "calc",
                                    "GDPR Fine Calculator", "gdpr-fine-calculator.html#fc-method", "calc",
                                    skip_heads=(r"^Implementation",), title_prefix="Fine calculator: ")
    counts["notices"] = notices(repo, out)
    catalogue(out)

    chunks = out.items
    print("chunks:", len(chunks), counts)
    if out.em_dashes:
        print("WARNING: %d em dashes replaced" % out.em_dashes)
    sizes = sorted(len(c["x"]) for c in chunks)
    print("text length: min %d, median %d, max %d, total %d" % (sizes[0], sizes[len(sizes) // 2], sizes[-1], sum(sizes)))

    with open(os.path.join(args.work, "chunks.json"), "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=1)

    os.makedirs(out_dir, exist_ok=True)
    index = {
        "built": date.today().isoformat(),
        "count": len(chunks),
        "synonyms": SYNONYMS,
        "tools": [{"id": t["id"], "name": t["name"], "url": t["url"], "what": t["what"], "when": t["when"]} for t in TOOLS],
        "docs": chunks,
    }
    with open(os.path.join(out_dir, "index.json"), "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, separators=(",", ":"))
    print("index.json: %d bytes" % os.path.getsize(os.path.join(out_dir, "index.json")))

    if args.embed:
        meta = embed_all(chunks, args.model, args.dims, args.work, out_dir)
        for name in ("tokens.bin", "vectors.bin", "tokens.json"):
            p = os.path.join(out_dir, name)
            print("%s: %d bytes" % (name, os.path.getsize(p)))
    for name in sorted(os.listdir(out_dir)):
        p = os.path.join(out_dir, name)
        print("md5 %s %s" % (hashlib.md5(open(p, "rb").read()).hexdigest(), name))


if __name__ == "__main__":
    main()
