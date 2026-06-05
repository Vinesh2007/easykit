document.addEventListener('DOMContentLoaded', () => {

  const routes = {
    'btn-calculator': 'tools/calculator/index.html',
    'btn-qr':         'tools/qr-generator/index.html',
    'btn-unit':       'tools/unit-converter/index.html',
    'btn-clock':      'tools/world-clock/index.html',
    'btn-timer':      'tools/timer/index.html',
    'btn-password':   'tools/password/index.html',
    'btn-color':      'tools/color-picker/index.html',
    'btn-word':       'tools/word-counter/index.html',
    'btn-notes':      'tools/notes/index.html'
  };

  // Loop through each route and attach click listener
  Object.keys(routes).forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
      window.location.href = routes[id];
    });
  });

});