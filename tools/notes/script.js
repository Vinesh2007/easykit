const newNoteBtn = document.getElementById('newNoteBtn');
const notesList = document.getElementById('notesList');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const deleteBtn = document.getElementById('deleteBtn');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteId = null;

newNoteBtn.addEventListener('click', createNewNote);
noteTitle.addEventListener('input', saveCurrentNote);
noteContent.addEventListener('input', saveCurrentNote);
deleteBtn.addEventListener('click', deleteCurrentNote);

function createNewNote() {
  const newNote = {
    id: Date.now(),
    title: 'Untitled Note',
    content: '',
    date: new Date().toLocaleString()
  };
  
  notes.unshift(newNote);
  saveNotes();
  selectNote(newNote.id);
  renderNotes();
}

function renderNotes() {
  notesList.innerHTML = '';
  notes.forEach(note => {
    const noteItem = document.createElement('div');
    noteItem.className = 'note-item' + (note.id === currentNoteId ? ' active' : '');
    noteItem.textContent = note.title || 'Untitled Note';
    noteItem.addEventListener('click', () => selectNote(note.id));
    notesList.appendChild(noteItem);
  });
}

function selectNote(id) {
  currentNoteId = id;
  const note = notes.find(n => n.id === id);
  
  if (note) {
    noteTitle.value = note.title;
    noteContent.value = note.content;
    renderNotes();
  }
}

function saveCurrentNote() {
  if (currentNoteId === null) return;
  
  const note = notes.find(n => n.id === currentNoteId);
  if (note) {
    note.title = noteTitle.value || 'Untitled Note';
    note.content = noteContent.value;
    saveNotes();
    renderNotes();
  }
}

function deleteCurrentNote() {
  if (currentNoteId === null || notes.length === 0) return;
  
  if (confirm('Delete this note?')) {
    notes = notes.filter(n => n.id !== currentNoteId);
    saveNotes();
    currentNoteId = null;
    noteTitle.value = '';
    noteContent.value = '';
    
    if (notes.length > 0) {
      selectNote(notes[0].id);
    } else {
      renderNotes();
    }
  }
}

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

if (notes.length > 0) {
  selectNote(notes[0].id);
} else {
  createNewNote();
}

renderNotes();
