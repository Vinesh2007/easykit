const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

lengthSlider.addEventListener('input', function() {
  lengthValue.textContent = this.value;
});

copyBtn.addEventListener('click', function() {
  if (passwordOutput.value) {
    navigator.clipboard.writeText(passwordOutput.value);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
    }, 2000);
  }
});

generateBtn.addEventListener('click', generatePassword);

function generatePassword() {
  let chars = '';
  
  if (uppercaseCheckbox.checked) chars += UPPERCASE;
  if (lowercaseCheckbox.checked) chars += LOWERCASE;
  if (numbersCheckbox.checked) chars += NUMBERS;
  if (symbolsCheckbox.checked) chars += SYMBOLS;
  
  if (!chars) {
    alert('Select at least one option');
    return;
  }
  
  const length = parseInt(lengthSlider.value);
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  passwordOutput.value = password;
}

generatePassword();
