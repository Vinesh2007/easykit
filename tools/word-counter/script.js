const textInput = document.getElementById('textInput');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const charCountNoSpaces = document.getElementById('charCountNoSpaces');
const sentenceCount = document.getElementById('sentenceCount');
const paragraphCount = document.getElementById('paragraphCount');
const readingTime = document.getElementById('readingTime');
const clearBtn = document.getElementById('clearBtn');

textInput.addEventListener('input', updateStats);
clearBtn.addEventListener('click', clearText);

function updateStats() {
  const text = textInput.value;
  
  // Word count
  const words = text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
  wordCount.textContent = words;
  
  // Character count
  charCount.textContent = text.length;
  
  // Character count without spaces
  const charsNoSpaces = text.replace(/\s/g, '').length;
  charCountNoSpaces.textContent = charsNoSpaces;
  
  // Sentence count
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  sentenceCount.textContent = sentences;
  
  // Paragraph count
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
  paragraphCount.textContent = paragraphs;
  
  // Reading time (assuming 200 words per minute)
  const minutes = Math.ceil(words / 200);
  readingTime.textContent = minutes + ' min';
}

function clearText() {
  textInput.value = '';
  updateStats();
}

updateStats();
