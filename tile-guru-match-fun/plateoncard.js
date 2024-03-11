/**
 * Created by Denis Kuzin on 25 april 2023
 */

var PlateOnCard = function (card, options) {
    this.card = card;
    options = options || {};

    this.stage = options.stage || 0;
    this.card.featureTrigger = Card.MOVES.PLAY | Card.MOVES.UNDO;

    this.onBreakOff = function () {};
    this.onCollect = function () {};
    this.onDestroy = function () {};
};

PlateOnCard.prototype.getViewClass = function () {
    return PlateOnCardView;
};

PlateOnCard.prototype.toJSON = function () {
    return {
        name: "plate",
        stage: this.stage
    };
};

PlateOnCard.prototype.handleFlip = function () {
};

PlateOnCard.prototype.isBlocked = function () {
    return false;
};

PlateOnCard.prototype.handleClick = function () {

};

PlateOnCard.prototype.danceMove = function () {
    var move = Game.currentGame.move;

    if (move === Card.MOVES.UNDO) {
        this.stage--;
        if (this.stage < 0) {
            this.stage = 0;
            return;
        }
    } else {
        this.stage++;
    }

    if (this.stage > PlateOnCard.PARTS) {
        return;
    }

    this.onBreakOff();
};

PlateOnCard.prototype.collect = function () {
    if (this.stage >= PlateOnCard.PARTS) {
        return;
    }

    Game.currentGame.addClover(Mission.TYPE_LETTER, 1, true);
    this.card.removeComponent(PlateOnCard);

    Game.currentGame.setTimeout(function () {
        Game.currentGame.trigger("rewardClover");
        this.onDestroy();
    }.bind(this), PlateOnCard.COLLECT_DURATION);

    this.onCollect("mission_billet" + Mission.TYPE_LETTER);
};

PlateOnCard.PARTS = 4;
PlateOnCard.COLLECT_DURATION = 1100;