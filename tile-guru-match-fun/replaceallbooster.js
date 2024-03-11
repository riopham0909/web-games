/**
 * Created by Ivan on 15.09.2023
 */

var ReplaceAllBooster = function (id) {
    Booster.call(this, id);
    this.disableForceOnInactive = true;
};

ReplaceAllBooster.prototype = Object.create(Booster.prototype);
ReplaceAllBooster.prototype.constructor = ReplaceAllBooster;

ReplaceAllBooster.prototype.onExecute = function () {
    var game = Game.currentGame;
    var pieces = game.pieces;
    game.counter.setTimeout(function () {}, 500);
    game.applySelectionAlgorithm(true, true, false, function (forms) {
        var nextForms = forms.items.map(function (solvable) {
            return Forms.ALL_POSSIBLE_VARIANTS[solvable];
        });
        var nextColors = [pieces.calcPieceColor(), pieces.calcPieceColor(), pieces.calcPieceColor()];

        for (var index = 0; index < pieces.forms.length; index++) {
            pieces.clearHint(index);
            pieces.replacePiece(index, nextForms[index], nextColors[index]);
        }
    });
};
