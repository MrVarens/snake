var game;

function setup() {
	game = new Game();
}

function draw() {
	game.Draw();
}

function keyPressed() {
	game.KeyPressed(keyCode);
}