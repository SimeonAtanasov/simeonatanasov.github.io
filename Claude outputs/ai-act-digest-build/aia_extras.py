# -*- coding: utf-8 -*-
"""High-level summary and the obligations checker for the AI Act digest.

SUMMARY feeds both the page (build_aia_page.py) and the PDF (build_aia_pdf.py).
CHECKER_JS and CHECKER_CSS are page only. Every figure comes from the digest
entries (items_*.json), which were read from the consolidated text on the AI
Act Explorer after Regulation (EU) 2026/1744. British spelling, no em dashes."""

# Each section: (heading, subtitle, [blocks]); a block is a string paragraph or a list of bullet strings.
# {art-N} markers become links to the digest entries on the page and plain text in the PDF.
SUMMARY = [
    ("What the Act is", "Risk tiers, one amending regulation", [
        "Regulation (EU) 2024/1689 is a product-safety style law for AI. It sorts AI systems by the risk they pose and attaches obligations to that tier: a short list of practices is banned outright, high-risk systems carry the full set of design, documentation and oversight requirements, a handful of uses carry transparency duties only, and everything else is left alone apart from a duty to support AI literacy. General-purpose AI models are a separate layer with their own obligations on the model provider. Regulation (EU) 2026/1744, the Digital Omnibus on AI, amended it with effect from 27 July 2026, mainly by moving the high-risk dates, adding two prohibitions, softening the literacy duty and giving the AI Office direct enforcement powers.",
    ]),
    ("Who it binds", "Providers, deployers, the supply chain, the exclusions", [
        "The Act reaches anyone who places an AI system or a general-purpose AI model on the Union market, wherever they are established, anyone who deploys a system inside the Union, and third-country operators whose output is used in the Union ({art-2}). The roles that matter are the provider, who develops a system or model and puts it on the market under its own name, the deployer, who uses a system under its own authority in a professional setting, and the importer, distributor, product manufacturer and authorised representative in the supply chain ({art-3}). Most obligations sit with providers of high-risk systems; deployers carry a shorter list.",
        [
            "Out of scope: military, defence and national security uses; scientific research and development; testing before a system is placed on the market; purely personal, non-professional use ({art-2}).",
            "Free and open-source systems are outside the Act unless they are high-risk, prohibited, or caught by the Article 50 transparency duties.",
            "Providers and deployers must support AI literacy among staff and other persons operating systems on their behalf, since 2 February 2025; after the Omnibus no particular level of literacy has to be guaranteed for any individual ({art-4}).",
        ],
    ]),
    ("Prohibited practices", "Ten banned uses, fines up to 7 % of turnover", [
        "{art-5} bans practices whose risk is judged unacceptable. Since 2 February 2025: manipulative or deceptive techniques that distort behaviour and cause significant harm; exploiting age, disability or social or economic vulnerability; social scoring by public or private actors that leads to detrimental treatment; predicting criminal offending from profiling or personality traits alone; untargeted scraping of facial images from the internet or CCTV to build recognition databases; emotion recognition in workplaces and education except for medical or safety reasons; biometric categorisation that infers race, political opinions, trade union membership, religion, sex life or sexual orientation; and real-time remote biometric identification in public spaces for law enforcement, allowed only for victim searches, imminent threats or serious offences with prior authorisation and a fundamental rights impact assessment. From 2 December 2026 the Omnibus adds two more: AI systems that generate or manipulate non-consensual intimate imagery, and systems that generate child sexual abuse material. Fines reach EUR 35 000 000 or 7 % of worldwide annual turnover ({art-99}).",
    ]),
    ("High-risk AI systems", "Two routes in, the requirements, the dates", [
        "There are two routes into the high-risk tier ({art-6}). The first is product law: an AI system that is a safety component of, or is itself, a product covered by the Union harmonisation legislation in {annex-1} and subject to third-party conformity assessment (machinery, toys, lifts, medical devices, vehicles, aircraft and so on). The second is the list of stand-alone use cases in {annex-3}: biometrics, critical infrastructure, education and vocational training, employment and worker management, access to essential public and private services including credit scoring and life and health insurance, law enforcement, migration and border control, and the administration of justice and elections. An Annex III system escapes the tier if it only performs a narrow procedural task, improves the result of a completed human activity, detects deviations from earlier decisions or does preparatory work, but profiling of natural persons is always high-risk, and the provider must document the assessment and register the system anyway.",
        [
            "Requirements on the system ({art-8} to {art-15}): a lifecycle risk management system, data governance for training, validation and testing sets, technical documentation to Annex IV, automatic logging, instructions for use, effective human oversight, and accuracy, robustness and cybersecurity.",
            "Provider duties ({art-16} to {art-22}): a quality management system, ten years of documentation, log retention, corrective action, cooperation with authorities, and an authorised representative for non-EU providers. Before placing on the market: conformity assessment ({art-43}), EU declaration of conformity ({art-47}), CE marking ({art-48}) and registration in the EU database ({art-49}, {art-71}). Afterwards: post-market monitoring ({art-72}) and serious incident reporting ({art-73}).",
            "Deployer duties ({art-26}): use the system as instructed, assign competent human oversight, keep input data relevant, monitor and report, keep logs for at least six months, tell workers' representatives before use and tell people subject to decisions. Public bodies, providers of public services and users of credit scoring and life and health insurance systems complete a fundamental rights impact assessment before first use ({art-27}). Affected persons can demand an explanation of decisions ({art-86}).",
            "Supply chain ({art-23} to {art-25}): importers and distributors verify conformity before they trade; a distributor, importer or deployer becomes the provider if it rebrands or substantially modifies a system, or changes its intended purpose so that it becomes high-risk.",
            "Dates after the Omnibus: Annex III systems from 2 December 2027, Annex I systems from 2 August 2028. Systems already on the market are caught only if their design changes significantly, except systems used by public authorities, which must comply by 2 August 2030 ({art-111}).",
        ],
    ]),
    ("Transparency duties", "Article 50: chatbots, synthetic content, deep fakes", [
        "{art-50} covers four situations regardless of risk tier. Providers must design systems that interact directly with people so that people know they are dealing with AI, and must mark synthetic audio, image, video and text output in a machine-readable, detectable way. Deployers must tell people when they are exposed to emotion recognition or biometric categorisation, and must disclose deep fakes and AI-generated text published on matters of public interest, with exceptions for artistic works and text under editorial responsibility. These duties apply from 2 August 2026; providers of content generators already on the market before that date have until 2 December 2026 to comply with the marking duty ({art-111}). A code of practice on detecting and labelling AI-generated content, and the Commission's guidelines on Article 50, were published in July 2026.",
    ]),
    ("General-purpose AI models", "Documentation, copyright, the 10^25 FLOP line", [
        "A general-purpose AI model displays significant generality and can perform a wide range of tasks; it is regulated at model level, separately from the systems built on it. Every provider must keep technical documentation to Annex XI, give downstream system providers the Annex XII information they need, adopt a copyright policy that respects rights reservations under the Copyright Directive, and publish a summary of training content on the AI Office template ({art-53}). Free and open-source models with public weights are exempt from the documentation duties unless they carry systemic risk. A model is presumed to have systemic risk once cumulative training compute exceeds 10^25 floating point operations, or the Commission designates it ({art-51}); its provider must then also run standardised evaluations including adversarial testing, assess and mitigate systemic risks, report serious incidents to the AI Office and secure the model and its infrastructure ({art-55}). The General-Purpose AI Code of Practice of 10 July 2025 is the recognised route to compliance ({art-56}). Obligations applied from 2 August 2025; models already on the market then have until 2 August 2027 ({art-111}). The Commission may fine model providers up to EUR 15 000 000 or 3 % of worldwide turnover ({art-101}), with fining possible from 2 August 2026.",
    ]),
    ("Governance and enforcement", "AI Office, Board, national authorities, complaints", [
        "At Union level the AI Office inside the Commission supervises general-purpose AI models and, after the Omnibus, has direct powers to investigate, request information, inspect premises and impose fines and periodic penalty payments on the operators assigned to it ({art-64}, {art-75a} to {art-75d}). The European Artificial Intelligence Board coordinates Member States ({art-65}), an advisory forum and a scientific panel of independent experts support both ({art-67}, {art-68}), and the panel can raise qualified alerts about systemic-risk models ({art-90}). Each Member State designates a notifying authority and a market surveillance authority, with one single point of contact ({art-70}); data protection authorities supervise the law enforcement, migration and justice use cases. Anyone may complain to a market surveillance authority ({art-85}), and whistleblowers are protected ({art-87}). Regulatory sandboxes, at least one per Member State since 2 August 2026, and real-world testing give providers a supervised route to market ({art-57} to {art-61}).",
    ]),
    ("Penalties", "Three tiers, lower caps for SMEs and small mid-caps", [
        [
            "Prohibited practices: up to EUR 35 000 000 or 7 % of worldwide annual turnover, whichever is higher.",
            "Other obligations of providers, deployers, importers, distributors, notified bodies and the Article 50 duties: up to EUR 15 000 000 or 3 %.",
            "Incorrect, incomplete or misleading information to authorities: up to EUR 7 500 000 or 1 %.",
            "For SMEs and small mid-caps the lower of the two amounts applies ({art-99}). Union institutions face separate fines from the European Data Protection Supervisor ({art-100}).",
        ],
    ]),
    ("Timeline after the Omnibus", "From 1 August 2024 to 31 December 2030", [
        [
            "1 August 2024: entry into force.",
            "2 February 2025: general provisions, AI literacy and the prohibitions (Chapters I and II).",
            "2 August 2025: notified bodies, general-purpose AI models, governance, penalties and confidentiality (Chapter III Section 4, Chapters V, VII and XII, Article 78), except the GPAI fining power.",
            "27 July 2026: Regulation (EU) 2026/1744 in force; the inserted Articles 4a, 60a and 75a to 75d, and the sectoral amendments in Articles 102 to 110.",
            "2 August 2026: everything else, including the Article 50 transparency duties, sandboxes, the GPAI fining power and the AI Office's enforcement powers.",
            "2 December 2026: the two new prohibitions; deadline for existing content generators to mark synthetic output.",
            "2 August 2027: deadline for general-purpose AI models already on the market.",
            "2 December 2027: high-risk obligations for Annex III systems.",
            "2 August 2028: high-risk obligations for Annex I product-related systems.",
            "2 August 2030: high-risk systems used by public authorities; 31 December 2030: components of the Annex X large-scale IT systems ({art-113}, {art-111}).",
        ],
    ]),
    ("What the Omnibus changed", "Eight changes worth knowing", [
        [
            "High-risk dates moved from 2 August 2026 to 2 December 2027 (Annex III) and 2 August 2028 (Annex I), with grandfathering keyed to the new dates ({art-113}, {art-111}).",
            "Two new prohibitions on non-consensual intimate imagery and child sexual abuse material from 2 December 2026 ({art-5}).",
            "AI literacy became a duty to support literacy, without guaranteeing any individual level ({art-4}); a new {art-4a} allows processing of special categories of personal data for bias detection and correction under strict conditions.",
            "Systems that only serve non-safety aspects such as user assistance or convenience are not safety components under Article 6(1) unless failure endangers health and safety ({art-6}).",
            "Article 50 marking duty: providers of generators already on the market get until 2 December 2026; the Commission can approve or replace a code of practice on labelling by implementing act ({art-50}, {art-111}).",
            "The AI Office gained supervisory and enforcement powers, commitments, fines and periodic penalty payments over the operators in Article 75(1), plus a Union-level sandbox ({art-75a} to {art-75d}, {art-57}).",
            "Small mid-caps (SMCs) join SMEs in the simplified quality management, fee, guidance and fine-cap provisions ({art-3}, {art-17}, {art-62}, {art-99}).",
            "A new {art-60a} covers real-world testing of Annex I Section B products; a new {annex-14} lists the codes and categories notified bodies are designated for; the Machinery Regulation (EU) 2023/1230 replaces the Machinery Directive in {annex-1}.",
        ],
    ]),
]

CHECKER_INTRO = "Answer a few questions about one AI system or model and get the tier it falls in, the articles that apply to your role, and the dates after the Omnibus. Runs in your browser; nothing is stored or sent. A reading aid, not legal advice: the answers point you to the provisions to read, they do not decide the case."

CHECKER_JS = r"""
(function () {
	var root = document.getElementById('ai-checker');
	if (!root) return;
	var A = {};
	var url = function (id) { return '#' + id; };
	function link(id, label) { return '<a href="' + url(id) + '">' + label + '</a>'; }

	var ANNEX3 = [
		['bio', 'Biometrics: remote identification, categorisation by sensitive attributes, emotion recognition'],
		['infra', 'Safety components of critical infrastructure (digital infrastructure, traffic, water, gas, heating, electricity)'],
		['edu', 'Education and vocational training: admission, assessment, level allocation, exam monitoring'],
		['work', 'Employment and worker management: recruitment, task allocation, monitoring, promotion, termination'],
		['services', 'Access to essential services: public benefits, credit scoring, life and health insurance pricing, emergency triage'],
		['law', 'Law enforcement: risk of offending or re-offending, polygraphs, evidence evaluation, profiling'],
		['migration', 'Migration, asylum and border control'],
		['justice', 'Administration of justice and democratic processes, including influencing elections'],
	];
	var PROHIBITED = [
		['manip', 'Subliminal, manipulative or deceptive techniques that distort behaviour and cause significant harm'],
		['vuln', 'Exploiting age, disability or social or economic vulnerability to distort behaviour'],
		['score', 'Social scoring of people over time that leads to detrimental or unjustified treatment'],
		['crime', 'Predicting that a person will commit an offence from profiling or personality traits alone'],
		['scrape', 'Untargeted scraping of facial images from the internet or CCTV to build a recognition database'],
		['emotion', 'Emotion recognition in the workplace or in education, other than for medical or safety reasons'],
		['cat', 'Biometric categorisation that infers race, political opinions, union membership, religion, sex life or sexual orientation'],
		['rbi', 'Real-time remote biometric identification in public spaces for law enforcement'],
		['ncii', 'Generating or manipulating non-consensual intimate imagery, or generating child sexual abuse material (banned from 2 December 2026)'],
	];
	var T50 = [
		['chat', 'It interacts directly with people (chatbots, voice assistants, agents)'],
		['synth', 'It generates synthetic audio, image, video or text'],
		['emo', 'It performs emotion recognition or biometric categorisation on people'],
		['deep', 'It is used to produce deep fakes, or AI-written text published on matters of public interest'],
	];
	var Q = {
		role: { title: 'What is your role for this system or model?', type: 'single', opts: [
			['provider', 'Provider: we develop it, or have it developed, and place it on the market or put it into service under our own name'],
			['deployer', 'Deployer: we use a system supplied by someone else, under our own authority, in a professional setting'],
			['importer', 'Importer: we are established in the Union and place a non-EU provider\'s system on the market'],
			['distributor', 'Distributor: we make a system available on the market without being its provider or importer'],
			['manufacturer', 'Product manufacturer: we integrate an AI system into a product we sell under our own name'],
		] },
		scope: { title: 'Does any of these describe the use?', type: 'single', opts: [
			['military', 'Exclusively military, defence or national security purposes'],
			['research', 'Scientific research and development only, not placed on the market or put into service'],
			['personal', 'Purely personal, non-professional activity'],
			['none', 'None of these'],
		] },
		market: { title: 'Is it placed on the Union market, put into service in the Union, or is its output used in the Union?', type: 'single', opts: [['yes', 'Yes'], ['no', 'No']] },
		gpai: { title: 'Is it a general-purpose AI model (a model with significant generality, able to perform many distinct tasks, that can be integrated into downstream systems) rather than an AI system?', type: 'single', opts: [['yes', 'Yes, a general-purpose AI model'], ['no', 'No, an AI system']] },
		systemic: { title: 'Did cumulative training compute exceed 10^25 floating point operations, or has the Commission designated the model as having systemic risk?', type: 'single', opts: [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']] },
		oss: { title: 'Is the model released under a free and open-source licence with its parameters, weights, architecture and usage information publicly available?', type: 'single', opts: [['yes', 'Yes'], ['no', 'No']] },
		prohibited: { title: 'Does the system do any of the following? Tick all that apply.', type: 'multi', opts: PROHIBITED, none: 'None of these' },
		annex1: { title: 'Is the system a safety component of, or itself, a product covered by Union product legislation in Annex I (machinery, toys, lifts, medical devices, radio equipment, vehicles, aircraft, rail, marine equipment and so on) that requires third-party conformity assessment?', type: 'single', opts: [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']] },
		annex3: { title: 'Is the system intended for any of these Annex III uses? Tick all that apply.', type: 'multi', opts: ANNEX3, none: 'None of these' },
		exempt: { title: 'Within that use, does the system only perform a narrow procedural task, improve the result of a completed human activity, detect deviations from earlier decision patterns without replacing human assessment, or carry out a preparatory task, and does it never profile natural persons?', type: 'single', opts: [['yes', 'Yes, all of that is true'], ['no', 'No']] },
		fria: { title: 'Are you a body governed by public law, a private operator providing public services, or do you use the system for credit scoring or life and health insurance pricing?', type: 'single', opts: [['yes', 'Yes'], ['no', 'No']] },
		t50: { title: 'Does any of these apply? Tick all that apply.', type: 'multi', opts: T50, none: 'None of these' },
	};
	var FLOW = ['role', 'scope', 'market', 'gpai', 'systemic', 'oss', 'prohibited', 'annex1', 'annex3', 'exempt', 'fria', 't50'];
	function next(after) {
		var i = FLOW.indexOf(after);
		for (var j = i + 1; j < FLOW.length; j++) {
			var k = FLOW[j];
			if (k === 'gpai' && A.role !== 'provider') continue;
			if ((k === 'systemic' || k === 'oss') && A.gpai !== 'yes') continue;
			if (A.gpai === 'yes' && ['prohibited', 'annex1', 'annex3', 'exempt', 'fria', 't50'].indexOf(k) !== -1) continue;
			if (k === 'exempt' && (!A.annex3 || !A.annex3.length)) continue;
			if (k === 'fria' && !(A.role === 'deployer' && A.annex3 && A.annex3.length && A.exempt !== 'yes')) continue;
			return k;
		}
		return null;
	}
	var history = [];
	function ask(k) {
		var q = Q[k], h = ['<p class="ai-ck-q">' + q.title + '</p>'];
		if (q.type === 'single') {
			q.opts.forEach(function (o) { h.push('<button type="button" class="ai-ck-opt" data-v="' + o[0] + '">' + o[1] + '</button>'); });
		} else {
			q.opts.forEach(function (o) { h.push('<label class="ai-ck-check"><input type="checkbox" value="' + o[0] + '"> ' + o[1] + '</label>'); });
			h.push('<div class="ai-ck-row"><button type="button" class="ai-ck-go" data-v="go">Continue</button><button type="button" class="ai-ck-none" data-v="none">' + q.none + '</button></div>');
		}
		h.push('<p class="ai-ck-nav">' + (history.length ? '<button type="button" class="ai-ck-back">Back</button><button type="button" class="ai-ck-restart">Start again</button>' : '') + '<span>Question ' + (history.length + 1) + '</span></p>');
		root.querySelector('.ai-ck-body').innerHTML = h.join('');
		root.setAttribute('data-q', k);
	}
	function answer(k, v) {
		A[k] = v; history.push(k);
		if (k === 'scope' && v !== 'none') return result('outscope');
		if (k === 'market' && v === 'no') return result('outscope');
		if (k === 'prohibited' && v.length) return result('prohibited');
		var n = next(k);
		if (n) ask(n); else result(A.gpai === 'yes' ? 'gpai' : 'system');
	}
	function chip(t) { return '<span class="ai-chip ai-chip-date">' + t + '</span>'; }
	function item(id, label, note) { return '<li>' + link(id, label) + (note ? ': ' + note : '') + '</li>'; }
	function result(kind) {
		var h = [], role = A.role, tier = '', tierNote = '', items = [], steps = [], dates = [];
		var hr1 = A.annex1 === 'yes', hr3 = A.annex3 && A.annex3.length && A.exempt !== 'yes', hr = hr1 || hr3;
		if (kind === 'outscope') {
			tier = 'Outside the Act';
			tierNote = A.scope === 'military' ? 'Exclusively military, defence and national security uses are excluded by Article 2(3).' : A.scope === 'research' ? 'Systems developed and used solely for scientific research and development, or tested before being placed on the market, are excluded by Article 2(6) and (8). The moment it is placed on the market or put into service the Act applies; real-world testing has its own rules.' : A.scope === 'personal' ? 'Purely personal, non-professional use by a natural person is excluded by Article 2(10). The provider of the system is still bound.' : 'The Act applies to systems placed on the Union market, put into service in the Union or whose output is used in the Union (Article 2(1)). Outside that, it does not reach you.';
			items.push(item('art-2', 'Article 2', 'scope and exclusions'));
			steps.push('Record why the exclusion applies and revisit if the use changes; GDPR and sector law still apply.');
		} else if (kind === 'prohibited') {
			tier = 'Prohibited practice';
			var late = A.prohibited.indexOf('ncii') !== -1;
			tierNote = 'One or more of the practices you ticked is banned by Article 5. The ban has applied since 2 February 2025' + (late ? '; the non-consensual intimate imagery and child sexual abuse material prohibitions apply from 2 December 2026' : '') + '. Real-time remote biometric identification by law enforcement has narrow exceptions in Article 5(2) to (7), each needing prior authorisation and a fundamental rights impact assessment.';
			items.push(item('art-5', 'Article 5', 'the prohibitions and the law enforcement exceptions'));
			items.push(item('art-99', 'Article 99', 'fines up to EUR 35 000 000 or 7 % of worldwide annual turnover'));
			items.push(item('annex-2', 'Annex II', 'the offences that can justify real-time identification'));
			dates.push('2 February 2025'); if (late) dates.push('2 December 2026 (points (ba) and (bb))');
			steps.push('Stop or redesign the use case; check the Commission guidelines on prohibited practices (4 February 2025) in Part 2 for the boundary cases.');
		} else if (kind === 'gpai') {
			var sys = A.systemic === 'yes';
			tier = sys ? 'General-purpose AI model with systemic risk' : 'General-purpose AI model';
			tierNote = 'Chapter V applies to the model provider from 2 August 2025; models already on the market then have until 2 August 2027.' + (A.systemic === 'unsure' ? ' Track cumulative training compute against the 10^25 FLOP presumption in Article 51(2); crossing it triggers the Article 52 notification within two weeks.' : '') + (A.oss === 'yes' && !sys ? ' As a free and open-source model with public weights, the documentation duties in Article 53(1)(a) and (b) do not apply; the copyright policy and training content summary still do.' : '');
			items.push(item('art-53', 'Article 53', 'technical documentation, downstream information, copyright policy, training content summary'));
			items.push(item('art-54', 'Article 54', 'authorised representative for providers outside the Union'));
			if (sys) { items.push(item('art-51', 'Article 51', 'classification as systemic risk')); items.push(item('art-52', 'Article 52', 'notification procedure')); items.push(item('art-55', 'Article 55', 'evaluation, adversarial testing, systemic risk mitigation, incident reporting, cybersecurity')); }
			items.push(item('art-56', 'Article 56', 'the Code of Practice as the route to compliance'));
			items.push(item('annex-11', 'Annex XI', 'documentation content')); items.push(item('annex-12', 'Annex XII', 'information for downstream providers'));
			if (sys) items.push(item('annex-13', 'Annex XIII', 'systemic risk criteria'));
			items.push(item('art-101', 'Article 101', 'Commission fines up to EUR 15 000 000 or 3 %, from 2 August 2026'));
			dates.push('2 August 2025'); dates.push('2 August 2027 (models on the market before 2 August 2025)');
			steps.push('Sign or align with the General-Purpose AI Code of Practice (10 July 2025) and publish the training content summary on the AI Office template; see Part 2.');
			steps.push('If you also place an AI system built on the model, run the checker again as provider of that system.');
		} else {
			var t = A.t50 || [];
			if (hr) { tier = 'High-risk AI system' + (hr1 && !hr3 ? ' (Annex I product route)' : hr3 && !hr1 ? ' (Annex III use case)' : ' (Annex I and Annex III)'); }
			else if (t.length) { tier = 'Transparency duties only'; }
			else { tier = 'Minimal risk'; }
			if (hr) {
				tierNote = (hr3 ? 'Annex III obligations apply from 2 December 2027. ' : '') + (hr1 ? 'Annex I obligations apply from 2 August 2028; for Section B products (vehicles, aviation, rail, marine) only Article 6(1) and the sectoral acts bite. ' : '') + 'Systems already on the market before those dates are caught only if their design changes significantly, except systems used by public authorities, which must comply by 2 August 2030.';
				if (A.annex1 === 'unsure') tierNote += ' You answered "not sure" on Annex I: check the product legislation list in Annex I first, since that route alone makes a system high-risk.';
			} else if (A.annex3 && A.annex3.length && A.exempt === 'yes') {
				tierNote = 'The use is listed in Annex III but you judge it falls under the Article 6(3) exemption. That judgement must be documented before placing on the market and the system registered under Article 49(2); an authority can challenge it under Article 80. ';
				items.push(item('art-6', 'Article 6(3) and (4)', 'the exemption and the documentation duty')); items.push(item('art-49', 'Article 49(2)', 'registration of exempted systems')); items.push(item('art-80', 'Article 80', 'authority review of the classification'));
			}
			if (hr) {
				if (role === 'provider' || role === 'manufacturer') {
					items.push(item('art-8', 'Articles 8 to 15', 'requirements: risk management, data governance, documentation, logging, instructions, human oversight, accuracy and cybersecurity'));
					items.push(item('art-16', 'Articles 16 to 22', 'provider obligations, quality management, documentation keeping, corrective action, authorised representative'));
					items.push(item('art-43', 'Article 43', 'conformity assessment')); items.push(item('art-47', 'Articles 47 to 49', 'declaration of conformity, CE marking, registration'));
					items.push(item('art-72', 'Articles 72 and 73', 'post-market monitoring and serious incident reporting'));
					items.push(item('annex-4', 'Annex IV', 'technical documentation'));
					if (role === 'manufacturer') items.push(item('art-25', 'Article 25(3)', 'the product manufacturer takes on the provider obligations'));
					steps.push('Map the system against Articles 8 to 15 now and plan the conformity assessment; harmonised standards are still in preparation (see Standards in Part 2).');
				} else if (role === 'deployer') {
					items.push(item('art-26', 'Article 26', 'deployer obligations: instructions, human oversight, input data, monitoring, logs, worker information, informing affected persons'));
					if (A.fria === 'yes') items.push(item('art-27', 'Article 27', 'fundamental rights impact assessment before first use'));
					items.push(item('art-86', 'Article 86', 'right of affected persons to an explanation'));
					items.push(item('art-25', 'Article 25', 'you become the provider if you rebrand, substantially modify or repurpose the system'));
					if (A.fria === 'yes') items.push(item('art-49', 'Article 49(3)', 'public authority deployers register their use'));
					steps.push('Get the provider\'s instructions for use and Annex IV documentation into your vendor file; assign and train the human overseers.');
				} else if (role === 'importer') {
					items.push(item('art-23', 'Article 23', 'verify the conformity assessment, documentation, CE marking and authorised representative before placing on the market'));
					items.push(item('art-25', 'Article 25', 'you become the provider if you rebrand or substantially modify the system'));
				} else if (role === 'distributor') {
					items.push(item('art-24', 'Article 24', 'verify CE marking, declaration of conformity and instructions before making available'));
					items.push(item('art-25', 'Article 25', 'you become the provider if you rebrand or substantially modify the system'));
				}
				items.push(item('art-6', 'Article 6', 'classification rules')); if (hr3) items.push(item('annex-3', 'Annex III', 'the use case list')); if (hr1) items.push(item('annex-1', 'Annex I', 'the product legislation list'));
				items.push(item('art-99', 'Article 99', 'fines up to EUR 15 000 000 or 3 %'));
				if (hr3) dates.push('2 December 2027'); if (hr1) dates.push('2 August 2028');
			}
			if (t.length) {
				var pt = [], dt = [];
				if (t.indexOf('chat') !== -1) pt.push('Article 50(1), people must know they are dealing with AI');
				if (t.indexOf('synth') !== -1) pt.push('Article 50(2), machine-readable marking of synthetic output');
				if (t.indexOf('emo') !== -1) dt.push('Article 50(3), inform exposed persons');
				if (t.indexOf('deep') !== -1) dt.push('Article 50(4), disclose deep fakes and public-interest text');
				var which = (role === 'provider' || role === 'manufacturer') ? pt.concat(dt.length ? ['your deployers carry ' + dt.join(' and ')] : []) : role === 'deployer' ? dt.concat(pt.length ? ['your provider carries ' + pt.join(' and ')] : []) : pt.concat(dt);
				items.push(item('art-50', 'Article 50', which.join('; ')));
				if (t.indexOf('synth') !== -1) items.push(item('art-111', 'Article 111(4)', 'generators on the market before 2 August 2026 must mark output by 2 December 2026'));
				dates.push('2 August 2026'); if (t.indexOf('synth') !== -1) dates.push('2 December 2026 (existing generators)');
				steps.push('Read the Code of Practice on transparency of AI-generated content and the Article 50 guidelines (July 2026) in Part 2.');
				if (!hr) tierNote = 'The system is not high-risk on your answers, but Article 50 applies from 2 August 2026.';
			}
			if (!hr && !t.length) {
				tierNote = tierNote || 'No prohibition, no high-risk route and no transparency case on your answers. The Act still expects AI literacy measures and invites voluntary codes of conduct.';
			}
			items.push(item('art-4', 'Article 4', 'support AI literacy among staff and operators, since 2 February 2025'));
			if (!hr && !t.length) items.push(item('art-95', 'Article 95', 'voluntary codes of conduct'));
			items.push(item('art-85', 'Article 85', 'anyone may complain to a market surveillance authority'));
			if (!hr) { if (A.annex1 === 'unsure') tierNote += ' You answered "not sure" on Annex I: check the product legislation list, since that route alone makes a system high-risk.'; }
		}
		h.push('<p class="ai-ck-tier"><span class="ai-ck-label">Result</span>' + tier + '</p>');
		if (tierNote) h.push('<p class="ai-ck-note">' + tierNote + '</p>');
		if (dates.length) h.push('<p class="ai-ck-dates">Applies from ' + dates.map(chip).join(' ') + '</p>');
		if (items.length) h.push('<p class="ai-ck-sub">Provisions to read (links open the digest entry)</p><ul class="ai-ck-list">' + items.join('') + '</ul>');
		if (steps.length) h.push('<p class="ai-ck-sub">Next steps</p><ul class="ai-ck-list">' + steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul>');
		h.push('<p class="ai-ck-answers"><span class="ai-ck-label">Your answers</span>' + history.map(function (k) { var v = A[k]; var q = Q[k]; var lab = function (x) { var o = q.opts.filter(function (p) { return p[0] === x; })[0]; return o ? o[1] : x; }; return '<span>' + q.title.split('?')[0].replace(/ Tick all that apply\.?/, '') + '? ' + (Array.isArray(v) ? (v.length ? v.map(lab).join('; ') : q.none) : lab(v)) + '</span>'; }).join('') + '</p>');
		h.push('<p class="ai-ck-nav"><button type="button" class="ai-ck-back">Back</button><button type="button" class="ai-ck-restart">Start again</button></p>');
		root.querySelector('.ai-ck-body').innerHTML = h.join('');
		root.setAttribute('data-q', 'result');
	}
	function restart() { A = {}; history = []; ask('role'); }
	root.addEventListener('click', function (e) {
		var b = e.target.closest && e.target.closest('button');
		if (!b) return;
		var k = root.getAttribute('data-q');
		if (b.classList.contains('ai-ck-restart')) return restart();
		if (b.classList.contains('ai-ck-back')) { var prev = history.pop(); if (prev === undefined) return restart(); delete A[prev]; history.forEach(function (x) {}); return ask(prev); }
		if (b.classList.contains('ai-ck-opt')) return answer(k, b.getAttribute('data-v'));
		if (b.classList.contains('ai-ck-none')) return answer(k, []);
		if (b.classList.contains('ai-ck-go')) { var v = Array.prototype.map.call(root.querySelectorAll('.ai-ck-body input:checked'), function (i) { return i.value; }); return answer(k, v); }
	});
	restart();
})();
"""

CHECKER_CSS = """
/* Obligations checker */
.ai-checker { margin: 0 0 2em 0; padding: 1.25em; border: solid 1px rgba(255,255,255,0.12); border-radius: 0.5em; background: rgba(255,255,255,0.02); }
.ai-checker[open] > summary { margin-bottom: 0.75em; }
.ai-checker > summary { list-style: none; cursor: pointer; font-weight: bold; color: #fff; font-size: 1.1em; display: flex; align-items: baseline; justify-content: space-between; gap: 1em; }
.ai-checker > summary::-webkit-details-marker { display: none; }
.ai-checker > summary::after { content: '\\f107'; font-family: 'Font Awesome 5 Free'; font-weight: 900; color: rgba(255,255,255,0.4); font-size: 0.9em; transition: transform 0.2s ease; }
.ai-checker[open] > summary::after { transform: rotate(180deg); }
.ai-ck-intro { font-size: 0.9em; color: rgba(255,255,255,0.6); margin: 0 0 1em 0; }
.ai-ck-body { max-width: 52em; }
.ai-ck-q { font-weight: bold; color: #fff; margin: 0 0 0.75em 0; line-height: 1.5; }
.ai-checker button {
	height: auto; line-height: 1.45; padding: 0.6em 1em; margin: 0 0 0.5em 0; font-size: 0.9em; font-weight: normal; letter-spacing: 0; text-transform: none;
	white-space: normal; text-align: left; border-radius: 0.4em; box-shadow: none; display: block; width: 100%;
	border: solid 1px rgba(255,255,255,0.18) !important; color: rgba(255,255,255,0.85) !important; background: rgba(255,255,255,0.03);
}
.ai-checker button::after { display: none; }
.ai-checker button:hover { border-color: #7fb2e5 !important; background: rgba(127,178,229,0.1); color: #fff !important; }
.ai-ck-check { display: flex; gap: 0.6em; align-items: flex-start; font-size: 0.9em; font-weight: normal; text-transform: none; letter-spacing: 0; padding: 0.35em 0; color: rgba(255,255,255,0.8); cursor: pointer; }
.ai-ck-check input { margin-top: 0.3em; }
.ai-ck-check input[type="checkbox"] { -webkit-appearance: checkbox; -moz-appearance: checkbox; appearance: checkbox; opacity: 1; float: none; margin-right: 0; z-index: auto; width: 1.1em; height: 1.1em; flex: none; display: inline-block; }
.ai-ck-row { display: flex; gap: 0.75em; margin-top: 0.75em; }
.ai-ck-row button { width: auto; }
.ai-checker .ai-ck-go { background: #4267a6; border-color: #4267a6 !important; }
.ai-ck-nav { display: flex; align-items: center; gap: 1em; margin: 1em 0 0 0; font-size: 0.8em; color: rgba(255,255,255,0.45); }
.ai-ck-nav button, .ai-checker .ai-ck-back, .ai-checker .ai-ck-restart { width: auto; display: inline-block; margin: 0; padding: 0.35em 0.9em; font-size: 0.85em; }
.ai-ck-tier { font-size: 1.15em; font-weight: bold; color: #fff; margin: 0 0 0.5em 0; }
.ai-ck-label { display: block; font-size: 0.7em; font-weight: normal; text-transform: uppercase; letter-spacing: 0.1em; color: #7fb2e5; margin-bottom: 0.2em; }
.ai-ck-note { font-size: 0.95em; color: rgba(255,255,255,0.75); margin: 0 0 0.75em 0; }
.ai-ck-dates { margin: 0 0 0.75em 0; font-size: 0.9em; color: rgba(255,255,255,0.6); display: flex; flex-wrap: wrap; gap: 0.4em; align-items: center; }
.ai-ck-sub { font-size: 0.8em; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); margin: 1em 0 0.35em 0; }
.ai-ck-list { margin: 0; padding-left: 1.25em; font-size: 0.92em; }
.ai-ck-list li { margin-bottom: 0.35em; }
.ai-ck-list a { color: #7fb2e5; border-bottom: none; }
.ai-ck-list a:hover { color: #fff; }
.ai-ck-answers { margin: 1em 0 0 0; font-size: 0.8em; color: rgba(255,255,255,0.45); display: flex; flex-direction: column; gap: 0.2em; }
@media (max-width: 736px) { .ai-ck-row { flex-direction: column; } .ai-ck-row button { width: 100%; } }
"""

SUMMARY_CSS = """
/* High-level summary */
.ai-summary { margin: 0 0 2em 0; padding: 1.25em; border: solid 1px rgba(255,255,255,0.12); border-radius: 0.5em; background: rgba(255,255,255,0.02); }
.ai-summary > summary { list-style: none; cursor: pointer; font-weight: bold; color: #fff; font-size: 1.1em; display: flex; align-items: baseline; justify-content: space-between; gap: 1em; }
.ai-summary > summary::-webkit-details-marker { display: none; }
.ai-summary > summary::after { content: '\\f107'; font-family: 'Font Awesome 5 Free'; font-weight: 900; color: rgba(255,255,255,0.4); font-size: 0.9em; transition: transform 0.2s ease; }
.ai-summary[open] > summary::after { transform: rotate(180deg); }
.ai-summary[open] > summary { margin-bottom: 0.75em; }
.ai-sum-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5em 1.5em; align-items: start; }
.ai-sum-sec { margin: 0; border: solid 1px rgba(255,255,255,0.1); border-radius: 0.4em; background: rgba(255,255,255,0.02); }
.ai-sum-sec > summary { list-style: none; cursor: pointer; padding: 0.7em 2.5em 0.7em 0.9em; position: relative; }
.ai-sum-sec > summary::-webkit-details-marker { display: none; }
.ai-sum-sec > summary::after { content: '\\f107'; font-family: 'Font Awesome 5 Free'; font-weight: 900; position: absolute; right: 0.9em; top: 0.8em; color: rgba(255,255,255,0.4); font-size: 0.85em; transition: transform 0.2s ease; }
.ai-sum-sec[open] > summary::after { transform: rotate(180deg); }
.ai-sum-sec > summary:hover { background: rgba(255,255,255,0.04); }
.ai-sum-sec h3 { font-size: 0.85em; text-transform: uppercase; letter-spacing: 0.1em; color: #fff; margin: 0; display: inline; }
.ai-sum-sub { display: block; font-size: 0.85em; color: rgba(255,255,255,0.55); margin-top: 0.15em; }
.ai-sum-body { padding: 0 0.9em 0.6em 0.9em; }
.ai-sum-sec[open] { grid-column: 1 / -1; }
.ai-sum-sec p, .ai-sum-sec li { font-size: 0.92em; line-height: 1.6; color: rgba(255,255,255,0.75); }
.ai-sum-sec p { margin: 0 0 0.6em 0; }
.ai-sum-sec ul { margin: 0 0 0.6em 0; padding-left: 1.2em; }
.ai-sum-sec li { margin-bottom: 0.3em; }
.ai-sum-sec a { color: #7fb2e5; border-bottom: none; }
.ai-sum-sec a:hover { color: #fff; }
@media (max-width: 900px) { .ai-sum-cols { grid-template-columns: 1fr; } }
"""
