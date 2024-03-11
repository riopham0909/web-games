/**
 * Created by slava on 9/8/17
 */

var ColorBooster = function(id) {
    FieldBooster.call(this, id);
};

ColorBooster.prototype = Object.create(FieldBooster.prototype);
ColorBooster.prototype.constructor = ColorBooster;

ColorBooster.prototype.listAffected = function(targetCell) {
    var res = [], resTiles = [];

    this.targetCell = targetCell;
    var needColor = targetCell.getColor();

    for (var i = 0; i < Field.SIZE; i ++) {
        for (var j = 0; j < Field.SIZE; j ++) {
            if (Game.currentGame.field.cells[i][j] && Game.currentGame.field.cells[i][j].hurtable) {
                if (Game.currentGame.field.cells[i][j].getColor() === needColor && (needColor !== undefined || Game.currentGame.field.cells[i][j] === targetCell)) {
                    res.push(Game.currentGame.field.cells[i][j]);
                    if (Game.currentGame.field.floor[i][j]) {
                        resTiles.push(Game.currentGame.field.floor[i][j]);
                    }
                }
            }
        }
    }

    return {cells: res, tiles: resTiles};
};

ColorBooster.prototype.getViewClass = function() {
    return ColorBoosterView;
};

ColorBooster.prototype.hurtCells = function(cells) {
    FieldBooster.prototype.hurtCells.call(this, cells);

    Game.counter.fieldCounter.setTimeout(function(){
        var toAnimate = [];
        Array.prototype.push.apply(toAnimate, cells);
        cleverapps.shuffle(toAnimate).forEach(function(cell) {
            cell.animate(BaseCell.ANIMATION_MULTI_COLOR_SELECT);
        });

        cells.forEach(function(cell, id){
            this.hurtCell(cell, id, cells.length);
        }.bind(this));

        if (Game.currentGame) {
            Game.currentGame.shakeField();
        }
    }.bind(this), ColorBooster.HURT_DELAY);
};

ColorBooster.HURT_DELAY = 900;

if (cleverapps.config.name === "adventure") {
    ColorBooster.HURT_DELAY = 1400;
}