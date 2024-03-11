/**
 * Created by iamso on 16.07.20.
 */

var DiscoverBooster = function (id) {
    Booster.call(this, id);
};

DiscoverBooster.prototype = Object.create(Booster.prototype);
DiscoverBooster.prototype.ctor = DiscoverBooster;

DiscoverBooster.prototype.onGameStarted = function () {
    var game = Game.currentGame;
    game.userStatus.on("inactive_short", this.onUserInactive.bind(this));
    game.userStatus.on("active", this.onUserActive.bind(this));

    if (this.isForceAvailable()) {
        game.onMistakeBoosterListeners.discover = this.showForce.bind(this);
    }
};

DiscoverBooster.prototype.onUserInactive = function () {
    if (this.isDisabled()) {
        return;
    }

    Booster.prototype.onUserInactive.apply(this, arguments);
};

DiscoverBooster.prototype.onPressed = function (f, isRunningForce) {
    if (Game.currentGame.getAreasWithoutHint().length === 0) {
        cleverapps.notification.create("DiscoverBooster.hintsShown");
        f();
    } else {
        Booster.prototype.onPressed.call(this, f, isRunningForce);
    }
};

DiscoverBooster.prototype.onUserActive = function () {
    if (this.manualAlarm) {
        return;
    }

    Booster.prototype.onUserActive.apply(this, arguments);
};

DiscoverBooster.prototype.execute = function () {
    this.executing = true;
    Booster.prototype.execute.apply(this, arguments);
    this.executing = false;
};

DiscoverBooster.prototype.onExecute = function (options) {
    Game.currentGame.boosterDiscover(options);
};