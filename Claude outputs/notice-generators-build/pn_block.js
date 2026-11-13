	/* ===================================================== PRIVACY NOTICE === */

	var AUDIENCES = [
		{ v: "visitor", l: "Website or app users" },
		{ v: "client", l: "Client and supplier contacts" },
		{ v: "applicant", l: "Job applicants" },
		{ v: "employee", l: "Employees and workers" },
		{ v: "other", l: "Other" }
	];
	var AUD_TITLE = { visitor: "Privacy notice for website and app users", client: "Privacy notice for client and supplier contacts", applicant: "Privacy notice for job applicants", employee: "Privacy notice for employees and workers" };
	var REQUIRED = [
		{ v: "optional", l: "Optional" },
		{ v: "contract", l: "Needed to enter into or perform a contract" },
		{ v: "statutory", l: "Required by law" },
		{ v: "contractual", l: "A contractual requirement" }
	];
	var ROLES = [
		{ v: "processor", l: "Service provider acting for us (processor)" },
		{ v: "controller", l: "Independent controller" },
		{ v: "joint", l: "Joint controller" },
		{ v: "authority", l: "Public authority" }
	];
	var ROLE_TXT = { processor: "Service provider acting on our instructions", controller: "Independent controller", joint: "Joint controller", authority: "Public authority" };

	/* Regimes (matrix Parts J to O). The first regime ticked, in the order EU, UK,
	   Switzerland, Brazil, Canada, India, China, Japan, Korea, Singapore, Australia, South Africa, California, other US states, sets the main text; every other one adds a section of its own. Answers saved before regimes
	   existed have none and read as the EU GDPR, which is what they were written for. Each law
	   keeps its own fields (representative, transfers), so changing which law leads never moves
	   an answer from one law to another. */
	var REG_ORDER = ["eu", "uk", "ch", "br", "can", "in", "cn", "jp", "kr", "sg", "au", "za", "ca", "us"];
	/* California and the other US states lead with their own structure: no GDPR sections. */
	function usStyle(s) { var p = prim(s); return p === "ca" || p === "us"; }
	function regs(s) { var r = arr(s, "regimes").filter(function (x) { return REG_ORDER.indexOf(x) !== -1; }); return r.length ? r : ["eu"]; }
	function inReg(s, x) { return regs(s).indexOf(x) !== -1; }
	function prim(s) { var r = regs(s); for (var i = 0; i < REG_ORDER.length; i++) { if (r.indexOf(REG_ORDER[i]) !== -1) return REG_ORDER[i]; } return "eu"; }
	function lawify(t, p) { return p === "uk" ? String(t).replace(/(?:UK )?\bGDPR\b/g, "UK GDPR") : t; }

	/* Legal bases. The UK adds Article 6(1)(ea), recognised legitimate interests. */
	var BASIS_EA = { id: "ea", label: "Recognised legitimate interest (Art. 6(1)(ea))", short: "a recognised legitimate interest", art: "Article 6(1)(ea) UK GDPR" };
	var BASES_UK = D.BASES.slice(0, 5).concat([BASIS_EA], D.BASES.slice(5));
	function basesFor(s) { return prim(s) === "uk" ? BASES_UK : D.BASES; }
	function basisOpts(s) { return basesFor(s).map(function (b) { return { v: b.id, l: b.label }; }); }
	/* A basis only counts under the law that leads: no GDPR basis in a Swiss-led notice, and (ea)
	   only in a UK-led one. A stale answer left after switching law is ignored, not printed. */
	function basisOf(s, a) {
		var b = v(a, "basis"), p = prim(s);
		if (!gdprLed(s) || (b === "ea" && p !== "uk")) return "";
		return b;
	}
	function art9Of(s, a) { return gdprLed(s) ? v(a, "art9") : ""; }
	/* The legal basis of a planned new purpose, under the same rules (review R15). */
	function furtherBasisOf(s) { return yes(s, "further") ? basisOf(s, { basis: v(s, "furtherBasis") }) : ""; }
	/* Fields whose answer is written for one law keep one copy per leading law (review R02, R08):
	   restriction, restrictionWhat, furtherCompat; per purpose lawRef. */
	function lf(s, base) { var p = prim(s); return p === "eu" ? base : base + (p === "uk" ? "Uk" : p === "ch" ? "Ch" : p === "br" ? "Br" : p === "can" ? "Can" : p === "in" ? "In" : p === "cn" ? "Cn" : p === "jp" ? "Jp" : p === "kr" ? "Kr" : p === "sg" ? "Sg" : p === "au" ? "Au" : p === "za" ? "Za" : p === "ca" ? "Ca" : "Us"); }
	/* The GDPR family leads (EU or UK): the notice has legal bases, Article 21 and so on. */
	function gdprLed(s) { var p = prim(s); return p === "eu" || p === "uk"; }
	function transferLaws(s) { return regs(s).filter(function (x) { return x !== "ca" && x !== "us"; }); }
	/* "the United Kingdom", "the Netherlands" (review R22). */
	function country(c) { return /^(united |netherlands|czech republic|philippines|bahamas|gambia|maldives)/i.test(c) ? "the " + c : c; }
	function sameName(a, b) { return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase() && !!String(a || "").trim(); }
	function crimOf(s, a) { return gdprLed(s) && yes(a, "crim"); }

	function pnSourceIndirect(s) { return v(s, "source") === "indirect" || v(s, "source") === "both"; }
	function pnSourceDirect(s) { return v(s, "source") === "direct" || v(s, "source") === "both" || !v(s, "source"); }
	function pnActs(s) { return arr(s, "acts"); }
	function pnUsesBasis(s, b) { return pnActs(s).some(function (a) { return basisOf(s, a) === b; }) || furtherBasisOf(s) === b; }
	function pnConsent(s) {
		if (prim(s) === "ch") return pnActs(s).some(function (a) { return v(a, "chGround") === "consent"; });
		if (prim(s) === "br") return brConsent(s);
		if (prim(s) === "can") return canConsent(s);
		if (prim(s) === "in") return inConsent(s);
		if (prim(s) === "cn") return cnConsent(s);
		if (prim(s) === "jp") return false; /* the APPI has no general rule on withdrawing consent */
		if (prim(s) === "kr") return krConsent(s);
		if (prim(s) === "sg") return sgConsent(s);
		if (prim(s) === "au") return auConsent(s);
		if (prim(s) === "za") return zaConsent(s);
		if (usStyle(s)) return false;
		return pnUsesBasis(s, "a") || pnActs(s).some(function (a) { return art9Of(s, a) === "a"; }) ||
			(yes(s, "adm") && inReg(s, "eu") && v(s, "admBasis") === "consent") ||
			(yes(s, "adm") && inReg(s, "uk") && yes(s, "admSpecial") && v(s, "ukAdmCond") === "consent");
	}
	function pnObject(s) { return gdprLed(s) && (pnUsesBasis(s, "e") || pnUsesBasis(s, "f") || pnUsesBasis(s, "ea") || yes(s, "marketing")); }
	function pnPort(s) { return gdprLed(s) && (pnUsesBasis(s, "a") || pnUsesBasis(s, "b") || pnActs(s).some(function (a) { return art9Of(s, a) === "a"; })); }
	/* Recognised legitimate interests: per purpose in a UK-led notice; in an EU-led notice the UK
	   section lists the purposes for which UK data rests on one instead. */
	function ukRliItems(s) {
		var acts = pnActs(s);
		if (prim(s) === "uk") return acts.map(function (a, i) { return { a: a, i: i }; }).filter(function (x) { return basisOf(s, x.a) === "ea"; })
			.map(function (x) { return { purpose: v(x.a, "purpose"), cond: v(x.a, "rliCond"), linked: true, act: String(x.i) }; })
			.concat(furtherBasisOf(s) === "ea" ? [{ purpose: v(s, "furtherWhat"), cond: v(s, "furtherRliCond"), linked: true, act: "further" }] : []);
		if (prim(s) === "eu" && inReg(s, "uk") && yes(s, "ukRliUse")) return arr(s, "ukRli").map(function (r) {
			var i = v(r, "act"), a = i !== "" ? acts[+i] : null;
			return { purpose: a ? v(a, "purpose") : "", cond: v(r, "cond"), linked: !!a, act: i };
		});
		return [];
	}
	/* Article 22B(4) UK GDPR: no solely automated significant decision where the processing for it
	   relies on a recognised legitimate interest. "linked" when a purpose marked as feeding the
	   decision is an (ea) purpose; "unknown" when (ea) is used but the feeding purposes are not marked. */
	function ukAdmRli(s) {
		var items = ukRliItems(s);
		if (!items.length || !yes(s, "adm")) return "";
		var fed = arr(s, "admActs");
		if (!fed.length) return "unknown";
		return items.some(function (r) { return r.act !== "further" && fed.indexOf(r.act) !== -1; }) ? "linked" : "";
	}
	function notEstablished(s) {
		return (inReg(s, "eu") && no(s, "euEstablished")) || (inReg(s, "uk") && no(s, "ukEstablished")) || (inReg(s, "ch") && no(s, "chEstablished")) || (inReg(s, "br") && no(s, "brEstablished"));
	}
	function actOpts(s) { return pnActs(s).map(function (a, i) { return { v: String(i), l: v(a, "purpose") || "Purpose " + (i + 1) }; }); }
	function lbl(list, val) { for (var i = 0; i < list.length; i++) { if (list[i].v === val) return list[i]; } return null; }

	/* Transfer blocks, one builder per law. Each reads only its own law's fields. */
	function euTransferBlocks(s) {
		var out = [];
		if (no(s, "euEstablished")) out.push({ k: "p", x: "We are established in " + country(v(s, "ctrlCountry") || "[country]") + ", outside the European Economic Area, and process your data there." });
		if (yes(s, "transfers")) {
			var tr = arr(s, "trows");
			if (!tr.length) out.push({ k: "p", x: "[Add each transfer.]" });
			tr.forEach(function (t) {
				var mid = v(t, "mech"), m = find(D.TRANSFER_MECH, mid), body;
				var where = v(t, "country") || "[country or international organisation]";
				var NOADQ = "This transfer is not covered by an adequacy decision of the European Commission.";
				if (mid === "adequacy") body = "This transfer is covered by an adequacy decision of the European Commission (Article 45 GDPR)" + (v(t, "adeqScope") ? ", which covers " + lcFirst(stop(v(t, "adeqScope"))) : ".");
				else if (mid === "other46") { var i46 = lbl(D.ART46_OTHER, v(t, "instr46")); body = NOADQ + " It is covered by " + (i46 ? i46.t : "[the Article 46 instrument]") + "."; }
				else if (mid === "derog") {
					var d49 = lbl(D.ART49, v(t, "derogPt"));
					body = NOADQ + " No Article 46 safeguard applies either. We transfer only because " + (d49 ? d49.t : "[the derogation relied on]") + ".";
					if (v(t, "derogPt") === "a") body += " The risk for you is that, without an adequacy decision or safeguards, your data is not guaranteed the protection EU law requires, for example against access by public authorities, and your rights can be harder to enforce there.";
				}
				else if (mid === "compelling") body = NOADQ + " No other mechanism or derogation is available. The transfer is not repetitive, concerns a limited number of people, and is necessary for our compelling legitimate interest in " +
					lcFirst(v(t, "cInterest") || "[the interest]") + ", which your interests, rights and freedoms do not override (Article 49(1), second subparagraph, GDPR). Our safeguards: " + stop(v(t, "cSafeguards") || "[safeguards]");
				else body = m ? m.text : "[mechanism]";
				var line = (v(t, "recipient") || "[recipient]") + ", " + where + ". " + body;
				if ((m && m.needsCopy) || mid === "compelling") line += " You can obtain a copy of the safeguards " + stop(v(t, "copy") || "[where or how]");
				out.push({ k: "p", x: line });
			});
		} else if (no(s, "transfers")) {
			if (!no(s, "euEstablished")) out.push({ k: "p", x: "We do not transfer your personal data outside the European Economic Area." });
		} else {
			out.push({ k: "p", x: "[Say whether data is transferred outside the EEA.]" });
		}
		return out;
	}
	function ukTransferBlocks(s) {
		var out = [];
		if (no(s, "ukEstablished")) out.push({ k: "p", x: "We are established in " + country(v(s, "ctrlCountry") || "[country]") + ", outside the United Kingdom, and process your data there." });
		if (yes(s, "ukTransfers")) {
			var tr = arr(s, "ukTrows");
			if (!tr.length) out.push({ k: "p", x: "[Add each transfer.]" });
			tr.forEach(function (t) {
				var mid = v(t, "mech"), m = find(D.TRANSFER_MECH_UK, mid), body;
				var where = v(t, "country") || "[country or international organisation]";
				var NOREG = "This transfer is not approved by regulations under Article 45A UK GDPR.";
				if (mid === "regs") body = "This transfer is approved by regulations made under Article 45A UK GDPR" + (v(t, "adeqScope") ? ", which cover " + lcFirst(stop(v(t, "adeqScope"))) : ".");
				else if (mid === "other46") { var i46 = lbl(D.ART46_OTHER_UK, v(t, "instr46")); body = NOREG + " It is covered by " + (i46 ? i46.t : "[the Article 46 safeguard]") + "."; }
				else if (mid === "derog") {
					var d49 = lbl(D.ART49_UK, v(t, "derogPt"));
					body = NOREG + " No Article 46 safeguard applies either. We transfer only because " + (d49 ? d49.t : "[the derogation relied on]") + ".";
					if (v(t, "derogPt") === "a") body += " The risk for you is that, without approval by regulations or safeguards, your data is not guaranteed the protection UK law requires, for example against access by public authorities, and your rights can be harder to enforce there.";
				}
				else if (mid === "compelling") body = NOREG + " No other mechanism or derogation is available. The transfer is not repetitive, concerns a limited number of people, and is necessary for our compelling legitimate interest in " +
					lcFirst(v(t, "cInterest") || "[the interest]") + ", which your interests, rights and freedoms do not override (Article 49(1), second subparagraph, UK GDPR). Our safeguards: " + stop(v(t, "cSafeguards") || "[safeguards]");
				else body = m ? NOREG + " " + m.text : "[mechanism]";
				var line = (v(t, "recipient") || "[recipient]") + ", " + where + ". " + body;
				if ((m && m.needsCopy) || mid === "compelling") line += " You can obtain a copy of the safeguards " + stop(v(t, "copy") || "[where or how]");
				out.push({ k: "p", x: line });
			});
		} else if (no(s, "ukTransfers")) {
			if (!no(s, "ukEstablished")) out.push({ k: "p", x: "We do not transfer your personal data outside the United Kingdom." });
		} else {
			out.push({ k: "p", x: "[Say whether data is transferred outside the United Kingdom.]" });
		}
		return out;
	}
	function chBasisText(t) {
		var m = v(t, "mech");
		if (m === "adequacy") return "Listed by the Federal Council as providing adequate protection (Article 16(1) FADP; Annex 1 of the Data Protection Ordinance)" + (v(t, "adeqScope") ? ", for " + lcFirst(v(t, "adeqScope")).replace(/[.]$/, "") : "");
		if (m === "guarantee") { var g = lbl(D.CH_GUAR, v(t, "guar")); return g ? ucFirst(g.t) : "[the guarantee relied on]"; }
		if (m === "exception") { var e = lbl(D.CH_EXC, v(t, "exc")); return e ? "No adequate protection or guarantee. We disclose the data only because " + e.t : "[the exception relied on]"; }
		return "[adequacy, guarantee or exception]";
	}
	function chTransferBlocks(s) {
		var out = [];
		if (no(s, "chEstablished")) out.push({ k: "p", x: "We are established in " + country(v(s, "ctrlCountry") || "[country]") + ", outside Switzerland, and process your data there." });
		if (yes(s, "chAbroad")) {
			var tr = arr(s, "chTrows");
			if (!tr.length) out.push({ k: "p", x: "[Add each country or international body.]" });
			else {
				out.push({ k: "p", x: "We disclose personal data to recipients in the following countries or international bodies outside Switzerland:" });
				out.push({ k: "table", head: ["Country or international body", "Recipient", "Why this is permitted"],
					rows: tr.map(function (t) { return [v(t, "country") || "[country]", v(t, "recipient") || "[recipient]", chBasisText(t)]; }) });
			}
		} else if (no(s, "chAbroad")) {
			if (!no(s, "chEstablished")) out.push({ k: "p", x: "We do not disclose your personal data outside Switzerland." });
		} else {
			out.push({ k: "p", x: "[Say whether data is disclosed outside Switzerland, including to the EU and the EEA.]" });
		}
		return out;
	}

	/* Automated decisions, one builder per law. */
	function admCore(s, opening) {
		return [
			{ k: "p", x: opening + stop(v(s, "admWhat") || "[the decision]") },
			{ k: "p", x: "How it works: " + stop(v(s, "admLogic") || "[meaningful information about the logic involved]") },
			{ k: "p", x: "What it means for you: " + stop(v(s, "admEffect") || "[significance and envisaged consequences]") }
		];
	}
	function ukAdmSafeguards(s, nr) {
		var out = [];
		if (yes(s, "admSpecial")) {
			var c = lbl(D.UK_ADM_SPECIAL, v(s, "ukAdmCond"));
			out.push({ k: "p", x: "The decision uses special category data. We take it this way only because " + (c && c.t ? c.t : "[the Article 22B condition]") + "." });
		}
		if (ukAdmRli(s) === "linked") out.push({ k: "p", x: "[Article 22B(4) UK GDPR: this decision cannot be taken solely by automated means while the processing behind it relies on a recognised legitimate interest. Add meaningful human involvement, or use another legal basis for that processing, before publishing.]" });
		else out.push({ k: "p", x: "We tell you when we have taken such a decision about you. You can make representations about it, obtain human intervention from us, and contest it (Article 22C UK GDPR). Use the contact details in section " + nr + "." });
		return out;
	}
	function chAdmRight(s, nr) {
		var e = v(s, "chAdmExc");
		if (e === "consent") return { k: "p", x: "We take this decision automatically only where you have explicitly consented to that (Article 21(3)(b) FADP). If you have not consented, you can ask to express your point of view and ask for the decision to be reviewed by a person (Article 21(2) FADP). Use the contact details in section " + nr + "." };
		if (e === "contract") return { k: "p", x: "If the decision does not grant your request in full, you can ask to express your point of view and ask for the decision to be reviewed by a person (Article 21(2) and (3)(a) FADP). Use the contact details in section " + nr + "." };
		return { k: "p", x: "You can ask to express your point of view, and ask for the decision to be reviewed by a person (Article 21(2) FADP). Use the contact details in section " + nr + "." };
	}

	function ukComplaintText(s) {
		return "If you think there is an infringement of the UK GDPR in connection with your personal data, you can complain to us (section 164A of the Data Protection Act 2018): " +
			stop(v(s, "ukComplaintRoute") || "[how to complain to us]") + " We acknowledge your complaint within 30 days of receiving it, look into it, keep you informed of progress and tell you the outcome without undue delay. " +
			"You can also complain to the Information Commission, the UK regulator known as the ICO (section 165 of the Data Protection Act 2018).";
	}
	var CH_COMPLAINT = "You can report a suspected breach of data protection rules to the Federal Data Protection and Information Commissioner (FDPIC). If you do, the FDPIC tells you what steps it took and the result of any investigation it opens (Article 49(1) and (4) FADP). You can also bring a claim before the civil courts (Article 32 FADP).";
	var UK_RIGHTS_TIMING = "We reply without undue delay and within one month. The month starts when we receive your request or, if later, when we receive information we asked for to confirm your identity, or a fee where we charge one. Where necessary because of the complexity or number of your requests, we can extend this by two further months. If we do, we tell you within the first month and explain why (Articles 12(3) and 12A UK GDPR). If we need more information to identify the information or processing an access request relates to, we ask you, and the time until you reply does not count (Article 12A(5) UK GDPR).";


	/* ---------------------------------------------------- California (matrix Part L) ---
	   The CCPA works by statutory categories of personal information, not by purposes and
	   legal bases, and asks for a privacy policy that contains a notice at collection. The
	   California text is built here, once, and used two ways: as the whole document when
	   California is the only law ticked, or as an "Additional information for California
	   residents" section when another law leads. Its answers live in their own fields.
	   Reviewed independently on 12 November 2026 (review-2026-11-12-california, R01 to R25). */
	function caCats(s) { return arr(s, "caCats"); }
	function caCat(r) { return lbl(D.CA_CATS, v(r, "cat")); }
	/* Selling or sharing now (the notice at collection, the opt-out duties) ... */
	function caSells(s) { return caCats(s).some(function (r) { return yes(r, "sold") || yes(r, "shared"); }); }
	function caNoSell(s) { var c = caCats(s); return c.length > 0 && c.every(function (r) { return no(r, "sold") && no(r, "shared"); }); }
	/* ... and in the past 12 months (the privacy policy's look-back, 7011(e)(1)(D)) (review R05). */
	function caSold12(r) { return yes(r, "past12"); }
	function caNo12(s) { var c = caCats(s); return c.length > 0 && c.every(function (r) { return no(r, "past12"); }); }
	function caSpiRows(s) { return caCats(s).filter(function (r) { var c = caCat(r); return c && c.spi; }); }
	function caLimit(s) { return caSpiRows(s).length > 0 && yes(s, "caSpiBeyond"); }
	/* Only an explicit "no exception" grants the ADMT opt-out (review R11). */
	function caAdmtOptOut(s) { return yes(s, "caAdmt") && v(s, "caAdmtExc") === "none"; }
	function caCatName(r) { var c = caCat(r); return c ? c.n : "[category]"; }
	function caSoldTxt(r) { return yes(r, "sold") && yes(r, "shared") ? "Sold and shared" : yes(r, "sold") ? "Sold" : yes(r, "shared") ? "Shared" : no(r, "sold") && no(r, "shared") ? "Neither" : "[say whether sold or shared]"; }
	function caOffline(s) { return has(s, "channel", "paper") || has(s, "channel", "phone") || has(s, "channel", "device"); }
	function orList(a) { a = a.filter(Boolean); return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " or " + a[a.length - 1]; }
	function secList(a) { a = a.filter(Boolean); return (a.length > 1 ? "sections " : "section ") + joinList(a); }
	var CA_ADMT_METHOD_TXT = { web: "online", email: "by email", phone: "by toll-free telephone", mail: "by post", person: "in person" };

	var CA_SECTION = {
		title: "California (CCPA)",
		show: function (s) { return inReg(s, "ca"); },
		lead: "The CCPA protects California residents, including employees, job applicants and business contacts. List every category of personal information you collected in the past 12 months or collect now, one row each, in the statutory terms (Civil Code 1798.130(c)).",
		fields: [
			{ id: "caCats", type: "repeater", label: "Categories of personal information", itemLabel: "Category", add: "Add a category",
			  fields: [
				{ id: "cat", type: "select", label: "Category (statutory term)", opts: D.CA_CATS.map(function (c) { return { v: c.v, l: c.l }; }) },
				{ id: "examples", type: "text", label: "What it includes, in plain words", ph: "for example name, email address, customer number" },
				{ id: "sources", type: "text", label: "Categories of sources", ph: "for example you, our website, advertising networks" },
				{ id: "purposes", type: "text", label: "Business or commercial purposes for collecting and using it" },
				{ id: "retention", type: "text", label: "How long you keep it, or the criteria" },
				{ id: "sold", type: "yesno", label: "Sold now?", hint: "Selling is making it available to a third party for money or other valuable consideration (Civil Code 1798.140(ad))." },
				{ id: "shared", type: "yesno", label: "Shared now, for cross-context behavioral advertising?", hint: "Sharing is disclosing it to a third party for cross-context behavioral advertising, paid or not (Civil Code 1798.140(ah))." },
				{ id: "past12", type: "yesno", label: "Sold or shared at any time in the past 12 months?" },
				{ id: "soldTo", type: "text", label: "Categories of third parties it is or was sold or shared to", show: function (s, r) { return yes(r, "sold") || yes(r, "shared") || yes(r, "past12"); } },
				{ id: "sp", type: "yesno", label: "Disclosed to service providers or contractors for a business purpose in the past 12 months?" },
				{ id: "discTo", type: "text", label: "Other categories of third parties it is disclosed to (optional)", ph: "for example government agencies, when the law requires" }
			  ] },
			{ id: "caSellPurpose", type: "text", label: "Business or commercial purpose for selling or sharing",
			  show: function (s) { return caSells(s) || caCats(s).some(caSold12); } },
			{ id: "caOptOutLink", type: "text", label: "Where people opt out of selling or sharing", show: caSells,
			  ph: "for example example.com/do-not-sell", hint: "The page or form behind your \"Do Not Sell or Share My Personal Information\" link (section 7013)." },
			{ id: "caUnder16", type: "yesno", label: "Do you have actual knowledge that you sell or share personal information of consumers under 16?", show: caSells },
			{ id: "caUnder16How", type: "area", rows: 2, label: "How you get opt-in consent: from the consumer at 13 to 15, from a parent or guardian under 13 (sections 7070, 7071)",
			  show: function (s) { return caSells(s) && yes(s, "caUnder16"); } },
			{ id: "caSpPurpose", type: "text", label: "Business purpose for disclosing to service providers and contractors",
			  show: function (s) { return caCats(s).some(function (r) { return yes(r, "sp"); }); } },
			{ id: "caSpiBeyond", type: "yesno", label: "Do you use or disclose sensitive personal information for purposes beyond those in section 7027(m)?",
			  show: function (s) { return caSpiRows(s).length > 0; } },
			{ id: "caSpiOk", type: "checks", label: "Section 7027(m) purposes you use sensitive personal information for", opts: D.CA_SPI_PURPOSES,
			  show: function (s) { return caSpiRows(s).length > 0 && !!v(s, "caSpiBeyond"); }, hint: "Only where the use is reasonably necessary and proportionate for that purpose." },
			{ id: "caSpiBeyondWhat", type: "text", label: "The other, specified purposes you use or disclose it for", show: caLimit, hint: "Civil Code 1798.121(a) requires notice of these additional, specified purposes." },
			{ id: "caLimitLink", type: "text", label: "Where people limit the use of their sensitive personal information", show: caLimit,
			  hint: "The page or form behind your \"Limit the Use of My Sensitive Personal Information\" link (section 7014)." },
			{ id: "caOnlineOnly", type: "yesno", label: "Do you operate exclusively online and have a direct relationship with these consumers?",
			  hint: "Then an email address is enough for requests to know, delete and correct. Otherwise offer two or more methods, including a toll-free number (Civil Code 1798.130(a)(1))." },
			{ id: "caMethods", type: "checks", label: "Methods for submitting requests", opts: D.CA_METHODS },
			{ id: "caWeb", type: "text", label: "Webform or portal address", show: function (s) { return has(s, "caMethods", "web"); } },
			{ id: "caEmailReq", type: "text", label: "Email address for requests", show: function (s) { return has(s, "caMethods", "email"); } },
			{ id: "caPhone", type: "text", label: "Toll-free telephone number", show: function (s) { return has(s, "caMethods", "phone"); } },
			{ id: "caMailAddr", type: "text", label: "Postal address for requests", show: function (s) { return has(s, "caMethods", "mail"); } },
			{ id: "caPerson", type: "text", label: "Where requests can be made in person", show: function (s) { return has(s, "caMethods", "person"); } },
			{ id: "caVerify", type: "area", rows: 2, label: function (s) {
				return yes(s, "caAdmt") ? "How you verify requests to know, delete and correct, requests to access automated decisionmaking technology" + (v(s, "caAdmtExc") === "appeal" ? " and appeals" : "") + ", and what the person must provide" :
					"How you verify requests to know, delete and correct, and what the person must provide"; } },
			{ id: "caAgent", type: "text", label: "Where and how an authorized agent submits a request" },
			{ id: "caOopsScope", type: "checks", label: "Besides the browser or device and its profiles, the opt-out preference signal also applies to", opts: D.CA_OOPS, show: caSells,
			  hint: "The signal always covers the browser or device and every profile associated with it, pseudonymous ones included (section 7025(c)(1))." },
			{ id: "caOopsFriction", type: "yesno", label: "Do you process the signal in a frictionless manner (section 7025(f))?", show: caSells,
			  hint: "No fee, no change to the person's experience, and no pop-up or other content in response to the signal." },
			{ id: "caOopsHow", type: "text", label: "How people turn the signal on", show: caSells, ph: "for example, in a browser or extension that supports Global Privacy Control" },
			{ id: "caPolicyUrl", type: "text", label: "Where the privacy policy is online, for notices given offline", show: caOffline, ph: "for example example.com/privacy" },
			{ id: "caAltFormat", type: "text", label: "How a person with a disability can get the policy in another format", show: caOffline, ph: "for example, call us and we send it in large print or read it to you" },
			{ id: "caAdmt", type: "yesno", label: "Do you use automated decisionmaking technology to make a significant decision about consumers?",
			  hint: "Technology that replaces or substantially replaces human decisionmaking for a decision that results in the provision or denial of financial or lending services, housing, education enrollment or opportunities, employment or independent contracting opportunities or compensation, or healthcare services. Advertising is not such a decision (section 7001). The rules apply from 1 January 2027: uses that began earlier must comply by that date, later uses from the start (section 7200(b))." },
			{ id: "caAdmtWhat", type: "text", label: "The specific decision it is used for", show: function (s) { return yes(s, "caAdmt"); }, hint: "Not \"to make a significant decision\": name the decision (section 7220(c)(1))." },
			{ id: "caAdmtHow", type: "area", rows: 2, label: "How it processes personal information, including the categories that affect its output", show: function (s) { return yes(s, "caAdmt"); } },
			{ id: "caAdmtOutput", type: "area", rows: 2, label: "What it produces, how that output is used, and any human role", show: function (s) { return yes(s, "caAdmt"); } },
			{ id: "caAdmtExc", type: "select", label: "Opt-out of ADMT, or an exception (section 7221(b))", opts: D.CA_ADMT_EXC, show: function (s) { return yes(s, "caAdmt"); } },
			{ id: "caAdmtMethods", type: "checks", label: "Ways to opt out of it (two or more)", opts: D.CA_METHODS, show: function (s) { return caAdmtOptOut(s); },
			  hint: "At least one in the way you mainly interact with the person; online, at least an interactive form behind a link titled for what is opted out of, such as \"Opt-out of Automated Decisionmaking Technology\" (section 7221(c))." },
			{ id: "caAdmtOptOutHow", type: "text", label: "Where: the link, number, address or place for each way", show: function (s) { return caAdmtOptOut(s); } },
			{ id: "caAdmtAlt", type: "text", label: "How the decision is made for people who opt out", show: function (s) { return caAdmtOptOut(s); } },
			{ id: "caAdmtAppeal", type: "text", label: "How people submit an appeal to the human reviewer", show: function (s) { return yes(s, "caAdmt") && v(s, "caAdmtExc") === "appeal"; } },
			{ id: "caAdmtAccess", type: "text", label: "How people request access to information about the ADMT", show: function (s) { return yes(s, "caAdmt"); } },
			{ id: "caIncentive", type: "yesno", label: "Do you offer a financial incentive or a price or service difference linked to personal information?" },
			{ id: "caIncSummary", type: "text", label: "Short summary of the incentive", show: function (s) { return yes(s, "caIncentive"); } },
			{ id: "caIncTerms", type: "area", rows: 2, label: "Material terms, including the categories of personal information involved", show: function (s) { return yes(s, "caIncentive"); } },
			{ id: "caIncOptIn", type: "text", label: "How people opt in", show: function (s) { return yes(s, "caIncentive"); } },
			{ id: "caIncWithdraw", type: "text", label: "How people withdraw at any time", show: function (s) { return yes(s, "caIncentive"); } },
			{ id: "caIncRelation", type: "area", rows: 2, label: "How the incentive or difference is reasonably related to the value of the data", show: function (s) { return yes(s, "caIncentive"); } },
			{ id: "caIncValue", type: "area", rows: 2, label: "Good-faith estimate of the value of the data, and the method used to calculate it", show: function (s) { return yes(s, "caIncentive"); } },
			{ id: "ca10M", type: "yesno", label: "Do you know, or should you reasonably know, that you, alone or in combination, buy, receive for your commercial purposes, sell, share or otherwise make available for commercial purposes the personal information of 10,000,000 or more consumers in a calendar year?" },
			{ id: "caMetricsLink", type: "text", label: "Where the request metrics for the previous calendar year are published", show: function (s) { return yes(s, "ca10M"); } }
		]
	};

	/* The California text. H(title) adds a heading: numbered h2 in a California-led policy,
	   h3 inside the California section of a notice led by another law. */
	function caBody(s, H, ref) {
		var b = [], cats = caCats(s), sells = caSells(s), spi = caSpiRows(s);
		/* Notice at collection (Civil Code 1798.100(a); regulations 7012(e)(1) to (6)) */
		ref.collect = H(b, "What we collect, why, and how long we keep it");
		b.push({ k: "p", x: "This section is our notice at collection. It lists the categories of personal information we collect about California residents" + (spi.length ? ", including sensitive personal information," : ",") +
			" why we collect and use them, whether we sell or share them, and how long we keep them." });
		if (cats.length) b.push({ k: "table", head: ["Category", "What it includes", "Why we collect and use it", "Sold or shared", "How long we keep it"],
			rows: cats.map(function (r) { return [caCatName(r), v(r, "examples") || "[what it includes]", v(r, "purposes") || "[purposes]", caSoldTxt(r), v(r, "retention") || "[retention period or criteria]"]; }) });
		else b.push({ k: "p", x: "[Add each category of personal information you collect.]" });
		if (cats.length && !spi.length && cats.every(function (r) { return v(r, "cat"); })) b.push({ k: "p", x: "We do not collect sensitive personal information." });
		if (sells) b.push({ k: "p", x: "You can tell us to stop selling or sharing your personal information: " + stop(v(s, "caOptOutLink") || "[where to opt out]") });
		if (caOffline(s)) b.push({ k: "p", x: "Our full privacy policy is online at " + stop(v(s, "caPolicyUrl") || "[where the policy is online]") +
			" If you need it in another format because of a disability, " + lcFirst(stop(v(s, "caAltFormat") || "[how to get it in an alternative format]")) });
		b.push({ k: "p", x: "We do not collect further categories of personal information without first giving you a new notice, and we do not use your personal information for a purpose incompatible with those above without your consent (Civil Code 1798.100(a), (c); section 7002(e), (f) of the CCPA regulations)." });
		/* Sources (regulations 7011(e)(1)(B)) */
		H(b, "Where we get it");
		b.push(cats.length ? { k: "ul", items: cats.map(function (r) { return { b: caCatName(r) + ":", x: stop(v(r, "sources") || "[categories of sources]") }; }) } : { k: "p", x: "[Add the categories of sources for each category.]" });
		/* Selling, sharing, disclosures (regulations 7011(e)(1)(D) to (I)) */
		ref.disclose = H(b, "Who we sell, share or disclose it to");
		var sold12 = cats.filter(caSold12);
		if (sold12.length) {
			b.push({ k: "p", x: "In the past 12 months we sold or shared these categories of personal information, to these categories of third parties:" });
			b.push({ k: "ul", items: sold12.map(function (r) { return { b: caCatName(r) + ":", x: stop(v(r, "soldTo") || "[categories of third parties]") }; }) });
			b.push({ k: "p", x: (caNoSell(s) ? "We did this for " : "We do this for ") + lcFirst(stop(v(s, "caSellPurpose") || "[business or commercial purpose]")) + " Sharing means disclosing personal information to a third party for cross-context behavioral advertising." +
				(caNoSell(s) ? " We no longer sell or share personal information." : "") });
		} else if (caNo12(s)) {
			b.push({ k: "p", x: "We have not sold or shared personal information in the past 12 months" + (caNoSell(s) ? ", and we do not sell or share it." : ".") });
			if (sells) b.push({ k: "p", x: "We now sell or share personal information, as the table " + (ref.collect ? "in section " + ref.collect : "above") + " shows, for " + lcFirst(stop(v(s, "caSellPurpose") || "[business or commercial purpose]")) });
		} else b.push({ k: "p", x: "[Say for each category whether it was sold or shared in the past 12 months.]" });
		if (sells) b.push(yes(s, "caUnder16") ? { k: "p", x: "We sell or share the personal information of consumers under 16 only with their opt-in consent, or a parent's or guardian's for those under 13: " + stop(v(s, "caUnder16How") || "[the opt-in process]") } :
			no(s, "caUnder16") ? { k: "p", x: "We do not have actual knowledge that we sell or share the personal information of consumers under 16 years of age." } :
			{ k: "p", x: "[Say whether you have actual knowledge that you sell or share personal information of consumers under 16.]" });
		else if (caNoSell(s)) b.push({ k: "p", x: "This means we do not sell or share the personal information of consumers under 16 years of age." });
		var sp = cats.filter(function (r) { return yes(r, "sp"); });
		if (sp.length) {
			b.push({ k: "p", x: "In the past 12 months we disclosed these categories of personal information to service providers and contractors for a business purpose: " + stop(joinList(sp.map(caCatName))) +
				" We did so for " + lcFirst(stop(v(s, "caSpPurpose") || "[business purpose]")) });
		} else if (cats.length && cats.every(function (r) { return no(r, "sp"); })) {
			b.push({ k: "p", x: "We have not disclosed personal information to service providers or contractors for a business purpose in the past 12 months." });
		} else if (cats.length) b.push({ k: "p", x: "[Say for each category whether it was disclosed to service providers or contractors.]" });
		var other = cats.filter(function (r) { return v(r, "discTo"); });
		if (other.length) b.push({ k: "p", x: "We also disclose personal information to these categories of third parties:" }, { k: "ul", items: other.map(function (r) { return { b: caCatName(r) + ":", x: stop(v(r, "discTo")) }; }) });
		/* Sensitive personal information (Civil Code 1798.121; regulations 7011(e)(1)(J), 7014, 7027(m)) */
		H(b, "Sensitive personal information");
		var okp = arr(s, "caSpiOk").map(function (x) { var o = lbl(D.CA_SPI_PURPOSES, x); return o ? o.t : ""; }).filter(Boolean);
		var okTxt = okp.length ? joinList(okp) : "[the section 7027(m) purposes you use it for]";
		if (!cats.length) b.push({ k: "p", x: "[Add the categories of personal information first.]" });
		else if (!spi.length) b.push({ k: "p", x: "We do not use or disclose sensitive personal information for purposes beyond those listed in section 7027(m) of the CCPA regulations." });
		else if (no(s, "caSpiBeyond")) b.push({ k: "p", x: "We use and disclose sensitive personal information only for purposes for which the law gives no right to limit, and only as reasonably necessary and proportionate for them (section 7027(m) of the CCPA regulations): " + okTxt + "." });
		else if (yes(s, "caSpiBeyond")) {
			b.push({ k: "p", x: (okp.length ? "We use and disclose sensitive personal information for " + okTxt + ". We also use or disclose it for these other purposes: " :
				"We use or disclose sensitive personal information for these purposes, beyond those listed in section 7027(m) of the CCPA regulations: ") + stop(v(s, "caSpiBeyondWhat") || "[the additional, specified purposes]") });
			b.push({ k: "p", x: "You have the right to limit our use and disclosure of your sensitive personal information to the purposes the law allows (Civil Code 1798.121). To do so, go to " + stop(v(s, "caLimitLink") || "[where to limit]") });
		} else b.push({ k: "p", x: "[Say whether you use or disclose sensitive personal information beyond the purposes in section 7027(m).]" });
		/* Automated decisionmaking technology: pre-use notice (regulations 7220(c)) */
		if (yes(s, "caAdmt")) {
			ref.admt = H(b, "Automated decisionmaking technology");
			b.push({ k: "p", x: "We use automated decisionmaking technology to make this significant decision about you: " + stop(v(s, "caAdmtWhat") || "[the specific decision]") });
			b.push({ k: "p", x: "How it works: " + stop(v(s, "caAdmtHow") || "[how it processes personal information, and the categories that affect its output]") });
			b.push({ k: "p", x: "What it produces and how we use it: " + stop(v(s, "caAdmtOutput") || "[the output, how it is used, and any human role]") });
			var ex = v(s, "caAdmtExc"), exo = lbl(D.CA_ADMT_EXC, ex);
			if (ex === "none") {
				var am = arr(s, "caAdmtMethods").map(function (m) { return CA_ADMT_METHOD_TXT[m]; }).filter(Boolean);
				b.push({ k: "p", x: "You can opt out of our use of this technology" + (am.length ? " " + joinList(am) : "") + ": " + stop(v(s, "caAdmtOptOutHow") || "[where to opt out]") +
					" If you opt out, " + lcFirst(stop(v(s, "caAdmtAlt") || "[how the decision is made instead]")) });
			}
			else if (ex === "appeal") b.push({ k: "p", x: "Instead of an opt-out, " + exo.t + ". To appeal: " + stop(v(s, "caAdmtAppeal") || "[how to appeal]") });
			else if (exo) b.push({ k: "p", x: "There is no opt-out because " + exo.t + "." });
			else b.push({ k: "p", x: "[Say whether people can opt out of automated decisionmaking technology, or which exception applies.]" });
			b.push({ k: "p", x: "You can ask us how we used the technology to make a decision about you, including its logic and the outcome (the right to access automated decisionmaking technology): " + stop(v(s, "caAdmtAccess") || "[how to request access]") });
			b.push({ k: "p", x: "The law prohibits us from retaliating against you for exercising your CCPA rights, and we do not." });
		}
		/* Financial incentives (regulations 7016(d)) */
		if (yes(s, "caIncentive")) {
			H(b, "Financial incentives");
			b.push({ k: "ul", items: [
				{ b: "What we offer:", x: stop(v(s, "caIncSummary") || "[summary]") },
				{ b: "Terms:", x: stop(v(s, "caIncTerms") || "[material terms and the categories of personal information involved]") },
				{ b: "How to opt in:", x: stop(v(s, "caIncOptIn") || "[how to opt in]") },
				{ b: "Withdrawing:", x: "You can withdraw at any time: " + stop(v(s, "caIncWithdraw") || "[how to withdraw]") },
				{ b: "Why it reflects the value of your data:", x: stop(v(s, "caIncRelation") || "[how the incentive is reasonably related to the value of the data]") },
				{ b: "Value of your data:", x: stop(v(s, "caIncValue") || "[good-faith estimate and the method used]") }] });
		}
		/* Rights (regulations 7011(e)(2)) */
		ref.rights = H(b, "Your rights under the CCPA");
		var R = [
			{ b: "Right to know (Civil Code 1798.110, 1798.115).", x: "You can ask us what personal information we have collected about you: the categories of personal information, the categories of sources, the business or commercial purpose for collecting, selling or sharing it, the categories of third parties we disclose it to, and the specific pieces of personal information we hold about you. You can ask about personal information collected beyond the past 12 months, back to 1 January 2022, unless that proves impossible or would involve a disproportionate effort." },
			{ b: "Right to delete (Civil Code 1798.105).", x: "You can ask us to delete personal information we collected from you, subject to the exceptions in the law." },
			{ b: "Right to correct (Civil Code 1798.106).", x: "You can ask us to correct inaccurate personal information we hold about you." }];
		if (sells) R.push({ b: "Right to opt out of sale or sharing (Civil Code 1798.120).", x: "You can tell us to stop selling or sharing your personal information." });
		if (caLimit(s)) R.push({ b: "Right to limit (Civil Code 1798.121).", x: "You can tell us to limit our use and disclosure of your sensitive personal information to the purposes the law allows." });
		if (caAdmtOptOut(s)) R.push({ b: "Right to opt out of automated decisionmaking technology (section 7221 of the CCPA regulations).", x: "You can tell us not to use it to make the decision described above." });
		else if (yes(s, "caAdmt") && !v(s, "caAdmtExc")) R.push("[Say whether people can opt out of automated decisionmaking technology, or which exception applies.]");
		if (yes(s, "caAdmt")) R.push({ b: "Right to access automated decisionmaking technology (section 7222 of the CCPA regulations).", x: "You can ask how we used it to make a decision about you." });
		R.push({ b: "Right not to be retaliated against (Civil Code 1798.125).", x: "We do not retaliate against you for exercising your rights, including if you are a job applicant, an employee, an independent contractor, a student or an applicant to an educational program." });
		b.push({ k: "ul", items: R });
		/* How to exercise them (regulations 7011(e)(3)) */
		ref.how = H(b, "How to exercise your rights");
		var M = [];
		if (has(s, "caMethods", "web")) M.push({ b: "Online:", x: stop(v(s, "caWeb") || "[webform or portal]") });
		if (has(s, "caMethods", "email")) M.push({ b: "By email:", x: stop(v(s, "caEmailReq") || "[email address]") });
		if (has(s, "caMethods", "phone")) M.push({ b: "By toll-free telephone:", x: stop(v(s, "caPhone") || "[toll-free number]") });
		if (has(s, "caMethods", "mail")) M.push({ b: "By post:", x: stop(v(s, "caMailAddr") || "[postal address]") });
		if (has(s, "caMethods", "person")) M.push({ b: "In person:", x: stop(v(s, "caPerson") || "[where]") });
		b.push(M.length ? { k: "ul", items: M } : { k: "p", x: "[List the methods for submitting requests.]" });
		if (sells) b.push({ k: "p", x: "Your right to opt out of sale or sharing: you can tell us at any time to stop selling or sharing your personal information. Use the form at " + stop(v(s, "caOptOutLink") || "[where to opt out]") });
		var appeal = yes(s, "caAdmt") && v(s, "caAdmtExc") === "appeal";
		b.push({ k: "p", x: "When you make a request to know, delete or correct" + (yes(s, "caAdmt") ? (appeal ? ", a request to access automated decisionmaking technology, or an appeal of a decision made with it" : ", or a request to access automated decisionmaking technology") : "") +
			", we confirm receipt within 10 business days and tell you how we will process it, and we respond within 45 calendar days of receiving it. Where necessary we take up to 45 more days; if we do, we tell you why within the first 45 days (Civil Code 1798.130(a)(2); section 7021 of the CCPA regulations). We do not charge for this." +
			(sells ? " We act on a request to opt out of sale or sharing as soon as feasible, and no later than 15 business days after we receive it (section 7026(f))." : "") +
			(caLimit(s) ? (sells ? " We act on a request to limit within the same 15 business days (section 7027(g))." : " We act on a request to limit as soon as feasible, and no later than 15 business days after we receive it (section 7027(g)).") : "") +
			(caAdmtOptOut(s) ? " If you opt out of automated decisionmaking technology after we started using it on your data, we stop within 15 business days (section 7221(n))." : "") });
		b.push({ k: "p", x: "How we verify your identity: " + stop(v(s, "caVerify") || "[the verification process and what you must provide]") +
			(sells || caLimit(s) || caAdmtOptOut(s) ? " A request to opt out" + (caLimit(s) ? " or to limit" : "") + " does not need identity verification: we ask only for the information we need to act on it (" +
				secList([sells ? "7026(d)" : "", caLimit(s) ? "7027(e)" : "", caAdmtOptOut(s) ? "7221(f)" : ""]) + ")." : "") });
		var optReqs = orList([sells ? "to opt out of sale or sharing" : "", caLimit(s) ? "to limit the use of sensitive personal information" : "", caAdmtOptOut(s) ? "to opt out of automated decisionmaking technology" : ""]);
		b.push({ k: "p", x: "An authorized agent can make a request for you" + (v(s, "caAgent") ? ": " + lcFirst(stop(v(s, "caAgent"))) : ".") +
			" For a request to know, delete or correct, we can ask the agent for proof that you gave signed permission, and ask you to verify your own identity with us or confirm with us that you gave the permission, unless the agent holds a power of attorney under Probate Code sections 4121 to 4130 (section 7063 of the CCPA regulations)." +
			(optReqs ? " For a request " + optReqs + ", we only ask the agent for your signed permission, and we do not ask you to verify your identity (" +
				secList([sells ? "7026(j)" : "", caLimit(s) ? "7027(j)" : "", caAdmtOptOut(s) ? "7221(j)" : ""]) + ")." : "") });
		if (sells) {
			var sc = arr(s, "caOopsScope").map(function (x) { var o = lbl(D.CA_OOPS, x); return o ? o.t : ""; }).filter(Boolean);
			b.push({ k: "p", x: "We treat an opt-out preference signal, such as Global Privacy Control, as a valid request to opt out of sale and sharing. It applies to the browser or device that sends it and to any profile we associate with that browser or device, including pseudonymous profiles" +
				(sc.length ? ". Where we know who you are, it also applies to " + joinList(sc) : "") + " (section 7025(c))." +
				(yes(s, "caOopsFriction") ? " We process it in a frictionless manner: we do not charge you, change your experience, or show you a pop-up or other content in response to it (section 7025(f))." : "") +
				" To use it: " + stop(v(s, "caOopsHow") || "[how to turn it on]") });
		} else if (caNoSell(s)) {
			b.push({ k: "p", x: "We do not sell or share personal information, so an opt-out preference signal, such as Global Privacy Control, does not change how we process your data." });
		} else b.push({ k: "p", x: "[Say whether you sell or share personal information; how you process opt-out preference signals depends on it.]" });
		if (yes(s, "ca10M")) b.push({ k: "p", x: "Our figures on the requests we received last year, and how we handled them, are at " + stop(v(s, "caMetricsLink") || "[where the metrics are published]") });
		return b;
	}

	function caChecks(s, led) {
		var checks = [], delivery = [], cats = caCats(s), sells = caSells(s), spi = caSpiRows(s);
		checks.push(chk("C00", "check", "The CCPA applies to a for-profit business that collects personal information, determines its purposes and means, does business in California and meets one threshold: annual gross revenue above $26,625,000 in the preceding calendar year (the amount adjusted from 1 January 2025), buying, selling or sharing the personal information of 100,000 or more consumers or households a year, or deriving 50% or more of its revenue from selling or sharing it. It also applies to an entity that controls or is controlled by such a business, shares its branding and receives personal information from it, to joint ventures of such businesses with at least 40% each, and to businesses that certify voluntarily (Civil Code 1798.140(d)). Consumers are California residents, including employees, applicants and business contacts." +
			(yes(s, "publicBody") ? " Public authorities are not businesses under the CCPA." : "")));
		var bad = function (f) { return !cats.length || cats.some(f); };
		checks.push(bad(function (r) { return !v(r, "cat") || !v(r, "examples"); }) ? chk("C01", "missing", "Add every category collected in the past 12 months, with the statutory term and what it includes.") : chk("C01", "ok"));
		checks.push(bad(function (r) { return !v(r, "sources"); }) ? chk("C02", "missing", "Give the categories of sources for each category.") : chk("C02", "ok"));
		checks.push(bad(function (r) { return !v(r, "purposes"); }) ? chk("C03", "missing", "Give the business or commercial purposes for each category.") : chk("C03", "ok"));
		var anySold = sells || cats.some(caSold12);
		checks.push(bad(function (r) { return !v(r, "sold") || !v(r, "shared") || !v(r, "past12"); }) ? chk("C04", "missing", "Say for each category whether it is sold now, shared now, and sold or shared in the past 12 months.") :
			anySold && (cats.some(function (r) { return (yes(r, "sold") || yes(r, "shared") || yes(r, "past12")) && !v(r, "soldTo"); }) || !v(s, "caSellPurpose")) ? chk("C04", "missing", "Give the categories of third parties for each category sold or shared, and the purpose.") :
			chk("C04", "ok", sells ? "" : "The policy states that you do not sell or share personal information, so no notice of right to opt out is needed (section 7013(g)). Keep it true: data collected while no opt-out notice was posted cannot be sold or shared later without consent (section 7013(h))."));
		checks.push(sells ? (!v(s, "caUnder16") ? chk("C05", "missing", "Say whether you have actual knowledge that you sell or share personal information of consumers under 16.") :
			yes(s, "caUnder16") && !v(s, "caUnder16How") ? chk("C05", "missing", "Describe the opt-in processes of sections 7070 and 7071.") : chk("C05", "ok")) :
			caNoSell(s) ? chk("C05", "ok", "The policy says that, with no selling or sharing, no personal information of consumers under 16 is sold or shared.") : chk("C05", "missing", "Answer for each category whether it is sold or shared first."));
		checks.push(bad(function (r) { return !v(r, "sp"); }) ? chk("C06", "missing", "Say for each category whether it was disclosed to service providers or contractors.") :
			cats.some(function (r) { return yes(r, "sp"); }) && !v(s, "caSpPurpose") ? chk("C06", "missing", "Give the business purpose for disclosing to service providers and contractors.") : chk("C06", "ok"));
		checks.push(!cats.length ? chk("C07", "missing", "Add the categories first.") : !spi.length ? chk("C07", "ok", "No sensitive category listed: the policy says sensitive personal information is not used beyond section 7027(m).") :
			!v(s, "caSpiBeyond") ? chk("C07", "missing", "Say whether you use or disclose sensitive personal information beyond the purposes in section 7027(m).") :
			!arr(s, "caSpiOk").length && no(s, "caSpiBeyond") ? chk("C07", "missing", "Tick the section 7027(m) purposes you use sensitive personal information for.") :
			yes(s, "caSpiBeyond") && (!v(s, "caLimitLink") || !v(s, "caSpiBeyondWhat")) ? chk("C07", "missing", "Name the other, specified purposes (Civil Code 1798.121(a)) and where people limit the use of their sensitive personal information.") :
			no(s, "caSpiBeyond") ? chk("C07", "ok", "The statement removes the need for a Notice of Right to Limit (section 7014(g)). Keep it true: sensitive personal information collected while no such notice was posted cannot later be used beyond section 7027(m) without consent (section 7014(h)).") : chk("C07", "ok"));
		var vagueRet = cats.filter(function (r) { return D.LINT.vagueRetention.test(v(r, "retention")); });
		checks.push(bad(function (r) { return !v(r, "retention"); }) ? chk("C08", "missing", "Give a retention period, or the criteria, for each category.") :
			vagueRet.length ? chk("C08", "missing", "\"As long as necessary\" is not a period or criteria. Say how long, or what decides it.") : chk("C08", "ok"));
		checks.push(yes(s, "caAdmt") && !v(s, "caAdmtExc") ? chk("C09", "missing", "Say whether people can opt out of automated decisionmaking technology, or which exception applies.") : chk("C09", "ok", "Stated in the policy."));
		var meth = arr(s, "caMethods"), mdet = { web: "caWeb", email: "caEmailReq", phone: "caPhone", mail: "caMailAddr", person: "caPerson" };
		var website = has(s, "channel", "web");
		checks.push(!v(s, "caOnlineOnly") ? chk("C10", "missing", "Answer whether you operate exclusively online with a direct relationship to these consumers.") :
			!meth.length || meth.some(function (m) { return !v(s, mdet[m]); }) ? chk("C10", "missing", "Choose the methods and give the details of each.") :
			yes(s, "caOnlineOnly") && meth.indexOf("email") === -1 ? chk("C10", "missing", "An exclusively online business needs at least an email address for requests (Civil Code 1798.130(a)(1)(A)).") :
			no(s, "caOnlineOnly") && (meth.length < 2 || meth.indexOf("phone") === -1) ? chk("C10", "missing", "Offer two or more methods, including a toll-free telephone number (Civil Code 1798.130(a)(1)(A); section 7020(b)).") :
			no(s, "caOnlineOnly") && website && meth.indexOf("web") === -1 ? chk("C10", "missing", "With a website, offer it as a way to submit requests, such as a webform (Civil Code 1798.130(a)(1)(B)).") : chk("C10", "ok"));
		checks.push(v(s, "caVerify") ? chk("C11", "ok", yes(s, "caAdmt") ? "Make sure the description also covers requests to access automated decisionmaking technology" + (v(s, "caAdmtExc") === "appeal" ? " and appeals" : "") + " (section 7011(e)(3)(E))." : "") :
			chk("C11", "missing", "Describe how you verify requests" + (yes(s, "caAdmt") ? ", including requests to access automated decisionmaking technology" : "") + ", and what the person must provide."));
		checks.push(!sells ? (caNoSell(s) ? chk("C12", "ok", "The policy says a signal does not change anything, because you do not sell or share.") : chk("C12", "missing", "Answer for each category whether it is sold or shared first.")) :
			!v(s, "caOopsHow") || !v(s, "caOopsFriction") ? chk("C12", "missing", "Say whether you process the signal in a frictionless manner and how people turn it on (section 7011(e)(3)(F), (G)).") : chk("C12", "ok"));
		checks.push(v(s, "caAgent") ? chk("C13", "ok", "The policy states the section 7063 rules" + (sells || caLimit(s) || caAdmtOptOut(s) ? ", and the signed-permission rule for opt-out" + (caLimit(s) ? " and limit" : "") + " requests." : ".")) :
			chk("C13", "warn", "Say where and how agents submit requests (section 7011(e)(3)(H))."));
		checks.push(!sells ? (caNoSell(s) ? chk("C14", "na", "No selling or sharing.") : chk("C14", "missing", "Answer for each category whether it is sold or shared first.")) : v(s, "caOptOutLink") ? chk("C14", "ok", "The policy carries the notice content: the right, and the form to use (section 7013(f)), also in the notice at collection (section 7012(e)(5)).") : chk("C14", "missing", "Give where people opt out of selling or sharing."));
		checks.push(v(s, "ctrlEmail") || v(s, "ctrlPhone") ? chk("C15", "ok") : chk("C15", "missing", "Give a contact for questions, using the way you mainly interact with consumers."));
		checks.push(v(s, "effective") ? chk("C16", "ok", "Shown as the date last updated. Review and update the policy at least once every 12 months.") : chk("C16", "missing", "Give the date the policy was last updated."));
		if (!v(s, "caAdmt")) checks.push(chk("C17", "missing", "Answer whether you use automated decisionmaking technology for a significant decision."));
		else if (no(s, "caAdmt")) checks.push(chk("C17", "na", "No automated decisionmaking technology for significant decisions."));
		else {
			var ex = v(s, "caAdmtExc"), am = arr(s, "caAdmtMethods");
			if (!v(s, "caAdmtWhat") || !v(s, "caAdmtHow") || !v(s, "caAdmtOutput") || !v(s, "caAdmtAccess") || !ex || (ex === "none" && (!v(s, "caAdmtOptOutHow") || !v(s, "caAdmtAlt"))) || (ex === "appeal" && !v(s, "caAdmtAppeal")))
				checks.push(chk("C17", "missing", "Give the specific decision, how it works, the output and its use, the opt-out or the exception relied on (with how to appeal, for the appeal exception), the alternative for people who opt out, and how to request access (section 7220(c))."));
			else if (ex === "none" && (am.length < 2 || (website && am.indexOf("web") === -1)))
				checks.push(chk("C17", "missing", "Offer two or more ways to opt out of the technology, one in the way you mainly interact with the person; online, at least an interactive form behind the opt-out link (section 7221(c))."));
			else if (ex === "hiring" || ex === "alloc") checks.push(chk("C17", "warn", "The exception holds only if the technology works for its purpose and does not unlawfully discriminate. Keep the evidence (section 7221(b)(2), (3))."));
			else if (ex === "appeal") checks.push(chk("C17", "warn", "The exception holds only if a designated human reviewer who knows how to interpret the output reviews the appeal, considers what the person provides and can change the decision (section 7221(b)(1))."));
			else checks.push(chk("C17", "ok", "Give this notice at or before collecting the data it will process (section 7220(b)). Uses that began before 1 January 2027 must comply by that date, later ones from the start (section 7200(b))."));
		}
		checks.push(!v(s, "caIncentive") ? chk("C18", "missing", "Answer whether you offer a financial incentive or a price or service difference.") : no(s, "caIncentive") ? chk("C18", "na", "No financial incentive.") :
			v(s, "caIncSummary") && v(s, "caIncTerms") && v(s, "caIncOptIn") && v(s, "caIncWithdraw") && v(s, "caIncRelation") && v(s, "caIncValue") ? chk("C18", "ok", "Show it where people meet it before they opt in (section 7016(c)).") :
			chk("C18", "missing", "Give the summary, the terms with the categories involved, how to opt in, how to withdraw, how the offer is reasonably related to the value of the data, and that value with the method (section 7016(d))."));
		checks.push(!v(s, "ca10M") ? chk("C19", "missing", "Answer whether you know, or should reasonably know, that you buy, receive for commercial purposes, sell, share or make available the personal information of 10,000,000 or more consumers a year (section 7102(a)).") : no(s, "ca10M") ? chk("C19", "na", "Below the threshold.") :
			v(s, "caMetricsLink") ? chk("C19", "ok", "Publish the metrics by 1 July each year. If they cover all individuals, not only consumers, say so (section 7102).") : chk("C19", "missing", "Give where the request metrics are published."));
		if (caOffline(s)) checks.push(v(s, "caPolicyUrl") && v(s, "caAltFormat") ? chk("C25", "ok") :
			chk("C25", "missing", "For notices given offline, say where the privacy policy is online (section 7012(e)(6)) and how a person with a disability can get it in another format (section 7003(b)(3))."));
		/* Consistency with the rest of a notice led by another law (review R24). */
		if (!led) {
			var cw = [];
			if (pnActs(s).some(function (a) { return art9Of(s, a); }) && !spi.length) cw.push("A purpose uses special category data, but no sensitive California category is listed.");
			if (yes(s, "adm") && no(s, "caAdmt")) cw.push("The notice describes a decision based solely on automated processing; check whether it is a significant decision made with automated decisionmaking technology under section 7001.");
			if (arr(s, "recipients").some(function (r) { return v(r, "role") === "controller" || v(r, "role") === "joint"; }) && caNoSell(s)) cw.push("A recipient is an independent or joint controller, while every California category says not sold or shared; check whether that disclosure is a sale or sharing (Civil Code 1798.140(ad), (ah)).");
			checks.push(cw.length ? chk("C26", "warn", cw.join(" ")) : chk("C26", "ok", "No contradiction found between the California section and the rest of the notice."));
		}
		delivery.push(chk("C20", "check", "Give the notice at collection at or before collecting the data. Online, a link that goes straight to the section on what you collect is enough: that section carries the opt-out link when you sell or share (section 7012(e)(5), (f)). Offline, say where the privacy policy is online (section 7012(e)(6)). If the notice is not given, do not collect the data (section 7012(d))."));
		var c21 = [];
		if (has(s, "channel", "web")) c21.push("Link the policy from the homepage with a conspicuous link that uses the word \"privacy\".");
		if (has(s, "channel", "app")) c21.push("In an app, link it on the download or landing page; you can also link it in the settings menu.");
		if (!has(s, "channel", "web")) c21.push("Without a website, make it conspicuously available to consumers.");
		delivery.push(chk("C21", "check", c21.join(" ") + " Make it available in a format people can print as a document (sections 7003(c), (d), 7011(c), (d))."));
		delivery.push(chk("C22", "check", "Write it in plain language, readable on small screens, in the languages you use with California consumers, and accessible: online, follow WCAG 2.1; in other contexts, say how a person with a disability can get the policy in an alternative format (section 7003(a), (b))."));
		if (sells || caLimit(s)) {
			var offlineSig = has(s, "caOopsScope", "offline");
			delivery.push(chk("C23", "check", ((sells ? "Put a \"Do Not Sell or Share My Personal Information\" link in the header or footer of the homepage, or use the alternative opt-out link" +
				(offlineSig ? "" : " or frictionless signal processing") + ", and give the opt-out notice the same way you collect the data (sections 7013, 7015). Online, accept the opt-out preference signal plus at least one other method; a cookie banner alone is not an opt-out method (section 7026(a)(1), (4)). Show on your website whether you processed a visitor's signal, for example \"Opt-Out Request Honored\" (section 7025(c)(6)), and give a way to confirm an opt-out was processed (section 7026(g)). " +
				(offlineSig ? "Frictionless processing does not replace the link while the signal cannot apply to offline selling or sharing without more information from the person (section 7025(g)(3)). " : "") : "") +
				(caLimit(s) ? "Put a \"Limit the Use of My Sensitive Personal Information\" link in the header or footer of the homepage, or the alternative opt-out link, offer two or more ways to limit (a cookie banner alone is not one), and give a way to confirm a request to limit was processed (sections 7014(c), 7027(b), (h)). " : "")).trim()));
		}
		if (yes(s, "caAdmt")) delivery.push(chk("C24", "check", "Present the pre-use notice prominently at or before collecting the data the technology will process, in the way you mainly interact with the person (section 7220(b))." +
			(caAdmtOptOut(s) ? " Online, the opt-out link must say what is opted out of; offer two or more ways to opt out and a way to confirm an opt-out was processed (section 7221(c), (h))." : "")));
		return { checks: checks, delivery: delivery };
	}

	/* ---------------------------------------------- Other US states (matrix Part M) ---
	   The state consumer privacy laws other than California share one model (Virginia's): a privacy
	   notice with the categories of personal data, the purposes, how to exercise and appeal rights,
	   what is shared with which third parties, and a clear disclosure of selling, targeted advertising
	   and significant profiling with how to opt out. Each state adds its own items; US_STATES in
	   ng-data.js records them, and the text below asks only for what the ticked states need. The text
	   is built once and used as the whole document when these laws are the only ones ticked, or as an
	   "Additional information for residents of other US states" section otherwise. */
	function usSt(s) { return D.US_STATES.filter(function (st) { return has(s, "usStates", st.v); }); }
	function usWith(s, k) { return usSt(s).filter(function (st) { return !!st[k]; }); }
	function usNames(list) { return joinList(list.map(function (st) { return st.n; })); }
	function usCats(s) { return arr(s, "usCats"); }
	function usAnyRow(s, k) { return usCats(s).some(function (r) { return yes(r, k); }); }
	function usSens(s) { return usCats(s).filter(function (r) { return yes(r, "sensitive"); }); }
	function usOptOut(s) { return usAnyRow(s, "sold") || usAnyRow(s, "ta") || usAnyRow(s, "prof"); }
	function usAllNo(s, k) { var c = usCats(s); return c.length > 0 && c.every(function (r) { return no(r, k); }); }
	/* " (residents of X and Y)" when only some ticked states give a right; "" when all do; null when none. */
	function usQual(s, pred) {
		var all = usSt(s), w = all.filter(pred);
		if (!w.length) return null;
		return w.length === all.length ? "" : " (residents of " + usNames(w) + ")";
	}
	function usHas(s, v) { return has(s, "usStates", v); }
	function usDateOf(s) { return v(s, "effective") || ""; }
	function usLater(s) { var d = usDateOf(s); return d ? usSt(s).filter(function (st) { return st.eff > d; }) : []; }
	function usCatName(r) { return v(r, "cat") || "[category]"; }

	var US_SECTION = {
		title: "Other US states",
		show: function (s) { return inReg(s, "us"); },
		lead: "State consumer privacy laws protect residents acting in a personal or household capacity, not employees or business contacts. Tick each state whose law applies to you, then describe the personal data you process, one row per category.",
		fields: [
			{ id: "usStates", type: "checks", label: "States whose law applies to you", opts: D.US_STATES.map(function (st) {
				return { v: st.v, l: st.n + ": " + st.law + (st.eff > new Date().toISOString().slice(0, 10) ? " (from " + fmtDate(st.eff) + ")" : "") }; }),
			  hint: "Each law has its own thresholds; the completeness check lists them. California has its own section." },
			{ id: "usCats", type: "repeater", label: "Categories of personal data", itemLabel: "Category", add: "Add a category",
			  fields: [
				{ id: "cat", type: "text", label: "Category", ph: "for example contact information, payment information, information from cookies",
				  hint: "Name it at a level that gives a meaningful understanding, such as \"contact information\" or \"data revealing religious affiliation\" (Colorado Rule 6.03(A)(1)(a))." },
				{ id: "examples", type: "text", label: "What it includes, in plain words" },
				{ id: "sensitive", type: "yesno", label: "Is it sensitive data?", hint: "Typically data revealing racial or ethnic origin, religious beliefs, health, sex life or sexual orientation, citizenship or immigration status, genetic or biometric data used to identify a person, precise geolocation, and data of a known child; several states add more categories." },
				{ id: "geo", type: "yesno", label: "Is it precise geolocation data?", show: function (s, r) { return yes(r, "sensitive"); },
				  hint: "Virginia, Oregon and, from 1 October 2026, Connecticut prohibit selling it." },
				{ id: "purposes", type: "text", label: "Why you process it" },
				{ id: "retention", type: "text", label: "How long you keep it, or the criteria", hint: "Required for Minnesota (retention policies); good practice elsewhere." },
				{ id: "shared", type: "yesno", label: "Shared with third parties?", hint: "Disclosure to a processor acting on your instructions is not sharing with a third party." },
				{ id: "sold", type: "yesno", label: "Sold?", hint: "Exchanged for money; in Colorado, Connecticut, Texas, Oregon, Montana and most later laws also for other valuable consideration. Virginia, Utah, Iowa, Indiana, Tennessee and Oklahoma count money only; Alabama counts other consideration only where you receive a material benefit and the buyer's use is unrestricted, and excludes analytics or marketing services provided solely to you." },
				{ id: "ta", type: "yesno", label: "Used for targeted advertising?" },
				{ id: "prof", type: "yesno", label: "Used for profiling in furtherance of decisions that produce legal or similarly significant effects?",
				  hint: "Decisions on financial or lending services, housing, insurance, education, criminal justice, employment, health care or access to essential goods or services." }
			  ] },
			{ id: "usThird", type: "repeater", label: "Categories of third parties", itemLabel: "Third party", add: "Add a category of third party",
			  show: function (s) { return usAnyRow(s, "shared") || usAnyRow(s, "sold"); },
			  fields: [
				{ id: "type", type: "text", label: "Category of third party", ph: "for example analytics companies, data brokers, third-party advertisers" },
				{ id: "what", type: "text", label: "What they do with the data", hint: "Colorado, Maryland and Oregon ask for enough detail to show the type, business model or processing of each." },
				{ id: "data", type: "text", label: "Categories of personal data they receive" },
				{ id: "sold", type: "yesno", label: "Do you sell personal data to them?", show: function (s) { return usAnyRow(s, "sold"); } }
			  ] },
			{ id: "usOptOutHow", type: "text", label: "Where people opt out of selling, targeted advertising or profiling", show: usOptOut, ph: "for example example.com/your-privacy-choices" },
			{ id: "usGpc", type: "yesno", label: "Do you honour opt-out preference signals, such as Global Privacy Control?",
			  show: function (s) { return usAnyRow(s, "sold") || usAnyRow(s, "ta"); } },
			{ id: "usGpcHow", type: "text", label: "How you process the signal", show: function (s) { return yes(s, "usGpc"); },
			  hint: "Colorado asks for an explanation, for example: for the browser or device that sends it, and for your account when you are signed in (Rule 6.03(A)(4)(e))." },
			{ id: "usConsentHow", type: "text", label: "How people withdraw consent to processing of sensitive data", show: function (s) { return usSens(s).length > 0; } },
			{ id: "usBioSale", type: "yesno", label: "Do you sell biometric data?", show: function (s) { return (usHas(s, "TX") || usHas(s, "LA")) && usSens(s).some(function (r) { return yes(r, "sold"); }); } },
			{ id: "usRiBuyers", type: "area", rows: 2, label: "Rhode Island: every third party to which you have sold, or may sell, personally identifiable information", show: function (s) { return usHas(s, "RI") && usAnyRow(s, "sold"); } },
			{ id: "usOrNames", type: "text", label: "Oregon: your registered business name and any assumed name used in Oregon", show: function (s) { return usHas(s, "OR"); } },
			{ id: "usLlm", type: "yesno", label: "Do you collect, use or sell personal data to train large language models?", show: function (s) { return usWith(s, "llm").length > 0; } },
			{ id: "usLlmWhat", type: "text", label: "Which data, and how", show: function (s) { return yes(s, "usLlm"); } },
			{ id: "usProfDecisions", type: "text", label: "Colorado: the decisions subject to profiling", show: function (s) { return usHas(s, "CO") && usAnyRow(s, "prof"); } },
			{ id: "usProfLogic", type: "area", rows: 2, label: "Colorado: the logic of the profiling, in plain language", show: function (s) { return usHas(s, "CO") && usAnyRow(s, "prof"); } },
			{ id: "usProfUse", type: "area", rows: 2, label: "Colorado: how profiling is used in the decision, including any human involvement", show: function (s) { return usHas(s, "CO") && usAnyRow(s, "prof"); } },
			{ id: "usProfEval", type: "text", label: "Colorado: any evaluation for accuracy, fairness or bias, and its outcome", show: function (s) { return usHas(s, "CO") && usAnyRow(s, "prof"); } },
			{ id: "usProfEffects", type: "text", label: "Colorado: the benefits and the consequences of the decision", show: function (s) { return usHas(s, "CO") && usAnyRow(s, "prof"); } },
			{ id: "usOnlineOnly", type: "yesno", label: "Do you operate exclusively online, with a direct relationship with the consumers?", show: function (s) { return usWith(s, "two").length > 0; },
			  hint: "Then an email address is enough as the website mechanism (Texas 541.055(d) and its copies in Nebraska, Oklahoma and Louisiana)." },
			{ id: "usMethods", type: "checks", label: "Methods for submitting requests", opts: D.CA_METHODS },
			{ id: "usWeb", type: "text", label: "Webform or portal address", show: function (s) { return has(s, "usMethods", "web"); } },
			{ id: "usEmailReq", type: "text", label: "Email address for requests", show: function (s) { return has(s, "usMethods", "email"); } },
			{ id: "usPhone", type: "text", label: "Telephone number", show: function (s) { return has(s, "usMethods", "phone"); } },
			{ id: "usMailAddr", type: "text", label: "Postal address for requests", show: function (s) { return has(s, "usMethods", "mail"); } },
			{ id: "usPerson", type: "text", label: "Where requests can be made in person", show: function (s) { return has(s, "usMethods", "person"); } },
			{ id: "usVerify", type: "area", rows: 2, label: "How you authenticate requests, and what the person provides" },
			{ id: "usAgent", type: "text", label: "How an authorised agent submits an opt-out request", show: usOptOut },
			{ id: "usAppeal", type: "text", label: "How people appeal a decision on their request", show: function (s) { return usWith(s, "app").length > 0; } },
			{ id: "usChangeHow", type: "text", label: "How you notify people of material changes to this notice", show: function (s) { return usWith(s, "chg").length > 0; }, ph: "for example by email and a banner in the app" }
		]
	};

	function usBody(s, H, ref) {
		var b = [], cats = usCats(s), sens = usSens(s), sts = usSt(s);
		var ret = usHas(s, "MN") || cats.some(function (r) { return v(r, "retention"); });
		ref.collect = H(b, "What we collect and why");
		if (cats.length) {
			var head = ["Category", "What it includes", "Why we use it", "Sold, targeted advertising or profiling", "Shared with third parties"];
			if (ret) head.push("How long we keep it");
			b.push({ k: "table", head: head, rows: cats.map(function (r) {
				var use = [yes(r, "sold") ? "Sold" : "", yes(r, "ta") ? "Targeted advertising" : "", yes(r, "prof") ? "Profiling" : ""].filter(Boolean);
				var row = [usCatName(r) + (yes(r, "sensitive") ? " (sensitive data)" : ""), v(r, "examples") || "[what it includes]", v(r, "purposes") || "[purposes]",
					use.length ? use.join(", ") : no(r, "sold") && no(r, "ta") && no(r, "prof") ? "None" : "[say which]",
					yes(r, "shared") ? "Yes" : no(r, "shared") ? "No" : "[say whether]"];
				if (ret) row.push(v(r, "retention") || "[retention period or criteria]");
				return row; }) });
		} else b.push({ k: "p", x: "[Add each category of personal data you process.]" });
		if (sens.length) {
			b.push({ k: "p", x: "We process sensitive data (" + joinList(sens.map(usCatName).map(lcFirst)) + ") only with your consent, and the personal data of a known child under 13 only in line with the Children's Online Privacy Protection Act. You can withdraw your consent at any time: " +
				stop(v(s, "usConsentHow") || "[how to withdraw consent]") + " We stop the processing as soon as practicable after you do" + (usWith(s, "rev").length ? ", and within " + Math.min.apply(null, usWith(s, "rev").map(function (st) { return st.rev; })) + " days" : "") + "." });
			if ((usHas(s, "TX") || usHas(s, "LA")) && sens.some(function (r) { return yes(r, "sold"); })) {
				b.push({ k: "p", x: "NOTICE: We may sell your sensitive personal data." });
				if (yes(s, "usBioSale")) b.push({ k: "p", x: "NOTICE: We may sell your biometric personal data." });
			}
		} else if (cats.length && cats.every(function (r) { return v(r, "sensitive"); })) b.push({ k: "p", x: "We do not process sensitive data." });
		if (usWith(s, "llm").length) b.push({ k: "p", x: yes(s, "usLlm") ? "We collect, use or sell personal data to train large language models: " + stop(v(s, "usLlmWhat") || "[which data, and how]") :
			no(s, "usLlm") ? "We do not collect, use or sell personal data for the purpose of training large language models." : "[Say whether you collect, use or sell personal data to train large language models.]" });
		/* Third parties */
		ref.third = H(b, "Who we share it with");
		var tps = arr(s, "usThird");
		if (usAnyRow(s, "shared") || usAnyRow(s, "sold")) {
			var sellCol = usAnyRow(s, "sold");
			b.push(tps.length ? { k: "table", head: ["Category of third party", "What they do with it", "Personal data they receive"].concat(sellCol ? ["We sell to them"] : []),
				rows: tps.map(function (t) { return [v(t, "type") || "[category of third party]", v(t, "what") || "[what they do with it]", v(t, "data") || "[categories of personal data]"].concat(sellCol ? [yes(t, "sold") ? "Yes" : no(t, "sold") ? "No" : "[say whether]"] : []); }) } :
				{ k: "p", x: "[Add each category of third party.]" });
			if (usHas(s, "RI") && usAnyRow(s, "sold")) b.push({ k: "p", x: "For Rhode Island: the third parties to which we have sold customers' personally identifiable information, or to which we plan to sell it, are " + stop(v(s, "usRiBuyers") || "[every such third party]") });
		} else if (usAllNo(s, "shared")) b.push({ k: "p", x: "We do not share personal data with third parties." });
		else b.push({ k: "p", x: "[Say for each category whether it is shared with third parties.]" });
		/* Selling, targeted advertising, profiling */
		ref.optout = H(b, "Selling, targeted advertising and profiling");
		var line = function (k, t) { var w = cats.filter(function (r) { return yes(r, k); }); return w.length ? { b: t, x: stop(joinList(w.map(usCatName))) } : null; };
		if (usOptOut(s)) {
			b.push({ k: "ul", items: [line("sold", "We sell:"), line("ta", "We use for targeted advertising:"),
				line("prof", "We use for profiling in furtherance of decisions that produce legal or similarly significant effects concerning you:")].filter(Boolean) });
			b.push({ k: "p", x: "You can opt out at any time: " + stop(v(s, "usOptOutHow") || "[where to opt out]") });
			if (usAnyRow(s, "sold") || usAnyRow(s, "ta")) b.push({ k: "p", x: yes(s, "usGpc") ? "We treat an opt-out preference signal, such as Global Privacy Control, as a request to opt out of targeted advertising and the sale of your personal data." +
				(v(s, "usGpcHow") ? " " + stop(v(s, "usGpcHow")) : "") : no(s, "usGpc") ? "We do not process opt-out preference signals; use the opt-out above." : "[Say whether you honour opt-out preference signals.]" });
			if (usHas(s, "CO") && usAnyRow(s, "prof")) {
				b.push({ k: "p", x: "How we use profiling (Colorado):" });
				b.push({ k: "ul", items: [
					{ b: "Decisions:", x: stop(v(s, "usProfDecisions") || "[the decisions]") },
					{ b: "Personal data used:", x: stop(joinList(cats.filter(function (r) { return yes(r, "prof"); }).map(usCatName))) },
					{ b: "The logic:", x: stop(v(s, "usProfLogic") || "[plain-language logic]") },
					{ b: "How it is used:", x: stop(v(s, "usProfUse") || "[how profiling is used, including any human involvement]") },
					{ b: "Evaluation:", x: stop(v(s, "usProfEval") || "[any evaluation for accuracy, fairness or bias, and its outcome]") },
					{ b: "Benefits and consequences:", x: stop(v(s, "usProfEffects") || "[benefits and consequences of the decision]") }] });
			}
		} else if (usAllNo(s, "sold") && usAllNo(s, "ta") && usAllNo(s, "prof")) {
			b.push({ k: "p", x: "We do not sell personal data, use it for targeted advertising, or use it for profiling in furtherance of decisions that produce legal or similarly significant effects concerning you." });
		} else b.push({ k: "p", x: "[Say for each category whether it is sold or used for targeted advertising or profiling.]" });
		/* Rights */
		ref.rights = H(b, "Your rights");
		var R = [], q;
		R.push({ b: "Confirm and access.", x: "You can ask whether we process your personal data and get access to it." });
		var cp = usWith(s, "corP");
		if ((q = usQual(s, function (st) { return st.cor; })) !== null) R.push({ b: "Correct.", x: "You can ask us to correct inaccurate personal data" + q + (cp.length ? " (in " + usNames(cp) + ", the data you provided to us)" : "") + "." });
		var dp = usWith(s, "del").filter(function (st) { return st.del === "p"; });
		R.push({ b: "Delete.", x: "You can ask us to delete your personal data" + (dp.length ? " (in " + usNames(dp) + ", the data you provided to us)" : "") + "." });
		var pp = usSt(s).filter(function (st) { return st.port === "p"; }), ps = usWith(s, "portSummary");
		R.push({ b: "Data portability.", x: "You can obtain a copy of your personal data in a portable format" + (pp.length === usSt(s).length && pp.length ? ": the data you provided to us" : pp.length ? " (in " + usNames(pp) + ", the data you provided to us)" : "") +
			(ps.length ? "; in " + usNames(ps) + ", a copy or a representative summary, once a year" : "") + "." });
		var oo = [{ t: "the sale of your personal data", p: function () { return true; } }, { t: "targeted advertising", p: function (st) { return st.ta; } },
			{ t: "profiling in furtherance of decisions that produce legal or similarly significant effects concerning you", p: function (st) { return st.prof; } }];
		R.push({ b: "Opt out.", x: "You can opt out of " + joinList(oo.map(function (o) { var qq = usQual(s, o.p); return qq === null ? "" : o.t + qq; })) + "." });
		var tpS = usSt(s).filter(function (st) { return st.tp === "s"; }), tpC = usSt(s).filter(function (st) { return st.tp === "c"; });
		var tsd = tpS.filter(function (st) { return st.tpSold; }), tds = tpS.filter(function (st) { return !st.tpSold; });
		if (tds.length) R.push({ b: "List of third parties.", x: "You can obtain a list of the specific third parties to which we have disclosed your personal data (residents of " + usNames(tds) + ")." });
		if (tsd.length) R.push({ b: "List of buyers.", x: "You can obtain a list of the third parties to which we have sold your personal data (residents of " + usNames(tsd) + ")." });
		if (tpC.length) R.push({ b: "Categories of third parties.", x: "You can obtain a list of the categories of third parties to which we have disclosed your personal data (residents of " + usNames(tpC) + ")." });
		var qs = usWith(s, "q");
		if (qs.length) R.push({ b: "Question a profiling decision.", x: "If profiling was used for a decision with legal or similarly significant effects on you, you can question the result, be told the reason and review the personal data used (residents of " + usNames(qs) + ")." });
		R.push({ b: "No discrimination.", x: "We do not discriminate against you for exercising these rights." });
		b.push(sts.length ? { k: "ul", items: R } : { k: "p", x: "[Tick the states whose law applies.]" });
		/* How to exercise them */
		ref.how = H(b, "How to exercise your rights");
		var M = [];
		if (has(s, "usMethods", "web")) M.push({ b: "Online:", x: stop(v(s, "usWeb") || "[webform or portal]") });
		if (has(s, "usMethods", "email")) M.push({ b: "By email:", x: stop(v(s, "usEmailReq") || "[email address]") });
		if (has(s, "usMethods", "phone")) M.push({ b: "By telephone:", x: stop(v(s, "usPhone") || "[telephone number]") });
		if (has(s, "usMethods", "mail")) M.push({ b: "By post:", x: stop(v(s, "usMailAddr") || "[postal address]") });
		if (has(s, "usMethods", "person")) M.push({ b: "In person:", x: stop(v(s, "usPerson") || "[where]") });
		b.push(M.length ? { k: "ul", items: M } : { k: "p", x: "[List the methods for submitting requests.]" });
		b.push({ k: "p", x: "We do not ask you to create an account to make a request. How we authenticate your request: " + stop(v(s, "usVerify") || "[the authentication process and what you provide]") });
		if (usOptOut(s)) b.push({ k: "p", x: "An authorised agent can opt out for you" + (v(s, "usAgent") ? ": " + lcFirst(stop(v(s, "usAgent"))) : ".") });
		var r90 = usSt(s).filter(function (st) { return st.resp === 90; });
		b.push({ k: "p", x: "We respond within 45 days" + (r90.length ? " (90 days for residents of " + usNames(r90) + ")" : "") + ". Where necessary we extend this once by 45 days and tell you why within the first period. If we decline a request, we tell you why" + (usWith(s, "app").length ? " and how to appeal" : "") + " within that period. We answer requests free of charge, at least once a year." });
		var ap = usWith(s, "app"), na = usSt(s).filter(function (st) { return !st.app; });
		if (ap.length) {
			var a45 = ap.filter(function (st) { return st.apd === 45; }), aex = ap.filter(function (st) { return st.ape; }), dca = ap.filter(function (st) { return st.cpl === "dca"; }),
				mdc = ap.filter(function (st) { return st.cpl === "mdcpd"; }), cpa = ap.filter(function (st) { return st.cplAll; });
			b.push({ k: "p", x: (na.length ? "If you live in " + orList(ap.map(function (st) { return st.n; })) + ", you" : "You") + " can appeal our decision: " + stop(v(s, "usAppeal") || "[how to appeal]") +
				" We answer in writing, with our reasons, within 60 days" + (a45.length ? " (45 days for residents of " + usNames(a45) + (aex.length ? ", extendable by 60 days in " + usNames(aex) + " with notice of the reasons" : "") + ")" : "") +
				". " + (cpa.length ? "When we answer an appeal from a resident of " + orList(cpa.map(function (st) { return st.n; })) + ", and whenever we deny an appeal" : "If we deny your appeal") + ", we tell you how to submit a complaint to your state's Attorney General" +
				(dca.length || mdc.length ? " (" + [mdc.length ? "in Maryland, its Consumer Protection Division" : "", dca.length ? "in New Jersey, the Division of Consumer Affairs" : ""].filter(Boolean).join("; ") + ")" : "") + "." });
		}
		if (usHas(s, "OR")) b.push({ k: "p", x: "For Oregon: we do business as " + stop(v(s, "usOrNames") || "[registered business name and any assumed name used in Oregon]") });
		if (usWith(s, "chg").length) b.push({ k: "p", x: "If we make a material change to this notice or to how we process personal data, we tell you " + lcFirst(stop(v(s, "usChangeHow") || "[how you notify material changes]")) +
			" Where the change concerns personal data we already hold, we give you a reasonable opportunity to withdraw your consent first." });
		return b;
	}

	function usChecks(s, led) {
		var checks = [], delivery = [], cats = usCats(s), sts = usSt(s), sens = usSens(s);
		var bad = function (f) { return !cats.length || cats.some(f); };
		checks.push(sts.length ? chk("M00", "check", "Each law applies on its own thresholds. " + sts.map(function (st) { return st.n + ": " + st.scope + "."; }).join(" ") +
			(sts.some(function (st) { return st.src === "s"; }) ? " Read from secondary sources only, so confirm against the official text: " + usNames(sts.filter(function (st) { return st.src === "s"; })) + "." : "") +
			" Consumers are residents acting in a personal or household capacity; these laws exclude employees, job applicants and business contacts. Each act has its own exemptions, for example for nonprofits, financial institutions and HIPAA entities.") :
			chk("M00", "missing", "Tick the states whose law applies."));
		checks.push(bad(function (r) { return !v(r, "cat") || !v(r, "examples") || !v(r, "sensitive"); }) ? chk("M01", "missing", "Add every category of personal data, what it includes, and whether it is sensitive.") : chk("M01", "ok"));
		checks.push(bad(function (r) { return !v(r, "purposes"); }) ? chk("M02", "missing", "Give the purposes for each category.") : chk("M02", "ok"));
		var geoBan = usWith(s, "geoBan"), geoSold = cats.some(function (r) { return yes(r, "geo") && yes(r, "sold"); });
		if (!cats.length) checks.push(chk("M03", "missing", "Add the categories first."));
		else if (geoSold && geoBan.length) checks.push(chk("M03", "missing", "Selling precise geolocation data is prohibited in " + joinList(geoBan.map(function (st) { return st.n + " (" + st.geoBan + ")"; })) + "."));
		else if (!sens.length) checks.push(chk("M03", "ok", "No sensitive category listed: the notice says no sensitive data is processed."));
		else if (usHas(s, "MD") && sens.some(function (r) { return yes(r, "sold"); })) checks.push(chk("M03", "missing", "Maryland prohibits selling sensitive data (14-4707(a)(2))."));
		else if (!v(s, "usConsentHow")) checks.push(chk("M03", "missing", "Say how people withdraw consent to the processing of sensitive data."));
		else checks.push(chk("M03", usHas(s, "MD") ? "warn" : "ok", usHas(s, "MD") ? "Maryland allows collecting, processing or sharing sensitive data only where strictly necessary to provide or maintain a product or service the consumer requested (14-4707(a)(1)); consent is not enough." :
			"Obtain consent before processing. Utah and Iowa ask only for notice and an opportunity to opt out; consent meets both."));
		var shared = usAnyRow(s, "shared") || usAnyRow(s, "sold"), tps = arr(s, "usThird"), detail = usHas(s, "CO") || usHas(s, "MD") || usHas(s, "OR");
		checks.push(bad(function (r) { return !v(r, "shared"); }) ? chk("M04", "missing", "Say for each category whether it is shared with third parties.") :
			!shared ? chk("M04", "ok", "The notice says no personal data is shared with third parties.") :
			!tps.length || tps.some(function (t) { return !v(t, "type") || !v(t, "data") || (detail && !v(t, "what")); }) ? chk("M04", "missing", "Add each category of third party with the data it receives" + (detail ? ", and what it does with it (Colorado, Maryland, Oregon)" : "") + ".") :
			usAnyRow(s, "sold") && (tps.some(function (t) { return !v(t, "sold"); }) || !tps.some(function (t) { return yes(t, "sold"); })) ?
				chk("M04", usWith(s, "soldTP").length ? "missing" : "warn", "Say which categories of third parties buy personal data" + (usWith(s, "soldTP").length ? " (" + usNames(usWith(s, "soldTP")) + " require the categories of third parties it is sold to)" : "") + ".") : chk("M04", "ok"));
		checks.push(bad(function (r) { return !v(r, "sold") || !v(r, "ta") || !v(r, "prof"); }) ? chk("M05", "missing", "Say for each category whether it is sold or used for targeted advertising or profiling.") :
			usOptOut(s) && !v(s, "usOptOutHow") ? chk("M05", "missing", "Give where people opt out.") : chk("M05", "ok", usOptOut(s) ? "" : "The notice states there is no selling, targeted advertising or significant profiling."));
		var uo = sts.filter(function (st) { return st.uoom && st.uoom !== "cond" && st.uoom !== "agent"; }), uoc = sts.filter(function (st) { return st.uoom === "cond"; }), uoa = sts.filter(function (st) { return st.uoom === "agent"; });
		var uoNote = (uoc.length ? usNames(uoc) + ": honour a signal sent through a browser setting, extension or device setting as an authorised agent's opt-out where you can verify the consumer and you already honour such signals for another state's law (for example Texas 541.055(e))." : "") +
			(uoa.length ? (uoc.length ? " " : "") + "Maryland: honour an opt-out sent by an authorised agent through a global device setting once you authenticate the consumer and the agent (14-4706(b)); a link or a signal is one way to meet 14-4707(f)(1)." : "");
		if (!(usAnyRow(s, "sold") || usAnyRow(s, "ta"))) checks.push(chk("M06", "na", "No selling or targeted advertising."));
		else if (!v(s, "usGpc")) checks.push(chk("M06", "missing", "Say whether you honour opt-out preference signals."));
		else if (no(s, "usGpc") && uo.length) checks.push(chk("M06", "missing", "Opt-out preference signals must be honoured in " + joinList(uo.map(function (st) { return st.n + " (from " + fmtDate(st.uoom) + ")"; })) + "."));
		else if (yes(s, "usGpc") && usHas(s, "CO") && !v(s, "usGpcHow")) checks.push(chk("M06", "missing", "Colorado asks the notice to explain how opt-out preference signals are processed (Rule 6.03(A)(4)(e))."));
		else checks.push(chk("M06", "ok", uoNote));
		var noApp = sts.filter(function (st) { return !st.app; });
		checks.push(sts.length ? chk("M07", "ok", "Rights listed with the states that give them." + (noApp.length ? " " + usNames(noApp) + (noApp.length > 1 ? " give" : " gives") + " no appeal right." : "") + (usHas(s, "DE") ? " From 1 January 2027 Delaware gives a list of the specific third parties, access to inferences and whether profiling is used for significant decisions (12D-104 as amended)." : "")) :
			chk("M07", "missing", "Tick the states first."));
		var meth = arr(s, "usMethods"), mdet = { web: "usWeb", email: "usEmailReq", phone: "usPhone", mail: "usMailAddr", person: "usPerson" };
		checks.push(!meth.length || meth.some(function (m) { return !v(s, mdet[m]); }) ? chk("M08", "missing", "Choose the methods and give the details of each.") :
			usWith(s, "two").length && meth.length < 2 ? chk("M08", "missing", usNames(usWith(s, "two")) + " require two or more methods (for example Texas 541.055(a)).") :
			usWith(s, "two").length && has(s, "channel", "web") && meth.indexOf("web") === -1 && !(yes(s, "usOnlineOnly") && meth.indexOf("email") !== -1) ?
				chk("M08", "missing", usNames(usWith(s, "two")) + ": with a website, offer a mechanism on it; an email address is enough only for a business that operates exclusively online with a direct relationship (for example Texas 541.055(c), (d)).") : chk("M08", "ok"));
		checks.push(v(s, "usVerify") ? chk("M09", "ok") : chk("M09", usHas(s, "CO") ? "missing" : "warn", "Describe how you authenticate requests" + (usHas(s, "CO") ? " (Colorado Rule 6.03(A)(4)(d))." : ".")));
		checks.push(!usOptOut(s) ? chk("M10", "na", "No opt-out processing.") : v(s, "usAgent") ? chk("M10", "ok", usWith(s, "noAgent").length ? usNames(usWith(s, "noAgent")) + (usWith(s, "noAgent").length > 1 ? " have" : " has") + " no authorised agent provision; accepting agents there is a choice." : "") :
			chk("M10", usHas(s, "CO") ? "missing" : "warn", "Say how an authorised agent submits an opt-out request" + (usHas(s, "CO") ? " (Colorado Rule 6.03(A)(4)(b))." : ".")));
		checks.push(!usWith(s, "app").length ? chk("M11", "na", "No ticked state gives an appeal right.") : v(s, "usAppeal") ? chk("M11", "ok", "Make the appeal process conspicuously available and similar to the request process.") : chk("M11", "missing", "Say how people appeal."));
		var ct = usWith(s, "contact");
		checks.push(!ct.length ? chk("M12", "ok") : v(s, "ctrlEmail") ? chk("M12", "ok") : chk("M12", "missing", "Give an active email address or other online contact (" + usNames(ct) + ")."));
		var dt = usWith(s, "date");
		checks.push(!dt.length ? chk("M13", "ok") : v(s, "effective") ? chk("M13", "ok", "Shown as the date last updated" + (usWith(s, "mmyy").length ? "; " + usNames(usWith(s, "mmyy")) + " ask for the month and year" : "") + (usHas(s, "NJ") ? "; for New Jersey the date is also given as the effective date" : "") + ".") : chk("M13", "missing", "Give the date the notice was last updated (" + usNames(dt) + ")."));
		var cg = usWith(s, "chg");
		checks.push(!cg.length ? chk("M14", "na", "No ticked state requires it.") : v(s, "usChangeHow") ? chk("M14", "ok") : chk("M14", "missing", "Say how you notify material changes (" + usNames(cg) + ")."));
		var lm = usWith(s, "llm");
		checks.push(!lm.length ? chk("M15", "na", "No ticked state requires it.") : !v(s, "usLlm") || (yes(s, "usLlm") && !v(s, "usLlmWhat")) ? chk("M15", "missing", "Say whether you collect, use or sell personal data to train large language models (" + lm.map(function (st) { return st.n + " from " + fmtDate(st.llm); }).join(", ") + ").") : chk("M15", "ok"));
		checks.push(!usHas(s, "MN") ? chk("M16", "na", "Minnesota not ticked.") : bad(function (r) { return !v(r, "retention"); }) ? chk("M16", "missing", "Minnesota: give the retention period or criteria for each category.") :
			cats.some(function (r) { return D.LINT.vagueRetention.test(v(r, "retention")); }) ? chk("M16", "missing", "\"As long as necessary\" is not a retention policy. Say how long, or what decides it.") : chk("M16", "ok"));
		if (usHas(s, "OR")) checks.push(v(s, "usOrNames") ? chk("M17", "ok") : chk("M17", "missing", "Oregon: give your registered business name and any assumed name used in Oregon."));
		if (usHas(s, "RI") && usAnyRow(s, "sold")) checks.push(v(s, "usRiBuyers") ? chk("M18", "ok") : chk("M18", "missing", "Rhode Island: name every third party to which you have sold, or may sell, personally identifiable information."));
		if ((usHas(s, "TX") || usHas(s, "LA")) && sens.some(function (r) { return yes(r, "sold"); }))
			checks.push(v(s, "usBioSale") ? chk("M19", "ok", "The notices use the statutory wording, including \"may\", and are placed in the same location and manner as the notice.") : chk("M19", "missing", "Say whether you sell biometric data."));
		if (usHas(s, "CO") && usAnyRow(s, "prof"))
			checks.push(v(s, "usProfDecisions") && v(s, "usProfLogic") && v(s, "usProfUse") && v(s, "usProfEval") && v(s, "usProfEffects") ? chk("M20", "ok") :
				chk("M20", "missing", "Colorado: give the decisions, the logic, how profiling is used with any human involvement, any evaluation and its outcome, and the benefits and consequences (Rule 9.03(A))."));
		var tn = usWith(s, "teen");
		if (tn.length && (usAnyRow(s, "sold") || usAnyRow(s, "ta") || usAnyRow(s, "prof"))) checks.push(chk("M21", "check", "Rules on minors: " + tn.map(function (st) { return st.n + ": " + st.teen + "."; }).join(" ")));
		if (/^(employee|applicant|client)$/.test(v(s, "audience"))) checks.push(chk("M28", "missing", "The state consumer privacy laws other than California do not cover people acting in an employment or commercial context, so they do not apply to this audience. Untick Other US states, or write a separate notice for consumers."));
		var later = usLater(s);
		if (later.length) checks.push(chk("M23", "check", "Not yet in force on the notice date: " + later.map(function (st) { return st.n + " (" + fmtDate(st.eff) + ")"; }).join(", ") + ". The notice can cover them now; the duties apply from those dates."));
		if (!led) {
			var cw = [];
			if (pnActs(s).some(function (a) { return art9Of(s, a); }) && !sens.length) cw.push("A purpose uses special category data, but no US category is marked sensitive.");
			if (arr(s, "recipients").some(function (r) { return v(r, "role") === "controller" || v(r, "role") === "joint"; }) && usAllNo(s, "shared") && usAllNo(s, "sold")) cw.push("A recipient is an independent or joint controller, while every US category says not shared or sold.");
			if (yes(s, "adm") && usAllNo(s, "prof")) cw.push("The notice describes a decision based solely on automated processing; check whether it is profiling for decisions with legal or similarly significant effects.");
			checks.push(cw.length ? chk("M24", "warn", cw.join(" ")) : chk("M24", "ok", "No contradiction found between the US section and the rest of the notice."));
		}
		var lk = usWith(s, "link"), lg = usWith(s, "lang"), ac = usWith(s, "acc");
		delivery.push(chk("M25", "check", "Publish the notice through a conspicuous link using the word \"privacy\" on the homepage, and on the app store or download page and in the app settings menu" + (lk.length ? " (" + usNames(lk) + ")" : "") + "; without a website, through the usual channel, including mail." +
			(lg.length ? " Publish it in each language in which you offer the products or services (" + usNames(lg) + ")." : "") + (ac.length ? " Make it accessible to people with disabilities (" + usNames(ac) + ")." : "")));
		if (usOptOut(s)) {
			var ol = usWith(s, "optLink"), ou = usWith(s, "out");
			delivery.push(chk("M26", "check", "Disclose selling, targeted advertising and profiling clearly and conspicuously." + (ol.length ? " Put a clear and conspicuous opt-out link on the website (" + usNames(ol) + ")." : "") +
				(ou.length ? " Give a clear and conspicuous opt-out method outside the notice as well, for example a link titled \"Your Opt-Out Rights\" or \"Your Privacy Rights\" (" + usNames(ou) + ")." : "") +
				(uo.length ? " Honour opt-out preference signals (" + joinList(uo.map(function (st) { return st.n + " from " + fmtDate(st.uoom); })) + ")." : "") + (uoNote ? " " + uoNote : "")));
		}
		if (sens.length) {
			var rv = usWith(s, "rev"), byDays = {};
			rv.forEach(function (st) { (byDays[st.rev] = byDays[st.rev] || []).push(st); });
			delivery.push(chk("M27", "check", "Obtain consent before processing sensitive data, through a clear affirmative act, and make withdrawal as easy as giving consent" +
				(rv.length ? "; after a withdrawal, stop " + Object.keys(byDays).sort(function (a, b) { return a - b; }).map(function (d) { return "within " + d + " days in " + usNames(byDays[d]); }).join("; ") : "") + "."));
		}
		return { checks: checks, delivery: delivery };
	}

	/* A document led by the US state laws: the privacy notice those laws require. */
	function usLead(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]";
		var aud = v(s, "audience");
		var title = (AUD_TITLE[aud] || (v(s, "audienceOther") ? "Privacy notice for " + lcFirst(v(s, "audienceOther")) : "Privacy notice")).replace("Privacy notice", "Privacy policy");
		var meta = [ctrl];
		if (v(s, "version")) meta.push("Version " + v(s, "version"));
		meta.push((usHas(s, "NJ") ? "Effective and last updated " : "Last updated ") + (fmtDate(v(s, "effective")) || "[date]"));
		var n = 2, ref = {};
		var H = function (b, t) { var k = n++; b.push({ k: "h2", x: k + ". " + t }); return k; };
		var body = usBody(s, H, ref);
		var sts = usSt(s);
		var first = [{ k: "p", x: ctrl + " is responsible for this policy, which covers the personal data of residents of " + (sts.length ? usNames(sts) : "[the states whose law applies]") + " under their state consumer privacy laws." + (v(s, "ctrlEmail") ? " Contact: " + v(s, "ctrlEmail") + "." : "") }];
		if (usCats(s).length) first.push({ k: "p", x: "We process these categories of personal data:" }, { k: "ul", items: usCats(s).map(usCatName) });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		var acts = [usAnyRow(s, "sold") ? "sell personal data" : "", usAnyRow(s, "ta") ? "use personal data for targeted advertising" : "", usAnyRow(s, "prof") ? "use personal data for profiling in furtherance of decisions with legal or similarly significant effects" : ""].filter(Boolean);
		first.push({ k: "p", x: usOptOut(s) ? "We " + joinList(acts) + ". You can opt out: " + stop(v(s, "usOptOutHow") || "[where to opt out]") :
			usAllNo(s, "sold") && usAllNo(s, "ta") && usAllNo(s, "prof") ? "We do not sell personal data or use it for targeted advertising or significant profiling." : "[Say whether you sell personal data or use it for targeted advertising or profiling.]" });
		var rr = ["access"];
		if (usQual(s, function (st) { return st.cor; }) !== null) rr.push("correct");
		rr.push("delete", "obtain a copy of");
		first.push({ k: "p", x: "You have the right to " + joinList(rr) + " your personal data, to opt out" + (usWith(s, "app").length ? ", and to appeal our decisions" : "") + ", as set out in section " + ref.rights + ". Section " + ref.how + " explains how." });
		var blocks = [{ k: "h1", x: title }, { k: "meta", x: meta.map(stop).join(" ") }, { k: "box", title: "In short", blocks: first }];
		blocks.push({ k: "h2", x: "1. Who we are and how to contact us" });
		var who = [ctrl];
		if (v(s, "ctrlAddress")) who.push(v(s, "ctrlAddress").replace(/\n+/g, ", "));
		blocks.push({ k: "p", x: stop(who.join(", ")) });
		var chans = [];
		if (v(s, "ctrlEmail")) chans.push({ b: "Email:", x: v(s, "ctrlEmail") });
		if (v(s, "ctrlPhone")) chans.push({ b: "Telephone:", x: v(s, "ctrlPhone") });
		if (chans.length) blocks.push({ k: "ul", items: chans });
		blocks.push({ k: "p", x: "This policy applies to residents of these states, under these laws:" });
		blocks.push(sts.length ? { k: "ul", items: sts.map(function (st) { return { b: st.n + ":", x: st.law + " (" + st.cite + ")" + (st.eff > (usDateOf(s) || "0") && usDateOf(s) ? ", from " + fmtDate(st.eff) : "") + "." }; }) } : { k: "p", x: "[Tick the states whose law applies.]" });
		Array.prototype.push.apply(blocks, body);
		blocks.push({ k: "h2", x: n + ". Changes to this policy" });
		blocks.push({ k: "p", x: "We review this policy at least once a year. " + (usHas(s, "NJ") ? "Effective and last updated " : "Last updated ") + (fmtDate(v(s, "effective")) || "[date]") + "." });
		if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });
		var uc = usChecks(s, true), checks = uc.checks;
		var lintHits = lintText(blocks);
		checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "CO Rule 6.02(D)(1); WP260 13") :
			chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "CO Rule 6.02(D)(1); WP260 13"));
		return { title: title, file: slug(ctrl + " " + title), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(uc.delivery), docLabel: "Policy" };
	}

	/* A California-led document: the privacy policy, with the notice at collection inside it. */
	function caLead(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]";
		var aud = v(s, "audience");
		var title = (AUD_TITLE[aud] || (v(s, "audienceOther") ? "Privacy notice for " + lcFirst(v(s, "audienceOther")) : "Privacy notice")).replace("Privacy notice", "Privacy policy");
		var meta = [ctrl];
		if (v(s, "version")) meta.push("Version " + v(s, "version"));
		meta.push("Last updated " + (fmtDate(v(s, "effective")) || "[date]"));
		var n = 2, ref = {};
		var H = function (b, t) { var k = n++; b.push({ k: "h2", x: k + ". " + t }); return k; };
		var body = caBody(s, H, ref);
		var cats = caCats(s), names = [];
		cats.forEach(function (r) { var c = caCat(r); if (c && names.indexOf(c.n) === -1) names.push(c.n); });
		var first = [{ k: "p", x: ctrl + " is responsible for this policy, which covers the personal information of California residents under the California Consumer Privacy Act (CCPA)." + (v(s, "ctrlEmail") ? " Contact: " + v(s, "ctrlEmail") + "." : "") }];
		if (names.length) first.push({ k: "p", x: "We collect these categories of personal information:" }, { k: "ul", items: names });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		first.push({ k: "p", x: caSells(s) ? "We sell or share personal information. You can tell us to stop: " + stop(v(s, "caOptOutLink") || "[where to opt out]") :
			caNoSell(s) ? "We do not sell or share personal information." : "[Say whether you sell or share personal information.]" });
		first.push({ k: "p", x: "You have the right to know, delete and correct your personal information" + (caSells(s) ? ", to opt out of its sale or sharing" : "") +
			(caLimit(s) ? ", to limit the use of your sensitive personal information" : "") + (yes(s, "caAdmt") ? ", to access" + (caAdmtOptOut(s) ? " and opt out of" : "") + " automated decisionmaking technology" : "") +
			", and not to be retaliated against for using these rights. Section " + ref.how + " explains how." });
		if (inReg(s, "us")) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + n + " also applies to you." });
		var blocks = [{ k: "h1", x: title }, { k: "meta", x: meta.map(stop).join(" ") }, { k: "box", title: "In short", blocks: first }];
		blocks.push({ k: "h2", x: "1. Who we are and how to contact us" });
		var who = [ctrl];
		if (v(s, "ctrlAddress")) who.push(v(s, "ctrlAddress").replace(/\n+/g, ", "));
		blocks.push({ k: "p", x: stop(who.join(", ")) });
		var chans = [];
		if (v(s, "ctrlEmail")) chans.push({ b: "Email:", x: v(s, "ctrlEmail") });
		if (v(s, "ctrlPhone")) chans.push({ b: "Telephone:", x: v(s, "ctrlPhone") });
		if (chans.length) blocks.push({ k: "ul", items: chans });
		blocks.push({ k: "p", x: "Contact us with any question or concern about this policy or how we handle personal information." });
		Array.prototype.push.apply(blocks, body);
		var usRes = null;
		if (inReg(s, "us")) {
			var usN = n++;
			blocks.push({ k: "h2", x: usN + ". Additional information for residents of other US states" });
			blocks.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the states whose law applies]") + ", your state's consumer privacy law applies to your personal data. This section is the privacy notice those laws require, and your rights under them are the ones set out here. Sections " + joinList([ref.rights, ref.how].filter(Boolean).map(String)) + " apply to California residents." });
			Array.prototype.push.apply(blocks, usBody(s, function (b, t) { b.push({ k: "h3", x: t }); return null; }, {}));
			usRes = usChecks(s, false);
		}
		blocks.push({ k: "h2", x: n + ". Changes to this policy" });
		blocks.push({ k: "p", x: "We review this policy and update it at least once every 12 months. Before we collect a new category of personal information or use it for an incompatible purpose, we give you a new notice at collection. Last updated " + (fmtDate(v(s, "effective")) || "[date]") + "." });
		if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });
		var cc = caChecks(s, true), checks = cc.checks;
		if (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(cc.delivery, usRes.delivery); }
		var lintHits = lintText(blocks);
		checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "Regs 7003(a); WP260 13") :
			chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "Regs 7003(a); WP260 13"));
		return { title: title, file: slug(ctrl + " " + title), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(cc.delivery), docLabel: "Policy" };
	}

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
		if (inReg(s, "can")) num.can = c++;
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
		var R = { rights: "section " + num.rights, kids: "Sections 2 and " + num.rights };
		var blocks = [{ k: "h1", x: title }, { k: "meta", x: meta.map(stop).join(" ") }];

		var first = [{ k: "p", x: ctrl + " is responsible for the personal data described in this notice (the controller), under Brazil's General Data Protection Law (LGPD)." + (v(s, "ctrlEmail") ? " Contact: " + v(s, "ctrlEmail") + "." : "") }];
		first.push({ k: "p", x: brEncNeeded(s) ? "Our data protection officer (encarregado): " + brEncWho(s) + ", " + (v(s, "brEncContact") || "[contact details]") + "." :
			"To contact us about your data: " + (v(s, "brChannel") || "[the communication channel]") + "." });
		if (acts.length) first.push({ k: "p", x: "We use your personal data to:" }, { k: "ul", items: acts.map(function (a) { return v(a, "purpose") || "[purpose]"; }) });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		if (num.req && brCondActs(s).length) first.push({ k: "p", x: "Section " + num.req + " says which data you must provide for our products or services, and what happens if you do not." });
		first.push({ k: "p", x: "You have rights over your data: to confirm that we process it, to access and correct it, to have it anonymised, blocked or deleted, to move it, to know who we share it with, to refuse or withdraw consent, to object, to have automated decisions reviewed, and to petition the ANPD. Section " + num.rights + " explains how." });
		if (num.can) first.push({ k: "p", x: "If you are in Canada, section " + num.can + " also applies to you. Our person accountable for privacy in Canada: " + canPic(s) + ", " + stop(canPicContact(s)) });
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
		var canRes = null;
		if (num.can) {
			blocks.push({ k: "h2", x: num.can + ". Additional information for people in Canada" });
			Array.prototype.push.apply(blocks, canSection(s, [num.rights, num.consent, num.complaints], "LGPD", num.adm));
			canRes = canChecks(s, false);
		}
		var inRes = null;
		if (num.in) {
			blocks.push({ k: "h2", x: num.in + ". Additional information for people in India" });
			Array.prototype.push.apply(blocks, inSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));
			inRes = inChecks(s, false);
		}
		var cnRes = null;
		if (num.cn) {
			blocks.push({ k: "h2", x: num.cn + ". Additional information for people in China" });
			Array.prototype.push.apply(blocks, cnSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));
			cnRes = cnChecks(s, false);
		}
		var jpRes = null;
		if (num.jp) {
			blocks.push({ k: "h2", x: num.jp + ". Additional information for people in Japan" });
			Array.prototype.push.apply(blocks, jpSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));
			jpRes = jpChecks(s, false);
		}
		var krRes = null;
		if (num.kr) {
			blocks.push({ k: "h2", x: num.kr + ". Additional information for people in Korea" });
			Array.prototype.push.apply(blocks, krSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));
			krRes = krChecks(s, false);
		}
		var sgRes = null;
		if (num.sg) {
			blocks.push({ k: "h2", x: num.sg + ". " + sgHead(s) });
			Array.prototype.push.apply(blocks, sgSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));
			sgRes = sgChecks(s, false);
		}
		var auRes = null;
		if (num.au) {
			blocks.push({ k: "h2", x: num.au + ". " + auHead(s) });
			Array.prototype.push.apply(blocks, auSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));
			auRes = auChecks(s, false);
		}
		var zaRes = null;
		if (num.za) {
			blocks.push({ k: "h2", x: num.za + ". " + zaHead(s) });
			Array.prototype.push.apply(blocks, zaSection(s, [num.rights, num.consent, num.complaints], "the LGPD"));
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
		if (canRes) { Array.prototype.push.apply(checks, canRes.checks); Array.prototype.push.apply(delivery, canRes.delivery); }
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

	/* ========================================================= JAPAN === */
	/* Japan (matrix Part R): the Act on the Protection of Personal Information (APPI, Act No. 57 of 2003),
	   its Enforcement Order and Enforcement Rules, read in Japanese on e-Gov on 12 November 2026 (version in
	   force on 2 November 2026; notes in build/jp/notes.md). The 2026 amendment (Act No. 56 of 2026) is not
	   in force and not modelled (row T18). The Japanese text is authentic; the notice wording is a translation.
	   Independent review of 12 November 2026: 27 findings, all applied (build/review-2026-11-12-jp). */
	function jpOn(s) { return inReg(s, "jp"); }
	/* Strip a final full stop, but not one that ends an abbreviation such as "Co." or "K.K." (review R17). */
	function jpTrim(x) { x = String(x).replace(/\s+$/, ""); return /(\b(co|ltd|inc|corp|pte|pvt|plc|llc|gmbh|jr|sr|st|etc)|(^|[^A-Za-z])[A-Za-z])\.$/i.test(x) ? x : x.replace(/[.]$/, ""); }
	function jpDot(x) { x = jpTrim(x); return /[.!?]$/.test(x) ? x : x + "."; }
	function jpRef(x, ref) { return jpTrim(x) + " (" + ref + ")."; }
	/* Places: Japan (cities, the 47 prefectures, and the characters for Japan, Tokyo, Osaka, Kyoto, Hokkaido and
	   "prefecture") and outside Japan (countries, regions and large foreign cities). A mixed entry counts as
	   abroad (review R16). */
	var JP_JP = /\b(japan|nippon|nihon|tokyo|osaka|kyoto|yokohama|nagoya|sapporo|fukuoka|kobe|sendai|hiroshima|kawasaki|saitama|chiba|kitakyushu|sakai|niigata|hamamatsu|kumamoto|sagamihara|okayama|shizuoka|hokkaido|aomori|iwate|miyagi|akita|yamagata|fukushima|ibaraki|tochigi|gunma|kanagawa|toyama|ishikawa|fukui|yamanashi|nagano|gifu|aichi|mie|shiga|hyogo|nara|wakayama|tottori|shimane|yamaguchi|tokushima|kagawa|ehime|kochi|saga|nagasaki|oita|miyazaki|kagoshima|okinawa)\b|\u65e5\u672c|\u6771\u4eac|\u5927\u962a|\u4eac\u90fd|\u5317\u6d77\u9053|\u770c/i;
	var JP_FOR = /\b(afghanistan|albania|algeria|andorra|angola|antigua|argentina|armenia|australia|austria|azerbaijan|bahamas|bahrain|bangladesh|barbados|belarus|belgium|belize|benin|bhutan|bolivia|bosnia|botswana|brazil|brunei|bulgaria|burkina|burundi|cambodia|cameroon|canada|cabo verde|cape verde|chad|chile|china|colombia|comoros|congo|costa rica|croatia|cuba|cyprus|czech(ia| republic)?|denmark|djibouti|dominica|dominican|ecuador|egypt|el salvador|eritrea|estonia|eswatini|ethiopia|fiji|finland|france|gabon|gambia|georgia|germany|ghana|greece|grenada|guatemala|guinea|guyana|haiti|honduras|hong kong|hungary|iceland|india|indonesia|iran|iraq|ireland|israel|italy|ivory coast|jamaica|jordan|kazakhstan|kenya|kiribati|korea|kosovo|kuwait|kyrgyzstan|laos|latvia|lebanon|lesotho|liberia|libya|liechtenstein|lithuania|luxembourg|macao|macau|madagascar|malawi|malaysia|maldives|mali|malta|mauritania|mauritius|mexico|micronesia|moldova|monaco|mongolia|montenegro|morocco|mozambique|myanmar|namibia|nauru|nepal|netherlands|holland|new zealand|nicaragua|niger|nigeria|north macedonia|norway|oman|pakistan|palau|palestine|panama|papua|paraguay|peru|philippines|poland|portugal|qatar|romania|russia|rwanda|samoa|san marino|saudi|senegal|serbia|seychelles|sierra leone|singapore|slovakia|slovenia|solomon islands|somalia|south africa|spain|sri lanka|sudan|suriname|sweden|switzerland|syria|taiwan|tajikistan|tanzania|thailand|timor|togo|tonga|trinidad|tunisia|turkey|turkiye|turkmenistan|tuvalu|uganda|ukraine|united arab emirates|united kingdom|britain|england|scotland|wales|united states|america|uruguay|uzbekistan|vanuatu|vatican|venezuela|viet ?nam|yemen|zambia|zimbabwe|europe|european union|asia|africa|oceania|abroad|overseas|outside japan|worldwide|seoul|busan|beijing|shanghai|shenzhen|guangzhou|taipei|bangkok|jakarta|manila|kuala lumpur|hanoi|ho chi minh|saigon|delhi|mumbai|bengaluru|bangalore|chennai|hyderabad|sydney|melbourne|auckland|london|paris|berlin|frankfurt|munich|amsterdam|dublin|madrid|barcelona|rome|milan|zurich|geneva|vienna|stockholm|copenhagen|oslo|helsinki|brussels|warsaw|prague|lisbon|new york|san francisco|los angeles|seattle|chicago|boston|washington|virginia|oregon|california|texas|ohio|iowa|toronto|vancouver|montreal|sao paulo|mexico city|dubai|tel aviv|istanbul|johannesburg|cape town|cairo|nairobi|lagos|moscow)\b/i;
	function jpForeign(w) { w = String(w || ""); return JP_FOR.test(w) || /(^|[^A-Za-z])(US|USA|U\.S\.(A\.)?|UK|EU|EEA)([^A-Za-z]|$)/.test(w); }
	function jpWhere(w) { w = String(w || "").trim(); return !w ? "" : jpForeign(w) ? "abroad" : JP_JP.test(w) ? "jp" : "unknown"; }
	/* Designated countries: the EEA states and the United Kingdom (PPC Notice No. 1 of 2019; review R07, R16). */
	var JP_DESIG = /\b(austria|belgium|bulgaria|croatia|cyprus|czech(ia| republic)?|denmark|estonia|finland|france|germany|greece|hungary|iceland|ireland|italy|latvia|liechtenstein|lithuania|luxembourg|malta|netherlands|holland|norway|poland|portugal|romania|slovakia|slovenia|spain|sweden|united kingdom|britain|england|scotland|wales)\b/i;
	function jpUkName(c) { return /\b(united kingdom|britain|england|scotland|wales|northern ireland)\b/i.test(c) || /(^|[^A-Za-z])UK([^A-Za-z]|$)/.test(c); }
	function jpDesig(c) { return JP_DESIG.test(c) || jpUkName(c); }
	/* Lower-case a reason or purpose only where it does not start with a proper noun (review R17). */
	function jpLc(x) {
		x = String(x); var w = x.split(/\s+/), f = w[0].replace(/[^A-Za-z]+$/, "");
		return /^[A-Z][a-z]+$/.test(f) && !JP_JP.test(f) && !jpForeign(f) && !(w[1] && /^[A-Z]/.test(w[1])) ? lcFirst(x) : x;
	}
	function jpKey(x) { return String(x || "").toLowerCase().replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, " ").trim(); }
	function jpSame(a, b) { a = jpKey(a); b = jpKey(b); return !!a && !!b && (a === b || (Math.min(a.length, b.length) >= 4 && (a.indexOf(b + " ") === 0 || b.indexOf(a + " ") === 0))); }
	function jpSensActs(s) { return jpOn(s) ? pnActs(s).filter(function (a) { return yes(a, "jpSens"); }) : []; }
	function jpOthers(s) { return arr(s, "recipients").filter(function (r) { var ro = v(r, "role"); return ro === "controller" || ro === "joint" || ro === "authority"; }); }
	function jpEntrusted(s) { return arr(s, "recipients").filter(function (r) { return v(r, "role") === "processor"; }); }
	function jpNoRole(s) { return arr(s, "recipients").filter(function (r) { return !v(r, "role"); }); }
	function jpProv(s, k) { return jpOthers(s).filter(function (r) { return v(r, "jpProv") === k; }); }
	function jpXrows(s) { return yes(s, "jpAbroad") ? arr(s, "jpXrows") : []; }
	function jpRecAbroad(s) { return arr(s, "recipients").filter(function (r) { return jpWhere(v(r, "where")) === "abroad"; }); }
	function jpOffshore(s) { return v(s, "jpScope") === "abroad"; }
	function jpRightsWay(s) { return v(s, "jpReqHow") || v(s, "rightsContact") || v(s, "ctrlEmail"); }
	function jpNamesAt(list) { return joinList(list.map(function (r) { return jpTrim(v(r, "who") || "[recipient]") + " (" + v(r, "where") + ")"; })); }
	/* Is the provision to this foreign-list recipient covered under Article 27 (entrustment or a basis given)? (review R08) */
	function jpArt27(s, x) {
		return arr(s, "recipients").some(function (r) { var ro = v(r, "role");
			return jpSame(v(r, "who"), v(x, "recipient")) && (ro === "processor" || ((ro === "controller" || ro === "joint" || ro === "authority") && !!lbl(D.JP_PROV, v(r, "jpProv")))); });
	}
	/* Address with the country for a business abroad (Article 32(1)(i); Guidelines 3-8-1 note 2; review R02). */
	function jpAddr(s) {
		var a = v(s, "ctrlAddress").replace(/\n+/g, ", ").trim(), w = v(s, "jpOffWhere").trim();
		if (!a || !jpOffshore(s)) return a;
		if (w) return a.toLowerCase().indexOf(w.replace(/^the\s+/i, "").toLowerCase()) === -1 ? a + ", " + w : a;
		return jpForeign(a) ? a : a + ", [country]";
	}
	/* Article 32(1)(i): a corporation's representative, or an association's representative or administrator; none
	   for an individual (review R19). Worded so that it is not read as a local representative (review R25). */
	function jpRepLine(s) {
		var k = v(s, "jpKind");
		if (k === "indiv") return "";
		return " " + (k === "assoc" ? "Representative or administrator of the association: " + jpRef(v(s, "jpRepName") || "[name of the representative or administrator]", "Article 32(1)(i)") :
			"Person who represents the company: " + jpRef(v(s, "jpRepName") || "[name of the person who represents the company]", "Article 32(1)(i)"));
	}
	function jpWhoLine(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]", a = jpAddr(s);
		return stop(ctrl + (a ? ", " + a : "")) + jpRepLine(s);
	}
	/* Retention is not required by the APPI (Art. 22 asks for deletion efforts); shown when given. */
	function jpTable(s) {
		var acts = pnActs(s);
		if (!acts.length) return [{ k: "p", x: "[Add the purposes of use.]" }];
		var ret = acts.some(function (a) { return v(a, "retention"); });
		return [{ k: "table", head: ret ? ["Purpose of use", "Personal information", "How long we keep it"] : ["Purpose of use", "Personal information"], rows: acts.map(function (a) {
			var row = [(v(a, "purpose") || "[purpose of use]") + (yes(a, "jpSens") ? " (special care-required personal information)" : ""), v(a, "data") || "[personal information]"];
			if (ret) row.push(v(a, "retention") || "Until it is no longer needed for this purpose");
			return row;
		}) }];
	}
	function jpPurposeBody(s) {
		var b = [{ k: "p", x: "We use your personal information only within these purposes of use. Beyond them, we ask for your consent first, unless the law allows the use (Articles 17 and 18). When we no longer need personal data, we try to delete it without delay (Article 22)." }];
		if (yes(s, "adm") || yes(s, "profiling")) b.push({ k: "p", x: "We analyse information about you: " + stop(v(s, "adm") === "Yes" ? (v(s, "admWhat") || "[the analysis and the decision it supports]") : (v(s, "profilingWhat") || "[the analysis and what it is used for]")) });
		/* Personal related information received and linked to personal data: Article 31(1) (review R10). */
		if (yes(s, "jpRelIn")) b.push({ k: "p", x: "We receive information that does not identify you on its own, such as cookie identifiers, device identifiers and browsing history, from other businesses, and link it to personal data that identifies you: " +
			jpDot(v(s, "jpRelWhat") || "[what you receive, and from whom]") + " We ask for your consent before we receive it (Article 31(1)(i))." +
			(jpOffshore(s) ? " As we are outside Japan, we first tell you about the system for protecting personal information in " + jpTrim(v(s, "jpOffWhere") || "[country or region]") + " and the measures we take (Article 31(1)(ii); Rules Article 17)." : "") });
		/* Pseudonymously and anonymously processed information: Articles 41(4), 43(3), (4) (review R23). */
		if (yes(s, "jpPseudo")) b.push({ k: "p", x: "We create pseudonymously processed information from personal information, so that it cannot identify you without other information. We use it for these purposes: " + jpRef(v(s, "jpPseudoPurpose") || "[the purposes of use of the pseudonymously processed information]", "Article 41(4)") });
		if (yes(s, "jpAnon")) {
			b.push({ k: "p", x: "We create anonymously processed information, which cannot identify you and cannot be turned back into personal information. It contains these items of information about individuals: " + jpRef(v(s, "jpAnonItems") || "[the items of information about individuals]", "Article 43(3)") });
			if (v(s, "jpAnonProv")) b.push({ k: "p", x: "We provide anonymously processed information to third parties. The items provided, and how: " + jpRef(v(s, "jpAnonProv"), "Article 43(4)") });
		}
		return b;
	}
	/* T05: Art. 20(2). */
	function jpSensBody(s) {
		var sp = jpSensActs(s);
		if (!sp.length) return [];
		return [{ k: "p", x: "Special care-required personal information is information about race, creed, social status, medical history, criminal record, having been a victim of crime, disabilities, health checks and treatment, and criminal or juvenile proceedings, which needs particular care to prevent unfair discrimination or prejudice (Article 2(3); Cabinet Order Article 2). We acquire it as follows (Article 20(2)):" },
			{ k: "ul", items: sp.map(function (a) { var g = lbl(D.JP_SENS_GROUNDS, v(a, "jpSensG")); return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: g ? g.t + " (" + g.ref + ")." : "[Choose the ground in Article 20(2).]" }; }) }];
	}
	/* T06 to T08: Arts. 25, 27. xref: where the third parties in foreign countries are described. */
	function jpShareBody(s, xref) {
		var b = [], all = arr(s, "recipients"), xr = jpXrows(s), o = jpOthers(s), nr = jpNoRole(s);
		if (!all.length) return [{ k: "p", x: yes(s, "jpNoRecip") ? "We do not provide your personal data to third parties, and do not entrust its handling to anyone else." :
			"[List the recipients, including service providers you entrust with handling personal data, or confirm in the Japan section that there are none.]" }];
		/* A service provider abroad relied on through consent or an exception is a third party in a foreign country:
		   Article 27, and its exclusion for entrusted parties, does not apply (Article 28(1); review R04). */
		var isX = function (r) { return xr.some(function (x) { var ba = v(x, "basis"); return (ba === "consent" || ba === "exception") && jpSame(v(x, "recipient"), v(r, "who")); }); };
		var e = jpEntrusted(s).filter(function (r) { return !isX(r); }), ex = jpEntrusted(s).filter(isX);
		var ent = function (list) { return joinList(list.map(function (r) { return (v(r, "who") || "[recipient]") + (v(r, "why") ? " (" + jpLc(jpTrim(v(r, "why"))) + ")" : ""); })); };
		if (e.length) b.push({ k: "p", x: "We entrust the handling of personal data, within the purposes of use, to " + ent(e) + ". We supervise " + (e.length > 1 ? "them" : "it") + " so that the data is kept secure (Articles 25 and 27(5)(i))." });
		if (ex.length) b.push({ k: "p", x: "We " + (e.length ? "also " : "") + "entrust the handling of personal data to " + ent(ex) + ", and supervise " + (ex.length > 1 ? "them" : "it") + " so that the data is kept secure (Article 25). " +
			(ex.length > 1 ? "They are third parties in foreign countries" : "It is a third party in a foreign country") + ": " + xref + " explains the basis (Article 28)." });
		var pr = o.filter(function (r) { var p = v(r, "jpProv"); return p !== "joint" && p !== "optout"; });
		if (pr.length) {
			b.push({ k: "p", x: "We provide personal data to these third parties (Article 27(1)):" });
			b.push({ k: "ul", items: pr.map(function (r) { var p = lbl(D.JP_PROV, v(r, "jpProv")); return { b: (v(r, "who") || "[recipient]") + ":", x: (v(r, "why") ? jpDot(jpLc(v(r, "why"))) + " " : "") + (p ? p.t : "[Say on what basis you provide it: consent, a law, or another exception in Article 27(1).]") }; }) });
		}
		var jr = jpProv(s, "joint");
		if (jr.length) b.push({ k: "box", title: "Joint use (Article 27(5)(iii))", blocks: [
			{ k: "p", x: "We use the following personal data jointly with others:" },
			{ k: "ul", items: [
				{ b: "Personal data used jointly:", x: stop(v(s, "jpJointItems") || "[the items of personal data]") },
				{ b: "Who uses it jointly:", x: stop(v(s, "jpJointScope") || joinList(jr.map(function (r) { return v(r, "who") || "[recipient]"; }))) },
				{ b: "Their purposes of use:", x: stop(v(s, "jpJointPurpose") || "[the purposes of each joint user]") },
				{ b: "Responsible for managing the data:", x: stop(v(s, "jpJointResp") || "[name, address and, for a company, its representative]") }] }] });
		/* Opt-out provision: Article 27(2) items (ii) to (viii), Rules Article 11(4) (review R03, R05). */
		if (jpProv(s, "optout").length) b.push({ k: "box", title: "Provision to third parties unless you ask us to stop (Article 27(2))", blocks: [
			{ k: "p", x: "Providing personal data to third parties is one of our purposes of use. We stop providing the personal data that identifies you when you ask us to." },
			{ k: "ul", items: [
				{ b: "Personal data provided:", x: stop(v(s, "jpOptItems") || "[the items of personal data]") },
				{ b: "How we acquire it:", x: stop(v(s, "jpOptAcq") || "[how the personal data is acquired]") },
				{ b: "How we provide it:", x: stop(v(s, "jpOptHow") || "[how it is provided]") },
				{ b: "How to ask us to stop:", x: stop(v(s, "jpOptReq") || "[how requests are received]") },
				{ b: "How we update it:", x: stop(v(s, "jpOptUpdate") || "[how the personal data provided is updated]") },
				{ b: "Start of the provision:", x: stop(fmtDate(v(s, "jpOptStart")) || "[the planned start date]") }] },
			{ k: "p", x: "We never provide special care-required personal information this way, nor personal data we received from another business under this scheme." }] });
		nr.forEach(function (r) { b.push({ k: "p", x: "[Give the role of " + (v(r, "who") || "this recipient") + ": a service provider acting for you, or a third party.]" }); });
		return b;
	}
	/* T09: Art. 28; Rules Arts. 15 to 18. shareRef: where the Article 27 bases are described. */
	function jpAbroadBody(s, shareRef) {
		var b = [], off = jpOffshore(s), ab = jpRecAbroad(s);
		if (off) b.push({ k: "p", x: "We are based outside Japan, in " + jpTrim(v(s, "jpOffWhere") || "[country or region]") + ", and handle your personal information there in connection with the goods or services we provide to people in Japan (Article 171)." });
		if (no(s, "jpAbroad")) {
			/* A third party abroad listed while the answer is No: no denial is printed (review R06). */
			var ca = ab.filter(function (r) { return v(r, "role") && v(r, "role") !== "processor"; });
			b.push({ k: "p", x: ca.length ? "[" + jpNamesAt(ca) + (ca.length > 1 ? " are third parties" : " is a third party") + " in a foreign country: answer Yes in the Japan section and add " + (ca.length > 1 ? "them" : "it") + ".]" :
				off ? "We do not provide it to any other third party in a foreign country." : "We do not provide your personal data to third parties in foreign countries." });
			return b;
		}
		if (!yes(s, "jpAbroad")) { b.push({ k: "p", x: "[Say whether you provide personal data to third parties in foreign countries.]" }); return b; }
		var rows = jpXrows(s);
		b.push({ k: "p", x: "We provide personal data to these third parties in foreign countries (Article 28):" });
		b.push(rows.length ? { k: "ul", items: rows.map(function (r) {
			var ba = v(r, "basis"), c = v(r, "country"), nc = ba === "consent" && yes(r, "noCountry"), nm = ba === "consent" && yes(r, "noMeasures");
			var head = (v(r, "recipient") || "[recipient]") + " (" + (nc ? "country not yet identified" : jpTrim(c || "[country]")) + "):", t;
			if (ba === "designated") t = !c || jpDesig(c) ? "a country the Personal Information Protection Commission has designated as having a system with protection equivalent to Japan's, and the recipient is subject to the " + (jpUkName(c) ? "UK GDPR" : "GDPR") + " (Article 28(1); Rules Article 15; PPC Notice No. 1 of 2019)." :
				"[This country is not designated: choose another basis under Article 28.]";
			else if (ba === "contract" || ba === "framework") t = "the recipient has a system that ensures measures equivalent to those the APPI requires" + (ba === "contract" ? ", through a contract or other arrangement with us" : ", through recognition under an international framework") + " (Article 28(1); Rules Article 16). We check this regularly, and give you information about it on request (Article 28(3); Rules Article 18).";
			else if (ba === "consent") t = "we ask for your consent first. " +
				(nc ? "We cannot yet identify the country, because " + jpTrim(jpLc(v(r, "noCountryWhy") || "[the reason]")) + " (Rules Article 17(3))." + (v(r, "noCountryInfo") ? " To help you judge the provision: " + jpDot(v(r, "noCountryInfo")) : "") :
					"The country's system for protecting personal information: " + jpDot(v(r, "system") || "[information on the country's system]")) + " " +
				(nm ? "We cannot give information on the recipient's measures, because " + jpTrim(jpLc(v(r, "noMeasuresWhy") || "[the reason]")) + " (Article 28(2); Rules Article 17(4))." :
					"The recipient's measures to protect it: " + jpTrim(v(r, "measures") || "[the recipient's measures]") + " (Article 28(2); Rules Article 17).");
			else if (ba === "exception") t = "a case in Article 27(1) that needs no consent.";
			else t = "[Say why the provision is permitted under Article 28.]";
			if ((ba === "designated" || ba === "contract" || ba === "framework") && !jpArt27(s, r)) t += " [List " + (v(r, "recipient") || "this recipient") + " as a recipient and say on what basis under Article 27 you provide personal data to it.]";
			return { b: head, x: t };
		}) } : { k: "p", x: "[Add each third party in a foreign country.]" });
		/* A recipient located abroad that is not in the list (review R01). */
		var miss = ab.filter(function (r) { return !rows.some(function (x) { return jpSame(v(x, "recipient"), v(r, "who")); }); });
		if (miss.length) b.push({ k: "p", x: "[Add " + jpNamesAt(miss) + " to the third parties in foreign countries, with the basis under Article 28, or correct " + (miss.length > 1 ? "their locations" : "its location") + ".]" });
		if (rows.some(function (r) { var ba = v(r, "basis"); return ba === "designated" || ba === "contract" || ba === "framework"; }))
			b.push({ k: "p", x: "Where a recipient is in a designated country or has an equivalent system, we provide personal data to it on the basis given in " + shareRef + " (Article 27)." });
		return b;
	}
	/* T11: Cabinet Order Art. 10(i); Guidelines 3-8-1, 10-7. */
	function jpSecurityBody(s) {
		var b = [{ k: "p", x: "Measures we take to keep your personal data secure (Article 23; Cabinet Order Article 10(i)): " + stop(v(s, "jpSecurity") || "[the security measures: basic policy, handling rules, organisational, human, physical and technical measures]") }];
		var fw = v(s, "jpForeignWhere") || (jpOffshore(s) ? v(s, "jpOffWhere") : "");
		if (fw) b.push({ k: "p", x: "We handle personal data in " + jpTrim(fw) + ", and take our security measures knowing the system for protecting personal information there (Guidelines 10-7)." });
		return b;
	}
	/* T10: Arts. 32 to 38 (review R12, R27). */
	function jpRightsBody(s) {
		var R = [
			{ b: "Purpose of use (Article 32(2)).", x: "You can ask us to tell you the purpose of use of retained personal data that identifies you." },
			{ b: "Disclosure (Article 33).", x: "You can ask us to disclose retained personal data that identifies you, electronically or by another method you choose (or on paper where your method would be very costly or difficult), and the records we keep of providing it to third parties and of receiving it from them." },
			{ b: "Correction (Article 34).", x: "If the content is untrue, you can ask us to correct, add to or delete it." },
			{ b: "Suspension of use or erasure (Article 35).", x: "You can ask us to stop using or to erase it if we handle it beyond the purposes of use, use it inappropriately or acquired it improperly, and also when we no longer need it, after a breach we must report, or where your rights or legitimate interests are at risk." },
			{ b: "Stopping provision to third parties (Article 35).", x: "You can ask us to stop providing it to third parties if we provide it without the consent or basis the law requires, and in the same cases as for suspension." }];
		var fee = v(s, "jpFee");
		return [{ k: "ul", items: R },
			{ k: "p", x: "How to make a request: " + stop(jpRightsWay(s) || "[where to send requests, the form to use, and how you check identity]") + " You can make a request through an agent (Article 37). " +
				(fee === "Yes" ? "We charge a fee for a notice of the purpose of use or a disclosure: " + jpTrim(v(s, "jpFeeAmount") || "[the amount]") + (v(s, "jpFeeHow") ? ". How to pay it: " + jpTrim(jpLc(v(s, "jpFeeHow"))) : "") + " (Article 38)." :
					fee === "No" ? "We charge no fee." : "[Say whether you charge a fee for a notice of the purpose or a disclosure, and how much.]") +
				" If we do not do what you ask, or do something different, we tell you and explain why (Articles 32(3), 33(3), 34(3), 35(7) and 36)." }];
	}
	function jpComplaintBody(s) {
		var b = [{ k: "p", x: "Complaints about how we handle personal information: " + jpRef(v(s, "jpComplaint") || v(s, "ctrlEmail") || "[where to make complaints]", "Article 40; Cabinet Order Article 10(ii)") }];
		if (yes(s, "jpAcc")) b.push({ k: "p", x: "We are a member of " + jpTrim(v(s, "jpAccName") || "[name of the accredited personal information protection organisation]") + ", an accredited personal information protection organisation. You can also take a complaint to it: " + jpRef(v(s, "jpAccContact") || "[its complaint contact]", "Cabinet Order Article 10(iii)") });
		return b;
	}
	var JP_CHANGES = "If we change a purpose of use, we keep within what is reasonably related to the original purpose, and tell you or publish the new purpose (Articles 17(2) and 21(3)). A use beyond the purposes needs your consent first, unless the law allows it (Article 18).";
	function jpFurtherTxt(s) {
		var f = v(s, "jpFurther");
		return f === "related" ? "It is reasonably related to our original purposes; we tell you or publish it before we start (Articles 17(2) and 21(3))." :
			f === "consent" ? "We will ask for your consent before we use your personal information for it (Article 18(1))." :
			"[Say whether the new purpose is reasonably related to the original ones, or whether you will ask for consent.]";
	}
	function jpFurtherBox(s) {
		return { k: "box", title: "Planned new use of your personal information", blocks: [
			{ k: "p", x: "From " + (fmtDate(v(s, "furtherStart")) || "[start date]") + " we intend to use personal information we already hold for a new purpose: " + stop(v(s, "furtherWhat") || "[new purpose]") },
			{ k: "p", x: "For this new purpose we use " + jpLc(v(s, "furtherData") || "[personal information]") + (v(s, "furtherRetention") ? ", and " + keepFor(v(s, "furtherRetention")) : ".") },
			{ k: "p", x: jpFurtherTxt(s) }] };
	}

	/* The "Additional information for people in Japan" section of a notice led by another law. */
	function jpSection(s, secs, lawName) {
		var b = [], H = function (t) { b.push({ k: "h3", x: t }); };
		var other = secs.filter(Boolean).map(String), ctrl = v(s, "ctrlName") || "[Organisation]";
		b.push({ k: "p", x: "For people in Japan, the Act on the Protection of Personal Information (APPI) applies. " + ctrl + " handles personal information as a business. The details, requests and choices in this section are those this law gives you." +
			(other.length ? " " + (other.length > 1 ? "Sections " : "Section ") + joinList(other) + (other.length > 1 ? " apply" : " applies") + " to you only where " + lawName + " applies to our processing of your data." : "") });
		b.push({ k: "p", x: jpWhoLine(s) });
		H("Purposes of use");
		Array.prototype.push.apply(b, jpTable(s));
		Array.prototype.push.apply(b, jpPurposeBody(s));
		if (jpSensActs(s).length) { H("Special care-required personal information"); Array.prototype.push.apply(b, jpSensBody(s)); }
		H("Providing your personal data to others");
		Array.prototype.push.apply(b, jpShareBody(s, "the part on third parties in foreign countries below"));
		H("Third parties in foreign countries");
		Array.prototype.push.apply(b, jpAbroadBody(s, "the part on providing your personal data to others above"));
		H("How we keep it secure");
		Array.prototype.push.apply(b, jpSecurityBody(s));
		H("Your requests in Japan");
		Array.prototype.push.apply(b, jpRightsBody(s));
		H("Complaints");
		Array.prototype.push.apply(b, jpComplaintBody(s));
		H("Changes");
		b.push({ k: "p", x: JP_CHANGES + (yes(s, "further") ? " For the new purpose described in this notice: " + jpLc(jpFurtherTxt(s)) : "") });
		return b;
	}

	/* Part R rows. led: Japan sets the main text. */
	function jpChecks(s, led) {
		var checks = [], delivery = [], acts = pnActs(s), off = jpOffshore(s), kind = v(s, "jpKind");
		/* Purposes are quoted in check notes so that a capital or a full stop does not break the sentence (review R17). */
		var pl = function (list) { return joinList(list.map(function (a) { return "\"" + jpTrim(v(a, "purpose") || "[purpose]") + "\""; })); };
		var nm = function (list, key) { return joinList(list.map(function (r) { return jpTrim(v(r, key || "who") || "[recipient]"); })); };
		var t01 = [], addr = v(s, "ctrlAddress");
		if (led && !v(s, "ctrlName")) t01.push("Add the business's name.");
		if (!addr) t01.push("Add the address (Article 32(1)(i)).");
		else if (off && !v(s, "jpOffWhere") && !jpForeign(addr)) t01.push("Give the country in the address (Article 32(1)(i); Guidelines 3-8-1).");
		if (kind !== "indiv" && !v(s, "jpRepName")) t01.push(kind === "assoc" ? "Give the name of the association's representative or administrator (Article 32(1)(i))." :
			"Give the name of the person who represents the company, or say that the business is an individual (Article 32(1)(i)).");
		checks.push(t01.length ? chk("T01", "missing", t01.join(" ")) : chk("T01", "ok", off ? "For a business outside Japan, the address includes the country (Guidelines 3-8-1)." : ""));
		checks.push(!v(s, "jpScope") ? chk("T02", "missing", "Say how the APPI applies to you (Articles 16 and 171).") :
			off && !v(s, "jpOffWhere") ? chk("T02", "missing", "Say where you are and handle the personal information outside Japan (Article 171).") :
			chk("T02", "ok", off ? "Outside Japan, the APPI applies where you handle the personal information of people in Japan in connection with goods or services provided to them (Article 171)." : "Handling in Japan."));
		var t03 = [], noData = acts.filter(function (a) { return !v(a, "data"); });
		var vp = acts.filter(function (a) { return D.LINT.vaguePurpose.test(v(a, "purpose")); });
		if (!acts.length) t03.push("Add the purposes of use.");
		if (noData.length) t03.push("Give the personal information for " + stop(pl(noData)));
		if (vp.length) t03.push("Specify each purpose as far as possible (Article 17(1)): " + stop(pl(vp)));
		if (yes(s, "adm") || yes(s, "profiling")) t03.push("You analyse behaviour or interests: the purpose must let people predict that handling (Guidelines 3-1-1).");
		checks.push(!acts.length || noData.length ? chk("T03", "missing", t03.join(" ")) : vp.length ? chk("T03", "warn", t03.join(" ")) : t03.length ? chk("T03", "check", t03.join(" ")) : chk("T03", "ok"));
		var unans = acts.filter(function (a) { return !v(a, "jpSens"); }), sens = jpSensActs(s), noG = sens.filter(function (a) { return !lbl(D.JP_SENS_GROUNDS, v(a, "jpSensG")); });
		var other = acts.filter(function (a) { return !yes(a, "jpSens") && ((gdprLed(s) && art9Of(s, a)) || (inReg(s, "br") && v(a, "brSens")) || (inReg(s, "can") && yes(a, "canSens")) || (inReg(s, "cn") && yes(a, "cnSens"))); });
		var t05 = [];
		if (unans.length) t05.push("Answer for each purpose whether it uses special care-required personal information (Article 2(3)): " + stop(pl(unans)));
		if (noG.length) t05.push("Choose the Article 20(2) ground for " + stop(pl(noG)));
		if (other.length) t05.push("Another law in this notice treats the data for " + pl(other) + " as sensitive. Check whether it is special care-required personal information (race, creed, social status, medical history, criminal record, victim of crime, disability, health checks and treatment, criminal or juvenile proceedings).");
		checks.push(!acts.length ? chk("T05", "na", "No purposes yet.") : t05.length ? chk("T05", unans.length || noG.length ? "missing" : "warn", t05.join(" ")) :
			sens.length ? chk("T05", "ok", "Acquire it only with prior consent, unless an Article 20(2) exception applies. It cannot be provided under the opt-out scheme (Article 27(2)).") : chk("T05", "na", "No special care-required personal information."));
		var recs = arr(s, "recipients"), oth = jpOthers(s), nr = jpNoRole(s), noProv = oth.filter(function (r) { return !lbl(D.JP_PROV, v(r, "jpProv")); });
		var xr = jpXrows(s), ab = jpRecAbroad(s), unk = recs.filter(function (r) { return jpWhere(v(r, "where")) === "unknown"; });
		var procAb = ab.filter(function (r) { return v(r, "role") === "processor"; }), ctrlAb = ab.filter(function (r) { return v(r, "role") && v(r, "role") !== "processor"; });
		/* Recipients located abroad and not in the foreign list (review R01). */
		var unl = ab.filter(function (r) { return !yes(s, "jpAbroad") || !xr.some(function (x) { return jpSame(v(x, "recipient"), v(r, "who")); }); });
		var t06 = [];
		if (!recs.length && !yes(s, "jpNoRecip")) t06.push("List the recipients, including service providers you entrust with personal data, or confirm in the Japan section that there are none.");
		if (noProv.length) t06.push("Say on what basis you provide personal data to " + nm(noProv) + " (Article 27).");
		if (nr.length) t06.push("Give each recipient's role: " + stop(nm(nr)));
		checks.push(t06.length ? chk("T06", "missing", t06.join(" ")) : !recs.length ? chk("T06", "na", "You confirmed that no one else receives the personal data.") :
			unl.length ? chk("T06", "warn", jpNamesAt(unl) + (unl.length > 1 ? " are" : " is") + " located abroad and not among the third parties in foreign countries (row T09). Unless the country is designated or the recipient has an equivalent system, Article 27, including its exclusion for entrusted parties, does not apply (Article 28(1)).") :
			chk("T06", "ok", jpProv(s, "consent").length ? "Get prior consent before providing personal data to third parties (Article 27(1)). Keep records of each provision (Article 29)." :
				"Entrusted parties in Japan, in a designated country or with an equivalent system are not third parties (Article 27(5)(i)); supervise them (Article 25)."));
		/* Joint use: the joint users must be identifiable (review R26). */
		var jr = jpProv(s, "joint"), jrNo = jr.filter(function (r) { return !v(r, "who"); });
		checks.push(!jr.length ? chk("T07", "na", "No joint use.") :
			!v(s, "jpJointItems") || !v(s, "jpJointPurpose") || !v(s, "jpJointResp") || (!v(s, "jpJointScope") && jrNo.length) ? chk("T07", "missing", "For joint use, give the items of personal data, who uses it jointly (name each joint user or describe the scope), their purposes, and the name, address and representative of the person responsible (Article 27(5)(iii)).") :
			chk("T07", "check", "Check that the person responsible is given with name, address and, for a corporation, its representative, and that people can tell which businesses use the data (Article 27(5)(iii); Guidelines 3-6-3). Tell people before the joint use starts, and in advance of any change to the purposes or the person responsible (Article 27(6))."));
		/* Opt-out scheme: items (ii) to (viii) (review R05, R22). */
		var op = jpProv(s, "optout"), sensOpt = op.length && sens.length;
		var optNo = " Special care-required personal information, personal data acquired in breach of Article 20(1) and personal data you received under the opt-out scheme cannot be provided this way (Article 27(2)).";
		var optMiss = ["jpOptItems", "jpOptAcq", "jpOptHow", "jpOptReq", "jpOptUpdate", "jpOptStart"].some(function (k) { return !v(s, k); });
		checks.push(!op.length ? chk("T08", "na", "No provision under the opt-out scheme.") :
			optMiss ? chk("T08", "missing", "For provision under the opt-out scheme, give the items, how they are acquired, how they are provided, how people ask you to stop, how the data provided is updated and when the provision starts (Article 27(2); Rules Article 11(4))." + optNo + (sensOpt ? " You handle special care-required personal information: check that it is excluded." : "")) :
			chk("T08", sensOpt ? "warn" : "check", (sensOpt ? "You handle special care-required personal information: check that it is excluded. " : "") + "File the items with the Personal Information Protection Commission before the provision starts (Article 27(2))." + optNo));
		/* Third parties in foreign countries (review R01, R06, R07, R08, R15, R16, R21). */
		var badX = xr.filter(function (r) { var nc = v(r, "basis") === "consent" && yes(r, "noCountry"); return (!v(r, "country") && !nc) || !v(r, "recipient") || !lbl(D.JP_XBASIS, v(r, "basis")); });
		var conX = xr.filter(function (r) { return v(r, "basis") === "consent" && ((yes(r, "noCountry") ? !v(r, "noCountryWhy") : !v(r, "system")) || (yes(r, "noMeasures") ? !v(r, "noMeasuresWhy") : !v(r, "measures"))); });
		var desigBad = xr.filter(function (r) { return v(r, "basis") === "designated" && v(r, "country") && !jpDesig(v(r, "country")); });
		var noArt27 = xr.filter(function (r) { var ba = v(r, "basis"); return (ba === "designated" || ba === "contract" || ba === "framework") && !jpArt27(s, r); });
		var t09m = [], t09w = [], t09c = [], t09n = [];
		if (!v(s, "jpAbroad")) t09m.push("Answer whether personal data goes to third parties in foreign countries (Article 28).");
		if (yes(s, "jpAbroad") && (!xr.length || badX.length)) t09m.push("For each third party in a foreign country give the recipient, the country and why the provision is permitted (Article 28(1)).");
		if (conX.length) t09m.push("Where consent is the basis, give the country's system and the recipient's measures, or say why they cannot be given (Article 28(2); Rules Article 17): " + stop(nm(conX, "recipient")));
		if (desigBad.length) t09m.push("Only the EEA states and the United Kingdom are designated (PPC Notice No. 1 of 2019): choose another basis for " + stop(joinList(desigBad.map(function (r) { return jpTrim(v(r, "recipient") || "[recipient]") + " (" + v(r, "country") + ")"; }))));
		if (noArt27.length) t09m.push("A designated country or an equivalent system removes only the need for consent under Article 28. Say on what basis under Article 27 you provide personal data to " + nm(noArt27, "recipient") + " (consent, an exception, entrustment, joint use or the opt-out scheme), listing " + (noArt27.length > 1 ? "them" : "it") + " as a recipient.");
		if (yes(s, "jpAbroad") && unl.length) t09m.push("Add " + jpNamesAt(unl) + " to the third parties in foreign countries with the basis under Article 28, or correct " + (unl.length > 1 ? "their locations" : "its location") + ".");
		if (no(s, "jpAbroad") && ctrlAb.length) t09m.push(jpNamesAt(ctrlAb) + (ctrlAb.length > 1 ? " are third parties" : " is a third party") + " in a foreign country: answer Yes and add " + (ctrlAb.length > 1 ? "them" : "it") + " (Article 28(1)).");
		if (no(s, "jpAbroad") && procAb.length) t09w.push("Service providers you entrust are listed outside Japan (" + jpNamesAt(procAb) + ") while the answer is No. Entrusting handling to a party abroad is a provision to a third party in a foreign country under Article 28, unless its country is designated or it has an equivalent system.");
		if (unk.length) t09c.push("Check whether these recipients are in Japan: " + stop(jpNamesAt(unk)));
		var used = function (k) { return xr.some(function (r) { return v(r, "basis") === k; }); };
		if (used("consent")) t09n.push("Before asking for consent, give the country's name, its system and the recipient's measures (Rules Article 17).");
		if (used("designated")) t09n.push("A recipient in a designated country must be subject to the GDPR or the UK GDPR (PPC Notice No. 1 of 2019).");
		if (used("contract") || used("framework")) t09n.push("For recipients with an equivalent system, check it regularly and give the Rules Article 18(3) information on request.");
		if (used("exception")) t09n.push("Check that an Article 27(1) exception covers each provision made without consent.");
		checks.push(t09m.length ? chk("T09", "missing", t09m.concat(t09w, t09c).join(" ")) : t09w.length ? chk("T09", "warn", t09w.concat(t09c).join(" ")) :
			no(s, "jpAbroad") ? (t09c.length ? chk("T09", "check", t09c.join(" ")) : chk("T09", "na", "No third party in a foreign country.")) :
			chk("T09", "check", t09c.concat(t09n).join(" ")));
		var t10 = [], t10c = [];
		if (!jpRightsWay(s)) t10.push("Say how people make requests: where, the form, and how identity is checked (Article 32(1)(iii); Cabinet Order Article 12).");
		if (!v(s, "jpFee")) t10.push("Answer whether you charge a fee for a notice of the purpose or a disclosure (Article 38).");
		else if (yes(s, "jpFee") && !v(s, "jpFeeAmount")) t10.push("Give the fee amount, reasonable in view of the actual cost (Articles 32(1)(iii), 38(2)).");
		else if (yes(s, "jpFee") && !v(s, "jpFeeHow")) t10c.push("Say how the fee is paid (Cabinet Order Article 12(iv)).");
		checks.push(t10.length ? chk("T10", "missing", t10.join(" ")) : t10c.length ? chk("T10", "check", t10c.join(" ") + " Do not set procedures that place an excessive burden on people (Article 37(4)).") :
			chk("T10", "ok", "Do not set procedures that place an excessive burden on people (Article 37(4))."));
		/* Handling abroad: the business itself or the parties it entrusts (Guidelines 10-7; review R21). */
		var sec = v(s, "jpSecurity"), fw = v(s, "jpForeignWhere");
		checks.push(!sec ? chk("T11", "missing", "Describe the security measures taken (Cabinet Order Article 10(i)), leaving out details that would weaken security.") :
			off && !fw && !v(s, "jpOffWhere") ? chk("T11", "missing", "You are outside Japan: name the country where you handle personal data, and take the measures knowing its system (Guidelines 3-8-1, 10-7).") :
			/guideline|\u30ac\u30a4\u30c9\u30e9\u30a4\u30f3/i.test(sec) && sec.length < 140 ? chk("T11", "warn", "A statement that you follow the PPC guidelines is not enough (Guidelines 3-8-1): describe the measures.") :
			procAb.length && !fw ? chk("T11", "warn", "Service providers you entrust handle personal data outside Japan (" + jpNamesAt(procAb) + "): name the countries and take the measures knowing their systems (Guidelines 3-8-1, 10-7).") :
			chk("T11", "ok"));
		checks.push(!v(s, "jpComplaint") && !v(s, "ctrlEmail") ? chk("T12", "missing", "Give where people make complaints (Cabinet Order Article 10(ii)).") : chk("T12", "ok", "Handle complaints appropriately and promptly (Article 40)."));
		checks.push(!v(s, "jpAcc") ? chk("T13", "missing", "Answer whether you are a member of an accredited personal information protection organisation (Cabinet Order Article 10(iii)).") :
			yes(s, "jpAcc") && (!v(s, "jpAccName") || !v(s, "jpAccContact")) ? chk("T13", "missing", "Give the organisation's name and where to make complaints to it (Cabinet Order Article 10(iii)).") :
			yes(s, "jpAcc") ? chk("T13", "ok") : chk("T13", "na", "Not a member of an accredited organisation."));
		var f = v(s, "jpFurther");
		checks.push(!yes(s, "further") ? chk("T14", "ok", "Stated: purposes change only within a reasonably related scope, and are notified or published (Articles 17(2), 21(3)).") :
			!f ? chk("T14", "missing", "Say whether the new purpose is reasonably related to the original ones (Article 17(2)) or needs consent (Article 18(1)).") :
			f === "related" ? chk("T14", "check", "Only a purpose reasonably related to the original one can be added without consent; publish or notify it before use (Articles 17(2), 21(3)).") : chk("T14", "ok"));
		var noRet = acts.filter(function (a) { return !v(a, "retention"); });
		checks.push(!acts.length ? chk("T15", "na", "No purposes yet.") :
			noRet.length && noRet.length < acts.length ? chk("T15", "check", "No retention period is given for " + pl(noRet) + ". The APPI asks you to try to delete personal data when it is no longer needed (Article 22); the notice says so.") :
			noRet.length ? chk("T15", "na", "No retention periods given; the APPI does not require them in the notice (Article 22).") : chk("T15", "ok"));
		checks.push(/japan|\u65e5\u672c/i.test(v(s, "languages")) ? chk("T16", "check", "This generator writes English. Check the Japanese version.") :
			chk("T16", "warn", "The APPI sets no language, but the information must be in a state people can know (Article 32): for people in Japan that normally means Japanese. This generator writes English only."));
		checks.push(chk("T17", yes(s, "jpKids") ? "warn" : "check", (yes(s, "jpKids") ? "You handle children's personal information. " : "") + "Under the current law, where a minor cannot judge the consequences of consenting, get consent from a parent or legal representative (Guidelines 2-16). The 2026 amendment, not yet in force, adds rules for people under 16. Not modelled."));
		checks.push(chk("T18", "check", "The 2026 amendment (Act No. 56 of 2026, promulgated 17 July 2026) takes effect on a date set by Cabinet Order within two years: it adds rules for people under 16 and for biometric data such as facial feature data, and changes the rules on statistics and AI development, entrusted processing and breach notices. Review the notice, and these rows, when the Cabinet Order, Rules and guidelines are published."));
		if (yes(s, "publicBody")) checks.push(chk("T19", "warn", off ? "A public body outside Japan is not an administrative organ under Article 2(11). Check whether it handles the personal information of people in Japan as a business in connection with goods or services provided to them (Articles 16(2), 171)." :
			"Japanese administrative organs, local governments and most incorporated administrative agencies follow Chapter 5 (Articles 60 to 129), not this notice. Legal persons in Annex 2 and some local incorporated administrative agencies follow the business rules, but Articles 32 to 39 do not apply to them (Article 58). This generator does not model public bodies."));
		/* Personal related information (Article 31; review R10). */
		var rel = v(s, "jpRelIn"), relOut = v(s, "jpRelOut");
		checks.push(!rel || !relOut ? chk("T25", "missing", "Answer whether you receive personal related information (cookie identifiers, device identifiers, browsing history) from other businesses and link it to personal data, and whether you provide such information to others who will (Article 31(1)).") :
			yes(s, "jpRelIn") && !v(s, "jpRelWhat") ? chk("T25", "missing", "Say what personal related information you receive, and from whom (Article 31(1)(i)).") :
			yes(s, "jpRelIn") ? chk("T25", "ok", "Get the person's consent before you receive it; the provider must confirm that you have it (Article 31(1)(i))." + (off ? " As you are outside Japan, give the name of your country, its system and your measures when you ask for consent (Article 31(1)(ii); Rules Article 17)." : "")) :
			yes(s, "jpRelOut") ? chk("T25", "na", "You do not receive personal related information to link to personal data. Providing it is covered in the delivery checklist.") :
			chk("T25", "na", "No personal related information is received or provided to be linked to personal data."));
		/* Pseudonymously and anonymously processed information (Articles 41, 43; review R23). */
		var t26 = [];
		if (!v(s, "jpPseudo") || !v(s, "jpAnon")) t26.push("Answer whether you create pseudonymously or anonymously processed information (Articles 41 and 43).");
		if (yes(s, "jpPseudo") && !v(s, "jpPseudoPurpose")) t26.push("Publish the purposes of use of the pseudonymously processed information (Article 41(4)).");
		if (yes(s, "jpAnon") && !v(s, "jpAnonItems")) t26.push("Publish the items of information about individuals in the anonymously processed information (Article 43(3)).");
		checks.push(t26.length ? chk("T26", "missing", t26.join(" ")) : yes(s, "jpPseudo") || yes(s, "jpAnon") ?
			chk("T26", "check", (yes(s, "jpPseudo") ? "Pseudonymously processed information: publish any change of its purposes, and publish joint use of it (Article 41(4), (6)). " : "") +
				(yes(s, "jpAnon") ? "Anonymously processed information: publish the items when you create it; when you provide it, publish the items and the method, and tell the recipient that it is anonymously processed information (Article 43(3), (4))." : "")) :
			chk("T26", "na", "No pseudonymously or anonymously processed information."));
		/* Delivery */
		delivery.push(chk("T20", "check", "Publish the purposes of use so people can know them: for example on a page reachable from the top page in about one click (Article 21(1); Guidelines 2-15). The Article 32 matters can also be given by answering without delay on request (Guidelines 3-8-1)." +
			(jr.length || op.length ? " For joint use and the opt-out scheme, the items must be easily knowable (Guidelines 3-6-2-1, 3-6-3)." : "")));
		if (pnSourceDirect(s)) delivery.push(chk("T21", "check", "When you collect personal information directly in writing (forms, contracts, online forms), state the purpose of use expressly beforehand (Article 21(2))."));
		if (xr.some(function (r) { return v(r, "basis") === "consent"; })) delivery.push(chk("T22", "check", "Before asking for consent to provision to a third party in a foreign country, give the country's name, its system and the recipient's measures (or, where they cannot be given, why), electronically, in writing or another appropriate way (Article 28(2); Rules Article 17)."));
		if (op.length) delivery.push(chk("T23", "check", "Before the provision starts, tell people (leaving them time to ask you to stop) and file with the Personal Information Protection Commission. Before changing items (iii) to (v), (vii) or (viii), tell people and refile; after a change to item (i), or when you stop, do so without delay (Article 27(2), (3); Rules Article 11(1)). Keep records of each provision (Article 29)."));
		if (xr.some(function (r) { return v(r, "basis") === "contract" || v(r, "basis") === "framework"; })) delivery.push(chk("T24", "check", "For recipients with an equivalent system, check their measures and their country's system regularly, and stop providing if the measures cannot be ensured (Article 28(3); Rules Article 18(1))."));
		if (yes(s, "jpRelIn") || yes(s, "jpRelOut")) delivery.push(chk("T27", "check", (yes(s, "jpRelIn") ? "Get the person's consent before the personal related information is provided to you (Article 31(1)(i)). " : "") +
			(yes(s, "jpRelOut") ? "Before providing personal related information to a business that will link it to personal data, confirm that the person has consented to it, and, for a recipient in a foreign country, that the person was given information on the country's system and the recipient's measures (Article 31(1))." : "")));
		return { checks: checks, delivery: delivery };
	}

	/* A document led by Japan's APPI. */
	function jpLead(s) {
		var ctrl = v(s, "ctrlName") || "[Organisation]";
		var aud = v(s, "audience");
		var title = AUD_TITLE[aud] || (v(s, "audienceOther") ? "Privacy notice for " + lcFirst(v(s, "audienceOther")) : "Privacy notice");
		var acts = pnActs(s), direct = pnSourceDirect(s), indirect = pnSourceIndirect(s);
		var meta = [ctrl];
		if (v(s, "version")) meta.push("Version " + v(s, "version"));
		if (v(s, "effective")) meta.push("Effective " + fmtDate(v(s, "effective")));
		var num = {}, c = 3;
		if (jpSensActs(s).length) num.sens = c++;
		if (indirect) num.source = c++;
		num.share = c++; num.abroad = c++; num.sec = c++; num.rights = c++; num.complaints = c++;
		if (inReg(s, "kr")) num.kr = c++;
		if (inReg(s, "sg")) num.sg = c++;
		if (inReg(s, "au")) num.au = c++;
		if (inReg(s, "za")) num.za = c++;
		if (inReg(s, "ca")) num.ca = c++;
		if (inReg(s, "us")) num.us = c++;
		num.changes = c++;
		var blocks = [{ k: "h1", x: title }, { k: "meta", x: meta.map(stop).join(" ") }];
		var first = [{ k: "p", x: ctrl + " handles the personal information described in this notice as a business." + (v(s, "ctrlEmail") ? " Contact: " + v(s, "ctrlEmail") + "." : "") }];
		if (acts.length) first.push({ k: "p", x: "Our purposes of use:" }, { k: "ul", items: acts.map(function (a) { return { b: jpTrim(v(a, "purpose") || "[purpose]") + ":", x: stop(v(a, "data") || "[personal information]") }; }) });
		if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
		if (yes(s, "jpAbroad")) first.push({ k: "p", x: "We provide personal data to third parties in foreign countries. Section " + num.abroad + " names them." });
		else if (jpOffshore(s)) first.push({ k: "p", x: "We are based outside Japan. Section " + num.abroad + " says where we handle your personal information." });
		first.push({ k: "p", x: "You can ask us to tell you the purpose of use, to disclose, correct or erase your personal data, to stop using it or to stop providing it to third parties, and you can complain. Sections " + num.rights + " and " + num.complaints + " explain how." });
		if (num.kr) first.push({ k: "p", x: "If you are in Korea, section " + num.kr + " also applies to you." });
		if (num.sg) first.push({ k: "p", x: sgPointer(s, num.sg) });
		if (num.au) first.push({ k: "p", x: auPointer(s, num.au) });
		if (num.za) first.push({ k: "p", x: zaPointer(s, num.za) });
		if (num.ca) first.push({ k: "p", x: "If you are a California resident, section " + num.ca + " also applies to you." });
		if (num.us) first.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the US states whose law applies]") + ", section " + num.us + " also applies to you." });
		blocks.push({ k: "box", title: "In short", blocks: first });

		blocks.push({ k: "h2", x: "1. Who handles your personal information" });
		blocks.push({ k: "p", x: jpWhoLine(s) });
		var chans = [];
		if (v(s, "ctrlEmail")) chans.push({ b: "Email:", x: v(s, "ctrlEmail") });
		if (v(s, "ctrlPhone")) chans.push({ b: "Telephone:", x: v(s, "ctrlPhone") });
		if (chans.length) blocks.push({ k: "ul", items: chans });

		blocks.push({ k: "h2", x: "2. Purposes of use" });
		Array.prototype.push.apply(blocks, jpTable(s));
		Array.prototype.push.apply(blocks, jpPurposeBody(s));
		if (yes(s, "inferred")) blocks.push({ k: "p", x: "We also derive information about you from the information above: " + stop(v(s, "inferredWhat") || "[what is inferred, and from what]") });
		if (num.sens) { blocks.push({ k: "h2", x: num.sens + ". Special care-required personal information" }); Array.prototype.push.apply(blocks, jpSensBody(s)); }
		if (num.source) {
			blocks.push({ k: "h2", x: num.source + ". Where your personal information comes from" });
			var src = arr(s, "sources");
			if (src.length) blocks.push({ k: "ul", items: src.map(function (x) {
				var ai = v(x, "usedFor"), a = ai !== "" ? acts[+ai] : null;
				return { b: (v(x, "name") || "[source]") + ":", x: (v(x, "what") || "[personal information]") + (yes(x, "pub") ? " (publicly available)" : "") + (a ? ", used for " + jpLc(jpTrim(v(a, "purpose") || "[purpose]")) : "") + "." };
			}) });
			else if (!yes(s, "unattributable")) blocks.push({ k: "p", x: "[Name each source of the personal information, and what you get from it.]" });
			if (yes(s, "unattributable")) blocks.push({ k: "p", x: "Where we cannot attribute a record to a single source, the information comes from " + stop(v(s, "sourceNature") || "[nature of the sources and type of organisation]") });
		}
		blocks.push({ k: "h2", x: num.share + ". Providing your personal data to others" });
		Array.prototype.push.apply(blocks, jpShareBody(s, "section " + num.abroad));
		blocks.push({ k: "h2", x: num.abroad + ". Third parties in foreign countries" });
		Array.prototype.push.apply(blocks, jpAbroadBody(s, "section " + num.share));
		blocks.push({ k: "h2", x: num.sec + ". How we keep your personal data secure" });
		Array.prototype.push.apply(blocks, jpSecurityBody(s));
		blocks.push({ k: "h2", x: num.rights + ". Your requests" });
		Array.prototype.push.apply(blocks, jpRightsBody(s));
		blocks.push({ k: "h2", x: num.complaints + ". Complaints" });
		Array.prototype.push.apply(blocks, jpComplaintBody(s));

		var jpSecs = [String(num.rights), String(num.complaints)];
		var only = " Sections " + joinList(jpSecs) + " apply to you only where the APPI applies to our handling of your personal information.";
		var krRes = null;
		if (num.kr) {
			blocks.push({ k: "h2", x: num.kr + ". Additional information for people in Korea" });
			Array.prototype.push.apply(blocks, krSection(s, jpSecs, "the APPI"));
			krRes = krChecks(s, false);
		}
		var sgRes = null;
		if (num.sg) {
			blocks.push({ k: "h2", x: num.sg + ". " + sgHead(s) });
			Array.prototype.push.apply(blocks, sgSection(s, jpSecs, "the APPI"));
			sgRes = sgChecks(s, false);
		}
		var auRes = null;
		if (num.au) {
			blocks.push({ k: "h2", x: num.au + ". " + auHead(s) });
			Array.prototype.push.apply(blocks, auSection(s, jpSecs, "the APPI"));
			auRes = auChecks(s, false);
		}
		var zaRes = null;
		if (num.za) {
			blocks.push({ k: "h2", x: num.za + ". " + zaHead(s) });
			Array.prototype.push.apply(blocks, zaSection(s, jpSecs, "the APPI"));
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
		if (yes(s, "further")) blocks.push(jpFurtherBox(s));
		blocks.push({ k: "p", x: JP_CHANGES + " When this notice changes, we publish the new version and tell you of changes that matter to you. We do not expect you to check this page for updates." });
		if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });

		var cr = jpChecks(s, true), checks = cr.checks, delivery = cr.delivery;
		checks.push(v(s, "consequences") ? chk("P21", "ok", "", undefined, "WP260 10, 36 (good practice)") : chk("P21", "warn", "Empty. Fine only if nothing here would surprise people.", undefined, "WP260 10, 36 (good practice)"));
		if (krRes) { Array.prototype.push.apply(checks, krRes.checks); Array.prototype.push.apply(delivery, krRes.delivery); }
		if (sgRes) { Array.prototype.push.apply(checks, sgRes.checks); Array.prototype.push.apply(delivery, sgRes.delivery); }
		if (auRes) { Array.prototype.push.apply(checks, auRes.checks); Array.prototype.push.apply(delivery, auRes.delivery); }
		if (zaRes) { Array.prototype.push.apply(checks, zaRes.checks); Array.prototype.push.apply(delivery, zaRes.delivery); }
		if (caRes) { Array.prototype.push.apply(checks, caRes.checks); Array.prototype.push.apply(delivery, caRes.delivery); }
		if (usRes) { Array.prototype.push.apply(checks, usRes.checks); Array.prototype.push.apply(delivery, usRes.delivery); }
		var lintHits = lintText(blocks);
		checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "APPI Art. 17 (purposes specified as far as possible); WP260 13") :
			chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "APPI Art. 17 (purposes specified as far as possible); WP260 13"));
		var gp = [];
		if (direct) gp.push(chk("D01", "check", "Give the notice before you collect the data: before a form is submitted, before payment, before sign-up.", "Timing: when the data is collected"));
		gp.push(chk("D03", "check", "Read it as a member of the audience would."));
		if (has(s, "channel", "web")) gp.push(chk("D05", "check", "Link it from every page under a common term such as \"Privacy\", and from every form that collects personal information."));
		if (has(s, "channel", "app")) gp.push(chk("D06", "check", "Show it in the app store listing and keep it within two taps inside the app."));
		gp.push(chk("D07", "check", has(s, "channel", "phone") || has(s, "channel", "paper") || has(s, "channel", "device") ? "Offline, give the \"In short\" content first and point to the full notice." : "Use the \"In short\" box as the first layer and keep it consistent with the full text."));
		gp.push(chk("D08", "check", "Keep the full notice available as one document."));
		gp.push(chk("D12", "check", "When the notice changes, tell people what changed, highlighting it, before the change takes effect."));
		gp.push(chk("D14", "check", "If you add icons, keep them alongside the text, never instead of it."));
		gp.forEach(function (r) { var m = D.MATRIX[r.id]; if (m) r.s = m.s.replace(/^Art\.[^;]*;\s*/, "") + " (good practice)"; });
		delivery = gp.concat(delivery);
		return { title: title, file: slug(ctrl + " " + title), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(delivery), docLabel: "Notice" };
	}

	/* Form section for Japan: everything except the per-purpose, recipient and foreign-country fields. */
	var JP_SECTION = {
		title: "Japan: Act on the Protection of Personal Information",
		show: jpOn,
		lead: "The APPI as in force (the 2026 amendment is not yet in force). Mark special care-required personal information with each purpose above, the basis for each third party with each recipient, and third parties in foreign countries under transfers.",
		fields: [
			{ id: "jpScope", type: "select", label: "How the APPI applies to you", opts: [
				{ v: "in", l: "We handle the personal information in Japan" },
				{ v: "abroad", l: "We are outside Japan and handle the personal information of people in Japan in connection with goods or services provided to them" }],
			  hint: "Article 171 for a business abroad. Japanese administrative organs, local governments and most incorporated administrative agencies follow Chapter 5 and are not modelled." },
			{ id: "jpOffWhere", type: "text", label: "The country or region where you are based and handle the personal information", show: jpOffshore, ph: "for example Singapore",
			  hint: "Added to your address if the address does not name it (Guidelines 3-8-1)." },
			{ id: "jpKind", type: "select", label: "The business is", opts: [
				{ v: "corp", l: "A corporation (a company or other legal person)" },
				{ v: "assoc", l: "An association without legal personality that has a representative or administrator" },
				{ v: "indiv", l: "An individual (a sole trader)" }],
			  hint: "Article 32(1)(i): for a corporation, the name of the person who represents it; for such an association, its representative or administrator; none for an individual." },
			{ id: "jpRepName", type: "text", label: function (s) { return v(s, "jpKind") === "assoc" ? "Name of the association's representative or administrator" : "Name of the person who represents the company"; },
			  ph: "for example Taro Yamada, Representative Director", show: function (s) { return v(s, "jpKind") !== "indiv"; } },
			{ id: "jpNoRecip", type: "yesno", label: "You listed no recipients. Confirm that no one else receives the personal data, not even service providers you entrust it to",
			  show: function (s) { return !arr(s, "recipients").length; } },
			{ id: "jpJointItems", type: "text", label: "Joint use: the items of personal data used jointly", show: function (s) { return jpProv(s, "joint").length > 0; },
			  hint: "Article 27(5)(iii): the fact of joint use, the items, the scope of joint users, their purposes, and who is responsible." },
			{ id: "jpJointScope", type: "text", label: "Joint use: who uses it jointly (leave empty to list the joint-use recipients)", show: function (s) { return jpProv(s, "joint").length > 0; },
			  hint: "Clear enough for people to tell which businesses will use it (Guidelines 3-6-3)." },
			{ id: "jpJointPurpose", type: "text", label: "Joint use: the purposes of the joint users", show: function (s) { return jpProv(s, "joint").length > 0; } },
			{ id: "jpJointResp", type: "text", label: "Joint use: name, address and representative of the person responsible for managing the data", show: function (s) { return jpProv(s, "joint").length > 0; } },
			{ id: "jpOptItems", type: "text", label: "Opt-out provision: the items of personal data provided", show: function (s) { return jpProv(s, "optout").length > 0; },
			  hint: "Article 27(2): filed with the PPC beforehand; not for special care-required personal information, data acquired improperly, or data received under the opt-out scheme." },
			{ id: "jpOptAcq", type: "text", label: "Opt-out provision: how the personal data is acquired", show: function (s) { return jpProv(s, "optout").length > 0; } },
			{ id: "jpOptHow", type: "text", label: "Opt-out provision: how it is provided", show: function (s) { return jpProv(s, "optout").length > 0; } },
			{ id: "jpOptReq", type: "text", label: "Opt-out provision: how people ask you to stop", show: function (s) { return jpProv(s, "optout").length > 0; } },
			{ id: "jpOptUpdate", type: "text", label: "Opt-out provision: how the personal data provided is updated", show: function (s) { return jpProv(s, "optout").length > 0; }, hint: "Rules Article 11(4)(i)." },
			{ id: "jpOptStart", type: "date", label: "Opt-out provision: the planned start date, as filed", show: function (s) { return jpProv(s, "optout").length > 0; }, hint: "Rules Article 11(4)(ii)." },
			{ id: "jpRelIn", type: "yesno", label: "Do you receive personal related information (cookie identifiers, device identifiers, browsing history) from other businesses and link it to personal data that identifies people?",
			  hint: "Article 31(1): the provider may give it only once the person has consented to your acquiring it as personal data. You ask for that consent." },
			{ id: "jpRelWhat", type: "text", label: "What you receive, and from whom", show: function (s) { return yes(s, "jpRelIn"); }, ph: "for example browsing history on partner sites, from an advertising network" },
			{ id: "jpRelOut", type: "yesno", label: "Do you provide personal related information to other businesses that you expect will link it to personal data?",
			  hint: "Article 31(1): confirm their consent first. Covered in the delivery checklist." },
			{ id: "jpPseudo", type: "yesno", label: "Do you create pseudonymously processed information?", hint: "Article 41: its purposes of use are published, not notified." },
			{ id: "jpPseudoPurpose", type: "text", label: "The purposes of use of the pseudonymously processed information", show: function (s) { return yes(s, "jpPseudo"); } },
			{ id: "jpAnon", type: "yesno", label: "Do you create anonymously processed information?", hint: "Article 43(3), (4): publish the items it contains and, when you provide it, the items and the method." },
			{ id: "jpAnonItems", type: "text", label: "The items of information about individuals it contains", show: function (s) { return yes(s, "jpAnon"); } },
			{ id: "jpAnonProv", type: "text", label: "If you provide it to third parties: the items provided and how (leave empty if you do not)", show: function (s) { return yes(s, "jpAnon"); } },
			{ id: "jpSecurity", type: "area", rows: 3, label: "The security measures you take", ph: "for example a basic policy; handling rules; a person responsible and reporting lines; staff training; access control to offices; encryption and access logs",
			  hint: "Cabinet Order Article 10(i). A statement that you follow the PPC guidelines is not enough (Guidelines 3-8-1). Leave out details that would weaken security." },
			{ id: "jpForeignWhere", type: "text", label: "Countries where you or the service providers you entrust handle personal data, including on servers abroad",
			  hint: "Guidelines 3-8-1 and 10-7: understanding the external environment; name the countries in a form people can recognise." },
			{ id: "jpReqHow", type: "area", rows: 2, label: "How people make requests: where to send them, the form, and how you check identity",
			  hint: "Article 32(1)(iii); Cabinet Order Article 12. Leave empty to use the rights contact or the email address." },
			{ id: "jpFee", type: "yesno", label: "Do you charge a fee for notifying the purpose of use or for a disclosure?" },
			{ id: "jpFeeAmount", type: "text", label: "The fee", show: function (s) { return yes(s, "jpFee"); }, hint: "Article 38(2): reasonable in view of the actual cost." },
			{ id: "jpFeeHow", type: "text", label: "How the fee is paid", show: function (s) { return yes(s, "jpFee"); }, hint: "Cabinet Order Article 12(iv)." },
			{ id: "jpComplaint", type: "text", label: "Where people make complaints about your handling of personal information", hint: "Cabinet Order Article 10(ii). Leave empty to use the email address." },
			{ id: "jpAcc", type: "yesno", label: "Are you a member of an accredited personal information protection organisation?" },
			{ id: "jpAccName", type: "text", label: "Its name", show: function (s) { return yes(s, "jpAcc"); } },
			{ id: "jpAccContact", type: "text", label: "Where to make complaints to it", show: function (s) { return yes(s, "jpAcc"); } },
			{ id: "jpKids", type: "yesno", label: "Do you handle the personal information of children?",
			  hint: "Where a minor cannot judge the consequences of consenting, consent comes from a parent or legal representative (Guidelines 2-16). The 2026 amendment, not yet in force, adds rules for people under 16." }
		]
	};

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
	/* ===================================================== AUSTRALIA === */
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
	var PN = {
		key: "pn",
		title: "Privacy notice",
		sections: [
			{ title: "Who the notice is for",
			  lead: "One notice per audience. A notice written for everyone is usually too vague for anyone (WP260 9: intelligible to an average member of the intended audience).",
			  fields: [
				{ id: "audience", type: "select", label: "Audience", opts: AUDIENCES },
				{ id: "audienceOther", type: "text", label: "Describe the audience", show: function (s) { return v(s, "audience") === "other"; } },
				{ id: "regimes", type: "checks", label: "Laws the notice covers", opts: D.REGIMES, dflt: ["eu"],
				  hint: "Tick each law that applies to the people this notice is for. The first one ticked in this list sets the main text; each other one adds a section of its own. With nothing ticked, the notice follows the EU GDPR." },
				{ id: "canJur", type: "checks", label: "Canada: the laws that apply", opts: D.CAN_JUR, dflt: ["fed"], show: canOn,
				  hint: "PIPEDA covers commercial activity across Canada, federally regulated businesses such as banks, airlines and telecoms, and personal information that crosses a provincial or national border. Quebec, Alberta and British Columbia have their own laws for activity inside the province. Tick every one that applies. With nothing ticked, the notice follows PIPEDA." },
				{ id: "memberState", type: "text", label: "Member State whose employment law applies", show: function (s) { return v(s, "audience") === "employee" && inReg(s, "eu"); },
				  hint: "Article 88 lets Member States set more specific rules for employee data, in particular on transparency and workplace monitoring. This generator does not model them." },
				{ id: "channel", type: "checks", label: "Where people meet the notice", opts: [
					{ v: "web", l: "Website" }, { v: "app", l: "Mobile app" }, { v: "paper", l: "Paper or in person" }, { v: "phone", l: "Telephone" }, { v: "device", l: "A device without a screen" }] },
				{ id: "children", type: "yesno", label: "Are children a significant part of the audience?", show: function (s) { return prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za"; } },
				{ id: "brKids", type: "yesno", label: "Brazil: do you process personal data of children (under 12) or adolescents (12 to 17)?", show: function (s) { return inReg(s, "br"); },
				  hint: "Article 14 LGPD, read with the Statute of the Child and Adolescent. Any legal basis in Articles 7 and 11 can be used, as long as the best interest of the child or adolescent prevails (Enunciado CD/ANPD 1/2023)." },
				{ id: "brKidsHow", type: "area", rows: 2, label: "Where you rely on consent for a child's data: how a parent or legal guardian gives it, and how you check it", show: function (s) { return inReg(s, "br") && yes(s, "brKids"); },
				  hint: "Specific and highlighted consent of at least one parent or the legal guardian, with reasonable efforts to verify it (Article 14, paragraphs 1 and 5)." },
				{ id: "brKidsData", type: "text", label: "Data you collect about children and adolescents, if different from the purposes section (optional)", show: function (s) { return inReg(s, "br") && yes(s, "brKids"); },
				  hint: "Article 14, paragraph 2: keep public the types of data collected about them, how you use it and how to exercise rights." },
				{ id: "canKids", type: "yesno", label: function (s) { return "Canada: do you collect personal information of children under 13" + (canQc(s) ? ", or of minors under 14 in Quebec" : "") + "?"; }, show: canOn,
				  hint: "The OPC takes the position that, in all but exceptional circumstances, a child under 13 cannot give meaningful consent. Quebec: a parent or tutor consents for a minor under 14 (sections 4.1 and 14)." },
				{ id: "canKidsHow", type: "area", rows: 2, label: "Canada: how a parent or guardian gives consent for a child, and how you check it", show: function (s) { return canOn(s) && yes(s, "canKids"); } },
				{ id: "languages", type: "text", label: "Languages the notice is published in", ph: "for example English, Spanish" }
			] },
			{ title: "Who you are",
			  fields: [
				{ id: "ctrlName", type: "text", label: function (s) { return prim(s) === "can" ? "Organisation" : prim(s) === "in" ? "Organisation (the Data Fiduciary)" : prim(s) === "cn" ? "Organisation (the personal information processor)" : prim(s) === "jp" ? "Organisation (the business handling personal information)" : prim(s) === "kr" ? "Organisation (the personal information controller)" : prim(s) === "sg" || prim(s) === "au" ? "Organisation" : prim(s) === "za" ? "Organisation (the responsible party)" : "Organisation (the controller)"; }, ph: "Legal name" },
				{ id: "ctrlAddress", type: "area", label: "Postal address", rows: 2 },
				{ id: "ctrlEmail", type: "text", label: "Email for privacy questions" },
				{ id: "ctrlPhone", type: "text", label: "Telephone (optional)" },
				{ id: "publicBody", type: "yesno", label: "Is the organisation a public authority or body?" },
				{ id: "euEstablished", type: "yesno", label: "Is the organisation established in the EU or EEA?", show: function (s) { return inReg(s, "eu"); },
				  hint: "If not, the GDPR applies to it under Article 3(2) when it offers goods or services to people in the EU or monitors their behaviour there. That is when a representative is needed." },
				{ id: "ukEstablished", type: "yesno", label: "Is the organisation established in the United Kingdom?", show: function (s) { return inReg(s, "uk"); },
				  hint: "If not, the UK GDPR applies to it under Article 3(2) when it offers goods or services to people in the UK or monitors their behaviour there." },
				{ id: "chEstablished", type: "yesno", label: "Does the organisation have its registered office or domicile in Switzerland?", show: function (s) { return inReg(s, "ch"); },
				  hint: "The FADP applies to processing that has an effect in Switzerland, wherever it starts (Article 3)." },
				{ id: "brEstablished", type: "yesno", label: "Is the organisation established in Brazil?", show: function (s) { return inReg(s, "br"); },
				  hint: "The LGPD applies wherever the organisation is, when it processes data in Brazil, offers or supplies goods or services to people in Brazil or processes data of people located there, or processes data collected in Brazil, that is from people who were in Brazil when it was collected (Article 3). It requires no representative." },
				{ id: "ctrlCountry", type: "text", label: "Country where the organisation is established", show: notEstablished },
				{ id: "repExempt", type: "yesno", label: "Does the Article 27(2) GDPR exemption apply?", show: function (s) { return inReg(s, "eu") && no(s, "euEstablished"); },
				  hint: "Only for occasional processing that is unlikely to result in a risk and involves no large-scale special category or criminal offence data, or for a public authority or body." },
				{ id: "repName", type: "text", label: "Representative in the Union", show: function (s) { return inReg(s, "eu") && no(s, "euEstablished") && !yes(s, "repExempt"); } },
				{ id: "repContact", type: "text", label: "Representative's contact details", show: function (s) { return inReg(s, "eu") && no(s, "euEstablished") && !yes(s, "repExempt"); } },
				{ id: "ukRepExempt", type: "yesno", label: "Does the Article 27(2) UK GDPR exemption apply?", show: function (s) { return inReg(s, "uk") && no(s, "ukEstablished"); },
				  hint: "The same two cases as in the GDPR: occasional, low-risk processing with no large-scale special category or criminal offence data, or a public authority or body." },
				{ id: "ukRepName", type: "text", label: "Representative in the United Kingdom", show: function (s) { return inReg(s, "uk") && no(s, "ukEstablished") && !yes(s, "ukRepExempt"); } },
				{ id: "ukRepContact", type: "text", label: "UK representative's contact details", show: function (s) { return inReg(s, "uk") && no(s, "ukEstablished") && !yes(s, "ukRepExempt"); } },
				{ id: "chRepNeeded", type: "yesno", label: "Do all four conditions of Article 14(1) FADP apply?", show: function (s) { return inReg(s, "ch") && no(s, "chEstablished"); },
				  hint: "You process data of people in Switzerland in connection with offering them goods or services or monitoring their behaviour, on a large scale, regularly, and with a high risk to their personality. Only private organisations." },
				{ id: "chRepName", type: "text", label: "Representative in Switzerland", show: function (s) { return inReg(s, "ch") && no(s, "chEstablished") && yes(s, "chRepNeeded"); } },
				{ id: "chRepAddress", type: "text", label: "Swiss representative's address", show: function (s) { return inReg(s, "ch") && no(s, "chEstablished") && yes(s, "chRepNeeded"); },
				  hint: "Article 14(3) requires the name and the address to be published." },
				{ id: "brSmall", type: "yesno", label: "Brazil: is the organisation a small processing agent (Resolution CD/ANPD 2/2022)?", show: function (s) { return inReg(s, "br") && !yes(s, "publicBody"); },
				  hint: "Private legal entities, including non-profits, micro and small companies and startups, natural persons and unincorporated private entities, within the revenue limits; never public bodies. Not if it belongs to a group above the limits (Articles 2 and 3)." },
				{ id: "brHighRisk", type: "yesno", label: "Brazil: is any of this processing high-risk (Resolution CD/ANPD 2/2022, Article 4)?", show: function (s) { return inReg(s, "br") && yes(s, "brSmall") && !yes(s, "publicBody"); },
				  hint: "High-risk means at least one general criterion (large scale, or able to significantly affect people's interests and fundamental rights) together with one specific criterion (emerging or innovative technology, surveillance of publicly accessible areas, solely automated decisions including profiling, sensitive data, or data of children, adolescents or older people). A high-risk small agent keeps none of the reliefs: it appoints an encarregado and uses the normal time limits (Article 3, I)." },
				{ id: "brEnc", type: "yesno", label: "Brazil: have you appointed an encarregado (data protection officer) anyway?", show: function (s) { return inReg(s, "br") && brSmallOk(s); },
				  hint: "Optional for small agents, and counted as good practice (Article 11, paragraph 2). Without one, offer a channel for people to contact you." },
				{ id: "brEncKind", type: "select", label: "Brazil: the encarregado is", show: function (s) { return inReg(s, "br") && brEncNeeded(s); },
				  opts: [{ v: "person", l: "A natural person, employee or external" }, { v: "entity", l: "A legal entity" }],
				  hint: "Article 41 LGPD requires every controller that is not exempt to appoint one; Resolution CD/ANPD 18/2024 sets the rules. The encarregado must be able to communicate clearly and precisely in Portuguese with data subjects and the ANPD (Article 13)." },
				{ id: "brEncName", type: "text", label: function (s) { return v(s, "brEncKind") === "entity" ? "Encarregado: business name" : "Encarregado: full name"; }, show: function (s) { return inReg(s, "br") && brEncNeeded(s); },
				  hint: "Resolution CD/ANPD 18/2024, Article 9, paragraph 1: the full name of a natural person; for a legal entity, its business name or trade name and the full name of the person responsible." },
				{ id: "brEncResp", type: "text", label: "Full name of the person responsible at that legal entity", show: function (s) { return inReg(s, "br") && brEncNeeded(s) && v(s, "brEncKind") === "entity"; } },
				{ id: "brEncContact", type: "text", label: "Encarregado: contact details", show: function (s) { return inReg(s, "br") && brEncNeeded(s); },
				  hint: "At least the means that let people exercise their rights and let the ANPD reach the encarregado. Publish them prominently on your website (Article 9, caput and paragraph 2)." },
				{ id: "brChannel", type: "text", label: "Brazil: channel people use to contact you about their data", show: function (s) { return inReg(s, "br") && !brEncNeeded(s); },
				  ph: "for example privacidade@example.com.br", hint: "Required when a small agent appoints no encarregado (Resolution CD/ANPD 2/2022, Article 11, paragraph 1)." },
				{ id: "canPicName", type: "text", label: function (s) { return "Canada: name or title of the person accountable for privacy" + (canQc(s) ? " (in Quebec, the person in charge of the protection of personal information)" : ""); }, show: canOn,
				  ph: "for example Privacy Officer",
				  hint: function (s) { return "PIPEDA principle 4.8.2(a): the name or title, and the address, of the person accountable, to whom complaints and questions can be sent." + (canQc(s) ? " Quebec: the person with the highest authority in the organisation holds this role unless it is delegated in writing (section 3.1)." : ""); } },
				{ id: "canPicContact", type: "text", label: "Canada: that person's address and other contact details", show: canOn, ph: "for example 100 Main Street, Toronto ON M5V 1A1, privacy@example.ca" },
				{ id: "canGovUrl", type: "text", label: "Quebec: where detailed information about your governance policies is published", ph: "for example example.ca/privacy/governance", show: canQc,
				  hint: "Section 3.2: policies on keeping and destroying personal information, staff roles and responsibilities, and complaints, published in clear and simple language on your website." },
				{ id: "canForWhom", type: "text", label: "Quebec: if you collect the information for another organisation, its name (optional)", show: canQc },
				{ id: "canRelated", type: "yesno", label: "Canada: do you make personal information available to related organisations, such as subsidiaries or affiliates?", show: canFed,
				  hint: "PIPEDA principle 4.8.2(e)." },
				{ id: "canRelatedWhat", type: "text", label: "Canada: what information, to which related organisations, and why", show: function (s) { return canFed(s) && yes(s, "canRelated"); } },
				{ id: "dpo", type: "yesno", label: function (s) { return prim(s) === "ch" ? "Has a data protection officer been appointed (Article 10 FADP)?" : "Has a data protection officer been designated?"; },
				  show: function (s) { return !usStyle(s) && prim(s) !== "br" && prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za"; } },
				{ id: "dpoContact", type: "text", label: "DPO contact details", show: function (s) { return !usStyle(s) && prim(s) !== "br" && prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za" && yes(s, "dpo"); },
				  hint: function (s) { return prim(s) === "ch" ? "Optional for private organisations. To rely on Article 23(4), the officer must be professionally independent, free of instructions and of incompatible tasks, and have the expertise; publish the contact details and notify the FDPIC (Article 10(3))." : "The GDPR requires contact details. A name is not required."; } },
				{ id: "joint", type: "yesno", label: "Do you decide purposes and means jointly with another organisation for any of this processing?", show: function (s) { return !usStyle(s) && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za"; } },
				{ id: "jointWho", type: "text", label: "The other controller(s)", show: function (s) { return !usStyle(s) && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za" && yes(s, "joint"); } },
				{ id: "jointEssence", type: "area", label: "Essence of the arrangement: who does what", show: function (s) { return !usStyle(s) && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za" && yes(s, "joint"); },
				  hint: "Mark the purposes concerned in the purposes section. List the other controller as a recipient too (Article 4(9))." },
				{ id: "jointContact", type: "text", label: "Which controller people should contact", show: function (s) { return !usStyle(s) && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za" && yes(s, "joint"); } }
			] },
			{ title: "Where the data comes from", show: function (s) { return !usStyle(s); },
			  fields: [
				{ id: "source", type: "select", label: "Source of the personal data", opts: function (s) {
					return !gdprLed(s) ? [{ v: "direct", l: "From the person" }, { v: "indirect", l: "From other sources" }, { v: "both", l: "Both" }] :
						[{ v: "direct", l: "From the person (Article 13)" }, { v: "indirect", l: "From other sources (Article 14)" }, { v: "both", l: "Both" }]; } },
				{ id: "sources", type: "repeater", label: "Other sources", itemLabel: "Source", add: "Add a source", show: pnSourceIndirect,
				  fields: [
					{ id: "name", type: "text", label: "Source (name it where you can)" },
					{ id: "what", type: "text", label: "Categories of data obtained from it" },
					{ id: "usedFor", type: "select", label: "Used for which purpose", hint: "Add the purpose first. Its legal basis and retention then cover this data.", opts: actOpts },
					{ id: "pub", type: "yesno", label: "Publicly accessible?" }
				  ] },
				{ id: "unattributable", type: "yesno", label: "Are there records you cannot attribute to a specific source?", show: pnSourceIndirect,
				  hint: "Only where individual records genuinely cannot be traced to a source. Using several sources is not enough (WP260 60)." },
				{ id: "sourceNature", type: "text", label: "Nature of those sources: public or private, and type of organisation or sector",
				  show: function (s) { return pnSourceIndirect(s) && yes(s, "unattributable"); } }
			] },
			{ title: "What you use the data for", show: function (s) { return !usStyle(s); },
			  lead: "One row per purpose. State each purpose so a reader knows what happens: \"to make suggestions based on products you bought\", not \"to personalise services\" (WP260 12).",
			  fields: [
				{ id: "acts", type: "repeater", label: "Purposes", itemLabel: "Purpose", add: "Add a purpose",
				  fields: [
					{ id: "purpose", type: "text", label: "Purpose" },
					{ id: "data", type: "text", label: "Personal data used" },
					{ id: "basis", type: "select", label: "Legal basis", opts: basisOpts, show: function (s) { return gdprLed(s); } },
					{ id: "rliCond", type: "select", label: "Annex 1 condition (Article 6(5) UK GDPR)", opts: D.UK_RLI, show: function (s, a) { return basisOf(s, a) === "ea"; },
					  hint: "Only the conditions listed in Annex 1. Public authorities cannot rely on (ea) for their tasks." },
					{ id: "li", type: "area", label: "The legitimate interest pursued", rows: 2, show: function (s, a) { return basisOf(s, a) === "f"; } },
					{ id: "lawRef", type: "text", label: "The law that sets the obligation or task", show: function (s, a) { return prim(s) === "eu" && (basisOf(s, a) === "c" || basisOf(s, a) === "e"); } },
					{ id: "lawRefUk", type: "text", label: "The UK law that sets the obligation or task", show: function (s, a) { return prim(s) === "uk" && (basisOf(s, a) === "c" || basisOf(s, a) === "e"); } },
					{ id: "chGround", type: "select", label: "Justification relied on (optional)", opts: D.CH_GROUNDS, show: function (s) { return prim(s) === "ch"; },
					  hint: "The FADP does not require a legal basis for processing by private organisations. A justification is needed where processing would otherwise breach personality rights, for example against the person's express wishes (Articles 30 and 31)." },
					{ id: "brBasis", type: "select", label: function (s) { return prim(s) === "br" ? "Legal basis (Article 7 LGPD)" : "Brazil: legal basis (Article 7 LGPD)"; }, opts: D.BR_BASES, show: function (s) { return inReg(s, "br"); },
					  hint: "Its own answer: a GDPR legal basis is never read as an LGPD one. For a purpose that uses only sensitive data, the Article 11 basis below is enough." },
					{ id: "brLi", type: "area", rows: 2, label: "Brazil: the legitimate interest pursued, and the concrete situation it rests on (Article 10)", show: function (s, a) { return brBasisOf(s, a) === "IX"; },
					  hint: "For example support and promotion of your activities, or protecting the person's exercise of their rights or providing services that benefit them, within their legitimate expectations (Article 10, I and II)." },
					{ id: "brLawRef", type: "text", label: "Brazil: the law, regulation or public policy relied on (optional)", show: function (s, a) { var b = brBasisOf(s, a); return b === "II" || b === "III"; } },
					{ id: "brSens", type: "select", label: function (s) { return prim(s) === "br" ? "Sensitive personal data (Article 11 basis)" : "Brazil: sensitive personal data (Article 11 basis)"; }, opts: D.BR_SENS, show: function (s) { return inReg(s, "br"); },
					  hint: "Leave on Choose if none. Sensitive: racial or ethnic origin, religious belief, political opinion, membership of a trade union or of a religious, philosophical or political organisation, health or sex life, genetic or biometric data (Article 5, II). Legitimate interests is not available for it." },
					{ id: "canNeed", type: "yesno", label: function (s) { return (prim(s) === "can" ? "Is" : "Canada: is") + " this use needed to provide the product or service the person asked for?"; }, show: canOn,
					  hint: "A condition of service. Anything not needed must be optional, unless the law allows it without consent (PIPEDA principle 4.3.3; OPC consent guidelines, principle 3)." },
					{ id: "canConsent", type: "select", label: function (s) { return (prim(s) === "can" ? "How" : "Canada: how") + " consent works for it"; }, opts: D.CAN_CONSENT, show: canOn,
					  hint: "Express consent for sensitive information, for uses people would not reasonably expect, and where a meaningful risk of significant harm remains (OPC consent guidelines). An opt-out needs a notice and a reasonable chance to decline (Alberta and British Columbia PIPA, section 8(3))." },
					{ id: "canLaw", type: "text", label: "Canada: the provision of each ticked law that allows it without consent", ph: "for example PIPEDA section 7(2)(a); Quebec section 12, second paragraph, subparagraph 3", show: function (s, a) { return canOn(s) && v(a, "canConsent") === "none"; },
					  hint: "The exceptions to consent are closed lists in each law. Being needed for the service is not one: choose implied consent where people give the information for an obvious purpose." },
					{ id: "canSens", type: "yesno", label: function (s) { return (prim(s) === "can" ? "Is" : "Canada: is") + " the information sensitive?"; }, show: canOn,
					  hint: "By its nature or its context: for example health, financial, biometric or genetic information, ethnic origin, political opinions, religious beliefs, sex life or sexual orientation. Quebec: information that, by its nature or context, gives rise to a high level of reasonable expectation of privacy (section 12)." },
					{ id: "inGround", type: "select", label: function (s) { return (prim(s) === "in" ? "Ground" : "India: ground") + " under the DPDP Act (section 4)"; }, opts: function () { return D.IN_GROUNDS.map(function (x) { return { v: x.v, l: x.l }; }); }, show: inOn,
					  hint: "Consent, or one of the legitimate uses in section 7, which need no consent. Its own answer: no other law's legal basis is read as one." },
					{ id: "inEnables", type: "text", label: function (s) { return (prim(s) === "in" ? "" : "India: ") + "the goods or services provided, or the uses enabled, by this processing"; }, show: function (s, a) { return inOn(s) && v(a, "inGround") === "consent"; },
					  ph: "for example delivering your order and sending its tracking updates", hint: "Rule 3(b)(ii): the notice describes them specifically, next to the itemised personal data." },
					{ id: "cnBasis", type: "select", label: function (s) { return (prim(s) === "cn" ? "Ground" : "China: ground") + " under the PIPL (Article 13)"; }, opts: function () { return D.CN_BASES.map(function (x) { return { v: x.v, l: x.l }; }); }, show: cnOn,
					  hint: "Consent, or one of the six grounds that need no consent (Article 13, second paragraph). Its own answer: no other law's legal basis is read as one. The PIPL has no legitimate interests ground." },
					{ id: "cnLaw", type: "text", label: "China: the law or administrative regulation", show: function (s, a) { return cnOn(s) && v(a, "cnBasis") === "law"; } },
					{ id: "cnSens", type: "yesno", label: function (s) { return (prim(s) === "cn" ? "Does" : "China: does") + " this purpose use sensitive personal information?"; }, show: cnOn,
					  hint: "Article 28: biometric, religious belief, specific identity, medical health, financial account and whereabouts information, the personal information of minors under 14, and any information whose leak or misuse can easily harm a person's dignity, or personal or property safety." },
					{ id: "cnKidsP", type: "yesno", label: "China: does this purpose use the personal information of minors under 14?", show: function (s) { return cnOn(s) && yes(s, "cnKids"); },
					  hint: "Article 28: it is sensitive personal information, so the notice says why it is necessary and its impact (Article 30)." },
					{ id: "cnSensWhy", type: "text", label: "China: why the sensitive personal information is necessary, and its impact on the person", show: function (s, a) { return cnOn(s) && cnSensOn(s, a); },
					  hint: "Article 30 and Regulations Article 21(1)(2): both go in the notice." },
					{ id: "cnMethodP", type: "text", label: "China: how this purpose is processed, if it differs from the general answer (optional)", show: cnOn,
					  hint: "Regulations Article 21, second paragraph: purposes, methods and categories are set out as a list. Filled for any purpose, the China table gets a column for it." },
					{ id: "jpSens", type: "yesno", label: function (s) { return (prim(s) === "jp" ? "Does" : "Japan: does") + " this purpose use special care-required personal information?"; }, show: jpOn,
					  hint: "Article 2(3) and Cabinet Order Article 2: race, creed, social status, medical history, criminal record, having been a victim of crime, disabilities, health checks and treatment, criminal or juvenile proceedings." },
					{ id: "jpSensG", type: "select", label: "Japan: ground for acquiring it (Article 20(2))", opts: function () { return D.JP_SENS_GROUNDS.map(function (x) { return { v: x.v, l: x.l }; }); }, show: function (s, a) { return jpOn(s) && yes(a, "jpSens"); } },
					{ id: "krBasis", type: "select", label: function (s) { return (prim(s) === "kr" ? "Basis" : "Korea: basis") + " under the PIPA (Article 15(1))"; }, opts: function (s) { return D.KR_BASES.filter(function (x) { return x.v !== "public" || !no(s, "publicBody"); }).map(function (x) { return { v: x.v, l: x.l }; }); }, show: krOn,
					  hint: "Consent, or one of the six cases that need no consent. Its own answer: no other law's legal basis is read as one. Data processed without consent is listed apart, with its basis (Article 22(3))." },
					{ id: "krLaw", type: "text", label: "Korea: the law and article", show: function (s, a) { return krOn(s) && v(a, "krBasis") === "law"; } },
					{ id: "krRefuse", type: "text", label: "Korea: what follows if the person refuses consent", show: function (s, a) { return krOn(s) && v(a, "krBasis") === "consent"; },
					  ph: "for example you do not receive event news; you can still use the service", hint: "Article 15(2)(4). Refusing optional consent cannot cost people the goods or services (Articles 16(3), 22(5))." },
					{ id: "krSens", type: "yesno", label: function (s) { return (prim(s) === "kr" ? "Does" : "Korea: does") + " this purpose use sensitive information or unique identifiers, including resident registration numbers?"; }, show: krOn,
					  hint: "Article 23 and Enforcement Decree Article 18: beliefs, trade union or party membership, political views, health, sex life, genetic test and criminal record data, biometric data used to identify a person, race or ethnicity. Article 24 and Enforcement Decree Article 19: resident registration, passport, driving licence and alien registration numbers." },
					{ id: "krSensKinds", type: "checks", label: "Korea: which of them", show: function (s, a) { return krOn(s) && yes(a, "krSens"); },
					  opts: [{ v: "sens", l: "Sensitive information (Article 23)" }, { v: "uid", l: "Passport, driving licence or alien registration numbers (Article 24)" }, { v: "rrn", l: "Resident registration numbers (Article 24-2)" }] },
					{ id: "krSensBasis", type: "select", label: "Korea: basis for the sensitive information", show: function (s, a) { return krOn(s) && krHasKind(a, "sens"); },
					  opts: [{ v: "consent", l: "Consent given separately from other consents (Article 23(1)(1))" }, { v: "law", l: "A law requires or allows it (Article 23(1)(2))" }] },
					{ id: "krSensLaw", type: "text", label: "Korea: the law and article for the sensitive information", show: function (s, a) { return krOn(s) && krHasKind(a, "sens") && v(a, "krSensBasis") === "law"; } },
					{ id: "krUidBasis", type: "select", label: "Korea: basis for the unique identifiers", show: function (s, a) { return krOn(s) && krHasKind(a, "uid"); },
					  opts: [{ v: "consent", l: "Consent given separately from other consents (Article 24(1)(1))" }, { v: "law", l: "A law specifically requires or allows it (Article 24(1)(2))" }] },
					{ id: "krUidLaw", type: "text", label: "Korea: the law and article for the unique identifiers", show: function (s, a) { return krOn(s) && krHasKind(a, "uid") && v(a, "krUidBasis") === "law"; } },
					{ id: "krRrnBasis", type: "select", label: "Korea: basis for the resident registration numbers (Article 24-2(1))", show: function (s, a) { return krOn(s) && krHasKind(a, "rrn"); },
					  opts: [{ v: "law", l: "A law, decree or rule specifically requires or allows it (Article 24-2(1)(1))" }, { v: "urgent", l: "Clearly needed for urgent life, body or property (Article 24-2(1)(2))" }, { v: "notice", l: "A case the PIPC sets by notice (Article 24-2(1)(3))" }],
					  hint: "Consent is not a basis for resident registration numbers." },
					{ id: "krRrnLaw", type: "text", label: function (s, a) { return v(a, "krRrnBasis") === "notice" ? "Korea: the PIPC notice relied on" : "Korea: the law and article"; }, show: function (s, a) { return krOn(s) && krHasKind(a, "rrn") && (v(a, "krRrnBasis") === "law" || v(a, "krRrnBasis") === "notice"); } },
					{ id: "sgBasis", type: "select", label: function (s) { return (prim(s) === "sg" ? "How" : "Singapore: how") + " the PDPA allows it"; }, opts: function () { return D.SG_BASES.map(function (x) { return { v: x.v, l: x.l }; }); }, show: sgOn,
					  hint: "Consent, deemed consent (sections 15 and 15A), or an exception (section 17; First and Second Schedules). Its own answer: no other law's legal basis is read as one." },
					{ id: "sgOptOut", type: "text", label: "Singapore: how and by when people can opt out", show: function (s, a) { return sgOn(s) && v(a, "sgBasis") === "notify"; },
					  ph: "for example use the link in our email of 1 March within 30 days", hint: "Section 15A(4)(b)(iii). Not for sending marketing messages (regulation 13)." },
					{ id: "sgLi", type: "text", label: "Singapore: the legitimate interest (optional)", show: function (s, a) { return sgOn(s) && v(a, "sgBasis") === "li"; },
					  hint: "First Schedule, Part 3, paragraph 1. Not for sending marketing messages (paragraph 1(4))." },
					{ id: "sgExc", type: "text", label: "Singapore: the exception, with its Schedule, Part and paragraph", show: function (s, a) { return sgOn(s) && v(a, "sgBasis") === "exception"; },
					  ph: "for example First Schedule, Part 3, paragraph 4: recovering a debt" },
					{ id: "sgLaw", type: "text", label: "Singapore: the law and section", show: function (s, a) { return sgOn(s) && v(a, "sgBasis") === "law"; } },
					{ id: "auSens", type: "select", label: function (s) { return (prim(s) === "au" ? "S" : "Australia: s") + "ensitive information, and how the APPs allow collecting it"; }, opts: function () { return D.AU_SENS.map(function (x) { return { v: x.v, l: x.l }; }); }, show: auOn,
					  hint: "Sensitive information (s. 6(1)): racial or ethnic origin, political opinions or association membership, religious or philosophical beliefs, professional or trade association or trade union membership, sexual orientation or practices, criminal record, health or genetic information, biometric information for automated verification or identification, biometric templates. APP 3.3 and 3.4." },
					{ id: "auSensLaw", type: "text", label: "Australia: the law, or the details of the court or tribunal order", show: function (s, a) { return auOn(s) && v(a, "auSens") === "law"; } },
					{ id: "auSensPgs", type: "select", label: "Australia: the permitted general situation (s. 16A)", show: function (s, a) { return auOn(s) && v(a, "auSens") === "pgs"; },
					  opts: function () { return D.AU_PGS.map(function (x) { return { v: x.v, l: x.l }; }); } },
					{ id: "auSensPhs", type: "text", label: "Australia: the permitted health situation (s. 16B)", show: function (s, a) { return auOn(s) && v(a, "auSens") === "phs"; },
					  ph: "for example necessary to provide a health service to you, and required by law" },
					{ id: "auLaw", type: "select", label: function (s) { return (prim(s) === "au" ? "D" : "Australia: d") + "oes an Australian law or a court or tribunal order require or authorise collecting it?"; }, show: auOn,
					  opts: [{ v: "no", l: "No" }, { v: "required", l: "Yes, it requires it" }, { v: "authorised", l: "Yes, it authorises it" }], hint: "APP 5.2(c): the policy names it." },
					{ id: "auLawName", type: "text", label: "Australia: the law, or the details of the order", show: function (s, a) { return auOn(s) && (v(a, "auLaw") === "required" || v(a, "auLaw") === "authorised"); },
					  ph: "for example Taxation Administration Act 1953" },
					{ id: "auConseq", type: "text", label: function (s) { return (prim(s) === "au" ? "T" : "Australia: t") + "he main consequences if the person does not provide it (optional)"; }, show: function (s) { return auOn(s) && pnSourceDirect(s); },
					  ph: "for example we cannot process your application", hint: "APP 5.2(e). Leave empty if there are none." },
					{ id: "zaBasis", type: "select", label: function (s) { return (prim(s) === "za" ? "L" : "South Africa: l") + "egal basis (s. 11(1))"; }, opts: function () { return D.ZA_BASES.map(function (x) { return { v: x.v, l: x.l }; }); }, show: zaOn,
					  hint: "Section 11(1). People can object to processing on (d), (e) or (f) (s. 11(3)(a))." },
					{ id: "zaBasisLaw", type: "text", label: "South Africa: the law that imposes the obligation", show: function (s, a) { return zaOn(s) && v(a, "zaBasis") === "law"; }, ph: "for example the Tax Administration Act 28 of 2011" },
					{ id: "zaBasisWhat", type: "text", label: function (s, a) { var b = v(a, "zaBasis"); return b === "dsli" ? "South Africa: the person's legitimate interest that the processing protects" : b === "public" ? "South Africa: the public law duty" : "South Africa: the legitimate interest"; },
					  show: function (s, a) { var b = v(a, "zaBasis"); return zaOn(s) && (b === "dsli" || b === "public" || b === "li"); } },
					{ id: "zaSpecial", type: "select", label: function (s) { return (prim(s) === "za" ? "S" : "South Africa: s") + "pecial personal information, and how section 27 allows it"; }, opts: function () { return D.ZA_SPECIAL.map(function (x) { return { v: x.v, l: x.l }; }); }, show: zaOn,
					  hint: "Special personal information (s. 26): religious or philosophical beliefs, race or ethnic origin, trade union membership, political persuasion, health or sex life, biometric information, and criminal behaviour." },
					{ id: "zaSpecialWhat", type: "text", label: "South Africa: the special personal information", show: function (s, a) { return zaOn(s) && !!v(a, "zaSpecial") && v(a, "zaSpecial") !== "none"; }, ph: "for example health information about absence from work" },
					{ id: "zaSpecialSec", type: "select", label: "South Africa: the section that allows it", show: function (s, a) { return zaOn(s) && v(a, "zaSpecial") === "specific"; },
					  opts: function () { return D.ZA_SPECIAL_SEC.map(function (x) { return { v: x.v, l: x.l }; }); } },
					{ id: "zaSpecialWhy", type: "text", label: function (s, a) { return v(a, "zaSpecial") === "auth" ? "South Africa: the Regulator's authorisation, with its Gazette notice" : v(a, "zaSpecialSec") === "32" ? "South Africa: how section 32 applies" : v(a, "zaSpecialSec") === "28" ? "South Africa: how section 28 applies" : "South Africa: details (optional)"; },
					  show: function (s, a) { return zaOn(s) && (v(a, "zaSpecial") === "auth" || v(a, "zaSpecial") === "specific"); }, hint: "Sections 28 and 32 list the bodies that can process religious or philosophical beliefs, or health or sex life information, and for what." },
					{ id: "zaLaw", type: "select", label: function (s) { return (prim(s) === "za" ? "D" : "South Africa: d") + "oes a particular law require or authorise collecting it?"; }, show: zaOn,
					  opts: [{ v: "no", l: "No" }, { v: "required", l: "Yes, it requires it" }, { v: "authorised", l: "Yes, it authorises it" }], hint: "Section 18(1)(f): the notice names it." },
					{ id: "zaLawName", type: "text", label: "South Africa: the law", show: function (s, a) { return zaOn(s) && (v(a, "zaLaw") === "required" || v(a, "zaLaw") === "authorised"); },
					  ph: "for example the Financial Intelligence Centre Act 38 of 2001" },
					{ id: "zaMand", type: "select", label: function (s) { return (prim(s) === "za" ? "I" : "South Africa: i") + "s giving the information voluntary or mandatory?"; }, show: function (s) { return zaOn(s) && pnSourceDirect(s); },
					  opts: [{ v: "voluntary", l: "Voluntary" }, { v: "mandatory", l: "Mandatory" }], hint: "Section 18(1)(d)." },
					{ id: "zaConseq", type: "text", label: function (s) { return (prim(s) === "za" ? "T" : "South Africa: t") + "he consequences if the person does not provide it"; }, show: function (s) { return zaOn(s) && pnSourceDirect(s); },
					  ph: "for example we cannot open your account", hint: "Section 18(1)(e). Leave empty to use your answer above, where there is one." },
					{ id: "art9", type: "select", label: function (s) { return prim(s) === "uk" ? "Special category data (Article 9(2) UK GDPR condition)" : "Special category data"; },
					  opts: D.ART9.filter(function (x) { return x.id; }).map(function (x) { return { v: x.id, l: x.label }; }), show: function (s) { return gdprLed(s); },
					  hint: "Leave on Choose if none." },
					{ id: "art9Law", type: "text", label: "Union or Member State law relied on (for (b), or a collective agreement; for (h), or a contract with a health professional)",
					  show: function (s, a) { return prim(s) === "eu" && !!D.ART9_NEEDS_LAW[art9Of(s, a)]; } },
					{ id: "art9LawUk", type: "text", label: function (s) { return prim(s) === "uk" ? "The Schedule 1 condition of the Data Protection Act 2018 relied on" : "For people in the UK: the Schedule 1 condition of the Data Protection Act 2018 relied on"; },
					  show: function (s, a) { return inReg(s, "uk") && !!D.ART9_NEEDS_LAW[art9Of(s, a)]; },
					  hint: "Part 1 of Schedule 1 for points (b), (h), (i) and (j); Part 2 for point (g)." },
					{ id: "crim", type: "yesno", label: "Criminal convictions or offences data?", show: function (s) { return gdprLed(s); } },
					{ id: "crimLaw", type: "text", label: "Law authorising it, or official authority", show: function (s, a) { return prim(s) === "eu" && crimOf(s, a); } },
					{ id: "crimLawUk", type: "text", label: function (s) { return prim(s) === "uk" ? "Schedule 1 condition of the Data Protection Act 2018, or official authority" : "For people in the UK: Schedule 1 condition of the Data Protection Act 2018, or official authority"; },
					  show: function (s, a) { return inReg(s, "uk") && crimOf(s, a); } },
					{ id: "retention", type: "text", label: "Retention period, or the criteria that set it", ph: "for example 6 months after the recruitment closes" },
					{ id: "required", type: "select", label: "Is providing the data required?", opts: REQUIRED, show: function (s) { return (prim(s) !== "ch" && prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za" || inReg(s, "br")) && pnSourceDirect(s); } },
					{ id: "consequence", type: "text", label: "What happens if the person does not provide it", ph: "for example you do not receive the newsletter",
					  show: function (s, a) { return (prim(s) !== "ch" && prim(s) !== "can" && prim(s) !== "in" && prim(s) !== "cn" && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za" || inReg(s, "br")) && pnSourceDirect(s) && !!v(a, "required"); } },
					{ id: "jointP", type: "yesno", label: "Is this purpose run jointly with the other controller?", show: function (s) { return yes(s, "joint") && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za"; } }
				  ] },
				{ id: "ukRliUse", type: "yesno", label: "For people in the UK, do you rely on a recognised legitimate interest (Article 6(1)(ea) UK GDPR) for any purpose?",
				  show: function (s) { return prim(s) === "eu" && inReg(s, "uk"); },
				  hint: "A UK-only basis with a fixed list of conditions in Annex 1, such as preventing crime or safeguarding a vulnerable individual. Not available under the EU GDPR." },
				{ id: "ukRli", type: "repeater", label: "Recognised legitimate interests (UK)", itemLabel: "Item", add: "Add a purpose", show: function (s) { return prim(s) === "eu" && inReg(s, "uk") && yes(s, "ukRliUse"); },
				  fields: [
					{ id: "act", type: "select", label: "Purpose", opts: actOpts },
					{ id: "cond", type: "select", label: "Annex 1 condition", opts: D.UK_RLI }
				  ] },
				{ id: "marketing", type: "yesno", label: "Do you use the data for direct marketing?", show: function (s) { return gdprLed(s); } },
				{ id: "inferred", type: "yesno", label: "Do you create inferred data, such as scores, segments or predictions?" },
				{ id: "inferredWhat", type: "text", label: "What you infer, and from what", show: function (s) { return yes(s, "inferred"); } },
				{ id: "brForm", type: "area", rows: 2, label: function (s) { return (prim(s) === "br" ? "" : "Brazil: ") + "how you collect and process the data: the form of the processing (Article 9, II LGPD)"; }, show: function (s) { return inReg(s, "br"); },
				  ph: "for example through our website forms and app, stored in our cloud systems, analysed automatically for fraud",
				  hint: "One or two sentences. The LGPD asks for the form and the duration of the processing; the purposes table gives the duration." },
				{ id: "canMeans", type: "area", rows: 2, label: function (s) { return (prim(s) === "can" ? "How" : "Canada: how") + " you collect the information" + (canQc(s) ? "" : " (optional)"); }, show: canOn,
				  ph: "for example through our website forms, cookies and phone calls, and from the employers who enrol you",
				  hint: "Quebec requires the means of collection (section 8). Good practice elsewhere." },
				{ id: "canProspect", type: "yesno", label: "Quebec: do you use personal information for commercial or philanthropic prospecting (marketing or fundraising)?", show: canQc },
				{ id: "canTech", type: "yesno", label: "Quebec: do you collect information using technology with functions that can identify, locate or profile people?", show: canQc,
				  hint: "Section 8.1. For example location tracking, or tools that assess a person's preferences, interests or behaviour." },
				{ id: "canTechWhat", type: "text", label: "Quebec: the technology and what its functions do", show: function (s) { return canQc(s) && yes(s, "canTech"); } },
				{ id: "canTechHow", type: "text", label: "Quebec: how people turn those functions on", show: function (s) { return canQc(s) && yes(s, "canTech"); } },
				{ id: "canRisk", type: "area", rows: 2, label: "Canada: meaningful risks of significant harm that remain after your safeguards (optional)", show: canOn,
				  hint: "OPC consent guidelines, key element 4: a risk that is more than a mere possibility, of harm such as humiliation, damage to reputation or relationships, financial loss, identity theft or lost opportunities. Leave empty if there is none." },
				{ id: "consequences", type: "area", label: "The processing with the most impact on people, or that would surprise them",
				  hint: "Goes in the first layer (WP260 36). Say what effect it has on the person. Leave empty only if nothing here is complex, technical or unexpected." }
			] },
			{ title: "Who receives the data", show: function (s) { return !usStyle(s); },
			  lead: "Recipients include service providers acting for you, such as hosting, email and payroll providers, not only third parties (Article 4(9)). Named recipients are generally the most meaningful (WP260 Annex).",
			  fields: [
				{ id: "recipients", type: "repeater", label: "Recipients", itemLabel: "Recipient", add: "Add a recipient",
				  fields: [
					{ id: "who", type: "text", label: "Recipient, or a specific category" },
					{ id: "role", type: "select", label: "Role", opts: ROLES },
					{ id: "why", type: "text", label: "What for" },
					{ id: "where", type: "text", label: "Where located" },
					{ id: "cnContact", type: "text", label: "China: its contact details", show: function (s, r) { return cnOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; },
					  hint: "Article 23: for another processor, the notice gives its name, contact, purpose, processing method and categories." },
					{ id: "cnHow", type: "text", label: "China: how it processes the personal information", show: function (s, r) { return cnOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; } },
					{ id: "cnData", type: "text", label: "China: the categories of personal information it receives", show: function (s, r) { return cnOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; } },
					{ id: "cnCons", type: "yesno", label: "China: does providing personal information to it rely on consent?", show: function (s, r) { return cnOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; },
					  hint: "Article 23: where it does, ask for separate consent. Answer No where another ground in Article 13 covers it (Article 13, second paragraph)." },
					{ id: "jpProv", type: "select", label: "Japan: basis for providing personal data to it", opts: function () { return D.JP_PROV.map(function (x) { return { v: x.v, l: x.l }; }); }, show: function (s, r) { return jpOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; },
					  hint: "Article 27. A service provider you entrust with handling is not a third party (Article 27(5)(i)): give it the processor role." },
					{ id: "krProv", type: "select", label: "Korea: basis for providing personal information to it", opts: function () { return D.KR_PROV.map(function (x) { return { v: x.v, l: x.l }; }); }, show: function (s, r) { return krOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; },
					  hint: "Article 17. A service provider you entrust with processing is not a third party (Article 26): give it the processor role." },
					{ id: "krProvLaw", type: "text", label: function (s, r) { return v(r, "krProv") === "otherlaw" ? "Korea: the law and article that provides for it" : "Korea: the law and article, where a law is the basis"; },
					  show: function (s, r) { return krOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1 && (v(r, "krProv") === "collected" || v(r, "krProv") === "otherlaw"); }, ph: "for example Criminal Procedure Act, Article 215" },
					{ id: "krItems", type: "text", label: "Korea: the personal information provided", show: function (s, r) { return krOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; }, hint: "Each item, not \"etc.\" (PIPC drafting guidelines, item 7)." },
					{ id: "krRet", type: "text", label: "Korea: how long it keeps it", show: function (s, r) { return krOn(s) && ["controller", "joint", "authority"].indexOf(v(r, "role")) !== -1; }, hint: "Required where you provide on consent; recommended where a law sets it." },
					{ id: "krSub", type: "text", label: "Korea: its sub-processors and their work, or where its list is published, or none", show: function (s, r) { return krOn(s) && v(r, "role") === "processor"; },
					  hint: "Article 26(2): re-entrustees are disclosed too; Article 26(6): re-entrusting needs your consent." }
				  ] }
			] },
			{ title: function (s) { return transferLaws(s).length === 1 && inReg(s, "eu") ? "Transfers outside the EEA" : "Transfers abroad"; },
			  show: function (s) { return transferLaws(s).length > 0; },
			  lead: function (s) {
				var ab = [inReg(s, "uk") ? "the UK" : "", inReg(s, "ch") ? "Switzerland" : "", inReg(s, "br") ? "Brazil" : "", inReg(s, "can") ? "Canada" : "", inReg(s, "in") ? "India" : "", inReg(s, "cn") ? "mainland China" : "", inReg(s, "jp") ? "Japan" : "", inReg(s, "kr") ? "Korea" : "", inReg(s, "sg") ? "Singapore" : "", inReg(s, "au") ? "Australia" : "", inReg(s, "za") ? "South Africa" : ""].filter(Boolean);
				return transferLaws(s).length > 1 ? "Each law has its own transfer rules, so each has its own list." + (inReg(s, "eu") && ab.length ? " Countries in the EEA are abroad for " + joinList(ab) + "." : "") : ""; },
			  fields: [
				{ id: "transfers", type: "yesno", label: "Is personal data transferred to a country outside the EEA or to an international organisation?", show: function (s) { return inReg(s, "eu"); } },
				{ id: "trows", type: "repeater", label: function (s) { return transferLaws(s).length > 1 ? "Transfers under the GDPR" : "Transfers"; }, itemLabel: "Transfer", add: "Add a transfer",
				  show: function (s) { return inReg(s, "eu") && yes(s, "transfers"); },
				  fields: [
					{ id: "country", type: "text", label: "Country or organisation" },
					{ id: "recipient", type: "text", label: "Recipient" },
					{ id: "mech", type: "select", label: "Mechanism", opts: D.TRANSFER_MECH.map(function (m) { return { v: m.id, l: m.label }; }) },
					{ id: "copy", type: "text", label: "Where to get a copy of the safeguards",
					  show: function (s, t) { var m = find(D.TRANSFER_MECH, v(t, "mech")); return !!(m && m.needsCopy) || v(t, "mech") === "compelling"; } },
					{ id: "adeqScope", type: "text", label: "What the adequacy decision covers, if partial (optional)", ph: "for example organisations certified under the EU-US Data Privacy Framework",
					  show: function (s, t) { return v(t, "mech") === "adequacy"; },
					  hint: "Some decisions cover only part of a country: a sector, or certified organisations. For the United States, say whether the recipient is certified under the EU-US Data Privacy Framework." },
					{ id: "instr46", type: "select", label: "Which instrument", opts: D.ART46_OTHER, show: function (s, t) { return v(t, "mech") === "other46"; } },
					{ id: "derogPt", type: "select", label: "Which derogation", opts: D.ART49, show: function (s, t) { return v(t, "mech") === "derog"; } },
					{ id: "cInterest", type: "text", label: "The compelling legitimate interest pursued", show: function (s, t) { return v(t, "mech") === "compelling"; },
					  hint: "Only for a transfer that is not repetitive, concerns a limited number of people, and where no other mechanism is available. You must also inform the supervisory authority." },
					{ id: "cSafeguards", type: "text", label: "The safeguards you apply", show: function (s, t) { return v(t, "mech") === "compelling"; } }
				  ] },
				{ id: "ukTransfers", type: "yesno", label: "Under the UK GDPR, is personal data transferred to a country outside the UK, including the EEA, or to an international organisation?", show: function (s) { return inReg(s, "uk"); } },
				{ id: "ukTrows", type: "repeater", label: "Transfers under the UK GDPR", itemLabel: "UK transfer", add: "Add a UK transfer", show: function (s) { return inReg(s, "uk") && yes(s, "ukTransfers"); },
				  fields: [
					{ id: "country", type: "text", label: "Country or organisation" },
					{ id: "recipient", type: "text", label: "Recipient" },
					{ id: "mech", type: "select", label: "Mechanism", opts: D.TRANSFER_MECH_UK.map(function (m) { return { v: m.id, l: m.label }; }) },
					{ id: "copy", type: "text", label: "Where to get a copy of the safeguards",
					  show: function (s, t) { var m = find(D.TRANSFER_MECH_UK, v(t, "mech")); return !!(m && m.needsCopy) || v(t, "mech") === "compelling"; } },
					{ id: "adeqScope", type: "text", label: "What the regulations cover, if partial (optional)", ph: "for example organisations certified under the UK Extension to the EU-US Data Privacy Framework",
					  show: function (s, t) { return v(t, "mech") === "regs"; } },
					{ id: "instr46", type: "select", label: "Which safeguard", opts: D.ART46_OTHER_UK, show: function (s, t) { return v(t, "mech") === "other46"; } },
					{ id: "derogPt", type: "select", label: "Which derogation", opts: D.ART49_UK, show: function (s, t) { return v(t, "mech") === "derog"; } },
					{ id: "cInterest", type: "text", label: "The compelling legitimate interest pursued", show: function (s, t) { return v(t, "mech") === "compelling"; },
					  hint: "Only for a transfer that is not repetitive, concerns a limited number of people, and where no other mechanism is available. You must also inform the Information Commission." },
					{ id: "cSafeguards", type: "text", label: "The safeguards you apply", show: function (s, t) { return v(t, "mech") === "compelling"; } }
				  ] },
				{ id: "chAbroad", type: "yesno", label: "Under the FADP, is personal data disclosed to another country, including EU and EEA countries, or to an international body?", show: function (s) { return inReg(s, "ch"); },
				  hint: "Name every State, even one the Federal Council lists as adequate (Article 19(4))." },
				{ id: "chTrows", type: "repeater", label: "Disclosures abroad under the FADP", itemLabel: "Swiss disclosure", add: "Add a country", show: function (s) { return inReg(s, "ch") && yes(s, "chAbroad"); },
				  fields: [
					{ id: "country", type: "text", label: "Country or international body" },
					{ id: "recipient", type: "text", label: "Recipient" },
					{ id: "mech", type: "select", label: "Why it is permitted", opts: D.CH_MECH },
					{ id: "adeqScope", type: "text", label: "What the listing covers, if partial (optional)", ph: "for example organisations certified under the Swiss-US Data Privacy Framework",
					  show: function (s, t) { return v(t, "mech") === "adequacy"; },
					  hint: "The Federal Council lists some States only in part: the United States for organisations certified under the Swiss-US Data Privacy Framework, Canada where PIPEDA or an equivalent provincial act applies." },
					{ id: "guar", type: "select", label: "Which guarantee (Article 16(2) and (3))", show: function (s, t) { return v(t, "mech") === "guarantee"; },
					  opts: function (s) { return D.CH_GUAR.filter(function (g) { return g.v !== "c" || yes(s, "publicBody"); }); } },
					{ id: "exc", type: "select", label: "Which exception (Article 17(1))", opts: D.CH_EXC, show: function (s, t) { return v(t, "mech") === "exception"; } }
				  ] },
				{ id: "brTransfers", type: "yesno", label: "Under the LGPD, is personal data transferred to another country or an international body?", show: function (s) { return inReg(s, "br"); },
				  hint: "A transfer is from one processing agent to another abroad, including your service providers and group companies. Collecting data directly from people from abroad is not a transfer (Resolution CD/ANPD 19/2024, Regulation Article 6)." },
				{ id: "brTrows", type: "repeater", label: "Transfers under the LGPD", itemLabel: "Brazil transfer", add: "Add a country", show: function (s) { return inReg(s, "br") && yes(s, "brTransfers"); },
				  fields: [
					{ id: "country", type: "text", label: "Country or international body" },
					{ id: "recipient", type: "text", label: "Recipient" },
					{ id: "mech", type: "select", label: "Mechanism (Article 33)", opts: D.BR_MECH,
					  hint: "The ANPD recognised the European Union as adequate on 26 January 2026 (Resolution 32/2026). This covers the EU Member States, Iceland, Liechtenstein and Norway, and EU institutions, but not transfers made only for public security, national defence, State security or criminal investigation (Article 2). For other destinations the usual route is the ANPD standard contractual clauses, adopted in full and unchanged." },
					{ id: "form", type: "text", label: "What is transferred, how, for what purpose and for how long", show: function (s, t) { var m = brMech(t); return !!(m && m.doc); },
					  hint: "Regulation Article 17, paragraph 2, I: the form, duration and specific purpose of the transfer." }
				  ] },
				{ id: "brSecurity", type: "area", rows: 2, label: "Brazil: the security measures that protect transferred data", show: function (s) { return brDocRows(s).length > 0; },
				  hint: "Regulation Article 17, paragraph 2, V: the responsibilities of the agents and the security measures adopted." },
				{ id: "canAbroad", type: "yesno", label: "Canada: is personal information stored, processed or accessed outside Canada, by you or by service providers?", show: canOn,
				  hint: "PIPEDA does not prohibit it, but the OPC expects you to tell people that their information can be processed in another country and accessed there by courts, law enforcement and national security authorities." },
				{ id: "canAbroadWhere", type: "text", label: "Canada: in which countries", show: function (s) { return canOn(s) && yes(s, "canAbroad"); } },
				{ id: "canAbroadWhy", type: "text", label: function (s) { return "Canada: what service providers outside Canada do with it, and for what purposes" + (canAb(s) ? "" : " (optional)"); }, show: function (s) { return canOn(s) && yes(s, "canAbroad"); },
				  ph: "for example host our customer database and answer support emails", hint: "Alberta PIPA section 6(2): the purposes for which a service provider outside Canada is authorised to collect, use or disclose personal information." },
				{ id: "canOutQc", type: "yesno", label: "Quebec: can the information be communicated outside Quebec, including to other Canadian provinces?", show: canQc,
				  hint: "Section 8: people are told of the possibility. Section 17: a privacy impact assessment and a written agreement come first. Service providers outside Quebec count." },
				{ id: "inAbroad", type: "yesno", label: "India: is personal data processed outside India, by you or by Data Processors?", show: inOn,
				  hint: "The DPDP Act allows it unless the Central Government restricts transfers to a country by notification (section 16), subject to any requirements it sets for making data available to a foreign State (Rule 15). A sector law with stricter rules prevails (section 16(2))." },
				{ id: "inAbroadWhere", type: "text", label: "India: in which countries", show: function (s) { return inOn(s) && yes(s, "inAbroad"); } },
				{ id: "cnAbroad", type: "yesno", label: "China: is personal information provided to recipients outside mainland China?", show: cnOn,
				  hint: "Article 39. Hong Kong, Macao and Taiwan count as outside mainland China. A service provider abroad that can access the data counts as a recipient." },
				{ id: "cnXrows", type: "repeater", label: "Overseas recipients under the PIPL", itemLabel: "Overseas recipient", add: "Add an overseas recipient", show: function (s) { return cnOn(s) && yes(s, "cnAbroad"); },
				  fields: [
					{ id: "name", type: "text", label: "Recipient" },
					{ id: "country", type: "text", label: "Country or region" },
					{ id: "contact", type: "text", label: "Its contact details" },
					{ id: "purpose", type: "text", label: "Purpose" },
					{ id: "how", type: "text", label: "How it processes the personal information" },
					{ id: "data", type: "text", label: "Categories of personal information" },
					{ id: "rights", type: "text", label: "How people exercise their PIPL rights against it", ph: "for example by writing to us at the address in section 1; we pass the request on and answer within 15 working days" },
					{ id: "consent", type: "yesno", label: "Does providing it rely on consent?", hint: "Article 39: where it does, ask for separate consent." }
				  ] },
				{ id: "jpAbroad", type: "yesno", label: "Japan: is personal data provided to third parties in foreign countries, including service providers abroad you entrust it to?", show: jpOn,
				  hint: "Article 28. Entrusting handling to a party abroad counts. The EEA states and the United Kingdom are designated, for recipients subject to the GDPR or the UK GDPR (PPC Notice No. 1 of 2019)." },
				{ id: "jpXrows", type: "repeater", label: "Third parties in foreign countries under the APPI", itemLabel: "Third party abroad", add: "Add a third party abroad", show: function (s) { return jpOn(s) && yes(s, "jpAbroad"); },
				  fields: [
					{ id: "recipient", type: "text", label: "Recipient", hint: "Use the same name as in the recipients list." },
					{ id: "country", type: "text", label: "Country or region", show: function (s, r) { return !(v(r, "basis") === "consent" && yes(r, "noCountry")); } },
					{ id: "basis", type: "select", label: "Why the provision is permitted", opts: function () { return D.JP_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); },
					  hint: "A designated country or an equivalent system removes only the need for consent under Article 28: the recipient still needs a basis under Article 27, such as entrustment." },
					{ id: "noCountry", type: "yesno", label: "The country cannot be identified when consent is asked", show: function (s, r) { return v(r, "basis") === "consent"; },
					  hint: "Rules Article 17(3): say so, why, and give any information that helps instead." },
					{ id: "noCountryWhy", type: "text", label: "Why the country cannot be identified", show: function (s, r) { return v(r, "basis") === "consent" && yes(r, "noCountry"); } },
					{ id: "noCountryInfo", type: "text", label: "Information that helps instead (optional)", ph: "for example the countries being considered", show: function (s, r) { return v(r, "basis") === "consent" && yes(r, "noCountry"); } },
					{ id: "system", type: "text", label: "The country's system for protecting personal information", show: function (s, r) { return v(r, "basis") === "consent" && !yes(r, "noCountry"); },
					  hint: "Rules Article 17(2)(ii): obtained by an appropriate and reasonable method, for example the PPC's country reports." },
					{ id: "noMeasures", type: "yesno", label: "The recipient's measures cannot be described when consent is asked", show: function (s, r) { return v(r, "basis") === "consent"; },
					  hint: "Rules Article 17(4): say so and why." },
					{ id: "noMeasuresWhy", type: "text", label: "Why they cannot be described", show: function (s, r) { return v(r, "basis") === "consent" && yes(r, "noMeasures"); } },
					{ id: "measures", type: "text", label: "The recipient's measures to protect personal information", show: function (s, r) { return v(r, "basis") === "consent" && !yes(r, "noMeasures"); } }
				  ] },
				{ id: "krAbroad", type: "yesno", label: "Korea: is personal information provided, entrusted or stored abroad?", show: krOn,
				  hint: function (s) { return "Article 28-8: provision (including access from abroad), entrusted processing and storage abroad are all transfers. Name every country of a cloud service (PIPC drafting guidelines, item 10)." + (krOffshore(s) ? " Collecting from abroad, list every recipient outside Korea, also in the countries where you process the data." : ""); } },
				{ id: "krXrows", type: "repeater", label: "Transfers abroad under the PIPA", itemLabel: "Transfer abroad", add: "Add a transfer abroad", show: function (s) { return krOn(s) && yes(s, "krAbroad"); },
				  fields: [
					{ id: "recipient", type: "text", label: "Recipient", hint: "Use the same name as in the recipients list." },
					{ id: "country", type: "text", label: "Country" },
					{ id: "basis", type: "select", label: "Basis for the transfer (Article 28-8(1))", opts: function () { return D.KR_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); } },
					{ id: "lawName", type: "text", label: "The law, treaty or international agreement, with its article", show: function (s, r) { return v(r, "basis") === "law"; } },
					{ id: "certName", type: "text", label: "The certification the recipient holds", show: function (s, r) { return v(r, "basis") === "cert"; },
					  hint: "A certification the PIPC designates, with the measures to apply it in the destination country (Article 28-8(1)(4))." },
					{ id: "contact", type: "text", label: "The recipient's contact details", hint: "Article 28-8(2)(3)." },
					{ id: "items", type: "text", label: "The personal information transferred" },
					{ id: "when", type: "text", label: "When and how it is transferred", ph: "for example continuously over the network as you use the service" },
					{ id: "purpose", type: "text", label: "The recipient's purposes" },
					{ id: "keep", type: "text", label: "How long the recipient keeps it" },
					{ id: "refuse", type: "text", label: "How to refuse the transfer, and what follows", ph: "for example email privacy@example.kr; we then cannot offer support from abroad", hint: "Article 28-8(2)(5)." }
				  ] },
				{ id: "sgAbroad", type: "yesno", label: "Singapore: is personal data transferred outside Singapore?", show: sgOn,
				  hint: "Section 26; regulations 9 to 12. Include service providers and storage outside Singapore, and your own systems abroad." },
				{ id: "sgXrows", type: "repeater", label: "Transfers outside Singapore", itemLabel: "Transfer outside Singapore", add: "Add a transfer outside Singapore", show: function (s) { return sgOn(s) && yes(s, "sgAbroad"); },
				  fields: [
					{ id: "recipient", type: "text", label: "Recipient", hint: "Use the same name as in the recipients list." },
					{ id: "country", type: "text", label: "Country or territory" },
					{ id: "basis", type: "select", label: "How the transfer meets section 26", opts: function () { return D.SG_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); } },
					{ id: "lawName", type: "text", label: function (s, r) { return v(r, "basis") === "law" ? "The law, with its section" : v(r, "basis") === "exempt" ? "The PDPC notice, with its date" : "The instrument"; }, show: function (s, r) { return v(r, "basis") === "law" || v(r, "basis") === "instrument" || v(r, "basis") === "exempt"; } },
					{ id: "certKind", type: "select", label: "The certification the recipient holds", show: function (s, r) { return v(r, "basis") === "cert"; },
					  opts: [{ v: "apec-cbpr", l: "APEC Cross-Border Privacy Rules (CBPR)" }, { v: "global-cbpr", l: "Global Cross-Border Privacy Rules (CBPR)" },
						{ v: "apec-prp", l: "APEC Privacy Recognition for Processors (PRP): data intermediaries only" }, { v: "global-prp", l: "Global Privacy Recognition for Processors (PRP): data intermediaries only" }],
					  hint: "Regulation 12, as amended from 2 March 2026." },
					{ id: "summary", type: "area", rows: 2, label: "A reasonable summary of how the data is protected in that country", show: function (s, r) { return v(r, "basis") === "consent"; },
					  hint: "Regulation 10(3)(a): consent to the transfer is not valid without it. It is printed in the policy." }
				  ] },
				{ id: "auAbroad", type: "yesno", label: "Australia: does personal information go to recipients outside Australia, or is it held outside Australia?", show: auOn,
				  hint: "APP 1.4(f), (g), 5.2(i), (j) and APP 8. Include service providers, related companies, storage outside Australia, and your own offices or systems abroad." },
				{ id: "auXrows", type: "repeater", label: "Overseas recipients (Australia)", itemLabel: "Overseas recipient", add: "Add an overseas recipient", show: function (s) { return auOn(s) && yes(s, "auAbroad"); },
				  fields: [
					{ id: "recipient", type: "text", label: "Recipient", hint: "Use the same name as in the recipients list; for your own offices or systems abroad, your organisation's name." },
					{ id: "country", type: "text", label: "Country, or region where listing countries is impracticable" },
					{ id: "basis", type: "select", label: "How APP 8 is met", opts: function () { return D.AU_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); } },
					{ id: "lawName", type: "text", label: function (s, r) { return v(r, "basis") === "law" ? "The Australian law, or the details of the order" : "The law or binding scheme"; }, show: function (s, r) { return v(r, "basis") === "law" || v(r, "basis") === "similar"; } },
					{ id: "pgs", type: "select", label: "The permitted general situation", show: function (s, r) { return v(r, "basis") === "pgs"; },
					  opts: function () { return D.AU_PGS.slice(0, 3).map(function (x) { return { v: x.v, l: x.l }; }); }, hint: "APP 8.2(d): items 4 and 5 of s. 16A do not apply." }
				  ] },
				{ id: "zaAbroad", type: "yesno", label: "South Africa: do you transfer personal information to third parties outside South Africa, or hold it outside South Africa?", show: zaOn,
				  hint: "Section 18(1)(g) and section 72. Include operators such as cloud providers, related companies, and your own offices or systems outside South Africa." },
				{ id: "zaXrows", type: "repeater", label: "Transfers outside South Africa", itemLabel: "Recipient outside South Africa", add: "Add a recipient outside South Africa", show: function (s) { return zaOn(s) && yes(s, "zaAbroad"); },
				  fields: [
					{ id: "recipient", type: "text", label: "Recipient", hint: "Use the same name as in the recipients list; for your own offices or systems, your organisation's name." },
					{ id: "country", type: "text", label: "Country" },
					{ id: "basis", type: "select", label: "How section 72 allows the transfer", opts: function () { return D.ZA_XBASIS.map(function (x) { return { v: x.v, l: x.l }; }); } },
					{ id: "lawName", type: "text", label: function (s, r) { return v(r, "basis") === "law" ? "The law that protects it" : "The agreement (optional)"; }, show: function (s, r) { return v(r, "basis") === "law" || v(r, "basis") === "agreement"; },
					  ph: "for example the GDPR (Regulation (EU) 2016/679)" },
					{ id: "protection", type: "area", rows: 2, label: function (s, r) { return v(r, "basis") === "law" ? "The level of protection in that country (optional)" : "The level of protection in that country"; },
					  show: function (s, r) { return !!v(r, "basis"); }, hint: "Section 18(1)(g): the level of protection the country itself affords, printed in the notice." }
				  ] }
			] },
			{ title: "Automated decisions and profiling", show: function (s) { return !usStyle(s); },
			  fields: [
				{ id: "adm", type: "yesno", label: function (s) {
					var p = prim(s);
					return p === "uk" ? "Do you take significant decisions about people based solely on automated processing, with no meaningful human involvement?" :
						p === "ch" ? "Do you take decisions based exclusively on automated processing that have a legal consequence for people or a considerable adverse effect on them?" :
						p === "br" ? "Do you take decisions based solely on automated processing of personal data that affect people's interests, including decisions that define their personal, professional, consumer or credit profile?" :
						p === "can" ? "Do you make decisions about people based exclusively on automated processing of their personal information?" :
						p === "in" ? "Do you take decisions about people based solely on automated processing of their personal data?" :
						p === "cn" ? "Do you make decisions through automated decision-making that have a major impact on people's rights and interests?" :
						p === "jp" ? "Do you make decisions about people based solely on automated processing of their personal information?" :
						p === "kr" ? "Do you make decisions about people with a fully automated system, AI systems included, that processes their personal information?" :
						p === "sg" ? "Do you make decisions about people with automated systems that use their personal data?" :
						p === "au" ? "Do you make decisions about people with automated systems that use their personal information?" :
						p === "za" ? "Do you make decisions about people with automated systems that use their personal information?" :
						"Do you take decisions based solely on automated processing that have legal or similarly significant effects on people?"; },
				  hint: function (s) {
					var p = prim(s);
					return p === "uk" ? "Article 22A UK GDPR: a decision is significant if it has a legal or similarly significant effect. A human who only rubber-stamps the output is not meaningful involvement; consider how far the decision is reached by profiling (Article 22A(2))." :
						p === "ch" ? "An automated individual decision (Article 21 FADP)." :
						p === "br" ? "Article 20 LGPD. Broader than Article 22 GDPR: any decision that affects the person's interests, not only legal or similarly significant ones." :
						p === "can" ? "Quebec's Act, section 12.1: any decision made without a person taking part in it, whatever its effect." :
						p === "in" ? "The DPDP Act has no rule of its own on automated decisions. Personal data used to make a decision that affects the person must be complete, accurate and consistent (section 8(3))." :
						p === "sg" ? "The PDPA has no rule of its own on automated decisions; the policy says what is decided, for transparency." :
						p === "au" ? "APP 1.7 to 1.9 apply from 10 December 2026: answer the Australia questions on computer programs below; this answer is for transparency." :
						p === "za" ? "Section 71 covers decisions based solely on automated processing that profiles people: answer the South Africa question below; this answer is for transparency." :
						p === "kr" ? "Article 37-2: people can refuse such a decision where it significantly affects their rights or duties, and ask for an explanation of any. Publish the criteria and the procedure (Enforcement Decree Article 44-4)." :
						p === "jp" ? "The APPI has no rule of its own on automated decisions. Where you analyse behaviour or interests, the purpose of use must let people predict it (Guidelines 3-1-1)." :
						p === "cn" ? "Articles 24 and 73: a computer program analyses and assesses a person's behaviour, interests, or economic, health or credit status, and makes a decision. For a decision with a major impact, people can ask for an explanation and refuse a decision made solely by automated means. Personalised push and marketing is asked in the China section." :
						"Article 22(1). A human who only rubber-stamps the output does not take the decision out of Article 22." +
						(inReg(s, "uk") ? " For the UK, consider how far the decision is reached by profiling when judging whether a human is meaningfully involved (Article 22A(2) UK GDPR)." : ""); } },
				{ id: "admWhat", type: "area", label: "Which decision is made", rows: 2, show: function (s) { return yes(s, "adm"); } },
				{ id: "admLogic", type: "area", label: "Meaningful information about the logic involved", rows: 3, show: function (s) { return yes(s, "adm") && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za"; },
				  hint: "The criteria and how they are weighed, in terms the person can follow. Not the source code, and not \"an algorithm\"." },
				{ id: "admEffect", type: "area", label: "Significance and envisaged consequences for the person", rows: 2, show: function (s) { return yes(s, "adm") && prim(s) !== "jp" && prim(s) !== "kr" && prim(s) !== "sg" && prim(s) !== "au" && prim(s) !== "za"; } },
				{ id: "admBasis", type: "select", label: "Exception relied on (Article 22(2) GDPR)", show: function (s) { return yes(s, "adm") && inReg(s, "eu"); },
				  opts: [{ v: "contract", l: "Necessary for a contract (Art. 22(2)(a))" }, { v: "law", l: "Authorised by law (Art. 22(2)(b))" }, { v: "consent", l: "Explicit consent (Art. 22(2)(c))" }] },
				{ id: "admLaw", type: "area", label: "The law that authorises the decision, and the safeguards it lays down", rows: 2, show: function (s) { return yes(s, "adm") && inReg(s, "eu") && v(s, "admBasis") === "law"; } },
				{ id: "admSpecial", type: "yesno", label: "Does the decision use special category data?", show: function (s) { return yes(s, "adm") && (inReg(s, "eu") || inReg(s, "uk")); } },
				{ id: "admArt9", type: "select", label: "Article 9(2) GDPR condition for that data", show: function (s) { return yes(s, "adm") && inReg(s, "eu") && yes(s, "admSpecial"); },
				  opts: [{ v: "a", l: "Explicit consent (Art. 9(2)(a))" }, { v: "g", l: "Substantial public interest under law (Art. 9(2)(g))" }, { v: "other", l: "Another condition" }],
				  hint: "Article 22(4): whatever the Article 22(2) exception, a decision based on special category data needs point (a) or (g) of Article 9(2), with suitable safeguards." },
				{ id: "admSafeguards", type: "text", label: "Safeguards for the special category data", show: function (s) { return yes(s, "adm") && inReg(s, "eu") && yes(s, "admSpecial"); } },
				{ id: "ukAdmCond", type: "select", label: "UK: Article 22B condition for that data", opts: D.UK_ADM_SPECIAL, show: function (s) { return yes(s, "adm") && inReg(s, "uk") && yes(s, "admSpecial"); } },
				{ id: "admActs", type: "checks", label: "UK: purposes whose processing feeds the decision", opts: actOpts, show: function (s) { return yes(s, "adm") && inReg(s, "uk"); },
				  hint: "Article 22B(4) UK GDPR: the decision cannot be solely automated if any of this processing relies on a recognised legitimate interest." },
				{ id: "chAdmExc", type: "select", label: "Switzerland: does an Article 21(3) FADP exception apply?", opts: D.CH_ADM_EXC, show: function (s) { return yes(s, "adm") && inReg(s, "ch"); } },
				{ id: "brAdm", type: "yesno", label: function (s) { return prim(s) === "br" ? "Your earlier answer for the Brazil section: decisions based solely on automated processing that affect people's interests. Set it to No if the answer above is right" : "Brazil: do you take decisions based solely on automated processing that affect people's interests (Article 20 LGPD)?"; },
				  show: function (s) { return inReg(s, "br") && (prim(s) !== "br" || (yes(s, "brAdm") && !yes(s, "adm"))); },
				  hint: "Broader than the question above: any decision that affects the person's interests, including decisions that define their personal, professional, consumer or credit profile." },
				{ id: "brAdmWhat", type: "area", rows: 2, label: function (s) { return yes(s, "adm") ? "Brazil: which decisions (leave empty if only the decision described above)" : "Brazil: which decisions"; },
				  show: function (s) { return inReg(s, "br") && prim(s) !== "br" && yes(s, "brAdm"); } },
				{ id: "canAdm", type: "yesno", label: function (s) { return prim(s) === "can" ? "Your earlier answer for the Canada section: decisions based exclusively on automated processing. Set it to No if the answer above is right" : "Quebec: do you make decisions about people based exclusively on automated processing of their personal information?"; },
				  show: function (s) { return canQc(s) && (prim(s) !== "can" || (yes(s, "canAdm") && !yes(s, "adm"))); },
				  hint: "Section 12.1 of Quebec's Act: any decision made without a person taking part in it, whatever its effect." },
				{ id: "canAdmWhat", type: "area", rows: 2, label: function (s) { return yes(s, "adm") ? "Quebec: which decisions (leave empty if only the decision described above)" : "Quebec: which decisions"; },
				  show: function (s) { return canQc(s) && prim(s) !== "can" && yes(s, "canAdm"); } },
				{ id: "profiling", type: "yesno", label: "Do you profile people in other ways, without such decisions?", show: function (s) { return !yes(s, "adm"); } },
				{ id: "profilingWhat", type: "area", label: "The profiling and its effect on people", rows: 2, show: function (s) { return yes(s, "profiling"); } }
			] },
			IN_SECTION,
			CN_SECTION,
			JP_SECTION,
			KR_SECTION,
			SG_SECTION,
			AU_SECTION,
			ZA_SECTION,
			CA_SECTION,
			US_SECTION,
			{ title: "Rights, complaints and changes",
			  fields: [
				{ id: "rightsContact", type: "text", label: function (s) { return prim(s) === "in" ? "China: how people exercise their rights" : "How people exercise their rights"; }, ph: "email address, web form or postal address", show: function (s) { return !usStyle(s) && (prim(s) !== "in" || cnOn(s)); } },
				{ id: "withdrawHow", type: "text", label: "How people withdraw consent", show: function (s) { return pnConsent(s) || brConsent(s) || canConsent(s) || inConsent(s) || cnConsent(s) || (krOn(s) && krConsent(s)) || (sgOn(s) && sgConsent(s)) || (auOn(s) && auConsent(s)) || (zaOn(s) && zaConsent(s)); },
				  hint: function (s) { return prim(s) === "br" ? "Free of charge and through an easy procedure (Article 8, paragraph 5 LGPD). If consent was a tick box, withdrawal is a click, not a letter." :
					prim(s) === "can" ? "At any time, on reasonable notice (PIPEDA principle 4.3.8). If consent was a tick box, withdrawal is a click, not a letter." :
					prim(s) === "in" ? "As easily as consent was given (section 6(4); Rule 3(c)(i)). If consent was a tick box, withdrawal is a click, not a letter. Leave empty to point to the link in the India section." :
					prim(s) === "sg" ? "At any time, on reasonable notice (section 16(1)). Leave empty to use the data protection officer's contact." :
					prim(s) === "au" ? "At any time, by an easy and accessible process (APP Guidelines B.54). Leave empty to use the privacy contact." :
					prim(s) === "za" ? "At any time (s. 11(2)(b)). Leave empty to use the Information Officer's email or the organisation's address." :
					prim(s) === "kr" ? "At any time, no harder than giving consent (Articles 37(1), 38(4)). If consent was a tick box, withdrawal is a click, not a letter." :
					prim(s) === "cn" ? "A convenient way to withdraw (Article 15). If consent was a tick box, withdrawal is a click, not a letter." : "As easy as giving it (Article 7(3)). If consent was a tick box, withdrawal is a click, not a letter."; } },
				{ id: "saName", type: "text", label: "Supervisory authority to name (optional)", show: function (s) { return inReg(s, "eu"); },
				  hint: "The right to complain applies in any Member State of habitual residence, place of work or alleged infringement, whichever you name." },
				{ id: "saContact", type: "text", label: "Its website or contact (optional)", show: function (s) { return inReg(s, "eu") && !!v(s, "saName"); } },
				{ id: "ukComplaintRoute", type: "text", label: "How people complain to you (section 164A of the UK Data Protection Act 2018)", show: function (s) { return inReg(s, "uk"); },
				  ph: "for example the complaint form at example.com/complaints, or by post",
				  hint: "You must make complaining easy, for example with a complaint form that can be completed electronically and by other means. Acknowledge each complaint within 30 days." },
				{ id: "restriction", type: "yesno", label: "Will you rely on a national law that restricts any rights or information?", show: function (s) { return prim(s) === "eu"; } },
				{ id: "restrictionWhat", type: "text", label: "Which law and which right", show: function (s) { return prim(s) === "eu" && yes(s, "restriction"); } },
				{ id: "restrictionUk", type: "yesno", label: "Will you rely on an exemption in the Data Protection Act 2018 that restricts any rights or information?", show: function (s) { return prim(s) === "uk"; } },
				{ id: "restrictionWhatUk", type: "text", label: "Which exemption and which right", show: function (s) { return prim(s) === "uk" && yes(s, "restrictionUk"); } },
				{ id: "restrictionCh", type: "yesno", label: "Will you rely on a restriction of the duty to inform or of the right to information (Articles 20 and 26 FADP)?", show: function (s) { return prim(s) === "ch"; } },
				{ id: "restrictionKind", type: "select", label: "Which is restricted", show: function (s) { return prim(s) === "ch" && yes(s, "restrictionCh"); },
				  opts: [{ v: "inform", l: "The duty to inform (Article 20)" }, { v: "access", l: "The right to information (Article 26)" }, { v: "both", l: "Both" }] },
				{ id: "restrictionWhatCh", type: "text", label: "Which restriction, and the ground for it", show: function (s) { return prim(s) === "ch" && yes(s, "restrictionCh"); } },
				{ id: "version", type: "text", label: "Version", ph: "1.0" },
				{ id: "effective", type: "date", label: function (s) { return usStyle(s) ? "Date last updated" : "Effective date"; } },
				{ id: "further", type: "yesno", label: "Do you intend to use data you already hold for a new purpose?", show: function (s) { return !usStyle(s); } },
				{ id: "furtherWhat", type: "text", label: "The new purpose", show: function (s) { return !usStyle(s) && yes(s, "further"); } },
				{ id: "furtherStart", type: "date", label: "When it starts", show: function (s) { return !usStyle(s) && yes(s, "further"); },
				  hint: "Leave a reasonable gap after telling people, longer the more intrusive the change (WP260 48)." },
				{ id: "furtherData", type: "text", label: "Personal data used for it", show: function (s) { return !usStyle(s) && yes(s, "further"); } },
				{ id: "furtherBasis", type: "select", label: "Legal basis for it", opts: basisOpts, show: function (s) { return yes(s, "further") && gdprLed(s); } },
				{ id: "brFurtherBasis", type: "select", label: function (s) { return prim(s) === "br" ? "Legal basis for it (Article 7 LGPD)" : "Brazil: legal basis for it (Article 7 LGPD)"; }, opts: D.BR_BASES,
				  show: function (s) { return yes(s, "further") && inReg(s, "br"); } },
				{ id: "brFurtherLi", type: "area", rows: 2, label: "Brazil: the legitimate interest pursued for the new purpose, and the concrete situation it rests on (Article 10)", show: function (s) { return brFurther(s) === "IX"; } },
				{ id: "furtherConsequenceBr", type: "text", label: "Brazil: what happens if the person does not consent to the new purpose", show: function (s) { return brFurther(s) === "I"; } },
				{ id: "canFurther", type: "select", label: function (s) { return (prim(s) === "can" ? "How" : "Canada: how") + " the new use is allowed"; }, show: function (s) { return yes(s, "further") && canOn(s); },
				  opts: [{ v: "consent", l: "We will ask for consent before the new use" }, { v: "law", l: "The law requires the new use" }],
				  hint: "PIPEDA principle 4.2.4: a new purpose is identified before use, and needs consent unless the law requires it." },
				{ id: "canFurtherLaw", type: "text", label: "Canada: the law that requires it", show: function (s) { return yes(s, "further") && canOn(s) && v(s, "canFurther") === "law"; } },
				{ id: "inFurther", type: "select", label: function (s) { return (prim(s) === "in" ? "Ground" : "India: ground") + " for the new purpose"; }, opts: function () { return D.IN_GROUNDS.filter(function (x) { return x.v !== "7a"; }).map(function (x) { return { v: x.v, l: x.l }; }); },
				  show: function (s) { return yes(s, "further") && inOn(s); }, hint: "The purpose in the notice is the specified purpose (section 2(za)). A new one needs a new notice and consent, unless a legitimate use in section 7 applies." },
				{ id: "cnFurther", type: "select", label: function (s) { return (prim(s) === "cn" ? "Ground" : "China: ground") + " for the new purpose"; }, opts: function () { return D.CN_BASES.map(function (x) { return { v: x.v, l: x.l }; }); },
				  show: function (s) { return yes(s, "further") && cnOn(s); }, hint: "Article 14: a change of purpose needs new consent where consent is the ground. Otherwise name the ground in Article 13 that covers it." },
				{ id: "cnFurtherLaw", type: "text", label: "China: the law or administrative regulation", show: function (s) { return yes(s, "further") && cnOn(s) && v(s, "cnFurther") === "law"; } },
				{ id: "jpFurther", type: "select", label: function (s) { return (prim(s) === "jp" ? "" : "Japan: ") + "how the new purpose is allowed"; }, show: function (s) { return yes(s, "further") && jpOn(s); },
				  opts: [{ v: "related", l: "Reasonably related to the original purposes (Article 17(2))" }, { v: "consent", l: "Consent first (Article 18(1))" }] },
				{ id: "krFurther", type: "select", label: function (s) { return (prim(s) === "kr" ? "" : "Korea: ") + "how the new purpose is allowed"; }, show: function (s) { return yes(s, "further") && krOn(s); },
				  opts: [{ v: "related", l: "Reasonably related to the original purpose (Article 15(3))" }, { v: "consent", l: "Separate consent first (Article 18(2)(1))" }] },
				{ id: "sgFurther", type: "select", label: function (s) { return (prim(s) === "sg" ? "" : "Singapore: ") + "how the PDPA allows the new purpose"; }, show: function (s) { return yes(s, "further") && sgOn(s); },
				  opts: [{ v: "consent", l: "Consent first (sections 14 and 20(1)(b))" }, { v: "notify", l: "Deemed consent by notification (section 15A)" },
					{ v: "li", l: "Legitimate interests (First Schedule, Part 3, paragraph 1)" }, { v: "exception", l: "Another exception, or a law that requires or authorises it (sections 13(b) and 17)" }] },
				{ id: "sgFurtherLaw", type: "text", label: "Singapore: the exception or law", show: function (s) { return yes(s, "further") && sgOn(s) && v(s, "sgFurther") === "exception"; } },
				{ id: "auFurther", type: "select", label: function (s) { return (prim(s) === "au" ? "H" : "Australia: h") + "ow APP 6 allows the new purpose"; }, show: function (s) { return yes(s, "further") && auOn(s); },
				  opts: [{ v: "consent", l: "Consent first (APP 6.1(a))" }, { v: "related", l: "People would reasonably expect it, and it is related to the original purpose, or directly related for sensitive information (APP 6.2(a))" },
					{ v: "law", l: "Required or authorised by an Australian law or a court or tribunal order (APP 6.2(b))" }, { v: "pgs", l: "A permitted general situation (APP 6.2(c); s. 16A)" }] },
				{ id: "auFurtherLaw", type: "text", label: "Australia: the law or order", show: function (s) { return yes(s, "further") && auOn(s) && v(s, "auFurther") === "law"; } },
				{ id: "auFurtherPgs", type: "select", label: "Australia: the permitted general situation (s. 16A)", show: function (s) { return yes(s, "further") && auOn(s) && v(s, "auFurther") === "pgs"; },
				  opts: function () { return D.AU_PGS.map(function (x) { return { v: x.v, l: x.l }; }); } },
				{ id: "zaFurther", type: "select", label: function (s) { return (prim(s) === "za" ? "H" : "South Africa: h") + "ow section 15 allows the new purpose"; }, show: function (s) { return yes(s, "further") && zaOn(s); },
				  opts: function () { return D.ZA_FURTHER.map(function (x) { return { v: x.v, l: x.l }; }); } },
				{ id: "zaFurtherLaw", type: "text", label: function (s) { return v(s, "zaFurther") === "exempt" ? "South Africa: the exemption notice" : "South Africa: the reason under section 15(3)(c)"; },
				  show: function (s) { return yes(s, "further") && zaOn(s) && (v(s, "zaFurther") === "law" || v(s, "zaFurther") === "exempt"); } },
				{ id: "furtherRliCond", type: "select", label: "Annex 1 condition (Article 6(5) UK GDPR)", opts: D.UK_RLI, show: function (s) { return furtherBasisOf(s) === "ea"; } },
				{ id: "furtherRetention", type: "text", label: "How long the data is kept for it", show: function (s) { return !usStyle(s) && yes(s, "further"); } },
				{ id: "furtherCompat", type: "area", rows: 2, show: function (s) { return yes(s, "further") && prim(s) === "eu"; },
				  label: "Why it is compatible with the original purpose (Article 6(4)), or why a new legal basis applies" },
				{ id: "furtherCompatUk", type: "area", rows: 2, show: function (s) { return yes(s, "further") && prim(s) === "uk"; },
				  label: "Why it is compatible with the original purpose (Article 8A UK GDPR), or why a new legal basis applies" },
				{ id: "furtherCompatCh", type: "area", rows: 2, show: function (s) { return yes(s, "further") && prim(s) === "ch"; },
				  label: "Why it is compatible with the purpose the data was collected for (Article 6(3) FADP)" },
				{ id: "furtherCompatBr", type: "area", rows: 2, show: function (s) { return yes(s, "further") && prim(s) === "br"; },
				  label: "Why it is compatible with the purpose the data was collected for (Article 6, I LGPD)" },
				{ id: "changeSummary", type: "area", label: "What changed since the previous version", rows: 2, hint: "Leave empty for a first version." }
			] }
		],

		build: function (s) {
			var P = prim(s), EU = inReg(s, "eu"), UK = inReg(s, "uk"), CH = inReg(s, "ch"), BR = inReg(s, "br"), CAN = inReg(s, "can"), IN = inReg(s, "in"), CN = inReg(s, "cn"), JP = inReg(s, "jp"), KR = inReg(s, "kr"), SG = inReg(s, "sg"), AU = inReg(s, "au"), ZA = inReg(s, "za"), CA = inReg(s, "ca"), US = inReg(s, "us"), GL = P !== "ch";
			if (P === "br") return brLead(s);
			if (P === "can") return canLead(s);
			if (P === "in") return inLead(s);
			if (P === "cn") return cnLead(s);
			if (P === "jp") return jpLead(s);
			if (P === "kr") return krLead(s);
			if (P === "sg") return sgLead(s);
			if (P === "au") return auLead(s);
			if (P === "za") return zaLead(s);
			if (P === "ca") return caLead(s);
			if (P === "us") return usLead(s);
			var A = function (t) { return lawify(t, P); };
			var ctrl = v(s, "ctrlName") || "[Organisation]";
			var aud = v(s, "audience");
			var title = AUD_TITLE[aud] || (v(s, "audienceOther") ? "Privacy notice for " + lcFirst(v(s, "audienceOther")) : "Privacy notice");
			var acts = pnActs(s);
			var direct = pnSourceDirect(s), indirect = pnSourceIndirect(s);
			var blocks = [], checks = [], delivery = [];
			var meta = [ctrl];
			if (v(s, "version")) meta.push("Version " + v(s, "version"));
			if (v(s, "effective")) meta.push("Effective " + fmtDate(v(s, "effective")));

			blocks.push({ k: "h1", x: title });
			blocks.push({ k: "meta", x: meta.map(stop).join(" ") });

			/* Section numbers depend on which sections the inputs trigger, so fix them first:
			   the first layer and the cross-references in the body point at them. */
			var num = {}, c = 3;
			if (indirect) num.source = c++;
			if (GL && direct && acts.length) num.req = c++;
			num.recip = c++; num.transfers = c++; num.adm = c++; num.rights = c++;
			if (pnObject(s)) num.object = c++;
			if (pnConsent(s)) num.consent = c++;
			num.complaints = c++;
			if (UK && P === "eu") num.uk = c++;
			if (CH && P !== "ch") num.ch = c++;
			if (BR) num.br = c++;
			if (CAN) num.can = c++;
			if (IN) num.in = c++;
			if (CN) num.cn = c++;
			if (JP) num.jp = c++;
			if (KR) num.kr = c++;
			if (SG) num.sg = c++;
			if (AU) num.au = c++;
			if (ZA) num.za = c++;
			if (CA) num.ca = c++;
			if (US) num.us = c++;
			num.changes = c++;

			/* First layer (WP260 36): purposes, controller identity, rights, most important consequences. */
			var first = [];
			first.push({ k: "p", x: ctrl + " is responsible for the personal data described in this notice (the controller)." + (v(s, "ctrlEmail") ? " Contact: " + v(s, "ctrlEmail") + "." : "") });
			if (acts.length) first.push({ k: "p", x: "We use your personal data to:" }, { k: "ul", items: acts.map(function (a) { return v(a, "purpose") || "[purpose]"; }) });
			if (v(s, "consequences")) first.push({ k: "p", x: "What matters most for you: " + stop(v(s, "consequences")) });
			if (P === "ch") first.push({ k: "p", x: "You have rights over your data: to obtain information about it, to have it corrected, to object to its processing and have it deleted" +
				(pnConsent(s) ? ", to withdraw consent" : "") + ", and to report to the Federal Data Protection and Information Commissioner. Section " + num.rights + " explains how." });
			else first.push({ k: "p", x: "You have rights over your data: to access, correct and delete it, to restrict its use" + (pnPort(s) ? ", to move it" : "") + (pnObject(s) ? ", to object" : "") +
				(pnConsent(s) ? ", to withdraw consent" : "") + (P === "uk" ? ", and to complain to us and to the Information Commission" : ", and to complain to a supervisory authority") + ". Section " + num.rights + " explains how." });
			if (pnObject(s)) first.push({ k: "p", x: "You have the right to object at any time to the uses of your data explained in section " + num.object + "." });
			if (num.uk) first.push({ k: "p", x: "If you are in the United Kingdom, section " + num.uk + " also applies to you." });
			if (num.ch) first.push({ k: "p", x: "If you are in Switzerland, section " + num.ch + " also applies to you." });
			if (num.br) first.push({ k: "p", x: "If you are in Brazil, section " + num.br + " also applies to you." + (brEncNeeded(s) ?
				" Our data protection officer for Brazil (encarregado): " + brEncWho(s) + ", " + (v(s, "brEncContact") || "[contact details]") + "." :
				" To contact us about your data from Brazil: " + (v(s, "brChannel") || "[the communication channel]") + ".") });
			if (num.can) first.push({ k: "p", x: "If you are in Canada, section " + num.can + " also applies to you. Our person accountable for privacy in Canada: " + canPic(s) + ", " + stop(canPicContact(s)) });
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

			/* 1. Who is responsible */
			blocks.push({ k: "h2", x: "1. Who is responsible for your data" });
			var who = [ctrl];
			if (v(s, "ctrlAddress")) who.push(v(s, "ctrlAddress").replace(/\n+/g, ", "));
			blocks.push({ k: "p", x: stop(who.join(", ")) });
			var chans = [];
			if (v(s, "ctrlEmail")) chans.push({ b: "Email:", x: v(s, "ctrlEmail") });
			if (v(s, "ctrlPhone")) chans.push({ b: "Telephone:", x: v(s, "ctrlPhone") });
			if (chans.length) blocks.push({ k: "ul", items: chans });
			if (EU && no(s, "euEstablished") && !yes(s, "repExempt") && (v(s, "repName") || v(s, "repContact")))
				blocks.push({ k: "p", x: "Our representative in the European Union is " + (v(s, "repName") || "[representative]") + (v(s, "repContact") ? ", " + v(s, "repContact") : "") + "." });
			if (UK && no(s, "ukEstablished") && !yes(s, "ukRepExempt") && (v(s, "ukRepName") || v(s, "ukRepContact")))
				blocks.push({ k: "p", x: "Our representative in the United Kingdom is " + (v(s, "ukRepName") || "[representative]") + (v(s, "ukRepContact") ? ", " + v(s, "ukRepContact") : "") + "." });
			if (CH && no(s, "chEstablished") && yes(s, "chRepNeeded") && (v(s, "chRepName") || v(s, "chRepAddress")))
				blocks.push({ k: "p", x: "Our representative in Switzerland is " + (v(s, "chRepName") || "[representative]") + ", " + (v(s, "chRepAddress") || "[address]") +
					". You can contact them about how we process your data and how to exercise your rights (Articles 14 and 15 FADP)." });
			if (yes(s, "dpo")) blocks.push({ k: "p", x: "You can contact our data protection officer at " + (v(s, "dpoContact") || "[DPO contact details]") + "." });
			var jointActs = acts.filter(function (a) { return yes(a, "jointP"); });
			if (yes(s, "joint")) {
				blocks.push({ k: "p", x: stop("For " + (jointActs.length ? joinList(jointActs.map(function (a) { return lcFirst(v(a, "purpose") || "[purpose]"); })) : "[mark the purposes concerned]") +
					" we are joint controllers with " + (v(s, "jointWho") || "[other controller]")) + " " + stop(v(s, "jointEssence") || "[essence of the arrangement]") +
					" Contact " + (v(s, "jointContact") || "[contact point]") + " to exercise your rights. You can also exercise them against each of us" + (GL ? " (" + A("Article 26(3) GDPR") + ")." : ".") });
			}

			/* 2. Purposes and legal bases */
			var lis = acts.filter(function (a) { return basisOf(s, a) === "f"; });
			var rliMain = acts.filter(function (a) { return basisOf(s, a) === "ea"; });
			if (GL) {
				blocks.push({ k: "h2", x: "2. What we use your data for, and on what legal basis" });
				if (acts.length) {
					var rows = acts.map(function (a) {
						var b = find(basesFor(s), basisOf(s, a));
						var basis = b ? A(b.art) + ": " + b.short : "[legal basis]";
						if (v(a, lf(s, "lawRef")) && (b && (b.id === "c" || b.id === "e"))) basis += " (" + v(a, lf(s, "lawRef")) + ")";
						var pur = (v(a, "purpose") || "[purpose]") + (yes(a, "jointP") ? " (joint controllers with " + (v(s, "jointWho") || "[other controller]") + ")" : "");
						return [pur, v(a, "data") || "[personal data]", basis, v(a, "retention") || "[retention period or criteria]"];
					});
					if (yes(s, "further")) {
						var fb = find(basesFor(s), v(s, "furtherBasis"));
						rows.push([(v(s, "furtherWhat") || "[new purpose]") + " (from " + (fmtDate(v(s, "furtherStart")) || "[start date]") + ")", v(s, "furtherData") || "[personal data]",
							fb ? A(fb.art) + ": " + fb.short : "[legal basis]", v(s, "furtherRetention") || "[retention period or criteria]"]);
					}
					blocks.push({ k: "table", head: ["Purpose", "Personal data", "Legal basis", "How long we keep it"], rows: rows });
				} else {
					blocks.push({ k: "p", x: "[Add at least one purpose.]" });
				}
				if (lis.length) {
					blocks.push({ k: "h3", x: "Our legitimate interests" });
					blocks.push({ k: "ul", items: lis.map(function (a) { return { b: (v(a, "purpose") || "[purpose]") + ":", x: stop(v(a, "li") || "[the interest pursued]") }; }) });
					blocks.push({ k: "p", x: "We weighed these interests against your interests and rights before relying on them. You can ask us for the information on that balancing test using the contact details in section " + num.rights + "." });
				}
				if (rliMain.length) {
					blocks.push({ k: "h3", x: "Recognised legitimate interests" });
					blocks.push({ k: "ul", items: rliMain.map(function (a) { var r = lbl(D.UK_RLI, v(a, "rliCond")); return { b: (v(a, "purpose") || "[purpose]") + ":", x: "the processing is necessary for " + (r ? r.t : "[the Annex 1 condition]") + "." }; }) });
				}
				var sp = acts.filter(function (a) { return art9Of(s, a); });
				if (sp.length) {
					blocks.push({ k: "h3", x: "Special category data" });
					blocks.push({ k: "ul", items: sp.map(function (a) {
						var pt = art9Of(s, a);
						var law = !D.ART9_NEEDS_LAW[pt] ? "" : P === "uk" ? ", under the Data Protection Act 2018, Schedule 1: " + (v(a, "art9LawUk") || "[the Schedule 1 condition relied on]") :
							", under " + (v(a, "art9Law") || "[the law, collective agreement or contract relied on]");
						return { b: (v(a, "purpose") || "[purpose]") + ":", x: "we rely on Article 9(2)(" + pt + ") " + A("GDPR") + ": " + (D.ART9_TXT[pt] || "[condition]") + law + "." };
					}) });
				}
				var cr = acts.filter(function (a) { return crimOf(s, a); });
				if (cr.length) {
					blocks.push({ k: "h3", x: "Criminal convictions and offences data" });
					blocks.push({ k: "ul", items: cr.map(function (a) {
						return { b: (v(a, "purpose") || "[purpose]") + ":", x: P === "uk" ?
							"processed under " + (v(a, "crimLawUk") || "[the Schedule 1 condition of the Data Protection Act 2018, or official authority]") + " (Article 10 UK GDPR; section 10 of the Data Protection Act 2018)." :
							"processed under " + (v(a, "crimLaw") || "[the authorising law or official authority]") + " (Article 10 GDPR)." };
					}) });
				}
			} else {
				blocks.push({ k: "h2", x: "2. What we use your data for" });
				if (acts.length) {
					var withG = acts.some(function (a) { return v(a, "chGround"); });
					var crows = acts.map(function (a) {
						var g = lbl(D.CH_GROUNDS, v(a, "chGround"));
						var pur = (v(a, "purpose") || "[purpose]") + (yes(a, "jointP") ? " (with " + (v(s, "jointWho") || "[other controller]") + ")" : "");
						var r = [pur, v(a, "data") || "[personal data]"];
						if (withG) r.push(g ? ucFirst(g.t) : "");
						r.push(v(a, "retention") || "[retention period or criteria]");
						return r;
					});
					if (yes(s, "further")) {
						var fr = [(v(s, "furtherWhat") || "[new purpose]") + " (from " + (fmtDate(v(s, "furtherStart")) || "[start date]") + ")", v(s, "furtherData") || "[personal data]"];
						if (withG) fr.push("");
						fr.push(v(s, "furtherRetention") || "[retention period or criteria]");
						crows.push(fr);
					}
					blocks.push({ k: "table", head: withG ? ["Purpose", "Personal data", "Justification", "How long we keep it"] : ["Purpose", "Personal data", "How long we keep it"], rows: crows });
				} else {
					blocks.push({ k: "p", x: "[Add at least one purpose.]" });
				}
			}
			if (yes(s, "inferred")) blocks.push({ k: "p", x: "We also create information about you from the data above: " + stop(v(s, "inferredWhat") || "[what is inferred, and from what]") });

			/* Source (Article 14 GDPR; Article 19(3) FADP) */
			if (indirect) {
				blocks.push({ k: "h2", x: num.source + ". Where your data comes from" });
				var src = arr(s, "sources");
				if (src.length) blocks.push({ k: "ul", items: src.map(function (x) {
					var ai = v(x, "usedFor"), a = ai !== "" ? acts[+ai] : null;
					return { b: (v(x, "name") || "[source]") + ":", x: (v(x, "what") || "[categories of data]") + (yes(x, "pub") ? " (a publicly accessible source)" : "") +
						", used for " + (a ? lcFirst(v(a, "purpose") || "[purpose]") : "[purpose]") + (GL ? ". Legal basis and retention as for that purpose in section 2." : ". Retention as for that purpose in section 2.") };
				}) });
				if (yes(s, "unattributable")) blocks.push({ k: "p", x: "Where we cannot attribute a record to a single source, the data comes from " + stop(v(s, "sourceNature") || "[nature of the sources and type of organisation]") });
				else if (!src.length) blocks.push({ k: "p", x: "[Name each source of the data, and the categories of data you get from it.]" });
			}
			/* Required or not (Article 13(2)(e)) */
			if (num.req) {
				blocks.push({ k: "h2", x: num.req + ". Do you have to give us your data" });
				blocks.push({ k: "ul", items: acts.map(function (a) {
					var r = v(a, "required");
					var txt = r === "optional" ? "Optional. If you do not provide it, " + lcFirst(stop(v(a, "consequence") || "[what happens]")) :
						r === "contract" ? "Needed to enter into or perform the contract with you. " + stop(v(a, "consequence") || "[consequence of not providing it]") :
						r === "statutory" ? "Required by law. " + stop(v(a, "consequence") || "[consequence of not providing it]") :
						r === "contractual" ? "A contractual requirement. " + stop(v(a, "consequence") || "[consequence of not providing it]") : "[say whether it is required]";
					return { b: (v(a, "purpose") || "[purpose]") + ":", x: txt };
				}) });
			}
			/* Recipients */
			blocks.push({ k: "h2", x: num.recip + ". Who receives your data" });
			var rec = arr(s, "recipients");
			if (rec.length) {
				blocks.push({ k: "table", head: ["Recipient", "Role", "What for", "Location"],
					rows: rec.map(function (r) { return [v(r, "who") || "[recipient]", ROLE_TXT[v(r, "role")] || "[role]", v(r, "why") || "[what for]", v(r, "where") || "[location]"]; }) });
			} else {
				blocks.push({ k: "p", x: "[List the recipients, including service providers that process data for you.]" });
			}
			/* Transfers, under the law that leads */
			blocks.push({ k: "h2", x: num.transfers + ". " + (P === "eu" ? "Transfers outside the European Economic Area" : P === "uk" ? "Transfers outside the United Kingdom" : "Disclosure of your data abroad") });
			Array.prototype.push.apply(blocks, P === "eu" ? euTransferBlocks(s) : P === "uk" ? ukTransferBlocks(s) : chTransferBlocks(s));

			/* Automated decisions */
			blocks.push({ k: "h2", x: num.adm + ". " + (P === "ch" ? "Automated individual decisions and profiling" : "Automated decisions and profiling") });
			if (yes(s, "adm")) {
				if (P === "eu") {
					Array.prototype.push.apply(blocks, admCore(s, "We take the following decision about you based solely on automated processing: "));
					var ab = v(s, "admBasis");
					if (ab === "contract" || ab === "consent") {
						blocks.push({ k: "p", x: "You have the right to obtain human intervention from us, to express your point of view and to contest the decision (Article 22(3) GDPR). Use the contact details in section " + num.rights + "." });
					} else if (ab === "law") {
						blocks.push({ k: "p", x: "The decision is authorised by " + stop(v(s, "admLaw") || "[the law, and the safeguards it lays down]") + " (Article 22(2)(b) GDPR)." });
					}
				} else if (P === "uk") {
					Array.prototype.push.apply(blocks, admCore(s, "We take the following significant decision about you based solely on automated processing, without meaningful human involvement: "));
					Array.prototype.push.apply(blocks, ukAdmSafeguards(s, num.rights));
				} else {
					Array.prototype.push.apply(blocks, admCore(s, "We take the following decision about you based exclusively on automated processing. It has a legal consequence for you or a considerable adverse effect on you (an automated individual decision, Article 21 FADP): "));
					blocks.push(chAdmRight(s, num.rights));
				}
			} else if (no(s, "adm")) {
				blocks.push({ k: "p", x: P === "uk" ? "We do not take significant decisions about you based solely on automated processing, that is decisions with legal or similarly significant effects on you taken without meaningful human involvement." :
					P === "ch" ? "We do not take decisions about you based exclusively on automated processing that have a legal consequence for you or a considerable adverse effect on you." :
					"We do not take decisions about you based solely on automated processing that have legal effects on you or similarly significantly affect you." });
				if (yes(s, "profiling")) blocks.push({ k: "p", x: "We do use profiling: " + stop(v(s, "profilingWhat") || "[the profiling and its effect]") });
			} else {
				blocks.push({ k: "p", x: "[Say whether you take decisions based solely on automated processing.]" });
			}
			/* Rights */
			blocks.push({ k: "h2", x: num.rights + ". Your rights" });
			if (GL) {
				blocks.push({ k: "ul", items: D.RIGHTS.filter(function (r) {
					return !r.cond || (r.cond === "port" && pnPort(s)) || (r.cond === "object" && pnObject(s));
				}).map(function (r) {
					if (r.id !== "object") return { b: r.title + " (" + r.art + " " + A("GDPR") + ").", x: A(r.text) + (r.id === "access" && P === "uk" ? " You are entitled to what we can find through a reasonable and proportionate search (Article 15(1A) UK GDPR)." : "") };
					var what = joinList([pnUsesBasis(s, "f") ? "processing based on our legitimate interests" : "", pnUsesBasis(s, "ea") ? "processing based on a recognised legitimate interest" : "",
						pnUsesBasis(s, "e") ? "processing based on a public task" : "", yes(s, "marketing") ? "direct marketing" : ""]);
					return { b: r.title + " (" + r.art + " " + A("GDPR") + ").", x: "You can object to " + what + ". Section " + num.object + " explains how." };
				}) });
				blocks.push({ k: "p", x: "To exercise a right, contact us at " + (v(s, "rightsContact") || "[how to exercise rights]") + ". " +
					(P === "uk" ? UK_RIGHTS_TIMING : "We reply without undue delay and within one month of receiving your request. Where necessary because requests are complex or numerous, we can extend this by two further months. If we do, we tell you within one month of receiving your request and explain why (Article 12(3) GDPR).") +
					" We do not charge for this. Where a request is manifestly unfounded or excessive, we can charge a reasonable fee or refuse to act, and we tell you why (" + A("Article 12(5) GDPR") + "). For further copies of your data we can charge a reasonable fee based on administrative costs (" + A("Article 15(3) GDPR") + "). " +
					(P === "uk" ? "If we have reasonable doubts about who is making the request, we ask for the information we need to confirm your identity, and deal with the request once it is confirmed (Article 12(6) UK GDPR)." :
						"If we have reasonable doubts about who is making the request, we ask for the information we need to confirm your identity (Article 12(6) GDPR).") });
				if (yes(s, lf(s, "restriction"))) blocks.push({ k: "p", x: (P === "uk" ? "We rely on an exemption in the Data Protection Act 2018 that restricts the following rights: " : "We rely on a national law that restricts the following rights: ") +
					stop(v(s, lf(s, "restrictionWhat")) || "[law and right]") + " If we apply it to your request, we tell you, unless doing so would defeat the purpose of the restriction." });
			} else {
				blocks.push({ k: "ul", items: D.RIGHTS_CH.map(function (r) { return { b: r.title, x: r.text }; }) });
				blocks.push({ k: "p", x: "To exercise a right, contact us at " + (v(s, "rightsContact") || "[how to exercise rights]") + "." });
				if (yes(s, "restrictionCh")) {
					var rk = v(s, "restrictionKind");
					blocks.push({ k: "p", x: "We rely on the following restriction under the FADP" + (rk === "inform" ? " (Article 20)" : rk === "access" ? " (Article 26)" : rk === "both" ? " (Articles 20 and 26)" : "") + ": " +
						stop(v(s, "restrictionWhatCh") || "[restriction and ground]") +
						(rk === "access" || rk === "both" ? " If we refuse, restrict or defer your access to information, we tell you within the same 30 days and explain why (Article 26(4) FADP; Article 18(3) of the Data Protection Ordinance)." : "") });
				}
			}
			/* Right to object: clearly and separately (Article 21(4)). */
			if (pnObject(s)) {
				var ob = [];
				if (pnUsesBasis(s, "e") || pnUsesBasis(s, "f") || pnUsesBasis(s, "ea")) {
					ob.push({ k: "p", x: "You can object at any time, on grounds relating to your particular situation, to processing based on " +
						joinList([pnUsesBasis(s, "f") ? "our legitimate interests" : "", pnUsesBasis(s, "ea") ? "a recognised legitimate interest" : "", pnUsesBasis(s, "e") ? "a task carried out in the public interest or in the exercise of official authority" : ""]) +
						", including profiling based on them. We then stop, unless we demonstrate compelling legitimate grounds that override your interests, rights and freedoms, or the processing is needed to establish, exercise or defend legal claims (" + A("Article 21(1) GDPR") + ")." });
				}
				if (yes(s, "marketing")) ob.push({ k: "p", x: "You can object at any time to the use of your data for direct marketing, including profiling related to it. When you do, we stop using your data for that purpose (" + A("Article 21(2) and (3) GDPR") + ")." });
				ob.push({ k: "p", x: "To object, contact us at " + (v(s, "rightsContact") || "[how to exercise rights]") + "." });
				blocks.push({ k: "h2", x: num.object + ". Your right to object" });
				blocks.push({ k: "box", title: "Your right to object", blocks: ob });
			}
			if (pnConsent(s)) {
				blocks.push({ k: "h2", x: num.consent + ". Withdrawing consent" });
				blocks.push({ k: "p", x: "Where we rely on your consent, you can withdraw it at any time: " + stop(v(s, "withdrawHow") || "[how to withdraw]") +
					(P === "ch" ? " Withdrawal takes effect from then on. It does not undo what we did with your consent before you withdrew it." : " Withdrawing consent does not affect the lawfulness of what we did before you withdrew it.") });
			}
			blocks.push({ k: "h2", x: num.complaints + ". Complaints" });
			if (P === "eu") blocks.push({ k: "p", x: "You have the right to lodge a complaint with a supervisory authority, in particular in the Member State where you live, where you work or where you think the infringement took place (Article 77 GDPR)." +
				(v(s, "saName") ? " Our lead or competent authority is " + v(s, "saName") + (v(s, "saContact") ? " (" + v(s, "saContact") + ")" : "") + "." : "") });
			else if (P === "uk") blocks.push({ k: "p", x: ukComplaintText(s) });
			else blocks.push({ k: "p", x: CH_COMPLAINT });

			/* Supplements: what differs for people under each other law. */
			var rliItems = ukRliItems(s);
			if (num.uk) {
				blocks.push({ k: "h2", x: num.uk + ". Additional information for people in the United Kingdom" });
				blocks.push({ k: "p", x: "For people in the United Kingdom, the UK GDPR and the Data Protection Act 2018 apply. The rest of this notice applies to you too, read with the UK GDPR in place of the GDPR wherever an article is cited. Where this section says something different, this section applies, and the complaint route below replaces section " + num.complaints + "." });
				if (rliItems.length) {
					blocks.push({ k: "h3", x: "Recognised legitimate interests" });
					blocks.push({ k: "p", x: "For the following purposes we rely, for people in the United Kingdom, on a recognised legitimate interest (Article 6(1)(ea) UK GDPR):" });
					blocks.push({ k: "ul", items: rliItems.map(function (r) { var c2 = lbl(D.UK_RLI, r.cond); return { b: (r.purpose || "[purpose]") + ":", x: "the processing is necessary for " + (c2 ? c2.t : "[the Annex 1 condition]") + "." }; }) });
					blocks.push({ k: "box", title: "Your right to object", blocks: [
						{ k: "p", x: "You can object at any time, on grounds relating to your particular situation, to this processing, including profiling based on it. We then stop, unless we demonstrate compelling legitimate grounds that override your interests, rights and freedoms, or the processing is needed to establish, exercise or defend legal claims (Article 21(1) UK GDPR)." },
						{ k: "p", x: "To object, contact us at " + (v(s, "rightsContact") || "[how to exercise rights]") + "." }] });
				}
				var schItems = [];
				acts.forEach(function (a) {
					if (D.ART9_NEEDS_LAW[art9Of(s, a)]) schItems.push({ b: (v(a, "purpose") || "[purpose]") + ":", x: "for the special category data, the Data Protection Act 2018, Schedule 1: " + stop(v(a, "art9LawUk") || "[the Schedule 1 condition relied on]") });
					if (crimOf(s, a)) schItems.push({ b: (v(a, "purpose") || "[purpose]") + ":", x: "for the criminal offence data, " + stop(v(a, "crimLawUk") || "[the Schedule 1 condition of the Data Protection Act 2018, or official authority]") + " (Article 10 UK GDPR; section 10 of the Data Protection Act 2018)" });
				});
				if (schItems.length) {
					blocks.push({ k: "h3", x: "Special category and criminal offence data" });
					blocks.push({ k: "ul", items: schItems.map(function (x) { return { b: x.b, x: stop(x.x) }; }) });
				}
				blocks.push({ k: "h3", x: "Transfers outside the United Kingdom" });
				Array.prototype.push.apply(blocks, ukTransferBlocks(s));
				if (yes(s, "adm")) {
					blocks.push({ k: "h3", x: "Automated decisions" });
					blocks.push({ k: "p", x: "Under the UK GDPR, the decision described in section " + num.adm + " is a significant decision based solely on automated processing." });
					Array.prototype.push.apply(blocks, ukAdmSafeguards(s, num.rights));
				}
				blocks.push({ k: "h3", x: "Your rights" });
				blocks.push({ k: "p", x: "You have the rights in section " + num.rights + " under the same articles of the UK GDPR. " + UK_RIGHTS_TIMING +
					" For access, you are entitled to what we can find through a reasonable and proportionate search (Article 15(1A) UK GDPR)." });
				blocks.push({ k: "h3", x: "Complaints" });
				blocks.push({ k: "p", x: ukComplaintText(s) });
			}
			if (num.ch) {
				blocks.push({ k: "h2", x: num.ch + ". Additional information for people in Switzerland" });
				var gdprSecs = [num.rights, num.object, num.complaints].filter(Boolean);
				blocks.push({ k: "p", x: "For people in Switzerland, the Federal Act on Data Protection (FADP) applies. The rest of this notice describes how we process your data. The rights and the reporting route in this section are those the FADP gives you. Sections " +
					joinList(gdprSecs.map(String)) + " apply to you only where the " + A("GDPR") + " applies to our processing of your data." });
				blocks.push({ k: "h3", x: "Disclosure of your data abroad" });
				Array.prototype.push.apply(blocks, chTransferBlocks(s));
				if (yes(s, "adm")) {
					blocks.push({ k: "h3", x: "Automated individual decisions" });
					blocks.push({ k: "p", x: "Under the FADP, the decision described in section " + num.adm + " is an automated individual decision where it has a legal consequence for you or a considerable adverse effect on you (Article 21 FADP)." });
					blocks.push(chAdmRight(s, num.rights));
				}
				blocks.push({ k: "h3", x: "Your rights under the FADP" });
				blocks.push({ k: "ul", items: D.RIGHTS_CH.map(function (r) { return { b: r.title, x: r.text }; }) });
				blocks.push({ k: "p", x: "To exercise a right, contact us at " + (v(s, "rightsContact") || "[how to exercise rights]") + "." });
				blocks.push({ k: "h3", x: "Reporting to the FDPIC" });
				blocks.push({ k: "p", x: CH_COMPLAINT });
			}

			var brRes = null;
			if (num.br) {
				blocks.push({ k: "h2", x: num.br + ". Additional information for people in Brazil" });
				Array.prototype.push.apply(blocks, brSection(s, num, P === "ch" ? "FADP" : A("GDPR")));
				brRes = brChecks(s, false);
			}

			var canRes = null;
			if (num.can) {
				blocks.push({ k: "h2", x: num.can + ". Additional information for people in Canada" });
				Array.prototype.push.apply(blocks, canSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "FADP" : A("GDPR"), num.adm));
				canRes = canChecks(s, false);
			}
			var inRes = null;
			if (num.in) {
				blocks.push({ k: "h2", x: num.in + ". Additional information for people in India" });
				Array.prototype.push.apply(blocks, inSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));
				inRes = inChecks(s, false);
			}
			var cnRes = null;
			if (num.cn) {
				blocks.push({ k: "h2", x: num.cn + ". Additional information for people in China" });
				Array.prototype.push.apply(blocks, cnSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));
				cnRes = cnChecks(s, false);
			}
			var jpRes = null;
			if (num.jp) {
				blocks.push({ k: "h2", x: num.jp + ". Additional information for people in Japan" });
				Array.prototype.push.apply(blocks, jpSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));
				jpRes = jpChecks(s, false);
			}
			var krRes = null;
			if (num.kr) {
				blocks.push({ k: "h2", x: num.kr + ". Additional information for people in Korea" });
				Array.prototype.push.apply(blocks, krSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));
				krRes = krChecks(s, false);
			}
			var sgRes = null;
			if (num.sg) {
				blocks.push({ k: "h2", x: num.sg + ". " + sgHead(s) });
				Array.prototype.push.apply(blocks, sgSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));
				sgRes = sgChecks(s, false);
			}
			var auRes = null;
			if (num.au) {
				blocks.push({ k: "h2", x: num.au + ". " + auHead(s) });
				Array.prototype.push.apply(blocks, auSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));
				auRes = auChecks(s, false);
			}
			var zaRes = null;
			if (num.za) {
				blocks.push({ k: "h2", x: num.za + ". " + zaHead(s) });
				Array.prototype.push.apply(blocks, zaSection(s, [num.rights, num.object, num.complaints], P === "ch" ? "the FADP" : "the " + A("GDPR")));
				zaRes = zaChecks(s, false);
			}

			var caRes = null;
			if (num.ca) {
				blocks.push({ k: "h2", x: num.ca + ". Additional information for California residents" });
				var caSecs = [num.rights, num.object, num.complaints].filter(Boolean).map(String);
				blocks.push({ k: "p", x: "If you are a California resident, the California Consumer Privacy Act (CCPA) applies to your personal information. This section is our notice at collection and privacy policy for California residents. The rest of this notice describes our processing too, but your rights under the CCPA, and how to exercise them, are the ones set out here." +
					(caSecs.length ? " " + (caSecs.length > 1 ? "Sections " : "Section ") + joinList(caSecs) + (caSecs.length > 1 ? " apply" : " applies") + " to you only where the " + (P === "ch" ? "FADP" : A("GDPR")) + " applies to our processing of your data." : "") +
					" Last updated " + (fmtDate(v(s, "effective")) || "[date]") + "." });
				Array.prototype.push.apply(blocks, caBody(s, function (b, t) { b.push({ k: "h3", x: t }); return null; }, {}));
				caRes = caChecks(s, false);
			}

			var usRes = null;
			if (num.us) {
				blocks.push({ k: "h2", x: num.us + ". Additional information for residents of other US states" });
				var usSecs = [num.rights, num.object, num.complaints].filter(Boolean).map(String);
				blocks.push({ k: "p", x: "If you live in " + (usSt(s).length ? orList(usSt(s).map(function (st) { return st.n; })) : "[the states whose law applies]") + ", your state's consumer privacy law applies to your personal data. This section is the privacy notice those laws require; your rights under them, and how to exercise them, are the ones set out here." +
					(usSecs.length ? " " + (usSecs.length > 1 ? "Sections " : "Section ") + joinList(usSecs) + (usSecs.length > 1 ? " apply" : " applies") + " to you only where the " + (P === "ch" ? "FADP" : A("GDPR")) + " applies to our processing of your data." : "") +
					(usHas(s, "NJ") ? " Effective and last updated " : " Last updated ") + (fmtDate(v(s, "effective")) || "[date]") + "." });
				blocks.push({ k: "ul", items: usSt(s).map(function (st) { return { b: st.n + ":", x: st.law + " (" + st.cite + ")" + (v(s, "effective") && st.eff > v(s, "effective") ? ", from " + fmtDate(st.eff) : "") + "." }; }) });
				Array.prototype.push.apply(blocks, usBody(s, function (b, t) { b.push({ k: "h3", x: t }); return null; }, {}));
				usRes = usChecks(s, false);
			}

			blocks.push({ k: "h2", x: num.changes + ". Changes to this notice" });
			if (yes(s, "further")) {
				var fbas = find(basesFor(s), v(s, "furtherBasis"));
				blocks.push({ k: "box", title: "Planned new use of your data", blocks: [
					{ k: "p", x: "From " + (fmtDate(v(s, "furtherStart")) || "[start date]") + " we intend to use personal data we already hold for a new purpose: " + stop(v(s, "furtherWhat") || "[new purpose]") },
					{ k: "p", x: "For this new purpose we use " + lcFirst(v(s, "furtherData") || "[personal data]") + (GL ? ", on the basis of " + ((fbas || {}).short || "[legal basis]") +
						(furtherBasisOf(s) === "ea" ? " (the processing is necessary for " + ((lbl(D.UK_RLI, v(s, "furtherRliCond")) || {}).t || "[the Annex 1 condition]") + ")" : "") + "," : "") +
						" and " + keepFor(v(s, "furtherRetention") || "[retention period or criteria]") + " It is listed in section 2." },
					{ k: "p", x: stop(v(s, lf(s, "furtherCompat")) || (GL ? "[why it is compatible, or why a new legal basis applies]" : "[why it is compatible with the original purpose]")) + " Before that date you can exercise your rights" + (GL ? ", including the right to object where it applies," : "") + " using the contact details in section " + num.rights + "." }
				] });
			}
			blocks.push({ k: "p", x: "When we change this notice in a way that matters to you, such as a new purpose, a new recipient or transfer, or a change to how you exercise your rights, we tell you directly and in advance, and explain what the change means for you. We do not expect you to check this page for updates." });
			if (v(s, "changeSummary")) blocks.push({ k: "p", x: "Changes in this version: " + stop(v(s, "changeSummary")) });

			/* ---- completeness check ---- */
			var nCh = (v(s, "ctrlEmail") ? 1 : 0) + (v(s, "ctrlPhone") ? 1 : 0) + (v(s, "ctrlAddress") ? 1 : 0);
			var vague = acts.filter(function (a) { return D.LINT.vaguePurpose.test(v(a, "purpose")); });
			var jointRec = rec.some(function (r) { return v(r, "role") === "joint"; });
			var dataOk = acts.length && acts.every(function (a) { return v(a, "data"); });
			if (indirect) dataOk = dataOk && arr(s, "sources").every(function (x) { return v(x, "what"); });
			var vagueRet = acts.filter(function (a) { return D.LINT.vagueRetention.test(v(a, "retention")); });
			/* Every recipient named in a transfer row is a recipient too (review R19). */
			var xferNames = [];
			if (EU && yes(s, "transfers")) arr(s, "trows").forEach(function (t) { xferNames.push(v(t, "recipient")); });
			if (UK && yes(s, "ukTransfers")) arr(s, "ukTrows").forEach(function (t) { xferNames.push(v(t, "recipient")); });
			if (CH && yes(s, "chAbroad")) arr(s, "chTrows").forEach(function (t) { xferNames.push(v(t, "recipient")); });
			if (BR) brTrows(s).forEach(function (t) { xferNames.push(v(t, "recipient")); });
			var unlisted = xferNames.filter(function (n, i) {
				return n && xferNames.indexOf(n) === i && !sameName(n, v(s, "ctrlName")) && !rec.some(function (r) { return sameName(r.who, n); });
			});
			var recRow = function (id) {
				return yes(s, "joint") && !jointRec ? chk(id, "missing", "List the other joint controller as a recipient" + (id === "P08" ? " (Article 4(9); WP260 Annex)." : ".")) :
					!rec.length ? chk(id, "warn", "No recipients listed. Hosting, email and IT providers acting for you are recipients" + (id === "P08" ? " (Article 4(9))" : "") + ". Confirm there really are none.") :
					rec.some(function (r) { return !v(r, "who") || !v(r, "role"); }) ? chk(id, "missing", "Each recipient needs a name or specific category and a role.") :
					unlisted.length ? chk(id, "warn", "Add to the recipients list everyone named in a transfer: " + stop(joinList(unlisted))) : chk(id, "ok");
			};
			var selfXfer = function (rows) { return rows.some(function (t) { return sameName(v(t, "recipient"), v(s, "ctrlName")); }); };
			var SELF = "A transfer row names your own organisation. List onward transfers only: where you process the data yourself is stated in the notice.";
			if (GL) {
				checks.push(!v(s, "ctrlName") || !nCh ? chk("P01", "missing", "Add the organisation's name and at least one contact channel.") :
					nCh < 2 ? chk("P01", "warn", "WP260 prefers more than one channel (phone, email, postal address).") : chk("P01", "ok"));
				if (EU) {
					if (!no(s, "euEstablished")) checks.push(chk("P02", v(s, "euEstablished") ? "na" : "missing", v(s, "euEstablished") ? "Established in the EU or EEA." : "Answer whether the organisation is established in the EU or EEA."));
					else if (yes(s, "repExempt")) checks.push(chk("P02", "na", "Article 27(2) exemption recorded. Keep the reasoning on file."));
					else checks.push(v(s, "repName") && v(s, "repContact") ? chk("P02", "ok") : chk("P02", "missing", "Name the representative and give contact details."));
				}
				checks.push(yes(s, "dpo") ? (v(s, "dpoContact") ? chk("P03", "ok") : chk("P03", "missing", "Add the DPO's contact details.")) :
					no(s, "dpo") ? chk("P03", "na", "No DPO designated.") : chk("P03", "missing", "Answer whether a DPO is designated."));
				checks.push(!acts.length || acts.some(function (a) { return !v(a, "purpose"); }) ? chk("P04", "missing", "Every row needs a purpose.") :
					vague.length ? chk("P04", "warn", "Too vague to tell a reader what happens: " + vague.map(function (a) { return "\"" + v(a, "purpose") + "\""; }).join(", ") + ". Say what is done and how (WP260 12).") : chk("P04", "ok"));
				/* In a UK-led notice the Schedule 1 condition is row J03 (review R02, R17). */
				var noLaw9 = P === "uk" ? [] : acts.filter(function (a) { return D.ART9_NEEDS_LAW[art9Of(s, a)] && !v(a, "art9Law"); });
				var noLawCE = acts.filter(function (a) { var b = basisOf(s, a); return (b === "c" || b === "e") && !v(a, lf(s, "lawRef")); });
				checks.push(!acts.length || acts.some(function (a) { return !basisOf(s, a); }) ? chk("P05", "missing", "Choose a legal basis for every purpose.") :
					noLaw9.length || (P === "eu" && acts.some(function (a) { return crimOf(s, a) && !v(a, "crimLaw"); })) ? chk("P05", "missing", "Name the law relied on for special category or criminal offence data.") :
					noLawCE.length ? chk("P05", "warn", "Name the law behind each legal obligation or public task (Article 6(3); good practice).") : chk("P05", "ok"));
				if (!acts.length) checks.push(chk("P06", "missing", "Add the purposes first."));
				else if (!lis.length) checks.push(chk("P06", "na", "No purpose relies on legitimate interests."));
				else if (lis.some(function (a) { return !v(a, "li"); })) checks.push(chk("P06", "missing", "Name the specific interest for each legitimate interests purpose."));
				else if (yes(s, "publicBody")) checks.push(chk("P06", "warn", "Public authorities cannot rely on legitimate interests for processing in the performance of their tasks (Article 6(1), second subparagraph)."));
				else checks.push(chk("P06", "ok"));
				checks.push(indirect ? (dataOk ? chk("P07", "ok") : chk("P07", "missing", "Article 14 requires the categories of data. Fill in the personal data column and the categories obtained from each source.")) :
					(dataOk ? chk("P07", "ok", "Not required by Article 13; included for clarity.") : chk("P07", "warn", "Not required by Article 13, but readers expect to see what data is used.")));
				checks.push(recRow("P08"));
				if (EU) {
					if (no(s, "transfers")) checks.push(no(s, "euEstablished") ? chk("P09", "warn", "The organisation is outside the EEA: the notice says where data is processed. Describe any onward transfers and where your processors are located.") :
						chk("P09", "na", "No transfers outside the EEA."));
					else if (!yes(s, "transfers")) checks.push(chk("P09", "missing", "Answer whether data is transferred outside the EEA."));
					else {
						var trs = arr(s, "trows");
						var bad = !trs.length || trs.some(function (t) {
							var mid = v(t, "mech"), m = find(D.TRANSFER_MECH, mid);
							return !v(t, "country") || !m || (m.needsCopy && !v(t, "copy")) || (mid === "other46" && !v(t, "instr46")) || (mid === "derog" && !v(t, "derogPt")) ||
								(mid === "compelling" && (!v(t, "cInterest") || !v(t, "cSafeguards") || !v(t, "copy")));
						});
						var art493 = yes(s, "publicBody") && trs.some(function (t) { return v(t, "mech") === "compelling" || (v(t, "mech") === "derog" && ["a", "b", "c"].indexOf(v(t, "derogPt")) !== -1); });
						checks.push(bad ? chk("P09", "missing", "Each transfer needs the country, the mechanism and its details: for safeguards, where to get a copy; for a derogation, which point of Article 49(1); for compelling legitimate interests, the interest and the safeguards. Name the countries (WP260 Annex).") :
							art493 ? chk("P09", "warn", "Article 49(3): public authorities exercising their public powers cannot use points (a), (b) or (c) of Article 49(1) or the compelling legitimate interests route.") :
							trs.some(function (t) { return v(t, "mech") === "compelling"; }) ? chk("P09", "warn", "Compelling legitimate interests: inform the supervisory authority of the transfer and document the assessment (Article 49(1), second subparagraph, and 49(6)).") :
							selfXfer(trs) ? chk("P09", "warn", SELF) : chk("P09", "ok"));
					}
				}
				checks.push(!acts.length || acts.some(function (a) { return !v(a, "retention"); }) ? chk("P10", "missing", "Give a retention period, or the criteria, for every purpose.") :
					vagueRet.length ? chk("P10", "missing", "\"As long as necessary\" is not enough. Give a period or the criteria a reader can apply to their own situation (WP260 Annex).") : chk("P10", "ok"));
				checks.push(v(s, "rightsContact") ? chk("P11", "ok") : chk("P11", "missing", "Say how people exercise their rights."));
				checks.push(!acts.length ? chk("P12", "missing", "Add the purposes first.") : !v(s, "marketing") ? chk("P12", "missing", "Answer whether you use the data for direct marketing.") :
					pnObject(s) ? chk("P12", "ok", "Shown in its own section and box, separate from other information. See D15 for when it has to reach people.") :
					chk("P12", "na", P === "uk" ? "No legitimate interests, recognised legitimate interest, public task or direct marketing." : "No legitimate interests, public task or direct marketing."));
				checks.push(!acts.length ? chk("P13", "missing", "Add the purposes first.") :
					pnConsent(s) ? (v(s, "withdrawHow") ? chk("P13", "ok") : chk("P13", "missing", "Say how consent is withdrawn.")) : chk("P13", "na", "No purpose relies on consent."));
				if (EU) checks.push(chk("P14", "ok", v(s, "saName") ? "Authority named." : "Generic statement under Article 77. Naming your authority helps readers."));
				if (!direct) checks.push(chk("P15", "na", "Article 14 only: not required."));
				else checks.push(!acts.length || acts.some(function (a) { return !v(a, "required") || !v(a, "consequence"); }) ?
					chk("P15", "missing", "For each purpose, say whether the data is required and what happens if it is not provided.") : chk("P15", "ok"));
			}
			var srcs = arr(s, "sources");
			var unlinked = srcs.filter(function (x) { var i = v(x, "usedFor"); return i === "" || !acts[+i]; });
			var srcRow = !v(s, "source") ? chk("P16", "missing", "Answer where the data comes from.") :
				!indirect ? chk("P16", "na", "Data collected from the person.") :
				!((srcs.length && srcs.every(function (x) { return v(x, "name"); })) || (yes(s, "unattributable") && v(s, "sourceNature"))) ? chk("P16", "missing", "Name the source, or where records cannot be attributed, describe the nature of the sources.") :
				unlinked.length ? chk("P16", "missing", "Link each source to the purpose it is used for, so the notice gives its legal basis and retention (Article 14(1)(c), 14(2)(a)).") : chk("P16", "ok");
			if (GL) checks.push(srcRow);
			if (EU) {
				if (yes(s, "adm")) {
					if (!v(s, "admWhat") || !v(s, "admLogic") || !v(s, "admEffect") || !v(s, "admBasis")) checks.push(chk("P17", "missing", "Describe the decision, the logic, the consequences and the Article 22(2) exception."));
					else if (v(s, "admBasis") === "law" && !v(s, "admLaw")) checks.push(chk("P17", "missing", "Name the law that authorises the decision and the safeguards it lays down (Article 22(2)(b))."));
					else if (yes(s, "admSpecial") && !((v(s, "admArt9") === "a" || v(s, "admArt9") === "g") && v(s, "admSafeguards")))
						checks.push(chk("P17", "missing", "Article 22(4): whatever the Article 22(2) exception, a decision based on special category data needs explicit consent (Article 9(2)(a)) or substantial public interest under law (Article 9(2)(g)), with suitable safeguards described."));
					else checks.push(chk("P17", "ok"));
				} else if (no(s, "adm")) {
					checks.push(yes(s, "profiling") && !v(s, "profilingWhat") ? chk("P17", "missing", "Describe the profiling and its effect (WP260 41).") : chk("P17", "ok", "States that no such decisions are taken."));
				} else checks.push(chk("P17", "missing", "Answer whether decisions are taken solely by automated means."));
			}
			if (GL) {
				checks.push(yes(s, "further") ? (v(s, "furtherWhat") && v(s, "furtherStart") && v(s, "furtherData") && furtherBasisOf(s) && v(s, "furtherRetention") && v(s, lf(s, "furtherCompat")) ?
					chk("P18", "ok", "Send this notice to people before the start date, in a dedicated message.") :
					chk("P18", "missing", "Give the new purpose, its start date, the data, the legal basis, the retention period and the compatibility reasoning (Article 13(3); WP260 46).")) : chk("P18", "na", "No new purpose planned."));
				checks.push(yes(s, "joint") ? (v(s, "jointWho") && v(s, "jointEssence") && v(s, "jointContact") && jointActs.length ? chk("P19", "ok") :
					chk("P19", "missing", "Name the other controller, the essence of the arrangement and the contact point, and mark the purposes run jointly.")) :
					chk("P19", "na", "No joint controllership."));
				checks.push(yes(s, lf(s, "restriction")) ? (v(s, lf(s, "restrictionWhat")) ? chk("P20", "ok") : chk("P20", "missing", "Name the law and the right it restricts.")) : chk("P20", "na", "No national restriction relied on."));
				checks.push(v(s, "consequences") ? chk("P21", "ok") : chk("P21", "warn", "Empty. Fine only if nothing here is complex, technical or unexpected (WP260 10)."));
			} else {
				/* Swiss-led notice: the FADP rows replace the GDPR rows. */
				checks.push(!v(s, "ctrlName") || !nCh ? chk("K01", "missing", "Add the organisation's name and at least one contact channel.") : chk("K01", "ok"));
				checks.push(!acts.length || acts.some(function (a) { return !v(a, "purpose"); }) ? chk("K03", "missing", "Every row needs a purpose the person can recognise (Article 6(3)).") :
					vague.length ? chk("K03", "warn", "Too vague to tell a reader what happens: " + vague.map(function (a) { return "\"" + v(a, "purpose") + "\""; }).join(", ") + ".") : chk("K03", "ok"));
				checks.push(recRow("K04"));
				checks.push(!v(s, "source") ? chk("K05", "missing", "Answer where the data comes from.") : !indirect ? chk("K05", "na", "Data collected from the person.") :
					dataOk ? chk("K05", "ok") : chk("K05", "missing", "Give the categories of data: fill in the personal data column and the categories obtained from each source."));
				checks.push(!v(s, "rightsContact") ? chk("K08", "missing", "Say how people exercise their rights.") :
					!acts.length || acts.some(function (a) { return !v(a, "retention"); }) ? chk("K08", "warn", "Give a retention period, or the criteria, for every purpose. Article 19 does not list it, but people are entitled to it on request (Article 25(2)(d)) and it is part of transparent processing.") :
					chk("K08", "ok", "Rights under Articles 25, 28 and 32 stated, with how to exercise them."));
				var wsrc = "FADP Art. 6(6), 30(2)(b), 31(1); good practice";
				checks.push(pnConsent(s) ? (v(s, "withdrawHow") ? chk("P13", "ok", "", "Withdrawing consent", wsrc) :
					chk("P13", "missing", "Say how consent is withdrawn. Processing against the person's express wishes needs a justification (Article 30(2)(b)).", "Withdrawing consent", wsrc)) :
					chk("P13", "na", "No purpose relies on consent.", "Withdrawing consent", wsrc));
				if (yes(s, "joint")) checks.push(v(s, "jointWho") && v(s, "jointEssence") && v(s, "jointContact") && jointActs.length ? chk("P19", "ok", "Good practice under the FADP.") :
					chk("P19", "warn", "Name the other controller, what each does and the contact point. The FADP has no specific rule; this is good practice."));
				checks.push(v(s, "consequences") ? chk("P21", "ok") : chk("P21", "warn", "Empty. Fine only if nothing here is complex, technical or unexpected (WP260 10; good practice)."));
			}
			var lintHits = lintText(blocks);
			checks.push(lintHits.length ? chk("L1", "warn", "Replace qualifiers with what actually happens: " + lintHits.join(" | "), "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "WP260 13") :
				chk("L1", "ok", "", "Language: avoid \"may\", \"might\", \"some\", \"often\", \"possible\"", "WP260 13"));
			if (EU && aud === "employee") checks.push(chk("E1", "check", "Check " + (v(s, "memberState") || "the applicable Member State") + "'s rules under Article 88 and any collective agreement, in particular on monitoring at work. Not modelled here.", "National employment rules", "GDPR Art. 88"));

			/* ---- United Kingdom rows (Part J) ---- */
			if (UK) {
				if (!no(s, "ukEstablished")) checks.push(chk("J01", v(s, "ukEstablished") ? "na" : "missing", v(s, "ukEstablished") ? "Established in the United Kingdom." : "Answer whether the organisation is established in the United Kingdom."));
				else if (yes(s, "ukRepExempt")) checks.push(chk("J01", "na", "Article 27(2) UK GDPR exemption recorded. Keep the reasoning on file."));
				else checks.push(v(s, "ukRepName") && v(s, "ukRepContact") ? chk("J01", "ok") : chk("J01", "missing", "Name the UK representative and give contact details."));
				if (P === "eu" && inReg(s, "uk") && !v(s, "ukRliUse")) checks.push(chk("J02", "missing", "Answer whether you rely on a recognised legitimate interest for people in the UK."));
				else if (!rliItems.length) checks.push(chk("J02", "na", "No recognised legitimate interest relied on."));
				else if (rliItems.some(function (r) { return !r.cond || !r.linked; })) checks.push(chk("J02", "missing", "For each, choose the purpose and the Annex 1 condition (Article 6(5)). Only the conditions in Annex 1 count."));
				else if (yes(s, "publicBody")) checks.push(chk("J02", "warn", "Public authorities cannot rely on Article 6(1)(ea) for processing in the performance of their tasks (Article 6(1), second subparagraph, UK GDPR)."));
				else checks.push(chk("J02", "ok", "The right to object to this processing is shown in its own box (Article 21(1), (4) UK GDPR)."));
				{
					var schNeed = acts.filter(function (a) { return D.ART9_NEEDS_LAW[art9Of(s, a)] || crimOf(s, a); });
					checks.push(!schNeed.length ? chk("J03", "na", "No special category data needing a domestic-law condition, and no criminal offence data.") :
						schNeed.some(function (a) { return (D.ART9_NEEDS_LAW[art9Of(s, a)] && !v(a, "art9LawUk")) || (crimOf(s, a) && !v(a, "crimLawUk")); }) ?
						chk("J03", "missing", (P === "uk" ? "Name" : "For people in the UK, name") + " the Schedule 1 condition of the Data Protection Act 2018 (section 10). Points (b), (h), (i) and (j) need a Part 1 condition; point (g) a Part 2 condition; criminal offence data a Part 1, 2 or 3 condition. Most Schedule 1 conditions also need an appropriate policy document.") :
						chk("J03", "ok", "Most Schedule 1 conditions also need an appropriate policy document. Check yours is in place."));
				}
				if (no(s, "ukTransfers")) checks.push(no(s, "ukEstablished") ? chk("J04", "warn", "The organisation is outside the UK: the notice says where data is processed. Describe any onward transfers and where your processors are located.") :
					chk("J04", "na", "No transfers outside the United Kingdom."));
				else if (!yes(s, "ukTransfers")) checks.push(chk("J04", "missing", "Answer whether personal data is transferred outside the United Kingdom. Countries in the EEA count."));
				else {
					var utr = arr(s, "ukTrows");
					var ubad = !utr.length || utr.some(function (t) {
						var mid = v(t, "mech"), m = find(D.TRANSFER_MECH_UK, mid);
						return !v(t, "country") || !m || (m.needsCopy && !v(t, "copy")) || (mid === "other46" && !v(t, "instr46")) || (mid === "derog" && !v(t, "derogPt")) ||
							(mid === "compelling" && (!v(t, "cInterest") || !v(t, "cSafeguards") || !v(t, "copy")));
					});
					var u493 = yes(s, "publicBody") && utr.some(function (t) { return v(t, "mech") === "compelling" || (v(t, "mech") === "derog" && ["a", "b", "c"].indexOf(v(t, "derogPt")) !== -1); });
					checks.push(ubad ? chk("J04", "missing", "Each transfer needs the country, the mechanism and its details: for safeguards, where to get a copy; for a derogation, which point of Article 49(1); for compelling legitimate interests, the interest and the safeguards.") :
						u493 ? chk("J04", "warn", "Article 49(3) UK GDPR: public authorities exercising their public powers cannot use points (a), (b) or (c) of Article 49(1) or the compelling legitimate interests route.") :
						utr.some(function (t) { return v(t, "mech") === "compelling"; }) ? chk("J04", "warn", "Compelling legitimate interests: inform the Information Commission of the transfer and document the assessment (Article 49(1), second subparagraph, and 49(6) UK GDPR).") :
						selfXfer(utr) ? chk("J04", "warn", SELF) : chk("J04", "ok"));
					if (utr.some(function (t) { return ["idta", "addendum", "bcr", "other46"].indexOf(v(t, "mech")) !== -1; }))
						checks.push(chk("J05", "check", "Before relying on the safeguard, consider, acting reasonably and proportionately, whether the protection after the transfer is not materially lower than under UK law (the data protection test). Document it."));
				}
				var admRli = ukAdmRli(s);
				if (yes(s, "adm")) {
					if (P === "uk" && (!v(s, "admWhat") || !v(s, "admLogic") || !v(s, "admEffect"))) checks.push(chk("J06", "missing", "Describe the decision, the logic and the consequences (Article 13(2)(f) UK GDPR)."));
					else if (!v(s, "admSpecial")) checks.push(chk("J06", "missing", "Answer whether the decision uses special category data."));
					else if (yes(s, "admSpecial") && (!v(s, "ukAdmCond") || v(s, "ukAdmCond") === "none")) checks.push(chk("J06", "missing", "Article 22B: a significant decision based solely on automated processing that uses special category data needs explicit consent (22B(2)), or a contract or a legal requirement or authorisation together with Article 9(2)(g) (22B(3)). Otherwise a person must be meaningfully involved."));
					else if (admRli === "linked") checks.push(chk("J06", "missing", "Article 22B(4): this decision cannot be taken solely by automated means while the processing behind it relies on a recognised legitimate interest. Add meaningful human involvement, or use another legal basis for that processing."));
					else if (admRli === "unknown") checks.push(chk("J06", "warn", "You rely on a recognised legitimate interest. Mark which purposes feed the decision: if any of them relies on it, the decision cannot be solely automated (Article 22B(4))."));
					else checks.push(chk("J06", "ok", "Safeguards stated: information about the decision, representations, human intervention, contest (Article 22C). Put them in place."));
				} else if (no(s, "adm")) {
					checks.push(P === "uk" && yes(s, "profiling") && !v(s, "profilingWhat") ? chk("J06", "missing", "Describe the profiling and its effect.") : chk("J06", P === "uk" ? "ok" : "na", P === "uk" ? "States that no such decisions are taken." : "No significant decisions based solely on automated processing."));
				} else checks.push(chk("J06", "missing", "Answer whether decisions are taken solely by automated means."));
				checks.push(v(s, "ukComplaintRoute") ? chk("J07", "ok", "Acknowledge each complaint within 30 days and tell the person the outcome without undue delay (section 164A(3), (4)).") :
					chk("J07", "missing", "Say how people complain to you. Offer, for example, a complaint form that can be completed electronically and by other means (section 164A(2))."));
				checks.push(chk("J08", "ok", "Stated in the notice. The regulator is the Information Commission since 30 September 2026; it keeps the name ICO."));
				checks.push(chk("J09", "ok", "Stated in the notice."));
			}

			/* ---- Switzerland rows (Part K) ---- */
			if (CH) {
				if (!no(s, "chEstablished")) checks.push(chk("K02", v(s, "chEstablished") ? "na" : "missing", v(s, "chEstablished") ? "Registered office or domicile in Switzerland." : "Answer whether the organisation has its registered office or domicile in Switzerland."));
				else if (!v(s, "chRepNeeded")) checks.push(chk("K02", "missing", "Answer whether all four conditions of Article 14(1) apply."));
				else if (no(s, "chRepNeeded")) checks.push(chk("K02", "na", "Not all four Article 14(1) conditions apply. Keep the reasoning on file."));
				else checks.push(v(s, "chRepName") && v(s, "chRepAddress") ? chk("K02", "ok") : chk("K02", "missing", "Publish the representative's name and address (Article 14(3))."));
				if (no(s, "chAbroad")) checks.push(no(s, "chEstablished") ? (v(s, "ctrlCountry") ? chk("K06", "ok", "The notice names the country where the organisation processes the data.") : chk("K06", "missing", "Name the country where the organisation is established.")) :
					chk("K06", "na", "No disclosure outside Switzerland."));
				else if (!yes(s, "chAbroad")) checks.push(chk("K06", "missing", "Answer whether personal data is disclosed outside Switzerland. EU and EEA countries count."));
				else {
					var ctr = arr(s, "chTrows");
					var cbad = !ctr.length || ctr.some(function (t) { var m = v(t, "mech"); return !v(t, "country") || !m || (m === "guarantee" && !v(t, "guar")) || (m === "exception" && !v(t, "exc")); });
					var kw = [];
					if (ctr.some(function (t) { return v(t, "mech") === "adequacy" && !v(t, "adeqScope") && /united states|\busa?\b|u\.s\.|canada/i.test(v(t, "country")); }))
						kw.push("The Federal Council lists the United States only for organisations certified under the Swiss-US Data Privacy Framework, and Canada only where PIPEDA or an equivalent provincial act applies. Confirm the recipient is covered and say so, or use a guarantee under Article 16(2).");
					if (ctr.some(function (t) { return v(t, "mech") === "exception" && ["b2", "c1", "c2", "d"].indexOf(v(t, "exc")) !== -1; }))
						kw.push("On request, inform the FDPIC about disclosures under Article 17(1)(b)(2), (c) and (d) (Article 17(2)).");
					if (ctr.some(function (t) { return v(t, "mech") === "guarantee" && (v(t, "guar") === "b" || v(t, "guar") === "c"); }))
						kw.push("Notify the FDPIC of the clauses or guarantees before the first disclosure (Article 16(2)(b), (c)).");
					if (ctr.some(function (t) { return v(t, "mech") === "guarantee" && v(t, "guar") === "code"; }))
						kw.push("A code of conduct must be approved by the FDPIC beforehand (Article 12(2) of the Data Protection Ordinance).");
					if (selfXfer(ctr)) kw.push(SELF);
					checks.push(cbad ? chk("K06", "missing", "Name every State or international body, including EU and EEA countries, and for each the adequacy listing, the guarantee or the exception (Article 19(4)).") :
						no(s, "chEstablished") && !v(s, "ctrlCountry") ? chk("K06", "missing", "Name the country where the organisation is established.") :
						kw.length ? chk("K06", "warn", kw.join(" ")) : chk("K06", "ok"));
				}
				if (yes(s, "adm")) {
					if (P === "ch" && (!v(s, "admWhat") || !v(s, "admLogic") || !v(s, "admEffect"))) checks.push(chk("K07", "missing", "Describe the decision, the logic and the consequences."));
					else if (!v(s, "chAdmExc")) checks.push(chk("K07", "missing", "Answer whether an Article 21(3) exception applies."));
					else if (v(s, "chAdmExc") === "consent") checks.push(chk("K07", "warn", "With explicit consent to the automated decision, Article 21(1) and (2) do not apply (Article 21(3)(b)). Keep evidence of the consent; for anyone who has not consented, the hearing and the review apply."));
					else checks.push(chk("K07", "ok", "Tell each person when an automated individual decision about them is taken (Article 21(1)), and offer the hearing and the review by a person in practice."));
				} else if (no(s, "adm")) checks.push(chk("K07", P === "ch" ? "ok" : "na", P === "ch" ? "States that no automated individual decisions are taken." : "No automated individual decisions."));
				else checks.push(chk("K07", "missing", "Answer whether decisions are taken solely by automated means."));
				if (P !== "ch") checks.push(v(s, "rightsContact") ? chk("K08", "ok", "FADP rights stated in their own section, with how to exercise them.") : chk("K08", "missing", "Say how people exercise their rights."));
				checks.push(yes(s, "dpo") ? (v(s, "dpoContact") ? chk("K09", "ok", "Published in section 1. To rely on Article 23(4), the officer also needs professional independence without instructions, no incompatible tasks and the required expertise, and you notify the FDPIC (Article 10(3)).") : chk("K09", "missing", "Add the data protection officer's contact details.")) :
					chk("K09", "na", "No data protection officer appointed."));
				checks.push(chk("K10", "check", "Where consent is the justification for processing sensitive personal data or for high-risk profiling, it must be explicit (Article 6(7)). Sensitive data under the FADP also covers data on administrative and criminal proceedings or sanctions and on social assistance measures (Article 5(c))."));
				checks.push(chk("K13", "check", "Private persons who wilfully fail to inform, or wilfully give false or incomplete information, can be fined up to CHF 250,000, on complaint (Article 60(1))."));
				if (yes(s, "publicBody")) checks.push(chk("K14", "check", "The FADP covers private persons and federal bodies. Federal bodies have further rules not modelled here (for example Articles 20(3)(d) and 21(4)). Cantonal and communal bodies fall under cantonal data protection law instead."));
			}

			if (brRes) Array.prototype.push.apply(checks, brRes.checks);
			if (canRes) Array.prototype.push.apply(checks, canRes.checks);
			if (inRes) Array.prototype.push.apply(checks, inRes.checks);
			if (cnRes) Array.prototype.push.apply(checks, cnRes.checks);
			if (jpRes) Array.prototype.push.apply(checks, jpRes.checks);
			if (krRes) Array.prototype.push.apply(checks, krRes.checks);
			if (sgRes) Array.prototype.push.apply(checks, sgRes.checks);
			if (auRes) Array.prototype.push.apply(checks, auRes.checks);
			if (zaRes) Array.prototype.push.apply(checks, zaRes.checks);
			if (caRes) Array.prototype.push.apply(checks, caRes.checks);
			if (usRes) Array.prototype.push.apply(checks, usRes.checks);

			/* Sources of the GDPR rows point at the UK GDPR when it leads. */
			if (P === "uk") checks.forEach(function (r) { var m = D.MATRIX[r.id]; if (/^P\d/.test(r.id) && !r.s && m && /^Art\./.test(m.s)) r.s = "UK GDPR " + m.s; });

			/* ---- delivery checklist ---- */
			if (GL && direct) delivery.push(chk("D01", "check", "Give the notice when the data is collected: before a form is submitted, before payment, before sign-up. Mark required fields on every form and say what happens if they are left empty (WP260 Annex)."));
			if (GL && indirect) delivery.push(chk("D02", "check", "Send it within a reasonable period, and at the latest one month, after obtaining the data. Send it earlier if you contact the person or disclose the data before then (Article 14(3); WP260 27, 28)."));
			if (CH) delivery.push(chk("K11", "check", "Inform people when you collect their data. Where you obtain it from others, inform them at the latest one month after receiving it, or when you first disclose it if that is earlier (Article 19(1), (5))."));
			delivery.push(chk("D03", "check", "Read it as a member of the audience would. Test it if you can (WP260 9)."));
			if (CH) delivery.push(chk("K12", "check", "Make the information precise, transparent, comprehensible and easily accessible (Article 13 of the Data Protection Ordinance). English is not an official language in Switzerland: consider German, French or Italian for your audience."));
			delivery.push(chk("D04", "check", "Publish it on its own page, not inside terms and conditions."));
			if (has(s, "channel", "web")) delivery.push(chk("D05", "check", "Link it from every page under a common term such as \"Privacy\", and from every form that collects data."));
			if (has(s, "channel", "app")) delivery.push(chk("D06", "check", "Show it in the app store listing and keep it within two taps inside the app."));
			if (has(s, "channel", "phone") || has(s, "channel", "paper") || has(s, "channel", "device"))
				delivery.push(chk("D07", "check", "Offline, give the \"In short\" content first (on the call, on the form, on the device or packaging) and point to the full notice (WP260 38, 40)."));
			else delivery.push(chk("D07", "check", "Use the \"In short\" box as the first layer and keep it consistent with the full text."));
			delivery.push(chk("D08", "check", "Keep the full notice available as one document."));
			if (yes(s, "children")) delivery.push(chk("D09", "check", "Rewrite the first layer in language the children in your audience understand. Consider pictures or short video (WP260 14, 18)."));
			if (v(s, "languages")) delivery.push(chk("D10", "check", "Check each translation reads naturally in " + v(s, "languages") + "."));
			delivery.push(chk("D11", "check", "Make sure nothing makes the notice conditional on a purchase or sign-up."));
			delivery.push(chk("D12", "check", "When this notice changes materially, tell people directly in a message about the change alone, before it takes effect."));
			delivery.push(chk("D13", "check", "Decide whether to remind long-standing users where the notice is, and at what interval."));
			delivery.push(chk("D14", "check", "If you add icons, keep them alongside the text, never instead of it."));
			if (pnObject(s)) delivery.push(chk("D15", "check", "Bring the right to object explicitly, clearly and separately to each person's attention no later than your first communication with them" +
				(yes(s, "marketing") ? ", for example in the first marketing message, with a one-click way to object" : "") + " (Article 21(4))."));
			if (brRes) Array.prototype.push.apply(delivery, brRes.delivery);
			if (canRes) Array.prototype.push.apply(delivery, canRes.delivery);
			if (inRes) Array.prototype.push.apply(delivery, inRes.delivery);
			if (cnRes) Array.prototype.push.apply(delivery, cnRes.delivery);
			if (jpRes) Array.prototype.push.apply(delivery, jpRes.delivery);
			if (krRes) Array.prototype.push.apply(delivery, krRes.delivery);
			if (sgRes) Array.prototype.push.apply(delivery, sgRes.delivery);
			if (auRes) Array.prototype.push.apply(delivery, auRes.delivery);
			if (zaRes) Array.prototype.push.apply(delivery, zaRes.delivery);
			if (caRes) Array.prototype.push.apply(delivery, caRes.delivery);
			if (usRes) Array.prototype.push.apply(delivery, usRes.delivery);
			if (P === "eu" && rliItems.length) delivery.push(chk("J10", "check", "For people in the UK, bring the right to object to the recognised legitimate interest processing explicitly, clearly and separately to their attention no later than your first communication with them (Article 21(4) UK GDPR)."));
			if (P === "uk") delivery.forEach(function (r) { var m = D.MATRIX[r.id]; if (/^D\d/.test(r.id) && !r.s && m && /^Art\./.test(m.s)) r.s = "UK GDPR " + m.s; });
			/* In a Swiss-led notice the GDPR articles behind the delivery rows do not apply; the WP260
			   points remain good practice. */
			if (P === "ch") delivery.forEach(function (r) { var m = D.MATRIX[r.id]; if (/^D\d/.test(r.id) && !r.s && m) r.s = m.s.replace(/^Art\.[^;]*;\s*/, "") + " (good practice)"; });

			return { title: title, file: slug(ctrl + " " + title), blocks: blocks, checks: checks, extraTitle: "Delivery checklist", extra: checksHtml(delivery),
				docLabel: "Notice" };
		}
	};

