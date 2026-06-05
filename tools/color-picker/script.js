document.addEventListener('DOMContentLoaded', () => {

  const colorInput  = document.getElementById('color-input');
  const preview     = document.getElementById('color-preview');
  const valHex      = document.getElementById('val-hex');
  const valRgb      = document.getElementById('val-rgb');
  const valHsl      = document.getElementById('val-hsl');
  const savedColors = document.getElementById('saved-colors');
  const btnSave     = document.getElementById('btn-save');
  const presetsEl   = document.getElementById('presets');

  const PRESETS = [
    '#ff6a00','#ff4500','#ff0000','#e91e63','#9c27b0',
    '#673ab7','#3f51b5','#2196f3','#03a9f4','#00bcd4',
    '#009688','#4caf50','#8bc34a','#cddc39','#ffeb3b',
    '#ffc107','#ff9800','#795548','#607d8b','#ffffff',
    '#aaaaaf','#555560','#252528','#1a1a1e','#0f0f10'
  ];

  let saved = [];

  // ── Hex to RGB ──
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return { r, g, b };
  }

  // ── RGB to HSL ──
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  // ── Update Values ──
  function updateValues(hex) {
    const { r, g, b } = hexToRgb(hex);
    const { h, s, l } = rgbToHsl(r, g, b);

    preview.style.background = hex;
    valHex.textContent = hex.toUpperCase();
    valRgb.textContent = `rgb(${r}, ${g}, ${b})`;
    valHsl.textContent = `hsl(${h}, ${s}%, ${l}%)`;
  }

  // ── Copy Value ──
  document.querySelectorAll('.btn-copy-val').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = document.getElementById(btn.dataset.target).textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });

  // ── Save Color ──
  function saveColor() {
    const hex = colorInput.value;
    if (saved.includes(hex)) return;
    saved.unshift(hex);
    if (saved.length > 10) saved.pop();
    renderSaved();
  }

  function renderSaved() {
    savedColors.innerHTML = '';
    saved.forEach(hex => {
      const swatch = document.createElement('div');
      swatch.className   = 'saved-swatch';
      swatch.style.background = hex;
      swatch.title       = hex;
      swatch.addEventListener('click', () => {
        colorInput.value = hex;
        updateValues(hex);
      });
      savedColors.appendChild(swatch);
    });
  }

  // ── Presets ──
  PRESETS.forEach(hex => {
    const swatch = document.createElement('div');
    swatch.className   = 'preset-swatch';
    swatch.style.background = hex;
    swatch.title       = hex;
    swatch.addEventListener('click', () => {
      colorInput.value = hex;
      updateValues(hex);
    });
    presetsEl.appendChild(swatch);
  });

  // ── Events ──
  colorInput.addEventListener('input', () => updateValues(colorInput.value));
  btnSave.addEventListener('click', saveColor);

  // ── Back ──
  document.getElementById('btn-back').addEventListener('click', () => {
    window.location.href = '../../popup.html';
  });

  // ── Init ──
  updateValues(colorInput.value);

});