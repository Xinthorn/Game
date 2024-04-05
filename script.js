document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById("gameContainer");
    const player = document.getElementById("player");
    const coinCounter = document.getElementById("coinCounter");
    const progressBar = document.getElementById("progressBar");
    const obstacle = document.getElementById("obstacle");
    let coinsCollected = 0;
    let gameSpeed = 2000; // Initial speed for obstacle movement in milliseconds
    let jumpHeight = 400; // Adjust based on the character's jump height
    let level = 1; // Level counter
    let progressInterval; // Interval for updating progress bar
    let progress = 0; // Progress for progress bar
    let gameStartTime; // Start time of the game

    // Store initial obstacle position
    const initialObstaclePosition = obstacle.getBoundingClientRect();

    // Function to handle player jump
    function jump() {
        if (!player.classList.contains("jump-animation")) {
            player.classList.add("jump-animation");
            const jumpDistance = 400; // Adjust as needed
            const jumpHeight = 400; // Ensure jump height is greater than obstacle height
            const jumpDuration = 1000; // Adjust as needed
            const startTime = performance.now();
            const initialTranslateY = parseFloat(window.getComputedStyle(player).transform.split(',')[5]); // Get initial translateY value

            function jumpStep(timestamp) {
                const elapsedTime = timestamp - startTime;
                const progress = elapsedTime / jumpDuration;
                const translateY = Math.max(0, jumpHeight * (1 - 4 * progress) * progress); // Quadratic curve for smoother jump

                player.style.transform = `translateX(${jumpDistance}px) translateY(${initialTranslateY - translateY}px)`; // Adjust initial translateY value

                if (progress < 1) {
                    requestAnimationFrame(jumpStep);
                } else {
                    player.classList.remove("jump-animation");
                    player.style.transform = `translateX(${jumpDistance}px) translateY(${initialTranslateY}px)`; // Reset to initial position
                }
            }

            requestAnimationFrame(jumpStep);
        }
    }

    document.addEventListener('touchstart', jump);
    document.addEventListener('mousedown', jump);

    // Function to create a new coin
    function createCoin() {
        const coin = document.createElement('div');
        coin.className = 'coin';

        // Calculate the maximum and minimum heights for the coin
        const maxCoinHeight = gameContainer.offsetHeight - jumpHeight - 30; // Lower than jump height
        const minCoinHeight = 0;

        // Generate a random height for the coin within the allowed range
        const coinHeight = minCoinHeight + Math.random() * (maxCoinHeight - minCoinHeight);

        // Set the bottom position of the coin to this calculated height
        coin.style.bottom = `${coinHeight}px`;

        // Add animation to move the coin across the screen
        coin.style.animation = `moveLeft ${gameSpeed / 1000}s linear infinite`;

        gameContainer.appendChild(coin);
    }

    // Function to create a new bird
    function createBird() {
        const bird = document.createElement('div');
        bird.className = 'bird';

        // Calculate the maximum and minimum heights for the bird
        const maxBirdHeight = gameContainer.offsetHeight - jumpHeight - 30; // Lower than jump height
        const minBirdHeight = 150; // Higher than ground level

        // Generate a random height for the bird within the allowed range
        const birdHeight = minBirdHeight + Math.random() * (maxBirdHeight - minBirdHeight);

        // Set the bottom position of the bird to this calculated height
        bird.style.bottom = `${birdHeight}px`;

        // Add animation to move the bird across the screen
        bird.style.animation = `moveLeft ${gameSpeed / 1000}s linear infinite`;

        gameContainer.appendChild(bird);
    }

    // Function to increase game speed periodically
    function increaseGameSpeed() {
        if (gameSpeed > 1000) { // Prevents speed from becoming too fast
            gameSpeed -= 100; // Adjust as needed
            clearInterval(progressInterval); // Stop updating progress bar
            progress = 0; // Reset progress
            progressInterval = setInterval(updateProgressBar, 1000); // Start updating progress bar again
        }
    }

    // Function to update progress bar
    function updateProgressBar() {
        progress += 12.5; // Increment progress by 12.5% every 1 second (100% in 8 seconds)
        progressBar.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(progressInterval); // Stop updating progress bar
            progress = 0; // Reset progress
        }
    }

    // Function to check obstacle collision
    function checkObstacleCollision() {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        if (playerRect.right > obstacleRect.left && playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top && playerRect.top < obstacleRect.bottom) {
            gameOver();
        }
    }

    // Function to check collection of coins and birds
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

    // Function to handle game over
    function gameOver() {
        clearInterval(gameInterval); // Stop the game loop
        clearInterval(progressInterval); // Stop updating progress bar
        alert(`Game Over! You collected $${coinsCollected} Cryptarios.`);
        // Reset game or reload page for simplicity
        window.location.reload();
    }

    // Function to handle game loop
    function gameLoop() {
        checkObstacleCollision();
        checkCollection();
    }

    // Set interval for game loop to check for collisions
    let gameInterval = setInterval(gameLoop, 100);

    // Generate coins, obstacles, and birds periodically
    setInterval(increaseGameSpeed, 8000); // Adjust speed every 8 seconds
    setInterval(createCoin, 2000); // Adjust timing as needed for coin generation
    setInterval(createBird, 3000); // Adjust timing as needed for bird generation

    // Start updating progress bar
    gameStartTime = performance.now();
    progressInterval = setInterval(updateProgressBar, 1000);
});
