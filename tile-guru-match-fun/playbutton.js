/**
 * Created by vladislav on 05.10.2020
 */

var PlayButton = function () {
    cleverapps.EventEmitter.call(this);

    if (cleverapps.isLevels()) {
        cleverapps.user.on("incLevel", this.onIncLevel.bind(this));
    }
    cleverapps.episodes.onResetListener = this.update.bind(this);

    this.update();
};

PlayButton.prototype = Object.create(cleverapps.EventEmitter.prototype);
PlayButton.prototype.constructor = PlayButton;

PlayButton.prototype.onIncLevel = function () {
    if (this.incLevelDisabled) {
        return;
    }

    this.passedLevel = true;
    this.update();
};

PlayButton.prototype.enableIncLevel = function () {
    delete this.incLevelDisabled;
};

PlayButton.prototype.disableIncLevel = function () {
    this.incLevelDisabled = true;
};

PlayButton.prototype.getLevelNo = function () {
    var levelNo = cleverapps.user.getVirtualDisplayLevel();
    if (this.passedLevel) {
        levelNo--;
    }
    return levelNo;
};

PlayButton.prototype.update = function () {
    if (!PlayButton.IsAvailable() || !cleverapps.isLevels()) {
        return;
    }

    var currentLevel = cleverapps.user.getCurrentLevel();
    if (this.currentLevel && this.currentLevel.episodeNo === currentLevel.episodeNo && this.currentLevel.levelNo === currentLevel.levelNo) {
        return;
    }

    if (this.currentLevel) {
        this.previousLevel = this.currentLevel;
    }

    this.currentLevel = new Episode(currentLevel.episodeNo, currentLevel.levelNo).getLevel();

    this.trigger("update");
};

PlayButton.prototype.onClick = function () {
    if (cleverapps.forces.isRunningForce()) {
        cleverapps.forces.closeRunningForce();
    }

    cleverapps.meta.display({
        focus: "PlayButton_scene",
        action: function (f) {
            cleverapps.meta.wantsToPlay(f);
        }
    });
};

PlayButton.prototype.animatePassLevel = function () {
    this.passedLevel = false;
    this.trigger("animatePassLevel");
};

PlayButton.IsAvailable = function () {
    return ![Metha.NONE].includes(cleverapps.meta.getType());
};