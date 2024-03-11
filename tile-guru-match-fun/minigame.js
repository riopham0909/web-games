/**
 * Created by slava on 23/11/17
 */

cleverapps.MiniGame = function (isNewUser) {
    if (cleverapps.config.debugMode) {
        cleverapps.MiniGame.TIMEOUT = "2 minutes";
    }

    cleverapps.DailyChest.call(this, {
        isNewUser: isNewUser,
        serverTaskName: "bonuses",
        interval: cleverapps.parseInterval(cleverapps.MiniGame.TIMEOUT)
    });

    this.closedText = "MiniGame.ClosedText";
};

cleverapps.MiniGame.prototype = Object.create(cleverapps.DailyChest.prototype);
cleverapps.MiniGame.prototype.constructor = cleverapps.MiniGame;

cleverapps.MiniGame.prototype.initializeForNewUser = function () {
    this.locked = false;
    this.setWhenUnlock(Date.now());
};

cleverapps.MiniGame.TIMEOUT = "1 day";

cleverapps.MiniGame.prototype.resetUnlockCountdown = function () {
    cleverapps.DailyChest.prototype.resetUnlockCountdown.call(this);

    cleverapps.localPushes.sendPush(cleverapps.LocalPushes.TYPES.MINI_GAME, this.when - Date.now());
};

cleverapps.MiniGame.prototype.refreshItems = function () {

};

cleverapps.MiniGame.prototype.isAvailable = function () {
    if (!levels.user.checkAvailable(cleverapps.MiniGame.AVAILABLE)) {
        return false;
    }

    return !this.locked;
};

cleverapps.MiniGame.prototype.getReward = function () {
    var prize = cleverapps.Random.choose(RewardsConfig.MiniGame);
    if (levels.user.isBeginner() && RewardsConfig.MiniGameBeginner) {
        prize = cleverapps.Random.choose(RewardsConfig.MiniGameBeginner);
    }
    if (levels.user.isNovice() && RewardsConfig.MiniGameNovice) {
        prize = cleverapps.Random.choose(RewardsConfig.MiniGameNovice);
    }

    if (prize.betGold) {
        delete prize.betGold;
    }

    prize = cleverapps.user.prepareRewardByRich(prize);

    return prize;
};

cleverapps.MiniGame.prototype.openWindow = function (f) {
    if (!cleverapps.periodicBonus.locked) {
        var reward = cleverapps.clone(cleverapps.periodicBonus.getReward(), true);
        new MiniGameWindow(reward);

        cleverapps.eventBus.trigger("taskEvent", DailyTasks.PLAY_MINI_GAME);

        if (f) {
            cleverapps.meta.onceNoWindowsListener = f;
        }
    } else {
        cleverapps.notification.create(cleverapps.periodicBonus.closedText);
        if (f) {
            f();
        }
    }
};

cleverapps.MiniGame.AVAILABLE = {
    level: 2.13,
    registered: "1 hour",
    epicart: {
        disabled: true
    }
};