/**
 * FeedReady — content.js
 * "Clean your image, not your creativity."
 *
 * Optimises images for LinkedIn by removing compatibility metadata
 * before upload — so your post looks exactly how you intended.
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

  const INJECTED_ATTR = 'data-feedready-injected';

  // ── Canvas redraw ──────────────────────────────────────────────
  // Redraws the image pixel-by-pixel onto a fresh canvas and exports
  // it as a new file. The output contains only pixel data — all
  // embedded metadata tags are gone because the canvas API has no
  // mechanism to carry them through.
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

        const mime     = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const ext      = mime === 'image/png' ? 'png' : 'jpg';
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
    const anchor    = document.createElement('a');
    anchor.href     = URL.createObjectURL(file);
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      URL.revokeObjectURL(anchor.href);
      anchor.remove();
    }, 3000);
  }

  // ── Widget ─────────────────────────────────────────────────────
  function buildWidget() {
    const wrapper = document.createElement('div');
    wrapper.className = 'fr-widget';

    const inner = document.createElement('div');
    inner.className = 'fr-inner';

    // Top row — brand + button
    const topRow = document.createElement('div');
    topRow.className = 'fr-top';

    const brand = document.createElement('span');
    brand.className   = 'fr-brand';
    brand.textContent = '✦ FeedReady';

    const pickLabel = document.createElement('label');
    pickLabel.className = 'fr-btn';
    pickLabel.textContent = 'Get image post-ready';
    pickLabel.title = 'Pick an image — FeedReady optimises it for LinkedIn and downloads a clean copy';

    const fileInput = document.createElement('input');
    fileInput.type      = 'file';
    fileInput.accept    = 'image/*';
    fileInput.className = 'fr-file-input';
    pickLabel.appendChild(fileInput);

    topRow.appendChild(brand);
    topRow.appendChild(pickLabel);

    // Status line
    const statusLine = document.createElement('div');
    statusLine.className = 'fr-status';

    // Disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.className = 'fr-disclaimer';
    disclaimer.textContent =
      'FeedReady improves image compatibility and removes unnecessary metadata. ' +
      'We support responsible AI use. Please use this tool ethically and be ' +
      'transparent about AI-generated content where appropriate.';

    inner.appendChild(topRow);
    inner.appendChild(statusLine);
    inner.appendChild(disclaimer);
    wrapper.appendChild(inner);

    // ── File pick handler ──────────────────────────────────────
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;

      pickLabel.classList.add('fr-loading');
      pickLabel.childNodes[0].nodeValue = '⏳ Optimising… ';
      statusLine.textContent = '';

      const cleanFile = await canvasClean(file);
      triggerDownload(cleanFile);

      pickLabel.classList.remove('fr-loading');
      pickLabel.childNodes[0].nodeValue = '✓ Ready to post! ';
      statusLine.innerHTML =
        '<strong>' + cleanFile.name + '</strong> downloaded — upload this to LinkedIn';

      fileInput.value = '';

      setTimeout(() => {
        pickLabel.childNodes[0].nodeValue = 'Get image post-ready';
        statusLine.textContent = '';
      }, 10000);
    });

    return wrapper;
  }

  // ── Inject above LinkedIn's post composer ──────────────────────
  function injectWidget() {
    const candidates = [
      '.share-box-feed-entry__top-bar',
      '.share-box-feed-entry__closed-share-box',
      '.share-box-feed-entry',
      'main .scaffold-layout__main > div:first-child',
    ];

    for (const selector of candidates) {
      const el = document.querySelector(selector);
      if (el && !el.getAttribute(INJECTED_ATTR)) {
        el.setAttribute(INJECTED_ATTR, '1');
        el.insertAdjacentElement('beforebegin', buildWidget());
        return true;
      }
    }

    return false;
  }

  if (!injectWidget()) {
    let attempts = 0;
    const poller = setInterval(() => {
      if (injectWidget() || ++attempts > 30) clearInterval(poller);
    }, 500);
  }

})();
