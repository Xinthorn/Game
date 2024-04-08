document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById("gameContainer");
    const player = document.getElementById("player");
    const coinCounter = document.getElementById("coinCounter");
    const progressBar = document.getElementById("progressBar");
    let coinsCollected = 0;
    let gameSpeed = 2000; // Initial speed for obstacle movement in milliseconds
    let jumpHeight = 400; // Adjust based on the character's jump height
    let level = 1; // Level counter
    let progressInterval; // Interval for updating progress bar
    let progress = 0; // Progress for progress bar
    let gameStartTime; // Start time of the game
    let obstacle; // Obstacle element
    let jumpStartTime = 0; // Track when the jump starts
    let jumping = false; // Indicates if currently jumping
    let jumpInterval; // To manage continuous jumping
    let obstacleCreationTimeout;
    let activeObstacles = [];

    // createObstacle();

    function createObstacle() {
        if (activeObstacles.length >= 2) return; // Limit to 3 obstacles

        const newObstacle = document.createElement('div');
        newObstacle.className = 'obstacle';
        newObstacle.style.position = 'absolute';
        newObstacle.style.bottom = '0';
        newObstacle.style.left = '100%';
        gameContainer.appendChild(newObstacle);
        activeObstacles.push(newObstacle);

        // Listen for when the obstacle goes off-screen and remove it
        newObstacle.addEventListener('animationend', () => {
            gameContainer.removeChild(newObstacle);
            activeObstacles = activeObstacles.filter(obstacle => obstacle !== newObstacle);
        });

        // Schedule the next obstacle creation
        const nextCreationTime = 2000 - (level - 1) * 200; 
        obstacleCreationTimeout = setTimeout(createObstacle, Math.max(1000, nextCreationTime));
    }

function calculateNextCreationTime() {
    const baseTime = 2000 - (level - 1) * 200;
    return Math.max(1000, baseTime);
}
	
function showLevelUp() {
    const levelUpMsg = document.createElement('div');
    levelUpMsg.innerText = 'Level Up!';
    levelUpMsg.style.position = 'absolute';
    levelUpMsg.style.top = '10%';
    levelUpMsg.style.left = '50%';
    levelUpMsg.style.transform = 'translate(-50%, -50%)';
    levelUpMsg.style.fontSize = '1em';
    levelUpMsg.style.color = '#76b852';
    levelUpMsg.style.zIndex = '1000'; // Ensures it's on top of other elements
    gameContainer.appendChild(levelUpMsg);
    
    setTimeout(() => {
        gameContainer.removeChild(levelUpMsg);
    }, 1000); // Message disappears after 1 second
}

function startJump() {
    if (jumping) return; // Prevent multiple jumps if already jumping
    jumping = true;
    let currentHeight = 0;
    const maxJumpHeight = 300; // Maximum height the player can reach, adjust as needed
    const jumpSpeed = 2; // How fast the player jumps up, adjust as needed

    // Clear previous interval if exists
    if (jumpInterval) clearInterval(jumpInterval);

    // Start moving the player up
    jumpInterval = setInterval(() => {
        // If maximum height reached or jump ended, start falling
        if (currentHeight >= maxJumpHeight) {
            endJump(); // Call to initiate fall
        } else {
            currentHeight += jumpSpeed;
            player.style.bottom = `${currentHeight}px`; // Update player position
        }
    }, 10); // Update position every 10 ms, adjust as needed for smoothness
}

function endJump() {
    if (!jumping) return;
    clearInterval(jumpInterval); // Stop moving up

    // Start falling back down
    let fallInterval = setInterval(() => {
        if (player.style.bottom === '0px' || player.style.bottom < '0px') {
            clearInterval(fallInterval); // Stop falling when reaching the ground
            player.style.bottom = '0px'; // Reset to ground position
            jumping = false; // Reset jumping state
        } else {
            let currentHeight = parseInt(player.style.bottom, 10);
            player.style.bottom = `${currentHeight - 5}px`; // Move down, adjust speed as needed
        }
    }, 10); // Adjust as needed for smoothness
}


    // Function to handle player jump
function performJump(jumpDuration) {
    const minJumpHeight = 50;
    const maxJumpHeight = window.innerHeight - player.offsetHeight; // Maximum jump height, adjust as necessary
    // Ensuring a minimum jump height for very short taps/clicks
    let jumpHeight = Math.max(minJumpHeight, jumpDuration * 0.3);
    // Capping the jump height at the maximum allowed height
    jumpHeight = Math.min(jumpHeight, maxJumpHeight);
    console.log(`Jump Duration: ${jumpDuration}, Calculated Jump Height: ${jumpHeight}`); // Debugging
    if (!player.classList.contains("jump-animation")) {
        player.classList.add("jump-animation");
        
        let start = null;
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / 800, 1); // Ensure the jump lasts no longer than 800ms, adjust as needed
            const height = (1 - Math.abs(progress - 0.5) * 2) * jumpHeight; // Creates a parabolic trajectory

            player.style.bottom = height + 'px'; // Move the player up

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                player.classList.remove("jump-animation");
                player.style.bottom = ''; // Reset player position
            }
        }

        requestAnimationFrame(step);
    }
}

// Event listeners for mouse
document.addEventListener('mousedown', startJump);
document.addEventListener('mouseup', endJump);

// Event listeners for touch
document.addEventListener('touchstart', startJump);
document.addEventListener('touchend', endJump);


    // Function to Create Coins
function createCoin() {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.style.position = 'absolute';

    // Use gameContainer's height to dynamically adjust coin spawn height
    const gameContainerHeight = gameContainer.offsetHeight;

    // Dynamically adjust min and max coin height based on container's height
    const minCoinHeight = gameContainerHeight * 0.2; // for example, 10% from the bottom
    const maxCoinHeight = gameContainerHeight * 0.8; // up to 60% of the container height

    // Calculate random coin height within the new dynamic range
    const coinHeight = Math.random() * (maxCoinHeight - minCoinHeight) + minCoinHeight;
    coin.style.bottom = `${coinHeight}px`;
    coin.style.left = '100%'; // Starts off-screen to the right
    coin.style.animation = `moveRight ${gameSpeed / 1000}s linear infinite`;

    gameContainer.appendChild(coin);

    // Remove coin after it moves off-screen
    coin.addEventListener('animationiteration', () => {
        gameContainer.removeChild(coin);
    });
}


    // Function to create birds
    function createBird() {
        const bird = document.createElement('div');
        bird.className = 'bird';
        const gameContainerHeight = gameContainer.offsetHeight;
        // Calculate the maximum and minimum heights for the bird
        const maxBirdHeight = gameContainerHeight * 0.9;
        const minBirdHeight = gameContainerHeight * 0.4;

        // Generate a random height for the bird within the allowed range
        const birdHeight = Math.random() * (maxBirdHeight - minBirdHeight) + minBirdHeight;

        // Set the bottom position of the bird to this calculated height
        bird.style.bottom = `${birdHeight}px`;

        // Add animation to move the bird across the screen
        bird.style.animation = `moveRight ${gameSpeed / 1000}s linear infinite`;

        // Add event listener to remove the bird after it has moved twice through the gameplay area
        let moves = 0;
        bird.addEventListener('animationiteration', () => {
            moves++;
            if (moves >= 2) {
                gameContainer.removeChild(bird);
            }
        });

        gameContainer.appendChild(bird);
    }

    // Function to increase game speed
function increaseGameSpeed() {
    if (gameSpeed > 1000) { // Prevents speed from becoming too fast
        gameSpeed -= 50; // Adjust as needed

        // Speed up all existing obstacles
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach((obstacle) => {
            obstacle.style.animationDuration = `${gameSpeed / 1000}s`;
        });
    }
}

    // Adjust Game For New Level
    function adjustGameForNewLevel() {
        // Adjust game difficulty parameters for new level
        const nextCreationTime = Math.max(1800, 2000 - (level - 1) * 100);
        gameSpeed = Math.max(1800, gameSpeed - 50);
        clearTimeout(obstacleCreationTimeout);
        obstacleCreationTimeout = setTimeout(createObstacle, nextCreationTime + 500);
    }

    // Update Progress Bar
    function updateProgressBar() {
        progress += 20;
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
            level++;
            progress = 0;
            progressBar.style.width = '0%';
            showLevelUp();
            adjustGameForNewLevel();
        }
    }
    setInterval(updateProgressBar, 1000); // Continuously update progress bar


function checkObstacleCollision() {
    const playerRect = player.getBoundingClientRect();
    
    // Query all elements with the class 'obstacle' and check each for collisions
    document.querySelectorAll('.obstacle').forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (playerRect.right > obstacleRect.left && playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top && playerRect.top < obstacleRect.bottom) {
            gameOver();
        }
    });
}


    // Function to check coin and bird collection
    function checkCollection() {
        const playerRect = player.getBoundingClientRect();
        document.querySelectorAll('.coin, .bird').forEach(item => {
            const itemRect = item.getBoundingClientRect();
            if (playerRect.right > itemRect.left && playerRect.left < itemRect.right &&
                playerRect.bottom > itemRect.top && playerRect.top < itemRect.bottom) {
                gameContainer.removeChild(item);
                if (item.classList.contains('coin')) {
                    coinsCollected++;
                    coinCounter.innerText = `Score: $${coinsCollected}`;
                } else if (item.classList.contains('bird')) {
                    coinsCollected += 10;
                    coinCounter.innerText = `Score: $${coinsCollected}`;
                }
            }
        });
    }

    // Function to end the game
function gameOver() {
    clearInterval(gameInterval); // Stop the game loop
    // Correctly remove the event listeners for the new jump functions
    document.removeEventListener('touchstart', startJump);
    document.removeEventListener('touchend', endJump);
    document.removeEventListener('mousedown', startJump);
    document.removeEventListener('mouseup', endJump);

    alert(`Game Over! You collected $${coinsCollected} Cryptarios.`);
    // Reset game or reload page for simplicity
    window.location.reload();
}

    let gameInterval = setInterval(() => {
        checkObstacleCollision();
        checkCollection();
    }, 100);


    // Generate coins and birds periodically
    setInterval(increaseGameSpeed, 8000);
    setTimeout(createObstacle, 500);
    setInterval(createCoin, 2000); // Adjust timing as needed
    setInterval(createBird, 3000); // Adjust timing as needed
   

    // Start updating progress bar
    gameStartTime = performance.now();
    console.log("Setting up progressInterval");
    progressInterval = setInterval(updateProgressBar, 1000);

    // Create initial obstacle
    createObstacle();
});
