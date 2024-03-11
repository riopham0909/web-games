/**
 * Created by spepa on 19.02.21
 */

var CurtainCard = function (options) {
    Card.call(this, options);

    this.magicCurtain = options.magicCurtain;
    this.active = options.active;
    this.sleep = options.sleep;
    this.sleeping = options.sleeping;
    this.counter = 0;

    this.featureTrigger = Card.MOVES.PLAY | Card.MOVES.SHIFT;

    this.feature = "curtain";
};

CurtainCard.prototype = Object.create(Card.prototype);
CurtainCard.constructor = CurtainCard;

CurtainCard.prototype.getViewClass = function () {
    return CurtainCardView;
};

CurtainCard.prototype.toJSON = function () {
    return Object.assign(Card.prototype.toJSON.call(this), {
        active: this.active,
        sleep: this.sleep,
        sleeping: this.sleeping,
        magicCurtain: this.magicCurtain
    });
};

CurtainCard.prototype.danceMove = function () {
    if (!this.canFeatureProcess) {
        return;
    }
    this.canFeatureProcess = false;
    this.counter++;

    if (this.sleeping && this.counter === this.sleep) {
        this.sleeping = false;
        this.counter = 0;
        if (this.magicCurtain) {
            this.setRandomValue();
            this.trigger("changeValue");
        }
    } else if (!this.sleeping && this.counter === this.active) {
        this.sleeping = true;
        this.counter = 0;
    }

    this.trigger("changeStage");
};

CurtainCard.prototype.canBeReplacedWithBoosters = function () {
    return false;
};

CurtainCard.prototype.canBeAttacked = function () {
    return !this.sleeping;
};

CurtainCard.prototype.canPlay = function (previousCard) {
    if (this.sleeping) {
        return false;
    }
    return Card.prototype.canPlay.call(this, previousCard);
};

CurtainCard.prototype._afterAnimateShowUp = Card.prototype.afterAnimateShowUp;
CurtainCard.prototype.afterAnimateShowUp = function () {
    this._afterAnimateShowUp.apply(this, arguments);
    this.trigger("onshowup");
};

CurtainCard.prototype._collectMarksAndComponents = Card.prototype.collectMarksAndComponents;
CurtainCard.prototype.collectMarksAndComponents = function () {
    this._collectMarksAndComponents.apply(this, arguments);
    this.trigger("hide");
};
