/* GDPR Readiness Assessment - application logic.
 * Depends on readiness-data.js for ARTICLE_TITLES, CONDITIONS, CATEGORIES,
 * ACTIVITIES and STATUS. Everything runs in the browser; nothing is sent
 * anywhere, and saved answers live only in this browser's localStorage.
 */
document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "gdprReadiness";

  // scope[conditionId] = true | false | undefined (unanswered)
  const state = { scope: {}, status: {}, view: "category" };

  const scopeEl    = document.getElementById("scope-questions");
  const listEl     = document.getElementById("activity-list");
  const summaryEl  = document.getElementById("ra-summary");
  const viewEl     = document.getElementById("ra-view");

  const byId = id => ACTIVITIES.find(a => a.id === id);
  const statusOf = id => state.status[id] || "none";

  /* An activity is in scope unless it is gated on a condition the user
   * answered "no" to. An unanswered condition leaves the activity in scope, so
   * the assessment is never silently narrowed by a question nobody answered. */
  function inScope(a) {
    if (!a.cond) return true;
    return state.scope[a.cond] !== false;
  }

  function scoreOf(id) {
    const s = STATUS.find(x => x.key === statusOf(id));
    return s ? s.score : 0;
  }

  // ---------------------------------------------------------------- scope ---
  function renderScope() {
    scopeEl.innerHTML = "";
    CONDITIONS.forEach(c => {
      const row = document.createElement("div");
      row.className = "ra-scope-row";

      const q = document.createElement("span");
      q.className = "ra-scope-q";
      q.textContent = c.text;

      const group = document.createElement("span");
      group.className = "ra-scope-answers";
      [["yes", "Yes"], ["no", "No"]].forEach(([val, label]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "ra-toggle";
        b.textContent = label;
        const current = state.scope[c.id];
        if ((val === "yes" && current === true) || (val === "no" && current === false)) {
          b.classList.add("is-on");
        }
        b.addEventListener("click", () => {
          const isYes = val === "yes";
          // clicking the active answer clears it back to unanswered
          state.scope[c.id] = (state.scope[c.id] === isYes) ? undefined : isYes;
          renderScope();
          rerenderActivities();
          renderResults();
        });
        group.appendChild(b);
      });

      /* Spell out what the number is for. On its own, "2 activities" reads as
       * a label with no verb and tells the reader nothing. */
      const gated = ACTIVITIES.filter(a => a.cond === c.id).length;
      const note = document.createElement("span");
      note.className = "ra-scope-note";
      note.textContent = '"No" removes ' + gated + (gated === 1 ? " activity" : " activities");
      note.title = gated === 1
        ? "One activity depends on this answer."
        : gated + " activities depend on this answer.";

      row.append(q, group, note);
      scopeEl.appendChild(row);
    });
  }

  /* Status legend, built from STATUS so it can never drift from the buttons
   * actually offered. The meanings used to live only in title tooltips, which
   * do not exist on a touch device and are easy to miss on a desktop. */
  function renderStatusLegend() {
    const host = document.getElementById("status-legend");
    if (!host) return;
    host.className = "ra-legend";
    host.innerHTML = "<h3>What the four statuses mean</h3>";

    const list = document.createElement("dl");
    list.className = "ra-legend-list";
    STATUS.forEach(s => {
      const dt = document.createElement("dt");
      const chip = document.createElement("span");
      chip.className = "ra-status-btn ra-s-" + s.key + " is-on";
      chip.textContent = s.label;
      dt.appendChild(chip);

      const dd = document.createElement("dd");
      dd.textContent = s.guide || s.hint;

      const weight = document.createElement("span");
      weight.className = "ra-legend-weight";
      weight.textContent = s.score === null ? "excluded from the score"
        : "counts as " + (s.score * 100) + "%";
      dd.appendChild(weight);

      list.append(dt, dd);
    });
    host.appendChild(list);
  }

  // ----------------------------------------------------------- activities ---
  function renderActivities() {
    listEl.innerHTML = "";

    CATEGORIES.forEach((catName, catIndex) => {
      const items = ACTIVITIES.filter(a => a.cat === catIndex);
      const live = items.filter(inScope);

      const section = document.createElement("section");
      section.className = "ra-cat";

      const head = document.createElement("button");
      head.type = "button";
      head.className = "ra-cat-head";
      head.setAttribute("aria-expanded", "false");

      /* "Answered" means the reader actually chose something. It cannot mean
       * "not Not in place", because "none" is also the default, so a category
       * deliberately marked Not in place throughout would have read 0 / 6. */
      const answered = () => live.filter(x => state.status[x.id] !== undefined).length;

      head.innerHTML =
        '<span class="ra-cat-name">' + catName + '</span>' +
        '<span class="ra-cat-meta">' + answered() + " / " + live.length + " answered</span>" +
        '<span class="ra-chevron" aria-hidden="true">+</span>';

      const metaEl = head.querySelector(".ra-cat-meta");

      const body = document.createElement("div");
      body.className = "ra-cat-body";
      body.hidden = true;

      head.addEventListener("click", () => {
        body.hidden = !body.hidden;
        head.setAttribute("aria-expanded", String(!body.hidden));
        head.querySelector(".ra-chevron").textContent = body.hidden ? "+" : "−";
      });

      items.forEach(a => {
        const card = document.createElement("article");
        card.className = "ra-activity" + (inScope(a) ? "" : " is-out");

        const arts = a.articles.map(n => "Art " + n).join(", ");
        let html =
          '<div class="ra-act-head">' +
            '<span class="ra-act-title">' + a.activity + "</span>" +
            '<span class="ra-arts" title="GDPR Articles this activity helps evidence">' + arts + "</span>" +
          "</div>";

        if (!inScope(a)) {
          html += '<p class="ra-outnote">Out of scope based on your answers above, and excluded from scoring.</p>';
        } else {
          html += '<div class="ra-questions">';
          if (a.po) html += '<p><span class="ra-qlabel">Privacy Office</span>' + a.po + "</p>";
          if (a.ou) html += '<p><span class="ra-qlabel ra-qlabel-ou">Operational Unit</span>' + a.ou + "</p>";
          html += "</div>";
        }
        card.innerHTML = html;

        if (inScope(a)) {
          const opts = document.createElement("div");
          opts.className = "ra-status";
          STATUS.forEach(s => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "ra-status-btn ra-s-" + s.key;
            b.textContent = s.label;
            b.title = s.hint;
            /* Highlight only a status the reader actually chose. statusOf()
             * falls back to "none" for scoring, but showing Not in place as
             * already selected on every untouched activity would contradict
             * the "0 / 6 answered" counter and hide what is still to do.
             * An unanswered activity still scores zero either way. */
            if (state.status[a.id] === s.key) b.classList.add("is-on");
            /* Update this one activity in place rather than rebuilding the
             * whole list. The rebuild collapsed every open category, which
             * changed the height of the page underneath the pointer and threw
             * the reader somewhere else entirely. Nothing above or below this
             * activity needs to change, so nothing above or below it moves. */
            b.addEventListener("click", () => {
              state.status[a.id] = s.key;
              opts.querySelectorAll(".ra-status-btn").forEach(other => {
                other.classList.toggle("is-on", other === b);
              });
              metaEl.textContent = answered() + " / " + live.length + " answered";
              renderResults();
            });
            opts.appendChild(b);
          });
          card.appendChild(opts);
        }

        body.appendChild(card);
      });

      section.append(head, body);
      listEl.appendChild(section);
    });
  }

  /* A full rebuild is still needed when the set of in-scope activities changes,
   * or when every status is overwritten at once. Do it without losing the
   * reader's place: remember which categories were open and where the page was
   * scrolled to, then put both back. */
  function rerenderActivities() {
    const wasOpen = [];
    listEl.querySelectorAll(".ra-cat").forEach((c, i) => {
      if (!c.querySelector(".ra-cat-body").hidden) wasOpen.push(i);
    });
    const y = window.scrollY;

    renderActivities();

    const cats = listEl.querySelectorAll(".ra-cat");
    wasOpen.forEach(i => {
      const c = cats[i];
      if (!c) return;
      c.querySelector(".ra-cat-body").hidden = false;
      c.querySelector(".ra-cat-head").setAttribute("aria-expanded", "true");
      c.querySelector(".ra-chevron").textContent = "−";
    });

    window.scrollTo(0, y);
  }

  // -------------------------------------------------------------- scoring ---
  function computeScores() {
    const live = ACTIVITIES.filter(inScope).filter(a => statusOf(a.id) !== "na");

    const overall = live.length
      ? live.reduce((sum, a) => sum + scoreOf(a.id), 0) / live.length
      : 0;

    const byCategory = CATEGORIES.map((name, i) => {
      const items = live.filter(a => a.cat === i);
      return {
        name,
        count: items.length,
        score: items.length ? items.reduce((s, a) => s + scoreOf(a.id), 0) / items.length : null
      };
    });

    // An Article's score is the mean of the activities that evidence it.
    const articleMap = {};
    live.forEach(a => {
      a.articles.forEach(n => {
        (articleMap[n] = articleMap[n] || []).push(a);
      });
    });
    const byArticle = Object.keys(articleMap)
      .map(Number)
      .sort((x, y) => x - y)
      .map(n => {
        const items = articleMap[n];
        return {
          article: n,
          title: ARTICLE_TITLES[n] || "",
          activities: items,
          score: items.reduce((s, a) => s + scoreOf(a.id), 0) / items.length
        };
      });

    const gaps = live
      .filter(a => statusOf(a.id) !== "implemented")
      .sort((a, b) => (scoreOf(a.id) - scoreOf(b.id)) || (b.articles.length - a.articles.length));

    return { overall, byCategory, byArticle, gaps, liveCount: live.length };
  }

  function band(score) {
    if (score === null) return "none";
    if (score >= 0.85) return "good";
    if (score >= 0.5) return "fair";
    if (score > 0) return "weak";
    return "bad";
  }

  function pct(score) { return Math.round(score * 100) + "%"; }

  function bar(score) {
    const v = score === null ? 0 : score;
    return '<span class="ra-bar"><span class="ra-bar-fill ra-band-' + band(score) +
           '" style="width:' + (v * 100) + '%"></span></span>';
  }

  function renderResults() {
    const r = computeScores();

    const answered = ACTIVITIES.filter(inScope)
      .filter(a => state.status[a.id] && state.status[a.id] !== "none").length;

    summaryEl.innerHTML =
      '<div class="ra-score ra-band-' + band(r.overall) + '">' +
        '<span class="ra-score-num">' + pct(r.overall) + "</span>" +
        '<span class="ra-score-label">Overall readiness</span>' +
      "</div>" +
      '<div class="ra-score-detail">' +
        "<p><strong>" + r.liveCount + "</strong> activities in scope, <strong>" + answered +
        "</strong> with a status recorded.</p>" +
        "<p><strong>" + r.byArticle.filter(a => a.score >= 0.999).length + "</strong> of <strong>" +
        r.byArticle.length + "</strong> mapped Articles fully evidenced.</p>" +
        "<p><strong>" + r.gaps.length + "</strong> activities still to complete.</p>" +
      "</div>";

    if (state.view === "category") {
      viewEl.innerHTML = '<table class="ra-table"><thead><tr><th>Management category</th>' +
        "<th>Activities</th><th>Readiness</th><th></th></tr></thead><tbody>" +
        r.byCategory.map(c =>
          "<tr><td>" + c.name + "</td><td class='ra-num'>" + c.count + "</td>" +
          "<td class='ra-num'>" + (c.score === null ? "n/a" : pct(c.score)) + "</td>" +
          "<td class='ra-barcell'>" + bar(c.score) + "</td></tr>"
        ).join("") + "</tbody></table>";
    }

    if (state.view === "article") {
      viewEl.innerHTML = '<table class="ra-table"><thead><tr><th>Article</th><th>Title</th>' +
        "<th>Evidenced by</th><th>Status</th><th></th></tr></thead><tbody>" +
        r.byArticle.map(a =>
          "<tr><td class='ra-num'>" + a.article + "</td><td>" + a.title + "</td>" +
          "<td class='ra-num'>" + a.activities.length + "</td>" +
          "<td class='ra-num'>" + pct(a.score) + "</td>" +
          "<td class='ra-barcell'>" + bar(a.score) + "</td></tr>"
        ).join("") + "</tbody></table>";
    }

    if (state.view === "gaps") {
      viewEl.innerHTML = r.gaps.length === 0
        ? '<p class="ra-empty">No gaps: every activity in scope is marked implemented.</p>'
        : '<table class="ra-table"><thead><tr><th>Activity</th><th>Category</th>' +
          "<th>Would evidence</th><th>Status</th></tr></thead><tbody>" +
          r.gaps.map(a =>
            "<tr><td>" + a.activity + "</td>" +
            "<td>" + CATEGORIES[a.cat] + "</td>" +
            "<td>" + a.articles.map(n => "Art " + n).join(", ") + "</td>" +
            "<td>" + (STATUS.find(s => s.key === statusOf(a.id)) || {}).label + "</td></tr>"
          ).join("") + "</tbody></table>";
    }
  }

  // ----------------------------------------------------------------- tabs ---
  document.querySelectorAll(".ra-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".ra-tab").forEach(t => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      state.view = tab.dataset.view;
      renderResults();
    });
  });

  // -------------------------------------------------------------- controls ---
  document.getElementById("ra-expand").addEventListener("click", () => {
    listEl.querySelectorAll(".ra-cat").forEach(c => {
      c.querySelector(".ra-cat-body").hidden = false;
      c.querySelector(".ra-cat-head").setAttribute("aria-expanded", "true");
      c.querySelector(".ra-chevron").textContent = "−";
    });
  });

  document.getElementById("ra-collapse").addEventListener("click", () => {
    listEl.querySelectorAll(".ra-cat").forEach(c => {
      c.querySelector(".ra-cat-body").hidden = true;
      c.querySelector(".ra-cat-head").setAttribute("aria-expanded", "false");
      c.querySelector(".ra-chevron").textContent = "+";
    });
  });

  document.getElementById("ra-fill-implemented").addEventListener("click", () => {
    if (!confirm("Mark every in-scope activity as implemented? This overwrites the statuses you have set.")) return;
    ACTIVITIES.filter(inScope).forEach(a => { state.status[a.id] = "implemented"; });
    rerenderActivities();
    renderResults();
  });

  document.getElementById("ra-reset-status").addEventListener("click", () => {
    if (!confirm("Reset every status back to Not in place?")) return;
    state.status = {};
    rerenderActivities();
    renderResults();
  });

  document.getElementById("ra-save").addEventListener("click", () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ scope: state.scope, status: state.status }));
      alert("Assessment saved in this browser.");
    } catch (e) {
      alert("Could not save. Your browser may be blocking storage for this page.");
    }
  });

  document.getElementById("ra-load").addEventListener("click", () => {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) { /* fall through to the not-found message */ }
    if (!saved) { alert("No saved assessment found in this browser."); return; }
    state.scope = saved.scope || {};
    state.status = saved.status || {};
    renderScope();
    rerenderActivities();
    renderResults();
    alert("Assessment loaded.");
  });

  /* Clear resets the working assessment but deliberately leaves any saved copy
   * alone, so Load still restores it. That matches the Risk Matrix on this site
   * and keeps Save/Load useful. "Forget saved copy" is the destructive one. */
  document.getElementById("ra-clear").addEventListener("click", () => {
    if (!confirm("Clear the assessment on screen? Any saved copy is kept, so you can still press Load.")) return;
    state.scope = {};
    state.status = {};
    renderScope();
    rerenderActivities();
    renderResults();
  });

  document.getElementById("ra-forget").addEventListener("click", () => {
    if (!confirm("Permanently remove the saved assessment from this browser? This cannot be undone.")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      alert("Saved assessment removed from this browser.");
    } catch (e) {
      alert("Could not remove the saved copy. Your browser may be blocking storage for this page.");
    }
  });

  // --------------------------------------------------------------- export ---
  document.getElementById("ra-export").addEventListener("click", () => {
    if (typeof XLSX === "undefined") {
      alert("The spreadsheet library didn't load, so the export can't run. Check your connection and reload the page.");
      return;
    }
    const r = computeScores();
    const wb = XLSX.utils.book_new();

    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "FF4276A6" } },
      alignment: { horizontal: "center", vertical: "center" }
    };
    const BAND_FILL = { good: "FFB6D7A8", fair: "FFFFE599", weak: "FFF6B26B", bad: "FFE06666", none: "FFD9D9D9" };

    const styleHeader = (ws, n) => {
      for (let c = 0; c < n; c++) {
        const ref = XLSX.utils.encode_cell({ r: 0, c });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };
        ws[ref].s = headerStyle;
      }
    };
    const paint = (ws, row, col, score) => {
      const ref = XLSX.utils.encode_cell({ r: row, c: col });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      ws[ref].s = {
        fill: { patternType: "solid", fgColor: { rgb: BAND_FILL[band(score)] } },
        alignment: { horizontal: "center" }
      };
    };

    // Summary
    const sum = [
      ["GDPR Readiness Assessment"],
      ["Generated", new Date().toISOString().slice(0, 10)],
      [],
      ["Overall readiness", pct(r.overall)],
      ["Activities in scope", r.liveCount],
      ["Mapped Articles fully evidenced", r.byArticle.filter(a => a.score >= 0.999).length + " of " + r.byArticle.length],
      ["Activities outstanding", r.gaps.length],
      [],
      ["This measures demonstrable accountability, not blanket compliance. Only Articles that a"],
      ["management activity can evidence are scored; scope, definitions and Member State"],
      ["provisions sit outside it."]
    ];
    const wsSum = XLSX.utils.aoa_to_sheet(sum);
    wsSum["!cols"] = [{ wch: 40 }, { wch: 26 }];
    if (wsSum["A1"]) wsSum["A1"].s = { font: { bold: true, sz: 14 } };
    paint(wsSum, 3, 1, r.overall);
    XLSX.utils.book_append_sheet(wb, wsSum, "Summary");

    // By category
    const catRows = [["Management category", "Activities", "Readiness"]];
    r.byCategory.forEach(c => catRows.push([c.name, c.count, c.score === null ? "n/a" : pct(c.score)]));
    const wsCat = XLSX.utils.aoa_to_sheet(catRows);
    wsCat["!cols"] = [{ wch: 44 }, { wch: 12 }, { wch: 12 }];
    styleHeader(wsCat, 3);
    r.byCategory.forEach((c, i) => paint(wsCat, i + 1, 2, c.score));
    XLSX.utils.book_append_sheet(wb, wsCat, "By Category");

    // By Article
    const artRows = [["Article", "Title", "Activities", "Status"]];
    r.byArticle.forEach(a => artRows.push([a.article, a.title, a.activities.length, pct(a.score)]));
    const wsArt = XLSX.utils.aoa_to_sheet(artRows);
    wsArt["!cols"] = [{ wch: 9 }, { wch: 62 }, { wch: 11 }, { wch: 10 }];
    styleHeader(wsArt, 4);
    r.byArticle.forEach((a, i) => paint(wsArt, i + 1, 3, a.score));
    XLSX.utils.book_append_sheet(wb, wsArt, "By Article");

    // Full detail
    const detRows = [["ID", "Category", "Activity", "Articles", "Status", "In scope", "Privacy Office question", "Operational Unit question"]];
    ACTIVITIES.forEach(a => detRows.push([
      a.id, CATEGORIES[a.cat], a.activity, a.articles.map(n => "Art " + n).join(", "),
      inScope(a) ? (STATUS.find(s => s.key === statusOf(a.id)) || {}).label : "Out of scope",
      inScope(a) ? "Yes" : "No", a.po || "", a.ou || ""
    ]));
    const wsDet = XLSX.utils.aoa_to_sheet(detRows);
    wsDet["!cols"] = [{ wch: 6 }, { wch: 34 }, { wch: 60 }, { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 80 }, { wch: 80 }];
    styleHeader(wsDet, 8);
    XLSX.utils.book_append_sheet(wb, wsDet, "All Activities");

    // Gaps
    const gapRows = [["Activity", "Category", "Would evidence", "Status"]];
    r.gaps.forEach(a => gapRows.push([
      a.activity, CATEGORIES[a.cat], a.articles.map(n => "Art " + n).join(", "),
      (STATUS.find(s => s.key === statusOf(a.id)) || {}).label
    ]));
    const wsGap = XLSX.utils.aoa_to_sheet(gapRows);
    wsGap["!cols"] = [{ wch: 60 }, { wch: 34 }, { wch: 18 }, { wch: 14 }];
    styleHeader(wsGap, 4);
    XLSX.utils.book_append_sheet(wb, wsGap, "Gap List");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "GDPR_Readiness_Assessment.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  // ----------------------------------------------------------------- init ---
  renderStatusLegend();
  renderScope();
  renderActivities();
  renderResults();
});
