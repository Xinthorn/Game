document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById("gameContainer");
    const player = document.getElementById("player");
    const obstacle = document.getElementById("obstacle");
    const coinCounter = document.getElementById("coinCounter");
    const progressBar = document.getElementById("progressBar");
    let coinsCollected = 0;
    let gameSpeed = 2000; // Initial speed for obstacle movement in milliseconds
    let jumpHeight = 150; // Adjust based on the character's jump height

    function jump() {
        if (!player.classList.contains("jump-animation")) {
            player.classList.add("jump-animation");
            setTimeout(() => {
                player.classList.remove("jump-animation");
            }, 800); // Duration of the jump animation
        }
    }

    document.addEventListener('touchstart', jump);
    document.addEventListener('click', jump);

    function createCoin() {
    const coin = document.createElement('div');
    coin.className = 'coin';
    
    // Calculate the maximum height the coin can appear at
    const maxCoinHeight = gameContainer.offsetHeight - jumpHeight - 30;
    
    // Generate a random height within the allowed range
    const coinHeight = jumpHeight + Math.random() * maxCoinHeight;
    
    coin.style.bottom = `${coinHeight}px`; // Set the bottom position
    gameContainer.appendChild(coin);

    coin.addEventListener('animationend', () => {
        gameContainer.removeChild(coin);
    });
}


    // Increase game speed over time
    function increaseGameSpeed() {
        if (gameSpeed > 1000) { // Prevents speed from becoming too fast
            gameSpeed -= 100; // Adjust as needed
            obstacle.style.animationDuration = `${gameSpeed / 1000}s`;
        }
    }
    setInterval(increaseGameSpeed, 5000); // Adjust speed every 5 seconds

    // Check collision with obstacle
    function checkObstacleCollision() {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (playerRect.right > obstacleRect.left && playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top && playerRect.top < obstacleRect.bottom) {
            gameOver();
        }
    }

    // Check if the player collects a coin
    function checkCoinCollection() {
        const playerRect = player.getBoundingClientRect();
        document.querySelectorAll('.coin').forEach(coin => {
            const coinRect = coin.getBoundingClientRect();
            if (playerRect.right > coinRect.left && playerRect.left < coinRect.right &&
                playerRect.bottom > coinRect.top && playerRect.top < coinRect.bottom) {
                gameContainer.removeChild(coin);
                coinsCollected++;
                coinCounter.innerText = `Coins: ${coinsCollected}`;
                updateProgressBar();
            }
        });
    }

    function updateProgressBar() {
        // Assuming a goal of collecting 100 coins for simplicity
        const progress = Math.min(coinsCollected / 100 * 100, 100);
        progressBar.style.width = `${progress}%`;
    }

    function gameOver() {
        alert(`Game Over! You collected ${coinsCollected} coins.`);
        // Reset game or reload page for simplicity
        window.location.reload();
    }

    // Main game loop
    function gameLoop() {
        checkObstacleCollision();
        checkCoinCollection();
    }
    setInterval(gameLoop, 100); // Check for collisions

    // Generate coins periodically
    setInterval(createCoin, 2000); // Adjust timing as needed
});
