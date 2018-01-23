function Points(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;

    this.shownTime = new Date().getTime();
    this.isExpired = false;

    this.Draw = function() {
        var shownTime = this.GetShownTime();

        if (shownTime > 2000)
            this.isExpired = true;
        else {
            var colorNumber = 255 * (2000 - shownTime) / 2000;
            var posModifier = 30 * shownTime / 2000;

            textAlign(LEFT, TOP);
            textSize(CONFIG.GAME_SIZE.HEIGHT / CONFIG.MAP_SIZE.HEIGHT / 2);
            textStyle(NORMAL);
            fill(color(colorNumber, colorNumber, colorNumber));
            text(this.value, this.x, this.y - posModifier);
        }
    }

    this.GetShownTime = function() {
        return new Date().getTime() - this.shownTime;
    }
}