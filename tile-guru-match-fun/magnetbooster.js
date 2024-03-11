/**
 * Created by denis on 6 august 2020
 */

var MagnetBooster = function () {
    BaseBoosterBefore.call(this, cleverapps.Boosters.TYPE_MAGNET);
};

MagnetBooster.prototype = Object.create(BaseBoosterBefore.prototype);
MagnetBooster.prototype.constructor = MagnetBooster;

MagnetBooster.prototype.execute = function () {
    BaseBoosterBefore.prototype.execute.call(this);

    var targetCards = cleverapps.Random.shuffle(Game.currentGame.table.cardsThatCanBeReplacedWithBoosters());

    if (targetCards.length === 0) {
        this.onGiveUp();
        return;
    }

    var priorityCards = targetCards.filter(function (card) {
        return card.isOpen();
    });

    var targetCard = priorityCards.length > 0 ? priorityCards[0] : targetCards[0];
    var options = Object.assign(targetCard.toJSON(), {
        marks: ["magnet"]
    });

    var boosterCard = TileFactory.Create(options);
    boosterCard.setOwner(targetCard.owner);

    Game.currentGame.table.replaceCard(targetCard, boosterCard);
    Game.currentGame.table.trigger("replaceCardWithAnother", targetCard, boosterCard);

    if (targetCard.isOpen()) {
        boosterCard.flip();
    }

    var mark = boosterCard.marks[0];
    mark.hide();
    Game.currentGame.table.trigger("demonstrateBoosterBefore", boosterCard, function () {
        mark.show(true);
    });
};

MagnetBooster.prototype.getExecuteDuration = function () {
    return 2.2;
};