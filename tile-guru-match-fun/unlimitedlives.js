/**
 * Created by andrey on 22.05.17.
 */

var UnlimitedLives = function () {
    this.value = undefined;

    this.load();
};

UnlimitedLives.prototype.buy = function (time) {
    if (typeof time === "string") {
        time = cleverapps.parseInterval(time);
    }
    if (this.checkBuyed()) {
        this.value.actionTime += time;
    } else {
        this.value = {
            buyTime: Date.now(),
            actionTime: time,
            fpShowed: 0
        };
    }
    this.save();
};

UnlimitedLives.prototype.reset = function () {
    this.value = undefined;
    this.save();
};

UnlimitedLives.prototype.getLeftTime = function () {
    if (cleverapps.platform.oneOf(Pliega)) {
        return Infinity;
    }
    if (this.value === undefined) {
        return 0;
    }
    var left = this.value.buyTime + this.value.actionTime - Date.now();
    if (left <= 0) {
        return 0;
    }
    return left;
};

UnlimitedLives.prototype.checkBuyed = function () {
    return this.getLeftTime() > 0;
};

UnlimitedLives.prototype.displayPromotionOnFinish = function () {
    if (cleverapps.flags.videoAdsMainMonetization) {
        return;
    }

    if (this.value && !this.value.fpShowed && this.getLeftTime() === 0) {
        this.showPromotion();
    }
};

UnlimitedLives.prototype.showPromotion = function () {
    cleverapps.meta.display({
        focus: "ExtendUnlimitedLivesWindow",
        action: function (f) {
            this.value.fpShowed = 1;
            this.save();

            new ExtendUnlimitedLivesWindow();
            cleverapps.meta.onceNoWindowsListener = f;
        }.bind(this)
    });
};

UnlimitedLives.prototype.getInfo = function () {
    var compat = {};
    compat[UnlimitedLives.UNLIMITED_LIVES_COMPAT] = this.value;
    return compat;
};

UnlimitedLives.prototype.updateInfo = function (data, fromServer) {
    this.value = data[UnlimitedLives.UNLIMITED_LIVES_COMPAT];
    this.save(fromServer);
};

UnlimitedLives.prototype.load = function () {
    var save = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.UNLIMITED_LIVES);

    if (save === undefined) {
        this.value = undefined;
        return;
    }

    this.value = save[UnlimitedLives.UNLIMITED_LIVES_COMPAT];
};

UnlimitedLives.prototype.save = function (fromServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.UNLIMITED_LIVES, this.getInfo());

    if (!fromServer) {
        cleverapps.synchronizer.addUpdateTask("tempgoods");
    }
};

UnlimitedLives.UNLIMITED_LIVES_COMPAT = 1;