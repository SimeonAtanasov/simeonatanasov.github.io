# Applies the 20 findings of the independent review of 13 November 2026 (review-2026-11-13-au/findings.json)
# to au_body.js, and the field changes to pn_block.js and ng-data.js. Run once, on the reviewed files.
B = '/home/claude/ng-build/build/'
p = B + 'au/au_body.js'; t = open(p).read()
assert 'auVol' not in t
def rep(old, new, c=1):
    global t
    n = t.count(old); assert n == c, (n, old[:110]); t = t.replace(old, new)

# AU18: Australian places that failed closed
rep('var AU_AU = /\\b(commonwealth of australia|australia|australian|new south wales|victoria|queensland|western australia|south australia|tasmania|northern territory|australian capital territory|jervis bay( territory)?|christmas island|cocos( \\(keeling\\))? islands|norfolk island|',
    'var AU_AU = /\\b(commonwealth of australia|australian capital territory|australian antarctic territory|western australia|south australia|australia|australian|new south wales|victoria|queensland|tasmania|northern territory|jervis bay( territory)?|christmas island|cocos( \\(keeling\\))? islands|norfolk island|heard island( and mcdonald islands)?|mcdonald islands|ashmore and cartier islands|coral sea islands|alice springs|')
rep('var AU_CODE_G = /(^|[^A-Za-z])(AU|AUS|NSW|VIC|QLD|TAS|ACT)(?=[^A-Za-z]|$)/g;',
    'var AU_CODE_G = /(^|[^A-Za-z])(AU|AUS|au|aus|NSW|VIC|QLD|TAS|ACT)(?=[^A-Za-z]|$)/g;\n'
    '\t/* Fillers that only count next to an Australian place: CBD, Western Sydney, Equinix SY3, NextDC M1. */\n'
    '\tvar AU_FILL = /\\b(capital|territory|cbd|western|eastern|northern|southern|greater|metro(politan)?|within|inside|wide|nationwide|onshore|only|equinix|nextdc|airtrunk|cdc|global switch|macquarie|(sy|me|pe|br|ca|ad)\\d{1,2}|[smbpc]\\d)\\b/gi;\n'
    '\t/* An Australian postcode: four digits right after a state, a territory or "Australia" (AU02). */\n'
    '\tvar AU_PC = /\\b(nsw|vic|qld|sa|wa|tas|nt|act|new south wales|victoria|queensland|south australia|western australia|tasmania|northern territory|australian capital territory|australia)[,\\s]+\\d{4}(?!\\d)/i;')
rep('		var x = String(w).replace(AU_REGION_G, " ").replace(AU_AU_G, " ").replace(AU_CODE_G, "$1 ").replace(AU_AMB_G, "$1 ").replace(AU_NEUTRAL_G, " ");\n',
    '		var x = String(w).replace(AU_REGION_G, " ").replace(AU_AU_G, " ").replace(AU_CODE_G, "$1 ").replace(AU_AMB_G, "$1 ").replace(AU_NEUTRAL_G, " ").replace(AU_FILL, " ");\n')
# AU02: a number is a postcode only after a state, a territory or "Australia"
rep('		return !auLeft(w) || /(^|\\D)\\d{4}(\\D|$)/.test(w) ? "au" : "unknown";',
    '		return !auLeft(w) || AU_PC.test(w) ? "au" : "unknown";')
rep('Australian cloud regions and filler words is left, or an Australian place comes with a four-digit postcode; a',
    'Australian cloud regions and filler words is left, or a state, a territory or "Australia" comes with a four-digit postcode; a')

# AU03: own offices only for the organisation itself; helpers
rep('''	function auOwnOk(s, r) {
		var n = v(r, "recipient");
		return !!n && jpSame(n, v(s, "ctrlName")) && !arr(s, "recipients").some(function (x) { return jpSame(v(x, "who"), n) && !!v(x, "role"); });
	}''', '''	function auOwnOk(s, r) {
		var n = jpKey(v(r, "recipient")), c = jpKey(v(s, "ctrlName"));
		if (!n || !c) return false;
		var rest = n === c ? "" : n.indexOf(c + " ") === 0 ? n.slice(c.length) : null;
		if (rest === null || /\\S/.test(rest.replace(/\\b(our|own|the|in|at|and|branch|branches|office|offices|systems?|servers?|data|centres?|centers?|sites?|regional|local)\\b/g, " "))) return false;
		return !arr(s, "recipients").some(function (x) { return jpSame(v(x, "who"), v(r, "recipient")) && !!v(x, "role"); });
	}''')
rep('''	function auDiscRow(r) { var b = v(r, "basis"); return b !== "storage" && b !== "own"; }''',
    '''	function auDiscRow(s, r) { var b = v(r, "basis"); return b !== "storage" && !(b === "own" && auOwnOk(s, r)); }
	/* Overseas rows whose recipient is not in the recipients list (APP 1.4(c), 5.2(f)); valid own offices excluded. */
	function auUnlisted(s) {
		return auXrows(s).filter(function (r) { return !!v(r, "recipient") && !(v(r, "basis") === "own" && auOwnOk(s, r)) && !arr(s, "recipients").some(function (x) { return jpSame(v(x, "who"), v(r, "recipient")); }); });
	}
	function auStoreRec(s, x) { return auXrows(s).some(function (r) { return v(r, "basis") === "storage" && jpSame(v(x, "who"), v(r, "recipient")); }); }
	/* A small business operator with no exception: the APPs do not bind it (ss. 6C, 6D), so the policy is voluntary. */
	function auVol(s) { return v(s, "auSb") === "under" && v(s, "auSbWhy") === "none"; }
	/* "the" before the name of an Act, regulations, rules or a code. */
	function auThe(x) { x = jpTrim(x); return /^[A-Z]/.test(x) && !/^The /.test(x) && /\\b(Act|Regulations?|Rules?|Code|Ordinance)( \\d{4})?\\b/.test(x) ? "the " + x : x; }
	/* An email or postal address: the OAIC expects complaints in writing first (APP Guidelines 1.28). */
	function auWritable(c) { c = String(c || ""); return /@/.test(c) || /\\b(po box|gpo box|locked bag|street|st|road|rd|avenue|ave|level|suite|unit|write|post|letter|form)\\b/i.test(c); }
	/* Direct marketing purposes: the Singapore list plus common Australian wording (AU19). */
	function auMkt(a) { return sgMkt(a) || /\\b(telling you about|updates? (about|on)|news(letters?)?|new (products?|courses?|services?|offers?)|special offers?|promotions?|events)\\b/i.test(v(a, "purpose")); }''')

# AU10: permitted general situations are conditions, not standing facts
rep('''		"1": "we believe it is necessary to lessen or prevent a serious threat to life, health or safety, or to public health or safety, and getting consent is unreasonable or impracticable",
		"2": "we suspect unlawful activity or serious misconduct relating to our functions or activities, and believe it is necessary to take appropriate action",
		"3": "it is reasonably necessary to help locate a person reported as missing",''',
'''		"1": "we reasonably believe it is necessary to lessen or prevent a serious threat to life, health or safety, or to public health or safety, and getting consent is unreasonable or impracticable",
		"2": "we have reason to suspect unlawful activity or serious misconduct relating to our functions or activities, and reasonably believe it is necessary to take appropriate action",
		"3": "we reasonably believe it is reasonably necessary to help locate a person reported as missing, under the Commissioner's rules",''')
rep('''			x === "law" ? "because an Australian law or a court or tribunal order requires or authorises it: " + jpRef(v(a, "auSensLaw") || "[the law or order]", "APP 3.4(a)") :
			x === "pgs" ? "because a permitted general situation exists: " + (AU_PGS_T[v(a, "auSensPgs")] || "[the situation in section 16A]") + " (APP 3.4(b); Privacy Act, s. 16A)." :''',
'''			x === "law" ? "because an Australian law or a court or tribunal order requires or authorises it: " + jpRef(auThe(v(a, "auSensLaw") || "[the law or order]"), "APP 3.4(a)") :
			x === "pgs" ? "without your consent only where a permitted general situation exists, that is where " + (AU_PGS_T[v(a, "auSensPgs")] || "[the situation in section 16A]") + " (APP 3.4(b); Privacy Act, s. 16A)." :''')
# AU17(2): "the" before the name of an Act
rep('''jpDot(v(a, "auLawName") || "[the law, or the details of the order]")''', '''jpDot(auThe(v(a, "auLawName") || "[the law, or the details of the order]"))''')
# AU17(3): the consent row is a clause
rep('''			ba === "consent" ? "your consent, given after''', '''			ba === "consent" ? "we rely on your consent, given after''')
rep('''			ba === "law" ? "an Australian law, or a court or tribunal order, requires or authorises the disclosure: " + jpRef(v(r, "lawName") || "[the law or order]", "APP 8.2(c)") :
			ba === "pgs" ? "a permitted general situation exists: " + (["1", "2", "3"].indexOf(pg) !== -1 ? AU_PGS_T[pg] : "[the situation: item 1, 2 or 3 of section 16A]") + " (APP 8.2(d); Privacy Act, s. 16A)." :''',
'''			ba === "law" ? "an Australian law, or a court or tribunal order, requires or authorises the disclosure: " + jpRef(auThe(v(r, "lawName") || "[the law or order]"), "APP 8.2(c)") :
			ba === "pgs" ? "we disclose it only where a permitted general situation exists, that is where " + (["1", "2", "3"].indexOf(pg) !== -1 ? AU_PGS_T[pg] : "[the situation: item 1, 2 or 3 of section 16A]") + " (APP 8.2(d); Privacy Act, s. 16A)." :''')
rep('''			f === "law" ? "An Australian law or a court or tribunal order requires or authorises it: " + jpRef(v(s, "auFurtherLaw") || "[the law or order]", "APP 6.2(b)") :
			f === "pgs" ? "A permitted general situation exists: " + jpRef(krLc(v(s, "auFurtherLaw") || "[the situation in section 16A]"), "APP 6.2(c); Privacy Act, s. 16A") :''',
'''			f === "law" ? "An Australian law or a court or tribunal order requires or authorises it: " + jpRef(auThe(v(s, "auFurtherLaw") || "[the law or order]"), "APP 6.2(b)") :
			f === "pgs" ? "We will use or disclose it for that purpose without your consent only where a permitted general situation exists, that is where " + (AU_PGS_T[v(s, "auFurtherPgs")] || "[the situation in section 16A]") + " (APP 6.2(c); Privacy Act, s. 16A)." :''')
# AU17(5): anonymity keeps APP 2.2(a) whole
rep('", unless the law requires us to deal with identified people or it is impracticable (APP 2).")',
    '", unless an Australian law or a court or tribunal order requires or authorises us to deal with identified people, or it is impracticable (APP 2).")')
# AU08: a blank source is not "from you directly"
rep('''		b.push({ k: "p", x: how ? "How we collect it: " + jpDot(krLc(how)) :
			pnSourceIndirect(s) && !pnSourceDirect(s)''', '''		b.push({ k: "p", x: how ? "How we collect it: " + jpDot(krLc(how)) : !v(s, "source") ? "[Say whether you collect personal information from people directly, from others, or both (APP 1.4(b)).]" :
			pnSourceIndirect(s) && !pnSourceDirect(s)''')
# AU09: APP 1.7 and 1.8 are not in force before 10 December 2026
rep('''		return [{ k: "p", x: "We use computer programs, with personal information, to make decisions, or to do things substantially and directly related to making decisions, that could reasonably be expected to significantly affect people's rights or interests (APP 1.7, 1.8):" },''',
'''		var eff = v(s, "effective");
		return [{ k: "p", x: "We use computer programs, with personal information, to make decisions, or to do things substantially and directly related to making decisions, that could reasonably be expected to significantly affect people's rights or interests (" + (eff && eff >= "2026-12-10" ? "APP 1.7, 1.8" : "APP 1.7 and 1.8, from 10 December 2026") + "):" },''')
# AU01, AU06, AU07: usual disclosures
rep('''	function auShareBlocks(s) {
		var rec = arr(s, "recipients");
		if (!rec.length) return [yes(s, "auNoRecip") ? { k: "p", x: "We do not disclose personal information to other organisations or people, and no service provider handles it for us." } :
			{ k: "p", x: "[List the organisations and people you usually disclose personal information to, including service providers, or confirm in the Australia section that there are none.]" }];
		return [{ k: "p", x: "We usually disclose personal information to these organisations, or types of organisations, for the purposes shown:" },
			{ k: "ul", items: rec.map(function (r) { return { b: jpTrim(v(r, "who") || "[recipient]") + ":", x: stop(v(r, "why") || "[what for]") + (v(r, "where") ? " Located in " + jpDot(v(r, "where")) : "") }; }) }];
	}''',
'''	function auShareBlocks(s) {
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
	}''')
rep('''		var disc = rows.filter(auDiscRow), cs = [];
		disc.forEach(function (r) { var c = jpTrim(v(r, "country") || ""); if (c && auWhere(c) !== "au" && !cs.some(function (x) { return x.toLowerCase() === c.toLowerCase(); })) cs.push(c); });
		b.push({ k: "p", x: disc.length ? "We are likely to disclose personal information to recipients in " + (cs.length ? joinList(cs.map(country)) : "[the countries]") + ", as follows:" :
			"We are not likely to disclose personal information to recipients outside Australia. We hold it outside Australia as follows:" });
		b.push({ k: "ul", items: rows.map(function (r) { return { b: jpTrim(v(r, "recipient") || "[recipient]") + " (" + jpTrim(v(r, "country") || "[country]") + "):",
			x: auWhere(v(r, "country")) === "au" ? "[This row names Australia: list only recipients outside Australia.]" : auXbasis(s, r) }; }) });''',
'''		var disc = rows.filter(function (r) { return auDiscRow(s, r); }), held = rows.filter(function (r) { return !auDiscRow(s, r); }), cs = [];
		disc.forEach(function (r) { var c = jpTrim(v(r, "country") || ""); if (c && auWhere(c) !== "au" && !cs.some(function (x) { return x.toLowerCase() === c.toLowerCase(); })) cs.push(c); });
		var row = function (r) { return { b: jpTrim(v(r, "recipient") || "[recipient]") + " (" + jpTrim(v(r, "country") || "[country]") + "):",
			x: auWhere(v(r, "country")) === "au" ? "[This row names Australia: list only recipients outside Australia.]" : auXbasis(s, r) }; };
		if (disc.length) b.push({ k: "p", x: "We are likely to disclose personal information to recipients in " + (cs.length ? joinList(cs.map(country)) : "[the countries]") + ", as follows:" }, { k: "ul", items: disc.map(row) });
		else b.push({ k: "p", x: "We are not likely to disclose personal information to recipients outside Australia." });
		if (held.length) b.push({ k: "p", x: "We also hold personal information outside Australia without disclosing it:" }, { k: "ul", items: held.map(row) });''')
rep('if (auXrows(s).some(auDiscRow)) first.push(', 'if (auXrows(s).some(function (r) { return auDiscRow(s, r); })) first.push(')
# AU16: correction and refusal as the APPs say
rep('When we correct it, we tell other organisations we disclosed it to, if you ask, unless that is impracticable or unlawful.',
    'When we correct it, we tell other organisations bound by the Privacy Act that we disclosed it to, if you ask, unless that is impracticable or unlawful.')
rep('" If we refuse, we tell you why in writing, and how to complain (APP 12.9, 13.3).',
    '" If we refuse, we tell you in writing why, unless that would be unreasonable, and how to complain (APP 12.9, 13.3).')
# AU12: an agency never charges
rep('''		var fee = v(s, "auFee"), way = auReqWay(s);''', '''		var fee = yes(s, "publicBody") && v(s, "auFee") ? "No" : v(s, "auFee"), way = auReqWay(s);''')
# AU05, AU15, AU17(4): complaints
rep('''", complain to us first, in writing: " + (how ? jpDot(krLc(how)) : "[how to make a complaint].") +''',
    '''", complain to us first" + (!how || auWritable(how) ? ", in writing: " : ": ") + (how ? jpDot(krLc(how)) : "[how to make a complaint].") +''')
rep('''		b.push({ k: "p", x: (yes(s, "auEdr") ? "You can also complain" : "You can complain") + " to the Office of the Australian Information Commissioner (OAIC) if you are not satisfied with our response, or we do not respond within 30 days: www.oaic.gov.au, telephone 1300 363 992. The OAIC generally expects you to complain to us first (Privacy Act, s. 40(1A))." });''',
'''		if (!auVol(s)) b.push({ k: "p", x: (yes(s, "auEdr") ? "You can also complain" : "You can complain") + " to the Office of the Australian Information Commissioner (OAIC) if you are not satisfied with our response, or we do not respond within a reasonable time (usually 30 days): www.oaic.gov.au, telephone 1300 363 992. The OAIC generally expects you to complain to us first (Privacy Act, s. 40(1A))." });''')
# AU05, AU11: the opening of the section and of the policy
rep('''	function auPointer(s, n) {
		return "For our handling of personal information under Australia's Privacy Act 1988, section " + n + " also applies. Our privacy contact: " + auPoTitle(s) + ", " + jpDot(auContactLine(s));
	}''', '''	function auPointer(s, n) {
		return (auVol(s) ? "Section " + n + " sets out how we handle personal information under the Australian Privacy Principles, which we follow voluntarily." :
			"For our handling of personal information under Australia's Privacy Act 1988, section " + n + " also applies.") + " Our privacy contact: " + auPoTitle(s) + ", " + jpDot(auContactLine(s));
	}
	var AU_VOL = "We are a small business operator under the Privacy Act 1988 (ss. 6C, 6D), so the Australian Privacy Principles (APPs) do not bind us. We follow them voluntarily, as this policy describes.";
	var AU_EMP = "Our handling of employee records directly related to your current or former employment with us is exempt from the Australian Privacy Principles (Privacy Act, s. 7B(3)). This policy covers the other personal information we hold about you.";''')
rep('''		b.push({ k: "p", x: "The Privacy Act 1988 and the Australian Privacy Principles (APPs) apply to our handling of personal information, and this section is our privacy policy under them. The choices and rights in this section are those this law gives you." +''',
'''		b.push({ k: "p", x: (auVol(s) ? AU_VOL.replace("as this policy describes", "as this section describes") : "The Privacy Act 1988 and the Australian Privacy Principles (APPs) apply to our handling of personal information, and this section is our privacy policy under them. The choices and rights in this section are those this law gives you.") +
			(v(s, "audience") === "employee" ? " " + AU_EMP.replace("This policy covers", "This section covers") : "") +''')
rep('''		blocks.push({ k: "p", x: "This policy explains how " + ctrl + " manages personal information under the Privacy Act 1988 and the Australian Privacy Principles (APPs): what we collect and why, how we collect and hold it, who we disclose it to, and how you can access and correct it or make a complaint." });''',
'''		blocks.push({ k: "p", x: auVol(s) ? "This policy explains how " + ctrl + " manages personal information: what we collect and why, how we collect and hold it, who we disclose it to, and how you can access and correct it or make a complaint. " + AU_VOL :
			"This policy explains how " + ctrl + " manages personal information under the Privacy Act 1988 and the Australian Privacy Principles (APPs): what we collect and why, how we collect and hold it, who we disclose it to, and how you can access and correct it or make a complaint." });
		if (v(s, "audience") === "employee") blocks.push({ k: "p", x: AU_EMP });''')
# AU17(1): the In short sentence
rep('''		first.push({ k: "p", x: "You can ask to access and correct your personal information" + (cons ? ", and withdraw your consent" : "") + ", and complain to us and then to the OAIC. Section " + num.rights + " explains access and correction" +''',
'''		first.push({ k: "p", x: "You can ask to access and correct your personal information" + (cons ? " and withdraw your consent" : "") + ", and you can complain to us" + (auVol(s) ? "" : " and then to the OAIC") + ". Section " + num.rights + " explains access and correction" +''')

# ---- checks
# U02: AU05, AU12, AU13
rep('''		if (yes(s, "publicBody")) w2.push("This generator models organisations. Australian Government agencies have the same APP 1 duties but other rules too: access within 30 days and free of charge (APP 12.4, 12.7), the Information Publication Scheme and the Australian Government Agencies Privacy Code. Check them.");''',
'''		if (yes(s, "publicBody")) w2.push("This generator models organisations. Australian Government agencies have the same APP 1 duties but other rules too: access within 30 days and free of charge (APP 12.4, 12.7), the Information Publication Scheme and the Australian Government Agencies Privacy Code. Check them. A State or Territory authority is not an organisation under the Act (s. 6C(1)): its own State or Territory law applies.");''')
rep(''' or a registered choice to opt in (s. 6EA). A privacy policy is still good practice.");''',
    ''' or a registered choice to opt in (s. 6EA). The policy says that you follow the APPs voluntarily, and gives no complaint route to the OAIC; to be bound by them, opt in under s. 6EA.");''')
rep('''			else if (why === "trade") c2.push(''',
'''			else if (why === "cth") c2.push("As a small business operator that is a contracted service provider, your acts not done for the purposes of a Commonwealth contract are exempt (s. 7B(2)). The policy covers everything you do: narrow it, or keep it as a voluntary policy for the rest.");
			else if (why === "other6e") c2.push("Section 6E applies the Act to a protected action ballot agent only for the ballot (s. 6E(1B)), to a consumer data right accredited person only for personal information that is not CDR data (s. 6E(1D)), and to prescribed operators as the regulations say (s. 6E(1), (2); Privacy Regulations 2025, s. 7, for residential tenancy database operators); a registered or recognised association of employees is covered for all its activities (s. 6E(1C)). The policy covers everything you do: narrow it where the Act covers only part.");
			else if (why === "trade") c2.push(''')
# U03: AU04 (inferred and profiling placeholders)
rep('''		if (vp.length) w3.push(''', '''		if (led && yes(s, "inferred") && !v(s, "inferredWhat")) m3.push("Say what you infer about people, and from what: the policy prints a placeholder.");
		if (led && !yes(s, "adm") && yes(s, "profiling") && !v(s, "profilingWhat")) m3.push("Describe the analysis and what it is used for: the policy prints a placeholder.");
		if (vp.length) w3.push(''')
# U04: AU04 (sources), AU08 (blank source)
rep('''		if (pnSourceIndirect(s) && !arr(s, "sources").length) m4.push(''',
'''		if (!v(s, "source")) m4.push("Answer where the personal information comes from: from people directly, from others, or both (APP 1.4(b), 5.2(b)).");
		var srcBad = pnSourceIndirect(s) ? arr(s, "sources").filter(function (x) { return !v(x, "name") || !v(x, "what"); }) : [];
		if (srcBad.length) m4.push("Give the name or type of each source, and the personal information obtained from it (APP 5.2(b)): the policy prints a placeholder.");
		if (pnSourceIndirect(s) && !arr(s, "sources").length) m4.push(''')
# U05: AU14 (sensitive flags of other laws)
rep('''		var gd = acts.filter(function (a) { return (art9Of(s, a) || crimOf(s, a)) && !auSensOf(a); });''',
'''		var gd = acts.filter(function (a) {
			return (art9Of(s, a) || crimOf(s, a) || (inReg(s, "jp") && yes(a, "jpSens")) || (inReg(s, "kr") && yes(a, "krSens")) || (inReg(s, "cn") && yes(a, "cnSens")) ||
				(inReg(s, "can") && yes(a, "canSens")) || (inReg(s, "br") && !!v(a, "brSens"))) && !auSensOf(a); });''')
rep('''" marked as special category or criminal offence data, but not as sensitive information for Australia.''', '''" marked as sensitive under another law in this notice (special category, criminal offence, sensitive or special care-required data), but not as sensitive information for Australia.''')
# U09: AU01, AU07
rep('''		if (!rec.length && !yes(s, "auNoRecip")) m9.push(''', '''		var un = auUnlisted(s);
		if (un.length) m9.push((!rec.length && yes(s, "auNoRecip") ? "You confirmed that there are no recipients, but " + nm(un, "recipient") + (un.length > 1 ? " are" : " is") + " listed as overseas recipients. " : "") +
			"Add " + nm(un, "recipient") + " to the recipients, with what " + (un.length > 1 ? "they do" : "it does") + " with the information (APP 1.4(c), 5.2(f)).");
		if (!rec.length && !yes(s, "auNoRecip")) m9.push(''')
# U10: AU20 citation
rep('if (rows.some(auDiscRow)) c10.push("The policy lists the countries. Where listing them is impracticable, an appendix, a link or regions are allowed, and you need to be able to justify it (APP Guidelines 1.31 to 1.33).");',
    'if (rows.some(function (r) { return auDiscRow(s, r); })) c10.push("The policy lists the countries. Where listing them is impracticable, an appendix, a link or regions are allowed, and you need to be able to justify it (APP Guidelines 1.32, 1.33).");')
# U13: AU12, AU15
rep('''		var m13 = [];
		if (!auReqWay(s)) m13.push("Say where people send access and correction requests (APP 1.4(d)).");
		if (!v(s, "auFee")) m13.push("Say whether you charge for giving access (needed for the policy text; APP 12.8 limits the charge).");
		checks.push(m13.length ? chk("U13", "missing", m13.join(" ")) : chk("U13", "ok", "How to ask for access and correction; no charge for asking or for correcting; a reasonable period; written reasons on refusal (APP 12, 13)."));''',
'''		var m13 = [], w13 = [], days = parseInt(v(s, "auReqDays"), 10);
		if (!auReqWay(s)) m13.push("Say where people send access and correction requests (APP 1.4(d)).");
		if (!v(s, "auFee")) m13.push("Say whether you charge for giving access (needed for the policy text; APP 12.8 limits the charge).");
		if (yes(s, "publicBody") && yes(s, "auFee")) m13.push("Agencies cannot charge for access (APP 12.7): the policy says that there is no charge.");
		if (days > 30) w13.push("The OAIC treats a reasonable period as generally no more than 30 calendar days (APP Guidelines 12.67, 13.64): " + days + " days is longer.");
		checks.push(pick("U13", m13, w13, [], "How to ask for access and correction; no charge for asking or for correcting; a reasonable period; written reasons on refusal (APP 12, 13)."));''')
# U14: AU15, AU17(4)
rep('''		if (yes(s, "auCode") && !v(s, "auCodeName")) m14.push("Name the registered APP code.");
		checks.push(m14.length ? chk("U14", "missing", m14.join(" ")) : chk("U14", "ok", "Complaints first to you in writing, then " + (yes(s, "auEdr") ? "the external dispute resolution scheme and " : "") + "the OAIC (s. 40(1A); APP Guidelines 1.28)."));''',
'''		if (yes(s, "auCode") && !v(s, "auCodeName")) m14.push("Name the registered APP code.");
		var w14 = [], c14 = [], long14 = 0, re14 = /(\\d+)\\s*(calendar |business |working )?days|(\\d+)\\s*weeks/gi, mm;
		while ((mm = re14.exec(v(s, "auComplaintHow")))) { var dd = mm[1] ? parseInt(mm[1], 10) : parseInt(mm[3], 10) * 7; if (dd > long14) long14 = dd; }
		if (long14 > 30) w14.push("Your complaint process takes longer than 30 days: the OAIC expects a response within 30 days (APP Guidelines 1.28), and people can then go to the OAIC.");
		if (auComplaintWay(s) && !auWritable(auComplaintWay(s))) c14.push("The OAIC expects complaints to be made to you in writing first (APP Guidelines 1.28): give an email or postal address too.");
		if (auVol(s)) c14.push("As a small business operator not bound by the APPs, the policy gives no OAIC complaint route.");
		checks.push(pick("U14", m14, w14, c14, "Complaints first to you in writing, then " + (yes(s, "auEdr") ? "the external dispute resolution scheme and " : "") + "the OAIC (s. 40(1A); APP Guidelines 1.28)."));''')
# U15: AU19, AU20 (Interactive Gambling Act)
rep('''		var mk = acts.filter(function (a) { return sgMkt(a); });''', '''		var mk = acts.filter(auMkt);''')
rep('''			var sMk = acts.filter(function (a) { return sgMkt(a) && auSensOf(a) && auSensOf(a) !== "consent"; });''',
'''			if (!mk.length) w15.push("No purpose in the table covers direct marketing: add it to the purposes (APP 1.4(c)).");
			var sMk = acts.filter(function (a) { return auMkt(a) && auSensOf(a) && auSensOf(a) !== "consent"; });''')
rep('''Sensitive information only with consent (APP 7.4)."]));''', '''Sensitive information only with consent (APP 7.4). APP 7 does not apply to the extent the Spam Act 2003, the Do Not Call Register Act 2006 or the Interactive Gambling Act 2001 (Part 7B, Division 5) applies (APP 7.8)."]));''')
# U17: AU09, AU04 (shared ADM placeholder)
rep('''		if (!adm) checks.push(after ? chk("U17", "missing", "Answer whether computer programs make, or do things substantially and directly related to making, decisions that could significantly affect people's rights or interests using their personal information: from 10 December 2026 the policy must describe them (APP 1.7 to 1.9).") :
			chk("U17", "check", "Answer whether computer programs make, or do things substantially and directly related to making, decisions that could significantly affect people's rights or interests using their personal information. APP 1.7 to 1.9 apply from 10 December 2026, to decisions made after that date (POLA Act 2024, Sch 1, item 89)."));
		else if (adm === "No") checks.push(yes(s, "adm") ? chk("U17", "warn", ''',
'''		var admPh = led && yes(s, "adm") && !v(s, "admWhat") && adm !== "Yes" ? " Describe the automated decisions in your answers on automated decisions: the policy prints a placeholder." : "";
		if (!adm) checks.push(chk("U17", "missing", "Answer whether computer programs make, or do things substantially and directly related to making, decisions that could significantly affect people's rights or interests using their personal information. APP 1.7 to 1.9 apply from 10 December 2026, to decisions made after that date (POLA Act 2024, Sch 1, item 89), and the policy must then be up to date (APP 1.3)." + admPh));
		else if (adm === "No") checks.push(admPh ? chk("U17", "missing", admPh.slice(1)) : yes(s, "adm") ? chk("U17", "warn", ''')
# U20: the permitted general situation is a select
rep('''			if ((ff === "law" || ff === "pgs") && !v(s, "auFurtherLaw")) fm.push(ff === "law" ? "the law or order" : "the permitted general situation");''',
    '''			if (ff === "law" && !v(s, "auFurtherLaw")) fm.push("the law or order");
			if (ff === "pgs" && !v(s, "auFurtherPgs")) fm.push("the permitted general situation");''')
# U22: AU11
rep('''		if (au_ === "employee") checks.push(chk("U22", "check", "The employee records exemption covers acts and practices directly related to a current or former employment relationship and an employee record you hold (s. 7B(3)). It does not cover contractors, or personal information about staff outside that relationship and those records. A policy is still good practice."));''',
'''		if (au_ === "employee") checks.push(chk("U22", "warn", "The employee records exemption covers acts and practices directly related to a current or former employment relationship and an employee record you hold (s. 7B(3)): the APPs, access and correction and an OAIC complaint do not reach them. The policy says so, and that it covers the other personal information you hold about staff. The exemption does not cover contractors."));''')
# U23: AU11, AU20 (tax file numbers)
rep('''		checks.push(chk("U23", "check", "Not modelled: credit reporting (Part IIIA), notifiable data breaches (Part IIIC), unsolicited personal information (APP 4), government related identifiers such as tax file and Medicare numbers (APP 9), the statutory tort for serious invasions of privacy (Schedule 2), agencies, and State and Territory laws such as health records Acts."));''',
'''		var tfn = acts.some(function (a) { return /tax file number|\\bTFN\\b/i.test(v(a, "data") + " " + v(a, "purpose")); });
		checks.push(chk("U23", "check", (tfn ? "You collect tax file numbers: the Privacy (Tax File Number) Rule 2015, issued under s. 17, binds every file number recipient, small businesses included (s. 18). Check it. " : "") +
			"Not modelled: credit reporting (Part IIIA), notifiable data breaches (Part IIIC), unsolicited personal information (APP 4), government related identifiers such as Medicare numbers (APP 9), tax file numbers (the Privacy (Tax File Number) Rule 2015 under s. 17), the statutory tort for serious invasions of privacy (Schedule 2), agencies, and State and Territory laws such as health records Acts."));''')
# U27: AU20
rep('''APP 7 does not apply to the extent those Acts apply (APP 7.8)."));''', '''Gambling services have their own rules (Interactive Gambling Act 2001, Part 7B, Division 5). APP 7 does not apply to the extent those Acts apply (APP 7.8)."));''')
# auAdm hint: AU20
rep('(APP Guidelines 1.48 to 1.54)', '(APP Guidelines 1.49 to 1.54)')
assert all(ord(c) < 128 for c in t)
open(p, 'w').write(t)

# pn_block.js: the permitted general situation for the new purpose is a select (AU10)
q = B + 'pn_block.js'; u = open(q).read()
old = ('\t\t\t\t{ id: "auFurtherLaw", type: "text", label: function (s) { return v(s, "auFurther") === "pgs" ? "Australia: the permitted general situation" : "Australia: the law or order"; },\n'
       '\t\t\t\t  show: function (s) { return yes(s, "further") && auOn(s) && (v(s, "auFurther") === "law" || v(s, "auFurther") === "pgs"); } },\n')
assert u.count(old) == 1
u = u.replace(old, '\t\t\t\t{ id: "auFurtherLaw", type: "text", label: "Australia: the law or order", show: function (s) { return yes(s, "further") && auOn(s) && v(s, "auFurther") === "law"; } },\n'
    '\t\t\t\t{ id: "auFurtherPgs", type: "select", label: "Australia: the permitted general situation (s. 16A)", show: function (s) { return yes(s, "further") && auOn(s) && v(s, "auFurther") === "pgs"; },\n'
    '\t\t\t\t  opts: function () { return D.AU_PGS.map(function (x) { return { v: x.v, l: x.l }; }); } },\n')
assert all(ord(c) < 128 for c in u)
open(q, 'w').write(u)

# ng-data.js: AU_SB health (AU20)
d = B + '../pages/notice-generators/ng-data.js'; w = open(d).read()
old = '{ v: "health", l: "We provide a health service and hold health information (s. 6D(4)(b))" },'
assert w.count(old) == 1
w = w.replace(old, '{ v: "health", l: "We provide a health service and hold health information other than in employee records (s. 6D(4)(b))" },')
old = '("U27", "Spam Act and Do Not Call Register (delivery)", "APP 7.8; Spam Act 2003; Do Not Call Register Act 2006")'
w = w.replace('U27: { t: "Spam Act and Do Not Call Register (delivery)", s: "APP 7.8; Spam Act 2003; Do Not Call Register Act 2006" },',
              'U27: { t: "Spam Act and Do Not Call Register (delivery)", s: "APP 7.8; Spam Act 2003; Do Not Call Register Act 2006; Interactive Gambling Act 2001" },')
assert 'Interactive Gambling Act 2001" }' in w
w = w.replace('U10: { t: "Overseas recipients", s: "APP 1.4(f), (g), 5.2(i), (j), APP 8; Privacy Act s. 16C; APP Guidelines 1.30 to 1.33, ch. 8" },',
              'U10: { t: "Overseas recipients", s: "APP 1.4(f), (g), 5.2(i), (j), APP 8; Privacy Act s. 16C; APP Guidelines 1.30, 1.32, 1.33, ch. 8" },')
assert 'APP Guidelines 1.30, 1.32, 1.33, ch. 8' in w
assert all(ord(c) < 128 for c in w)
open(d, 'w').write(w)
print('review fixes applied')
