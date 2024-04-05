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

    // Function to create obstacle
    function createObstacle() {
    const newObstacle = document.createElement('div');
    newObstacle.id = 'obstacle';
    newObstacle.style.width = '50px'; // Set obstacle width
    newObstacle.style.height = '50px'; // Set obstacle height
    newObstacle.style.position = 'absolute'; // Set obstacle position
    newObstacle.style.bottom = '0'; // Set obstacle bottom position
    newObstacle.style.left = '100px'; // Set obstacle left position (adjust as needed)
    gameContainer.appendChild(newObstacle);
    obstacle = newObstacle; // Update obstacle variable to reference the new obstacle
}

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

    // Event listeners for player jump
    document.addEventListener('touchstart', jump);
    document.addEventListener('mousedown', jump);

    // Function to create coins
    function createCoin() {
        const coin = document.createElement('div');
        coin.className = 'coin';

        // Calculate the maximum and minimum heights for the coin
        const maxCoinHeight = gameContainer.offsetHeight - jumpHeight - 30; // Lower than jump height
        const minCoinHeight = obstacle.offsetHeight + 30;

        // Generate a random height for the coin within the allowed range
        const coinHeight = minCoinHeight + Math.random() * (maxCoinHeight - minCoinHeight);

        // Set the bottom position of the coin to this calculated height
        coin.style.bottom = `${coinHeight}px`;

        // Add animation to move the coin across the screen
        coin.style.animation = `moveRight ${gameSpeed / 1000}s linear infinite`;

        // Add event listener to remove the coin after it has moved twice through the gameplay area
        let moves = 0;
        coin.addEventListener('animationiteration', () => {
            moves++;
            if (moves >= 2) {
                gameContainer.removeChild(coin);
            }
        });

        gameContainer.appendChild(coin);
    }

    // Function to create birds
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
            gameSpeed -= 100; // Adjust as needed

            // Store obstacle position
            const obstaclePosition = obstacle.getBoundingClientRect();

            obstacle.style.animationDuration = `${gameSpeed / 1000}s`;
            clearInterval(progressInterval); // Stop updating progress bar
            progress = 0; // Reset progress
            progressInterval = setInterval(updateProgressBar, 1000); // Start updating progress bar again

            // Set obstacle position back to the stored position
            obstacle.style.top = obstaclePosition.top + 'px';
            obstacle.style.left = obstaclePosition.left + 'px';
        }
    }

    // Function to update progress bar
    function updateProgressBar() {
    progress += 12.5; // Increment progress by 12.5% every 1 second (100% in 8 seconds)
    progressBar.style.width = `${progress}%`;
    if (progress >= 100) {
        clearInterval(progressInterval); // Stop updating progress bar
        progress = 0; // Reset progress
        level++; // Increment level
        gameContainer.removeChild(obstacle); // Remove the previous obstacle
        createObstacle(); // Create new obstacle for the next level
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
        clearInterval(progressInterval); // Stop updating progress bar
        document.removeEventListener('touchstart', jump);
        document.removeEventListener('mousedown', jump);
        alert(`Game Over! You collected $${coinsCollected} Cryptarios.`);
        // Reset game or reload page for simplicity
        window.location.reload();
    }

    // Function for the game loop
    function gameLoop() {
        checkObstacleCollision();
        checkCollection();
    }

    // Start game loop
    let gameInterval = setInterval(gameLoop, 100);

    // Generate coins and birds periodically
    setInterval(increaseGameSpeed, 8000);
    setInterval(createCoin, 2000); // Adjust timing as needed
    setInterval(createBird, 3000); // Adjust timing as needed

    // Start updating progress bar
    gameStartTime = performance.now();
    progressInterval = setInterval(updateProgressBar, 1000);

    // Create initial obstacle
    createObstacle();
});
