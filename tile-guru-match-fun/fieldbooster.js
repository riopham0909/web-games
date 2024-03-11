/**
 * Created by mac on 12/28/21
 */

var FieldBooster = function(id) {
    BaseBooster.call(this, id);

    this.hoverCell = undefined;

    var data = cleverapps.Boosters.CONFIG[id];
    this.icon = data.icon;
    this.icon_moving = data.icon_moving;
    this.icon_active = data.icon_active;

    this.onExecuteListener = function(targetCell) {};
    this.onHurtCellsListener = function(cells) {};
    this.onActivateListener = function() {};
    this.onDeactivateListener = function() {};
    this.onStopListener = function() {};
    this.onGetView = function() {};
};

FieldBooster.prototype = Object.create(BaseBooster.prototype);
FieldBooster.prototype.constructor = FieldBooster;

FieldBooster.prototype.stop = function () {
    this.onStopListener();
};

FieldBooster.prototype.deactivate = function() {
    this.onDeactivateListener();
    this.onFieldTouchMoved(undefined);
};

FieldBooster.prototype.execute = function(targetCell) {
    targetCell = targetCell && this.isAllowedTarget(targetCell) ? targetCell : undefined;
    this.onExecuteListener(targetCell);

    if (!targetCell) {
        return;
    }

    if (Game.currentGame && Game.currentGame.field.boosterAdvice) {
        Game.currentGame.field.boosterAdvice.disable();
    }
    var res = this.listAffected(targetCell);
    var list = res.cells;
    var listTiles = res.tiles;

    if (list.length > 0) {
        this.hurtCells(list);
        this.hurtTiles(listTiles);

        this.use();

        if (Game.currentGame) {
            Game.currentGame.onExecuteBooster();
        }
    }
};

FieldBooster.prototype.hurtCells = function(cells) {
    cells.forEach(function(cell) {
        cell.willBurn = true;
        cell.onBeforeHurtViaBooster(cells);
    });
    this.onHurtCellsListener(cells);
    delete this.hoverCell;
};

FieldBooster.prototype.hurtCell = function(cell, id, groupSize) {
    if (cell.alive) {
        cell.hover(false);
    }

    cell.hurt({
        id: id,
        groupSize: groupSize,
        boosterId: this.id
    });
};

FieldBooster.prototype.hurtTiles = function(tiles) {
    tiles.forEach(function(tile){
        tile.hurtViaBooster(this.id);
    }.bind(this));
};

FieldBooster.prototype.onFieldTouchStarted = function(cell) {
    this.execute(cell);
};

FieldBooster.prototype.onFieldTouchMoved = function(cell) {
    if (this.hoverCell === cell) {
        return;
    }

    var oldCells = [];
    var newCells = [];

    if (this.hoverCell) {
        oldCells = this.listAffected(this.hoverCell).cells;
        this.hoverCell = undefined;
    }

    if (cell && this.isAllowedTarget(cell)) {
        this.hoverCell = cell;
        newCells = this.listAffected(cell).cells;
    }

    var getKey = function(cell) {
        return cell.x + '_' + cell.y;
    };

    cleverapps.substract(oldCells, newCells, getKey).forEach(function(cell) {
        cell.hover(false);
    });
    cleverapps.substract(newCells, oldCells, getKey).forEach(function(cell) {
        cell.hover(true);
    });
};

FieldBooster.prototype.isAllowedTarget = function(cell) {
    return cell.hurtable;
};

FieldBooster.prototype.onFieldTouchEnded = function(cell) {
    if (cell) {
        this.execute(cell);
    }
};

FieldBooster.prototype.getViewClass = function() {
    return FieldBoosterView;
};