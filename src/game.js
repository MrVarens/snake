DIRECTION = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};

CONFIG = {
    GAME_SIZE: {
        WIDTH: 500,
        HEIGHT: 500
    },
    MAP_SIZE: {
        WIDTH: 15,
        HEIGHT: 15
    },
    SNAKE: {
        INIT: {
            POS: {
                X: 0,
                Y: 0
            },
            DIRECTION: DIRECTION.DOWN,
            SPEED: 200,
            SIZE: 3
        }
    },
    WALL_COUNT: 5
};

function Game() {
    this.isOver;
    this.startTime;

    this.snake;
    this.food;
    this.points;
    this.walls;

    this.blockWidth;
    this.blockHeight;

    this.pointObjects;

    this.Setup = function() {
        createCanvas(CONFIG.GAME_SIZE.WIDTH, CONFIG.GAME_SIZE.HEIGHT);

        this.blockWidth = CONFIG.GAME_SIZE.WIDTH / CONFIG.MAP_SIZE.WIDTH;
        this.blockHeight = CONFIG.GAME_SIZE.HEIGHT / CONFIG.MAP_SIZE.HEIGHT;

        this.Clear();
    }

    this.Draw = function() {
        background(0, 0, 0);

        if (this.IsReadyForStep()) {
            this.snake.MakeStep();

            if (this.snake.x != this.food.x || this.snake.y != this.food.y)
                this.snake.RemoveBlock();
            else {
                this.AddPoints(100, this.snake.x * this.blockWidth, this.snake.y * this.blockHeight);
                this.food.eatenTimer = frameCount;
                this.SpawnFood();
            }

            this.UpdateGameOver();
        }

        this.DrawWalls();
        this.DrawSnake();
        this.DrawFood();
        this.PrintPoints();
        this.DrawPointObjects();

        if (this.isOver)
            this.PrintGameOver();
    }

    this.KeyPressed = function(keyCode) {
        switch (keyCode) {
            case UP_ARROW:
                this.snake.SetDirection(DIRECTION.UP);
                break;
            case DOWN_ARROW:
                this.snake.SetDirection(DIRECTION.DOWN);
                break;
            case LEFT_ARROW:
                this.snake.SetDirection(DIRECTION.LEFT);
                break;
            case RIGHT_ARROW:
                this.snake.SetDirection(DIRECTION.RIGHT);
                break;
            default:
                if (this.isOver)
                    this.Clear();
                break;
        }
    }

    this.GetGameTime = function() {
        return new Date().getTime() - this.startTime;
    }

    this.DrawSnake = function() {
        for (var i = 0; i < this.snake.blocks.length; i++) {
            var block = this.snake.blocks[i];

            var x = block.x * this.blockWidth;
            var y = block.y * this.blockHeight;

            if (this.food.eatenTimer + 30 > frameCount)
                fill(color(173, 245, 165));
            else
                fill(color(50, 230, 29));

            switch (block.direction) {
                case DIRECTION.UP:
                    triangle(x + (this.blockWidth / 8), y + this.blockHeight - (this.blockHeight / 8), x + this.blockWidth - (this.blockWidth / 8), y + this.blockHeight - (this.blockHeight / 8), x + (this.blockWidth / 2), y  + (this.blockHeight / 8));
                    break;
                case DIRECTION.DOWN:
                    triangle(x + (this.blockWidth / 8), y + (this.blockHeight / 8), x + this.blockWidth - (this.blockWidth / 8), y + (this.blockHeight / 8), x + (this.blockWidth / 2), y + this.blockHeight - (this.blockHeight / 8));
                    break;
                case DIRECTION.LEFT:
                    triangle(x + (this.blockWidth / 8), y + (this.blockHeight / 2), x + this.blockWidth - (this.blockWidth / 8), y + (this.blockHeight / 8), x + this.blockWidth - (this.blockWidth / 8), y + this.blockHeight - (this.blockHeight / 8));
                    break;
                case DIRECTION.RIGHT:
                    triangle(x + (this.blockWidth / 8), y + (this.blockHeight / 8), x + this.blockWidth - (this.blockWidth / 8), y + (this.blockHeight / 2), x + (this.blockWidth / 8), y + this.blockHeight - (this.blockHeight / 8));
                    break;
            }
        }
    }

    this.DrawWalls = function() {
        for (var i = 0; i < this.walls.blocks.length; i++) {
            var block = this.walls.blocks[i];

            fill(color(51, 51, 51));

            rect(block.x * this.blockWidth, block.y * this.blockHeight, this.blockWidth, this.blockHeight);
        }
    }

    this.DrawFood = function() {
        fill(color(236, 45, 23));
        ellipse(this.food.x * this.blockWidth + this.blockWidth / 2, this.food.y * this.blockHeight + this.blockHeight / 2, this.blockWidth, this.blockHeight);
    }

    this.AddPoints = function(points, x, y) {
        var multiplier = 1;

        var currentSpeedBonus = (200 - this.snake.GetCurrentSpeed()) / 25;
        if (currentSpeedBonus < 0)
            currentSpeedBonus = 0;
        multiplier += currentSpeedBonus; // Points for speed
        multiplier += this.snake.blocks.length / 2; // Points for size
        multiplier += this.walls.blocks.length / 3; // Points for walls
        multiplier += this.GetGameTime() / 60000; // Points for time

        points = parseInt(points * multiplier);

        if (x != undefined && y != undefined)
            this.pointObjects.push(new Points(x, y, points));

        this.points += points;
    }

    this.PrintPoints = function() {
        textAlign(LEFT, TOP);
        textSize(this.blockHeight / 2);
        textStyle(NORMAL);
        fill(color(255, 255, 255));
        text("Points: " + this.points, this.blockHeight / 4, this.blockHeight / 4, CONFIG.GAME_SIZE.WIDTH, this.blockHeight);
    }

    this.DrawPointObjects = function() {
        // Remove expired points
        for (var i = this.pointObjects.length - 1; i >= 0; i--) {
            if (this.pointObjects[i].isExpired)
                this.pointObjects.splice(i, 1);
        }

        for (var i = 0; i < this.pointObjects.length; i++)
            this.pointObjects[i].Draw();
    }

    this.PrintGameOver = function() {
        textAlign(CENTER, CENTER);
        textSize(CONFIG.GAME_SIZE.WIDTH / 10);
        textStyle(BOLD);
        fill(color(255, 0, 0));
        text("Game Over!", 0, 0, CONFIG.GAME_SIZE.WIDTH, CONFIG.GAME_SIZE.HEIGHT);
        textSize(CONFIG.GAME_SIZE.WIDTH / 30);
        text("Press any key to try again.", 0, CONFIG.GAME_SIZE.WIDTH / 10, CONFIG.GAME_SIZE.WIDTH, CONFIG.GAME_SIZE.HEIGHT);
    }

    this.IsReadyForStep = function() {
        return !this.isOver && (new Date().getTime() >= this.snake.lastMoveTime + this.snake.GetCurrentSpeed());
    }

    this.UpdateGameOver = function() {
        if (this.snake.x < 0 || this.snake.x >= CONFIG.MAP_SIZE.WIDTH || this.snake.y < 0 || this.snake.y >= CONFIG.MAP_SIZE.HEIGHT // Check if move out of map
            || this.walls.IsInBlock(this.snake.x, this.snake.y) // Check if hit into wall
            || this.snake.IsInBlock(this.snake.x, this.snake.y, true) // Check if hit in self
            || this.snake.blocks.length >= (CONFIG.GAME_SIZE.WIDTH * CONFIG.GAME_SIZE.HEIGHT - 5)) // No more space
            this.isOver = true;
    }

    this.SpawnFood = function() {
        do {
            this.food.x = parseInt(random(CONFIG.MAP_SIZE.WIDTH));
            this.food.y = parseInt(random(CONFIG.MAP_SIZE.HEIGHT));
        } while(this.walls.IsInBlock(this.food.x, this.food.y) || this.snake.IsInBlock(this.food.x, this.food.y));
    }

    this.SpawnWalls = function() {
        var x;
        var y;
        for (var i = 0; i < CONFIG.WALL_COUNT; i++) {
            do {
                x = parseInt(random(CONFIG.MAP_SIZE.WIDTH));
                y = parseInt(random(CONFIG.MAP_SIZE.HEIGHT));
            } while(this.snake.IsInBlock(x, y) || (this.food != undefined && this.food.x == x && this.food.y == y));

            this.walls.AddBlock(x, y);
        }
    }

    this.Clear = function() {
        this.isOver = false;
        this.startTime = new Date().getTime();
        this.snake = new Snake();
        this.food = { x: 0, y: 0, eatenTimer: -9999999 };
        this.walls = new Walls();

        this.points = 0;
        this.pointObjects = new Array();

        this.SpawnWalls();
        this.SpawnFood();
    }

    this.Setup();
}