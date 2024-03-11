document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById("player");
    const obstacle = document.getElementById("obstacle");
    const coinsContainer = document.getElementById("coinsContainer");
    const coinCounter = document.getElementById("coinCounter");
    let coinsCollected = 0;
    let gameSpeed = 2000; // Initial speed for obstacle movement in milliseconds

    function createCoin() {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coinsContainer.appendChild(coin);
        setTimeout(() => coin.remove(), 5000); // Remove coin after 5 seconds
    }

    function jump() {
        if (!player.classList.contains("jump-animation")) {
            player.classList.add("jump-animation");
            setTimeout(() => player.classList.remove("jump-animation"), 800);
        }
    }

    document.addEventListener('touchstart', jump);
    document.addEventListener('click', jump);

    setInterval(() => {
        createCoin();
        checkObstacleCollision();
    }, 2000); // Create a new coin and check for collision every 2 seconds

    function checkObstacleCollision() {
        // Collision detection logic for obstacle...
    }

    function checkCoinCollection() {
        const playerRect = player.getBoundingClientRect();
        document.querySelectorAll('.coin').forEach(coin => {
            const coinRect = coin.getBoundingClientRect();
            if (playerRect.left < coinRect.right && playerRect.right > coinRect.left &&
                playerRect.top < coinRect.bottom && playerRect.bottom > coinRect.top) {
                coin.remove(); // Remove the coin upon collection
                coinsCollected++;
                coinCounter.innerText = `Coins: ${coinsCollected}`;
            }
        });
    }

    setInterval(checkCoinCollection, 100); // Continuously check for coin collection

    function increaseGameSpeed() {
        if (gameSpeed > 500) {
            gameSpeed -= 10;
            obstacle.style.animationDuration = `${gameSpeed / 1000}s`;
        }
    }

    setInterval(increaseGameSpeed, 1000); // Increase speed at fixed intervals

    function gameOver() {
        alert(`Game Over! You collected ${coinsCollected} coins.`);
        // Reset game state for a new game...
    }

    // Extend checkObstacleCollision and gameOver logic as needed...
});
