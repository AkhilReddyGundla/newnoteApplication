// Selecting DOM elements
let input = document.querySelector('.input-btn');
let popup = document.querySelector('.popup');
let close = document.querySelector('.close');
const pin = document.querySelector('#pin');
const pinnedArea = document.querySelector('.pinnedNotes');
const unPinnedArea = document.querySelector('.unPinnedNotes');
const addTitle = document.getElementById('title');
const addTagLine = document.getElementById('tagline');
const addDescription = document.getElementById('description');
const save = document.querySelector('.save');
let currentNotesPopup = document.querySelector('.notesPopup');
let date = document.querySelector('.date');
let cardBody = document.querySelector('.newCard-body');
let togglePin = document.querySelector('#pinIt');
let pinnedNotesArr = [];
let unPinnedNotesArr = [];

input.addEventListener('click', () => {
  if (popup.style.display === 'none' || popup.style.display === '') {
    popup.style.display = 'block';
  } else {
    popup.style.display = 'none';
  }
});

close.addEventListener('click', () => {
  popup.style.display = 'none';
});

function addToPinnedArea() {
  const currentTitle = addTitle.value;
  const currentTagline = addTagLine.value;
  const currentDescription = addDescription.value;
  if (currentDescription === '') {
    alert('Please add description to your note');
    return;
  }
  const newNotesObj = {
    title: currentTitle,
    tagline: currentTagline,
    discription: currentDescription,
  };
  pinnedNotesArr.unshift(newNotesObj);
  displayPinnedNotes();
  popup.style.display = 'none';
}

function addToUnpinnedArea() {
  const currentTitle = addTitle.value;
  const currentTagline = addTagLine.value;
  const currentDescription = addDescription.value;
  if (currentDescription === '') {
    alert('Please add description to your note');
    return;
  }
  const newNotesObj = {
    title: currentTitle,
    tagline: currentTagline,
    discription: currentDescription,
  };
  unPinnedNotesArr.unshift(newNotesObj);
  displayUnpinnedNotes();
  popup.style.display = 'none';
}

function displayPinnedNotes() {
  while (pinnedArea.firstChild) {
    pinnedArea.removeChild(pinnedArea.firstChild);
  }
  let notes = '';
  for (let i = 0; i < pinnedNotesArr.length; i++) {
    notes += `
      <div class="note pinned">
        <div class="note-content">
          <div class="title">${pinnedNotesArr[i].title}</div>
          <div class="tagline">${pinnedNotesArr[i].tagline}</div>
          <div class="text">${pinnedNotesArr[i].discription}</div>
        </div>
      </div>`;
  }
  pinnedArea.innerHTML = notes;
}

function displayUnpinnedNotes() {
  while (unPinnedArea.firstChild) {
    unPinnedArea.removeChild(unPinnedArea.firstChild);
  }
  let notes = '';
  for (let i = 0; i < unPinnedNotesArr.length; i++) {
    notes += `
      <div class="note unpinned">
        <div class="unote-content">
          <div class="title">${unPinnedNotesArr[i].title}</div>
          <div class="tagline">${unPinnedNotesArr[i].tagline}</div>
          <div class="text">${unPinnedNotesArr[i].discription}</div>
        </div>
      </div>`;
  }
  unPinnedArea.innerHTML = notes;
}

unPinnedArea.addEventListener('click', (event) => {
  const targetNote = event.target.closest('.unpinned');
  if (targetNote) {
    togglePin.innerHTML = 'PIN';
    popupNotes(targetNote);
  }
});

pinnedArea.addEventListener('click', (event) => {
  const targetNote = event.target.closest('.pinned');
  if (targetNote) {
    togglePin.innerHTML = 'UNPIN';
    popupNotes(targetNote);
  }
});

function getDate() {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const currentDate = new Date().toLocaleDateString(undefined, options);
  return currentDate;
}

function updateDate() {
  const currentDate = getDate();
  date.innerHTML = currentDate;
  return currentDate;
}

function popupNotes(targetNote) {
  let titleElement = targetNote.querySelector('.title');
  let taglineElement = targetNote.querySelector('.tagline');
  let descriptionElement = targetNote.querySelector('.text');

  const newDate = updateDate();
  date.textContent = `last edit ${newDate}`;

  let newBody = document.createElement('div');
  let titleDiv = document.createElement('div');
  titleDiv.setAttribute('contenteditable', 'true');
  titleDiv.innerHTML = titleElement.textContent;
  newBody.appendChild(titleDiv);
  let taglineDiv = document.createElement('div');
  taglineDiv.setAttribute('contenteditable', 'true');
  taglineDiv.innerHTML = taglineElement.textContent;
  newBody.appendChild(taglineDiv);

  let descriptionDiv = document.createElement('div');
  descriptionDiv.innerHTML = descriptionElement.textContent;
  descriptionDiv.setAttribute('contenteditable', 'true');
  newBody.appendChild(descriptionDiv);

  cardBody.innerHTML = ''; // Clear the existing content of cardBody
  cardBody.appendChild(newBody);

  currentNotesPopup.style.display = 'block';

  let closePopupBtn = currentNotesPopup.querySelector('#closePopup');
  let savePopupBtn = currentNotesPopup.querySelector('#savePopup');
  let pinIt = currentNotesPopup.querySelector('#pinIt');

  pinIt.addEventListener('click', () => {
    let copyNote = {
      title: titleElement.textContent,
      tagline: taglineElement.textContent,
      discription: descriptionElement.textContent,
    };

    if (pinIt.innerHTML === 'PIN') {
      unPinnedNotesArr = unPinnedNotesArr.filter((element) => element !== copyNote);
      pinnedNotesArr.unshift(copyNote);
    } else {
      pinnedNotesArr = pinnedNotesArr.filter((element) => element !== copyNote);
      let parentPopup = targetNote.closest('.notesPopup');
      if (parentPopup) {
        parentPopup.style.display = 'none';
      }
      unPinnedNotesArr.unshift(copyNote);
    }

    // Update the displayed notes
    displayPinnedNotes();
    displayUnpinnedNotes();
  });

  closePopupBtn.addEventListener('click', () => {
    currentNotesPopup.style.display = 'none';
  });
  savePopupBtn.addEventListener('click', () => {
    let newTitleContent = titleDiv.textContent.trim();
    let newTaglineContent = taglineDiv.textContent.trim();
    let newDescriptionContent = descriptionDiv.textContent.trim();

    // Check if the new note already exists in pinnedNotesArr
    let indxInPin = pinnedNotesArr.findIndex((note) => {
      return (
        note.title === newTitleContent &&
        note.tagline === newTaglineContent &&
        note.description === newDescriptionContent
      );
    });
    let indexInUnPin = unPinnedNotesArr.findIndex((note) => {
      return (
        note.title === newTitleContent &&
        note.tagline === newTaglineContent &&
        note.description === newDescriptionContent
      );
    });

    if (indxInPin !== -1) {
      const existingNote = pinnedNotesArr[indxInPin];
      if (existingNote.title != newTitleContent) {
        existingNote.title = newTitleContent;
      }
      if (existingNote.tagline != newTaglineContent) {
        existingNote.tagline = newTaglineContent;
      }
      if (existingNote.description != newDescriptionContent) {
        existingNote.description = newDescriptionContent;
      }
    } else if (indexInUnPin !== -1) {
      const existingNote = unPinnedNotesArr[indexInUnPin];
      if (existingNote.title != newTitleContent) {
        existingNote.title = newTitleContent;
      }
      if (existingNote.tagline != newTaglineContent) {
        existingNote.tagline = newTaglineContent;
      }
      if (existingNote.description != newDescriptionContent) {
        existingNote.description = newDescriptionContent;
      }
    }
  });
}

pin.addEventListener('click', addToPinnedArea);
save.addEventListener('click', addToUnpinnedArea);

// Display the notes when the page is loaded
displayPinnedNotes();
displayUnpinnedNotes();

// Constants for pagination
const notesPerPage = 6;
let currentPage = 1;

// Function to display notes based on the current page
function displayPinnedNotesByPage(page) {
  const startIndex = (page - 1) * notesPerPage;
  const endIndex = startIndex + notesPerPage;
  const currentNotes = pinnedNotesArr.slice(startIndex, endIndex);
  displayNotes(currentNotes, pinnedArea);
}

function displayUnpinnedNotesByPage(page) {
  const startIndex = (page - 1) * notesPerPage;
  const endIndex = startIndex + notesPerPage;
  const currentNotes = unPinnedNotesArr.slice(startIndex, endIndex);
  displayNotes(currentNotes, unPinnedArea);
}

// Function to display notes in the given area
function displayNotes(notesArray, area) {
  area.innerHTML = ''; // Clear the existing content

  let notes = '';
  for (let i = 0; i < notesArray.length; i++) {
    notes += `
      <div class="note ${area === pinnedArea ? 'pinned' : 'unpinned'}">
        <div class="note-content">
          <div class="title">${notesArray[i].title}</div>
          <div class="tagline">${notesArray[i].tagline}</div>
          <div class="text">${notesArray[i].discription}</div>
        </div>
      </div>`;
  }

  area.innerHTML = notes;
}


