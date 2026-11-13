/* AUDIT-01, 13 November 2026: what SA-09 changed in the Ask panel's ranking.

   node sa_audit_check.js ASSISTANT_JS OLD_INDEX_JSON NEW_INDEX_JSON TESTS_JSON [v]

   ASSISTANT_JS    assets/js/assistant.js (the shipped ranker is used as it is)
   OLD_INDEX_JSON  the index before the change (for SA-09: index.json of the SA-09 baseline,
                   kept outside the repo)
   NEW_INDEX_JSON  assets/assistant/index.json
   TESTS_JSON      the 50 tests of eval_retrieval.py as [question, pattern, meta pattern] rows
                   (sa_audit_tests.json beside this file)
   v               also list the questions behind the counts

   Prints, for each index: the hits of the 50 tests in the top 3, 5 and 10; then, on 84
   enforcement questions (seven phrasings, twelve jurisdictions), how often a chunk of the
   notice generators comes first or in the top three and how often the first result differs
   from the old index; then, on 117 questions meant for the generators, how often the chunk
   of the law asked about comes first or in the top three. */
var fs = require("fs");
var A = process.argv;
if (A.length < 6) { console.log("usage: node sa_audit_check.js ASSISTANT_JS OLD_INDEX_JSON NEW_INDEX_JSON TESTS_JSON [v]"); process.exit(1); }
var src = fs.readFileSync(A[2], "utf8");
var window = { addEventListener: function () {}, matchMedia: function () { return { matches: false }; } };
var document = { readyState: "loading", addEventListener: function () {} };
var performance = { now: function () { return Date.now(); } };
new Function("window", "document", "performance", "fetch", "location", "history", src)(window, document, performance, function () { return Promise.reject(new Error("no fetch")); }, { pathname: "/" }, {});
var sa = window.siteAssistant;
function load(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
var T = load(A[5]).map(function (t) { return Array.isArray(t) ? t : [t.q, t.rx, t.meta]; });
var VERBOSE = A[6] === "v";
var LAWS = [
  ["eu", "the EU", "GDPR"], ["uk", "the UK", "UK GDPR"], ["ch", "Switzerland", "FADP"], ["br", "Brazil", "LGPD"],
  ["ca", "Canada", "PIPEDA"], ["in", "India", "DPDP Act"], ["cn", "China", "PIPL"], ["jp", "Japan", "APPI"],
  ["kr", "South Korea", "PIPA"], ["sg", "Singapore", "PDPA"], ["au", "Australia", "Privacy Act 1988"],
  ["za", "South Africa", "POPIA"], ["cal", "California", "CCPA"]
];
var ENF = ["who enforces privacy law in %", "who can fine for a privacy breach in %", "data protection authority in %",
  "how do I complain about a company in %", "appeal against a fine in %", "how big are privacy fines in %",
  "can I sue a company for a privacy breach in %"];
var GENQ = ["privacy notice for %", "privacy notice generator %", "what does a privacy notice need in %",
  "generate a privacy policy for %", "does the generator cover %"];
var GENL = ["# privacy notice", "privacy notice under #", "does the generator cover #", "# notice requirements"];
function isGen(id) { return /^ng-|^tool-cat-(pngen|ainotice|dppolicy|aipolicy)$|^faq-generators$/.test(id); }
function top(q, n) { return sa.search(q).results.slice(0, n).map(function (r) { return r.doc; }); }
function tests() {
  var h3 = 0, h5 = 0, h10 = 0, miss = [];
  T.forEach(function (t) {
    var rx = new RegExp(t[1]), rxi = new RegExp(t[1], "i"), mrx = t[2] ? new RegExp(t[2], "i") : null;
    var res = top(t[0], 10), hit = -1;
    for (var i = 0; i < res.length; i++) {
      var c = res[i], ok = rx.test(c.id) || rxi.test(c.t || "");
      if (ok && mrx && !mrx.test((c.m || "") + " " + (c.t || "") + " " + String(c.x || "").slice(0, 120))) ok = false;
      if (ok) { hit = i; break; }
    }
    if (hit >= 0) { h10++; if (hit < 5) h5++; if (hit < 3) h3++; }
    if (hit < 0 || hit >= 5) miss.push("      " + (hit < 0 ? "no hit in 10" : "hit at " + (hit + 1)) + ": " + t[0] + " -> " + res.slice(0, 3).map(function (d) { return d.id; }).join(", "));
  });
  return ["50 tests: " + h3 + ", " + h5 + " and " + h10 + " hits in the top 3, 5 and 10 (hit@5 " + (h5 / T.length).toFixed(2) + ", hit@10 " + (h10 / T.length).toFixed(2) + ")", miss];
}
function measure(name, ix, oldTop) {
  sa._build(ix);
  var t = tests();
  console.log("\n" + name + " (" + ix.docs.length + " chunks)\n   " + t[0]);
  if (VERBOSE) console.log(t[1].join("\n"));
  var C = LAWS.filter(function (l) { return l[0] !== "eu"; });
  var n = 0, first = 0, top3 = 0, changed = 0, lines = [], tops = {};
  ENF.forEach(function (p) { C.forEach(function (l) {
    var q = p.replace("%", l[1]), r = top(q, 3).map(function (d) { return d.id; });
    n++; tops[q] = r[0];
    if (isGen(r[0])) { first++; lines.push("      " + q + " -> " + r.join(", ")); }
    if (r.some(isGen)) top3++;
    if (oldTop && oldTop[q] !== r[0]) changed++;
  }); });
  console.log("   " + n + " enforcement questions: a generator chunk first in " + first + ", in the top three in " + top3 + (oldTop ? "; first result differs from the old index in " + changed : ""));
  if (VERBOSE) console.log(lines.join("\n"));
  var g = 0, gFirst = 0, gTop3 = 0, miss = [];
  LAWS.forEach(function (l) {
    var qs = GENQ.map(function (p) { return p.replace("%", l[1]); }).concat(GENL.map(function (p) { return p.replace("#", l[2]); }));
    qs.forEach(function (q) {
      var r = top(q, 3).map(function (d) { return d.id; }), want = "ng-law-" + l[0];
      g++; if (r[0] === want) gFirst++;
      if (r.indexOf(want) >= 0) gTop3++; else miss.push("      " + q + " -> " + r.join(", "));
    });
  });
  console.log("   " + g + " generator questions: the chunk of the law asked about first in " + gFirst + ", in the top three in " + gTop3);
  if (VERBOSE) console.log(miss.join("\n"));
  return tops;
}
var oldTop = measure("Old index", load(A[3]), null);
measure("New index", load(A[4]), oldTop);
