document.addEventListener('DOMContentLoaded', () => {

  // ── City → Element ID map ──
  const cities = [
    { tz: 'America/New_York',   id: 'time-new-york'   },
    { tz: 'America/Los_Angeles',id: 'time-los-angeles' },
    { tz: 'Europe/London',      id: 'time-london'      },
    { tz: 'Europe/Paris',       id: 'time-paris'       },
    { tz: 'Asia/Dubai',         id: 'time-dubai'       },
    { tz: 'Asia/Kolkata',       id: 'time-india'       },
    { tz: 'Asia/Singapore',     id: 'time-singapore'   },
    { tz: 'Asia/Tokyo',         id: 'time-tokyo'       },
    { tz: 'Australia/Sydney',   id: 'time-sydney'      }
  ];

  // ── Format Time ──
  function formatTime(date, tz) {
    return date.toLocaleTimeString('en-US', {
      timeZone:     tz,
      hour:         '2-digit',
      minute:       '2-digit',
      second:       '2-digit',
      hour12:       false
    });
  }

  // ── Format Local Date ──
  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric'
    });
  }

  // ── Update All Clocks ──
  function updateClocks() {
    const now = new Date();

    // Local time
    document.getElementById('local-clock').textContent = formatTime(now, Intl.DateTimeFormat().resolvedOptions().timeZone);
    document.getElementById('local-date').textContent  = formatDate(now);

    // City clocks
    cities.forEach(city => {
      document.getElementById(city.id).textContent = formatTime(now, city.tz);
    });
  }

  // ── Back Button ──
  document.getElementById('btn-back').addEventListener('click', () => {
    window.location.href = '../../popup.html';
  });

  // ── Init & Tick every second ──
  updateClocks();
  setInterval(updateClocks, 1000);

});