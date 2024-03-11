/**
 * Created by slava on 9/8/17
 */

var LineBooster = function (id) {
    FieldBooster.call(this, id);
};

LineBooster.prototype = Object.create(FieldBooster.prototype);
LineBooster.prototype.constructor = LineBooster;

LineBooster.prototype.listAffected = function (targetCell) {
    var res = [], resTiles = [];
    var si = 0, fi = Field.SIZE, di = 1;
    if (LineBooster.DIRECTION === LineBooster.DIRECTIONS.DOWN_UP) {
        si = Field.SIZE - 1;
        fi = -1;
        di = -1;
    }
    for (var i = si; i !== fi; i += di) {
        if (Game.currentGame.field.cells[i][targetCell.x] && Game.currentGame.field.cells[i][targetCell.x].hurtable) {
            res.push(Game.currentGame.field.cells[i][targetCell.x]);
            if (Game.currentGame.field.floor[i][targetCell.x]) {
                resTiles.push(Game.currentGame.field.floor[i][targetCell.x]);
            }
        }
    }
    return { cells: res, tiles: resTiles };
};

LineBooster.prototype.isAllowedTarget = function (cell) {
    if (!cell) {
        return false;
    }

    var tutorial = Game.currentGame.tutorial;
    if (tutorial && !tutorial.finished && !tutorial.existInControll(cell.x, cell.y)) {
        return false;
    }

    return true;
};

LineBooster.prototype.getViewClass = function () {
    return LineBoosterView;
};

LineBooster.prototype.hurtCells = function (cells) {
    FieldBooster.prototype.hurtCells.call(this, cells);

    cells.forEach(function (cell, ind) {
        var delay = LineBooster.HURT_DELAY + 100 * Math.abs(cell.y - cells[0].y);
        Game.counter.fieldCounter.setTimeout(function () {
            this.hurtCell(cell, 0, 1);

            if (Game.currentGame && ind === cells.length - 1) {
                Game.currentGame.shakeField();
            }
        }.bind(this), delay);
    }.bind(this));
};

LineBooster.DIRECTIONS = {
    UP_DOWN: 0,
    DOWN_UP: 1
};

LineBooster.DIRECTION = LineBooster.DIRECTIONS.UP_DOWN;

if (cleverapps.config.name === "heroes") {
    LineBooster.DIRECTION = LineBooster.DIRECTIONS.DOWN_UP;
}

LineBooster.HURT_DELAY = 0;

if (cleverapps.config.name === "heroes") {
    LineBooster.HURT_DELAY = 400;
}

if (cleverapps.config.name === "runes") {
    LineBooster.HURT_DELAY = 600;
}