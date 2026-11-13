	/* ================================================== SOUTH AFRICA === */
	/* South Africa (matrix Part V): the Protection of Personal Information Act 4 of 2013 (POPIA), as published in Government
	   Gazette 37067 (no amending Act found), read on gov.za on 13 November 2026, with the Regulations relating to the Protection
	   of Personal Information, 2018 (GN R1383) as amended with effect from 17 April 2025 (GN 6126), and the Information
	   Regulator's guidance notes on information officers, direct marketing and children. Private bodies; public bodies only in
	   part. Notes in build/za/notes.md. */
	function zaOn(s) { return inReg(s, "za"); }
	/* Where a recipient is. "za" only when nothing but South African places, South African cloud regions and filler words is
	   left; a four-digit postal code lets street and building words go too, never other places. A recognised foreign place
	   makes it "abroad"; anything else makes it "unknown" (fail closed). Names shared with places abroad (East London,
	   Newcastle, George, Adelaide and others) and the codes SA, GP, WC and the like count only right next to a South African
	   name; multi-country regions (EMEA, Africa) and unnamed second sites (backups, disaster recovery, failover) are left over
	   (review of 13 November 2026, ZA01 to ZA04, ZA09). */
	var ZA_ZA = /\b(republic of south africa|south africa|south african|suid-afrika|mzansi|sa data cent(re|er)s?|gauteng|western cape|eastern cape|northern cape|kwazulu-natal|kwazulu natal|free state|limpopo|mpumalanga|north[- ]west province|johannesburg|joburg|jozi|sandton|midrand|centurion|randburg|fourways|rivonia|woodmead|braamfontein|bedfordview|soweto|germiston|kempton park|isando|boksburg|benoni|roodepoort|krugersdorp|pretoria|tshwane|cape town|v&a waterfront|victoria (and|&) alfred waterfront|stellenbosch|paarl|durban|ethekwini|umhlanga( ridge| rocks)?|pietermaritzburg|gqeberha|port elizabeth|nelson mandela bay|mthatha|bloemfontein|mangaung|polokwane|mbombela|nelspruit|mahikeng|mafikeng|richards bay|vereeniging|vanderbijlpark|welkom|emalahleni|witbank|potchefstroom|klerksdorp|upington|knysna|hermanus|mossel bay|teraco( (jb|ct|db|pe)\d{1,2})?)\b/i;
	var ZA_ZA_G = new RegExp(ZA_ZA.source, "gi");
	var ZA_CODE_G = /(^|[^A-Za-z])(ZA|ZAF|RSA|za|KZN)(?=[^A-Za-z]|$)/g;
	var ZA_PROV = "gauteng|western cape|eastern cape|northern cape|kwazulu-natal|kwazulu natal|free state|limpopo|mpumalanga|north[- ]west";
	var ZA_AMB_PAIR_G = new RegExp("\\b(east london|newcastle|george|kimberley|wellington|richmond|worcester|bellville|rosebank|bryanston|century city|rustenburg|middelburg|springs|adelaide)\\b(?=[,\\s(]+(" + ZA_PROV + "|south africa|cape town|johannesburg|durban|pretoria|ZA|RSA|KZN|GP|WC|EC|FS|LP|MP|NW|NC)\\b)", "gi");
	var ZA_AMB_CODE_G = new RegExp("(?:" + ZA_ZA.source + ")[,\\s(]+(SA|GP|WC|EC|FS|LP|MP|NW|NC)(?=[^A-Za-z]|$)", "gi");
	function zaAmb(w) {
		return String(w).replace(ZA_AMB_PAIR_G, " ").replace(ZA_AMB_CODE_G, function (m) { var c = m.slice(-2); return c === c.toUpperCase() ? m.slice(0, -2) + " " : m; });
	}
	var ZA_REGION = /\b(af-south-1|africa-south1|af-johannesburg-1|southafrica(north|west)|south ?africa ?(north|west|central))\b|\b((aws|amazon web services|amazon) )?africa \(cape town\)/i;
	var ZA_REGION_G = new RegExp(ZA_REGION.source, "gi");
	var ZA_NEUTRAL_G = /\b(southern africa|sub-saharan africa|africa|emea|mea)\b/gi;
	var ZA_FILL = /\b(africa data cent(re|er)s|adc|(jb|ct|db|pe)\d{1,2}|province|technopark|cbd|within)\b/gi;
	var ZA_PC = /\b(gauteng|western cape|eastern cape|northern cape|kwazulu-natal|kwazulu natal|free state|limpopo|mpumalanga|north[- ]west|south africa)[,\s]+\d{4}(?!\d)|(^|[^\d])\d{4}[,\s]+(south africa|rsa)\b/i;
	var ZA_STREET_G = /\b\d+[a-z]?\s+(?:[a-z'-]+\s+){1,3}(street|st|road|rd|avenue|ave|drive|lane|crescent|boulevard|place|way|close)\b\.?/gi;
	var ZA_STREETNAME_G = /\b[a-z]+ (road|street|avenue|drive|lane|crescent|boulevard)\b/gi;
	var ZA_BLDG_G = /\b(\d+(st|nd|rd|th)\s+floor|(floor|level|unit|suite|shop)\s+\d+[a-z]?|(p\.? ?o\.? ?box|private bag)\s+\d+|office park|business park|building)\b/gi;
	var ZA_DR = /\b(backups?|back-ups?|backed up|dr|disaster recovery|fail-?over|replicas?|replicated|secondary|(the|a|public) cloud)\b/gi;
	var ZA_DR_ZA = new RegExp(ZA_DR.source + "\\s+(in|at|on|to)\\s+(the\\s+)?(?=" + ZA_ZA.source + "|" + ZA_REGION.source + ")", "gi");
	var ZA_FOR = /\b(windhoek|walvis bay|swakopmund|gaborone|harare|bulawayo|victoria falls|maputo|maseru|mbabane|manzini|port louis|lusaka|lilongwe|blantyre|luanda|kinshasa|kigali|kampala|dar es salaam|addis ababa|accra|abuja|dakar|casablanca|tunis|algiers|australia|new zealand|canberra|perth|adelaide|brisbane)\b/i;
	function zaForeign(w) {
		var raw = String(w || ""), named = zaNamesZa(raw);
		if (/\b(outside|offshore from) south africa\b|\b(overseas|offshore|abroad|cross-border)\b/i.test(raw)) return true;
		var x = zaAmb(raw).replace(ZA_STREETNAME_G, " ").replace(/\beast london\b/gi, " ");
		x = x.replace(ZA_REGION_G, " ").replace(ZA_ZA_G, " ").replace(ZA_CODE_G, "$1 ");
		if (KR_REGION.test(x)) return true;
		x = x.replace(ZA_NEUTRAL_G, " ");
		return jpForeign(x) || ZA_FOR.test(x) || JP_JP.test(x) || KR_KR.test(x) || KR_FOR_H.test(x) || (!named && SG_SG.test(x)) || new RegExp(SG_CODE_G.source).test(x) || SG_FOR.test(x) || SG_FOR_CODE.test(x) || (/[a-z]/.test(raw) && SG_FOR_CODE_LC.test(x));
	}
	function zaNamesZa(w) { return ZA_ZA.test(w) || ZA_REGION.test(w) || new RegExp(ZA_CODE_G.source).test(w); }
	function zaLeft(w) {
		var x = String(w).replace(ZA_DR_ZA, " ").replace(ZA_DR, " drsite ");
		x = zaAmb(x).replace(ZA_REGION_G, " ").replace(ZA_ZA_G, " ").replace(ZA_CODE_G, "$1 ").replace(ZA_FILL, " ");
		x = x.replace(SG_FILL, function (m) { return /^(IN|MY|ID)$/.test(m) ? m : " "; });
		return /[A-Za-z\u00c0-\uffff]/.test(x);
	}
	function zaWhere(w) {
		w = String(w || "").trim();
		if (!w) return "";
		if (zaForeign(w)) return "abroad";
		if (!zaNamesZa(w)) return "unknown";
		return zaLeft(ZA_PC.test(w) ? w.replace(ZA_STREET_G, " ").replace(ZA_BLDG_G, " ") : w) ? "unknown" : "za";
	}
	function zaXrows(s) { return yes(s, "zaAbroad") ? arr(s, "zaXrows") : []; }
	function zaOffshore(s) { return v(s, "zaScope") === "means"; }
	function zaRecAbroad(s) { return arr(s, "recipients").filter(function (r) { return zaWhere(v(r, "where")) === "abroad"; }); }
	function zaRecUnknown(s) { return arr(s, "recipients").filter(function (r) { var w = zaWhere(v(r, "where")); return w === "unknown" || w === ""; }); }
	function zaNoWhere(s) { return arr(s, "recipients").filter(function (r) { return !String(v(r, "where") || "").trim(); }); }
	function zaRowRec(s, r) { return arr(s, "recipients").filter(function (x) { return jpSame(v(x, "who"), v(r, "recipient")); })[0]; }
	/* "Our own offices or systems" only for the organisation itself, as for Australia: a related company is a third party. */
	function zaOwnOk(s, r) { return auOwnOk(s, r); }
	/* A row is a transfer to a third party (s. 72) unless it is the organisation's own offices or systems. */
	function zaXfer(s, r) { return !(v(r, "basis") === "own" && zaOwnOk(s, r)); }
	function zaUnlisted(s) {
		return zaXrows(s).filter(function (r) { return !!v(r, "recipient") && zaXfer(s, r) && !arr(s, "recipients").some(function (x) { return jpSame(v(x, "who"), v(r, "recipient")); }); });
	}
	/* Section 18(1)(g) asks for the level of protection afforded by the country itself: required for every row except one
	   resting on the country's own law (that law is the level of protection), and except a misused "own" row (ZA05). */
	function zaNeedLevel(s, r) { var ba = v(r, "basis"); return !!ba && ba !== "law" && !(ba === "own" && !zaOwnOk(s, r)) && zaWhere(v(r, "country")) !== "za"; }
	/* Section 72(1)(a) bases: adequate protection by law, binding corporate rules or a binding agreement. */
	function zaAdequate(b) { return b === "law" || b === "bcr" || b === "agreement"; }

	/* Section 11(1) bases, per purpose. */
	function zaBasisTxt(s, a) {
		var b = v(a, "zaBasis"), w = v(a, "zaBasisWhat");
		return b === "consent" ? "Your consent (s. 11(1)(a))" :
			b === "contract" ? "Necessary to conclude or perform a contract with you (s. 11(1)(b))" :
			b === "law" ? "An obligation the law imposes on us: " + jpTrim(auThe(v(a, "zaBasisLaw") || "[the law]")) + " (s. 11(1)(c))" :
			b === "dsli" ? "It protects a legitimate interest of yours: " + jpTrim(krLc(w || "[the interest]")) + " (s. 11(1)(d))" :
			b === "public" ? "Necessary for the proper performance of our public law duty: " + jpTrim(krLc(w || "[the duty]")) + " (s. 11(1)(e))" :
			b === "li" ? "Necessary for our legitimate interests, or those of a third party we supply it to: " + jpTrim(krLc(w || "[the interest]")) + " (s. 11(1)(f))" :
			"[legal basis]";
	}
	function zaObjActs(s) { return pnActs(s).filter(function (a) { var b = v(a, "zaBasis"); return b === "dsli" || b === "public" || b === "li"; }); }
	function zaConsent(s) {
		return pnActs(s).some(function (a) { return v(a, "zaBasis") === "consent" || v(a, "zaSpecial") === "consent"; }) ||
			zaXrows(s).some(function (r) { return v(r, "basis") === "consent"; }) ||
			(yes(s, "zaKids") && v(s, "zaKidsBasis") === "competent") ||
			(yes(s, "zaDm") && (v(s, "zaDmElec") === "consent" || v(s, "zaDmElec") === "both")) ||
			(yes(s, "further") && v(s, "zaFurther") === "consent");
	}
	function zaConseqOf(a) { return v(a, "zaConseq") || v(a, "consequence"); }
	function zaRet(a) { return v(a, "retention") || "As long as we need it for the purpose, unless the law requires or authorises us to keep it longer (s. 14)"; }

	/* Special personal information (s. 26): how section 27 allows it, per purpose. */
	function zaSpecialOf(a) { var x = v(a, "zaSpecial"); return x && x !== "none" ? x : ""; }
	function zaSpecialActs(s) { return pnActs(s).filter(function (a) { return !!zaSpecialOf(a); }); }
	var ZA_SEC_T = {
		"29": "it is essential to identify you, and to comply with laws and other measures that protect or advance people disadvantaged by unfair discrimination (s. 29)",
		"30": "we are the trade union you belong to, or its federation, and it is necessary to achieve our aims; we do not supply it to third parties without your consent (s. 30)",
		"31": "we are an institution founded on political principles, and it is necessary for our aims or for the political activities section 31 lists; we do not supply it to third parties without your consent (s. 31)",
		"33": "we are charged by law with applying criminal law, or we obtained the information in accordance with the law (s. 33)" };
	function zaSpecialTxt(s, a) {
		var x = v(a, "zaSpecial"), sec = v(a, "zaSpecialSec"), why = v(a, "zaSpecialWhy");
		return x === "consent" ? "with your consent (s. 27(1)(a))." :
			x === "right" ? "because it is necessary to establish, exercise or defend a right or obligation in law (s. 27(1)(b))." :
			x === "intl" ? "because it is necessary to comply with an obligation of international public law (s. 27(1)(c))." :
			x === "research" ? "for historical, statistical or research purposes, where the purpose serves a public interest and the processing is necessary for it, or where asking for consent is impossible or would take disproportionate effort, with guarantees that the processing does not affect your privacy to a disproportionate extent (s. 27(1)(d))." :
			x === "public" ? "because you deliberately made it public (s. 27(1)(e))." :
			x === "specific" ? (sec === "32" ? "because section 32 allows it: " + jpTrim(krLc(why || "[how section 32 applies to you]")) + "; only people under a duty of confidentiality process it (s. 32(1), (2))." :
				sec === "28" ? "because section 28 allows it: " + jpTrim(krLc(why || "[how section 28 applies to you]")) + "; we do not supply it to third parties without your consent (s. 28(1), (3))." :
				sec === "33" && !yes(s, "publicBody") ? "because we obtained the information in accordance with the law (s. 33(1))." + (why ? " " + jpDot(why) : "") :
				ZA_SEC_T[sec] ? "because " + ZA_SEC_T[sec] + "." + (why ? " " + jpDot(why) : "") : "[because of the section of POPIA, 28 to 33, that allows it].") :
			x === "auth" ? "under an authorisation the Information Regulator granted us: " + jpRef(why || "[the authorisation, with its Gazette notice]", "s. 27(2)") :
			"[how section 27 allows it].";
	}

	/* Section 18(1)(a), (c) to (f): information, purposes, legal bases, laws, voluntary or mandatory, consequences. */
	function zaPurposeBlocks(s) {
		var acts = pnActs(s);
		if (!acts.length) return [{ k: "p", x: "[Add the purposes for which you process personal information.]" }];
		var b = [{ k: "p", x: "We process personal information for these purposes, on these legal bases (s. 11(1)):" },
			{ k: "table", head: ["Purpose", "Personal information", "Legal basis", "How long we keep it"], rows: acts.map(function (a) {
				return [jpTrim(v(a, "purpose") || "[purpose]"), v(a, "data") || "[personal information]", zaBasisTxt(s, a), zaRet(a)]; }) }];
		var sp = zaSpecialActs(s);
		if (sp.length) b.push({ k: "p", x: "Special personal information (religious or philosophical beliefs, race or ethnic origin, trade union membership, political persuasion, health or sex life, biometric information, and criminal behaviour) has extra protection under POPIA (s. 26). We process it only as follows:" },
			{ k: "ul", items: sp.map(function (a) { return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: jpDot(v(a, "zaSpecialWhat") || "[the special personal information]") + " We process it " + zaSpecialTxt(s, a) }; }) });
		var law = acts.filter(function (a) { var l = v(a, "zaLaw"); return l === "required" || l === "authorised"; });
		if (law.length) b.push({ k: "p", x: "A law requires or authorises us to collect personal information for these purposes (s. 18(1)(f)):" },
			{ k: "ul", items: law.map(function (a) { return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: (v(a, "zaLaw") === "required" ? "required by " : "authorised by ") + jpDot(auThe(v(a, "zaLawName") || "[the law]")) }; }) });
		if (pnSourceDirect(s)) b.push({ k: "p", x: "Whether you have to give us the information, and what happens if you do not (s. 18(1)(d), (e)):" },
			{ k: "ul", items: acts.map(function (a) { var m = v(a, "zaMand"), c = zaConseqOf(a);
				return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: (m === "mandatory" ? "You have to give it." : m === "voluntary" ? "Giving it is voluntary." : "[Say whether giving it is voluntary or mandatory.]") +
					" " + (c ? "If you do not: " + jpDot(krLc(c)) : "[What happens if you do not give it.]") }; }) });
		return b;
	}
	/* Section 18(1)(a): the source, where the information is not collected from the person. */
	function zaSourceBlocks(s) {
		var b = [], src = arr(s, "sources");
		if (!v(s, "source")) return [{ k: "p", x: "[Say whether you collect personal information from people directly, from other sources, or both (s. 18(1)(a)).]" }];
		b.push({ k: "p", x: pnSourceIndirect(s) && !pnSourceDirect(s) ? "We collect personal information about you from other sources, not from you directly." :
			pnSourceIndirect(s) ? "We collect personal information from you, and from other sources." : "We collect personal information from you directly." });
		if (pnSourceIndirect(s)) {
			if (src.length) b.push({ k: "p", x: "The other sources, and what we get from each (s. 18(1)(a)):" },
				{ k: "ul", items: src.map(function (x) { return { b: jpTrim(v(x, "name") || "[source]") + ":", x: stop(v(x, "what") || "[the personal information obtained]") }; }) });
			else b.push({ k: "p", x: "[Name the sources you collect personal information from (s. 18(1)(a)).]" });
		}
		return b;
	}
	/* Section 18(1)(h)(i): recipients. */
	function zaShareBlocks(s) {
		var rec = arr(s, "recipients"), un = zaUnlisted(s), b = [];
		var item = function (r) { return { b: jpTrim(v(r, "who") || "[recipient]") + ":", x: stop(v(r, "why") || "[what for]") + (v(r, "where") ? " Located in " + jpDot(country(jpTrim(v(r, "where")))) : "") }; };
		var unP = un.length ? { k: "p", x: "[Add " + joinList(un.map(function (r) { return jpTrim(v(r, "recipient")); })) + " to the recipients, with what " + (un.length > 1 ? "they do" : "it does") + " with the information.]" } : null;
		if (!rec.length) {
			b.push(unP ? unP : yes(s, "zaNoRecip") ? { k: "p", x: "We do not share personal information with anyone, and no operator processes it for us." } :
				{ k: "p", x: "[List the recipients, or categories of recipients, of personal information, operators included, or confirm in the South Africa section that there are none.]" });
			return b;
		}
		b.push({ k: "p", x: "We share personal information with these recipients, or categories of recipients, for the purposes shown (s. 18(1)(h)(i)):" }, { k: "ul", items: rec.map(item) });
		if (unP) b.push(unP);
		return b;
	}
	/* Section 18(1)(g) and section 72. */
	function zaXbasis(s, r) {
		var ba = v(r, "basis");
		return ba === "law" ? "The recipient is subject to a law that gives the information an adequate level of protection, with principles substantially similar to POPIA's conditions and to its rules on onward transfers: " + jpRef(v(r, "lawName") || "[the law]", "s. 72(1)(a)") :
			ba === "bcr" ? "Binding corporate rules within our group give the information an adequate level of protection, with principles substantially similar to POPIA's conditions and to its rules on onward transfers (s. 72(1)(a), (2))." :
			ba === "agreement" ? "A binding agreement with the recipient gives the information an adequate level of protection, with principles substantially similar to POPIA's conditions and to its rules on onward transfers" + (v(r, "lawName") ? ": " + jpRef(v(r, "lawName"), "s. 72(1)(a)") : " (s. 72(1)(a)).") :
			ba === "consent" ? "You consent to the transfer (s. 72(1)(b)). You can withdraw that consent." :
			ba === "contract" ? "It is necessary to perform a contract between you and us, or for steps you asked for before entering into one (s. 72(1)(c))." :
			ba === "contract3" ? "It is necessary to conclude or perform a contract in your interest between us and a third party (s. 72(1)(d))." :
			ba === "benefit" ? "It is for your benefit, it is not reasonably practicable to get your consent, and you would be likely to give it (s. 72(1)(e))." :
			ba === "own" ? (zaOwnOk(s, r) ? "It stays within our own organisation, on our own systems or at our own offices there; no third party receives it." :
				"[" + jpTrim(v(r, "recipient") || "This recipient") + " is not our own organisation: choose another basis.]") :
			"[How section 72 allows the transfer.]";
	}
	function zaAbroadBlocks(s) {
		var b = [], off = zaOffshore(s), ab = zaRecAbroad(s), unk = zaRecUnknown(s), rows = zaXrows(s);
		if (off) b.push({ k: "p", x: "We are not domiciled in South Africa. We process personal information in South Africa, and in " + jpTrim(v(s, "zaOffWhere") || "[the countries where you process it]") + ". Level of protection there (s. 18(1)(g)): " +
			(v(s, "zaOffLevel") ? jpDot(krLc(v(s, "zaOffLevel"))) : "[the level of protection in those countries].") });
		if (no(s, "zaAbroad")) {
			if (ab.length) b.push({ k: "p", x: "[" + sgNamesAt(ab) + (ab.length > 1 ? " are" : " is") + " outside South Africa. Answer Yes under transfers outside South Africa and add " + (ab.length > 1 ? "them" : "it") + ".]" });
			if (unk.length) b.push({ k: "p", x: "[Check where " + sgNamesAt(unk) + (unk.length > 1 ? " are" : " is") + " located. If outside South Africa, answer Yes under transfers outside South Africa and add " + (unk.length > 1 ? "them" : "it") + ".]" });
			if (!ab.length && !unk.length) b.push({ k: "p", x: "We do not transfer personal information to third parties outside South Africa." });
			return b;
		}
		if (!yes(s, "zaAbroad")) { b.push({ k: "p", x: "[Say whether you transfer personal information to third parties outside South Africa (s. 18(1)(g)).]" }); return b; }
		if (!rows.length) { b.push({ k: "p", x: "[Add each recipient outside South Africa, with its country.]" }); return b; }
		var xf = rows.filter(function (r) { return zaXfer(s, r); }), own = rows.filter(function (r) { return !zaXfer(s, r); });
		var row = function (r) {
			var p = v(r, "protection"), xs = zaNeedLevel(s, r);
			return { b: jpTrim(v(r, "recipient") || "[recipient]") + " (" + jpTrim(v(r, "country") || "[country]") + "):",
				x: zaWhere(v(r, "country")) === "za" ? "[This row names South Africa: list only recipients outside South Africa.]" :
					zaXbasis(s, r) + (p ? " Level of protection there: " + jpDot(p) : xs ? " [The level of protection in that country (s. 18(1)(g)).]" : "") };
		};
		if (xf.length) b.push({ k: "p", x: "We transfer personal information to these third parties outside South Africa. For each, we give why section 72 allows the transfer, and the level of protection the information has there (s. 18(1)(g)):" }, { k: "ul", items: xf.map(row) });
		else b.push({ k: "p", x: "We do not transfer personal information to third parties outside South Africa." });
		if (own.length) b.push({ k: "p", x: "We also hold personal information outside South Africa within our own organisation:" }, { k: "ul", items: own.map(row) });
		var inRows = function (r) { return rows.some(function (x) { return jpSame(v(x, "recipient"), v(r, "who")); }); };
		var miss = ab.filter(function (r) { return !inRows(r); });
		if (miss.length) b.push({ k: "p", x: "[Add " + sgNamesAt(miss) + " to the transfers outside South Africa, or correct " + (miss.length > 1 ? "their locations" : "its location") + ".]" });
		var unkMiss = unk.filter(function (r) { return !inRows(r); });
		if (unkMiss.length) b.push({ k: "p", x: "[Check where " + sgNamesAt(unkMiss) + (unkMiss.length > 1 ? " are" : " is") + " located. If outside South Africa, add " + (unkMiss.length > 1 ? "them" : "it") + " to the transfers outside South Africa.]" });
		return b;
	}
	/* Sections 34, 35. */
	function zaKidsTxt(s) {
		var kb = v(s, "zaKidsBasis");
		return kb === "competent" ? "with the prior consent of a competent person, such as a parent or guardian (s. 35(1)(a))" :
			kb === "right" ? "where it is necessary to establish, exercise or defend a right or obligation in law (s. 35(1)(b))" :
			kb === "intl" ? "where it is necessary to comply with an obligation of international public law (s. 35(1)(c))" :
			kb === "research" ? "for historical, statistical or research purposes, where the purpose serves a public interest and the processing is necessary for it, or where asking for consent is impossible or would take disproportionate effort, with guarantees that the processing does not affect the child's privacy to a disproportionate extent (s. 35(1)(d))" :
			kb === "public" ? "where the child deliberately made it public with the consent of a competent person (s. 35(1)(e))" :
			kb === "auth" ? "under an authorisation the Information Regulator granted us (s. 35(2))" : "[how section 35 allows it]";
	}
	function zaKidsBlocks(s) {
		var b = [{ k: "p", x: "Under POPIA, a child is a person under 18 (s. 1). We process personal information of children only " + zaKidsTxt(s) + "." }];
		if (v(s, "zaKidsHow")) b.push({ k: "p", x: (v(s, "zaKidsBasis") === "auth" ? "The authorisation: " : "How: ") + jpDot(krLc(v(s, "zaKidsHow"))) });
		return b;
	}
	/* Section 69; section 11(3)(b); Regulations, reg 6. */
	function zaDmBlocks(s) {
		var el = v(s, "zaDmElec"), out = v(s, "zaDmOut"), b = [];
		if (el === "consent" || el === "customers" || el === "both") b.push({ k: "p", x: "We send direct marketing by electronic communication, such as email, SMS, instant messages and telephone calls, only " +
			(el === "consent" ? "with your consent" : el === "customers" ? "if you are our customer, and only about our own similar products or services" : "with your consent or, if you are our customer, about our own similar products or services") + " (s. 69(1))." +
			(el !== "customers" ? " We ask for your consent only once, and not at all if you have refused it before; not opting out does not count as consent (s. 69(2); Regulations, reg 6.4)." : "") +
			(el !== "consent" ? " As a customer, you can object to it, free of charge, when we collect your contact details and in every message we send you (s. 69(3))." : "") +
			" Every message tells you who sent it and how to ask us to stop (s. 69(4))." });
		else if (el === "none") b.push({ k: "p", x: "We do not send direct marketing by electronic communication." });
		else b.push({ k: "p", x: "[Say whether you send direct marketing by electronic communication, and on what basis (s. 69).]" });
		if (yes(s, "zaDmPost")) b.push({ k: "p", x: "We also send direct marketing by post or in person. You can object to it at any time, and we then stop (s. 11(3)(b), (4))." });
		if (el !== "none" || yes(s, "zaDmPost")) b.push({ k: "p", x: "To stop direct marketing: " + (out ? jpDot(krLc(out)) : "[how to stop direct marketing, for example the unsubscribe link in each message].") });
		return b;
	}
	/* Section 71. */
	function zaAdmBlocks(s) {
		var why = v(s, "zaAdmWhy"), what = v(s, "zaAdmWhat") || v(s, "admWhat"), logic = v(s, "zaAdmLogic") || v(s, "admLogic");
		return [{ k: "p", x: "We make decisions about you based solely on automated processing of your personal information that builds a profile of you, and the decisions have legal consequences for you or affect you to a substantial degree: " + jpDot(krLc(what || "[the decisions and what they are based on]")) },
			{ k: "p", x: why === "contract_met" ? "We do so only in connection with concluding or performing a contract with you, where your request under the contract has been met (s. 71(2)(a)(i))." :
				why === "contract_measures" ? "We do so in connection with concluding or performing a contract with you, with measures that protect your legitimate interests: you can make representations about the decision, and we give you enough information about the underlying logic to do so (s. 71(2)(a)(ii), (3)). The logic: " + jpDot(krLc(logic || "[the underlying logic of the automated processing]")) :
				why === "law" ? "A law or code of conduct that sets measures to protect your legitimate interests governs these decisions: " + jpRef(auThe(v(s, "zaAdmLaw") || "[the law or code of conduct]"), "s. 71(2)(b)") :
				"[Say how section 71(2) allows these decisions.]" }];
	}
	/* Sections 19 to 22; section 14. */
	function zaSecBlocks(s) {
		return [{ k: "p", x: "We take appropriate, reasonable technical and organisational measures to protect personal information against loss, damage and unauthorised destruction, and against unlawful access or processing; where an operator processes it for us, a written contract requires the same of it (ss. 19, 21)" +
				(v(s, "zaSecurity") ? ": " + stop(krLc(v(s, "zaSecurity"))) : ".") },
			{ k: "p", x: "If we have reasonable grounds to believe that someone without authorisation has accessed or acquired your personal information, we notify the Information Regulator and, where we can identify you, tell you in writing, as soon as we reasonably can after we discover it (s. 22)." }];
	}
	function zaRetainBlock(s, where) {
		return { k: "p", x: "We keep personal information only as long as we need it for the purpose, unless a law requires or authorises us to keep it longer, we reasonably need it for lawful purposes related to our functions or activities, a contract between us requires it, or you consent (s. 14(1)). We then destroy or delete it, or de-identify it, in a way that prevents its reconstruction (s. 14(4), (5)). The periods are shown " + where + "." };
	}
	/* The Information Officer and the responsible party's contact details (s. 18(1)(b); ss. 55, 56). */
	function zaEmail(s) { return v(s, "zaIoEmail") || v(s, "ctrlEmail"); }
	function zaPhone(s) { return v(s, "zaIoPhone") || v(s, "ctrlPhone"); }
	function zaPost(s) { return String(v(s, "ctrlAddress") || "").replace(/\s*\n+\s*/g, ", "); }
	function zaContactLine(s) { var l = [zaEmail(s), zaPhone(s), zaPost(s)].filter(Boolean).map(jpTrim); return l.length ? l.join("; ") : "[email address or postal address]"; }
	function zaWritten(s) { return zaEmail(s) ? "email our Information Officer at " + jpTrim(zaEmail(s)) : zaPost(s) ? "write to our Information Officer at " + jpTrim(zaPost(s)) : ""; }
	function zaReqWay(s) { return v(s, "zaReqHow") || v(s, "rightsContact") || zaWritten(s); }
	function zaComplaintWay(s) { return v(s, "zaComplaint") || zaWritten(s); }
	function zaWithdrawWay(s) { return v(s, "withdrawHow") || v(s, "rightsContact") || zaWritten(s); }
	function zaDaysTxt(s) { var n = parseInt(v(s, "zaReqDays"), 10); return n > 0 && n < 366 ? ", and within " + n + " days" : ""; }
	function zaContactBlocks(s) {
		var ctrl = v(s, "ctrlName") ? jpTrim(v(s, "ctrlName")) : "[Organisation]";
		var it = [{ b: "Responsible party:", x: ctrl }, { b: "Address:", x: zaPost(s) ? jpTrim(zaPost(s)) : "[the organisation's address]" }];
		if (v(s, "zaIo")) it.push({ b: "Information Officer:", x: jpTrim(v(s, "zaIo")) });
		if (v(s, "zaDio")) it.push({ b: "Deputy Information Officer:", x: jpTrim(v(s, "zaDio")) });
		if (zaEmail(s)) it.push({ b: "Email:", x: jpTrim(zaEmail(s)) });
		if (zaPhone(s)) it.push({ b: "Telephone:", x: jpTrim(zaPhone(s)) });
		var b = [{ k: "p", x: ctrl + " is the responsible party for the personal information described here: we decide why and how it is processed. Contact our Information Officer with questions, requests, objections and complaints about your personal information:" },
			{ k: "ul", items: it }];
		if (v(s, "zaPaia")) b.push({ k: "p", x: "Our manual under the Promotion of Access to Information Act (PAIA), which describes the records we hold, our processing of personal information and how to request access to records, is available at " + jpDot(jpTrim(v(s, "zaPaia"))) });
		return b;
	}
	/* Sections 5, 11(2), 11(3), 23 to 25, 69, 71; Regulations, regs 2, 3. */
	function zaRightsBlocks(s, admSec) {
		var fee = v(s, "zaFee"), way = zaReqWay(s), obj = zaObjActs(s), cons = zaConsent(s), bs = [];
		obj.forEach(function (a) { var t = v(a, "zaBasis") === "li" ? "our legitimate interests or those of a third party" : v(a, "zaBasis") === "dsli" ? "the protection of a legitimate interest of yours" : "our public law duty"; if (bs.indexOf(t) === -1) bs.push(t); });
		var it = [
			{ b: "Access (s. 23).", x: "You can ask us to confirm, free of charge, whether we hold personal information about you, and ask for the record or a description of it, including the identity of the third parties, or categories of third parties, that have or had access to it. " +
				(fee === "Yes" ? "For the record itself, we can charge the prescribed fee (s. 23(1)(b)(ii)): we give you a written estimate before we do the work, and can ask for a deposit (s. 23(3))." : fee === "No" ? "We do not charge for access." : "[Say whether you charge a fee for access.]") },
			{ b: "Correction and deletion (s. 24).", x: "You can ask us, at any time and free of charge, to correct or delete personal information that is inaccurate, irrelevant, excessive, out of date, incomplete, misleading or obtained unlawfully, or to destroy or delete a record we are no longer allowed to keep. We tell you in writing what we did, within 30 days (Regulations, reg 3)." },
			{ b: "Objection (s. 11(3)(a)).", x: bs.length ? "You can object at any time, on reasonable grounds relating to your particular situation, to processing based on " + joinList(bs) + ", unless legislation provides for that processing. If you object, we stop (s. 11(3)(a), (4))." :
				"You can object, on reasonable grounds relating to your particular situation, to processing based on legitimate interests or a public law duty. We do not process your personal information on those grounds." }];
		if (yes(s, "zaDm") && (v(s, "zaDmElec") !== "none" || yes(s, "zaDmPost"))) it.push({ b: "Direct marketing (ss. 11(3)(b), 69).", x: "You can object to direct marketing at any time, free of charge, and we then stop." });
		if (cons) it.push({ b: "Withdrawing consent (s. 11(2)(b)).", x: "Where we rely on your consent" + (yes(s, "zaKids") && v(s, "zaKidsBasis") === "competent" ? ", or on the consent of a parent, guardian or other competent person for a child, you or they can" : ", you can") + " withdraw it at any time: " + (zaWithdrawWay(s) ? jpDot(krLc(zaWithdrawWay(s))) : "[how to withdraw consent].") + " Withdrawal does not affect what we did before, or processing on another legal basis." });
		if (yes(s, "zaAdm")) it.push({ b: "Automated decisions (s. 71).", x: "You have the right not to be subject to a decision based solely on automated processing that profiles you, with legal consequences for you or a substantial effect on you, except as section 71(2) allows" + (admSec ? "; section " + admSec + " explains our decisions." : "; the part on automated decisions explains ours.") });
		var phone = /\b(phone|call|telephone|tel)\b|\+?\d[\d ]{7,}\d/i.test(way || "");
		return [{ k: "ul", items: it },
			{ k: "p", x: "How to make a request or objection: " + (way ? jpDot(krLc(way)) : "[where to send requests and objections].") + (fee === "Yes" ? " Objections and requests for correction or deletion are free of charge." : " Requests and objections are free of charge.") + " You can use the Information Regulator's Form 1 for an objection and Form 2 for a correction or deletion, or a similar form (Regulations, regs 2, 3)." +
				(phone ? " If you object or make a request by telephone, we record the call and give you the recording on request." : "") +
				" For access, we ask for adequate proof of your identity (s. 23(1)), and respond within a reasonable time" + zaDaysTxt(s) + "." }];
	}
	/* Section 18(1)(h)(v); section 74; Regulations, reg 7. The Regulator's details as on its website on 13 November 2026. */
	var ZA_IR = "the Information Regulator (South Africa), Woodmead North Office Park, 54 Maxwell Drive, Woodmead, Johannesburg, 2191. Complaints: by email to POPIAComplaints@inforegulator.org.za, or online through the Regulator's eServices portal, eservices.inforegulator.org.za. Enquiries: enquiries@inforegulator.org.za, telephone 010 023 5200 or toll free 0800 017 160. Website: inforegulator.org.za";
	function zaComplaintBlocks(s) {
		var how = zaComplaintWay(s), b = [];
		b.push({ k: "p", x: "You can complain to us: " + (how ? jpDot(krLc(how)) : "[how to make a complaint to you].") });
		b.push({ k: "p", x: "You can also complain to the Information Regulator, in writing on its Form 5 or online (s. 74; Regulations, reg 7): " + ZA_IR + "." });
		if (yes(s, "zaCode")) b.push({ k: "p", x: (v(s, "zaCodeName") ? jpTrim(v(s, "zaCodeName")).replace(/^the /i, "The ") : "[The code of conduct]") + ", a code of conduct issued under POPIA, applies to our processing. If the code has a complaints procedure, use it first: the Regulator can decline a complaint that has not gone through it (s. 77(1)(f))." });
		b.push({ k: "p", x: "You can also institute civil proceedings for damages for a breach of POPIA (s. 99)." });
		return b;
	}
	/* Section 15. */
	function zaFurtherTxt(s) {
		var f = v(s, "zaFurther"), d = v(s, "zaFurtherLaw");
		return f === "compatible" ? "The new purpose is compatible with the purpose we collected the information for, having regard to the factors in section 15(2) (s. 15(1))." :
			f === "consent" ? "We will ask for your consent first (s. 15(3)(a))." :
			f === "public" ? "The information is in a public record, or you deliberately made it public (s. 15(3)(b))." :
			f === "law" ? "It is necessary for a reason section 15(3)(c) sets out: " + jpRef(krLc(d || "[the reason: law enforcement, an obligation imposed by law, court proceedings or national security]"), "s. 15(3)(c)") :
			f === "threat" ? "It is necessary to prevent or mitigate a serious and imminent threat to public health or safety, or to someone's life or health (s. 15(3)(d))." :
			f === "research" ? "It is for historical, statistical or research purposes only, and we will not publish it in a form that identifies you (s. 15(3)(e))." :
			f === "exempt" ? "The Information Regulator has granted an exemption for it: " + jpRef(d || "[the exemption notice]", "s. 15(3)(f); s. 37") :
			"[Say how section 15 allows the new purpose.]";
	}

	function zaHead(s) { return "Additional information under South Africa's POPIA"; }
	function zaPointer(s, n) {
		return "For our processing of personal information under South Africa's Protection of Personal Information Act (POPIA), section " + n + " also applies. Our Information Officer: " + (v(s, "zaIo") ? jpTrim(v(s, "zaIo")) + ", " : "") + jpDot(zaContactLine(s));
	}
	var ZA_JUR = "POPIA also protects information about existing companies and other juristic persons, and this notice covers it too.";
	/* The South Africa section of a notice led by another law. POPIA applies to the processing of a responsible party domiciled
	   in South Africa, or of one that uses means in South Africa (s. 3(1)(b)), so the section is framed by the processing. */
	function zaSection(s, secs, lawName) {
		var b = [], H = function (t) { b.push({ k: "h3", x: t }); };
		var other = secs.filter(Boolean).map(String), cons = zaConsent(s);
		b.push({ k: "p", x: "The Protection of Personal Information Act 4 of 2013 (POPIA) applies to our processing of personal information" + (zaOffshore(s) ? ", because we use means in South Africa to process it" : "") + ", and this section is our notice under it (s. 18). " + ZA_JUR.replace("this notice", "this section") +
			" The choices and rights in this section are those POPIA gives you." +
			(other.length ? " " + (other.length > 1 ? "Sections " : "Section ") + joinList(other) + (other.length > 1 ? " apply" : " applies") + " to you only where " + lawName + " applies to our processing of your data." : "") });
		H("Contact");
		Array.prototype.push.apply(b, zaContactBlocks(s));
		H("Purposes and legal bases");
		Array.prototype.push.apply(b, zaPurposeBlocks(s));
		H("Where we get it");
		Array.prototype.push.apply(b, zaSourceBlocks(s));
		H("Who we share it with");
		Array.prototype.push.apply(b, zaShareBlocks(s));
		H(zaOffshore(s) ? "Where we process it, and transfers outside South Africa" : "Transfers outside South Africa");
		Array.prototype.push.apply(b, zaAbroadBlocks(s));
		if (yes(s, "zaKids")) { H("Children"); Array.prototype.push.apply(b, zaKidsBlocks(s)); }
		if (yes(s, "zaDm")) { H("Direct marketing"); Array.prototype.push.apply(b, zaDmBlocks(s)); }
		if (yes(s, "zaAdm")) { H("Automated decisions"); Array.prototype.push.apply(b, zaAdmBlocks(s)); }
		H("Protection and retention");
		Array.prototype.push.apply(b, zaSecBlocks(s));
		b.push(zaRetainBlock(s, "in the table above"));
		H("Your rights");
		Array.prototype.push.apply(b, zaRightsBlocks(s, null));
		H("Complaints");
		Array.prototype.push.apply(b, zaComplaintBlocks(s));
		if (yes(s, "further")) b.push({ k: "p", x: "For the planned new use described in this notice: " + lcFirst(zaFurtherTxt(s)) });
		return b;
	}

	/* Part V rows. led: South Africa sets the main text. */
	function zaChecks(s, led) {
		var checks = [], delivery = [], acts = pnActs(s), off = zaOffshore(s), cons = zaConsent(s), rec = arr(s, "recipients");
		var pl = sgPl;
		var nm = function (list, key) { return joinList(list.map(function (r) { return jpTrim(v(r, key || "who") || "[recipient]"); })); };
		var pick = function (id, m, w, c, okNote, naNote) { return m.length ? chk(id, "missing", m.concat(w, c).join(" ")) : w.length ? chk(id, "warn", w.concat(c).join(" ")) : c.length ? chk(id, "check", c.join(" ")) : naNote ? chk(id, "na", naNote) : chk(id, "ok", okNote || ""); };
		/* V01: name and address */
		var m1 = [];
		if (!v(s, "ctrlName")) m1.push("Add the organisation's name (s. 18(1)(b)).");
		if (!v(s, "ctrlAddress")) m1.push("Add the organisation's address: the notice must give the responsible party's name and address (s. 18(1)(b)).");
		if (led && !v(s, "effective")) m1.push("Give the date this notice applies from.");
		checks.push(m1.length ? chk("V01", "missing", m1.join(" ")) : chk("V01", "ok", "The responsible party's name and address" + (led ? ", and the date the notice applies from." : ".")));
		/* V02: how POPIA applies */
		var m2 = [], w2 = [], c2 = [];
		if (!v(s, "zaScope")) m2.push("Say whether you are domiciled in South Africa, or use means in South Africa to process personal information (s. 3(1)(b)).");
		if (off && !v(s, "zaOffWhere")) m2.push("Name the countries where you process the personal information: the notice prints them.");
		if (off && !v(s, "zaOffLevel")) m2.push("Give the level of protection the information has in the countries where you process it (s. 18(1)(g)): the notice prints a placeholder.");
		if (v(s, "zaScope") === "in" && zaPost(s) && zaWhere(zaPost(s)) === "abroad") c2.push("You answered that you are domiciled in South Africa, but your address is outside South Africa: check the answer, and give the responsible party's address (ss. 3(1)(b), 18(1)(b)).");
		if (off) c2.push("POPIA applies to a responsible party not domiciled in South Africa that uses automated or non-automated means in South Africa, unless those means only forward information through South Africa (s. 3(1)(b)(ii)). Section 72 speaks of a responsible party in South Africa: take advice on how it applies to your transfers.");
		if (yes(s, "publicBody")) w2.push("This generator models private bodies. A public body has other rules too: the public law duty basis (s. 11(1)(e)), its manual in at least three official languages (PAIA s. 14), and the exclusions for national security and law enforcement (s. 6(1)(c)). Check them.");
		checks.push(pick("V02", m2, w2, c2, "A responsible party under POPIA."));
		/* V03: purposes and information */
		var m3 = [], w3 = [];
		var vp = acts.filter(function (a) { return D.LINT.vaguePurpose.test(v(a, "purpose")); }), np = acts.filter(function (a) { return !String(v(a, "purpose") || "").trim(); }), noData = acts.filter(function (a) { return !v(a, "data"); });
		if (!acts.length) m3.push("Add the purposes for which you process personal information (s. 18(1)(c)).");
		if (np.length) m3.push("Name each purpose: " + np.length + (np.length > 1 ? " purposes have" : " purpose has") + " no name, and the notice prints [purpose] (s. 13(1)).");
		if (noData.length && acts.length) m3.push("Give the information collected for " + pl(noData) + " (s. 18(1)(a)).");
		if (led && yes(s, "inferred") && !v(s, "inferredWhat")) m3.push("Say what you infer about people, and from what: the notice prints a placeholder.");
		if (led && !yes(s, "adm") && yes(s, "profiling") && !v(s, "profilingWhat")) m3.push("Describe the analysis and what it is used for: the notice prints a placeholder.");
		if (vp.length) w3.push("Make each purpose specific and explicitly defined (s. 13(1)): " + stop(pl(vp)));
		checks.push(pick("V03", m3, w3, [], "Purposes and the information collected, per purpose."));
		/* V04: legal basis */
		var m4 = [], c4 = [];
		var nb = acts.filter(function (a) { return !v(a, "zaBasis"); });
		var bLaw = acts.filter(function (a) { return v(a, "zaBasis") === "law" && !v(a, "zaBasisLaw"); });
		var bWhat = acts.filter(function (a) { var b = v(a, "zaBasis"); return (b === "dsli" || b === "public" || b === "li") && !v(a, "zaBasisWhat"); });
		var bPub = acts.filter(function (a) { return v(a, "zaBasis") === "public" && !yes(s, "publicBody"); });
		if (nb.length) m4.push("Give the legal basis in section 11(1) for " + stop(pl(nb)) + " The notice prints a placeholder.");
		if (bLaw.length) m4.push("Name the law that imposes the obligation for " + stop(pl(bLaw)));
		if (bWhat.length) m4.push("Describe the legitimate interest, or the public law duty, for " + stop(pl(bWhat)));
		if (bPub.length) m4.push("Only a public body can rely on a public law duty (s. 11(1)(e)): choose another basis for " + stop(pl(bPub)));
		if (acts.some(function (a) { return v(a, "zaBasis") === "consent"; })) c4.push("Consent is a voluntary, specific and informed expression of will (s. 1); you bear the burden of proof (s. 11(2)(a)), and people can withdraw it at any time (s. 11(2)(b)).");
		if (acts.some(function (a) { return v(a, "zaBasis") === "li"; })) c4.push("Before relying on legitimate interests, document why the processing is necessary and how you balanced your interest against the person's rights; for direct marketing, the Regulator describes a three-stage assessment of purpose, necessity and balancing (Guidance Note on Direct Marketing, 5.2). People can object (s. 11(3)(a)).");
		if (acts.some(function (a) { return v(a, "zaBasis") === "dsli"; })) c4.push("Section 11(1)(d) needs processing that protects a legitimate interest of the person themselves: the notice names that interest.");
		checks.push(pick("V04", m4, [], c4, "A section 11(1) basis for each purpose.", acts.length ? "" : "No purposes yet."));
		/* V05: special personal information */
		var m5 = [], w5 = [], c5 = [];
		var sp = zaSpecialActs(s), noS = acts.filter(function (a) { return !v(a, "zaSpecial"); });
		var spWhat = sp.filter(function (a) { return !v(a, "zaSpecialWhat"); }), spSec = sp.filter(function (a) { return v(a, "zaSpecial") === "specific" && !ZA_SEC_T[v(a, "zaSpecialSec")] && v(a, "zaSpecialSec") !== "32" && v(a, "zaSpecialSec") !== "28"; });
		var sp28 = sp.filter(function (a) { return v(a, "zaSpecial") === "specific" && v(a, "zaSpecialSec") === "28" && !v(a, "zaSpecialWhy"); });
		var sp32 = sp.filter(function (a) { return v(a, "zaSpecial") === "specific" && v(a, "zaSpecialSec") === "32" && !v(a, "zaSpecialWhy"); }), spAuth = sp.filter(function (a) { return v(a, "zaSpecial") === "auth" && !v(a, "zaSpecialWhy"); });
		var gd = acts.filter(function (a) {
			return (art9Of(s, a) || crimOf(s, a) || (inReg(s, "jp") && yes(a, "jpSens")) || (inReg(s, "kr") && yes(a, "krSens")) || (inReg(s, "cn") && yes(a, "cnSens")) ||
				(inReg(s, "can") && yes(a, "canSens")) || (inReg(s, "br") && !!v(a, "brSens")) || (inReg(s, "au") && !!auSensOf(a))) && !zaSpecialOf(a); });
		if (spWhat.length) m5.push("Name the special personal information for " + stop(pl(spWhat)) + " The notice prints a placeholder.");
		if (spSec.length) m5.push("Choose the section, 28 to 33, that allows it for " + stop(pl(spSec)));
		if (sp28.length) m5.push("Say how section 28 applies for " + stop(pl(sp28)) + " As a spiritual or religious organisation (s. 28(1)(a)), as an institution founded on religious or philosophical principles (s. 28(1)(b)), or, for another institution, to protect people's spiritual welfare unless they object (s. 28(1)(c)).");
		if (sp.some(function (a) { return v(a, "zaSpecialSec") === "28"; })) c5.push("Under section 28(1)(c), an institution that is not religious or founded on religious or philosophical principles can process religious or philosophical beliefs only to protect people's spiritual welfare, unless they have indicated that they object: if you rely on it, say so in the details.");
		if (sp32.length) m5.push("Say how section 32 applies for " + stop(pl(sp32)) + " For example: as a medical scheme, to perform your membership agreement (s. 32(1)(b)(ii)).");
		if (spAuth.length) m5.push("Give the details of the Regulator's authorisation, with its Gazette notice, for " + stop(pl(spAuth)));
		if (gd.length) w5.push(pl(gd) + (gd.length > 1 ? " are" : " is") + " marked as sensitive under another law in this notice, but not as special personal information for South Africa. Special personal information is religious or philosophical beliefs, race or ethnic origin, trade union membership, political persuasion, health or sex life, biometric information, and criminal behaviour (s. 26): say how section 27 allows it.");
		if (noS.length) w5.push("Say for " + pl(noS) + " whether " + (noS.length > 1 ? "they involve" : "it involves") + " special personal information (s. 26). The notice describes it separately.");
		if (sp.some(function (a) { return v(a, "zaSpecial") === "consent"; })) c5.push("Consent must be voluntary, specific and informed (s. 1), and you bear the burden of proof (s. 11(2)(a)).");
		if (sp.some(function (a) { return v(a, "zaSpecialSec") === "32" || /\bhealth\b/i.test(v(a, "zaSpecialWhat")); })) c5.push("Insurers, medical schemes and their administrators, managed healthcare organisations, administrative bodies, pension funds and employers that process health information also follow the Regulations relating to the Processing of Data Subjects' Health Information by Certain Responsible Parties, 2026 (GN 7198 of 6 March 2026): safeguards for health records, a duty of confidentiality, and transfers only under section 72.");
		if (sp.some(function (a) { return v(a, "zaSpecial") === "auth"; })) c5.push("An authorisation is granted by notice in the Gazette, in the public interest, and can carry conditions (s. 27(2), (3)).");
		if (sp.some(function (a) { return v(a, "zaSpecialSec") === "33"; })) c5.push("Where the information concerns your own personnel, process it in accordance with the rules established under labour legislation (s. 33(2)).");
		checks.push(pick("V05", m5, w5, c5, sp.length ? "Each kind of special personal information with how section 27 allows it." : "No special personal information.", acts.length ? "" : "No purposes yet."));
		/* V06: children */
		if (!v(s, "zaKids")) checks.push(chk("V06", "check", "Answer whether you process personal information of children (under 18): POPIA prohibits it unless section 35 allows it (s. 34)."));
		else if (no(s, "zaKids")) checks.push(chk("V06", "na", "No personal information of children."));
		else {
			var kb = v(s, "zaKidsBasis"), m6 = [], c6 = [];
			if (!kb) m6.push("Say how section 35 allows processing personal information of children: the notice prints a placeholder.");
			if (kb === "auth" && !v(s, "zaKidsHow")) m6.push("Give the details of the Regulator's authorisation, with its Gazette notice (s. 35(2)).");
			if (kb === "competent" && !v(s, "zaKidsHow")) c6.push("Describe how a competent person, such as a parent or guardian, gives prior consent, and how you check it (s. 35(1)(a)).");
			c6.push("A child is a person under 18; a competent person is someone legally competent to consent for the child, such as a parent or guardian (s. 1). An authorisation from the Regulator can carry conditions, such as notice of the nature of the children's information, how it is processed and any further processing (s. 35(3)).");
			checks.push(pick("V06", m6, [], c6, ""));
		}
		/* V07: a law requiring or authorising collection */
		var lawActs = acts.filter(function (a) { var l = v(a, "zaLaw"); return l === "required" || l === "authorised"; }), lNo = lawActs.filter(function (a) { return !v(a, "zaLawName"); }), lUn = acts.filter(function (a) { return !v(a, "zaLaw"); });
		checks.push(lNo.length ? chk("V07", "missing", "Name the law for " + pl(lNo) + " (s. 18(1)(f)): the notice prints a placeholder.") :
			lUn.length ? chk("V07", "check", "Answer for " + pl(lUn) + " whether a particular law authorises or requires collecting the information: the notice names it (s. 18(1)(f)).") :
			lawActs.length ? chk("V07", "ok", "The law is named for each purpose where one authorises or requires collection.") : chk("V07", "na", acts.length ? "No collection authorised or required by a particular law." : "No purposes yet."));
		/* V08: voluntary or mandatory, and consequences */
		if (!pnSourceDirect(s)) checks.push(chk("V08", "na", "You do not collect from people directly."));
		else if (!acts.length) checks.push(chk("V08", "na", "No purposes yet."));
		else {
			var noM = acts.filter(function (a) { return !v(a, "zaMand"); }), noC = acts.filter(function (a) { return !zaConseqOf(a); }), m8 = [];
			if (noM.length) m8.push("Say for " + pl(noM) + " whether giving the information is voluntary or mandatory (s. 18(1)(d)): the notice prints a placeholder.");
			if (noC.length) m8.push("Give the consequences of not providing the information for " + pl(noC) + " (s. 18(1)(e)): the notice prints a placeholder. Where there are none that matter, say what the person misses, for example \"you do not receive the newsletter\".");
			checks.push(m8.length ? chk("V08", "missing", m8.join(" ")) : chk("V08", "ok", "Voluntary or mandatory, and the consequences, for each purpose."));
		}
		/* V09: sources */
		var m9 = [], c9 = [];
		if (!v(s, "source")) m9.push("Answer where the personal information comes from: from people directly, from other sources, or both (s. 18(1)(a)).");
		var srcBad = pnSourceIndirect(s) ? arr(s, "sources").filter(function (x) { return !v(x, "name") || !v(x, "what"); }) : [];
		if (pnSourceIndirect(s) && !arr(s, "sources").length) m9.push("Name the sources you collect personal information from (s. 18(1)(a)).");
		if (srcBad.length) m9.push("Give the name of each source, and the information obtained from it: the notice prints a placeholder.");
		if (pnSourceIndirect(s)) c9.push("Collect directly from the person unless section 12(2) allows another source: a public record or information the person made public, the person's consent, no prejudice to their legitimate interest, necessity for law enforcement, a legal obligation, court proceedings, national security or legitimate interests, or where direct collection would prejudice a lawful purpose or is not reasonably practicable. Tell people before you collect, or as soon as reasonably practicable after (s. 18(2)(b)).");
		checks.push(pick("V09", m9, [], c9, "You collect from people directly."));
		/* V10: Information Officer */
		var w10 = [], c10 = [];
		if (!zaEmail(s) && !zaPost(s)) w10.push("Give an email or postal address for privacy questions, requests and complaints.");
		if (!v(s, "zaIo")) w10.push("Name your Information Officer: for a private body, the head of the body (the chief executive officer or equivalent) or a person the head authorises (PAIA s. 1; Guidance Note on Information Officers, 1.3, 2.2).");
		if (!v(s, "zaIoReg")) c10.push("Answer whether your Information Officer is registered with the Information Regulator.");
		else if (no(s, "zaIoReg")) w10.push("Register your Information Officer, and any deputies, with the Information Regulator through its eServices portal: they take up their duties only after registration (s. 55(2)).");
		checks.push(pick("V10", [], w10, c10, "The Information Officer, registered with the Regulator (ss. 55, 56)."));
		/* V11: recipients */
		var m11 = [], c11 = [], noWho = rec.filter(function (r) { return !String(v(r, "who") || "").trim(); }), noWhere = zaNoWhere(s), noWhy = rec.filter(function (r) { return !v(r, "why"); }), un = zaUnlisted(s);
		if (un.length) m11.push((!rec.length && yes(s, "zaNoRecip") ? "You confirmed that there are no recipients, but " + nm(un, "recipient") + (un.length > 1 ? " are listed as recipients outside South Africa. " : " is listed as a recipient outside South Africa. ") : "") +
			"Add " + nm(un, "recipient") + " to the recipients, with what " + (un.length > 1 ? "they do" : "it does") + " with the information (s. 18(1)(h)(i)).");
		if (!rec.length && !yes(s, "zaNoRecip")) m11.push("List the recipients, or categories of recipients, operators included, or confirm in the South Africa section that there are none (s. 18(1)(h)(i)).");
		if (noWho.length) m11.push("Name each recipient, or its category: " + noWho.length + (noWho.length > 1 ? " recipients have" : " recipient has") + " no name, and the notice prints a placeholder.");
		if (noWhere.length) m11.push("Give where " + nm(noWhere) + (noWhere.length > 1 ? " are" : " is") + " located: without it, the notice cannot say whether personal information leaves South Africa (s. 18(1)(g)).");
		if (noWhy.length) m11.push("Give what " + nm(noWhy) + (noWhy.length > 1 ? " do" : " does") + " with the information: the notice prints a placeholder.");
		if (rec.some(function (r) { return v(r, "role") === "processor"; })) c11.push("Operators process personal information only with your knowledge or authorisation and treat it as confidential (s. 20); a written contract must require them to keep the security measures of section 19, and to tell you at once of a compromise (s. 21).");
		checks.push(pick("V11", m11, [], c11, rec.length ? "Recipients, each with what it does with the information and where it is located." : "No recipients, confirmed."));
		/* V12: transfers outside South Africa */
		var rows = zaXrows(s), ab = zaRecAbroad(s), unk = zaRecUnknown(s), m12 = [], w12 = [], c12 = [];
		if (!v(s, "zaAbroad")) m12.push("Say whether you transfer personal information to third parties outside South Africa (s. 18(1)(g), s. 72).");
		else if (no(s, "zaAbroad")) {
			if (ab.length) m12.push(nm(ab) + (ab.length > 1 ? " are" : " is") + " outside South Africa, but the answer is No.");
			if (unk.length) m12.push("Check where " + nm(unk) + (unk.length > 1 ? " are" : " is") + " located: the notice cannot say that nothing leaves South Africa until each location names only South African places.");
		}
		if (yes(s, "zaAbroad")) {
			if (!rows.length) m12.push("Add each recipient outside South Africa, with its country (s. 18(1)(g)).");
			if (rows.some(function (r) { return !v(r, "recipient") || !v(r, "country") || !v(r, "basis"); })) m12.push("Give the recipient, the country and how section 72 allows each transfer.");
			var grp = { adq: [], consent: [], contract: [], benefit: [] };
			rows.forEach(function (r) {
				var ba = v(r, "basis"), who = jpTrim(v(r, "recipient") || "[recipient]"), rr = zaRowRec(s, r);
				if (zaXfer(s, r) && ba !== "own" && zaWhere(v(r, "country")) !== "za") { if (zaAdequate(ba)) grp.adq.push(who); else if (ba === "consent") grp.consent.push(who); else if (ba === "contract" || ba === "contract3") grp.contract.push(who); else if (ba === "benefit") grp.benefit.push(who); }
				if (ba === "law" && !v(r, "lawName")) m12.push(stop("Name the law that protects the information at " + who));
				if (zaNeedLevel(s, r) && !v(r, "protection")) m12.push(stop("Give the level of protection the information has in the country of " + who + " (s. 18(1)(g)): the notice prints a placeholder"));
				if (ba === "bcr" && rr && ["controller", "joint"].indexOf(v(rr, "role")) === -1 && !/group|affiliate|subsidiar|related/i.test(v(rr, "why") + " " + v(rr, "who"))) c12.push("Binding corporate rules apply only within a group of undertakings (s. 72(2)): check that " + who + " belongs to your group.");
				if (ba === "own" && !zaOwnOk(s, r)) m12.push(who + " is not your own organisation (its name differs from yours, or it is listed as a recipient): a related company is a third party. Choose another basis; the notice prints a placeholder.");
				if (zaWhere(v(r, "country")) === "za") m12.push("The row for " + who + " names South Africa as the country: list only recipients outside South Africa.");
				if (rr && v(rr, "where") && v(r, "country") && zaWhere(v(r, "country")) !== "za" && zaWhere(v(rr, "where")) === "za") w12.push("The recipients list places " + who + " in South Africa (\"" + jpTrim(v(rr, "where")) + "\"), but the transfers outside South Africa give " + jpTrim(v(r, "country")) + ": correct one of them.");
				else if (rr && v(rr, "where") && v(r, "country") && zaWhere(v(r, "country")) !== "za") {
					var lw = String(v(rr, "where")).toLowerCase(), lc = String(v(r, "country")).toLowerCase().trim();
					if (lw.indexOf(lc) === -1 && lc.indexOf(lw.trim()) === -1) c12.push("Check the country of " + who + ": the recipients list gives \"" + jpTrim(v(rr, "where")) + "\".");
				}
			});
			if (grp.adq.length) c12.push("For " + joinList(grp.adq) + ": the law, binding corporate rules or binding agreement must effectively uphold principles substantially similar to POPIA's conditions, for natural and, where applicable, juristic persons, and contain substantially similar rules on onward transfers (s. 72(1)(a)); keep your assessment. POPIA itself lists no countries with adequate protection.");
			if (grp.consent.length) c12.push("For " + joinList(grp.consent) + ": consent must be voluntary, specific and informed (s. 1): tell people the country and the level of protection there before they consent.");
			if (grp.contract.length) c12.push("For " + joinList(grp.contract) + ": the transfer must be necessary for the contract, not merely useful (s. 72(1)(c), (d)).");
			if (grp.benefit.length) c12.push("For " + joinList(grp.benefit) + ": section 72(1)(e) needs all three: the transfer is for the person's benefit, consent is not reasonably practicable, and they would be likely to give it.");
			var inRows = function (r) { return rows.some(function (x) { return jpSame(v(x, "recipient"), v(r, "who")); }); };
			var miss = ab.filter(function (r) { return !inRows(r); }), unkMiss = unk.filter(function (r) { return !inRows(r); });
			if (miss.length) m12.push(nm(miss) + (miss.length > 1 ? " are" : " is") + " outside South Africa but not in the transfers outside South Africa.");
			if (unkMiss.length) m12.push("Check where " + nm(unkMiss) + (unkMiss.length > 1 ? " are" : " is") + " located; if outside South Africa, add " + (unkMiss.length > 1 ? "them" : "it") + " to the transfers outside South Africa.");
			var weak = rows.filter(function (r) { var ba = v(r, "basis"); return zaXfer(s, r) && ba && ba !== "own" && !zaAdequate(ba) && zaWhere(v(r, "country")) !== "za"; });
			var adqRows = rows.filter(function (r) { var ba = v(r, "basis"); return zaXfer(s, r) && (ba === "bcr" || ba === "agreement") && zaWhere(v(r, "country")) !== "za"; });
			if (adqRows.length && (zaSpecialActs(s).length || yes(s, "zaKids"))) c12.push("Section 57(1)(d) speaks of a foreign country that does not provide an adequate level of protection: where special personal information or children's information goes to " + nm(adqRows, "recipient") + " under binding corporate rules or a binding agreement, take advice on whether you need the Regulator's prior authorisation (ss. 57(1)(d), 58).");
			if (weak.length && (zaSpecialActs(s).length || yes(s, "zaKids"))) w12.push("You process special personal information or children's information, and transfer to " + nm(weak, "recipient") + " without relying on adequate protection: transferring that information to a third party in a country without an adequate level of protection needs the Regulator's prior authorisation (s. 57(1)(d)), unless a code of conduct for your sector is in force (s. 57(3)).");
		}
		if (off) c12.push("You are not domiciled in South Africa: holding the information within your own organisation is not a transfer to a third party.");
		checks.push(pick("V12", m12, w12, c12, "No transfers outside South Africa."));
		/* V13, V14 */
		var noRet = acts.filter(function (a) { return !v(a, "retention") || D.LINT.vagueRetention.test(v(a, "retention")); });
		checks.push(!acts.length ? chk("V13", "na", "No purposes yet.") : noRet.length ? chk("V13", "warn", "Give a period, or the criteria, for " + stop(pl(noRet)) + " Records are kept no longer than necessary for the purpose (s. 14(1)); a record used to make a decision about someone is kept long enough for them to ask for access (s. 14(3)). Where none is given, the notice states the section 14 rule.") : chk("V13", "ok"));
		checks.push(chk("V14", v(s, "zaSecurity") ? "ok" : "check", (v(s, "zaSecurity") ? "" : "The notice states the section 19 duty. Describing your main measures is good practice. ") + "Have regard to generally accepted information security practices, and to the rules of your industry or profession (s. 19(3))."));
		/* V15: access and correction */
		var m15 = [];
		if (!zaReqWay(s)) m15.push("Say where people send requests and objections (s. 18(1)(h)(iii), (iv)): the notice prints a placeholder.");
		if (!v(s, "zaFee")) m15.push("Say whether you charge a fee for access to a record (needed for the notice text; s. 23(1)(b)(ii)).");
		checks.push(pick("V15", m15, [], [], "Access, correction and deletion, free of charge except a prescribed access fee, with the route (ss. 23, 24; Regulations, reg 3)."));
		/* V16: right to object */
		var obj = zaObjActs(s);
		checks.push(obj.length ? chk("V16", "ok", "The right to object to processing on " + (obj.length > 1 ? "these grounds" : "this ground") + " is in the notice (s. 11(3)(a); Regulations, reg 2.4).") :
			chk("V16", "ok", "No purpose rests on section 11(1)(d) to (f); the notice still states the right to object (Regulations, reg 2.4)."));
		/* V17: withdrawing consent */
		checks.push(!cons ? chk("V17", "na", "No processing relies on consent.") : !zaWithdrawWay(s) ? chk("V17", "missing", "Say how people withdraw consent (s. 11(2)(b)): the notice prints a placeholder.") :
			chk("V17", "ok", "Withdrawal at any time, without affecting earlier processing or processing on another basis (s. 11(2)(b))."));
		/* V18: direct marketing */
		var mk = acts.filter(auMkt);
		if (!v(s, "zaDm")) checks.push(mk.length ? chk("V18", "warn", pl(mk) + (mk.length > 1 ? " look" : " looks") + " like direct marketing. Answer whether you use personal information for direct marketing (ss. 11(3)(b), 69).") :
			chk("V18", "check", "Answer whether you use personal information for direct marketing (ss. 11(3)(b), 69)."));
		else if (no(s, "zaDm")) checks.push(mk.length ? chk("V18", "warn", pl(mk) + (mk.length > 1 ? " look" : " looks") + " like direct marketing, but the answer is No.") : chk("V18", "na", "No direct marketing."));
		else {
			var el = v(s, "zaDmElec"), m18 = [], w18 = [], c18 = [];
			if (!el) m18.push("Say whether you send direct marketing by electronic communication, and on what basis (s. 69(1)): the notice prints a placeholder.");
			if (!v(s, "zaDmOut") && (el !== "none" || yes(s, "zaDmPost"))) m18.push("Say how people stop direct marketing: the notice prints a placeholder.");
			if (!mk.length) w18.push("No purpose in the table covers direct marketing: add it to the purposes (s. 13(1), 18(1)(c)).");
			if (el === "consent" && mk.some(function (a) { return v(a, "zaBasis") && v(a, "zaBasis") !== "consent"; })) w18.push("Direct marketing by electronic communication needs consent, unless the person is your customer and you market your own similar products or services (s. 69(1), (3)): " + pl(mk.filter(function (a) { return v(a, "zaBasis") && v(a, "zaBasis") !== "consent"; })) + " should rest on consent.");
			if (el === "none" && !yes(s, "zaDmPost")) m18.push("You answered Yes to direct marketing, but neither electronic communication nor post or in person: say how you market, or answer No.");
			var mkEl = mk.filter(function (a) { return /\b(e-?mails?|sms|text messages?|whatsapp|newsletters?|push notifications?|messages|calls?)\b/i.test(v(a, "purpose") + " " + v(a, "data")); });
			if (el === "none" && mkEl.length) w18.push(pl(mkEl) + (mkEl.length > 1 ? " look" : " looks") + " like direct marketing by electronic communication, but the answer is that you do not market that way (s. 69(1)).");
			var mkNc = mk.filter(function (a) { return v(a, "zaBasis") && v(a, "zaBasis") !== "consent"; });
			if (el === "both" && mkNc.length) w18.push("People who are not your customers can receive electronic direct marketing only with their consent (s. 69(1)(a)): " + pl(mkNc) + (mkNc.length > 1 ? " rest" : " rests") + " on another basis. Rest it on consent for people who are not your customers, or split the purpose.");
			if (el && el !== "none") c18.push("The Regulator treats telephone calls, push notifications, direct messages on social media and the use of cookies for marketing as electronic communication (Guidance Note on Direct Marketing, 7.1).");
			if (el === "customers" || el === "both") c18.push("The customer exception covers only contact details obtained in the context of the sale of a product or service, and marketing of your own similar products or services, with a chance to object at collection and in every message (s. 69(3)); silence is not consent (Guidance Note on Direct Marketing, 7.3).");
			if (yes(s, "zaDmPost")) c18.push("Direct marketing by post or in person can rest on legitimate interests after a documented assessment (Guidance Note on Direct Marketing, 5); people can object at any time (s. 11(3)(b)).");
			checks.push(pick("V18", m18, w18, c18, ""));
		}
		/* V19: automated decisions */
		var zad = v(s, "zaAdm");
		var admPh = led && yes(s, "adm") && !v(s, "admWhat") ? "Describe the automated decisions and what they are based on: the notice prints a placeholder. " : "";
		if (!zad) checks.push(yes(s, "adm") ? chk("V19", admPh ? "missing" : "warn", admPh + "Your answers say you make automated decisions: answer the South Africa question on section 71.") :
			chk("V19", "check", "Answer whether you make decisions based solely on automated processing that profiles people, with legal consequences or a substantial effect (s. 71(1))."));
		else if (zad === "No") checks.push(yes(s, "adm") ? chk("V19", admPh ? "missing" : "warn", admPh + "Your answers say you make automated decisions, but the South Africa answer is No. Section 71 covers decisions based solely on automated processing intended to provide a profile (performance at work, creditworthiness, reliability, location, health, preferences or conduct) with legal consequences or a substantial effect.") :
			chk("V19", "na", "No decisions of the kind section 71 covers."));
		else {
			var m19 = [], why19 = v(s, "zaAdmWhy");
			if (!v(s, "zaAdmWhat") && !v(s, "admWhat")) m19.push("Describe the decisions and what they are based on.");
			if (!why19) m19.push("Say how section 71(2) allows the decisions.");
			if (why19 === "contract_measures" && !v(s, "zaAdmLogic") && !v(s, "admLogic")) m19.push("Give the underlying logic, so people can make representations (s. 71(3)(b)).");
			if (why19 === "law" && !v(s, "zaAdmLaw")) m19.push("Name the law or code of conduct.");
			checks.push(m19.length ? chk("V19", "missing", m19.join(" ") + " The notice prints a placeholder.") :
				chk("V19", "check", why19 === "contract_measures" ? "Give people an opportunity to make representations about each decision, with enough information about the underlying logic (s. 71(3))." : "Keep the conditions of section 71(2) under review for each decision."));
		}
		/* V20: complaints and the Regulator */
		checks.push(chk("V20", zaComplaintWay(s) ? "check" : "missing", (zaComplaintWay(s) ? "" : "Say how people complain to you: the notice prints a placeholder. ") +
			"The notice gives the Information Regulator's contact details (s. 18(1)(h)(v)) as on its website on 13 November 2026; its guidance notes still give its earlier office at JD House, Braamfontein, and a postal address that its contact page does not list. Check them before you publish. The Regulator does not accept a complaint lodged more than three years after the matter arose, unless it accepts the reasons for the delay (Rules of Procedure, rules 4.5.4, 4.5.5)."));
		/* V21: codes of conduct */
		checks.push(!v(s, "zaCode") ? chk("V21", "check", "Answer whether a code of conduct issued under POPIA applies to you (issued codes include those for credit bureaus and the banking industry): if one does, follow it, and the notice names it (s. 60).") :
			no(s, "zaCode") ? chk("V21", "na", "No code of conduct.") : v(s, "zaCodeName") ? chk("V21", "check", "Follow the code's complaints procedure where it has one: the Regulator can decline a complaint that has not gone through it (s. 77(1)(f)).") : chk("V21", "missing", "Name the code of conduct: the notice prints a placeholder."));
		/* V22: new purpose */
		if (yes(s, "further")) {
			var fm = [], ff = v(s, "zaFurther");
			if (led) { if (!v(s, "furtherWhat")) fm.push("the new purpose"); if (!v(s, "furtherStart")) fm.push("when it starts"); if (!v(s, "furtherData")) fm.push("the personal information used"); }
			if (!ff) fm.push("how section 15 allows it");
			if ((ff === "law" || ff === "exempt") && !v(s, "zaFurtherLaw")) fm.push(ff === "law" ? "the reason under section 15(3)(c)" : "the exemption notice");
			checks.push(fm.length ? chk("V22", "missing", "For the new purpose, give " + joinList(fm) + " (s. 15): the notice prints a placeholder.") :
				ff === "compatible" ? chk("V22", "check", "Assess compatibility against the relationship between the purposes, the nature of the information, the consequences for the person, how it was collected and any contract (s. 15(2)); keep the assessment. Update the notice before you start.") :
				chk("V22", "check", "Check that the ground covers the new purpose (s. 15(3)). Update the notice before you start."));
		}
		/* V23: employees and applicants */
		var aud = v(s, "audience");
		if (aud === "employee" || aud === "applicant") checks.push(chk("V23", "check", "POPIA has no exemption for employee records: this notice covers " + (aud === "employee" ? "staff" : "job applicants") + ". Criminal behaviour or biometric information of personnel is processed in accordance with the rules established under labour legislation (s. 33(2)); employers that process health information also follow the Health Information Regulations 2026 (GN 7198)."));
		/* V24: prior authorisation */
		var pa = acts.filter(function (a) { return /\bcredit (report|reporting|bureau|check|vetting)|\bcriminal (record|background|check)|\bbackground (check|screening)/i.test(v(a, "purpose") + " " + v(a, "data")); });
		checks.push(chk("V24", pa.length ? "warn" : "check", (pa.length ? pl(pa) + (pa.length > 1 ? " look" : " looks") + " like processing that can need prior authorisation. " : "") +
			"Get the Regulator's prior authorisation before you process unique identifiers for another purpose to link them with other responsible parties' information, process information on criminal behaviour or unlawful or objectionable conduct on behalf of third parties, process information for credit reporting, or transfer special personal information or children's information to a country without adequate protection (s. 57(1)), unless a code of conduct for your sector is in force (s. 57(3)). Notify the Regulator, and do not start the processing until it has completed its investigation or told you it will not investigate in more detail (s. 58)."));
		/* V25: not modelled */
		checks.push(chk("V25", "check", "Not modelled: public bodies beyond a warning, the exclusions and exemptions (ss. 6, 7, 37, 38), the exceptions to notification (s. 18(4)), directories (s. 70), information matching programmes, the content of the PAIA manual, and sector laws such as the Consumer Protection Act, the Electronic Communications and Transactions Act and the National Credit Act. The notice is in English: give it in a language your audience understands."));
		/* Delivery */
		delivery.push(chk("V26", "check", "Make people aware of the section 18(1) information before you collect it from them, or, when you collect from other sources, before or as soon as reasonably practicable after (s. 18(2)). Telling them once covers later collection of the same kind of information for the same purpose (s. 18(3)). The exceptions in section 18(4) are narrow: document any you rely on."));
		delivery.push(chk("V27", "check", "Your PAIA manual (PAIA s. 51, as amended by POPIA) must also describe the purpose of the processing, the categories of data subjects and of their information, the recipients, planned transborder flows, and your information security measures in general terms; make it available on your website, at your principal place of business, to anyone on request against payment of a reasonable amount, and to the Regulator on request. Every private body needs one: the exemption for small private bodies lapsed at the end of 2021."));
		delivery.push(chk("V28", "check", "Let people object (Form 1) and ask for correction or deletion (Form 2), or use a substantially similar form, free of charge, reasonably accessible by hand, fax, post, email, SMS or WhatsApp, or in any manner convenient to them; record requests and objections made by telephone and give the recording on request; tell people in writing what you did with a correction or deletion request within 30 days (Regulations, regs 2, 3). Tell people of their right to object when you collect their information (reg 2.4)."));
		if (yes(s, "zaDm") && v(s, "zaDmElec") && v(s, "zaDmElec") !== "none") delivery.push(chk("V29", "check", "Ask for consent to electronic direct marketing only once, in writing on Form 4 or in a similar way that names the goods or services and the channel; record consent given by telephone or an automatic calling machine; opt-out is not consent (s. 69(2); Regulations, reg 6). Keep a list of people who refused consent or objected, and do not contact them (Guidance Note on Direct Marketing, 6.4, 7.3.5). The pre-emptive block register under the Consumer Protection Act does not replace POPIA consent."));
		if (rec.some(function (r) { return v(r, "role") === "processor"; })) delivery.push(chk("V30", "check", "Put a written contract in place with each operator that requires the section 19 security measures and immediate notice of a compromise (s. 21)."));
		delivery.push(chk("V31", "check", "If there are reasonable grounds to believe personal information was accessed or acquired by an unauthorised person, notify the Regulator and, unless their identity cannot be established, the people affected, in writing, as soon as you reasonably can after you discover the compromise, with the information section 22(5) lists (s. 22)."));
		if (rows.some(function (r) { return v(r, "basis") === "consent"; })) delivery.push(chk("V32", "check", "Before asking for consent to a transfer, tell people the recipient's country and the level of protection there (ss. 18(1)(g), 72(1)(b)); keep proof of the consent (s. 11(2)(a))."));
		return { checks: checks, delivery: delivery };
	}

	/* A privacy notice led by South Africa's POPIA. */
	function zaLead(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]";
		var title = (v(s, "ctrlName") ? v(s, "ctrlName") + " " : "") + "Privacy Notice";
		var acts = pnActs(s), cons = zaConsent(s), off = zaOffshore(s);
		var meta = [ctrl];
		if (v(s, "version")) meta.push("Version " + v(s, "version"));
		if (v(s, "effective")) meta.push("Effective " + fmtDate(v(s, "effective")));
		var num = {}, c = 4;
		num.share = c++; num.abroad = c++;
		if (yes(s, "zaKids")) num.kids = c++;
		if (yes(s, "zaDm")) num.dm = c++;
		if (yes(s, "zaAdm")) num.adm = c++;
		num.sec = c++;
		num.rights = c++; num.complaints = c++;
		if (inReg(s, "ca")) num.ca = c++;
		if (inReg(s, "us")) num.us = c++;
		num.changes = c++;
		var blocks = [{ k: "h1", x: title }, { k: "meta", x: meta.map(stop).join(" ") }];
		blocks.push({ k: "p", x: "This notice explains how " + ctrl + " processes personal information under the Protection of Personal Information Act 4 of 2013 (POPIA): what we collect and why, on what legal basis, where we get it, who we share it with, how we protect it, and the rights you have, including how to complain to the Information Regulator. " + ZA_JUR });
		var first = [];
		if (acts.length) first.push({ k: "p", x: "We process personal information for:" }, { k: "ul", items: acts.map(function (a) { return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: stop(v(a, "data") || "[personal information]") }; }) });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		if (off) first.push({ k: "p", x: "We are not domiciled in South Africa, and process personal information in " + jpTrim(v(s, "zaOffWhere") || "[the countries where you process it]") + ". Section " + num.abroad + " gives the details." });
		if (zaXrows(s).some(function (r) { return zaXfer(s, r); })) first.push({ k: "p", x: "We transfer personal information to third parties outside South Africa. Section " + num.abroad + " names them, with the level of protection there." });
		first.push({ k: "p", x: "You can ask for access to your personal information, ask us to correct or delete it, object to processing" + (cons ? ", withdraw your consent" : "") + ", and complain to the Information Regulator. Section " + num.rights + " explains your rights, section " + num.complaints + " complaints; section 1 gives our contact details." });
		if (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });
		if (num.us) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + num.us + " also applies to you." });
		blocks.push({ k: "box", title: "In short", blocks: first });

		blocks.push({ k: "h2", x: "1. Who we are and how to contact us" });
		Array.prototype.push.apply(blocks, zaContactBlocks(s));
		blocks.push({ k: "h2", x: "2. The personal information we process, and why" });
		Array.prototype.push.apply(blocks, zaPurposeBlocks(s));
		if (yes(s, "inferred")) blocks.push({ k: "p", x: "We also derive information about you from the information above: " + stop(v(s, "inferredWhat") || "[what is inferred, and from what]") });
		if (yes(s, "adm") && !yes(s, "zaAdm")) blocks.push({ k: "p", x: "We use automated systems to make decisions about people: " + stop(krLc(v(s, "admWhat") || "[the decisions and what they are based on]")) });
		else if (!yes(s, "adm") && yes(s, "profiling")) blocks.push({ k: "p", x: "We analyse information about you: " + stop(v(s, "profilingWhat") || "[the analysis and what it is used for]") });
		blocks.push({ k: "h2", x: "3. Where we get it" });
		Array.prototype.push.apply(blocks, zaSourceBlocks(s));
		blocks.push({ k: "h2", x: num.share + ". Who we share it with" });
		Array.prototype.push.apply(blocks, zaShareBlocks(s));
		blocks.push({ k: "h2", x: num.abroad + ". " + (off ? "Where we process it, and transfers outside South Africa" : "Transfers outside South Africa") });
		Array.prototype.push.apply(blocks, zaAbroadBlocks(s));
		if (num.kids) { blocks.push({ k: "h2", x: num.kids + ". Children" }); Array.prototype.push.apply(blocks, zaKidsBlocks(s)); }
		if (num.dm) { blocks.push({ k: "h2", x: num.dm + ". Direct marketing" }); Array.prototype.push.apply(blocks, zaDmBlocks(s)); }
		if (num.adm) { blocks.push({ k: "h2", x: num.adm + ". Automated decisions" }); Array.prototype.push.apply(blocks, zaAdmBlocks(s)); }
		blocks.push({ k: "h2", x: num.sec + ". How we protect it and how long we keep it" });
		Array.prototype.push.apply(blocks, zaSecBlocks(s));
		blocks.push(zaRetainBlock(s, "in section 2"));
		blocks.push({ k: "h2", x: num.rights + ". Your rights" });
		Array.prototype.push.apply(blocks, zaRightsBlocks(s, num.adm));
		blocks.push({ k: "h2", x: num.complaints + ". Complaints" });
		Array.prototype.push.apply(blocks, zaComplaintBlocks(s));

		var only = " Sections " + joinList([String(num.rights), String(num.complaints)]) + " apply to you only where POPIA applies to our processing of your personal information.";
		var caRes = null, usRes = null;
		if (num.ca) {
			blocks.push({ k: "h2", x: num.ca + ". Additional information for California residents" });
			blocks.push({ k: "p", x: "If you are a California resident, the California Consumer Privacy Act (CCPA) applies to your personal information. This section is our notice at collection and privacy policy for California residents. The rest of this notice describes our processing too, but your rights under the CCPA, and how to exercise them, are the ones set out here." +
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
		blocks.push({ k: "h2", x: num.changes + ". Changes to this notice" });
		if (yes(s, "further")) blocks.push({ k: "box", title: "Planned new use of your personal information", blocks: [
			{ k: "p", x: "From " + (fmtDate(v(s, "furtherStart")) || "[start date]") + " we intend to use personal information we already hold for a new purpose: " + stop(v(s, "furtherWhat") || "[new purpose]") +
				" Personal information used: " + stop(krLc(v(s, "furtherData") || "[the personal information]")) + (v(s, "furtherRetention") ? " How long we keep it for this purpose: " + stop(krLc(v(s, "furtherRetention"))) : "") },
			{ k: "p", x: zaFurtherTxt(s) }] });
		blocks.push({ k: "p", x: "This notice applies from " + (fmtDate(v(s, "effective")) || "[date]") + ". We use personal information for a new purpose only where it is compatible with the purpose we collected it for, or section 15(3) allows it, and we update this notice first (s. 15). When we change this notice, we publish the new version here with the date it applies from." });
		if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });

		var cr = zaChecks(s, true), checks = cr.checks, delivery = cr.delivery;
		checks.push(v(s, "consequences") ? chk("P21", "ok", "", undefined, "WP260 10, 36 (good practice)") : chk("P21", "warn", "Empty. Fine only if nothing here would surprise people.", undefined, "WP260 10, 36 (good practice)"));
		if (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }
		if (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(delivery, usRes.delivery); }
		var lintHits = lintText(blocks);
		checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "POPIA s. 18(1); WP260 13") :
			chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "POPIA s. 18(1); WP260 13"));
		var gp = [];
		if (pnSourceDirect(s)) gp.push(chk("D01", "check", "Give the notice before you collect the data: before a form is submitted, before payment, before sign-up.", "Timing: when the data is collected"));
		gp.push(chk("D03", "check", "Read it as a member of the audience would."));
		if (has(s, "channel", "web")) gp.push(chk("D05", "check", "Link it from every page, and from every form that collects personal information."));
		if (has(s, "channel", "app")) gp.push(chk("D06", "check", "Show it in the app store listing and keep it within two taps inside the app."));
		gp.push(chk("D07", "check", "Use the \"In short\" box as the first layer and keep it consistent with the full text."));
		gp.push(chk("D08", "check", "Keep the full notice available as one document."));
		gp.push(chk("D14", "check", "If you add icons, keep them alongside the text, never instead of it."));
		gp.forEach(function (r) { var m = D.MATRIX[r.id]; if (m) r.s = m.s.replace(/^Art\.[^;]*;\s*/, "") + " (good practice)"; });
		delivery = gp.concat(delivery);
		return { title: title, file: slug(ctrl + " Privacy Notice"), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(delivery), docLabel: "Notice" };
	}

	/* Form section for South Africa: everything except the per-purpose and transfer fields. */
	var ZA_SECTION = {
		title: "South Africa: Protection of Personal Information Act (POPIA)",
		show: zaOn,
		lead: "POPIA as in force on 13 November 2026, with the 2018 Regulations as amended in 2025, for private bodies. Give, per purpose above, the legal basis, special personal information, any law requiring collection, whether giving the information is voluntary and the consequences; the purpose and location of each recipient; and transfers outside South Africa under transfers.",
		fields: [
			{ id: "zaScope", type: "select", label: "How POPIA applies to you", opts: [
				{ v: "in", l: "We are domiciled in South Africa" },
				{ v: "means", l: "We are not domiciled in South Africa, but use automated or non-automated means in South Africa (not only to forward information through it)" }],
			  hint: "Section 3(1)(b)." },
			{ id: "zaOffWhere", type: "text", label: "The countries where you process the personal information", show: zaOffshore, ph: "for example Ireland and the United States" },
			{ id: "zaOffLevel", type: "area", rows: 2, label: "The level of protection the information has in those countries", show: zaOffshore,
			  ph: "for example the GDPR applies in Ireland; in the United States no general privacy law covers it", hint: "Section 18(1)(g): printed in the notice." },
			{ id: "zaIo", type: "text", label: "Information Officer: name (optional)",
			  hint: "For a private body, the head of the body (the chief executive officer or equivalent) or a person the head authorises (PAIA s. 1). Registered with the Regulator before taking up the duties (s. 55(2))." },
			{ id: "zaIoReg", type: "yesno", label: "Is your Information Officer registered with the Information Regulator?" },
			{ id: "zaDio", type: "text", label: "Deputy Information Officer(s) (optional)", hint: "Section 56; PAIA s. 17." },
			{ id: "zaIoEmail", type: "text", label: "Information Officer: email (optional)", hint: "Leave empty to use the organisation's email." },
			{ id: "zaIoPhone", type: "text", label: "Information Officer: telephone (optional)", hint: "Leave empty to use the organisation's telephone." },
			{ id: "zaPaia", type: "text", label: "Where your PAIA manual is available (optional)", ph: "for example www.example.co.za/paia-manual", hint: "PAIA s. 51: every private body needs one, with the POPIA information it lists." },
			{ id: "zaNoRecip", type: "yesno", label: "You listed no recipients. Confirm that you do not share personal information with anyone, not even operators",
			  show: function (s) { return !arr(s, "recipients").length; } },
			{ id: "zaKids", type: "yesno", label: "Do you process personal information of children (under 18)?", hint: "Sections 34, 35: prohibited unless section 35 allows it." },
			{ id: "zaKidsBasis", type: "select", label: "How section 35 allows it", show: function (s) { return yes(s, "zaKids"); }, opts: function () { return D.ZA_KIDS.map(function (x) { return { v: x.v, l: x.l }; }); } },
			{ id: "zaKidsHow", type: "text", label: function (s) { return v(s, "zaKidsBasis") === "auth" ? "The authorisation, with its Gazette notice" : "How a competent person gives consent, or other details (optional)"; }, show: function (s) { return yes(s, "zaKids"); },
			  ph: "for example a parent confirms by email before the account opens" },
			{ id: "zaDm", type: "yesno", label: "Do you use personal information for direct marketing?", hint: "Sections 11(3)(b), 69." },
			{ id: "zaDmElec", type: "select", label: "Direct marketing by electronic communication (email, SMS, messages, calls)", show: function (s) { return yes(s, "zaDm"); },
			  opts: function () { return D.ZA_DM.map(function (x) { return { v: x.v, l: x.l }; }); }, hint: "Section 69(1): consent, or customers for your own similar products or services. The Regulator treats phone calls and cookies as electronic communication." },
			{ id: "zaDmPost", type: "yesno", label: "Do you also market by post or in person?", show: function (s) { return yes(s, "zaDm"); } },
			{ id: "zaDmOut", type: "text", label: "How people stop direct marketing", show: function (s) { return yes(s, "zaDm"); }, ph: "for example use the unsubscribe link in each message, or reply STOP" },
			{ id: "zaAdm", type: "yesno", label: "Do you make decisions about people based solely on automated processing that builds a profile of them, with legal consequences or a substantial effect on them?",
			  hint: "Section 71(1): profiles of performance at work, creditworthiness, reliability, location, health, preferences or conduct." },
			{ id: "zaAdmWhy", type: "select", label: "How section 71(2) allows the decisions", show: function (s) { return yes(s, "zaAdm"); }, opts: function () { return D.ZA_ADM.map(function (x) { return { v: x.v, l: x.l }; }); } },
			{ id: "zaAdmLaw", type: "text", label: "The law or code of conduct", show: function (s) { return yes(s, "zaAdm") && v(s, "zaAdmWhy") === "law"; } },
			{ id: "zaAdmWhat", type: "text", label: "The decisions and what they are based on (optional)", show: function (s) { return yes(s, "zaAdm"); }, hint: "Leave empty to use your answer on automated decisions." },
			{ id: "zaAdmLogic", type: "area", rows: 2, label: "The underlying logic, in plain words (optional)", show: function (s) { return yes(s, "zaAdm") && v(s, "zaAdmWhy") === "contract_measures"; },
			  hint: "Section 71(3)(b). Leave empty to use your answer on the logic." },
			{ id: "zaSecurity", type: "area", rows: 2, label: "Your main security measures (optional)", hint: "Section 19." },
			{ id: "zaReqHow", type: "area", rows: 2, label: "How people make requests and objections (optional)", hint: "Sections 23, 24, 11(3). Leave empty to use how people exercise their rights (below), or the Information Officer's email or the organisation's address." },
			{ id: "zaFee", type: "yesno", label: "Do you charge a fee for giving access to a record?", hint: "Section 23(1)(b)(ii): only a prescribed fee, with a written estimate first (s. 23(3)). Confirming whether you hold information, and correction, are free." },
			{ id: "zaReqDays", type: "text", label: "Days within which you respond to access requests (optional)", ph: "30", hint: "Section 23(1)(b)(i): within a reasonable time." },
			{ id: "zaComplaint", type: "text", label: "How people complain to you (optional)", hint: "Leave empty to use the Information Officer's email or the organisation's address." },
			{ id: "zaCode", type: "yesno", label: "Does a code of conduct issued under POPIA apply to you?", hint: "Chapter 7. Issued codes include those for credit bureaus and the banking industry." },
			{ id: "zaCodeName", type: "text", label: "The code", show: function (s) { return yes(s, "zaCode"); } }
		]
	};
