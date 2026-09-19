# Site navigation for the reference pages: build files

Shared mechanics behind the side contents, the on-this-page bar, the search and filter
results box and the Top button on the three digests and the two advice pages.
Snapshot 19 September 2026.

- digest_nav.py: the module. toc_html() builds the side contents from a list of blocks
  (label, range, title, optional sub-blocks, items with id, label and optional source
  URL); results_html() the count line with Go to first result and Clear filters, the
  first-ten list and the How the filters work explainer; jump_html() the on-this-page
  bar; top_button() the Top button, the drawer backdrop and the Contents button;
  nav_js(prefix, noun, title selector, extra scrollspy targets) the script; nav_css(prefix,
  section id) the styles. Every class is prefixed (ed-, ck-, pp-, aia-); the two-column
  wrapper is <prefix>-cols (not -body, which the advice pages already use).
- apply_nav.py: adds the navigation to practical-privacy.html and
  practical-ai-act-advice.html by string surgery, leaving the written copy untouched:
  each situation or section becomes an entry (-entry class), each labelled paragraph
  (Why it matters, Key actions, Never, Worked example, and so on) gets an id and a link
  in the side contents, and a search box with the results pattern goes under the intro.
  Usage: python3 apply_nav.py <src html> <src css> <pp|aia> <section id> <out html> <out css>.
  Run it on the version of the page WITHOUT navigation (the copy in the fix folder of the
  September 2026 verification, or strip the -head, -cols, -toc and script blocks first).
- The digest builders (edpb-digest-build, cookie-digest-build) import digest_nav.py from
  beside them; the AI Act digest carries its own copy of the same mechanics.

The page script exposes window.DigestNav with afterApply(shown, total, active, extra),
onClear and mark(id). A page's own filter code calls afterApply after every change and
sets onClear to its reset function. Entries need ids; the scrollspy targets entries,
groups and any extra selector passed to nav_js.

British spelling, no em dashes. Font Awesome glyphs in generated CSS are written as
\\f107 in Python source so the file carries \f107.
