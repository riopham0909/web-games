/**
 * Created by vtbelo on 09.08.2022
 */

cc.CellScrollAction = cc.ScrollAction.extend({
    ctor: function (cell, params) {
        this._cellPos = { x: cell.x, y: cell.y };
        var targetNode = Game.currentGame.map.getView().getCell(this._cellPos.x, this._cellPos.y);
        this._super(targetNode, params);
    },

    clone: function () {
        return new cc.CellScrollAction(this._cellPos, this._params);
    }
});