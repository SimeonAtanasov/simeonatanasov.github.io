# -*- coding: utf-8 -*-
"""Front matter and the review card. Authored."""

COVER = """
<section class="cover">
  <p class="kicker">Study pack</p>
  <h1>Privacy, the AI Act<br>and the Assessments</h1>
  <p class="sub">Practical Privacy &middot; Practical AI Act Advice &middot; six assessment tools &middot; the GDPR readiness model</p>
  <div class="coverstats">
    <div><span class="n">31</span><span class="l">reference topics</span></div>
    <div><span class="n">338</span><span class="l">assessment questions</span></div>
    <div><span class="n">71</span><span class="l">readiness activities</span></div>
    <div><span class="n">69</span><span class="l">self-test questions</span></div>
  </div>
  <p class="covernote">Printed for study. Everything here is reference material and none of it is legal advice.</p>
</section>
"""

HOWTO = """
<h1 id="howto-h">How to use this pack</h1>

<p class="lede">This is the whole body of material in one printable document: the two written references
in full, every question the six assessment tools ask with the scoring model behind each one, and the
complete readiness model. It is organised so it can be read straight through once and then used for
retrieval practice afterwards, which is the part that actually makes it stick.</p>

<h2 class="sub">The one thing that matters most</h2>

<p>Reading this pack three times will feel productive and will teach you much less than reading it once
and then testing yourself on it three times. Recognition is not recall: a paragraph you have just read
feels known, and that feeling disappears the moment someone asks you the question cold. Every part ends
with a self-test whose answers are printed on a later page for exactly this reason. Use them as the
primary activity, not as a nice-to-have at the end.</p>

<p>Two habits do most of the work. First, before reading a section, read only its heading and try to
list what you think it will say: even a wrong guess prepares the memory to hold the right answer.
Second, after reading a section, close the pack and say the decision rule out loud in one sentence.
If you cannot, you have not finished with that section.</p>

<h2 class="sub">What is in each part</h2>

<ul class="whatis">
  <li><strong>Part 1, Practical Privacy.</strong> Eighteen situations that recur inside every
  organisation: surveillance, offboarding, mailbox access, meetings, remote work, surveys, talent data,
  rights requests, sensitive data, consent, secondary use, external requests, AI and analytics,
  regulators, digital products, breach response, records management, marketing. Each carries a key
  takeaways box which is the version to revise from.</li>
  <li><strong>Part 2, Practical AI Act Advice.</strong> Thirteen sections covering scope, prohibitions,
  high-risk classification, provider and deployer obligations, GPAI, conformity, governance and
  enforcement, then four practitioner sections on building a program, assessing risk, vetting vendors,
  literacy, and copyright. Same takeaway boxes.</li>
  <li><strong>Part 3, the Assessment Suite.</strong> Six tools. Each one opens with a cheat sheet
  covering what it is for, its shape, what it returns, how the scoring works and where people get it
  wrong, followed by the full question bank step by step. Read the cheat sheet first: the questions only
  make sense once you know what the scoring does with the answers.</li>
  <li><strong>Part 4, the GDPR Readiness Model.</strong> The method, the four statuses, the 13 scope
  questions, all 71 activities with both evidence questions and their Article mapping, and the reverse
  Article index.</li>
  <li><strong>Appendices.</strong> The long option lists that were too big to sit inline, and a
  fifteen-minute review card: the whole pack compressed to the facts worth knowing cold.</li>
</ul>

<h2 class="sub">A four-week plan</h2>

<p>Roughly forty minutes a day, five days a week. The review column is the part people skip and the part
that produces the result: it is deliberately short, and it always covers material from earlier weeks
rather than the material you just read.</p>

<table class="plan">
<thead><tr><th>Week</th><th>New material</th><th>Review, 10 minutes</th><th>End of week</th></tr></thead>
<tbody>
<tr><td>1</td><td>Part 1, topics 1 to 18. Four topics a day: read, then say the decision rule aloud.</td><td>Yesterday's takeaway boxes, from the heading only.</td><td>Part 1 self-test, closed book. Mark honestly.</td></tr>
<tr><td>2</td><td>Part 2, sections 1 to 13. Three a day. The dates, the penalty tiers and the ten prohibitions want writing out by hand.</td><td>Part 1 takeaway boxes, four a day, plus any Part 1 self-test question you got wrong.</td><td>Part 2 self-test, closed book.</td></tr>
<tr><td>3</td><td>Part 3. One tool a day: cheat sheet first, then skim the question bank, then reconstruct the scoring model on paper without looking.</td><td>Part 2 takeaways, three a day.</td><td>Part 3 self-test. Then work one real case through the Privacy Assessment end to end.</td></tr>
<tr><td>4</td><td>Part 4. The method and statuses on day one, then three or four activity categories a day.</td><td>Part 3 cheat sheets, one a day, from memory.</td><td>Part 4 self-test, then the review card in Appendix B against the clock.</td></tr>
</tbody>
</table>

<h2 class="sub">After the four weeks</h2>

<p>Space the reviews out rather than stopping. Revisit the review card after one week, then after a
month, then after three. Each successful recall at a longer gap buys a longer gap after it, and the
whole card takes a quarter of an hour. Anything you fail twice at that spacing is worth copying onto a
single sheet of its own: a list of your own failures is a better revision aid than any summary written
by someone else, including this one.</p>

<p>The material also rewards use over revision. The fastest way to hold the six tools in memory is to
run a real process through the Privacy Assessment, a real vendor through the Third-Party Security
Assessment, and a real or invented incident through the ENISA formula. Ten minutes of that beats an
hour of rereading.</p>

<h2 class="sub">A note on printing</h2>

<p>The pack is set for A4 with page numbers, running headers and a linked table of contents. Self-test
answers always begin on a fresh page, so you can fold the answer pages back while you work. If you are
printing double-sided, the part openers are deliberately short pages: that is intentional, so each part
starts cleanly.</p>
"""

REVIEW_CARD = """
<p class="lede">The whole pack compressed to what is worth knowing cold. Time yourself: fifteen minutes
is the target once the material is in place.</p>

<h3 class="sub">Privacy, the rules that decide most cases</h3>
<ul class="card">
<li><strong>Consent is only valid where refusal is free of consequence.</strong> Informed, voluntary, specific and current, given by someone with capacity. A notice is not consent.</li>
<li><strong>Special categories:</strong> racial or ethnic origin, political opinions, religious or philosophical beliefs, trade union membership, genetic data, biometric data used to uniquely identify a person, health, sex life or sexual orientation. Needs an Article 9 condition on top of the Article 6 basis.</li>
<li><strong>A rights request needs no legal wording.</strong> Escalate immediately; do not verify identity or respond yourself. One month under GDPR-style regimes, extendable by two with notice inside the first month.</li>
<li><strong>Report incidents on suspicion, not on certainty.</strong> Notification clocks run from organisational awareness, in hours.</li>
<li><strong>Never release data to an external requester directly.</strong> Gather requester, legal basis and precise scope, then escalate.</li>
<li><strong>Secondary use:</strong> confirm the original purpose first; a new purpose may need a new notice, consent, basis, assessment or safeguards.</li>
<li><strong>Marketing is defined by primary purpose.</strong> Consent is channel-specific. A promotional link converts an operational message into marketing.</li>
<li><strong>Four classification labels:</strong> public, internal, confidential, highly confidential. When in doubt, more restrictive.</li>
</ul>

<h3 class="sub">AI Act, the numbers and lists</h3>
<ul class="card">
<li><strong>Four roles:</strong> provider, deployer, importer, distributor. Putting your name on, substantially modifying or repurposing a high-risk system makes you its provider.</li>
<li><strong>Three territorial triggers:</strong> placing on the EU market from anywhere; EU-established deployer; output used in the EU from anywhere.</li>
<li><strong>Ten prohibited practices:</strong> subliminal or deceptive manipulation; exploiting vulnerability; social scoring; predictive policing by profiling alone; emotion inference at work or in education; untargeted facial scraping; biometric categorisation inferring protected traits; real-time remote biometric identification in public by law enforcement; and from 2 December 2026, generating non-consensual intimate imagery and generating child sexual abuse material.</li>
<li><strong>Two routes to high-risk:</strong> the Annex III use-case list, and regulated products or safety components. Run both.</li>
<li><strong>Eight Annex III categories:</strong> biometrics; critical infrastructure; education; employment; essential services and benefits; law enforcement; migration and borders; justice and democratic processes.</li>
<li><strong>Twelve provider obligations:</strong> risk management, data governance, technical documentation, logging, instructions for use, human oversight, accuracy and robustness and cybersecurity, quality management, accessibility, conformity assessment, registration, cooperation.</li>
<li><strong>FRIA applies to three groups only:</strong> public-law bodies, public-service providers, and credit scoring or life and health insurance pricing. Applies from 2 December 2027.</li>
<li><strong>GPAI:</strong> four baseline duties, open-source relief covers the two documentation duties only and is cancelled by systemic risk, 10^25 floating-point operations as the systemic-risk proxy, five extra duties above it.</li>
<li><strong>Dates:</strong> in force 1 Aug 2024; prohibitions 2 Feb 2025; GPAI, governance and penalties 2 Aug 2025; transparency and Commission GPAI fines 2 Aug 2026; Annex III high-risk 2 Dec 2027; Annex I 2 Aug 2028 (Regulation (EU) 2026/1744).</li>
<li><strong>Penalties:</strong> 7% or EUR 35m; 3% or EUR 15m; 1% or EUR 7.5m. Whichever is higher, except SMEs and small mid-caps (lower).</li>
</ul>

<h3 class="sub">The six tools, one line each</h3>
<ul class="card">
<li><strong>Privacy Assessment.</strong> Escalate-only level. Two Article 35(3) triggers make a DPIA mandatory; one makes it mandatory at High.</li>
<li><strong>Full DPIA.</strong> Severity x likelihood through a 4 x 4 lookup, not a product. Nothing at Maximum severity falls below High. Three feared events: access, modification, disappearance.</li>
<li><strong>Legitimate Interest Test.</strong> Four blockers override the balance. Against-weights 1 to 4, for-factors 2 each. 12 or more against is unlikely to be available; 6 or more is finely balanced.</li>
<li><strong>AI Risk Assessment.</strong> Two independent levels: regulatory from the prohibited-use, Annex III and Annex I gates (Unsure returns Unresolved, never Limited), business from autonomy, data access, logging and guardrails as a triage score.</li>
<li><strong>Incident &amp; Breach Severity.</strong> SE = (DPC x EI) + CB. DPC 1 to 4, EI 0.25 to 1, CB up to 1.5. Bands at 2, 3 and 4. Medium notifies the authority; High notifies individuals too.</li>
<li><strong>Third-Party Security.</strong> Inherent risk out of 9 from intake alone, maturity from the control answers, residual from a lookup. Critical inherent never falls below Medium residual.</li>
</ul>

<h3 class="sub">The readiness model</h3>
<ul class="card">
<li><strong>The inversion:</strong> record activities you perform, derive the Articles they evidence. 71 activities, 13 categories, 13 scope questions, 37 Articles.</li>
<li><strong>Statuses:</strong> Implemented 1, In progress 0.5, Not in place 0, Not applicable excluded. Not in place is the right answer when you do not know.</li>
<li><strong>Two evidence questions per activity:</strong> does the mechanism exist and is it correct (Privacy Office), and does it reflect what actually happens (Operational Unit). The gap between them is the finding.</li>
<li><strong>Gap order:</strong> lowest score first, then widest Article footprint. The first fix buys the most coverage.</li>
<li><strong>What a high score does not mean:</strong> compliance. It measures demonstrable accountability across the Articles an activity can evidence.</li>
</ul>
"""
