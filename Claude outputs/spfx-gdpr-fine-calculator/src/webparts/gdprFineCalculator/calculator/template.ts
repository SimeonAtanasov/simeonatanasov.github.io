/* The markup the web part mounts.

   Ids are prefixed per web part instance rather than fixed, so two copies of
   the calculator can sit on one page without their labels pointing at each
   other's controls. Class names are not prefixed: they are namespaced by the
   .fc-spfx root instead, and the stylesheet is written to match.

   The prose is the website's, unchanged apart from the links, which would
   point outside the tenant. */

export interface TemplateOptions {
  heading?: string;
  showIntro?: boolean;
  showHowTo?: boolean;
  showMethod?: boolean;
}

function esc(t: string): string {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function buildTemplate(p: string, opts: TemplateOptions): string {
  let h = '';

  if (opts.heading) {
    h += '<h2 class="fc-title">' + esc(opts.heading) + '</h2>';
  }

  if (opts.showIntro) {
    h += '<p class="fc-lead">Supervisory authorities do not publish a formula. What they publish is decisions. '
      + 'This tool takes the published decisions where the fined organisation’s turnover is known, finds the ones '
      + 'closest to your own size and circumstance, and shows what those organisations actually paid as a proportion '
      + 'of turnover. It is a benchmark drawn from enforcement practice, not a prediction and not a legal opinion.</p>';
  }

  if (opts.showHowTo) {
    h += '<section class="fc-block fc-howto">'
      + '<h3>How to use this</h3>'
      + '<ol class="fc-steps">'
      + '<li><strong>Enter your annual turnover.</strong> Use the whole undertaking, not one legal entity. '
      + 'Art. 83 refers to the undertaking, which the Court of Justice reads as the whole economic unit, and it is '
      + 'the same basis used for every organisation in the comparison set. You can type <code>20bn</code>, '
      + '<code>450m</code> or a plain number.</li>'
      + '<li><strong>Pick what went wrong, or leave it.</strong> The categories come from the enforcement tracker’s '
      + 'own classification, one per decision. <strong>If you do not know which Article is in play, leave it on '
      + '"Not sure".</strong> You are not giving up much: once organisations of a similar size are compared with each '
      + 'other, the violation type barely moves the answer. The number beside each category is how many comparable '
      + 'cases carry a known turnover, which tells you how much weight it can bear.</li>'
      + '<li><strong>Narrow by sector if it helps.</strong> Optional. The tool widens the search automatically if too '
      + 'few peers match, and tells you when it did.</li>'
      + '<li><strong>Read all three numbers.</strong> The typical outcome, the realistic range and the statutory '
      + 'ceiling. The range matters more than the midpoint: fines for the same conduct vary by orders of magnitude, '
      + 'and any single figure hides that.</li>'
      + '</ol>'
      + '<p class="fc-note"><strong>Nothing you type is sent anywhere.</strong> Every figure is bundled here, the '
      + 'calculation runs entirely in your browser, and no turnover you enter is transmitted to anyone: not to '
      + 'the owner of this page, not to anybody hosting it, not to any other service.</p>'
      + '</section>';
  }

  /* ------------------------------------------------------------- the inputs --- */

  h += '<section class="fc-block">'
    + '<h3>Your organisation</h3>'
    + '<div class="fc-inputs">'
    + '<div class="fc-fields">'

    + '<div class="fc-field">'
    + '<label for="' + p + '-turnover">Annual turnover of the undertaking</label>'
    + '<input type="text" id="' + p + '-turnover" placeholder="for example 20bn, 450m or 12500000" autocomplete="off">'
    + '<p class="fc-hint">Worldwide, most recent full financial year.</p>'
    + '</div>'

    + '<div class="fc-field">'
    + '<label for="' + p + '-type">What went wrong</label>'
    + '<select id="' + p + '-type"></select>'
    + '<p class="fc-hint" id="' + p + '-typenote"></p>'
    + '</div>'

    + '<div class="fc-field">'
    + '<label for="' + p + '-sector">Sector (optional)</label>'
    + '<select id="' + p + '-sector"><option value="">Any sector</option></select>'
    + '<p class="fc-hint">Narrows the peer set. Dropped automatically if too few peers match.</p>'
    + '</div>'

    + '</div>'
    + '<div class="fc-toggles">'
    + '<label><input type="checkbox" id="' + p + '-sourced"> Use only peers whose turnover has a recorded source</label>'
    + '<label><input type="checkbox" id="' + p + '-nofin"> Exclude banks and insurers</label>'
    + '<label><input type="checkbox" id="' + p + '-noep"> Exclude cookie and ePrivacy fines under national law</label>'
    + '</div>'
    + '</div>'
    + '</section>';

  /* ------------------------------------------------------------ the results --- */

  h += '<section class="fc-block fc-results" id="' + p + '-output"></section>';

  h += '<div class="fc-actions"><button type="button" id="' + p + '-reset" class="fc-secondary">Reset</button></div>';

  /* ------------------------------------------------------------- the method --- */

  if (opts.showMethod) {
    h += '<section class="fc-block fc-method">'
      + '<h3 class="fc-method-title">How the number is worked out</h3>'

      + '<h4>The index</h4>'
      + '<p>For every published decision where the organisation’s turnover is known, the index is the fine divided '
      + 'by that turnover. It is the only figure that lets a EUR 3,000 fine in Romania and a EUR 225 million fine in '
      + 'Ireland sit on the same scale.</p>'

      + '<h4>Choosing the peers</h4>'
      + '<p>Peers are the cases in the same violation category whose turnover is within 50% of yours, optionally in the '
      + 'same sector. If fewer than eight organisations match, the turnover band widens in defined steps, then the '
      + 'sector filter is dropped, then the violation filter. The tool always says which step it ended on. It never '
      + 'quietly averages a handful of rows and presents the result as an answer.</p>'
      + '<p>The turnover band is not decoration. Fines scale far less than proportionally with size: across this data '
      + 'the fitted elasticity is about 0.37, meaning a company ten times larger draws a fine only about twice as '
      + 'large. A small company’s index is therefore not comparable with a large one’s, and an average taken '
      + 'across sizes is meaningless.</p>'

      + '<h4>Not knowing what went wrong costs you very little</h4>'
      + '<p>Knowing whether a decision turns on Art. 6 rather than Art. 5 is a lawyer’s judgement, and the people '
      + 'who most need a rough figure are often the ones who cannot make it. So "Not sure" is the default here rather '
      + 'than a fallback. Inside the EUR 1bn to 100bn band the five best evidenced violation categories have median '
      + 'indices between 0.0028% and 0.015% of turnover, a spread of about five times. Size moves the number by about a '
      + 'hundred and seventy times across the whole range, from a median of 0.98% of turnover below EUR 100 million to '
      + '0.0057% above EUR 10 billion. So the category is not nothing, but size matters roughly thirty times more, and '
      + 'size is the one thing you always know.</p>'
      + '<p>The one place the choice does matter is the ceiling, because Art. 83 puts different Articles in the 2% and '
      + '4% tiers. With no category chosen the tool assumes the 4% tier: that is the cautious reading, and 73% of the '
      + 'cases here sit in it. If the decision cited only Art. 28, 31, 32, 33, 34 or 58 the ceiling would be the 2% one '
      + 'instead, and the card says which is in play.</p>'

      + '<h4>One vote per organisation</h4>'
      + '<p>Some regulators fine the same operator repeatedly, in one case more than sixty times. Each organisation is '
      + 'collapsed to a single index, the median of its own cases, before percentiles are taken. Without that step one '
      + 'heavily fined operator would decide the answer for its whole size band.</p>'

      + '<h4>Median and percentiles, not an average</h4>'
      + '<p>The index distribution is heavily skewed: a few small organisations paid a large share of their turnover, '
      + 'which drags any mean upwards by an order of magnitude. The headline is the median across peer organisations, '
      + 'and the range is the 25th to the 90th percentile. Across the whole dataset the 25th percentile across organisations is about '
      + '0.0020% of turnover and the 90th about 1.6%, a spread of nearly three orders of magnitude for the same statute.</p>'

      + '<h4>The statutory ceiling</h4>'
      + '<p>Art. 83(4) caps the relevant infringements at 2% of total worldwide annual turnover <em>or EUR 10 million, '
      + 'whichever is higher</em>. Art. 83(5) caps the rest at 4% <em>or EUR 20 million</em>. The absolute floor is the '
      + 'part usually forgotten: an organisation needs roughly EUR 500 million of turnover before 4% of it exceeds EUR '
      + '20 million. Below that, the ceiling is a flat EUR 20 million and turnover does not enter into it, which is why '
      + 'small organisations occasionally pay a double-digit percentage of revenue entirely lawfully.</p>'

      + '<h4>Cookie fines are not GDPR fines</h4>'
      + '<p>Five of the largest decisions in this data, including the CNIL’s fines of EUR 200 million and EUR 125 '
      + 'million against Google and EUR 60 million against Facebook, cite Art. 82 of the French loi Informatique et '
      + 'Libertes rather than any GDPR Article. They are national ePrivacy enforcement about cookies and trackers, not '
      + 'Art. 83 cases, even though they are routinely quoted as GDPR records. They are kept in the comparison because '
      + 'they are real privacy enforcement at a known turnover, they are marked in the peer table, and the toggle above '
      + 'removes them.</p>'

      + '<h4>Where the data comes from</h4>'
      + '<p>Fines, dates, countries, cited Articles and the violation classification come from the public GDPR '
      + 'enforcement tracker. Turnover is not in that source and had to be attached separately, from annual reports, '
      + 'statutory filings and national company registers. Each peer row shows the confidence attached to its turnover '
      + 'figure, and the peer set can be restricted to rows with a recorded source. Every figure travels inside this '
      + 'package: the web part makes no network call of any kind.</p>'
      + '<p class="fc-note">Coverage: <strong id="' + p + '-count"></strong> carry both a fine and a turnover. That is '
      + 'a minority of all published decisions, because most fined organisations are public bodies, micro-entities or '
      + 'private companies whose accounts are not published for free.</p>'

      + '<div class="fc-caveat">'
      + '<p><strong>What this tool cannot tell you.</strong> Turnover explains under 10% of the variation in fine size '
      + 'across this data. Everything a regulator actually weighs under Art. 83(2): how many people were affected, '
      + 'whether the conduct was negligent or deliberate, what was done to mitigate it, how the organisation behaved '
      + 'during the investigation, whether it had been fined before, all of it is absent from these figures because it '
      + 'is not in any structured source. Two organisations of identical size doing identical things can and do receive '
      + 'fines an order of magnitude apart. Treat the range as the scale of exposure, not as a number to put in a risk '
      + 'register without a caveat beside it.</p>'
      + '<p><strong>Categories with too few peers.</strong> Information obligations, breach notification, DPO '
      + 'involvement and processing agreements are marked thin. Those violations are enforced overwhelmingly against '
      + 'public bodies and very small organisations, which have no published turnover, so no amount of further research '
      + 'will make them benchmarkable. The tool will still calculate, but the warning it shows should be believed.</p>'
      + '<p>This is not legal advice and not a prediction of what any authority would do.</p>'
      + '</div>'
      + '</section>';
  }

  return h;
}
