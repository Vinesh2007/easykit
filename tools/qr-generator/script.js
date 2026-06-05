document.addEventListener('DOMContentLoaded', () => {

  // ── Elements ──
  const input       = document.getElementById('qr-input');
  const btnGenerate = document.getElementById('btn-generate');
  const btnDownload = document.getElementById('btn-download');
  const btnClear    = document.getElementById('btn-clear');
  const btnBack     = document.getElementById('btn-back');
  const qrCode      = document.getElementById('qr-code');
  const placeholder = document.getElementById('qr-placeholder');
  const actions     = document.getElementById('actions');

  let qrInstance = null;

  // ── Generate QR ──
  function generateQR() {
    const text = input.value.trim();

    if (!text) {
      input.focus();
      input.style.borderColor = '#ff4500';
      setTimeout(() => input.style.borderColor = '#252528', 1500);
      return;
    }

    // Clear previous QR
    qrCode.innerHTML = '';

    // Hide placeholder, show QR box
    placeholder.style.display = 'none';
    qrCode.style.display      = 'block';
    actions.style.display     = 'flex';

    // Generate new QR
    qrInstance = new QRCode(qrCode, {
      text:          text,
      width:         160,
      height:        160,
      colorDark:     '#000000',
      colorLight:    '#ffffff',
      correctLevel:  QRCode.CorrectLevel.H
    });
  }

  // ── Download QR ──
  function downloadQR() {
    const canvas = qrCode.querySelector('canvas');
    if (!canvas) return;

    const link    = document.createElement('a');
    link.download = 'easykit-qr.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();
  }

  // ── Clear ──
  function clearAll() {
    input.value           = '';
    qrCode.innerHTML      = '';
    qrCode.style.display  = 'none';
    actions.style.display = 'none';
    placeholder.style.display = 'flex';
    qrInstance = null;
    input.focus();
  }

  // ── Generate on Enter key ──
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') generateQR();
  });

  // ── Button Bindings ──
  btnGenerate.addEventListener('click', generateQR);
  btnDownload.addEventListener('click', downloadQR);
  btnClear.addEventListener('click', clearAll);

  // ── Back Button ──
  btnBack.addEventListener('click', () => {
    window.location.href = '../../popup.html';
  });

});