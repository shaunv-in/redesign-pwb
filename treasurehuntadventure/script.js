// Game configuration and constants
const gridSize = 10; // Size of the game grid (10x10)
const gameContainer = document.getElementById('game-container');

let initialLevels = [
  // Level 1 (Beginner)
  // 'wall' represents an obstacle, 'path' is where the player can move, 'treasure' is collectible, and 'exit' is the goal
  [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'exit', 'wall'],
    ['wall', 'path', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'path', 'wall'],
    ['wall', 'path', 'wall', 'path', 'path', 'path', 'wall', 'path', 'wall', 'wall'],
    ['wall', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'wall', 'wall'],
    ['wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'wall', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'path', 'wall', 'path', 'path', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'wall'],
    ['wall', 'path', 'path', 'treasure', 'wall', 'path', 'path', 'path', 'wall', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
  ],
  
  // Level 2 (Intermediate)
  [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'wall', 'path', 'path', 'wall', 'path', 'exit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'path', 'wall', 'wall', 'wall', 'path', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'path', 'path', 'wall', 'path', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'treasure', 'wall', 'wall', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'wall', 'path', 'wall', 'path', 'wall', 'wall', 'path', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'pit', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
  ],

  // Level 3 (Advanced)
  [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'wall', 'wall', 'path', 'exit', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'path', 'path', 'wall'],
    ['wall', 'treasure', 'path', 'path', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'pit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'spike', 'path', 'path', 'path', 'wall', 'path', 'wall'],
    ['wall', 'path', 'wall', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
  ],

  // Level 4 (Expert)
  [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'path', 'path', 'path', 'path', 'exit', 'wall'],
    ['wall', 'path', 'wall', 'path', 'path', 'wall', 'wall', 'path', 'path', 'wall'],
    ['wall', 'path', 'path', 'path', 'wall', 'wall', 'path', 'path', 'wall', 'wall'],
    ['wall', 'wall', 'wall', 'path', 'wall', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'wall', 'path', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'path', 'wall', 'path', 'wall', 'wall', 'path', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'treasure', 'wall'],
    ['wall', 'path', 'spike', 'path', 'wall', 'wall', 'path', 'pit', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
  ],

  // Level 5 (Master)
  [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'wall', 'path', 'pit', 'path', 'path', 'exit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'path', 'path', 'wall', 'path', 'path', 'path', 'wall', 'path', 'wall'],
    ['wall', 'wall', 'path', 'wall', 'wall', 'wall', 'path', 'wall', 'treasure', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'wall', 'path', 'path', 'pit', 'wall'],
    ['wall', 'path', 'wall', 'spike', 'path', 'path', 'path', 'wall', 'wall', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
  ]
];



// Clone levels to reset when necessary (prevents modification of the original layouts)
let levels = JSON.parse(JSON.stringify(initialLevels));

// Variables to keep track of current level and game status
let currentLevel = 0; // Track current level
let playerPosition = { x: 1, y: 1 }; // Starting position of the player in the maze (coordinates)
let collectedTreasures = 0; // Tracks the number of treasures collected by the player
let lives = 3; // Player starts with 3 lives

function createGrid() {
  gameContainer.innerHTML = '';  // Clear existing grid

  // Loop through each row and column of the level grid
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');

      const currentTile = levels[currentLevel][y][x];

      // Determine tile type and apply corresponding class
      if (currentTile === 'wall') {
        tile.classList.add('wall');
      } else if (x === playerPosition.x && y === playerPosition.y) {
        tile.classList.add('player');
      } else if (currentTile === 'path') {
        tile.classList.add('path');
      } else if (currentTile === 'treasure') {
        tile.classList.add('treasure');
      } else if (currentTile === 'spike') {
        tile.classList.add('spike');
      } else if (currentTile === 'pit') {
        tile.classList.add('pit');
      } else if (currentTile === 'exit') {
        tile.classList.add('exit');
      }

      gameContainer.appendChild(tile);
    }
  }
}


// Moves the player in the grid by updating their x and y position
function movePlayer(dx, dy) {
  const mazeLayout = levels[currentLevel];
  const newX = playerPosition.x + dx; // Calculate the new X position
  const newY = playerPosition.y + dy; // Calculate the new Y position

  if (mazeLayout[newY][newX] === 'wall') {
    return; // Don't move into a wall
  }

  playerPosition.x = newX;
  playerPosition.y = newY;

  checkCollisions(); // Check for collisions after moving
  createGrid(); // Redraw the grid after moving
}

function checkCollisions() {
  const currentTile = levels[currentLevel][playerPosition.y][playerPosition.x];

  // Check the type of tile the player is on
  if (currentTile === 'treasure') {
    collectedTreasures++;
    levels[currentLevel][playerPosition.y][playerPosition.x] = 'path'; // Mark as collected
    alert('Treasure Collected!');
  } else if (currentTile === 'spike') {
    lives--;
    alert('Ouch! You stepped on spikes! Lives remaining: ' + lives);
  } else if (currentTile === 'pit') {
    lives--;
    alert('You fell into a pit! Lives remaining: ' + lives);
  }

  // Check if the player has lost all lives or reached the exit
  if (lives <= 0) {
    alert('Game Over! You have lost all your lives.');
    document.getElementById('restart-button').style.display = 'block'; // Show restart button
  }

  if (currentTile === 'exit' && collectedTreasures >= 1) {
    if (currentLevel < levels.length - 1) {
      currentLevel++;
      collectedTreasures = 0; // Reset treasures for the new level
      playerPosition = { x: 1, y: 1 }; // Reset player position
      alert('Level Completed! Proceeding to the next level.');
      createGrid(); // Draw new level's layout
    } else {
      // All levels complete, show end screen
      showEndScreen();
    }
  }
}
function showEndScreen() {
  document.getElementById('game-container').style.display = 'none'; // Hide game container
  document.getElementById('end-screen').style.display = 'flex'; // Show end screen
}



function resetGame() {
  currentLevel = 0;
  playerPosition = { x: 1, y: 1 };
  collectedTreasures = 0;
  lives = 3;
  levels = JSON.parse(JSON.stringify(initialLevels)); // Reset levels to original state

  document.getElementById('game-container').style.display = 'grid'; // Show game container
  document.getElementById('end-screen').style.display = 'none'; // Hide end screen
  document.getElementById('restart-button').style.display = 'none'; // Hide restart button

  createGrid(); // Start fresh from Level 1
}

// Event listener for keyboard input
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      movePlayer(0, -1);
      break;
    case 'ArrowDown':
    case 's':
      movePlayer(0, 1);
      break;
    case 'ArrowLeft':
    case 'a':
      movePlayer(-1, 0);
      break;
    case 'ArrowRight':
    case 'd':
      movePlayer(1, 0);
      break;
  }
});

// Initialize the game
createGrid();
