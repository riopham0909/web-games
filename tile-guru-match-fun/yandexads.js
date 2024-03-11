/**
 * Created by iamso on 22.07.21
 */

var YandexAds = function () {
    AdsPlugin.call(this);

    this.playTime = 0;
};

YandexAds.prototype = Object.create(AdsPlugin.prototype);
YandexAds.prototype.constructor = YandexAds;

YandexAds.isAppropriate = function () {
    return cleverapps.platform instanceof Yandex;
};

YandexAds.prototype.playAd = function (name) {
    if (!cleverapps.platform.isConnected(Platform.ADS) || !this.cached[name] || this.adIsRunning(name)) {
        this._onCancel();
        return;
    }

    if (this.playTime + AdsPlugin.LOAD_AFTER_PLAY_TIME > Date.now()) {
        if (name === RewardedAdsManager.REWARDED) {
            cleverapps.notification.create("WaitNextAd");
        }

        this._onCancel();
        return;
    }

    this.setPlaying(name);

    RewardedAdsManager.ACTIVE_ADS.forEach(function (name) {
        this.reset(name);
    }.bind(this));

    this.playTime = Date.now();

    var onFinished = function (code) {
        this.setFinished(name);

        if (code === AdsPlugin.CODE_REWARD) {
            cleverapps.rewardedAdsManager.onReward();
        } else {
            this._onCancel();
        }
    }.bind(this);

    if (name === RewardedAdsManager.REWARDED) {
        this._playRewardedAd(onFinished);
    } else {
        this._playInterstitialAd(onFinished);
    }
};

YandexAds.prototype._playRewardedAd = function (callback) {
    var rewarded = false;
    callback = cleverapps.once(callback);

    cleverapps.platform.ysdk.adv.showRewardedVideo({
        callbacks: {
            onRewarded: function () {
                rewarded = true;
            },
            onClose: function () {
                if (rewarded) {
                    callback(AdsPlugin.CODE_REWARD);
                } else {
                    callback();
                }
            },
            onError: function (error) {
                callback();
                this._processError(RewardedAdsManager.REWARDED, error);
            }.bind(this)
        }
    });
};

YandexAds.prototype._playInterstitialAd = function (callback) {
    callback = cleverapps.once(callback);

    cleverapps.platform.ysdk.adv.showFullscreenAdv({
        callbacks: {
            onClose: callback,
            onError: function (error) {
                callback();
                this._processError(RewardedAdsManager.INTERSTITIAL, error);
            }.bind(this)
        }
    });
};

YandexAds.prototype._processError = function (type, error) {
    var message = String(error);

    console.log("" + type + " onError: " + message);

    var knownErrors = [{
        match: ["No rewarded video to show now", "No adv to show now"],
        group: "noads",
        notification: "NoAdsError"
    }, {
        match: ["AdBlock prevents yandex ad to show"],
        group: "adblock",
        notification: "AdBlockError"
    }, {
        match: [/Container with id .+? is not found/],
        group: "container_not_found",
        notification: "PlayAdError"
    }, {
        match: [/Container with id .+? is hidden/],
        group: "container_hidden",
        notification: "PlayAdError"
    }, {
        match: ["Too narrow container."],
        group: "container_too_narrow",
        notification: "PlayAdError"
    }, {
        match: ["The received format doesn't match the expected type"],
        group: "format_mismatch",
        notification: "PlayAdError"
    }, {
        match: ["Current domain is not allowed on the page"],
        group: "not_allowed",
        notification: "PlayAdError"
    }, {
        match: ["Another ad already opened"],
        group: "already_opened",
        notification: "AdAlreadyOpenedError"
    }, {
        match: ["Rewarded Video timeout", "Message rejected by timeout"],
        group: "timeout",
        notification: "AdVideoTimeoutError"
    }, {
        match: ["Ad script init timeout"],
        group: "init_timeout",
        notification: "AdInitTimeoutError"
    }, {
        match: [/^Error$/],
        group: "no_description",
        notification: "PlayAdError"
    }];

    error = knownErrors.find(function (error) {
        return error.match.some(function (regexp) {
            return message.match(regexp);
        });
    });

    if (!error) {
        error = {
            group: "other",
            notification: "PlayAdError"
        };

        cleverapps.throwAsync({ group: "yandexRewardedError", message: type + " " + message });
    }

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.YANDEX.ADS_PLAY + type + "-" + error.group);

    if (type !== RewardedAdsManager.INTERSTITIAL) {
        cleverapps.notification.create(error.notification);
    }
};

YandexAds.prototype.getECPM = function () {
    return RewardedAdsManager.eCPM.Yandex;
};