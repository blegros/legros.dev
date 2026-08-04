function initQRGenerator() {
  const name    = {{ site.Params.author.name | jsonify | safeJS }};
  const email   = {{ site.Params.author.email | jsonify | safeJS }};
  const website = {{ (strings.TrimRight "/" (site.Params.siteURL | default site.BaseURL)) | jsonify | safeJS }};

  const parts = name.split(' ');
  const family = parts.length > 1 ? parts.pop() : '';
  const given  = parts.join(' ');
  const titleEl = document.querySelector('.resume-role');
  const title = titleEl ? titleEl.innerText : 'Software Engineer / Architect / Wearer of Hats';

  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:' + name,
    'N:' + family + ';' + given + ';;;',
    'EMAIL;TYPE=INTERNET:' + email,
    'URL:' + website,
    'ADR:;;;Indialantic;FL;32903;',
    'NOTE:' + title,
    'END:VCARD',
    ''
  ].join('\r\n');

  const btn = document.getElementById('qr-generate-btn');
  const dlg = document.getElementById('qr-dialog');
  const out = document.getElementById('qr-output');

  if (btn && dlg && out) {
    btn.addEventListener('click', function () {
      const qr = qrcode(0, 'H');
      qr.addData(vcard);
      qr.make();
      
      const cellSize = 6;
      const margin = 4;
      const moduleCount = qr.getModuleCount();
      const size = moduleCount * cellSize + margin * 2 * cellSize;
      
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Removed white background fill so it stays transparent
      
      ctx.fillStyle = '#000000';
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect((col + margin) * cellSize, (row + margin) * cellSize, cellSize, cellSize);
          }
        }
      }
      
      out.innerHTML = '';
      out.appendChild(canvas);
      
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    });
  }
}

function initJobScrollSpy() {
  const jobs = Array.from(document.querySelectorAll(".resume-job"));
  if (!jobs.length) return;

  const OFFSET = 120; // px from the top that counts as "at the top of the viewport"
  let ticking = false;

  function update() {
    ticking = false;
    let active = null;
    for (const job of jobs) {
      if (job.getBoundingClientRect().top - OFFSET <= 0) active = job;
      else break; // jobs are in document (top-to-bottom) order
    }
    for (const job of jobs) {
      job.classList.toggle("is-active", job === active);
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

initQRGenerator();
initJobScrollSpy();
