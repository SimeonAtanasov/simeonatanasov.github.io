/* Checks the live suggestions in node: node test_suggest.js [index.json] [questions.json] */
var fs = require("fs"), path = require("path");
var src = fs.readFileSync(path.join(__dirname, "assets/js/assistant.js"), "utf8");
var window = { addEventListener: function () {}, matchMedia: function () { return { matches: false }; } };
var document = { readyState: "loading", addEventListener: function () {} };
var performance = { now: function () { return Date.now(); } };
new Function("window", "document", "performance", "fetch", "location", "history", src)(window, document, performance, function () { return Promise.reject(new Error("no fetch")); }, { pathname: "/" }, {});
var sa = window.siteAssistant;
var base = path.join(__dirname, "..", "..", "assets", "assistant");
var index = JSON.parse(fs.readFileSync(process.argv[2] || path.join(base, "index.json"), "utf8"));
var qs = JSON.parse(fs.readFileSync(process.argv[3] || path.join(base, "questions.json"), "utf8"));
sa._build(index);
var t0 = Date.now(); sa._buildQuestions(qs); console.log("questions built ms:", Date.now() - t0);
var inputs = ["prov", "provider", "can i", "can i record", "dpia", "germ", "cookie consent in fr", "fine", "how is the dpia", "deepf", "what", "appeal spain", "xyzzy"];
inputs.forEach(function (q) {
  var t1 = Date.now(); var r = sa.suggest(q); var ms = Date.now() - t1;
  console.log("== '" + q + "' (" + ms + " ms)");
  r.forEach(function (x) { console.log("   " + x.t + "  [" + index.docs[x.d].id + "]"); });
});
