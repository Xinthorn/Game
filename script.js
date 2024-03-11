document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById("gameContainer");
    const player = document.getElementById("player");
    const coinCounter = document.getElementById("coinCounter");
    const progressBar = document.getElementById("progressBar");
    let coinsCollected = 0;
    let gameSpeed = 2000; // Initial speed for obstacle movement in milliseconds

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
        coin.style.bottom = `${Math.random() * (gameContainer.offsetHeight - 30)}px`; // Adjust based on gameplay needs
        gameContainer.appendChild(coin);

        setTimeout(() => {
            gameContainer.removeChild(coin);
        }, gameSpeed); // Remove the coin after it moves across the screen
    }

    // Increase game speed over time
    function increaseGameSpeed() {
        if (gameSpeed > 1000) { // Prevents speed from becoming too fast
            gameSpeed -= 100; // Adjust as needed
        }
    }
    setInterval(increaseGameSpeed, 5000); // Adjust speed every 5 seconds

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

    // Main game loop
    function gameLoop() {
        checkCoinCollection();
    }
    setInterval(gameLoop, 100); // Check for collisions

    // Generate coins periodically
    setInterval(createCoin, 2000); // Adjust timing as needed
});
