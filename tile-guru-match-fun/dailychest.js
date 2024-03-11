/**
 * Created by andrey on 01.06.17.
 */

cleverapps.DailyChest = function (options) {
    if (cleverapps.config.debugMode) {
        cleverapps.DailyChest.TIMEOUT = "10 minutes";
    }

    options = Object.assign({
        storage: cleverapps.DataLoaderTypes.DAILY_CHEST,
        interval: cleverapps.parseInterval(cleverapps.DailyChest.TIMEOUT)
    }, options);

    this.onUnlockingStarted = function () {
    };

    this.interval = options.interval;

    cleverapps.Chest.call(this, options);
};

cleverapps.DailyChest.prototype = Object.create(cleverapps.Chest.prototype);
cleverapps.DailyChest.prototype.constructor = cleverapps.DailyChest;

cleverapps.DailyChest.prototype.initializeForNewUser = function () {
    this.locked = true;
    this.startUnlockFromScratch();
};

cleverapps.DailyChest.prototype.fromJSON = function (data) {
    this.locked = true;
    this.setWhenUnlock(data.nextTime);
};

cleverapps.DailyChest.prototype.toJSON = function () {
    return {
        nextTime: this.when
    };
};

cleverapps.DailyChest.prototype.startUnlockFromScratch = function () {
    this.setWhenUnlock(Date.now() + this.interval);
};

cleverapps.DailyChest.prototype.open = function () {
    this.locked = true;
    this.startUnlockFromScratch();
    this.changeLockedListener();
};

cleverapps.DailyChest.prototype.resetUnlockCountdown = function () {
    if (this.countdown !== undefined) {
        this.countdown.resetTimeLeft(this.when - Date.now());
    } else {
        this.countdown = new cleverapps.CountDown(this.when - Date.now(), {
            onFinish: this.unlock.bind(this),
            permanent: true
        });
    }

    this.onUnlockingStarted();
};

cleverapps.DailyChest.prototype.setWhenUnlock = function (when) {
    if (!when) {
        when = Date.now();
    }
    this.when = Math.min(when, Date.now() + this.interval);
    this.save();

    this.resetUnlockCountdown();
};

cleverapps.DailyChest.TIMEOUT = "3 hours";