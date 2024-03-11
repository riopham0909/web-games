/**
 * Created by vladislav on 17.01.2022
 */

var AdBubble = function (options) {
    cleverapps.EventEmitter.call(this);

    this.onSuccess = options.onSuccess;
    this.canClick = options.canClick;
    this.limit = options.limit;
    this.skin = options.skin;

    cleverapps.adsLimits.on("update", this.onAdsUpdate.bind(this), this);

    this.onAdsUpdate();
};

AdBubble.prototype = Object.create(cleverapps.EventEmitter.prototype);
AdBubble.prototype.constructor = AdBubble;

AdBubble.prototype.onClick = function () {
    this.watchAd();
};

AdBubble.prototype.watchAd = function () {
    if (this._isActive && (!this.canClick || this.canClick())) {
        cleverapps.rewardedAdsManager.loadAndPlay({
            type: RewardedAdsManager.REWARDED,
            adLimit: this.limit,
            callback: function () {
                cleverapps.adsLimits.watch(this.limit);

                this.trigger("pop");

                this.onSuccess();
            }.bind(this)
        });
    }
};

AdBubble.prototype.setActive = function (isActive) {
    if (this._isActive === isActive) {
        return;
    }

    this._isActive = isActive;

    this.trigger("update", this._isActive);
};

AdBubble.prototype.isActive = function () {
    return this._isActive;
};

AdBubble.prototype.onAdsUpdate = function () {
    this.setActive(this.isAdAvailable());

    this.trigger("adsUpdate");
};

AdBubble.prototype.isAdAvailable = function () {
    return cleverapps.adsLimits.state(this.limit) === AdsLimits.STATE_READY;
};

AdBubble.prototype.getSkin = function () {
    return this.skin || "regular";
};

AdBubble.prototype.onExit = function () {
    runCleaners(this);

    this.purge();
};