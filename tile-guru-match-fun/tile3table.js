/**
 * Created by vladislav on 21/12/2022
 */

TileTable.prototype.calcShowUpDelays = function (silent) {
    var order = this.cards.map(function (card) {
        return card.x * 60 + card.y * 10;
    });

    var c = Math.min.apply(Math, order);
    order.forEach(function (value, index) {
        order[index] = value - c;
    });

    var m = Math.max.apply(Math, order);

    return this.cards.map(function (card, index) {
        return silent ? 0 : order[index] / m * 1000;
    });
};