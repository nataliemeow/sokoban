const canvas = document.getElementById('game');

// Fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
const tileSize = 32;
let player = { x: 0, y: 0 };

function tile({x: x, y: y}, c) {
	ctx.fillStyle = c;
	ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	tile(player, 'skyblue');
}

function go(x, y) {
	player.x += x;
	player.y += y;
	draw();
}

draw();