/**
 * Created by slava on 20/3/20
 */

var MovesLog = function (game, options) {
    cleverapps.EventEmitter.call(this);

    this.tilegame = game;

    this.undoBooster = cleverapps.boosters.getBoosterById(cleverapps.Boosters.TYPE_UNDO);

    this.onShowForceListener = function () {};

    this.log = [];

    if (options) {
        this.log = options.log;
    }

    if (this.tilegame.pagination) {
        this.tilegame.pagination.on("changePage", this.clear.bind(this));
    }
};

MovesLog.prototype = Object.create(cleverapps.EventEmitter.prototype);
MovesLog.prototype.constructor = MovesLog;

MovesLog.MOVE_PLAY_CARD = 0;

MovesLog.prototype.getInfo = function () {
    return {
        log: this.log.slice()
    };
};

MovesLog.prototype.isEmpty = function () {
    return this.log.length === 0;
};

MovesLog.prototype.clear = function () {
    this.log = [];
    this.trigger("change");
};

MovesLog.prototype.showAlert = function () {
    if (!this.isEmpty()) {
        this.trigger("showAlert");
    }
};

MovesLog.prototype.push = function (type, options) {
    this.log.push({
        type: type,
        options: options
    });

    this.trigger("change");
};

MovesLog.prototype.showUndoForce = function () {
    this.undoBooster.showForce();
};

MovesLog.prototype.isUndoNeedOnPreviousMove = function () {
    return this.getLastMove();
};

MovesLog.prototype.isUndoForceAvailable = function () {
    if (!Game.currentGame || Game.currentGame.cardsTutorial || Game.currentGame.outcome !== GameBase.OUTCOME_UNKNOWN
        || !this.undoBooster.isForceAvailable()) {
        return false;
    }

    return this.isUndoNeedOnPreviousMove();
};

MovesLog.prototype.getLastMove = function () {
    return this.log[this.log.length - 1];
};

MovesLog.prototype.showTutorialStep = function () {
    if (this.isUndoForceAvailable()) {
        this.showUndoForce();
        return true;
    }

    if (this.tutorialCard) {
        this.tutorialCard.trigger("hideTutorial");
        delete this.tutorialCard;
    }
};

MovesLog.prototype.undoPlayCard = function (move) {
    var playCard = this.tilegame.open.pop(move);
    this.tilegame.undoCard(playCard);
};

MovesLog.prototype.executeUndo = function () {
    var move = this.log.pop();

    this.undoPlayCard(move);

    this.trigger("change");
};