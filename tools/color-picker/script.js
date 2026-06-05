const colorInput = document.getElementById('colorInput');
const colorDisplay = document.getElementById('colorDisplay');
const hexValue = document.getElementById('hexValue');
const rgbValue = document.getElementById('rgbValue');
const hslValue = document.getElementById('hslValue');
const randomBtn = document.getElementById('randomBtn');

colorInput.addEventListener('change', updateColor);
colorInput.addEventListener('input', updateColor);
randomBtn.addEventListener('click', generateRandomColor);

function updateColor() {
  const hex = colorInput.value;
  colorDisplay.style.background = hex;
  hexValue.value = hex.toUpperCase();
  
  const rgb = hexToRgb(hex);
  rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hslValue.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
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

function generateRandomColor() {
  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  colorInput.value = randomColor;
  updateColor();
}

updateColor();

function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  navigator.clipboard.writeText(element.value);
  const button = event.target;
  button.textContent = 'Copied!';
  setTimeout(() => {
    button.textContent = 'Copy';
  }, 2000);
}
