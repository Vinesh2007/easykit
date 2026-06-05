document.addEventListener('DOMContentLoaded', () => {

  const textInput    = document.getElementById('text-input');
  const statWords    = document.getElementById('stat-words');
  const statChars    = document.getElementById('stat-chars');
  const statCharsNo  = document.getElementById('stat-chars-no');
  const statSentences= document.getElementById('stat-sentences');
  const statPara     = document.getElementById('stat-para');
  const statRead     = document.getElementById('stat-read');
  const statAvg      = document.getElementById('stat-avg');
  const btnClear     = document.getElementById('btn-clear');

  function analyze() {
    const text = textInput.value;

    // Words
    const words = text.trim() === ''
      ? []
      : text.trim().split(/\s+/);
    const wordCount = words.length;

    // Chars
    const charCount    = text.length;
    const charNoSpaces = text.replace(/\s/g, '').length;

    // Sentences
    const sentences = text.trim() === ''
      ? 0
      : (text.match(/[^.!?]*[.!?]/g) || []).length;

    // Paragraphs
    const paragraphs = text.trim() === ''
      ? 0
      : text.trim().split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);

    // Reading time (avg 200 wpm)
    const readSecs = Math.round((wordCount / 200) * 60);
    const readTime = readSecs < 60
      ? readSecs + ' sec'
      : Math.floor(readSecs / 60) + ' min ' + (readSecs % 60) + ' sec';

    // Avg word length
    const avgLen = wordCount > 0
      ? (words.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g,'').length, 0) / wordCount).toFixed(1)
      : 0;

    statWords.textContent     = wordCount;
    statChars.textContent     = charCount;
    statCharsNo.textContent   = charNoSpaces;
    statSentences.textContent = sentences;
    statPara.textContent      = paragraphs;
    statRead.textContent      = readTime;
    statAvg.textContent       = avgLen;
  }

  textInput.addEventListener('input', analyze);

  btnClear.addEventListener('click', () => {
    textInput.value = '';
    analyze();
    textInput.focus();
  });

  document.getElementById('btn-back').addEventListener('click', () => {
    window.location.href = '../../popup.html';
  });

});