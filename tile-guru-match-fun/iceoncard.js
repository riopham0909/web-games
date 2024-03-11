/**
 * Created by Andrey Popov on 1/24/23.
 */

var IceOnCard = function (card, options) {
    options = options || {};

    this.card = card;
    this.stage = options.stage || 0;
    this.card.featureTrigger = Card.MOVES.PLAY | Card.MOVES.UNDO | Card.MOVES.SHIFT | Card.MOVES.UNSHIFT;

    this.onBreakOff = function () {};
    this.onDestroy = function () {};
    this.onShow = function () {};
    this.onHide = function () {};
};

IceOnCard.prototype.getViewClass = function () {
    return IceOnCardView;
};

IceOnCard.prototype.toJSON = function () {
    return {
        name: "ice",
        stage: this.stage
    };
};

IceOnCard.prototype.isBlocked = function () {
    return this.stage < IceOnCard.PARTS;
};

IceOnCard.prototype.handleFlip = function (open) {
    if (open) {
        this.onHide();
    } else {
        this.onShow();
    }
};

IceOnCard.prototype.handleClick = function () {
};

IceOnCard.prototype.destroy = function () {
    if (this.isBlocked()) {
        this.stage = IceOnCard.PARTS;
        this.onBreakOff();
    }
};

IceOnCard.prototype.danceMove = function () {
    var move = Game.currentGame.move;

    if (move === Card.MOVES.UNDO || move === Card.MOVES.UNSHIFT) {
        this.stage--;
        if (this.stage < 0) {
            this.stage = 0;
            return;
        }
    } else {
        this.stage++;
    }

    if (this.stage > IceOnCard.PARTS) {
        return;
    }

    if (cleverapps.config.type === "tile3" && !Game.currentGame.table.listMissed().length) {
        this.destroy();
    } else {
        this.onBreakOff();
    }
};

IceOnCard.prototype.magnetHit = function () {
    this.destroy();
    return false;
};

IceOnCard.PARTS = 3;