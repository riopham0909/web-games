/**
 * Created by andrey on 20.02.18.
 */

var HintBooster = function (id) {
    Booster.call(this, id);
};

HintBooster.prototype = Object.create(Booster.prototype);
HintBooster.prototype.constructor = HintBooster;

HintBooster.prototype.onGameStarted = function () {
    var game = Game.currentGame;
    game.userStatus.on("inactive_long", this.onUserInactive.bind(this));
    game.userStatus.on("active", this.onUserActive.bind(this));

    if (this.isForceAvailable()) {
        game.on("WrongWord_Booster", this.showForce.bind(this));
        game.on("forceHint", function () {
            this.showForce();
        }.bind(this));
    }
};

HintBooster.prototype.findHint = function () {
    var game = Game.currentGame;

    if (cleverapps.config.type === "klondike") {
        return game.selectHint();
    }
    if (cleverapps.config.subtype === "stacks") {
        return game.keypad.selectHintPosition();
    }
    return game.board.selectHintPosition();
};

HintBooster.prototype.addHint = function (hint, options) {
    var game = Game.currentGame;

    if (cleverapps.config.type === "klondike") {
        game.addHint(hint);
        game.counter.trigger();
        return;
    }

    options = options || {};

    var hintAnimationDuration = 0.3;

    if (["scramble"].indexOf(cleverapps.config.name) === -1) {
        hintAnimationDuration = 0.7;
        game.board.addHint(hint.row, hint.column);
        game.counter.setTimeout(function () {}, hintAnimationDuration * 1000);
        return;
    }

    if (!hint.letter) {
        return;
    }

    hint.letter.setHint(true, {
        hintAnimationDuration: options.hintAnimationDuration || hintAnimationDuration,
        startPos: options.startPos
    });

    var boardIndex = game.board.listWordIndexes(hint.word)[hint.index];
    game.counter.setTimeout(function () {
        game.board.addHint(boardIndex[0], boardIndex[1]);
    }, hintAnimationDuration * 1000);
};

HintBooster.prototype.onExecute = function () {
    var hint = this.findHint();
    if (hint) {
        levels.gameHints && levels.gameHints.addHint();
        this.addHint(hint);
    } else {
        this.trigger("noHintFound");
    }
};

HintBooster.prototype.isForceAvailable = function () {
    return Booster.prototype.isForceAvailable.call(this) && cleverapps.user.checkAvailable(HintBooster.FORCE_AVAILABLE);
};

HintBooster.FORCE_AVAILABLE = {
    stacks: {
        level: 0.4
    }
};