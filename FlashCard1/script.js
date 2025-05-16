// Elements
const flashcardEl = document.getElementById('flashcard');
const frontEl = flashcardEl.querySelector('.front');
const backEl = flashcardEl.querySelector('.back');
const addBtn = document.getElementById('add-btn');
const formSection = document.getElementById('form-section');
const cardForm = document.getElementById('card-form');
const wordInput = document.getElementById('word-input');
const meaningInput = document.getElementById('meaning-input');
const cancelBtn = document.getElementById('cancel-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressEl = document.getElementById('progress');

// State
let flashcards = [];
let currentIndex = 0;
let isFlipped = false;
let editingIndex = null;

// Load from localStorage
function loadFlashcards() {
  const data = localStorage.getItem('flashcards');
  if (data) {
    flashcards = JSON.parse(data);
  } else {
    flashcards = [];
  }
}

// Save to localStorage
function saveFlashcards() {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Load current index from sessionStorage
function loadCurrentIndex() {
  const index = sessionStorage.getItem('currentIndex');
  if (index !== null && flashcards.length > 0) {
    currentIndex = Math.min(index, flashcards.length - 1);
  } else {
    currentIndex = 0;
  }
}

// Save current index to sessionStorage
function saveCurrentIndex() {
  sessionStorage.setItem('currentIndex', currentIndex);
}

// Update flashcard display
function updateFlashcard() {
  if (flashcards.length === 0) {
    frontEl.textContent = 'No flashcards available. Add some!';
    backEl.textContent = '';
    progressEl.textContent = '0 / 0';
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    return;
  }

  const card = flashcards[currentIndex];
  frontEl.textContent = card.word;
  backEl.textContent = card.meaning;
  progressEl.textContent = `${currentIndex + 1} / ${flashcards.length}`;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === flashcards.length - 1;
  if (isFlipped) {
    flashcardEl.classList.add('flipped');
  } else {
    flashcardEl.classList.remove('flipped');
  }
}

// Show form for new or editing card
function showForm(edit = false) {
  formSection.classList.remove('hidden');
  addBtn.disabled = true;
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  flashcardEl.style.pointerEvents = 'none';

  if (edit) {
    const card = flashcards[currentIndex];
    wordInput.value = card.word;
    meaningInput.value = card.meaning;
    editingIndex = currentIndex;
  } else {
    wordInput.value = '';
    meaningInput.value = '';
    editingIndex = null;
  }
  wordInput.focus();
}

// Hide form and reset
function hideForm() {
  formSection.classList.add('hidden');
  addBtn.disabled = false;
  prevBtn.disabled = false;
  nextBtn.disabled = false;
  flashcardEl.style.pointerEvents = 'auto';
  cardForm.reset();
  editingIndex = null;
}

// Add or update card on form submit
cardForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const word = wordInput.value.trim();
  const meaning = meaningInput.value.trim();
  if (!word || !meaning) return alert('Please fill both fields.');

  if (editingIndex !== null) {
    // Update existing
    flashcards[editingIndex] = { word, meaning };
  } else {
    // Add new
    flashcards.push({ word, meaning });
    currentIndex = flashcards.length - 1;
  }

  saveFlashcards();
  saveCurrentIndex();
  hideForm();
  isFlipped = false;
  updateFlashcard();
});

// Cancel button hides form
cancelBtn.addEventListener('click', () => {
  hideForm();
});

// Add new card button
addBtn.addEventListener('click', () => {
  showForm();
});

// Flip flashcard on click
flashcardEl.addEventListener('click', () => {
  if (flashcards.length === 0) return;
  isFlipped = !isFlipped;
  updateFlashcard();
});

// Navigation buttons
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    isFlipped = false;
    saveCurrentIndex();
    updateFlashcard();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < flashcards.length - 1) {
    currentIndex++;
    isFlipped = false;
    saveCurrentIndex();
    updateFlashcard();
  }
});

// Initial load
loadFlashcards();
loadCurrentIndex();
updateFlashcard();
