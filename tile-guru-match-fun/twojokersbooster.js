/**
 * Created by denis on 4 august 2020
 */

var TwoJokersBooster = function () {
    BaseBoosterBefore.call(this, cleverapps.Boosters.TYPE_JOKERS);
};

TwoJokersBooster.prototype = Object.create(BaseBoosterBefore.prototype);
TwoJokersBooster.prototype.constructor = TwoJokersBooster;

TwoJokersBooster.prototype.execute = function () {
    BaseBoosterBefore.prototype.execute.call(this);

    var insertJoker = function (targetCard, isLeft) {
        if (!targetCard) {
            return;
        }

        var boosterCard = TileFactory.Create({
            feature: "wild",
            x: targetCard.x,
            y: targetCard.y,
            rotation: targetCard.getRotation()
        });
        boosterCard.setOwner(targetCard.owner);

        Game.currentGame.table.insertBeforeCard(targetCard, boosterCard);
        Game.currentGame.table.trigger("insertCard", boosterCard, isLeft ? -2 * cleverapps.styles.CardView.width : 2 * cleverapps.styles.CardView.width);
    };

    var candidates = Game.currentGame.table.cardsWithPossibilityOfPlacingUnderThem();
    insertJoker(candidates.filter(function (card) {
        return card.x < 0;
    }).pop(), true);

    insertJoker(candidates.filter(function (card) {
        return card.x >= 0;
    }).pop(), false);
};

TwoJokersBooster.prototype.getExecuteDuration = function () {
    return 1.6;
};