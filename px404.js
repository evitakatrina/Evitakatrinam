/* 404: the digits are drawn as pixels on the same square grid as the contribution graph.
   They assemble diagonally on load, a slow wave of Finder-blue sweeps across them,
   and they come apart under the cursor. */
(() => {
  const px = document.getElementById('px');
  if (!px) return;

  // 5×7 bitmaps, one string per row
  const GLYPH = {
    '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
    '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  };
  const word = '404', gap = 1;                       // one blank column between digits
  const rows = 7, cols = word.length * 5 + (word.length - 1) * gap;

  // flatten the word into one row-major bitmap
  const grid = Array.from({ length: rows }, (_, y) =>
    word.split('').map(ch => GLYPH[ch][y]).join('0'.repeat(gap))
  );

  px.style.setProperty('--cols', cols);
  px.style.setProperty('--rows', rows);

  // deterministic scatter per cell, so every visit falls apart the same way
  const rand = (x, y) => { const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return s - Math.floor(s); };

  let html = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] !== '1') { html += '<i class="off"></i>'; continue; }
      const r = rand(x, y);
      html += `<i style="--in:${(x + y) * 26}ms; --wave:${-(x + y) * 90}ms; --fy:${(14 + r * 26).toFixed(0)}px; --rot:${(r * 24 - 12).toFixed(1)}deg; --sd:${(r * 160).toFixed(0)}ms"><b></b></i>`;
    }
  }
  px.innerHTML = html;
  px.classList.add('ready');
})();
