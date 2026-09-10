# OneTrust CSP / ForceConsent Issue - `otBannerSdk.js` Never Calls Its Own CSP-Safe Style Helper

**Prepared by:** DHL Cookies Management / CMP Team - Simeon Atanasov, DHL IT Services (simeon.atanasov@dhl.com), incorporating root-cause investigation by Tom Vergeer, DHL eCommerce Benelux (tom.vergeer@dhl.com)
**Date:** 2026-09-09
**Severity:** High - production, customer-facing. First-time visitors on affected domains cannot accept or reject cookies, and on `ForceConsent` domains cannot use the site at all.
**Urgency:** the affected URLs are currently running with CSP in Report-Only mode as a stopgap (Section 6). This cannot continue. Our strict `style-src` policy was mandated following an external penetration test, and Report-Only mode means it is not enforced at all on these pages. We need these URLs moved back to an enforcing CSP as soon as a real fix is available.

---

## 1. Summary

This affects multiple DHL properties across several business units (eCommerce, Express, Locator, DHLenTuMano - see Section 5), not a single site.

**Confirmed root cause:** `otBannerSdk.js` contains an internal style-writing helper that calls `element.setAttribute('style', ...)` unconditionally. `otSDKStub.js` - loaded on the same page, by the same OneTrust integration - already ships a CSP-safe alternative for exactly this problem, `Element.prototype.setOTStyle`, which writes styles via CSSOM property assignment instead of the `style` attribute, so it works under a nonce-based CSP with no `unsafe-inline`/`unsafe-hashes`. `otBannerSdk.js` never calls it. This is not a version regression: `grep -c setOTStyle otBannerSdk.js` returns `0` in every published build checked - `202407.2.0, 202410.1.0, 202501.1.0, 202504.1.0, 202507.1.0, 202510.1.0, 202512.1.0, 202601.1.0, 202606.1.0`. The polyfill has existed in the stub and gone unused by the banner SDK across at least a year of releases.

**Where it actually bites:** with `ForceConsent` enabled, on first load `otBannerSdk.js` runs `.onetrust-pc-dark-filter.removeClass('ot-hide').css('z-index:2147483645;')` to bring the consent-wall overlay level with the banner. Under a strict `style-src`, that `.css()` call is blocked (routes through the broken `setAttribute('style', ...)` path), so the overlay keeps its default `z-index: 2147483646`, one level *above* the banner. The overlay ends up sitting on top of the Accept/Reject buttons. Visitors cannot interact with the banner at all, and because `ForceConsent` blocks the rest of the page until consent is given, **the entire site becomes inaccessible to new visitors**.

This only manifests for a visitor with **no existing OneTrust consent cookie**, on a domain with **`ForceConsent` enabled**, under a **strict CSP**. Returning visitors, or anyone with consent already granted, will not see it, because the affected code path only runs on first load, before consent exists.

## 2. Root cause - code evidence

`otSDKStub.js` installs the CSP-safe polyfill:

```js
// otSDKStub.js - writes via CSSOM instead of a style attribute
Element.prototype.setOTStyle = function (t) {
  ...
  this.removeAttribute('style');
  this.style[i] = e[i]
  ...
}

// the stub's own helper respects it:
'function' == typeof t.setOTStyle ? t.setOTStyle(e) : t.setAttribute('style', e)
```

`otBannerSdk.js` - loaded by that same stub, on the same page - never checks for or calls it:

```js
// otBannerSdk.js - unconditional, no polyfill check
function d(e, t, o) { ... e.setAttribute('style', t) }
```

The exact call that fails under `ForceConsent`:

```js
N.ForceConsent && !h.isCookiePolicyPage(N.AlertNoticeText) &&
  m('.onetrust-pc-dark-filter').removeClass('ot-hide').css('z-index:2147483645;')
```

`.css()` → `d()` → `setAttribute('style', ...)` → blocked by CSP. Browser console:

```
Applying inline style violates the following Content Security Policy directive
'style-src 'nonce-…' https://cdn.cookielaw.org …'. Either the 'unsafe-inline'
keyword, a hash ('sha256-SoskGQRovOvY2l0XYiCJ2Qk4QdsmuGFBwgi4jl3AlIg='), or a
nonce is required… Note that hashes do not apply to event handlers, style
attributes and javascript: navigations unless the 'unsafe-hashes' keyword is
present. The action has been blocked.
```

Observed vs. expected state on an affected page, first load, no prior consent:

| | Expected | Actual |
|---|---|---|
| `.onetrust-pc-dark-filter` z-index | `2147483645` | `2147483646` |
| `#onetrust-banner-sdk` z-index | `2147483645` | `2147483645` |
| `elementFromPoint()` over "Accept All" | `#onetrust-accept-btn-handler` | `div.onetrust-pc-dark-filter` |

The element retains `style="z-index:2147483645;"` in the DOM while `element.style.length === 0` - the browser refused to apply the declaration, but didn't strip the stale attribute text either, which is why a casual look at the DOM can be misleading.

**This is confirmed as a CSP-side effect, not a broken nonce integration.** On the same pages: `otSDKStub.js`'s own `captureNonce()` reads the nonce successfully, `#onetrust-style` (a `<style>` block, which a nonce *can* authorize) carries the nonce and applies all 661 of its CSS rules without being blocked, and `Element.prototype.setOTStyle` is present and functional. Every part of OneTrust's own CSP-nonce handshake works. Only the specific unconverted `setAttribute('style', ...)` call inside `otBannerSdk.js` fails.

## 3. Controlled comparison isolating CSP as the trigger

From DHL eCommerce Benelux's testing (`my.dhlecommerce.nl` tenant):

| Site | `style-src` | SDK version | Overlay z-index | Banner clickable |
|---|---|---|---|---|
| `my.dhlecommerce.nl/account/sign-in` | nonce-based | `202408.1.0` | `2147483646` | **No** |
| `accept.dhlecommerce.nl/account/sign-in` | nonce-based | `202407.2.0` | `2147483646` | **No** |
| `www.dhlecommerce.nl` | no CSP header | `202510.1.0` | `2147483645` | Yes |

Two different SDK versions reproduce the fault under a nonce-based CSP; the same code path with no CSP at all does not fail. That rules out SDK version as the variable - the CSP is what changes the outcome, specifically because it's the only thing that determines whether the blocked `setAttribute('style', ...)` call actually gets blocked.

## 4. Our own evidence (DHL Express UK, `uk.express.dhl.com`)

Independently, on our own GB test environment, we captured the same underlying failure mode against `otBannerSdk.js 202605.1.0`:

```
otBannerSdk.js:7 Applying inline style violates the following Content Security Policy directive
'style-src 'self' express-resource.dhl.com ... 'nonce-fbSKqxz4XnzSHDV6T8aZrA==''. Either the
'unsafe-inline' keyword, a hash (...), or a nonce ('nonce-...') is required to enable inline
execution. Note that hashes do not apply to event handlers, style attributes and javascript:
navigations unless the 'unsafe-hashes' keyword is present. The action has been blocked.
```

repeated with 8 distinct hash values requested for the same call site (`otBannerSdk.js:7`), consistent with dynamic/varying inline style values (opacity/position on the dark filter) that no static hash-allowlist could cover.

Our `style-src` on this domain, before the temporary mitigation in Section 6, was:

```
style-src 'self' express-resource.dhl.com
  'sha256-J190NMj1lQxByFdlcNKRhhCCXiUM1r+jkSLWV+llFq4=' [... 7 more hashes]
  'nonce-<per-request-nonce>';
```

No `unsafe-inline`, no `unsafe-hashes` - same class of policy as the affected `dhlecommerce.nl` domains above.

## 5. Scope

Per the internal incident summary (distributed 2026-09-08), impacted environments include DHL eCommerce (`my.dhlecommerce.nl`, `accept.dhlecommerce.nl`), DHL Express (`my.dhlexpress.nl`, `accept.dhlexpress.nl`), DHL Express UK (`uk.express.dhl.com`), Locator (`locator.dhl.com`), and DHLenTuMano (`areaclientes.dhl.es`). This is a cross-business-unit issue, not isolated to one property or tenant.

## 6. Current mitigations in place (all temporary, none resolve the root cause)

- **`my.dhlecommerce.nl` and `my.dhlexpress.nl`:** cookie banners disabled entirely as an emergency stopgap while this is investigated (per DHL eCommerce Benelux, 2026-09-08). This removes the immediate site-blocking issue but means no consent mechanism runs at all on those domains in the meantime.
- **`uk.express.dhl.com`:** tested on multiple pages and consistently failed because CSP rejected the inline style change. As a mitigation, CSP was changed from enforcing `Content-Security-Policy` to `Content-Security-Policy-Report-Only`, which stops the browser from blocking the change and restores banner functionality, but does so by disabling `style-src` enforcement for the entire page, not by fixing the SDK. **This directive exists specifically because it was flagged by an external penetration test, and Report-Only mode means it is currently not enforced at all on this URL. We cannot continue running production URLs this way — they need to move back to an enforcing CSP as soon as a real fix is in place.**
- We had also tried fully removing the OneTrust script embed from `uk.express.dhl.com` at an earlier point; that created a separate, worse compliance problem (a Google Ads tracking cookie firing with no consent gate at all) and is not an acceptable path either.

## 7. Our CSP constraint (fixed, cannot be relaxed)

Our `style-src` directives intentionally omit `unsafe-inline` and `unsafe-hashes`. This is deliberate hardening following an external penetration test and is not something we can relax, on this or any other DHL property. We followed OneTrust's own published guidance ([Configuring a Content Security Policy with OneTrust CDN](https://developer.onetrust.com/onetrust/docs/content-security-policy-cdn)) exactly, applying a per-request nonce to both `script-src` and `style-src`, "as an alternative to unsafe keywords." That documentation never mentions that `otBannerSdk.js` contains a `setAttribute('style', ...)` call that its own polyfill doesn't cover, nor does it mention `unsafe-hashes` at all. This is a gap between OneTrust's own SDK behavior and its own published CSP guidance, not a misconfiguration on our side.

## 8. What we'd like OneTrust to check

We're not prescribing the fix, that's for your engineering team to decide, but these are the specific things we'd like investigated:

1. **Why `otBannerSdk.js`'s style-writing helper (`d()` in the analysis above) doesn't call `Element.prototype.setOTStyle`**, given `otSDKStub.js`'s own helper already does exactly that: `'function' == typeof t.setOTStyle ? t.setOTStyle(e) : t.setAttribute('style', e)`. Whether routing `otBannerSdk.js` through that existing polyfill (or an equivalent CSP-safe path) is a viable fix is something we'd like your input on.
2. **Whether the other elements hitting this same path** need the same treatment: `#onetrust-banner-sdk[style="bottom: 0px"]`, `#close-pc-btn-handler`'s close-icon background-image, and a `height: 100%` container in the preference center, all identified in the DHL eCommerce Benelux analysis.
3. **Whether this is already tracked** internally at OneTrust, it reproduces identically across nine SDK versions spanning over a year of releases, so it seems likely to have surfaced before for other customers running nonce-based CSP with `ForceConsent`.
4. **Whether the public CSP documentation should be updated** to note that the nonce-based approach alone does not cover every inline style write `otBannerSdk.js` performs, and that `ForceConsent` customers on strict CSP are specifically exposed to a full page lockout, not just a cosmetic banner issue.

## 9. Reproduction steps

1. Use a domain script with `ForceConsent: true` enabled.
2. Serve the page under a `style-src` CSP with a valid nonce (optionally plus a hash allowlist) but no `unsafe-inline` and no `unsafe-hashes`.
3. Load the page **as a fresh visitor with no existing OneTrust consent cookie** (this is essential - clear cookies or use a private/incognito session; a returning visitor with consent already granted will not reproduce this).
4. Observe: the consent-wall overlay (`.onetrust-pc-dark-filter`) renders above the banner. The browser console shows repeated `Applying inline style violates...` errors originating in `otBannerSdk.js`.
5. Attempt to click "Accept All": `document.elementFromPoint(x, y)` at the button's coordinates returns `div.onetrust-pc-dark-filter`, not the button. No consent action is possible, and if `ForceConsent` blocks the rest of the page, the site is entirely inaccessible.

For comparison, the same steps against a page with no CSP `style-src` restriction (or, per the `unsafe-inline`/`unsafe-hashes` route we cannot use) do not reproduce the issue, confirming the CSP is what turns an otherwise-latent code defect into an active failure.
