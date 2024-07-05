const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{ x: 8 * box, y: 8 * box }];
let direction = '';
let food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
const letters = 'MATHEUS'.split('').map((char, index) => ({
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
    char: char
}));
let game;

document.getElementById('startButton').addEventListener('click', () => {
    game = setInterval(draw, 100);
    document.getElementById('startButton').style.display = 'none';
});

document.getElementById('restartButton').addEventListener('click', () => {
    snake = [{ x: 8 * box, y: 8 * box }];
    direction = '';
    food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    letters.splice(0, letters.length, ...'MATHEUS'.split('').map((char, index) => ({
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 1) * box,
        char: char
    })));
    game = setInterval(draw, 100);
    document.getElementById('restartButton').style.display = 'none';
});

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'darkgreen' : 'green';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    letters.forEach(letter => {
        ctx.fillStyle = 'blue';
        ctx.fillRect(letter.x, letter.y, box, box);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(letter.char, letter.x + 4, letter.y + 16);
    });

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'UP') snakeY -= box;
    if (direction === 'DOWN') snakeY += box;
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'RIGHT') snakeX += box;

    // Atravessar as paredes
    if (snakeX < 0) snakeX = canvas.width - box;
    if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    if (snakeY >= canvas.height) snakeY = 0;

    if (snakeX === food.x && snakeY === food.y) {
        food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    } else {
        snake.pop();
    }

    const letterIndex = letters.findIndex(letter => letter.x === snakeX && letter.y === snakeY);
    if (letterIndex !== -1) {
        letters.splice(letterIndex, 1);
        snake.push({});
    }

    let newHead = { x: snakeX, y: snakeY };

    if (collision(newHead, snake)) {
        clearInterval(game);
        document.getElementById('restartButton').style.display = 'block';
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}
