document.addEventListener('DOMContentLoaded', () => {

  // ── Unit Data ──
  const categories = {
    length: {
      units: ['Meter','Kilometer','Mile','Yard','Foot','Inch','Centimeter','Millimeter'],
      base: 'Meter',
      toBase: {
        Meter:       1,
        Kilometer:   1000,
        Mile:        1609.344,
        Yard:        0.9144,
        Foot:        0.3048,
        Inch:        0.0254,
        Centimeter:  0.01,
        Millimeter:  0.001
      }
    },
    weight: {
      units: ['Kilogram','Gram','Pound','Ounce','Ton','Milligram'],
      base: 'Kilogram',
      toBase: {
        Kilogram:   1,
        Gram:       0.001,
        Pound:      0.453592,
        Ounce:      0.0283495,
        Ton:        1000,
        Milligram:  0.000001
      }
    },
    temp: {
      units: ['Celsius','Fahrenheit','Kelvin'],
      base: 'Celsius',
      toBase: null // handled separately
    },
    speed: {
      units: ['m/s','km/h','mph','Knot','ft/s'],
      base: 'm/s',
      toBase: {
        'm/s':   1,
        'km/h':  0.277778,
        'mph':   0.44704,
        'Knot':  0.514444,
        'ft/s':  0.3048
      }
    },
    area: {
      units: ['m²','km²','Mile²','Yard²','Foot²','Hectare','Acre'],
      base: 'm²',
      toBase: {
        'm²':      1,
        'km²':     1000000,
        'Mile²':   2589988.11,
        'Yard²':   0.836127,
        'Foot²':   0.092903,
        'Hectare': 10000,
        'Acre':    4046.856
      }
    }
  };

  // ── State ──
  let currentCategory = 'length';

  // ── Elements ──
  const fromValue   = document.getElementById('from-value');
  const toValue     = document.getElementById('to-value');
  const fromUnit    = document.getElementById('from-unit');
  const toUnit      = document.getElementById('to-unit');
  const resultLabel = document.getElementById('result-label');
  const tabs        = document.querySelectorAll('.tab');

  // ── Populate Units ──
  function populateUnits(category) {
    const units = categories[category].units;
    fromUnit.innerHTML = '';
    toUnit.innerHTML   = '';
    units.forEach((u, i) => {
      fromUnit.innerHTML += `<option value="${u}">${u}</option>`;
      toUnit.innerHTML   += `<option value="${u}">${u}</option>`;
    });
    // default: different units selected
    toUnit.selectedIndex = 1;
    fromValue.value = '';
    toValue.value   = '';
    resultLabel.textContent = '';
  }

  // ── Convert Temperature ──
  function convertTemp(value, from, to) {
    let celsius;
    if      (from === 'Celsius')    celsius = value;
    else if (from === 'Fahrenheit') celsius = (value - 32) * 5/9;
    else if (from === 'Kelvin')     celsius = value - 273.15;

    if      (to === 'Celsius')    return celsius;
    else if (to === 'Fahrenheit') return (celsius * 9/5) + 32;
    else if (to === 'Kelvin')     return celsius + 273.15;
  }

  // ── Convert ──
  function convert() {
    const value = parseFloat(fromValue.value);
    const from  = fromUnit.value;
    const to    = toUnit.value;

    if (isNaN(value)) {
      toValue.value = '';
      resultLabel.textContent = '';
      return;
    }

    if (from === to) {
      toValue.value = value;
      resultLabel.textContent = `${value} ${from} = ${value} ${to}`;
      return;
    }

    let result;

    if (currentCategory === 'temp') {
      result = convertTemp(value, from, to);
    } else {
      const toBase = categories[currentCategory].toBase;
      const inBase = value * toBase[from];
      result       = inBase / toBase[to];
    }

    const formatted = parseFloat(result.toFixed(6));
    toValue.value   = formatted;
    resultLabel.textContent = `${value} ${from} = ${formatted} ${to}`;
  }

  // ── Swap Units ──
  function swapUnits() {
    const tempUnit  = fromUnit.value;
    fromUnit.value  = toUnit.value;
    toUnit.value    = tempUnit;
    fromValue.value = toValue.value;
    convert();
  }

  // ── Tab Switch ──
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category;
      populateUnits(currentCategory);
    });
  });

  // ── Event Listeners ──
  fromValue.addEventListener('input', convert);
  fromUnit.addEventListener('change', convert);
  toUnit.addEventListener('change', convert);
  document.getElementById('btn-swap').addEventListener('click', swapUnits);

  // ── Back Button ──
  document.getElementById('btn-back').addEventListener('click', () => {
    window.location.href = '../../popup.html';
  });

  // ── Init ──
  populateUnits(currentCategory);

});