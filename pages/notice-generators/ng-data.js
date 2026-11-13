/* Notice and policy generators: rule data.
 *
 * Every rule here traces to a row of the requirements matrix
 * (project doc claude/notice-generators-matrix.md, built 12 November 2026).
 * Change the matrix first, then this file.
 *
 * Sources, all read on 12 November 2026:
 *   GDPR, Regulation (EU) 2016/679, EUR-Lex CELEX 32016R0679.
 *   WP29 Guidelines on transparency, WP260 rev.01 (11 April 2018), endorsed by the EDPB.
 *   AI Act, Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744,
 *     consolidated text CELEX 02024R1689-20260727.
 *   Commission Guidelines on Article 50 AI Act, C(2026) 7702 final, 5 November 2026.
 *   UK GDPR and Data Protection Act 2018 as amended by the Data (Use and Access) Act 2025,
 *     legislation.gov.uk, versions in force on 12 November 2026.
 *   Swiss FADP (SR 235.1, version of 7 July 2025) and Data Protection Ordinance (SR 235.11),
 *     fedlex.admin.ch, English translation (not an official language; no legal force).
 *   California Consumer Privacy Act, Civil Code 1798.100 onwards, and the CCPA regulations,
 *     Cal. Code Regs. tit. 11, 7000 onwards, both as in force from 1 January 2026 (cppa.ca.gov).
 *
 * Wording rule for every generated sentence: no "may", "might", "some", "often" or
 * "possible" (WP260 para 13). The test script checks the output for them.
 */

var NG_DATA = (function () {

	var BASES = [
		{ id: "a", label: "Consent (Art. 6(1)(a))", short: "your consent", art: "Article 6(1)(a) GDPR" },
		{ id: "b", label: "Contract (Art. 6(1)(b))", short: "performance of a contract with you, or steps you asked for before entering into one", art: "Article 6(1)(b) GDPR" },
		{ id: "c", label: "Legal obligation (Art. 6(1)(c))", short: "a legal obligation we are subject to", art: "Article 6(1)(c) GDPR" },
		{ id: "d", label: "Vital interests (Art. 6(1)(d))", short: "protecting someone's vital interests", art: "Article 6(1)(d) GDPR" },
		{ id: "e", label: "Public task (Art. 6(1)(e))", short: "a task carried out in the public interest or in the exercise of official authority vested in us", art: "Article 6(1)(e) GDPR" },
		{ id: "f", label: "Legitimate interests (Art. 6(1)(f))", short: "our legitimate interests or those of a third party", art: "Article 6(1)(f) GDPR" }
	];

	var ART9 = [
		{ id: "", label: "No special category data" },
		{ id: "a", label: "Explicit consent (Art. 9(2)(a))" },
		{ id: "b", label: "Employment, social security and social protection law (Art. 9(2)(b))" },
		{ id: "c", label: "Vital interests, person incapable of consent (Art. 9(2)(c))" },
		{ id: "d", label: "Not-for-profit body, members (Art. 9(2)(d))" },
		{ id: "e", label: "Manifestly made public by the person (Art. 9(2)(e))" },
		{ id: "f", label: "Legal claims or courts (Art. 9(2)(f))" },
		{ id: "g", label: "Substantial public interest under law (Art. 9(2)(g))" },
		{ id: "h", label: "Preventive or occupational medicine, health or social care (Art. 9(2)(h))" },
		{ id: "i", label: "Public interest in public health (Art. 9(2)(i))" },
		{ id: "j", label: "Archiving, research or statistics under law (Art. 9(2)(j))" }
	];
	/* Points of Article 9(2) that rest on a further footing the notice should name (WP260 Annex,
	   row on purposes and legal basis): Union or Member State law, or for (b) a collective
	   agreement and for (h) a contract with a health professional. */
	var ART9_NEEDS_LAW = { b: true, g: true, h: true, i: true, j: true };
	/* How each condition reads in a notice. Verified against Article 9(2) on 12 November 2026. */
	var ART9_TXT = {
		a: "you have given explicit consent",
		b: "the processing is necessary to carry out obligations and exercise rights in employment, social security and social protection law",
		c: "the processing is necessary to protect vital interests where the person concerned is physically or legally incapable of giving consent",
		d: "the processing is carried out by a not-for-profit body in the course of its legitimate activities and concerns its members, former members or people in regular contact with it",
		e: "you have manifestly made the data public",
		f: "the processing is necessary to establish, exercise or defend legal claims",
		g: "the processing is necessary for reasons of substantial public interest on the basis of law",
		h: "the processing is necessary for preventive or occupational medicine, the assessment of working capacity, medical diagnosis, or the provision or management of health or social care",
		i: "the processing is necessary for reasons of public interest in the area of public health",
		j: "the processing is necessary for archiving in the public interest, scientific or historical research or statistical purposes"
	};

	var TRANSFER_MECH = [
		{ id: "adequacy", label: "Adequacy decision (Art. 45)", needsCopy: false, text: "" },
		{ id: "scc", label: "Standard data protection clauses (Art. 46(2)(c) or (d))", needsCopy: true,
		  text: "This transfer is not covered by an adequacy decision of the European Commission. We use standard data protection clauses (Article 46(2) GDPR)." },
		{ id: "bcr", label: "Binding corporate rules (Art. 47)", needsCopy: true,
		  text: "This transfer is not covered by an adequacy decision of the European Commission. It is covered by binding corporate rules approved under Article 47 GDPR." },
		{ id: "code", label: "Approved code of conduct or certification (Art. 46(2)(e) or (f))", needsCopy: true,
		  text: "This transfer is not covered by an adequacy decision of the European Commission. It is covered by an approved code of conduct or certification mechanism with binding and enforceable commitments of the recipient (Article 46(2) GDPR)." },
		{ id: "other46", label: "Other Art. 46 safeguard", needsCopy: true, text: "" },
		{ id: "derog", label: "Derogation for a specific situation (Art. 49(1), first subparagraph)", needsCopy: false, text: "" },
		{ id: "compelling", label: "Compelling legitimate interests (Art. 49(1), second subparagraph)", needsCopy: false, text: "" }
	];
	/* Other Article 46 instruments (F31) and the Article 49(1) derogations (F10), verified 12 November 2026. */
	var ART46_OTHER = [
		{ v: "46-2-a", l: "Binding instrument between public authorities or bodies (Art. 46(2)(a))", t: "a legally binding and enforceable instrument between public authorities or bodies (Article 46(2)(a) GDPR)" },
		{ v: "46-3-a", l: "Contractual clauses authorised by a supervisory authority (Art. 46(3)(a))", t: "contractual clauses authorised by the competent supervisory authority (Article 46(3)(a) GDPR)" },
		{ v: "46-3-b", l: "Administrative arrangement between public authorities (Art. 46(3)(b))", t: "provisions in an administrative arrangement between public authorities or bodies, authorised by the competent supervisory authority (Article 46(3)(b) GDPR)" }
	];
	var ART49 = [
		{ v: "a", l: "(a) Explicit consent, after being informed of the risks", t: "you have explicitly consented to the transfer after we informed you of its risks (Article 49(1)(a) GDPR)", pub: true },
		{ v: "b", l: "(b) Necessary for a contract with the person", t: "the transfer is necessary to perform a contract with you, or to take steps you asked for before entering into one (Article 49(1)(b) GDPR)", pub: true },
		{ v: "c", l: "(c) Necessary for a contract in the person's interest", t: "the transfer is necessary to conclude or perform a contract made in your interest with another person (Article 49(1)(c) GDPR)", pub: true },
		{ v: "d", l: "(d) Important reasons of public interest", t: "the transfer is necessary for important reasons of public interest recognised in Union or Member State law (Article 49(1)(d) GDPR)" },
		{ v: "e", l: "(e) Legal claims", t: "the transfer is necessary to establish, exercise or defend legal claims (Article 49(1)(e) GDPR)" },
		{ v: "f", l: "(f) Vital interests, person incapable of consent", t: "the transfer is necessary to protect vital interests where the person concerned is physically or legally incapable of giving consent (Article 49(1)(f) GDPR)" },
		{ v: "g", l: "(g) Transfer from a public register", t: "the transfer is made from a register that, under Union or Member State law, provides information to the public (Article 49(1)(g) GDPR)" }
	];

	/* Rights texts. Verified against Articles 15 to 21 GDPR on 12 November 2026.
	   cond: when the right is stated as applying to this notice. */
	var RIGHTS = [
		{ id: "access", art: "Article 15", title: "Access",
		  text: "You can ask us to confirm whether we process personal data about you and, if we do, for a copy of it together with the purposes, the categories of data, the recipients, the retention period, its source and the other information listed in Article 15 GDPR." },
		{ id: "rect", art: "Article 16", title: "Rectification",
		  text: "You can ask us to correct inaccurate personal data about you without undue delay, and to complete incomplete data, including by giving us a supplementary statement." },
		{ id: "erase", art: "Article 17", title: "Erasure",
		  text: "You can ask us to delete personal data about you. We must do so where one of the grounds in Article 17(1) GDPR applies, for example where we no longer need the data, where you withdraw consent and no other legal ground applies, where you object and we have no overriding legitimate grounds, or where you object to direct marketing. The right does not apply where we must keep the data, for example to comply with a legal obligation or to establish, exercise or defend legal claims, and we tell you which exception applies." },
		{ id: "restrict", art: "Article 18", title: "Restriction",
		  text: "You can ask us to restrict processing while you contest the accuracy of the data, where the processing is unlawful and you prefer restriction to erasure, where you need the data for a legal claim that we no longer need it for, or while we check an objection you have made. Apart from storing it, we then use the data only with your consent, for legal claims, to protect another person's rights or for important reasons of public interest." },
		{ id: "port", art: "Article 20", title: "Data portability", cond: "port",
		  text: "Where we process data you gave us on the basis of your consent or of a contract, and by automated means, you can receive that data in a structured, commonly used and machine-readable format and have it sent to another organisation, directly where technically feasible." },
		{ id: "object", art: "Article 21", title: "Objection", cond: "object", text: "" }
	];

	/* ------------------------------------------------ regimes (matrix Parts J and K) ---
	   The privacy notice covers one or more of these laws. The first one ticked, in this
	   order, sets the main text; every other one adds a section of its own. */
	var REGIMES = [
		{ v: "eu", l: "EU and EEA: GDPR" },
		{ v: "uk", l: "United Kingdom: UK GDPR and Data Protection Act 2018" },
		{ v: "ch", l: "Switzerland: Federal Act on Data Protection (FADP)" },
		{ v: "br", l: "Brazil: General Data Protection Law (LGPD)" },
		{ v: "can", l: "Canada: PIPEDA, and the Quebec, Alberta and British Columbia private-sector laws" },
		{ v: "in", l: "India: Digital Personal Data Protection Act, 2023 (DPDP Act) and DPDP Rules, 2025" },
		{ v: "cn", l: "China: Personal Information Protection Law (PIPL)" },
		{ v: "jp", l: "Japan: Act on the Protection of Personal Information (APPI)" },
		{ v: "kr", l: "South Korea: Personal Information Protection Act (PIPA)" },
		{ v: "sg", l: "Singapore: Personal Data Protection Act 2012 (PDPA)" },
		{ v: "au", l: "Australia: Privacy Act 1988 and the Australian Privacy Principles (APPs)" },
		{ v: "za", l: "South Africa: Protection of Personal Information Act 4 of 2013 (POPIA)" },
		{ v: "ca", l: "California: California Consumer Privacy Act (CCPA)" },
		{ v: "us", l: "Other US states: state consumer privacy laws" }
	];

	/* UK GDPR Article 6(1)(ea), 6(5) and Annex 1: recognised legitimate interests. Paragraphs
	   4, 7 and 8 of Annex 1 are definitions. Read on legislation.gov.uk, 12 November 2026. */
	var UK_RLI = [
		{ v: "1", l: "Disclosure on request for a public task (Annex 1, para 1)", t: "disclosing personal data on request to another person who states that it needs the data for a task in the public interest or in the exercise of official authority that has a basis in law (Annex 1, paragraph 1, UK GDPR)" },
		{ v: "2", l: "National security, public security or defence (para 2)", t: "safeguarding national security, protecting public security or for defence purposes (Annex 1, paragraph 2, UK GDPR)" },
		{ v: "3", l: "Responding to an emergency (para 3)", t: "responding to an emergency (Annex 1, paragraph 3, UK GDPR)" },
		{ v: "5", l: "Crime: detecting, investigating, preventing, prosecuting (para 5)", t: "detecting, investigating or preventing crime, or apprehending or prosecuting offenders (Annex 1, paragraph 5, UK GDPR)" },
		{ v: "6", l: "Safeguarding a vulnerable individual (para 6)", t: "safeguarding a vulnerable individual (Annex 1, paragraph 6, UK GDPR)" }
	];

	/* UK GDPR Articles 44A, 45A, 46 (as amended), 47 and 49; DPA 2018 s.119A. The IDTA and the
	   Addendum are the standard clauses issued under s.119A; the regulator says to keep using the
	   current versions while it revises them. */
	var TRANSFER_MECH_UK = [
		{ id: "regs", label: "Approved by UK regulations (Art. 45A)", needsCopy: false, text: "" },
		{ id: "idta", label: "International Data Transfer Agreement (Art. 46(2)(d))", needsCopy: true,
		  text: "We use the International Data Transfer Agreement, standard data protection clauses issued under section 119A of the Data Protection Act 2018 (Article 46(2)(d) UK GDPR)." },
		{ id: "addendum", label: "UK Addendum to the EU standard contractual clauses (Art. 46(2)(d))", needsCopy: true,
		  text: "We use the European Commission's standard contractual clauses with the International Data Transfer Addendum, issued under section 119A of the Data Protection Act 2018 (Article 46(2)(d) UK GDPR)." },
		{ id: "bcr", label: "Binding corporate rules (Art. 47)", needsCopy: true,
		  text: "It is covered by binding corporate rules approved under Article 47 UK GDPR." },
		{ id: "other46", label: "Other Art. 46 safeguard", needsCopy: true, text: "" },
		{ id: "derog", label: "Derogation for a specific situation (Art. 49(1), first subparagraph)", needsCopy: false, text: "" },
		{ id: "compelling", label: "Compelling legitimate interests (Art. 49(1), second subparagraph)", needsCopy: false, text: "" }
	];
	var ART46_OTHER_UK = [
		{ v: "46-2-a", l: "Binding instrument between a public body and another relevant person (Art. 46(2)(a))", t: "a legally binding and enforceable instrument between a public body and another relevant person (Article 46(2)(a) UK GDPR)" },
		{ v: "46-2-c", l: "Standard clauses in regulations of the Secretary of State (Art. 46(2)(c))", t: "standard data protection clauses specified in regulations made by the Secretary of State (Article 46(2)(c) UK GDPR)" },
		{ v: "46-2-ef", l: "Approved code of conduct or certification (Art. 46(2)(e) or (f))", t: "an approved code of conduct or certification mechanism, with binding and enforceable commitments of the recipient (Article 46(2)(e) or (f) UK GDPR)" },
		{ v: "46-3-a", l: "Contractual clauses authorised by the Information Commission (Art. 46(3)(a))", t: "contractual clauses authorised by the Information Commission (Article 46(3)(a) UK GDPR)" },
		{ v: "46-3-b", l: "Administrative arrangement authorised by the Information Commission (Art. 46(3)(b))", t: "provisions in an administrative arrangement between a public body and another relevant person, authorised by the Information Commission (Article 46(3)(b) UK GDPR)" }
	];
	var ART49_UK = [
		{ v: "a", l: "(a) Explicit consent, after being informed of the risks", t: "you have explicitly consented to the transfer after we informed you of its risks (Article 49(1)(a) UK GDPR)", pub: true },
		{ v: "b", l: "(b) Necessary for a contract with the person", t: "the transfer is necessary to perform a contract with you, or to take steps you asked for before entering into one (Article 49(1)(b) UK GDPR)", pub: true },
		{ v: "c", l: "(c) Necessary for a contract in the person's interest", t: "the transfer is necessary to conclude or perform a contract made in your interest with another person (Article 49(1)(c) UK GDPR)", pub: true },
		{ v: "d", l: "(d) Important reasons of public interest", t: "the transfer is necessary for important reasons of public interest recognised in domestic law (Article 49(1)(d) and (4) UK GDPR)" },
		{ v: "e", l: "(e) Legal claims", t: "the transfer is necessary to establish, exercise or defend legal claims (Article 49(1)(e) UK GDPR)" },
		{ v: "f", l: "(f) Vital interests, person incapable of consent", t: "the transfer is necessary to protect vital interests where the person concerned is physically or legally incapable of giving consent (Article 49(1)(f) UK GDPR)" },
		{ v: "g", l: "(g) Transfer from a public register", t: "the transfer is made from a register that, under domestic law, provides information to the public (Article 49(1)(g) UK GDPR)" }
	];

	/* UK GDPR Article 22B: conditions for a significant decision based solely on automated
	   processing that uses special category data. */
	var UK_ADM_SPECIAL = [
		{ v: "consent", l: "Explicit consent to the processing of all the data it is based on (Art. 22B(2))", t: "the decision is based entirely on data you explicitly consented to us processing (Article 22B(2) UK GDPR)" },
		{ v: "g", l: "Contract, or required or authorised by law, and Art. 9(2)(g) applies (Art. 22B(3))", t: "it is necessary for a contract with you or required or authorised by law, and Article 9(2)(g) UK GDPR applies (Article 22B(3) UK GDPR)" },
		{ v: "none", l: "Neither", t: "" }
	];

	/* FADP Articles 16 and 17: grounds for disclosing personal data abroad. Article 19(4)
	   requires the State or international body and, if applicable, the guarantee or exception. */
	var CH_MECH = [
		{ v: "adequacy", l: "Adequate protection: listed by the Federal Council (Art. 16(1))" },
		{ v: "guarantee", l: "A guarantee under Art. 16(2)" },
		{ v: "exception", l: "An exception under Art. 17" }
	];
	var CH_GUAR = [
		{ v: "a", l: "(a) International treaty", t: "an international treaty (Article 16(2)(a) FADP)" },
		{ v: "b", l: "(b) Data protection clauses in a contract, notified to the FDPIC beforehand", t: "data protection clauses in a contract with the recipient, notified to the FDPIC beforehand (Article 16(2)(b) FADP)" },
		{ v: "c", l: "(c) Specific guarantees of a federal body, notified to the FDPIC beforehand", t: "specific guarantees drawn up by the competent federal body, notified to the FDPIC beforehand (Article 16(2)(c) FADP)" },
		{ v: "d", l: "(d) Standard data protection clauses approved, issued or recognised by the FDPIC", t: "standard data protection clauses approved, issued or recognised by the FDPIC (Article 16(2)(d) FADP)" },
		{ v: "e", l: "(e) Binding corporate rules approved by the FDPIC or an authority of an adequate State", t: "binding corporate rules approved by the FDPIC or by the data protection authority of a State with adequate protection (Article 16(2)(e) FADP)" },
		{ v: "code", l: "Code of conduct or certification (Art. 16(3); DPO Art. 12)", t: "an approved code of conduct or a certification, with a binding and enforceable commitment of the recipient to apply it (Article 16(3) FADP; Article 12 of the Data Protection Ordinance)" }
	];
	var CH_EXC = [
		{ v: "a", l: "(a) Explicit consent", t: "you have explicitly consented to the disclosure (Article 17(1)(a) FADP)" },
		{ v: "b1", l: "(b)(1) Contract with the person", t: "the disclosure is directly connected with concluding or performing a contract between us and you (Article 17(1)(b)(1) FADP)" },
		{ v: "b2", l: "(b)(2) Contract with a partner, in the person's interest", t: "the disclosure is directly connected with concluding or performing a contract between us and a contractual partner, in your interest (Article 17(1)(b)(2) FADP)" },
		{ v: "c1", l: "(c)(1) Overriding public interest", t: "the disclosure is necessary to safeguard an overriding public interest (Article 17(1)(c)(1) FADP)" },
		{ v: "c2", l: "(c)(2) Legal rights before a court or foreign authority", t: "the disclosure is necessary to establish, exercise or enforce legal rights before a court or another competent foreign authority (Article 17(1)(c)(2) FADP)" },
		{ v: "d", l: "(d) Life or physical integrity, consent not obtainable in time", t: "the disclosure is necessary to protect your life or physical integrity, or that of a third party, and your consent cannot be obtained within a reasonable time (Article 17(1)(d) FADP)" },
		{ v: "e", l: "(e) Data made generally accessible by the person", t: "you made the data generally accessible and did not explicitly prohibit its processing (Article 17(1)(e) FADP)" },
		{ v: "f", l: "(f) Data from a statutory public register", t: "the data comes from a statutory register that is public or open to persons with a legitimate interest, and the statutory requirements for access are met (Article 17(1)(f) FADP)" }
	];
	/* FADP Article 31: justifications. Stating them is optional; the FADP does not require a
	   legal basis for processing by private persons (Articles 30 and 31). */
	var CH_GROUNDS = [
		{ v: "consent", l: "Consent", t: "your consent" },
		{ v: "contract", l: "Contract with the person (Art. 31(2)(a))", t: "concluding or performing a contract with you (Article 31(2)(a) FADP)" },
		{ v: "law", l: "Required by law", t: "a legal requirement" },
		{ v: "private", l: "Overriding private interest (Art. 31(1))", t: "our overriding private interest (Article 31(1) FADP)" },
		{ v: "public", l: "Overriding public interest (Art. 31(1))", t: "an overriding public interest (Article 31(1) FADP)" }
	];
	/* FADP Article 21(3): when the duties on automated individual decisions do not apply. */
	var CH_ADM_EXC = [
		{ v: "none", l: "No exception: inform, and offer a hearing and a review" },
		{ v: "contract", l: "Directly connected with a contract with the person, and their request is granted (Art. 21(3)(a))" },
		{ v: "consent", l: "The person explicitly consented to the decision being automated (Art. 21(3)(b))" }
	];

	/* ------------------------------------------------------- Brazil (matrix Part N) ---
	   LGPD (Law 13,709/2018), consolidated text read on normas.leg.br on 12 November 2026,
	   and the ANPD resolutions on small agents (2/2022), the encarregado (18/2024) and
	   international transfers (19/2024). Article 7: legal bases. */
	var BR_BASES = [
		{ v: "I", l: "Consent (Art. 7, I)", t: "your consent (Article 7, I LGPD)" },
		{ v: "II", l: "Legal or regulatory obligation (Art. 7, II)", t: "compliance with a legal or regulatory obligation (Article 7, II LGPD)" },
		{ v: "III", l: "Public administration: public policies (Art. 7, III)", t: "carrying out public policies provided for in laws, regulations, contracts or similar instruments (Article 7, III LGPD)" },
		{ v: "IV", l: "Studies by a research body (Art. 7, IV)", t: "studies by a research body, with the data anonymised whenever we can (Article 7, IV LGPD)" },
		{ v: "V", l: "Contract, or preliminary procedures at the person's request (Art. 7, V)", t: "performing a contract with you, or preliminary procedures related to it at your request (Article 7, V LGPD)" },
		{ v: "VI", l: "Exercise of rights in judicial, administrative or arbitration proceedings (Art. 7, VI)", t: "the regular exercise of rights in judicial, administrative or arbitration proceedings (Article 7, VI LGPD)" },
		{ v: "VII", l: "Protection of life or physical safety (Art. 7, VII)", t: "protecting your life or physical safety, or that of another person (Article 7, VII LGPD)" },
		{ v: "VIII", l: "Health protection by health professionals, services or authorities (Art. 7, VIII)", t: "protecting health, in a procedure carried out by health professionals, health services or a health authority (Article 7, VIII LGPD)" },
		{ v: "IX", l: "Legitimate interests (Art. 7, IX)", t: "our legitimate interests, or those of a third party (Article 7, IX LGPD)" },
		{ v: "X", l: "Credit protection (Art. 7, X)", t: "credit protection (Article 7, X LGPD)" }
	];
	/* Article 11: sensitive personal data (Article 5, II). */
	var BR_SENS = [
		{ v: "I", l: "Specific and highlighted consent (Art. 11, I)", t: "your specific and highlighted consent, for these specific purposes (Article 11, I LGPD)" },
		{ v: "a", l: "Legal or regulatory obligation (Art. 11, II, a)", t: "it is indispensable for complying with a legal or regulatory obligation (Article 11, II, a LGPD)" },
		{ v: "b", l: "Public administration: public policies (Art. 11, II, b)", t: "it is indispensable for the shared processing of data needed to carry out public policies provided for in laws or regulations (Article 11, II, b LGPD)" },
		{ v: "c", l: "Studies by a research body (Art. 11, II, c)", t: "it is indispensable for studies by a research body, with the data anonymised whenever we can (Article 11, II, c LGPD)" },
		{ v: "d", l: "Exercise of rights, including in a contract and in proceedings (Art. 11, II, d)", t: "it is indispensable for the regular exercise of rights, including in a contract and in judicial, administrative or arbitration proceedings (Article 11, II, d LGPD)" },
		{ v: "e", l: "Protection of life or physical safety (Art. 11, II, e)", t: "it is indispensable for protecting your life or physical safety, or that of another person (Article 11, II, e LGPD)" },
		{ v: "f", l: "Health protection by health professionals, services or authorities (Art. 11, II, f)", t: "it is indispensable for protecting health, in a procedure carried out by health professionals, health services or a health authority (Article 11, II, f LGPD)" },
		{ v: "g", l: "Fraud prevention and security in identification and authentication (Art. 11, II, g)", t: "it is indispensable for preventing fraud and for your security in identification and authentication processes in electronic systems (Article 11, II, g LGPD)" }
	];
	/* Article 33: international transfers. Resolution 19/2024 regulates adequacy, standard and
	   specific clauses and global corporate rules; Article 17 of its Regulation adds a published
	   document and the full clauses on request within 15 days (Article 32: the same for specific
	   clauses and global corporate rules). Resolution 32/2026 recognises the European Union, which
	   covers the EU Member States, Iceland, Liechtenstein and Norway. */
	var BR_MECH = [
		{ v: "adequacy", l: "Adequacy decision of the ANPD (Art. 33, I)", t: "The ANPD has recognised the destination as providing an adequate level of protection (Article 33, I LGPD; Resolution CD/ANPD 32/2026)." },
		{ v: "scc", l: "Standard contractual clauses approved by the ANPD (Art. 33, II, b)", t: "The transfer is covered by the standard contractual clauses approved by the ANPD (Article 33, II, b LGPD; Resolution CD/ANPD 19/2024).", doc: true },
		{ v: "specific", l: "Specific contractual clauses approved by the ANPD (Art. 33, II, a)", t: "The transfer is covered by specific contractual clauses approved by the ANPD (Article 33, II, a LGPD).", doc: true },
		{ v: "bcr", l: "Global corporate rules approved by the ANPD (Art. 33, II, c)", t: "The transfer is covered by global corporate rules approved by the ANPD (Article 33, II, c LGPD).", doc: true },
		{ v: "seal", l: "Seals, certificates or codes of conduct (Art. 33, II, d)", t: "The transfer is covered by a seal, certificate or code of conduct (Article 33, II, d LGPD)." },
		{ v: "coop", l: "International legal cooperation between public intelligence, investigation and prosecution bodies (Art. 33, III)", t: "The transfer is necessary for international legal cooperation between public intelligence, investigation and prosecution bodies (Article 33, III LGPD)." },
		{ v: "life", l: "Protection of life or physical safety (Art. 33, IV)", t: "The transfer is necessary to protect your life or physical safety, or that of another person (Article 33, IV LGPD)." },
		{ v: "auth", l: "Authorised by the ANPD (Art. 33, V)", t: "The ANPD has authorised the transfer (Article 33, V LGPD)." },
		{ v: "agreement", l: "Commitment in an international cooperation agreement (Art. 33, VI)", t: "The transfer results from a commitment made in an international cooperation agreement (Article 33, VI LGPD)." },
		{ v: "policy", l: "Public policy or the legal attribution of a public service (Art. 33, VII)", t: "The transfer is necessary to carry out a public policy or the legal attribution of a public service (Article 33, VII LGPD)." },
		{ v: "consent", l: "Specific and highlighted consent, informed of the international character (Art. 33, VIII)", t: "You gave specific and highlighted consent to this transfer, after we told you about its international character (Article 33, VIII LGPD)." },
		{ v: "obligation", l: "Legal or regulatory obligation (Art. 33, IX, with Art. 7, II)", t: "The transfer is necessary to comply with a legal or regulatory obligation (Article 33, IX, with Article 7, II LGPD)." },
		{ v: "contract", l: "Contract, or preliminary procedures at the person's request (Art. 33, IX, with Art. 7, V)", t: "The transfer is necessary to perform a contract with you, or preliminary procedures related to it at your request (Article 33, IX, with Article 7, V LGPD)." },
		{ v: "proceedings", l: "Exercise of rights in judicial, administrative or arbitration proceedings (Art. 33, IX, with Art. 7, VI)", t: "The transfer is necessary for the regular exercise of rights in judicial, administrative or arbitration proceedings (Article 33, IX, with Article 7, VI LGPD)." }
	];
	/* Article 18: the nine rights. Article 9, VII requires each to be mentioned explicitly. */
	var RIGHTS_BR = [
		{ title: "Confirmation (Article 18, I).", text: "You can ask us to confirm whether we process your personal data." },
		{ title: "Access (Article 18, II).", text: "You can ask for access to your data." },
		{ title: "Correction (Article 18, III).", text: "You can ask us to correct incomplete, inaccurate or out-of-date data." },
		{ title: "Anonymisation, blocking or deletion (Article 18, IV).", text: "You can ask us to anonymise, block or delete data that is unnecessary or excessive, or processed in breach of the LGPD." },
		{ title: "Portability (Article 18, V).", text: "You can ask us, expressly, to transfer your data to another provider of a service or product, as regulated by the ANPD and respecting our trade and industrial secrets." },
		{ title: "Deletion of data processed with your consent (Article 18, VI).", text: "You can ask us to delete data we process on the basis of your consent, except where the law allows us to keep it (Article 16 LGPD)." },
		{ title: "Information on sharing (Article 18, VII).", text: "You can ask which public and private entities we have shared your data with." },
		{ title: "Information on refusing consent (Article 18, VIII).", text: "You can ask whether you can refuse consent and what happens if you do." },
		{ title: "Withdrawing consent (Article 18, IX).", text: "You can withdraw your consent at any time, free of charge and through an easy procedure (Article 8, paragraph 5 LGPD)." },
		{ title: "Objection (Article 18, paragraph 2).", text: "You can object to processing based on a legal basis other than consent if it does not comply with the LGPD." },
		{ title: "Review of automated decisions (Article 20).", text: "You can ask for a review of decisions taken solely on the basis of automated processing of your data that affect your interests, and for clear and adequate information on the criteria and procedures used." }
	];
	/* Resolution 32/2026, Article 1, sole paragraph: the EU Member States, Iceland, Liechtenstein
	   and Norway, and EU institutions, bodies and agencies (review R01). */
	var BR_EU = /\b(european union|eu|eea|european economic area|austria|belgium|bulgaria|croatia|cyprus|czech republic|czechia|denmark|estonia|finland|france|germany|greece|hungary|iceland|ireland|italy|latvia|liechtenstein|lithuania|luxembourg|malta|netherlands|norway|poland|portugal|romania|slovakia|slovenia|spain|sweden)\b/i;

	/* Canada (matrix Part O). Laws read on 12 November 2026: PIPEDA current to 19 October 2026;
	   Quebec's Act (CQLR c P-39.1) current to 15 October 2026; Alberta's PIPA current as of
	   1 September 2025; British Columbia's PIPA current to 10 November 2026. */
	var CAN_JUR = [
		{ v: "fed", l: "Federal: PIPEDA (commercial activity across Canada, federally regulated businesses, and personal information that crosses a provincial or national border)", n: "PIPEDA", reg: "Privacy Commissioner of Canada" },
		{ v: "qc", l: "Quebec: Act respecting the protection of personal information in the private sector", n: "Quebec's Act respecting the protection of personal information in the private sector", reg: "Commission d'acc\u00e8s \u00e0 l'information du Qu\u00e9bec" },
		{ v: "ab", l: "Alberta: Personal Information Protection Act (PIPA)", n: "Alberta's Personal Information Protection Act", reg: "Information and Privacy Commissioner of Alberta" },
		{ v: "bc", l: "British Columbia: Personal Information Protection Act (PIPA)", n: "British Columbia's Personal Information Protection Act", reg: "Information and Privacy Commissioner for British Columbia" }
	];
	/* India (matrix Part P). The DPDP Act, 2023 and the DPDP Rules, 2025 (G.S.R. 846(E)), read on
	   MeitY's Gazette copies on 12 November 2026. Section 4: consent, or a legitimate use in section 7.
	   t: the words the notice prints; sec: the clause cited. */
	var IN_GROUNDS = [
		{ v: "consent", l: "Consent (section 6)" },
		{ v: "7a", l: "Section 7(a): the person gave the data voluntarily for this purpose and has not said they do not consent", t: "you gave us this personal data voluntarily for this purpose", sec: "7(a)" },
		{ v: "7b", l: "Section 7(b): the State provides a subsidy, benefit, service, certificate, licence or permit", t: "to provide or issue you a subsidy, benefit, service, certificate, licence or permit", sec: "7(b)" },
		{ v: "7c", l: "Section 7(c): a function of the State under law, or sovereignty, integrity or security of the State", t: "to perform a function of the State under law, or in the interest of the sovereignty and integrity of India or the security of the State", sec: "7(c)" },
		{ v: "7d", l: "Section 7(d): a legal obligation to disclose information to the State", t: "to fulfil a legal obligation to disclose information to the State", sec: "7(d)" },
		{ v: "7e", l: "Section 7(e): complying with a judgment, decree or order", t: "to comply with a judgment, decree or order", sec: "7(e)" },
		{ v: "7f", l: "Section 7(f): a medical emergency", t: "to respond to a medical emergency involving a threat to life or health", sec: "7(f)" },
		{ v: "7g", l: "Section 7(g): medical treatment or health services during an epidemic or other threat to public health", t: "to provide medical treatment or health services during an epidemic, outbreak of disease or other threat to public health", sec: "7(g)" },
		{ v: "7h", l: "Section 7(h): safety or assistance during a disaster or a breakdown of public order", t: "to ensure safety or provide assistance during a disaster or a breakdown of public order", sec: "7(h)" },
		{ v: "7i", l: "Section 7(i): employment, or safeguarding the employer from loss or liability", t: "for employment, or to safeguard us as employer from loss or liability", sec: "7(i)" }
	];
	/* PIPL Article 13(1): the grounds for processing. Consent is (1); the others need no consent
	   (Article 13, second paragraph). t: wording in the notice. Read in Chinese on cac.gov.cn, 12 November 2026. */
	var CN_BASES = [
		{ v: "consent", l: "Consent (Article 13(1)(1))", t: "your consent", sec: "13(1)(1)" },
		{ v: "contract", l: "Necessary to conclude or perform a contract with the person (Article 13(1)(2))", t: "necessary to conclude or perform a contract to which you are a party", sec: "13(1)(2)" },
		{ v: "hr", l: "Necessary for human resources management under lawful labour rules and collective contracts (Article 13(1)(2))", t: "necessary for human resources management under our labour rules and collective contracts, made in accordance with the law", sec: "13(1)(2)" },
		{ v: "legal", l: "Necessary to perform statutory duties or obligations (Article 13(1)(3))", t: "necessary to perform our statutory duties or statutory obligations", sec: "13(1)(3)" },
		{ v: "emergency", l: "Public health emergency, or protecting life, health and property in an emergency (Article 13(1)(4))", t: "necessary to respond to a public health emergency, or to protect the life, health and property of people in an emergency", sec: "13(1)(4)" },
		{ v: "news", l: "News reporting, supervision by public opinion and similar acts in the public interest (Article 13(1)(5))", t: "news reporting, supervision by public opinion and similar acts in the public interest, within a reasonable scope", sec: "13(1)(5)" },
		{ v: "public", l: "Information the person disclosed, or that was lawfully disclosed, within a reasonable scope (Article 13(1)(6))", t: "processing, within a reasonable scope, personal information you disclosed yourself or that was otherwise lawfully disclosed", sec: "13(1)(6)" },
		{ v: "law", l: "Another case provided for by a law or administrative regulation (Article 13(1)(7))", t: "provided for by a law or administrative regulation", sec: "13(1)(7)" }
	];
	/* APPI Art. 20(2) and Cabinet Order Art. 9: acquiring special care-required personal information. t: wording
	   in the notice; ref: the provision. Read in Japanese on e-Gov, 12 November 2026. */
	var JP_SENS_GROUNDS = [
		{ v: "consent", l: "Prior consent (Art. 20(2))", t: "With your prior consent", ref: "Article 20(2)" },
		{ v: "law", l: "Based on a law (Art. 20(2)(i))", t: "As a law requires or permits", ref: "Article 20(2)(i)" },
		{ v: "life", l: "Protecting life, body or property, consent hard to obtain (Art. 20(2)(ii))", t: "To protect a person's life, body or property, where your consent is hard to obtain", ref: "Article 20(2)(ii)" },
		{ v: "health", l: "Public health or children's healthy development, consent hard to obtain (Art. 20(2)(iii))", t: "To improve public health or promote children's healthy development, where your consent is hard to obtain", ref: "Article 20(2)(iii)" },
		{ v: "state", l: "Cooperating with the State, a local government or a person they entrust (Art. 20(2)(iv))", t: "To cooperate with a national or local government body, or a person it entrusts, carrying out duties under the law, where asking for consent would hinder them", ref: "Article 20(2)(iv)" },
		{ v: "academic", l: "Academic research (Art. 20(2)(v), (vi))", t: "For academic research by, or jointly with, an academic research institution", ref: "Article 20(2)(v), (vi)" },
		{ v: "published", l: "Made public by the person, a public body, the media or others listed (Art. 20(2)(vii))", t: "The information has been made public by you, a public body, the media or another person the law lists", ref: "Article 20(2)(vii)" },
		{ v: "visible", l: "Evident from the person's appearance when seen or filmed (Art. 20(2)(viii); Cabinet Order Art. 9(i))", t: "It is evident from your appearance when we see or film you", ref: "Article 20(2)(viii); Cabinet Order Article 9(i)" },
		{ v: "received", l: "Received from a business that entrusts it, transfers its business or uses it jointly (Art. 20(2)(viii); Cabinet Order Art. 9(ii))", t: "We receive it from another business that entrusts us with it, transfers its business to us or uses it jointly with us", ref: "Article 20(2)(viii); Cabinet Order Article 9(ii)" }
	];
	/* APPI Art. 27: the basis for providing personal data to a third party. */
	var JP_PROV = [
		{ v: "consent", l: "Prior consent (Art. 27(1))", t: "We provide it with your prior consent (Article 27(1))." },
		{ v: "law", l: "Based on a law (Art. 27(1)(i))", t: "We provide it as a law requires or permits (Article 27(1)(i))." },
		{ v: "exception", l: "Another exception in Art. 27(1)(ii) to (vii)", t: "We provide it in a case Article 27(1)(ii) to (vii) allows without consent." },
		{ v: "joint", l: "Joint use (Art. 27(5)(iii))", t: "" },
		{ v: "optout", l: "Opt-out provision filed with the PPC (Art. 27(2))", t: "" }
	];
	/* APPI Art. 28; Rules Arts. 15, 16; PPC Notice No. 1 of 2019 (EEA states and the United Kingdom). */
	var JP_XBASIS = [
		{ v: "designated", l: "Designated country: an EEA state or the United Kingdom (Art. 28(1); PPC Notice No. 1 of 2019)" },
		{ v: "contract", l: "Recipient that ensures equivalent measures through a contract, group rules or another appropriate and reasonable method (Rules Art. 16(i))" },
		{ v: "framework", l: "Recipient recognised under an international framework, such as APEC CBPR (Rules Art. 16(ii))" },
		{ v: "consent", l: "Consent, given after information on the country (Art. 28(1), (2))" },
		{ v: "exception", l: "A case in Art. 27(1) (law, life, public health, government, academic)" }
	];
	/* PIPA Art. 15(1): the bases for collecting and using personal information. t: wording in the notice;
	   ref: the provision. Read in Korean on law.go.kr, 12 November 2026 (version in force on 11 September 2026). */
	var KR_BASES = [
		{ v: "consent", l: "Consent (Article 15(1)(1))", t: "Your consent", ref: "Article 15(1)(1)" },
		{ v: "law", l: "A special provision of law, or unavoidable to comply with a legal obligation (Article 15(1)(2))", t: "A special provision of law, or a legal obligation", ref: "Article 15(1)(2)" },
		{ v: "public", l: "Unavoidable for a public institution's duties under law (Article 15(1)(3))", t: "Unavoidable for our duties as a public institution under the law", ref: "Article 15(1)(3)" },
		{ v: "contract", l: "Needed to perform a contract with the person, or for steps they ask for while concluding one (Article 15(1)(4))", t: "Needed to perform a contract with you, or to take steps you ask for while we conclude one", ref: "Article 15(1)(4)" },
		{ v: "vital", l: "Clearly needed to protect life, body or property urgently (Article 15(1)(5))", t: "Clearly needed to protect your life, body or property, or someone else's, urgently", ref: "Article 15(1)(5)" },
		{ v: "legit", l: "Legitimate interests that clearly override the person's rights (Article 15(1)(6))", t: "Needed for our legitimate interests, which clearly override your rights, substantially related to them and within a reasonable scope", ref: "Article 15(1)(6)" },
		{ v: "safety", l: "Urgently needed for public safety, such as public health (Article 15(1)(7))", t: "Urgently needed for public safety, such as public health", ref: "Article 15(1)(7)" }
	];
	/* PIPA Arts. 17(1), (4) and 18(2): the basis for providing personal information to a third party. Article 18(2)(5) to (9)
	   are for public institutions only and not offered (review K02). */
	var KR_PROV = [
		{ v: "consent", l: "Consent (Art. 17(1)(1))", t: "with your consent", ref: "Article 17(1)(1)" },
		{ v: "collected", l: "Within the purposes of data collected under Art. 15(1)(2), (3) or (5) to (7), not contract data (Art. 17(1)(2))", t: "within the purposes for which we collected it under a law or legal obligation, for urgent interests, for our legitimate interests or for public safety", ref: "Article 17(1)(2)" },
		{ v: "related", l: "Reasonably related to the original purpose (Art. 17(4))", t: "within a scope reasonably related to the purpose for which we collected it", ref: "Article 17(4); Enforcement Decree Article 14-2" },
		{ v: "sep", l: "Beyond the original purpose: separate consent (Art. 18(2)(1))", t: "beyond the original purpose, with your separate consent", ref: "Article 18(2)(1)" },
		{ v: "otherlaw", l: "Beyond the original purpose: another law's special provision, such as a warrant (Art. 18(2)(2))", t: "beyond the original purpose, because another law specifically provides for it", ref: "Article 18(2)(2)" },
		{ v: "urgent", l: "Beyond the original purpose: urgent life, body or property (Art. 18(2)(3))", t: "beyond the original purpose, where clearly needed to protect the urgent life, body or property interests of you or someone else", ref: "Article 18(2)(3)" },
		{ v: "safety", l: "Beyond the original purpose: urgent public safety (Art. 18(2)(10))", t: "beyond the original purpose, where urgently needed for public safety, such as public health", ref: "Article 18(2)(10)" }
	];
	/* PIPA Art. 28-8(1): the basis for a transfer abroad. The PIPC recognised the EU and EEA states as equivalent on
	   16 September 2025, until 15 September 2028, excluding resident registration numbers and personal credit
	   information (PIPC announcement No. 2025-68, through a law firm update and news reports; review K03). */
	var KR_XBASIS = [
		{ v: "consent", l: "Separate consent to the transfer (Art. 28-8(1)(1))", ref: "Article 28-8(1)(1)" },
		{ v: "law", l: "A law, or a treaty or international agreement Korea is party to (Art. 28-8(1)(2))", ref: "Article 28-8(1)(2)" },
		{ v: "contract", l: "Entrusted processing or storage, including on your own systems, needed for a contract with the person, disclosed in this policy (Art. 28-8(1)(3))", ref: "Article 28-8(1)(3)" },
		{ v: "cert", l: "The recipient holds a certification the PIPC designates (Art. 28-8(1)(4))", ref: "Article 28-8(1)(4)" },
		{ v: "equiv", l: "The PIPC recognises the country's protection as equivalent: the EU and EEA states, until 15 September 2028 (Art. 28-8(1)(5))", ref: "Article 28-8(1)(5)" }
	];
	/* PDPA ss. 13 to 17 and the First Schedule: how the Act allows each purpose. t: wording in the policy;
	   ref: the provision. Read on sso.agc.gov.sg, 13 November 2026 (2020 Revised Edition, current version). */
	var SG_BASES = [
		{ v: "consent", l: "Consent (sections 13 and 14)", t: "Your consent", ref: "sections 13 and 14" },
		{ v: "deemed", l: "Deemed consent: the person gives the data voluntarily for this purpose (section 15(1))", t: "Deemed consent: you give it to us for this purpose", ref: "section 15(1)" },
		{ v: "contract", l: "Deemed consent for a contract: disclosure to another organisation, and its collection and use, reasonably necessary to conclude or perform a contract with the person; not your own collection or use (section 15(3) to (8))", t: "Deemed consent: disclosure to other organisations reasonably necessary for a contract with you", ref: "section 15(3) to (8)" },
		{ v: "notify", l: "Deemed consent by notification, with an opt-out period (section 15A)", t: "Deemed consent by notification", ref: "section 15A" },
		{ v: "li", l: "Legitimate interests, yours or another person's (First Schedule, Part 3, paragraph 1)", t: "Legitimate interests", ref: "First Schedule, Part 3, paragraph 1" },
		{ v: "bip", l: "Business improvement: using personal data to improve or develop goods, services or processes, or to understand or personalise for customers (First Schedule, Part 5; for an organisation that is not a corporation, Second Schedule, Part 2, Division 2)", t: "Business improvement", ref: "First Schedule, Part 5" },
		{ v: "employ", l: "Entering into, managing or ending employment or an appointment (First Schedule, Part 3, paragraph 10)", t: "Reasonable for entering into, managing or ending your employment or appointment", ref: "First Schedule, Part 3, paragraph 10" },
		{ v: "exception", l: "Another exception in the First or Second Schedule (section 17)", t: "An exception to consent", ref: "section 17" },
		{ v: "law", l: "Required or authorised by another written law (section 13(b))", t: "Required or authorised by law", ref: "section 13(b)" }
	];
	/* PDPA s. 26; Personal Data Protection Regulations 2021, regs 9 to 12 (reg 12 as amended by S 86/2026). */
	var SG_XBASIS = [
		{ v: "contract", l: "A contract requiring a comparable standard and naming the countries (regulation 11(1)(b), (2))" },
		{ v: "bcr", l: "Binding corporate rules, for related recipients (regulation 11(1)(c), (3))" },
		{ v: "law", l: "The law that applies to the recipient (regulation 11(1)(a))" },
		{ v: "instrument", l: "Another legally binding instrument (regulation 11(1)(d))" },
		{ v: "cert", l: "A certification the recipient holds: CBPR, or PRP for a data intermediary (regulation 12)" },
		{ v: "consent", l: "Consent to the transfer, after a written summary of the protection (regulation 10(2)(a), (3))" },
		{ v: "contractNeed", l: "Deemed consent to the disclosure to that recipient, reasonably necessary for a contract with the person (section 15(3) to (8); regulation 10(2)(b))" },
		{ v: "vital", l: "Needed for vital interests or the national interest (regulation 10(2)(c))" },
		{ v: "transit", l: "Data in transit: it only passes through Singapore on its way abroad (regulations 9, 10(2)(d))" },
		{ v: "public", l: "Publicly available in Singapore (regulation 10(2)(e))" },
		{ v: "exempt", l: "Exempted by written notice of the PDPC (section 26(2))" },
		{ v: "own", l: "Our own systems or offices abroad: no other organisation receives it (regulation 9)" }
	];
	/* Privacy Act 1988 (Cth), Compilation No. 104: APP 3.3, 3.4 and s. 6(1) (sensitive information); s. 16A (permitted
	   general situations, items 1 to 5 for organisations); APP 8 and s. 16C; ss. 6C to 6EA (small business). Read on
	   legislation.gov.au, 13 November 2026. */
	var AU_SENS = [
		{ v: "none", l: "No sensitive information" },
		{ v: "consent", l: "Sensitive information, with consent (APP 3.3(a))" },
		{ v: "law", l: "Sensitive information, required or authorised by an Australian law or a court or tribunal order (APP 3.4(a))" },
		{ v: "pgs", l: "Sensitive information, in a permitted general situation (APP 3.4(b); s. 16A)" },
		{ v: "phs", l: "Health information, in a permitted health situation (APP 3.4(c); s. 16B)" },
		{ v: "nonprofit", l: "Sensitive information, by a non-profit organisation about its members or regular contacts (APP 3.4(e))" }
	];
	var AU_PGS = [
		{ v: "1", l: "Lessening or preventing a serious threat to life, health or safety, where consent is unreasonable or impracticable (item 1)" },
		{ v: "2", l: "Taking action on suspected unlawful activity or serious misconduct (item 2)" },
		{ v: "3", l: "Helping locate a person reported as missing (item 3)" },
		{ v: "4", l: "Establishing, exercising or defending a legal or equitable claim (item 4)" },
		{ v: "5", l: "A confidential alternative dispute resolution process (item 5)" }
	];
	var AU_XBASIS = [
		{ v: "steps", l: "Reasonable steps, such as contract terms, so the recipient does not breach the APPs; we stay accountable (APP 8.1; s. 16C)" },
		{ v: "similar", l: "The recipient is bound by a law or binding scheme substantially similar to the APPs, which people can enforce (APP 8.2(a))" },
		{ v: "consent", l: "Consent, after telling the person expressly that APP 8.1 will not apply (APP 8.2(b))" },
		{ v: "law", l: "Required or authorised by an Australian law or a court or tribunal order (APP 8.2(c))" },
		{ v: "pgs", l: "A permitted general situation, items 1 to 3 of s. 16A (APP 8.2(d))" },
		{ v: "prescribed", l: "A country or binding scheme prescribed by the regulations (APP 8.2(aa), 8.3): none is prescribed yet" },
		{ v: "storage", l: "Storage only: a provider holds it for us under a contract limiting it to storage, and we keep effective control (a use, not a disclosure: APP Guidelines 8.14)" },
		{ v: "own", l: "Our own offices or systems abroad: no other entity receives it (not a disclosure: APP Guidelines 8.6)" }
	];
	var AU_SB = [
		{ v: "none", l: "None of these" },
		{ v: "earlier", l: "Our turnover was more than $3,000,000 in a financial year since we started the business (s. 6D(4)(a))" },
		{ v: "health", l: "We provide a health service and hold health information other than in employee records (s. 6D(4)(b))" },
		{ v: "trade", l: "We disclose personal information for a benefit, service or advantage, or give one to collect it (s. 6D(4)(c), (d))" },
		{ v: "cth", l: "We are a contracted service provider for a Commonwealth contract (s. 6D(4)(e))" },
		{ v: "crb", l: "We are a credit reporting body (s. 6D(4)(f))" },
		{ v: "related", l: "We are related to a body corporate whose business is not a small business (s. 6D(9))" },
		{ v: "aml", l: "We are an AML/CTF reporting entity, or the authorised agent of one (s. 6E(1A))" },
		{ v: "other6e", l: "A protected action ballot agent, a registered association of employees, a consumer data right accredited person, or prescribed by regulations (s. 6E)" },
		{ v: "optin", l: "We chose to be treated as an organisation, registered by the Commissioner (s. 6EA)" }
	];
	/* Protection of Personal Information Act 4 of 2013 (Gazette 37067): s. 11(1) bases; ss. 26 to 33 (special personal
	   information); ss. 34, 35 (children); s. 72(1) (transborder flows); s. 15 (further processing); s. 69 (electronic direct
	   marketing); s. 71(2) (automated decisions). Read on gov.za, 13 November 2026. */
	var ZA_BASES = [
		{ v: "consent", l: "Consent, or a competent person's consent for a child (s. 11(1)(a))" },
		{ v: "contract", l: "Necessary to conclude or perform a contract with the person (s. 11(1)(b))" },
		{ v: "law", l: "Complies with an obligation the law imposes on us (s. 11(1)(c))" },
		{ v: "dsli", l: "Protects a legitimate interest of the person (s. 11(1)(d))" },
		{ v: "public", l: "Necessary for the proper performance of a public law duty by a public body (s. 11(1)(e))" },
		{ v: "li", l: "Necessary for our legitimate interests, or those of a third party we supply it to (s. 11(1)(f))" }
	];
	var ZA_SPECIAL = [
		{ v: "none", l: "No special personal information" },
		{ v: "consent", l: "Special personal information, with consent (s. 27(1)(a))" },
		{ v: "right", l: "Necessary to establish, exercise or defend a right or obligation in law (s. 27(1)(b))" },
		{ v: "intl", l: "Necessary to comply with an obligation of international public law (s. 27(1)(c))" },
		{ v: "research", l: "Historical, statistical or research purposes in the public interest, with guarantees (s. 27(1)(d))" },
		{ v: "public", l: "Deliberately made public by the person (s. 27(1)(e))" },
		{ v: "specific", l: "Allowed by the section for that kind of information, sections 28 to 33 (s. 27(1)(f))" },
		{ v: "auth", l: "An authorisation from the Information Regulator (s. 27(2))" }
	];
	var ZA_SPECIAL_SEC = [
		{ v: "28", l: "Religious or philosophical beliefs (s. 28)" },
		{ v: "29", l: "Race or ethnic origin (s. 29)" },
		{ v: "30", l: "Trade union membership (s. 30)" },
		{ v: "31", l: "Political persuasion (s. 31)" },
		{ v: "32", l: "Health or sex life (s. 32)" },
		{ v: "33", l: "Criminal behaviour or biometric information (s. 33)" }
	];
	var ZA_KIDS = [
		{ v: "competent", l: "Prior consent of a competent person, such as a parent or guardian (s. 35(1)(a))" },
		{ v: "right", l: "Necessary to establish, exercise or defend a right or obligation in law (s. 35(1)(b))" },
		{ v: "intl", l: "Necessary to comply with an obligation of international public law (s. 35(1)(c))" },
		{ v: "research", l: "Historical, statistical or research purposes in the public interest, with guarantees (s. 35(1)(d))" },
		{ v: "public", l: "Deliberately made public by the child with a competent person's consent (s. 35(1)(e))" },
		{ v: "auth", l: "An authorisation from the Information Regulator (s. 35(2))" }
	];
	var ZA_XBASIS = [
		{ v: "law", l: "The recipient is subject to a law that gives adequate protection (s. 72(1)(a))" },
		{ v: "bcr", l: "Binding corporate rules within our group give adequate protection (s. 72(1)(a), (2))" },
		{ v: "agreement", l: "A binding agreement with the recipient gives adequate protection (s. 72(1)(a))" },
		{ v: "consent", l: "The person consents (s. 72(1)(b))" },
		{ v: "contract", l: "Necessary for a contract with the person, or for steps before one at their request (s. 72(1)(c))" },
		{ v: "contract3", l: "Necessary for a contract in the person's interest between us and a third party (s. 72(1)(d))" },
		{ v: "benefit", l: "For the person's benefit, consent not reasonably practicable, and they would be likely to give it (s. 72(1)(e))" },
		{ v: "own", l: "Our own offices or systems outside South Africa: no third party receives it" }
	];
	var ZA_FURTHER = [
		{ v: "compatible", l: "Compatible with the purpose of collection (s. 15(1), (2))" },
		{ v: "consent", l: "Consent first (s. 15(3)(a))" },
		{ v: "public", l: "In a public record, or deliberately made public by the person (s. 15(3)(b))" },
		{ v: "law", l: "Law enforcement, an obligation imposed by law, court proceedings or national security (s. 15(3)(c))" },
		{ v: "threat", l: "A serious and imminent threat to public health or safety, or to someone's life or health (s. 15(3)(d))" },
		{ v: "research", l: "Historical, statistical or research purposes, not published in identifiable form (s. 15(3)(e))" },
		{ v: "exempt", l: "An exemption granted by the Information Regulator (s. 15(3)(f); s. 37)" }
	];
	var ZA_DM = [
		{ v: "none", l: "We do not market by electronic communication" },
		{ v: "consent", l: "Only to people who consented (s. 69(1)(a))" },
		{ v: "customers", l: "Only to our customers, about our own similar products or services (s. 69(1)(b), (3))" },
		{ v: "both", l: "To people who consented, and to customers about our own similar products or services (s. 69(1))" }
	];
	var ZA_ADM = [
		{ v: "contract_met", l: "In connection with a contract, where the person's request under the contract has been met (s. 71(2)(a)(i))" },
		{ v: "contract_measures", l: "In connection with a contract, with measures that protect the person's legitimate interests (s. 71(2)(a)(ii), (3))" },
		{ v: "law", l: "Governed by a law or code of conduct that sets such measures (s. 71(2)(b))" }
	];
	/* Rule 8(1) and the Third Schedule. svc: the service named in the notice. */
	var IN_ERASE = [
		{ v: "none", l: "None of these" },
		{ v: "ecom", l: "E-commerce entity with at least two crore (20 million) registered users in India", svc: "e-commerce platform" },
		{ v: "gaming", l: "Online gaming intermediary with at least fifty lakh (5 million) registered users in India", svc: "online gaming platform" },
		{ v: "social", l: "Social media intermediary with at least two crore (20 million) registered users in India", svc: "social media platform" }
	];
	var CAN_CONSENT = [
		{ v: "express", l: "Express consent: the person actively agrees (opt-in)" },
		{ v: "implied", l: "Implied consent: the purpose is obvious and the person provides the information for it" },
		{ v: "optout", l: "Opt-out: the person is told and can decline" },
		{ v: "none", l: "Without consent: a provision of the law allows it" }
	];
	var RIGHTS_CAN = {
		fed: [
			{ title: "Access (PIPEDA principle 4.9; section 8).", text: "You can ask whether we hold personal information about you, see it, and get an account of how we have used it and of the third parties we have disclosed it to." },
			{ title: "Correction (principle 4.9.5).", text: "You can challenge the accuracy and completeness of your information and have it amended. Where appropriate, we pass the amendment on to third parties that have access to it." },
			{ title: "Withdrawing consent (principle 4.3.8).", text: "You can withdraw your consent at any time, subject to legal or contractual restrictions and reasonable notice." },
			{ title: "Alternative format (section 10).", text: "If you have a sensory disability, you can ask for your personal information in an alternative format." }
		],
		qc: [
			{ title: "Access (section 27).", text: "You can ask whether we hold personal information about you, and receive it, including a written and intelligible transcript of computerised information. If you have a disability, we provide reasonable accommodation on request so you can exercise this right." },
			{ title: "Portability (section 27).", text: "You can ask for computerised personal information you gave us, not information we created or inferred from it, in a structured, commonly used technological format, sent to you or to a person or body authorised by law to collect it, unless this raises serious practical difficulties." },
			{ title: "Rectification (section 28).", text: "You can ask us to correct information that is inaccurate, incomplete or equivocal, or whose collection, communication or keeping the law does not authorise." },
			{ title: "Withdrawing consent (section 8).", text: "You can withdraw your consent to our use or communication of your personal information." },
			{ title: "Ceasing dissemination and de-indexing (section 28.1).", text: "You can ask us to stop disseminating your personal information, or to de-index a hyperlink to it, where its dissemination breaks the law or a court order, or causes serious injury to your reputation or privacy that clearly outweighs the public interest in it and freedom of expression." },
			{ title: "Information on request (sections 7 and 8).", text: "You can ask us for the personal information we collected from you, the categories of people within our organisation who have access to it, how long we keep it, the contact details of our person in charge, and the source of information we obtained from another organisation." }
		],
		ab: [
			{ title: "Access (section 24).", text: "You can ask for your personal information, and for information about its use and disclosure: the purposes for which we have used it, and the persons to whom and the circumstances in which we have disclosed it." },
			{ title: "Correction (section 25).", text: "You can ask us to correct an error or omission in your personal information." },
			{ title: "Withdrawing or varying consent (section 9).", text: "On reasonable notice, you can withdraw or vary your consent at any time, unless that would frustrate the performance of a legal obligation. We tell you the likely consequences, unless they are obvious." },
			{ title: "Our policies (section 6).", text: "You can ask for written information about our privacy policies and practices, including those on service providers outside Canada." }
		],
		bc: [
			{ title: "Access (section 23).", text: "You can ask for your personal information, information about the ways we have used and are using it, and the names of the individuals and organisations we have disclosed it to." },
			{ title: "Correction (section 24).", text: "You can ask us to correct an error or omission in your personal information. If we correct it, we send the correction to every organisation we disclosed it to in the year before." },
			{ title: "Withdrawing consent (section 9).", text: "On reasonable notice, you can withdraw your consent at any time, unless withdrawing would frustrate a legal obligation. We tell you the likely consequences." },
			{ title: "Our policies (section 5).", text: "You can ask for information about our privacy policies and practices and our complaint process." }
		]
	};
	var CAN_REQ = {
		fed: "Under PIPEDA we respond within 30 days. We can extend that by up to 30 days, or longer to convert the information into an alternative format; if we do, we tell you within the first 30 days, with our reasons and your right to complain to the Privacy Commissioner. Access is free or at minimal cost; if there is a cost, we tell you the approximate amount first, and you can withdraw your request. If we refuse, we tell you why in writing, and what recourse you have (PIPEDA sections 8 and 10; principle 4.9.4).",
		qc: "Under Quebec's Act, send your request to our person in charge of the protection of personal information, with proof of your identity. If your request is not precise enough, we help you identify the information you want. We reply in writing within 30 days; if we do not, your request is treated as refused. Access is free; for transcribing, reproducing or transmitting the information we can charge a reasonable fee, and we tell you the approximate amount first. If we refuse, we give our reasons, the provision of the law we rely on, the remedies open to you and the time limit for using them, and on request we help you understand the refusal (sections 30 and 32 to 34).",
		ab: "Under Alberta's PIPA, we respond within 45 days, or within the longer period the Act allows if we extend it. We can charge a reasonable fee for access, never for a correction or for personal employee information, and we give you a written estimate first (sections 26, 28, 31 and 32).",
		bc: "Under British Columbia's PIPA, give enough detail for us to identify you and the information you want. We respond within 30 days, or within the longer period the Act allows if we extend it. We can charge a minimal fee for access, never for employee personal information, and we give you a written estimate first (sections 27, 29, 31 and 32)."
	};
	var CAN_COMPLAIN = {
		fed: "File a written complaint about our handling of your personal information. If it is about a refused access request, file it within six months of the refusal, or a longer period the Commissioner allows (PIPEDA section 11; priv.gc.ca).",
		qc: "Ask it to examine a disagreement about access, rectification or ceasing dissemination, generally within 30 days of our refusal or of the end of the time we had to reply (Quebec's Act, sections 42 and 43). You can also file a complaint with it, anonymously if you wish (section 81; cai.gouv.qc.ca).",
		ab: "Ask it to review our decision, act or failure to act on your request, generally in writing within 30 days of being told of our decision, or file a written complaint (Alberta PIPA, sections 46 and 47; oipc.ab.ca).",
		bc: "Ask it to review our decision, act or failure to act on your request, generally within 30 days of being told of it, or make a complaint (British Columbia PIPA, sections 46 and 47; oipc.bc.ca)."
	};

	/* FADP rights texts. Verified against Articles 25, 28, 30, 31 and 32 FADP and Articles 16, 18
	   and 19 of the Data Protection Ordinance on 12 November 2026. */
	var RIGHTS_CH = [
		{ id: "info", title: "Information (Article 25 FADP).",
		  text: "You can ask us whether we process personal data about you. If we do, we tell you what you need to exercise your rights, at least our identity and contact details, the data itself, the purpose, the retention period or the criteria for it, the source where we did not collect the data from you, whether we took an automated individual decision and its logic, and the recipients, including each State or international body abroad and the guarantee or exception relied on. Ask in writing; electronically is fine. We reply within 30 days and free of charge. If we cannot reply within 30 days, we tell you and say when you will hear from us. Where replying involves a disproportionate cost, we can ask you to contribute up to CHF 300. We tell you the amount first; if you do not confirm your request within ten days, it is treated as withdrawn at no cost. If you confirm, the 30 days start when the ten days end (Articles 16, 18 and 19 of the Data Protection Ordinance)." },
		{ id: "port", title: "Data portability (Article 28 FADP).",
		  text: "Where we process by automated means data you disclosed to us, with your consent or in direct connection with a contract with you, you can receive it in a conventional electronic format, or ask us to transfer it to another controller where that does not require disproportionate effort. We do this free of charge and within 30 days, on the same terms as a request for information (Article 28(3) FADP; Article 22 of the Data Protection Ordinance)." },
		{ id: "rect", title: "Correction (Article 32(1) FADP).",
		  text: "You can ask us to correct incorrect personal data about you, unless a statutory provision prohibits it or the data is processed for archiving in the public interest." },
		{ id: "object", title: "Objection, prohibition and deletion (Articles 30 to 32 FADP).",
		  text: "You can tell us you do not want your data processed. We then process it only where an overriding private or public interest or the law justifies it (Articles 30(2)(b) and 31(1) FADP). You can ask us, or a civil court, to stop a specific processing or a disclosure to third parties, or to delete or destroy your data, and ask for a correction, deletion or prohibition to be communicated to third parties or published (Article 32(2) and (4) FADP)." },
		{ id: "dispute", title: "Marking as disputed (Article 32(3) FADP).",
		  text: "If neither the accuracy nor the inaccuracy of your data can be established, you can ask us to mark it as disputed." }
	];

	/* ---------------------------------------------------- California (matrix Part L) ---
	   Categories of personal information, in the statutory terms the privacy policy must use
	   (Civil Code 1798.130(c); regulations 7011(e)(1)(A)): 1798.140(v)(1)(A) to (K) and the
	   sensitive personal information of 1798.140(ae)(1) and (2). Read 12 November 2026. */
	var CA_CATS = [
		{ v: "A", n: "Identifiers", l: "Identifiers", t: "Identifiers, such as a real name, alias, postal address, unique personal identifier, online identifier, IP address, email address or account name", ref: "1798.140(v)(1)(A)" },
		{ v: "B", n: "Personal information described in Civil Code section 1798.80(e)", l: "Customer records (1798.80(e))", t: "Personal information described in Civil Code section 1798.80(e), such as a name, signature, address, telephone number, or financial or insurance information", ref: "1798.140(v)(1)(B)" },
		{ v: "C", n: "Characteristics of protected classifications under California or federal law", l: "Characteristics of protected classifications", t: "Characteristics of protected classifications under California or federal law", ref: "1798.140(v)(1)(C)" },
		{ v: "D", n: "Commercial information", l: "Commercial information", t: "Commercial information, including records of products or services purchased, obtained or considered", ref: "1798.140(v)(1)(D)" },
		{ v: "E", n: "Biometric information", l: "Biometric information", t: "Biometric information", ref: "1798.140(v)(1)(E)" },
		{ v: "F", n: "Internet or other electronic network activity information", l: "Internet or other electronic network activity", t: "Internet or other electronic network activity information, such as browsing history, search history and interactions with a website, application or advertisement", ref: "1798.140(v)(1)(F)" },
		{ v: "G", n: "Geolocation data", l: "Geolocation data", t: "Geolocation data", ref: "1798.140(v)(1)(G)" },
		{ v: "H", n: "Audio, electronic, visual, thermal, olfactory, or similar information", l: "Audio, electronic, visual or similar information", t: "Audio, electronic, visual, thermal, olfactory or similar information", ref: "1798.140(v)(1)(H)" },
		{ v: "I", n: "Professional or employment-related information", l: "Professional or employment-related information", t: "Professional or employment-related information", ref: "1798.140(v)(1)(I)" },
		{ v: "J", n: "Education information", l: "Education information (non-public, FERPA)", t: "Education information that is not publicly available personally identifiable information under the Family Educational Rights and Privacy Act", ref: "1798.140(v)(1)(J)" },
		{ v: "K", n: "Inferences drawn from personal information to create a profile", l: "Inferences used to create a profile", t: "Inferences drawn from other personal information to create a profile reflecting preferences, characteristics, behavior, attitudes or abilities", ref: "1798.140(v)(1)(K)" },
		{ v: "S1A", n: "Sensitive personal information: social security, driver's license, state identification card or passport number", spi: true, l: "Sensitive: government identifiers", t: "Sensitive personal information: social security, driver's license, state identification card or passport number", ref: "1798.140(ae)(1)(A)" },
		{ v: "S1B", n: "Sensitive personal information: account log-in, financial account, debit card, or credit card number in combination with any required security or access code, password, or credentials allowing access to an account", spi: true, l: "Sensitive: account log-in or financial account with credentials", t: "Sensitive personal information: account log-in, financial account, debit card or credit card number with the security code, password or credentials that allow access to the account", ref: "1798.140(ae)(1)(B)" },
		{ v: "S1C", n: "Sensitive personal information: precise geolocation", spi: true, l: "Sensitive: precise geolocation", t: "Sensitive personal information: precise geolocation", ref: "1798.140(ae)(1)(C)" },
		{ v: "S1D", n: "Sensitive personal information: racial or ethnic origin, citizenship or immigration status, religious or philosophical beliefs, or union membership", spi: true, l: "Sensitive: racial or ethnic origin, citizenship or immigration status, religious or philosophical beliefs, union membership", t: "Sensitive personal information: racial or ethnic origin, citizenship or immigration status, religious or philosophical beliefs, or union membership", ref: "1798.140(ae)(1)(D)" },
		{ v: "S1E", n: "Sensitive personal information: contents of mail, email, and text messages, unless we are the intended recipient of the communication", spi: true, l: "Sensitive: contents of mail, email and text messages", t: "Sensitive personal information: the contents of mail, email and text messages where we are not the intended recipient", ref: "1798.140(ae)(1)(E)" },
		{ v: "S1F", n: "Sensitive personal information: genetic data", spi: true, l: "Sensitive: genetic data", t: "Sensitive personal information: genetic data", ref: "1798.140(ae)(1)(F)" },
		{ v: "S1G", n: "Sensitive personal information: neural data", spi: true, l: "Sensitive: neural data", t: "Sensitive personal information: neural data", ref: "1798.140(ae)(1)(G)" },
		{ v: "S2A", n: "Sensitive personal information: biometric information processed to uniquely identify a consumer", spi: true, l: "Sensitive: biometric information processed to identify a person", t: "Sensitive personal information: biometric information processed to uniquely identify a person", ref: "1798.140(ae)(2)(A)" },
		{ v: "S2B", n: "Sensitive personal information: personal information collected and analyzed concerning health", spi: true, l: "Sensitive: health", t: "Sensitive personal information: personal information collected and analyzed concerning health", ref: "1798.140(ae)(2)(B)" },
		{ v: "S2C", n: "Sensitive personal information: personal information collected and analyzed concerning sex life or sexual orientation", spi: true, l: "Sensitive: sex life or sexual orientation", t: "Sensitive personal information: personal information collected and analyzed concerning sex life or sexual orientation", ref: "1798.140(ae)(2)(C)" }
	];
	/* Regulations 7027(m)(1) to (8): uses of sensitive personal information that carry no right
	   to limit, when reasonably necessary and proportionate. The policy lists only those ticked. */
	var CA_SPI_PURPOSES = [
		{ v: "m1", l: "(1) Goods or services an average consumer would expect", t: "performing the services or providing the goods reasonably expected by an average consumer who requests them" },
		{ v: "m2", l: "(2) Security incidents", t: "preventing, detecting and investigating security incidents that compromise the availability, authenticity, integrity or confidentiality of stored or transmitted personal information" },
		{ v: "m3", l: "(3) Resisting fraud or illegal acts", t: "resisting malicious, deceptive, fraudulent or illegal actions directed at us or at consumers, and prosecuting those responsible" },
		{ v: "m4", l: "(4) Physical safety", t: "ensuring the physical safety of natural persons" },
		{ v: "m5", l: "(5) Short-term, transient use", t: "short-term, transient use that is not disclosed to another third party and not used to build a profile or alter your experience outside the current interaction" },
		{ v: "m6", l: "(6) Services performed on our behalf", t: "performing services on our behalf, such as maintaining accounts, customer service, processing orders, transactions and payments, verifying customer information, and storage" },
		{ v: "m7", l: "(7) Quality or safety of our products", t: "verifying or maintaining the quality or safety of, and improving, our products, services or devices" },
		{ v: "m8", l: "(8) Not for inferring characteristics", t: "collecting or processing it without the purpose of inferring characteristics about you" }
	];
	var CA_SPI_OK = "the purposes listed in section 7027(m) of the CCPA regulations";
	/* Regulations 7221(b): exceptions to the opt-out of ADMT. */
	var CA_ADMT_EXC = [
		{ v: "none", l: "No exception: people can opt out" },
		{ v: "appeal", l: "Human appeal: a reviewer who can overturn the decision (7221(b)(1))", t: "you can appeal the decision to a human reviewer who has the authority to overturn it (section 7221(b)(1) of the CCPA regulations)" },
		{ v: "hiring", l: "Admission, acceptance or hiring, used solely to assess ability to perform (7221(b)(2))", t: "we use the technology solely to assess your ability to perform at work or in an educational program, to decide whether to admit, accept or hire you, and it works for that purpose without unlawful discrimination (section 7221(b)(2) of the CCPA regulations)" },
		{ v: "alloc", l: "Allocation of work or compensation only (7221(b)(3))", t: "we use the technology solely to allocate or assign work or compensation, and it works for that purpose without unlawful discrimination (section 7221(b)(3) of the CCPA regulations)" }
	];
	/* Opt-out preference signal scope (regulations 7011(e)(3)(F), 7025). */
	/* The browser or device and every profile associated with it, pseudonymous ones included, are
	   always covered (7025(c)(1)); these are the extras where the business knows the consumer. */
	var CA_OOPS = [
		{ v: "account", l: "The consumer, when known: their account and other records", t: "your account and the other personal information we hold about you" },
		{ v: "offline", l: "Offline selling or sharing, when the consumer is known", t: "our offline selling or sharing of your personal information" }
	];
	/* Matrix Part M: the US state consumer privacy laws other than California, read on 12 November 2026
	   (build/us/notes.md). src "s" marks a law read only through secondary sources: the review checks it
	   against the official text. Rights: cor correct; del "p" only data the consumer provided; ta opt out
	   of targeted advertising; prof opt out of significant profiling; app appeal; tp list of third parties
	   ("s" specific, "c" categories); q question a profiling decision; resp days to respond; apd and ape
	   appeal days and extension; cpl the complaint route after a denied appeal. Duties: uoom opt-out
	   preference signals from that date ("cond": only where another state's law already requires them);
	   contact an active email or online contact in the notice; date the date last updated; llm the
	   large language model statement; ret retention policies; chg how material changes are notified;
	   link a "privacy" link on the homepage and app; lang the notice in each language used; acc accessible;
	   optLink a clear and conspicuous opt-out link; out an opt-out method outside the notice; sensSale the
	   statutory sale notices; teen the rule on minors. */
	var US_STATES = [
		{ v: "VA", n: "Virginia", law: "Virginia Consumer Data Protection Act", cite: "Va. Code 59.1-575 to 59.1-585", eff: "2023-01-01",
		  scope: "100,000 consumers a year, or 25,000 and over 50% of gross revenue from selling personal data (59.1-576)", cor: 1, del: "a", port: "p", ta: 1, prof: 1, app: 1, resp: 45, apd: 60, cpl: "ag", noAgent: 1, geoBan: "59.1-578(A)(6)", teen: "known child under 13: parental consent under COPPA for targeted advertising, sale or significant profiling (59.1-578(F))", src: "o" },
		{ v: "CO", n: "Colorado", law: "Colorado Privacy Act", cite: "C.R.S. 6-1-1301 to 6-1-1314; 4 CCR 904-3", eff: "2023-07-01",
		  scope: "100,000 consumers a year, or revenue or a discount from selling personal data and 25,000 consumers (6-1-1304); the minors' duties in 6-1-1308.5 apply without these thresholds (6-1-1304(1)(b))", cor: 1, del: "a", port: "a", ta: 1, prof: 1, app: 1, resp: 45, apd: 45, ape: 60, cpl: "ag", cplAll: 1, uoom: "2024-07-01", contact: 1, date: 1, chg: 1, link: 1, out: 1, auth: 1, agent: 1, profDisc: 1,
		  teen: "a controller offering an online service, product or feature to a consumer it actually knows or wilfully disregards is under 18 needs that minor's consent (a parent's for a child) for targeted advertising, sale or significant profiling, and must use reasonable care to avoid a heightened risk of harm (6-1-1308.5, from 1 October 2025)", src: "o" },
		{ v: "CT", n: "Connecticut", law: "Connecticut Data Privacy Act", cite: "C.G.S. 42-515 to 42-526", eff: "2023-07-01",
		  scope: "35,000 consumers in the preceding year, or any processing of sensitive data, or offering personal data for sale (42-516, from 1 July 2026)", cor: 1, del: "a", port: "a", ta: 1, prof: 1, app: 1, tp: "s", tpSold: 1, q: 1, resp: 45, apd: 60, cpl: "ag", uoom: "2025-01-01", contact: 1, date: 1, mmyy: 1, llm: "2026-07-01", chg: 1, link: 1, lang: 1, acc: 1, optLink: 1, soldTP: 1, rev: 15, geoBan: "42-520(a)(3) as added by P.A. 26-64, from 1 October 2026",
		  teen: "no targeted advertising or sale where the controller knows or wilfully disregards that the consumer is 13 to 17 (42-520(a)(1)(I))", src: "o" },
		{ v: "UT", n: "Utah", law: "Utah Consumer Privacy Act", cite: "Utah Code 13-61-101 to 13-61-404", eff: "2023-12-31",
		  scope: "annual revenue of $25,000,000 or more, and 100,000 consumers a year or over 50% of gross revenue from sale and 25,000 consumers (13-61-102)", cor: 1, del: "p", port: "p", ta: 1, prof: 0, app: 0, resp: 45, cpl: "", sens: "optout", noAgent: 1, src: "o" },
		{ v: "IA", n: "Iowa", law: "Iowa Consumer Data Protection Act", cite: "Iowa Code ch. 715D", eff: "2025-01-01",
		  scope: "100,000 consumers a year, or 25,000 and over 50% of gross revenue from sale (715D.2)", cor: 0, del: "p", port: "p", ta: 0, prof: 0, app: 1, resp: 90, apd: 60, cpl: "ag", sens: "optout", noAgent: 1, src: "o" },
		{ v: "IN", n: "Indiana", law: "Indiana Consumer Data Protection Act", cite: "IC 24-15", eff: "2026-01-01",
		  scope: "100,000 consumers a year, or 25,000 and over 50% of gross revenue from sale (IC 24-15-1)", cor: 1, corP: 1, del: "a", port: "p", portSummary: 1, ta: 1, prof: 1, app: 1, resp: 45, apd: 60, cpl: "ag", noAgent: 1, src: "o" },
		{ v: "TN", n: "Tennessee", law: "Tennessee Information Protection Act", cite: "Tenn. Code Ann. 47-18-3201 to 47-18-3213", eff: "2025-07-01",
		  scope: "annual revenue over $25,000,000 and either 175,000 consumers in a calendar year, or 25,000 and over 50% of gross revenue from sale (47-18-3202)", cor: 1, del: "a", port: "p", ta: 1, prof: 1, app: 1, resp: 45, apd: 60, cpl: "ag", noAgent: 1, soldTP: 1, src: "o" },
		{ v: "MT", n: "Montana", law: "Montana Consumer Data Privacy Act", cite: "MCA 30-14-2801 to 30-14-2817", eff: "2024-10-01",
		  scope: "25,000 consumers, or 15,000 and over 25% of gross revenue from sale (30-14-2803)", cor: 1, del: "a", port: "p", ta: 1, prof: 1, app: 1, resp: 45, apd: 60, cpl: "ag", uoom: "2025-01-01", contact: 1, date: 1, chg: 1, link: 1, lang: 1, acc: 1, optLink: 1, out: 1, soldTP: 1, rev: 45,
		  teen: "consent for targeted advertising or sale where the controller knows or wilfully disregards that the consumer is 13 to 15 (30-14-2812(2)(d))", src: "o" },
		{ v: "TX", n: "Texas", law: "Texas Data Privacy and Security Act", cite: "Bus. & Com. Code ch. 541", eff: "2024-07-01",
		  scope: "any business in Texas that processes or sells personal data and is not a small business as defined by the SBA (541.002); small businesses need consent to sell sensitive data (541.107)", cor: 1, del: "a", port: "p", ta: 1, prof: 1, app: 1, resp: 45, apd: 60, cpl: "agOnline", uoom: "cond", uoomFrom: "2025-01-01", sensSale: 1, two: 1, src: "o" },
		{ v: "OR", n: "Oregon", law: "Oregon Consumer Privacy Act", cite: "ORS 646A.570 to 646A.589", eff: "2024-07-01",
		  scope: "100,000 consumers a year (excluding payment-only data), or 25,000 and 25% or more of gross revenue from sale; nonprofits included (646A.572)", cor: 1, del: "a", port: "a", ta: 1, prof: 1, app: 1, tp: "s", resp: 45, apd: 45, cpl: "ag", uoom: "2026-01-01", contact: 1, optLink: 1, orNames: 1, rev: 15, geoBan: "646A.578(2)(d)",
		  teen: "no targeted advertising, significant profiling or sale where the controller knows or wilfully disregards that the consumer is under 16 (646A.578(2))", src: "o" },
		{ v: "DE", n: "Delaware", law: "Delaware Personal Data Privacy Act", cite: "6 Del. C. ch. 12D", eff: "2025-01-01",
		  scope: "35,000 consumers, or 10,000 and over 20% of gross revenue from sale (12D-103); from 1 January 2027, 10,000, or 5,000 and over 20%", cor: 1, del: "a", port: "a", ta: 1, prof: 1, app: 1, tp: "c", tp27: "s", resp: 45, apd: 60, cpl: "ag", uoom: "2026-01-01", contact: 1, optLink: 1, rights27: 1, rev: 15, teen: "consent for targeted advertising or sale of data of consumers aged 13 to 17 (12D-106)", src: "o" },
		{ v: "NH", n: "New Hampshire", law: "New Hampshire Privacy Act", cite: "RSA 507-H", eff: "2025-01-01",
		  scope: "35,000 consumers, or 10,000 and over 25% of gross revenue from sale (507-H:2)", cor: 1, del: "a", port: "p", ta: 1, prof: 1, app: 1, resp: 45, apd: 60, cpl: "ag", uoom: "2025-01-01", contact: 1, date: 1, optLink: 1, acc: 1, teen: "consent for targeted advertising or sale of data of consumers aged 13 to 15", src: "s" },
		{ v: "NJ", n: "New Jersey", law: "New Jersey Data Privacy Act", cite: "N.J.S.A. 56:8-166.4 to 56:8-166.19", eff: "2025-01-15",
		  scope: "100,000 consumers a year, or 25,000 and revenue or a discount from selling personal data (sec. 2)", cor: 1, del: "a", port: "a", ta: 1, prof: 1, app: 1, resp: 45, apd: 45, cpl: "dca", uoom: "2025-07-15", contact: 1, date: 1, effDate: 1, chg: 1, rev: 15, teen: "consent for targeted advertising, sale or significant profiling of consumers aged 13 to 16 (sec. 9)", src: "o" },
		{ v: "NE", n: "Nebraska", law: "Nebraska Data Privacy Act", cite: "Neb. Rev. Stat. 87-1101 to 87-1130", eff: "2025-01-01",
		  scope: "any business in Nebraska that processes or sells personal data and is not a small business as defined by the SBA", cor: 1, del: "a", port: "p", ta: 1, prof: 1, app: 1, resp: 45, apd: 60, cpl: "ag", uoom: "cond", two: 1, src: "s" },
		{ v: "MD", n: "Maryland", law: "Maryland Online Data Privacy Act", cite: "Com. Law 14-4701 to 14-4714", eff: "2025-10-01",
		  scope: "35,000 consumers, or 10,000 and over 20% of gross revenue from sale (14-4702)", cor: 1, del: "a", port: "a", ta: 1, prof: 1, app: 1, tp: "c", resp: 45, apd: 60, cpl: "mdcpd", uoom: "agent", contact: 1, md: 1, rev: 30,
		  teen: "no targeted advertising or sale where the controller knew or should have known the consumer is under 18 (14-4707(a))", src: "o" },
		{ v: "MN", n: "Minnesota", law: "Minnesota Consumer Data Privacy Act", cite: "Minn. Stat. 325M.10 to 325M.21", eff: "2025-07-31",
		  scope: "100,000 consumers a year (excluding payment-only data), or over 25% of gross revenue from sale and 25,000 consumers (325M.12)", cor: 1, del: "a", port: "p", ta: 1, prof: 1, app: 1, tp: "s", q: 1, resp: 45, apd: 45, ape: 60, cpl: "ag", cplAll: 1, uoom: "2025-07-31", contact: 1, date: 1, ret: 1, chg: 1, link: 1, lang: 1, acc: 1, out: 1, soldTP: 1, rev: 15,
		  teen: "consent for targeted advertising or sale where the controller knows the consumer is between 13 and 16 (325M.16 subd. 2(f))", src: "o" },
		{ v: "KY", n: "Kentucky", law: "Kentucky Consumer Data Protection Act", cite: "KRS 367.3611 to 367.3629", eff: "2026-01-01",
		  scope: "100,000 consumers a year, or 25,000 and over 50% of gross revenue from sale (367.3613)", cor: 1, del: "a", port: "p", ta: 1, prof: 1, app: 1, resp: 45, apd: 60, cpl: "ag", noAgent: 1, src: "s" },
		{ v: "RI", n: "Rhode Island", law: "Rhode Island Data Transparency and Privacy Protection Act", cite: "R.I. Gen. Laws 6-48.1", eff: "2026-01-01",
		  scope: "35,000 customers (excluding payment-only data), or 10,000 and over 20% of gross revenue from sale (6-48.1-5(a)); the notice duty in 6-48.1-3 applies to commercial websites and internet service providers that sell customers' personally identifiable information, without these thresholds", cor: 1, del: "a", port: "a", ta: 1, prof: 1, app: 1, resp: 45, apd: 60, cpl: "ag", contact: 1, riBuyers: 1, rev: 15, src: "o" },
		{ v: "OK", n: "Oklahoma", law: "Oklahoma Consumer Data Privacy Act", cite: "SB 546 (2026)", eff: "2027-01-01",
		  scope: "100,000 consumers in a calendar year, or 25,000 and over 50% of gross revenue from sale (SB 546 Sec. 15)", cor: 1, del: "a", port: "p", ta: 1, prof: 1, app: 1, resp: 45, apd: 60, cpl: "agOnline", noAgent: 1, two: 1, src: "o" },
		{ v: "LA", n: "Louisiana", law: "Louisiana Data Privacy Act", cite: "La. R.S. 51:1780.1 to 51:1780.5", eff: "2027-01-01",
		  scope: "any one of: annual gross revenue over $25,000,000; buying, receiving, selling or sharing the personal information of 75,000 or more consumers, households or devices a year; 50% or more of annual revenue from selling personal information (51:1780.2(A))", cor: 1, del: "a", port: "p", ta: 1, prof: 1, app: 1, resp: 45, apd: 60, cpl: "agOnline", uoom: "cond", uoomFrom: "2027-01-01", sensSale: 1, two: 1, soldTP: 1, src: "o" },
		{ v: "AL", n: "Alabama", law: "Alabama Personal Data Protection Act", cite: "HB 351 (2026)", eff: "2027-05-01",
		  scope: "more than 25,000 consumers (excluding payment-only data), or more than 25% of gross revenue from selling personal data; businesses with fewer than 500 employees and nonprofits with fewer than 100 employees that do not sell personal data are exempt (Sec. 3, 4(a)(7), (8))", cor: 1, del: "a", port: "p", ta: 1, prof: 1, app: 0, resp: 45, cpl: "", contact: 1, optLink: 1, rev: 45,
		  teen: "consent for targeted advertising or sale where the controller knows the consumer is 13 to 15 (Sec. 7(b)(4))", src: "o" },
		{ v: "VT", n: "Vermont", law: "Vermont Data Privacy and Online Surveillance Act", cite: "9 V.S.A. 2415a to 2415k", eff: "2028-01-01",
		  scope: "35,000 consumers (excluding payment-only data), or sensitive data of 3,000 consumers, or offering for sale the personal data of 3,000 consumers, in the preceding calendar year (2415b(a))", cor: 1, del: "a", port: "a", ta: 1, prof: 1, app: 1, tp: "s", tpSold: 1, q: 1, resp: 45, apd: 60, cpl: "ag", uoom: "2028-01-01", contact: 1, date: 1, mmyy: 1, llm: "2028-01-01", chg: 1, link: 1, lang: 1, acc: 1, optLink: 1, soldTP: 1, rev: 15,
		  teen: "no targeted advertising and no sale where the controller knows the consumer is 13 to 17 (2415e(a)(7))", src: "o" }
	];

	var CA_METHODS = [
		{ v: "web", l: "Webform or online portal" }, { v: "email", l: "Email" }, { v: "phone", l: "Toll-free telephone number" },
		{ v: "mail", l: "Postal mail" }, { v: "person", l: "In person" }
	];

	/* Matrix rows. Titles match claude/notice-generators-matrix.md. */
	var MATRIX = {
		P01: { t: "Controller identity and contact details", s: "Art. 13(1)(a), 14(1)(a)" },
		P02: { t: "Representative in the Union", s: "Art. 13(1)(a), 14(1)(a), 27" },
		P03: { t: "Data protection officer contact details", s: "Art. 13(1)(b), 14(1)(b), 37(7)" },
		P04: { t: "Purposes of the processing", s: "Art. 13(1)(c), 14(1)(c); WP260 12, 13" },
		P05: { t: "Legal basis for each purpose", s: "Art. 13(1)(c), 14(1)(c); WP260 Annex" },
		P06: { t: "Legitimate interests pursued", s: "Art. 13(1)(d), 14(2)(b); WP260 Annex" },
		P07: { t: "Categories of personal data", s: "Art. 14(1)(d)" },
		P08: { t: "Recipients or categories of recipients", s: "Art. 13(1)(e), 14(1)(e), 4(9); WP260 Annex" },
		P09: { t: "Transfers to third countries and safeguards", s: "Art. 13(1)(f), 14(1)(f); WP260 Annex" },
		P10: { t: "Retention period or criteria", s: "Art. 13(2)(a), 14(2)(a); WP260 Annex" },
		P11: { t: "Rights of the data subject", s: "Art. 13(2)(b), 14(2)(c), 15 to 20; WP260 Annex" },
		P12: { t: "Right to object, shown separately", s: "Art. 21(4)" },
		P13: { t: "Right to withdraw consent", s: "Art. 13(2)(c), 14(2)(d), 7(3)" },
		P14: { t: "Right to complain to a supervisory authority", s: "Art. 13(2)(d), 14(2)(e), 77" },
		P15: { t: "Whether providing the data is required, and consequences", s: "Art. 13(2)(e); WP260 Annex" },
		P16: { t: "Source of the data", s: "Art. 14(2)(f); WP260 60, Annex" },
		P17: { t: "Automated decision-making, logic and consequences", s: "Art. 13(2)(f), 14(2)(g), 22; WP260 41" },
		P18: { t: "Further processing for a new purpose", s: "Art. 13(3), 14(4); WP260 45 to 48" },
		P19: { t: "Joint controllers: essence of the arrangement", s: "Art. 26(2), 26(3); WP260 44" },
		P20: { t: "National restrictions relied on", s: "Art. 23; WP260 68" },
		P21: { t: "Most important consequences, in the first layer", s: "WP260 10, 36" },
		D01: { t: "Art. 13 timing: when the data are obtained", s: "Art. 13(1); WP260 fn 29" },
		D02: { t: "Art. 14 timing: one month at most, earlier at first contact or disclosure", s: "Art. 14(3); WP260 27, 28" },
		D03: { t: "Concise, transparent, intelligible, plain language", s: "Art. 12(1); WP260 8 to 13" },
		D04: { t: "Separate from terms and conditions", s: "WP260 8, 33" },
		D05: { t: "Website: link on every page and at collection points", s: "WP260 11" },
		D06: { t: "App: before download and within two taps", s: "WP260 11" },
		D07: { t: "Layered: first layer content, no conflicts between layers", s: "WP260 35, 36" },
		D08: { t: "Whole notice available as one document", s: "WP260 17, 33" },
		D09: { t: "Language children understand", s: "Art. 12(1); WP260 14, 15" },
		D10: { t: "Accurate translations where a language is targeted", s: "WP260 13" },
		D11: { t: "Free of charge, not conditional on a purchase", s: "Art. 12(5); WP260 22" },
		D12: { t: "Material changes actively communicated, in advance", s: "WP260 29 to 31" },
		D13: { t: "Periodic reminders of where the notice is", s: "WP260 32" },
		D14: { t: "Icons only alongside the text", s: "Art. 12(7); WP260 50" },
		D15: { t: "Right to object shown at the first communication", s: "Art. 21(4)" },
		J01: { t: "Representative in the United Kingdom", s: "UK GDPR Art. 13(1)(a), 14(1)(a), 27" },
		J02: { t: "Recognised legitimate interests: the Annex 1 condition", s: "UK GDPR Art. 6(1)(ea), 6(5), 13(1)(c), Annex 1" },
		J03: { t: "Special category and criminal offence data: the DPA 2018 Schedule 1 condition", s: "UK GDPR Art. 9(2), 10, 13(1)(c); DPA 2018 s.10" },
		J04: { t: "Transfers outside the UK: approval by regulations, or the safeguards and where to get a copy", s: "UK GDPR Art. 13(1)(f), 14(1)(f), 44A, 45A, 46, 49" },
		J05: { t: "Data protection test before relying on an Article 46 safeguard", s: "UK GDPR Art. 46(1A), 46(6), 46(7)" },
		J06: { t: "Significant decisions based solely on automated processing: safeguards and limits", s: "UK GDPR Art. 13(2)(f), 14(2)(g), 22A to 22D" },
		J07: { t: "Right to complain to the controller, and a way to do it", s: "UK GDPR Art. 13(2)(ca), 14(2)(da); DPA 2018 s.164A" },
		J08: { t: "Right to complain to the Information Commission", s: "UK GDPR Art. 13(2)(d), 14(2)(e); DPA 2018 s.3(8A), 165" },
		J09: { t: "Time limits for requests, and when the clock stops", s: "UK GDPR Art. 12(3), 12A" },
		J10: { t: "Right to object to processing based on a recognised legitimate interest", s: "UK GDPR Art. 21(1), 21(4)" },
		K01: { t: "Identity and contact details of the controller", s: "FADP Art. 19(2)(a)" },
		K02: { t: "Representative in Switzerland: name and address published", s: "FADP Art. 14(1), 14(3)" },
		K03: { t: "Purpose of the processing", s: "FADP Art. 19(2)(b), 6(3)" },
		K04: { t: "Recipients or categories of recipients", s: "FADP Art. 19(2)(c)" },
		K05: { t: "Categories of personal data, where not collected from the person", s: "FADP Art. 19(3)" },
		K06: { t: "Disclosure abroad: every State or international body, and the guarantee or exception", s: "FADP Art. 19(4), 16, 17" },
		K07: { t: "Automated individual decisions: inform, hearing and human review", s: "FADP Art. 21" },
		K08: { t: "Information needed to exercise rights, and how to exercise them", s: "FADP Art. 19(2), 25, 28, 32" },
		K09: { t: "Data protection officer: contact details published", s: "FADP Art. 10(3)(d)" },
		K10: { t: "Explicit consent for sensitive personal data and high-risk profiling", s: "FADP Art. 5(c), 5(g), 6(7)" },
		K11: { t: "Timing: when collecting; at the latest one month after receiving data from others", s: "FADP Art. 19(1), 19(5)" },
		K12: { t: "Precise, transparent, comprehensible and easily accessible", s: "DPO Art. 13" },
		K13: { t: "Criminal liability of individuals for wilful failures", s: "FADP Art. 60(1)" },
		K14: { t: "Cantonal and federal bodies", s: "FADP Art. 2, 20(3)(d), 21(4)" },
		C00: { t: "Whether the CCPA applies to the organisation", s: "Civ. Code 1798.140(d), (i); 1798.199.95(d)" },
		C01: { t: "Categories of personal information collected in the past 12 months, in the statutory terms", s: "Civ. Code 1798.100(a), 1798.130(a)(5)(B), (c); Regs 7011(e)(1)(A), 7012(e)(1)" },
		C02: { t: "Categories of sources", s: "Civ. Code 1798.130(a)(5)(B)(ii); Regs 7011(e)(1)(B)" },
		C03: { t: "Business or commercial purposes for each category", s: "Civ. Code 1798.100(a); Regs 7011(e)(1)(C), 7012(e)(2)" },
		C04: { t: "Selling and sharing: per category, to whom, why, or that there is none", s: "Civ. Code 1798.130(a)(5)(C)(i); Regs 7011(e)(1)(D) to (F), 7012(e)(3)" },
		C05: { t: "Actual knowledge of selling or sharing data of consumers under 16", s: "Regs 7011(e)(1)(G), 7011(e)(3)(I), 7070, 7071" },
		C06: { t: "Disclosures to service providers and contractors, and why, or that there are none", s: "Civ. Code 1798.130(a)(5)(C)(ii); Regs 7011(e)(1)(H), (I)" },
		C07: { t: "Sensitive personal information: whether used beyond the permitted purposes; the right to limit", s: "Civ. Code 1798.121(a); Regs 7011(e)(1)(J), 7011(e)(2)(E), 7011(e)(3)(D), 7014, 7027(m)" },
		C08: { t: "Retention for each category, or the criteria", s: "Civ. Code 1798.100(a)(3); Regs 7012(e)(4)" },
		C09: { t: "The consumer's rights, explained", s: "Civ. Code 1798.130(a)(5)(A); Regs 7011(e)(2)" },
		C10: { t: "Methods for submitting requests", s: "Civ. Code 1798.130(a)(1); Regs 7011(e)(3)(A), (B), 7020" },
		C11: { t: "How requests are verified", s: "Regs 7011(e)(3)(E)" },
		C12: { t: "How opt-out preference signals are processed", s: "Regs 7011(e)(3)(F), (G), 7025" },
		C13: { t: "How an authorised agent makes a request", s: "Regs 7011(e)(3)(H), 7026(j), 7027(j), 7063, 7221(j)" },
		C14: { t: "Notice of right to opt out of sale or sharing, or a link to it", s: "Civ. Code 1798.120, 1798.135; Regs 7011(e)(3)(C), 7013" },
		C15: { t: "Contact for questions about privacy practices", s: "Regs 7011(e)(3)(J)" },
		C16: { t: "Date last updated; updated at least every 12 months", s: "Civ. Code 1798.130(a)(5); Regs 7011(e)(4)" },
		C17: { t: "Pre-use notice for automated decisionmaking technology", s: "Regs 7010(c), (d), 7200(b), 7220, 7221(b), (c), 7222" },
		C18: { t: "Notice of financial incentive", s: "Civ. Code 1798.125(b); Regs 7016(c), (d)" },
		C19: { t: "Request metrics for businesses handling data of 10 million or more consumers", s: "Regs 7011(e)(5), 7102" },
		C20: { t: "Notice at collection: at or before the point of collection", s: "Civ. Code 1798.100(a); Regs 7012(c), (d), (e)(5), (e)(6), (f)" },
		C21: { t: "Privacy policy: conspicuous link using the word privacy, app settings, printable", s: "Regs 7003(c), (d), 7011(c), (d)" },
		C22: { t: "Plain language, readable on small screens, languages used with consumers, accessible", s: "Regs 7003(a), (b)" },
		C23: { t: "Opt-out and limit links: placement and methods", s: "Civ. Code 1798.135; Regs 7013(c) to (e), 7014(c), 7015, 7025(c)(6), (g), 7026(a), (g), 7027(b), (h)" },
		C24: { t: "Pre-use notice timing and the ADMT opt-out link", s: "Regs 7220(b), 7221(c), (h)" },
		C25: { t: "Offline: where the policy is online, and how to get it in an alternative format", s: "Regs 7012(e)(6), 7003(b)(3)" },
		C26: { t: "Consistency with the rest of the notice", s: "Regs 7011(a)" },
		M00: { t: "Whether each state law applies to the organisation", s: "State applicability sections (Part M table)" },
		M01: { t: "Categories of personal data processed, including sensitive data", s: "VA 59.1-578(C)(1); CO 6-1-1308(1)(a)(I), Rule 6.03(A)(1)(a); TX 541.102(a)(1); and the equivalents" },
		M02: { t: "Purposes of processing, linked to each category", s: "VA 59.1-578(C)(2); CO Rule 6.03(A)(1)(b); UT 13-61-302(1)(a)(ii); MN 325M.16 subd. 1(a)(2)" },
		M03: { t: "Sensitive data: consent, or notice and opt-out (Utah, Iowa); Maryland strict necessity; bans on selling precise geolocation", s: "VA 59.1-578(A)(5), (6); UT 13-61-302(3); IA 715D.4(2); MD 14-4707(a)(1), (2); OR 646A.578(2)(d); CT 42-520(a)(3)" },
		M04: { t: "Categories of personal data shared with third parties, and categories of third parties, including those that buy it", s: "VA 59.1-578(C)(4), (5); CO Rule 6.03(A)(1)(d), (e); OR 646A.578(4)(d), (e); MD 14-4707(d)(4), (5); CT 42-520(b)(1)(D), (E); TN 47-18-3204(c)(4), (5); LA 51:1780.4(B)(1)(d), (e); VT 2415e(c)(1)(D), (E)" },
		M05: { t: "Sale, targeted advertising and significant profiling: disclosure and how to opt out", s: "VA 59.1-578(D); CO 6-1-1306(1)(a)(III); NJ sec. 3b; MD 14-4707(e); MN 325M.16 subd. 1(b)" },
		M06: { t: "Opt-out preference signals", s: "CO 6-1-1306(1)(a)(IV)(B), Rule 6.03(A)(4)(e); CT 42-520(c)(1)(A)(ii); OR 646A.578(5); MT 30-14-2809(3); DE 12D-106(e); NJ sec. 8b; MN 325M.14 subd. 3; VT 2415e(d)(2); conditional: TX 541.055(e), NE, LA 51:1780.3(E)(5); MD 14-4706(b), 14-4707(f)(3)" },
		M07: { t: "The rights, explained, and which states give each", s: "VA 59.1-577(A); CO Rule 6.03(A)(3); MT 30-14-2812(5)(f); MN 325M.16 subd. 1(a)(3)" },
		M08: { t: "Methods for submitting requests", s: "VA 59.1-578(E); TX 541.055(a), (c), (d); NE LB 1074 sec. 11; OK SB 546 sec. 6; LA 51:1780.3(E); CO Rule 6.03(A)(4)(a)" },
		M09: { t: "How requests are authenticated", s: "CO Rule 6.03(A)(4)(d)" },
		M10: { t: "Authorised agents for opt-out requests", s: "CO 6-1-1306(1)(a)(II), Rule 6.03(A)(4)(b); CT 42-519; TX 541.055(e); MN 325M.14 subd. 2(d)" },
		M11: { t: "How to appeal, and the complaint route", s: "VA 59.1-577(C); CO 6-1-1306(3); NJ sec. 4f; MN 325M.14 subd. 5; MD 14-4705(f); TX 541.053(d)" },
		M12: { t: "An active email address or other online contact", s: "CT 42-520(b)(1)(G); DE 12D-106(c)(6); MD 14-4707(d)(6); MN 325M.16 subd. 1(a)(6); and the equivalents" },
		M13: { t: "Date the notice was last updated", s: "CO Rule 6.03(A)(8); CT 42-520(b)(1)(I); MT 30-14-2812(5)(g); MN 325M.16 subd. 1(a)(8); NJ sec. 3a" },
		M14: { t: "Material changes: how they are notified", s: "CO Rule 6.04; CT 42-520(b)(3); MT 30-14-2812(8); MN 325M.16 subd. 1(e); NJ sec. 3a" },
		M15: { t: "Statement on training large language models", s: "CT 42-520(b)(1)(H) (from 1 July 2026); VT 2415e(c) (from 1 January 2028)" },
		M16: { t: "Retention policies", s: "MN 325M.16 subd. 1(a)(7)" },
		M17: { t: "Oregon: the controller's registered and assumed business names", s: "OR 646A.578(4)(g)" },
		M18: { t: "Rhode Island: the third parties to which personal data is or may be sold", s: "RI 6-48.1-3" },
		M19: { t: "Texas and Louisiana: statutory notices on selling sensitive or biometric data", s: "TX 541.102(b), (c); LA SB 386 (2026)" },
		M20: { t: "Colorado: profiling disclosures", s: "CO Rule 9.03(A)" },
		M21: { t: "Minors", s: "CT 42-520(a)(1)(I); OR 646A.578(2); MD 14-4707(a)(4), (5); MT 30-14-2812(2)(d); NJ sec. 9; DE 12D-106" },
		M23: { t: "Laws not yet in force on the notice date", s: "Effective dates (Part M table)" },
		M24: { t: "Consistency with the rest of the notice", s: "Good practice" },
		M25: { t: "Publication: a \"privacy\" link, languages, accessibility", s: "CO Rule 6.02(E); CT 42-520(b)(2); MT 30-14-2812(6), (7), (10); MN 325M.16 subd. 1(c), (d), (g); NH RSA 507-H:6, III; VT 2415e(c)(2)" },
		M26: { t: "Opt-out link on the website, and a method outside the notice", s: "CO 6-1-1306(1)(a)(III); CT 42-520(c)(1)(A)(i); MT 30-14-2812(4); MN 325M.16 subd. 1(b); OR 646A.578(5); DE 12D-106(e); VT 2415e(d)(2); AL HB 351 sec. 6(b)" },
		M27: { t: "Consent for sensitive data before processing, and withdrawal", s: "VA 59.1-578(A)(5); CT 42-520(a)(1)(D), (G); OR 646A.578(1); MT 30-14-2812(1)(c); DE 12D-106(a)(6); MN 325M.16 subd. 2(e); MD 14-4707(b)(2); VT 2415e(a)(6)" },
		M28: { t: "Audience: consumers only, not employment or commercial contacts", s: "Consumer definitions, for example Va. Code 59.1-575; C.G.S. 42-515(8); Tenn. Code Ann. 47-18-3201" },
		N01: { t: "Controller identity and contact details", s: "LGPD Art. 9, III, IV" },
		N02: { t: "Encarregado: identity and contact details, published prominently; small agents: a channel", s: "LGPD Art. 41, para. 1; 23, III; Res. CD/ANPD 18/2024 Arts. 5, 8, 9, 13; Res. CD/ANPD 2/2022 Arts. 2 to 4, 11" },
		N03: { t: "Specific purpose of each processing operation", s: "LGPD Art. 9, I; 6, I" },
		N04: { t: "Legal basis for each purpose", s: "LGPD Art. 7, 6, VI; 23, I for public bodies; good practice (Art. 9 does not list it)" },
		N05: { t: "Legitimate interests: the interest, and transparency", s: "LGPD Art. 7, IX; 10, para. 2; ANPD legitimate interest guide (2024)" },
		N06: { t: "Sensitive personal data: the Article 11 basis", s: "LGPD Art. 11; 5, II" },
		N07: { t: "Form and duration of the processing", s: "LGPD Art. 9, II; 15, 16" },
		N08: { t: "Shared use of data and its purpose", s: "LGPD Art. 9, V; 5, XVI" },
		N09: { t: "Responsibilities of the processing agents", s: "LGPD Art. 9, VI; 37 to 39, 42" },
		N10: { t: "International transfers: destination and mechanism", s: "LGPD Art. 33; Res. CD/ANPD 19/2024 Regulation Art. 9; Res. CD/ANPD 32/2026" },
		N11: { t: "Transfers under ANPD clauses or rules: the published information, and the clauses within 15 days", s: "Res. CD/ANPD 19/2024 Regulation Art. 17, 32" },
		N12: { t: "Rights of the data subject, each mentioned explicitly", s: "LGPD Art. 9, VII; 18" },
		N13: { t: "Confirmation and access: response times", s: "LGPD Art. 19; 23, para. 3; Res. CD/ANPD 2/2022 Arts. 3, 14, 15" },
		N14: { t: "Petition to the ANPD and to consumer protection bodies", s: "LGPD Art. 18, para. 1, para. 8; 55-J, V" },
		N15: { t: "Consent: refusing it and its consequences, and withdrawing it", s: "LGPD Art. 8, para. 5; 18, VIII, IX" },
		N16: { t: "Processing as a condition for a product, service or right, highlighted", s: "LGPD Art. 9, para. 3" },
		N17: { t: "Automated decisions: review, and the criteria and procedures", s: "LGPD Art. 20" },
		N18: { t: "Children and adolescents: best interest, public information, plain language", s: "LGPD Art. 14; Enunciado CD/ANPD 1/2023; ECA Digital (Law 15,211/2025) Arts. 7, 16, 22, 26" },
		N19: { t: "Public bodies: legal basis, purpose, procedures and practices", s: "LGPD Art. 23, I; 11, para. 2" },
		N20: { t: "Changes to purpose, form, duration, controller or shared use, highlighted", s: "LGPD Art. 8, para. 6; 9, para. 2" },
		N21: { t: "Origin of the data", s: "LGPD Art. 19, II (on request); good practice" },
		N22: { t: "Language: Portuguese", s: "Res. CD/ANPD 19/2024 Regulation Art. 17, para. 2; CDC (Law 8,078/1990) Art. 31" },
		N23: { t: "Information before consent: clear, not misleading", s: "LGPD Art. 9, para. 1; 8, para. 4" },
		N24: { t: "Sharing data obtained with consent: specific consent", s: "LGPD Art. 7, para. 5" },
		N25: { t: "Children: information they can understand", s: "LGPD Art. 14, para. 6" },
		I01: { t: "Data Fiduciary identity and contact details", s: "DPDP Act s. 2(i); Rule 3(c)" },
		I02: { t: "Data Protection Officer, or the person who answers questions: business contact information", s: "DPDP Act ss. 6(3), 8(9), 10(2)(a); Rule 9" },
		I03: { t: "Whether and from when the DPDP Act applies", s: "DPDP Act ss. 3, 17; G.S.R. 843(E); Rule 1" },
		I04: { t: "Itemised description of the personal data", s: "DPDP Act s. 5(1)(i); Rule 3(b)(i)" },
		I05: { t: "Purpose, and the goods, services or uses it enables", s: "DPDP Act s. 5(1)(i); Rule 3(b)(ii)" },
		I06: { t: "Ground for each purpose: consent or a legitimate use", s: "DPDP Act ss. 4, 6, 7" },
		I07: { t: "Link to the website or app, and other means", s: "Rule 3(c)" },
		I08: { t: "Withdrawing consent, as easily as it was given", s: "DPDP Act ss. 5(1)(ii), 6(4) to (6); Rule 3(c)(i)" },
		I09: { t: "Rights, and how to exercise them", s: "DPDP Act ss. 11 to 14; Rule 3(c)(ii); Rule 14(1), (2), (4)" },
		I10: { t: "Grievance redressal and the response period", s: "DPDP Act ss. 8(10), 13; Rule 14(3)" },
		I11: { t: "How to complain to the Data Protection Board", s: "DPDP Act ss. 5(1)(iii), 13(3); Rule 3(c)(iii)" },
		I12: { t: "English or a language of the Eighth Schedule", s: "DPDP Act ss. 5(3), 6(3)" },
		I13: { t: "Children: verifiable parental consent; no tracking or targeted advertising", s: "DPDP Act s. 9; Rules 10, 12; Fourth Schedule" },
		I14: { t: "Persons with disability: the lawful guardian's consent", s: "DPDP Act s. 9(1); Rule 11" },
		I15: { t: "Retention and erasure", s: "DPDP Act s. 8(7), (8); Rule 8; Third and Seventh Schedules" },
		I16: { t: "Consent Manager", s: "DPDP Act s. 6(7) to (9); Rule 4; First Schedule" },
		I17: { t: "Processing outside India", s: "DPDP Act s. 16; Rule 15" },
		I18: { t: "New purpose: new notice and consent, or a legitimate use", s: "DPDP Act ss. 2(za), 5, 6, 7" },
		I19: { t: "A notice that stands on its own, in clear and plain language", s: "Rule 3(a), (b)" },
		I20: { t: "Notice with or before each request for consent (delivery)", s: "DPDP Act ss. 5(1), 6(1), 6(10)" },
		I21: { t: "People who consented before 13 May 2027 (delivery)", s: "DPDP Act s. 5(2)" },
		I22: { t: "Publish the contact, the request means and the response period (delivery)", s: "Rules 9, 14(1), 14(3)" },
		I23: { t: "48 hours' warning before erasure (delivery)", s: "Rule 8(2)" },
		I24: { t: "Request for consent: plain language, languages, contact (delivery)", s: "DPDP Act s. 6(3)" },
		I25: { t: "Significant Data Fiduciary duties (delivery)", s: "DPDP Act s. 10; Rule 13" },
		Z01: { t: "Personal information processor: name and contact details", s: "PIPL Art. 17(1)(1); NDSMR Art. 21(1)(1)" },
		Z02: { t: "Whether the PIPL applies, and the dedicated body or representative in China", s: "PIPL Arts. 3, 53; NDSMR Art. 26" },
		Z03: { t: "Personal information protection officer", s: "PIPL Art. 52; Compliance Audit Measures (2025) Art. 12" },
		Z04: { t: "Purposes, processing methods and categories of personal information", s: "PIPL Arts. 6, 17(1)(2); NDSMR Art. 21(1)(2)" },
		Z05: { t: "Ground for each purpose", s: "PIPL Arts. 13, 14" },
		Z06: { t: "Retention period, and what happens when it ends", s: "PIPL Arts. 17(1)(2), 19; NDSMR Art. 21(1)(3)" },
		Z07: { t: "Sensitive personal information: necessity and impact", s: "PIPL Arts. 28 to 30; NDSMR Art. 21(1)(2)" },
		Z08: { t: "Providing personal information to other processors", s: "PIPL Arts. 21, 23; NDSMR Art. 21" },
		Z09: { t: "Overseas recipients, and processing outside mainland China", s: "PIPL Arts. 3, 36, 38 to 40; NDSMR Art. 35; CAC Order No. 16 (2024) Art. 5" },
		Z10: { t: "Rights, and how to exercise them", s: "PIPL Arts. 17(1)(3), 44 to 50; NDSMR Arts. 21(1)(4), 23 to 25" },
		Z11: { t: "Withdrawing consent, without losing the service", s: "PIPL Arts. 15, 16" },
		Z12: { t: "Automated decision-making and personalised push", s: "PIPL Arts. 24, 55, 73; NDSMR Art. 42" },
		Z13: { t: "Children under 14", s: "PIPL Arts. 28, 31; NDSMR Art. 21; CAC Order No. 4 (2019) Arts. 8 to 10" },
		Z14: { t: "Complaints, and court action after a refused request", s: "PIPL Arts. 50, 65" },
		Z15: { t: "Changes, new purposes and transfers on merger", s: "PIPL Arts. 14, 17, 22" },
		Z16: { t: "Clear and easily understood language", s: "PIPL Art. 17" },
		Z17: { t: "State organs", s: "PIPL Arts. 33 to 37" },
		Z18: { t: "Prominent, public, and easy to consult and save (delivery)", s: "PIPL Art. 17; NDSMR Art. 21" },
		Z19: { t: "Consent and separate consent (delivery)", s: "PIPL Arts. 14, 23, 29, 39; NDSMR Art. 22" },
		Z20: { t: "Notice to the parent or guardian, user agreement and designated person (delivery)", s: "CAC Order No. 4 (2019) Arts. 8 to 10" },
		Z21: { t: "Report the personal information protection officer (delivery)", s: "PIPL Art. 52; CAC announcement of 18 July 2025" },
		Z22: { t: "Report the dedicated body or representative in China (delivery)", s: "PIPL Art. 53; NDSMR Art. 26" },
		Z23: { t: "Personal information protection impact assessment (delivery)", s: "PIPL Arts. 55, 56" },
		T01: { t: "Business name, address and representative", s: "APPI Art. 32(1)(i); Guidelines 3-8-1" },
		T02: { t: "Whether and how the APPI applies", s: "APPI Arts. 16, 171" },
		T03: { t: "Purposes of use, specified as far as possible", s: "APPI Arts. 17, 21, 32(1)(ii); Guidelines 3-1-1" },
		T05: { t: "Special care-required personal information", s: "APPI Arts. 2(3), 20(2); Cabinet Order Art. 2" },
		T06: { t: "Provision to third parties and entrusted handling", s: "APPI Arts. 25, 27(1), 27(5)(i), 28(1)" },
		T07: { t: "Joint use", s: "APPI Art. 27(5)(iii), (6); Guidelines 3-6-3" },
		T08: { t: "Provision under the opt-out scheme", s: "APPI Art. 27(2), (3); Rules Art. 11(4)" },
		T09: { t: "Third parties in foreign countries", s: "APPI Art. 28; Rules Arts. 15 to 18; PPC Notice No. 1 of 2019" },
		T10: { t: "How to make requests, and fees", s: "APPI Arts. 32 to 38; Cabinet Order Art. 12" },
		T11: { t: "Security measures, and handling abroad", s: "Cabinet Order Art. 10(i); Guidelines 3-8-1, 10-7" },
		T12: { t: "Complaint contact", s: "APPI Art. 40; Cabinet Order Art. 10(ii)" },
		T13: { t: "Accredited personal information protection organisation", s: "Cabinet Order Art. 10(iii)" },
		T14: { t: "Changing the purposes of use", s: "APPI Arts. 17(2), 18(1), 21(3)" },
		T15: { t: "Retention and deletion", s: "APPI Art. 22" },
		T16: { t: "Language", s: "APPI Art. 32 (good practice)" },
		T17: { t: "Children", s: "Guidelines 2-16; 2026 amendment (not in force)" },
		T18: { t: "2026 amendment", s: "Act No. 56 of 2026" },
		T19: { t: "Public bodies", s: "APPI Arts. 2(11), 16(2), 58, 171; Chapter 5" },
		T20: { t: "Publication so people can know it (delivery)", s: "APPI Arts. 21(1), 32(1); Guidelines 2-15, 3-8-1" },
		T21: { t: "Purpose stated expressly at written collection (delivery)", s: "APPI Art. 21(2)" },
		T22: { t: "Information before consent to foreign provision (delivery)", s: "APPI Art. 28(2); Rules Art. 17" },
		T23: { t: "Filing the opt-out provision (delivery)", s: "APPI Arts. 27(2), (3), 29; Rules Art. 11" },
		T24: { t: "Checks on recipients with an equivalent system (delivery)", s: "APPI Art. 28(3); Rules Art. 18" },
		T25: { t: "Personal related information", s: "APPI Art. 31(1)" },
		T26: { t: "Pseudonymously and anonymously processed information", s: "APPI Arts. 41(4), (6), 43(3), (4)" },
		T27: { t: "Consent and confirmation for personal related information (delivery)", s: "APPI Art. 31(1)" },
		S01: { t: "Title \"Privacy Policy\" and the controller's name", s: "PIPA Art. 30(1); PIPC drafting guidelines, item 1" },
		S02: { t: "Presence in Korea, and the countries where data collected from abroad is processed", s: "Enforcement Decree Art. 31(1)(4); PIPC drafting guidelines, p. 12 and item 10" },
		S03: { t: "Purposes of processing", s: "PIPA Art. 30(1)(1); PIPC drafting guidelines, item 2" },
		S04: { t: "Items processed, with consent and without consent set apart", s: "PIPA Art. 22(3); Enforcement Decree Art. 31(1)(1); PIPC drafting guidelines, item 3" },
		S05: { t: "Basis for each purpose, and consent", s: "PIPA Arts. 15, 16, 22" },
		S06: { t: "Sensitive information, unique identifiers and resident registration numbers", s: "PIPA Arts. 23, 24, 24-2; Enforcement Decree Arts. 18, 19" },
		S07: { t: "Processing and retention periods", s: "PIPA Art. 30(1)(2); PIPC drafting guidelines, item 5" },
		S08: { t: "Destruction procedure and method, and data kept under other laws", s: "PIPA Arts. 21, 30(1)(3-2); Enforcement Decree Art. 16; PIPC drafting guidelines, item 6" },
		S09: { t: "Provision to third parties", s: "PIPA Arts. 17, 18(2), 30(1)(3); PIPC drafting guidelines, item 7" },
		S10: { t: "Entrustment of processing, with sub-processors", s: "PIPA Arts. 26(2), (6), 30(1)(4); Enforcement Decree Art. 28; PIPC drafting guidelines, item 9" },
		S11: { t: "Transfers abroad", s: "PIPA Arts. 28-8, 28-11; Enforcement Decree Arts. 29-10, 31(1)(2); PIPC drafting guidelines, item 10" },
		S12: { t: "Security measures", s: "PIPA Art. 29; Enforcement Decree Arts. 30, 31(1)(3)" },
		S13: { t: "Rights of data subjects and legal representatives, how to exercise them, and objections", s: "PIPA Arts. 30(1)(5), 35 to 38; Enforcement Decree Arts. 41, 47; PIPC drafting guidelines, item 16" },
		S14: { t: "Automated decisions", s: "PIPA Art. 37-2; Enforcement Decree Arts. 44-2 to 44-4" },
		S15: { t: "Chief privacy officer or department, with contacts", s: "PIPA Arts. 30(1)(6), 31; Enforcement Decree Art. 32(2); PIPC drafting guidelines, item 18" },
		S16: { t: "Domestic representative", s: "PIPA Art. 31-2; Enforcement Decree Art. 32-3" },
		S17: { t: "Children under 14", s: "PIPA Art. 22-2; Enforcement Decree Art. 17-2" },
		S18: { t: "Cookies and other automatic collection, and how to refuse", s: "PIPA Art. 30(1)(7); PIPC drafting guidelines, items 14, 15" },
		S19: { t: "Sensitive information that can become public", s: "PIPA Arts. 23(3), 30(1)(3-3)" },
		S20: { t: "Pseudonymised information", s: "PIPA Arts. 28-2, 28-4, 30(1)(4-2); PIPC drafting guidelines, item 13" },
		S21: { t: "Criteria for further use or provision without consent", s: "PIPA Arts. 15(3), 17(4); Enforcement Decree Art. 14-2" },
		S22: { t: "Remedies for infringement (recommended)", s: "PIPC drafting guidelines, item 20" },
		S23: { t: "Effective date, changes and earlier versions", s: "PIPC drafting guidelines, item 24" },
		S24: { t: "Language", s: "PIPC drafting guidelines, p. 12" },
		S25: { t: "Amendments not yet in force", s: "PIPA Arts. 28-12 to 28-15 (from 9 March 2027), 32-2(1) (from 1 July 2027)" },
		S26: { t: "Public institutions", s: "PIPA Arts. 18(2), (4), 30(1), 32" },
		S27: { t: "Publication of the privacy policy (delivery)", s: "PIPA Art. 30(2); Enforcement Decree Art. 31(2), (3); PIPC drafting guidelines, item 1" },
		S28: { t: "Consent requests (delivery)", s: "PIPA Arts. 15(2), 17(2), 18(3), 22, 28-8(2); Enforcement Decree Art. 17" },
		S29: { t: "Data from other sources (delivery)", s: "PIPA Art. 20; Enforcement Decree Art. 15-2" },
		S30: { t: "Entrustment (delivery)", s: "PIPA Art. 26(1) to (3); Enforcement Decree Art. 28" },
		S31: { t: "Confirming the legal representative's consent (delivery)", s: "PIPA Art. 22-2; Enforcement Decree Art. 17-2" },
		S32: { t: "New purpose", s: "PIPA Arts. 15(3), 17(4), 18(2)" },
		S33: { t: "Video devices and generative AI services (not modelled)", s: "PIPA Arts. 25, 25-2; PIPC drafting guidelines, items 21, 22 and appendix" },
		S34: { t: "Use and provision history notice (delivery)", s: "PIPA Art. 20-2; Enforcement Decree Art. 15-3" },
		H01: { t: "Organisation's name and the date the policy applies from", s: "PDPA s. 20; Key Concepts, ch. 14 (needed for the policy text)" },
		H02: { t: "How the PDPA applies: in Singapore or from abroad; public agencies", s: "PDPA ss. 2(1), 4(1)" },
		H03: { t: "Purposes of collection, use and disclosure", s: "PDPA ss. 18, 20(1)(a); Key Concepts, ch. 14" },
		H04: { t: "Personal data for each purpose", s: "PDPA s. 20(1)(a); Key Concepts, ch. 14 (good practice)" },
		H05: { t: "How the PDPA allows each purpose", s: "PDPA ss. 13 to 17; First and Second Schedules" },
		H06: { t: "Deemed consent by notification", s: "PDPA s. 15A; PDP Regulations 2021, regs 13, 14" },
		H07: { t: "Legitimate interests", s: "PDPA First Schedule, Part 3, para 1; PDP Regulations 2021, reg 15(2)(d); Key Concepts, ch. 12" },
		H08: { t: "Data protection officer's business contact information", s: "PDPA ss. 11(3), 11(5), 20(1)(c); PDP Regulations 2021, regs 1A, 3; Key Concepts 21.6, 21.7" },
		H09: { t: "Recipients and purposes of disclosure", s: "PDPA ss. 4(2), 4(3), 20(1)(a)" },
		H10: { t: "Transfers outside Singapore", s: "PDPA s. 26; PDP Regulations 2021, regs 9 to 12" },
		H11: { t: "Retention", s: "PDPA s. 25; Key Concepts 18.3, 18.8" },
		H12: { t: "Protection", s: "PDPA s. 24" },
		H13: { t: "Withdrawing consent", s: "PDPA s. 16" },
		H14: { t: "Access and correction", s: "PDPA ss. 21, 22; PDP Regulations 2021, regs 3 to 7" },
		H15: { t: "Complaints, policies on request, and the PDPC", s: "PDPA ss. 12, 48H, 48O" },
		H16: { t: "Children", s: "PDPC Advisory Guidelines on children's personal data (2024), 4.2 to 4.5" },
		H17: { t: "NRIC and other national identification numbers", s: "PDPC Advisory Guidelines on NRIC numbers (2018); PDPC announcement of 2 Feb 2026; PDPA s. 24" },
		H18: { t: "New purpose", s: "PDPA ss. 18, 20(1)(b)" },
		H19: { t: "Employees and applicants", s: "PDPA s. 20(4), (5)" },
		H20: { t: "Not modelled", s: "PDPA Parts 6A, 6B, 9; First Schedule, Part 4; s. 4(2)" },
		H21: { t: "Purposes on or before collection (delivery)", s: "PDPA s. 20(1)(a), (2); Key Concepts, ch. 14" },
		H22: { t: "Consent requests (delivery)", s: "PDPA s. 14" },
		H23: { t: "Publishing the data protection officer's contact (delivery)", s: "PDPA s. 11(5); PDP Regulations 2021, reg 1A" },
		H24: { t: "Handling withdrawal of consent (delivery)", s: "PDPA s. 16(2), (4)" },
		H25: { t: "Handling access requests (delivery)", s: "PDPA ss. 21, 22A; PDP Regulations 2021, regs 4, 5, 7, 8" },
		H26: { t: "Before transferring outside Singapore (delivery)", s: "PDP Regulations 2021, regs 10 to 12" },
		H27: { t: "Deemed consent by notification (delivery)", s: "PDPA s. 15A(4)(b); Key Concepts, ch. 12" },
		H28: { t: "Do Not Call provisions (delivery)", s: "PDPA ss. 43 to 47; DNC Registry Regulations 2013, regs 15 to 17; PDPC Advisory Guidelines on the DNC Provisions (2021)" },
		H29: { t: "Children (delivery)", s: "PDPC Advisory Guidelines on children's personal data (2024), 4.2, 4.5" },
		U01: { t: "Organisation's name and the date the policy applies from", s: "APP 1.3" },
		U02: { t: "How the Act applies: Australian link, small business, agencies", s: "Privacy Act ss. 5B, 6C to 6EA, 7B(2)" },
		U03: { t: "Kinds of personal information and purposes", s: "APP 1.4(a), (c), 5.2(d); APP Guidelines 1.8" },
		U04: { t: "How personal information is collected and held", s: "APP 1.4(b), 5.2(b); APP Guidelines 5.10, 5.11" },
		U05: { t: "Sensitive information", s: "APP 3.3, 3.4; Privacy Act s. 6(1)" },
		U06: { t: "Collection required or authorised by law", s: "APP 5.2(c); APP Guidelines 5.12 to 5.14" },
		U07: { t: "Main consequences of not providing it", s: "APP 5.2(e); APP Guidelines 5.18 to 5.20" },
		U08: { t: "Identity and contact details", s: "APP 5.2(a); APP Guidelines 1.23, 5.9" },
		U09: { t: "Usual disclosures", s: "APP 1.4(c), 5.2(f); APP Guidelines 5.21 to 5.25" },
		U10: { t: "Overseas recipients", s: "APP 1.4(f), (g), 5.2(i), (j), APP 8; Privacy Act s. 16C; APP Guidelines 1.30, 1.32, 1.33, ch. 8" },
		U11: { t: "Retention and destruction", s: "APP 11.2; APP Guidelines 1.80" },
		U12: { t: "Security", s: "APP 11.1, 11.3" },
		U13: { t: "Access and correction", s: "APP 1.4(d), 12, 13" },
		U14: { t: "Complaints", s: "APP 1.4(e); Privacy Act s. 40(1A); APP Guidelines 1.28" },
		U15: { t: "Direct marketing", s: "APP 7" },
		U16: { t: "Anonymity and pseudonymity", s: "APP 2; APP Guidelines 1.80" },
		U17: { t: "Automated decisions", s: "APP 1.7 to 1.9 (from 10 December 2026); APP Guidelines 1.35 to 1.73" },
		U18: { t: "Registered APP code", s: "APP 1.4(e); APP Guidelines 1.27" },
		U19: { t: "Children", s: "APP Guidelines B.59 to B.61; Children's Online Privacy Code (pending)" },
		U20: { t: "New purpose", s: "APP 6.1, 6.2" },
		U21: { t: "Withdrawing consent", s: "APP Guidelines B.54" },
		U22: { t: "Employees and applicants", s: "Privacy Act s. 7B(3)" },
		U23: { t: "Not modelled", s: "Privacy Act Parts IIIA, IIIC, ss. 17, 18, Schedule 2; APP 4, 9" },
		U24: { t: "Collection notice (delivery)", s: "APP 5.1; APP Guidelines 5.5, 5.6" },
		U25: { t: "Policy free and in an appropriate form (delivery)", s: "APP 1.5, 1.6; APP Guidelines 1.81 to 1.88" },
		U26: { t: "Consent to an overseas disclosure (delivery)", s: "APP 8.2(b); APP Guidelines 8.31 to 8.37" },
		U27: { t: "Spam Act and Do Not Call Register (delivery)", s: "APP 7.8; Spam Act 2003; Do Not Call Register Act 2006; Interactive Gambling Act 2001" },
		U28: { t: "Handling access and correction requests (delivery)", s: "APP 12, 13" },
		U29: { t: "Keeping the policy up to date (delivery)", s: "APP 1.2, 1.3, 1.7 to 1.9" },
		V01: { t: "Responsible party's name and address, and the date", s: "POPIA s. 18(1)(b)" },
		V02: { t: "How POPIA applies: domicile or means in South Africa; private and public bodies", s: "POPIA ss. 1, 3(1)(b)" },
		V03: { t: "Purposes and the information collected", s: "POPIA ss. 13(1), 18(1)(a), (c)" },
		V04: { t: "Legal basis", s: "POPIA s. 11(1), (2)" },
		V05: { t: "Special personal information", s: "POPIA ss. 26 to 33; Health Information Regulations 2026 (GN 7198)" },
		V06: { t: "Children", s: "POPIA ss. 1, 34, 35" },
		V07: { t: "A law requiring or authorising collection", s: "POPIA s. 18(1)(f)" },
		V08: { t: "Voluntary or mandatory, and the consequences of not providing it", s: "POPIA s. 18(1)(d), (e)" },
		V09: { t: "Sources", s: "POPIA ss. 12, 18(1)(a), 18(2)(b)" },
		V10: { t: "Information Officer and contact details", s: "POPIA ss. 18(1)(b), 55, 56; PAIA s. 1; Guidance Note on Information Officers (2021)" },
		V11: { t: "Recipients and operators", s: "POPIA ss. 18(1)(h)(i), 20, 21" },
		V12: { t: "Transfers outside South Africa", s: "POPIA ss. 18(1)(g), 57(1)(d), 72" },
		V13: { t: "Retention", s: "POPIA s. 14" },
		V14: { t: "Security", s: "POPIA s. 19" },
		V15: { t: "Access, correction and deletion", s: "POPIA ss. 18(1)(h)(iii), 23, 24; Regulations, reg 3" },
		V16: { t: "Right to object", s: "POPIA ss. 11(3), (4), 18(1)(h)(iv); Regulations, reg 2.4" },
		V17: { t: "Withdrawing consent", s: "POPIA s. 11(2)(b)" },
		V18: { t: "Direct marketing", s: "POPIA ss. 11(3)(b), 69; Regulations, reg 6; Guidance Note on Direct Marketing" },
		V19: { t: "Automated decisions", s: "POPIA s. 71" },
		V20: { t: "Complaints and the Information Regulator", s: "POPIA ss. 18(1)(h)(v), 74, 99; Regulations, reg 7" },
		V21: { t: "Codes of conduct", s: "POPIA ss. 60, 77(1)(f)" },
		V22: { t: "New purpose", s: "POPIA s. 15" },
		V23: { t: "Employees and applicants", s: "POPIA s. 33(2); Health Information Regulations 2026 (GN 7198)" },
		V24: { t: "Prior authorisation", s: "POPIA ss. 57, 58" },
		V25: { t: "Not modelled", s: "POPIA ss. 6, 7, 18(4), 37, 38, 70; PAIA s. 51; sector laws" },
		V26: { t: "Timing of the notice (delivery)", s: "POPIA s. 18(2) to (4)" },
		V27: { t: "PAIA manual (delivery)", s: "PAIA s. 51(1)(c), (3), as amended by POPIA" },
		V28: { t: "Routes for objections and correction requests (delivery)", s: "Regulations, regs 2, 3 (as amended, 2025)" },
		V29: { t: "Consent to electronic direct marketing (delivery)", s: "POPIA s. 69(2); Regulations, reg 6; Guidance Note on Direct Marketing 6.4, 7.3.5, 8" },
		V30: { t: "Operator contracts (delivery)", s: "POPIA s. 21" },
		V31: { t: "Security compromises (delivery)", s: "POPIA s. 22" },
		V32: { t: "Consent to a transfer (delivery)", s: "POPIA ss. 11(2)(a), 18(1)(g), 72(1)(b)" },
		H30: { t: "Inferred data, automated decisions and profiling (transparency)", s: "PDPA s. 20(1)(a) (no rule of its own; needed for the policy text)" },
		Q01: { t: "Organisation identity and contact details", s: "PIPEDA Sch. 1, 4.8.2(a)" },
		Q02: { t: "Person accountable (Quebec: person in charge): name or title, and contact", s: "PIPEDA 4.1, 4.8.2(a); QC s. 3.1; AB s. 13(1)(b); BC ss. 4(5), 10(1)(b)" },
		Q03: { t: "Which Canadian laws apply", s: "PIPEDA s. 4; QC s. 1; AB s. 4; BC s. 3" },
		Q04: { t: "Purposes, in meaningful language", s: "PIPEDA 4.2, 4.3.2; QC ss. 4, 8; AB s. 13(1)(a); BC s. 10(1)(a); OPC consent guidelines" },
		Q05: { t: "Personal information collected", s: "PIPEDA 4.4.1, 4.8.2(c); OPC key element 1" },
		Q06: { t: "Condition of service and the person's choice", s: "PIPEDA 4.3.3; AB s. 7(2); BC s. 7(2); OPC principle 3" },
		Q07: { t: "Sensitive information: express consent", s: "PIPEDA 4.3.4, 4.3.6; QC ss. 12, 13; OPC form of consent" },
		Q08: { t: "Who the information is shared with", s: "OPC key element 2; QC s. 8, para. 2" },
		Q09: { t: "Information made available to related organisations", s: "PIPEDA 4.8.2(e)" },
		Q10: { t: "Means of collection", s: "QC s. 8, para. 1(2)" },
		Q11: { t: "Processing outside Canada", s: "OPC cross-border guidelines (2009); PIPEDA 4.1.3; AB ss. 6(2), 13.1" },
		Q12: { t: "Communication outside Quebec", s: "QC s. 8, para. 2; s. 17" },
		Q13: { t: "Technology that identifies, locates or profiles", s: "QC s. 8.1" },
		Q14: { t: "Decisions based exclusively on automated processing", s: "QC s. 12.1" },
		Q15: { t: "Children: parent or guardian consent", s: "OPC consent guidelines; QC ss. 4.1, 14" },
		Q16: { t: "Retention", s: "PIPEDA 4.5; QC s. 8, para. 3" },
		Q17: { t: "Rights and how to make a request", s: "PIPEDA 4.9, ss. 8, 10; QC ss. 7, 8, 27, 28, 28.1, 30, 32 to 34; AB ss. 9, 24 to 32; BC ss. 9, 23 to 32" },
		Q18: { t: "Complaints: to the organisation, then the regulator", s: "PIPEDA 4.10, s. 11; QC ss. 3.2, 42, 43, 81; AB ss. 46, 47; BC ss. 46, 47" },
		Q19: { t: "Withdrawing consent", s: "PIPEDA 4.3.8; QC s. 8, para. 1(4); AB s. 9; BC s. 9" },
		Q20: { t: "Risk of harm and other consequences", s: "OPC consent guidelines, key element 4" },
		Q21: { t: "Governance policies published", s: "QC s. 3.2" },
		Q22: { t: "Commercial or philanthropic prospecting", s: "QC s. 22" },
		Q23: { t: "New purposes and significant changes: consent first", s: "PIPEDA 4.2.4; OPC principle 6" },
		Q24: { t: "Language: French for Quebec", s: "Charter of the French language ss. 50.2, 52, 55" },
		Q25: { t: "Sources of the information", s: "QC s. 7; PIPEDA 4.9.1 (good practice)" },
		Q26: { t: "Purposes at or before collection", s: "PIPEDA 4.2; QC s. 8; AB s. 13; BC s. 10" },
		Q27: { t: "Quebec: confidentiality policy, person in charge and governance on the website", s: "QC ss. 3.1, 3.2, 8.2" },
		Q28: { t: "Quebec: highest confidentiality by default", s: "QC s. 9.1" },
		Q29: { t: "Quebec: impact assessment and written agreement first", s: "QC ss. 17, 18.3" },
		Q30: { t: "Asking for consent: per purpose, clear, at the right moment", s: "QC s. 14; OPC principles 3, 4; AB and BC s. 8(3)" },
		Q31: { t: "Automated decision: tell the person at the time", s: "QC s. 12.1" },
		Q32: { t: "Alberta: notice about service providers outside Canada", s: "AB s. 13.1" },
		A01: { t: "Tell people they are interacting with an AI system", s: "AI Act Art. 50(1); Gl. 32 to 40" },
		A01x: { t: "Obviousness exception, assessed and documented", s: "AI Act Art. 50(1); Gl. 42 to 45" },
		A02: { t: "Machine-readable marking of synthetic content", s: "AI Act Art. 50(2), 111(4); Gl. 153" },
		A03: { t: "Inform people exposed to emotion recognition or biometric categorisation", s: "AI Act Art. 50(3), 5(1)(f), 5(1)(g); Gl. 105 to 110" },
		A04: { t: "Label deep fakes", s: "AI Act Art. 50(4) first subpara., 3(60); Gl. 117 to 124" },
		A05: { t: "Disclose AI-generated text on matters of public interest", s: "AI Act Art. 50(4) second subpara.; Gl. 132 to 138" },
		A06: { t: "Clear, distinguishable, at first interaction or exposure, accessible", s: "AI Act Art. 50(5); Gl. 141 to 144" },
		A07: { t: "Inform workers' representatives and affected workers", s: "AI Act Art. 26(7)" },
		A08: { t: "Inform people subject to decisions by a high-risk system", s: "AI Act Art. 26(11)" },
		A09: { t: "Route for explanations of decisions", s: "AI Act Art. 86" },
		A10: { t: "GDPR information on automated decisions and profiling", s: "GDPR Art. 13(2)(f), 14(2)(g), 22" }
	};

	/* Article 5(1) AI Act as amended, verified against the consolidated text
	   on 12 November 2026. Paraphrased; points (ba) and (bb) apply from 2 December 2026. */
	var ART5 = [
		"(a) subliminal, purposefully manipulative or deceptive techniques that materially distort behaviour and cause or are reasonably likely to cause significant harm",
		"(b) exploiting vulnerabilities due to age, disability or a specific social or economic situation, with the same effect",
		"(ba) generating or manipulating realistic images, video, audio or similar material of an identifiable person's intimate parts, or of an identifiable person engaged in sexually explicit activities, without that person's freely given, specific, informed, unambiguous and explicit consent (from 2 December 2026)",
		"(bb) generating or manipulating child sexual abuse material (from 2 December 2026)",
		"(c) social scoring that leads to detrimental or unfavourable treatment in unrelated contexts or that is unjustified or disproportionate",
		"(d) predicting the risk that a person will commit a criminal offence based solely on profiling or personality traits",
		"(e) creating or expanding facial recognition databases through untargeted scraping of facial images from the internet or CCTV footage",
		"(f) inferring the emotions of people in the workplace or in education institutions, except for medical or safety reasons",
		"(g) biometric categorisation that deduces or infers race, political opinions, trade union membership, religious or philosophical beliefs, sex life or sexual orientation",
		"(h) real-time remote biometric identification in publicly accessible spaces for law enforcement, outside the narrow exceptions in Article 5"
	];

	/* Commission Guidelines C(2026) 7702, para 38: techniques that are not enough on their own. */
	var AI_NOT_ENOUGH = [
		"A disclosure only in terms and conditions, a URL or documentation",
		"Machine-readable marks (metadata, watermarks) the user cannot perceive at the point of interaction",
		"Unclear signals such as calling the system an \"assistant\", or a human-like persona that could mislead",
		"A generic statement such as \"Services on this website use AI\" that is not specific to the interaction",
		"A description of the technology only, such as \"this system uses LLMs\", without saying the user is dealing with AI"
	];

	/* WP260 para 13: qualifiers to avoid. Para 12: vague purposes. Annex: retention. */
	var LINT = {
		qualifiers: /\b(may|might|some|often|possible|possibly|perhaps)\b/i,
		vaguePurpose: /\b(develop(ing)? new services|research purposes|personali[sz]ed services|improve (our|the) services|business purposes|other purposes)\b/i,
		vagueRetention: /\b(as long as (is )?(necessary|needed|required)|for the necessary period|indefinite(ly)?)\b/i,
		aiTechOnly: /\b(LLM|large language model|machine learning|neural network|GPT)\b/i
	};

	return {
		BASES: BASES, ART9: ART9, ART9_NEEDS_LAW: ART9_NEEDS_LAW, ART9_TXT: ART9_TXT, TRANSFER_MECH: TRANSFER_MECH,
		ART46_OTHER: ART46_OTHER, ART49: ART49,
		REGIMES: REGIMES, UK_RLI: UK_RLI, TRANSFER_MECH_UK: TRANSFER_MECH_UK, ART46_OTHER_UK: ART46_OTHER_UK, ART49_UK: ART49_UK,
		UK_ADM_SPECIAL: UK_ADM_SPECIAL, CA_CATS: CA_CATS, CA_SPI_OK: CA_SPI_OK, CA_SPI_PURPOSES: CA_SPI_PURPOSES, CA_ADMT_EXC: CA_ADMT_EXC, CA_OOPS: CA_OOPS, CA_METHODS: CA_METHODS, US_STATES: US_STATES, CH_MECH: CH_MECH, CH_GUAR: CH_GUAR, CH_EXC: CH_EXC, CH_GROUNDS: CH_GROUNDS, CH_ADM_EXC: CH_ADM_EXC, RIGHTS_CH: RIGHTS_CH,
		BR_BASES: BR_BASES, BR_SENS: BR_SENS, BR_MECH: BR_MECH, RIGHTS_BR: RIGHTS_BR, BR_EU: BR_EU,
		CAN_JUR: CAN_JUR, CAN_CONSENT: CAN_CONSENT, RIGHTS_CAN: RIGHTS_CAN, CAN_REQ: CAN_REQ, CAN_COMPLAIN: CAN_COMPLAIN, IN_GROUNDS: IN_GROUNDS, IN_ERASE: IN_ERASE, CN_BASES: CN_BASES, JP_SENS_GROUNDS: JP_SENS_GROUNDS, JP_PROV: JP_PROV, JP_XBASIS: JP_XBASIS, KR_BASES: KR_BASES, KR_PROV: KR_PROV, KR_XBASIS: KR_XBASIS, SG_BASES: SG_BASES, SG_XBASIS: SG_XBASIS, AU_SENS: AU_SENS, AU_PGS: AU_PGS, AU_XBASIS: AU_XBASIS, AU_SB: AU_SB, ZA_BASES: ZA_BASES, ZA_SPECIAL: ZA_SPECIAL, ZA_SPECIAL_SEC: ZA_SPECIAL_SEC, ZA_KIDS: ZA_KIDS, ZA_XBASIS: ZA_XBASIS, ZA_FURTHER: ZA_FURTHER, ZA_DM: ZA_DM, ZA_ADM: ZA_ADM,
		RIGHTS: RIGHTS, MATRIX: MATRIX, ART5: ART5, AI_NOT_ENOUGH: AI_NOT_ENOUGH, LINT: LINT
	};
}());
