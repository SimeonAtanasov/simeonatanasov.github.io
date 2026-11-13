	/* ========================================================= INDIA === */
	/* India (matrix Part P): the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Digital
	   Personal Data Protection Rules, 2025 (G.S.R. 846(E)), read on MeitY's Gazette copies on 12 November
	   2026 (notes in build/in/notes.md). The notice duty (section 5, Rule 3) applies from 13 May 2027
	   (G.S.R. 843(E); Rule 1(4)). The law has no legal bases as the GDPR has them: each purpose rests on
	   consent or on a legitimate use in section 7. */
	function inOn(s) { return inReg(s, "in"); }
	function inGroundOf(s, a) { return inOn(s) ? v(a, "inGround") : ""; }
	function inConsentActs(s) { return pnActs(s).filter(function (a) { return inGroundOf(s, a) === "consent"; }); }
	function inConsent(s) { return inConsentActs(s).length > 0 || (inOn(s) && yes(s, "further") && v(s, "inFurther") === "consent"); }
	function inSdf(s) { return inOn(s) && yes(s, "inSdf"); }
	function inWho(s) { return v(s, "inContactName") || (inSdf(s) ? "[name of the Data Protection Officer]" : "[name or title of the person who answers questions]"); }
	function inWhoContact(s) { return v(s, "inContact") || "[business contact information]"; }
	function inMeans(s) { return (v(s, "inLink") || "[link to the page of your website or app]").replace(/[.]$/, "") + (v(s, "inOtherMeans") ? ", or " + lcFirst(v(s, "inOtherMeans").replace(/[.]$/, "")) : ""); }
	function inDaysNum(s) { var m = /^\s*(\d+)\s*(days?)?\s*$/i.exec(v(s, "inDays")); return m ? +m[1] : NaN; }
	function inDaysTxt(s) { var n = inDaysNum(s); return !isNaN(n) ? n + (n === 1 ? " day" : " days") : v(s, "inDays") ? v(s, "inDays").replace(/[.]$/, "") : "[number of] days"; }
	function inGround(g) { return lbl(D.IN_GROUNDS, g); }
	var IN_ROLE = { processor: "Data Processor acting for us", controller: "Another Data Fiduciary, for its own purposes", joint: "Decides with us how it is used", authority: "Public authority" };
	/* I06: the ground of one purpose. */
	function inGroundTxt(s, a) {
		var g = inGroundOf(s, a), o = inGround(g);
		if (g === "consent") return "Your consent (section 6).";
		if (o) return "Without consent, as a legitimate use: " + o.t + " (section " + o.sec + ").";
		return "[Choose consent, or the legitimate use in section 7 that applies.]";
	}
	/* I04, I05: Rule 3(b). led adds the retention column. */
	function inTable(s, led) {
		var acts = pnActs(s);
		if (!acts.length) return [{ k: "p", x: "[Add the purposes.]" }];
		var head = ["Purpose", "Personal data", "What it lets us provide", "Ground"];
		if (led) head.push("How long we keep it");
		return [{ k: "table", head: head, rows: acts.map(function (a) {
			var en = inGroundOf(s, a) === "consent" ? v(a, "inEnables") || "[the goods or services provided, or uses enabled]" : "";
			var r = [v(a, "purpose") || "[purpose]", v(a, "data") || "[each item of personal data]", en, inGroundTxt(s, a)];
			if (led) r.push(v(a, "retention") || "[retention period or criteria]");
			return r;
		}) }];
	}
	function inAboutBody(s) {
		var b = [], acts = pnActs(s);
		if (inConsentActs(s).length) b.push({ k: "p", x: "Where we rely on your consent, we give you this notice with or before our request. We ask only for the personal data needed for the purpose, and your consent covers that purpose only (sections 5 and 6)." });
		var va = acts.filter(function (a) { return inGroundOf(s, a) === "7a"; });
		if (va.length) b.push({ k: "p", x: "For " + joinList(va.map(function (a) { return lcFirst(v(a, "purpose") || "[purpose]"); })) + ", you can tell us at any time that you do not want us to use your personal data, and we stop (section 7(a))." });
		return b;
	}
	/* I02: sections 6(3), 8(9) and 10(2)(a); Rule 9. */
	function inContactBody(s) {
		return [{ k: "p", x: (inSdf(s) ? "Our Data Protection Officer, based in India, answers your questions about the processing of your personal data and handles your grievances: " :
			"The person who answers your questions about the processing of your personal data: ") + inWho(s) + ", " + stop(inWhoContact(s)) }];
	}
	/* I15: section 8(7) and (8); Rule 8; Third and Seventh Schedules. */
	function inEraseBody(s, led) {
		var b = [{ k: "p", x: (inConsent(s) ? "We erase your personal data when you withdraw your consent, or as soon as it is reasonable to assume that the purpose is no longer served, whichever is earlier" :
			"We erase your personal data as soon as it is reasonable to assume that the purpose is no longer served") + ", and our Data Processors erase what we gave them, unless a law requires us to keep it (section 8(7))." }];
		var cls = lbl(D.IN_ERASE, v(s, "inErase"));
		if (cls && cls.svc) b.push({ k: "p", x: "If, for three years, you neither use our " + cls.svc + " for the purpose you gave us your personal data for nor exercise your rights, we treat that purpose as no longer served and erase the data, unless a law requires us to keep it, except what you need to access your user account or a virtual token we issued that you can use to get money, goods or services. At least 48 hours before we erase it, we tell you; it stays if, in that time, you log in, contact us for that purpose or exercise your rights (section 8(8); Rule 8 and Third Schedule to the DPDP Rules)." });
		else if (!v(s, "inErase")) b.push({ k: "p", x: "[Say whether you are an e-commerce entity, online gaming intermediary or social media intermediary of the size in the Third Schedule to the DPDP Rules.]" });
		b.push({ k: "p", x: "Whatever the purpose and the period" + (led ? " in section 2" : "") + ", we keep personal data, the related traffic data and the logs of our processing for at least one year from the processing, because the DPDP Rules require it so that the Government can call for information for the purposes they list. Then we erase them, unless another law requires us to keep them longer (Rule 8(3) and Seventh Schedule)." });
		return b;
	}
	/* I17: section 16; Rule 15. Shown only when the user says it happens. */
	function inAbroadBody(s) {
		return [{ k: "p", x: "We process your personal data outside India, in " + stop(v(s, "inAbroadWhere") || "[countries]") +
			" The DPDP Act allows this, unless the Central Government restricts transfers to a country, and subject to any requirements it sets for making personal data available to a foreign State (section 16; Rule 15)." }];
	}
	/* I13, I14: section 9; Rules 10 to 12; Fourth Schedule. */
	/* Fourth Schedule exemption: all children's processing within it (no parental consent paragraph),
	   part of it, or not answered. */
	function inKidsAllEx(s) { return yes(s, "inKidsExempt") && yes(s, "inKidsAllExempt"); }
	function inKidsBody(s) {
		var b = [];
		if (yes(s, "inKids")) {
			var ex = yes(s, "inKidsExempt"), what = (v(s, "inKidsExemptWhat") || "[the class or purpose in the Fourth Schedule]").replace(/[.]$/, "");
			if (inKidsAllEx(s)) b.push({ k: "p", x: "A child is anyone under 18. We process children's personal data only within an exemption in the DPDP Rules, and within its conditions, so we do not ask a parent for consent: " + what + " (Rule 12 and Fourth Schedule)." });
			else {
				b.push({ k: "p", x: "A child is anyone under 18. " + (ex ? "Except as described below, before" : "Before") + " we process a child's personal data, we obtain the verifiable consent of a parent or lawful guardian, and check that the person giving it is an adult (section 9(1); Rule 10). " +
					(v(s, "inKidsHow") ? stop(v(s, "inKidsHow")) : "[How a parent gives consent, and how you check that they are an adult.]") });
				if (ex) b.push({ k: "p", x: "We process children's personal data without a parent's consent only where the DPDP Rules allow it, and within their conditions: " + what + " (Rule 12 and Fourth Schedule)." });
				else if (!v(s, "inKidsExempt")) b.push({ k: "p", x: "[Say whether you rely on an exemption in the Fourth Schedule to the DPDP Rules.]" });
			}
			var tr = v(s, "inTrack"), ads = v(s, "inKidsAds"), t = [];
			t.push(!tr ? "[Say whether you track or monitor children's behaviour.]" : no(s, "inTrack") ? "We do not track or monitor children's behaviour (section 9(3))." :
				ex ? "We track or monitor children only as that exemption allows (section 9(3); Rule 12)." :
				"[Section 9(3) prohibits tracking or behavioural monitoring of children, unless an exemption in the DPDP Rules applies. Stop it, or name the exemption.]");
			t.push(!ads ? "[Say whether you target advertising at children.]" : no(s, "inKidsAds") ? "We do not target advertising at children (section 9(3))." :
				"[Section 9(3) prohibits targeted advertising directed at children, and no exemption in the DPDP Rules covers it. Stop it.]");
			b.push({ k: "p", x: "We do not process children's personal data in a way likely to harm their well-being (section 9(2)). " + t.join(" ") });
		}
		if (yes(s, "inDisab")) b.push({ k: "p", x: "For a person with a disability who has a lawful guardian, we obtain the guardian's verifiable consent, and check that a court, a designated authority or a local level committee appointed the guardian (section 9(1); Rule 11)." });
		return b;
	}
	function inKidsOn(s) { return yes(s, "inKids") || yes(s, "inDisab"); }
	function inKidsTitle(s) { return yes(s, "inKids") && yes(s, "inDisab") ? "Children, and people with disabilities who have a lawful guardian" : yes(s, "inKids") ? "Children" : "People with disabilities who have a lawful guardian"; }
	/* I09, I16: sections 6(4), 6(7), 11 to 14; Rule 14. */
	/* Sections 11 and 12 reach only data processed with consent or given under section 7(a). */
	function inAccessActs(s) { return pnActs(s).filter(function (a) { var g = inGroundOf(s, a); return g === "consent" || g === "7a"; }); }
	function inRightsBody(s) {
		var b = [], R = [], acc = inAccessActs(s), all = acc.length === pnActs(s).length;
		if (acc.length || inConsent(s)) {
			R.push({ b: "Access (section 11).", x: "You can ask us for a summary of the personal data we process about you and of what we do with it, and for the identities of all other Data Fiduciaries and Data Processors we have shared it with, with a description of what we shared." });
			R.push({ b: "Correction and erasure (section 12).", x: "You can ask us to correct inaccurate or misleading personal data, complete it, update it, or erase it. We erase it unless we need it for the purpose you gave it for, or a law requires us to keep it." });
		}
		if (inConsent(s)) R.push({ b: "Withdrawing consent (section 6(4)).", x: "You can withdraw your consent at any time, as easily as you gave it." });
		R.push({ b: "Grievance redressal (section 13).", x: "You can raise a grievance with us about how we handle your personal data or about your rights." });
		R.push({ b: "Nomination (section 14).", x: "You can nominate another individual to exercise your rights if you die, or if unsoundness of mind or infirmity of body leaves you unable to exercise them." + (v(s, "inNominate") ? " " + stop(v(s, "inNominate")) : "") });
		b.push({ k: "ul", items: R });
		if (!acc.length && !inConsent(s)) b.push({ k: "p", x: "The DPDP Act gives the rights of access, correction and erasure only for personal data processed with your consent or given voluntarily for a purpose (sections 11 and 12). None of the purposes in this notice is of that kind." });
		else if (all) b.push({ k: "p", x: "Access, correction and erasure cover the personal data you gave us with your consent, or voluntarily for a purpose (section 7(a))." });
		else b.push({ k: "p", x: "Access, correction and erasure cover the personal data you gave us with your consent, or voluntarily for a purpose (section 7(a)). In this notice, that is the data for " +
			(acc.length ? joinList(acc.map(function (a) { return lcFirst(v(a, "purpose") || "[purpose]"); })) : "the new purpose we describe") + "." });
		b.push({ k: "p", x: "To make a request, use " + stop(inMeans(s)) + (v(s, "inIdentifier") ? " To identify you, we need " + lcFirst(stop(v(s, "inIdentifier"))) : "") +
			" We respond to grievances within " + inDaysTxt(s) + " (section 13(2); Rule 14(3)), and to requests to exercise your rights within the same period." });
		if (yes(s, "inCm")) b.push({ k: "p", x: "You can also give, manage, review and withdraw your consent through " + (v(s, "inCmName") || "[name of the Consent Manager]").replace(/[.]$/, "") + ", a Consent Manager registered with the Data Protection Board of India (section 6(7) and (9))." });
		return b;
	}
	/* I08: section 6(4) to (6); Rule 3(c)(i). */
	function inConsentBody(s) {
		return [{ k: "p", x: "You can withdraw your consent at any time, as easily as you gave it: " + stop(v(s, "withdrawHow") || inMeans(s)) +
			(v(s, "withdrawHow") ? " You can also use " + stop(inMeans(s)) : "") +
			" Withdrawing does not affect what we did with your consent before. You bear its consequences: for example, we can no longer provide a service that needs the data. Within a reasonable time we stop processing your personal data for that purpose, and make our Data Processors stop, unless the law requires or allows the processing without your consent (section 6(4) to (6))." }];
	}
	/* I10, I11: sections 5(1)(iii), 13; Rule 3(c)(iii), Rule 14(3). */
	function inComplaintBody(s) {
		return [{ k: "p", x: "If you have a grievance about how we handle your personal data, or about your rights, contact us: " + inWho(s) + ", " + stop(inWhoContact(s)) +
			" You can also use " + stop(inMeans(s)) + " We respond within " + inDaysTxt(s) + "." },
			{ k: "p", x: "Use our grievance process first: the DPDP Act requires it before a complaint to the Data Protection Board of India (section 13(3)). If it does not resolve your grievance, you can complain to the Board, which works online as a digital office: " +
				stop(v(s, "inBoard") || "[how to reach the Board: its complaint link or app]") }];
	}
	/* I12: sections 5(3) and 6(3). */
	function inLangBody(s) {
		return [{ k: "p", x: "You can read this notice in English or in any language listed in the Eighth Schedule to the Constitution of India: " + stop(v(s, "inLangHow") || "[how people choose a language]") }];
	}
	var IN_CHANGES = "Before we use your personal data for a new purpose, we give you a notice of it and ask for your consent, unless the DPDP Act allows that use without consent (sections 5 to 7).";
	/* I18 */
	function inFurtherTxt(s) {
		var f = v(s, "inFurther"), o = inGround(f);
		if (f === "7a") return "[Section 7(a) covers only the purpose the person gave the data for. Say whether you will ask for consent for the new purpose, or which other legitimate use in section 7 applies.]";
		return f === "consent" ? "We will give you a notice and ask for your consent before we use your personal data for it." :
			o ? "The DPDP Act allows this use without consent, as a legitimate use: " + o.t + " (section " + o.sec + ")." :
			"[Say whether you will ask for consent, or which legitimate use in section 7 applies.]";
	}
	function inFurtherBox(s) {
		return { k: "box", title: "Planned new use of your personal data", blocks: [
			{ k: "p", x: "From " + (fmtDate(v(s, "furtherStart")) || "[start date]") + " we intend to use personal data we already hold for a new purpose: " + stop(v(s, "furtherWhat") || "[new purpose]") },
			{ k: "p", x: "For this new purpose we use " + lcFirst(v(s, "furtherData") || "[personal data]") + ", and " + keepFor(v(s, "furtherRetention") || "[retention period or criteria]") },
			{ k: "p", x: inFurtherTxt(s) }] };
	}

	/* The "Additional information for people in India" section of a notice led by another law. */
	function inSection(s, secs, lawName) {
		var b = [], H = function (t) { b.push({ k: "h3", x: t }); };
		var other = secs.filter(Boolean).map(String), ctrl = v(s, "ctrlName") || "[Organisation]";
		b.push({ k: "p", x: "For people in India, the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Digital Personal Data Protection Rules, 2025 apply. " + ctrl +
			" is the Data Fiduciary. The rest of this notice describes how we handle your personal data. The details, choices and rights in this section are those this law gives you." +
			(other.length ? " " + (other.length > 1 ? "Sections " : "Section ") + joinList(other) + (other.length > 1 ? " apply" : " applies") + " to you only where " + lawName + " applies to our processing of your data." : "") });
		H(inSdf(s) ? "Our Data Protection Officer" : "Who answers your questions");
		Array.prototype.push.apply(b, inContactBody(s));
		H("Personal data we process, and why");
		Array.prototype.push.apply(b, inTable(s, false));
		Array.prototype.push.apply(b, inAboutBody(s));
		H("How long we keep it");
		Array.prototype.push.apply(b, inEraseBody(s, false));
		if (yes(s, "inAbroad")) { H("Processing outside India"); Array.prototype.push.apply(b, inAbroadBody(s)); }
		if (inKidsOn(s)) { H(inKidsTitle(s)); Array.prototype.push.apply(b, inKidsBody(s)); }
		H("Your rights in India");
		Array.prototype.push.apply(b, inRightsBody(s));
		if (inConsent(s)) { H("Withdrawing consent"); Array.prototype.push.apply(b, inConsentBody(s)); }
		H("Grievances and complaints");
		Array.prototype.push.apply(b, inComplaintBody(s));
		H("Language");
		Array.prototype.push.apply(b, inLangBody(s));
		H("New purposes");
		b.push({ k: "p", x: IN_CHANGES + (yes(s, "further") ? " For the new purpose described in this notice: " + lcFirst(inFurtherTxt(s)) : "") });
		return b;
	}

	/* Part P rows. led: India sets the main text. */
	function inChecks(s, led) {
		var checks = [], delivery = [], acts = pnActs(s), ca = inConsentActs(s), cons = inConsent(s);
		var who = inSdf(s) ? "your Data Protection Officer" : "the person who answers questions about the processing";
		if (led) {
			var nCh = (v(s, "ctrlEmail") ? 1 : 0) + (v(s, "ctrlPhone") ? 1 : 0) + (v(s, "ctrlAddress") ? 1 : 0);
			checks.push(!v(s, "ctrlName") || !nCh ? chk("I01", "missing", "Add the organisation's name and at least one contact channel.") : chk("I01", "ok"));
		}
		var leadName = { eu: "the EU GDPR", uk: "the UK GDPR", ch: "the FADP", br: "the LGPD", can: "Canada" }[prim(s)] || "the law that leads";
		var i02 = [];
		if (!v(s, "inContactName") || !v(s, "inContact")) i02.push("Give the name or title and the business contact information of " + who + " (sections 6(3) and 8(9); Rule 9).");
		if (!v(s, "inSdf")) i02.push("Answer whether you have been notified as a Significant Data Fiduciary (section 10).");
		checks.push(i02.length ? chk("I02", "missing", i02.join(" ")) :
			chk("I02", "ok", inSdf(s) ? "A Significant Data Fiduciary's Data Protection Officer must be based in India, answer to your board and be the point of contact for grievances (section 10(2)(a))." : ""));
		var sc = v(s, "inScope");
		checks.push(!sc ? chk("I03", "missing", "Say how the DPDP Act applies to you (section 3).") :
			sc === "contract" ? chk("I03", "warn", "Section 17(1)(d): processing in India of personal data of people outside India, under a contract with a person outside India, is exempt from Chapter II, including the notice, except your responsibility for compliance and your security safeguards (section 8(1) and (5)), and from Chapter III and section 16. If that is all you do with these people's data, you need no notice under the DPDP Act.") :
			chk("I03", "ok", (sc === "offer" ? "Outside India, the Act applies where the processing is connected to offering goods or services to people in India (section 3(b)). " : "") +
				"The notice duty (section 5; Rule 3) applies from 13 May 2027 (G.S.R. 843(E); Rule 1(4)); you can give the notice now. The Act covers digital personal data, and not data the person has made publicly available (section 3). Check whether the Government has notified your class as exempt from the notice (section 17(3))."));
		var ITEM = /\b(etc|and other|and so on|such as|including|among others|personal (data|information|details)|information about you|data about you|your data|various)\b/i;
		var noData = ca.filter(function (a) { return !v(a, "data"); }), vague = ca.filter(function (a) { return ITEM.test(v(a, "data")); });
		var pl = function (list) { return joinList(list.map(function (a) { return v(a, "purpose") || "[purpose]"; })); };
		var i04 = [];
		if (noData.length) i04.push("List the personal data for " + pl(noData) + " (Rule 3(b)(i)).");
		if (vague.length) i04.push("Itemise: name each item of personal data, without catch-alls such as \"etc.\", \"such as\" or \"personal details\" (Rule 3(b)(i)). Check the data listed for " + pl(vague) + ".");
		var noGr = acts.filter(function (a) { return !inGround(inGroundOf(s, a)); });
		checks.push(!acts.length ? chk("I04", "missing", "Add the purposes.") : noGr.length && !ca.length ? chk("I04", "missing", "Choose the ground for each purpose first (row I06).") : !ca.length ? chk("I04", "ok", "No purpose relies on consent: Rule 3 sets the content of the notice that goes with a request for consent. Listing the data for every purpose is still good practice.") :
			i04.length ? chk("I04", noData.length ? "missing" : "warn", i04.join(" ")) : chk("I04", "ok"));
		var noEn = ca.filter(function (a) { return !v(a, "inEnables"); }), vp = acts.filter(function (a) { return D.LINT.vaguePurpose.test(v(a, "purpose")); });
		var i05 = [];
		if (noEn.length) i05.push("For each purpose that relies on consent, describe the goods or services provided, or the uses enabled: " + pl(noEn) + " (Rule 3(b)(ii)).");
		if (vp.length) i05.push("State each purpose specifically, so that consent can be specific and informed (Rule 3(b)): " + pl(vp) + ".");
		checks.push(!acts.length ? chk("I05", "missing", "Add the purposes.") : i05.length ? chk("I05", noEn.length ? "missing" : "warn", i05.join(" ")) : chk("I05", "ok"));
		var noG = acts.filter(function (a) { return !inGround(inGroundOf(s, a)); });
		var st = acts.filter(function (a) { var g = inGroundOf(s, a); return g === "7b" || g === "7c"; });
		var emp = acts.filter(function (a) { return inGroundOf(s, a) === "7i"; });
		var g7a = acts.filter(function (a) { return inGroundOf(s, a) === "7a"; });
		var g6 = [];
		if (st.length && !yes(s, "publicBody")) g6.push("Sections 7(b) and 7(c) are for the State and its instrumentalities only: check " + pl(st) + ".");
		if (emp.length && v(s, "audience") !== "employee" && v(s, "audience") !== "applicant") g6.push("Section 7(i) covers processing for employment, safeguarding the employer, and services or benefits an employee asks for: check " + pl(emp) + ".");
		var src7a = pnSourceIndirect(s) ? arr(s, "sources").filter(function (x) { var i = v(x, "usedFor"), a = i !== "" ? acts[+i] : null; return a && inGroundOf(s, a) === "7a"; }) : [];
		if (src7a.length) g6.unshift("Section 7(a) covers only personal data the person gave you. Data from " + joinList(src7a.map(function (x) { return v(x, "name") || "[source]"; })) + " needs consent or another legitimate use.");
		if (noG.length) g6.unshift("Choose consent or a legitimate use for " + pl(noG) + " (sections 4, 6 and 7).");
		checks.push(!acts.length ? chk("I06", "missing", "Add the purposes.") : g6.length ? chk("I06", noG.length || src7a.length ? "missing" : "warn", g6.join(" ")) :
			chk("I06", "ok", g7a.length ? "Section 7(a) covers only personal data the person gave voluntarily for that purpose, and ends when they say they do not consent. If you ask for consent, mark the purpose as consent." : ""));
		checks.push(v(s, "inLink") ? chk("I07", "ok") : chk("I07", "missing", "Give the link to the page of your website or app where people withdraw consent, exercise their rights and learn how to complain to the Board (Rule 3(c))."));
		checks.push(!cons ? chk("I08", "na", "No purpose relies on consent.") :
			v(s, "withdrawHow") && !led ? chk("I08", "check", "The withdrawal method in the India section comes from the answer for " + leadName + ", with the India link next to it. Check that it works for the purposes that rely on consent under the DPDP Act, as easily as consent was given (section 6(4)).") :
			v(s, "withdrawHow") ? chk("I08", "ok", "Withdrawing must be as easy as giving consent: if consent was a click, withdrawal is a click (section 6(4)).") :
			v(s, "inLink") ? chk("I08", "check", "The notice points to the link for withdrawal. Make withdrawing there as easy as giving consent (section 6(4); Rule 3(c)(i)).") : chk("I08", "missing", "Say how people withdraw consent (Rule 3(c)(i))."));
		checks.push(v(s, "inLink") || v(s, "inOtherMeans") ? chk("I09", "ok", v(s, "inIdentifier") ? "" : "If you need a username or other identifier to identify people, say which (Rule 14(1)(b)).") :
			chk("I09", "missing", "Say how people make requests to exercise their rights (Rule 14(1)(a))."));
		var dn = inDaysNum(s);
		checks.push(!v(s, "inDays") ? chk("I10", "missing", "Give the period within which you respond to grievances, no more than 90 days (Rule 14(3)).") :
			isNaN(dn) || dn < 1 ? chk("I10", "warn", "Give the period as a number of days, at least 1 and no more than 90 (Rule 14(3)).") :
			dn > 90 ? chk("I10", "missing", "The period cannot exceed 90 days (Rule 14(3)).") : chk("I10", "ok", "Publish the period on your website or app too (Rule 14(3))."));
		checks.push(v(s, "inBoard") ? chk("I11", "ok") : chk("I11", "warn", "Add how people reach the Data Protection Board of India: the notice must describe how to complain to it (section 5(1)(iii)). MeitY announced an online platform and a mobile app for complaints (press release of 14 November 2025). No link was published by 12 November 2026: keep the placeholder until the Board publishes one, and check again before 13 May 2027, when its powers over complaints apply."));
		checks.push(v(s, "inLangHow") ? chk("I12", "check", "This generator writes English only. Make the notice available in English and in each of the 22 languages of the Eighth Schedule to the Constitution that people can choose (section 5(3)), and check each translation.") :
			chk("I12", "missing", "Say how people get this notice in another language: the Act gives them the option of English or any of the 22 languages of the Eighth Schedule to the Constitution (section 5(3)). This generator writes English only."));
		var i13 = [], i13w = [];
		if (yes(s, "inKids")) {
			var exk = yes(s, "inKidsExempt");
			if (!v(s, "inKidsExempt")) i13.push("Answer whether you rely on an exemption in the Fourth Schedule to the DPDP Rules (Rule 12).");
			if (exk && !v(s, "inKidsExemptWhat")) i13.push("Name the class or purpose of the Fourth Schedule you rely on (Rule 12).");
			if (exk && !v(s, "inKidsAllExempt")) i13.push("Answer whether all your processing of children's data is within that exemption.");
			if (!inKidsAllEx(s) && !v(s, "inKidsHow")) i13.push("Say how a parent gives verifiable consent and how you check that they are an adult (Rule 10).");
			if (!v(s, "inTrack")) i13.push("Answer whether you track or monitor children's behaviour (section 9(3)).");
			else if (yes(s, "inTrack") && !exk) i13.push("Section 9(3) prohibits tracking or behavioural monitoring of children, unless an exemption in the Fourth Schedule to the DPDP Rules applies (Rule 12).");
			if (!v(s, "inKidsAds")) i13.push("Answer whether you target advertising at children (section 9(3)).");
			else if (yes(s, "inKidsAds")) i13.push("Section 9(3) prohibits targeted advertising directed at children, and no item of the Fourth Schedule covers it. Stop it.");
			if (exk) i13w.push("The exemption lifts parental consent and the tracking ban only within the conditions of its item in the Fourth Schedule. Outside them, section 9(1) and (3) apply.");
		}
		checks.push(!v(s, "inKids") ? chk("I13", "missing", "Answer whether you process personal data of children, that is anyone under 18 (section 2(f)).") :
			no(s, "inKids") ? chk("I13", "na", "No children's data.") :
			i13.length ? chk("I13", "missing", i13.concat(i13w).join(" ")) : i13w.length ? chk("I13", "warn", i13w.join(" ")) : chk("I13", "ok"));
		checks.push(yes(s, "inDisab") ? chk("I14", "ok", "Verify that a court, a designated authority or a local level committee appointed the guardian (Rule 11).") :
			no(s, "inDisab") ? chk("I14", "na", "No data of persons with disability who have a lawful guardian.") : chk("I14", "missing", "Answer whether you process personal data of persons with disability who have a lawful guardian (section 9(1); Rule 11)."));
		var noRet = acts.filter(function (a) { return !v(a, "retention"); }), vagueRet = acts.filter(function (a) { return D.LINT.vagueRetention.test(v(a, "retention")); });
		var i15 = [];
		if (!v(s, "inErase")) i15.push("Say whether you are in a class of the Third Schedule to the DPDP Rules (Rule 8(1)).");
		if (led && (!acts.length || noRet.length)) i15.push("Give how long the personal data is kept, or the criteria, for every purpose. The law erases it when consent is withdrawn or the purpose is no longer served (section 8(7)).");
		else if (led && vagueRet.length) i15.push("\"As long as necessary\" does not tell people how long. Give a period or criteria they can apply.");
		var SHORT = /^\s*(until\b|\d+\s*(day|week)s?\b|([1-9]|1[01])\s*months?\b|(one|two|three|four|five|six|seven|eight|nine|ten|eleven)\s*(day|week|month)s?\b)/i;
		var shortRet = led ? acts.filter(function (a) { return SHORT.test(v(a, "retention")); }) : [];
		if (shortRet.length) i15.push("Rule 8(3) requires the personal data, its traffic data and the logs of the processing to be kept for at least one year from the processing. Check the period for " + pl(shortRet) + ", or say what you keep for the year.");
		if (yes(s, "publicBody")) i15.push("Section 17(4): for processing by the State or an instrumentality of the State, the erasure duty (section 8(7)) and the right to erasure (section 12(3)) do not apply. If they do not apply to you, keep those statements only as a choice, not as a legal duty.");
		checks.push(i15.length ? chk("I15", !v(s, "inErase") ? "missing" : "warn", i15.join(" ")) : chk("I15", "ok", "Stated: erasure on withdrawal or when the purpose is no longer served, and the one-year minimum for data and logs (Rule 8(3))."));
		checks.push(!v(s, "inCm") ? chk("I16", "check", "Answer whether people can use a Consent Manager (section 6(7)).") : !yes(s, "inCm") ? chk("I16", "na", "No Consent Manager.") : !v(s, "inCmName") ? chk("I16", "missing", "Name the Consent Manager.") :
			chk("I16", "ok", "Consent Managers register with the Board from 13 November 2026 (section 6(9); Rule 4). Use one that is registered."));
		checks.push(yes(s, "inAbroad") ? chk("I17", v(s, "inAbroadWhere") ? "check" : "missing", (v(s, "inAbroadWhere") ? "" : "Name the countries. ") + "Check whether the Central Government has restricted transfers to these countries (section 16(1)), whether it has set requirements for making the data available to a foreign State (Rule 15), and whether a sector law restricts the transfer (section 16(2))." +
				(inSdf(s) ? " As a Significant Data Fiduciary, check whether the Central Government has specified any of this personal data under Rule 13(4): that data, and the traffic data on its flow, cannot leave India." : "")) :
			chk("I17", "na", "The Act does not require the notice to say where data is processed. Say so if it is processed outside India."));
		checks.push(!yes(s, "further") ? chk("I18", "ok", "Stated: a new purpose gets a new notice and a request for consent, unless a legitimate use applies.") :
			v(s, "inFurther") === "7a" ? chk("I18", "missing", "Section 7(a) covers only the purpose the person gave the data for. A new use of data you hold needs a new notice and consent, or another legitimate use (sections 5 to 7).") :
			!inGround(v(s, "inFurther")) ? chk("I18", "missing", "Say whether you will ask for consent for the new purpose, or which legitimate use in section 7 applies (sections 5 and 6).") :
			chk("I18", "ok", v(s, "inFurther") === "consent" ? "Give the new notice with or before the request for consent (section 5(1))." : ""));
		checks.push(led ? chk("I19", "check", "Present the notice on its own, understandable without any other document, in clear and plain language (Rule 3(a) and (b)): not inside terms and conditions.") :
			chk("I19", "check", "The notice must be understandable on its own (Rule 3(a)). Here the India section relies on the rest of the notice: check that the whole notice reads clearly for people in India, or generate a separate notice with only India ticked."));
		/* Delivery */
		if (cons) delivery.push(chk("I20", "check", "Give this notice with or before each request for consent. Consent needs a clear affirmative action, for each purpose, and covers only the personal data needed for it. Keep proof that you gave the notice and obtained consent (sections 5(1), 6(1) and 6(10))."));
		delivery.push(chk("I21", "check", "If people consented before 13 May 2027, give them this notice as soon as reasonably practicable, for example by email or in-app notification (section 5(2))."));
		delivery.push(chk("I22", "check", "Publish prominently on your website or app the business contact information of " + who + ", how people make requests and what identifier they need, and your response period. Mention the contact information in every reply to a request about rights (Rules 9 and 14)."));
		var cls = lbl(D.IN_ERASE, v(s, "inErase"));
		if (cls && cls.svc) delivery.push(chk("I23", "check", "Before erasing under the Third Schedule, tell the person at least 48 hours ahead that the data will be erased unless they log in or contact you (Rule 8(2))."));
		if (cons) delivery.push(chk("I24", "check", "Present each request for consent in clear and plain language, with the option of English or an Eighth Schedule language, and with the contact details of " + who + " (section 6(3))."));
		if (inSdf(s)) delivery.push(chk("I25", "check", "As a Significant Data Fiduciary: appoint a Data Protection Officer based in India and an independent data auditor, carry out a data protection impact assessment and an audit every 12 months, verify that your algorithmic software poses no likely risk to people's rights, and keep any personal data the Government specifies, with its traffic data, inside India (section 10; Rule 13)."));
		return { checks: checks, delivery: delivery };
	}

	/* A document led by India's DPDP Act. */
	function inLead(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]";
		var aud = v(s, "audience");
		var title = AUD_TITLE[aud] || (v(s, "audienceOther") ? "Privacy notice for " + lcFirst(v(s, "audienceOther")) : "Privacy notice");
		var acts = pnActs(s), direct = pnSourceDirect(s), indirect = pnSourceIndirect(s);
		var meta = [ctrl];
		if (v(s, "version")) meta.push("Version " + v(s, "version"));
		if (v(s, "effective")) meta.push("Effective " + fmtDate(v(s, "effective")));
		var num = {}, c = 3;
		if (indirect) num.source = c++;
		num.recip = c++;
		if (yes(s, "inAbroad")) num.abroad = c++;
		num.keep = c++;
		if (yes(s, "adm") || yes(s, "profiling")) num.adm = c++;
		if (inKidsOn(s)) num.kids = c++;
		num.rights = c++;
		if (inConsent(s)) num.consent = c++;
		num.complaints = c++;
		if (inReg(s, "cn")) num.cn = c++;
		if (inReg(s, "jp")) num.jp = c++;
		if (inReg(s, "kr")) num.kr = c++;
		if (inReg(s, "sg")) num.sg = c++;
		if (inReg(s, "au")) num.au = c++;
		if (inReg(s, "za")) num.za = c++;
		if (inReg(s, "ca")) num.ca = c++;
		if (inReg(s, "us")) num.us = c++;
		num.changes = c++;
		var blocks = [{ k: "h1", x: title }, { k: "meta", x: meta.map(stop).join(" ") }];

		/* First layer: what Rule 3 puts at the minimum, up front. */
		var first = [{ k: "p", x: ctrl + " decides why and how the personal data described in this notice is processed (the Data Fiduciary). " +
			(inSdf(s) ? "Our Data Protection Officer: " : "Questions about it: ") + inWho(s) + ", " + stop(inWhoContact(s)) }];
		if (acts.length) first.push({ k: "p", x: "What we process, and why:" }, { k: "ul", items: acts.map(function (a) { return { b: (v(a, "purpose") || "[purpose]") + ":", x: stop(v(a, "data") || "[each item of personal data]") }; }) });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		first.push({ k: "p", x: (inConsent(s) ? "To withdraw your consent, exercise your rights" : "To exercise your rights") + " or find out how to complain to the Data Protection Board of India, use " + stop(inMeans(s)) +
			" Sections " + joinList([num.rights, num.consent, num.complaints].filter(Boolean).map(String)) + " explain." });
		Array.prototype.push.apply(first, inLangBody(s));
		if (num.cn) first.push({ k: "p", x: "If you are in mainland China, section " + num.cn + " also applies to you." + (yes(s, "cnPipo") ? " Our personal information protection officer: " + (v(s, "cnPipoName") || "[name or title]") + ", " + stop(v(s, "cnPipoContact") || "[contact details]") : "") });
		if (num.jp) first.push({ k: "p", x: "If you are in Japan, section " + num.jp + " also applies to you." });
		if (num.kr) first.push({ k: "p", x: "If you are in Korea, section " + num.kr + " also applies to you." });
		if (num.sg) first.push({ k: "p", x: sgPointer(s, num.sg) });
		if (num.au) first.push({ k: "p", x: auPointer(s, num.au) });
		if (num.za) first.push({ k: "p", x: zaPointer(s, num.za) });
		if (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });
		if (num.us) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + num.us + " also applies to you." });
		blocks.push({ k: "box", title: "In short", blocks: first });

		/* 1. Who is responsible (sections 2(i), 6(3), 8(9); Rule 9) */
		blocks.push({ k: "h2", x: "1. Who is responsible for your personal data" });
		var who = [ctrl];
		if (v(s, "ctrlAddress")) who.push(v(s, "ctrlAddress").replace(/\n+/g, ", "));
		blocks.push({ k: "p", x: stop(who.join(", ")) + " We decide why and how your personal data is processed: under the DPDP Act, we are the Data Fiduciary." });
		var chans = [];
		if (v(s, "ctrlEmail")) chans.push({ b: "Email:", x: v(s, "ctrlEmail") });
		if (v(s, "ctrlPhone")) chans.push({ b: "Telephone:", x: v(s, "ctrlPhone") });
		if (chans.length) blocks.push({ k: "ul", items: chans });
		Array.prototype.push.apply(blocks, inContactBody(s));
		if (yes(s, "joint")) {
			var ja = acts.filter(function (a) { return yes(a, "jointP"); });
			blocks.push({ k: "p", x: "For " + (ja.length ? joinList(ja.map(function (a) { return lcFirst(v(a, "purpose") || "[purpose]"); })) : "[mark the purposes concerned]") + " we decide together with " + (v(s, "jointWho") || "[other organisation]") + ". " +
				stop(v(s, "jointEssence") || "[essence of the arrangement]") + " Contact " + stop(v(s, "jointContact") || "[contact point]") });
		}

		/* 2. Personal data, purposes and grounds (sections 4 to 7; Rule 3(b)) */
		blocks.push({ k: "h2", x: "2. What personal data we process, and why" });
		Array.prototype.push.apply(blocks, inTable(s, true));
		Array.prototype.push.apply(blocks, inAboutBody(s));
		if (yes(s, "inferred")) blocks.push({ k: "p", x: "We also create personal data about you from the data above: " + stop(v(s, "inferredWhat") || "[what is inferred, and from what]") });

		if (num.source) {
			blocks.push({ k: "h2", x: num.source + ". Where your personal data comes from" });
			var src = arr(s, "sources");
			if (src.length) blocks.push({ k: "ul", items: src.map(function (x) {
				var ai = v(x, "usedFor"), a = ai !== "" ? acts[+ai] : null;
				return { b: (v(x, "name") || "[source]") + ":", x: (v(x, "what") || "[categories of personal data]") + (yes(x, "pub") ? " (a publicly accessible source)" : "") +
					", used for " + (a ? lcFirst(v(a, "purpose") || "[purpose]") : "[purpose]") + ". " + (a && inGroundOf(s, a) === "7a" ?
					"[Choose consent or another ground in section 7 for data from this source: section 7(a) covers only data the person gave you.]" : "Its ground and retention are as for that purpose in section 2.") };
			}) });
			if (yes(s, "unattributable")) blocks.push({ k: "p", x: "Where we cannot attribute a record to a single source, the data comes from " + stop(v(s, "sourceNature") || "[nature of the sources and type of organisation]") });
			else if (!src.length) blocks.push({ k: "p", x: "[Name each source of the personal data, and what you get from it.]" });
		}
		var rec = arr(s, "recipients");
		blocks.push({ k: "h2", x: num.recip + ". Who we share your personal data with, and why" });
		blocks.push(rec.length ? { k: "table", head: ["Recipient", "Role", "What for", "Location"],
			rows: rec.map(function (r) { return [v(r, "who") || "[recipient]", IN_ROLE[v(r, "role")] || "[role]", v(r, "why") || "[what for]", v(r, "where") || "[location]"]; }) } :
			{ k: "p", x: "[List the parties you share personal data with, including Data Processors that process it for you.]" });
		blocks.push({ k: "p", x: "Data Processors process your personal data for us only under a valid contract, and we remain responsible for what they do with it (section 8(1) and (2))." });
		if (num.abroad) { blocks.push({ k: "h2", x: num.abroad + ". Processing outside India" }); Array.prototype.push.apply(blocks, inAbroadBody(s)); }
		blocks.push({ k: "h2", x: num.keep + ". How long we keep your personal data" });
		Array.prototype.push.apply(blocks, inEraseBody(s, true));
		if (num.adm) {
			blocks.push({ k: "h2", x: num.adm + ". Automated decisions and profiling" });
			if (yes(s, "adm")) Array.prototype.push.apply(blocks, admCore(s, "We make the following decision about you based solely on automated processing of your personal data: "));
			else blocks.push({ k: "p", x: "We profile you: " + stop(v(s, "profilingWhat") || "[the profiling and its effect]") });
			blocks.push({ k: "p", x: "Where we use your personal data to make a decision that affects you, we make sure it is complete, accurate and consistent (section 8(3))." });
		}
		if (num.kids) { blocks.push({ k: "h2", x: num.kids + ". " + inKidsTitle(s) }); Array.prototype.push.apply(blocks, inKidsBody(s)); }
		blocks.push({ k: "h2", x: num.rights + ". Your rights" });
		Array.prototype.push.apply(blocks, inRightsBody(s));
		if (num.consent) { blocks.push({ k: "h2", x: num.consent + ". Withdrawing consent" }); Array.prototype.push.apply(blocks, inConsentBody(s)); }
		blocks.push({ k: "h2", x: num.complaints + ". Grievances and complaints" });
		Array.prototype.push.apply(blocks, inComplaintBody(s));

		var inSecs = [num.rights, num.consent, num.complaints].filter(Boolean).map(String);
		var only = inSecs.length ? " " + (inSecs.length > 1 ? "Sections " : "Section ") + joinList(inSecs) + (inSecs.length > 1 ? " apply" : " applies") + " to you only where the DPDP Act applies to our processing of your personal data." : "";
		var cnRes = null;
		if (num.cn) {
			blocks.push({ k: "h2", x: num.cn + ". Additional information for people in China" });
			Array.prototype.push.apply(blocks, cnSection(s, inSecs, "the DPDP Act"));
			cnRes = cnChecks(s, false);
		}
		var jpRes = null;
		if (num.jp) {
			blocks.push({ k: "h2", x: num.jp + ". Additional information for people in Japan" });
			Array.prototype.push.apply(blocks, jpSection(s, inSecs, "the DPDP Act"));
			jpRes = jpChecks(s, false);
		}
		var krRes = null;
		if (num.kr) {
			blocks.push({ k: "h2", x: num.kr + ". Additional information for people in Korea" });
			Array.prototype.push.apply(blocks, krSection(s, inSecs, "the DPDP Act"));
			krRes = krChecks(s, false);
		}
		var sgRes = null;
		if (num.sg) {
			blocks.push({ k: "h2", x: num.sg + ". " + sgHead(s) });
			Array.prototype.push.apply(blocks, sgSection(s, inSecs, "the DPDP Act"));
			sgRes = sgChecks(s, false);
		}
		var auRes = null;
		if (num.au) {
			blocks.push({ k: "h2", x: num.au + ". " + auHead(s) });
			Array.prototype.push.apply(blocks, auSection(s, inSecs, "the DPDP Act"));
			auRes = auChecks(s, false);
		}
		var zaRes = null;
		if (num.za) {
			blocks.push({ k: "h2", x: num.za + ". " + zaHead(s) });
			Array.prototype.push.apply(blocks, zaSection(s, inSecs, "the DPDP Act"));
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

		blocks.push({ k: "h2", x: num.changes + ". Changes to this notice" });
		if (yes(s, "further")) blocks.push(inFurtherBox(s));
		blocks.push({ k: "p", x: IN_CHANGES + " When this notice changes, we tell you directly. We do not expect you to check this page for updates." });
		if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });

		var cr = inChecks(s, true), checks = cr.checks, delivery = cr.delivery;
		if (yes(s, "joint")) checks.push(v(s, "jointWho") && v(s, "jointEssence") && v(s, "jointContact") && acts.some(function (a) { return yes(a, "jointP"); }) ? chk("P19", "ok", "Good practice under the DPDP Act, whose Data Fiduciary decides alone or with others (section 2(i)).", undefined, "WP260 44 (good practice)") :
			chk("P19", "warn", "Name the other organisation, what each does and the contact point.", undefined, "WP260 44 (good practice)"));
		checks.push(v(s, "consequences") ? chk("P21", "ok", "", undefined, "WP260 10, 36 (good practice)") : chk("P21", "warn", "Empty. Fine only if nothing here would surprise people. A fair account of the processing (Rule 3(b)) puts what people would not expect up front.", undefined, "WP260 10, 36 (good practice)"));
		if (cnRes) { Array.prototype.push.apply(checks, cnRes.checks); Array.prototype.push.apply(delivery, cnRes.delivery); }
		if (jpRes) { Array.prototype.push.apply(checks, jpRes.checks); Array.prototype.push.apply(delivery, jpRes.delivery); }
		if (krRes) { Array.prototype.push.apply(checks, krRes.checks); Array.prototype.push.apply(delivery, krRes.delivery); }
		if (sgRes) { Array.prototype.push.apply(checks, sgRes.checks); Array.prototype.push.apply(delivery, sgRes.delivery); }
		if (auRes) { Array.prototype.push.apply(checks, auRes.checks); Array.prototype.push.apply(delivery, auRes.delivery); }
		if (zaRes) { Array.prototype.push.apply(checks, zaRes.checks); Array.prototype.push.apply(delivery, zaRes.delivery); }
		if (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }
		if (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(delivery, usRes.delivery); }
		var lintHits = lintText(blocks);
		checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "DPDP Rules, Rule 3(b); WP260 13") :
			chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "DPDP Rules, Rule 3(b); WP260 13"));
		/* The WP260 delivery points remain good practice under the DPDP Act. */
		var gp = [];
		if (direct) gp.push(chk("D01", "check", "Give the notice when the data is collected: before a form is submitted, before payment, before sign-up.", "Timing: when the data is collected"));
		gp.push(chk("D03", "check", "Read it as a member of the audience would. Consent counts only if it is informed, and the notice must be in clear and plain language (section 6(1); Rule 3(b))."));
		if (has(s, "channel", "web")) gp.push(chk("D05", "check", "Link it from every page under a common term such as \"Privacy\", and from every form that collects personal data."));
		if (has(s, "channel", "app")) gp.push(chk("D06", "check", "Show it in the app store listing and keep it within two taps inside the app."));
		gp.push(chk("D07", "check", has(s, "channel", "phone") || has(s, "channel", "paper") || has(s, "channel", "device") ? "Offline, give the \"In short\" content first and point to the full notice." : "Use the \"In short\" box as the first layer and keep it consistent with the full text."));
		gp.push(chk("D08", "check", "Keep the full notice available as one document."));
		gp.push(chk("D12", "check", "When this notice changes, tell people directly, highlighting what changed, before the change takes effect."));
		gp.push(chk("D14", "check", "If you add icons, keep them alongside the text, never instead of it."));
		gp.forEach(function (r) { var m = D.MATRIX[r.id]; if (m) r.s = m.s.replace(/^Art\.[^;]*;\s*/, "") + " (good practice)"; });
		delivery = gp.concat(delivery);
		return { title: title, file: slug(ctrl + " " + title), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(delivery), docLabel: "Notice" };
	}

	/* Form section for India: everything except the per-purpose fields, which sit with the purposes. */
	var IN_SECTION = {
		title: "India: Digital Personal Data Protection Act",
		show: inOn,
		lead: "The DPDP Act and the DPDP Rules, 2025. The notice duty applies from 13 May 2027 (G.S.R. 843(E)). Each purpose rests on consent or on a legitimate use in section 7: set it with each purpose above.",
		fields: [
			{ id: "inScope", type: "select", label: "How the DPDP Act applies to you", opts: [
				{ v: "india", l: "We process the personal data in India" },
				{ v: "offer", l: "We are outside India and offer goods or services to people in India" },
				{ v: "contract", l: "We are in India and process only data of people outside India, under a contract with a person outside India" }],
			  hint: "Section 3: digital personal data processed in India, and processing outside India connected to offering goods or services to people in India. Section 17(1)(d) exempts the third case from the notice." },
			{ id: "inSdf", type: "yesno", label: "Has the Central Government notified you, or your class, as a Significant Data Fiduciary?",
			  hint: "Section 10: only by notification. A Significant Data Fiduciary appoints a Data Protection Officer based in India." },
			{ id: "inContactName", type: "text", label: function (s) { return inSdf(s) ? "Name or title of your Data Protection Officer" : "Name or title of the person who answers people's questions about the processing"; },
			  ph: "for example Grievance Officer", hint: "Sections 6(3) and 8(9); Rule 9: publish their business contact information prominently on your website or app, and mention it in every reply to a request about rights." },
			{ id: "inContact", type: "text", label: "Their business contact information", ph: "for example grievance@example.in, +91 80 1234 5678" },
			{ id: "inLink", type: "text", label: "Link to the page of your website or app where people withdraw consent, exercise their rights and learn how to complain to the Board",
			  ph: "for example example.in/privacy/requests", hint: "Rule 3(c): the notice gives this link, and a description of other means, if any." },
			{ id: "inOtherMeans", type: "text", label: "Other means people can use (optional)", ph: "for example email grievance@example.in, or the Privacy screen in our app" },
			{ id: "inIdentifier", type: "text", label: "What people must give you so you can identify them when they make a request (optional)", ph: "for example the email address or mobile number of your account",
			  hint: "Rule 14(1)(b) and (5): the username or other identifier your terms of service use." },
			{ id: "inDays", type: "text", label: "Days within which you respond to grievances and requests", ph: "for example 30",
			  hint: "Rule 14(3): a period you publish, no more than 90 days." },
			{ id: "inNominate", type: "text", label: "How people nominate someone to exercise their rights after death or incapacity (optional)", ph: "for example the nominee form in your account settings",
			  hint: "Section 14; Rule 14(4). Leave empty to point people to the same means as other requests." },
			{ id: "inBoard", type: "text", label: "How people reach the Data Protection Board of India", ph: "the Board's complaint link or app",
			  hint: "Section 5(1)(iii). The Board works as a digital office (Rule 20). MeitY announced an online platform and a mobile app for complaints; none was published by 12 November 2026. Add the link once the Board publishes it." },
			{ id: "inLangHow", type: "text", label: "How people read this notice in another language of the Eighth Schedule to the Constitution", ph: "for example choose a language at the top of this page",
			  hint: "Section 5(3): English or any of the 22 Eighth Schedule languages, at the person's option. This generator writes English only." },
			{ id: "inCm", type: "yesno", label: "Can people give, manage, review and withdraw consent through a Consent Manager?",
			  hint: "Section 6(7) to (9). Consent Managers register with the Board from 13 November 2026 (Rule 4)." },
			{ id: "inCmName", type: "text", label: "The Consent Manager and its platform", show: function (s) { return yes(s, "inCm"); } },
			{ id: "inKids", type: "yesno", label: "Do you process personal data of children (anyone under 18)?",
			  hint: "Sections 2(f) and 9: verifiable consent of a parent, no processing likely to harm a child's well-being, and no tracking, behavioural monitoring or targeted advertising directed at children." },
			{ id: "inKidsHow", type: "area", rows: 2, label: "How a parent gives verifiable consent, and how you check that they are an adult", show: function (s) { return yes(s, "inKids") && !inKidsAllEx(s); },
			  hint: "Rule 10: by identity and age details you already hold reliably, or details the parent provides, directly or through a virtual token, for example from a Digital Locker service provider. Identifiable as well, where another law requires it." },
			{ id: "inTrack", type: "yesno", label: "Do you track or monitor children's behaviour?", show: function (s) { return yes(s, "inKids"); },
			  hint: "Section 9(3) prohibits tracking and behavioural monitoring of children, unless the Fourth Schedule to the DPDP Rules exempts the class or purpose, for example a school's safety monitoring." },
			{ id: "inKidsAds", type: "yesno", label: "Do you target advertising at children?", show: function (s) { return yes(s, "inKids"); },
			  hint: "Section 9(3) prohibits targeted advertising directed at children. No item of the Fourth Schedule covers it." },
			{ id: "inKidsExempt", type: "yesno", label: "Do you rely on an exemption in the Fourth Schedule to the DPDP Rules?", show: function (s) { return yes(s, "inKids"); },
			  hint: "Rule 12. Part A: healthcare, educational institutions, creches and their transport. Part B: duties under law, State benefits, an email-only account, real-time location for safety, keeping harmful content away from children, confirming a user is not a child. Each within its conditions." },
			{ id: "inKidsExemptWhat", type: "text", label: "Which class or purpose, and within which conditions", show: function (s) { return yes(s, "inKids") && yes(s, "inKidsExempt"); } },
			{ id: "inKidsAllExempt", type: "yesno", label: "Is all your processing of children's data within that exemption?", show: function (s) { return yes(s, "inKids") && yes(s, "inKidsExempt"); },
			  hint: "If not, a parent's verifiable consent is still needed for the rest (section 9(1); Rule 10)." },
			{ id: "inDisab", type: "yesno", label: "Do you process personal data of persons with disability who have a lawful guardian?",
			  hint: "Section 9(1); Rule 11: verifiable consent of the guardian, appointed by a court, a designated authority or a local level committee." },
			{ id: "inErase", type: "select", label: "Are you in a class of the Third Schedule to the DPDP Rules?", opts: function () { return D.IN_ERASE.map(function (x) { return { v: x.v, l: x.l }; }); },
			  hint: "Rule 8: these classes erase personal data after three years without use, with 48 hours' warning. Every Data Fiduciary keeps data and logs for at least one year (Rule 8(3))." }
		]
	};

