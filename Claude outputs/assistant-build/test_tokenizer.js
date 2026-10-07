/* Parity check: the JS tokenizer against the Python one, and the JS ranker
   against the evaluation questions. Usage: node test_tokenizer.js [index.json]
   (default: the repo's assets/assistant/index.json, two levels up). Run
   eval_bm25.py first; it writes work/words.json and work/tests.json. */
var fs = require("fs"), path = require("path");
var src = fs.readFileSync(path.join(__dirname, "assets/js/assistant.js"), "utf8");
var window = { addEventListener: function () {}, matchMedia: function () { return { matches: false }; } };
var document = { readyState: "loading", addEventListener: function () {} };
var performance = { now: function () { return Date.now(); } };
var fetch = function () { return Promise.reject(new Error("no fetch")); };
new Function("window", "document", "performance", "fetch", "location", "history", src)(window, document, performance, fetch, {pathname: "/"}, {});
var sa = window.siteAssistant;
var index = JSON.parse(fs.readFileSync(process.argv[2] || path.join(__dirname, "..", "..", "assets", "assistant", "index.json"), "utf8"));
var words = JSON.parse(fs.readFileSync(path.join(__dirname, "work/words.json"), "utf8"));
var out = {};
words.forEach(function (w) { out[w] = sa.tokenize(w); });
fs.writeFileSync(path.join(__dirname, "work/js_tokens.json"), JSON.stringify(out));
var t0 = Date.now();
sa._build(index);
console.log("index build ms:", Date.now() - t0, "docs:", index.docs.length);
// expose for the ranking check
var tests = JSON.parse(fs.readFileSync(path.join(__dirname, "work/tests.json"), "utf8"));
var hits5 = 0, hits10 = 0, mrr = 0;
tests.forEach(function (t) {
  var r = sa.search(t.q).results.slice(0, 10);
  var rank = -1;
  for (var i = 0; i < r.length; i++) {
    var d = r[i].doc;
    var ok = new RegExp(t.rx).test(d.id) || new RegExp(t.rx, "i").test(d.t);
    if (ok && t.meta && !new RegExp(t.meta, "i").test(d.m + " " + d.t + " " + d.x.slice(0, 120))) ok = false;
    if (ok) { rank = i; break; }
  }
  if (rank >= 0) { mrr += 1 / (rank + 1); hits10++; if (rank < 5) hits5++; }
  else console.log("  miss:", t.q, "->", r.slice(0, 3).map(function (x) { return x.doc.id; }).join(", "));
});
console.log("js ranker: hit@5 " + (hits5 / tests.length).toFixed(2) + " hit@10 " + (hits10 / tests.length).toFixed(2) + " MRR " + (mrr / tests.length).toFixed(2));
var t1 = Date.now(); for (var i = 0; i < 20; i++) sa.search("cookie consent rules in germany"); console.log("search ms (avg of 20):", (Date.now() - t1) / 20);
