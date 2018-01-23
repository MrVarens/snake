function Walls() {
    this.blocks;

    this.Setup = function() {
        this.Clear();
    }

    this.AddBlock = function(x, y) {
        this.blocks.push({ x: x, y: y });
    }

    this.IsInBlock = function(x, y) {
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];

            if (block.x == x && block.y == y)
                return true;
        }

        return false;
    }

    this.Clear = function() {
        this.blocks = new Array();
    }

    this.Setup();
}