const QuickKit = (() => {

  let container, shadow, isDragging;
  let offsetX, offsetY;

  // ── Init ──────────────────────────────────────────
  function init(containerEl, shadowRoot) {
    container = containerEl;
    shadow = shadowRoot;
    restorePosition();
    renderLauncher();
    enableDrag();
  }

  // ── Position Save & Restore ───────────────────────
  function savePosition(x, y) {
    chrome.storage.local.set({ qk_pos_x: x, qk_pos_y: y });
  }

  function restorePosition() {
    chrome.storage.local.get(['qk_pos_x', 'qk_pos_y'], (res) => {
      const x = res.qk_pos_x ?? (window.innerWidth - 360);
      const y = res.qk_pos_y ?? 20;
      container.style.left = x + 'px';
      container.style.top  = y + 'px';
    });
  }

  // ── Drag & Drop ───────────────────────────────────
  function enableDrag() {
    const handle = document.createElement('div');
    handle.id = 'qk-drag-handle';
    handle.innerHTML = '⠿ QuickKit';
    container.prepend(handle);

    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - container.getBoundingClientRect().left;
      offsetY = e.clientY - container.getBoundingClientRect().top;
      handle.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      container.style.left = x + 'px';
      container.style.top  = y + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      handle.style.cursor = 'grab';
      savePosition(
        parseInt(container.style.left),
        parseInt(container.style.top)
      );
    });
  }

  // ── Navigation ────────────────────────────────────
  function renderLauncher() {
    // clear current view
    const existing = shadow.getElementById('qk-view');
    if (existing) existing.remove();

    const view = document.createElement('div');
    view.id = 'qk-view';
    view.innerHTML = getLauncherHTML();
    container.appendChild(view);

    // attach tool button events
    view.querySelectorAll('.qk-tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        loadTool(btn.dataset.tool);
      });
    });
  }

  function loadTool(toolName) {
    // clear launcher
    const existing = shadow.getElementById('qk-view');
    if (existing) existing.remove();

    const view = document.createElement('div');
    view.id = 'qk-view';
    container.appendChild(view);

    // dynamically load tool CSS
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = chrome.runtime.getURL(`tools/${toolName}/style.css`);
    shadow.appendChild(styleLink);

    // dynamically load tool JS
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL(`tools/${toolName}/index.js`);
    script.onload = () => {
      // each tool exposes ToolModule.init(container, goBack)
      ToolModule.init(view, renderLauncher);
    };
    document.head.appendChild(script);
  }

  // ── Launcher HTML ─────────────────────────────────
  function getLauncherHTML() {
    const tools = [
      { id: 'calculator',    icon: '🧮', name: 'Calculator'  },
      { id: 'qr-generator',  icon: '🔲', name: 'QR Code'     },
      { id: 'unit-converter',icon: '📐', name: 'Unit'        },
      { id: 'world-clock',   icon: '🕐', name: 'Clock'       },
      { id: 'timer',         icon: '⏱️', name: 'Timer'       },
      { id: 'password',      icon: '🔐', name: 'Password'    },
      { id: 'color-picker',  icon: '🎨', name: 'Color'       },
      { id: 'word-counter',  icon: '📝', name: 'Words'       },
      { id: 'notes',         icon: '🗒️', name: 'Notes'       },
    ];

    return `
      <div id="qk-launcher">
        <div class="qk-grid">
          ${tools.map(t => `
            <button class="qk-tool-btn" data-tool="${t.id}">
              <span class="qk-tool-icon">${t.icon}</span>
              <span class="qk-tool-label">${t.name}</span>
            </button>
          `).join('')}
        </div>
        <div class="qk-footer">⚡ QuickKit &nbsp;•&nbsp; Offline</div>
      </div>
    `;
  }

  // expose public API
  return { init };

})();