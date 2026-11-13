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

