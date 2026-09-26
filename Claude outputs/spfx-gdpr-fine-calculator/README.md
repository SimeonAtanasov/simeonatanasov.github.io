# GDPR Fine Calculator for SharePoint

The calculator from simeonatanasov.com, packaged two ways for SharePoint. Same
method, same data, same numbers, and in both cases nothing calls out: all 355
decisions travel inside the file and every calculation happens in the browser,
so no turnover anyone types reaches SharePoint or anywhere else.

| | Single file | SPFx web part |
|---|---|---|
| What you get | one `.aspx`, 128 KB | a `.sppkg` you build |
| Who has to agree | nobody, if your site already allows it | a SharePoint admin, via the App Catalog |
| Build step | none, it is already built | Node 22, `npm install`, `npm run build` |
| Where it lives | a document library, opens as its own page | any modern page, as a web part |
| How long it lasts | see the dates below | supported indefinitely |

Both are generated from the same four TypeScript modules in
`src/webparts/gdprFineCalculator/calculator/`, so the two cannot drift apart.
Change the method there and rebuild, never edit the built `.aspx`.

---

## Route 1: the single file

This is the one that matches how you already work: make a `.txt` in a document
library, paste, rename to `.aspx`, click it.

The file is at:

```
standalone/dist/gdpr-fine-calculator.aspx
standalone/dist/gdpr-fine-calculator.aspx.txt   (identical, for the paste-then-rename route)
```

128 KB, one file, no build, no admin, no App Catalog. Everything is inline: the
styling, the logic and all 355 rows. It loads no font, no script, no image and
no stylesheet from anywhere. It works with the browser offline. The build
refuses to write the file if any of that stops being true.

Three things about it worth knowing.

**It contains no `<%` or `%>`.** SharePoint serves an `.aspx` from a document
library through the ASP.NET pipeline, so either sequence anywhere in the file,
even inside a JavaScript string, throws a parser error instead of rendering the
page. The build checks for both.

**It takes over the whole page.** There is no SharePoint chrome, no site
navigation, no breadcrumb: it is a standalone page that happens to be served
from a library. That is what you get with this route, not something I chose.

**Pasting 128 KB into the SharePoint text editor may be unpleasant.** If your
site lets you upload an `.aspx` directly, upload the `.aspx`. If it does not,
that is the same custom script restriction described below, and the paste route
is the workaround you already know.

### The dates that matter for this route

The `.aspx` file format is not being removed, and pages you have already made
keep working. What is being switched off is the ability to **add or update**
custom script, which is exactly what creating one of these files is.

- **1 March 2027**, new tenants only: users can no longer create classic pages
  and custom script addition and updates are off by default. All tenants lose
  the ability to create classic publishing sites.
- **1 October 2028**, all existing tenants: classic user-created pages become
  **read-only**. That explicitly includes custom `.aspx` pages created by
  SharePoint Designer or third-party means. They stay viewable. You cannot make
  new ones or edit the ones you have.

Also worth knowing now rather than on the day: since **15 September 2025**,
custom script is off by default on classic publishing sites, and the per-site
opt-out (`Set-SPOSite ... DenyAddAndCustomizePages`) lasts **24 hours** and then
switches itself back on. It needs tenant admin approval each time. If your site
works today, custom script is currently allowed on it; that is a property of
your site, and it can be turned off without warning.

So: the single file is the fastest way to have this working this afternoon, and
it has a known end date. The web part does not.

### Rebuilding the single file

```console
node tools/build-standalone.js [outDir]
```

Needs esbuild, which `npx` will fetch. The script bundles `standalone/entry.ts`,
drops it into `standalone/page.template.html`, and then refuses to write the
result if it finds an ASP.NET delimiter, a `</script` inside the bundle, an em
dash, an external URL, a subresource tag or a CSS `url()` that is not a data
URI.

---

## Route 2: the SPFx web part

The supported way. It survives every date above, it goes on ordinary modern
pages beside other web parts, and the same package can be surfaced as a Teams
tab.

This folder holds source files, not a project. You scaffold an empty SPFx
solution on your machine, drop these in, and build. That is deliberate: the
version numbers in `package.json`, `tsconfig.json` and `config/config.json`
change with every SPFx release, and a set of them written by hand today would be
wrong by the time you ran it.

### The gate is your tenant, not the code

An SPFx web part is installed by uploading a `.sppkg` to the tenant App Catalog.
That is an admin action. If you are not a SharePoint administrator in the
tenant, you need one, and in most corporate tenants that is a review rather than
a formality.

Two things that are **not** in the way, which usually are:

- **Custom script does not apply.** The `requiresCustomScript: false` flag in
  the manifest is accurate: no `eval`, no injected script tags, no external
  resources. The setting that governs route 1 is irrelevant to route 2.
- **No outbound access is needed.** The data is bundled. A tenant that blocks
  external CDNs runs this fine.

You can test the whole thing without an admin: `npm run start` serves it into
your own machine's workbench with nothing deployed anywhere.

### What you need

| Thing | Version | Notes |
|---|---|---|
| Node.js | `>=22.14.0 <23.0.0` | What the SPFx 1.23 generator declares. Node 24 is refused. |
| SPFx | 1.23.2 | Current general release as of September 2026. |
| Scaffolder | Yeoman | Still the supported scaffolder. The new SPFx CLI replaces it at 1.25, expected around the turn of the year. |
| Build tool | Heft | Heft replaced gulp at SPFx 1.22. Every `gulp serve` / `gulp bundle --ship` instruction you will find online is for 1.21 and earlier. |

```console
npm install -g yo @microsoft/generator-sharepoint@1.23.2
```

### 1. Scaffold

```console
mkdir gdpr-fine-calculator
cd gdpr-fine-calculator
yo @microsoft/sharepoint
```

The two marked **exactly** matter, because the generator derives folder and
class names from them and the files here are named to match:

| Prompt | Answer |
|---|---|
| Solution name | `gdpr-fine-calculator` |
| Deploy to all sites immediately | Your call. Yes skips the per-site install step. |
| Type of component | **WebPart** |
| Web part name | `GdprFineCalculator` **exactly** |
| Framework | **No framework** **exactly** |

### 2. Drop in these files

Delete what the generator put in `src/webparts/gdprFineCalculator/`, then copy
this folder's `src/` over it:

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

### 3. Build

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

The hosted workbench at `https://<tenant>.sharepoint.com/_layouts/15/workbench.aspx`
is deprecated as of SPFx 1.23 and retires on 1 December 2026. Use the local
workbench that `npm run start` opens, or the SPFx Debug Toolbar against a real
modern page.

### 4. Deploy

1. Upload `gdpr-fine-calculator.sppkg` to the tenant App Catalog
   (`https://<tenant>.sharepoint.com/sites/appcatalog`, **Apps for SharePoint**).
2. Approve the deployment when prompted.
3. On the site you want it on: **Settings**, **Add an app**, add
   "gdpr-fine-calculator" (skip this if you chose deploy-to-all-sites).
4. Edit a modern page, add the **GDPR Fine Calculator** web part from the
   **Advanced** group in the toolbox.

### What you can configure on the page

Five settings, all cosmetic. The calculation is not configurable, on purpose: a
benchmark whose peer selection can be quietly tuned by whoever edits the page is
not a benchmark.

| Property | Default | What it does |
|---|---|---|
| Heading | GDPR Fine Calculator | Empty shows no heading, for a page that already has one. |
| Show the opening paragraph | on | The "authorities do not publish a formula" framing. |
| Show "How to use this" | on | The four numbered steps. |
| Show "How the number is worked out" | on | The method notes and the caveats. Worth leaving on. |
| Turnover to start with | empty | Prefills the box. Accepts `20bn`, `450m` or a plain number. |

The web part reads its own width rather than the viewport's, so a copy dropped
into a one-third column stacks its three selectors the same way a phone does.

---

## What changed in the port, and what did not

The arithmetic did not change at all. Both builds were run side by side with the
live site version across 420 combinations of turnover, violation type, sector
and the three filter toggles: the rendered output was identical in every one,
and the scatter chart's 358 plotted points came out at the same coordinates to
the decimal place. The single file additionally ran with every network request
intercepted and made none.

What changed:

- **Ids are prefixed per web part instance**, so two copies of the calculator on
  one page keep their own label-to-control pairing. The single file uses the
  plain `fc-` prefix, since it owns the page.
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
  that would point outside the tenant. The only external links left are the
  per-case links to the enforcement tracker in the peer table.

---

## Refreshing the data

`src/webparts/gdprFineCalculator/calculator/fineData.ts` is generated. When the
website's dataset is rebuilt, regenerate this from it rather than editing it,
then rebuild the single file:

```console
node tools/build-fine-data.js <path to calculator-data.js> src/webparts/gdprFineCalculator/calculator/fineData.ts
node tools/build-standalone.js
```

`tools/build-fine-data.js` reads the site's `calculator-data.js`, checks the
field order has not moved, rejects rows with no usable fine or turnover, and
writes the TypeScript module. Keeping every build generated from one source is
what stops the web part, the single file and the website quietly answering the
same question differently.

---

## Sources

- [Deprecation of classic SharePoint pages](https://learn.microsoft.com/en-us/sharepoint/classic-user-created-page-deprecation)
- [MC1117115, custom scripting and classic publishing site creation](https://mc.merill.net/message/MC1117115)
- [SPFx roadmap update, August 2026](https://devblogs.microsoft.com/microsoft365dev/sharepoint-framework-spfx-roadmap-update-august-2026/)
- [SharePoint Framework v1.23 release notes](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/release-1.23)
- [SharePoint Framework toolchain](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/toolchain/sharepoint-framework-toolchain)
- [@microsoft/generator-sharepoint on npm](https://www.npmjs.com/package/@microsoft/generator-sharepoint)
