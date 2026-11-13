	/* ========================================================= CHINA === */
	/* China (matrix Part Q): the Personal Information Protection Law (PIPL, in force 1 November 2021), the
	   Network Data Security Management Regulations (in force 1 January 2025), the Provisions on the Cyber
	   Protection of Children's Personal Information (2019) and the Compliance Audit Measures (2025), read in
	   Chinese on cac.gov.cn on 12 November 2026 (notes in build/cn/notes.md). The Chinese text is authentic;
	   the notice wording is a translation. Review findings R01 to R30 of 12 November 2026 are applied. */
	function cnOn(s) { return inReg(s, "cn"); }
	function cnBasisOf(s, a) { return cnOn(s) ? v(a, "cnBasis") : ""; }
	/* Words that suggest Article 28 information in a purpose not marked sensitive (Z07, a warning only). */
	var CN_SENS_HINT = /\b(bank|account number|card number|payment account|credit|id card|identity card|passport|health|medical|diagnos|symptom|clinic|biometric|face|facial|fingerprint|voiceprint|iris|location|whereabouts|religio|genetic|minor|child)/i;
	function cnRef(x, ref) { return String(x).replace(/[.]\s*$/, "") + " (" + ref + ")."; }
	/* Lower the first letter only of an ordinary word, never of an acronym or a name such as SMS or WeChat (R12). */
	function cnLc(x) { x = String(x); return /^[A-Z][a-z]/.test(x) && !/^[A-Z][a-z]+[A-Z]/.test(x) ? lcFirst(x) : x; }
	function cnTrim(x) { return String(x).replace(/[.]\s*$/, ""); }
	function cnBasis(b) { return lbl(D.CN_BASES, b); }
	function cnConsentActs(s) { return pnActs(s).filter(function (a) { return cnBasisOf(s, a) === "consent"; }); }
	function cnFutureConsent(s) { return cnOn(s) && yes(s, "further") && v(s, "cnFurther") === "consent"; }
	function cnConsent(s) { return cnConsentActs(s).length > 0 || cnFutureConsent(s); }
	/* Sensitive: marked so, or a purpose that uses the personal information of minors under 14 (Article 28; R08). */
	function cnSensOn(s, a) { return yes(a, "cnSens") || (yes(s, "cnKids") && yes(a, "cnKidsP")); }
	function cnSensActs(s) { return cnOn(s) ? pnActs(s).filter(function (a) { return cnSensOn(s, a); }) : []; }
	function cnOthers(s) { return arr(s, "recipients").filter(function (r) { var ro = v(r, "role"); return ro === "controller" || ro === "joint" || ro === "authority"; }); }
	function cnEntrusted(s) { return arr(s, "recipients").filter(function (r) { return v(r, "role") === "processor"; }); }
	function cnNoRole(s) { return arr(s, "recipients").filter(function (r) { return !v(r, "role"); }); }
	function cnXrows(s) { return yes(s, "cnAbroad") ? arr(s, "cnXrows") : []; }
	function cnOffshore(s) { return v(s, "cnScope") === "offer" || v(s, "cnScope") === "assess"; }
	/* Hong Kong, Macao and Taiwan are outside mainland China (R05). */
	function cnPlace(w) {
		if (/\b(hong ?kong|kowloon|macao|macau|taiwan|taipei|kaohsiung)\b/i.test(w)) return false;
		return /\b(mainland|china|prc|beijing|shanghai|shenzhen|guangzhou|hangzhou|chengdu|tianjin|wuhan|nanjing|suzhou|chongqing|xiamen|dalian|qingdao)\b/i.test(w);
	}
	function cnLaw(s, a) { return cnTrim(v(a, "cnLaw") || "[the law or administrative regulation]"); }
	function cnRightsWay(s) { return v(s, "rightsContact") || (inReg(s, "in") ? v(s, "inLink") : "") || v(s, "ctrlEmail"); }
	function cnName(x) { return String(x || "").trim().toLowerCase().replace(/[.,]+$/, ""); }
	/* Z05: the ground of one purpose. */
	function cnBasisTxt(s, a) {
		var b = cnBasisOf(s, a), o = cnBasis(b);
		if (!o) return "[Choose the ground in Article 13 PIPL.]";
		if (b === "consent") return (cnSensOn(s, a) ? "Your separate consent" : "Your consent") + " (Article 13(1)(1)" + (cnSensOn(s, a) ? " and Article 29" : "") + " PIPL).";
		if (b === "law") return "Provided for by " + cnLaw(s, a) + " (Article 13(1)(7) PIPL).";
		return o.t.charAt(0).toUpperCase() + o.t.slice(1) + " (Article " + o.sec + " PIPL)." + (b === "public" ? " You can tell us to stop (Article 27)." : "");
	}
	/* NDSMR Article 21, second paragraph: a list; a column for the method where purposes differ (R29). */
	function cnTable(s) {
		var acts = pnActs(s);
		if (!acts.length) return [{ k: "p", x: "[Add the purposes.]" }];
		var how = acts.some(function (a) { return v(a, "cnMethodP"); });
		return [{ k: "table", head: how ? ["Purpose", "Personal information", "How we process it", "Ground", "How long we keep it"] : ["Purpose", "Personal information", "Ground", "How long we keep it"], rows: acts.map(function (a) {
			var row = [(v(a, "purpose") || "[purpose]") + (cnSensOn(s, a) ? " (sensitive personal information)" : ""), v(a, "data") || "[categories of personal information]"];
			if (how) row.push(v(a, "cnMethodP") || "As described below the table");
			return row.concat([cnBasisTxt(s, a), v(a, "retention") || "[retention period, or how it is determined]"]);
		}) }];
	}
	/* Z04, Z06: Article 17(1)(2); Regulations Article 21(1)(2), (3). */
	function cnHowBody(s) {
		var b = [{ k: "p", x: "How we process it: " + stop(v(s, "cnMethod") || "[the processing methods: how you collect, store, use and share the personal information]") }];
		b.push({ k: "p", x: "We keep personal information only for the shortest time necessary for the purpose, unless a law requires longer (Article 19). What happens when the period ends: " + stop(v(s, "cnAfter") || "[what happens to it, for example it is deleted or anonymised]") });
		if (cnConsentActs(s).length) b.push({ k: "p", x: "Where we rely on your consent, you give it voluntarily and explicitly, knowing what it covers. If the purpose, the processing method or the categories of personal information change, we ask for your consent again (Article 14)." });
		return b;
	}
	/* Z07: Articles 28 to 30. */
	function cnSensBody(s) {
		var sp = cnSensActs(s);
		if (!sp.length) return [];
		var b = [{ k: "p", x: "Sensitive personal information is information that, if leaked or used unlawfully, can easily harm your dignity or your personal or property safety, such as biometric, religious belief, specific identity, medical health, financial account and whereabouts information, and the personal information of minors under 14 (Article 28). We process it only for a specific purpose, where it is sufficiently necessary, with strict protection. For each purpose, why it is necessary and what it means for you (Article 30):" },
			{ k: "ul", items: sp.map(function (a) { return { b: (v(a, "purpose") || "[purpose]") + ":", x: stop(v(a, "cnSensWhy") || "[why the sensitive personal information is necessary, and its impact on the person]") }; }) }];
		if (sp.some(function (a) { return cnBasisOf(s, a) === "consent"; })) b.push({ k: "p", x: "Where we rely on your consent for it, we ask for your separate consent (Article 29)." });
		return b;
	}
	function cnConsTxt(x, key) {
		var c = v(x, key);
		return c === "Yes" ? " We ask for your separate consent before we provide it." : c === "No" ? "" : " [Say whether providing it to this recipient relies on consent.]";
	}
	/* Z08: Articles 21 and 23; Regulations Article 21, second paragraph. */
	function cnShareBody(s) {
		var b = [], all = arr(s, "recipients"), o = cnOthers(s), e = cnEntrusted(s), nr = cnNoRole(s);
		if (!all.length) return [{ k: "p", x: yes(s, "cnNoRecip") ? "We do not provide your personal information to other processors, and no service provider processes it for us." :
			"[List the recipients, including service providers that process personal information for you, or confirm in the China section that there are none.]" }];
		if (o.length) {
			b.push({ k: "p", x: "We provide personal information to these other personal information processors, which process it for their own purposes or decide with us how it is processed (Article 23):" });
			b.push({ k: "ul", items: o.map(function (r) { return { b: (v(r, "who") || "[recipient]") + ":", x: "contact " + cnTrim(v(r, "cnContact") || "[contact details]") + "; purpose: " + cnLc(cnTrim(v(r, "why") || "[purpose]")) +
				"; how they process it: " + cnLc(cnTrim(v(r, "cnHow") || "[processing method]")) + "; personal information: " + cnLc(cnTrim(v(r, "cnData") || "[categories]")) + "." + cnConsTxt(r, "cnCons") }; }) });
			b.push({ k: "p", x: "They process it only within the purpose, processing method and categories above. If they change the purpose or the method, they ask for your consent again (Article 23)." });
		}
		if (e.length) b.push({ k: "p", x: "Service providers that process personal information for us (" + joinList(e.map(function (r) { return v(r, "who") || "[recipient]"; })) + ") do so under an agreement on the purpose, period, processing method, categories and protection measures, under our supervision, and pass it on to others only with our consent (Article 21)." });
		nr.forEach(function (r) { b.push({ k: "p", x: "[Give the role of " + (v(r, "who") || "this recipient") + ": a service provider acting for you, or another processor.]" }); });
		return b;
	}
	/* Z09: Articles 38 and 39; Regulations Article 35. */
	function cnAbroadBody(s) {
		var b = [], off = cnOffshore(s);
		if (off) b.push({ k: "p", x: "We are based outside mainland China, in " + cnTrim(v(s, "cnOffWhere") || "[country or region]") + ", and collect and process your personal information there." });
		if (no(s, "cnAbroad")) { b.push({ k: "p", x: off ? "We do not provide it to any other recipient outside mainland China." : "We do not provide your personal information to recipients outside mainland China." }); return b; }
		if (!yes(s, "cnAbroad")) { b.push({ k: "p", x: "[Say whether you provide personal information to recipients outside mainland China.]" }); return b; }
		var rows = cnXrows(s);
		b.push({ k: "p", x: "We provide personal information to these recipients outside mainland China (Article 39):" });
		b.push(rows.length ? { k: "ul", items: rows.map(function (r) { return { b: (v(r, "name") || "[overseas recipient]") + (v(r, "country") ? " (" + cnTrim(v(r, "country")) + ")" : "") + ":",
			x: "contact " + cnTrim(v(r, "contact") || "[contact details]") + "; purpose: " + cnLc(cnTrim(v(r, "purpose") || "[purpose]")) + "; how they process it: " + cnLc(cnTrim(v(r, "how") || "[processing method]")) +
			"; personal information: " + cnLc(cnTrim(v(r, "data") || "[categories]")) + ". To exercise your rights against this recipient: " + stop(v(r, "rights") || "[how and through what procedure]") + cnConsTxt(r, "consent") }; }) } :
			{ k: "p", x: "[Add each overseas recipient.]" });
		b.push({ k: "p", x: "We take the necessary measures so that overseas recipients protect it to the standard of the PIPL (Article 38)." });
		return b;
	}
	/* Z12: Articles 24 and 73. */
	function cnAdmOn(s) { return yes(s, "adm") || yes(s, "profiling") || yes(s, "cnPush"); }
	function cnAdmDecides(s) { return yes(s, "adm") || yes(s, "cnPush"); }
	function cnPushTxt(s) {
		var k = v(s, "cnPushKind"), how = v(s, "cnPushHow") || "[how people do it]";
		return k === "option" ? "You can choose content not based on your personal characteristics: " + stop(how) :
			k === "refuse" ? "You can refuse it: " + stop(how) :
			k === "both" ? "You can choose content not based on your personal characteristics, or refuse it: " + stop(how) :
			"[Say whether you offer content not based on personal characteristics, a way to refuse, or both, and how people use it.]";
	}
	function cnAdmBody(s, led) {
		var b = [];
		if (yes(s, "adm")) {
			if (led) Array.prototype.push.apply(b, admCore(s, "We make the following decision about you through automated decision-making: "));
			b.push({ k: "p", x: "Where a decision made through automated decision-making has a major impact on your rights and interests, you can ask us to explain it, and refuse a decision made solely by automated means (Article 24)." });
		} else if (led && yes(s, "profiling")) b.push({ k: "p", x: "We automatically analyse and assess your behaviour, interests or circumstances: " + stop(v(s, "profilingWhat") || "[the analysis, and what it is used for]") });
		if (yes(s, "cnPush")) b.push({ k: "p", x: "We use automated decision-making to push information or marketing to you (Article 24). " + cnPushTxt(s) });
		if (cnAdmDecides(s)) b.push({ k: "p", x: "We keep automated decision-making transparent and its results fair and just, and do not treat you unreasonably differently in prices or other trading conditions (Article 24)." });
		return b;
	}
	/* Z13: Articles 28 and 31; CAC Order No. 4, Articles 8 to 10. */
	function cnKidsBody(s) {
		var b = [{ k: "p", x: "The personal information of a minor under 14 is sensitive personal information. We process it only with the consent of a parent or other guardian, " +
			(v(s, "cnKidsHow") ? "given as follows: " + cnLc(stop(v(s, "cnKidsHow"))) : "[how the parent or guardian gives consent].") +
			" Our dedicated rules for the personal information of children under 14: " + cnRef(v(s, "cnKidsRules") || "[where the dedicated rules are published]", "Articles 28 and 31") }];
		if (v(s, "cnKidsContact")) b.push({ k: "p", x: "The person responsible for children's personal information: " + cnRef(v(s, "cnKidsContact"), "CAC Order No. 4, Article 8") });
		return b;
	}
	/* Z10: Articles 44 to 50; Regulations Articles 21(1)(4), 23 to 25. */
	function cnRightsBody(s) {
		var R = [
			{ b: "Know, decide, restrict or refuse (Article 44).", x: "You can restrict or refuse our processing of your personal information, unless laws or administrative regulations provide otherwise." },
			{ b: "Access and copy (Article 45).", x: "You can access and copy your personal information. We provide it promptly." },
			{ b: "Transfer (Article 45).", x: "You can ask us to transfer personal information you provided with your consent, or that we collected under a contract, to another processor you designate, where we can verify your identity, the transfer is technically feasible and it does not harm others (Regulations Article 25)." },
			{ b: "Correction and supplementing (Article 46).", x: "If your personal information is inaccurate or incomplete, you can ask us to correct or supplement it. We verify it and act promptly." },
			{ b: "Deletion (Article 47).", x: "We delete your personal information when the purpose is achieved, cannot be achieved or no longer needs it, when we stop providing the product or service or the retention period ends, when you withdraw consent, when we process it in breach of the law or of our agreement with you, or in other cases provided by law; if we have not, you can ask us to. Where a law requires us to keep it, or deletion is technically difficult, we stop all processing except storage and the necessary security measures." },
			{ b: "Explanation (Article 48).", x: "You can ask us to explain these processing rules." }];
		if (cnConsentActs(s).length) R.push({ b: "Withdrawing consent (Article 15).", x: "You can withdraw your consent at any time." });
		else if (cnFutureConsent(s)) R.push({ b: "Withdrawing consent (Article 15).", x: "Once you consent to the planned new use, you can withdraw your consent at any time." });
		if (yes(s, "cnAccount")) R.push({ b: "Deregistering your account (Regulations Articles 21 and 24).", x: "You can deregister your account: " + cnTrim(v(s, "cnAccountHow") || "[how people deregister their account]") + ". We then delete or anonymise your personal information." });
		if (yes(s, "adm")) R.push({ b: "Automated decisions (Article 24).", x: "You can ask for an explanation of a decision with a major impact on you, and refuse a decision made solely by automated means." });
		R.push({ b: "Next of kin (Article 49).", x: "If you die, your next of kin can, for their own lawful and legitimate interests, access, copy, correct and delete your personal information, unless you arranged otherwise." });
		return [{ k: "ul", items: R },
			{ k: "p", x: "To exercise these rights, contact us: " + stop(cnRightsWay(s) || "[how to exercise rights]") +
				" We accept and handle requests promptly, and set no unreasonable conditions. If we refuse a request, we tell you why, and you can bring a claim before a people's court (Article 50; Regulations Article 23)." }];
	}
	/* Z11: Articles 15 and 16. */
	function cnConsentBody(s) {
		var now = cnConsentActs(s).length > 0;
		var how = v(s, "withdrawHow");
		return [{ k: "p", x: (now ? "Where we process your personal information on the basis of your consent, you can withdraw it at any time: " + stop(how || "[how to withdraw]") :
			"Once you consent to the planned new use described in this notice, you can withdraw your consent at any time" + (how ? ": " + stop(how) : ". We tell you how when we ask for your consent.")) +
			" Withdrawing does not affect what we did before. We do not refuse to provide products or services because you refuse or withdraw consent, unless the processing is necessary to provide them (Articles 15 and 16)." }];
	}
	var CN_COMPLAIN = "You can complain about or report unlawful processing of personal information to the departments responsible for personal information protection, such as the Cyberspace Administration of China and its local offices (Article 65). If we refuse a request to exercise your rights, you can also bring a claim before a people's court (Article 50).";
	var CN_CHANGES = "When any of this changes, we tell you what changed (Article 17). Where a new purpose, processing method or category of personal information relies on consent, we ask for your consent again (Article 14). If we transfer your personal information because of a merger, division, dissolution or bankruptcy, we tell you the recipient's name and contact details, and the recipient continues our obligations (Article 22).";
	/* Z15 */
	function cnFurtherTxt(s) {
		var f = v(s, "cnFurther"), o = cnBasis(f);
		return f === "consent" ? "We will ask for your consent before we use your personal information for it (Article 14)." :
			f === "law" ? "Ground for it: provided for by " + cnTrim(v(s, "cnFurtherLaw") || "[the law or administrative regulation]") + " (Article 13(1)(7) PIPL)." :
			o ? "Ground for it: " + cnLc(o.t) + " (Article " + o.sec + " PIPL)." : "[Say whether you will ask for consent for the new purpose, or which other ground in Article 13 applies.]";
	}
	function cnFurtherBox(s) {
		return { k: "box", title: "Planned new use of your personal information", blocks: [
			{ k: "p", x: "From " + (fmtDate(v(s, "furtherStart")) || "[start date]") + " we intend to use personal information we already hold for a new purpose: " + stop(v(s, "furtherWhat") || "[new purpose]") },
			{ k: "p", x: "For this new purpose we use " + cnLc(v(s, "furtherData") || "[personal information]") + ", and " + keepFor(v(s, "furtherRetention") || "[retention period or criteria]") },
			{ k: "p", x: cnFurtherTxt(s) }] };
	}
	function cnWhoBody(s) {
		var b = [], k = v(s, "cnRepKind");
		if (yes(s, "cnPipo")) b.push({ k: "p", x: "Our personal information protection officer: " + (v(s, "cnPipoName") || "[name or title]") + ", " + cnRef(v(s, "cnPipoContact") || "[contact details]", "Article 52") });
		if (cnOffshore(s) && v(s, "cnRep")) b.push({ k: "p", x: "Our " + (k === "entity" ? "dedicated body" : k === "rep" ? "designated representative" : "dedicated body or representative") + " in China for personal information protection matters: " + cnRef(v(s, "cnRep"), "Article 53") });
		return b;
	}

	/* The "Additional information for people in China" section of a notice led by another law. */
	function cnSection(s, secs, lawName) {
		var b = [], H = function (t) { b.push({ k: "h3", x: t }); };
		var other = secs.filter(Boolean).map(String), ctrl = v(s, "ctrlName") || "[Organisation]";
		b.push({ k: "p", x: "For people in mainland China, the Personal Information Protection Law of the People's Republic of China (PIPL) applies. " + ctrl +
			" is the personal information processor. The rest of this notice describes how we handle your personal information. The details, rights and choices in this section are those this law gives you." +
			(other.length ? " " + (other.length > 1 ? "Sections " : "Section ") + joinList(other) + (other.length > 1 ? " apply" : " applies") + " to you only where " + lawName + " applies to our processing of your data." : "") });
		var who = cnWhoBody(s);
		if (who.length) { H("Who to contact in China"); Array.prototype.push.apply(b, who); }
		H("What we process, why and how");
		Array.prototype.push.apply(b, cnTable(s));
		Array.prototype.push.apply(b, cnHowBody(s));
		if (cnSensActs(s).length) { H("Sensitive personal information"); Array.prototype.push.apply(b, cnSensBody(s)); }
		H("Providing your personal information to others");
		Array.prototype.push.apply(b, cnShareBody(s));
		H("Outside mainland China");
		Array.prototype.push.apply(b, cnAbroadBody(s));
		if (cnAdmDecides(s)) { H("Automated decision-making"); Array.prototype.push.apply(b, cnAdmBody(s, false)); }
		if (yes(s, "cnKids")) { H("Children under 14"); Array.prototype.push.apply(b, cnKidsBody(s)); }
		H("Your rights in China");
		Array.prototype.push.apply(b, cnRightsBody(s));
		if (cnConsent(s)) { H("Withdrawing consent"); Array.prototype.push.apply(b, cnConsentBody(s)); }
		H("Complaints");
		b.push({ k: "p", x: CN_COMPLAIN });
		H("Changes");
		b.push({ k: "p", x: CN_CHANGES + (yes(s, "further") ? " For the new purpose described in this notice: " + cnLc(cnFurtherTxt(s)) : "") });
		return b;
	}

	/* Part Q rows. led: China sets the main text. */
	function cnChecks(s, led) {
		var checks = [], delivery = [], acts = pnActs(s), cons = cnConsent(s), sens = cnSensActs(s), aud = v(s, "audience");
		var pl = function (list) { return joinList(list.map(function (a) { return cnTrim(v(a, "purpose") || "[purpose]"); })); };
		var nm = function (list, key) { return joinList(list.map(function (r) { return cnTrim(v(r, key || "who") || "[recipient]"); })); };
		if (led) {
			var nCh = (v(s, "ctrlEmail") ? 1 : 0) + (v(s, "ctrlPhone") ? 1 : 0) + (v(s, "ctrlAddress") ? 1 : 0);
			checks.push(!v(s, "ctrlName") || !nCh ? chk("Z01", "missing", "Add the processor's name and contact details (Article 17(1)(1)).") : chk("Z01", "ok"));
		}
		var sc = v(s, "cnScope"), off = cnOffshore(s);
		checks.push(!sc ? chk("Z02", "missing", "Say how the PIPL applies to you (Article 3).") :
			off && !v(s, "cnRep") ? chk("Z02", "warn", "A processor outside China under Article 3(2) sets up a dedicated body or designates a representative in China and reports its name and contact to the authorities (Article 53; Regulations Article 26). Naming it in the notice is good practice.") :
			off && !v(s, "cnRepKind") ? chk("Z02", "warn", "Say whether it is a dedicated body or a designated representative (Article 53).") :
			chk("Z02", "ok", sc === "in" ? "Processing in China." : "Outside China, the PIPL applies where the purpose is to provide products or services to people in China, or to analyse or assess their behaviour (Article 3(2))."));
		checks.push(!v(s, "cnPipo") ? chk("Z03", "missing", "Answer whether you process the personal information of 1 million people or more (Article 52; Compliance Audit Measures, Article 12).") :
			yes(s, "cnPipo") && (!v(s, "cnPipoName") || !v(s, "cnPipoContact")) ? chk("Z03", "missing", "Give the officer's name or title and contact details: their contact is published (Article 52).") :
			yes(s, "cnPipo") ? chk("Z03", "ok", "Publish the officer's contact details (Article 52).") : chk("Z03", "na", "Below 1 million people: no officer required (Compliance Audit Measures, Article 12)."));
		var z04 = [];
		if (!acts.length) z04.push("Add the purposes.");
		var noData = acts.filter(function (a) { return !v(a, "data"); });
		if (noData.length) z04.push("Give the categories of personal information for " + pl(noData) + ".");
		if (!v(s, "cnMethod")) z04.push("Describe the processing methods (Article 17(1)(2)).");
		var vp = acts.filter(function (a) { return D.LINT.vaguePurpose.test(v(a, "purpose")); });
		if (vp.length) z04.push("State each purpose clearly and specifically (Articles 6 and 17; Regulations Article 21): " + pl(vp) + ".");
		checks.push(z04.length ? chk("Z04", noData.length || !acts.length || !v(s, "cnMethod") ? "missing" : "warn", z04.join(" ")) : chk("Z04", "ok"));
		var noB = acts.filter(function (a) { return !cnBasis(cnBasisOf(s, a)); });
		var noLaw = acts.filter(function (a) { return cnBasisOf(s, a) === "law" && !v(a, "cnLaw"); });
		var hr = acts.filter(function (a) { return cnBasisOf(s, a) === "hr"; });
		var pub = acts.filter(function (a) { return cnBasisOf(s, a) === "public"; });
		var z05 = [];
		if (noB.length) z05.push("Choose the Article 13 ground for " + pl(noB) + ".");
		if (noLaw.length) z05.push("Name the law or administrative regulation for " + pl(noLaw) + " (Article 13(1)(7)).");
		if (hr.length && aud === "applicant") z05.push("Applicants are not yet bound by your labour rules or collective contracts: check whether the contract ground (to conclude a contract) or consent fits better for " + pl(hr) + ".");
		else if (hr.length && aud !== "employee") z05.push("Human resources management covers employees, under lawful labour rules and collective contracts: check " + pl(hr) + ".");
		if (pub.length) z05.push("Disclosed information (" + pl(pub) + "): check the impact. Where it is major, consent is needed; stop if the person explicitly refuses (Article 27).");
		checks.push(!acts.length ? chk("Z05", "missing", "Add the purposes.") : z05.length ? chk("Z05", noB.length || noLaw.length ? "missing" : "warn", z05.join(" ")) : chk("Z05", "ok"));
		var noRet = acts.filter(function (a) { return !v(a, "retention"); }), vagueRet = acts.filter(function (a) { return D.LINT.vagueRetention.test(v(a, "retention")); });
		var z06 = [];
		if (!acts.length || noRet.length) z06.push("Give the retention period, or how it is determined, for every purpose (Article 17(1)(2); Regulations Article 21(1)(3)).");
		else if (vagueRet.length) z06.push("\"As long as necessary\" does not say how long. Give a period, or the method that determines it.");
		if (!v(s, "cnAfter")) z06.push("Say what happens to the personal information when the period ends (Regulations Article 21(1)(3)).");
		checks.push(z06.length ? chk("Z06", noRet.length || !acts.length || !v(s, "cnAfter") ? "missing" : "warn", z06.join(" ")) : chk("Z06", "ok"));
		/* Z07 (R07, R08, R26) */
		var unans = acts.filter(function (a) { return !v(a, "cnSens") && !(yes(s, "cnKids") && yes(a, "cnKidsP")); });
		var noWhy = sens.filter(function (a) { return !v(a, "cnSensWhy"); });
		var other = acts.filter(function (a) { return !cnSensOn(s, a) && ((gdprLed(s) && art9Of(s, a)) || (inReg(s, "br") && v(a, "brSens")) || (inReg(s, "can") && yes(a, "canSens"))); });
		var looksSens = acts.filter(function (a) { return !cnSensOn(s, a) && other.indexOf(a) === -1 && CN_SENS_HINT.test(v(a, "data") + " " + v(a, "purpose")); });
		var z07 = [];
		if (unans.length) z07.push("Answer for each purpose whether it uses sensitive personal information (Article 28): " + pl(unans) + ".");
		if (noWhy.length) z07.push("Say why the sensitive personal information is necessary and its impact on the person, for " + pl(noWhy) + " (Article 30).");
		if (other.length) z07.push("Another law in this notice treats the data for " + pl(other) + " as sensitive. Check whether it is sensitive personal information under Article 28 (biometric, religious belief, specific identity, medical health, financial account, whereabouts, under-14) and mark it.");
		if (looksSens.length) z07.push("Check whether the personal information for " + pl(looksSens) + " is sensitive under Article 28 (for example financial accounts, identity documents, health, biometrics or whereabouts) and mark it.");
		checks.push(!acts.length ? chk("Z07", "na", "No purposes yet.") : z07.length ? chk("Z07", unans.length || noWhy.length ? "missing" : "warn", z07.join(" ")) :
			sens.length ? chk("Z07", "ok", sens.some(function (a) { return cnBasisOf(s, a) === "consent"; }) ? "Ask for separate consent for it (Article 29)." : "") : chk("Z07", "na", "No purpose uses sensitive personal information."));
		/* Z08 (R01, R09, R23) */
		var recs = arr(s, "recipients"), oth = cnOthers(s), nr = cnNoRole(s);
		var badOth = oth.filter(function (r) { return !v(r, "cnContact") || !v(r, "cnHow") || !v(r, "cnData"); });
		var noCons = oth.filter(function (r) { return !v(r, "cnCons"); });
		var z08 = [];
		if (!recs.length && !yes(s, "cnNoRecip")) z08.push("List the recipients, including hosting, email and IT providers that process personal information for you, or confirm in the China section that there are none (Articles 21 and 23).");
		if (badOth.length) z08.push("For each recipient that is another processor, give its contact, how it processes the personal information and the categories: " + nm(badOth) + " (Article 23; Regulations Article 21).");
		if (noCons.length) z08.push("Answer whether providing personal information to " + nm(noCons) + " relies on consent (Article 23).");
		if (nr.length) z08.push("Give each recipient's role, so the notice can say which are other processors: " + nm(nr) + ".");
		checks.push(z08.length ? chk("Z08", "missing", z08.join(" ")) :
			!recs.length ? chk("Z08", "na", "You confirmed that no one else receives the personal information.") :
			oth.length ? chk("Z08", "ok", oth.some(function (r) { return yes(r, "cnCons"); }) ? "Get separate consent before providing the personal information where consent is the ground (Article 23)." : "") :
			chk("Z08", "na", "No other processor receives personal information; service providers act under Article 21."));
		/* Z09 (R04, R05, R06, R11, R25) */
		var xr = cnXrows(s), badX = xr.filter(function (r) { return !v(r, "name") || !v(r, "contact") || !v(r, "purpose") || !v(r, "how") || !v(r, "data") || !v(r, "rights"); });
		var xCons = xr.filter(function (r) { return !v(r, "consent"); });
		var abroadRec = recs.filter(function (r) { return v(r, "where") && !cnPlace(v(r, "where")); });
		var xNames = xr.map(function (r) { return cnName(v(r, "name")); }), rNames = recs.map(function (r) { return cnName(v(r, "who")); });
		var notListed = abroadRec.filter(function (r) { return xNames.indexOf(cnName(v(r, "who"))) === -1; });
		var notRec = xr.filter(function (r) { var n = cnName(v(r, "name")); return n && rNames.indexOf(n) === -1 && n !== cnName(v(s, "ctrlName")); });
		var offNote = off ? "You are outside mainland China: the notice says where you collect and process the personal information. Take advice on whether the CAC treats your direct collection from people in China as provision abroad; the generator does not decide this." : "";
		var z09m = [], z09w = [];
		if (!v(s, "cnAbroad")) z09m.push("Answer whether personal information goes to recipients outside mainland China (Article 39).");
		if (off && !v(s, "cnOffWhere")) z09m.push("Say where you are and where you process the personal information outside mainland China (Articles 3 and 17).");
		if (yes(s, "cnAbroad") && (!xr.length || badX.length)) z09m.push("For each overseas recipient give its name, contact, purpose, processing method, categories and how people exercise their rights against it (Article 39).");
		if (yes(s, "cnAbroad") && xCons.length) z09m.push("Answer for each overseas recipient whether providing it relies on consent (Article 39): " + nm(xCons, "name") + ".");
		if (no(s, "cnAbroad") && abroadRec.length) z09w.push("Recipients are listed outside mainland China (" + joinList(abroadRec.map(function (r) { return (v(r, "who") || "[recipient]") + ", " + v(r, "where"); })) + ") while the answer is No. A service provider abroad that can access the data counts; Hong Kong, Macao and Taiwan are outside mainland China.");
		if (yes(s, "cnAbroad") && notListed.length) z09w.push("These recipients are outside mainland China but not in the overseas list: " + joinList(notListed.map(function (r) { return (v(r, "who") || "[recipient]") + " (" + v(r, "where") + ")"; })) + ". Add them with the Article 39 details.");
		if (notRec.length) z09w.push("These overseas recipients are not in the list of recipients: " + nm(notRec, "name") + ". Check that both lists agree.");
		if (yes(s, "cnAbroad") && yes(s, "publicBody")) z09w.push("State organs store the personal information they process in China; providing it abroad needs a CAC security assessment (Article 36). The standard contract and the exemptions do not apply.");
		var mech = ["Each provision abroad needs one of the Article 38 conditions: a CAC security assessment, certification or the CAC standard contract, unless an exemption applies (Regulations Article 35; CAC Order No. 16, Article 5), for example a contract with the person, cross-border human resources management, or, for a processor that is not a critical information infrastructure operator, fewer than 100,000 people's non-sensitive personal information cumulatively since 1 January of the current year.",
			"Critical information infrastructure operators, and processors above the volume the CAC sets, store personal information collected in China in China and need a security assessment (Article 40)."];
		if (xr.some(function (r) { return yes(r, "consent"); })) mech.push("Get separate consent first where consent is the ground (Article 39).");
		checks.push(z09m.length ? chk("Z09", "missing", z09m.concat(z09w).join(" ")) :
			z09w.length ? chk("Z09", "warn", z09w.concat(offNote ? [offNote] : []).join(" ")) :
			no(s, "cnAbroad") ? chk("Z09", off ? "check" : "na", off ? offNote : "No recipient outside mainland China.") :
			chk("Z09", "check", mech.concat(offNote ? [offNote] : []).join(" ")));
		var z10 = [];
		if (!cnRightsWay(s)) z10.push("Say how people exercise their rights (Article 17(1)(3)).");
		if (!v(s, "cnAccount")) z10.push("Answer whether people have an account with you: the methods to deregister it are part of the rules (Regulations Article 21(1)(4)).");
		else if (yes(s, "cnAccount") && !v(s, "cnAccountHow")) z10.push("Say how people deregister their account.");
		checks.push(z10.length ? chk("Z10", "missing", z10.join(" ")) : chk("Z10", "ok", "Set up a convenient mechanism to accept and handle requests, and give reasons for any refusal (Article 50)."));
		checks.push(!cons ? chk("Z11", "na", "No purpose relies on consent.") :
			!v(s, "withdrawHow") ? (cnConsentActs(s).length ? chk("Z11", "missing", "Give a convenient way to withdraw consent (Article 15).") : chk("Z11", "warn", "Give a convenient way to withdraw consent to the planned new use (Article 15).")) :
			chk("Z11", "ok", "Do not refuse products or services because people refuse or withdraw consent, unless the processing is necessary for them (Article 16)."));
		/* Z12 (R03, R16, R17, R24) */
		var z12 = [];
		if (led && !v(s, "adm")) z12.push("Answer whether you make decisions through automated decision-making that have a major impact on people (Article 24).");
		else if (led && no(s, "adm") && !v(s, "profiling")) z12.push("Answer whether you analyse or assess people automatically in other ways (Article 73).");
		if (!v(s, "cnPush")) z12.push("Answer whether you use automated decision-making to push information or marketing (Article 24).");
		else if (yes(s, "cnPush") && (!v(s, "cnPushKind") || !v(s, "cnPushHow"))) z12.push("Say whether you offer an option not based on personal characteristics, a convenient way to refuse, or both, and how people use it (Article 24).");
		var z12ok = [];
		if (cnAdmDecides(s)) z12ok.push("Carry out a personal information protection impact assessment before automated decision-making (Article 55).");
		if (yes(s, "cnPush")) z12ok.push("If you provide a network platform service, also offer an easy-to-use switch-off for personalised recommendations, a way to refuse pushed information and a way to delete user tags based on personal characteristics (Regulations Article 42).");
		if (!cnAdmDecides(s) && yes(s, "profiling")) z12ok.push("Automated analysis that leads to no decision is described as such. If it leads to decisions, answer Yes to the automated decision question (Article 73).");
		checks.push(z12.length ? chk("Z12", "missing", z12.join(" ")) : cnAdmOn(s) ? chk("Z12", "ok", z12ok.join(" ")) : chk("Z12", "na", "No automated decision-making."));
		/* Z13 (R08) */
		var kidsP = acts.filter(function (a) { return yes(a, "cnKidsP"); }), z13 = [];
		if (yes(s, "cnKids")) {
			if (!v(s, "cnKidsRules") || !v(s, "cnKidsHow")) z13.push("Publish dedicated processing rules for children under 14 and say where; say how a parent or guardian gives consent (Article 31; Regulations Article 21; CAC Order No. 4, Articles 8 to 10).");
			if (!kidsP.length) z13.push("Mark each purpose that uses the personal information of minors under 14: it is sensitive, and the notice says why it is necessary and its impact (Articles 28 and 30).");
		}
		checks.push(!v(s, "cnKids") ? chk("Z13", "missing", "Answer whether you process the personal information of minors under 14 (Articles 28 and 31).") :
			no(s, "cnKids") ? chk("Z13", "na", "No personal information of minors under 14.") : z13.length ? chk("Z13", "missing", z13.join(" ")) : chk("Z13", "ok"));
		checks.push(chk("Z14", "ok", "Stated: complaints to the departments responsible for personal information protection (Article 65), and a claim before a people's court if a request to exercise rights is refused (Article 50)."));
		/* Z15 (R19) */
		var f = v(s, "cnFurther"), z15 = [];
		if (yes(s, "further")) {
			if (!cnBasis(f)) z15.push("Say whether you will ask for consent for the new purpose, or which other ground in Article 13 applies (Article 14).");
			else if (f === "law" && !v(s, "cnFurtherLaw")) z15.push("Name the law or administrative regulation for the new purpose (Article 13(1)(7)).");
			else if (f === "hr" && aud !== "employee") z15.push("Human resources management covers employees, under lawful labour rules and collective contracts: check the ground of the new purpose.");
		}
		checks.push(!yes(s, "further") ? chk("Z15", "ok", "Stated: changes are notified, with consent asked again where consent is the ground (Articles 14 and 17).") :
			z15.length ? chk("Z15", !cnBasis(f) || f === "law" ? "missing" : "warn", z15.join(" ")) : chk("Z15", "ok"));
		checks.push(/chin|mandarin|zh/i.test(v(s, "languages")) ? chk("Z16", "check", "This generator writes English. Check the Chinese version: clear and easy to understand, true, accurate and complete (Article 17).") :
			chk("Z16", "warn", "The rules must be in clear and easily understood language (Article 17). For people in mainland China that is normally Chinese. This generator writes English only: publish a Chinese version."));
		if (yes(s, "publicBody")) checks.push(chk("Z17", "warn", "State organs, and organisations authorised by law to manage public affairs, follow Articles 33 to 37: notice duties with exceptions (Article 35) and storage in China (Article 36). This generator does not model them."));
		/* Delivery */
		delivery.push(chk("Z18", "check", "Give the notice before processing, prominently. Publish these rules together in one prominent place that is easy to access, consult and save (Article 17; Regulations Article 21)."));
		var sepNeed = [];
		if (sens.some(function (a) { return cnBasisOf(s, a) === "consent"; })) sepNeed.push("sensitive personal information (Article 29)");
		if (oth.some(function (r) { return yes(r, "cnCons"); })) sepNeed.push("provision to other processors (Article 23)");
		if (xr.some(function (r) { return yes(r, "consent"); })) sepNeed.push("provision abroad (Article 39)");
		if (cons || sepNeed.length) delivery.push(chk("Z19", "check", "Ask for consent before processing, informed, voluntary and explicit, and do not ask again and again after a refusal (Article 14; Regulations Article 22)." + (sepNeed.length ? " Ask for separate consent for " + joinList(sepNeed) + ": a consent of its own, not bundled with others." : "")));
		if (yes(s, "cnKids")) delivery.push(chk("Z20", "check", "Tell the parent or guardian prominently and clearly, with an option to refuse: purposes, methods and scope; storage location, period and handling after expiry; security measures; consequences of refusing; complaint channels; how to correct and delete. Ask again after a material change (CAC Order No. 4, Articles 9 and 10). Set a dedicated user agreement for children and designate a person responsible for children's personal information (CAC Order No. 4, Article 8)."));
		if (yes(s, "cnPipo")) delivery.push(chk("Z21", "check", "Report the personal information protection officer to the city-level CAC office through the CAC system (grxxbh.cacdtsc.cn), within 30 working days of reaching 1 million people, and report a substantive change within 30 working days (CAC announcement of 18 July 2025)."));
		if (off) delivery.push(chk("Z22", "check", "Report the name and contact of your dedicated body or representative in China to the city-level CAC office (Article 53; Regulations Article 26)."));
		if (sens.length || cnAdmDecides(s) || oth.length || cnEntrusted(s).length || yes(s, "cnAbroad")) delivery.push(chk("Z23", "check", "Carry out a personal information protection impact assessment beforehand, and keep the report and records for at least three years (Articles 55 and 56)."));
		return { checks: checks, delivery: delivery };
	}

	/* A document led by China's PIPL. */
	function cnLead(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]";
		var aud = v(s, "audience");
		var title = AUD_TITLE[aud] || (v(s, "audienceOther") ? "Privacy notice for " + lcFirst(v(s, "audienceOther")) : "Privacy notice");
		var acts = pnActs(s), direct = pnSourceDirect(s), indirect = pnSourceIndirect(s);
		var meta = [ctrl];
		if (v(s, "version")) meta.push("Version " + v(s, "version"));
		if (v(s, "effective")) meta.push("Effective " + fmtDate(v(s, "effective")));
		var num = {}, c = 3;
		if (cnSensActs(s).length) num.sens = c++;
		if (indirect) num.source = c++;
		num.share = c++; num.abroad = c++;
		if (cnAdmOn(s)) num.adm = c++;
		if (yes(s, "cnKids")) num.kids = c++;
		num.rights = c++;
		if (cnConsent(s)) num.consent = c++;
		num.complaints = c++;
		if (inReg(s, "jp")) num.jp = c++;
		if (inReg(s, "kr")) num.kr = c++;
		if (inReg(s, "sg")) num.sg = c++;
		if (inReg(s, "au")) num.au = c++;
		if (inReg(s, "za")) num.za = c++;
		if (inReg(s, "ca")) num.ca = c++;
		if (inReg(s, "us")) num.us = c++;
		num.changes = c++;
		var blocks = [{ k: "h1", x: title }, { k: "meta", x: meta.map(stop).join(" ") }];

		var first = [{ k: "p", x: ctrl + " decides the purposes and methods of processing the personal information described in this notice (the personal information processor)." + (v(s, "ctrlEmail") ? " Contact: " + v(s, "ctrlEmail") + "." : "") }];
		if (acts.length) first.push({ k: "p", x: "What we process, and why:" }, { k: "ul", items: acts.map(function (a) { return { b: (v(a, "purpose") || "[purpose]") + ":", x: stop(v(a, "data") || "[categories of personal information]") }; }) });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		if (num.sens) first.push({ k: "p", x: "We process sensitive personal information. Section " + num.sens + " says why it is necessary and what it means for you." });
		if (yes(s, "cnAbroad")) first.push({ k: "p", x: "We provide personal information to recipients outside mainland China. Section " + num.abroad + " names them." });
		else if (cnOffshore(s)) first.push({ k: "p", x: "We are based outside mainland China. Section " + num.abroad + " says where we process your personal information." });
		first.push({ k: "p", x: "You can access, copy, transfer, correct, supplement and delete your personal information, restrict or refuse its processing" + (cnConsent(s) ? ", withdraw your consent" : "") + (yes(s, "cnAccount") ? ", deregister your account" : "") + ", and complain. Sections " + joinList([num.rights, num.consent, num.complaints].filter(Boolean).map(String)) + " explain how." });
		if (num.jp) first.push({ k: "p", x: "If you are in Japan, section " + num.jp + " also applies to you." });
		if (num.kr) first.push({ k: "p", x: "If you are in Korea, section " + num.kr + " also applies to you." });
		if (num.sg) first.push({ k: "p", x: sgPointer(s, num.sg) });
		if (num.au) first.push({ k: "p", x: auPointer(s, num.au) });
		if (num.za) first.push({ k: "p", x: zaPointer(s, num.za) });
		if (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });
		if (num.us) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + num.us + " also applies to you." });
		blocks.push({ k: "box", title: "In short", blocks: first });

		blocks.push({ k: "h2", x: "1. Who processes your personal information" });
		var who = [ctrl];
		if (v(s, "ctrlAddress")) who.push(v(s, "ctrlAddress").replace(/\n+/g, ", "));
		blocks.push({ k: "p", x: stop(who.join(", ")) + " We decide the purposes and methods of the processing: under the PIPL, we are the personal information processor. These processing rules are public, and you can consult and save them at any time (Article 17)." });
		var chans = [];
		if (v(s, "ctrlEmail")) chans.push({ b: "Email:", x: v(s, "ctrlEmail") });
		if (v(s, "ctrlPhone")) chans.push({ b: "Telephone:", x: v(s, "ctrlPhone") });
		if (chans.length) blocks.push({ k: "ul", items: chans });
		Array.prototype.push.apply(blocks, cnWhoBody(s));
		if (yes(s, "joint")) {
			var ja = acts.filter(function (a) { return yes(a, "jointP"); });
			blocks.push({ k: "p", x: "For " + (ja.length ? joinList(ja.map(function (a) { return cnLc(v(a, "purpose") || "[purpose]"); })) : "[mark the purposes concerned]") + " we decide the purposes and methods together with " + cnTrim(v(s, "jointWho") || "[other processor]") + ". " +
				stop(v(s, "jointEssence") || "[how the rights and obligations are divided]") + " You can exercise your rights against either of us (Article 20). Contact " + stop(v(s, "jointContact") || "[contact point]") });
		}

		blocks.push({ k: "h2", x: "2. What we process, why and how" });
		Array.prototype.push.apply(blocks, cnTable(s));
		Array.prototype.push.apply(blocks, cnHowBody(s));
		if (yes(s, "inferred")) blocks.push({ k: "p", x: "We also derive personal information about you from the information above: " + stop(v(s, "inferredWhat") || "[what is inferred, and from what]") });
		if (num.sens) { blocks.push({ k: "h2", x: num.sens + ". Sensitive personal information" }); Array.prototype.push.apply(blocks, cnSensBody(s)); }
		if (num.source) {
			blocks.push({ k: "h2", x: num.source + ". Where your personal information comes from" });
			var src = arr(s, "sources");
			if (src.length) blocks.push({ k: "ul", items: src.map(function (x) {
				var ai = v(x, "usedFor"), a = ai !== "" ? acts[+ai] : null;
				return { b: (v(x, "name") || "[source]") + ":", x: (v(x, "what") || "[categories of personal information]") + (yes(x, "pub") ? " (publicly available)" : "") +
					", used for " + (a ? cnLc(v(a, "purpose") || "[purpose]") : "[purpose]") + ". Its ground and retention are as for that purpose in section 2." };
			}) });
			else if (!yes(s, "unattributable")) blocks.push({ k: "p", x: "[Name each source of the personal information, and what you get from it.]" });
			if (yes(s, "unattributable")) blocks.push({ k: "p", x: "Where we cannot attribute a record to a single source, the information comes from " + stop(v(s, "sourceNature") || "[nature of the sources and type of organisation]") });
		}
		blocks.push({ k: "h2", x: num.share + ". Providing your personal information to others" });
		Array.prototype.push.apply(blocks, cnShareBody(s));
		blocks.push({ k: "h2", x: num.abroad + ". Outside mainland China" });
		Array.prototype.push.apply(blocks, cnAbroadBody(s));
		if (num.adm) { blocks.push({ k: "h2", x: num.adm + ". " + (cnAdmDecides(s) ? "Automated decision-making" : "Automated analysis of your personal information") }); Array.prototype.push.apply(blocks, cnAdmBody(s, true)); }
		if (num.kids) { blocks.push({ k: "h2", x: num.kids + ". Children under 14" }); Array.prototype.push.apply(blocks, cnKidsBody(s)); }
		blocks.push({ k: "h2", x: num.rights + ". Your rights" });
		Array.prototype.push.apply(blocks, cnRightsBody(s));
		if (num.consent) { blocks.push({ k: "h2", x: num.consent + ". Withdrawing consent" }); Array.prototype.push.apply(blocks, cnConsentBody(s)); }
		blocks.push({ k: "h2", x: num.complaints + ". Complaints" });
		blocks.push({ k: "p", x: CN_COMPLAIN });

		var cnSecs = [num.rights, num.consent, num.complaints].filter(Boolean).map(String);
		var only = cnSecs.length ? " " + (cnSecs.length > 1 ? "Sections " : "Section ") + joinList(cnSecs) + (cnSecs.length > 1 ? " apply" : " applies") + " to you only where the PIPL applies to our processing of your personal information." : "";
		var jpRes = null;
		if (num.jp) {
			blocks.push({ k: "h2", x: num.jp + ". Additional information for people in Japan" });
			Array.prototype.push.apply(blocks, jpSection(s, cnSecs, "the PIPL"));
			jpRes = jpChecks(s, false);
		}
		var krRes = null;
		if (num.kr) {
			blocks.push({ k: "h2", x: num.kr + ". Additional information for people in Korea" });
			Array.prototype.push.apply(blocks, krSection(s, cnSecs, "the PIPL"));
			krRes = krChecks(s, false);
		}
		var sgRes = null;
		if (num.sg) {
			blocks.push({ k: "h2", x: num.sg + ". " + sgHead(s) });
			Array.prototype.push.apply(blocks, sgSection(s, cnSecs, "the PIPL"));
			sgRes = sgChecks(s, false);
		}
		var auRes = null;
		if (num.au) {
			blocks.push({ k: "h2", x: num.au + ". " + auHead(s) });
			Array.prototype.push.apply(blocks, auSection(s, cnSecs, "the PIPL"));
			auRes = auChecks(s, false);
		}
		var zaRes = null;
		if (num.za) {
			blocks.push({ k: "h2", x: num.za + ". " + zaHead(s) });
			Array.prototype.push.apply(blocks, zaSection(s, cnSecs, "the PIPL"));
			zaRes = zaChecks(s, false);
		}
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

		blocks.push({ k: "h2", x: num.changes + ". Changes to these rules" });
		if (yes(s, "further")) blocks.push(cnFurtherBox(s));
		blocks.push({ k: "p", x: CN_CHANGES + " We do not expect you to check this page for updates." });
		if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });

		var cr = cnChecks(s, true), checks = cr.checks, delivery = cr.delivery;
		if (yes(s, "joint")) checks.push(v(s, "jointWho") && v(s, "jointEssence") && v(s, "jointContact") && acts.some(function (a) { return yes(a, "jointP"); }) ? chk("P19", "ok", "Joint processors agree their rights and obligations, and people can exercise rights against either (Article 20).", undefined, "PIPL Art. 20; WP260 44 (good practice)") :
			chk("P19", "warn", "Name the other processor, how rights and obligations are divided, and the contact point (Article 20).", undefined, "PIPL Art. 20; WP260 44 (good practice)"));
		checks.push(v(s, "consequences") ? chk("P21", "ok", "", undefined, "WP260 10, 36 (good practice)") : chk("P21", "warn", "Empty. Fine only if nothing here would surprise people.", undefined, "WP260 10, 36 (good practice)"));
		if (jpRes) { Array.prototype.push.apply(checks, jpRes.checks); Array.prototype.push.apply(delivery, jpRes.delivery); }
		if (krRes) { Array.prototype.push.apply(checks, krRes.checks); Array.prototype.push.apply(delivery, krRes.delivery); }
		if (sgRes) { Array.prototype.push.apply(checks, sgRes.checks); Array.prototype.push.apply(delivery, sgRes.delivery); }
		if (auRes) { Array.prototype.push.apply(checks, auRes.checks); Array.prototype.push.apply(delivery, auRes.delivery); }
		if (zaRes) { Array.prototype.push.apply(checks, zaRes.checks); Array.prototype.push.apply(delivery, zaRes.delivery); }
		if (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }
		if (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(delivery, usRes.delivery); }
		var lintHits = lintText(blocks);
		checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "PIPL Art. 17 (true, accurate, complete); WP260 13") :
			chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "PIPL Art. 17 (true, accurate, complete); WP260 13"));
		var gp = [];
		if (direct) gp.push(chk("D01", "check", "Give the notice before you collect the data: before a form is submitted, before payment, before sign-up.", "Timing: when the data is collected"));
		gp.push(chk("D03", "check", "Read it as a member of the audience would: clear and easily understood language (Article 17)."));
		if (has(s, "channel", "web")) gp.push(chk("D05", "check", "Link it from every page under a common term such as \"Privacy\", and from every form that collects personal information."));
		if (has(s, "channel", "app")) gp.push(chk("D06", "check", "Show it in the app store listing and keep it within two taps inside the app."));
		gp.push(chk("D07", "check", has(s, "channel", "phone") || has(s, "channel", "paper") || has(s, "channel", "device") ? "Offline, give the \"In short\" content first and point to the full notice." : "Use the \"In short\" box as the first layer and keep it consistent with the full text."));
		gp.push(chk("D08", "check", "Keep the full rules available as one document that people can consult and save (Article 17)."));
		gp.push(chk("D12", "check", "When the rules change, tell people what changed (Article 17), highlighting it, before the change takes effect."));
		gp.push(chk("D14", "check", "If you add icons, keep them alongside the text, never instead of it."));
		gp.forEach(function (r) { var m = D.MATRIX[r.id]; if (m) r.s = m.s.replace(/^Art\.[^;]*;\s*/, "") + " (good practice)"; });
		delivery = gp.concat(delivery);
		return { title: title, file: slug(ctrl + " " + title), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(delivery), docLabel: "Notice" };
	}

	/* Form section for China: everything except the per-purpose, recipient and overseas fields. */
	var CN_SECTION = {
		title: "China: Personal Information Protection Law",
		show: cnOn,
		lead: "The PIPL (in force 1 November 2021) and the Network Data Security Management Regulations (in force 1 January 2025). Set the Article 13 ground and any sensitive personal information with each purpose above, other processors with each recipient, and overseas recipients under transfers.",
		fields: [
			{ id: "cnScope", type: "select", label: "How the PIPL applies to you", opts: [
				{ v: "in", l: "We process the personal information in mainland China" },
				{ v: "offer", l: "We are outside China and provide products or services to people in China" },
				{ v: "assess", l: "We are outside China and analyse or assess the behaviour of people in China" }],
			  hint: "Article 3. A processor outside China under Article 3(2) needs a dedicated body or a representative in China (Article 53)." },
			{ id: "cnOffWhere", type: "text", label: "Where you are, and where you process the personal information", show: cnOffshore, ph: "for example Singapore",
			  hint: "The notice tells people in China that their personal information is collected and processed there (Article 17)." },
			{ id: "cnRepKind", type: "select", label: "In China you have", show: cnOffshore,
			  opts: [{ v: "entity", l: "A dedicated body" }, { v: "rep", l: "A designated representative" }] },
			{ id: "cnRep", type: "text", label: "Its name and contact details", show: cnOffshore,
			  hint: "Article 53; Regulations Article 26: reported to the city-level CAC office. Naming it in the notice is good practice." },
			{ id: "cnPipo", type: "yesno", label: "Do you process the personal information of 1 million people or more?",
			  hint: "Compliance Audit Measures, Article 12, and PIPL Article 52: appoint a personal information protection officer and publish their contact; the CAC announcement of 18 July 2025 sets how to report them." },
			{ id: "cnPipoName", type: "text", label: "Personal information protection officer: name or title", show: function (s) { return yes(s, "cnPipo"); } },
			{ id: "cnPipoContact", type: "text", label: "The officer's contact details", show: function (s) { return yes(s, "cnPipo"); } },
			{ id: "cnMethod", type: "area", rows: 2, label: "How you process the personal information (the processing methods)", ph: "for example collected through our app, stored on servers in Shanghai, analysed automatically to detect fraud",
			  hint: "Article 17(1)(2): purposes, processing methods, categories and retention. Where a purpose is processed differently, say so with that purpose." },
			{ id: "cnAfter", type: "text", label: "What happens to the personal information when its retention period ends", ph: "for example it is deleted, or anonymised so that no one can be identified",
			  hint: "Regulations Article 21(1)(3)." },
			{ id: "cnNoRecip", type: "yesno", label: "You listed no recipients. Confirm that no one else receives the personal information, not even hosting, email or IT providers",
			  show: function (s) { return !arr(s, "recipients").length; } },
			{ id: "cnAccount", type: "yesno", label: "Do people have an account with you?",
			  hint: "Regulations Articles 21 and 24: the rules say how to deregister it; on deregistration, delete or anonymise." },
			{ id: "cnAccountHow", type: "text", label: "How people deregister their account", show: function (s) { return yes(s, "cnAccount"); } },
			{ id: "cnPush", type: "yesno", label: "Do you use automated decision-making to push information or commercial marketing to people?",
			  hint: "Article 24: offer an option not targeted at personal characteristics, or a convenient way to refuse. A network platform service also offers a switch-off for personalised recommendations and deletion of user tags (Regulations Article 42)." },
			{ id: "cnPushKind", type: "select", label: "What you offer", show: function (s) { return yes(s, "cnPush"); },
			  opts: [{ v: "option", l: "Content not based on personal characteristics" }, { v: "refuse", l: "A convenient way to refuse" }, { v: "both", l: "Both" }] },
			{ id: "cnPushHow", type: "text", label: "How people use it", show: function (s) { return yes(s, "cnPush"); } },
			{ id: "cnKids", type: "yesno", label: "Do you process the personal information of minors under 14?",
			  hint: "Articles 28 and 31: sensitive personal information; consent of a parent or other guardian; dedicated processing rules. Mark each purpose that uses it." },
			{ id: "cnKidsHow", type: "area", rows: 2, label: "How a parent or other guardian gives consent", show: function (s) { return yes(s, "cnKids"); } },
			{ id: "cnKidsRules", type: "text", label: "Where your dedicated rules for children's personal information are published", show: function (s) { return yes(s, "cnKids"); }, ph: "for example example.cn/privacy/children" },
			{ id: "cnKidsContact", type: "text", label: "The person responsible for children's personal information, and their contact (optional)", show: function (s) { return yes(s, "cnKids"); },
			  hint: "CAC Order No. 4, Article 8: designate a person." }
		]
	};

