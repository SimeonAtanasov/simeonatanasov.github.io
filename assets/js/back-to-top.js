/*
	Back to top button, shared by the long tool pages (GDPR Readiness,
	Privacy & AI Assessment, Risk Matrix). The digest and advice pages carry
	their own copy inside their page script. Appears after one screen of
	scrolling, scrolls smoothly to the top. Styled by assets/css/back-to-top.css.
*/
(function () {
	var btn = document.createElement('button');
	btn.type = 'button';
	btn.className = 'site-top';
	btn.id = 'site-top';
	btn.setAttribute('aria-label', 'Back to top');
	btn.hidden = true;
	btn.innerHTML = '<i class="fas fa-arrow-up"></i> Top';
	document.body.appendChild(btn);
	btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
	window.addEventListener('scroll', function () { btn.hidden = window.scrollY < 600; }, { passive: true });
})();
