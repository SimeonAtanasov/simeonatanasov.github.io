/* Entry point for the single file build.

   The SharePoint web part and this standalone page are the same calculator: both
   import the same four modules, so a change to the method reaches both or
   neither. The only thing this file adds is the mount, which the web part shell
   does in its render().

   Built with:
     npx esbuild standalone/entry.ts --bundle --format=iife --target=es2017 \
       --legal-comments=inline --outfile=<temp>

   and then inlined into the .aspx wrapper. tools/build-standalone.js does both
   steps and writes the finished file. */

import { mountCalculator } from '../src/webparts/gdprFineCalculator/calculator/calculator';
import { ensureStyles } from '../src/webparts/gdprFineCalculator/calculator/styles';

/* Matches the web part: below this the three selectors stop being readable side
   by side, so they stack. Read off the container rather than the viewport, since
   the page may be framed. */
const NARROW_AT = 700;

function start(): void {
  const root = document.getElementById('fc-root');
  if (!root) { return; }

  ensureStyles();

  const applyWidth = function (): void {
    const narrow = root.clientWidth > 0 && root.clientWidth < NARROW_AT;
    root.className = narrow ? 'fc-spfx fc-narrow' : 'fc-spfx';
  };

  applyWidth();

  mountCalculator(root, {
    prefix: 'fc',
    heading: '',           /* the page header supplies the title */
    showIntro: false,      /* and the framing paragraph, so do not repeat it */
    showHowTo: true,
    showMethod: true
  });

  let tick = false;
  window.addEventListener('resize', function (): void {
    if (tick) { return; }
    tick = true;
    window.setTimeout(function (): void { tick = false; applyWidth(); }, 120);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
