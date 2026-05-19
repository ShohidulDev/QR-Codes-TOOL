# QR Studio

A free, lightweight QR code generator built with vanilla HTML, CSS, and JavaScript. No backend. No login. No dependencies beyond a single CDN script.

## Features

- **6 QR types** — URL, Plain Text, Email, Phone, Wi-Fi, vCard
- **Custom colors** — foreground and background color picker with hex input
- **Size control** — generate at 128px up to 512px
- **Error correction** — L / M / Q / H levels
- **Download** — PNG and SVG export
- **Copy to clipboard** — one-click image copy
- **vCard label format** — scan shows `Name: John`, `Email: john@example.com` style readable output
- **Company ID field** — custom identifier embedded in vCard QR
- **Zero tracking** — fully client-side, nothing sent to any server

## File Structure

```
qr-generator/
├── index.html   # markup and layout
├── style.css    # all styles and responsive rules
└── script.js    # QR logic, tab switching, download, clipboard
```

## Usage

No build step required. Just open `index.html` in a browser — or drop all three files into any static hosting folder.

```bash
git clone https://github.com/your-username/qr-studio.git
cd qr-studio
open index.html
```

## Hosting

Works on any static host:

- GitHub Pages
- Netlify
- Vercel
- Shopify (as a custom page asset)
- cPanel / shared hosting

Upload all three files to the same directory and point your domain at `index.html`.

## Dependencies

| Library | Source | Purpose |
|---|---|---|
| QRCode.js | cdnjs.cloudflare.com | QR generation |
| Syne | Google Fonts | Display font |
| Space Mono | Google Fonts | Mono / UI font |

All loaded via CDN. No npm. No build tools.

## Browser Support

Chrome, Firefox, Safari, Edge — all modern versions. PNG clipboard copy requires a secure context (HTTPS or localhost).

## License

MIT — free to use, modify, and distribute.

---

Built by [Shohidul Dev](https://github.com/shohiduldev) · #shohiduldev
