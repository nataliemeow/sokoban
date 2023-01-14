const canvas = document.getElementById('game');

// Fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
const tileSize = 32;
let level = [
	{ n: 'box', p: { x: 4, y: 4 } },
	{ n: 'box', p: { x: 8, y: 4 } }
]
let player = { p: { x: 0, y: 0 }, d: { x: 0, y: 0 } };

function drawTile({ x: x, y: y }, c) {
	ctx.fillStyle = c;
	ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawTile(player.p, 'blue');
	for (let [i, tile] of level.entries()) {
		switch (tile.n) {
			case 'box':
				drawTile(tile.p, 'goldenrod');
				break;
		}
	}
}

function update(x, y) {
	player.d.x = x; player.d.y = y;

	let pushFail = false;
	for (let [i, tile] of level.entries()) {
		switch (tile.n) {
			case 'box':
				if (
					(player.p.x + x) === tile.p.x &&
					(player.p.y + y) === tile.p.y
				) {
					console.log('pushed box');
					console.log(tile)
					for (let [i2, tile2] of level.entries()) {
						console.log(tile2);
						if (
							(tile2.n === 'wall' || tile2.n === 'box') &&
							tile2.p === tile.p && i2 !== i
						) {
							console.log(i2);
							console.log('nvm lmfao');
							pushFail = true;
							return;
						}
					}
					level[i].p.x += player.d.x;
					level[i].p.y += player.d.y;
				}
				break;
		}
	}
	if (!pushFail) {
		player.p.x += x; player.p.y += y;
	}
	draw();
}

draw();