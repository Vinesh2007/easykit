document.addEventListener('DOMContentLoaded', () => {

  // ── Elements ──
  const viewList      = document.getElementById('view-list');
  const viewEditor    = document.getElementById('view-editor');
  const notesList     = document.getElementById('notes-list');
  const emptyState    = document.getElementById('empty-state');
  const btnNew        = document.getElementById('btn-new');
  const btnBackEditor = document.getElementById('btn-back-editor');
  const btnDelete     = document.getElementById('btn-delete');
  const noteTitle     = document.getElementById('note-title');
  const noteBody      = document.getElementById('note-body');
  const saveStatus    = document.getElementById('save-status');
  const btnBack       = document.getElementById('btn-back');

  let notes     = [];
  let activeId  = null;
  let saveTimer = null;

  // ════════════════════════
  // ── Storage ──
  // ════════════════════════

  function loadNotes() {
    // ← Safety check for chrome.storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['easykit_notes'], (result) => {
        notes = result.easykit_notes || [];
        renderList();
      });
    } else {
      // Fallback for testing outside extension
      const stored = localStorage.getItem('easykit_notes');
      notes = stored ? JSON.parse(stored) : [];
      renderList();
    }
  }

  function saveNotes() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ easykit_notes: notes }, () => {
        showSaved();
      });
    } else {
      // Fallback for testing outside extension
      localStorage.setItem('easykit_notes', JSON.stringify(notes));
      showSaved();
    }
  }

  function showSaved() {
    saveStatus.textContent = 'Saved ✓';
    saveStatus.classList.add('saved');
    setTimeout(() => {
      saveStatus.textContent = 'Auto-saved';
      saveStatus.classList.remove('saved');
    }, 2000);
  }

  // ════════════════════════
  // ── Render List ──
  // ════════════════════════

  function renderList() {
    notesList.innerHTML = '';

    if (notes.length === 0) {
      notesList.style.display  = 'none';
      emptyState.style.display = 'flex';
      return;
    }

    notesList.style.display  = 'flex';
    emptyState.style.display = 'none';

    notes.forEach(note => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.innerHTML = `
        <div class="note-card-title">${note.title || 'Untitled'}</div>
        <div class="note-card-preview">${note.body  || 'No content'}</div>
        <div class="note-card-date">${note.date}</div>
      `;
      card.addEventListener('click', () => openNote(note.id));
      notesList.appendChild(card);
    });
  }

  // ════════════════════════
  // ── Note Actions ──
  // ════════════════════════

  function newNote() {
    const note = {
      id:    Date.now(),
      title: '',
      body:  '',
      date:  getDate()
    };
    notes.unshift(note);
    saveNotes();
    openNote(note.id);
  }

  function openNote(id) {
    activeId        = id;
    const note      = notes.find(n => n.id === id);
    if (!note) return;
    noteTitle.value = note.title;
    noteBody.value  = note.body;
    showEditor();
  }

  function deleteNote() {
    if (!activeId) return;
    notes = notes.filter(n => n.id !== activeId);
    saveNotes();
    showList();
  }

  function autoSave() {
    const note = notes.find(n => n.id === activeId);
    if (!note) return;
    note.title = noteTitle.value;
    note.body  = noteBody.value;
    note.date  = getDate();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNotes, 800);
  }

  function getDate() {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day:   'numeric',
      year:  'numeric'
    });
  }

  // ════════════════════════
  // ── View Switching ──
  // ════════════════════════

  function showEditor() {
    viewList.style.display   = 'none';
    viewEditor.style.display = 'flex';
    btnNew.style.display     = 'none';
    setTimeout(() => noteTitle.focus(), 50);  /* ← small delay fixes focus */
  }

  function showList() {
    viewEditor.style.display = 'none';
    viewList.style.display   = 'flex';
    btnNew.style.display     = '';
    activeId                 = null;
    renderList();
  }

  // ════════════════════════
  // ── Event Listeners ──
  // ════════════════════════

  btnNew.addEventListener('click', newNote);
  btnBackEditor.addEventListener('click', showList);
  btnDelete.addEventListener('click', deleteNote);
  noteTitle.addEventListener('input', autoSave);
  noteBody.addEventListener('input', autoSave);

  btnBack.addEventListener('click', () => {
    window.location.href = '../../popup.html';
  });

  // ── Init ──
  loadNotes();   /* ← always called, never skipped */

});