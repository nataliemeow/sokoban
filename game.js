const canvas = document.getElementById('game');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
const size = 40;
const dirChar = [];
dirChar[-1] = '-';
dirChar[0] = '0',
dirChar[+1] = '+';

const levels = [
`######
#    #
# #a #
# bB #
# GB #
#    #
######`,

`  #####
###   #
# b # ##
# #  G #
#    # #
## #   #
 #a  ###
 #####
`,

`####  
# G#  
#  ###
#Ba  #
#  b #
#  ###
####  `,
]

let level;
let goals;
let player;
let currentLevel = 0;

const alert = document.getElementById('alert');
const levelSelect = document.getElementById('levels');

function loadLevel(index) {
	level = [];
	goals = [];
	player = [];
	let rows = levels[index]
		.split('\n')
		.map(x => x.split(''));
	for (let [y, row] of rows.entries()) {
		for (let [x, char] of row.entries()) {
			let pos = { x: x, y: y };
			switch (char.toLowerCase()) {
				// (n)ame, (p)osition, (d)irection
				case ' ':
					continue;
				case '#':
					level.push({ n: 'wall', p: pos });
					continue;
				case 'b':
					level.push({ n: 'box', p: pos });
					break;
				case 'a':
					player = { p: pos, d: { x: +1, y: 0 } };
					break;
			}
			if (char === char.toUpperCase())
				goals.push({ x: x, y: y });
		}
	}
	draw();
}

function nextLevelAlert() {
	alert.style.left = 'display';
	if (currentLevel < levels.length - 1)
		loadLevel(++currentLevel);
}

for (let [index, level] of levels.entries()) {
	let button = document.createElement('button');
	button.addEventListener('click', () => {
		loadLevel(index);
	});
	button.innerHTML = index + 1;
	levelSelect.appendChild(button)
}

function drawTile(im, { x: x, y: y }, { x: dx, y: dy } = {}) {
	let img;
	if (typeof dx !== 'undefined' && typeof dy !== 'undefined') {
		img = document.getElementById(dirChar[dx] + dirChar[dy] + im);
	} else {
		img = document.getElementById(im);
	}
	ctx.drawImage(img, x * size, y * size, size, size)
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let pos of goals) {
		drawTile('goal', pos);
	}
	for (let [i, tile] of level.entries()) {
		switch (tile.n) {
			case 'box':
				drawTile('box', tile.p);
				break;
			case 'wall':
				drawTile('wall', tile.p);
				break;
		}
	}
	drawTile('player', player.p, player.d);
}

let fail = false;

function handleBox(index, tile) {
	if (
		player.p.x + player.d.x !== tile.p.x ||
		player.p.y + player.d.y !== tile.p.y
	) return;
	for (let [indexTar, tileTar] of level.entries()) {
		if (
			(tileTar.n === 'box' || tileTar.n === 'wall') &&
			(tile.p.x + player.d.x) === tileTar.p.x &&
			(tile.p.y + player.d.y) === tileTar.p.y
		) {
			fail = true;
			return;
		}
	}
	level[index].p.x += player.d.x;
	level[index].p.y += player.d.y;
}

function handleWall(tile) {
	if (
		tile.n === 'wall' &&
		player.p.x + player.d.x === tile.p.x &&
		player.p.y + player.d.y === tile.p.y
	) {
		fail = true;
		return;
	}
}

function isGoal(pos) {
	for (let goal of goals) {
		if (
			pos.x === goal.x &&
			pos.y === goal.y
		) return true;
	}
	return false;
}

function update(x, y) {
	player.d.x = x;
	player.d.y = y;
	let goalsReached = 0;
	let boxes = {};
	for (let [index, tile] of level.entries()) {
		switch (tile.n) {
			case 'box':
				handleBox(index, tile);
				if (isGoal(tile.p)) goalsReached++;
				break;
			case 'wall':
				handleWall(tile);
				break;
		}
	}
	if (goalsReached === goals.length) {
		console.log(
			'%cyay !!!!',
			'font-size: 54px; color: goldenrod; font-family: "Comic Sans MS", cursive; font-weight: bold;'
		);
		alert.style.display = '';
	}
	if (!fail) {
		player.p.x += player.d.x;
		player.p.y += player.d.y;
	}
	fail = false;
	draw();
}

/*
document.onkeydown = event => {
	update(...({
		'w': [0, -1],
		's': [0, +1],
		'a': [-1, 0],
		'd': [+1, 0]
	}[event.key]))
}
*/

window.onload = () => {
	alert.style.display = 'none';
	loadLevel(0);
};
