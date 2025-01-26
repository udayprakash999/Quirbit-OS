const bootScreen = document.getElementById("boot-screen");
const mainContent = document.getElementById("mainContent");
const bootText = bootScreen.innerHTML;
bootScreen.innerHTML = "";
let charIndex = 0;
const typeSpeed = 50;

function typeText() {
  if (charIndex < bootText.length) {
    bootScreen.innerHTML += bootText.charAt(charIndex);
    charIndex++;
    setTimeout(typeText, typeSpeed);
  } else {
    const boot = new Audio("startup.mp3");
    boot.play();
    setTimeout(() => {
      bootScreen.classList.add("fade-out");
      setTimeout(() => {
        bootScreen.style.display = "none";
        mainContent.style.display = "block";
      }, 1000);
    }, 500);
  }
}

setTimeout(typeText, 500);
setInterval(() => {
  document.querySelector("#timeos").innerHTML = new Date().toLocaleString();
}, 1000);

function makeDraggable(elmnt, headerId) {
  const header = headerId ? document.getElementById(headerId) : elmnt;
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  header.onmousedown = function (e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = stopDrag;
    document.onmousemove = startDrag;
  };

  function startDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function stopDrag() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

makeDraggable(document.getElementById("adminWindow"), "adminHeader");
makeDraggable(document.getElementById("stickyNotesModal"), "stickyHeader");

document.getElementById("adminClose").addEventListener("click", () => {
  document.getElementById("adminWindow").style.display = "none";
});

document.getElementById("adminOpen").addEventListener("click", () => {
  document.getElementById("adminWindow").style.display = "block";
});

const openStickyNotesBtn = document.getElementById("openStickyNotes");
const stickyNotesModal = document.getElementById("stickyNotesModal");
const closeStickyNotesBtn = document.getElementById("closeStickyNotes");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");

const noteColors = [
  "#FFEBEE",
  "#E8F5E9",
  "#E3F2FD",
  "#FFF3E0",
  "#F3E5F5",
  "#E0F7FA",
];

function toggleModal(show) {
  stickyNotesModal.classList.toggle("active", show);
}

openStickyNotesBtn.addEventListener("click", () => toggleModal(true));
closeStickyNotesBtn.addEventListener("click", () => toggleModal(false));

function createNote(content = "", color = "") {
  const note = document.createElement("div");
  note.classList.add("note");

  const backgroundColor =
    color || noteColors[Math.floor(Math.random() * noteColors.length)];
  note.style.backgroundColor = backgroundColor;

  note.innerHTML = `<textarea>${content}</textarea><button>Delete</button>`;
  notesContainer.appendChild(note);

  note.querySelector("button").addEventListener("click", () => {
    notesContainer.removeChild(note);
    saveNotes();
  });

  note.querySelector("textarea").addEventListener("input", saveNotes);

  saveNotes();
}

function saveNotes() {
  const notes = Array.from(notesContainer.querySelectorAll(".note")).map(
    (note) => ({
      content: note.querySelector("textarea").value,
      color: note.style.backgroundColor,
    })
  );
  localStorage.setItem("stickyNotes", JSON.stringify(notes));
}

function loadNotes() {
  const savedNotes = JSON.parse(localStorage.getItem("stickyNotes") || "[]");
  savedNotes.forEach((savedNote) =>
    createNote(savedNote.content, savedNote.color)
  );
}

addNoteBtn.addEventListener("click", () => createNote());
window.addEventListener("load", loadNotes);

const openCalculatorBtn = document.getElementById("openCalculator");
const calculatorModal = document.getElementById("calculatorModal");
const closeCalculatorBtn = document.getElementById("closeCalculator");
const calcDisplay = document.getElementById("calcDisplay");
const calcButtons = document.querySelectorAll(".calc-btn");

let calcInput = "";

function updateDisplay() {
  calcDisplay.value = calcInput || "0";
}

function calculateResult() {
  try {
    calcInput = eval(calcInput).toString();
  } catch {
    calcInput = "Error";
  }
  updateDisplay();
}

calcButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "C") {
      calcInput = "";
    } else if (value === "=") {
      calculateResult();
      return;
    } else {
      calcInput += value;
    }
    updateDisplay();
  });
});

openCalculatorBtn.addEventListener("click", () => {
  calculatorModal.classList.add("active");
});

closeCalculatorBtn.addEventListener("click", () => {
  calculatorModal.classList.remove("active");
});

makeDraggable(calculatorModal, "calculatorHeader");

const openGame2048Btn = document.getElementById("openGame2048");
const game2048Modal = document.getElementById("game2048Modal");
const closeGame2048Btn = document.getElementById("closeGame2048");
const gameBoard = document.getElementById("gameBoard");
const restartGameBtn = document.getElementById("restartGame");

let board = [];
const size = 4;

function initBoard() {
  board = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));
  addRandomTile();
  addRandomTile();
  renderBoard();
}

function renderBoard() {
  gameBoard.innerHTML = "";
  board.forEach((row) => {
    row.forEach((tile) => {
      const tileDiv = document.createElement("div");
      tileDiv.className = "tile";
      tileDiv.textContent = tile > 0 ? tile : "";
      tileDiv.style.backgroundColor =
        tile > 0 ? `rgb(${240 - tile}, ${220 - tile / 2}, ${200})` : "#cdc1b4";
      gameBoard.appendChild(tileDiv);
    });
  });
}

function addRandomTile() {
  const emptyTiles = [];
  board.forEach((row, r) =>
    row.forEach((tile, c) => tile === 0 && emptyTiles.push({ r, c }))
  );
  if (emptyTiles.length === 0) return;
  const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function moveTiles(direction) {
  let moved = false;

  for (let i = 0; i < size; i++) {
    let tiles = board[i];
    if (direction === "up" || direction === "down")
      tiles = board.map((row) => row[i]);

    const filteredTiles = tiles.filter((tile) => tile > 0);
    for (let j = 0; j < filteredTiles.length - 1; j++) {
      if (filteredTiles[j] === filteredTiles[j + 1]) {
        filteredTiles[j] *= 2;
        filteredTiles.splice(j + 1, 1);
      }
    }

    const newTiles = Array(size).fill(0);
    if (direction === "right" || direction === "down") {
      filteredTiles.reverse();
      newTiles.splice(
        size - filteredTiles.length,
        filteredTiles.length,
        ...filteredTiles.reverse()
      );
    } else {
      newTiles.splice(0, filteredTiles.length, ...filteredTiles);
    }

    if (direction === "up" || direction === "down") {
      for (let r = 0; r < size; r++) {
        if (board[r][i] !== newTiles[r]) moved = true;
        board[r][i] = newTiles[r];
      }
    } else {
      if (board[i].join() !== newTiles.join()) moved = true;
      board[i] = newTiles;
    }
  }

  if (moved) {
    addRandomTile();
    renderBoard();
  }
}

function handleInput(event) {
  const key = event.key;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    event.preventDefault();
    moveTiles(key.replace("Arrow", "").toLowerCase());
  }
}

openGame2048Btn.addEventListener("click", () => {
  game2048Modal.classList.add("active");
  initBoard();
  document.addEventListener("keydown", handleInput);
});

closeGame2048Btn.addEventListener("click", () => {
  game2048Modal.classList.remove("active");
  document.removeEventListener("keydown", handleInput);
});

restartGameBtn.addEventListener("click", initBoard);

makeDraggable(game2048Modal, "gameHeader");

let tileMoved = false;

function showGameOverPopup() {
  const gameOverPopup = document.createElement("div");
  gameOverPopup.className = "game-over-popup";
  gameOverPopup.innerHTML = `
    <div class="game-over-content">
      <h2>Game Over!</h2>
      <button id="closeGameOver">Try Again</button>
    </div>
  `;
  game2048Modal.appendChild(gameOverPopup);

  document.getElementById("closeGameOver").addEventListener("click", () => {
    game2048Modal.removeChild(gameOverPopup);
    initBoard();
  });
}

function isGameOver() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) return false;
      if (r > 0 && board[r][c] === board[r - 1][c]) return false;
      if (c > 0 && board[r][c] === board[r][c - 1]) return false;
    }
  }
  return true;
}

function renderBoard() {
  gameBoard.innerHTML = "";
  board.forEach((row, r) => {
    row.forEach((tile, c) => {
      const tileDiv = document.createElement("div");
      tileDiv.className = `tile ${tileMoved ? "tile-animate" : ""}`;
      tileDiv.textContent = tile > 0 ? tile : "";
      tileDiv.style.backgroundColor =
        tile > 0 ? `rgb(${240 - tile}, ${220 - tile / 2}, ${200})` : "#cdc1b4";
      tileDiv.style.transform = `scale(${tileMoved ? 1.1 : 1})`;
      gameBoard.appendChild(tileDiv);
    });
  });

  if (isGameOver()) {
    showGameOverPopup();
  }
}

function moveTiles(direction) {
  tileMoved = false;

  for (let i = 0; i < size; i++) {
    let tiles = board[i];
    if (direction === "up" || direction === "down")
      tiles = board.map((row) => row[i]);

    const filteredTiles = tiles.filter((tile) => tile > 0);
    for (let j = 0; j < filteredTiles.length - 1; j++) {
      if (filteredTiles[j] === filteredTiles[j + 1]) {
        filteredTiles[j] *= 2;
        filteredTiles.splice(j + 1, 1);
        tileMoved = true;
      }
    }

    const newTiles = Array(size).fill(0);
    if (direction === "right" || direction === "down") {
      filteredTiles.reverse();
      newTiles.splice(
        size - filteredTiles.length,
        filteredTiles.length,
        ...filteredTiles.reverse()
      );
    } else {
      newTiles.splice(0, filteredTiles.length, ...filteredTiles);
    }

    if (direction === "up" || direction === "down") {
      for (let r = 0; r < size; r++) {
        if (board[r][i] !== newTiles[r]) tileMoved = true;
        board[r][i] = newTiles[r];
      }
    } else {
      if (board[i].join() !== newTiles.join()) tileMoved = true;
      board[i] = newTiles;
    }
  }

  if (tileMoved) {
    addRandomTile();
    renderBoard();
  }
}

const googleDocsModal = document.getElementById("googleDocsModal");
const openGoogleDocsBtn = document.getElementById("openGoogleDocs");
const closeGoogleDocsBtn = document.getElementById("closeGoogleDocs");
const saveDocBtn = document.getElementById("saveDocBtn");
const docsEditor = document.getElementById("docsEditor");

const webFolder = document.getElementById("webFolder");
const openWebFolderBtn = document.getElementById("openWebFolder");
const closeWebFolderBtn = document.getElementById("closeWebFolder");
const docList = document.getElementById("docList");

openGoogleDocsBtn.addEventListener("click", () =>
  googleDocsModal.classList.add("active")
);
closeGoogleDocsBtn.addEventListener("click", () =>
  googleDocsModal.classList.remove("active")
);
openWebFolderBtn.addEventListener("click", () => {
  loadFolder();
  webFolder.classList.add("active");
});
closeWebFolderBtn.addEventListener("click", () =>
  webFolder.classList.remove("active")
);

saveDocBtn.addEventListener("click", () => {
  const docContent = docsEditor.value.trim();
  if (docContent) {
    const docName = prompt("Enter a name for your document:");
    if (docName) {
      localStorage.setItem(`app/${docName}`, docContent);
      alert(`Document "${docName}" saved!`);
      docsEditor.value = "";
      loadFolder();
      googleDocsModal.classList.remove("active");
    }
  } else {
    alert("Cannot save an empty document!");
  }
});

function loadFolder() {
  docList.innerHTML = "";
  for (const key in localStorage) {
    if (key.startsWith("app/")) {
      const docName = key.replace("app/", "");
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <span>${docName}</span>
        <button class="edit-doc" data-name="${docName}">Edit</button>
        <button class="view-doc" data-name="${docName}">View</button>
        <button class="delete-doc" data-name="${docName}">Delete</button>
      `;
      docList.appendChild(listItem);
    }
  }

  document.querySelectorAll(".edit-doc").forEach((button) => {
    button.addEventListener("click", () =>
      openDocument(button.dataset.name, true)
    );
  });

  document.querySelectorAll(".view-doc").forEach((button) => {
    button.addEventListener("click", () =>
      openDocument(button.dataset.name, false)
    );
  });

  document.querySelectorAll(".delete-doc").forEach((button) => {
    button.addEventListener("click", () => deleteDocument(button.dataset.name));
  });
}

function openDocument(docName, isEdit) {
  const docContent = localStorage.getItem(`app/${docName}`);
  if (docContent !== null) {
    document.getElementById("docNameDisplay").textContent = docName;

    docsEditor.value = docContent;
    if (isEdit) {
      docsEditor.removeAttribute("readonly");
      saveDocBtn.style.display = "inline-block";
    } else {
      docsEditor.setAttribute("readonly", "true");
      saveDocBtn.style.display = "none";
    }
    googleDocsModal.classList.add("active");
  } else {
    alert("Document not found!");
  }
}

function deleteDocument(docName) {
  if (confirm(`Are you sure you want to delete "${docName}"?`)) {
    localStorage.removeItem(`app/${docName}`);
    alert(`Document "${docName}" deleted.`);
    loadFolder();
  }
}

makeDraggable(googleDocsModal, "googleDocsHeader");
makeDraggable(webFolder, "webFolderHeader");

const mediaPlayer = document.getElementById("mediaPlayer");
const openMediaPlayerBtn = document.getElementById("openMediaPlayer");
const closeMediaPlayerBtn = document.getElementById("closeMediaPlayer");
const audioPlayer = document.getElementById("audioPlayer");
const audioSource = document.getElementById("audioSource");
const songTitle = document.getElementById("songTitle");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevSongBtn = document.getElementById("prevSongBtn");
const nextSongBtn = document.getElementById("nextSongBtn");
const stopBtn = document.getElementById("stopBtn");
const songUpload = document.getElementById("songUpload");
const songListUl = document.getElementById("songListUl");

let songList = [
  {
    name: "Juice Wrld - Lucid Dreams",
    url: "media-player-song/Juice_Wrld_-_Lucid_Dreams.mp3",
  },
  {
    name: "Juice Wrld - Stay High",
    url: "media-player-song/Juice_Wrld_-_Stay_High.mp3",
  },
];
let currentSongIndex = 0;

openMediaPlayerBtn.addEventListener("click", () =>
  mediaPlayer.classList.add("active")
);
closeMediaPlayerBtn.addEventListener("click", () =>
  mediaPlayer.classList.remove("active")
);

songUpload.addEventListener("change", (e) => {
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith("audio/")) {
      songList.push({ name: file.name, url: URL.createObjectURL(file) });
    }
  }
  if (songList.length > 0) {
    loadSong(currentSongIndex);
    updateSongList();
  }
});

function updateSongList() {
  songListUl.innerHTML = "";
  songList.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.name;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      songList.splice(index, 1);
      updateSongList();
      if (currentSongIndex >= songList.length) {
        currentSongIndex = songList.length - 1;
      }
      loadSong(currentSongIndex);
    });

    li.appendChild(deleteBtn);

    li.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
      audioPlayer.play();
      playPauseBtn.textContent = "Pause";
    });
    songListUl.appendChild(li);
  });
}

playPauseBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseBtn.textContent = "Pause";
  } else {
    audioPlayer.pause();
    playPauseBtn.textContent = "Play";
  }
});

stopBtn.addEventListener("click", () => {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  playPauseBtn.textContent = "Play";
});

nextSongBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songList.length;
  loadSong(currentSongIndex);
  audioPlayer.play();
  playPauseBtn.textContent = "Pause";
});

prevSongBtn.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;
  loadSong(currentSongIndex);
  audioPlayer.play();
  playPauseBtn.textContent = "Pause";
});

function loadSong(index) {
  if (songList.length > 0) {
    const song = songList[index];
    audioSource.src = song.url;
    songTitle.textContent = song.name;
    audioPlayer.load();
  }
}

makeDraggable(mediaPlayer, "mediaPlayerHeader");

window.addEventListener("load", () => {
  if (songList.length > 0) {
    loadSong(currentSongIndex);
    updateSongList();
  }
});

const contactManager = document.getElementById("contactManager");
const contactListUl = document.getElementById("contactListUl");
const contactNameInput = document.getElementById("contactName");
const contactPhoneInput = document.getElementById("contactPhone");
const contactEmailInput = document.getElementById("contactEmail");
const addContactBtn = document.getElementById("addContactBtn");
const openContactManagerBtn = document.getElementById("openContactManager");
const closeContactManagerBtn = document.getElementById("closeContactManager");

function toggleContactManager(show) {
  contactManager.classList.toggle("active", show);
}

openContactManagerBtn.addEventListener("click", () =>
  toggleContactManager(true)
);
closeContactManagerBtn.addEventListener("click", () =>
  toggleContactManager(false)
);

function addContact() {
  const name = contactNameInput.value.trim();
  const phone = contactPhoneInput.value.trim();
  const email = contactEmailInput.value.trim();

  if (name && phone && email) {
    const contactItem = document.createElement("li");
    contactItem.innerHTML = `
      <strong>${name}</strong><br/>
      ${phone}<br/>
      ${email}
      <button class="delete-contact">Delete</button>
    `;

    const deleteBtn = contactItem.querySelector(".delete-contact");
    deleteBtn.addEventListener("click", () => {
      contactItem.remove();
      saveContacts();
    });

    contactListUl.appendChild(contactItem);
    saveContacts();

    contactNameInput.value = "";
    contactPhoneInput.value = "";
    contactEmailInput.value = "";
  }
}

function saveContacts() {
  const contacts = [];
  contactListUl.querySelectorAll("li").forEach((contact) => {
    const name = contact.querySelector("strong").textContent;
    const phone = contact
      .querySelector("br:nth-of-type(1)")
      .nextSibling.textContent.trim();
    const email = contact
      .querySelector("br:nth-of-type(2)")
      .nextSibling.textContent.trim();
    contacts.push({ name, phone, email });
  });
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function loadContacts() {
  const savedContacts = JSON.parse(localStorage.getItem("contacts") || "[]");
  savedContacts.forEach((contact) => {
    const contactItem = document.createElement("li");
    contactItem.innerHTML = `
      <strong>${contact.name}</strong><br/>
      ${contact.phone}<br/>
      ${contact.email}
      <button class="delete-contact">Delete</button>
    `;

    const deleteBtn = contactItem.querySelector(".delete-contact");
    deleteBtn.addEventListener("click", () => {
      contactItem.remove();
      saveContacts();
    });

    contactListUl.appendChild(contactItem);
  });
}

addContactBtn.addEventListener("click", addContact);

window.addEventListener("load", loadContacts);

function makeDraggable(elmnt, headerId) {
  const header = headerId ? document.getElementById(headerId) : elmnt;
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  header.onmousedown = function (e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = stopDrag;
    document.onmousemove = startDrag;
  };

  function startDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function stopDrag() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

makeDraggable(contactManager, "contactManagerHeader");

document.addEventListener("DOMContentLoaded", () => {
  const pongGameModal = document.getElementById("pongGameModal");
  const openPongGameButton = document.getElementById("openPongGame");
  const closePongGameButton = document.getElementById("closePongGame");

  openPongGameButton.addEventListener("click", () => {
    pongGameModal.style.display = "block";
  });

  closePongGameButton.addEventListener("click", () => {
    pongGameModal.style.display = "none";
  });

  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");

  let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 3,
    dy: 3,
  };

  let paddle1 = {
    x: 10,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    dy: 0,
  };

  let paddle2 = {
    x: canvas.width - 20,
    y: canvas.height / 2 - 40,
    width: 10,
    height: 80,
    dy: 0,
  };

  let score1 = 0;
  let score2 = 0;

  let keys = {};

  window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle(paddle) {
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  }

  function movePaddles() {
    if (keys["w"] && paddle1.y > 0) {
      paddle1.dy = -4;
    } else if (keys["s"] && paddle1.y + paddle1.height < canvas.height) {
      paddle1.dy = 4;
    } else {
      paddle1.dy = 0;
    }

    if (keys["ArrowUp"] && paddle2.y > 0) {
      paddle2.dy = -4;
    } else if (
      keys["ArrowDown"] &&
      paddle2.y + paddle2.height < canvas.height
    ) {
      paddle2.dy = 4;
    } else {
      paddle2.dy = 0;
    }

    paddle1.y += paddle1.dy;
    paddle2.y += paddle2.dy;
  }

  function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.dy *= -1;
    }

    if (
      ball.x - ball.radius < paddle1.x + paddle1.width &&
      ball.y > paddle1.y &&
      ball.y < paddle1.y + paddle1.height
    ) {
      ball.dx *= -1;
    }

    if (
      ball.x + ball.radius > paddle2.x &&
      ball.y > paddle2.y &&
      ball.y < paddle2.y + paddle2.height
    ) {
      ball.dx *= -1;
    }

    if (ball.x - ball.radius < 0) {
      score2 += 1;
      resetBall();
    }

    if (ball.x + ball.radius > canvas.width) {
      score1 += 1;
      resetBall();
    }
  }

  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
  }

  function updateScore() {
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = `Player 1: ${score1} | Player 2: ${score2}`;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(paddle1);
    drawPaddle(paddle2);
    movePaddles();
    moveBall();
    updateScore();
  }

  setInterval(draw, 16);
});

document.addEventListener("DOMContentLoaded", () => {
  const activeAppDisplay = document.getElementById("activeApp");
  const activeApps = [];

  const appButtons = {
    openCalculator: "Calculator",
    closeCalculator: "Calculator",
    openStickyNotes: "Sticky Notes",
    closeStickyNotes: "Sticky Notes",
    openGame2048: "2048 Game",
    closeGame2048: "2048 Game",
    openGoogleDocs: "QuickDoc",
    closeGoogleDocs: "QuickDoc",
    openMediaPlayer: "Jamify",
    closeMediaPlayer: "Jamify",
    openWebFolder: "Web Folder",
    closeWebFolder: "Web Folder",
    openContactManager: "Contact Manager",
    closeContactManager: "Contact Manager",
    openPongGame: "Pong Game",
    closePongGame: "Pong Game",
    openPhotoApp: "Photo Gallery",
    closePhotoApp: "Photo Gallery",
  };

  function updateActiveAppDisplay() {
    if (activeApps.length === 0) {
      activeAppDisplay.textContent = "No app opened";
    } else {
      activeAppDisplay.textContent = `Active App: ${
        activeApps[activeApps.length - 1]
      }`;
    }
  }

  function openApp(appName) {
    if (!activeApps.includes(appName)) {
      activeApps.push(appName);
    }
    updateActiveAppDisplay();
  }

  function closeApp(appName) {
    const index = activeApps.indexOf(appName);
    if (index !== -1) {
      activeApps.splice(index, 1);
    }
    updateActiveAppDisplay();
  }

  for (const [buttonId, appName] of Object.entries(appButtons)) {
    const button = document.getElementById(buttonId);
    if (button) {
      if (buttonId.startsWith("open")) {
        button.addEventListener("click", () => {
          openApp(appName);
          document.getElementById(
            appName.toLowerCase() + "Modal"
          ).style.display = "block";
        });
      } else if (buttonId.startsWith("close")) {
        button.addEventListener("click", () => {
          closeApp(appName);
          document.getElementById(
            appName.toLowerCase() + "Modal"
          ).style.display = "none";
        });
      }
    }
  }

  updateActiveAppDisplay();
});

document.addEventListener("DOMContentLoaded", () => {
  const photoAppModal = document.getElementById("photoAppModal");
  const openPhotoApp = document.getElementById("openPhotoApp");
  const closePhotoApp = document.getElementById("closePhotoApp");

  const photoList = document.getElementById("photoList");
  const uploadPhotoInput = document.getElementById("uploadPhotoInput");
  const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");

  const photoViewerPopup = document.getElementById("photoViewerPopup");
  const closePhotoViewerPopup = document.getElementById(
    "closePhotoViewerPopup"
  );
  const largePhoto = document.getElementById("largePhoto");

  openPhotoApp.addEventListener("click", () => {
    photoAppModal.style.display = "block";
  });

  closePhotoApp.addEventListener("click", () => {
    photoAppModal.style.display = "none";
  });

  uploadPhotoBtn.addEventListener("click", () => {
    const files = uploadPhotoInput.files;
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const photoContainer = document.createElement("div");
          photoContainer.classList.add("photo-thumbnail-container");

          const imgElement = document.createElement("img");
          imgElement.src = e.target.result;
          imgElement.classList.add("photo-thumbnail");
          imgElement.style.cursor = "pointer";
          imgElement.draggable = true;

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "X";
          deleteBtn.classList.add("delete-btn");

          deleteBtn.addEventListener("click", () => {
            photoContainer.remove();
          });

          imgElement.addEventListener("click", () => {
            largePhoto.src = e.target.result;
            photoViewerPopup.style.display = "block";
          });

          photoContainer.appendChild(imgElement);
          photoContainer.appendChild(deleteBtn);
          photoList.appendChild(photoContainer);
        };
        reader.readAsDataURL(file);
      });
    }
  });

  closePhotoViewerPopup.addEventListener("click", () => {
    photoViewerPopup.style.display = "none";
  });

  const draggables = document.querySelectorAll(".draggable");
  draggables.forEach((draggable) => {
    const header = draggable.querySelector(".draggable-header");
    if (header) {
      let offsetX = 0,
        offsetY = 0;
      header.addEventListener("mousedown", (e) => {
        offsetX = e.clientX - draggable.getBoundingClientRect().left;
        offsetY = e.clientY - draggable.getBoundingClientRect().top;

        const moveAt = (pageX, pageY) => {
          draggable.style.left = `${pageX - offsetX}px`;
          draggable.style.top = `${pageY - offsetY}px`;
        };

        const onMouseMove = (e) => moveAt(e.pageX, e.pageY);
        document.addEventListener("mousemove", onMouseMove);

        document.addEventListener(
          "mouseup",
          () => {
            document.removeEventListener("mousemove", onMouseMove);
          },
          { once: true }
        );
      });
    }
  });
});
