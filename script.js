let activeTab = 'url';
let activeEcc = 'L';

function switchTab(name, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
  activeTab = name;
}

function setEcc(btn) {
  document.querySelectorAll('.ecc-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeEcc = btn.dataset.ecc;
}

function syncHex(colorInput, hexId) {
  document.getElementById(hexId).value = colorInput.value;
}

function syncColor(hexInput, colorId) {
  const val = hexInput.value;
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    document.getElementById(colorId).value = val;
  }
}

function getQRContent() {
  switch (activeTab) {
    case 'url':
      return document.getElementById('input-url').value.trim() || 'https://shohiduldev.com';
    case 'text':
      return document.getElementById('input-text').value.trim() || 'Hello from Shohidul Dev!';
    case 'email': {
      const addr = document.getElementById('input-email-addr').value.trim();
      const sub  = encodeURIComponent(document.getElementById('input-email-sub').value.trim());
      const body = encodeURIComponent(document.getElementById('input-email-body').value.trim());
      return `mailto:${addr}?subject=${sub}&body=${body}`;
    }
    case 'phone':
      return `tel:${document.getElementById('input-phone').value.trim()}`;
    case 'wifi': {
      const ssid = document.getElementById('input-wifi-ssid').value.trim();
      const pass = document.getElementById('input-wifi-pass').value.trim();
      const sec  = document.getElementById('input-wifi-sec').value;
      return `WIFI:T:${sec};S:${ssid};P:${pass};;`;
    }
    case 'vcard': {
      const n   = document.getElementById('vc-name').value.trim();
      const p   = document.getElementById('vc-phone').value.trim();
      const e   = document.getElementById('vc-email').value.trim();
      const u   = document.getElementById('vc-url').value.trim();
      const o   = document.getElementById('vc-org').value.trim();
      const cid = document.getElementById('vc-compid') ? document.getElementById('vc-compid').value.trim() : '';

      const lines = [];
      if (n)   lines.push(`Name: ${n}`);
      if (p)   lines.push(`Phone: ${p}`);
      if (e)   lines.push(`Email: ${e}`);
      if (u)   lines.push(`Website: ${u}`);
      if (o)   lines.push(`Company: ${o}`);
      if (cid) lines.push(`Company ID: ${cid}`);

      return lines.join('\n');
    }
    default: return '';
  }
}

function generateQR() {
  const content = getQRContent();
  if (!content) { showToast('Enter some content first!'); return; }

  const fgColor = document.getElementById('color-fg').value;
  const bgColor = document.getElementById('color-bg').value;
  const size    = parseInt(document.getElementById('qr-size').value);
  const output  = document.getElementById('qr-output');

  output.innerHTML = '';

  try {
    new QRCode(output, {
      text: content,
      width: 208,
      height: 208,
      colorDark: fgColor,
      colorLight: bgColor,
      correctLevel: QRCode.CorrectLevel[activeEcc]
    });

    const typeMap = { url: 'URL', text: 'Text', email: 'Email', phone: 'Phone', wifi: 'Wi-Fi', vcard: 'vCard' };
    document.getElementById('meta-type').textContent  = typeMap[activeTab] || activeTab;
    document.getElementById('meta-size').textContent  = size + ' × ' + size + 'px';
    document.getElementById('meta-ecc').textContent   = activeEcc;
    document.getElementById('meta-chars').textContent = content.length;
    document.getElementById('qr-meta').style.display  = 'flex';
    document.getElementById('dl-btns').style.display  = 'grid';

    setTimeout(() => setupDownload(fgColor, bgColor, size), 300);
  } catch (e) {
    output.innerHTML = '<p style="color:#ff4444;font-family:monospace;font-size:12px;text-align:center">Error: Content too long or invalid</p>';
  }
}

function setupDownload(fgColor, bgColor, size) {
  const canvas = document.querySelector('#qr-output canvas');
  if (!canvas) return;

  const dlCanvas = document.createElement('canvas');
  dlCanvas.width  = size;
  dlCanvas.height = size;
  dlCanvas.getContext('2d').drawImage(canvas, 0, 0, size, size);

  document.getElementById('dl-png').href = dlCanvas.toDataURL('image/png');

  const pngData  = canvas.toDataURL('image/png');
  const svgData  = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bgColor}"/>
  <image href="${pngData}" width="${size}" height="${size}"/>
</svg>`;
  const svgBlob  = new Blob([svgData], { type: 'image/svg+xml' });
  document.getElementById('dl-svg').href = URL.createObjectURL(svgBlob);
}

async function copyQR() {
  const canvas = document.querySelector('#qr-output canvas');
  if (!canvas) return;
  try {
    canvas.toBlob(async blob => {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('QR image copied!');
    });
  } catch {
    showToast('Copy not supported in this browser');
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('input-url').addEventListener('keydown', e => {
    if (e.key === 'Enter') generateQR();
  });
});
