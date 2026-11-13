	/* ========================================================= KOREA === */
	/* South Korea (matrix Part S): the Personal Information Protection Act (PIPA) as in force on 11 September 2026
	   (Act No. 21445), its Enforcement Decree as in force on 10 November 2026, read in Korean on law.go.kr on
	   12 and 13 November 2026, and the PIPC privacy policy drafting guidelines (April 2026). Amendments in force on
	   9 March 2027 (AI development) and 1 July 2027 (mandatory certification) are not modelled (row S25). Korean is
	   the only authentic text; the notice wording is a translation. Independent review of 13 November 2026: 30
	   findings, all applied (build/review-2026-11-13-kr). Notes in build/kr/notes.md. */
	function krOn(s) { return inReg(s, "kr"); }
	/* Places in Korea, in English and Korean, and cloud regions in Korea (review K18). */
	var KR_KR = /\b(korea|seoul|busan|pusan|incheon|daegu|daejeon|gwangju|ulsan|sejong|gyeonggi|gangwon|chungcheong|chungbuk|chungnam|jeolla|jeonbuk|jeonnam|gyeongsang|gyeongbuk|gyeongnam|jeju|suwon|seongnam|goyang|yongin|changwon|pangyo|bundang|cheongju|jeonju|pohang)\b|\ud55c\uad6d|\ub300\ud55c\ubbfc\uad6d|\uc11c\uc6b8|\ubd80\uc0b0|\uacbd\uae30|\uc778\ucc9c|\ub300\uad6c|\ub300\uc804|\uad11\uc8fc|\uc6b8\uc0b0|\uc138\uc885|\ud310\uad50|\uad6d\ub0b4|\uc81c\uc8fc|\uc218\uc6d0|\uc131\ub0a8|\uac15\uc6d0|\ucda9\uccad|\ucda9\ubd81|\ucda9\ub0a8|\uc804\ub77c|\uc804\ubd81|\uc804\ub0a8|\uacbd\uc0c1|\uacbd\ubd81|\uacbd\ub0a8/i;
	var KR_KR_G = new RegExp(KR_KR.source, "gi");
	var KR_REGION_KR = /\b(ap-northeast-2|asia-northeast3|korea ?(central|south))\b/gi;
	var KR_REGION = /\b(us|eu|ap|sa|ca|me|af|il|mx)-(east|west|central|north|south|northeast|southeast|southwest|northwest)-\d+\b|\b(us|europe|asia|australia|southamerica|northamerica|me|africa)-(east|west|central|north|south|northeast|southeast|southwest|northwest)\d+\b/i;
	var KR_FOR_H = /\ubbf8\uad6d|\uc77c\ubcf8|\uc911\uad6d|\uc2f1\uac00\ud3ec\ub974|\ud64d\ucf69|\ub300\ub9cc|\ubca0\ud2b8\ub0a8|\uc778\ub3c4|\ub3c5\uc77c|\ud504\ub791\uc2a4|\uc601\uad6d|\uc544\uc77c\ub79c\ub4dc|\ub124\ub35c\ub780\ub4dc|\uce90\ub098\ub2e4|\ud638\uc8fc|\ud574\uc678|\uad6d\uc678|\uc720\ub7fd|\ubbf8\uc8fc|\ub3d9\ub0a8\uc544|\ub3c4\ucfc4|\ub274\uc695|\ubd81\ud55c|\ub7ec\uc2dc\uc544|\ube0c\ub77c\uc9c8|\uba55\uc2dc\ucf54|\uc2a4\uc704\uc2a4|\uc2a4\uc6e8\ub374|\ud544\ub9ac\ud540|\ud0dc\uad6d|\ub9d0\ub808\uc774\uc2dc\uc544/;
	/* Abroad for Korea: any foreign country, city or cloud region, Japan included; Korean place names are removed
	   first, so "South Korea" is home and "Seoul and Tokyo" is abroad. */
	function krForeign(w) {
		w = String(w || "");
		if (/\b(outside|out of) (south )?korea\b|\bnorth korea\b|\bdprk\b/i.test(w)) return true;
		var x = w.replace(KR_REGION_KR, " ").replace(KR_KR_G, " ");
		return KR_FOR_H.test(x) || KR_REGION.test(x) || jpForeign(x) || JP_JP.test(x);
	}
	function krWhere(w) { w = String(w || "").trim(); return !w ? "" : krForeign(w) ? "abroad" : (KR_KR.test(w) || new RegExp(KR_REGION_KR.source, "i").test(w)) ? "kr" : "unknown"; }
	/* The PIPC's recognition of 16 September 2025 covers the EU and EEA states (review K03). */
	function krEuName(c) { return /\b(austria|belgium|bulgaria|croatia|cyprus|czech(ia| republic)?|denmark|estonia|finland|france|germany|greece|hungary|ireland|italy|latvia|lithuania|luxembourg|malta|netherlands|holland|poland|portugal|romania|slovakia|slovenia|spain|sweden|norway|iceland|liechtenstein|european union|european economic area)\b/i.test(c) || /(^|[^A-Za-z])(EU|EEA)([^A-Za-z]|$)/.test(c); }
	var KR_RRN = /resident registration|\uc8fc\ubbfc\ub4f1\ub85d/i, KR_CREDIT = /credit information|\uc2e0\uc6a9\uc815\ubcf4/i, KR_UID = /passport|driving licen[cs]e|driver'?s licen[cs]e|alien registration|\uc5ec\uad8c|\uc6b4\uc804\uba74\ud5c8|\uc678\uad6d\uc778\ub4f1\ub85d/i;
	function krThird(s) { return arr(s, "recipients").filter(function (r) { var ro = v(r, "role"); return ro === "controller" || ro === "joint" || ro === "authority"; }); }
	function krEntrusted(s) { return arr(s, "recipients").filter(function (r) { return v(r, "role") === "processor"; }); }
	function krNoRole(s) { return arr(s, "recipients").filter(function (r) { return !v(r, "role"); }); }
	function krXrows(s) { return yes(s, "krAbroad") ? arr(s, "krXrows") : []; }
	function krOffshore(s) { return v(s, "krScope") === "abroad"; }
	/* Every recipient abroad is a transfer, also for a business collecting from abroad, in its own country too
	   (PIPC drafting guidelines, item 10; review K01). */
	function krRecAbroad(s) { return arr(s, "recipients").filter(function (r) { return krWhere(v(r, "where")) === "abroad"; }); }
	function krRecUnknown(s) { return arr(s, "recipients").filter(function (r) { return krWhere(v(r, "where")) === "unknown"; }); }
	function krOwn(s, name) { return jpSame(name, v(s, "ctrlName")); }
	function krRightsWay(s) { return v(s, "krReqHow") || v(s, "rightsContact") || v(s, "ctrlEmail"); }
	function krNamesAt(list) { return joinList(list.map(function (r) { return jpTrim(v(r, "who") || "[recipient]") + " (" + v(r, "where") + ")"; })); }
	function krLc(x) { x = String(x); return /^(A|An|The) [a-z]/.test(x) || /^(Use|Write|Email|Call|Visit|Go|Open|Contact|Send|Reply|Change|Click|Tap|Select|Ask|Fill) /.test(x) ? lcFirst(x) : jpLc(x); }
	function krFor(x) { x = jpTrim(krLc(x)); return /^(\d|(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|a|an) )/i.test(x) ? "for " + x : x; }
	function krEtc(x) { return /\b(etc|and others|and more)\b|\ub4f1\s*$/i.test(String(x || "")); }
	function krSensActs(s) { return krOn(s) ? pnActs(s).filter(function (a) { return yes(a, "krSens"); }) : []; }
	function krKinds(a) { return yes(a, "krSens") ? arr(a, "krSensKinds") : []; }
	function krHasKind(a, k) { return krKinds(a).indexOf(k) !== -1; }
	function krConsentProv(r) { var p = v(r, "krProv"); return p === "consent" || p === "sep"; }
	function krConsent(s) { return pnActs(s).some(function (a) { return v(a, "krBasis") === "consent" || (krHasKind(a, "sens") && v(a, "krSensBasis") === "consent") || (krHasKind(a, "uid") && v(a, "krUidBasis") === "consent"); }) ||
		krThird(s).some(krConsentProv) || krXrows(s).some(function (r) { return v(r, "basis") === "consent"; }); }
	function krBasisCell(a) { var b = lbl(D.KR_BASES, v(a, "krBasis")); if (!b) return "[Choose the basis in Article 15(1).]";
		return b.v === "law" ? "A special provision of law, or a legal obligation: " + (v(a, "krLaw") || "[the law and article]") + " (" + b.ref + ")" : b.t + " (" + b.ref + ")"; }
	function krKindLabel(a) {
		var k = krKinds(a), n = [];
		if (k.indexOf("sens") !== -1) n.push("sensitive information");
		if (k.indexOf("uid") !== -1) n.push("unique identifiers");
		if (k.indexOf("rrn") !== -1) n.push("resident registration numbers");
		return n.length ? joinList(n) : "sensitive information or unique identifiers";
	}
	/* Laws named in a retention period: the data is kept under another law (Article 21(1) proviso). */
	function krLawRet(s) { return pnActs(s).filter(function (a) { return /\b(act|law|laws|code|decree|regulations?)\b|\brequire[sd]?\b|\ubc95/i.test(v(a, "retention")); }); }

	/* Purposes, items and retention: data processed with consent and without consent set apart (Article 22(3)). */
	function krPurposeBlocks(s) {
		var acts = pnActs(s);
		if (!acts.length) return [{ k: "p", x: "[Add the purposes of processing.]" }];
		var b = [], withC = acts.filter(function (a) { return v(a, "krBasis") === "consent"; });
		var without = acts.filter(function (a) { return v(a, "krBasis") && v(a, "krBasis") !== "consent"; }), noB = acts.filter(function (a) { return !v(a, "krBasis"); });
		var row = function (a) { return [jpTrim(v(a, "purpose") || "[purpose]") + (yes(a, "krSens") ? " (" + krKindLabel(a) + ")" : ""), v(a, "data") || "[personal information]", v(a, "retention") || "[retention period]"]; };
		if (withC.length) {
			b.push({ k: "p", x: "Personal information we process with your consent (Article 15(1)(1)). You can refuse consent; the last column says what follows if you do (Article 15(2)):" });
			b.push({ k: "table", head: ["Purpose", "Personal information", "How long we keep it", "If you refuse consent"], rows: withC.map(function (a) { return row(a).concat([v(a, "krRefuse") || "[what follows if consent is refused]"]); }) });
		}
		if (without.length) {
			b.push({ k: "p", x: "Personal information we process without your consent, and the legal basis for each (Articles 15(1) and 22(3)):" });
			b.push({ k: "table", head: ["Purpose", "Personal information", "How long we keep it", "Legal basis"], rows: without.map(function (a) { return row(a).concat([krBasisCell(a)]); }) });
		}
		if (noB.length) {
			b.push({ k: "p", x: "[Choose the basis in Article 15(1) for these purposes, so that they appear in the right table.]" });
			b.push({ k: "table", head: ["Purpose", "Personal information", "How long we keep it"], rows: noB.map(row) });
		}
		b.push({ k: "p", x: "We collect only the personal information needed for each purpose (Article 16), and use it only for these purposes unless you consent again or the law allows it (Article 18)." });
		var sp = krSensActs(s);
		if (sp.length) {
			b.push({ k: "p", x: "Sensitive information (such as health, beliefs, trade union or party membership, political views, sex life, genetic and criminal record data, biometric data used to identify a person, race or ethnicity) and unique identifiers (passport, driving licence and alien registration numbers) are processed only with consent given separately from other consents, or where a law requires or allows it. Resident registration numbers are processed only where a law specifically requires or allows it, or in the other cases in Article 24-2(1) (Articles 23, 24 and 24-2; Enforcement Decree Articles 18 and 19). We process them as follows:" });
			b.push({ k: "ul", items: sp.map(function (a) {
				var parts = [], k = krKinds(a);
				var cl = function (what, basis, law, ref1, ref2) { return what + ", " + (basis === "consent" ? "with your separate consent (" + ref1 + ")" : basis === "law" ? "as " + jpTrim(law || "[the law and article]") + " requires or allows (" + ref2 + ")" : "[separate consent, or the law that requires or allows it]"); };
				if (k.indexOf("sens") !== -1) parts.push(cl("sensitive information", v(a, "krSensBasis"), v(a, "krSensLaw"), "Article 23(1)(1)", "Article 23(1)(2)"));
				if (k.indexOf("uid") !== -1) parts.push(cl("passport, driving licence or alien registration numbers", v(a, "krUidBasis"), v(a, "krUidLaw"), "Article 24(1)(1)", "Article 24(1)(2)"));
				if (k.indexOf("rrn") !== -1) { var rb = v(a, "krRrnBasis");
					parts.push("resident registration numbers, " + (rb === "law" ? "as " + jpTrim(v(a, "krRrnLaw") || "[the law and article]") + " specifically requires or allows (Article 24-2(1)(1))" :
						rb === "urgent" ? "where clearly needed for the urgent life, body or property interests of you or someone else (Article 24-2(1)(2))" :
						rb === "notice" ? "in a case the Personal Information Protection Commission sets by notice: " + jpTrim(v(a, "krRrnLaw") || "[the notice]") + " (Article 24-2(1)(3))" : "[the basis in Article 24-2(1)]")); }
				if (!parts.length) parts.push("[say whether it is sensitive information, a unique identifier or a resident registration number, and the basis]");
				return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: parts.join("; ") + "." };
			}) });
		}
		return b;
	}
	/* Article 22-2: the legal representative's consent where consent is needed (review K06). */
	function krKidsBlocks(s) {
		return [{ k: "p", x: "Where we need consent to process the personal information of a child under 14, we ask the child's legal representative (usually a parent) for it and check that it was given: " +
			jpRef(krLc(v(s, "krKidsHow") || "[how you confirm the legal representative's consent]"), "Article 22-2(1); Enforcement Decree Article 17-2") +
			(yes(s, "krKidsCollect") ? " To ask for that consent, we collect only the legal representative's name and contact details from the child (Article 22-2(2); Enforcement Decree Article 17-2)." : "") }];
	}
	/* Article 30(1)(3-2): the destruction procedure and method, and data kept under other laws (review K05). */
	var KR_DESTROY = { del: "electronic files are deleted permanently so that they cannot be restored", anon: "where permanent deletion is technically very hard, electronic records are anonymised so that they cannot be restored",
		paper: "paper records are shredded or burnt" };
	function krDestroyBlocks(s, where) {
		var how = arr(s, "krDestroyHow").filter(function (x) { return KR_DESTROY[x]; }).map(function (x) { return KR_DESTROY[x]; });
		var b = [{ k: "p", x: "When personal information is no longer needed, because its retention period has ended or its purpose is achieved, we destroy it without delay (Article 21(1))." },
			{ k: "ul", items: [{ b: "Procedure:", x: stop(krLc(v(s, "krDestroyProc") || "[the procedure: who selects the personal information to destroy, who approves it, and when]")) },
				{ b: "Method:", x: (how.length ? joinList(how) : "[the methods you use]") + " (Enforcement Decree Article 16)." }] }];
		if (v(s, "krKeep")) b.push({ k: "p", x: "Where another law requires us to keep it, we store it separately from other personal information (Article 21(1), (3)): " + stop(krLc(v(s, "krKeep"))) });
		else if (krLawRet(s).length) b.push({ k: "p", x: "Personal information we keep because another law requires it, with that law and the period, is shown " + where + "; we store it separately from other personal information (Article 21(1), (3))." });
		return b;
	}
	/* Articles 17 and 18(2): third parties; Article 26: entrustment. */
	function krThirdBlocks(s) {
		var t = krThird(s);
		return [{ k: "ul", items: t.map(function (r) { var p = lbl(D.KR_PROV, v(r, "krProv")), law = v(r, "krProvLaw");
			var ret = v(r, "krRet") ? "; it keeps it " + krFor(v(r, "krRet")) : krConsentProv(r) ? "; it keeps it [for how long]" : "";
			var basis = !p ? "[the basis in Article 17(1), 17(4) or 18(2)]." : p.t + (p.v === "otherlaw" ? ": " + jpTrim(law || "[the law and article]") : law && p.v === "collected" ? ": " + jpTrim(law) : "") + " (" + p.ref + ").";
			return { b: (v(r, "who") || "[recipient]") + ":", x: "for " + jpTrim(krLc(v(r, "why") || "[its purposes]")) + "; personal information provided: " + jpTrim(krLc(v(r, "krItems") || "[the items]")) + ret + ". We provide it " + basis }; }) }];
	}
	function krSubOk(x) { return !!x && !/^(none|no|n\/a)\.?$/i.test(String(x).trim()); }
	function krEntrustBlocks(s) {
		var e = krEntrusted(s);
		return [{ k: "p", x: "We entrust the following work to these service providers, who process personal information on our behalf (Article 26):" },
			{ k: "ul", items: e.map(function (r) { return { b: (v(r, "who") || "[service provider]") + ":", x: stop(v(r, "why") || "[the work entrusted]") + (krSubOk(v(r, "krSub")) ? " Its sub-processors: " + stop(krLc(v(r, "krSub"))) : "") }; }) }];
	}
	function krNoRecipBlock(s) {
		return { k: "p", x: yes(s, "krNoRecip") ? "We do not provide your personal information to third parties and do not entrust its processing to anyone else." :
			"[List the recipients, including service providers you entrust with processing, or confirm in the Korea section that there are none.]" };
	}
	/* Article 28-8; Enforcement Decree Article 31(1)(2), (4). */
	function krAbroadBlocks(s) {
		var b = [], off = krOffshore(s), ab = krRecAbroad(s), unk = krRecUnknown(s);
		if (off) b.push({ k: "p", x: "We collect personal information directly from people in Korea from outside Korea. It is processed in " + jpTrim(v(s, "krOffWhere") || "[the countries where it is processed]") + " (Enforcement Decree Article 31(1)(4))." });
		if (no(s, "krAbroad")) {
			if (ab.length) b.push({ k: "p", x: "[" + krNamesAt(ab) + (ab.length > 1 ? " are" : " is") + " located abroad: providing, entrusting or storing personal information abroad is a transfer under Article 28-8" +
				(off ? ", also in a country where you process the data" : "") + ". Answer Yes under transfers and add " + (ab.length > 1 ? "them" : "it") + ".]" });
			else if (unk.length) b.push({ k: "p", x: "[Check where " + krNamesAt(unk) + (unk.length > 1 ? " are" : " is") + " located. If outside Korea, answer Yes under transfers and add " + (unk.length > 1 ? "them" : "it") + ".]" });
			else b.push({ k: "p", x: off ? "We do not provide it to, or entrust or store it with, any other party outside Korea." : "We do not provide, entrust or store your personal information abroad." });
			return b;
		}
		if (!yes(s, "krAbroad")) { b.push({ k: "p", x: "[Say whether personal information is provided, entrusted or stored abroad.]" }); return b; }
		var rows = krXrows(s);
		b.push({ k: "p", x: "We transfer personal information abroad as follows (Article 28-8):" });
		b.push(rows.length ? { k: "ul", items: rows.map(function (r) {
			var ba = lbl(D.KR_XBASIS, v(r, "basis")), basisTxt;
			if (!ba) basisTxt = "[the basis in Article 28-8(1)]";
			else if (ba.v === "law") basisTxt = "a law, treaty or international agreement: " + jpTrim(v(r, "lawName") || "[its name and article]") + " (" + ba.ref + ")";
			else if (ba.v === "cert") basisTxt = "the recipient holds the certification " + jpTrim(v(r, "certName") || "[the certification]") + " (" + ba.ref + ")";
			else if (ba.v === "equiv") basisTxt = "the Personal Information Protection Commission has recognised the country's protection as equivalent (" + ba.ref + ")";
			else if (ba.v === "contract") basisTxt = (krOwn(s, v(r, "recipient")) ? "storage" : "entrusted processing or storage") + " needed for our contract with you, disclosed in this policy (" + ba.ref + ")";
			else basisTxt = "your separate consent (" + ba.ref + ")";
			return { b: (v(r, "recipient") || "[recipient]") + " (" + jpTrim(v(r, "country") || "[country]") + "):", x: "basis: " + basisTxt + ". Contact: " + jpTrim(v(r, "contact") || "[the recipient's contact details]") +
				". Personal information transferred: " + jpTrim(krLc(v(r, "items") || "[the items]")) + ". When and how: " + jpTrim(krLc(v(r, "when") || "[the timing and method of transfer]")) +
				". The recipient's purposes: " + jpTrim(krLc(v(r, "purpose") || "[its purposes]")) + ", and it keeps the information " + krFor(v(r, "keep") || "[for how long]") +
				". How to refuse and what follows: " + jpDot(krLc(v(r, "refuse") || "[how to refuse the transfer, the procedure and its effect]")) };
		}) } : { k: "p", x: "[Add each transfer abroad.]" });
		var miss = ab.filter(function (r) { return !rows.some(function (x) { return jpSame(v(x, "recipient"), v(r, "who")); }); });
		if (miss.length) b.push({ k: "p", x: "[Add " + krNamesAt(miss) + " to the transfers abroad, or correct " + (miss.length > 1 ? "their locations" : "its location") + ".]" });
		return b;
	}
	function krSecurityBlocks(s) {
		return [{ k: "p", x: "Measures we take to keep personal information secure (Article 29; Enforcement Decree Articles 30 and 31(1)(3)): " + stop(krLc(v(s, "krSecurity") || "[the measures: internal management plan, access rights and access control, encryption, access logs, anti-malware, physical measures]")) }];
	}
	function krCookieBlocks(s) {
		var b = [{ k: "p", x: "We use cookies and similar technologies that collect information automatically: " + jpDot(krLc(v(s, "krCookiesWhat") || "[what they are used for]")) +
			" You can refuse them: " + jpRef(krLc(v(s, "krCookiesRefuse") || "[how to refuse them, for example in the browser settings]"), "Article 30(1)(7)") }];
		if (yes(s, "krBehav")) b.push({ k: "p", x: "We allow these third parties to collect behavioural information through our services: " + stop(v(s, "krBehavWho") || "[the third parties, what they collect and how to refuse]") });
		return b;
	}
	function krPseudoBlock(s) {
		return { k: "p", x: "We process pseudonymised information: " + jpRef(krLc(v(s, "krPseudoWhat") || "[purposes, processing period, any provision or entrustment, the items pseudonymised, and the safety measures under Article 28-4]"), "Articles 28-2, 28-4 and 30(1)(4-2)") };
	}
	/* Articles 35 to 38; Enforcement Decree Articles 41, 47. */
	function krWithdrawInReq(s) { return /consent|withdraw/i.test(v(s, "krReqHow")); }
	function krRightsBlocks(s) {
		var cons = krConsent(s);
		var R = [
			{ b: "Access (Article 35).", x: "You can ask to see your personal information. We let you see it within 10 days, or tell you why we cannot (Enforcement Decree Article 41)." },
			{ b: "Correction and deletion (Article 36).", x: "You can ask us to correct or delete it. You cannot ask us to delete information that another law names as information to be collected." },
			{ b: cons ? "Suspension and withdrawal of consent (Article 37)." : "Suspension of processing (Article 37).", x: "You can ask us to stop processing it" + (cons ? ", or withdraw your consent" : "") + ". We can refuse only where the law allows, and then tell you why." }];
		if (yes(s, "krPort")) R.push({ b: "Transmission (Article 35-2).", x: "You can ask us to send you your personal information in a form a computer can process: " + stop(krLc(v(s, "krPortHow") || "[how to make a transmission request]")) +
			(yes(s, "krPort3") ? " You can also have it sent to a personal information management institution or another recipient that meets the security standards, by asking through that recipient's service; recipients and requests are shown on the PIPC's transmission support platform (OnMyData, onmydata.go.kr)." : "") });
		if (yes(s, "adm")) R.push({ b: "Automated decisions (Article 37-2).", x: "You can refuse a fully automated decision that significantly affects your rights or duties, unless it is made on your consent, under a law or for a contract with you, and you can ask for an explanation of any automated decision." });
		var fee = v(s, "krFee");
		return [{ k: "ul", items: R },
			{ k: "p", x: "How to make a request: " + stop(krLc(krRightsWay(s) || "[where and how to make a request]")) +
				(cons && !krWithdrawInReq(s) ? " To withdraw consent: " + (v(s, "withdrawHow") ? stop(krLc(v(s, "withdrawHow"))) : "[how to withdraw consent, as easily as you gave it].") : "") +
				" You can make a request through an agent, such as your legal representative or someone you authorise with a power of attorney in the form the PIPC sets (Article 38(1)). A legal representative makes requests for a child under 14; a child aged 14 or over can make them personally or through a legal representative (Article 38(2))." +
				" We check that the person making a request is you or your authorised agent." +
				(fee === "Yes" ? " We charge a fee within the actual cost: " + jpRef(krLc(v(s, "krFeeAmount") || "[the amount]"), "Article 38(3); Enforcement Decree Article 47") : fee === "No" ? " We charge no fee." : "") },
			{ k: "p", x: "If you disagree with how we handled your request, you can object: " + jpRef(krLc(v(s, "krObject") || "[how to object to a refusal]"), "Article 38(5)") }];
	}
	/* Article 37-2(3), (4); Enforcement Decree Articles 44-2 to 44-4 (review K08). */
	function krAdmBlocks(s) {
		return [{ k: "ul", items: [
			{ b: "The decision, its purpose and who it concerns:", x: stop(v(s, "admWhat") || "[the decision, its purpose and the people it applies to]") },
			{ b: "Main personal information used, and how it relates to the decision:", x: stop(v(s, "krAdmData") || "[the main types of personal information and their relation to the decision]") },
			{ b: "What is considered, and how the information is processed:", x: stop(v(s, "krAdmProc") || "[the factors considered and the processing steps]") }]
				.concat(v(s, "krAdmSens") ? [{ b: "Sensitive or children's information used:", x: stop(v(s, "krAdmSens")) }] : [])
				.concat([{ b: "How to refuse or ask for an explanation:", x: stop(v(s, "krAdmHow") || "[how to refuse the decision or ask for an explanation or review]") }]) },
			{ k: "p", x: "If you refuse a decision that significantly affects your rights or duties, we stop applying it or have a person reprocess it, and tell you the result. If you ask for an explanation, we give a concise and meaningful one; if you ask for a review, we tell you whether and how we took your views into account. We do this in writing or similar within 30 days, or tell you why we need longer, at most twice by 30 days each, unless there is good reason not to (Article 37-2(3); Enforcement Decree Articles 44-2 and 44-3)." }];
	}
	function krCpoBlocks(s) {
		var who = [];
		if (v(s, "krCpo")) who.push({ b: "Chief privacy officer:", x: v(s, "krCpo") + (v(s, "krCpoContact") ? ", " + v(s, "krCpoContact") : "") });
		if (v(s, "krDept")) who.push({ b: "Department handling privacy and complaints:", x: v(s, "krDept") + (v(s, "krDeptContact") ? ", " + v(s, "krDeptContact") : "") });
		if (!who.length) who.push({ b: "Chief privacy officer:", x: "[name, or the department, with telephone and email]" });
		return [{ k: "p", x: v(s, "krCpo") || !v(s, "krDept") ? "Our chief privacy officer is responsible for processing personal information and handles complaints and redress (Articles 30(1)(6) and 31):" :
			"The department below handles privacy work and complaints (Article 30(1)(6)):" }, { k: "ul", items: who }];
	}
	function krRepBlocks(s) {
		return [{ k: "p", x: "Our domestic representative in Korea handles complaints and redress, breach notices and requests from the regulator (Article 31-2):" },
			{ k: "ul", items: [{ b: "Name:", x: v(s, "krRepName") || "[name; for a company, its name and the name of its representative]" }, { b: "Address:", x: v(s, "krRepAddr") || "[address or place of business in Korea]" },
				{ b: "Telephone:", x: v(s, "krRepTel") || "[telephone number in Korea]" }, { b: "Email:", x: v(s, "krRepEmail") || "[email address]" }] }];
	}
	var KR_REMEDY = [{ k: "p", x: "If you need help with an infringement of your personal information, you can also contact:" },
		{ k: "ul", items: [{ b: "Personal Information Dispute Mediation Committee:", x: "1833-6972, www.kopico.go.kr" }, { b: "Personal Information Infringement Report Center:", x: "118, privacy.kisa.or.kr" }, { b: "Korean National Police Agency, cyber crime:", x: "182, ecrm.police.go.kr" }] }];
	function krChangeBlocks(s, sec) {
		return [{ k: "p", x: "This " + (sec ? "section" : "policy") + " applies from " + (fmtDate(v(s, "effective")) || "[date]") + "." +
			(yes(s, "krFirst") ? "" : " " + (v(s, "krPrev") ? "Earlier versions, with the periods they applied: " + stop(krLc(v(s, "krPrev"))) : "[Say where earlier versions are published, with the periods they applied.]")) +
			" We announce changes that significantly affect your rights before or when they take effect, with a comparison of the old and new text." }];
	}
	function krCriteriaOk(s) { return yes(s, "krFurtherUse") && !!v(s, "krFurtherCrit"); }
	function krFurtherTxt(s) {
		var f = v(s, "krFurther");
		return f === "consent" ? "We will ask for your separate consent first (Articles 18(2)(1), 18(3))." :
			f === "related" ? "It is reasonably related to the original purpose, so we use or provide it without consent (Articles 15(3), 17(4); Enforcement Decree Article 14-2)" +
				(krCriteriaOk(s) ? ", on the criteria in this policy." : ". [Publish the criteria you apply (Enforcement Decree Article 14-2(2)).]") :
			"[Say whether you will ask for consent, or rely on Articles 15(3) and 17(4).]";
	}
	function krFurtherBlock(s) { return { k: "p", x: "We use or provide personal information without consent within a scope reasonably related to the original purpose, on these criteria: " + jpRef(krLc(v(s, "krFurtherCrit") || "[the criteria]"), "Articles 15(3), 17(4); Enforcement Decree Article 14-2") }; }

	/* The "Additional information for people in Korea" section of a notice led by another law. */
	function krSection(s, secs, lawName) {
		var b = [], H = function (t) { b.push({ k: "h3", x: t }); };
		var other = secs.filter(Boolean).map(String), ctrl = v(s, "ctrlName") || "[Organisation]";
		b.push({ k: "p", x: "For people in Korea, the Personal Information Protection Act (PIPA) applies, and this section is our privacy policy under its Article 30. " + ctrl + " processes personal information as a personal information controller. The rights and choices in this section are those this law gives you." +
			(other.length ? " " + (other.length > 1 ? "Sections " : "Section ") + joinList(other) + (other.length > 1 ? " apply" : " applies") + " to you only where " + lawName + " applies to our processing of your data." : "") });
		H("Purposes, personal information and retention");
		Array.prototype.push.apply(b, krPurposeBlocks(s));
		if (yes(s, "krKids")) { H("Children under 14"); Array.prototype.push.apply(b, krKidsBlocks(s)); }
		H("Destruction");
		Array.prototype.push.apply(b, krDestroyBlocks(s, "in the table above"));
		H("Third parties and entrusted processing");
		if (!arr(s, "recipients").length) b.push(krNoRecipBlock(s));
		if (krThird(s).length) Array.prototype.push.apply(b, krThirdBlocks(s));
		if (krEntrusted(s).length) Array.prototype.push.apply(b, krEntrustBlocks(s));
		krNoRole(s).forEach(function (r) { b.push({ k: "p", x: "[Give the role of " + (v(r, "who") || "this recipient") + ": a service provider acting for you, or a third party.]" }); });
		if (yes(s, "krFurtherUse")) { H("Further use without consent"); b.push(krFurtherBlock(s)); }
		H(krOffshore(s) ? "Collection from abroad and transfers abroad" : "Transfers abroad");
		Array.prototype.push.apply(b, krAbroadBlocks(s));
		H("Security measures");
		Array.prototype.push.apply(b, krSecurityBlocks(s));
		if (yes(s, "krSensPublic")) { H("Sensitive information that can become public"); b.push({ k: "p", x: jpRef(v(s, "krSensPublicHow") || "[what can become public, and how to choose not to make it public]", "Article 23(3)") }); }
		if (yes(s, "krPseudo")) { H("Pseudonymised information"); b.push(krPseudoBlock(s)); }
		if (yes(s, "krCookies")) { H("Cookies and automatic collection"); Array.prototype.push.apply(b, krCookieBlocks(s)); }
		H("Your rights in Korea");
		Array.prototype.push.apply(b, krRightsBlocks(s));
		if (yes(s, "adm")) { H("Automated decisions"); Array.prototype.push.apply(b, krAdmBlocks(s)); }
		H(v(s, "krCpo") || !v(s, "krDept") ? "Chief privacy officer" : "Privacy department");
		Array.prototype.push.apply(b, krCpoBlocks(s));
		if (yes(s, "krRep")) { H("Domestic representative"); Array.prototype.push.apply(b, krRepBlocks(s)); }
		H("Remedies");
		Array.prototype.push.apply(b, KR_REMEDY);
		H("Changes");
		Array.prototype.push.apply(b, krChangeBlocks(s, true));
		if (yes(s, "further")) b.push({ k: "p", x: "For the planned new use described in this notice: " + lcFirst(krFurtherTxt(s)) });
		return b;
	}

	/* Part S rows. led: Korea sets the main text. */
	function krChecks(s, led) {
		var checks = [], delivery = [], acts = pnActs(s), off = krOffshore(s), cons = krConsent(s);
		var pl = function (list) { return joinList(list.map(function (a) { return "\"" + jpTrim(v(a, "purpose") || "[purpose]") + "\""; })); };
		var nm = function (list, key) { return joinList(list.map(function (r) { return jpTrim(v(r, key || "who") || "[recipient]"); })); };
		var pick = function (id, m, w, c, okNote, naNote) { return m.length ? chk(id, "missing", m.concat(w, c).join(" ")) : w.length ? chk(id, "warn", w.concat(c).join(" ")) : c.length ? chk(id, "check", c.join(" ")) : naNote ? chk(id, "na", naNote) : chk(id, "ok", okNote || ""); };
		if (led) checks.push(v(s, "ctrlName") ? chk("S01", "ok", "Titled \"Privacy Policy\" with the controller's name (PIPC drafting guidelines, item 1).") : chk("S01", "missing", "Add the controller's name."));
		checks.push(!v(s, "krScope") ? chk("S02", "missing", "Say whether you have an address or office in Korea, or collect personal information directly from people in Korea from abroad.") :
			off && !v(s, "krOffWhere") ? chk("S02", "missing", "Name every country where you process the personal information you collect from abroad (Enforcement Decree Article 31(1)(4)).") :
			chk("S02", "ok", off ? "Collecting directly from abroad: the countries where the data is processed are named." : "An address or office in Korea."));
		var vp = acts.filter(function (a) { return D.LINT.vaguePurpose.test(v(a, "purpose")); }), noData = acts.filter(function (a) { return !v(a, "data"); });
		checks.push(!acts.length ? chk("S03", "missing", "Add the purposes of processing (Article 30(1)(1)).") : vp.length ? chk("S03", "warn", "Make each purpose specific: " + stop(pl(vp))) : chk("S03", "ok"));
		var hasC = acts.some(function (a) { return v(a, "krBasis") === "consent"; }), hasW = acts.some(function (a) { return v(a, "krBasis") && v(a, "krBasis") !== "consent"; });
		checks.push(!acts.length ? chk("S04", "na", "No purposes yet.") : noData.length ? chk("S04", "missing", "Give the personal information for " + stop(pl(noData)) + " List each item, not \"etc.\" (Enforcement Decree Article 31(1)(1)).") :
			chk("S04", "ok", hasC && hasW ? "Data processed with consent and without consent are listed separately, with the legal basis for the second (Article 22(3))." : hasW ? "No purpose relies on consent: the legal basis is given for each (Article 22(3))." : hasC ? "Every purpose relies on consent." : ""));
		/* S05: the basis for each purpose */
		var noB = acts.filter(function (a) { return !lbl(D.KR_BASES, v(a, "krBasis")); }), noLaw = acts.filter(function (a) { return v(a, "krBasis") === "law" && !v(a, "krLaw"); });
		var noRef = acts.filter(function (a) { return v(a, "krBasis") === "consent" && !v(a, "krRefuse"); });
		var pubB = acts.filter(function (a) { return v(a, "krBasis") === "public"; }), legit = acts.filter(function (a) { return v(a, "krBasis") === "legit"; });
		var s05m = [], s05w = [], s05c = [];
		if (noB.length) s05m.push("Choose the basis in Article 15(1) for " + stop(pl(noB)));
		if (noLaw.length) s05m.push("Name the law and the article for " + stop(pl(noLaw)));
		if (noRef.length) s05m.push("Say what follows if people refuse consent for " + pl(noRef) + " (Article 15(2)(4)).");
		if (pubB.length && no(s, "publicBody")) s05m.push("Article 15(1)(3) is for public institutions only, and you are not one: choose another basis for " + stop(pl(pubB)));
		if (pubB.length && !v(s, "publicBody")) s05c.push("Article 15(1)(3) is for public institutions only: answer whether you are one, for " + stop(pl(pubB)));
		if (legit.length) s05w.push("Legitimate interests must clearly override the person's rights, be substantially related and stay within a reasonable scope (Article 15(1)(6)): check " + stop(pl(legit)));
		checks.push(!acts.length ? chk("S05", "na", "No purposes yet.") : pick("S05", s05m, s05w, s05c, hasC ? "Ask for consent for each item separately, with the purposes, items, retention and the right to refuse (Articles 15(2), 22)." : ""));
		/* S06: sensitive information, unique identifiers and resident registration numbers (review K04, K17) */
		var unS = acts.filter(function (a) { return !v(a, "krSens"); }), sens = krSensActs(s);
		var s06m = [], s06w = [], s06c = [];
		if (unS.length) s06m.push("Answer for each purpose whether it uses sensitive information or unique identifiers (Articles 23, 24, 24-2): " + stop(pl(unS)));
		sens.forEach(function (a) { var k = krKinds(a), p = "\"" + jpTrim(v(a, "purpose") || "[purpose]") + "\"", miss = [];
			if (!k.length) miss.push("whether it uses sensitive information, unique identifiers or resident registration numbers");
			if (k.indexOf("sens") !== -1) { if (!v(a, "krSensBasis")) miss.push("the basis for the sensitive information"); else if (v(a, "krSensBasis") === "law" && !v(a, "krSensLaw")) miss.push("the law and article for the sensitive information"); }
			if (k.indexOf("uid") !== -1) { if (!v(a, "krUidBasis")) miss.push("the basis for the unique identifiers"); else if (v(a, "krUidBasis") === "law" && !v(a, "krUidLaw")) miss.push("the law and article for the unique identifiers"); }
			if (k.indexOf("rrn") !== -1) { var rb = v(a, "krRrnBasis"); if (!rb) miss.push("the basis in Article 24-2(1) for resident registration numbers"); else if ((rb === "law" || rb === "notice") && !v(a, "krRrnLaw")) miss.push(rb === "law" ? "the law and article that requires or allows resident registration numbers" : "the PIPC notice relied on"); }
			if (miss.length) s06m.push("For " + p + ", give " + joinList(miss) + "."); });
		var rrnTxt = acts.filter(function (a) { return KR_RRN.test(v(a, "data")) && !krHasKind(a, "rrn"); }), uidTxt = acts.filter(function (a) { return KR_UID.test(v(a, "data")) && !krHasKind(a, "uid"); });
		if (rrnTxt.length) s06m.push("The personal information for " + pl(rrnTxt) + " includes resident registration numbers: mark them, with the basis in Article 24-2(1). Consent is never enough for them.");
		if (uidTxt.length) s06w.push("The personal information for " + pl(uidTxt) + " looks like it includes passport, driving licence or alien registration numbers: mark them as unique identifiers (Article 24; Enforcement Decree Article 19).");
		var other = acts.filter(function (a) { return !yes(a, "krSens") && ((gdprLed(s) && art9Of(s, a)) || (inReg(s, "br") && v(a, "brSens")) || (inReg(s, "can") && yes(a, "canSens")) || (inReg(s, "cn") && yes(a, "cnSens")) || (inReg(s, "jp") && yes(a, "jpSens"))); });
		if (other.length) s06w.push("Another law in this notice treats the data for " + pl(other) + " as sensitive. Check whether it is sensitive information under Article 23 and Enforcement Decree Article 18.");
		var anyRrn = sens.some(function (a) { return krHasKind(a, "rrn"); }), sensCons = sens.some(function (a) { return (krHasKind(a, "sens") && v(a, "krSensBasis") === "consent") || (krHasKind(a, "uid") && v(a, "krUidBasis") === "consent"); });
		var s06ok = [];
		if (sensCons) s06ok.push("Ask for consent to sensitive information and to unique identifiers separately from other consents (Articles 23(1)(1), 24(1)(1)).");
		if (anyRrn) s06ok.push("Encrypt resident registration numbers, and offer a way to sign up on your website without one (Article 24-2(2), (3)).");
		s06ok.push("Secure them (Articles 23(2), 24(3), 29).");
		checks.push(!acts.length ? chk("S06", "na", "No purposes yet.") : pick("S06", s06m, s06w, s06c, s06ok.join(" "), sens.length ? "" : (s06m.length || s06w.length ? "" : "No sensitive information or unique identifiers.")));
		var noRet = acts.filter(function (a) { return !v(a, "retention"); }), vagRet = acts.filter(function (a) { return /as long as (necessary|needed)|until no longer needed/i.test(v(a, "retention")); });
		checks.push(!acts.length ? chk("S07", "na", "No purposes yet.") : noRet.length ? chk("S07", "missing", "Give the processing and retention period for " + pl(noRet) + " (Article 30(1)(2)).") :
			vagRet.length ? chk("S07", "warn", "Give a concrete period, or the criteria that decide it, for " + stop(pl(vagRet)) + " Where a law sets the period, name it.") : chk("S07", "ok"));
		/* S08: destruction (review K05) */
		var s08m = [], s08c = [];
		if (!v(s, "krDestroyProc")) s08m.push("Describe the destruction procedure: who selects the personal information to destroy, who approves it, and when (Article 30(1)(3-2); PIPC drafting guidelines, item 6).");
		if (!arr(s, "krDestroyHow").length) s08m.push("Choose the destruction methods you use (Enforcement Decree Article 16).");
		if (!v(s, "krKeep") && krLawRet(s).length) s08c.push("The policy points to the retention periods for data kept under other laws: check that they name the law, the items and the period for " + pl(krLawRet(s)) + " (Article 30(1)(3-2); PIPC drafting guidelines, item 6).");
		checks.push(pick("S08", s08m, [], s08c, v(s, "krKeep") ? "" : "If another law requires you to keep data after its purpose ends, add the law, the items and the period."));
		/* S09: third parties (review K02, K15, K16) */
		var recs = arr(s, "recipients"), third = krThird(s), nr = krNoRole(s), ent = krEntrusted(s);
		var s09m = [], s09w = [], s09c = [];
		if (!recs.length && !yes(s, "krNoRecip")) s09m.push("List the recipients, including service providers you entrust with processing, or confirm in the Korea section that there are none.");
		var lawBases = acts.some(function (a) { return ["law", "public", "vital", "legit", "safety"].indexOf(v(a, "krBasis")) !== -1; }), contractActs = acts.some(function (a) { return v(a, "krBasis") === "contract"; });
		third.forEach(function (r) { var miss = [], who = jpTrim(v(r, "who") || "[recipient]"), p = v(r, "krProv");
			if (!lbl(D.KR_PROV, p)) miss.push("the basis"); if (!v(r, "why")) miss.push("its purposes"); if (!v(r, "krItems")) miss.push("the items provided");
			if (krConsentProv(r) && !v(r, "krRet")) miss.push("its retention period");
			if (p === "otherlaw" && !v(r, "krProvLaw")) miss.push("the law and article that provides for it");
			if (miss.length) s09m.push("For " + who + ", give " + joinList(miss) + " (Articles 17, 18, 30(1)(3)).");
			if (p === "collected") {
				if (!lawBases) s09m.push("Article 17(1)(2) covers only data collected under Article 15(1)(2), (3) or (5) to (7), and no purpose here has one of those bases: choose another basis for " + who + ", such as Article 18(2)(2) for a disclosure another law requires.");
				else if (contractActs) s09w.push("Article 17(1)(2) does not cover data collected for a contract (Article 15(1)(4)): check that what you provide to " + who + " was collected on a law, public duties, urgent interests, legitimate interests or public safety.");
				if (!v(r, "krProvLaw")) s09c.push("Name the law where a law is the basis for providing data to " + who + " (PIPC drafting guidelines, item 7).");
			}
			if (!krConsentProv(r) && p && !v(r, "krRet")) s09c.push("Give " + who + "'s retention period where a law sets it (recommended, PIPC drafting guidelines, item 7)."); });
		if (nr.length) s09m.push("Give each recipient's role: " + stop(nm(nr)));
		var etc = recs.filter(function (r) { return krEtc(v(r, "who")); });
		if (etc.length) s09w.push("Name each recipient, not \"etc.\" (PIPC drafting guidelines, items 7, 9): " + stop(nm(etc)));
		checks.push(pick("S09", s09m, s09w, s09c, third.some(krConsentProv) ? "Ask for consent to provision separately, with the recipient, its purposes, the items, its retention and the right to refuse (Articles 17(2), 18(3), 22(1))." : "",
			!third.length && !s09m.length && !s09w.length ? "No provision to third parties." : ""));
		/* S10: entrustment and sub-processors (review K09) */
		var noWork = ent.filter(function (r) { return !v(r, "why"); }), noSub = ent.filter(function (r) { return !v(r, "krSub"); });
		checks.push(!ent.length ? chk("S10", "na", "No entrusted processing.") : noWork.length ? chk("S10", "missing", "Say what work is entrusted to " + nm(noWork) + " (Article 26(2)).") :
			noSub.length ? chk("S10", "check", "List the sub-processors of " + nm(noSub) + " and their work, or link their lists, or answer none: re-entrustees are disclosed too (Article 26(2); PIPC drafting guidelines, item 9). Re-entrusting needs your consent (Article 26(6)).") :
			chk("S10", "ok", "Entrustees, sub-processors and their work are disclosed (Article 26(2); Enforcement Decree Article 28(2))."));
		/* S11: transfers abroad (Article 28-8; review K01, K03, K18, K30) */
		var xr = krXrows(s), ab = krRecAbroad(s), unk = krRecUnknown(s);
		var s11m = [], s11w = [], s11c = [];
		if (!v(s, "krAbroad")) s11m.push("Answer whether personal information is provided, entrusted or stored abroad (Article 28-8).");
		if (yes(s, "krAbroad") && !xr.length) s11m.push("Add each transfer abroad.");
		var equivUsed = false;
		xr.forEach(function (r) { var miss = [], ba = v(r, "basis"), rn = jpTrim(v(r, "recipient") || "[recipient]");
			["recipient", "country", "contact", "items", "when", "purpose", "keep", "refuse"].forEach(function (k) { if (!v(r, k)) miss.push(k); });
			if (!lbl(D.KR_XBASIS, ba)) miss.push("basis"); if (ba === "law" && !v(r, "lawName")) miss.push("lawName"); if (ba === "cert" && !v(r, "certName")) miss.push("certName");
			if (miss.length) s11m.push("For the transfer to " + rn + ", give " + joinList(miss.map(function (k) { return { recipient: "the recipient", country: "the country", contact: "its contact details", items: "the items", when: "the timing and method", purpose: "its purposes", keep: "its retention period", refuse: "how to refuse and the effect", basis: "the basis in Article 28-8(1)", lawName: "the law or treaty", certName: "the certification" }[k]; })) + " (Article 28-8(2); Enforcement Decree Article 31(1)(2)).");
			if (ba === "contract" && !krOwn(s, v(r, "recipient")) && !arr(s, "recipients").some(function (x) { return jpSame(v(x, "who"), v(r, "recipient")) && v(x, "role") === "processor"; }))
				s11m.push("Article 28-8(1)(3) covers only entrusted processing or storage for a contract with the person: " + rn + " is neither a listed service provider nor your own storage.");
			if (ba === "equiv") { equivUsed = true;
				if (v(r, "country") && !krEuName(v(r, "country"))) s11w.push("The PIPC has recognised the EU and EEA states (Norway, Iceland and Liechtenstein) as equivalent: check " + jpTrim(v(r, "country")) + ".");
				if (KR_RRN.test(v(r, "items")) || KR_CREDIT.test(v(r, "items"))) s11m.push("The equivalence recognition does not cover resident registration numbers or personal credit information: choose another basis for what goes to " + rn + ".");
				else if (anyRrn) s11w.push("You process resident registration numbers: check that none go to " + rn + ", as the equivalence recognition does not cover them."); }
		});
		var unl = ab.filter(function (r) { return !xr.some(function (x) { return jpSame(v(x, "recipient"), v(r, "who")); }); });
		if (yes(s, "krAbroad") && unl.length) s11m.push("Add " + krNamesAt(unl) + " to the transfers abroad, or correct " + (unl.length > 1 ? "their locations" : "its location") + ". Entrusting or storing abroad is a transfer too" + (off ? ", also in a country where you process the data (PIPC drafting guidelines, item 10)" : "") + ".");
		if (no(s, "krAbroad") && ab.length) s11m.push(krNamesAt(ab) + (ab.length > 1 ? " are" : " is") + " located abroad while the answer is No: answer Yes and add " + (ab.length > 1 ? "them" : "it") + " (Article 28-8(1)" + (off ? "; PIPC drafting guidelines, item 10" : "") + ").");
		if (no(s, "krAbroad") && !ab.length && unk.length) s11m.push("Check where " + krNamesAt(unk) + (unk.length > 1 ? " are" : " is") + " located, and give the city or country: the policy cannot say there are no transfers until then.");
		else if (unk.length) s11c.push("Check whether these recipients are in Korea: " + stop(krNamesAt(unk)));
		if (equivUsed) s11c.push("The PIPC's equivalence recognition of 16 September 2025 runs until 15 September 2028 and excludes resident registration numbers and personal credit information: confirm it on the PIPC's website, and again before it ends.");
		if (yes(s, "krAbroad")) s11c.push("Agree security measures and complaint and dispute handling with each recipient in the contract (Enforcement Decree Article 29-10). Onward transfers follow the same rules (Article 28-11).");
		checks.push(pick("S11", s11m, s11w, s11c, "", no(s, "krAbroad") ? "No transfer abroad." : ""));
		checks.push(!v(s, "krSecurity") ? chk("S12", "missing", "Describe the security measures taken (Enforcement Decree Articles 30, 31(1)(3)).") : chk("S12", "ok"));
		/* S13: rights (review K14, K25) */
		var s13m = [], s13c = [];
		if (!krRightsWay(s)) s13m.push("Say how people make requests, no harder than how you collect the data (Article 38(4); Enforcement Decree Article 41).");
		if (cons && !v(s, "withdrawHow") && !krWithdrawInReq(s)) s13m.push("Say how people withdraw consent, as easily as they gave it (Articles 37(1), 38(4)).");
		if (!v(s, "krObject")) s13m.push("Say how people object to a refusal of their request (Article 38(5)).");
		if (yes(s, "krFee") && !v(s, "krFeeAmount")) s13m.push("Give the fee, within the actual cost (Enforcement Decree Article 47).");
		if (yes(s, "krPort") && !v(s, "krPortHow")) s13m.push("Say how people make a transmission request (Article 35-2).");
		if (!v(s, "krPort")) s13c.push("Answer whether you are a controller that must transmit personal information on request (Article 35-2 and the Enforcement Decree criteria).");
		if (yes(s, "krPort") && !v(s, "krPort3")) s13c.push("Answer whether you must also transmit to third parties (Article 35-2(2)).");
		if (!v(s, "krFee")) s13c.push("Say whether you charge a fee for requests (Article 38(3)).");
		checks.push(pick("S13", s13m, [], s13c, "Requests within 10 days for access (Enforcement Decree Article 41(4)); explain website functions for requests (PIPC drafting guidelines, item 16)."));
		var s14 = [];
		if (yes(s, "adm")) { if (!v(s, "admWhat")) s14.push("the decision, its purpose and who it concerns"); if (!v(s, "krAdmData")) s14.push("the main personal information and its relation to the decision");
			if (!v(s, "krAdmProc")) s14.push("the factors and the processing steps"); if (!v(s, "krAdmHow")) s14.push("how to refuse or ask for an explanation"); }
		var admSensNeeded = yes(s, "adm") && (sens.length || yes(s, "krKids")) && !v(s, "krAdmSens");
		checks.push(led && !v(s, "adm") ? chk("S14", "missing", "Answer whether you make fully automated decisions, AI systems included (Article 37-2).") :
			!led && !yes(s, "adm") ? chk("S14", "check", "The PIPA covers every decision made by a fully automated system, AI systems included, not only significant ones: if you make any, publish the five items in Enforcement Decree Article 44-4(1) (Article 37-2(2), (4)).") :
			!yes(s, "adm") ? chk("S14", "na", "No fully automated decisions.") : s14.length ? chk("S14", "missing", "For automated decisions, give " + joinList(s14) + " (Article 37-2(4); Enforcement Decree Article 44-4(1)).") :
			admSensNeeded ? chk("S14", "warn", "You process sensitive or children's information: say whether the automated decision uses it, with the purpose and items (Enforcement Decree Article 44-4(1)(4)).") :
			chk("S14", "ok", "Publish these on the website, or tell people in writing beforehand (Enforcement Decree Article 44-4(1))."));
		var cpoName = v(s, "krCpo") || v(s, "krDept"), cpoTel = v(s, "krCpoContact") || v(s, "krDeptContact");
		checks.push(!cpoName || !cpoTel ? chk("S15", "missing", "Give the chief privacy officer's name, or the department handling privacy and complaints, with a telephone number and other contacts (Article 30(1)(6)).") :
			!/@/.test(cpoTel) || !/\d{3}/.test(cpoTel) ? chk("S15", "check", "Give both a telephone number and an email address (PIPC drafting guidelines, item 18).") :
			chk("S15", "ok", yes(s, "publicBody") ? "" : "The chief privacy officer of a private business is the owner or representative, or an officer, or, without officers, the head of the privacy department (Enforcement Decree Article 32(2)(2))."));
		/* S16: domestic representative (review K10) */
		var repMiss = ["krRepName", "krRepAddr", "krRepTel", "krRepEmail"].filter(function (k) { return !v(s, k); });
		checks.push(!v(s, "krScope") ? chk("S16", "na", "Answer row S02 first.") : !off ? chk("S16", "na", "An address or office in Korea.") :
			!v(s, "krRepNeed") ? chk("S16", "missing", "Answer whether you meet a threshold for a domestic representative: total turnover of KRW 1 trillion or more in the previous year, personal information of 1 million or more people in Korea stored (daily average over the last three months of the previous year), or a PIPC decision (Article 31-2(1); Enforcement Decree Article 32-3).") :
			yes(s, "krRepNeed") && !yes(s, "krRep") ? chk("S16", "missing", "You meet a threshold: designate a domestic representative in writing (Article 31-2(1)) and give its details.") :
			yes(s, "krRep") && repMiss.length ? chk("S16", "missing", "Give the domestic representative's name, address, telephone and email (Article 31-2(4)); leaving them out is fined up to KRW 10 million.") :
			yes(s, "krRep") ? chk("S16", "ok", "Choose it from a Korean subsidiary or controlled company where there is one (Article 31-2(2)).") : chk("S16", "na", "Below the thresholds, and none designated."));
		/* S17: children (review K06) */
		var kidsC = [];
		if (yes(s, "krKids") && !v(s, "krKidsCollect")) kidsC.push("Say whether you collect the legal representative's name and contact details from the child (Article 22-2(2)).");
		if (yes(s, "krKids") && !cons) kidsC.push("No purpose relies on consent: the legal representative's consent applies only where consent is needed (Article 22-2(1)). Check that the children section fits.");
		checks.push(!v(s, "krKids") ? chk("S17", "missing", "Answer whether you process the personal information of children under 14 (Article 22-2).") :
			yes(s, "krKids") && !v(s, "krKidsHow") ? chk("S17", "missing", "Say how you confirm the legal representative's consent (Article 22-2(1); Enforcement Decree Article 17-2).") :
			yes(s, "krKids") ? pick("S17", [], [], kidsC, "Write notices to children in an easy format and plain language (Article 22-2(3)).") : chk("S17", "na", "No children under 14."));
		/* S18: cookies (review K10) */
		var online = has(s, "channel", "web") || has(s, "channel", "app"), noChannel = !arr(s, "channel").length;
		checks.push(!v(s, "krCookies") ? (online ? chk("S18", "missing", "Answer whether your website or app uses cookies or other automatic collection (Article 30(1)(7)).") :
				noChannel ? chk("S18", "check", "Answer where people meet the policy, and whether you use cookies or other automatic collection (Article 30(1)(7)).") : chk("S18", "na", "No website or app.")) :
			yes(s, "krCookies") && (!v(s, "krCookiesWhat") || !v(s, "krCookiesRefuse")) ? chk("S18", "missing", "Say what the cookies are for and how people refuse them (Article 30(1)(7)).") :
			yes(s, "krBehav") && !v(s, "krBehavWho") ? chk("S18", "missing", "Name the third parties that collect behavioural information and how people refuse it (PIPC drafting guidelines, item 15).") :
			yes(s, "krCookies") ? chk("S18", "ok") : chk("S18", "na", "No automatic collection."));
		checks.push(!v(s, "krSensPublic") ? chk("S19", "check", "Answer whether information made public in your service can reveal sensitive information (Article 23(3)).") :
			yes(s, "krSensPublic") && !v(s, "krSensPublicHow") ? chk("S19", "missing", "Say what can become public and how people choose not to make it public (Articles 23(3), 30(1)(3-3)).") :
			yes(s, "krSensPublic") ? chk("S19", "ok", "Tell people before you provide the service (Article 23(3)).") : chk("S19", "na", "No sensitive information made public."));
		checks.push(!v(s, "krPseudo") ? chk("S20", "missing", "Answer whether you process pseudonymised information (Article 30(1)(4-2)).") :
			yes(s, "krPseudo") && !v(s, "krPseudoWhat") ? chk("S20", "missing", "Describe the processing of pseudonymised information (Article 30(1)(4-2)).") :
			yes(s, "krPseudo") ? chk("S20", "check", "Cover the six items: purposes, processing period, any provision, any entrustment, the items pseudonymised, and the safety measures under Article 28-4 (PIPC drafting guidelines, item 13).") : chk("S20", "na", "No pseudonymised information."));
		/* S21: further use criteria (review K15) */
		var relRec = third.filter(function (r) { return v(r, "krProv") === "related"; });
		checks.push(relRec.length && !yes(s, "krFurtherUse") ? chk("S21", "missing", nm(relRec) + (relRec.length > 1 ? " receive" : " receives") + " personal information under Article 17(4), which you do continuously: answer Yes and publish the criteria (Enforcement Decree Article 14-2(2)).") :
			!v(s, "krFurtherUse") ? chk("S21", "check", "Answer whether you regularly use or provide data without consent within a scope reasonably related to the original purpose (Articles 15(3), 17(4)).") :
			yes(s, "krFurtherUse") && !v(s, "krFurtherCrit") ? chk("S21", "missing", "Publish the criteria for continuous further use or provision (Enforcement Decree Article 14-2(2)).") :
			yes(s, "krFurtherUse") ? chk("S21", "ok", "The chief privacy officer checks that the criteria are followed (Enforcement Decree Article 14-2(2)).") : chk("S21", "na", "No continuous further use or provision."));
		checks.push(chk("S22", "ok", "Remedies listed (PIPC drafting guidelines, item 20, recommended). Keep the contacts current."));
		checks.push(!v(s, "effective") ? chk("S23", "missing", "Give the date this policy applies from (PIPC drafting guidelines, item 24).") :
			yes(s, "krFirst") ? chk("S23", "ok", "First version: publish earlier versions, with their periods, once the policy changes.") :
			!v(s, "krPrev") ? chk("S23", "missing", "Say where earlier versions are published, with the periods they applied, or answer that this is your first policy (PIPC drafting guidelines, item 24).") : chk("S23", "ok"));
		checks.push(/korean|\ud55c\uad6d\uc5b4/i.test(v(s, "languages")) ? chk("S24", "check", "This generator writes English. Check the Korean version.") :
			chk("S24", "warn", "The policy must be easy to understand for people in Korea; a business abroad that the Act applies to writes it in Korean (PIPC drafting guidelines, p. 12). This generator writes English only."));
		if (yes(s, "further")) {
			var fm = [];
			if (led) { if (!v(s, "furtherWhat")) fm.push("the new purpose"); if (!v(s, "furtherStart")) fm.push("when it starts"); if (!v(s, "furtherData")) fm.push("the personal information used"); if (!v(s, "furtherRetention")) fm.push("how long it is kept"); }
			if (!v(s, "krFurther")) fm.push("whether it needs consent or is reasonably related to the original purpose");
			if (v(s, "krFurther") === "related" && !krCriteriaOk(s)) fm.push("the criteria you apply, in the further use answer (row S21)");
			checks.push(fm.length ? chk("S32", "missing", "For the new purpose, give " + joinList(fm) + " (Articles 15(3), 17(4), 18(2)).") :
				chk("S32", "check", v(s, "krFurther") === "consent" ? "Ask for separate consent before the new use, with the purposes, items, retention and the right to refuse (Articles 18(2)(1), 18(3), 22(1))." :
					"Check the four criteria in Enforcement Decree Article 14-2(1) against the new purpose."));
		}
		checks.push(chk("S25", "check", "Not modelled: the amendments in force on 9 March 2027 (use of personal information to develop AI technology, Articles 28-12 to 28-15) and 1 July 2027 (mandatory certification above thresholds, Article 32-2(1)). From 9 March 2027, a controller that uses personal information to develop AI with the PIPC's approval adds the purposes and types to this policy (Article 28-12(5)). Review the policy when they apply."));
		if (yes(s, "publicBody")) checks.push(chk("S26", "warn", "Public institutions set the policy for the files registered under Article 32, publish uses under Article 18(2) and (4), and have further rules. This generator does not model them."));
		checks.push(chk("S33", "check", "Not modelled: fixed and mobile video devices, such as CCTV, body cameras and vehicle cameras (Articles 25, 25-2; PIPC drafting guidelines, items 21, 22), and generative AI services (PIPC drafting guidelines, appendix). If you operate them, add their items to this policy or publish a separate operation policy (Article 25(7))."));
		/* Delivery */
		delivery.push(chk("S27", "check", "Post the policy continuously on the website (Enforcement Decree Article 31(2)); in an app, where people easily find it: a service menu, settings, sign-up or login (PIPC drafting guidelines). Use the title \"Privacy Policy\"."));
		if (cons) delivery.push(chk("S28", "check", "Ask for each consent separately, with the purposes, items, retention and the right to refuse and its effect; consent to marketing, sensitive information, unique identifiers, provision to third parties, use beyond the original purpose and transfers abroad separately; important items highlighted in written consent; no refusal of goods or services for refusing optional consent (Articles 15(2), 17(2), 18(3), 22, 28-8(2); Enforcement Decree Article 17)."));
		if (pnSourceIndirect(s)) delivery.push(chk("S29", "check", "For data from other sources, tell people on request at once the source, the purposes and their right to suspension or withdrawal (Article 20(1)). With sensitive or identifying data of 50,000 or more people, or personal data of 1 million or more, tell them within three months, without request, about data a third party provided to you with their consent (Article 17(1)(1)) (Article 20(2); Enforcement Decree Article 15-2)."));
		if (ent.length) delivery.push(chk("S30", "check", "Entrust under a written agreement; publish entrustees and sub-processors and their work continuously on the website; for promotion or sales work, tell each person (Article 26(1) to (3); Enforcement Decree Article 28)."));
		if (yes(s, "krKids")) delivery.push(chk("S31", "check", "Confirm the legal representative's consent by a method in Enforcement Decree Article 17-2 (text message, card, mobile identity check, signed paper, email or telephone)."));
		delivery.push(chk("S34", "check", "If you process sensitive or unique identifying information of 50,000 or more people, or personal information of 1 million or more (daily average over the last three months of the previous year), tell people at least once a year how their data was used and provided, or how to check it (Article 20-2; Enforcement Decree Article 15-3)."));
		return { checks: checks, delivery: delivery };
	}

	/* A privacy policy led by Korea's PIPA. */
	function krLead(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]";
		var title = (v(s, "ctrlName") ? v(s, "ctrlName") + " " : "") + "Privacy Policy";
		var acts = pnActs(s), direct = pnSourceDirect(s), off = krOffshore(s), cons = krConsent(s);
		var meta = [ctrl];
		if (v(s, "version")) meta.push("Version " + v(s, "version"));
		if (v(s, "effective")) meta.push("Effective " + fmtDate(v(s, "effective")));
		var num = {}, c = 2;
		if (yes(s, "krKids")) num.kids = c++;
		num.destroy = c++; num.share = c++;
		if (yes(s, "krFurtherUse")) num.further = c++;
		num.abroad = c++; num.sec = c++;
		if (yes(s, "krSensPublic")) num.sensPub = c++;
		if (yes(s, "krPseudo")) num.pseudo = c++;
		if (yes(s, "krCookies")) num.cookies = c++;
		num.rights = c++;
		if (yes(s, "adm")) num.adm = c++;
		num.cpo = c++;
		if (yes(s, "krRep")) num.rep = c++;
		num.remedy = c++;
		if (inReg(s, "sg")) num.sg = c++;
		if (inReg(s, "au")) num.au = c++;
		if (inReg(s, "za")) num.za = c++;
		if (inReg(s, "ca")) num.ca = c++;
		if (inReg(s, "us")) num.us = c++;
		num.changes = c++;
		var cpoHead = v(s, "krCpo") || !v(s, "krDept") ? "Chief privacy officer" : "Privacy department";
		var blocks = [{ k: "h1", x: title }, { k: "meta", x: meta.map(stop).join(" ") }];
		blocks.push({ k: "p", x: ctrl + " processes personal information lawfully under the Personal Information Protection Act and related laws, and keeps it secure. Under Article 30 of the Act, this privacy policy sets out how we process and protect personal information, so that you know our procedures and we can deal with complaints quickly." });
		var first = [];
		if (acts.length) first.push({ k: "p", x: "Our purposes of processing:" }, { k: "ul", items: acts.map(function (a) { return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: stop(v(a, "data") || "[personal information]") }; }) });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		if (off) first.push({ k: "p", x: "We are based outside Korea and process your personal information in " + jpTrim(v(s, "krOffWhere") || "[the countries where it is processed]") + (yes(s, "krAbroad") ? ", and we transfer it to other parties abroad" : "") + ". Section " + num.abroad + " gives the details." });
		else if (yes(s, "krAbroad")) first.push({ k: "p", x: "We transfer personal information abroad. Section " + num.abroad + " gives the details." });
		first.push({ k: "p", x: "You can ask to see, correct or delete your personal information" + (cons ? ", to stop its processing and to withdraw consent" : " and to stop its processing") + ". Section " + num.rights + " explains how; section " + num.cpo + " gives our " + (cpoHead === "Chief privacy officer" ? "chief privacy officer" : "privacy department") + "." });
		if (num.sg) first.push({ k: "p", x: sgPointer(s, num.sg) });
		if (num.au) first.push({ k: "p", x: auPointer(s, num.au) });
		if (num.za) first.push({ k: "p", x: zaPointer(s, num.za) });
		if (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });
		if (num.us) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + num.us + " also applies to you." });
		blocks.push({ k: "box", title: "In short", blocks: first });

		blocks.push({ k: "h2", x: "1. Purposes, personal information and retention" });
		Array.prototype.push.apply(blocks, krPurposeBlocks(s));
		if (yes(s, "inferred")) blocks.push({ k: "p", x: "We also derive information about you from the information above: " + stop(v(s, "inferredWhat") || "[what is inferred, and from what]") });
		if (!yes(s, "adm") && yes(s, "profiling")) blocks.push({ k: "p", x: "We analyse information about you: " + stop(v(s, "profilingWhat") || "[the analysis and what it is used for]") });
		if (num.kids) { blocks.push({ k: "h2", x: num.kids + ". Children under 14" }); Array.prototype.push.apply(blocks, krKidsBlocks(s)); }
		blocks.push({ k: "h2", x: num.destroy + ". Destruction of personal information" });
		Array.prototype.push.apply(blocks, krDestroyBlocks(s, "in section 1"));
		blocks.push({ k: "h2", x: num.share + ". Third parties and entrusted processing" });
		if (!arr(s, "recipients").length) blocks.push(krNoRecipBlock(s));
		if (krThird(s).length) { blocks.push({ k: "p", x: "We provide personal information to these third parties:" }); Array.prototype.push.apply(blocks, krThirdBlocks(s)); }
		else if (arr(s, "recipients").length) blocks.push({ k: "p", x: "We do not provide your personal information to third parties." });
		if (krEntrusted(s).length) Array.prototype.push.apply(blocks, krEntrustBlocks(s));
		krNoRole(s).forEach(function (r) { blocks.push({ k: "p", x: "[Give the role of " + (v(r, "who") || "this recipient") + ": a service provider acting for you, or a third party.]" }); });
		if (num.further) { blocks.push({ k: "h2", x: num.further + ". Further use without consent" }); blocks.push(krFurtherBlock(s)); }
		blocks.push({ k: "h2", x: num.abroad + ". " + (off ? "Collection from abroad and transfers abroad" : "Transfers abroad") });
		Array.prototype.push.apply(blocks, krAbroadBlocks(s));
		blocks.push({ k: "h2", x: num.sec + ". Security measures" });
		Array.prototype.push.apply(blocks, krSecurityBlocks(s));
		if (num.sensPub) { blocks.push({ k: "h2", x: num.sensPub + ". Sensitive information that can become public" }); blocks.push({ k: "p", x: jpRef(v(s, "krSensPublicHow") || "[what can become public, and how to choose not to make it public]", "Article 23(3)") }); }
		if (num.pseudo) { blocks.push({ k: "h2", x: num.pseudo + ". Pseudonymised information" }); blocks.push(krPseudoBlock(s)); }
		if (num.cookies) { blocks.push({ k: "h2", x: num.cookies + ". Cookies and automatic collection" }); Array.prototype.push.apply(blocks, krCookieBlocks(s)); }
		blocks.push({ k: "h2", x: num.rights + ". Your rights and how to exercise them" });
		Array.prototype.push.apply(blocks, krRightsBlocks(s));
		if (num.adm) { blocks.push({ k: "h2", x: num.adm + ". Automated decisions" }); Array.prototype.push.apply(blocks, krAdmBlocks(s)); }
		blocks.push({ k: "h2", x: num.cpo + ". " + cpoHead });
		Array.prototype.push.apply(blocks, krCpoBlocks(s));
		if (num.rep) { blocks.push({ k: "h2", x: num.rep + ". Domestic representative" }); Array.prototype.push.apply(blocks, krRepBlocks(s)); }
		blocks.push({ k: "h2", x: num.remedy + ". Remedies" });
		Array.prototype.push.apply(blocks, KR_REMEDY);

		var krSecs = [String(num.rights), String(num.cpo), String(num.remedy)];
		var only = " Sections " + joinList(krSecs) + " apply to you only where the PIPA applies to our processing of your personal information.";
		var sgRes = null;
		if (num.sg) {
			blocks.push({ k: "h2", x: num.sg + ". " + sgHead(s) });
			Array.prototype.push.apply(blocks, sgSection(s, krSecs, "the PIPA"));
			sgRes = sgChecks(s, false);
		}
		var auRes = null;
		if (num.au) {
			blocks.push({ k: "h2", x: num.au + ". " + auHead(s) });
			Array.prototype.push.apply(blocks, auSection(s, krSecs, "the PIPA"));
			auRes = auChecks(s, false);
		}
		var zaRes = null;
		if (num.za) {
			blocks.push({ k: "h2", x: num.za + ". " + zaHead(s) });
			Array.prototype.push.apply(blocks, zaSection(s, krSecs, "the PIPA"));
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
				" Personal information used: " + stop(krLc(v(s, "furtherData") || "[the items]")) + " How long we keep it for this purpose: " + stop(krLc(v(s, "furtherRetention") || "[the period]")) },
			{ k: "p", x: krFurtherTxt(s) }] });
		Array.prototype.push.apply(blocks, krChangeBlocks(s));
		if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });

		var cr = krChecks(s, true), checks = cr.checks, delivery = cr.delivery;
		checks.push(v(s, "consequences") ? chk("P21", "ok", "", undefined, "WP260 10, 36 (good practice)") : chk("P21", "warn", "Empty. Fine only if nothing here would surprise people.", undefined, "WP260 10, 36 (good practice)"));
		if (sgRes) { Array.prototype.push.apply(checks, sgRes.checks); Array.prototype.push.apply(delivery, sgRes.delivery); }
		if (auRes) { Array.prototype.push.apply(checks, auRes.checks); Array.prototype.push.apply(delivery, auRes.delivery); }
		if (zaRes) { Array.prototype.push.apply(checks, zaRes.checks); Array.prototype.push.apply(delivery, zaRes.delivery); }
		if (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }
		if (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(delivery, usRes.delivery); }
		var lintHits = lintText(blocks);
		checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "PIPA Art. 30; PIPC drafting guidelines; WP260 13") :
			chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "PIPA Art. 30; PIPC drafting guidelines; WP260 13"));
		var gp = [];
		if (direct) gp.push(chk("D01", "check", "Give the notice before you collect the data: before a form is submitted, before payment, before sign-up.", "Timing: when the data is collected"));
		gp.push(chk("D03", "check", "Read it as a member of the audience would."));
		if (has(s, "channel", "web")) gp.push(chk("D05", "check", "Link it from every page under the title \"Privacy Policy\", and from every form that collects personal information."));
		if (has(s, "channel", "app")) gp.push(chk("D06", "check", "Show it in the app store listing and keep it within two taps inside the app."));
		gp.push(chk("D07", "check", "Use the \"In short\" box as the first layer and keep it consistent with the full text."));
		gp.push(chk("D08", "check", "Keep the full policy available as one document."));
		gp.push(chk("D14", "check", "If you add the PIPC labelling icons, keep them alongside the text, never instead of it."));
		gp.forEach(function (r) { var m = D.MATRIX[r.id]; if (m) r.s = m.s.replace(/^Art\.[^;]*;\s*/, "") + " (good practice)"; });
		delivery = gp.concat(delivery);
		return { title: title, file: slug(ctrl + " Privacy Policy"), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(delivery), docLabel: "Policy" };
	}

	/* Form section for Korea: everything except the per-purpose, recipient and transfer fields. */
	var KR_SECTION = {
		title: "South Korea: Personal Information Protection Act",
		show: krOn,
		lead: "The PIPA as in force since 11 September 2026. Give the basis and any sensitive information with each purpose above, the basis and details for each third party and the sub-processors of each service provider with each recipient, and transfers abroad under transfers.",
		fields: [
			{ id: "krScope", type: "select", label: "Your presence in Korea", opts: [
				{ v: "in", l: "We have an address or office in Korea" },
				{ v: "abroad", l: "We have no address or office in Korea, and collect personal information directly from people in Korea" }],
			  hint: "Enforcement Decree Article 31(1)(4): a business collecting directly from abroad names every country where it processes the data. Article 31-2: some need a domestic representative." },
			{ id: "krOffWhere", type: "text", label: "Every country where you process it", show: krOffshore, ph: "for example Singapore and the United States" },
			{ id: "krRepNeed", type: "yesno", label: "Do you meet a threshold for a domestic representative?", show: krOffshore,
			  hint: "Article 31-2(1); Enforcement Decree Article 32-3: total turnover of KRW 1 trillion or more in the previous year, personal information of 1 million or more people in Korea stored (daily average over the last three months of the previous year), or a PIPC decision after a document request." },
			{ id: "krRep", type: "yesno", label: "Have you designated a domestic representative in Korea?", show: krOffshore },
			{ id: "krRepName", type: "text", label: "Representative's name (for a company, its name and the name of its representative)", show: function (s) { return krOffshore(s) && yes(s, "krRep"); } },
			{ id: "krRepAddr", type: "text", label: "Its address or place of business in Korea", show: function (s) { return krOffshore(s) && yes(s, "krRep"); } },
			{ id: "krRepTel", type: "text", label: "Its telephone number in Korea", show: function (s) { return krOffshore(s) && yes(s, "krRep"); } },
			{ id: "krRepEmail", type: "text", label: "Its email address", show: function (s) { return krOffshore(s) && yes(s, "krRep"); } },
			{ id: "krCpo", type: "text", label: "Chief privacy officer: name and title", ph: "for example Kim Minji, Executive Director",
			  hint: "Article 30(1)(6): the name, or the department handling privacy and complaints, with telephone and other contacts. For a private business the CPO is the owner or representative, or an officer, or, without officers, the head of the privacy department (Enforcement Decree Article 32(2)(2)); for a small business owner, the owner (Article 31(1))." },
			{ id: "krCpoContact", type: "text", label: "Chief privacy officer: telephone and email", ph: "for example 02-1234-5678, privacy@example.kr" },
			{ id: "krDept", type: "text", label: "Department handling privacy and complaints (optional)" },
			{ id: "krDeptContact", type: "text", label: "That department's telephone and email", show: function (s) { return !!v(s, "krDept"); } },
			{ id: "krNoRecip", type: "yesno", label: "You listed no recipients. Confirm that no one else receives the personal information, not even service providers you entrust it to",
			  show: function (s) { return !arr(s, "recipients").length; } },
			{ id: "krDestroyProc", type: "area", rows: 2, label: "How you destroy personal information: the procedure",
			  ph: "for example we select the personal information whose retention period has ended, and destroy it after the chief privacy officer approves", hint: "Article 30(1)(3-2); PIPC drafting guidelines, item 6." },
			{ id: "krDestroyHow", type: "checks", label: "The destruction methods you use", opts: [
				{ v: "del", l: "Electronic files: permanent deletion so that they cannot be restored" },
				{ v: "anon", l: "Electronic records that cannot practically be deleted: anonymisation so that they cannot be restored" },
				{ v: "paper", l: "Paper records: shredding or burning" }], hint: "Enforcement Decree Article 16(1)." },
			{ id: "krKeep", type: "text", label: "Data you keep under other laws after its purpose ends: the law, the items and the period (optional)",
			  ph: "for example records of contracts and payments: 5 years (Act on Consumer Protection in Electronic Commerce)", hint: "Articles 21(1), (3) and 30(1)(3-2). Leave empty if the retention periods above already name the law and the items." },
			{ id: "krFurtherUse", type: "yesno", label: "Do you regularly use or provide personal information without consent within a scope reasonably related to the original purpose?",
			  hint: "Articles 15(3), 17(4); Enforcement Decree Article 14-2(2): publish the criteria. A recipient that receives data under Article 17(4) counts." },
			{ id: "krFurtherCrit", type: "area", rows: 2, label: "The criteria you apply", show: function (s) { return yes(s, "krFurtherUse"); } },
			{ id: "krSecurity", type: "area", rows: 3, label: "The security measures you take", ph: "for example an internal management plan; access rights and access control; encryption of passwords and identifiers; access logs kept; anti-malware; locked storage",
			  hint: "Enforcement Decree Articles 30 and 31(1)(3)." },
			{ id: "krSensPublic", type: "yesno", label: "Can information made public in your service reveal sensitive information?", hint: "Article 23(3): tell people before the service, with how to keep it private." },
			{ id: "krSensPublicHow", type: "text", label: "What can become public, and how people choose not to make it public", show: function (s) { return yes(s, "krSensPublic"); } },
			{ id: "krPseudo", type: "yesno", label: "Do you process pseudonymised information?", hint: "Articles 28-2 and 30(1)(4-2)." },
			{ id: "krPseudoWhat", type: "area", rows: 3, label: "Its purposes, processing period, any provision or entrustment, the items pseudonymised, and the safety measures under Article 28-4", show: function (s) { return yes(s, "krPseudo"); },
			  hint: "PIPC drafting guidelines, item 13." },
			{ id: "krCookies", type: "yesno", label: "Does your website or app use cookies or other technologies that collect information automatically?", hint: "Article 30(1)(7)." },
			{ id: "krCookiesWhat", type: "text", label: "What they are used for", show: function (s) { return yes(s, "krCookies"); } },
			{ id: "krCookiesRefuse", type: "text", label: "How people refuse them", show: function (s) { return yes(s, "krCookies"); }, ph: "for example the cookie settings link in our footer, or the browser settings" },
			{ id: "krBehav", type: "yesno", label: "Do you let third parties collect behavioural information through your website or app?", show: function (s) { return yes(s, "krCookies"); } },
			{ id: "krBehavWho", type: "text", label: "The third parties, what they collect, and how people refuse it", show: function (s) { return yes(s, "krCookies") && yes(s, "krBehav"); } },
			{ id: "krReqHow", type: "area", rows: 2, label: "How people make requests: where and how, including website or app functions",
			  hint: "Article 38(4): no harder than how you collect the data. Leave empty to use the rights contact or the email address." },
			{ id: "krObject", type: "text", label: "How people object if you refuse or limit a request", hint: "Article 38(5)." },
			{ id: "krFee", type: "yesno", label: "Do you charge a fee for requests?", hint: "Article 38(3); Enforcement Decree Article 47: within the actual cost; none where you caused the request." },
			{ id: "krFeeAmount", type: "text", label: "The fee", show: function (s) { return yes(s, "krFee"); } },
			{ id: "krPort", type: "yesno", label: "Are you a controller that must transmit personal information to people on request?", hint: "Article 35-2(1): controllers that meet the Enforcement Decree criteria." },
			{ id: "krPortHow", type: "text", label: "How people make a transmission request", show: function (s) { return yes(s, "krPort"); } },
			{ id: "krPort3", type: "yesno", label: "Must you also transmit it to third parties, such as personal information management institutions?", show: function (s) { return yes(s, "krPort"); },
			  hint: "Article 35-2(2): a narrower set of controllers, set by the Enforcement Decree." },
			{ id: "krAdmData", type: "text", label: "Automated decisions: the main personal information used and how it relates to the decision", show: function (s) { return yes(s, "adm"); }, hint: "Enforcement Decree Article 44-4(1)(2)." },
			{ id: "krAdmProc", type: "area", rows: 2, label: "Automated decisions: what is considered, and how the information is processed", show: function (s) { return yes(s, "adm"); }, hint: "Enforcement Decree Article 44-4(1)(3)." },
			{ id: "krAdmSens", type: "text", label: "Automated decisions: sensitive or children's information used, with the purpose and items (if any)", show: function (s) { return yes(s, "adm"); }, hint: "Enforcement Decree Article 44-4(1)(4)." },
			{ id: "krAdmHow", type: "text", label: "Automated decisions: how people refuse or ask for an explanation or review", show: function (s) { return yes(s, "adm"); }, hint: "Article 37-2; Enforcement Decree Articles 44-2, 44-4(1)(5)." },
			{ id: "krKids", type: "yesno", label: "Do you process the personal information of children under 14?", hint: "Article 22-2: where consent is needed, the legal representative's consent, confirmed." },
			{ id: "krKidsHow", type: "text", label: "How you confirm the legal representative's consent", show: function (s) { return yes(s, "krKids"); }, ph: "for example a mobile identity check by the parent" },
			{ id: "krKidsCollect", type: "yesno", label: "Do you collect the legal representative's name and contact details from the child to ask for that consent?", show: function (s) { return yes(s, "krKids"); },
			  hint: "Article 22-2(2); Enforcement Decree Article 17-2: allowed without the legal representative's consent." },
			{ id: "krFirst", type: "yesno", label: "Is this your first privacy policy?", hint: "PIPC drafting guidelines, item 24: once the policy changes, publish earlier versions with the periods they applied." },
			{ id: "krPrev", type: "text", label: "Where earlier versions of the policy are published, with the periods they applied", ph: "for example linked below, by date", show: function (s) { return !yes(s, "krFirst"); } }
		]
	};

