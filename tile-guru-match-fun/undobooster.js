/**
 * Created by vladislav on 06/02/2023
 */

UndoBooster.prototype.isForceAvailable = cleverapps.extendFunc(UndoBooster.prototype.isForceAvailable, function () {
    var cards = Game.currentGame.open.cards;
    var counts = {};

    cards.forEach(function (card) {
        if (counts[card.value] === undefined) {
            counts[card.value] = 1;
        } else {
            counts[card.value]++;
        }
    });

    var isCurrentNew = !cleverapps.values(counts).some(function (count) {
        return count > 2;
    });

    return this._super() && isCurrentNew && cards.length >= 5;
});