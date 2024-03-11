/**
 * Created by andrey on 21.05.2020
 */

var WindowBoostersBefore = function (level) {
    this.level = level;

    this.list = cleverapps.boosters.listBoostersBefore().map(function (booster) {
        return new WindowBoosterBefore(booster, level);
    });
};

WindowBoostersBefore.prototype.listActivatedBoosters = function () {
    return this.list.filter(function (windowBooster) {
        return windowBooster.isSelected() || windowBooster.isLantern();
    }).map(function (windowBooster) {
        return windowBooster.booster;
    });
};

WindowBoostersBefore.prototype.showTutorialSteps = function () {
    var steps = this.list.map(function (booster) {
        return function (f) {
            booster.showTutorialStep(f);
        };
    });

    new ActionPlayer(steps).play();
};

WindowBoostersBefore.isAvailable = function (options) {
    return cleverapps.user.checkAvailable(WindowBoostersBefore.AVAILABLE, options) && cleverapps.boosters.listBoostersBefore().length > 0;
};

WindowBoostersBefore.AVAILABLE = {
    level: 0.83
};

if (cleverapps.config.type === "match3") {
    WindowBoostersBefore.AVAILABLE = {
        level: 1.46
    };
}
