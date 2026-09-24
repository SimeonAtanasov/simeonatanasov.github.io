/* Styling for the SharePoint build.

   Shipped as a string and injected once per page rather than as a
   .module.scss, for one reason: the calculator writes its own markup as HTML
   strings with literal class names, and SPFx rewrites class names in a
   .module.scss to hashed ones at build time. Every selector below is therefore
   scoped under the .fc-spfx root instead, which keeps the page's own styles out
   and keeps these off the rest of the page.

   The website version sits on a dark navy template. A modern SharePoint page is
   light, so the surfaces, borders and chart ink are inverted here. The two data
   colours are not: aqua #199e70 and orange #d95926 were revalidated against the
   light surface #faf9f8 and pass the lightness band, the chroma floor, colour
   vision deficiency separation (worst pair delta E 9.4 deutan, 32.4 tritan),
   normal vision separation (26.5) and 3:1 contrast against the surface.

   Neutrals read the SharePoint theme variables where the tenant supplies them
   and fall back to the default Fluent neutrals where it does not, so the web
   part follows a themed site without being at the mercy of one. */

export const STYLE_ID = 'gdpr-fine-calculator-styles';

export const CSS: string = `
.fc-spfx {
  color: var(--bodyText, #323130);
  font-size: 14px;
  line-height: 1.55;
}

.fc-spfx *, .fc-spfx *::before, .fc-spfx *::after { box-sizing: border-box; }

.fc-spfx .fc-title { margin: 0 0 0.5em 0; font-size: 1.6em; font-weight: 600; }
.fc-spfx h3 { margin: 0 0 0.5em 0; font-size: 1.15em; font-weight: 600; }
.fc-spfx h4 { margin: 1.4em 0 0.35em 0; font-size: 0.86em; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.08em; color: var(--neutralSecondary, #605e5c); }
.fc-spfx h4:first-of-type { margin-top: 0; }
.fc-spfx p { margin: 0 0 0.8em 0; }
.fc-spfx p:last-child { margin-bottom: 0; }
.fc-spfx a { color: var(--link, #0f6cbd); }

.fc-spfx .fc-h3-spaced { margin-top: 2em; }

.fc-spfx .fc-lead { font-size: 1em; color: var(--neutralSecondary, #605e5c); margin-bottom: 1.4em; }
.fc-spfx .fc-note { font-size: 0.9em; color: var(--neutralSecondary, #605e5c); line-height: 1.6; }

.fc-spfx .fc-block { margin: 0 0 2em 0; }

.fc-spfx code {
  font-family: Consolas, "Courier New", monospace;
  font-size: 0.92em;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--neutralLighter, #f3f2f1);
}

/* ------------------------------------------------------------------ how-to --- */

.fc-spfx .fc-howto {
  padding: 18px 22px;
  background: var(--neutralLighterAlt, #faf9f8);
  border: 1px solid var(--neutralLight, #edebe9);
  border-left: 3px solid #199e70;
  border-radius: 4px;
}

.fc-spfx .fc-steps { margin: 0 0 1em 0; padding-left: 1.3em; }
.fc-spfx .fc-steps li { list-style: decimal; margin-bottom: 0.5em; line-height: 1.6; }

/* ------------------------------------------------------------------ inputs --- */

.fc-spfx .fc-inputs {
  padding: 18px 22px;
  background: var(--neutralLighterAlt, #faf9f8);
  border: 1px solid var(--neutralLight, #edebe9);
  border-radius: 4px;
}

/* One grid for all three fields, with a row each for the label, the control and
   the hint. display: contents on the field promotes its three children to grid
   items, so the controls line up across the columns however many lines a label
   wraps to. A flex row cannot do this: there each column is its own box, so a
   two-line label pushes only its own control down. */
.fc-spfx .fc-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: auto auto auto;
  grid-auto-flow: column;
  column-gap: 20px;
  align-items: start;
}

.fc-spfx .fc-field { display: contents; }

.fc-spfx .fc-field label {
  display: block;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: var(--neutralSecondary, #605e5c);
  margin: 0 0 0.45em 0;
}

.fc-spfx .fc-field input[type="text"],
.fc-spfx .fc-field select {
  width: 100%;
  height: 34px;
  padding: 0 8px;
  font-family: inherit;
  font-size: 0.95em;
  color: var(--bodyText, #323130);
  background: var(--white, #ffffff);
  border: 1px solid var(--neutralTertiaryAlt, #c8c6c4);
  border-radius: 2px;
  margin: 0;
}

.fc-spfx .fc-field select { padding: 0 6px; }

.fc-spfx .fc-field input[type="text"]:focus,
.fc-spfx .fc-field select:focus {
  outline: none;
  border-color: var(--themePrimary, #0f6cbd);
  box-shadow: inset 0 0 0 1px var(--themePrimary, #0f6cbd);
}

.fc-spfx .fc-hint {
  font-size: 0.82em;
  color: var(--neutralSecondary, #605e5c);
  margin: 0.45em 0 0 0;
  align-self: start;
  line-height: 1.5;
}

.fc-spfx .fc-toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 28px;
  margin-top: 18px;
}

.fc-spfx .fc-toggles label {
  display: inline-flex;
  align-items: center;
  font-size: 0.9em;
  cursor: pointer;
  margin: 0;
  padding: 0;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 400;
}

.fc-spfx .fc-toggles input[type="checkbox"] {
  width: auto;
  height: auto;
  margin: 0 8px 0 0;
  vertical-align: middle;
}

/* ----------------------------------------------------------------- results --- */

.fc-spfx .fc-results { margin-top: 1.8em; }

.fc-spfx .fc-cards { display: flex; flex-wrap: wrap; gap: 14px; }

.fc-spfx .fc-card {
  flex: 1 1 200px;
  min-width: 0;
  padding: 16px 18px;
  background: var(--neutralLighterAlt, #faf9f8);
  border: 1px solid var(--neutralLight, #edebe9);
  border-top: 3px solid var(--neutralTertiary, #a19f9d);
  border-radius: 4px;
}

.fc-spfx .fc-card.fc-card-main { border-top-color: #199e70; }
.fc-spfx .fc-card.fc-card-cap  { border-top-color: #d95926; }

.fc-spfx .fc-card-label {
  font-size: 0.76em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  color: var(--neutralSecondary, #605e5c);
  margin-bottom: 0.4em;
}

.fc-spfx .fc-card-value {
  font-size: 1.55em;
  font-weight: 600;
  line-height: 1.2;
  word-break: break-word;
}

.fc-spfx .fc-card-sub {
  font-size: 0.82em;
  color: var(--neutralSecondary, #605e5c);
  margin-top: 0.4em;
  line-height: 1.5;
}

.fc-spfx .fc-basis {
  margin-top: 1.1em;
  padding: 13px 16px;
  background: var(--neutralLighter, #f3f2f1);
  border-left: 3px solid #4276a6;
  border-radius: 3px;
  font-size: 0.9em;
  line-height: 1.6;
}

.fc-spfx .fc-warn {
  margin-top: 1.1em;
  padding: 13px 16px;
  background: #fdf3ee;
  border-left: 3px solid #d95926;
  border-radius: 3px;
  font-size: 0.9em;
  line-height: 1.6;
}

/* ------------------------------------------------------------------- chart --- */

.fc-spfx .fc-chart-wrap {
  margin-top: 2em;
  padding: 16px;
  background: var(--neutralLighterAlt, #faf9f8);
  border: 1px solid var(--neutralLight, #edebe9);
  border-radius: 4px;
}

.fc-spfx .fc-chart-wrap h3 { margin-bottom: 0.3em; }

.fc-spfx .fc-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 0 0 12px 0;
  font-size: 0.85em;
}

.fc-spfx .fc-legend span { display: inline-flex; align-items: center; gap: 7px; }

.fc-spfx .fc-swatch {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  display: inline-block;
  flex: 0 0 auto;
}

.fc-spfx .fc-chart { width: 100%; height: auto; display: block; }

/* ------------------------------------------------------------------ tables --- */

.fc-spfx .fc-table-scroll { overflow-x: auto; margin-top: 1em; }

.fc-spfx .fc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88em;
}

.fc-spfx .fc-table th,
.fc-spfx .fc-table td {
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1px solid var(--neutralLight, #edebe9);
  vertical-align: top;
}

.fc-spfx .fc-table th {
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: var(--neutralSecondary, #605e5c);
  white-space: nowrap;
  border-bottom: 1px solid var(--neutralTertiaryAlt, #c8c6c4);
}

.fc-spfx .fc-table td.fc-num { text-align: right; white-space: nowrap; }

.fc-spfx .fc-conf {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 0.78em;
  white-space: nowrap;
}

.fc-spfx .fc-conf-3 { background: #e3f3ec; color: #14614a; }
.fc-spfx .fc-conf-2 { background: #e6eef6; color: #2c4f70; }
.fc-spfx .fc-conf-1 { background: #fbeee0; color: #7a4e17; }
.fc-spfx .fc-conf-0 { background: var(--neutralLighter, #f3f2f1); color: #605e5c; }

/* ------------------------------------------------------- sector comparison --- */

.fc-spfx .fc-sector-table tr.fc-sector-on td { background: #eef7f3; }

.fc-spfx .fc-barcell { width: 34%; min-width: 130px; }

.fc-spfx .fc-bartrack {
  position: relative;
  display: block;
  height: 12px;
  background: var(--neutralLight, #edebe9);
  border-radius: 3px;
  overflow: visible;
}

.fc-spfx .fc-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #199e70;
  border-radius: 3px 4px 4px 3px;
}

/* Median across all sectors at this size, so each bar can be read against it. */
.fc-spfx .fc-barmark {
  position: absolute;
  top: -3px;
  width: 0;
  height: 18px;
  border-left: 2px dashed var(--neutralSecondary, #605e5c);
}

/* ----------------------------------------------------------------- actions --- */

.fc-spfx .fc-actions { margin-top: 1.8em; display: flex; flex-wrap: wrap; gap: 12px; }

.fc-spfx .fc-actions button {
  margin: 0;
  padding: 0 20px;
  height: 34px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 2px;
  background-color: #4276a6;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1.25;
}

.fc-spfx .fc-actions button:hover { background-color: #35618a; }
.fc-spfx .fc-actions button:focus-visible { outline: 2px solid var(--themePrimary, #0f6cbd); outline-offset: 2px; }

/* ------------------------------------------------------------------ method --- */

.fc-spfx .fc-method {
  padding: 18px 22px;
  background: var(--neutralLighterAlt, #faf9f8);
  border: 1px solid var(--neutralLight, #edebe9);
  border-radius: 4px;
}

.fc-spfx .fc-method-title { margin-bottom: 1em; }
.fc-spfx .fc-method p { line-height: 1.65; font-size: 0.92em; }

.fc-spfx .fc-caveat {
  margin-top: 1.4em;
  padding: 13px 16px;
  background: #fdf6ec;
  border-left: 3px solid #c07f2a;
  border-radius: 3px;
  font-size: 0.9em;
  line-height: 1.6;
}

/* -------------------------------------------------- article chips and tags --- */

.fc-spfx .fc-arts { display: inline-block; margin-top: 4px; }

.fc-spfx .fc-art {
  display: inline-block;
  padding: 1px 6px;
  margin: 2px 3px 0 0;
  border-radius: 3px;
  background: var(--neutralLighter, #f3f2f1);
  color: var(--neutralSecondary, #605e5c);
  font-size: 0.78em;
  white-space: nowrap;
  cursor: help;
}

.fc-spfx .fc-tag {
  display: inline-block;
  padding: 1px 7px;
  border-radius: 10px;
  background: #fbeee0;
  color: #7a4e17;
  font-size: 0.75em;
  white-space: nowrap;
  cursor: help;
}

/* ------------------------------------------------------------------ narrow --- */

/* Keyed to the web part's own width rather than the viewport, because a web
   part put in a one-third column on a desktop is just as narrow as a phone. */
@media screen and (max-width: 736px) {
  .fc-spfx .fc-inputs { padding: 14px; }
  .fc-spfx .fc-fields { display: block; }
  .fc-spfx .fc-field { display: block; margin-bottom: 16px; }
  .fc-spfx .fc-field:last-child { margin-bottom: 0; }
  .fc-spfx .fc-card { flex: 1 1 100%; }
  .fc-spfx .fc-actions button { width: 100%; }
  .fc-spfx .fc-table { min-width: 620px; }
  .fc-spfx .fc-chart-wrap { padding: 10px; }
}

.fc-spfx.fc-narrow .fc-fields { display: block; }
.fc-spfx.fc-narrow .fc-field { display: block; margin-bottom: 16px; }
.fc-spfx.fc-narrow .fc-field:last-child { margin-bottom: 0; }
.fc-spfx.fc-narrow .fc-card { flex: 1 1 100%; }
.fc-spfx.fc-narrow .fc-table { min-width: 620px; }
`;

/* Injected once per page however many copies of the web part are on it. */
export function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) { return; }
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.appendChild(document.createTextNode(CSS));
  document.head.appendChild(el);
}
