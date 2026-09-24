# GDPR Fine Calculator, SharePoint Framework web part

The calculator from simeonatanasov.com, ported to run as a modern SharePoint
web part. Same method, same data, same numbers. Nothing calls out: the 357
decisions travel inside the package and every calculation happens in the
browser, so no turnover anyone types reaches SharePoint or anywhere else.

This folder holds source files, not a project. You scaffold an empty SPFx
solution on your machine, drop these in, and build. That is deliberate: the
version numbers in `package.json`, `tsconfig.json` and `config/config.json`
change with every SPFx release, and a set of them written by hand today would
be wrong by the time you ran it.

---

## Before you start: the real gate is your tenant, not the code

Worth settling before you spend an evening on the build.

An SPFx web part is installed by uploading a `.sppkg` file to the tenant App
Catalog. That is an admin action. If you are not a SharePoint administrator in
the tenant you are targeting, you will need one to upload and approve it, and
in most corporate tenants that is a review, not a formality.

Two things that are **not** in the way, which are worth knowing because they
usually are:

- **Custom script does not apply.** The `requiresCustomScript: false` flag in
  the manifest is accurate: this web part uses no `eval`, no injected script
  tags and no external resources. The "Allow users to run custom script"
  setting, which is off by default and which blocks the old classic-page
  approach, is irrelevant here.
- **No outbound access is needed.** The data is bundled. A tenant that blocks
  external CDNs, or a site with no internet egress, runs this fine.

You can also test the whole thing without an admin: `npm run start` serves it
into your own machine's workbench with nothing deployed anywhere.

---

## Why SPFx rather than ASPX

You originally asked about ASPX. Classic ASPX pages are being retired:
new tenants lose the ability to create them on 1 March 2027, and all tenants go
read-only on 1 October 2028. Custom script has been off by default on classic
publishing sites since 15 September 2025, which already blocks the usual way of
putting a script like this on an ASPX page.

SPFx is the supported route, works on modern pages, survives the retirement,
and can also be surfaced as a Teams tab from the same package.

---

## What you need

| Thing | Version | Notes |
|---|---|---|
| Node.js | `>=22.14.0 <23.0.0` | This is what the SPFx 1.23 generator declares. Node 24 will be refused. |
| SPFx | 1.23.2 | Current general release as of September 2026. |
| Scaffolder | Yeoman | Still the supported scaffolder. The new SPFx CLI replaces it at 1.25, expected around the turn of the year. |
| Build tool | Heft | Heft replaced gulp at SPFx 1.22. Every `gulp serve` / `gulp bundle --ship` instruction you will find online is for 1.21 and earlier. |

```console
npm install -g yo @microsoft/generator-sharepoint@1.23.2
```

---

## 1. Scaffold the solution

```console
mkdir gdpr-fine-calculator
cd gdpr-fine-calculator
yo @microsoft/sharepoint
```

Answer the prompts like this. The two marked **exactly** matter, because the
generator derives folder and class names from them and the files in this folder
are named to match:

| Prompt | Answer |
|---|---|
| Solution name | `gdpr-fine-calculator` |
| Deploy to all sites immediately | Your call. Yes skips the per-site install step. |
| Type of component | **WebPart** |
| Web part name | `GdprFineCalculator` **exactly** |
| Framework | **No framework** **exactly** |

That produces `src/webparts/gdprFineCalculator/` with a sample web part in it.

## 2. Drop in these files

Delete what the generator put in `src/webparts/gdprFineCalculator/`, then copy
the contents of this folder's `src/` over it:

```
src/webparts/gdprFineCalculator/
  GdprFineCalculatorWebPart.ts            replaces the generated one
  GdprFineCalculatorWebPart.manifest.json replaces the generated one
  loc/en-us.js                            replaces the generated one
  loc/mystrings.d.ts                      replaces the generated one
  calculator/calculator.ts                new
  calculator/fineData.ts                  new
  calculator/template.ts                  new
  calculator/styles.ts                    new
```

Also delete the generated `GdprFineCalculatorWebPart.module.scss` and the
`assets/` folder with the two welcome images. Nothing references them any more,
and a leftover `.module.scss` import in a file you did not replace is the usual
cause of a first-build failure.

The manifest carries a freshly generated component id
(`c20453f7-db8e-4f13-a0dc-82b2c5875e9c`), so it will not collide with anything.
If you would rather keep the id the generator produced, copy that one line back
in. Nothing else references it.

Nothing needs changing in `config/config.json`: it points at the web part by
path, and the paths are unchanged.

## 3. Build

```console
npm install
npm run start          # serve into the local workbench, nothing deployed
npm run build          # lint, compile, bundle and package
```

`npm run build` is the scaffold's own script and expands to
`heft test --clean --production && heft package-solution --production`. It
leaves the installable package at:

```
sharepoint/solution/gdpr-fine-calculator.sppkg
```

The source here is clean under the SPFx lint profile and the SPFx TypeScript
settings: no errors and no warnings, checked before it was written out. That
matters because a production Heft build is less forgiving of warnings than a
debug one.

Note on testing: the hosted workbench at
`https://<tenant>.sharepoint.com/_layouts/15/workbench.aspx` is deprecated as of
SPFx 1.23 and retires on 1 December 2026. Use the local workbench that
`npm run start` opens, or the SPFx Debug Toolbar against a real modern page.

## 4. Deploy

1. Upload `gdpr-fine-calculator.sppkg` to the tenant App Catalog
   (`https://<tenant>.sharepoint.com/sites/appcatalog`, **Apps for SharePoint**).
2. Approve the deployment when prompted.
3. On the site you want it on: **Settings**, **Add an app**, add
   "gdpr-fine-calculator" (skip this if you chose deploy-to-all-sites).
4. Edit a modern page, add the **GDPR Fine Calculator** web part from the
   **Advanced** group in the toolbox.

---

## What you can configure on the page

The property pane exposes five settings, all cosmetic. The calculation is not
configurable, on purpose: a benchmark whose peer selection can be quietly tuned
by whoever edits the page is not a benchmark.

| Property | Default | What it does |
|---|---|---|
| Heading | GDPR Fine Calculator | Empty shows no heading, for a page that already has one. |
| Show the opening paragraph | on | The "authorities do not publish a formula" framing. |
| Show "How to use this" | on | The four numbered steps. |
| Show "How the number is worked out" | on | The method notes and the caveats. Worth leaving on. |
| Turnover to start with | empty | Prefills the box. Accepts `20bn`, `450m` or a plain number. |

The web part reads its width rather than the viewport's, so a copy dropped into
a one-third column stacks its three selectors the same way a phone does.

---

## What changed in the port, and what did not

The arithmetic did not change at all. The ported logic was run side by side with
the live site version across 420 combinations of turnover, violation type,
sector and the three filter toggles: the rendered output was identical in every
one, and the scatter chart's 358 plotted points came out at the same coordinates
to the decimal place.

What changed:

- **Ids are prefixed per web part instance**, so two copies of the calculator
  on one page keep their own label-to-control pairing.
- **The theme is light.** The website sits on a dark navy template; a modern
  SharePoint page does not. Surfaces, borders and chart ink are inverted, and
  the neutrals read the SharePoint theme variables with Fluent defaults as a
  fallback, so the web part follows a themed site.
  The two data colours did not change: aqua `#199e70` and orange `#d95926` were
  revalidated against the light surface `#faf9f8` and still pass the lightness
  band, the chroma floor, colour vision deficiency separation (worst pair
  delta E 9.4 deutan, 32.4 tritan), normal vision separation (26.5) and 3:1
  contrast.
- **Styling ships as a string, not a `.module.scss`.** SPFx rewrites class names
  in a `.module.scss` to hashed ones at build time, and the calculator writes its
  own markup as HTML strings with literal class names. The stylesheet is injected
  once per page and every selector is scoped under a `.fc-spfx` root, which keeps
  SharePoint's styles out and these styles off the rest of the page.
- **Number grouping is done by hand** rather than through `toLocaleString`, so a
  reader in Sofia and a reader in London see the same string.
- **The links out are gone.** The website version links to its own Power BI page;
  that would point outside the tenant.

---

## Refreshing the data

`src/webparts/gdprFineCalculator/calculator/fineData.ts` is generated. When the
website's dataset is rebuilt, regenerate this from it rather than editing it:

```console
node tools/build-fine-data.js <path to calculator-data.js> src/webparts/gdprFineCalculator/calculator/fineData.ts
```

`tools/build-fine-data.js` is in this folder. It reads the site's
`calculator-data.js`, checks the field order has not moved, and writes the
TypeScript module. Keeping the two builds generated from one source is what
stops the web part and the website quietly answering the same question
differently.

---

## Sources

- [SPFx roadmap update, August 2026](https://devblogs.microsoft.com/microsoft365dev/sharepoint-framework-spfx-roadmap-update-august-2026/)
- [SharePoint Framework v1.23 release notes](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/release-1.23)
- [SharePoint Framework toolchain](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/toolchain/sharepoint-framework-toolchain)
- [@microsoft/generator-sharepoint on npm](https://www.npmjs.com/package/@microsoft/generator-sharepoint)
