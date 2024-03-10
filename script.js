// Listen for touch events on the entire document
document.addEventListener('touchstart', function() {
    jump();
});

function jump() {
    const player = document.getElementById("player");
    // Prevent multiple jumps by checking if the jump-animation class is already applied
    if (!player.classList.contains("jump-animation")) {
        player.classList.add("jump-animation");
        // Remove the jump-animation class after 500ms to allow for another jump
        setTimeout(function() {
            player.classList.remove("jump-animation");
        }, 800); // Adjust this duration to control how long the jump lasts
    }
}

const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");

setInterval(function() {
    const playerRect = document.getElementById("player").getBoundingClientRect();
    const obstacleRect = document.getElementById("obstacle").getBoundingClientRect();

    // Check for horizontal overlap
    const horizontalOverlap = obstacleRect.left < playerRect.right && obstacleRect.right > playerRect.left;

    // Check if the player is vertically clear of the obstacle
    const isPlayerClearOfObstacle = playerRect.bottom <= obstacleRect.top;

    // If there's horizontal overlap but the player isn't clear of the obstacle, it's a collision
    if (horizontalOverlap && !isPlayerClearOfObstacle) {
        alert("Game Over!");
    }
}, 10);