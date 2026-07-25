(function () {
  const name    = {{ site.Params.author.name | jsonify | safeJS }};
  const email   = {{ site.Params.author.email | jsonify | safeJS }};
  const website = {{ (strings.TrimRight "/" (site.Params.siteURL | default site.BaseURL)) | jsonify | safeJS }};

  const parts = name.split(' ');
  const family = parts.length > 1 ? parts.pop() : '';
  const given  = parts.join(' ');

  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:' + name,
    'N:' + family + ';' + given + ';;;',
    'EMAIL;TYPE=INTERNET:' + email,
    'URL:' + website,
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
      out.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 4, scalable: true });
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    });
  }
})();

(function () {
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
})();
