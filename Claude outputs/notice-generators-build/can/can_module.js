	/* ======================================================== CANADA === */
	/* Matrix Part O. PIPEDA and the Quebec, Alberta and British Columbia private-sector laws.
	   The user ticks each law that applies; an empty answer reads as PIPEDA. Canada keeps its own
	   answers (person accountable, condition of service, form of consent, sensitivity, processing
	   outside Canada, Quebec's questions), so no answer given under another law is reused. */
	function canOn(s) { return inReg(s, "can"); }
	function canJurs(s) { var t = arr(s, "canJur").filter(function (x) { return !!lbl(D.CAN_JUR, x); }); return t.length ? t : ["fed"]; }
	function canJ(s) { var t = canJurs(s); return D.CAN_JUR.filter(function (j) { return t.indexOf(j.v) !== -1; }); }
	function canHas(s, j) { return canOn(s) && canJurs(s).indexOf(j) !== -1; }
	function canFed(s) { return canHas(s, "fed"); }
	function canQc(s) { return canHas(s, "qc"); }
	function canAb(s) { return canHas(s, "ab"); }
	function canBc(s) { return canHas(s, "bc"); }
	function canConsOf(s, a) { return canOn(s) ? v(a, "canConsent") : ""; }
	function canSensOf(s, a) { return canOn(s) && yes(a, "canSens"); }
	function canConsentActs(s) { return pnActs(s).filter(function (a) { var c = canConsOf(s, a); return c === "express" || c === "implied" || c === "optout"; }); }
	function canConsent(s) { return canConsentActs(s).length > 0 || (canOn(s) && yes(s, "further") && v(s, "canFurther") === "consent") || (canQc(s) && yes(s, "canProspect")); }
	function canPic(s) { return v(s, "canPicName") || "[name or title of the person accountable]"; }
	function canPicContact(s) { return v(s, "canPicContact") || "[address and contact details]"; }
	function canLawNames(s) { return joinList(canJ(s).map(function (j) { return j.n; })); }
	/* Place tests on free text (recipient locations, the organisation's address). Review R16: postal
	   abbreviations and postal codes count, case-sensitively. */
	function canPlace(w) { return /\b(canad(a|ian)|quebec|qu\u00e9bec|ontario|alberta|british columbia|manitoba|saskatchewan|nova scotia|new brunswick|newfoundland|labrador|prince edward island|yukon|nunavut|northwest territories|toronto|montr[e\u00e9]al|vancouver|calgary|ottawa|edmonton|winnipeg|halifax|mississauga|brampton|hamilton|laval|gatineau|surrey|victoria|regina|saskatoon)\b/i.test(w) ||
		/\b(ON|QC|BC|AB|MB|SK|NS|NB|NL|PE|YT|NT|NU)\b/.test(w) || /\b[A-Z]\d[A-Z] ?\d[A-Z]\d\b/.test(w); }
	var CAN_PROV = {
		qc: function (w) { return /\b(quebec|qu\u00e9bec|montr[e\u00e9]al|laval|gatineau|longueuil|sherbrooke|saguenay|l[e\u00e9]vis|trois-rivi[e\u00e8]res)\b/i.test(w) || /\bQC\b/.test(w) || /\b[GHJ]\d[A-Z] ?\d[A-Z]\d\b/.test(w); },
		ab: function (w) { return /\b(alberta|calgary|edmonton|red deer|lethbridge)\b/i.test(w) || /\bAB\b/.test(w) || /\bT\d[A-Z] ?\d[A-Z]\d\b/.test(w); },
		bc: function (w) { return /\b(british columbia|vancouver|victoria|surrey|burnaby|kelowna)\b/i.test(w) || /\bBC\b/.test(w) || /\bV\d[A-Z] ?\d[A-Z]\d\b/.test(w); }
	};
	/* Recipients, and the organisation itself, located outside the provinces given (review R01, R08). */
	function canOutside(s, provs) {
		var out = arr(s, "recipients").filter(function (r) { var w = v(r, "where"); return w && !/^\s*canada\s*$/i.test(w) && !provs.some(function (p) { return CAN_PROV[p](w); }); })
			.map(function (r) { return (v(r, "who") || "[recipient]") + " (" + v(r, "where") + ")"; });
		var a = v(s, "ctrlAddress");
		if (a && !provs.some(function (p) { return CAN_PROV[p](a); })) out.unshift("your organisation (" + a.replace(/\n+/g, ", ") + ")");
		return out;
	}
	function canCite(s, m) { return [canFed(s) ? m.fed : "", canQc(s) ? m.qc : "", canAb(s) ? m.ab : "", canBc(s) ? m.bc : ""].filter(Boolean).join("; "); }
	var CAN_ROLE = { processor: "Service provider acting for us", controller: "Uses it for its own purposes", joint: "Decides with us how it is used", authority: "Public authority" };

	/* Q06: the person's choice for one purpose. */
	function canChoice(s, a) {
		var c = canConsOf(s, a), need = v(a, "canNeed");
		if (c === "none") return (v(a, "canLaw") ? "Without your consent, as the law allows (" + v(a, "canLaw").replace(/[.]$/, "") + ")." : "Without your consent: [name the provision of the law that allows this without consent].") + (need === "Yes" ? " Needed to provide the product or service." : "");
		var how = c === "express" ? "We ask for your consent." : c === "implied" ? "You consent by giving us the information for this purpose." :
			c === "optout" ? "We do this unless you opt out." : "[say how consent works]";
		if (need === "Yes") return "Needed to provide the product or service you asked for. " + (c === "optout" ? "[A use needed for the service cannot rest on opt-out: check the answers.]" : how);
		if (need === "No") return "Optional. " + (c === "express" ? "We ask for your consent, and you can say no." : c === "implied" ? how + " You can withdraw that consent." : how);
		return "[say whether it is needed for the product or service] " + how;
	}
	function canTable(s, full) {
		var acts = pnActs(s);
		if (!acts.length) return [{ k: "p", x: "[Add the purposes.]" }];
		return [full ? { k: "table", head: ["Purpose", "Personal information", "Your choice", "How long we keep it"],
			rows: acts.map(function (a) { return [v(a, "purpose") || "[purpose]", v(a, "data") || "[personal information]", canChoice(s, a), v(a, "retention") || "[retention period or criteria]"]; }) } :
			{ k: "table", head: ["Purpose", "Your choice"], rows: acts.map(function (a) { return [v(a, "purpose") || "[purpose]", canChoice(s, a)]; }) }];
	}
	/* Q07, Q10, Q09 and Quebec section 8, second paragraph. */
	function canAboutBody(s) {
		var b = [], sp = pnActs(s).filter(function (a) { return canSensOf(s, a); });
		if (sp.length) b.push({ k: "p", x: "We treat the information we use for " + joinList(sp.map(function (a) { return lcFirst(v(a, "purpose") || "[purpose]"); })) + " as sensitive, and protect it accordingly." +
			(sp.every(function (a) { return canConsOf(s, a) === "express"; }) ? " We ask for your express consent before we collect, use or disclose it." : "") });
		if (v(s, "canMeans")) b.push({ k: "p", x: "How we collect your information: " + stop(v(s, "canMeans")) });
		else if (canQc(s)) b.push({ k: "p", x: "How we collect your information: [the means of collection, for example web forms, cookies, phone calls]." });
		if (canQc(s) && v(s, "canForWhom")) b.push({ k: "p", x: "We collect this information for " + stop(v(s, "canForWhom")) });
		return b;
	}
	function canRelatedBody(s) {
		if (!canFed(s)) return [];
		if (yes(s, "canRelated")) return [{ k: "p", x: "We make the following personal information available to related organisations: " + stop(v(s, "canRelatedWhat") || "[what information, to which related organisations, and why]") }];
		if (no(s, "canRelated")) return [{ k: "p", x: "We do not make your personal information available to related organisations, such as subsidiaries or affiliates." }];
		return [{ k: "p", x: "[Say whether you make personal information available to related organisations, such as subsidiaries.]" }];
	}
	/* Q11, Q12: OPC cross-border guidelines; Alberta sections 6(2) and 13.1; Quebec sections 8 and 17. */
	function canAbroadBody(s) {
		var b = [];
		if (yes(s, "canAbroad")) {
			b.push({ k: "p", x: "Your personal information is stored, processed or accessed outside Canada, in " + stop(v(s, "canAbroadWhere") || "[countries]") +
				(v(s, "canAbroadWhy") ? " Our service providers there " + lcFirst(stop(v(s, "canAbroadWhy"))) : "") +
				" While it is outside Canada, it is subject to the laws of those countries, and courts, law enforcement and national security authorities there can access it. We remain responsible for it, and protect it by contract or other means while others process it for us." });
			if (canAb(s)) b.push({ k: "p", x: "You can get written information about our policies and practices on service providers outside Canada, and ask questions about how they collect, use, disclose or store your personal information for us, from " +
				"the person accountable for our privacy practices (" + canPic(s) + "): " + canPicContact(s).replace(/[.]$/, "") + " (Alberta PIPA, sections 6 and 13.1)." });
		} else if (no(s, "canAbroad")) b.push({ k: "p", x: "We store and process your personal information in Canada." });
		else b.push({ k: "p", x: "[Say whether personal information is stored, processed or accessed outside Canada.]" });
		if (canQc(s)) {
			if (yes(s, "canOutQc")) b.push({ k: "p", x: "Your personal information can be communicated outside Quebec" + (yes(s, "canAbroad") ? ", including outside Canada as described above" : "") +
				". Before we do so, we assess the privacy impact, and we only do it if the information will be adequately protected, under a written agreement (Quebec's Act, sections 8 and 17)." });
			else if (no(s, "canOutQc") && !yes(s, "canAbroad") && !canOutside(s, ["qc"]).length) b.push({ k: "p", x: "We do not communicate your personal information outside Quebec." });
			else b.push({ k: "p", x: "[Say whether personal information can be communicated outside Quebec, including to other Canadian provinces.]" });
		}
		return b;
	}
	/* Q13, Q14: Quebec sections 8.1 and 12.1. led: the main automated decision question carries
	   the section 12.1 meaning. */
	function canAdmBody(s, led, admNum) {
		var b = [], qc = canQc(s);
		var RIGHTS = "We tell you that a decision was made this way no later than when we tell you the decision. On request, we also tell you the personal information used to make it, the reasons and the principal factors and parameters that led to it, and your right to have that personal information corrected. You can submit your observations to a member of our staff who can review the decision (Quebec's Act, section 12.1).";
		if (led) {
			if (yes(s, "adm")) {
				Array.prototype.push.apply(b, admCore(s, "We make the following decision about you based exclusively on automated processing of your personal information: "));
				if (qc) b.push({ k: "p", x: RIGHTS });
			} else if (qc && yes(s, "canAdm")) {
				/* A section 12.1 "Yes" given for the Canada section is never overridden by an answer
				   given under another law's wording. */
				b.push({ k: "p", x: "[Say whether you make decisions based exclusively on automated processing. For the Canada section you answered Yes" + (v(s, "canAdmWhat") ? ": " + v(s, "canAdmWhat").replace(/[.]$/, "") : "") + ".]" });
			} else if (no(s, "adm")) {
				b.push({ k: "p", x: "We do not make decisions about you based exclusively on automated processing of your personal information." });
				if (yes(s, "profiling")) b.push({ k: "p", x: "We do use profiling: " + stop(v(s, "profilingWhat") || "[the profiling and its effect]") });
			} else b.push({ k: "p", x: "[Say whether you make decisions based exclusively on automated processing.]" });
		} else if (qc) {
			if (yes(s, "canAdm")) {
				b.push({ k: "p", x: "We make these decisions about you based exclusively on automated processing of your personal information: " +
					stop(v(s, "canAdmWhat") || (yes(s, "adm") && admNum ? "the decision described in section " + admNum : "[the decisions]")) });
				b.push({ k: "p", x: RIGHTS });
			} else if (no(s, "canAdm")) b.push({ k: "p", x: yes(s, "adm") ? "[The notice describes a decision based solely on automated processing in section " + admNum + ". Under Quebec's Act, say whether it is based exclusively on automated processing.]" :
				"We do not make decisions about you based exclusively on automated processing of your personal information." });
			else b.push({ k: "p", x: "[Say whether you make decisions based exclusively on automated processing.]" });
		}
		if (qc) {
			if (yes(s, "canTech")) b.push({ k: "p", x: "We collect information using technology with functions that can identify, locate or profile you: " + stop(v(s, "canTechWhat") || "[the technology and what its functions do]") +
				" To turn those functions on: " + lcFirst((v(s, "canTechHow") || "[how]").replace(/[.]$/, "")) + " (Quebec's Act, section 8.1)." });
			else if (no(s, "canTech") && canProfiles(s)) b.push({ k: "p", x: "[You describe profiling in this notice. Say which technology profiles people and how they turn that function on (Quebec's Act, section 8.1).]" });
			else if (no(s, "canTech")) b.push({ k: "p", x: "We do not use technology with functions that identify, locate or profile you when we collect your information." });
			else b.push({ k: "p", x: "[Say whether you use technology with functions that can identify, locate or profile people.]" });
		}
		return b;
	}
	/* Q15: OPC consent guidelines (under 13); Quebec sections 4.1 and 14 (under 14). */
	/* Quebec section 8.1 defines profiling as collecting and using personal information to assess a
	   person's characteristics, such as preferences, interests or behaviour (review R02). */
	function canProfiles(s) { return yes(s, "profiling") || yes(s, "inferred"); }
	function canKidsBody(s) {
		return [{ k: "p", x: "A child who is too young to understand what they are agreeing to cannot give meaningful consent. For a child under 13" + (canQc(s) ? ", and in Quebec for a minor under 14 (Quebec's Act, sections 4.1 and 14)," : "") +
			" we ask a parent or guardian to consent for them." + (v(s, "canKidsHow") ? " " + stop(v(s, "canKidsHow")) : "") +
			" For older minors, we explain our practices in a way that suits their age and maturity." }];
	}
	/* Q17: rights per ticked law. */
	function canRightsBody(s, admOn, led) {
		var b = [], js = canJ(s), many = js.length > 1;
		js.forEach(function (j) {
			if (many) b.push(led ? { k: "h3", x: "Under " + j.n } : { k: "p", x: "Under " + j.n + ":" });
			var items = D.RIGHTS_CAN[j.v].slice();
			if (j.v === "qc" && admOn) items.push({ title: "Automated decisions (section 12.1).", text: "You can ask for the personal information used to make a decision based exclusively on automated processing, the reasons and the principal factors and parameters that led to it, and have the information corrected. You can submit your observations to a member of our staff who can review the decision." });
			b.push({ k: "ul", items: items.map(function (r) { return { b: r.title, x: r.text }; }) });
			b.push({ k: "p", x: D.CAN_REQ[j.v] });
		});
		b.push({ k: "p", x: "Send your request in writing to the person accountable for our privacy practices (" + canPic(s) + "): " + stop(v(s, "rightsContact") || canPicContact(s)) +
			" We ask you only for the information we need to identify you and the personal information you want, and use it only for that." });
		return b;
	}
	/* Q19, Q22: PIPEDA principle 4.3.8; Alberta and British Columbia section 9; Quebec sections 8 and 22. */
	function canConsentBody(s) {
		var b = [], oo = pnActs(s).filter(function (a) { return canConsOf(s, a) === "optout"; });
		var lead = canFed(s) ? "Where we rely on your consent, you can withdraw it at any time, on reasonable notice and subject to legal or contractual restrictions: " :
			canAb(s) || canBc(s) ? "Where we rely on your consent, you can withdraw it at any time on reasonable notice, unless withdrawing would frustrate the performance of a legal obligation: " :
			"Where we rely on your consent, you can withdraw it at any time: ";
		b.push({ k: "p", x: lead + stop(v(s, "withdrawHow") || "[how to withdraw]") +
			" When you do, we tell you what it means for you, for example if we can no longer provide a service. We then stop collecting, using or disclosing your information for that purpose, unless the law allows us to continue without consent." });
		if (oo.length) b.push({ k: "p", x: "You can opt out of " + joinList(oo.map(function (a) { return lcFirst(v(a, "purpose") || "[purpose]"); })) + " at any time, in the same way." });
		if (canQc(s) && yes(s, "canProspect")) b.push({ k: "p", x: "When we use your personal information for commercial or philanthropic prospecting, we identify ourselves and tell you that you can withdraw your consent to that use. If you do, we stop (Quebec's Act, section 22)." });
		return b;
	}
	/* Q18: complaints. */
	function canComplaintBody(s) {
		var b = [{ k: "p", x: "If you have a concern about how we handle your personal information, contact the person accountable for our privacy practices first (" + canPic(s) + "): " + stop(canPicContact(s)) +
			" We investigate every complaint and, if it is justified, take appropriate measures, including changing our policies and practices." +
			(canQc(s) ? " Our process for dealing with complaints is part of our governance policies (Quebec's Act, section 3.2)." : "") }];
		b.push({ k: "p", x: "You can also go to the regulator:" });
		b.push({ k: "ul", items: canJ(s).map(function (j) { return { b: j.reg + ":", x: D.CAN_COMPLAIN[j.v] }; }) });
		return b;
	}
	/* Q21: Quebec section 3.2. */
	function canGovBody(s) {
		return [{ k: "p", x: "Our governance policies and practices set a framework for keeping and destroying personal information, define the roles and responsibilities of our staff throughout its life cycle, and provide a process for dealing with complaints about its protection. Detailed information about them: " +
			stop(v(s, "canGovUrl") || "[where it is published]") }];
	}
	function canPicBody(s) {
		return [{ k: "p", x: "The person accountable for our privacy practices" + (canQc(s) ? ", and in Quebec our person in charge of the protection of personal information" : "") + ": " +
			canPic(s) + ", " + stop(canPicContact(s)) + " You can send them your questions and complaints about how we collect, use and disclose your personal information." }];
	}
	var CAN_CHANGES = "When we plan a significant change to our privacy practices, such as using your personal information for a new purpose, or disclosing it to a new third party for a purpose other than providing our service, we tell you before the change takes effect and ask for your consent, unless the law requires the change.";
	function canFurtherBox(s) {
		var f = v(s, "canFurther");
		return { k: "box", title: "Planned new use of your personal information", blocks: [
			{ k: "p", x: "From " + (fmtDate(v(s, "furtherStart")) || "[start date]") + " we intend to use personal information we already hold for a new purpose: " + stop(v(s, "furtherWhat") || "[new purpose]") },
			{ k: "p", x: "For this new purpose we use " + lcFirst(v(s, "furtherData") || "[personal information]") + ", and " + keepFor(v(s, "furtherRetention") || "[retention period or criteria]") },
			{ k: "p", x: f === "consent" ? "We will ask for your consent before we use your information for it." : f === "law" ? "The law requires this use: " + stop(v(s, "canFurtherLaw") || "[the law]") :
				"[Say whether you will ask for consent, or which law requires the new use.]" }] };
	}

	/* The "Additional information for people in Canada" section of a notice led by another law. */
	function canSection(s, secs, lawName, admNum) {
		var b = [], H = function (t) { b.push({ k: "h3", x: t }); };
		var many = canJ(s).length > 1;
		var other = secs.filter(Boolean).map(String);
		b.push({ k: "p", x: "For people in Canada, " + canLawNames(s) + (many ? " apply" : " applies") + ". The rest of this notice describes how we handle your personal information. The choices, rights and other information in this section are those " + (many ? "these laws give" : "this law gives") + " you." +
			(other.length ? " " + (other.length > 1 ? "Sections " : "Section ") + joinList(other) + (other.length > 1 ? " apply" : " applies") + " to you only where the " + lawName + " applies to our processing of your data." : "") });
		H("Person accountable for our privacy practices");
		Array.prototype.push.apply(b, canPicBody(s));
		H("Your choices for each purpose");
		Array.prototype.push.apply(b, canTable(s, false));
		Array.prototype.push.apply(b, canAboutBody(s));
		Array.prototype.push.apply(b, canRelatedBody(s));
		if (v(s, "canRisk")) { H("Risks you should know about"); b.push({ k: "p", x: stop(v(s, "canRisk")) }); }
		H("Processing outside Canada");
		Array.prototype.push.apply(b, canAbroadBody(s));
		if (canQc(s)) { H("Automated decisions and technology that identifies, locates or profiles you"); Array.prototype.push.apply(b, canAdmBody(s, false, admNum)); }
		if (yes(s, "canKids")) { H("Children"); Array.prototype.push.apply(b, canKidsBody(s)); }
		H("Your rights in Canada");
		Array.prototype.push.apply(b, canRightsBody(s, canQc(s) && yes(s, "canAdm"), false));
		if (canConsent(s)) { H("Withdrawing consent"); Array.prototype.push.apply(b, canConsentBody(s)); }
		H("Complaints");
		Array.prototype.push.apply(b, canComplaintBody(s));
		if (canQc(s)) { H("Our governance policies"); Array.prototype.push.apply(b, canGovBody(s)); }
		H("Changes");
		b.push({ k: "p", x: CAN_CHANGES });
		return b;
	}

	/* Part O rows. led: Canada sets the main text. */
	function canChecks(s, led) {
		var checks = [], delivery = [], acts = pnActs(s), direct = pnSourceDirect(s), indirect = pnSourceIndirect(s);
		var qc = canQc(s), ab = canAb(s), fed = canFed(s);
		var rec = arr(s, "recipients");
		if (led) {
			var nCh = (v(s, "ctrlEmail") ? 1 : 0) + (v(s, "ctrlPhone") ? 1 : 0) + (v(s, "ctrlAddress") ? 1 : 0);
			checks.push(!v(s, "ctrlName") || !nCh ? chk("Q01", "missing", "Add the organisation's name and at least one contact channel.") : chk("Q01", "ok"));
		}
		checks.push(!v(s, "canPicName") || !v(s, "canPicContact") ? chk("Q02", "missing", "Give the name or title of the person accountable for compliance" + (qc ? " (in Quebec, the person in charge of the protection of personal information)" : "") + ", and their address and contact details (" + canCite(s, { fed: "PIPEDA principle 4.8.2(a)", qc: "Quebec section 3.1", ab: "Alberta section 13(1)(b)", bc: "British Columbia section 4(5)" }) + ").") :
			chk("Q02", "ok", qc ? "Publish the title and contact information of the person in charge on your website too (Quebec section 3.1). Unless delegated in writing, it is the person with the highest authority in the organisation." : ""));
		/* Q03: which laws apply */
		var provs = ["qc", "ab", "bc"].filter(function (p) { return canHas(s, p); });
		var crossing = !fed ? canOutside(s, provs) : [];
		var leaves = yes(s, "canAbroad") || (qc && yes(s, "canOutQc"));
		checks.push(yes(s, "publicBody") ? chk("Q03", "warn", "These are private-sector laws. Federal government institutions are under the Privacy Act, and provincial public bodies under their own public-sector laws, which this generator does not model.") :
			!fed && (leaves || crossing.length) ? chk("Q03", "warn", (crossing.length ? "Personal information goes outside the provinces you ticked: " + joinList(crossing) + ". " : "") +
				"Personal information that crosses a provincial or national border in the course of commercial activity is under PIPEDA (OPC cross-border guidelines; British Columbia section 3(2)(c)). Tick the federal law too.") :
			chk("Q03", "ok", "Covers " + canLawNames(s) + "." + (!fed ? " PIPEDA also applies to federally regulated businesses and to personal information that crosses a provincial or national border: tick it if that happens." : "") +
				" Bill C-36, which would replace PIPEDA's privacy rules, was at second reading on 12 November 2026, and PIPEDA's data mobility amendments (S.C. 2026, c. 3) were not yet in force: check their progress." +
				(canBc(s) ? " British Columbia's PIPA changes for credit reporting agencies from 1 August 2027 (S.B.C. 2025, c. 31)." : "")));
		if (led) {
			var vague = acts.filter(function (a) { return D.LINT.vaguePurpose.test(v(a, "purpose")) || /\bservice improvement\b/i.test(v(a, "purpose")); });
			checks.push(!acts.length || acts.some(function (a) { return !v(a, "purpose"); }) ? chk("Q04", "missing", "Every row needs a purpose, identified at or before collection (" + canCite(s, { fed: "PIPEDA principle 4.2", qc: "Quebec sections 4 and 8", ab: "Alberta section 13(1)(a)", bc: "British Columbia section 10(1)(a)" }) + ").") :
				vague.length ? chk("Q04", "warn", "Too vague to tell a reader what happens: " + vague.map(function (a) { return "\"" + v(a, "purpose") + "\""; }).join(", ") + ". Describe purposes in meaningful language; the OPC gives \"service improvement\" as an example of vagueness.") : chk("Q04", "ok"));
			var dataOk = acts.length && acts.every(function (a) { return v(a, "data"); });
			if (indirect) dataOk = dataOk && arr(s, "sources").every(function (x) { return v(x, "what"); });
			checks.push(dataOk ? chk("Q05", "ok") : chk("Q05", "missing", "Say what personal information is collected for every purpose, and from each source, with enough precision for people to understand what they consent to (" + (fed ? "PIPEDA principle 4.4.1; " : "") + "OPC consent guidelines, key element 1)."));
		}
		/* Q06: condition of service and consent. Every problem is listed (review R03). */
		var badOO = acts.filter(function (a) { return yes(a, "canNeed") && canConsOf(s, a) === "optout"; });
		var noLaw = acts.filter(function (a) { return canConsOf(s, a) === "none" && !v(a, "canLaw"); });
		var LAWNAME = { fed: /pipeda/i, qc: /qu(e|\u00e9)bec/i, ab: /alberta/i, bc: /british columbia|\bB\.?C\.?\b/i };
		var wrongLaw = acts.filter(function (a) {
			var l = canConsOf(s, a) === "none" ? v(a, "canLaw") : "";
			return l && !canJurs(s).some(function (j) { return LAWNAME[j].test(l); });
		});
		var q6 = [];
		if (badOO.length) q6.push("A use needed for the service cannot rest on opt-out: " + joinList(badOO.map(function (a) { return v(a, "purpose") || "[purpose]"; })) + ". Use express or implied consent, or split the purpose.");
		if (noLaw.length) q6.push("Name the provision of each ticked law that allows these uses without consent: " + joinList(noLaw.map(function (a) { return v(a, "purpose") || "[purpose]"; })) +
			". Being needed for the service is not an exception to consent; where people give the information for an obvious purpose, choose implied consent.");
		if (wrongLaw.length) q6.push("The provision named does not belong to a law you ticked: " + joinList(wrongLaw.map(function (a) { return (v(a, "purpose") || "[purpose]") + " (" + v(a, "canLaw") + ")"; })) + ".");
		checks.push(!acts.length ? chk("Q06", "missing", "Add the purposes first.") :
			acts.some(function (a) { return !v(a, "canNeed") || !canConsOf(s, a); }) ? chk("Q06", "missing", "For every purpose, say whether it is needed to provide the product or service, and how consent works for it.") :
			q6.length ? chk("Q06", "warn", q6.join(" ")) :
			chk("Q06", "ok", "You cannot require consent beyond what the product or service needs as a condition of supplying it (" +
				canCite(s, { fed: "PIPEDA principle 4.3.3", qc: "Quebec section 9: in case of doubt, information is deemed not necessary", ab: "Alberta section 7(2)", bc: "British Columbia section 7(2)" }) + ")."));
		/* Q07: sensitive information */
		var sens = acts.filter(function (a) { return canSensOf(s, a); });
		var weak = sens.filter(function (a) { var c = canConsOf(s, a); return c === "implied" || c === "optout"; });
		var gap = acts.filter(function (a) { return art9Of(s, a) && !canSensOf(s, a); });
		checks.push(gap.length ? chk("Q07", "warn", "These purposes use special category data under the GDPR: " + joinList(gap.map(function (a) { return v(a, "purpose") || "[purpose]"; })) + ". Such information is generally sensitive in Canada too: mark it sensitive.") :
			!sens.length ? chk("Q07", "na", "No information marked sensitive. Health, financial, biometric and genetic information, ethnic origin, political opinions, religious beliefs and sex life are generally sensitive, and any information can be sensitive in context.") :
			weak.length ? chk("Q07", "warn", "Sensitive information generally needs express consent (" + (fed ? "PIPEDA principle 4.3.6; " : "") + "OPC consent guidelines)." +
				(qc ? " Quebec requires express consent to use sensitive information for a purpose other than the one it was collected for, and to communicate it to a third person (sections 12 and 13)." : "") +
				" Check: " + joinList(weak.map(function (a) { return v(a, "purpose") || "[purpose]"; })) + ".") :
			chk("Q07", "ok"));
		if (led) {
			var xn = rec.filter(function (r) { return v(r, "role") === "controller"; });
			var oo = acts.filter(function (a) { return canConsOf(s, a) === "optout"; });
			checks.push(!rec.length ? chk("Q08", "warn", "No recipients listed. Hosting, email and IT providers that process information for you count. Confirm there really are none (OPC key element 2).") :
				rec.some(function (r) { return !v(r, "who") || !v(r, "why"); }) ? chk("Q08", "missing", "Name each recipient, or a specific category, and what the information is shared for (OPC key element 2" + (qc ? "; Quebec section 8" : "") + ").") :
				chk("Q08", xn.length ? "warn" : "ok", xn.length ? "These recipients use the information for their own purposes: " + joinList(xn.map(function (r) { return v(r, "who"); })) + ". Explain this clearly and make sure your consent covers it (OPC key element 2)." +
					(oo.length ? " Disclosure to third parties for their own purposes is generally outside what people expect, and the OPC expects express consent for that; check these opt-out uses: " + joinList(oo.map(function (a) { return v(a, "purpose") || "[purpose]"; })) + "." : "") : ""));
		}
		checks.push(!fed ? chk("Q09", "na", "A PIPEDA requirement.") : !v(s, "canRelated") ? chk("Q09", "missing", "Answer whether you make personal information available to related organisations (PIPEDA principle 4.8.2(e)).") :
			yes(s, "canRelated") && !v(s, "canRelatedWhat") ? chk("Q09", "missing", "Say what personal information is made available to which related organisations.") : chk("Q09", "ok"));
		checks.push(v(s, "canMeans") ? chk("Q10", "ok") : qc ? chk("Q10", "missing", "Say by what means you collect the information (Quebec section 8).") : chk("Q10", "na", "Required in Quebec; good practice elsewhere."));
		/* Q11: outside Canada */
		var outside = rec.filter(function (r) { var w = v(r, "where"); return w && !canPlace(w); });
		checks.push(!v(s, "canAbroad") ? chk("Q11", "missing", "Answer whether personal information is stored, processed or accessed outside Canada.") :
			yes(s, "canAbroad") && !v(s, "canAbroadWhere") ? chk("Q11", "missing", "Name the countries.") :
			yes(s, "canAbroad") && ab && !v(s, "canAbroadWhy") ? chk("Q11", "missing", "Alberta: say what service providers outside Canada do with the information, and for what purposes (section 6(2)).") :
			no(s, "canAbroad") && outside.length ? chk("Q11", "warn", "These recipients are outside Canada: " + joinList(outside.map(function (r) { return (v(r, "who") || "[recipient]") + " (" + v(r, "where") + ")"; })) + ". Answer Yes and name the countries.") :
			no(s, "canAbroad") ? chk("Q11", "ok") : chk("Q11", "ok", "The notice says that courts, law enforcement and national security authorities abroad can access the information (OPC cross-border guidelines). You stay accountable: protect it by contract (" +
				canCite(s, { fed: "PIPEDA principle 4.1.3", qc: "Quebec sections 17 and 18.3", ab: "Alberta section 5(2)", bc: "British Columbia section 4(2)" }) + ")."));
		if (qc) {
			checks.push(!v(s, "canOutQc") ? chk("Q12", "missing", "Answer whether personal information can be communicated outside Quebec (section 8).") :
				no(s, "canOutQc") && yes(s, "canAbroad") ? chk("Q12", "warn", "Information processed outside Canada is communicated outside Quebec: answer Yes. The notice prints a placeholder until you do.") :
				no(s, "canOutQc") && canOutside(s, ["qc"]).length ? chk("Q12", "warn", "Outside Quebec: " + joinList(canOutside(s, ["qc"])) + ". Communicating information to a person outside Quebec, or entrusting one with it, is communication outside Quebec (sections 8 and 17): answer Yes. The notice prints a placeholder until you do.") :
				chk("Q12", "ok"));
			checks.push(!v(s, "canTech") ? chk("Q13", "missing", "Answer whether you collect information with technology that can identify, locate or profile people (section 8.1).") :
				yes(s, "canTech") && (!v(s, "canTechWhat") || !v(s, "canTechHow")) ? chk("Q13", "missing", "Describe the technology and how people turn its functions on (section 8.1).") :
				yes(s, "canTech") && acts.some(function (a) { return canConsOf(s, a) === "optout"; }) ? chk("Q13", "warn", "Section 8.1 speaks of the means to activate these functions, so a function that identifies, locates or profiles cannot be on until the person turns it on. An opt-out does not fit it: check " +
					joinList(acts.filter(function (a) { return canConsOf(s, a) === "optout"; }).map(function (a) { return v(a, "purpose") || "[purpose]"; })) + ".") :
				yes(s, "canTech") ? chk("Q13", "ok", "Section 8.1 speaks of the means to activate these functions, which is read as requiring them to be off until the person turns them on. Check your settings.") :
				canProfiles(s) || yes(s, "adm") || yes(s, "canAdm") ? chk("Q13", "warn", "You describe profiling, inferred information or automated decisions elsewhere in this notice. Under Quebec's Act, profiling means collecting and using personal information to assess a person's characteristics, such as preferences, interests or behaviour, and technology that does it is covered by section 8.1: answer Yes, describe it and say how people turn it on." + (canProfiles(s) ? " The notice prints a placeholder until you do." : "")) :
				chk("Q13", "ok"));
			/* Q14: automated decisions */
			if (led) {
				if (!yes(s, "adm") && yes(s, "canAdm")) checks.push(chk("Q14", "warn", "For the Canada section you answered that you make decisions based exclusively on automated processing" + (v(s, "canAdmWhat") ? " (" + v(s, "canAdmWhat").replace(/[.]$/, "") + ")" : "") +
					". The main question now has the Quebec meaning (section 12.1): answer it Yes and describe the decision, or set the earlier Canada answer to No."));
				else if (yes(s, "adm")) checks.push(!v(s, "admWhat") ? chk("Q14", "missing", "Describe the decision.") : chk("Q14", "ok", "Give people the information and the review in practice (section 12.1)."));
				else if (no(s, "adm")) checks.push(chk("Q14", "check", "States that no decisions are made exclusively by automated processing. Section 12.1 covers any decision made without a person taking part, whatever its effect, for example automatic approvals, refusals or price changes. Confirm the answer."));
				else checks.push(chk("Q14", "missing", "Answer whether decisions are made exclusively by automated processing."));
			} else {
				if (yes(s, "canAdm")) checks.push(!v(s, "canAdmWhat") && !yes(s, "adm") ? chk("Q14", "missing", "Say which decisions are made exclusively by automated processing.") : chk("Q14", "ok", "Give people the information and the review in practice (section 12.1)."));
				else if (no(s, "canAdm")) checks.push(yes(s, "adm") ? chk("Q14", "warn", "The notice describes a decision based solely on automated processing. If no person takes part in it, it is based exclusively on automated processing under Quebec's Act: answer Yes. The section prints a placeholder until you do.") :
					chk("Q14", "na", "No decisions based exclusively on automated processing."));
				else checks.push(chk("Q14", "missing", "Answer whether, under Quebec's Act, decisions are made exclusively by automated processing."));
			}
		}
		/* Q15: children */
		var cons = canConsentActs(s);
		checks.push(!v(s, "canKids") ? chk("Q15", "missing", "Answer whether you collect personal information of children.") :
			!led && no(s, "canKids") && yes(s, "children") ? chk("Q15", "warn", "You answered that children are a significant part of the audience, but that you collect no personal information of children for Canada. Check the Canada answer.") :
			no(s, "canKids") ? chk("Q15", "na", "No personal information of children.") :
			!v(s, "canKidsHow") ? chk("Q15", "warn", "Say how a parent or guardian gives consent for a child under 13" + (qc ? " (under 14 in Quebec, sections 4.1 and 14)" : "") + ", and how you check it.") :
			chk("Q15", "ok", "For minors who can consent themselves, adapt the consent process to their maturity, and be ready to show it works (OPC consent guidelines)."));
		if (led) {
			var vagueRet = acts.filter(function (a) { return D.LINT.vagueRetention.test(v(a, "retention")); });
			checks.push(!acts.length || acts.some(function (a) { return !v(a, "retention"); }) ? chk("Q16", "warn", "Give how long the information is kept, or the criteria, for every purpose." + (qc ? " It is due on request in Quebec (section 8)." : "") + (fed ? " PIPEDA expects retention rules (principle 4.5)." : "")) :
				vagueRet.length ? chk("Q16", "warn", "\"As long as necessary\" does not tell people how long. Give a period or criteria they can apply.") : chk("Q16", "ok"));
		}
		checks.push(v(s, "rightsContact") || v(s, "canPicContact") ? chk("Q17", "ok", "Rights stated for " + canLawNames(s) + ", with how to make a request.") : chk("Q17", "missing", "Say where people send their requests."));
		checks.push(chk("Q18", "ok", "Stated: a complaint to you first, then " + joinList(canJ(s).map(function (j) { return "the " + j.reg; })) + "."));
		checks.push(!canConsent(s) ? chk("Q19", "na", "No purpose relies on consent.") : !v(s, "withdrawHow") ? chk("Q19", "missing", "Say how people withdraw consent.") : chk("Q19", "ok"));
		var softRisk = acts.filter(function (a) { var c = canConsOf(s, a); return no(a, "canNeed") && (c === "optout" || c === "implied"); });
		checks.push(v(s, "canRisk") && softRisk.length ? chk("Q20", "warn", "You describe a meaningful risk of significant harm. Where it comes from uses people can refuse, the OPC expects express consent for them: check " + joinList(softRisk.map(function (a) { return v(a, "purpose") || "[purpose]"; })) + ".") :
			v(s, "canRisk") ? chk("Q20", "ok") : sens.length ? chk("Q20", "warn", "You handle sensitive information. If a meaningful risk of significant harm remains after your safeguards, the OPC expects you to tell people up front (key element 4).") :
			chk("Q20", "check", "If a meaningful risk of significant harm remains after your safeguards, describe it (OPC key element 4)."));
		if (qc) {
			checks.push(v(s, "canGovUrl") ? chk("Q21", "ok") : chk("Q21", "warn", "Publish detailed information about your governance policies in clear and simple language on your website, and say where (section 3.2)."));
			checks.push(!v(s, "canProspect") ? chk("Q22", "missing", "Answer whether you use personal information for commercial or philanthropic prospecting (section 22).") :
				yes(s, "canProspect") ? chk("Q22", "ok", "Identify yourself and offer withdrawal in each prospecting communication (section 22).") : chk("Q22", "na", "No prospecting."));
		}
		if (yes(s, "further")) checks.push(!v(s, "canFurther") || (v(s, "canFurther") === "law" && !v(s, "canFurtherLaw")) ? chk("Q23", "missing", "Say whether you will ask for consent for the new purpose, or which law requires it (" + canCite(s, { fed: "PIPEDA principle 4.2.4", qc: "Quebec section 12", ab: "Alberta section 8(4)", bc: "British Columbia section 8(4)" }) + ").") :
			chk("Q23", "ok", "Tell people before the new use starts" + (v(s, "canFurther") === "consent" ? ", and get their consent first" : "") + " (OPC principle 6)."));
		else checks.push(chk("Q23", "ok", "Stated: significant changes are notified, with consent obtained before they take effect unless the law requires them."));
		if (qc) checks.push(/fran|french/i.test(v(s, "languages")) ? chk("Q24", "ok") : chk("Q24", "warn", "Publish a French version for people in Quebec. The Charter of the French language requires commercial publications and contracts of adhesion in French (sections 52 and 55), and secondary sources read it to cover website privacy policies."));
		if (led && indirect) {
			var srcs = arr(s, "sources");
			checks.push((srcs.length && srcs.every(function (x) { return v(x, "name"); })) || (yes(s, "unattributable") && v(s, "sourceNature")) ? chk("Q25", "ok", qc ? "In Quebec the source is due on request (section 7)." : "") :
				chk("Q25", "warn", "Name the sources." + (qc ? " In Quebec the source is due on request (section 7)." : "")));
		}
		/* Delivery */
		delivery.push(chk("Q26", "check", "Identify the purposes at or before the time you collect the information, on each form or screen that collects it" + (canAb(s) || canBc(s) ? ", with the name or title of a person who can answer questions about the collection" : "") + "."));
		if (qc) {
			delivery.push(chk("Q27", "check", "Publish this notice on your website as your confidentiality policy, in clear and simple language, with the title and contact information of your person in charge and detailed information on your governance policies, and circulate any amendment (sections 3.1, 3.2 and 8.2)."));
			delivery.push(chk("Q28", "check", "Set the privacy settings of any technological product or service you offer to the public to the highest level of confidentiality by default, without any action by the person. Cookie settings are excluded (section 9.1)."));
			if (yes(s, "canOutQc") || yes(s, "canAbroad") || canOutside(s, ["qc"]).length) delivery.push(chk("Q29", "check", "Before communicating personal information outside Quebec, or entrusting a person outside Quebec with it, carry out a privacy impact assessment and sign a written agreement that reflects it (sections 17 and 18.3)."));
		}
		if (acts.some(function (a) { var c = canConsOf(s, a); return c === "express" || c === "optout"; }))
			delivery.push(chk("Q30", "check", "Ask for consent at the moment it matters, for each purpose separately and in clear and simple language" + (qc ? "; if you ask in writing, present the request separately from any other information, and help people understand the scope of the consent if they ask (Quebec section 14)" : "") + ". An opt-out needs a notice the person can understand and a reasonable chance to decline."));
		if (qc && yes(s, led ? "adm" : "canAdm")) delivery.push(chk("Q31", "check", "When you communicate a decision based exclusively on automated processing, tell the person it was made that way, no later than at that time (section 12.1)."));
		if (ab && yes(s, "canAbroad")) delivery.push(chk("Q32", "check", "Give the Alberta notice about service providers outside Canada before or at the time you collect the information or transfer it to them (section 13.1)."));
		return { checks: checks, delivery: delivery };
	}

	/* A document led by Canada's laws. */
	function canLead(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]";
		var aud = v(s, "audience");
		var title = AUD_TITLE[aud] || (v(s, "audienceOther") ? "Privacy notice for " + lcFirst(v(s, "audienceOther")) : "Privacy notice");
		var acts = pnActs(s), direct = pnSourceDirect(s), indirect = pnSourceIndirect(s), qc = canQc(s);
		var meta = [ctrl];
		if (v(s, "version")) meta.push("Version " + v(s, "version"));
		if (v(s, "effective")) meta.push("Effective " + fmtDate(v(s, "effective")));
		var num = {}, c = 3;
		if (indirect) num.source = c++;
		num.recip = c++; num.abroad = c++;
		if (qc || yes(s, "adm") || yes(s, "profiling")) num.adm = c++;
		if (yes(s, "canKids")) num.kids = c++;
		num.rights = c++;
		if (canConsent(s)) num.consent = c++;
		num.complaints = c++;
		if (qc) num.gov = c++;
		if (inReg(s, "in")) num.in = c++;
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

		/* First layer: the four key elements of the OPC consent guidelines up front. */
		var first = [{ k: "p", x: ctrl + " is responsible for the personal information described in this notice. Questions and complaints go to the person accountable for our privacy practices: " + canPic(s) + ", " + stop(canPicContact(s)) }];
		if (acts.length) first.push({ k: "p", x: "What we collect, and why:" }, { k: "ul", items: acts.map(function (a) { return { b: (v(a, "purpose") || "[purpose]") + ":", x: stop(v(a, "data") || "[personal information]") }; }) });
		var rec = arr(s, "recipients");
		first.push({ k: "p", x: rec.length ? "Who we share it with: " + stop(joinList(rec.map(function (r) { return v(r, "who") || "[recipient]"; }))) + " Section " + num.recip + " says what for." :
			"Who we share it with: [the parties or types of parties you share it with]." });
		var opt = acts.filter(function (a) { return no(a, "canNeed") && canConsOf(s, a) !== "none"; });
		if (opt.length) first.push({ k: "p", x: "Optional uses you can refuse: " + stop(joinList(opt.map(function (a) { return lcFirst(v(a, "purpose") || "[purpose]"); }))) });
		if (v(s, "canRisk")) first.push({ k: "p", x: "Risks you should know about: " + stop(v(s, "canRisk")) });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		if (yes(s, "canAbroad")) first.push({ k: "p", x: "Your information is processed outside Canada, where authorities can access it under local law. Section " + num.abroad + " explains." });
		first.push({ k: "p", x: "You can ask to access and correct your information" + (qc ? ", and in Quebec to receive it in a structured format" : "") + ", withdraw your consent, and complain to us and to " +
			joinList(canJ(s).map(function (j) { return "the " + j.reg; })) + ". Sections " + num.rights + " and " + num.complaints + " explain how." });
		if (num.in) first.push({ k: "p", x: "If you are in India, section " + num.in + " also applies to you. " + (inSdf(s) ? "Our Data Protection Officer: " : "Questions about your personal data: ") + inWho(s) + ", " + stop(inWhoContact(s)) });
		if (num.cn) first.push({ k: "p", x: "If you are in mainland China, section " + num.cn + " also applies to you." + (yes(s, "cnPipo") ? " Our personal information protection officer: " + (v(s, "cnPipoName") || "[name or title]") + ", " + stop(v(s, "cnPipoContact") || "[contact details]") : "") });
		if (num.jp) first.push({ k: "p", x: "If you are in Japan, section " + num.jp + " also applies to you." });
		if (num.kr) first.push({ k: "p", x: "If you are in Korea, section " + num.kr + " also applies to you." });
		if (num.sg) first.push({ k: "p", x: sgPointer(s, num.sg) });
		if (num.au) first.push({ k: "p", x: auPointer(s, num.au) });
		if (num.za) first.push({ k: "p", x: zaPointer(s, num.za) });
		if (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });
		if (num.us) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + num.us + " also applies to you." });
		blocks.push({ k: "box", title: "In short", blocks: first });

		/* 1. Who is responsible (PIPEDA 4.1, 4.8.2(a); Quebec 3.1; Alberta 13(1)(b); BC 4(5)) */
		blocks.push({ k: "h2", x: "1. Who is responsible for your personal information" });
		var who = [ctrl];
		if (v(s, "ctrlAddress")) who.push(v(s, "ctrlAddress").replace(/\n+/g, ", "));
		blocks.push({ k: "p", x: stop(who.join(", ")) });
		var chans = [];
		if (v(s, "ctrlEmail")) chans.push({ b: "Email:", x: v(s, "ctrlEmail") });
		if (v(s, "ctrlPhone")) chans.push({ b: "Telephone:", x: v(s, "ctrlPhone") });
		if (chans.length) blocks.push({ k: "ul", items: chans });
		Array.prototype.push.apply(blocks, canPicBody(s));
		if (yes(s, "joint")) {
			var ja = acts.filter(function (a) { return yes(a, "jointP"); });
			blocks.push({ k: "p", x: "For " + (ja.length ? joinList(ja.map(function (a) { return lcFirst(v(a, "purpose") || "[purpose]"); })) : "[mark the purposes concerned]") + " we decide together with " + (v(s, "jointWho") || "[other organisation]") + ". " +
				stop(v(s, "jointEssence") || "[essence of the arrangement]") + " Contact " + stop(v(s, "jointContact") || "[contact point]") });
		}

		/* 2. Purposes, information and choices (PIPEDA 4.2 to 4.5; Quebec 8; OPC key elements) */
		blocks.push({ k: "h2", x: "2. What we collect, why, and your choices" });
		Array.prototype.push.apply(blocks, canTable(s, true));
		Array.prototype.push.apply(blocks, canAboutBody(s));
		if (yes(s, "inferred")) blocks.push({ k: "p", x: "We also create information about you from the information above: " + stop(v(s, "inferredWhat") || "[what is inferred, and from what]") });
		if (v(s, "canRisk")) { blocks.push({ k: "h3", x: "Risks you should know about" }); blocks.push({ k: "p", x: stop(v(s, "canRisk")) }); }

		if (num.source) {
			blocks.push({ k: "h2", x: num.source + ". Where your information comes from" });
			var src = arr(s, "sources");
			if (src.length) blocks.push({ k: "ul", items: src.map(function (x) {
				var ai = v(x, "usedFor"), a = ai !== "" ? acts[+ai] : null;
				return { b: (v(x, "name") || "[source]") + ":", x: (v(x, "what") || "[categories of information]") + (yes(x, "pub") ? " (a publicly accessible source)" : "") +
					", used for " + (a ? lcFirst(v(a, "purpose") || "[purpose]") : "[purpose]") + ". Your choices and retention as for that purpose in section 2." };
			}) });
			if (yes(s, "unattributable")) blocks.push({ k: "p", x: "Where we cannot attribute a record to a single source, the information comes from " + stop(v(s, "sourceNature") || "[nature of the sources and type of organisation]") });
			else if (!src.length) blocks.push({ k: "p", x: "[Name each source of the information, and what you get from it.]" });
		}
		blocks.push({ k: "h2", x: num.recip + ". Who we share your information with, and why" });
		blocks.push(rec.length ? { k: "table", head: ["Recipient", "Role", "What for", "Location"],
			rows: rec.map(function (r) { return [v(r, "who") || "[recipient]", CAN_ROLE[v(r, "role")] || "[role]", v(r, "why") || "[what for]", v(r, "where") || "[location]"]; }) } :
			{ k: "p", x: "[List the parties you share personal information with, including service providers that process it for you.]" });
		if (rec.some(function (r) { return v(r, "role") === "controller"; })) blocks.push({ k: "p", x: "Recipients marked \"Uses it for its own purposes\" handle your information under their own privacy policies." });
		Array.prototype.push.apply(blocks, canRelatedBody(s));
		blocks.push({ k: "h2", x: num.abroad + ". Where your information is processed" });
		Array.prototype.push.apply(blocks, canAbroadBody(s));
		if (num.adm) {
			blocks.push({ k: "h2", x: num.adm + ". " + (qc ? "Automated decisions and technology that identifies, locates or profiles you" : "Automated decisions") });
			Array.prototype.push.apply(blocks, canAdmBody(s, true));
		}
		if (num.kids) { blocks.push({ k: "h2", x: num.kids + ". Children" }); Array.prototype.push.apply(blocks, canKidsBody(s)); }
		blocks.push({ k: "h2", x: num.rights + ". Your rights" });
		Array.prototype.push.apply(blocks, canRightsBody(s, qc && yes(s, "adm"), true));
		if (num.consent) { blocks.push({ k: "h2", x: num.consent + ". Withdrawing consent" }); Array.prototype.push.apply(blocks, canConsentBody(s)); }
		blocks.push({ k: "h2", x: num.complaints + ". Complaints" });
		Array.prototype.push.apply(blocks, canComplaintBody(s));
		if (num.gov) { blocks.push({ k: "h2", x: num.gov + ". Our governance policies" }); Array.prototype.push.apply(blocks, canGovBody(s)); }

		var canSecs = [num.rights, num.consent, num.complaints].filter(Boolean).map(String);
		var only = canSecs.length ? " " + (canSecs.length > 1 ? "Sections " : "Section ") + joinList(canSecs) + (canSecs.length > 1 ? " apply" : " applies") + " to you only where Canadian law applies to our handling of your personal information." : "";
		var inRes = null;
		if (num.in) {
			blocks.push({ k: "h2", x: num.in + ". Additional information for people in India" });
			Array.prototype.push.apply(blocks, inSection(s, canSecs, "Canadian law"));
			inRes = inChecks(s, false);
		}
		var cnRes = null;
		if (num.cn) {
			blocks.push({ k: "h2", x: num.cn + ". Additional information for people in China" });
			Array.prototype.push.apply(blocks, cnSection(s, canSecs, "Canadian law"));
			cnRes = cnChecks(s, false);
		}
		var jpRes = null;
		if (num.jp) {
			blocks.push({ k: "h2", x: num.jp + ". Additional information for people in Japan" });
			Array.prototype.push.apply(blocks, jpSection(s, canSecs, "Canadian law"));
			jpRes = jpChecks(s, false);
		}
		var krRes = null;
		if (num.kr) {
			blocks.push({ k: "h2", x: num.kr + ". Additional information for people in Korea" });
			Array.prototype.push.apply(blocks, krSection(s, canSecs, "Canadian law"));
			krRes = krChecks(s, false);
		}
		var sgRes = null;
		if (num.sg) {
			blocks.push({ k: "h2", x: num.sg + ". " + sgHead(s) });
			Array.prototype.push.apply(blocks, sgSection(s, canSecs, "Canadian law"));
			sgRes = sgChecks(s, false);
		}
		var auRes = null;
		if (num.au) {
			blocks.push({ k: "h2", x: num.au + ". " + auHead(s) });
			Array.prototype.push.apply(blocks, auSection(s, canSecs, "Canadian law"));
			auRes = auChecks(s, false);
		}
		var zaRes = null;
		if (num.za) {
			blocks.push({ k: "h2", x: num.za + ". " + zaHead(s) });
			Array.prototype.push.apply(blocks, zaSection(s, canSecs, "Canadian law"));
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
		if (yes(s, "further")) blocks.push(canFurtherBox(s));
		blocks.push({ k: "p", x: CAN_CHANGES + " We do not expect you to check this page for updates." });
		if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });

		var cr = canChecks(s, true), checks = cr.checks, delivery = cr.delivery;
		if (yes(s, "joint")) checks.push(v(s, "jointWho") && v(s, "jointEssence") && v(s, "jointContact") && acts.some(function (a) { return yes(a, "jointP"); }) ? chk("P19", "ok", "Good practice under the Canadian laws.", undefined, "WP260 44 (good practice)") :
			chk("P19", "warn", "Name the other organisation, what each does and the contact point.", undefined, "WP260 44 (good practice)"));
		checks.push(v(s, "consequences") ? chk("P21", "ok", "", undefined, "WP260 10, 36; OPC key elements (good practice)") : chk("P21", "warn", "Empty. Fine only if nothing here would surprise people. The OPC asks you to highlight purposes people would not expect (key element 3).", undefined, "WP260 10, 36; OPC key elements (good practice)"));
		if (inRes) { Array.prototype.push.apply(checks, inRes.checks); Array.prototype.push.apply(delivery, inRes.delivery); }
		if (cnRes) { Array.prototype.push.apply(checks, cnRes.checks); Array.prototype.push.apply(delivery, cnRes.delivery); }
		if (jpRes) { Array.prototype.push.apply(checks, jpRes.checks); Array.prototype.push.apply(delivery, jpRes.delivery); }
		if (krRes) { Array.prototype.push.apply(checks, krRes.checks); Array.prototype.push.apply(delivery, krRes.delivery); }
		if (sgRes) { Array.prototype.push.apply(checks, sgRes.checks); Array.prototype.push.apply(delivery, sgRes.delivery); }
		if (auRes) { Array.prototype.push.apply(checks, auRes.checks); Array.prototype.push.apply(delivery, auRes.delivery); }
		if (zaRes) { Array.prototype.push.apply(checks, zaRes.checks); Array.prototype.push.apply(delivery, zaRes.delivery); }
		if (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }
		if (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(delivery, usRes.delivery); }
		var lintHits = lintText(blocks);
		checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "PIPEDA s. 6.1; OPC consent guidelines; WP260 13") :
			chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "PIPEDA s. 6.1; OPC consent guidelines; WP260 13"));
		/* The WP260 delivery points remain good practice under the Canadian laws. */
		var gp = [];
		if (direct) gp.push(chk("D01", "check", "Give the notice when the information is collected: before a form is submitted, before payment, before sign-up. Mark required fields on every form.", "Timing: when the data is collected"));
		gp.push(chk("D03", "check", "Read it as a member of the audience would. The OPC asks you to consider the consumer's perspective, and consent is valid only if people understand it (PIPEDA s. 6.1)."));
		gp.push(chk("D04", "check", "Publish it on its own page, not inside terms and conditions."));
		if (has(s, "channel", "web")) gp.push(chk("D05", "check", "Link it from every page under a common term such as \"Privacy\", and from every form that collects information."));
		if (has(s, "channel", "app")) gp.push(chk("D06", "check", "Show it in the app store listing and keep it within two taps inside the app."));
		gp.push(chk("D07", "check", has(s, "channel", "phone") || has(s, "channel", "paper") || has(s, "channel", "device") ? "Offline, give the \"In short\" content first and point to the full notice." : "Use the \"In short\" box as the first layer and keep it consistent with the full text."));
		gp.push(chk("D08", "check", "Keep the full notice available as one document."));
		if (v(s, "languages")) gp.push(chk("D10", "check", "Check each translation reads naturally in " + v(s, "languages") + "."));
		gp.push(chk("D12", "check", "When this notice changes, tell people directly, highlighting what changed, before the change takes effect."));
		gp.push(chk("D14", "check", "If you add icons, keep them alongside the text, never instead of it."));
		gp.forEach(function (r) { var m = D.MATRIX[r.id]; if (m) r.s = m.s.replace(/^Art\.[^;]*;\s*/, "") + " (good practice)"; });
		delivery = gp.concat(delivery);
		return { title: title, file: slug(ctrl + " " + title), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(delivery), docLabel: "Notice" };
	}

