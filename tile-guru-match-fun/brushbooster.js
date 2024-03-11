/**
 * Created by iamso on 16.07.20.
 */

var BrushBooster = function (id) {
    Booster.call(this, id);

    this.init();
    this.onAfterExecuted = function () {};
}; 

BrushBooster.prototype = Object.create(Booster.prototype);
BrushBooster.prototype.ctor = BrushBooster;

BrushBooster.prototype.onGameStarted = function () {
    if (this.isForceAvailable()) {
        var game = Game.currentGame;
        game.onMistakeBoosterListeners.brush = function () {
            if (this.isForceAvailable() && !this.used && (game.inflamer.value > 1 || game.inflamer.stage > 0)) {
                this.showForce();
            }
        }.bind(this);
    }
};

BrushBooster.prototype.canExecute = function () {
    return Booster.prototype.canExecute.call(this) && !this.used;
};

BrushBooster.prototype.onPressed = function (f, isRunningForce) {
    if (this.used) {
        f();
    } else {
        Booster.prototype.onPressed.call(this, f, isRunningForce);
    }
};

BrushBooster.prototype.execute = function () {
    if (this.executing) {
        return;
    }

    this.executing = true;
    Booster.prototype.execute.apply(this, arguments);
    this.executing = false;
};

BrushBooster.prototype.onExecute = function () {
    this.used = true;
    Game.currentGame.showPaint();

    this.onAfterExecuted();
};

BrushBooster.prototype.init = function () {
    this.used = false;
};
