/**
 * Created by andrey on 20.02.18.
 */

var WildcardBooster = function (id) {
    Booster.call(this, id);

    this.onCardCreatedListener = function () {};
    this.onShowTutorial = function () {};
};

WildcardBooster.prototype = Object.create(Booster.prototype);
WildcardBooster.prototype.constructor = WildcardBooster;

WildcardBooster.prototype.onGameStarted = function () {
    Game.currentGame.userStatus.on("inactive_very_short", this.hintAttempt.bind(this));
    Game.currentGame.userStatus.on("active", this.onUserActive.bind(this));
};

WildcardBooster.prototype.onExecute = function () {
    var card = new Wildcard();
    this.onCardCreatedListener(card);
    Game.currentGame.shiftWildcard(card);

    Game.currentGame.log.push(MovesLog.MOVE_USE_BOOSTER, { id: this.id });

    if (!this.wildcardTutorial) {
        var msg = cleverapps.Random.mathChoose(cleverapps.exclamation.getCongratulations());
        cleverapps.exclamation.show(msg);
    }
};

WildcardBooster.prototype.activateTutorial = function () {
    this.wildcardTutorial = true;
    this.onShowTutorial();
};

WildcardBooster.prototype.use = function () {
    if (!this.wildcardTutorial) {
        BaseBooster.prototype.use.call(this);
    }
};

WildcardBooster.prototype.onPressed = function (f, isRunningForce) {
    Booster.prototype.onPressed.call(this, f, isRunningForce && !this.wildcardTutorial);
    if (this.wildcardTutorial && Game.currentGame.cardsTutorial) {
        Game.currentGame.cardsTutorial.finishTutorialStep();
        Game.currentGame.counter.trigger();
    }
};

WildcardBooster.prototype.hintAttempt = function () {
    if (cleverapps.environment.isSceneWithPreview() || cleverapps.config.editorMode) {
        return;
    }

    var noMoves = Game.currentGame.table.listMissed().length === 0;
    var activeCombo = Game.currentGame.combo && Game.currentGame.combo.level > 0;

    if (noMoves && activeCombo) {
        this.onUserInactive();
    }
};

WildcardBooster.prototype.makeUndo = function () {
    if (!this.wildcardTutorial) {
        cleverapps.user.earnHard(cleverapps.EVENTS.EARN.RETURN, this.price.hard);
    }
    var card = Game.currentGame.open.pop();
    card.trigger("makeUndo");
};