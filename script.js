document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById("player");
    const obstacle = document.getElementById("obstacle");
    const coin = document.getElementById("coin");
    const coinCounter = document.getElementById("coinCounter");
    let coinsCollected = 0;
    let gameSpeed = 2000; // Initial speed for obstacle movement in milliseconds

    // Jump function triggered by touch or click
    function jump() {
        if (!player.classList.contains("jump-animation")) {
            player.classList.add("jump-animation");
            setTimeout(() => {
                player.classList.remove("jump-animation");
                // Check for coin collection immediately after the jump
                checkCoinCollection();
            }, 800); // Adjust duration to match CSS animation
        }
    }

    // Listen for both touchstart and click events for broader device compatibility
    document.addEventListener('touchstart', jump);
    document.addEventListener('click', jump);

function checkObstacleCollision() {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (playerRect.left < obstacleRect.right && playerRect.right > obstacleRect.left &&
        playerRect.top < obstacleRect.bottom && playerRect.bottom > obstacleRect.top) {
        gameOver();
    }
}

// Call this function periodically or integrate into your game loop
setInterval(checkObstacleCollision, 100); // Example: check every 100ms


    // Check if the player collects a coin
    function checkCoinCollection() {
        const playerRect = player.getBoundingClientRect();
        const coinRect = coin.getBoundingClientRect();

        // Simple collision detection for coin collection
        if (playerRect.left < coinRect.right && playerRect.right > coinRect.left &&
            playerRect.top < coinRect.bottom && playerRect.bottom > coinRect.top) {
            coin.style.display = 'none'; // Hide the coin after collection
            coinsCollected++; // Increment the coins collected count
            coinCounter.innerText = `Coins: ${coinsCollected}`; // Update the display
            setTimeout(resetCoin, 1000); // Reset coin position after a delay for the next collection
        }
    }

    // Reset or reposition the coin after collection
    function resetCoin() {
        coin.style.display = 'block'; // Show the coin again for collection
        // Adjust the reset logic as per your game design, e.g., randomize position
    }

    // Function to increase game speed over time
    function increaseGameSpeed() {
        if (gameSpeed > 500) { // Set a minimum speed limit to prevent it from becoming too fast
            gameSpeed -= 10; // Gradually increase the game's speed
            obstacle.style.animationDuration = `${gameSpeed / 1000}s`;
        }
    }
    setInterval(increaseGameSpeed, 1000); // Increase speed at fixed intervals

    // Function to reset the game state and display coins collected on game over
    function gameOver() {
        alert(`Game Over! You collected ${coinsCollected} coins.`);
        // Reset game state for a new game
        coinsCollected = 0;
        coinCounter.innerText = 'Coins: 0';
        coin.style.display = 'block'; // Show the coin again
        gameSpeed = 2000; // Reset game speed
        obstacle.style.animationDuration = '2s'; // Reset obstacle speed
        resetCoin(); // Ensure the coin is reset for the next game
    }

    // Add your logic to call gameOver() when appropriate, such as on collision with the obstacle
    // This might involve extending the jump, checkCoinCollection, or adding new event listeners for game logic
});
