	/* ===================================================== SINGAPORE === */
	/* Singapore (matrix Part T): the Personal Data Protection Act 2012 (PDPA), 2020 Revised Edition as current on
	   Singapore Statutes Online on 13 November 2026, and the Personal Data Protection Regulations 2021 as amended up
	   to S 580/2026, read on sso.agc.gov.sg; with the PDPC Advisory Guidelines on Key Concepts (revised 29 April
	   2026), on children's personal data (28 March 2024) and on NRIC numbers (2018). Part 6B (data portability) is
	   not in force and is not offered. Notes in build/sg/notes.md. */
	function sgOn(s) { return inReg(s, "sg"); }
	/* Where a recipient is. "sg" only when nothing but Singapore places, Singapore cloud regions and filler words is left;
	   a recognised foreign place makes it "abroad"; anything else left over makes it "unknown" (fail closed). */
	var SG_SG = /\b(republic of singapore|singapore|singapura|jurong( east| west| island)?|changi|tampines|woodlands|punggol|sengkang|tuas|one-?north|one north|raffles place|marina bay|sentosa|ang mo kio|paya lebar|bedok|toa payoh|kallang|bishan|clementi|serangoon|yishun|hougang|pasir ris|bukit timah|bukit batok|bukit panjang|choa chu kang|tanjong pagar|buona vista|kent ridge|loyang|seletar|kranji|sembawang|tai seng|kaki bukit|geylang|katong|marine parade|outram|harbourfront|shenton way|cecil street|robinson road|anson road|science park)\b|\u65b0\u52a0\u5761|\u30b7\u30f3\u30ac\u30dd\u30fc\u30eb|\uc2f1\uac00\ud3ec\ub974/i;
	var SG_SG_G = new RegExp(SG_SG.source, "gi");
	var SG_CODE_G = /(^|[^A-Za-z])(SG|SGP)(?=[^A-Za-z]|$)/g;
	var SG_REGION = /\b(ap-southeast-1|asia-southeast1|southeastasia|azure southeast asia)\b|\b((aws|amazon web services|amazon) )?asia pacific \(singapore\)|\bsoutheast asia \(singapore\)/i;
	var SG_REGION_G = new RegExp(SG_REGION.source, "gi");
	var SG_ASIA_G = /\b(asia[- ]pacific|south[- ]?east asia|asia|apac|asean)\b/gi;
	var SG_FOR = /\b(outside singapore|other countries|other regions|multiple countries|international(ly)?|johor( bahru)?|iskandar|nusajaya|sedenak|kulai|batam|bintan|riau|penang|cyberjaya|putrajaya|selangor|perth|brisbane|adelaide|canberra|darwin|hobart|kowloon|las vegas|dallas|atlanta|phoenix|denver|houston|miami|bogota|lima|santiago|buenos aires|riyadh|jeddah|doha|abu dhabi|muscat|dhaka|phnom penh|yangon|colombo|karachi|lahore|pune|noida|gurugram|gurgaon|kolkata|cebu|davao|da nang|chiang mai|surabaya|bandung|medan|hangzhou|chengdu|tianjin|wuhan|nanjing|xiamen|hainan|ningxia|inner mongolia|guizhou)\b/i;
	var SG_FOR_CODE = /(^|[^A-Za-z])(HK|AU|JP|CN|KR|TW|TH|VN|PH|NZ|AE|UAE|KSA|DE|FR|NL|IE|BR|ZA)(?=[^A-Za-z]|$)/;
	var SG_FOR_CODE_LC = /(^|[^A-Za-z])(MY|ID|IN)(?=[^A-Za-z]|$)/;
	var SG_FILL = /\b(and|or|with|plus|also|both|all|only|the|a|an|of|our|own|its|their|in|at|on|by|from|via|primary|secondary|main|backups?|back-ups?|backed up|dr|disaster recovery|failover|replicas?|regions?|clouds?|data ?cent(er|re)s?|servers?|hosted|hosting|host|stored|storage|located|based|locally|local|onshore|availability zones?|zones?|az|multi-az|aws|amazon web services|amazon|microsoft azure|azure|microsoft|google cloud platform|google cloud|google|gcp|oracle cloud( infrastructure)?|oracle|oci|alibaba cloud|alibaba|tencent cloud|huawei cloud|ibm cloud|equinix|digital realty|offices?|premises|headquarters|hq|branch|business|industrial|estate|hub|campus|sites?|colocation|colo|facility|facilities|centre|center|city|island|mainland|road|street|avenue|drive|lane|crescent|boulevard|place|tower|building|level|floor|unit|park|east|west|north|south|central)\b/gi;
	function sgForeign(w) {
		var raw = String(w || "");
		if (/\boutside singapore\b/i.test(raw)) return true;
		var x = raw.replace(SG_REGION_G, " ").replace(SG_SG_G, " ").replace(SG_CODE_G, "$1 ");
		if (KR_REGION.test(x)) return true;
		x = x.replace(/\bsouth[- ]?east[- ]?asia\b/gi, " ");
		if (/\beast[- ]?asia\b/i.test(x)) return true;
		x = x.replace(SG_ASIA_G, " ");
		return jpForeign(x) || JP_JP.test(x) || KR_KR.test(x) || KR_FOR_H.test(x) || SG_FOR.test(x) || SG_FOR_CODE.test(x) || (/[a-z]/.test(raw) && SG_FOR_CODE_LC.test(x));
	}
	function sgNamesSg(w) { return SG_SG.test(w) || SG_REGION.test(w) || new RegExp(SG_CODE_G.source).test(w); }
	function sgLeft(w) {
		var x = String(w).replace(SG_REGION_G, " ").replace(SG_SG_G, " ").replace(SG_CODE_G, "$1 ");
		x = x.replace(SG_FILL, function (m) { return /^(IN|MY|ID)$/.test(m) ? m : " "; });
		return /[A-Za-z\u00c0-\uffff]/.test(x);
	}
	function sgWhere(w) {
		w = String(w || "").trim();
		if (!w) return "";
		if (sgForeign(w)) return "abroad";
		if (!sgNamesSg(w)) return "unknown";
		return !sgLeft(w) || (SG_SG.test(w) && /(^|\D)\d{6}(\D|$)/.test(w)) ? "sg" : "unknown";
	}
	function sgDi(s) { return arr(s, "recipients").filter(function (r) { return v(r, "role") === "processor"; }); }
	function sgOrgs(s) { return arr(s, "recipients").filter(function (r) { var ro = v(r, "role"); return ro === "controller" || ro === "joint" || ro === "authority"; }); }
	function sgNoRole(s) { return arr(s, "recipients").filter(function (r) { return !v(r, "role"); }); }
	function sgXrows(s) { return yes(s, "sgAbroad") ? arr(s, "sgXrows") : []; }
	function sgOffshore(s) { return v(s, "sgScope") === "abroad"; }
	function sgRecAbroad(s) { return arr(s, "recipients").filter(function (r) { return sgWhere(v(r, "where")) === "abroad"; }); }
	/* A recipient with no location counts as unknown: the policy cannot then say that nothing leaves Singapore. */
	function sgRecUnknown(s) { return arr(s, "recipients").filter(function (r) { var w = sgWhere(v(r, "where")); return w === "unknown" || w === ""; }); }
	function sgNoWhere(s) { return arr(s, "recipients").filter(function (r) { return !String(v(r, "where") || "").trim(); }); }
	function sgNamesAt(list) { return joinList(list.map(function (r) { return jpTrim(v(r, "who") || "[recipient]") + (v(r, "where") ? " (" + v(r, "where") + ")" : ""); })); }
	function sgOwn(s, name) { return jpSame(name, v(s, "ctrlName")); }
	function sgPl(list) { return joinList(list.map(function (a) { return "\"" + jpTrim(v(a, "purpose") || "[purpose]") + "\""; })); }
	/* Consent given or deemed: the purposes section 16 lets people withdraw from. */
	var SG_CONSENTISH = ["consent", "deemed", "contract", "notify"];
	function sgConsentAct(a) { return SG_CONSENTISH.indexOf(v(a, "sgBasis")) !== -1; }
	function sgFurtherConsent(s) { return yes(s, "further") && (v(s, "sgFurther") === "consent" || v(s, "sgFurther") === "notify"); }
	function sgConsent(s) { return pnActs(s).some(sgConsentAct) || sgXrows(s).some(function (r) { return v(r, "basis") === "consent"; }) || sgFurtherConsent(s); }
	/* Requests must be in writing (regulation 3(1)): a contact can be written to only if it has an email or postal address. */
	function sgWritable(c) { c = String(c || ""); return /@/.test(c) || /(^|\D)\d{6}(\D|$)/.test(c) || /\b(road|rd|street|avenue|ave|drive|lane|crescent|boulevard|tower|building|level|floor|unit|po box|p\.o\. box)\b/i.test(c) || /#\d/.test(c); }
	function sgDpoWay(s) { return v(s, "sgDpoContact") ? "our data protection officer at " + jpTrim(v(s, "sgDpoContact")) : ""; }
	function sgReqWay(s) { return v(s, "sgReqHow") || v(s, "rightsContact") || (sgWritable(v(s, "sgDpoContact")) ? "write to " + sgDpoWay(s) : "") || (v(s, "ctrlEmail") ? "write to " + jpTrim(v(s, "ctrlEmail")) : ""); }
	function sgComplaintWay(s) { return v(s, "sgComplaint") || (v(s, "sgDpoContact") ? "contact " + sgDpoWay(s) : "") || (v(s, "ctrlEmail") ? "write to " + jpTrim(v(s, "ctrlEmail")) : ""); }
	function sgWithdrawWay(s) { return v(s, "withdrawHow") ? krLc(v(s, "withdrawHow")) : sgWritable(v(s, "sgDpoContact")) ? "write to " + sgDpoWay(s) : v(s, "rightsContact") ? krLc(v(s, "rightsContact")) : v(s, "ctrlEmail") ? "write to " + jpTrim(v(s, "ctrlEmail")) : ""; }
	/* Text that looks like sending marketing messages (First Schedule, Part 3, paragraph 1(4); Part 5, paragraph 1(6); Second Schedule,
	   Part 2, Division 2, paragraph 1(3); regulation 13; Tenth Schedule). A keyword test: it warns, it does not decide. */
	function sgMktText(p) {
		p = String(p || "");
		if (/\bmarket research\b/i.test(p)) return false;
		var q = p.replace(/\b(job|employment) offers?\b|\boffer letters?\b/gi, " ");
		return /\b(marketing|telemarketing|promotions?|promotional|promote|promoting|newsletters?|advertis\w*|cross-?sell\w*|up-?sell\w*|campaigns?|deals|discounts?|vouchers?|coupons?|offers)\b/i.test(q) ||
			(/\b(recommend\w*|suggest\w*|offer|offering)\b/i.test(q) && /\b(to you|to customers|to members|e-?mails?|sms|texts?|whatsapp|telegram|messages?|calls?|by post|newsletters?)\b/i.test(q));
	}
	function sgMkt(a) { return sgMktText(v(a, "purpose")); }
	/* Business improvement: First Schedule, Part 5 for a corporation; Second Schedule, Part 2, Division 2 for other organisations. */
	function sgBipRef(s) { var c = v(s, "sgCorp"); return c === "Yes" ? "First Schedule, Part 5" : c === "No" ? "Second Schedule, Part 2, Division 2" : "[First Schedule, Part 5, for a corporation, or Second Schedule, Part 2, Division 2: say whether you are a corporation]"; }
	function sgContractOrgsMissing(s) { return pnActs(s).some(function (a) { return v(a, "sgBasis") === "contract"; }) && !sgOrgs(s).length; }
	function sgBasisCell(s, a) {
		var b = lbl(D.SG_BASES, v(a, "sgBasis"));
		if (!b) return "[How the PDPA allows it: consent, deemed consent or an exception.]";
		if (b.v === "notify") return b.t + " (" + b.ref + "). To opt out: " + jpDot(krLc(v(a, "sgOptOut") || "[how and by when]"));
		var ex = b.v === "li" && v(a, "sgLi") ? ": " + jpTrim(krLc(v(a, "sgLi"))) :
			b.v === "exception" ? ": " + jpTrim(krLc(v(a, "sgExc") || "[the exception, with its Schedule, Part and paragraph]")) :
			b.v === "law" ? ": " + jpTrim(v(a, "sgLaw") || "[the law and section]") : "";
		return b.t + ex + " (" + (b.v === "bip" ? sgBipRef(s) : b.ref) + ")";
	}
	function sgRet(a) { return v(a, "retention") || "Until it no longer serves the purpose and we no longer need it for legal or business purposes"; }

	/* Section 20(1)(a): the purposes, with how the PDPA allows each. */
	function sgPurposeBlocks(s) {
		var acts = pnActs(s);
		if (!acts.length) return [{ k: "p", x: "[Add the purposes for which you collect, use and disclose personal data.]" }];
		var b = [{ k: "p", x: "We collect, use and disclose personal data for these purposes (section 20(1)):" },
			{ k: "table", head: ["Purpose", "Personal data", "How the PDPA allows it", "How long we keep it"], rows: acts.map(function (a) {
				return [jpTrim(v(a, "purpose") || "[purpose]"), v(a, "data") || "[personal data]", sgBasisCell(s, a), sgRet(a)]; }) },
			{ k: "p", x: "We use and disclose personal data only for these purposes. Before we use or disclose it for another purpose, we tell you that purpose, unless the law allows it without your consent (sections 18 and 20)." }];
		var li = acts.filter(function (a) { return v(a, "sgBasis") === "li"; });
		if (li.length) b.push({ k: "p", x: "For " + sgPl(li) + ", we rely on the legitimate interests exception, for our legitimate interests or, where the table names another person, that person's. Before relying on it, we assessed that those interests outweigh any adverse effect on you, and took steps to reduce that effect. Questions about it go to our data protection officer (First Schedule, Part 3, paragraph 1)." });
		var nt = acts.filter(function (a) { return v(a, "sgBasis") === "notify"; });
		if (nt.length) b.push({ k: "p", x: "For " + sgPl(nt) + ", we rely on deemed consent by notification. Before relying on it, we assessed that it is not likely to have an adverse effect on you. You can tell us that you do not consent, as shown in the table (section 15A)." });
		if (yes(s, "sgNric")) {
			var w = v(s, "sgNricWhy");
			b.push({ k: "p", x: "We collect NRIC numbers or other national identification numbers " + (w === "law" ? "because the law requires it: " + jpDot(v(s, "sgNricDetail") || "[the law]") :
				w === "id" ? "because we need to establish or verify your identity to a high degree of fidelity: " + jpDot(krLc(v(s, "sgNricDetail") || "[why]")) :
				w === "exc" ? "because an exception in the PDPA allows it without consent: " + jpDot(v(s, "sgNricDetail") || "[the exception, with its Schedule, Part and paragraph]") :
				"[only where the law requires it, where an exception in the PDPA applies, or where you must verify identity to a high degree of fidelity: say which and why].") });
		}
		return b;
	}
	function sgRetainBlock(s, where) {
		return { k: "p", x: "We stop keeping personal data, or remove what links it to you, as soon as it no longer serves the purpose for which we collected it and we no longer need it for legal or business purposes (section 25). The periods are shown " + where + "." };
	}
	/* The age from which a child can consent: 13, or a higher age the organisation sets (Children's Guidelines 4.3). */
	function sgKidsAge(s) { var n = parseInt(v(s, "sgKidsAge"), 10); return n > 13 && n <= 17 ? n : 13; }
	function sgKidsBlocks(s) {
		var a = sgKidsAge(s), b = [];
		b.push({ k: "p", x: "If you are " + (a < 17 ? "between " + a + " and 17" : "17") + ", you can give consent yourself where you understand this policy. If we have reason to believe that you do not, we ask your parent or guardian." });
		if (yes(s, "sgKids13")) b.push({ k: "p", x: "For children under " + a + ", we ask a parent or guardian for consent and tell them the purposes. How we obtain it: " + jpDot(krLc(v(s, "sgKidsHow") || "[how you obtain and check the consent of a parent or guardian]")) });
		return b;
	}
	function sgShareBlocks(s) {
		var b = [], di = sgDi(s), org = sgOrgs(s), nr = sgNoRole(s);
		var at = function (r) { return v(r, "where") ? " Located in " + jpDot(v(r, "where")) : ""; };
		var cn = pnActs(s).filter(function (a) { return v(a, "sgBasis") === "contract"; });
		var cnNote = { k: "p", x: "[" + sgPl(cn) + " relies on deemed consent for disclosure to other organisations needed for a contract with the person (section 15(3) to (8)): list those organisations as recipients, or choose another basis.]" };
		if (!arr(s, "recipients").length) {
			b.push(cn.length ? cnNote : yes(s, "sgNoRecip") ? { k: "p", x: "We do not disclose your personal data to other organisations, and no service provider processes it on our behalf." } :
				{ k: "p", x: "[List the organisations that receive the personal data, including service providers that process it on your behalf, or confirm in the Singapore section that there are none.]" });
			return b;
		}
		if (di.length) b.push({ k: "p", x: "These service providers process personal data on our behalf, as data intermediaries. We remain responsible for it (section 4(3)):" },
			{ k: "ul", items: di.map(function (r) { return { b: (v(r, "who") || "[service provider]") + ":", x: stop(v(r, "why") || "[what it does for us]") + at(r) }; }) });
		if (org.length) b.push({ k: "p", x: "We disclose personal data to these organisations, for the purposes shown:" },
			{ k: "ul", items: org.map(function (r) { return { b: (v(r, "who") || "[organisation]") + ":", x: stop(v(r, "why") || "[the purpose of the disclosure]") + at(r) }; }) });
		else if (cn.length) b.push(cnNote);
		else if (!nr.length) b.push({ k: "p", x: "We do not disclose your personal data to other organisations for their own purposes." });
		nr.forEach(function (r) { b.push({ k: "p", x: "[Give the role of " + (v(r, "who") || "this recipient") + ": a service provider processing for you, or another organisation.]" }); });
		return b;
	}
	/* Section 26; regulations 9 to 12. */
	var SG_CERT = { "apec-cbpr": "the APEC Cross-Border Privacy Rules (CBPR) System", "global-cbpr": "the Global Cross-Border Privacy Rules (CBPR) System",
		"apec-prp": "the APEC Privacy Recognition for Processors (PRP) System", "global-prp": "the Global Privacy Recognition for Processors (PRP) System" };
	function sgXbasis(s, r) {
		var ba = v(r, "basis");
		return ba === "contract" ? "a contract binds the recipient to a standard of protection comparable to the PDPA (regulation 11(1)(b), (2))." :
			ba === "bcr" ? "binding corporate rules within our group bind the recipient to a comparable standard (regulation 11(1)(c), (3))." :
			ba === "law" ? "the law that applies to the recipient binds it to a comparable standard: " + jpRef(v(r, "lawName") || "[the law]", "regulation 11(1)(a)") :
			ba === "instrument" ? "a legally binding instrument binds the recipient to a comparable standard: " + jpRef(v(r, "lawName") || "[the instrument]", "regulation 11(1)(d)") :
			ba === "cert" ? "the recipient holds a certification under " + (SG_CERT[v(r, "certKind")] || "[the certification system]") + " (regulation 12)." :
			ba === "consent" ? "your consent, given after we told you in writing how the data is protected there: " + jpRef(krLc(v(r, "summary") || "[a reasonable summary of the protection in that country]"), "regulation 10(2)(a), (3)") :
			ba === "contractNeed" ? "you are deemed to have consented to the disclosure to it, as reasonably necessary for a contract with you (section 15(3) to (8); regulation 10(2)(b))." :
			ba === "vital" ? "it is needed for a use or disclosure in your vital interests or in the national interest, and we have taken reasonable steps so that the recipient uses it for nothing else (regulation 10(2)(c))." :
			ba === "public" ? "the data is publicly available in Singapore (regulation 10(2)(e))." :
			ba === "transit" ? "the data only passes through Singapore on its way to another country, and no organisation accesses, uses or receives it here except to transport it (regulations 9 and 10(2)(d))." :
			ba === "exempt" ? "the Personal Data Protection Commission has exempted us by written notice: " + jpRef(v(r, "lawName") || "[the notice, with its date]", "section 26(2)") :
			ba === "own" ? (sgOwnOk(s, r) ? "it stays within our own organisation, on our systems or at our offices there (regulation 9)." :
				"[" + jpTrim(v(r, "recipient") || "This recipient") + " is not our own organisation: choose another basis (regulation 9).]") :
			"[the basis for the transfer under regulations 10 to 12].";
	}
	/* "Own systems" holds only for the organisation itself (regulation 9: the transferring organisation is not a recipient). */
	function sgOwnOk(s, r) {
		var n = v(r, "recipient");
		return !!n && sgOwn(s, n) && !arr(s, "recipients").some(function (x) { return jpSame(v(x, "who"), n) && !!v(x, "role"); });
	}
	function sgRowRec(s, r) { return arr(s, "recipients").filter(function (x) { return jpSame(v(x, "who"), v(r, "recipient")); })[0]; }
	function sgAbroadBlocks(s) {
		var b = [], off = sgOffshore(s), ab = sgRecAbroad(s), unk = sgRecUnknown(s), rows = sgXrows(s);
		if (off) b.push({ k: "p", x: "We are based outside Singapore. We process the personal data we collect from people in Singapore in " + jpTrim(v(s, "sgOffWhere") || "[the countries where you process it]") + "." });
		if (no(s, "sgAbroad")) {
			if (off) return b;
			if (ab.length) b.push({ k: "p", x: "[" + sgNamesAt(ab) + (ab.length > 1 ? " are" : " is") + " outside Singapore. Answer Yes under transfers outside Singapore and add " + (ab.length > 1 ? "them" : "it") + ".]" });
			else if (unk.length) b.push({ k: "p", x: "[Check where " + sgNamesAt(unk) + (unk.length > 1 ? " are" : " is") + " located. If outside Singapore, answer Yes under transfers outside Singapore and add " + (unk.length > 1 ? "them" : "it") + ".]" });
			else b.push({ k: "p", x: "We do not transfer personal data outside Singapore." });
			return b;
		}
		if (!yes(s, "sgAbroad")) { b.push({ k: "p", x: "[Say whether personal data is transferred outside Singapore.]" }); return b; }
		b.push({ k: "p", x: "We transfer personal data outside Singapore only as the PDPA's transfer rules allow (section 26; Personal Data Protection Regulations 2021, regulations 9 to 12):" });
		b.push(rows.length ? { k: "ul", items: rows.map(function (r) { return { b: (v(r, "recipient") || "[recipient]") + " (" + jpTrim(v(r, "country") || "[country]") + "):",
			x: sgWhere(v(r, "country")) === "sg" ? "[This row names Singapore: list only transfers to countries or territories outside Singapore.]" : sgXbasis(s, r) }; }) } :
			{ k: "p", x: "[Add each transfer outside Singapore.]" });
		var inRows = function (r) { return rows.some(function (x) { return jpSame(v(x, "recipient"), v(r, "who")); }); };
		var miss = off ? [] : ab.filter(function (r) { return !inRows(r); });
		if (miss.length) b.push({ k: "p", x: "[Add " + sgNamesAt(miss) + " to the transfers outside Singapore, or correct " + (miss.length > 1 ? "their locations" : "its location") + ".]" });
		var unkMiss = off ? [] : unk.filter(function (r) { return !inRows(r); });
		if (unkMiss.length) b.push({ k: "p", x: "[Check where " + sgNamesAt(unkMiss) + (unkMiss.length > 1 ? " are" : " is") + " located. If outside Singapore, add " + (unkMiss.length > 1 ? "them" : "it") + " to the transfers outside Singapore.]" });
		return b;
	}
	function sgSecBlock(s) {
		return { k: "p", x: "We protect personal data with reasonable security arrangements against unauthorised access, collection, use, disclosure, copying, modification or disposal, and against the loss of devices that store it (section 24)" +
			(v(s, "sgSecurity") ? ": " + stop(krLc(v(s, "sgSecurity"))) : ".") };
	}
	function sgWithdrawBlock(s) {
		var how = sgWithdrawWay(s);
		return { k: "p", x: "You can withdraw your consent, including consent treated as given (deemed consent), at any time by giving us reasonable notice: " + (how ? jpDot(how) : "[how to withdraw consent].") +
			" We then tell you the likely consequences, and stop collecting, using and disclosing the personal data for that purpose, and make our data intermediaries and agents stop, unless the law requires or allows it without your consent (section 16)." };
	}
	/* Sections 21, 22; regulations 3 to 7. */
	function sgRightsBlocks(s) {
		var fee = v(s, "sgFee");
		return [{ k: "ul", items: [
			{ b: "Access (section 21).", x: "You can ask for the personal data we hold about you, and how we have used or disclosed it in the year before your request. " +
				(fee === "Yes" ? "We charge a reasonable fee for access, and only after giving you a written estimate of it (regulation 7)." : fee === "No" ? "We do not charge for access." : "[Say whether you charge a fee for access.]") },
			{ b: "Correction (section 22).", x: "You can ask us to correct an error or omission. Unless we have reasonable grounds not to, we correct it as soon as practicable and send the corrected data to the organisations we disclosed it to in the year before, where they need it. If we do not correct it, we note the correction you asked for. We do not charge for correction (regulation 7(4))." }] },
			{ k: "p", x: "Make requests in writing, with enough detail for us to identify you and what you ask for: " + jpDot(krLc(sgReqWay(s) || "[where to send requests]")) +
				" We respond as soon as we reasonably can. If we need more than 30 days, we tell you in writing within 30 days when we will respond (regulation 5)." +
				" The law sets exceptions to access, for example where giving the data would reveal personal data about someone else (section 21(3)), and to access and correction for the kinds of data listed in the Fifth and Sixth Schedules, such as opinions kept only for evaluative purposes." +
				" If we refuse access, we tell you, with our reasons (section 21(6)); if we give access but leave out part of the data, we tell you that too (section 21(7))." }];
	}
	function sgComplaintBlocks(s, led) {
		var how = sgComplaintWay(s), b = [];
		b.push({ k: "p", x: "If you have a question or a complaint about how we handle your personal data, " + (how ? jpDot(krLc(how)) : "[how to make a complaint].") +
			" You can also ask us for information about our data protection policies and practices and our complaint process (section 12)." });
		if (led) {
			var ch = [];
			if (v(s, "ctrlEmail")) ch.push({ b: "Email:", x: v(s, "ctrlEmail") });
			if (v(s, "ctrlAddress")) ch.push({ b: "Post:", x: v(s, "ctrlAddress").replace(/\n+/g, ", ") });
			if (v(s, "ctrlPhone")) ch.push({ b: "Telephone:", x: v(s, "ctrlPhone") });
			if (ch.length) b.push({ k: "p", x: "Our contact details:" }, { k: "ul", items: ch });
		}
		b.push({ k: "p", x: "If you are not satisfied, you can raise a concern with the Personal Data Protection Commission (www.pdpc.gov.sg). You can also ask the Commission to review a refusal to give you access or to make a correction, a failure to do either within a reasonable time, or a fee we charge for access (section 48H). If you suffer loss or damage directly from a breach of Parts 4 to 6A of the PDPA, you can bring civil proceedings, after any decision of the Commission on the matter has become final (section 48O)." });
		return b;
	}
	function sgDpoBlocks(s) {
		return [{ k: "p", x: "Our data protection officer is responsible for our compliance with the PDPA and answers questions about how we collect, use and disclose personal data (sections 11(3), 11(5) and 20(1)(c)):" },
			{ k: "ul", items: [{ b: "Data protection officer:", x: (v(s, "sgDpo") || "Data Protection Officer") + ", " + jpTrim(v(s, "sgDpoContact") || "[business email or postal address]") }] }];
	}
	function sgFurtherTxt(s) {
		var f = v(s, "sgFurther");
		return f === "consent" ? "We will ask for your consent first (sections 14 and 20(1)(b))." :
			f === "notify" ? "We will tell you beforehand and give you a reasonable period to tell us that you do not consent (section 15A)." :
			f === "li" ? "We will rely on the legitimate interests exception, after assessing that our legitimate interests outweigh any adverse effect on you (First Schedule, Part 3, paragraph 1)." :
			f === "exception" ? "The law allows it without your consent: " + jpRef(v(s, "sgFurtherLaw") || "[the exception or law]", "sections 13(b) and 17") :
			"[Say whether you will ask for consent, rely on deemed consent by notification, rely on legitimate interests, or rely on another exception.]";
	}

	/* The PDPA applies to an organisation's activities in Singapore, whoever the person is (section 2(1); Key Concepts p. 36). An organisation
	   abroad reaches people in Singapore, so the section is framed for them; an organisation in Singapore frames it by activity. */
	function sgHead(s) { return sgOffshore(s) ? "Additional information for people in Singapore" : "Additional information under Singapore's PDPA"; }
	function sgPointer(s, n) {
		return (sgOffshore(s) ? "If you are in Singapore, section " + n + " also applies to you." : "For personal data we collect, use or disclose in Singapore, section " + n + " also applies.") +
			" Our data protection officer: " + (v(s, "sgDpo") || "Data Protection Officer") + ", " + stop(v(s, "sgDpoContact") || "[business contact information]");
	}
	/* The Singapore section of a notice led by another law. */
	function sgSection(s, secs, lawName) {
		var b = [], H = function (t) { b.push({ k: "h3", x: t }); };
		var other = secs.filter(Boolean).map(String);
		b.push({ k: "p", x: (sgOffshore(s) ? "For people in Singapore, the Personal Data Protection Act 2012 (PDPA) applies to the personal data we collect from them, and this section is our data protection policy under it." :
			"The Personal Data Protection Act 2012 (PDPA) applies to personal data we collect, use or disclose in Singapore, whoever it is about, and this section is our data protection policy under it.") +
			" The choices and rights in this section are those this law gives you." +
			(other.length ? " " + (other.length > 1 ? "Sections " : "Section ") + joinList(other) + (other.length > 1 ? " apply" : " applies") + " to you only where " + lawName + " applies to our processing of your data." : "") });
		H("Purposes, personal data and retention");
		Array.prototype.push.apply(b, sgPurposeBlocks(s));
		b.push(sgRetainBlock(s, "in the table above"));
		if (yes(s, "sgKids") && sgConsent(s)) { H("Children"); Array.prototype.push.apply(b, sgKidsBlocks(s)); }
		H("Who we disclose it to");
		Array.prototype.push.apply(b, sgShareBlocks(s));
		H(sgOffshore(s) ? "Where we process it, and transfers outside Singapore" : "Transfers outside Singapore");
		Array.prototype.push.apply(b, sgAbroadBlocks(s));
		H("Protection");
		b.push(sgSecBlock(s));
		if (sgConsent(s)) { H("Withdrawing consent"); b.push(sgWithdrawBlock(s)); }
		H("Access and correction");
		Array.prototype.push.apply(b, sgRightsBlocks(s));
		H("Questions and complaints");
		Array.prototype.push.apply(b, sgComplaintBlocks(s));
		H("Data protection officer");
		Array.prototype.push.apply(b, sgDpoBlocks(s));
		if (yes(s, "further")) b.push({ k: "p", x: "For the planned new use described in this notice: " + lcFirst(sgFurtherTxt(s)) });
		return b;
	}

	/* Part T rows. led: Singapore sets the main text. */
	function sgChecks(s, led) {
		var checks = [], delivery = [], acts = pnActs(s), off = sgOffshore(s), cons = sgConsent(s), rec = arr(s, "recipients");
		var pl = sgPl;
		var nm = function (list, key) { return joinList(list.map(function (r) { return jpTrim(v(r, key || "who") || "[recipient]"); })); };
		var pick = function (id, m, w, c, okNote, naNote) { return m.length ? chk(id, "missing", m.concat(w, c).join(" ")) : w.length ? chk(id, "warn", w.concat(c).join(" ")) : c.length ? chk(id, "check", c.join(" ")) : naNote ? chk(id, "na", naNote) : chk(id, "ok", okNote || ""); };
		var by = function (k) { return acts.filter(function (a) { return v(a, "sgBasis") === k; }); };
		if (led) { var m1 = []; if (!v(s, "ctrlName")) m1.push("Add the organisation's name."); if (!v(s, "effective")) m1.push("Give the date this policy applies from" + " (needed for the policy text; not a PDPA requirement).");
			checks.push(m1.length ? chk("H01", "missing", m1.join(" ")) : chk("H01", "ok", "The organisation's name and the date the policy applies from.")); }
		var m2 = [], w2 = [], c2 = [];
		if (!v(s, "sgScope")) m2.push("Say whether you are in Singapore, or collect, use or disclose personal data in Singapore from abroad.");
		if (off && !v(s, "sgOffWhere")) m2.push("Name the countries where you process the personal data: the policy prints them.");
		if (yes(s, "publicBody")) w2.push("The PDPA's data protection rules impose no obligation on public agencies (section 4(1)(c)); a statutory body that is not specified as a public agency is an organisation under them. Check which rules apply to you.");
		if (off) c2.push("The PDPA applies to organisations whether or not they are formed or resident in Singapore (section 2(1)).");
		checks.push(pick("H02", m2, w2, c2, "An organisation in Singapore."));
		var vp = acts.filter(function (a) { return D.LINT.vaguePurpose.test(v(a, "purpose")); }), np = acts.filter(function (a) { return !String(v(a, "purpose") || "").trim(); });
		checks.push(!acts.length ? chk("H03", "missing", "Add the purposes for which you collect, use and disclose personal data (section 20(1)(a)).") :
			np.length ? chk("H03", "missing", "Name each purpose: " + np.length + (np.length > 1 ? " purposes have" : " purpose has") + " no name, and the policy prints [purpose] (section 20(1)(a)).") :
			vp.length ? chk("H03", "warn", "Make each purpose specific: " + stop(pl(vp)) + " Give purposes at an appropriate level of detail (Key Concepts, ch. 14).") : chk("H03", "ok"));
		var noData = acts.filter(function (a) { return !v(a, "data"); });
		checks.push(!acts.length ? chk("H04", "na", "No purposes yet.") : noData.length ? chk("H04", "missing", "Give the personal data for " + pl(noData) + " (good practice; the policy prints a placeholder).") : chk("H04", "ok"));
		if (led) {
			var m30 = [];
			if (yes(s, "inferred") && !v(s, "inferredWhat")) m30.push("Say what you infer about people, and from what.");
			if (yes(s, "adm") && !v(s, "admWhat")) m30.push("Describe the automated decisions and what they are based on.");
			else if (!yes(s, "adm") && yes(s, "profiling") && !v(s, "profilingWhat")) m30.push("Describe the analysis and what it is used for.");
			checks.push(m30.length ? chk("H30", "missing", m30.join(" ") + " The policy prints a placeholder (needed for the policy text; the PDPA has no rule of its own on these).") :
				yes(s, "inferred") || yes(s, "adm") || yes(s, "profiling") ? chk("H30", "ok", "Described for transparency; the purposes and data they use are in section 1 (section 20(1)(a)).") :
				chk("H30", "na", "No inferred data, automated decisions or profiling."));
		}
		/* H05: how the PDPA allows each purpose */
		var noB = acts.filter(function (a) { return !v(a, "sgBasis"); }), lawNo = by("law").filter(function (a) { return !v(a, "sgLaw"); }), excNo = by("exception").filter(function (a) { return !v(a, "sgExc"); });
		var mk = acts.filter(function (a) { return ["li", "notify", "bip"].indexOf(v(a, "sgBasis")) !== -1 && sgMkt(a); }), emp = by("employ"), bip = by("bip");
		var m5 = [], w5 = [], c5 = [];
		if (noB.length) m5.push("Say how the PDPA allows " + pl(noB) + ": consent, deemed consent or an exception (sections 13 to 17).");
		if (lawNo.length) m5.push("Name the law for " + stop(pl(lawNo)));
		if (excNo.length) m5.push("Name the exception, with its Schedule, Part and paragraph, for " + stop(pl(excNo)));
		if (mk.length) w5.push(pl(mk) + (mk.length > 1 ? " look" : " looks") + " like sending marketing messages. Legitimate interests, business improvement and deemed consent by notification cannot be used for that (First Schedule, Part 3, paragraph 1(4), and Part 5, paragraph 1(6); regulation 13): use consent.");
		if (emp.length && ["employee", "applicant"].indexOf(v(s, "audience")) === -1) w5.push("The employment exception (" + pl(emp) + ") covers only entering into, managing or ending employment or an appointment (First Schedule, Part 3, paragraph 10).");
		if (bip.length && !v(s, "sgCorp")) m5.push("Say whether your organisation is a corporation: business improvement (" + pl(bip) + ") is in First Schedule, Part 5, for a corporation, and Second Schedule, Part 2, Division 2, for other organisations.");
		if (bip.length) c5.push("Business improvement (" + pl(bip) + ") covers using personal data to improve or develop goods, services, methods or processes, or to understand people's behaviour and preferences or personalise goods or services for them, only where identifiable data is needed and a reasonable person would consider the use appropriate (First Schedule, Part 5, paragraph 1(1)(b), (2), (4); Second Schedule, Part 2, Division 2, paragraph 1). It does not cover collecting the data for that purpose. A corporation can also collect it from, or disclose it to, a related corporation, where a contract or binding corporate rules require safeguards and, for understanding or personalising, the person is an existing customer (Part 5, paragraph 1(1)(a), (c), (3), (5)). Never for sending marketing messages.");
		if (by("consent").length) c5.push("Consent counts only if people had the purposes first, it was not required beyond what is reasonable for the product or service, and nothing misleading was used to get it (section 14).");
		if (sgContractOrgsMissing(s)) m5.push("Deemed consent under section 15(3) to (8) (" + pl(by("contract")) + ") covers disclosure to another organisation, and that organisation's collection and use, reasonably necessary to conclude or perform a contract with the person; it does not cover your own collection and use. List the organisation the data is disclosed to as a recipient (not as a service provider), or choose deemed consent under section 15(1), or consent, for your own collection and use.");
		else if (by("contract").length) c5.push("Deemed consent under section 15(3) to (8) covers only disclosures to other organisations, and their collection and use, that are reasonably necessary to conclude or perform the contract; not your own collection and use.");
		if (by("deemed").length && pnSourceIndirect(s) && !pnSourceDirect(s)) w5.push("Deemed consent by conduct (" + pl(by("deemed")) + ") needs the person to give you the data voluntarily (section 15(1)(a)); you collect it from others. Consider consent given to the disclosing organisation (section 15(2)) or an exception.");
		checks.push(pick("H05", m5, w5, c5, "A basis for each purpose."));
		var nt = by("notify"), ntNo = nt.filter(function (a) { return !v(a, "sgOptOut"); });
		checks.push(!nt.length ? chk("H06", "na", "No purpose relies on deemed consent by notification.") :
			ntNo.length ? chk("H06", "missing", "Give how and by when people can opt out for " + pl(ntNo) + " (section 15A(4)(b)(iii)).") :
			chk("H06", "check", "The policy says you assessed it: before relying on it, assess that it is not likely to have an adverse effect, with the items in regulation 14(2), keep the assessment, and bring the intention, purpose and opt-out period to each person's attention (section 15A(4), (5)). Not for sending marketing messages, whatever the purpose is called (regulation 13)."));
		var li = by("li"), liNo = li.filter(function (a) { return !v(a, "sgLi"); });
		var liMore = " If the interests are another person's, name that person in the table and in the assessment (regulation 15(2)(d)). Not for sending marketing messages, whatever the purpose is called (First Schedule, Part 3, paragraph 1(4)).";
		checks.push(!li.length ? chk("H07", "na", "No purpose relies on legitimate interests.") :
			liNo.length ? chk("H07", "warn", "Name the legitimate interest for " + pl(liNo) + ", so that people understand the reliance (good practice). The policy discloses the reliance and gives the data protection officer for questions (First Schedule, Part 3, paragraph 1(2)(b); Key Concepts, ch. 12)." + liMore) :
			chk("H07", "check", "The policy says you assessed it: before relying on it, assess it with the items in regulation 15(2), including the legitimate interests and why they outweigh any adverse effect, and keep the assessment while the processing lasts." + liMore));
		checks.push(!v(s, "sgDpoContact") ? chk("H08", "missing", "Give the business contact information of your data protection officer: at least a business email or postal address (sections 11(5), 20(1)(c); Key Concepts 21.6).") :
			!sgWritable(v(s, "sgDpoContact")) ? chk("H08", "missing", "Add a business email or postal address to the data protection officer's contact: requests are made in writing (regulation 3(1); Key Concepts 21.6).") :
			chk("H08", "check", (v(s, "sgDpo") ? "" : "Printed with the title \"Data Protection Officer\". ") + "Keep it reachable from Singapore in Singapore business hours, with a Singapore telephone number if you give one (Key Concepts 21.7). Making it available in a readily accessible part of your official website, or in your record on the PDPC website, satisfies section 11(5) (regulation 1A, as amended from 1 September 2026)."));
		/* H09: recipients and purposes of disclosure */
		var m9 = [], c9 = [], nr = sgNoRole(s), noWhy = sgOrgs(s).concat(sgDi(s)).filter(function (r) { return !v(r, "why"); });
		if (!rec.length && !yes(s, "sgNoRecip")) m9.push("List the organisations that receive the personal data, including data intermediaries, or confirm in the Singapore section that there are none.");
		var noWho = rec.filter(function (r) { return !String(v(r, "who") || "").trim(); }), noWhere = sgNoWhere(s);
		if (noWho.length) m9.push("Name each recipient: " + noWho.length + (noWho.length > 1 ? " recipients have" : " recipient has") + " no name, and the policy prints a placeholder (needed for the policy text; not a PDPA requirement).");
		if (nr.length) m9.push("Give the role of " + nm(nr) + " (needed for the policy text; not a PDPA requirement).");
		if (noWhere.length) m9.push("Give where " + nm(noWhere) + (noWhere.length > 1 ? " are" : " is") + " located: without it, the policy cannot say whether personal data leaves Singapore (needed for the policy text; not a PDPA requirement).");
		if (noWhy.length) m9.push("Give what " + nm(noWhy) + (noWhy.length > 1 ? " do" : " does") + " with the data: the purposes of disclosure are notified too (section 20(1)(a)).");
		if (sgDi(s).length) c9.push("A data intermediary processing under a contract evidenced or made in writing has only some of the PDPA's duties itself (section 4(2)); you remain responsible for the data it processes for you (section 4(3)).");
		checks.push(pick("H09", m9, [], c9, rec.length ? "Recipients and purposes of disclosure are listed." : "No recipients, confirmed."));
		/* H10: transfers outside Singapore */
		var rows = sgXrows(s), ab = sgRecAbroad(s), unk = sgRecUnknown(s), m10 = [], w10 = [], c10 = [];
		if (!v(s, "sgAbroad")) m10.push("Say whether personal data is transferred outside Singapore.");
		else if (no(s, "sgAbroad") && !off) {
			if (ab.length) m10.push(nm(ab) + (ab.length > 1 ? " are" : " is") + " outside Singapore, but the answer is No.");
			else if (unk.length) m10.push("Check where " + nm(unk) + (unk.length > 1 ? " are" : " is") + " located (a location that names Singapore and another place counts as outside Singapore): the policy cannot say that nothing is transferred outside Singapore.");
		}
		if (yes(s, "sgAbroad")) {
			if (!rows.length) m10.push("Add each transfer outside Singapore.");
			if (rows.some(function (r) { return !v(r, "recipient") || !v(r, "country") || !v(r, "basis"); })) m10.push("Give the recipient, the country and the basis of each transfer.");
			rows.forEach(function (r) {
				var ba = v(r, "basis"), who = jpTrim(v(r, "recipient") || "[recipient]");
				if ((ba === "law" || ba === "instrument") && !v(r, "lawName")) m10.push("Name the " + (ba === "law" ? "law" : "instrument") + " for " + who + ".");
				if (ba === "cert" && !v(r, "certKind")) m10.push("Choose the certification " + who + " holds.");
				if (ba === "cert" && /prp/.test(v(r, "certKind"))) {
					var rr = rec.filter(function (x) { return jpSame(v(x, "who"), v(r, "recipient")); })[0];
					if (rr && v(rr, "role") && v(rr, "role") !== "processor") m10.push(who + " is not a data intermediary: a PRP certification counts only for a data intermediary; it needs a CBPR certification or another basis (regulation 12(2)).");
					else if (!rr) c10.push("A PRP certification counts for " + who + " only if it receives the data as a data intermediary (regulation 12(2)(a)).");
				}
				if (ba === "consent" && !v(r, "summary")) m10.push("For " + who + ", give the reasonable summary in writing of how the data is protected there: without it, consent to the transfer is not valid (regulation 10(3)(a)).");
				if (ba === "own" && !sgOwnOk(s, r)) m10.push(who + " is not your own organisation (its name differs from yours, or it is listed as a recipient): \"own systems\" applies only within your own organisation, because the transferring organisation is not a recipient (regulation 9). Choose another basis; the policy prints a placeholder.");
				if (ba === "exempt" && !v(r, "lawName")) m10.push("Give the PDPC notice that exempts the transfer to " + who + " (section 26(2)).");
				if (ba === "exempt") c10.push("An exemption under section 26(2) is granted by written notice, on the conditions the Commission sets; keep to them.");
				if (ba === "transit") c10.push("Data in transit is data passing through Singapore on its way abroad, not accessed, used or disclosed by any other organisation while in Singapore except for its transport (regulation 9). It does not cover data you collect or use here.");
				if (sgWhere(v(r, "country")) === "sg") m10.push("The transfer to " + who + " names Singapore as the country: list only transfers outside Singapore.");
				var rr2 = sgRowRec(s, r);
				if (rr2 && v(rr2, "where") && v(r, "country") && sgWhere(v(r, "country")) !== "sg") {
					var lw = String(v(rr2, "where")).toLowerCase(), lc = String(v(r, "country")).toLowerCase().trim();
					if (lw.indexOf(lc) === -1 && lc.indexOf(lw.trim()) === -1) c10.push("Check the country of the transfer to " + who + ": the recipients list gives \"" + jpTrim(v(rr2, "where")) + "\".");
				}
				if (ba === "contractNeed" && rr2 && v(rr2, "role") === "processor") w10.push(who + " is a data intermediary processing for you; regulation 10(2)(b) relies on deemed consent under section 15(3) to (8) to a disclosure to another organisation for a contract with the person. For a data intermediary, use a contract requiring a comparable standard (regulation 11(1)(b)).");
			});
			var inRows = function (r) { return rows.some(function (x) { return jpSame(v(x, "recipient"), v(r, "who")); }); };
			var miss = off ? [] : ab.filter(function (r) { return !inRows(r); });
			if (miss.length) m10.push(nm(miss) + (miss.length > 1 ? " are" : " is") + " outside Singapore but not in the transfers.");
			var unkMiss = off ? [] : unk.filter(function (r) { return !inRows(r); });
			if (unkMiss.length) m10.push("Check where " + nm(unkMiss) + (unkMiss.length > 1 ? " are" : " is") + " located; if outside Singapore, add " + (unkMiss.length > 1 ? "them" : "it") + " to the transfers (regulation 10(1)).");
			c10.push("Before each transfer, take appropriate steps to ensure that the recipient is bound by legally enforceable obligations to a comparable standard, or that a regulation 10(2) case applies (regulations 10 and 11).");
		}
		if (off) c10.push("You collect from abroad: whether your onward disclosures are transfers from Singapore under section 26 is not modelled; take advice. The policy names where you process the data.");
		checks.push(pick("H10", m10, w10, c10, "No transfers outside Singapore."));
		var noRet = acts.filter(function (a) { return !v(a, "retention") || D.LINT.vagueRetention.test(v(a, "retention")); });
		checks.push(!acts.length ? chk("H11", "na", "No purposes yet.") : noRet.length ? chk("H11", "warn", "Give a period, or the criteria, for " + stop(pl(noRet)) + " The PDPA sets no period, but a retention policy with your approach to periods is good practice (Key Concepts 18.3, 18.8). Where none is given, the policy states the section 25 rule.") : chk("H11", "ok"));
		checks.push(v(s, "sgSecurity") ? chk("H12", "ok") : chk("H12", "check", "The policy states the section 24 duty. Describing your main measures is good practice."));
		checks.push(!cons ? chk("H13", "na", "No purpose relies on consent or deemed consent.") :
			!sgWithdrawWay(s) ? chk("H13", "missing", "Say how people withdraw consent (section 16(1)).") :
			chk("H13", "ok", (v(s, "withdrawHow") ? "" : "Withdrawal goes to the contact the policy gives for it. ") + "On receiving notice, tell the person the likely consequences (section 16(2))."));
		var m14 = [];
		if (!sgReqWay(s)) m14.push("Say where people send access and correction requests in writing: an email or postal address, or a form" + (v(s, "sgDpoContact") ? "; the data protection officer's contact has neither" : "") + " (regulation 3)" + " (needed for the policy text; not a PDPA requirement).");
		if (!v(s, "sgFee")) m14.push("Say whether you charge a fee for access" + " (needed for the policy text; not a PDPA requirement); the fee rules are in regulation 7.");
		checks.push(m14.length ? chk("H14", "missing", m14.join(" ")) : chk("H14", "ok", "Requests in writing; an answer as soon as reasonably possible, with written notice within 30 days if it takes longer (regulations 3 and 5)."));
		checks.push(!sgComplaintWay(s) ? chk("H15", "missing", "Say how people make a complaint (section 12(b)).") :
			chk("H15", "ok", "The complaint process, information on request, and the PDPC (sections 12, 48H, 48O)."));
		var ka = sgKidsAge(s);
		checks.push(!v(s, "sgKids") ? chk("H16", "check", "Answer whether children under 18 use your service (PDPC Advisory Guidelines on children's personal data, 2024).") :
			no(s, "sgKids") ? chk("H16", "na", "No children.") :
			!cons ? chk("H16", "check", "No purpose relies on consent, so the policy prints no section on children's consent. Write for children in language they readily understand (Children's Guidelines 4.2).") :
			yes(s, "sgKids13") && !v(s, "sgKidsHow") ? chk("H16", "missing", "Say how you obtain the consent of a parent or guardian for children under " + ka + " (Children's Guidelines 4.5).") :
			chk("H16", "check", (v(s, "sgKids13") ? "" : "Answer whether children under " + ka + " use your service. ") + "Write for children in language they readily understand, and let them withdraw consent as easily as they gave it (Children's Guidelines 4.2, 4.4). The policy uses " + ka + " as the age from which a child can consent; you can set a higher age that suits your business (Children's Guidelines 4.3)."));
		checks.push(!v(s, "sgNric") ? chk("H17", "check", "Answer whether you collect NRIC numbers or other national identification numbers.") :
			no(s, "sgNric") ? chk("H17", "na", "No NRIC or other national identification numbers.") :
			!v(s, "sgNricWhy") || !v(s, "sgNricDetail") ? chk("H17", "missing", "Say why you collect them: the law that requires it, the PDPA exception that applies, or why you must verify identity to a high degree of fidelity (PDPC Advisory Guidelines on NRIC numbers, 2018, para 3.10).") :
			/\b(log ?in|logging in|sign ?in|password|passcode|authenticat\w*|verif\w* (you|your identity|identity) (at|when|each|before)|each time|every time|security question)\b/i.test(v(s, "sgNricDetail")) ?
				chk("H17", "warn", "This reads as using NRIC numbers to authenticate people. Do not use NRIC numbers, full or partial, as passwords or to authenticate people: private organisations must stop by 31 December 2026, and the PDPC steps up enforcement from 1 January 2027 (PDPC announcement of 2 February 2026; MDDI statement of 3 February 2026; section 24).") :
			chk("H17", "check", "Collect NRIC or other national identification numbers, or copies of NRIC, only where the law requires it, an exception applies, or identity must be verified to a high degree of fidelity, and consider alternatives; keep a physical NRIC only where the law requires it (PDPC Advisory Guidelines on NRIC numbers, 2018; being updated). Do not use NRIC numbers, full or partial, as passwords or to authenticate people: the PDPC steps up enforcement from 1 January 2027 (PDPC announcement of 2 February 2026; MDDI statement of 3 February 2026)."));
		if (yes(s, "further")) {
			var fm = [];
			if (led) { if (!v(s, "furtherWhat")) fm.push("the new purpose"); if (!v(s, "furtherStart")) fm.push("when it starts"); if (!v(s, "furtherData")) fm.push("the personal data used"); }
			if (!v(s, "sgFurther")) fm.push("how the PDPA allows it");
			if (v(s, "sgFurther") === "exception" && !v(s, "sgFurtherLaw")) fm.push("the exception or law");
			var ff = v(s, "sgFurther"), fmk = (ff === "notify" || ff === "li") && sgMktText(v(s, "furtherWhat"));
			checks.push(fm.length ? chk("H18", "missing", "For the new purpose, give " + joinList(fm) + " (sections 18, 20(1)(b)).") :
				fmk ? chk("H18", "warn", "The new purpose looks like sending marketing messages. " + (ff === "li" ? "Legitimate interests" : "Deemed consent by notification") + " cannot be used for that (" + (ff === "li" ? "First Schedule, Part 3, paragraph 1(4)" : "regulation 13") + "): use consent.") :
				ff === "exception" ? chk("H18", "check", "Check that the exception or law applies to the new purpose. Section 20(1) does not apply to a use or disclosure without consent under section 17 (section 20(3)(b)), so the policy does not promise notice for it; a duty to inform may still come from the exception itself or another law.") :
				chk("H18", "check", "Tell people the new purpose before you use or disclose their data for it (section 20(1)(b))" +
					(ff === "consent" ? ", and get their consent first." : ff === "notify" ? "; assess it and give a reasonable opt-out period first (section 15A)." : ff === "li" ? "; assess it first (regulation 15)." : ".")));
		}
		if (["employee", "applicant"].indexOf(v(s, "audience")) !== -1) checks.push(chk("H19", "check", "Even under the employment exception or deemed consent, tell employees and applicants the purposes, and on request a contact for questions, on or before collecting (section 20(4), (5)). This policy does so; give it to them at that time."));
		checks.push(chk("H20", "check", "Not modelled: data breach assessment and notification (Part 6A), data portability (Part 6B, not in force), the Do Not Call provisions (Part 9) beyond a delivery check, business asset transactions (First Schedule, Part 4), and the duties of an organisation acting as a data intermediary for others."));
		/* Delivery */
		delivery.push(chk("H21", "check", "Give people the purposes on or before collecting their personal data (section 20(1)(a)): link this policy at each collection point and, where its purposes are general, describe the specific purpose there (Key Concepts, ch. 14)." +
			(pnSourceIndirect(s) ? " When you collect personal data from another organisation without consent, give it enough information about your purpose (section 20(2))." : "")));
		if (by("consent").length) delivery.push(chk("H22", "check", "Ask for consent after giving the purposes; do not require consent beyond what is reasonable for the product or service, and do not mislead (section 14)."));
		delivery.push(chk("H23", "check", "Make the data protection officer's business contact information available in a readily accessible part of your official website, or in your record on the PDPC website (section 11(5); regulation 1A)."));
		if (cons) delivery.push(chk("H24", "check", "When someone withdraws consent, tell them the likely consequences and stop the collection, use and disclosure within a reasonable time, including by your data intermediaries and agents (section 16(2), (4))."));
		delivery.push(chk("H25", "check", "Answer access requests as soon as you reasonably can; if it takes more than 30 days, tell the person in writing within 30 days when you will answer; give a written fee estimate before charging; tell the person if you refuse access, and keep a copy of the data refused for at least 30 days after the refusal (sections 21, 22A; regulations 4, 5, 7, 8)."));
		if (yes(s, "sgAbroad")) delivery.push(chk("H26", "check", "Put the legally enforceable obligations in place before the transfer: a contract that requires a comparable standard and names the countries, binding corporate rules for related recipients, or a certification (regulations 10 to 12). For consent, give the written summary first."));
		if (nt.length) delivery.push(chk("H27", "check", "Bring the intention, the purpose and the opt-out period to each person's attention, by a means that is adequate and effective, and wait until the period has lapsed (section 15A(4)(b); Key Concepts, ch. 12)."));
		if (yes(s, "sgDnc")) delivery.push(chk("H28", "check", "For marketing messages to Singapore telephone numbers, by call, SMS, fax or messaging apps such as WhatsApp: check the Do Not Call registers within 21 days before sending, unless the person gave clear and unambiguous consent evidenced in writing or another form you can refer to later; identify yourself and how to reach you in each message; do not hide the calling number; and stop within 21 days after consent is withdrawn (sections 43, 44, 45, 47; Do Not Call Registry Regulations 2013, regulations 15 to 17; PDPC Advisory Guidelines on the Do Not Call Provisions, 2021)."));
		if (yes(s, "sgKids")) delivery.push(chk("H29", "check", "For children, use age-appropriate language and media; for children under 13, get the consent of a parent or guardian and tell them the purposes (Children's Guidelines 4.2, 4.5)."));
		return { checks: checks, delivery: delivery };
	}

	/* A data protection policy led by Singapore's PDPA. */
	function sgLead(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]";
		var title = (v(s, "ctrlName") ? v(s, "ctrlName") + " " : "") + "Data Protection Policy";
		var acts = pnActs(s), direct = pnSourceDirect(s), cons = sgConsent(s), off = sgOffshore(s);
		var meta = [ctrl];
		if (v(s, "version")) meta.push("Version " + v(s, "version"));
		if (v(s, "effective")) meta.push("Effective " + fmtDate(v(s, "effective")));
		var num = {}, c = 2;
		if (yes(s, "sgKids") && cons) num.kids = c++;
		num.share = c++; num.abroad = c++; num.retain = c++; num.sec = c++;
		if (cons) num.withdraw = c++;
		num.rights = c++; num.complaints = c++; num.dpo = c++;
		if (inReg(s, "au")) num.au = c++;
		if (inReg(s, "za")) num.za = c++;
		if (inReg(s, "ca")) num.ca = c++;
		if (inReg(s, "us")) num.us = c++;
		num.changes = c++;
		var blocks = [{ k: "h1", x: title }, { k: "meta", x: meta.map(stop).join(" ") }];
		blocks.push({ k: "p", x: "This policy explains how " + ctrl + " collects, uses and discloses personal data under Singapore's Personal Data Protection Act 2012 (PDPA), and how to contact our data protection officer." });
		var first = [];
		if (acts.length) first.push({ k: "p", x: "We collect, use and disclose personal data for:" }, { k: "ul", items: acts.map(function (a) { return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: stop(v(a, "data") || "[personal data]") }; }) });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		if (off) first.push({ k: "p", x: "We are based outside Singapore and process your personal data in " + jpTrim(v(s, "sgOffWhere") || "[the countries where you process it]") + ". Section " + num.abroad + " gives the details." });
		else if (yes(s, "sgAbroad")) first.push({ k: "p", x: "We transfer personal data outside Singapore. Section " + num.abroad + " gives the details." });
		first.push({ k: "p", x: "You can ask to access and correct your personal data" + (cons ? ", and withdraw your consent" : "") + ". Section " + num.rights + " explains access and correction" +
			(num.withdraw ? ", section " + num.withdraw + " withdrawing consent" : "") + "; section " + num.dpo + " gives our data protection officer." });
		if (num.au) first.push({ k: "p", x: auPointer(s, num.au) });
		if (num.za) first.push({ k: "p", x: zaPointer(s, num.za) });
		if (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });
		if (num.us) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + num.us + " also applies to you." });
		blocks.push({ k: "box", title: "In short", blocks: first });

		blocks.push({ k: "h2", x: "1. Purposes and personal data" });
		Array.prototype.push.apply(blocks, sgPurposeBlocks(s));
		if (yes(s, "inferred")) blocks.push({ k: "p", x: "We also derive information about you from the information above: " + stop(v(s, "inferredWhat") || "[what is inferred, and from what]") });
		if (yes(s, "adm")) blocks.push({ k: "p", x: "We use automated systems to make decisions about people: " + stop(krLc(v(s, "admWhat") || "[the decisions and what they are based on]")) });
		else if (yes(s, "profiling")) blocks.push({ k: "p", x: "We analyse information about you: " + stop(v(s, "profilingWhat") || "[the analysis and what it is used for]") });
		if (num.kids) { blocks.push({ k: "h2", x: num.kids + ". Children" }); Array.prototype.push.apply(blocks, sgKidsBlocks(s)); }
		blocks.push({ k: "h2", x: num.share + ". Who we disclose it to" });
		Array.prototype.push.apply(blocks, sgShareBlocks(s));
		blocks.push({ k: "h2", x: num.abroad + ". " + (off ? "Where we process it, and transfers outside Singapore" : "Transfers outside Singapore") });
		Array.prototype.push.apply(blocks, sgAbroadBlocks(s));
		blocks.push({ k: "h2", x: num.retain + ". How long we keep it" });
		blocks.push(sgRetainBlock(s, "in section 1"));
		blocks.push({ k: "h2", x: num.sec + ". How we protect it" });
		blocks.push(sgSecBlock(s));
		if (num.withdraw) { blocks.push({ k: "h2", x: num.withdraw + ". Withdrawing consent" }); blocks.push(sgWithdrawBlock(s)); }
		blocks.push({ k: "h2", x: num.rights + ". Access and correction" });
		Array.prototype.push.apply(blocks, sgRightsBlocks(s));
		blocks.push({ k: "h2", x: num.complaints + ". Questions and complaints" });
		Array.prototype.push.apply(blocks, sgComplaintBlocks(s, true));
		blocks.push({ k: "h2", x: num.dpo + ". Data protection officer" });
		Array.prototype.push.apply(blocks, sgDpoBlocks(s));

		var sgSecs = (num.withdraw ? [String(num.withdraw)] : []).concat([String(num.rights), String(num.complaints)]);
		var only = " Sections " + joinList(sgSecs) + " apply to you only where the PDPA applies to our handling of your personal data.";
		var auRes = null;
		if (num.au) {
			blocks.push({ k: "h2", x: num.au + ". " + auHead(s) });
			Array.prototype.push.apply(blocks, auSection(s, sgSecs, "the PDPA"));
			auRes = auChecks(s, false);
		}
		var zaRes = null;
		if (num.za) {
			blocks.push({ k: "h2", x: num.za + ". " + zaHead(s) });
			Array.prototype.push.apply(blocks, zaSection(s, sgSecs, "the PDPA"));
			zaRes = zaChecks(s, false);
		}
		var caRes = null, usRes = null;
		if (num.ca) {
			blocks.push({ k: "h2", x: num.ca + ". Additional information for California residents" });
			blocks.push({ k: "p", x: "If you are a California resident, the California Consumer Privacy Act (CCPA) applies to your personal information. This section is our notice at collection and privacy policy for California residents. The rest of this policy describes our processing too, but your rights under the CCPA, and how to exercise them, are the ones set out here." +
				only + " Last updated " + (fmtDate(v(s, "effective")) || "[date]") + "." });
			Array.prototype.push.apply(blocks, caBody(s, function (b, t) { b.push({ k: "h3", x: t }); return null; }, {}));
			caRes = caChecks(s, false);
		}
		if (num.us) {
			blocks.push({ k: "h2", x: num.us + ". Additional information for residents of other US states" });
			blocks.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the states whose law applies]") + ", your state's consumer privacy law applies to your personal data. This section is the privacy notice those laws require; your rights under them, and how to exercise them, are the ones set out here." +
				only + (usHas(s, "NJ") ? " Effective and last updated " : " Last updated ") + (fmtDate(v(s, "effective")) || "[date]") + "." });
			blocks.push({ k: "ul", items: usSt(s).map(function (st) { return { b: st.n + ":", x: st.law + " (" + st.cite + ")" + (v(s, "effective") && st.eff > v(s, "effective") ? ", from " + fmtDate(st.eff) : "") + "." }; }) });
			Array.prototype.push.apply(blocks, usBody(s, function (b, t) { b.push({ k: "h3", x: t }); return null; }, {}));
			usRes = usChecks(s, false);
		}
		blocks.push({ k: "h2", x: num.changes + ". Changes to this policy" });
		if (yes(s, "further")) blocks.push({ k: "box", title: "Planned new use of your personal data", blocks: [
			{ k: "p", x: "From " + (fmtDate(v(s, "furtherStart")) || "[start date]") + " we intend to use personal data we already hold for a new purpose: " + stop(v(s, "furtherWhat") || "[new purpose]") +
				" Personal data used: " + stop(krLc(v(s, "furtherData") || "[the personal data]")) + (v(s, "furtherRetention") ? " How long we keep it for this purpose: " + stop(krLc(v(s, "furtherRetention"))) : "") },
			{ k: "p", x: sgFurtherTxt(s) }] });
		blocks.push({ k: "p", x: "This policy applies from " + (fmtDate(v(s, "effective")) || "[date]") + ". When we change it, we publish the new version here with the date it applies from. Before we use or disclose your personal data for a new purpose, we tell you that purpose, unless the law allows it without your consent (sections 18 and 20)." });
		if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });

		var cr = sgChecks(s, true), checks = cr.checks, delivery = cr.delivery;
		checks.push(v(s, "consequences") ? chk("P21", "ok", "", undefined, "WP260 10, 36 (good practice)") : chk("P21", "warn", "Empty. Fine only if nothing here would surprise people.", undefined, "WP260 10, 36 (good practice)"));
		if (auRes) { Array.prototype.push.apply(checks, auRes.checks); Array.prototype.push.apply(delivery, auRes.delivery); }
		if (zaRes) { Array.prototype.push.apply(checks, zaRes.checks); Array.prototype.push.apply(delivery, zaRes.delivery); }
		if (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }
		if (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(delivery, usRes.delivery); }
		var lintHits = lintText(blocks);
		checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "PDPA s. 20; Key Concepts, ch. 14; WP260 13") :
			chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "PDPA s. 20; Key Concepts, ch. 14; WP260 13"));
		var gp = [];
		if (direct) gp.push(chk("D01", "check", "Give the policy before you collect the data: before a form is submitted, before payment, before sign-up.", "Timing: when the data is collected"));
		gp.push(chk("D03", "check", "Read it as a member of the audience would."));
		if (has(s, "channel", "web")) gp.push(chk("D05", "check", "Link it from every page, and from every form that collects personal data."));
		if (has(s, "channel", "app")) gp.push(chk("D06", "check", "Show it in the app store listing and keep it within two taps inside the app."));
		gp.push(chk("D07", "check", "Use the \"In short\" box as the first layer and keep it consistent with the full text."));
		gp.push(chk("D08", "check", "Keep the full policy available as one document."));
		gp.push(chk("D14", "check", "If you add icons, keep them alongside the text, never instead of it."));
		gp.forEach(function (r) { var m = D.MATRIX[r.id]; if (m) r.s = m.s.replace(/^Art\.[^;]*;\s*/, "") + " (good practice)"; });
		delivery = gp.concat(delivery);
		return { title: title, file: slug(ctrl + " Data Protection Policy"), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(delivery), docLabel: "Policy" };
	}

	/* Form section for Singapore: everything except the per-purpose and transfer fields. */
	var SG_SECTION = {
		title: "Singapore: Personal Data Protection Act 2012",
		show: sgOn,
		lead: "The PDPA as in force on 13 November 2026. Give how the PDPA allows each purpose above, the purpose and location of each recipient, and transfers outside Singapore under transfers.",
		fields: [
			{ id: "sgScope", type: "select", label: "Where you are", opts: [
				{ v: "in", l: "In Singapore (formed or resident there, or with an office or place of business there)" },
				{ v: "abroad", l: "Outside Singapore, collecting, using or disclosing personal data in Singapore" }],
			  hint: "Section 2(1): the PDPA applies to organisations whether or not they are formed or resident in Singapore." },
			{ id: "sgOffWhere", type: "text", label: "The countries where you process the personal data", show: sgOffshore, ph: "for example Malaysia and the United States" },
			{ id: "sgDpo", type: "text", label: "Data protection officer: name or title (optional)", ph: "for example Data Protection Officer",
			  hint: "Section 11(3): one or more individuals responsible for compliance. Business contact information can give a title instead of a name; empty prints \"Data Protection Officer\"." },
			{ id: "sgDpoContact", type: "text", label: "Data protection officer: business contact information", ph: "for example dpo@example.com.sg, +65 6123 4567",
			  hint: "Sections 11(5) and 20(1)(c). At least a business email or postal address. Reachable from Singapore in Singapore business hours, with a Singapore telephone number if you give one (Key Concepts 21.7)." },
			{ id: "sgNoRecip", type: "yesno", label: "You listed no recipients. Confirm that no other organisation receives the personal data, not even service providers processing it for you",
			  show: function (s) { return !arr(s, "recipients").length; } },
			{ id: "sgReqHow", type: "area", rows: 2, label: "How people make access and correction requests (optional)", hint: "Regulation 3: in writing. Leave empty to use how people exercise their rights (below), or else the data protection officer's email or postal address." },
			{ id: "sgFee", type: "yesno", label: "Do you charge a fee for access requests?", hint: "Regulation 7: a reasonable fee, only after a written estimate. Correction is free." },
			{ id: "sgComplaint", type: "text", label: "How people make a complaint (optional)", hint: "Section 12(b). Leave empty to use the data protection officer's contact." },
			{ id: "sgSecurity", type: "area", rows: 2, label: "Your main security measures (optional)", hint: "Section 24." },
			{ id: "sgCorp", type: "yesno", label: "Business improvement: is your organisation a corporation (a company or other body corporate)?",
			  show: function (s) { return pnActs(s).some(function (a) { return v(a, "sgBasis") === "bip"; }); },
			  hint: "First Schedule, Part 5 applies to a corporation; Second Schedule, Part 2, Division 2 to other organisations (Companies Act 1967, section 4(1))." },
			{ id: "sgNric", type: "yesno", label: "Do you collect NRIC numbers, other national identification numbers (birth certificate, FIN, work permit) or passport numbers, or copies of NRIC?",
			  hint: "PDPC Advisory Guidelines on NRIC numbers (2018, being updated): only where the law requires it, an exception applies, or identity must be verified to a high degree of fidelity. Never as a password or to authenticate people: the PDPC steps up enforcement from 1 January 2027." },
			{ id: "sgNricWhy", type: "select", label: "Why you collect them", show: function (s) { return yes(s, "sgNric"); }, opts: [
				{ v: "law", l: "A law requires it" }, { v: "exc", l: "An exception in the First or Second Schedule applies" }, { v: "id", l: "We must verify identity to a high degree of fidelity" }] },
			{ id: "sgNricDetail", type: "text", label: function (s) { var w = v(s, "sgNricWhy"); return w === "law" ? "The law, with its section" : w === "exc" ? "The exception, with its Schedule, Part and paragraph" : "Why identity must be verified to that degree"; }, show: function (s) { return yes(s, "sgNric"); } },
			{ id: "sgKids", type: "yesno", label: "Do children under 18 use your service?",
			  hint: "PDPC Advisory Guidelines on children's personal data (2024): a child aged 13 to 17 can consent where they understand the policy; under 13, a parent or guardian." },
			{ id: "sgKidsAge", type: "text", label: "Age from which a child can give consent (optional)", show: function (s) { return yes(s, "sgKids"); }, ph: "13",
			  hint: "Children's Guidelines 4.3: 13, or a higher age (up to 17) that suits your business." },
			{ id: "sgKids13", type: "yesno", label: function (s) { return "Do children under " + sgKidsAge(s) + " use it?"; }, show: function (s) { return yes(s, "sgKids"); } },
			{ id: "sgKidsHow", type: "text", label: "How you obtain a parent's or guardian's consent for them", show: function (s) { return yes(s, "sgKids") && yes(s, "sgKids13"); },
			  ph: "for example a parent signs up and confirms by email" },
			{ id: "sgDnc", type: "yesno", label: "Do you send marketing messages to Singapore telephone numbers (calls, SMS, fax, or messaging apps such as WhatsApp)?", hint: "Part 9 (Do Not Call provisions): a delivery check." }
		]
	};
