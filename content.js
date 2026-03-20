/**
 * FeedReady — content.js
 * "Clean your image, not your creativity."
 *
 * Renders as a small fixed card in the bottom-right corner of LinkedIn.
 * Canvas clean logic is unchanged — pixel-perfect redraw, zero metadata.
 *
 * Author  : Anshumaan Vishnu
 * Website : https://ansh.asia
 * GitHub  : https://github.com/AnshumaanVishnu/FeedReady
 * LinkedIn: https://www.linkedin.com/in/anshumaanvishnu/
 * X       : https://x.com/StartupsWala
 */

(function () {
  'use strict';

  const DEVELOPER = {
    name:     'Anshumaan Vishnu',
    website:  'https://ansh.asia',
    github:   'https://github.com/AnshumaanVishnu/FeedReady',
    linkedin: 'https://www.linkedin.com/in/anshumaanvishnu/',
    x:        'https://x.com/StartupsWala',
  };

  const CARD_ID = 'fr-card-root';
  const PILL_ID = 'fr-pill-root';

  // ── Metadata scanner ──────────────────────────────────────────
  // Reads the first 512KB of the file (metadata is always at the
  // start of an image file) and checks for known byte signatures.
  // Returns only what is actually found — never guesses.
  const META_SIGNATURES = [
    { id: 'c2pa',    label: 'C2PA / Content Credentials', patterns: ['c2pa', 'C2PA', 'contentauth', 'contentcredentials', 'Content Credentials', 'cai:'] },
    { id: 'firefly', label: 'Adobe Firefly',              patterns: ['firefly', 'Firefly', 'GeneratedAI'] },
    { id: 'dalle',   label: 'DALL-E / OpenAI',            patterns: ['dall-e', 'DALL-E', 'openai'] },
    { id: 'mj',      label: 'Midjourney',                 patterns: ['midjourney', 'Midjourney'] },
    { id: 'sd',      label: 'Stable Diffusion',           patterns: ['stable-diffusion', 'stability.ai'] },
    { id: 'exif',    label: 'EXIF',                       patterns: ['Exif\x00\x00', 'Exif\x00II', 'Exif\x00MM'] },
    { id: 'xmp',     label: 'XMP / Adobe tags',           patterns: ['xpacket', 'x:xmpmeta', '<rdf:RDF'] },
    { id: 'iptc',    label: 'IPTC',                       patterns: ['Photoshop 3.0', 'IPTC-NAA'] },
  ];

  function scanFile(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      const bail   = setTimeout(() => resolve([]), 6000);

      reader.onload = e => {
        clearTimeout(bail);
        const bytes = new Uint8Array(e.target.result);
        let str = '';
        for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);

        const found = META_SIGNATURES.filter(sig =>
          sig.patterns.some(p => str.includes(p))
        );
        resolve(found);
      };

      reader.onerror = () => { clearTimeout(bail); resolve([]); };
      reader.readAsArrayBuffer(file.slice(0, 512 * 1024));
    });
  }

  // ── Canvas redraw — strips all metadata ───────────────────────
  function canvasClean(file) {
    return new Promise(resolve => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width  = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d').drawImage(img, 0, 0);
        URL.revokeObjectURL(objectUrl);

        const mime      = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const ext       = mime === 'image/png' ? 'png' : 'jpg';
        const cleanName = file.name.replace(/\.[^.]+$/, '') + '_feedready.' + ext;

        canvas.toBlob(blob => {
          resolve(new File([blob], cleanName, { type: mime }));
        }, mime, 0.97);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    });
  }

  // ── Download ───────────────────────────────────────────────────
  function triggerDownload(file) {
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(file);
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000);
  }

  // ── Build card ─────────────────────────────────────────────────
  function buildCard() {
    // ── Card shell ──────────────────────────────────────────────
    const card = document.createElement('div');
    card.className = 'fr-card';
    card.id = CARD_ID;

    // Header
    const header = document.createElement('div');
    header.className = 'fr-card-header';

    const brand = document.createElement('span');
    brand.className   = 'fr-card-brand';
    brand.textContent = '✦ FeedReady';

    const toggleBtn = document.createElement('button');
    toggleBtn.className   = 'fr-card-toggle';
    toggleBtn.textContent = '−';
    toggleBtn.title       = 'Minimise';

    header.appendChild(brand);
    header.appendChild(toggleBtn);

    // Body
    const body = document.createElement('div');
    body.className = 'fr-card-body';

    // Pick button
    const pickLabel = document.createElement('label');
    pickLabel.className   = 'fr-btn';
    pickLabel.textContent = 'Get image post-ready';
    pickLabel.title       = 'Pick an image — FeedReady strips metadata and downloads a clean copy';

    const fileInput = document.createElement('input');
    fileInput.type      = 'file';
    fileInput.accept    = 'image/*';
    fileInput.className = 'fr-file-input';
    pickLabel.appendChild(fileInput);

    // Status
    const status = document.createElement('div');
    status.className = 'fr-status';

    // Detection tags — only rendered when real metadata is found
    const detected = document.createElement('div');
    detected.className = 'fr-detected';

    // Disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.className   = 'fr-disclaimer';
    disclaimer.textContent =
      'FeedReady improves image compatibility and removes unnecessary metadata. ' +
      'We support responsible AI use. Please use this tool ethically and be ' +
      'transparent about AI-generated content where appropriate.';

    body.appendChild(pickLabel);
    body.appendChild(status);
    body.appendChild(detected);
    body.appendChild(disclaimer);

    card.appendChild(header);
    card.appendChild(body);

    // ── Minimise pill ───────────────────────────────────────────
    const pill = document.createElement('button');
    pill.className = 'fr-pill';
    pill.id        = PILL_ID;
    pill.innerHTML = '✦ FeedReady';
    pill.title     = 'Open FeedReady';

    // ── Toggle behaviour ────────────────────────────────────────
    toggleBtn.addEventListener('click', () => {
      card.style.display = 'none';
      pill.classList.add('fr-show');
    });

    pill.addEventListener('click', () => {
      pill.classList.remove('fr-show');
      card.style.display = '';
      // Re-trigger animation
      card.style.animation = 'none';
      requestAnimationFrame(() => { card.style.animation = ''; });
    });

    // ── File pick handler ───────────────────────────────────────
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;

      pickLabel.classList.add('fr-loading');
      pickLabel.childNodes[0].nodeValue = '⏳ Scanning… ';
      status.textContent = '';
      detected.innerHTML = '';

      // Scan and clean run in parallel — scan reads first 512KB,
      // clean does the full redraw. Both finish before we show result.
      const [findings, cleanFile] = await Promise.all([
        scanFile(file),
        canvasClean(file),
      ]);

      triggerDownload(cleanFile);

      pickLabel.classList.remove('fr-loading');
      pickLabel.childNodes[0].nodeValue = '✓ Ready! ';
      status.innerHTML =
        '<strong>' + cleanFile.name + '</strong><br>Upload this file to LinkedIn';

      // Show detected tags only if something was actually found
      if (findings.length > 0) {
        const label = document.createElement('div');
        label.className   = 'fr-detected-label';
        label.textContent = 'Removed:';
        detected.appendChild(label);

        const tagRow = document.createElement('div');
        tagRow.className = 'fr-tag-row';
        findings.forEach(f => {
          const tag = document.createElement('span');
          tag.className   = 'fr-tag';
          tag.textContent = f.label;
          tagRow.appendChild(tag);
        });
        detected.appendChild(tagRow);
      }

      fileInput.value = '';

      setTimeout(() => {
        pickLabel.childNodes[0].nodeValue = 'Get image post-ready';
        status.textContent = '';
        detected.innerHTML = '';
      }, 12000);
    });

    return { card, pill };
  }

  // ── Inject once ────────────────────────────────────────────────
  function inject() {
    if (document.getElementById(CARD_ID)) return true;
    if (!document.body) return false;

    const { card, pill } = buildCard();
    document.body.appendChild(card);
    document.body.appendChild(pill);
    return true;
  }

  // Body may not exist at document_idle on slow connections, poll briefly
  if (!inject()) {
    let attempts = 0;
    const poller = setInterval(() => {
      if (inject() || ++attempts > 20) clearInterval(poller);
    }, 300);
  }

})();
