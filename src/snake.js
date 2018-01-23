function Snake() {
    this.x;
    this.y;
    this.direction;
    this.speed; // Move once every X ms

    this.blocks;

    this.lastMoveTime;

    this.Setup = function() {
        this.Clear();
    }

    this.AddBlock = function() {
        this.blocks.push({ x: this.x, y: this.y, direction: this.direction });
    }

    this.RemoveBlock = function() {
        this.blocks.splice(0, 1);
    }

    this.IsInBlock = function(x, y, withoutLast) {
        var length = this.blocks.length;
        if (withoutLast)
            length -= 1;

        for (var i = 0; i < length; i++) {
            var block = this.blocks[i];

            if (block.x == x && block.y == y)
                return true;
        }

        return false;
    }

    this.GetCurrentSpeed = function() {
        var speed = this.speed - (floor((this.blocks.length - CONFIG.SNAKE.INIT.SIZE) / 3) * 10);
        if (speed < 70)
            return 70;

        return parseInt(speed);
    }

    this.SetDirection = function(direction) {
        // Block change direction in opposite to last one (it will end up in game over)
        switch (this.blocks[this.blocks.length - 1].direction) {
            case DIRECTION.UP:
                if (direction == DIRECTION.DOWN)
                    return;
                break;
            case DIRECTION.DOWN:
                if (direction == DIRECTION.UP)
                    return;
                break;
            case DIRECTION.LEFT:
                if (direction == DIRECTION.RIGHT)
                    return;
                break;
            case DIRECTION.RIGHT:
                if (direction == DIRECTION.LEFT)
                    return;
                break;
        }

        this.direction = direction;
    }

    this.Spawn = function() {
        this.blocks = new Array();

        this.AddBlock();
        for (var i = 1; i < CONFIG.SNAKE.INIT.SIZE; i++)
            this.MakeStep(true);
    }

    this.MakeStep = function() {
        switch (this.direction) {
            case DIRECTION.UP:
                this.y -= 1;
                break;
            case DIRECTION.DOWN:
                this.y += 1;
                break;
            case DIRECTION.LEFT:
                this.x -= 1;
                break;
            case DIRECTION.RIGHT:
                this.x += 1;
                break;
        }

        this.AddBlock();

        this.lastMoveTime = new Date().getTime();
    }

    this.Clear = function() {
        this.x = CONFIG.SNAKE.INIT.POS.X;
        this.y = CONFIG.SNAKE.INIT.POS.Y;
        this.direction = CONFIG.SNAKE.INIT.DIRECTION;
        this.speed = CONFIG.SNAKE.INIT.SPEED; // Move once every X frames

        this.Spawn();
    }

    this.Setup();
}