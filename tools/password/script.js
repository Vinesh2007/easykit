document.addEventListener('DOMContentLoaded', () => {

  const output       = document.getElementById('password-output');
  const btnGenerate  = document.getElementById('btn-generate');
  const btnCopy      = document.getElementById('btn-copy');
  const slider       = document.getElementById('length-slider');
  const lengthValue  = document.getElementById('length-value');
  const strengthFill = document.getElementById('strength-fill');
  const strengthText = document.getElementById('strength-text');

  const optUpper   = document.getElementById('opt-upper');
  const optLower   = document.getElementById('opt-lower');
  const optNumbers = document.getElementById('opt-numbers');
  const optSymbols = document.getElementById('opt-symbols');

  const UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const LOWER   = 'abcdefghijklmnopqrstuvwxyz';
  const NUMBERS = '0123456789';
  const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  // ── Slider ──
  slider.addEventListener('input', () => {
    lengthValue.textContent = slider.value;
  });

  // ── Strength ──
  function updateStrength(password) {
    let score = 0;
    if (password.length >= 8)  score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let pct, color, label;
    if      (score <= 2) { pct = 25;  color = '#ff4500'; label = 'Weak';   }
    else if (score <= 4) { pct = 50;  color = '#ff8c00'; label = 'Fair';   }
    else if (score <= 5) { pct = 75;  color = '#ffd700'; label = 'Good';   }
    else                 { pct = 100; color = '#4caf50'; label = 'Strong'; }

    strengthFill.style.width      = pct + '%';
    strengthFill.style.background = color;
    strengthText.style.color      = color;
    strengthText.textContent      = label;
  }

  // ── Generate ──
  function generatePassword() {
    let charset = '';
    if (optUpper.checked)   charset += UPPER;
    if (optLower.checked)   charset += LOWER;
    if (optNumbers.checked) charset += NUMBERS;
    if (optSymbols.checked) charset += SYMBOLS;

    if (!charset) {
      output.textContent = 'Select at least one option';
      return;
    }

    const length   = parseInt(slider.value);
    let password   = '';
    const array    = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      password += charset[array[i] % charset.length];
    }

    output.textContent = password;
    updateStrength(password);
  }

  // ── Copy ──
  function copyPassword() {
    const text = output.textContent;
    if (!text || text === 'Click Generate') return;

    navigator.clipboard.writeText(text).then(() => {
      btnCopy.textContent = 'Copied!';
      btnCopy.classList.add('copied');
      setTimeout(() => {
        btnCopy.textContent = 'Copy';
        btnCopy.classList.remove('copied');
      }, 2000);
    });
  }

  btnGenerate.addEventListener('click', generatePassword);
  btnCopy.addEventListener('click', copyPassword);

  // ── Back ──
  document.getElementById('btn-back').addEventListener('click', () => {
    window.location.href = '../../popup.html';
  });

  // ── Init ──
  generatePassword();

});