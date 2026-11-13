	/* Australia (matrix Part U): the Privacy Act 1988 (Cth), Compilation No. 104 (compilation date 4 June 2026), read on the
	   Federal Register of Legislation on 13 November 2026, with the Australian Privacy Principles (Schedule 1) and APP 1.7 to
	   1.9 as inserted by the Privacy and Other Legislation Amendment Act 2024 (from 10 December 2026, for decisions made after
	   that date); the OAIC APP Guidelines, Chapters B (version 1.4), 1 (version 2.0, 30 September 2026), 5 (version 1.2) and
	   8 (version 1.3). No country or binding scheme is prescribed for APP 8.3 (Privacy Regulations 2025). Organisations
	   only: agencies are not modelled. Notes in build/au/notes.md. */
	function auOn(s) { return inReg(s, "au"); }
	/* Where a recipient is. "au" only when nothing but Australian places (the external Territories included: APP 8.1(a)),
	   Australian cloud regions and filler words is left; a four-digit postcode after a state, a territory or "Australia" lets
	   street and building words go too, never other places. A recognised foreign place makes it "abroad"; anything else makes it
	   "unknown" (fail closed). Multi-country regions (APAC, Oceania) and unnamed second sites (backups, disaster recovery,
	   failover) are left over (South Africa review of 13 November 2026, ZA01, ZA02, ZA04, applied here too). */
	var AU_AU = /\b(commonwealth of australia|australian capital territory|australian antarctic territory|western australia|south australia|australia|australian|new south wales|victoria|queensland|tasmania|northern territory|jervis bay( territory)?|christmas island|cocos( \(keeling\))? islands|norfolk island|heard island( and mcdonald islands)?|mcdonald islands|ashmore and cartier islands|coral sea islands|alice springs|sydney|north sydney|parramatta|macquarie park|chatswood|ultimo|homebush|eastern creek|silverwater|melbourne|docklands|southbank|port melbourne|tullamarine|brisbane|fortitude valley|perth|adelaide|canberra|hobart|darwin|gold coast|sunshine coast|newcastle|wollongong|geelong|townsville|cairns|toowoomba|ballarat|bendigo|launceston|mackay|rockhampton|albury|wodonga)\b|\u6fb3\u5927\u5229\u4e9a|\u6fb3\u6d32|\u30aa\u30fc\u30b9\u30c8\u30e9\u30ea\u30a2|\ud638\uc8fc/i;
	var AU_AU_G = new RegExp(AU_AU.source, "gi");
	var AU_CODE_G = /(^|[^A-Za-z])(AU|AUS|au|aus|NSW|VIC|QLD|TAS|ACT)(?=[^A-Za-z]|$)/g;
	/* Fillers that only count next to an Australian place: CBD, Western Sydney, Equinix SY3, NextDC M1. */
	var AU_FILL = /\b(capital|territory|cbd|western|eastern|northern|southern|greater|metro(politan)?|within|inside|wide|nationwide|onshore|only|equinix|nextdc|airtrunk|cdc|global switch|macquarie|(sy|me|pe|br|ca|ad)\d{1,2}|[smbpc]\d)\b/gi;
	/* An Australian postcode: four digits right after a state, a territory or "Australia" (AU02). */
	var AU_PC = /\b(nsw|vic|qld|sa|wa|tas|nt|act|new south wales|victoria|queensland|south australia|western australia|tasmania|northern territory|australian capital territory|australia)[,\s]+\d{4}(?!\d)/i;
	var AU_AMB_G = /(^|[^A-Za-z])(WA|SA|NT)(?=[^A-Za-z]|$)/g;
	var AU_REGION = /\b(ap-southeast-[24]|australia-southeast[12]|australia ?(east|southeast|central ?2?))\b|\basia pacific \((sydney|melbourne)\)/i;
	var AU_REGION_G = new RegExp(AU_REGION.source, "gi");
	var AU_NEUTRAL_G = /\b(asia[- ]pacific|apac|oceania)\b/gi;
	var AU_STREET_G = /\b\d+[a-z]?\s+(?:[a-z'-]+\s+){1,3}(street|st|road|rd|avenue|ave|drive|lane|crescent|boulevard|place|way|close|parade|terrace|highway)\b\.?/gi;
	var AU_BLDG_G = /\b(\d+(st|nd|rd|th)\s+floor|(floor|level|unit|suite|shop)\s+\d+[a-z]?|(p\.? ?o\.? ?box|gpo box|locked bag|private bag)\s+\d+|office park|business park|building)\b/gi;
	var AU_DR = /\b(backups?|back-ups?|backed up|dr|disaster recovery|fail-?over|replicas?|replicated|secondary|(the|a|public) cloud)\b/gi;
	var AU_DR_AU = new RegExp(AU_DR.source + "\\s+(in|at|on|to)\\s+(the\\s+)?(?=" + AU_AU.source + "|" + AU_REGION.source + ")", "gi");
	function auForeign(w) {
		var raw = String(w || "");
		if (/\b(outside|offshore from) australia\b|\b(overseas|offshore)\b/i.test(raw)) return true;
		var x = raw.replace(AU_REGION_G, " ").replace(AU_AU_G, " ").replace(AU_CODE_G, "$1 ");
		if (KR_REGION.test(x)) return true;
		x = x.replace(AU_NEUTRAL_G, " ");
		return jpForeign(x) || JP_JP.test(x) || KR_KR.test(x) || KR_FOR_H.test(x) || SG_SG.test(x) || new RegExp(SG_CODE_G.source).test(x) || SG_FOR.test(x) || SG_FOR_CODE.test(x) || (/[a-z]/.test(raw) && SG_FOR_CODE_LC.test(x));
	}
	function auNamesAu(w) { return AU_AU.test(w) || AU_REGION.test(w) || new RegExp(AU_CODE_G.source).test(w); }
	function auLeft(w) {
		var x = String(w).replace(AU_DR_AU, " ").replace(AU_DR, " drsite ");
		x = x.replace(AU_REGION_G, " ").replace(AU_AU_G, " ").replace(AU_CODE_G, "$1 ").replace(AU_AMB_G, "$1 ").replace(AU_FILL, " ");
		x = x.replace(SG_FILL, function (m) { return /^(IN|MY|ID)$/.test(m) ? m : " "; });
		return /[A-Za-z\u00c0-\uffff]/.test(x);
	}
	function auWhere(w) {
		w = String(w || "").trim();
		if (!w) return "";
		if (auForeign(w)) return "abroad";
		if (!auNamesAu(w)) return "unknown";
		return auLeft(AU_PC.test(w) ? w.replace(AU_STREET_G, " ").replace(AU_BLDG_G, " ") : w) ? "unknown" : "au";
	}
	function auXrows(s) { return yes(s, "auAbroad") ? arr(s, "auXrows") : []; }
	function auOffshore(s) { return v(s, "auScope") === "abroad"; }
	function auRecAbroad(s) { return arr(s, "recipients").filter(function (r) { return auWhere(v(r, "where")) === "abroad"; }); }
	function auRecUnknown(s) { return arr(s, "recipients").filter(function (r) { var w = auWhere(v(r, "where")); return w === "unknown" || w === ""; }); }
	function auNoWhere(s) { return arr(s, "recipients").filter(function (r) { return !String(v(r, "where") || "").trim(); }); }
	function auRowRec(s, r) { return arr(s, "recipients").filter(function (x) { return jpSame(v(x, "who"), v(r, "recipient")); })[0]; }
	/* "Own offices or systems" holds only for the organisation itself: a related body corporate is an overseas recipient (APP Guidelines 8.6). */
	function auOwnOk(s, r) {
		var n = jpKey(v(r, "recipient")), c = jpKey(v(s, "ctrlName"));
		if (!n || !c) return false;
		var rest = n === c ? "" : n.indexOf(c + " ") === 0 ? n.slice(c.length) : null;
		if (rest === null || /\S/.test(rest.replace(/\b(our|own|the|in|at|and|branch|branches|office|offices|systems?|servers?|data|centres?|centers?|sites?|regional|local)\b/g, " "))) return false;
		return !arr(s, "recipients").some(function (x) { return jpSame(v(x, "who"), v(r, "recipient")) && !!v(x, "role"); });
	}
	/* A row is a disclosure unless it is storage only or the organisation's own offices or systems (APP Guidelines 8.6, 8.14). */
	function auDiscRow(s, r) { var b = v(r, "basis"); return b !== "storage" && !(b === "own" && auOwnOk(s, r)); }
	/* Overseas rows whose recipient is not in the recipients list (APP 1.4(c), 5.2(f)); valid own offices excluded. */
	function auUnlisted(s) {
		return auXrows(s).filter(function (r) { return !!v(r, "recipient") && !(v(r, "basis") === "own" && auOwnOk(s, r)) && !arr(s, "recipients").some(function (x) { return jpSame(v(x, "who"), v(r, "recipient")); }); });
	}
	function auStoreRec(s, x) { return auXrows(s).some(function (r) { return v(r, "basis") === "storage" && jpSame(v(x, "who"), v(r, "recipient")); }); }
	/* A small business operator with no exception: the APPs do not bind it (ss. 6C, 6D), so the policy is voluntary. */
	function auVol(s) { return v(s, "auSb") === "under" && v(s, "auSbWhy") === "none"; }
	/* "the" before the name of an Act, regulations, rules or a code. */
	function auThe(x) { x = jpTrim(x); return /^[A-Z]/.test(x) && !/^The /.test(x) && /\b(Act|Regulations?|Rules?|Code|Ordinance)( \d{4})?\b/.test(x) ? "the " + x : x; }
	/* An email or postal address: the OAIC expects complaints in writing first (APP Guidelines 1.28). */
	function auWritable(c) { c = String(c || ""); return /@/.test(c) || /\b(po box|gpo box|locked bag|street|st|road|rd|avenue|ave|level|suite|unit|write|post|letter|form)\b/i.test(c); }
	/* Direct marketing purposes: the Singapore list plus common Australian wording (AU19). */
	function auMkt(a) { return sgMkt(a) || /\b(telling you about|updates? (about|on)|news(letters?)?|new (products?|courses?|services?|offers?)|special offers?|promotions?|events)\b/i.test(v(a, "purpose")); }

	/* Sensitive information (s. 6(1)): how APP 3.3 or 3.4 allows collecting it, per purpose. */
	function auSensOf(a) { var x = v(a, "auSens"); return x && x !== "none" ? x : ""; }
	function auSensActs(s) { return pnActs(s).filter(function (a) { return !!auSensOf(a); }); }
	function auConsent(s) {
		return pnActs(s).some(function (a) { return v(a, "auSens") === "consent"; }) || auXrows(s).some(function (r) { return v(r, "basis") === "consent"; }) ||
			(yes(s, "further") && v(s, "auFurther") === "consent");
	}
	function auConseqOf(a) { return v(a, "auConseq") || v(a, "consequence"); }

	/* The privacy contact (APP 5.2(a); APP Guidelines 1.23, 5.9): a position title, with the organisation's details as fallback. */
	function auPoTitle(s) { return jpTrim(v(s, "auPo") || "Privacy Officer"); }
	function auEmail(s) { return v(s, "auPoEmail") || v(s, "ctrlEmail"); }
	function auPhone(s) { return v(s, "auPoPhone") || v(s, "ctrlPhone"); }
	function auPost(s) { return String(v(s, "auPoPost") || v(s, "ctrlAddress") || "").replace(/\s*\n+\s*/g, ", "); }
	function auContactLine(s) { var l = [auEmail(s), auPhone(s), auPost(s)].filter(Boolean).map(jpTrim); return l.length ? l.join("; ") : "[email address or postal address]"; }
	function auWritten(s) { return auEmail(s) ? "email our " + auPoTitle(s) + " at " + jpTrim(auEmail(s)) : auPost(s) ? "write to our " + auPoTitle(s) + " at " + jpTrim(auPost(s)) : ""; }
	function auReqWay(s) { return v(s, "auReqHow") || v(s, "rightsContact") || auWritten(s); }
	function auComplaintWay(s) { return v(s, "auComplaint") || auWritten(s); }
	function auWithdrawWay(s) { return v(s, "withdrawHow") || v(s, "rightsContact") || auWritten(s); }
	function auRet(a) { return v(a, "retention") || "Until we no longer need it for any purpose the Privacy Act allows, unless the law requires us to keep it"; }
	function auDaysTxt(s) { var n = parseInt(v(s, "auReqDays"), 10); return n > 0 && n < 366 ? ", and within " + n + " days" : ""; }

	/* Permitted general situations (s. 16A, items 1 to 5 apply to organisations; APP 8.2(d) excludes items 4 and 5). */
	var AU_PGS_T = {
		"1": "we reasonably believe it is necessary to lessen or prevent a serious threat to life, health or safety, or to public health or safety, and getting consent is unreasonable or impracticable",
		"2": "we have reason to suspect unlawful activity or serious misconduct relating to our functions or activities, and reasonably believe it is necessary to take appropriate action",
		"3": "we reasonably believe it is reasonably necessary to help locate a person reported as missing, under the Commissioner's rules",
		"4": "it is reasonably necessary to establish, exercise or defend a legal or equitable claim",
		"5": "it is reasonably necessary for a confidential alternative dispute resolution process" };
	function auSensTxt(a) {
		var x = v(a, "auSens");
		return x === "consent" ? "with your consent (APP 3.3(a))." :
			x === "law" ? "because an Australian law or a court or tribunal order requires or authorises it: " + jpRef(auThe(v(a, "auSensLaw") || "[the law or order]"), "APP 3.4(a)") :
			x === "pgs" ? "we collect it without your consent only where a permitted general situation exists, that is where " + (AU_PGS_T[v(a, "auSensPgs")] || "[the situation in section 16A]") + " (APP 3.4(b); Privacy Act, s. 16A)." :
			x === "phs" ? "because a permitted health situation exists: " + jpRef(krLc(v(a, "auSensPhs") || "[the situation in section 16B]"), "APP 3.4(c); Privacy Act, s. 16B") :
			x === "nonprofit" ? "because we are a non-profit organisation, and it relates to our activities and only to our members or people in regular contact with us in connection with those activities (APP 3.4(e))." :
			"[how APP 3.3 or 3.4 allows collecting it].";
	}

	/* APP 1.4(a), (c); APP 5.2(c), (d), (e): kinds of personal information, purposes, laws and consequences. */
	function auPurposeBlocks(s) {
		var acts = pnActs(s);
		if (!acts.length) return [{ k: "p", x: "[Add the purposes for which you collect, hold, use and disclose personal information.]" }];
		var b = [{ k: "p", x: "We collect, hold, use and disclose personal information for these purposes:" },
			{ k: "table", head: ["Purpose", "Personal information", "How long we keep it"], rows: acts.map(function (a) {
				return [jpTrim(v(a, "purpose") || "[purpose]"), v(a, "data") || "[personal information]", auRet(a)]; }) },
			{ k: "p", x: "We use and disclose personal information for the purpose we collected it for. We use or disclose it for another purpose only with your consent, or where the Privacy Act allows it: where you would reasonably expect it and the purpose is related (directly related, for sensitive information), where an Australian law or a court or tribunal order requires or authorises it, or in the other situations APP 6.2 sets out." }];
		var sens = auSensActs(s);
		if (sens.length) b.push({ k: "p", x: "Sensitive information, such as health information, has extra protection under the Privacy Act. We collect it only where it is reasonably necessary for the purpose, and:" },
			{ k: "ul", items: sens.map(function (a) { return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: auSensTxt(a) }; }) });
		var law = acts.filter(function (a) { var l = v(a, "auLaw"); return l === "required" || l === "authorised"; });
		if (law.length) b.push({ k: "p", x: "An Australian law or a court or tribunal order requires or authorises us to collect personal information for these purposes:" },
			{ k: "ul", items: law.map(function (a) { return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: (v(a, "auLaw") === "required" ? "required by " : "authorised by ") + jpDot(auThe(v(a, "auLawName") || "[the law, or the details of the order]")) }; }) });
		var cq = pnSourceDirect(s) ? acts.filter(function (a) { return !!auConseqOf(a); }) : [];
		if (cq.length) b.push({ k: "p", x: "If you do not give us the personal information we ask for:" },
			{ k: "ul", items: cq.map(function (a) { return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: stop(auConseqOf(a)) }; }) });
		return b;
	}
	/* APP 1.4(b), 5.2(b); APP 2. */
	function auCollectBlocks(s) {
		var b = [], src = arr(s, "sources"), how = v(s, "auCollect"), an = v(s, "auAnon"), aw = v(s, "auAnonWhat");
		b.push({ k: "p", x: how ? "How we collect it: " + jpDot(krLc(how)) : !v(s, "source") ? "[Say whether you collect personal information from people directly, from others, or both (APP 1.4(b)).]" :
			pnSourceIndirect(s) && !pnSourceDirect(s) ? "We collect personal information from other organisations and people, not from you directly." :
			pnSourceIndirect(s) ? "We collect personal information from you, and from other organisations and people." : "We collect personal information from you directly." });
		if (pnSourceIndirect(s)) {
			if (src.length) b.push({ k: "p", x: "We collect personal information about you from these sources:" },
				{ k: "ul", items: src.map(function (x) { return { b: jpTrim(v(x, "name") || "[source]") + ":", x: stop(v(x, "what") || "[the personal information obtained]") }; }) });
			else b.push({ k: "p", x: "[Name the sources you collect personal information from, or their types (APP 5.2(b)).]" });
		}
		b.push({ k: "p", x: "How we hold it: " + jpDot(krLc(v(s, "auHold") || "[how you hold personal information, for example in electronic records on cloud systems and in paper files at our offices]")) });
		if (an === "yes") b.push({ k: "p", x: "You can deal with us without identifying yourself, or by using a pseudonym" + (aw ? ": " + jpRef(krLc(aw), "APP 2") : ", unless an Australian law or a court or tribunal order requires or authorises us to deal with identified people, or it is impracticable (APP 2).") });
		else if (an === "law") b.push({ k: "p", x: "We need you to identify yourself, because an Australian law or a court or tribunal order requires or authorises us to deal with people who have identified themselves" + (aw ? ": " + jpRef(krLc(aw), "APP 2.2(a)") : " (APP 2.2(a)).") });
		else if (an === "impr") b.push({ k: "p", x: "We need you to identify yourself, because it is impracticable for us to deal with people who have not identified themselves" + (aw ? ": " + jpRef(krLc(aw), "APP 2.2(b)") : " (APP 2.2(b)).") });
		return b;
	}
	/* APP 1.7 to 1.9 (from 10 December 2026). */
	function auAdmBlocks(s) {
		var it = [{ b: "Kinds of personal information used:", x: stop(v(s, "auAdmData") || "[the kinds of personal information the programs use]") }];
		if (v(s, "auAdmSole")) it.push({ b: "Kinds of decisions made solely by a computer program:", x: stop(v(s, "auAdmSole")) });
		if (v(s, "auAdmPart")) it.push({ b: "Kinds of decisions where a computer program does a thing substantially and directly related to making them:", x: stop(v(s, "auAdmPart")) });
		if (!v(s, "auAdmSole") && !v(s, "auAdmPart")) it.push({ b: "Kinds of decisions:", x: "[the kinds of decisions made solely by a computer program, and the kinds where a program does a thing substantially and directly related to making them]" });
		var eff = v(s, "effective");
		return [{ k: "p", x: "We use computer programs, with personal information, to make decisions, or to do things substantially and directly related to making decisions, that could reasonably be expected to significantly affect people's rights or interests (" + (eff && eff >= "2026-12-10" ? "APP 1.7, 1.8" : "APP 1.7 and 1.8, from 10 December 2026") + "):" },
			{ k: "ul", items: it },
			{ k: "p", x: "You can ask us about these decisions, or complain about one, using the contact details in this policy." }];
	}
	/* APP 1.4(c), 5.2(f): usual disclosures. */
	function auShareBlocks(s) {
		var rec = arr(s, "recipients"), un = auUnlisted(s), b = [];
		var item = function (r) { return { b: jpTrim(v(r, "who") || "[recipient]") + ":", x: stop(v(r, "why") || "[what for]") + (v(r, "where") ? " Located in " + jpDot(v(r, "where")) : "") }; };
		var unP = un.length ? { k: "p", x: "[Add " + joinList(un.map(function (r) { return jpTrim(v(r, "recipient")); })) + " to the recipients, with what " + (un.length > 1 ? "they do" : "it does") + " with the information.]" } : null;
		if (!rec.length) {
			b.push(unP ? unP : yes(s, "auNoRecip") ? { k: "p", x: "We do not disclose personal information to other organisations or people, and no service provider handles it for us." } :
				{ k: "p", x: "[List the organisations and people you usually disclose personal information to, including service providers, or confirm in the Australia section that there are none.]" });
			return b;
		}
		var disc = rec.filter(function (r) { return !auStoreRec(s, r); }), st = rec.filter(function (r) { return auStoreRec(s, r); });
		if (disc.length) b.push({ k: "p", x: "We usually disclose personal information to these organisations, or types of organisations, for the purposes shown:" }, { k: "ul", items: disc.map(item) });
		if (st.length) b.push({ k: "p", x: "These service providers only store personal information for us, under contracts that limit them to storing and protecting it, and we keep effective control of it:" }, { k: "ul", items: st.map(item) });
		if (unP) b.push(unP);
		return b;
	}
	/* APP 1.4(f), (g), 5.2(i), (j); APP 8; s. 16C. */
	function auXbasis(s, r) {
		var ba = v(r, "basis"), pg = v(r, "pgs");
		return ba === "steps" ? "before disclosing it, we take reasonable steps, such as binding contract terms, so that the recipient does not breach the Australian Privacy Principles, and we remain accountable for how it handles the information (APP 8.1; Privacy Act, s. 16C)." :
			ba === "similar" ? "we reasonably believe the recipient is bound by a law or binding scheme that protects the information in a way substantially similar to the Australian Privacy Principles, and that you can enforce: " + jpRef(v(r, "lawName") || "[the law or binding scheme]", "APP 8.2(a)") :
			ba === "prescribed" ? "[No country or binding scheme is prescribed by the regulations for APP 8.3 yet: choose another basis.]" :
			ba === "consent" ? "we rely on your consent, given after we told you expressly that if you consent, APP 8.1 will not apply: we will not be accountable under the Privacy Act for how the recipient handles the information, and you will not be able to seek redress under the Act (APP 8.2(b)). You can withdraw that consent." :
			ba === "law" ? "an Australian law, or a court or tribunal order, requires or authorises the disclosure: " + jpRef(auThe(v(r, "lawName") || "[the law or order]"), "APP 8.2(c)") :
			ba === "pgs" ? "we disclose it only where a permitted general situation exists, that is where " + (["1", "2", "3"].indexOf(pg) !== -1 ? AU_PGS_T[pg] : "[the situation: item 1, 2 or 3 of section 16A]") + " (APP 8.2(d); Privacy Act, s. 16A)." :
			ba === "storage" ? "a service provider only stores the information for us, under a contract that limits it to storing and protecting it, and we keep effective control of it; this is a use, not a disclosure (APP Guidelines 8.14)." :
			ba === "own" ? (auOwnOk(s, r) ? "it stays within our own organisation, on our own systems or at our own offices there; this is not a disclosure." :
				"[" + jpTrim(v(r, "recipient") || "This recipient") + " is not our own organisation: choose another basis.]") :
			"[how APP 8 is met for this recipient].";
	}
	function auAbroadBlocks(s) {
		var b = [], off = auOffshore(s), ab = auRecAbroad(s), unk = auRecUnknown(s), rows = auXrows(s);
		if (off) b.push({ k: "p", x: "We are based outside Australia, and hold and process personal information in " + jpTrim(v(s, "auOffWhere") || "[the countries where you hold and process it]") + "." });
		if (no(s, "auAbroad")) {
			if (ab.length) b.push({ k: "p", x: "[" + sgNamesAt(ab) + (ab.length > 1 ? " are" : " is") + " outside Australia. Answer Yes under overseas recipients and add " + (ab.length > 1 ? "them" : "it") + ".]" });
			else if (unk.length) b.push({ k: "p", x: "[Check where " + sgNamesAt(unk) + (unk.length > 1 ? " are" : " is") + " located. If outside Australia, answer Yes under overseas recipients and add " + (unk.length > 1 ? "them" : "it") + ".]" });
			else b.push({ k: "p", x: "We are not likely to disclose personal information to recipients outside Australia." });
			return b;
		}
		if (!yes(s, "auAbroad")) { b.push({ k: "p", x: "[Say whether personal information goes to recipients outside Australia.]" }); return b; }
		if (!rows.length) { b.push({ k: "p", x: "[Add each overseas recipient, with its country.]" }); return b; }
		var disc = rows.filter(function (r) { return auDiscRow(s, r); }), held = rows.filter(function (r) { return !auDiscRow(s, r); }), cs = [];
		disc.forEach(function (r) { var c = jpTrim(v(r, "country") || ""); if (c && auWhere(c) !== "au" && !cs.some(function (x) { return x.toLowerCase() === c.toLowerCase(); })) cs.push(c); });
		var row = function (r) { return { b: jpTrim(v(r, "recipient") || "[recipient]") + " (" + jpTrim(v(r, "country") || "[country]") + "):",
			x: auWhere(v(r, "country")) === "au" ? "[This row names Australia: list only recipients outside Australia.]" : auXbasis(s, r) }; };
		if (disc.length) b.push({ k: "p", x: "We are likely to disclose personal information to recipients in " + (cs.length ? joinList(cs.map(country)) : "[the countries]") + ", as follows:" }, { k: "ul", items: disc.map(row) });
		else b.push({ k: "p", x: "We are not likely to disclose personal information to recipients outside Australia." });
		if (held.length) b.push({ k: "p", x: "We also hold personal information outside Australia without disclosing it:" }, { k: "ul", items: held.map(row) });
		var inRows = function (r) { return rows.some(function (x) { return jpSame(v(x, "recipient"), v(r, "who")); }); };
		var miss = ab.filter(function (r) { return !inRows(r); });
		if (miss.length) b.push({ k: "p", x: "[Add " + sgNamesAt(miss) + " to the overseas recipients, or correct " + (miss.length > 1 ? "their locations" : "its location") + ".]" });
		var unkMiss = unk.filter(function (r) { return !inRows(r); });
		if (unkMiss.length) b.push({ k: "p", x: "[Check where " + sgNamesAt(unkMiss) + (unkMiss.length > 1 ? " are" : " is") + " located. If outside Australia, add " + (unkMiss.length > 1 ? "them" : "it") + " to the overseas recipients.]" });
		return b;
	}
	function auDmBlocks(s) {
		var oth = yes(s, "auDmOthers");
		return [{ k: "p", x: "We use personal information to send you direct marketing" + (oth ? ", and to help other organisations with their direct marketing" : "") + ". You can ask us at any time, free of charge, not to send you direct marketing" +
			(oth ? ", and not to use or disclose your information for other organisations' direct marketing" : "") + "; we act on your request within a reasonable period. How: " + jpDot(krLc(v(s, "auDmOut") || "[how to opt out, for example the unsubscribe link in each email]")) +
			" You can also ask us where we got your information, and we tell you within a reasonable period, unless that is impracticable or unreasonable (APP 7.6, 7.7)." }];
	}
	function auSecBlock(s) {
		return { k: "p", x: "We take reasonable steps, technical and organisational, to protect personal information from misuse, interference and loss, and from unauthorised access, modification or disclosure (APP 11.1, 11.3)" +
			(v(s, "auSecurity") ? ": " + stop(krLc(v(s, "auSecurity"))) : ".") };
	}
	function auRetainBlock(s, where) {
		return { k: "p", x: "When we no longer need personal information for any purpose the Privacy Act allows, we take reasonable steps to destroy it or de-identify it, unless an Australian law or a court or tribunal order requires us to keep it (APP 11.2). The periods are shown " + where + "." };
	}
	function auWithdrawBlock(s) {
		var how = auWithdrawWay(s);
		return { k: "p", x: "Where we rely on your consent, you can withdraw it at any time: " + (how ? jpDot(krLc(how)) : "[how to withdraw consent].") +
			" We then stop relying on it for any future use or disclosure, and tell you what follows, for example if we can no longer provide a service (APP Guidelines B.54)." };
	}
	function auKidsBlocks(s) {
		var b = [{ k: "p", x: "We decide case by case whether a person under 18 has the capacity to consent. Where that is not practicable, we treat people aged 15 or over as able to consent unless something suggests otherwise, and ask a parent or guardian to consent for people under 15 (APP Guidelines B.59 to B.61)." }];
		if (v(s, "auKidsHow")) b.push({ k: "p", x: "How we ask a parent or guardian: " + jpDot(krLc(v(s, "auKidsHow"))) });
		return b;
	}
	/* APP 12, 13. */
	function auRightsBlocks(s) {
		var fee = yes(s, "publicBody") && v(s, "auFee") ? "No" : v(s, "auFee"), way = auReqWay(s);
		return [{ k: "ul", items: [
			{ b: "Access (APP 12).", x: "You can ask for access to the personal information we hold about you. We give it in the way you ask for, where that is reasonable and practicable. " +
				(fee === "Yes" ? "We charge for giving access; the charge is not excessive, and there is no charge for making the request (APP 12.8)." : fee === "No" ? "We do not charge for access." : "[Say whether you charge for giving access.]") },
			{ b: "Correction (APP 13).", x: "You can ask us to correct personal information that is inaccurate, out of date, incomplete, irrelevant or misleading. When we correct it, we tell other organisations bound by the Privacy Act that we disclosed it to, if you ask, unless that is impracticable or unlawful. If we do not correct it, you can ask us to attach a statement that you consider it inaccurate, out of date, incomplete, irrelevant or misleading. There is no charge for asking, for the correction or for the statement." }] },
			{ k: "p", x: "Make requests as follows: " + (way ? jpDot(krLc(way)) : "[where to send requests].") + " We respond within a reasonable period" + auDaysTxt(s) + " (APP 12.4, 13.5)." +
				" If we refuse, we tell you in writing why, unless that would be unreasonable, and how to complain (APP 12.9, 13.3). We can refuse access only on the grounds the Act sets out, for example where giving access would have an unreasonable impact on other people's privacy (APP 12.3)." }];
	}
	/* APP 1.4(e); s. 40(1A). */
	function auComplaintBlocks(s) {
		var how = auComplaintWay(s), b = [], code = yes(s, "auCode") ? (v(s, "auCodeName") ? "the " + jpTrim(v(s, "auCodeName")).replace(/^the /i, "") : "[the registered APP code]") : "";
		b.push({ k: "p", x: "If you think we have breached the Australian Privacy Principles" + (code ? " or " + code + ", a registered APP code that binds us" : "") + ", complain to us first" + (!how || auWritable(how) ? ", in writing: " : ": ") + (how ? jpDot(krLc(how)) : "[how to make a complaint].") +
			" How we deal with complaints: " + jpDot(krLc(v(s, "auComplaintHow") || "[how you deal with complaints, and in what time]")) });
		if (yes(s, "auEdr")) b.push({ k: "p", x: "If you are not satisfied with our response, you can complain to " + jpTrim(v(s, "auEdrName") || "[the recognised external dispute resolution scheme]") + ", a recognised external dispute resolution scheme we are a member of." });
		if (!auVol(s)) b.push({ k: "p", x: (yes(s, "auEdr") ? "You can also complain" : "You can complain") + " to the Office of the Australian Information Commissioner (OAIC) if you are not satisfied with our response, or we do not respond within a reasonable time (usually 30 days): www.oaic.gov.au, telephone 1300 363 992. The OAIC generally expects you to complain to us first (Privacy Act, s. 40(1A))." });
		return b;
	}
	function auContactBlocks(s) {
		var it = [{ b: "Privacy contact:", x: auPoTitle(s) }];
		if (auEmail(s)) it.push({ b: "Email:", x: jpTrim(auEmail(s)) });
		if (auPhone(s)) it.push({ b: "Telephone:", x: jpTrim(auPhone(s)) });
		if (auPost(s)) it.push({ b: "Post:", x: jpTrim(auPost(s)) });
		if (!auEmail(s) && !auPost(s)) it.push({ b: "Email or post:", x: "[an email address or postal address]" });
		return [{ k: "p", x: (v(s, "ctrlName") ? jpTrim(v(s, "ctrlName")) : "[Organisation]") + " is responsible for the personal information described here. Contact our " + auPoTitle(s) + " with questions, requests and complaints about privacy:" },
			{ k: "ul", items: it }];
	}
	function auFurtherTxt(s) {
		var f = v(s, "auFurther");
		return f === "consent" ? "We will ask for your consent first (APP 6.1(a))." :
			f === "related" ? "You would reasonably expect it, and the new purpose is related to the purpose we collected the information for, or directly related for sensitive information (APP 6.2(a))." :
			f === "law" ? "An Australian law or a court or tribunal order requires or authorises it: " + jpRef(auThe(v(s, "auFurtherLaw") || "[the law or order]"), "APP 6.2(b)") :
			f === "pgs" ? "We will use or disclose it for that purpose without your consent only where a permitted general situation exists, that is where " + (AU_PGS_T[v(s, "auFurtherPgs")] || "[the situation in section 16A]") + " (APP 6.2(c); Privacy Act, s. 16A)." :
			"[Say whether you will ask for consent, or rely on the reasonable expectation of a related purpose, a law, or a permitted general situation (APP 6).]";
	}

	function auHead(s) { return "Additional information under Australia's Privacy Act"; }
	function auPointer(s, n) {
		return (auVol(s) ? "Section " + n + " sets out how we handle personal information under the Australian Privacy Principles, which we follow voluntarily." :
			"For our handling of personal information under Australia's Privacy Act 1988, section " + n + " also applies.") + " Our privacy contact: " + auPoTitle(s) + ", " + jpDot(auContactLine(s));
	}
	var AU_VOL = "We are a small business operator under the Privacy Act 1988 (ss. 6C, 6D), so the Australian Privacy Principles (APPs) do not bind us. We follow them voluntarily, as this policy describes.";
	var AU_EMP = "Our handling of employee records directly related to your current or former employment with us is exempt from the Australian Privacy Principles (Privacy Act, s. 7B(3)). We describe it in this policy for transparency, but the access, correction and complaint routes below apply only to the other personal information we hold about you.";
	/* The Australia section of a notice led by another law. The Act extends to an organisation with an Australian link,
	   wherever it acts (s. 5B(1A), (3)), so the section is framed by the organisation's handling, not by where people are. */
	function auSection(s, secs, lawName) {
		var b = [], H = function (t) { b.push({ k: "h3", x: t }); };
		var other = secs.filter(Boolean).map(String), cons = auConsent(s);
		b.push({ k: "p", x: (auVol(s) ? AU_VOL.replace("as this policy describes", "as this section describes") : "The Privacy Act 1988 and the Australian Privacy Principles (APPs) apply to our handling of personal information, and this section is our privacy policy under them. The choices and rights in this section are those this law gives you.") +
			(v(s, "audience") === "employee" ? " " + AU_EMP.replace("in this policy", "in this section") : "") +
			(other.length ? " " + (other.length > 1 ? "Sections " : "Section ") + joinList(other) + (other.length > 1 ? " apply" : " applies") + " to you only where " + lawName + " applies to our processing of your data." : "") });
		H("Contact");
		Array.prototype.push.apply(b, auContactBlocks(s));
		H("Personal information and purposes");
		Array.prototype.push.apply(b, auPurposeBlocks(s));
		H("How we collect and hold it");
		Array.prototype.push.apply(b, auCollectBlocks(s));
		if (yes(s, "auAdm")) { H("Automated decisions"); Array.prototype.push.apply(b, auAdmBlocks(s)); }
		H("Who we disclose it to");
		Array.prototype.push.apply(b, auShareBlocks(s));
		H(auOffshore(s) ? "Where we hold it, and overseas recipients" : "Overseas recipients");
		Array.prototype.push.apply(b, auAbroadBlocks(s));
		if (yes(s, "auDm")) { H("Direct marketing"); Array.prototype.push.apply(b, auDmBlocks(s)); }
		H("Protection and retention");
		b.push(auSecBlock(s), auRetainBlock(s, "in the table above"));
		if (cons) { H("Withdrawing consent"); b.push(auWithdrawBlock(s)); }
		if (yes(s, "auKids") && cons) { H("Children"); Array.prototype.push.apply(b, auKidsBlocks(s)); }
		H("Access and correction");
		Array.prototype.push.apply(b, auRightsBlocks(s));
		H("Complaints");
		Array.prototype.push.apply(b, auComplaintBlocks(s));
		if (yes(s, "further")) b.push({ k: "p", x: "For the planned new use described in this notice: " + lcFirst(auFurtherTxt(s)) });
		return b;
	}

	/* Part U rows. led: Australia sets the main text. */
	function auChecks(s, led) {
		var checks = [], delivery = [], acts = pnActs(s), off = auOffshore(s), cons = auConsent(s), rec = arr(s, "recipients");
		var pl = sgPl;
		var nm = function (list, key) { return joinList(list.map(function (r) { return jpTrim(v(r, key || "who") || "[recipient]"); })); };
		var pick = function (id, m, w, c, okNote, naNote) { return m.length ? chk(id, "missing", m.concat(w, c).join(" ")) : w.length ? chk(id, "warn", w.concat(c).join(" ")) : c.length ? chk(id, "check", c.join(" ")) : naNote ? chk(id, "na", naNote) : chk(id, "ok", okNote || ""); };
		var eff = v(s, "effective"), after = !!eff && eff >= "2026-12-10";
		if (led) { var m1 = []; if (!v(s, "ctrlName")) m1.push("Add the organisation's name."); if (!v(s, "effective")) m1.push("Give the date this policy applies from (needed for the policy text; the policy must be kept up to date, APP 1.3).");
			checks.push(m1.length ? chk("U01", "missing", m1.join(" ")) : chk("U01", "ok", "The organisation's name and the date the policy applies from.")); }
		/* U02: how the Act applies */
		var m2 = [], w2 = [], c2 = [], sb = v(s, "auSb"), why = v(s, "auSbWhy");
		if (!v(s, "auScope")) m2.push("Say whether you are in Australia, or carry on business in Australia from abroad (Privacy Act, s. 5B).");
		if (off && !v(s, "auOffWhere")) m2.push("Name the countries where you hold and process the personal information: the policy prints them.");
		if (off) c2.push("The Act extends to the acts and practices, in Australia and abroad, of an organisation that carries on business in Australia (s. 5B(1A), (3)).");
		if (yes(s, "publicBody")) w2.push("This generator models organisations. Australian Government agencies have the same APP 1 duties but other rules too: access within 30 days and free of charge (APP 12.4, 12.7), the Information Publication Scheme and the Australian Government Agencies Privacy Code. Check them. A State or Territory authority is not an organisation under the Act (s. 6C(1)): its own State or Territory law applies.");
		if (!sb) m2.push("Say whether your annual turnover for the previous financial year was more than $3,000,000 (s. 6D).");
		else if (sb === "under") {
			if (!why) m2.push("Say whether one of the exceptions in s. 6D(4) or (9), s. 6E or s. 6EA applies to you: otherwise the APPs do not bind you as a small business operator (s. 6C).");
			else if (why === "none") w2.push("As a small business operator, the APPs do not bind you (ss. 6C, 6D) unless an exception applies: a turnover over $3,000,000 in an earlier year since you started the business, a health service holding health information, disclosing or paying to collect personal information for a benefit, a Commonwealth contract, a credit reporting body, a related body corporate of a larger business (s. 6D(4), (9)), an AML/CTF reporting entity and others treated as organisations (s. 6E), or a registered choice to opt in (s. 6EA). The policy says that you follow the APPs voluntarily, and gives no complaint route to the OAIC; to be bound by them, opt in under s. 6EA.");
			else if (why === "aml") c2.push("As an AML/CTF reporting entity, the Act applies to your activities relating to the AML/CTF Act as if you were an organisation (s. 6E(1A)); outside those activities the small business exemption still applies. The policy is written for everything you do; narrow it if you rely on the exemption for the rest.");
			else if (why === "optin") c2.push("Your choice to be treated as an organisation must be registered by the Commissioner, and stays in force until you revoke it (s. 6EA).");
			else if (why === "cth") c2.push("As a small business operator that is a contracted service provider, your acts not done for the purposes of a Commonwealth contract are exempt (s. 7B(2)). The policy covers everything you do: narrow it, or keep it as a voluntary policy for the rest.");
			else if (why === "other6e") c2.push("Section 6E applies the Act to a protected action ballot agent only for the ballot (s. 6E(1B)), to a consumer data right accredited person only for personal information that is not CDR data (s. 6E(1D)), and to prescribed operators as the regulations say (s. 6E(1), (2); Privacy Regulations 2025, s. 7, for residential tenancy database operators); a registered or recognised association of employees is covered for all its activities (s. 6E(1C)). The policy covers everything you do: narrow it where the Act covers only part.");
			else if (why === "trade") c2.push("Disclosing or collecting personal information with the person's consent, or as legislation requires or authorises, does not by itself count as trading in it (s. 6D(7), (8)).");
		}
		checks.push(pick("U02", m2, w2, c2, "An organisation bound by the APPs."));
		/* U03: purposes and kinds of personal information */
		var m3 = [], w3 = [];
		var vp = acts.filter(function (a) { return D.LINT.vaguePurpose.test(v(a, "purpose")); }), np = acts.filter(function (a) { return !String(v(a, "purpose") || "").trim(); }), noData = acts.filter(function (a) { return !v(a, "data"); });
		if (!acts.length) m3.push("Add the purposes for which you collect, hold, use and disclose personal information (APP 1.4(c), 5.2(d)).");
		if (np.length) m3.push("Name each purpose: " + np.length + (np.length > 1 ? " purposes have" : " purpose has") + " no name, and the policy prints [purpose] (APP 1.4(c)).");
		if (noData.length && acts.length) m3.push("Give the kinds of personal information for " + pl(noData) + " (APP 1.4(a)).");
		if (led && yes(s, "inferred") && !v(s, "inferredWhat")) m3.push("Say what you infer about people, and from what: the policy prints a placeholder.");
		if (led && !yes(s, "adm") && yes(s, "profiling") && !v(s, "profilingWhat")) m3.push("Describe the analysis and what it is used for: the policy prints a placeholder.");
		if (vp.length) w3.push("Make each purpose specific: " + stop(pl(vp)) + " Write in plain language, specific enough to be meaningful (APP Guidelines 1.8).");
		checks.push(pick("U03", m3, w3, [], "Purposes and kinds of personal information, per purpose."));
		/* U04: how collected and held */
		var m4 = [], c4 = [];
		if (!v(s, "auHold")) m4.push("Say how you hold personal information, for example in electronic records on cloud systems and in paper files (APP 1.4(b)).");
		if (!v(s, "source")) m4.push("Answer where the personal information comes from: from people directly, from others, or both (APP 1.4(b), 5.2(b)).");
		var srcBad = pnSourceIndirect(s) ? arr(s, "sources").filter(function (x) { return !v(x, "name") || !v(x, "what"); }) : [];
		if (srcBad.length) m4.push("Give the name or type of each source, and the personal information obtained from it (APP 5.2(b)): the policy prints a placeholder.");
		if (pnSourceIndirect(s) && !arr(s, "sources").length) m4.push("Name the sources you collect personal information from, or their types (APP 5.2(b)).");
		if (pnSourceIndirect(s)) c4.push("Collect from others only where collecting from the person is unreasonable or impracticable (APP 3.6), and tell people the fact and circumstances of that collection (APP 5.2(b)).");
		if (!v(s, "auCollect") && (has(s, "channel", "web") || has(s, "channel", "app"))) c4.push("Describe collection people would not expect, such as cookies and similar technologies, under how you collect it (APP Guidelines 5.10, 5.11).");
		checks.push(pick("U04", m4, [], c4, "How personal information is collected and held."));
		/* U05: sensitive information */
		var m5 = [], w5 = [], c5 = [];
		var noS = acts.filter(function (a) { return !v(a, "auSens"); });
		var sb5 = function (k) { return acts.filter(function (a) { return v(a, "auSens") === k; }); };
		var sLaw = sb5("law").filter(function (a) { return !v(a, "auSensLaw"); }), sPgs = sb5("pgs").filter(function (a) { return !v(a, "auSensPgs"); }), sPhs = sb5("phs").filter(function (a) { return !v(a, "auSensPhs"); });
		var gd = acts.filter(function (a) {
			return (art9Of(s, a) || crimOf(s, a) || (inReg(s, "jp") && yes(a, "jpSens")) || (inReg(s, "kr") && yes(a, "krSens")) || (inReg(s, "cn") && yes(a, "cnSens")) ||
				(inReg(s, "can") && yes(a, "canSens")) || (inReg(s, "br") && !!v(a, "brSens"))) && !auSensOf(a); });
		if (sLaw.length) m5.push("Name the law, or give the details of the order, for " + stop(pl(sLaw)));
		if (sPgs.length) m5.push("Choose the permitted general situation for " + stop(pl(sPgs)));
		if (sPhs.length) m5.push("Describe the permitted health situation for " + stop(pl(sPhs)));
		if (gd.length) w5.push(pl(gd) + (gd.length > 1 ? " are" : " is") + " marked as sensitive under another law in this notice (special category, criminal offence, sensitive or special care-required data), but not as sensitive information for Australia. Sensitive information includes health, genetic and biometric information, criminal record, and membership of a professional or trade association or trade union (s. 6(1)): say how APP 3.3 or 3.4 allows collecting it.");
		if (noS.length) w5.push("Say for " + pl(noS) + " whether " + (noS.length > 1 ? "they involve" : "it involves") + " sensitive information (s. 6(1)): racial or ethnic origin, political opinions or association membership, religious or philosophical beliefs, professional or trade association or trade union membership, sexual orientation or practices, criminal record, health, genetic or biometric information. The policy describes it separately.");
		if (sb5("consent").length) c5.push("Consent must be informed, voluntary, current and specific, from someone with capacity (APP Guidelines B.38), and the information reasonably necessary for your functions or activities (APP 3.3(a)).");
		if (sb5("pgs").length) c5.push("A permitted general situation has to exist each time you collect: for items 1 and 2, a reasonable belief that collecting is necessary (s. 16A).");
		if (sb5("phs").length) c5.push("A permitted health situation applies only to health information, and only for an organisation (APP 3.4(c); s. 16B).");
		if (sb5("nonprofit").length) c5.push("APP 3.4(e) applies only to a non-profit organisation, where the information relates to its activities and solely to its members or people in regular contact with it in connection with those activities.");
		checks.push(pick("U05", m5, w5, c5, auSensActs(s).length ? "How APP 3.3 or 3.4 allows collecting each kind of sensitive information." : "No sensitive information.", acts.length ? "" : "No purposes yet."));
		/* U06: collection required or authorised by law */
		var lawActs = acts.filter(function (a) { var l = v(a, "auLaw"); return l === "required" || l === "authorised"; }), lNo = lawActs.filter(function (a) { return !v(a, "auLawName"); }), lUn = acts.filter(function (a) { return !v(a, "auLaw"); });
		checks.push(lNo.length ? chk("U06", "missing", "Name the Australian law, or give the details of the court or tribunal order, for " + pl(lNo) + " (APP 5.2(c); APP Guidelines 5.12 to 5.14).") :
			lUn.length ? chk("U06", "check", "Answer for " + pl(lUn) + " whether an Australian law or a court or tribunal order requires or authorises collecting the information: the policy names it (APP 5.2(c)).") :
			lawActs.length ? chk("U06", "ok", "The law is named for each purpose where one requires or authorises collection.") : chk("U06", "na", acts.length ? "No collection required or authorised by law." : "No purposes yet."));
		/* U07: main consequences */
		var cqNo = acts.filter(function (a) { return !auConseqOf(a); });
		checks.push(!pnSourceDirect(s) ? chk("U07", "na", "You do not collect from people directly.") : !acts.length ? chk("U07", "na", "No purposes yet.") :
			cqNo.length ? chk("U07", "check", "Give the main consequences, if any, for " + pl(cqNo) + " if people do not provide the information, for example that you cannot process an application (APP 5.2(e); APP Guidelines 5.18 to 5.20). Leave empty only where there are none.") :
			chk("U07", "ok"));
		/* U08: identity and contact details */
		var m8 = [], w8 = [], miss8 = [];
		if (!auEmail(s) && !auPost(s)) m8.push("Give an email or postal address for privacy questions, requests and complaints (APP 5.2(a); APP Guidelines 1.23, 5.9).");
		if (!auEmail(s)) miss8.push("an email address"); if (!auPhone(s)) miss8.push("a telephone number"); if (!auPost(s)) miss8.push("a postal address");
		if (miss8.length && !m8.length) w8.push("Add " + joinList(miss8) + ": the OAIC expects the contact to include a position title, telephone number, postal address and email address (APP Guidelines 1.23).");
		checks.push(pick("U08", m8, w8, [], (v(s, "auPo") ? "" : "Printed with the title \"Privacy Officer\". ") + "A position title, so the contact survives staff changes (APP Guidelines 5.9)."));
		/* U09: usual disclosures */
		var m9 = [], c9 = [], noWho = rec.filter(function (r) { return !String(v(r, "who") || "").trim(); }), noWhere = auNoWhere(s), noWhy = rec.filter(function (r) { return !v(r, "why"); });
		var un = auUnlisted(s);
		if (un.length) m9.push((!rec.length && yes(s, "auNoRecip") ? "You confirmed that there are no recipients, but " + nm(un, "recipient") + (un.length > 1 ? " are listed as overseas recipients. " : " is listed as an overseas recipient. ") : "") +
			"Add " + nm(un, "recipient") + " to the recipients, with what " + (un.length > 1 ? "they do" : "it does") + " with the information (APP 1.4(c), 5.2(f)).");
		if (!rec.length && !yes(s, "auNoRecip")) m9.push("List the organisations and people you usually disclose personal information to, including service providers, or confirm in the Australia section that there are none (APP 1.4(c), 5.2(f)).");
		if (noWho.length) m9.push("Name each recipient, or its type: " + noWho.length + (noWho.length > 1 ? " recipients have" : " recipient has") + " no name, and the policy prints a placeholder (APP 5.2(f)).");
		if (noWhere.length) m9.push("Give where " + nm(noWhere) + (noWhere.length > 1 ? " are" : " is") + " located: without it, the policy cannot say whether personal information goes overseas (APP 1.4(f)).");
		if (noWhy.length) m9.push("Give what " + nm(noWhy) + (noWhy.length > 1 ? " do" : " does") + " with the information: the purposes of disclosure are part of the policy (APP 1.4(c)).");
		if (rec.length) c9.push("Usual disclosures are those that are regular, agreed or reasonably predictable; describe recipients by type where a list would be long (APP Guidelines 5.21 to 5.25).");
		checks.push(pick("U09", m9, [], c9, "No recipients, confirmed."));
		/* U10: overseas recipients */
		var rows = auXrows(s), ab = auRecAbroad(s), unk = auRecUnknown(s), m10 = [], w10 = [], c10 = [];
		if (!v(s, "auAbroad")) m10.push("Say whether personal information goes to recipients outside Australia (APP 1.4(f), 5.2(i)).");
		else if (no(s, "auAbroad")) {
			if (ab.length) m10.push(nm(ab) + (ab.length > 1 ? " are" : " is") + " outside Australia, but the answer is No.");
			else if (unk.length) m10.push("Check where " + nm(unk) + (unk.length > 1 ? " are" : " is") + " located (a location that names Australia and another place counts as outside Australia): the policy cannot say that nothing goes overseas.");
		}
		if (yes(s, "auAbroad")) {
			if (!rows.length) m10.push("Add each overseas recipient, with its country (APP 1.4(g), 5.2(j)).");
			if (rows.some(function (r) { return !v(r, "recipient") || !v(r, "country") || !v(r, "basis"); })) m10.push("Give the recipient, the country and how APP 8 is met for each overseas recipient.");
			rows.forEach(function (r) {
				var ba = v(r, "basis"), who = jpTrim(v(r, "recipient") || "[recipient]"), rr = auRowRec(s, r);
				if (ba === "prescribed") m10.push(stop("No country or binding scheme is prescribed by the regulations for APP 8.3 (Privacy Regulations 2025, in force from 1 April 2026): choose another basis for " + who));
				if ((ba === "similar" || ba === "law") && !v(r, "lawName")) m10.push(stop("Name the " + (ba === "law" ? "Australian law or order" : "law or binding scheme") + " for " + who));
				if (ba === "similar") c10.push("For " + who + ": you need a reasonable belief that the law or binding scheme protects the information in a way that, overall, is at least substantially similar to the APPs, and that people can take action to enforce it (APP 8.2(a)); keep the assessment.");
				if (ba === "law") c10.push("For " + who + ": only an Australian law or an Australian court or tribunal order counts, not a foreign law (APP 8.2(c); APP Guidelines 8.38).");
				if (ba === "pgs" && ["1", "2", "3"].indexOf(v(r, "pgs")) === -1) m10.push("Choose the permitted general situation for " + who + ": items 1 to 3 of s. 16A only (APP 8.2(d)).");
				if (ba === "own" && !auOwnOk(s, r)) m10.push(who + " is not your own organisation (its name differs from yours, or it is listed as a recipient): a related company is an overseas recipient (APP Guidelines 8.6). Choose another basis; the policy prints a placeholder.");
				if (ba === "storage") c10.push("Storage by " + who + " is a use, not a disclosure, only where a binding contract limits it to storing and protecting the information and you keep effective control (APP Guidelines 8.14); otherwise choose reasonable steps.");
				if (ba === "storage" && rr && ["controller", "joint", "authority"].indexOf(v(rr, "role")) !== -1) w10.push(who + " is listed as using the information for its own purposes: that is a disclosure, not storage only.");
				if (ba === "steps") c10.push("You remain accountable for how " + who + " handles the information (s. 16C): put binding contract terms in place before disclosing.");
				if (auWhere(v(r, "country")) === "au") m10.push("The row for " + who + " names Australia as the country: list only recipients outside Australia.");
				if (rr && v(rr, "where") && v(r, "country") && auWhere(v(r, "country")) !== "au") {
					var lw = String(v(rr, "where")).toLowerCase(), lc = String(v(r, "country")).toLowerCase().trim();
					if (lw.indexOf(lc) === -1 && lc.indexOf(lw.trim()) === -1) c10.push("Check the country of " + who + ": the recipients list gives \"" + jpTrim(v(rr, "where")) + "\".");
				}
			});
			var inRows = function (r) { return rows.some(function (x) { return jpSame(v(x, "recipient"), v(r, "who")); }); };
			var miss = ab.filter(function (r) { return !inRows(r); }), unkMiss = unk.filter(function (r) { return !inRows(r); });
			if (miss.length) m10.push(nm(miss) + (miss.length > 1 ? " are" : " is") + " outside Australia but not in the overseas recipients.");
			if (unkMiss.length) m10.push("Check where " + nm(unkMiss) + (unkMiss.length > 1 ? " are" : " is") + " located; if outside Australia, add " + (unkMiss.length > 1 ? "them" : "it") + " to the overseas recipients.");
			if (rows.some(function (r) { return auDiscRow(s, r); })) c10.push("The policy lists the countries. Where listing them is impracticable, an appendix, a link or regions are allowed, and you need to be able to justify it (APP Guidelines 1.32, 1.33).");
		}
		if (off) c10.push("You are based abroad: holding the information in your own organisation is not a disclosure; disclosures to other organisations outside Australia are (APP Guidelines 8.6).");
		checks.push(pick("U10", m10, w10, c10, "No overseas recipients."));
		/* U11, U12 */
		var noRet = acts.filter(function (a) { return !v(a, "retention") || D.LINT.vagueRetention.test(v(a, "retention")); });
		checks.push(!acts.length ? chk("U11", "na", "No purposes yet.") : noRet.length ? chk("U11", "warn", "Give a period, or the criteria, for " + stop(pl(noRet)) + " The Act sets no period, but describing retention is good practice (APP Guidelines 1.80). Where none is given, the policy states the APP 11.2 rule.") : chk("U11", "ok"));
		checks.push(v(s, "auSecurity") ? chk("U12", "ok") : chk("U12", "check", "The policy states the APP 11.1 duty. Describing your main measures is good practice."));
		/* U13: access and correction */
		var m13 = [], w13 = [], days = parseInt(v(s, "auReqDays"), 10);
		if (!auReqWay(s)) m13.push("Say where people send access and correction requests (APP 1.4(d)).");
		if (!v(s, "auFee")) m13.push("Say whether you charge for giving access (needed for the policy text; APP 12.8 limits the charge).");
		if (yes(s, "publicBody") && yes(s, "auFee")) m13.push("Agencies cannot charge for access (APP 12.7): the policy says that there is no charge.");
		if (days > 30) w13.push("The OAIC treats a reasonable period as generally no more than 30 calendar days (APP Guidelines 12.67, 13.64): " + days + " days is longer.");
		checks.push(pick("U13", m13, w13, [], "How to ask for access and correction; no charge for asking or for correcting; a reasonable period; written reasons on refusal (APP 12, 13)."));
		/* U14: complaints */
		var m14 = [];
		if (!auComplaintWay(s)) m14.push("Say how people make a complaint (APP 1.4(e)).");
		if (!v(s, "auComplaintHow")) m14.push("Say how you deal with complaints, and in what time (APP 1.4(e); APP Guidelines 1.28): the policy prints a placeholder.");
		if (yes(s, "auEdr") && !v(s, "auEdrName")) m14.push("Name the external dispute resolution scheme.");
		if (yes(s, "auCode") && !v(s, "auCodeName")) m14.push("Name the registered APP code.");
		var w14 = [], c14 = [], long14 = 0, re14 = /(\d+)\s*(calendar |business |working )?days|(\d+)\s*weeks/gi, mm;
		while ((mm = re14.exec(v(s, "auComplaintHow")))) { var dd = mm[1] ? parseInt(mm[1], 10) : parseInt(mm[3], 10) * 7; if (dd > long14) long14 = dd; }
		if (long14 > 30) w14.push("Your complaint process takes longer than 30 days: the OAIC expects a response within 30 days (APP Guidelines 1.28), and people can then go to the OAIC.");
		if (auComplaintWay(s) && !auWritable(auComplaintWay(s))) c14.push("The OAIC expects complaints to be made to you in writing first (APP Guidelines 1.28): give an email or postal address too.");
		if (auVol(s)) c14.push("As a small business operator not bound by the APPs, the policy gives no OAIC complaint route.");
		checks.push(pick("U14", m14, w14, c14, "Complaints first to you in writing, then " + (yes(s, "auEdr") ? "the external dispute resolution scheme and " : "") + "the OAIC (s. 40(1A); APP Guidelines 1.28)."));
		/* U15: direct marketing */
		var mk = acts.filter(auMkt);
		if (!v(s, "auDm")) checks.push(mk.length ? chk("U15", "warn", pl(mk) + (mk.length > 1 ? " look" : " looks") + " like direct marketing. Answer whether you use personal information for direct marketing (APP 7).") :
			chk("U15", "check", "Answer whether you use personal information for direct marketing (APP 7)."));
		else if (no(s, "auDm")) checks.push(mk.length ? chk("U15", "warn", pl(mk) + (mk.length > 1 ? " look" : " looks") + " like direct marketing, but the answer is No (APP 7).") : chk("U15", "na", "No direct marketing."));
		else {
			var m15 = [], w15 = [];
			if (!v(s, "auDmOut")) m15.push("Say how people opt out of direct marketing (APP 7.2(c), 7.3(c)): the policy prints a placeholder.");
			if (!mk.length) w15.push("No purpose in the table covers direct marketing: add it to the purposes (APP 1.4(c)).");
			var sMk = acts.filter(function (a) { return auMkt(a) && auSensOf(a) && auSensOf(a) !== "consent"; });
			if (sMk.length) w15.push(pl(sMk) + (sMk.length > 1 ? " use" : " uses") + " sensitive information for what looks like direct marketing: that needs consent (APP 7.4).");
			checks.push(pick("U15", m15, w15, ["Direct marketing needs: information collected from the person, who would reasonably expect it, with a simple way to opt out; otherwise consent (or consent being impracticable) and a prominent opt-out statement in each communication (APP 7.2, 7.3). Sensitive information only with consent (APP 7.4). APP 7 does not apply to the extent the Spam Act 2003, the Do Not Call Register Act 2006 or the Interactive Gambling Act 2001 (Part 7B, Division 5) applies (APP 7.8)."]));
		}
		/* U16: anonymity and pseudonymity */
		var an = v(s, "auAnon");
		checks.push(!an ? chk("U16", "check", "Answer whether people can deal with you anonymously or under a pseudonym (APP 2): the policy describes it (APP Guidelines 1.80).") :
			an === "yes" ? chk("U16", "ok") : chk("U16", "check", "Be ready to show " + (an === "law" ? "the law or order that requires or authorises dealing with identified people" : "why dealing with unidentified people is impracticable") + " (APP 2.2). Offer anonymity where you can, for example for general enquiries."));
		/* U17: automated decisions */
		var adm = v(s, "auAdm");
		var admPh = led && yes(s, "adm") && !v(s, "admWhat") && adm !== "Yes" ? " Describe the automated decisions in your answers on automated decisions: the policy prints a placeholder." : "";
		if (!adm) checks.push(chk("U17", "missing", "Answer whether computer programs make, or do things substantially and directly related to making, decisions that could significantly affect people's rights or interests using their personal information. APP 1.7 to 1.9 apply from 10 December 2026, to decisions made after that date (POLA Act 2024, Sch 1, item 89), and the policy must then be up to date (APP 1.3)." + admPh));
		else if (adm === "No") checks.push(admPh ? chk("U17", "missing", admPh.slice(1)) : yes(s, "adm") ? chk("U17", "warn", "Your answers say you make automated decisions, but the Australia answer is No. APP 1.7 covers decisions made by a computer program and things a program does that are substantially and directly related to a human's decision, where the decision could reasonably be expected to significantly affect someone's rights or interests (APP Guidelines 1.40 to 1.66).") :
			chk("U17", "na", "No decisions of the kind APP 1.7 covers."));
		else {
			var m17 = [];
			if (!v(s, "auAdmData")) m17.push("Give the kinds of personal information the programs use (APP 1.8(a)).");
			if (!v(s, "auAdmSole") && !v(s, "auAdmPart")) m17.push("Give the kinds of decisions made solely by a computer program, or those where a program does a thing substantially and directly related to making them (APP 1.8(b), (c)).");
			checks.push(m17.length ? chk("U17", "missing", m17.join(" ") + " The policy prints a placeholder.") :
				chk("U17", "check", "Group the decisions and kinds of information meaningfully, name sensitive kinds such as health or biometric information, and frame it so people can challenge a decision; commercial-in-confidence detail can stay out (APP Guidelines 1.67 to 1.73). Required from 10 December 2026, for decisions made after that date; include programs you arrange to use from others (APP Guidelines 1.42 to 1.45)."));
		}
		/* U18: registered APP code */
		checks.push(!v(s, "auCode") ? chk("U18", "check", "Answer whether a registered APP code binds you (OAIC codes register): if one does, the policy names it (APP 1.4(e); APP Guidelines 1.27).") :
			no(s, "auCode") ? chk("U18", "na", "No registered APP code.") : v(s, "auCodeName") ? chk("U18", "ok", "The code is named in the complaints part.") : chk("U18", "missing", "Name the registered APP code."));
		/* U19: children */
		checks.push(!v(s, "auKids") ? chk("U19", "check", "Answer whether people under 18 use your service.") : no(s, "auKids") ? chk("U19", "na", "No children.") :
			chk("U19", "check", (cons ? "The policy describes how you assess a child's capacity to consent (APP Guidelines B.59 to B.61). " : "No purpose relies on consent, so the policy prints nothing on children's consent. ") +
				"The Children's Online Privacy Code must be registered by 10 December 2026; its start date is not yet set. Check whether it will bind your online service, and write for children in language they understand."));
		/* U20: new purpose */
		if (yes(s, "further")) {
			var fm = [], ff = v(s, "auFurther");
			if (led) { if (!v(s, "furtherWhat")) fm.push("the new purpose"); if (!v(s, "furtherStart")) fm.push("when it starts"); if (!v(s, "furtherData")) fm.push("the personal information used"); }
			if (!ff) fm.push("how APP 6 allows it");
			if (ff === "law" && !v(s, "auFurtherLaw")) fm.push("the law or order");
			if (ff === "pgs" && !v(s, "auFurtherPgs")) fm.push("the permitted general situation");
			checks.push(fm.length ? chk("U20", "missing", "For the new purpose, give " + joinList(fm) + " (APP 6.1, 6.2).") :
				ff === "related" ? chk("U20", "check", "Only where people would reasonably expect it and the new purpose is related to the original one, or directly related for sensitive information (APP 6.2(a)). Update the policy before you start (APP 1.3).") :
				chk("U20", "check", (ff === "consent" ? "Get consent before using or disclosing the information for the new purpose (APP 6.1(a))." : "Check that " + (ff === "law" ? "the law or order" : "the permitted general situation") + " covers the new purpose (APP 6.2).") + " Update the policy before you start (APP 1.3)."));
		}
		/* U21: withdrawing consent */
		checks.push(!cons ? chk("U21", "na", "No purpose relies on consent.") : !auWithdrawWay(s) ? chk("U21", "missing", "Say how people withdraw consent (APP Guidelines B.54).") :
			chk("U21", "ok", "Withdrawal should be easy and accessible; tell people what follows (APP Guidelines B.54)."));
		/* U22: employees and applicants */
		var au_ = v(s, "audience");
		if (au_ === "employee") checks.push(chk("U22", "warn", "The employee records exemption covers acts and practices directly related to a current or former employment relationship and an employee record you hold (s. 7B(3)): the APPs, access and correction and an OAIC complaint do not reach them. The policy says so, and that its access, correction and complaint routes apply only to the other personal information you hold about staff. The exemption does not cover contractors."));
		else if (au_ === "applicant") checks.push(chk("U22", "check", "The employee records exemption speaks of a current or former employment relationship (s. 7B(3)), so it does not cover job applicants: the APPs apply to their personal information."));
		var tfn = acts.some(function (a) { return /tax file number|\bTFN\b/i.test(v(a, "data") + " " + v(a, "purpose")); });
		checks.push(chk("U23", "check", (tfn ? "You collect tax file numbers: the Privacy (Tax File Number) Rule 2015, issued under s. 17, binds every file number recipient, small businesses included (s. 18). Check it. " : "") +
			"Not modelled: credit reporting (Part IIIA), notifiable data breaches (Part IIIC), unsolicited personal information (APP 4), government related identifiers such as Medicare numbers (APP 9), tax file numbers (the Privacy (Tax File Number) Rule 2015 under s. 17), the statutory tort for serious invasions of privacy (Schedule 2), agencies, and State and Territory laws such as health records Acts."));
		/* Delivery */
		delivery.push(chk("U24", "check", "Give a collection notice at or before collecting personal information, or as soon as practicable after (APP 5.1): a short notice at each collection point with the APP 5.2 matters that apply, pointing to the relevant parts of this policy and telling people they are there (APP Guidelines 5.5, 5.6)." +
			(pnSourceIndirect(s) ? " When you collect from others, tell people the fact and circumstances (APP 5.2(b))." : "")));
		delivery.push(chk("U25", "check", "Publish the policy free of charge, prominently on your website, for example with a link on each page, in an accessible form; give a copy in another form on request where reasonable (APP 1.5, 1.6; APP Guidelines 1.81 to 1.88)."));
		if (rows.some(function (r) { return v(r, "basis") === "consent"; })) delivery.push(chk("U26", "check", "Before asking for consent to an overseas disclosure, tell people expressly that APP 8.1 will not apply: you will not be accountable under the Privacy Act and they cannot seek redress under it. Consent must be current and specific, and people can withdraw it (APP 8.2(b); APP Guidelines 8.31 to 8.37)."));
		if (yes(s, "auDm")) delivery.push(chk("U27", "check", "Commercial electronic messages (email, SMS, instant messages) need consent, must identify you and must include a functional unsubscribe (Spam Act 2003). Telemarketing calls and marketing faxes to numbers on the Do Not Call Register need consent (Do Not Call Register Act 2006). Gambling services have their own rules (Interactive Gambling Act 2001, Part 7B, Division 5). APP 7 does not apply to the extent those Acts apply (APP 7.8)."));
		delivery.push(chk("U28", "check", "Answer access and correction requests within a reasonable period, in the way asked where reasonable and practicable; if you refuse, give written reasons and the complaint mechanisms; attach a statement on request; tell other APP entities of a correction on request (APP 12, 13)."));
		delivery.push(chk("U29", "check", "Review the policy regularly and keep it up to date (APP 1.2, 1.3)." + (after ? "" : " By 10 December 2026, add any computer programs that make, or substantially and directly help make, decisions that could significantly affect people (APP 1.7 to 1.9).")));
		return { checks: checks, delivery: delivery };
	}

	/* A privacy policy led by Australia's Privacy Act. */
	function auLead(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]";
		var title = (v(s, "ctrlName") ? v(s, "ctrlName") + " " : "") + "Privacy Policy";
		var acts = pnActs(s), cons = auConsent(s), off = auOffshore(s);
		var meta = [ctrl];
		if (v(s, "version")) meta.push("Version " + v(s, "version"));
		if (v(s, "effective")) meta.push("Effective " + fmtDate(v(s, "effective")));
		var num = {}, c = 4;
		if (yes(s, "auAdm")) num.adm = c++;
		num.share = c++; num.abroad = c++;
		if (yes(s, "auDm")) num.dm = c++;
		num.sec = c++;
		if (cons) num.withdraw = c++;
		if (yes(s, "auKids") && cons) num.kids = c++;
		num.rights = c++; num.complaints = c++;
		if (inReg(s, "za")) num.za = c++;
		if (inReg(s, "ca")) num.ca = c++;
		if (inReg(s, "us")) num.us = c++;
		num.changes = c++;
		var blocks = [{ k: "h1", x: title }, { k: "meta", x: meta.map(stop).join(" ") }];
		blocks.push({ k: "p", x: auVol(s) ? "This policy explains how " + ctrl + " manages personal information: what we collect and why, how we collect and hold it, who we disclose it to, and how you can access and correct it or make a complaint. " + AU_VOL :
			"This policy explains how " + ctrl + " manages personal information under the Privacy Act 1988 and the Australian Privacy Principles (APPs): what we collect and why, how we collect and hold it, who we disclose it to, and how you can access and correct it or make a complaint." });
		if (v(s, "audience") === "employee") blocks.push({ k: "p", x: AU_EMP });
		var first = [];
		if (acts.length) first.push({ k: "p", x: "We collect, hold, use and disclose personal information for:" }, { k: "ul", items: acts.map(function (a) { return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: stop(v(a, "data") || "[personal information]") }; }) });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		if (off) first.push({ k: "p", x: "We are based outside Australia and hold your personal information in " + jpTrim(v(s, "auOffWhere") || "[the countries where you hold and process it]") + ". Section " + num.abroad + " gives the details." });
		if (auXrows(s).some(function (r) { return auDiscRow(s, r); })) first.push({ k: "p", x: "We are likely to disclose personal information to recipients outside Australia. Section " + num.abroad + " names the countries." });
		first.push({ k: "p", x: "You can ask to access and correct your personal information" + (cons ? " and withdraw your consent" : "") + ", and you can complain to us" + (auVol(s) ? "" : " and then to the OAIC") + ". Section " + num.rights + " explains access and correction" +
			(num.withdraw ? ", section " + num.withdraw + " withdrawing consent" : "") + ", section " + num.complaints + " complaints; section 1 gives our contact details." });
		if (num.za) first.push({ k: "p", x: zaPointer(s, num.za) });
		if (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });
		if (num.us) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + num.us + " also applies to you." });
		blocks.push({ k: "box", title: "In short", blocks: first });

		blocks.push({ k: "h2", x: "1. Who we are and how to contact us" });
		Array.prototype.push.apply(blocks, auContactBlocks(s));
		blocks.push({ k: "h2", x: "2. The personal information we collect, and why" });
		Array.prototype.push.apply(blocks, auPurposeBlocks(s));
		if (yes(s, "inferred")) blocks.push({ k: "p", x: "We also derive information about you from the information above: " + stop(v(s, "inferredWhat") || "[what is inferred, and from what]") });
		if (yes(s, "adm") && !yes(s, "auAdm")) blocks.push({ k: "p", x: "We use automated systems to make decisions about people: " + stop(krLc(v(s, "admWhat") || "[the decisions and what they are based on]")) });
		else if (!yes(s, "adm") && yes(s, "profiling")) blocks.push({ k: "p", x: "We analyse information about you: " + stop(v(s, "profilingWhat") || "[the analysis and what it is used for]") });
		blocks.push({ k: "h2", x: "3. How we collect and hold it" });
		Array.prototype.push.apply(blocks, auCollectBlocks(s));
		if (num.adm) { blocks.push({ k: "h2", x: num.adm + ". Automated decisions" }); Array.prototype.push.apply(blocks, auAdmBlocks(s)); }
		blocks.push({ k: "h2", x: num.share + ". Who we disclose it to" });
		Array.prototype.push.apply(blocks, auShareBlocks(s));
		blocks.push({ k: "h2", x: num.abroad + ". " + (off ? "Where we hold it, and overseas recipients" : "Overseas recipients") });
		Array.prototype.push.apply(blocks, auAbroadBlocks(s));
		if (num.dm) { blocks.push({ k: "h2", x: num.dm + ". Direct marketing" }); Array.prototype.push.apply(blocks, auDmBlocks(s)); }
		blocks.push({ k: "h2", x: num.sec + ". How we protect it and how long we keep it" });
		blocks.push(auSecBlock(s), auRetainBlock(s, "in section 2"));
		if (num.withdraw) { blocks.push({ k: "h2", x: num.withdraw + ". Withdrawing consent" }); blocks.push(auWithdrawBlock(s)); }
		if (num.kids) { blocks.push({ k: "h2", x: num.kids + ". Children" }); Array.prototype.push.apply(blocks, auKidsBlocks(s)); }
		blocks.push({ k: "h2", x: num.rights + ". Access and correction" });
		Array.prototype.push.apply(blocks, auRightsBlocks(s));
		blocks.push({ k: "h2", x: num.complaints + ". Complaints" });
		Array.prototype.push.apply(blocks, auComplaintBlocks(s));

		var auSecs = (num.withdraw ? [String(num.withdraw)] : []).concat([String(num.rights), String(num.complaints)]);
		var only = " Sections " + joinList(auSecs) + " apply to you only where the Privacy Act applies to our handling of your personal information.";
		var zaRes = null;
		if (num.za) {
			blocks.push({ k: "h2", x: num.za + ". " + zaHead(s) });
			Array.prototype.push.apply(blocks, zaSection(s, auSecs, "the Privacy Act"));
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
		if (yes(s, "further")) blocks.push({ k: "box", title: "Planned new use of your personal information", blocks: [
			{ k: "p", x: "From " + (fmtDate(v(s, "furtherStart")) || "[start date]") + " we intend to use personal information we already hold for a new purpose: " + stop(v(s, "furtherWhat") || "[new purpose]") +
				" Personal information used: " + stop(krLc(v(s, "furtherData") || "[the personal information]")) + (v(s, "furtherRetention") ? " How long we keep it for this purpose: " + stop(krLc(v(s, "furtherRetention"))) : "") },
			{ k: "p", x: auFurtherTxt(s) }] });
		blocks.push({ k: "p", x: "This policy applies from " + (fmtDate(v(s, "effective")) || "[date]") + ". We review it and keep it up to date. When we change it, we publish the new version here with the date it applies from (APP 1.3)." });
		if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });

		var cr = auChecks(s, true), checks = cr.checks, delivery = cr.delivery;
		checks.push(v(s, "consequences") ? chk("P21", "ok", "", undefined, "WP260 10, 36 (good practice)") : chk("P21", "warn", "Empty. Fine only if nothing here would surprise people.", undefined, "WP260 10, 36 (good practice)"));
		if (zaRes) { Array.prototype.push.apply(checks, zaRes.checks); Array.prototype.push.apply(delivery, zaRes.delivery); }
		if (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }
		if (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(delivery, usRes.delivery); }
		var lintHits = lintText(blocks);
		checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "APP 1.3; APP Guidelines 1.8; WP260 13") :
			chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "APP 1.3; APP Guidelines 1.8; WP260 13"));
		var gp = [];
		if (pnSourceDirect(s)) gp.push(chk("D01", "check", "Give the policy, or a collection notice pointing to it, before you collect the data: before a form is submitted, before payment, before sign-up.", "Timing: when the data is collected"));
		gp.push(chk("D03", "check", "Read it as a member of the audience would."));
		if (has(s, "channel", "web")) gp.push(chk("D05", "check", "Link it from every page, and from every form that collects personal information."));
		if (has(s, "channel", "app")) gp.push(chk("D06", "check", "Show it in the app store listing and keep it within two taps inside the app."));
		gp.push(chk("D07", "check", "Use the \"In short\" box as the first layer and keep it consistent with the full text."));
		gp.push(chk("D08", "check", "Keep the full policy available as one document."));
		gp.push(chk("D14", "check", "If you add icons, keep them alongside the text, never instead of it."));
		gp.forEach(function (r) { var m = D.MATRIX[r.id]; if (m) r.s = m.s.replace(/^Art\.[^;]*;\s*/, "") + " (good practice)"; });
		delivery = gp.concat(delivery);
		return { title: title, file: slug(ctrl + " Privacy Policy"), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(delivery), docLabel: "Policy" };
	}

	/* Form section for Australia: everything except the per-purpose and overseas fields. */
	var AU_SECTION = {
		title: "Australia: Privacy Act 1988 and the Australian Privacy Principles",
		show: auOn,
		lead: "The Privacy Act as in force on 13 November 2026, for organisations (not agencies). Give, per purpose above, sensitive information, any law requiring collection and the consequences of not providing it; the purpose and location of each recipient; and overseas recipients under transfers.",
		fields: [
			{ id: "auScope", type: "select", label: "Where you are", opts: [
				{ v: "in", l: "In Australia (incorporated, formed or created there, or an Australian citizen or permanent resident)" },
				{ v: "abroad", l: "Outside Australia, carrying on business in Australia" }],
			  hint: "Section 5B: the Act extends to an organisation with an Australian link, including one that carries on business in Australia, for what it does in Australia and abroad." },
			{ id: "auOffWhere", type: "text", label: "The countries where you hold and process the personal information", show: auOffshore, ph: "for example Ireland and the United States" },
			{ id: "auSb", type: "select", label: "Your annual turnover for the previous financial year", opts: [{ v: "over", l: "More than $3,000,000" }, { v: "under", l: "$3,000,000 or less" }],
			  hint: "Section 6D: a small business operator is not bound by the APPs unless an exception applies. A new business counts its turnover for the current year (s. 6D(2))." },
			{ id: "auSbWhy", type: "select", label: "Which of these applies to you?", show: function (s) { return v(s, "auSb") === "under"; }, opts: function () { return D.AU_SB.map(function (x) { return { v: x.v, l: x.l }; }); } },
			{ id: "auPo", type: "text", label: "Privacy contact: position title (optional)", ph: "Privacy Officer",
			  hint: "APP 5.2(a); APP Guidelines 1.23, 5.9: a position title rather than a name, so the contact survives staff changes. Empty prints \"Privacy Officer\"." },
			{ id: "auPoEmail", type: "text", label: "Privacy contact: email (optional)", hint: "Leave empty to use the organisation's email." },
			{ id: "auPoPhone", type: "text", label: "Privacy contact: telephone (optional)", hint: "Leave empty to use the organisation's telephone." },
			{ id: "auPoPost", type: "area", rows: 2, label: "Privacy contact: postal address (optional)", hint: "Leave empty to use the organisation's address." },
			{ id: "auCollect", type: "area", rows: 2, label: "How you collect personal information (optional)", ph: "for example through our website forms and app, by phone, and from the employers who enrol you",
			  hint: "APP 1.4(b), 5.2(b). Include collection people would not expect, such as cookies. Empty: the policy says whether you collect from people or from others." },
			{ id: "auHold", type: "area", rows: 2, label: "How you hold personal information", ph: "for example in electronic records on cloud systems and in paper files at our offices", hint: "APP 1.4(b)." },
			{ id: "auAnon", type: "select", label: "Can people deal with you anonymously or under a pseudonym?", opts: [
				{ v: "yes", l: "Yes" }, { v: "law", l: "No: a law or a court or tribunal order requires or authorises us to deal with identified people (APP 2.2(a))" },
				{ v: "impr", l: "No: it is impracticable (APP 2.2(b))" }], hint: "APP 2." },
			{ id: "auAnonWhat", type: "text", label: "When, or why not (optional)", show: function (s) { return !!v(s, "auAnon"); }, ph: "for example for general enquiries" },
			{ id: "auNoRecip", type: "yesno", label: "You listed no recipients. Confirm that you do not disclose personal information to anyone, not even service providers",
			  show: function (s) { return !arr(s, "recipients").length; } },
			{ id: "auAdm", type: "yesno", label: "Do computer programs make decisions, or do things substantially and directly related to making decisions, that could reasonably be expected to significantly affect people's rights or interests, using their personal information?",
			  hint: "APP 1.7 to 1.9, from 10 December 2026, for decisions made after that date. Includes programs that recommend or score for a person who decides (APP Guidelines 1.49 to 1.54), and third-party tools you arrange to use. For example decisions on benefits, under a contract, or on access to credit, housing, employment or healthcare." },
			{ id: "auAdmData", type: "text", label: "The kinds of personal information the programs use", show: function (s) { return yes(s, "auAdm"); },
			  hint: "APP 1.8(a). Name sensitive kinds, such as health or biometric information (APP Guidelines 1.71)." },
			{ id: "auAdmSole", type: "text", label: "The kinds of decisions made solely by a computer program", show: function (s) { return yes(s, "auAdm"); }, hint: "APP 1.8(b). Leave empty if none." },
			{ id: "auAdmPart", type: "text", label: "The kinds of decisions where a program does a thing substantially and directly related to making them", show: function (s) { return yes(s, "auAdm"); },
			  hint: "APP 1.8(c), for example a risk score a loan officer relies on. Leave empty if none." },
			{ id: "auDm", type: "yesno", label: "Do you use personal information for direct marketing?", hint: "APP 7." },
			{ id: "auDmOthers", type: "yesno", label: "Do you also use or disclose it to help other organisations with their direct marketing?", show: function (s) { return yes(s, "auDm"); } },
			{ id: "auDmOut", type: "text", label: "How people opt out of direct marketing", show: function (s) { return yes(s, "auDm"); }, ph: "for example use the unsubscribe link in each email" },
			{ id: "auSecurity", type: "area", rows: 2, label: "Your main security measures (optional)", hint: "APP 11." },
			{ id: "auReqHow", type: "area", rows: 2, label: "How people ask for access or correction (optional)", hint: "APP 12, 13. Leave empty to use how people exercise their rights (below), or the privacy contact's email or postal address." },
			{ id: "auFee", type: "yesno", label: "Do you charge for giving access?", hint: "APP 12.8: not excessive, and never for making the request. Correction is free (APP 13.5)." },
			{ id: "auReqDays", type: "text", label: "Days within which you respond to requests (optional)", ph: "30", hint: "APP 12.4, 13.5: within a reasonable period." },
			{ id: "auComplaint", type: "text", label: "How people make a complaint (optional)", hint: "Leave empty to use the privacy contact's email or postal address." },
			{ id: "auComplaintHow", type: "area", rows: 2, label: "How you deal with complaints", ph: "for example we acknowledge it within 5 business days, investigate, and reply in writing within 30 days",
			  hint: "APP 1.4(e). The OAIC expects a response within 30 days (APP Guidelines 1.28)." },
			{ id: "auEdr", type: "yesno", label: "Are you a member of a recognised external dispute resolution scheme?", hint: "For example the Australian Financial Complaints Authority (AFCA) or the Telecommunications Industry Ombudsman (OAIC register, s. 35A)." },
			{ id: "auEdrName", type: "text", label: "The scheme", show: function (s) { return yes(s, "auEdr"); } },
			{ id: "auCode", type: "yesno", label: "Does a registered APP code bind you?", hint: "APP 1.4(e); the OAIC codes register." },
			{ id: "auCodeName", type: "text", label: "The code", show: function (s) { return yes(s, "auCode"); } },
			{ id: "auKids", type: "yesno", label: "Do people under 18 use your service?", hint: "APP Guidelines B.59 to B.61. The Children's Online Privacy Code must be registered by 10 December 2026; its start date is not yet set." },
			{ id: "auKidsHow", type: "text", label: "How you ask a parent or guardian to consent for a child (optional)", show: function (s) { return yes(s, "auKids"); } }
		]
	};
