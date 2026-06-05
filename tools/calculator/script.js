document.addEventListener('DOMContentLoaded', () => {

  // ── State ──
  let current = '0';
  let prev    = null;
  let op      = null;
  let reset   = false;

  // ── Elements ──
  const display = document.getElementById('result');
  const expr    = document.getElementById('expr');

  // ── Update Display ──
  function updateDisplay() {
    display.textContent = current.length > 10
      ? parseFloat(current).toExponential(3)
      : current;
  }

  // ── Number Input ──
  function inputNum(val) {
    if (reset) {
      current = val;
      reset   = false;
    } else {
      current = current === '0' ? val : current + val;
    }
    updateDisplay();
  }

  // ── Decimal Input ──
  function inputDot() {
    if (reset) { current = '0.'; reset = false; updateDisplay(); return; }
    if (!current.includes('.')) current += '.';
    updateDisplay();
  }

  // ── Set Operator ──
  function setOp(o) {
    if (op && !reset) calculate(true);
    prev  = current;
    op    = o;
    reset = true;
    expr.textContent = prev + ' ' + op;
  }

  // ── Calculate ──
  function calculate(chain = false) {
    if (!op || !prev) return;
    const a = parseFloat(prev);
    const b = parseFloat(current);
    let result;

    if      (op === '+') result = a + b;
    else if (op === '−') result = a - b;
    else if (op === '×') result = a * b;
    else if (op === '÷') result = b === 0 ? 'Error' : a / b;

    if (!chain) {
      expr.textContent = prev + ' ' + op + ' ' + current + ' =';
      op   = null;
      prev = null;
    }

    current = result === 'Error'
      ? 'Error'
      : String(parseFloat(result.toFixed(10)));
    reset = true;
    updateDisplay();
  }

  // ── Clear All ──
  function clearAll() {
    current = '0';
    prev    = null;
    op      = null;
    reset   = false;
    expr.textContent = '';
    updateDisplay();
  }

  // ── Toggle Sign ──
  function toggleSign() {
    if (current === '0' || current === 'Error') return;
    current = current.startsWith('-')
      ? current.slice(1)
      : '-' + current;
    updateDisplay();
  }

  // ── Percentage ──
  function percent() {
    if (current === 'Error') return;
    current = String(parseFloat(current) / 100);
    updateDisplay();
  }

  // ── Button Bindings ──
  // Numbers
  ['0','1','2','3','4','5','6','7','8','9'].forEach(n => {
    document.getElementById('btn-' + n)
      .addEventListener('click', () => inputNum(n));
  });

  // Operators
  document.getElementById('btn-add').addEventListener('click', () => setOp('+'));
  document.getElementById('btn-sub').addEventListener('click', () => setOp('−'));
  document.getElementById('btn-mul').addEventListener('click', () => setOp('×'));
  document.getElementById('btn-div').addEventListener('click', () => setOp('÷'));

  // Actions
  document.getElementById('btn-eq')     .addEventListener('click', () => calculate());
  document.getElementById('btn-ac')     .addEventListener('click', clearAll);
  document.getElementById('btn-sign')   .addEventListener('click', toggleSign);
  document.getElementById('btn-percent').addEventListener('click', percent);
  document.getElementById('btn-dot')    .addEventListener('click', inputDot);

  // ── Back Button ──
  document.getElementById('btn-back').addEventListener('click', () => {
    window.location.href = '../../popup.html';
  });

});