	/* ------------------------------------------------------- Brazil (matrix Part N) ---
	   The LGPD is built like the GDPR: purposes, legal bases, recipients, transfers, rights.
	   A Brazil-led notice reuses the shared answers (purposes, data, retention, recipients,
	   sources) with the LGPD's own legal bases and texts. In a notice led by the GDPR or the
	   FADP, an "Additional information for people in Brazil" section carries what the LGPD
	   adds. Legal bases, transfers and the encarregado have their own fields: an answer given
	   for one law is never read as an answer for another. Read on normas.leg.br and the ANPD
	   site, 12 November 2026 (br/notes.md). */
	function brOn(s) { return inReg(s, "br"); }
	function brBasisOf(s, a) { return brOn(s) ? v(a, "brBasis") : ""; }
	function brSensOf(s, a) { return brOn(s) ? v(a, "brSens") : ""; }
	function brFurther(s) { return brOn(s) && yes(s, "further") ? v(s, "brFurtherBasis") : ""; }
	function brUses(s, b) { return pnActs(s).some(function (a) { return brBasisOf(s, a) === b; }) || brFurther(s) === b; }
	function brTrows(s) { return brOn(s) && yes(s, "brTransfers") ? arr(s, "brTrows") : []; }
	function brMech(t) { return lbl(D.BR_MECH, v(t, "mech")); }
	function brDocRows(s) { return brTrows(s).filter(function (t) { var m = brMech(t); return !!(m && m.doc); }); }
	function brConsentActs(s) { return pnActs(s).filter(function (a) { return brBasisOf(s, a) === "I" || brSensOf(s, a) === "I"; }); }
	function brConsent(s) { return brConsentActs(s).length > 0 || brFurther(s) === "I" || brTrows(s).some(function (t) { return v(t, "mech") === "consent"; }); }
	/* Small processing agents need not appoint an encarregado, but must offer a channel
	   (Resolution CD/ANPD 2/2022, Article 11). Everyone else appoints one (Article 41). A small
	   agent that carries out high-risk processing keeps none of the reliefs (Article 3, I), and a
	   public body is never a small agent (Article 2, I) (review R04, R05). */
	function brSmallOk(s) { return yes(s, "brSmall") && !yes(s, "brHighRisk") && !yes(s, "publicBody"); }
	function brEncNeeded(s) { return !brSmallOk(s) || yes(s, "brEnc"); }
	/* "keep it until you withdraw consent", not "keep it for until ..." (review R17). */
	function keepFor(t) { t = lcFirst(stop(t)); return /^(until|for|as long|while|during|throughout|up to|no longer)\b/.test(t) ? "keep it " + t : "keep it for " + t; }
	function brEncWho(s) {
		return v(s, "brEncKind") === "entity" ? (v(s, "brEncName") || "[business name]") + ", with " + (v(s, "brEncResp") || "[full name of the person responsible]") + " as the person responsible" :
			v(s, "brEncName") || "[full name]";
	}
	/* Article 9, paragraph 3: processing that is a condition for a product, service or right. */
	function brCondActs(s) {
		return pnSourceDirect(s) ? pnActs(s).filter(function (a) { var r = v(a, "required"); return r === "contract" || r === "statutory" || r === "contractual"; }) : [];
	}
	function brLang(s) { return /portugu/i.test(v(s, "languages")); }

	function brBasisCell(s, a) {
		var b = lbl(D.BR_BASES, brBasisOf(s, a)), law = v(a, "brLawRef");
		if (b) { var t = ucFirst(b.t); return law && (b.v === "II" || b.v === "III") ? t.replace(" (Article", ", under " + law + " (Article") : t; }
		return brSensOf(s, a) ? "Article 11 LGPD: see \"Sensitive personal data\" below" : "[legal basis]";
	}
	function brTable(s, full) {
		var acts = pnActs(s);
		if (!acts.length) return [{ k: "p", x: "[Add at least one purpose.]" }];
		var rows = acts.map(function (a) {
			var pur = (v(a, "purpose") || "[purpose]") + (yes(a, "jointP") ? " (with " + (v(s, "jointWho") || "[other controller]") + ")" : "");
			return full ? [pur, v(a, "data") || "[personal data]", brBasisCell(s, a), v(a, "retention") || "[retention period or criteria]"] : [pur, brBasisCell(s, a)];
		});
		if (yes(s, "further")) {
			var fb = lbl(D.BR_BASES, v(s, "brFurtherBasis"));
			var fp = (v(s, "furtherWhat") || "[new purpose]") + " (from " + (fmtDate(v(s, "furtherStart")) || "[start date]") + ")";
			var ft = fb ? ucFirst(fb.t) : "[legal basis]";
			rows.push(full ? [fp, v(s, "furtherData") || "[personal data]", ft, v(s, "furtherRetention") || "[retention period or criteria]"] : [fp, ft]);
		}
		return [{ k: "table", head: full ? ["Purpose", "Personal data", "Legal basis", "How long we keep it"] : ["Purpose", "Legal basis under the LGPD"], rows: rows }];
	}
	/* Article 10, paragraphs 1 and 2; Article 18, paragraph 2. */
	function brLiBody(s, R) {
		var items = pnActs(s).filter(function (a) { return brBasisOf(s, a) === "IX"; })
			.map(function (a) { return { b: (v(a, "purpose") || "[purpose]") + ":", x: stop(v(a, "brLi") || "[the legitimate interest, and the concrete situation it rests on]") }; });
		if (brFurther(s) === "IX") items.push({ b: (v(s, "furtherWhat") || "[new purpose]") + ":", x: stop(v(s, "brFurtherLi") || "[the legitimate interest, and the concrete situation it rests on]") });
		if (!items.length) return [];
		return [
			{ k: "ul", items: items },
			{ k: "p", x: "For these purposes we use only the personal data strictly necessary (Article 10, paragraph 1 LGPD). If you think this processing does not comply with the LGPD, you can object to it (Article 18, paragraph 2 LGPD): see " + R.rights + "." }
		];
	}
	/* Article 11; Article 5, II. */
	function brSensBody(s) {
		var sp = pnActs(s).filter(function (a) { return brSensOf(s, a); });
		if (!sp.length) return [];
		return [
			{ k: "p", x: "Sensitive personal data is data on racial or ethnic origin, religious belief, political opinion, membership of a trade union or of a religious, philosophical or political organisation, health or sex life, and genetic or biometric data (Article 5, II LGPD). We process it as follows:" },
			{ k: "ul", items: sp.map(function (a) {
				var x = lbl(D.BR_SENS, brSensOf(s, a));
				return { b: (v(a, "purpose") || "[purpose]") + ":", x: x ? (x.v === "I" ? "we rely on " : "we process it because ") + x.t + "." +
					(yes(s, "publicBody") && (x.v === "a" || x.v === "b") ? " Your consent is not required for this (Article 11, paragraph 2 LGPD)." : "") : "[the Article 11 basis]" };
			}) }
		];
	}
	function brCondBox(s, R) {
		var c = brCondActs(s);
		if (!c.length) return [];
		return [{ k: "box", title: "Data we need from you", blocks: [
			{ k: "p", x: "For these purposes, providing your data is a condition for the product, service or right concerned (Article 9, paragraph 3 LGPD):" },
			{ k: "ul", items: c.map(function (a) { return { b: (v(a, "purpose") || "[purpose]") + ":", x: "if you do not provide it, " + lcFirst(stop(v(a, "consequence") || "[what happens]")) }; }) },
			{ k: "p", x: "You keep all your rights over this data: see " + R.rights + "." }] }];
	}
	function brEncBody(s) {
		if (!brEncNeeded(s)) return [{ k: "p", x: "We are a small processing agent and have not appointed a data protection officer (encarregado), as Resolution CD/ANPD 2/2022 allows. To exercise your rights, ask about your data or complain, contact us at " +
			(v(s, "brChannel") || "[the communication channel]") + " (Article 11, paragraph 1 of that Resolution)." }];
		return [{ k: "p", x: "Our data protection officer (encarregado) is " + brEncWho(s) + ". Contact them at " + (v(s, "brEncContact") || "[contact details]") +
			" to exercise your rights, ask about how we process your data or make a complaint (Article 41 LGPD)." }];
	}
	/* Article 9, VI: the responsibilities of the agents who carry out the processing. */
	function brRespBody(s, led) {
		var b = [{ k: "p", x: "We are the controller: we take the decisions about the processing of your personal data. Service providers that process it on our behalf (operators) do so only on our instructions (Articles 5, VI and VII, and 39 LGPD). A controller or operator that causes harm by breaching data protection law must repair it (Article 42 LGPD)." }];
		if (yes(s, "joint")) {
			var ja = pnActs(s).filter(function (a) { return yes(a, "jointP"); });
			var jp = ja.length ? joinList(ja.map(function (a) { return lcFirst(v(a, "purpose") || "[purpose]"); })) : "[mark the purposes concerned]";
			b.push({ k: "p", x: led ? "For " + jp + " we decide together with " + (v(s, "jointWho") || "[other controller]") + ". " + stop(v(s, "jointEssence") || "[essence of the arrangement]") +
				" Contact " + (v(s, "jointContact") || "[contact point]") + " to exercise your rights. We are jointly liable to you for damage caused by that processing in breach of data protection law, except in the cases of Article 43 LGPD (Article 42, paragraph 1, II LGPD)." :
				"For " + jp + ", where we decide together with " + (v(s, "jointWho") || "[other controller]") + ", we are jointly liable to you for damage caused by that processing in breach of data protection law, except in the cases of Article 43 LGPD (Article 42, paragraph 1, II LGPD)." });
		}
		return b;
	}
	/* Article 33; Articles 9, 17 and 32 of the International Data Transfer Regulation. */
	function brTransferBody(s) {
		var out = [];
		if (no(s, "brEstablished")) out.push({ k: "p", x: "We are established in " + country(v(s, "ctrlCountry") || "[country]") + ", outside Brazil, and process your data there." });
		if (yes(s, "brTransfers")) {
			var tr = arr(s, "brTrows");
			if (!tr.length) { out.push({ k: "p", x: "[Add each country or international body.]" }); return out; }
			out.push({ k: "p", x: "We transfer personal data to recipients in the following countries or international bodies outside Brazil:" });
			out.push({ k: "table", head: ["Country or international body", "Recipient", "Why this is permitted"],
				rows: tr.map(function (t) { var m = brMech(t); return [v(t, "country") || "[country]", v(t, "recipient") || "[recipient]", m ? m.t : "[the Article 33 mechanism]"]; }) });
			var docs = brDocRows(s);
			if (docs.length) {
				out.push({ k: "p", x: "For the transfers covered by clauses or rules approved by the ANPD, what we transfer, how, for what purpose and for how long:" });
				out.push({ k: "ul", items: docs.map(function (t) { return { b: (v(t, "recipient") || "[recipient]") + ", " + (v(t, "country") || "[country]") + ":", x: stop(v(t, "form") || "[what is transferred, how, for what purpose and for how long]") }; }) });
				out.push({ k: "p", x: "Security measures that protect the transferred data: " + stop(v(s, "brSecurity") || "[the security measures]") });
				out.push({ k: "p", x: "You can ask us for the full text of the clauses or rules used for these transfers. We send it within 15 days of your request, respecting our trade and industrial secrets. This notice also says who we are and how to contact us, who we share your data with and why, the responsibilities of the processing agents, and your rights, including how to petition the ANPD (Articles 17 and 32 of the International Data Transfer Regulation, Resolution CD/ANPD 19/2024)." });
			}
		} else if (no(s, "brTransfers")) {
			if (!no(s, "brEstablished")) out.push({ k: "p", x: "We do not transfer your personal data outside Brazil." });
		} else out.push({ k: "p", x: "[Say whether personal data is transferred outside Brazil.]" });
		return out;
	}
	function brReview(R) {
		return "You can ask for a review of decisions taken solely on the basis of automated processing that affect your interests, and for clear and adequate information on the criteria and procedures used, respecting our trade and industrial secrets (Article 20 LGPD). See " + R.rights + ".";
	}
	/* Article 20. In a Brazil-led notice the main question carries the LGPD wording; in a section,
	   its own question, because Article 20 reaches further than Article 22 GDPR. */
	function brAdmBody(s, R, led, admNum) {
		var b = [];
		if (led) {
			if (yes(s, "adm")) {
				Array.prototype.push.apply(b, admCore(s, "We take the following decision about you based solely on automated processing of your personal data, and it affects your interests: "));
				b.push({ k: "p", x: brReview(R) });
			} else if (yes(s, "brAdm")) {
				/* An Article 20 "Yes" given for the Brazil section is never overridden by an answer
				   given under another law's wording (review R03). */
				b.push({ k: "p", x: "[Say whether you take decisions based solely on automated processing that affect people's interests. For the Brazil section you answered Yes" + (v(s, "brAdmWhat") ? ": " + v(s, "brAdmWhat").replace(/[.]$/, "") : "") + ".]" });
			} else if (no(s, "adm")) {
				b.push({ k: "p", x: "We do not take decisions about you based solely on automated processing of your personal data that affect your interests." });
				if (yes(s, "profiling")) b.push({ k: "p", x: "We do use profiling: " + stop(v(s, "profilingWhat") || "[the profiling and its effect]") });
			} else b.push({ k: "p", x: "[Say whether you take decisions based solely on automated processing.]" });
			return b;
		}
		if (yes(s, "brAdm")) {
			b.push({ k: "p", x: "Under the LGPD, these decisions are taken solely on the basis of automated processing of your personal data and affect your interests: " +
				stop(v(s, "brAdmWhat") || (yes(s, "adm") ? "the decision described in section " + admNum : "[the decisions]")) });
			b.push({ k: "p", x: brReview(R) });
		} else if (no(s, "brAdm")) b.push({ k: "p", x: "Under the LGPD, we do not take decisions about you based solely on automated processing that affect your interests." });
		else b.push({ k: "p", x: "[Say whether, under the LGPD, you take decisions based solely on automated processing that affect people's interests.]" });
		return b;
	}
	/* Article 14, paragraphs 1, 2 and 6; Enunciado CD/ANPD 1/2023. */
	function brKidsBody(s, R) {
		var b = [{ k: "p", x: "We process personal data of children and adolescents only in their best interest (Article 14 LGPD). " +
			(v(s, "brKidsData") ? "About them we collect " + lcFirst(stop(v(s, "brKidsData"))) + " " + R.kids + " set out how we use it" : R.kids + " set out the types of data we collect about them, how we use it,") +
			" and how they and their parents or guardians can exercise their rights (Article 14, paragraph 2 LGPD)." }];
		if (v(s, "brKidsHow")) b.push({ k: "p", x: "Where we rely on consent for the data of a child under 12, a parent or the legal guardian gives it, specifically and prominently: " + stop(v(s, "brKidsHow")) });
		return b;
	}
	/* Articles 18 and 19; Resolution CD/ANPD 2/2022, Articles 14 and 15. */
	function brRightsBody(s) {
		var small = brSmallOk(s);
		var b = [{ k: "ul", items: D.RIGHTS_BR.map(function (r) { return { b: r.title, x: r.text }; }) }];
		b.push({ k: "p", x: "To exercise a right, contact us at " + (v(s, "rightsContact") || "[how to exercise rights]") + ". You can make a request yourself or through a legally appointed representative, and it is free of charge (Article 18, paragraphs 3 and 5 LGPD)." });
		var copy = brUses(s, "I") || brUses(s, "V") || pnActs(s).some(function (a) { return brSensOf(s, a) === "I"; });
		b.push({ k: "p", x: (yes(s, "publicBody") ?
			"When you ask us to confirm whether we process your data, or for access to it, we reply within the time limits and following the procedures that the law sets for public bodies, in particular the Access to Information Law (Law 12,527/2011) (Article 23, paragraph 3 LGPD). You choose whether to receive the reply electronically or on paper (Article 19, paragraph 2 LGPD)." :
			"When you ask us to confirm whether we process your data, or for access to it, we reply " +
			(small ? "in a simplified form within 15 days or, within 30 days of your request, " : "at once in a simplified form or, within 15 days of your request, ") +
			"with a clear and complete declaration giving the origin of the data, whether we hold records about you, the criteria used and the purpose of the processing. You choose whether to receive it electronically or on paper (Article 19 LGPD" +
			(small ? "; Articles 14 and 15 of Resolution CD/ANPD 2/2022" : "") + ").") +
			(copy ? " Where we process your data on the basis of your consent or a contract, you can also ask for a complete electronic copy of it, in a format you can reuse (Article 19, paragraph 3 LGPD)." : "") });
		b.push({ k: "p", x: "We act on your other requests at once. If we cannot, we tell you why, or tell you that we are not the processing agent for your data and, where we can, who is (Article 18, paragraph 4 LGPD). When we correct, delete, anonymise or block your data, we tell those we shared it with so that they do the same, unless that is impossible or takes disproportionate effort (Article 18, paragraph 6 LGPD)." });
		return b;
	}
	/* Article 8, paragraph 5; Article 18, VIII and IX. */
	function brConsentBody(s) {
		var ca = brConsentActs(s), b = [], direct = pnSourceDirect(s);
		b.push({ k: "p", x: "Where we rely on your consent, you can refuse to give it." + (ca.length && direct ? " If you refuse:" : "") });
		var items = ca.length && direct ? ca.map(function (a) { return { b: (v(a, "purpose") || "[purpose]") + ":", x: v(a, "consequence") ? lcFirst(stop(v(a, "consequence"))) : "[what happens if you do not consent]" }; }) : [];
		if (brFurther(s) === "I") items.push({ b: (v(s, "furtherWhat") || "[new purpose]") + ":", x: v(s, "furtherConsequenceBr") ? lcFirst(stop(v(s, "furtherConsequenceBr"))) : "[what happens if you do not consent]" });
		b[0].x = "Where we rely on your consent, you can refuse to give it." + (items.length ? " If you refuse:" : "");
		if (items.length) b.push({ k: "ul", items: items });
		b.push({ k: "p", x: "You can withdraw your consent at any time, free of charge and through an easy procedure: " + stop(v(s, "withdrawHow") || "[how to withdraw]") +
			" Withdrawing consent does not undo what we did with it before. If you also ask, we delete the data we processed with your consent, except where the law allows us to keep it (Article 8, paragraph 5; Article 18, VI and IX; Article 16 LGPD)." });
		return b;
	}
	var BR_PETITION = "You can petition the National Data Protection Agency (ANPD) against us about your personal data (Article 18, paragraph 1 LGPD). The ANPD considers a petition once you show that you made a request to us and we did not resolve it (Article 55-J, V LGPD). You can also go to consumer protection bodies (Article 18, paragraph 8 LGPD).";
	var BR_CHANGES = "When we change the purpose of the processing, its form or duration, our identity, or how we share your data, we tell you and highlight what changes (Article 8, paragraph 6 LGPD). Where we rely on your consent and the new purpose is not compatible with it, we tell you before the change, and you can withdraw your consent if you do not agree (Article 9, paragraph 2 LGPD).";

	/* The "Additional information for people in Brazil" section of a notice led by another law. */
	function brSection(s, num, lawName) {
		var b = [], R = { rights: "\"Your rights under the LGPD\" below", kids: "Section 2 and this section" };
		var H = function (t) { b.push({ k: "h3", x: t }); };
		var other = [num.rights, num.object, num.complaints].filter(Boolean).map(String);
		b.push({ k: "p", x: "For people in Brazil, the General Data Protection Law (LGPD, Law 13,709/2018) applies. The rest of this notice describes how we process your data. The legal bases, rights and other information in this section are those the LGPD gives you." +
			(other.length ? " " + (other.length > 1 ? "Sections " : "Section ") + joinList(other) + (other.length > 1 ? " apply" : " applies") + " to you only where the " + lawName + " applies to our processing of your data." : "") });
		H("Legal bases");
		Array.prototype.push.apply(b, brTable(s, false));
		if (v(s, "brForm")) b.push({ k: "p", x: "How we process your data: " + stop(v(s, "brForm")) });
		var li = brLiBody(s, R); if (li.length) { H("Our legitimate interests"); Array.prototype.push.apply(b, li); }
		var se = brSensBody(s); if (se.length) { H("Sensitive personal data"); Array.prototype.push.apply(b, se); }
		Array.prototype.push.apply(b, brCondBox(s, R));
		H(brEncNeeded(s) ? "Data protection officer (encarregado)" : "How to contact us about your data");
		Array.prototype.push.apply(b, brEncBody(s));
		H("Responsibilities of the processing agents");
		Array.prototype.push.apply(b, brRespBody(s, false));
		H("Transfers outside Brazil");
		Array.prototype.push.apply(b, brTransferBody(s));
		H("Automated decisions");
		Array.prototype.push.apply(b, brAdmBody(s, R, false, num.adm));
		if (yes(s, "brKids")) { H("Children and adolescents"); Array.prototype.push.apply(b, brKidsBody(s, R)); }
		H("Your rights under the LGPD");
		Array.prototype.push.apply(b, brRightsBody(s));
		if (brConsent(s)) { H("Refusing and withdrawing consent"); Array.prototype.push.apply(b, brConsentBody(s)); }
		H("Petitions to the ANPD and consumer bodies");
		b.push({ k: "p", x: BR_PETITION });
		H("Changes");
		b.push({ k: "p", x: BR_CHANGES });
		return b;
	}

	/* Part N rows. led: the LGPD sets the main text. */
	function brChecks(s, led) {
		var checks = [], delivery = [], acts = pnActs(s), direct = pnSourceDirect(s), indirect = pnSourceIndirect(s);
		var SELF = "A transfer row names your own organisation. If you collect the data directly from people, that is international collection, not a transfer (Regulation Article 6): remove the row. Keep it only where the data reaches you from another processing agent in Brazil, such as a service provider or a group company there.";
		if (led) {
			var nCh = (v(s, "ctrlEmail") ? 1 : 0) + (v(s, "ctrlPhone") ? 1 : 0) + (v(s, "ctrlAddress") ? 1 : 0);
			checks.push(!v(s, "ctrlName") || !nCh ? chk("N01", "missing", "Add the organisation's name and at least one contact channel.") : chk("N01", "ok"));
		}
		/* N02: encarregado, or a channel for small agents */
		var risky = acts.some(function (a) { return brSensOf(s, a); }) || yes(s, "brKids") || yes(s, led ? "adm" : "brAdm");
		var RISK = "You process sensitive data, data of children or adolescents, or take solely automated decisions. Combined with large-scale processing, or processing that can significantly affect people, that is high-risk: then none of the small agent reliefs apply, including the encarregado exemption and the doubled time limits (Resolution CD/ANPD 2/2022, Articles 3, I and 4).";
		if (yes(s, "publicBody") && yes(s, "brSmall")) checks.push(chk("N02", "missing", "Public bodies are not small processing agents (Resolution CD/ANPD 2/2022, Article 2, I) and must appoint an encarregado (Article 23, III LGPD), with the appointment published in the Official Gazette (Resolution CD/ANPD 18/2024, Article 5). Answer No."));
		else if (!yes(s, "publicBody") && !v(s, "brSmall")) checks.push(chk("N02", "missing", "Answer whether the organisation is a small processing agent under Resolution CD/ANPD 2/2022."));
		else if (yes(s, "brSmall") && !v(s, "brHighRisk")) checks.push(chk("N02", "missing", "Answer whether any of the processing is high-risk (Resolution CD/ANPD 2/2022, Articles 3 and 4)."));
		else if (brSmallOk(s) && !v(s, "brEnc")) checks.push(chk("N02", "missing", "Answer whether you have appointed an encarregado."));
		else if (!brEncNeeded(s)) checks.push(!v(s, "brChannel") ? chk("N02", "missing", "Give the channel people use to contact you about their data (Resolution CD/ANPD 2/2022, Article 11, paragraph 1).") :
			risky ? chk("N02", "warn", RISK + " Check that your answer on high-risk processing holds.") :
			chk("N02", "ok", "No encarregado: allowed for small processing agents without high-risk processing (Resolution CD/ANPD 2/2022, Articles 3, 4 and 11). Keep the reasoning on file."));
		else if (!v(s, "brEncKind") || !v(s, "brEncName") || (v(s, "brEncKind") === "entity" && !v(s, "brEncResp")))
			checks.push(chk("N02", "missing", "Give the encarregado's identity: the full name of a natural person, or the business name of a legal entity together with the full name of the person responsible there (Resolution CD/ANPD 18/2024, Article 9, paragraph 1)."));
		else if (!v(s, "brEncContact")) checks.push(chk("N02", "missing", "Give contact details that let people exercise their rights and let the ANPD reach the encarregado (Resolution CD/ANPD 18/2024, Article 9, paragraph 2)."));
		else if (brSmallOk(s) && risky) checks.push(chk("N02", "warn", RISK + " Check that your answer on high-risk processing holds."));
		else checks.push(chk("N02", "ok", "Also publish the identity and contact details in a prominent, easily accessible place on your website, and keep them up to date. The encarregado must be able to communicate clearly and precisely in Portuguese with data subjects and the ANPD (Resolution CD/ANPD 18/2024, Articles 8, 9 and 13)." +
			(yes(s, "publicBody") ? " Publish the appointment in the Official Gazette (Article 5, paragraph 1)." : "")));
		if (led) {
			var vague = acts.filter(function (a) { return D.LINT.vaguePurpose.test(v(a, "purpose")); });
			checks.push(!acts.length || acts.some(function (a) { return !v(a, "purpose"); }) ? chk("N03", "missing", "Every row needs a specific purpose (Article 6, I).") :
				vague.length ? chk("N03", "warn", "Too vague to tell a reader what happens: " + vague.map(function (a) { return "\"" + v(a, "purpose") + "\""; }).join(", ") + ". Purposes must be legitimate, specific and explicit (Article 6, I).") : chk("N03", "ok"));
		}
		/* N04: legal bases */
		var noLaw = acts.filter(function (a) { var b = brBasisOf(s, a); return (b === "II" || b === "III") && !v(a, "brLawRef"); });
		var pubOnly = (acts.some(function (a) { return brBasisOf(s, a) === "III" || brSensOf(s, a) === "b"; }) || brFurther(s) === "III") && !yes(s, "publicBody");
		var research = acts.some(function (a) { return brBasisOf(s, a) === "IV" || brSensOf(s, a) === "c"; }) || brFurther(s) === "IV";
		checks.push(!acts.length ? chk("N04", "missing", "Add the purposes first.") :
			acts.some(function (a) { return !brBasisOf(s, a) && !brSensOf(s, a); }) || (yes(s, "further") && !v(s, "brFurtherBasis")) ? chk("N04", "missing", "Choose an LGPD legal basis for every purpose: Article 7, or Article 11 for sensitive data.") :
			pubOnly ? chk("N04", "warn", "Article 7, III and Article 11, II, b are for the public administration carrying out public policies. A private organisation needs another basis.") :
			research ? chk("N04", "warn", "Article 7, IV and Article 11, II, c are only for a research body: a public body, or a non-profit legal entity incorporated under Brazilian law with its headquarters in Brazil, whose mission includes research (Article 5, XVIII).") :
			yes(s, "publicBody") && brUses(s, "IX") ? chk("N04", "warn", "The ANPD advises public bodies to avoid legitimate interests where the processing is compulsory or serves legal duties; prefer Article 7, II or III (ANPD legitimate interest guide, 2024).") :
			noLaw.length ? chk("N04", "warn", "Name the law, regulation or public policy behind each legal obligation or public policy basis (good practice; required of public bodies by Article 23, I).") : chk("N04", "ok"));
		/* N05: legitimate interests */
		var lis = acts.filter(function (a) { return brBasisOf(s, a) === "IX"; });
		var furtherLi = brFurther(s) === "IX";
		checks.push(!lis.length && !furtherLi ? chk("N05", "na", "No purpose relies on legitimate interests.") :
			lis.some(function (a) { return !v(a, "brLi"); }) || (furtherLi && !v(s, "brFurtherLi")) ? chk("N05", "missing", "Name the legitimate interest and the concrete situation it rests on for each purpose, the planned new one included (Article 10, paragraph 2).") :
			lis.some(function (a) { return brSensOf(s, a); }) ? chk("N05", "warn", "Legitimate interests is not a basis for sensitive data (Article 11). Make sure the Article 7, IX basis covers only the non-sensitive data of that purpose.") :
			chk("N05", "ok", "Keep the balancing test on file. The ANPD can ask for a data protection impact report on this processing (Article 10, paragraph 3)."));
		/* N06: sensitive data */
		var sens = acts.filter(function (a) { return brSensOf(s, a); });
		var gap = acts.filter(function (a) { return art9Of(s, a) && !brSensOf(s, a); });
		checks.push(gap.length ? chk("N06", "warn", "These purposes use special category data under the GDPR: " + joinList(gap.map(function (a) { return v(a, "purpose") || "[purpose]"; })) + ". Health, genetic, biometric, racial or ethnic, religious, political, trade union and sex life data are sensitive under the LGPD too (Article 5, II): choose an Article 11 basis for them.") :
			!sens.length ? chk("N06", "na", "No sensitive personal data marked. Check the list in Article 5, II, which includes biometric data.") :
			sens.some(function (a) { return brSensOf(s, a) === "I"; }) ? chk("N06", "ok", "Consent for sensitive data must be specific and highlighted, for specific purposes (Article 11, I).") : chk("N06", "ok"));
		if (led) {
			var vagueRet = acts.filter(function (a) { return D.LINT.vagueRetention.test(v(a, "retention")); });
			checks.push(!acts.length || acts.some(function (a) { return !v(a, "retention"); }) ? chk("N07", "missing", "Give how long the data is kept, or the criteria, for every purpose (Article 9, II).") :
				vagueRet.length ? chk("N07", "missing", "\"As long as necessary\" does not tell people the duration. Give a period or criteria they can apply (Article 9, II).") :
				!v(s, "brForm") ? chk("N07", "warn", "Duration stated. Say also how the data is collected and processed: the form of the processing (Article 9, II).") : chk("N07", "ok"));
			var rec = arr(s, "recipients");
			var xn = brTrows(s).map(function (t) { return v(t, "recipient"); }).filter(function (n, i, a) { return n && a.indexOf(n) === i && !sameName(n, v(s, "ctrlName")) && !rec.some(function (r) { return sameName(r.who, n); }); });
			checks.push(!rec.length ? chk("N08", "warn", "No recipients listed. Hosting, email and IT providers acting for you share the use of the data too. Confirm there really are none (Article 9, V).") :
				rec.some(function (r) { return !v(r, "who") || !v(r, "role") || !v(r, "why"); }) ? chk("N08", "missing", "Each recipient needs a name or specific category, a role and what the data is shared for (Article 9, V).") :
				xn.length ? chk("N08", "warn", "Add to the recipients list everyone named in a transfer: " + stop(joinList(xn))) : chk("N08", "ok"));
			var ja = acts.filter(function (a) { return yes(a, "jointP"); });
			checks.push(yes(s, "joint") && !(v(s, "jointWho") && v(s, "jointEssence") && v(s, "jointContact") && ja.length) ?
				chk("N09", "missing", "Name the other controller, what each of you does and the contact point, and mark the purposes run jointly.") :
				chk("N09", "ok", "Stated in the recipients section: you decide, operators follow your instructions, and liability under Article 42."));
		}
		/* N10, N11: transfers */
		var abroad = arr(s, "recipients").filter(function (r) { var w = v(r, "where"); return w && !/\bbra[sz]il\b/i.test(w); });
		if (no(s, "brTransfers") && abroad.length) checks.push(chk("N10", "warn", "These recipients are outside Brazil: " + joinList(abroad.map(function (r) { return (v(r, "who") || "[recipient]") + " (" + v(r, "where") + ")"; })) +
			". Giving them personal data is an international transfer under the LGPD, also when you are established abroad (Regulation Articles 3, I and 5). Answer Yes and add each country with its Article 33 mechanism."));
		else if (no(s, "brTransfers")) checks.push(no(s, "brEstablished") ? (v(s, "ctrlCountry") ? chk("N10", "ok", "The notice names the country where the organisation processes the data. Collecting data directly from people from abroad is not a transfer (Regulation Article 6), but onward transfers to other agents abroad are.") :
			chk("N10", "missing", "Name the country where the organisation is established.")) : chk("N10", "na", "No transfers outside Brazil."));
		else if (!yes(s, "brTransfers")) checks.push(chk("N10", "missing", "Answer whether personal data is transferred outside Brazil."));
		else {
			var tr = arr(s, "brTrows"), w = [];
			var bad = !tr.length || tr.some(function (t) { return !v(t, "country") || !brMech(t); });
			var notEu = tr.filter(function (t) { return v(t, "mech") === "adequacy" && !D.BR_EU.test(v(t, "country")); }).map(function (t) { return v(t, "country"); });
			if (notEu.length) w.push("The ANPD's only adequacy decision covers the EU Member States, Iceland, Liechtenstein and Norway, and EU institutions, bodies and agencies (Resolution CD/ANPD 32/2026, Article 1, sole paragraph). Use another mechanism for " + joinList(notEu.map(country)) + ".");
			else if (tr.some(function (t) { return v(t, "mech") === "adequacy"; }) && yes(s, "publicBody")) w.push("The EU adequacy decision does not cover transfers made only for public security, national defence, State security or criminal investigation (Resolution CD/ANPD 32/2026, Article 2).");
			if (tr.some(function (t) { return v(t, "mech") === "seal"; })) w.push("The ANPD has not yet set rules for seals, certificates or codes of conduct for transfers (Article 35). Check the instrument is recognised before relying on it.");
			if (tr.some(function (t) { return v(t, "mech") === "consent"; })) w.push("Consent to a transfer must be specific and highlighted, separate from other purposes, and given after you tell the person about the international character of the transfer (Article 33, VIII).");
			if (!yes(s, "publicBody") && tr.some(function (t) { return ["coop", "policy", "agreement"].indexOf(v(t, "mech")) !== -1; })) w.push("Article 33, III, VI and VII are for public bodies.");
			if (tr.some(function (t) { return sameName(v(t, "recipient"), v(s, "ctrlName")); })) w.push(SELF);
			checks.push(bad ? chk("N10", "missing", "Each transfer needs the country or international body and the Article 33 mechanism.") :
				no(s, "brEstablished") && !v(s, "ctrlCountry") ? chk("N10", "missing", "Name the country where the organisation is established.") :
				w.length ? chk("N10", "warn", w.join(" ")) : chk("N10", "ok"));
		}
		var docs = brDocRows(s);
		checks.push(!docs.length ? chk("N11", "na", "No transfers under ANPD clauses or global corporate rules.") :
			docs.some(function (t) { return !v(t, "form"); }) ? chk("N11", "missing", "For each transfer under ANPD clauses or rules, say what is transferred, how, for what purpose and for how long (Regulation Article 17, paragraph 2, I).") :
			!v(s, "brSecurity") ? chk("N11", "missing", "Describe the security measures that protect the transferred data (Regulation Article 17, paragraph 2, V).") :
			!brLang(s) ? chk("N11", "warn", "The Regulation requires this information in Portuguese, in simple, clear, precise and accessible language. Publish a Portuguese version. Send the full clauses within 15 days of a request (Article 17).") :
			chk("N11", "ok", "Send the full clauses within 15 days of a request (Article 17, paragraph 1). Standard clauses must be adopted in full, without changes (Article 16)."));
		/* N12 to N16: rights, timing, petitions, consent, conditions */
		checks.push(v(s, "rightsContact") ? chk("N12", "ok", "All nine Article 18 rights are mentioned, with objection and the review of automated decisions.") : chk("N12", "missing", "Say how people exercise their rights."));
		var PEND = "The ANPD's regulation on data subject rights (Articles 9, 18, 19 and 20) was not yet adopted on 12 November 2026. Check for it.";
		checks.push(yes(s, "publicBody") ? chk("N13", "check", "For public bodies the time limits and procedures for rights follow specific legislation, in particular the Habeas Data Law (9,507/1997), the Administrative Procedure Law (9,784/1999) and the Access to Information Law (12,527/2011) (Article 23, paragraph 3). The notice says so; add the times you apply if you want them stated.") :
			chk("N13", "ok", (brSmallOk(s) ? "Stated as for small agents: simplified reply within 15 days, full declaration within 30. " : "Stated: simplified reply at once, full declaration within 15 days. ") + PEND));
		checks.push(chk("N14", "ok", "Stated."));
		var ca = brConsentActs(s);
		checks.push(!brConsent(s) ? chk("N15", "na", "No purpose or transfer relies on consent.") :
			!v(s, "withdrawHow") ? chk("N15", "missing", "Say how consent is withdrawn: free of charge and through an easy procedure (Article 8, paragraph 5).") :
			(direct && ca.some(function (a) { return !v(a, "consequence"); })) || (brFurther(s) === "I" && !v(s, "furtherConsequenceBr")) ? chk("N15", "warn", "Say what happens if the person refuses consent, for each purpose that relies on it, the planned new one included (Article 18, VIII).") : chk("N15", "ok"));
		var cond = brCondActs(s);
		checks.push(!direct ? chk("N16", "na", "Data not collected from the person.") :
			!acts.length || acts.some(function (a) { return !v(a, "required") || !v(a, "consequence"); }) ? chk("N16", "missing", "For each purpose, say whether providing the data is required and what happens if it is not.") :
			cond.length ? chk("N16", "ok", "Highlighted in a box, with the consequences.") : chk("N16", "na", "No processing is a condition for a product, service or right."));
		/* N17: automated decisions */
		if (led) {
			if (!yes(s, "adm") && yes(s, "brAdm")) checks.push(chk("N17", "warn", "For the Brazil section you answered that you take decisions based solely on automated processing that affect people's interests" + (v(s, "brAdmWhat") ? " (" + v(s, "brAdmWhat").replace(/[.]$/, "") + ")" : "") +
				". The main question now has the LGPD meaning (Article 20): answer it Yes and describe the decision, or set the earlier Brazil answer to No."));
			else if (yes(s, "adm")) checks.push(!v(s, "admWhat") || !v(s, "admLogic") || !v(s, "admEffect") ? chk("N17", "missing", "Describe the decision, the criteria and the consequences.") :
				chk("N17", "ok", "Offer the review in practice and explain the criteria on request. The ANPD can audit for discriminatory aspects (Article 20, paragraph 2)."));
			else if (no(s, "adm")) checks.push(yes(s, "profiling") && !v(s, "profilingWhat") ? chk("N17", "missing", "Describe the profiling and its effect.") : chk("N17", "ok", "States that no such decisions are taken."));
			else checks.push(chk("N17", "missing", "Answer whether decisions are taken solely by automated means."));
		} else {
			if (yes(s, "brAdm")) checks.push(!v(s, "brAdmWhat") && !yes(s, "adm") ? chk("N17", "missing", "Say which decisions are taken solely by automated means.") :
				chk("N17", "ok", "Offer the review in practice and explain the criteria and procedures on request (Article 20)."));
			else if (no(s, "brAdm")) checks.push(yes(s, "adm") ? chk("N17", "warn", "The notice describes a decision based solely on automated processing with significant effects. Under the LGPD it affects the person's interests too: answer Yes.") :
				chk("N17", "na", "No decisions based solely on automated processing that affect people's interests."));
			else checks.push(chk("N17", "missing", "Answer whether, under the LGPD, decisions are taken solely by automated means."));
		}
		/* N18: children and adolescents */
		checks.push(!v(s, "brKids") ? chk("N18", "missing", "Answer whether you process data of children or adolescents.") :
			no(s, "brKids") ? chk("N18", "na", "No data of children or adolescents.") :
			ca.length && !v(s, "brKidsHow") ? chk("N18", "warn", "Where you rely on consent for a child's data, a parent or legal guardian must give specific and highlighted consent, and you must make reasonable efforts to verify it (Article 14, paragraphs 1 and 5). Say how.") :
			chk("N18", "check", "Do not make a child's participation in games, applications or other activities conditional on more data than strictly necessary (Article 14, paragraph 4). The ECA Digital (Law 15,211/2025, in force since 17 March 2026) applies to digital products and services aimed at or likely to be used by children and adolescents: clear information for informed choices (Article 7, paragraph 1), information on risks and security measures, available without buying the product (Article 16), and no profiling for targeted commercial advertising to them (Articles 22 and 26). Not modelled here."));
		if (yes(s, "publicBody")) checks.push(chk("N19", "check", "Public bodies publish, preferably on their websites, the legal basis, purpose, procedures and practices of their processing (Article 23, I). This notice covers the legal bases and purposes; add the procedures and practices." +
			(acts.some(function (a) { var x = brSensOf(s, a); return x === "a" || x === "b"; }) ? " Where you rely on Article 11, II, a or b, the notice states that consent is not required (Article 11, paragraph 2)." : "")));
		if (led && yes(s, "further")) checks.push(v(s, "furtherWhat") && v(s, "furtherStart") && v(s, "furtherData") && v(s, "brFurtherBasis") && v(s, "furtherRetention") && v(s, "furtherCompatBr") ?
			chk("N20", "ok", "Tell people about the new purpose before the start date, highlighting the change (Article 9, paragraph 2).") :
			chk("N20", "missing", "Give the new purpose, its start date, the data, the legal basis, the retention period and why it is compatible with the original purpose (Article 6, I)."));
		else checks.push(chk("N20", "ok", "Stated. When you change the purpose, form or duration, your identity or shared use, highlight the change in the message itself (Article 8, paragraph 6); where you rely on consent and the new purpose is incompatible with it, tell people before the change (Article 9, paragraph 2)."));
		if (led) {
			var srcs = arr(s, "sources");
			checks.push(!v(s, "source") ? chk("N21", "missing", "Answer where the data comes from.") : !indirect ? chk("N21", "na", "Data collected from the person.") :
				(srcs.length && srcs.every(function (x) { return v(x, "name"); })) || (yes(s, "unattributable") && v(s, "sourceNature")) ? chk("N21", "ok", "People are entitled to the origin on request (Article 19, II).") :
				chk("N21", "warn", "Name the sources. People are entitled to the origin of their data on request (Article 19, II)."));
		}
		checks.push(brLang(s) ? chk("N22", "ok") : chk("N22", "warn", "Publish a Portuguese version for people in Brazil. Portuguese is required for the transfer information (Resolution CD/ANPD 19/2024) and for information on products and services offered to consumers (CDC Article 31)."));
		/* Delivery */
		if (brConsent(s)) delivery.push(chk("N23", "check", "Give this information before asking for consent. Consent is void if the information was misleading or abusive, or not given beforehand in a transparent, clear and unambiguous way (Article 9, paragraph 1). Generic authorisations are void (Article 8, paragraph 4)."));
		if (brConsent(s) && arr(s, "recipients").some(function (r) { return v(r, "role") === "controller" || v(r, "role") === "joint"; }))
			delivery.push(chk("N24", "check", "If you share data obtained with consent with other controllers, obtain specific consent for that sharing (Article 7, paragraph 5)."));
		if (yes(s, "brKids")) delivery.push(chk("N25", "check", "Write a version children understand: simple, clear and accessible, with audiovisual resources where appropriate, for parents and children alike (Article 14, paragraph 6)."));
		return { checks: checks, delivery: delivery };
	}

	/* A document led by the LGPD. */
	function brLead(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]";
		var aud = v(s, "audience");
		var title = AUD_TITLE[aud] || (v(s, "audienceOther") ? "Privacy notice for " + lcFirst(v(s, "audienceOther")) : "Privacy notice");
		var acts = pnActs(s), direct = pnSourceDirect(s), indirect = pnSourceIndirect(s);
		var meta = [ctrl];
		if (v(s, "version")) meta.push("Version " + v(s, "version"));
		if (v(s, "effective")) meta.push("Effective " + fmtDate(v(s, "effective")));
		var num = {}, c = 3;
		if (indirect) num.source = c++;
		if (direct && acts.length) num.req = c++;
		num.recip = c++; num.transfers = c++; num.adm = c++;
		if (yes(s, "brKids")) num.kids = c++;
		num.rights = c++;
		if (brConsent(s)) num.consent = c++;
		num.complaints = c++;
		if (inReg(s, "ca")) num.ca = c++;
		if (inReg(s, "us")) num.us = c++;
		num.changes = c++;
		var R = { rights: "section " + num.rights, kids: "Sections 2 and " + num.rights };
		var blocks = [{ k: "h1", x: title }, { k: "meta", x: meta.map(stop).join(" ") }];

		var first = [{ k: "p", x: ctrl + " is responsible for the personal data described in this notice (the controller), under Brazil's General Data Protection Law (LGPD)." + (v(s, "ctrlEmail") ? " Contact: " + v(s, "ctrlEmail") + "." : "") }];
		first.push({ k: "p", x: brEncNeeded(s) ? "Our data protection officer (encarregado): " + brEncWho(s) + ", " + (v(s, "brEncContact") || "[contact details]") + "." :
			"To contact us about your data: " + (v(s, "brChannel") || "[the communication channel]") + "." });
		if (acts.length) first.push({ k: "p", x: "We use your personal data to:" }, { k: "ul", items: acts.map(function (a) { return v(a, "purpose") || "[purpose]"; }) });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		if (num.req && brCondActs(s).length) first.push({ k: "p", x: "Section " + num.req + " says which data you must provide for our products or services, and what happens if you do not." });
		first.push({ k: "p", x: "You have rights over your data: to confirm that we process it, to access and correct it, to have it anonymised, blocked or deleted, to move it, to know who we share it with, to refuse or withdraw consent, to object, to have automated decisions reviewed, and to petition the ANPD. Section " + num.rights + " explains how." });
		if (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });
		if (num.us) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + num.us + " also applies to you." });
		blocks.push({ k: "box", title: "In short", blocks: first });

		/* 1. Who is responsible (Article 9, III and IV; Article 41) */
		blocks.push({ k: "h2", x: "1. Who is responsible for your data" });
		var who = [ctrl];
		if (v(s, "ctrlAddress")) who.push(v(s, "ctrlAddress").replace(/\n+/g, ", "));
		blocks.push({ k: "p", x: stop(who.join(", ")) });
		var chans = [];
		if (v(s, "ctrlEmail")) chans.push({ b: "Email:", x: v(s, "ctrlEmail") });
		if (v(s, "ctrlPhone")) chans.push({ b: "Telephone:", x: v(s, "ctrlPhone") });
		if (chans.length) blocks.push({ k: "ul", items: chans });
		Array.prototype.push.apply(blocks, brEncBody(s));

		/* 2. Purposes and legal bases (Article 9, I and II; Articles 7, 10, 11) */
		blocks.push({ k: "h2", x: "2. What we use your data for, and on what legal basis" });
		Array.prototype.push.apply(blocks, brTable(s, true));
		if (v(s, "brForm")) blocks.push({ k: "p", x: "How we process your data: " + stop(v(s, "brForm")) });
		var li = brLiBody(s, R); if (li.length) { blocks.push({ k: "h3", x: "Our legitimate interests" }); Array.prototype.push.apply(blocks, li); }
		var se = brSensBody(s); if (se.length) { blocks.push({ k: "h3", x: "Sensitive personal data" }); Array.prototype.push.apply(blocks, se); }
		if (yes(s, "inferred")) blocks.push({ k: "p", x: "We also create information about you from the data above: " + stop(v(s, "inferredWhat") || "[what is inferred, and from what]") });

		if (num.source) {
			blocks.push({ k: "h2", x: num.source + ". Where your data comes from" });
			var src = arr(s, "sources");
			if (src.length) blocks.push({ k: "ul", items: src.map(function (x) {
				var ai = v(x, "usedFor"), a = ai !== "" ? acts[+ai] : null;
				return { b: (v(x, "name") || "[source]") + ":", x: (v(x, "what") || "[categories of data]") + (yes(x, "pub") ? " (a publicly accessible source)" : "") +
					", used for " + (a ? lcFirst(v(a, "purpose") || "[purpose]") : "[purpose]") + ". Legal basis and retention as for that purpose in section 2." };
			}) });
			if (yes(s, "unattributable")) blocks.push({ k: "p", x: "Where we cannot attribute a record to a single source, the data comes from " + stop(v(s, "sourceNature") || "[nature of the sources and type of organisation]") });
			else if (!src.length) blocks.push({ k: "p", x: "[Name each source of the data, and the categories of data you get from it.]" });
		}
		/* Article 9, paragraph 3 */
		if (num.req) {
			blocks.push({ k: "h2", x: num.req + ". Do you have to give us your data" });
			Array.prototype.push.apply(blocks, brCondBox(s, R));
			var rest = acts.filter(function (a) { return brCondActs(s).indexOf(a) === -1; });
			if (rest.length) blocks.push({ k: "ul", items: rest.map(function (a) {
				return { b: (v(a, "purpose") || "[purpose]") + ":", x: v(a, "required") === "optional" ? "Optional. If you do not provide it, " + lcFirst(stop(v(a, "consequence") || "[what happens]")) : "[say whether it is required]" };
			}) });
		}
		/* Shared use and responsibilities (Article 9, V and VI) */
		blocks.push({ k: "h2", x: num.recip + ". Who we share your data with, and why" });
		var rec = arr(s, "recipients");
		blocks.push(rec.length ? { k: "table", head: ["Recipient", "Role", "What for", "Location"],
			rows: rec.map(function (r) { return [v(r, "who") || "[recipient]", ROLE_TXT[v(r, "role")] || "[role]", v(r, "why") || "[what for]", v(r, "where") || "[location]"]; }) } :
			{ k: "p", x: "[List the recipients, including service providers that process data for you.]" });
		Array.prototype.push.apply(blocks, brRespBody(s, true));
		blocks.push({ k: "h2", x: num.transfers + ". Transfers outside Brazil" });
		Array.prototype.push.apply(blocks, brTransferBody(s));
		blocks.push({ k: "h2", x: num.adm + ". Automated decisions" });
		Array.prototype.push.apply(blocks, brAdmBody(s, R, true));
		if (num.kids) { blocks.push({ k: "h2", x: num.kids + ". Children and adolescents" }); Array.prototype.push.apply(blocks, brKidsBody(s, R)); }
		blocks.push({ k: "h2", x: num.rights + ". Your rights" });
		Array.prototype.push.apply(blocks, brRightsBody(s));
		if (num.consent) { blocks.push({ k: "h2", x: num.consent + ". Refusing and withdrawing consent" }); Array.prototype.push.apply(blocks, brConsentBody(s)); }
		blocks.push({ k: "h2", x: num.complaints + ". Petitions to the ANPD and consumer bodies" });
		blocks.push({ k: "p", x: BR_PETITION });

		var brSecs = [num.rights, num.consent, num.complaints].filter(Boolean).map(String);
		var only = brSecs.length ? " " + (brSecs.length > 1 ? "Sections " : "Section ") + joinList(brSecs) + (brSecs.length > 1 ? " apply" : " applies") + " to you only where the LGPD applies to our processing of your data." : "";
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
		if (yes(s, "further")) {
			var fb = lbl(D.BR_BASES, v(s, "brFurtherBasis"));
			blocks.push({ k: "box", title: "Planned new use of your data", blocks: [
				{ k: "p", x: "From " + (fmtDate(v(s, "furtherStart")) || "[start date]") + " we intend to use personal data we already hold for a new purpose: " + stop(v(s, "furtherWhat") || "[new purpose]") },
				{ k: "p", x: "For this new purpose we use " + lcFirst(v(s, "furtherData") || "[personal data]") + ", on the basis of " + (fb ? fb.t : "[legal basis]") +
					", and " + keepFor(v(s, "furtherRetention") || "[retention period or criteria]") + " It is listed in section 2." },
				{ k: "p", x: stop(v(s, "furtherCompatBr") || "[why it is compatible with the purpose the data was collected for]") + " Before that date you can exercise your rights using the contact details in section " + num.rights + "." }] });
		}
		blocks.push({ k: "p", x: BR_CHANGES + " We do not expect you to check this page for updates." });
		if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });

		var br = brChecks(s, true), checks = br.checks, delivery = br.delivery;
		if (yes(s, "joint")) checks.push(v(s, "jointWho") && v(s, "jointEssence") && v(s, "jointContact") && acts.some(function (a) { return yes(a, "jointP"); }) ? chk("P19", "ok", "Good practice under the LGPD; see also N09.", undefined, "WP260 44 (good practice)") :
			chk("P19", "warn", "Name the other controller, what each does and the contact point.", undefined, "WP260 44 (good practice)"));
		checks.push(v(s, "consequences") ? chk("P21", "ok", "", undefined, "WP260 10, 36 (good practice)") : chk("P21", "warn", "Empty. Fine only if nothing here is complex, technical or unexpected (WP260 10; good practice).", undefined, "WP260 10, 36 (good practice)"));
		if (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }
		if (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(delivery, usRes.delivery); }
		var lintHits = lintText(blocks);
		checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "LGPD Art. 6, VI; WP260 13") :
			chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "LGPD Art. 6, VI; WP260 13"));
		/* The WP260 delivery points remain good practice under the LGPD (Articles 6, VI and 9). */
		var gp = [];
		if (direct) gp.push(chk("D01", "check", "Give the notice when the data is collected: before a form is submitted, before payment, before sign-up. Mark required fields on every form.", "Timing: when the data is collected"));
		gp.push(chk("D03", "check", "Read it as a member of the audience would. The LGPD asks for clear, adequate and prominent information (Article 9)."));
		gp.push(chk("D04", "check", "Publish it on its own page, not inside terms and conditions."));
		if (has(s, "channel", "web")) gp.push(chk("D05", "check", "Link it from every page under a common term such as \"Privacy\", and from every form that collects data."));
		if (has(s, "channel", "app")) gp.push(chk("D06", "check", "Show it in the app store listing and keep it within two taps inside the app."));
		gp.push(chk("D07", "check", has(s, "channel", "phone") || has(s, "channel", "paper") || has(s, "channel", "device") ? "Offline, give the \"In short\" content first and point to the full notice." : "Use the \"In short\" box as the first layer and keep it consistent with the full text."));
		gp.push(chk("D08", "check", "Keep the full notice available as one document."));
		if (v(s, "languages")) gp.push(chk("D10", "check", "Check each translation reads naturally in " + v(s, "languages") + "."));
		gp.push(chk("D12", "check", "When this notice changes, tell people directly, highlighting what changed, before a change of purpose takes effect."));
		gp.push(chk("D14", "check", "If you add icons, keep them alongside the text, never instead of it."));
		gp.forEach(function (r) { var m = D.MATRIX[r.id]; if (m) r.s = m.s.replace(/^Art\.[^;]*;\s*/, "") + " (good practice)"; });
		delivery = gp.concat(delivery);
		return { title: title, file: slug(ctrl + " " + title), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(delivery), docLabel: "Notice" };
	}

