# ✦ FeedReady

**Clean your image, not your creativity.**

FeedReady is a Chrome extension that prepares your images for LinkedIn before you post — quietly, locally, in one click. No accounts. No uploads. No fuss.

> Built for creators who want their work to speak for itself.

---

## Why FeedReady?

Modern platforms process images using multiple signals — including metadata, encoding formats, and internal optimisations.

Sometimes, images carry unnecessary technical data that may affect how they are displayed, processed, or interpreted by the platform.

FeedReady solves this by preparing your images **before** upload. Think of it as a quick pre-flight check for your visuals — so what you see is what your audience gets.

---

## Features

- ✦ **One-click image prep** — pick your image, get a clean copy instantly
- 🔒 **100% local processing** — your image never leaves your device
- 🧹 **Deep metadata removal** — strips EXIF, XMP, C2PA, IPTC and tool-specific tags
- ⚡ **Zero friction** — lives right above your LinkedIn post composer
- 🪶 **Lightweight** — no dependencies, no background processes, no tracking
- 🌐 **Works on any LinkedIn page** — feed, profile, company pages

---

## How It Works

```
Your image (with embedded metadata)
  → Scan first 512KB for known metadata signatures
  → Redraw pixel-by-pixel onto a blank HTML5 <canvas>
  → Export canvas as a fresh file
  → Download to your device as yourimage_feedready.jpg

Output: pixel-identical image · zero metadata
```

**Step 1** — Open LinkedIn. A small **✦ FeedReady** card appears fixed to the bottom-right corner of the page

**Step 2** — Click **"Get image post-ready"**, pick your image — FeedReady scans and cleans it entirely in your browser

**Step 3** — Any detected metadata (C2PA, EXIF, XMP, AI tool tags) is shown as amber tags in the card so you know exactly what was removed

**Step 4** — The clean `_feedready` file downloads automatically — upload it to LinkedIn and post as normal

The card can be minimised to a small pill anytime and restored with one click.

---

## Responsible Use

FeedReady is built to support creators — not to mislead platforms or audiences.

- ✅ This tool does not modify the meaning or authenticity of your content
- ✅ It removes only technical metadata — pixels are never altered
- ⚠️ It does not guarantee removal of platform-applied labels
- ⚠️ Platforms may still apply their own detection systems independently

We encourage transparency when sharing AI-generated content. If your work is AI-assisted, consider saying so — your audience will appreciate the honesty.

**Use responsibly.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Extension | Chrome MV3 (Manifest V3) |
| Image processing | HTML5 Canvas API |
| Storage | Chrome Storage API (local, toggle state only) |
| Styling | Vanilla CSS injected into LinkedIn's DOM |
| Runtime | Pure JavaScript — zero dependencies |

No build step. No bundler. No framework. Just the browser doing what it's already good at.

---

## Privacy First

FeedReady was designed with privacy as a constraint, not a feature.

- **No network requests** — the extension makes zero outbound calls
- **No analytics** — nothing is tracked, logged, or reported
- **No permissions overreach** — only requests `storage` (to save your on/off toggle) and host access to `linkedin.com`
- **Your images never leave your device** — all processing happens in your browser tab using the Canvas API
- **Open source** — every line of code is readable right here

---

## Use Cases

- 🎨 **AI-generated images** — post your AI artwork without platform interference
- 📸 **Photography** — strip GPS coordinates and camera metadata before sharing
- 🏢 **Brand content** — remove tool fingerprints from design exports before publishing
- 📢 **Marketers & founders** — get your creative assets post-ready without platform labels affecting presentation
- 🛠️ **Developers & builders** — share screenshots and visuals without embedded software metadata

---

## Roadmap

- [ ] Firefox / Edge support
- [ ] Bulk image cleaning (multiple files at once)
- [ ] Drag-and-drop interface
- [ ] Support for additional platforms (Twitter/X, Instagram)
- [ ] Metadata preview — show what was removed before downloading
- [ ] Figma plugin (export clean directly from Figma)

Have an idea? [Open an issue](https://github.com/AnshumaanVishnu/FeedReady/issues) — contributions and suggestions are welcome.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Clone the repo
git clone https://github.com/AnshumaanVishnu/FeedReady.git

# Load in Chrome
# chrome://extensions → Developer mode → Load unpacked → select /FeedReady
```

Please keep PRs focused — one fix or feature per pull request. If you're updating selectors because LinkedIn changed their DOM, mention which UI context broke in the PR description.

---

## License

[MIT](LICENSE) — free to use, modify, and distribute. Attribution appreciated.

---

## About

Built with a focus on creator experience, privacy, and responsible AI usage.

FeedReady started as a simple frustration — a creator noticed platform labels appearing on their work and wanted a straightforward fix that didn't involve uploading their images to yet another third-party service. So they built one.

No venture backing. No roadmap pressures. Just a tool that does one thing well.

---

**Built by [Anshumaan Vishnu](https://ansh.asia)**

[![Website](https://img.shields.io/badge/Website-ansh.asia-057642?style=flat-square)](https://ansh.asia)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-anshumaanvishnu-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/anshumaanvishnu/)
[![X](https://img.shields.io/badge/X-@StartupsWala-000000?style=flat-square&logo=x)](https://x.com/StartupsWala)
[![GitHub](https://img.shields.io/badge/GitHub-AnshumaanVishnu-333?style=flat-square&logo=github)](https://github.com/AnshumaanVishnu)
