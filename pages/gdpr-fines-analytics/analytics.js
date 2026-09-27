/* GDPR Fines Analytics: build your own chart from the published fines.
   Pick a measure, group by one dimension, optionally split by a second, filter,
   then download the chart as a PNG or the aggregated table as CSV.

   Data comes from analytics-data.js (GFA_* globals). Chart drawing is Chart.js,
   self-hosted in this folder so the page makes no third-party request.

   Categorical colours are the dark steps of the validated reference palette,
   checked against the chart surface #1e2a4d: all hard gates pass, worst adjacent
   CVD delta E 8.4, normal vision 19.3. Slot 6 (green) is under 3:1 against the
   surface, so the data table is the required relief. A ninth series is never a
   new hue: it folds into Other, drawn in the neutral #5c6684. */
(function () {
    "use strict";

    if (typeof GFA_ROWS === "undefined" || typeof Chart === "undefined") return;
    var root = document.getElementById("gfa-app");
    if (!root) return;

    var SURFACE = "#1e2a4d";
    var SLOTS = ["#3987e5", "#d95926", "#199e70", "#c98500", "#d55181", "#008300", "#9085e9", "#e66767"];
    var OTHER = "#5c6684";
    var INK = "rgba(255, 255, 255, 0.88)";
    var INK_MUTED = "rgba(255, 255, 255, 0.62)";
    var GRID = "rgba(255, 255, 255, 0.09)";
    var MAX_SERIES = 7;          /* plus Other makes eight, the palette's size */
    var OTHER_KEY = "\u0000other";

    var ARTICLE_NAMES = {"5": "Principles relating to processing of personal data", "6": "Lawfulness of processing", "7": "Conditions for consent", "8": "Conditions applicable to a child's consent", "9": "Processing of special categories of personal data", "10": "Processing of personal data relating to criminal convictions and offences", "11": "Processing which does not require identification", "12": "Transparent information, communication and modalities", "13": "Information where data are collected from the data subject", "14": "Information where data have not been obtained from the data subject", "15": "Right of access", "16": "Right to rectification", "17": "Right to erasure", "18": "Right to restriction of processing", "19": "Notification obligation regarding rectification, erasure or restriction", "20": "Right to data portability", "21": "Right to object", "22": "Automated individual decision-making, including profiling", "24": "Responsibility of the controller", "25": "Data protection by design and by default", "26": "Joint controllers", "27": "Representatives of controllers not established in the Union", "28": "Processor", "29": "Processing under the authority of the controller or processor", "30": "Records of processing activities", "31": "Cooperation with the supervisory authority", "32": "Security of processing", "33": "Notification of a personal data breach to the supervisory authority", "34": "Communication of a personal data breach to the data subject", "35": "Data protection impact assessment", "36": "Prior consultation", "37": "Designation of the data protection officer", "38": "Position of the data protection officer", "39": "Tasks of the data protection officer", "44": "General principle for transfers", "46": "Transfers subject to appropriate safeguards", "58": "Powers", "83": "General conditions for imposing administrative fines", "88": "Processing in the context of employment"};

    var DIMS = {
        country:   {label: "Country"},
        sector:    {label: "Sector"},
        authority: {label: "Authority"},
        violation: {label: "Violation type"},
        article:   {label: "GDPR Article"},
        year:      {label: "Year"}
    };
    var METRICS = {
        count:  {label: "Count",    long: "Number of fines"},
        sum:    {label: "Total €",  long: "Total fines (EUR)"},
        avg:    {label: "Average €", long: "Average fine (EUR)"},
        median: {label: "Median €", long: "Median fine (EUR)"}
    };

    /* ------------------------------------------------------------ records --- */

    var recs = GFA_ROWS.map(function (r) {
        return {
            country: GFA_COUNTRIES[r[0]],
            authority: GFA_AUTHORITIES[r[1]],
            year: r[2],
            fine: r[3],
            sector: GFA_SECTORS[r[4]],
            violation: GFA_TYPES[r[5]],
            articles: r[6],
            controller: r[7],
            hay: (GFA_COUNTRIES[r[0]] + " " + GFA_AUTHORITIES[r[1]] + " " + r[7] + " " +
                  GFA_SECTORS[r[4]] + " " + GFA_TYPES[r[5]]).toLowerCase()
        };
    });

    function keysOf(rec, dim) {
        if (dim === "article") {
            return rec.articles.length ? rec.articles.map(function (a) { return "Art. " + a; }) : ["No GDPR Article cited"];
        }
        if (dim === "year") return [rec.year == null ? "Undated" : String(rec.year)];
        return [rec[dim]];
    }

    function artNum(k) { var m = /^Art\. (\d+)$/.exec(k); return m ? +m[1] : 999; }

    /* Global order per dimension, by number of cases. Series colours follow it so
       a filter that changes which series are shown does not repaint the others. */
    var GLOBAL_ORDER = {};
    Object.keys(DIMS).forEach(function (dim) {
        var c = {};
        recs.forEach(function (r) { keysOf(r, dim).forEach(function (k) { c[k] = (c[k] || 0) + 1; }); });
        GLOBAL_ORDER[dim] = {};
        Object.keys(c).sort(function (a, b) { return c[b] - c[a] || (a < b ? -1 : 1); })
            .forEach(function (k, i) { GLOBAL_ORDER[dim][k] = i; });
    });

    function uniq(dim) {
        return Object.keys(GLOBAL_ORDER[dim]);
    }

    /* -------------------------------------------------------------- state --- */

    var DEFAULTS = {m: "count", g: "country", s: "", c: "bar", n: "10", sc: "lin",
                    q: "", co: "", se: "", vt: "", yf: "", yt: ""};
    var state = {};
    function resetState() { Object.keys(DEFAULTS).forEach(function (k) { state[k] = DEFAULTS[k]; }); }
    resetState();

    function readHash() {
        var h = location.hash.replace(/^#/, "");
        if (!h || h.indexOf("=") < 0) return;
        h.split("&").forEach(function (p) {
            var kv = p.split("=");
            var k = decodeURIComponent(kv[0] || "");
            if (Object.prototype.hasOwnProperty.call(DEFAULTS, k)) state[k] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
        });
        if (!METRICS[state.m]) state.m = DEFAULTS.m;
        if (!DIMS[state.g]) state.g = DEFAULTS.g;
        if (state.s && !DIMS[state.s]) state.s = "";
        if (["10", "20", "50", "all"].indexOf(state.n) < 0) state.n = DEFAULTS.n;
    }
    function writeHash() {
        var parts = [];
        Object.keys(DEFAULTS).forEach(function (k) {
            if (state[k] !== DEFAULTS[k]) parts.push(k + "=" + encodeURIComponent(state[k]));
        });
        var h = parts.length ? "#" + parts.join("&") : "";
        if (history.replaceState) history.replaceState(null, "", location.pathname + location.search + h);
    }

    /* ---------------------------------------------------------- formatting --- */

    var nf = new Intl.NumberFormat("en-GB");
    function fmtN(v) { return nf.format(Math.round(v)); }
    function fmtEur(v) { return v == null || isNaN(v) ? "-" : "€" + nf.format(Math.round(v)); }
    function fmtEurShort(v) {
        if (v == null || isNaN(v)) return "-";
        var a = Math.abs(v);
        if (a >= 1e9) return "€" + trim(v / 1e9) + "bn";
        if (a >= 1e6) return "€" + trim(v / 1e6) + "m";
        if (a >= 1e3) return "€" + trim(v / 1e3) + "k";
        return "€" + nf.format(Math.round(v));
    }
    function trim(x) {
        var s = Math.abs(x) >= 100 ? x.toFixed(0) : Math.abs(x) >= 10 ? x.toFixed(1) : x.toFixed(2);
        return s.indexOf(".") < 0 ? s : s.replace(/\.?0+$/, "");
    }
    function fmtMeasure(v) { return state.m === "count" ? fmtN(v || 0) : fmtEur(v); }
    function fmtTick(v) { return state.m === "count" ? nf.format(v) : fmtEurShort(v); }

    function median(a) {
        if (!a.length) return null;
        var s = a.slice().sort(function (x, y) { return x - y; });
        var m = s.length >> 1;
        return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
    }

    /* A bucket collects the cases in one cell. Count covers every case; the money
       measures cover the cases that carry an amount, as the tracker's own do. */
    function Bucket() { this.count = 0; this.amounts = []; this.total = 0; }
    Bucket.prototype.add = function (r) {
        this.count++;
        if (r.fine != null) { this.amounts.push(r.fine); this.total += r.fine; }
    };
    Bucket.prototype.merge = function (b) {
        this.count += b.count; this.total += b.total;
        for (var i = 0; i < b.amounts.length; i++) this.amounts.push(b.amounts[i]);
    };
    Bucket.prototype.stat = function (m) {
        if (m === "count") return this.count;
        if (m === "sum") return this.total;
        if (!this.amounts.length) return null;
        if (m === "avg") return this.total / this.amounts.length;
        return median(this.amounts);
    };
    Bucket.prototype.summary = function () {
        return {count: this.count, total: this.total,
                avg: this.amounts.length ? this.total / this.amounts.length : null,
                median: median(this.amounts)};
    };

    /* ------------------------------------------------------------ filtering --- */

    function filtered() {
        var q = state.q.trim().toLowerCase();
        var yf = state.yf ? +state.yf : null, yt = state.yt ? +state.yt : null;
        return recs.filter(function (r) {
            if (state.co && r.country !== state.co) return false;
            if (state.se && r.sector !== state.se) return false;
            if (state.vt && r.violation !== state.vt) return false;
            if (yf != null && (r.year == null || r.year < yf)) return false;
            if (yt != null && (r.year == null || r.year > yt)) return false;
            if (q && r.hay.indexOf(q) < 0) return false;
            return true;
        });
    }

    /* ---------------------------------------------------------- aggregation --- */

    function isStackable() { return state.m === "count" || state.m === "sum"; }
    function isSplit() { return !!state.s; }

    function orderKeys(keys, stats, dim) {
        if (dim === "year") {
            return keys.sort(function (a, b) { return (a === "Undated") - (b === "Undated") || (+a) - (+b); });
        }
        return keys.sort(function (a, b) {
            var d = (stats[b] == null ? -1 : stats[b]) - (stats[a] == null ? -1 : stats[a]);
            return d || (dim === "article" ? artNum(a) - artNum(b) : (a < b ? -1 : 1));
        });
    }

    function limitFor(chartType) {
        var n = state.n === "all" ? Infinity : +state.n;
        if (chartType === "donut") n = Math.min(n, MAX_SERIES);
        return n;
    }

    function aggregate(rows) {
        var g = state.g, s = state.s;
        var groups = {}, cells = {}, series = {}, all = new Bucket();
        rows.forEach(function (r) {
            all.add(r);
            var gk = keysOf(r, g), sk = s ? keysOf(r, s) : null;
            gk.forEach(function (k) {
                (groups[k] = groups[k] || new Bucket()).add(r);
                if (sk) sk.forEach(function (j) {
                    var c = (cells[k] = cells[k] || {});
                    (c[j] = c[j] || new Bucket()).add(r);
                });
            });
            if (sk) sk.forEach(function (j) { (series[j] = series[j] || new Bucket()).add(r); });
        });

        var gStats = {};
        Object.keys(groups).forEach(function (k) { gStats[k] = groups[k].stat(state.m); });
        var ordered = orderKeys(Object.keys(groups), gStats, g);

        /* Years are a sequence, so they are never cut to a top N. */
        var limit = g === "year" ? Infinity : limitFor(state.c);
        var shown = ordered.slice(0, limit), rest = ordered.slice(limit);
        var groupList = shown.map(function (k) { return {key: k, label: k, b: groups[k]}; });
        if (rest.length) {
            var ob = new Bucket();
            /* A fine citing two Articles sits in two groups; pool it once. */
            if (g === "article") {
                var seen = new Set();
                rest.forEach(function (k) { rows.forEach(function (r) {
                    if (!seen.has(r) && keysOf(r, g).indexOf(k) >= 0) { seen.add(r); ob.add(r); }
                }); });
            } else rest.forEach(function (k) { ob.merge(groups[k]); });
            groupList.push({key: OTHER_KEY, label: "Other (" + rest.length + ")", b: ob, restKeys: rest});
        }

        var seriesList = [];
        if (s) {
            var sStats = {};
            Object.keys(series).forEach(function (k) { sStats[k] = series[k].stat(state.m); });
            var sOrdered = orderKeys(Object.keys(series), sStats, s);
            var sLimit = s === "year" ? Infinity : MAX_SERIES;
            if (s === "year" && sOrdered.length > MAX_SERIES + 1) {
                /* Keep the most recent years rather than the biggest. */
                var recent = sOrdered.filter(function (k) { return k !== "Undated"; }).slice(-MAX_SERIES);
                seriesList = recent.map(function (k) { return {key: k, label: k}; });
                var older = sOrdered.filter(function (k) { return recent.indexOf(k) < 0; });
                seriesList.unshift({key: OTHER_KEY, label: "Earlier (" + older.length + ")", restKeys: older});
            } else {
                seriesList = sOrdered.slice(0, sLimit).map(function (k) { return {key: k, label: k}; });
                var sRest = sOrdered.slice(sLimit);
                if (sRest.length) seriesList.push({key: OTHER_KEY, label: "Other (" + sRest.length + ")", restKeys: sRest});
            }
        }

        function cellBucket(grp, ser) {
            var gKeys = grp.restKeys || [grp.key];
            var sKeys = ser.restKeys || [ser.key];
            var b = new Bucket();
            if (grp.restKeys || ser.restKeys) {
                /* Pool from the rows so a multi-Article fine is not counted twice. */
                var seen = new Set();
                rows.forEach(function (r) {
                    if (seen.has(r)) return;
                    var gk = keysOf(r, state.g), sk = keysOf(r, state.s);
                    var gHit = gk.some(function (k) { return gKeys.indexOf(k) >= 0; });
                    var sHit = sk.some(function (k) { return sKeys.indexOf(k) >= 0; });
                    if (gHit && sHit) { seen.add(r); b.add(r); }
                });
                return b;
            }
            var c = cells[grp.key] && cells[grp.key][ser.key];
            return c || b;
        }

        return {rows: rows, all: all, groups: groupList, series: seriesList, cell: cellBucket, totalGroups: ordered.length};
    }

    /* ------------------------------------------------------------ colours --- */

    function colourFor(dim, key, idxInView, keysInView) {
        if (key === OTHER_KEY) return OTHER;
        /* Rank among the keys on screen by their global order, so colours stay put
           for as long as the same entities are shown. */
        var order = keysInView.filter(function (k) { return k !== OTHER_KEY; })
            .sort(function (a, b) { return (GLOBAL_ORDER[dim][a] || 0) - (GLOBAL_ORDER[dim][b] || 0); });
        if (dim === "year") order = keysInView.filter(function (k) { return k !== OTHER_KEY; });
        var i = order.indexOf(key);
        return SLOTS[(i < 0 ? idxInView : i) % SLOTS.length];
    }

    /* ------------------------------------------------------------ chart type --- */

    function chartOptions() {
        var opts = [];
        if (state.g === "year") opts.push({v: "line", l: "Line"});
        opts.push({v: "column", l: "Column"});
        opts.push({v: "bar", l: "Bar"});
        if (!isSplit() && isStackable()) opts.push({v: "donut", l: "Donut"});
        return opts;
    }

    function coerce() {
        if (state.s === state.g) state.s = "";
        var opts = chartOptions().map(function (o) { return o.v; });
        if (opts.indexOf(state.c) < 0) state.c = state.g === "year" ? "column" : "bar";
    }

    /* ------------------------------------------------------------ controls --- */

    function $(id) { return document.getElementById(id); }

    function fillSelect(el, items, first) {
        el.innerHTML = "";
        if (first) { var o = document.createElement("option"); o.value = ""; o.textContent = first; el.appendChild(o); }
        items.forEach(function (it) {
            var o = document.createElement("option");
            o.value = typeof it === "string" ? it : it.v;
            o.textContent = typeof it === "string" ? it : it.l;
            el.appendChild(o);
        });
    }

    function segmented(el, items, current, onPick) {
        el.innerHTML = "";
        items.forEach(function (it) {
            var b = document.createElement("button");
            b.type = "button";
            b.textContent = it.l;
            b.setAttribute("aria-pressed", String(it.v === current));
            if (it.disabled) { b.disabled = true; b.title = it.title || ""; }
            b.addEventListener("click", function () { onPick(it.v); });
            el.appendChild(b);
        });
    }

    var dimItems = Object.keys(DIMS).map(function (k) { return {v: k, l: DIMS[k].label}; });
    fillSelect($("gfa-group"), dimItems);
    fillSelect($("gfa-split"), dimItems, "None");
    fillSelect($("gfa-country"), uniq("country").sort(), "All countries");
    fillSelect($("gfa-sector"), uniq("sector").sort(), "All sectors");
    fillSelect($("gfa-type"), uniq("violation").sort(), "All violation types");
    var years = uniq("year").filter(function (y) { return y !== "Undated"; }).sort();
    fillSelect($("gfa-yfrom"), years, "Any");
    fillSelect($("gfa-yto"), years, "Any");

    function bindSelect(id, key) {
        $(id).addEventListener("change", function () { state[key] = this.value; update(); });
    }
    bindSelect("gfa-group", "g");
    bindSelect("gfa-split", "s");
    bindSelect("gfa-top", "n");
    bindSelect("gfa-country", "co");
    bindSelect("gfa-sector", "se");
    bindSelect("gfa-type", "vt");
    bindSelect("gfa-yfrom", "yf");
    bindSelect("gfa-yto", "yt");

    var qTimer;
    $("gfa-search").addEventListener("input", function () {
        var v = this.value;
        clearTimeout(qTimer);
        qTimer = setTimeout(function () { state.q = v; update(); }, 250);
    });

    $("gfa-filters-toggle").addEventListener("click", function () {
        var open = this.getAttribute("aria-expanded") !== "true";
        this.setAttribute("aria-expanded", String(open));
        $("gfa-filters").hidden = !open;
    });
    $("gfa-reset").addEventListener("click", function () {
        state.q = state.co = state.se = state.vt = state.yf = state.yt = "";
        update();
    });
    $("gfa-reset-all").addEventListener("click", function () { resetState(); update(); });
    $("gfa-table-toggle").addEventListener("click", function () {
        var open = this.getAttribute("aria-expanded") !== "true";
        this.setAttribute("aria-expanded", String(open));
        this.textContent = open ? "Hide data table" : "Show data table";
        $("gfa-table-wrap").hidden = !open;
    });

    function syncControls() {
        segmented($("gfa-metric"), Object.keys(METRICS).map(function (k) { return {v: k, l: METRICS[k].label}; }),
            state.m, function (v) { state.m = v; update(); });
        segmented($("gfa-charttype"), chartOptions(), state.c, function (v) { state.c = v; update(); });
        var logOk = state.m !== "count" && state.c !== "donut" && !(isSplit() && isStackable() && state.c !== "line");
        segmented($("gfa-scale"), [
            {v: "lin", l: "Linear"},
            {v: "log", l: "Log", disabled: !logOk,
             title: "A log scale is available for money measures on unstacked charts"}
        ], logOk ? state.sc : "lin", function (v) { state.sc = v; update(); });
        $("gfa-scale-wrap").hidden = state.m === "count" || state.c === "donut";
        $("gfa-top-wrap").hidden = state.g === "year";

        $("gfa-group").value = state.g;
        $("gfa-split").value = state.s;
        $("gfa-top").value = state.n;
        $("gfa-country").value = state.co;
        $("gfa-sector").value = state.se;
        $("gfa-type").value = state.vt;
        $("gfa-yfrom").value = state.yf;
        $("gfa-yto").value = state.yt;
        if ($("gfa-search").value !== state.q) $("gfa-search").value = state.q;

        var active = ["q", "co", "se", "vt", "yf", "yt"].filter(function (k) { return state[k]; }).length;
        $("gfa-filter-count").textContent = active ? " (" + active + ")" : "";
        if (active && $("gfa-filters").hidden) {
            $("gfa-filters").hidden = false;
            $("gfa-filters-toggle").setAttribute("aria-expanded", "true");
        }
    }

    /* ---------------------------------------------------------------- chart --- */

    Chart.defaults.color = INK_MUTED;
    Chart.defaults.borderColor = GRID;
    try { Chart.defaults.font.family = getComputedStyle(document.body).fontFamily; } catch (e) { /* keep default */ }
    Chart.defaults.font.size = 13;

    var chart = null, view = null, lastSpec = null;
    var canvas = $("gfa-canvas");

    function lowerLabel(dim) {
        var l = DIMS[dim].label;
        return /^[A-Z]{2}/.test(l) ? l : l.charAt(0).toLowerCase() + l.slice(1);
    }
    function titleText() {
        var t = METRICS[state.m].long + " by " + lowerLabel(state.g);
        if (state.s) t += ", split by " + lowerLabel(state.s);
        return t;
    }

    function filterText() {
        var f = [];
        if (state.co) f.push(state.co);
        if (state.se) f.push(state.se);
        if (state.vt) f.push(state.vt);
        if (state.yf || state.yt) f.push((state.yf || "2018") + " to " + (state.yt || "now"));
        if (state.q) f.push("search \"" + state.q + "\"");
        return f.length ? "Filtered to " + f.join(", ") : "All published fines";
    }

    function tooltipLabel(ctx, v, grp, ser) {
        var b = ser ? view.cell(grp, ser) : grp.b;
        var head = (ser ? ser.label + ": " : "") + fmtMeasure(v);
        var extra = state.m === "count" ? (b.total ? " (" + fmtEurShort(b.total) + " in total)" : "")
                                        : " (" + fmtN(b.count) + (b.count === 1 ? " fine)" : " fines)");
        return head + extra;
    }

    function build() {
        if (chart) { chart.destroy(); chart = null; }
        /* A line joins points in time, so the undated bucket stays off it (it is
           still in the table and the notes say how many there are). */
        var groups = state.c === "line" ? view.groups.filter(function (g) { return g.key !== "Undated"; }) : view.groups;
        var labels = groups.map(function (g) { return g.label; });
        var horizontal = state.c === "bar";
        var stacked = isSplit() && isStackable() && state.c !== "line";
        var type = state.c === "donut" ? "doughnut" : state.c === "line" ? "line" : "bar";
        var datasets;

        if (state.c === "donut") {
            var keys = groups.map(function (g) { return g.key; });
            datasets = [{
                data: groups.map(function (g) { return g.b.stat(state.m); }),
                backgroundColor: groups.map(function (g, i) { return colourFor(state.g, g.key, i, keys); }),
                borderColor: SURFACE, borderWidth: 2, hoverOffset: 6
            }];
        } else if (!isSplit()) {
            datasets = [{
                label: METRICS[state.m].long,
                data: groups.map(function (g) { var v = g.b.stat(state.m); return v; }),
                backgroundColor: groups.map(function (g) { return g.key === OTHER_KEY ? OTHER : SLOTS[0]; }),
                borderColor: type === "line" ? SLOTS[0] : SURFACE,
                borderWidth: type === "line" ? 2 : 0,
                borderRadius: type === "line" ? 0 : 4,
                pointRadius: 4, pointHoverRadius: 6, pointBackgroundColor: SLOTS[0], tension: 0,
                maxBarThickness: 44
            }];
        } else {
            var skeys = view.series.map(function (s) { return s.key; });
            datasets = view.series.map(function (ser, i) {
                var col = colourFor(state.s, ser.key, i, skeys);
                return {
                    label: ser.label,
                    _ser: ser,
                    data: groups.map(function (g) { var b = view.cell(g, ser); var v = b.stat(state.m); return state.m === "count" || state.m === "sum" ? (v || 0) : v; }),
                    backgroundColor: col,
                    borderColor: type === "line" ? col : SURFACE,
                    borderWidth: type === "line" ? 2 : (stacked ? 1 : 0),
                    borderRadius: type === "line" ? 0 : (stacked ? 0 : 3),
                    pointRadius: 3, pointHoverRadius: 6, tension: 0, spanGaps: true,
                    maxBarThickness: stacked ? 44 : 22
                };
            });
        }

        var logScale = state.sc === "log" && state.m !== "count" && state.c !== "donut" && !stacked;
        var valueAxis = {
            type: logScale ? "logarithmic" : "linear",
            beginAtZero: !logScale,
            stacked: stacked,
            grid: {color: GRID},
            border: {display: false},
            ticks: {color: INK_MUTED, callback: function (v) { return fmtTick(v); }, maxTicksLimit: 8}
        };
        var catAxis = {
            stacked: stacked,
            grid: {display: false},
            border: {color: "rgba(255,255,255,0.25)"},
            ticks: {color: INK, autoSkip: !horizontal, maxRotation: 50,
                    callback: function (v) { var s = this.getLabelForValue(v); return s.length > 34 ? s.slice(0, 32) + "…" : s; }}
        };

        /* Height follows the number of bars so labels never collide. */
        var h;
        if (state.c === "donut") h = 460;
        else if (horizontal) h = Math.max(320, groups.length * (isSplit() && !stacked ? Math.max(24, view.series.length * 9) : 26) + 110);
        else {
            var narrow = (root.clientWidth || 800) < 600;
            h = narrow ? (isSplit() ? 380 + view.series.length * 26 : 400) : 480;
        }
        $("gfa-chartbox").style.height = h + "px";

        lastSpec = {type: type, labels: labels, datasets: datasets};
        chart = new Chart(canvas, {
            type: type,
            data: {labels: labels.slice(), datasets: datasets.map(function (d) { return Object.assign({}, d, {data: d.data.slice()}); })},
            options: lastSpec.options = {
                responsive: true,
                maintainAspectRatio: false,
                animation: {duration: 250},
                indexAxis: horizontal ? "y" : "x",
                cutout: type === "doughnut" ? "58%" : undefined,
                interaction: type === "line" ? {mode: "index", intersect: false} : {mode: "nearest", intersect: true},
                scales: type === "doughnut" ? {} : (horizontal ? {x: valueAxis, y: catAxis} : {x: catAxis, y: valueAxis}),
                layout: {padding: {top: 6, right: 16, bottom: 4, left: 4}},
                plugins: {
                    legend: {
                        display: isSplit() || type === "doughnut",
                        position: type === "doughnut" ? "right" : "top",
                        align: "start",
                        labels: {color: INK, boxWidth: 12, boxHeight: 12, useBorderRadius: true, borderRadius: 2, padding: 14}
                    },
                    tooltip: {
                        backgroundColor: "rgba(12, 18, 38, 0.95)",
                        borderColor: "rgba(255,255,255,0.18)", borderWidth: 1,
                        titleColor: "#fff", bodyColor: INK, padding: 10, boxPadding: 4,
                        filter: function (item) { return item.raw != null && item.raw !== 0; },
                        callbacks: {
                            title: function (items) { var it = items[0]; var g = groups[it.dataIndex]; return g ? articleTitle(g.label) : ""; },
                            label: function (ctx) {
                                var g = groups[ctx.dataIndex];
                                var v = ctx.raw;
                                return tooltipLabel(ctx, v, g, ctx.dataset._ser || null);
                            },
                            footer: function (items) {
                                if (!stacked || items.length < 1) return "";
                                var g = groups[items[0].dataIndex];
                                return "All series: " + fmtMeasure(g.b.stat(state.m));
                            }
                        }
                    }
                }
            }
        });
        if (stacked) {
            chart.options.plugins.tooltip.mode = "index";
            chart.options.plugins.tooltip.intersect = false;
            chart.update("none");
        }
    }

    function articleTitle(label) {
        var m = /^Art\. (\d+)$/.exec(label);
        return m && ARTICLE_NAMES[m[1]] ? label + " GDPR: " + ARTICLE_NAMES[m[1]] : label;
    }

    /* ---------------------------------------------------------------- table --- */

    function el(tag, text, cls) {
        var e = document.createElement(tag);
        if (text != null) e.textContent = text;
        if (cls) e.className = cls;
        return e;
    }

    function tableData() {
        var dimL = DIMS[state.g].label;
        if (!isSplit()) {
            var head = [dimL, "Count", "Total (EUR)", "Average (EUR)", "Median (EUR)"];
            var body = view.groups.map(function (g) {
                var s = g.b.summary();
                return {cells: [g.label, s.count, s.total, s.avg, s.median], fmt: [null, fmtN, fmtEur, fmtEur, fmtEur]};
            });
            return {mode: "single", head: head, body: body};
        }
        var h2 = [dimL].concat(view.series.map(function (s) { return s.label; }), ["All"]);
        var rowsOut = view.groups.map(function (g) {
            var cells = [g.label];
            view.series.forEach(function (s) { cells.push(view.cell(g, s).stat(state.m)); });
            cells.push(g.b.stat(state.m));
            return {cells: cells};
        });
        return {mode: "pivot", head: h2, body: rowsOut};
    }

    function renderTable() {
        var td = tableData();
        var t = $("gfa-table");
        t.innerHTML = "";
        var thead = el("thead"), tr = el("tr");
        td.head.forEach(function (h, i) { tr.appendChild(el("th", h, i ? "gfa-num" : "")); });
        thead.appendChild(tr); t.appendChild(thead);
        var tb = el("tbody");
        td.body.forEach(function (r) {
            var row = el("tr");
            r.cells.forEach(function (c, i) {
                var f = i === 0 ? null : (r.fmt ? r.fmt[i] : fmtMeasure);
                var cell = el("td", i === 0 ? c : (c == null ? "-" : f(c)), i ? "gfa-num" : "");
                if (i === 0 && state.g === "article") cell.title = articleTitle(c);
                row.appendChild(cell);
            });
            tb.appendChild(row);
        });
        if (!td.body.length) { var e = el("tr"); var c = el("td", "No data to summarise."); c.colSpan = td.head.length; e.appendChild(c); tb.appendChild(e); }
        t.appendChild(tb);
        $("gfa-table-caption").textContent = titleText() + ". " + filterText() + ".";
    }

    /* --------------------------------------------------------------- notes --- */

    function renderNotes(rows) {
        var notes = [];
        if (state.g === "article" || state.s === "article") notes.push("A fine citing several GDPR Articles is counted once per Article, so the Article bars add up to more than the number of fines. Fines that cite only national law, mostly French cookie cases under the loi Informatique et Libertés, appear as “No GDPR Article cited”.");
        if (isSplit() && !isStackable() && state.c !== "line") notes.push("Averages and medians do not add up, so the series are shown side by side rather than stacked.");
        var undated = rows.filter(function (r) { return r.year == null; }).length;
        if ((state.g === "year" || state.s === "year") && undated) notes.push(undated + " fine" + (undated === 1 ? " has" : "s have") + " no published decision date" + (state.c === "line" ? ", so " + (undated === 1 ? "it is" : "they are") + " left off the line and listed as “Undated” in the data table." : " and appear as “Undated”."));
        if (state.yf || state.yt) notes.push("A year filter leaves out the fines with no published decision date.");
        if (state.m !== "count") {
            var noAmt = rows.filter(function (r) { return r.fine == null; }).length;
            if (noAmt) notes.push(fmtN(noAmt) + " of the matching decisions publish no amount. They count towards Count but not towards the money measures.");
        }
        if (state.c === "donut" && view.totalGroups > MAX_SERIES) notes.push("A donut shows at most seven slices plus Other, because more colours than that cannot be told apart.");
        if (isSplit() && view.series.some(function (s) { return s.key === OTHER_KEY; })) {
            notes.push(state.s === "year"
                ? "The split shows the seven most recent years; earlier and undated fines are pooled as Earlier."
                : "The split shows the seven largest values of " + lowerLabel(state.s) + "; the rest are pooled as Other.");
        }
        var box = $("gfa-notes");
        box.innerHTML = "";
        notes.forEach(function (n) { box.appendChild(el("p", n)); });
        box.hidden = !notes.length;
    }

    function renderKpis(rows) {
        var b = new Bucket();
        rows.forEach(function (r) { b.add(r); });
        var s = b.summary();
        $("gfa-kpi-count").textContent = fmtN(s.count);
        $("gfa-kpi-total").textContent = fmtEurShort(s.total);
        $("gfa-kpi-total").title = fmtEur(s.total);
        $("gfa-kpi-avg").textContent = fmtEurShort(s.avg);
        $("gfa-kpi-avg").title = fmtEur(s.avg);
        $("gfa-kpi-median").textContent = fmtEurShort(s.median);
        $("gfa-kpi-median").title = fmtEur(s.median);
    }

    /* -------------------------------------------------------------- update --- */

    function update() {
        coerce();
        syncControls();
        writeHash();
        var rows = filtered();
        view = aggregate(rows);
        var empty = !rows.length;
        $("gfa-empty").hidden = !empty;
        canvas.style.visibility = empty ? "hidden" : "visible";
        $("gfa-png").disabled = $("gfa-csv").disabled = empty;
        $("gfa-chart-title").textContent = titleText();
        $("gfa-chart-sub").textContent = filterText() + " · " + fmtN(rows.length) + " decision" + (rows.length === 1 ? "" : "s");
        renderKpis(rows);
        renderNotes(rows);
        renderTable();
        if (!empty) build(); else if (chart) { chart.destroy(); chart = null; }
    }

    /* ------------------------------------------------------------- exports --- */

    function stamp() {
        var d = new Date();
        return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    function fileBase() {
        return ("gdpr-fines-" + state.m + "-by-" + state.g + (state.s ? "-split-" + state.s : "") + "-" + stamp()).replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
    }
    function download(href, name) {
        var a = document.createElement("a");
        a.href = href; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
    }

    function csvCell(v) {
        if (v == null) return "";
        if (typeof v === "number") return String(Math.round(v * 100) / 100);
        var s = String(v);
        return /[",\n]/.test(s) ? "\"" + s.replace(/"/g, "\"\"") + "\"" : s;
    }

    $("gfa-csv").addEventListener("click", function () {
        var td = tableData();
        var lines = [td.head.map(csvCell).join(",")];
        td.body.forEach(function (r) { lines.push(r.cells.map(csvCell).join(",")); });
        lines.push("");
        lines.push(csvCell("# " + titleText() + ". " + filterText() + "."));
        lines.push(csvCell("# Source: public GDPR enforcement tracker, decisions to " + GFA_META.latestDecision + ". Built at simeonatanasov.com/gdpr-fines-analytics.html"));
        var blob = new Blob(["﻿" + lines.join("\r\n")], {type: "text/csv;charset=utf-8"});
        var url = URL.createObjectURL(blob);
        download(url, fileBase() + ".csv");
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    });

    $("gfa-png").addEventListener("click", function () {
        if (!chart || !lastSpec) return;
        /* Draw a second copy of the chart off screen at twice the resolution,
           whatever the display, so the PNG is sharp. */
        var cssW = canvas.clientWidth, cssH = canvas.clientHeight;
        var holder = document.createElement("div");
        holder.style.cssText = "position:fixed;left:-99999px;top:0;width:" + cssW + "px;height:" + cssH + "px";
        var src = document.createElement("canvas");
        holder.appendChild(src);
        document.body.appendChild(holder);
        var opts = Object.assign({}, lastSpec.options, {responsive: false, maintainAspectRatio: false, animation: false, devicePixelRatio: 2});
        opts.plugins = Object.assign({}, lastSpec.options.plugins, {tooltip: {enabled: false}});
        src.width = cssW; src.height = cssH;
        var off = new Chart(src, {type: lastSpec.type, options: opts, data: {
            labels: lastSpec.labels.slice(),
            datasets: lastSpec.datasets.map(function (d) { return Object.assign({}, d, {data: d.data.slice()}); })}});
        var w = src.width, hChart = src.height;
        var scale = w / cssW;
        var pad = 28 * scale, headH = pad + 60 * scale, footH = 40 * scale;
        var out = document.createElement("canvas");
        out.width = w + pad * 2;
        out.height = hChart + headH + footH + pad;
        var ctx = out.getContext("2d");
        ctx.fillStyle = SURFACE;
        ctx.fillRect(0, 0, out.width, out.height);
        var fam = Chart.defaults.font.family || "sans-serif";
        var ratio = scale;
        ctx.fillStyle = "#ffffff";
        ctx.font = "600 " + Math.round(20 * ratio) + "px " + fam;
        ctx.fillText(titleText(), pad, pad + 16 * ratio);
        ctx.fillStyle = INK_MUTED;
        ctx.font = Math.round(13 * ratio) + "px " + fam;
        ctx.fillText($("gfa-chart-sub").textContent, pad, pad + 42 * ratio);
        ctx.drawImage(src, pad, headH);
        ctx.fillStyle = INK_MUTED;
        ctx.font = Math.round(12 * ratio) + "px " + fam;
        ctx.fillText("Source: public GDPR enforcement tracker, decisions to " + GFA_META.latestDecision + ".", pad, headH + hChart + 22 * ratio);
        ctx.textAlign = "right";
        ctx.fillText("simeonatanasov.com", out.width - pad, headH + hChart + 22 * ratio);
        off.destroy();
        holder.remove();
        download(out.toDataURL("image/png"), fileBase() + ".png");
    });

    $("gfa-link").addEventListener("click", function () {
        var btn = this;
        var url = location.href;
        var done = function () { btn.textContent = "Link copied"; setTimeout(function () { btn.textContent = "Copy link"; }, 1800); };
        var fail = function () { btn.textContent = "Copy it from the address bar"; setTimeout(function () { btn.textContent = "Copy link"; }, 2500); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, fail);
        else fail();
    });

    window.addEventListener("hashchange", function () { resetState(); readHash(); update(); });

    /* --------------------------------------------------------------- start --- */

    $("gfa-meta").textContent = fmtN(GFA_META.cases) + " published decisions, " + fmtN(GFA_META.fined) +
        " with an amount, to " + new Date(GFA_META.latestDecision + "T00:00:00").toLocaleDateString("en-GB", {day: "numeric", month: "long", year: "numeric"});
    readHash();
    update();
})();
