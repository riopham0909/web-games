/**
 * Created by slava on 9/8/17
 */

var CellBooster = function(id) {
    FieldBooster.call(this, id);
};

CellBooster.prototype = Object.create(FieldBooster.prototype);
CellBooster.prototype.constructor = CellBooster;

CellBooster.prototype.listAffected = function(targetCell) {
    this.targetCell = targetCell;
    var resTiles = [];
    if (Game.currentGame.field.floor[targetCell.y][targetCell.x])
        resTiles.push(Game.currentGame.field.floor[targetCell.y][targetCell.x]);
    return {cells: [targetCell], tiles: resTiles};
};

CellBooster.prototype.getViewClass = function() {
    return CellBoosterView;
};

CellBooster.prototype.hurtCells = function(cells) {
    FieldBooster.prototype.hurtCells.call(this, cells);

    Game.counter.fieldCounter.setTimeout(function(){
        cells.forEach(function(cell, id){
            this.hurtCell(cell, id, cells.length);
        }.bind(this));

        if (Game.currentGame) {
            Game.currentGame.shakeField({power: 0.5});
        }
    }.bind(this), CellBooster.HURT_DELAY);
};

CellBooster.HURT_DELAY = 500;

if (["runes", "adventure"].indexOf(cleverapps.config.name) !== -1) {
    CellBooster.HURT_DELAY = 1000;
}