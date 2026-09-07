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

  /* GitHub contribution graph: live data for evitakatrina, rendered as a 53×7 grid */
  const ghSec = document.getElementById('gh-sec');
  if (ghSec) {
    // 1) our own endpoint (GitHub GraphQL, includes private contributions); 2) public-profile mirror as fallback
    fetch('/api/contributions').then(r => r.ok ? r.json() : Promise.reject(r.status))
      .catch(() => fetch('https://github-contributions-api.jogruber.de/v4/evitakatrina?y=last').then(r => r.ok ? r.json() : Promise.reject(r.status)))
      .then(d => {
        const all = d.contributions;
        if (!all || !all.length) return;
        const gh = ghSec.querySelector('.gh'), grid = document.getElementById('gh-grid'), months = document.getElementById('gh-months');
        const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const draw = () => {
          // fit as many whole weeks as the column allows (all 53 on desktop, fewer on a phone), newest first
          const cs = getComputedStyle(gh), cell = parseFloat(cs.getPropertyValue('--cell')), gap = parseFloat(cs.getPropertyValue('--gap'));
          const fit = Math.max(8, Math.floor((gh.clientWidth + gap) / (cell + gap)));
          const endPad = 6 - new Date(all[all.length - 1].date + 'T00:00:00').getDay();
          const maxDays = fit * 7 - endPad;
          const days = all.slice(-maxDays);
          const pad = new Date(days[0].date + 'T00:00:00').getDay();
          let html = '';
          for (let i = 0; i < pad; i++) html += '<i style="visibility:hidden"></i>';
          for (const x of days) html += `<i data-l="${x.level}" title="${x.count} contribution${x.count === 1 ? '' : 's'} on ${x.date}"></i>`;
          grid.innerHTML = html;
          const cols = Math.ceil((pad + days.length) / 7);
          let m = '', last = -1, lastCol = -9;
          for (let c = 0; c < cols; c++) {
            const idx = Math.max(0, c * 7 - pad);
            const mo = new Date(days[Math.min(idx, days.length - 1)].date + 'T00:00:00').getMonth();
            if (mo !== last && c - lastCol >= 3 && c < cols - 2) { m += `<span>${names[mo]}</span>`; lastCol = c; }
            else m += '<span></span>';
            last = mo;
          }
          months.innerHTML = m;
        };
        ghSec.hidden = false;   // must be visible before measuring
        draw();
        let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(draw, 120); });
        const total = d.total && (d.total.lastYear ?? Object.values(d.total)[0]);
        document.getElementById('gh-total').textContent = `${total} contribution${total === 1 ? '' : 's'} in the last year.`;
        requestAnimationFrame(() => ghSec.querySelectorAll('.up').forEach(e => e.style.transitionDelay = '0s'));
      })
      .catch(() => { /* API unavailable: section stays hidden */ });
  }
})();