/**
 * https://support.google.com/adsense/answer/10762946?hl=ru
 * https://developers.google.com/ad-placement/docs/placement-types
 *
 * Created by Ivan on 01.09.22
 */

var GoogleWebAds = function () {
    AdsPlugin.call(this, {
        cantLoadAndPlayInParallel: true
    });
    AdsPlugin.EXPIRATION_TIME = cleverapps.parseInterval("100 days");

    this.withSdk = true;

    this.code = "GoogleWebAds";
};

GoogleWebAds.prototype = Object.create(AdsPlugin.prototype);
GoogleWebAds.prototype.constructor = GoogleWebAds;

GoogleWebAds.isAppropriate = function () {
    return cleverapps.platform.oneOf(CleverApps, Xiaomi);
};

GoogleWebAds.prototype._connect = function (callback) {
    console.log("Initing GoogleWebAds");

    var attrs = {
        "data-ad-client": cleverapps.config.adsense.client,
        "data-ad-frequency-hint": "5s"
    };

    if (cleverapps.config.debugMode) {
        attrs["data-adbreak-test"] = "on";
    }

    cleverapps.loadSdk("//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + cleverapps.config.adsense.client, {
        attrs: attrs,

        onSuccess: function () {
            console.log("GoogleWebAds API loaded");
            window.adsbygoogle = window.adsbygoogle || [];

            window.adsbygoogle.push({
                preloadAdBreaks: "on",
                sound: "on",
                onReady: function () {
                    console.log("GoogleWebAds ready");
                    callback(Platform.STATUS_CONNECTED);
                }
            });
        },
        onFailure: function () {
            console.log("Failed load adsbygoogle.js");

            callback(Platform.STATUS_DISCONNECTED);
        }
    });
};

GoogleWebAds.prototype._cache = function (name, callback) {
    if (name !== RewardedAdsManager.REWARDED) {
        callback(AdsPlugin.CODE_FAILED);
        return;
    }

    var rewarded = false;

    window.adsbygoogle.push({
        name: name,
        type: "reward",
        beforeReward: function (showAdFn) {
            callback(AdsPlugin.CODE_SUCCEED, showAdFn);
        },
        adViewed: function () {
            rewarded = true;
        },
        adDismissed: function () {
            rewarded = false;
        },
        adBreakDone: function () {
            if (this._callback) {
                this._callback(rewarded ? AdsPlugin.CODE_REWARD : undefined);
                this._callback = undefined;
            } else {
                callback();
            }
        }.bind(this)
    });
};

GoogleWebAds.prototype._playAd = function (name, ad, callback) {
    if (typeof ad !== "function") {
        callback && callback();
        return;
    }

    if (name === RewardedAdsManager.REWARDED) {
        this._callback = callback;
        ad();
    }
};

GoogleWebAds.prototype.addBannerContainer = function () {
    if (this.bannerContainer) {
        return;
    }

    var container = this.bannerContainer = document.createElement("div");
    container.style.display = "block";
    container.style.position = "absolute";
    container.style.bottom = "0";
    container.style.margin = "0 auto";
    container.style.right = "0";
    container.style.left = "0";
    container.style.height = GoogleWebAds.AD_BANNER_HEIGHT + "px";
    container.style.width = "728px";
    container.style.zIndex = "2";
    container.style.backgroundColor = "white";

    var ins = this.bannerIns = document.createElement("ins");
    ins.id = "google-ad-banner-container";
    ins.className = "adsbygoogle";
    ins.style.zIndex = "2";
    ins.setAttribute("data-ad-client", cleverapps.config.adsense.client);
    ins.setAttribute("data-ad-slot", cleverapps.config.adsense.slot);

    if (cleverapps.config.debugMode) {
        ins.setAttribute("data-adbreak-test", "on");
    }

    ins.style.display = "inline-block";
    ins.style.position = "relative";
    ins.style.margin = "0 auto";
    ins.style.height = GoogleWebAds.AD_BANNER_HEIGHT + "px";
    ins.style.width = "728px";

    document.body.appendChild(container);
    container.appendChild(ins);

    (window.adsbygoogle = window.adsbygoogle || []).push({});
};

GoogleWebAds.prototype.removeBannerContainer = function () {
    if (this.bannerObserver) {
        this.bannerObserver.disconnect();
        this.bannerObserver = undefined;
    }
    if (this.bannerIns) {
        this.bannerIns.remove();
        this.bannerIns = undefined;
    }
    if (this.bannerContainer) {
        this.bannerContainer.remove();
        this.bannerContainer = undefined;
    }
};

GoogleWebAds.prototype.showBanner = function (callback) {
    this.addBannerContainer();

    callback(cleverapps.CODE_SUCCEED, GoogleWebAds.AD_BANNER_HEIGHT);
};

GoogleWebAds.prototype.hideBanner = function (callback) {
    this.removeBannerContainer();

    callback(cleverapps.CODE_SUCCEED);
};

GoogleWebAds.prototype.getECPM = function () {
    return RewardedAdsManager.eCPM.GoogleWeb;
};

GoogleWebAds.AD_BANNER_HEIGHT = 90;