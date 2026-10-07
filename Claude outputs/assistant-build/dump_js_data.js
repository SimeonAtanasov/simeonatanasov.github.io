/* Evaluates the site's data scripts outside a browser and prints JSON.
   Usage: node dump_js_data.js <repo root> <out dir>
   Reads pages/gdpr-readiness/readiness-data.js and pages/ai-crosswalk/crosswalk-data.js. */
var fs = require("fs"), path = require("path");
var repo = process.argv[2], out = process.argv[3];
function read(p) { return fs.readFileSync(path.join(repo, p), "utf8"); }

var rd = read("pages/gdpr-readiness/readiness-data.js");
var readiness = new Function(rd + "\n;return {ARTICLE_TITLES:ARTICLE_TITLES, CONDITIONS:CONDITIONS, CATEGORIES:CATEGORIES, ACTIVITIES:ACTIVITIES, STATUS:STATUS};")();
fs.writeFileSync(path.join(out, "readiness.json"), JSON.stringify(readiness));

var cw = read("pages/ai-crosswalk/crosswalk-data.js");
var w = {};
new Function("window", cw)(w);
fs.writeFileSync(path.join(out, "crosswalk.json"), JSON.stringify(w.CW_DATA));
console.log("readiness activities:", readiness.ACTIVITIES.length, "crosswalk rows:", w.CW_DATA.rows.length);
