document.addEventListener("DOMContentLoaded", function() {
    const collapseButton = document.getElementById("expcol");
    const sidebar = document.querySelector(".sidebar");

    collapseButton.addEventListener("click", function() {
        sidebar.classList.toggle("collapsed");
        
        if (sidebar.classList.contains("collapsed")) {
            collapseButton.innerHTML = '<i class="fa-solid fa-up-right-and-down-left-from-center"></i>'; // Change icon to indicate expansion
        } else {
            collapseButton.innerHTML = '<i class="fa-solid fa-down-left-and-up-right-to-center"></i> Collapse'; // Original icon and text
        }
    });

    const newNoteButton = document.querySelector('.sidebar-button:nth-child(6)'); // New Note button
    const noteModal = document.getElementById('noteModal');
    const saveNoteButton = document.getElementById('saveNote');
    const cancelNoteButton = document.getElementById('cancelNote');
    const noteTextArea = document.getElementById('noteText');
    const notesGrid = document.getElementById('notesGrid');

    let currentEditingIndex = null; // To track which note is being edited

    // Load existing notes from local storage on page load
    const loadNotes = () => {
        const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        notesGrid.innerHTML = ''; // Clear existing notes in the grid
        storedNotes.forEach((note, index) => {
            displayNote(note, index);
        });
    };
    
    

    // Display a note in the grid
    const displayNote = (note, index) => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
    
        // Set a random light background color
        noteCard.style.backgroundColor = getRandomLightColor();
    
        // Create a paragraph element for better styling
        const noteContent = document.createElement('p');
        noteContent.innerHTML = note; // Use innerHTML to preserve formatting
        noteCard.appendChild(noteContent); // Append the paragraph to the card

        // Create edit and delete buttons
        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.innerHTML = '<i class="fa-solid fa-edit"></i>';
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        
        // Add event listeners for buttons
        editButton.addEventListener('click', () => {
            currentEditingIndex = index; // Set current editing index
            noteTextArea.innerHTML = note; // Populate modal with current note content
            noteModal.style.display = 'flex'; // Show modal for editing
            noteTextArea.focus(); // Focus on editable div
        });

        deleteButton.addEventListener('click', () => {
            let notesStorage = JSON.parse(localStorage.getItem('notes')) || [];
            notesStorage.splice(index, 1); // Remove note from array
            localStorage.setItem('notes', JSON.stringify(notesStorage)); // Update local storage
            notesGrid.removeChild(noteCard); // Remove card from grid
        });

        // Append buttons to the card
        noteCard.appendChild(editButton);
        noteCard.appendChild(deleteButton);

        notesGrid.appendChild(noteCard); // Append the card to the grid
    };

    // Show modal on New Note button click
    newNoteButton.addEventListener('click', () => {
        currentEditingIndex = null; // Reset editing index for new notes
        noteModal.style.display = 'flex'; // Show the modal
        noteTextArea.innerHTML = ''; // Clear previous text
        noteTextArea.focus(); // Focus on editable div
    });

    // Save note functionality
    saveNoteButton.addEventListener('click', () => {
        const noteContent = noteTextArea.innerHTML.trim();
        
        if (!noteContent || noteContent === '&nbsp;' ) {
            alert("Please enter some text before saving.");
            return;
        }

        let notesStorage = JSON.parse(localStorage.getItem('notes')) || [];
        
        if (currentEditingIndex !== null) {
            // If editing an existing note, update it
            notesStorage[currentEditingIndex] = noteContent;
        } else {
            // If creating a new note, add it to storage
            notesStorage.push(noteContent);
        }
        
        localStorage.setItem('notes', JSON.stringify(notesStorage));
        
        loadNotes(); // Reload notes to reflect changes in UI
        noteModal.style.display = 'none'; // Hide modal after saving
    });

    // Cancel button functionality
    cancelNoteButton.addEventListener('click', () => {
        noteModal.style.display = 'none'; // Hide modal on cancel
        noteTextArea.innerHTML = ''; // Clear content on cancel
    });

    loadNotes(); // Load notes when the page is loaded

});

// Function to generate a random light color
function getRandomLightColor() {
   const r = Math.floor(Math.random() * 256);
   const g = Math.floor(Math.random() * 256);
   const b = Math.floor(Math.random() * 256);
   return `rgb(${Math.min(r + 100, 255)}, ${Math.min(g + 100, 255)}, ${Math.min(b + 100, 255)})`;
}

// Function to check if there is any text content in the editable div
function hasTextContent(element) {
   const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
   return textNodes.some(node => node.nodeValue.trim().length > 0);
}

// Bold and Italic Functionality

document.addEventListener('DOMContentLoaded', () => {
    const boldButton = document.getElementById('boldButton');
    const italicButton = document.getElementById('italicButton');

    // Function to toggle bold formatting using Range API
    boldButton.addEventListener('click', () => {
        toggleBold();
        noteTextArea.focus(); // Keep focus on editable div
    });

    // Function to toggle italic formatting using Range API
    italicButton.addEventListener('click', () => {
        toggleItalic();
        noteTextArea.focus(); // Keep focus on editable div
    });
});

// Function to toggle bold formatting using Range API
function toggleBold() {
   const selection = window.getSelection();
   if (selection.rangeCount > 0) {
       const range = selection.getRangeAt(0);
       const boldElement = document.createElement("strong");
       
       try {
           range.surroundContents(boldElement);
       } catch (e) {
           console.error("Could not apply bold formatting: ", e);
           alert("Please select text to apply bold formatting.");
       }
   }
}

// Function to toggle italic formatting using Range API
function toggleItalic() {
   const selection = window.getSelection();
   if (selection.rangeCount > 0) {
       const range = selection.getRangeAt(0);
       const italicElement = document.createElement("em");
       
       try {
           range.surroundContents(italicElement);
       } catch (e) {
           console.error("Could not apply italic formatting: ", e);
           alert("Please select text to apply italic formatting.");
       }
   }
}

