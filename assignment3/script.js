const gridSize = 10; // 10x10 grid
const gameContainer = document.getElementById('game-container');

let initialLevels = [
  // Level 1 (Beginner)
  /*[
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
  ],*/
  [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'shield', 'path', 'laser-off', 'wall', 'wall', 'path', 'exit', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'laser-off', 'wall', 'boulder', 'door', 'path', 'wall'],
    ['wall', 'treasure', 'path', 'path', 'laser-off', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'path', 'guardian', 'path', 'path', 'path', 'path', 'path', 'pit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'spike', 'path', 'path', 'path', 'wall', 'path', 'wall'],
    ['wall', 'key', 'wall', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
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
    ['wall', 'path', 'wall', 'wall', 'path', 'path', 'shield', 'path', 'exit', 'wall'],
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
  ],
  // Level 6 (Jungle Beginner)
  [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'wall', 'wall', 'path', 'exit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'path', 'wall', 'path', 'path', 'path', 'wall'],
    ['wall', 'treasure', 'path', 'path', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'path', 'wall', 'path', 'path', 'wall', 'path', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'pit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'spike', 'path', 'path', 'path', 'wall', 'path', 'wall'],
    ['wall', 'path', 'wall', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
  ],

  // Level 7 (Jungle Intermediate)
  [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'path', 'wall', 'path', 'wall', 'path', 'exit', 'wall'],
    ['wall', 'path', 'wall', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'treasure', 'path', 'path', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'path', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'pit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'spike', 'path', 'path', 'path', 'wall', 'path', 'wall'],
    ['wall', 'path', 'wall', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
  ],

  // Level 8 (Temple Beginner)
  [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'wall', 'path', 'wall', 'path', 'path', 'exit', 'wall'],
    ['wall', 'path', 'wall', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'treasure', 'path', 'path', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'path', 'path', 'wall', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'pit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'path', 'spike', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
  ],

  // Level 9 (Temple Intermediate)
  [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'path', 'wall', 'path', 'path', 'path', 'exit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'path', 'wall', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'treasure', 'path', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'wall', 'path', 'path', 'wall', 'wall', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'pit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'path', 'path', 'spike', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'wall', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
  ],

  // Level 10 (Temple Expert)
  [
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'wall', 'path', 'path', 'path', 'path', 'exit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'path', 'wall', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'path', 'path', 'path', 'wall', 'path', 'wall', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'path', 'wall', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'path', 'path', 'path', 'treasure', 'path', 'path', 'path', 'pit', 'wall'],
    ['wall', 'path', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'wall', 'wall'],
    ['wall', 'path', 'path', 'spike', 'path', 'path', 'path', 'wall', 'path', 'wall'],
    ['wall', 'path', 'wall', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
    ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
  ]
];


// Variables to keep track of current level and game status
let levels = JSON.parse(JSON.stringify(initialLevels)); // Clone levels

let currentLevel = 0; // Track current level
let playerPosition = { x: 1, y: 1 };
let collectedTreasures = 0;
let lives = 3;
let enemies = [];
let canJump = true;
let lastDirection = { dx: 0, dy: 0 };
const enemySpeed = 1000; // 1 move per second
const detectionRadius = 3; 
let isInCooldown = false; // To track the cooldown after getting hit
const hitCooldownTime = 2000;

let hasKey = false;

let isGameActive = false;

// Function to start the game
function startGame() {
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('game-container').style.display = 'grid'; // Show game container
  document.querySelector('.health-bar-container').style.display = 'flex'; // Show health bar
  isGameActive = true;
  createGrid();
  updateHealthBar();
}

function applyTheme() {
  // Apply theme based on the current level
  if (currentLevel >= 4 && currentLevel <= 6) {
    document.body.className = 'jungle'; // Jungle theme
  } else if (currentLevel >= 7 && currentLevel <= 10) {
    document.body.className = 'temple'; // Temple theme
  } else {
    document.body.className = ''; // Reset for other levels
  }
}

function createGrid() {
  gameContainer.innerHTML = '';
  applyTheme();

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');

      const currentTile = levels[currentLevel][y][x];
      
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
      } else if (currentTile === 'laser-off') {
        tile.classList.add('laser-off');
      } else if (currentTile === 'laser-on') {
        tile.classList.add('laser-on');
      } else if (currentTile === 'shield') {
        tile.classList.add('shield');
      } else if (currentTile === 'boulder') {
        tile.classList.add('boulder');
      } else if (currentTile === 'door') {
        tile.classList.add('door');
      } else if (currentTile === 'key') {
        tile.classList.add('key');
      } else if (currentTile === 'guardian') {
        tile.classList.add('guardian');
      }

     if (currentLevel >= 2) {
        enemies.forEach((enemy, index) => {
          if (x === enemy.x && y === enemy.y) {
            tile.classList.add('enemy');
          }
        });
      }

      gameContainer.appendChild(tile);
    }
  }
}

function movePlayer(dx, dy) {
  const mazeLayout = levels[currentLevel];
  const newX = playerPosition.x + dx;
  const newY = playerPosition.y + dy;

  if (mazeLayout[newY][newX] === 'wall') {
    return; // Don't move into a wall
  } else if(mazeLayout[newY][newX] === 'key'){
    hasKey = true;
    mazeLayout[newY][newX] = 'path';
  } else if(mazeLayout[newY][newX] === 'door' && hasKey == false){
    showMessage('You dont have a key!');
    return;
  } else if (mazeLayout[newY][newX] === 'door' && hasKey == true){
    mazeLayout[newY][newX] = 'path';
  }

  playerPosition.x = newX;
  playerPosition.y = newY;

  checkCollisions();
  createGrid();
}

function moveEnemies() {
  if (currentLevel < 2) return; // No enemies in levels below level 3

  enemies.forEach((enemy) => {
    const distX = playerPosition.x - enemy.x;
    const distY = playerPosition.y - enemy.y;

    if (Math.abs(distX) <= detectionRadius && Math.abs(distY) <= detectionRadius) {
      if (Math.abs(distX) > Math.abs(distY)) {
        enemy.x += distX > 0 ? 1 : -1;
      } else {
        enemy.y += distY > 0 ? 1 : -1;
      }
    }

    if (enemy.x === playerPosition.x && enemy.y === playerPosition.y && !isInCooldown) {
      lives -= 2;
      updateHealthBar();
      showMessage('An enemy caught you! You lost 2 lives. Lives remaining: ' + lives);
      
      if (lives <= 0) {
        showMessage('Game Over! You have lost all your lives.');
        document.getElementById('restart-button').style.display = 'block';
        return;
      }

      isInCooldown = true;
      setTimeout(() => isInCooldown = false, hitCooldownTime); // Cooldown period
    }
  });

  createGrid(); // Redraw grid
}

// Start enemy movement interval
setInterval(moveEnemies, enemySpeed);


function updateHealthBar() {
  const hearts = document.querySelectorAll('.heart');
  for (let i = 0; i < hearts.length; i++) {
    if (i < lives) {
      hearts[i].style.visibility = 'visible'; // Show hearts based on lives remaining
    } else {
      hearts[i].style.visibility = 'hidden'; // Hide hearts if life is lost
    }
  }
}


let shieldActive = false;
let shieldEndTime = 0;
function checkCollisions() {
  if(shieldActive == false){
    const currentTile = levels[currentLevel][playerPosition.y][playerPosition.x];

    if (currentTile === 'treasure') {
      collectedTreasures++;
      levels[currentLevel][playerPosition.y][playerPosition.x] = 'path'; // Mark treasure as collected
      showMessage('Treasure Collected!');
    } else if (currentTile === 'spike') {
      lives--;
      updateHealthBar(); // Update the visual health bar
      showMessage('Ouch! You stepped on spikes! Lives remaining: ' + lives);
    } else if (currentTile === 'pit') {
      lives--;
      updateHealthBar(); // Update the visual health bar
      showMessage('You fell into a pit! Lives remaining: ' + lives);
    } else if (currentTile === 'shield') {
      shieldActive = true;
      shieldEndTime = Date.now() + 3000; // Shield lasts for 3 seconds
      levels[currentLevel][playerPosition.y][playerPosition.x] = 'path'; // Remove shield tile
      showMessage('Shield Acquired! You are immune to damage for 3 seconds.');
    } else if (currentTile === 'boulder') {
      lives--;
      updateHealthBar();
      showMessage('Boulder crushed you! Lives remaining' + lives);
    } else if (currentTile === 'laser-on'){
      lives--;
      updateHealthBar();
      showMessage('You ran into a laser! Lives remaining: ' + lives);
    } else if (currentTile === 'guardian'){
      lives--;
      updateHealthBar();
      showMessage('Guardian got you! Lives remaining: ' + lives);
    }

    // Check for game over state
    if (lives <= 0) {
      showMessage('Game Over! You have lost all your lives.');
      showDie();
      return; // Stop further execution since game is over
    }

    // Check for level completion
    if (currentTile === 'exit' && collectedTreasures >= 1) {
      if (currentLevel < levels.length - 1) {
        currentLevel++; // Move to the next level
        collectedTreasures = 0; // Reset treasures for the new level
        playerPosition = { x: 1, y: 1 }; // Reset player position
        // Spawn enemies starting from level 3
        if (currentLevel >= 2) {
          enemies = [
            { x: 7, y: 7 }, // Example positions, adjust as necessary
            { x: 5, y: 5 }
          ];
        } else {
          enemies = [];
        }
        showMessage('Level Completed! Proceeding to the next level.');
        hasKey = false;
        createGrid(); // Draw the new level's layout
      } else {
        // All levels complete, show end screen
        showEndScreen();
      }
    }
  }
}

function checkCollisionsLaser() {
  if(shieldActive == false){
    const currentTile = levels[currentLevel][playerPosition.y][playerPosition.x];

    if (currentTile === 'laser-on'){
      lives--;
      updateHealthBar();
      showMessage('You ran into a laser! Lives remaining: ' + lives);
    }
    // Check for game over state
    if (lives <= 0) {
      showMessage('Game Over! You have lost all your lives.');
      showDie();
      return; // Stop further execution since game is over
    }
  }
}
function checkCollisionsGuard() {
  if(shieldActive == false){
    const currentTile = levels[currentLevel][playerPosition.y][playerPosition.x];

    if (currentTile === 'guardian'){
      lives--;
      updateHealthBar();
      showMessage('Guardian got you! Lives remaining: ' + lives);
    }
    // Check for game over state
    if (lives <= 0) {
      showMessage('Game Over! You have lost all your lives.');
      showDie();
      return; // Stop further execution since game is over
    }
  }
}

function showEndScreen() {
  document.getElementById('game-container').style.display = 'none'; // Hide game container
  document.getElementById('end-screen').style.display = 'flex'; // Show end screen
}
function showDie() {
  document.getElementById('game-container').style.display = 'none'; // Hide game container
  document.getElementById('restart-button').style.display = 'flex'; // Show end screen
}


function resetGame() {
  currentLevel = 0;
  playerPosition = { x: 1, y: 1 };
  collectedTreasures = 0;
  lives = 3;
  updateHealthBar();
  levels = JSON.parse(JSON.stringify(initialLevels)); // Reset levels to original state

  document.getElementById('game-container').style.display = 'grid'; // Show game container
  document.getElementById('end-screen').style.display = 'none'; // Hide end screen
  document.getElementById('restart-button').style.display = 'none'; // Hide restart button

  createGrid(); // Start fresh from Level 1
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
      movePlayer(0, -1);
      lastDirection = { dx: 0, dy: -1 }; // Update last direction
      break;
    case 'ArrowDown':
    case 's':
      movePlayer(0, 1);
      lastDirection = { dx: 0, dy: 1 }; // Update last direction
      break;
    case 'ArrowLeft':
    case 'a':
      movePlayer(-1, 0);
      lastDirection = { dx: -1, dy: 0 }; // Update last direction
      break;
    case 'ArrowRight':
    case 'd':
      movePlayer(1, 0);
      lastDirection = { dx: 1, dy: 0 }; // Update last direction
      break;
    case ' ':
      if (canJump) {
        jump();
      }
      break;
  }
});
function jump() {
  // Jump two tiles in the last direction
  const jumpDistance = 2;
  const newX = playerPosition.x + lastDirection.dx * jumpDistance;
  const newY = playerPosition.y + lastDirection.dy * jumpDistance;

  // Ensure the player is not jumping into a wall
  if (levels[currentLevel][newY][newX] !== 'wall' && levels[currentLevel][newY][newX] == 'path') {
    playerPosition.x = newX;
    playerPosition.y = newY;
    createGrid(); // Redraw the grid with the updated player position
    checkCollisions(); // Check for any interactions after jumping
  }

  // Add a cooldown to jumping to avoid spamming
  canJump = false;
  setTimeout(() => {
    canJump = true; // Allow jumping again after 1 second
  }, 1000); // 1 second cooldown
}
function showMessage(message) {
  const messageContainer = document.getElementById('message-container');
  messageContainer.textContent = message;
  messageContainer.style.display = 'block'; // Show message
  setTimeout(() => {
    messageContainer.style.display = 'none'; // Hide message after 3 seconds
  }, 3000);
}
// Initialize the game
createGrid();


//LASERS
let laserState = 'off';
function updateLasers() {
  console.log('Updating lasers. Current state:', laserState); // Debugging line
  const mazeLayout = levels[currentLevel];
  laserState = (laserState === 'off') ? 'on' : 'off'; // Toggle laser state

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (mazeLayout[y][x] === 'laser-off') {
        mazeLayout[y][x] = laserState === 'on' ? 'laser-on' : 'laser-off';
      } else if (mazeLayout[y][x] === 'laser-on'){
        mazeLayout[y][x] = laserState === 'o' ? 'laser-on' : 'laser-off';
      }
    }
  }

  createGrid(); // Update grid display
  checkCollisionsLaser();
}

// Set interval for lasers toggling
setInterval(updateLasers, 2000); // Toggle laser state every 3 seconds

//SHIELDS
setInterval(() => {
  if (shieldActive && Date.now() > shieldEndTime) {
    shieldActive = false;
    showMessage('Shield deactivated.');
  }
}, 100); // Check every 100ms


//BOULDERS
function moveBouldersOnMap() {
  // Loop through each tile on the grid and find boulders
  for (let y = gridSize - 1; y >= 0; y--) { // Start from the bottom to avoid overwriting
    for (let x = 0; x < gridSize; x++) {
      if (levels[currentLevel][y][x] === 'boulder') {
        const firstPosY = y;
        const newY = (y + 1) % gridSize; // Wrap around to the top if the boulder reaches the bottom

        // Check if the next position is a path
        if (levels[currentLevel][newY][x] === 'path') {
          // Move the boulder to the new position
          levels[currentLevel][newY][x] = 'boulder';
          levels[currentLevel][y][x] = 'path'; // Clear the old position
        } else if (levels[currentLevel][newY][x] === 'wall') {
          // Move the boulder to the new position
          levels[currentLevel][firstPosY][x] = 'boulder';
          levels[currentLevel][y][x] = 'path'; // Clear the old position
        }

        // Handle boulder collision with the player
        if (playerPosition.x === x && playerPosition.y === newY) {
          if (!isShielded) {
            lives--;
            updateHealthBar();
            showMessage('You got crushed by a boulder! Lives remaining: ' + lives);

            if (lives <= 0) {
              showMessage('Game Over! You have lost all your lives.');
              document.getElementById('restart-button').style.display = 'block';
              return;
            }
          }
        }
      }
    }
  }

  createGrid(); // Redraw grid with updated boulder positions
}

// Move boulders every 1 second
setInterval(moveBouldersOnMap, 1000);

//GUARDIAN
function canSeePlayer(guardianX, guardianY, playerX, playerY, mazeLayout) {
  if (guardianX === playerX) {
    // Check vertical line of sight
    const minY = Math.min(guardianY, playerY);
    const maxY = Math.max(guardianY, playerY);
    for (let y = minY + 1; y < maxY; y++) {
      if (mazeLayout[y][guardianX] !== 'path') {
        return false; // Blocked
      }
    }
    return true; // Clear line of sight
  } else if (guardianY === playerY) {
    // Check horizontal line of sight
    const minX = Math.min(guardianX, playerX);
    const maxX = Math.max(guardianX, playerX);
    for (let x = minX + 1; x < maxX; x++) {
      if (mazeLayout[guardianY][x] !== 'path') {
        return false; // Blocked
      }
    }
    return true; // Clear line of sight
  }
  return false; // Not in the same row or column
}

// Function to move the guardian
function moveGuardians() {
  const mazeLayout = levels[currentLevel];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (mazeLayout[y][x] === 'guardian') {
        // Check if the player is within sight and in the same row or column
        if (canSeePlayer(x, y, playerPosition.x, playerPosition.y, mazeLayout)) {
          const distX = playerPosition.x - x;
          const distY = playerPosition.y - y;

          // Move the guardian towards the player
          if (Math.abs(distX) > Math.abs(distY)) {
            mazeLayout[y][x] = 'path'; // Clear current position
            x += distX > 0 ? 1 : -1; // Move right or left
          } else {
            mazeLayout[y][x] = 'path'; // Clear current position
            y += distY > 0 ? 1 : -1; // Move down or up
          }
          // Place the guardian in the new position
          mazeLayout[y][x] = 'guardian';
        }
      }
    }
  }
  checkCollisionsGuard();
  createGrid(); // Redraw the grid
}


// Start guardian movement interval
setInterval(moveGuardians, 1000);