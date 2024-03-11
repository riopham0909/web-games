/**
 * Created by razial on 01.08.2023
 */

var BannerAd = function () {
    this.state = BannerAd.STATE_HIDDEN;

    this.show();
    cleverapps.timeouts.setInterval(this.check.bind(this), BannerAd.CHECK_INTERVAL);

    if (cleverapps.platform.isConnected(Platform.ADS)) {
        this.check();
    }

    cleverapps.platform.on("changeStatus:" + Platform.ADS, function (status) {
        if (status === Platform.STATUS_CONNECTED) {
            this.check();
        }
    }.bind(this));
};

BannerAd.prototype.canShow = function () {
    var payerLevel = cleverapps.paymentsHistory.classify();
    if (payerLevel !== cleverapps.PaymentsHistory.BRACKET_NONE) {
        return false;
    }

    if (cleverapps.environment.isLoaderScene() || cleverapps.environment.isChatScene() || cleverapps.environment.isMineScene()
        || cleverapps.environment.isBonusWorldScene()
        || cleverapps.environment.isAtlasAnalyzerScene() || cleverapps.environment.isSceneWithPreview()) {
        return false;
    }

    if (cleverapps.snapshotBar && cleverapps.snapshotBar.isRecording) {
        return false;
    }

    if (cc.sys.isMobile && (cleverapps.resolution.isLandscapeOrientation() || cleverapps.config.orientation === "horizontal")) {
        return false;
    }

    if (cleverapps.platform.oneOf(Instant)) {
        if (cleverapps.config.instant.banner === undefined) {
            if (cleverapps.config.debugMode) {
                throw "No instant banner config";
            }
        }

        if (!cc.sys.isInApp) {
            return false;
        }

        if (cleverapps.config.instant.banner === undefined) {
            return false;
        }
    }

    if (cleverapps.platform.oneOf(CleverApps, Xiaomi)) {
        if (!cleverapps.config.adsense || !cleverapps.config.adsense.slot) {
            if (cleverapps.config.debugMode) {
                throw "No adsense config or slot";
            }

            return false;
        }
    }

    if (cleverapps.platform.oneOf(Crazy) && cleverapps.flags.highMonetization) {
        return false;
    }

    if (cleverapps.platform.oneOf(OKPlatform) && cleverapps.platform.isFullScreen()) {
        return false;
    }

    return cleverapps.platform.oneOf(Instant, VKPlatform, OKPlatform, CleverApps, Xiaomi, Crazy, TestPlatform);
};

BannerAd.prototype.show = function () {
    if (this.processing || this.state !== BannerAd.STATE_HIDDEN) {
        return;
    }

    if (!this.canShow()) {
        return;
    }

    this.processing = true;

    console.log("showBannerAd loading");
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.BANNER.LOADING);

    cleverapps.platform.showBannerAd(function (error, bannerHeight) {
        this.processing = false;

        if (error !== cleverapps.CODE_SUCCEED) {
            console.log("showBannerAd error", error);
            return;
        }

        this.bannerWidth = undefined;
        if (typeof bannerHeight === "object") {
            this.bannerWidth = bannerHeight.width;
            bannerHeight = bannerHeight.height;
        }

        cleverapps.resolution.setBottomBgPadding(bannerHeight);

        this.state = BannerAd.STATE_SHOWN;

        console.log("showBannerAd success");
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.BANNER.SHOWN);

        cleverapps.playSession.set(cleverapps.EVENTS.STATS.BANNER.DAU, true);

        var isPaidEventsByInterval = cleverapps.platform.oneOf(Instant, Yandex, MSStart);
        if (isPaidEventsByInterval) {
            this.removePaidEventInterval();

            this.paidEventInterval = cleverapps.timeouts.setInterval(this.onPaidEvent.bind(this), BannerAd.PAID_EVENT_INTERVAL);
        }

        this.refreshInterval = cleverapps.timeouts.setInterval(this.refresh.bind(this), BannerAd.REFRESH_INTERVAL);

        this.check();
    }.bind(this));
};

BannerAd.prototype.hide = function (forceClearPaddings) {
    if (this.processing || this.state !== BannerAd.STATE_SHOWN) {
        return;
    }

    this.processing = true;

    console.log("hideBannerAd loading");

    cleverapps.platform.hideBannerAd(function (error) {
        this.processing = false;

        if (error !== cleverapps.CODE_SUCCEED) {
            console.log("hideBannerAd error", error);
            return;
        }

        if (forceClearPaddings || cleverapps.platform.isFullScreen()) {
            cleverapps.resolution.setBottomBgPadding();
        }

        this.state = BannerAd.STATE_HIDDEN;

        console.log("hideBannerAd success");
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.BANNER.HIDDEN);

        this.removePaidEventInterval();
        this.removeRefreshInterval();
    }.bind(this));
};

BannerAd.prototype.removePaidEventInterval = function () {
    if (this.paidEventInterval) {
        cleverapps.timeouts.clearInterval(this.paidEventInterval);
        delete this.paidEventInterval;
    }
};

BannerAd.prototype.removeRefreshInterval = function () {
    if (this.refreshInterval) {
        cleverapps.timeouts.clearInterval(this.refreshInterval);
        delete this.refreshInterval;
    }
};

BannerAd.prototype.refresh = function () {
    if (this.processing) {
        return;
    }

    this.processing = true;

    cleverapps.platform.refreshBannerAd(function (error) {
        this.processing = false;

        if (error || !this.canShow()) {
            this.hide();
        }
    }.bind(this));
};

BannerAd.prototype.check = function (forceClearPaddings) {
    if (this.processing) {
        return;
    }

    if (this.state === BannerAd.STATE_SHOWN) {
        if (!this.canShow()) {
            this.hide(forceClearPaddings);
        }
    } else if (this.state === BannerAd.STATE_HIDDEN) {
        if (this.canShow()) {
            this.show();
        } else if (forceClearPaddings) {
            cleverapps.resolution.setBottomBgPadding();
        }
    }
};

BannerAd.prototype.onResize = cleverapps.accumulate(300, function () {
    this.check();
});

BannerAd.prototype.getECPM = function () {
    if (cleverapps.platform.oneOf(MobileVk) && cleverapps.MobileVkSocial.getPlatfrom() === "html5_mobile") {
        return BannerAd.eCPM.iab_vk;
    }

    return BannerAd.eCPM[cleverapps.platform.source];
};

BannerAd.prototype.onPaidEvent = function () {
    var impressionCost = this.getECPM() / 1000;
    if (!impressionCost) {
        return;
    }

    cleverapps.playSession.inc(cleverapps.EVENTS.ADS.TYPE + "banner", impressionCost);
    cleverapps.playSession.inc(cleverapps.EVENTS.ADS.TYPE + "banner-impressions", 1);
};

BannerAd.prototype.getGlobalBoundingBox = function () {
    var bgSize = cleverapps.UI.getBgSize();
    var bannerHeight = cleverapps.UI.getBgOffset();

    if (this.state === BannerAd.STATE_SHOWN && bannerHeight > 0) {
        var width = this.bannerWidth
            ? Math.round(bgSize.width * this.bannerWidth / cleverapps.resolution.getFrameSize().width)
            : bgSize.width;
        return cc.rect(bgSize.width / 2 - width / 2, 0, width, bannerHeight);
    }
};

BannerAd.STATE_HIDDEN = "hidden";
BannerAd.STATE_SHOWN = "shown";

BannerAd.PAID_EVENT_INTERVAL = cleverapps.parseInterval("1 minute");
BannerAd.CHECK_INTERVAL = cleverapps.parseInterval("1 minute");
BannerAd.REFRESH_INTERVAL = cleverapps.parseInterval("1 minute");

BannerAd.eCPM = {
    // https://apiok.ru/apps/features/banner_ads
    web_ok: 20 / cleverapps.EXCHANGE_RATES.RUB,
    mobile_ok: 30 / cleverapps.EXCHANGE_RATES.RUB,

    // https://dev.vk.com/ru/apps-offer-ad
    web_vk: 25 / cleverapps.EXCHANGE_RATES.RUB,
    mobile_vk: 25 / cleverapps.EXCHANGE_RATES.RUB,
    iab_vk: 30 / cleverapps.EXCHANGE_RATES.RUB,

    instant: 7.57,
    yandex: 30 / cleverapps.EXCHANGE_RATES.RUB,
    msstart: 5
};