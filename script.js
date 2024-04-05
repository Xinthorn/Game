document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById("gameContainer");
    const player = document.getElementById("player");
    const coinCounter = document.getElementById("coinCounter");
    const progressBar = document.getElementById("progressBar");
    const obstacle = document.getElementById("obstacle");
    let coinsCollected = 0;
    let gameSpeed = 2000;
    let jumpHeight = 400;
    let level = 1;
    let gameStartTime;

    function jump() {
        if (!player.classList.contains("jump-animation")) {
            player.classList.add("jump-animation");
            const jumpDistance = 400;
            const jumpHeight = 400;
            const jumpDuration = 1000;
            const startTime = performance.now();
            const initialTranslateY = parseFloat(window.getComputedStyle(player).transform.split(',')[5]);

            function jumpStep(timestamp) {
                const elapsedTime = timestamp - startTime;
                const progress = elapsedTime / jumpDuration;
                const translateY = Math.max(0, jumpHeight * (1 - 4 * progress) * progress);

                player.style.transform = `translateX(${jumpDistance}px) translateY(${initialTranslateY - translateY}px)`;

                if (progress < 1) {
                    requestAnimationFrame(jumpStep);
                } else {
                    player.classList.remove("jump-animation");
                    player.style.transform = `translateX(${jumpDistance}px) translateY(${initialTranslateY}px)`;
                }
            }

            requestAnimationFrame(jumpStep);
        }
    }

    document.addEventListener('touchstart', jump);
    document.addEventListener('mousedown', jump);

    function createCoin() {
        const coin = document.createElement('div');
        coin.className = 'coin';

        const maxCoinHeight = gameContainer.offsetHeight - jumpHeight - 30;
        const minCoinHeight = obstacle.offsetHeight + 30;
        const coinHeight = minCoinHeight + Math.random() * (maxCoinHeight - minCoinHeight);

        coin.style.bottom = `${coinHeight}px`;
        coin.style.animation = `moveRight ${gameSpeed / 1000}s linear infinite`;

        let moves = 0;
        coin.addEventListener('animationiteration', () => {
            moves++;
            if (moves >= 2) {
                gameContainer.removeChild(coin);
            }
        });

        gameContainer.appendChild(coin);
    }

    function createBird() {
        const bird = document.createElement('div');
        bird.className = 'bird';

        const maxBirdHeight = gameContainer.offsetHeight - jumpHeight - 30;
        const minBirdHeight = 150;
        const birdHeight = minBirdHeight + Math.random() * (maxBirdHeight - minBirdHeight);

        bird.style.bottom = `${birdHeight}px`;
        bird.style.animation = `moveRight ${gameSpeed / 1000}s linear infinite`;

        let moves = 0;
        bird.addEventListener('animationiteration', () => {
            moves++;
            if (moves >= 2) {
                gameContainer.removeChild(bird);
            }
        });

        gameContainer.appendChild(bird);
    }

    function increaseGameSpeed() {
        if (gameSpeed > 1000) {
            gameSpeed -= 100;
            obstacle.style.animationDuration = `${gameSpeed / 1000}s`;
            gameStartTime = performance.now();
        }
    }
    setInterval(increaseGameSpeed, 8000);

    gameStartTime = performance.now();

    function checkCollection() {
        const playerRect = player.getBoundingClientRect();
        const coinRect = document.querySelector('.coin').getBoundingClientRect();
        if (playerRect.right > coinRect.left && playerRect.left < coinRect.right &&
            playerRect.bottom > coinRect.top && playerRect.top < coinRect.bottom) {
            gameContainer.removeChild(coinRect);
            coinsCollected++;
            coinCounter.innerText = `Score: $${coinsCollected}`;
            updateProgressBar();
        }
    }

    function updateProgressBar() {
        const progress = Math.min((performance.now() - gameStartTime) / 8000 * 100, 100);
        progressBar.style.width = `${progress}%`;
    }

    function gameLoop() {
        checkCollection();
    }
    setInterval(gameLoop, 100);

    setInterval(createCoin, 2000);
    setInterval(createBird, 3000); // Adding bird generation
});
