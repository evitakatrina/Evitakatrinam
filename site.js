/* entrance + typewriter for the footer quote, as on the reference */
(() => {
  const h = document.documentElement;
  if (location.search.includes('static')) { h.classList.add('static'); }
  if (location.search.includes('open')) { document.querySelectorAll('.fd').forEach(f => f.classList.add('open')); }
  requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add('in')));
  setTimeout(() => h.classList.add('in'), 800);   // safety: never leave the page hidden

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.quote').forEach(q => {
    const text = q.dataset.text || '';
    const typed = q.querySelector('.typed'), cur = q.querySelector('.cur');
    if (reduced) { typed.textContent = text; cur.remove(); return; }
    let i = 0;
    const step = () => {
      if (i <= text.length) {
        typed.textContent = text.slice(0, i);
        cur.textContent = i < text.length ? text[i] : '';
        i++;
        setTimeout(step, 24 + Math.random() * 46);
      } else {
        cur.remove();
      }
    };
    setTimeout(step, 1100);
  });
})();
