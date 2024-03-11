/**
 * Created by mac on 4/8/18
 */

var RewardedAdsManager = function () {
    cleverapps.EventEmitter.call(this);

    this.plugin = undefined;
    this.baseWatchCounter = 0;
    this.totalWatchCounter = cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.AD_WATCH_COUNTER) || 0;
    this.lastAdStarter = undefined;

    this.lastPlay = {};
    this.lastAvailable = {};
    this.lastAvailable[RewardedAdsManager.REWARDED] = Date.now();
    this.lastAvailable[RewardedAdsManager.INTERSTITIAL] = Date.now();

    cleverapps.platform.on("changeStatus:" + Platform.ADS, function (status) {
        if (status === Platform.STATUS_CONNECTED) {
            this.onConnected();
        }
    }.bind(this));
};

RewardedAdsManager.prototype = Object.create(cleverapps.EventEmitter.prototype);
RewardedAdsManager.prototype.constructor = RewardedAdsManager;

RewardedAdsManager.prototype.onConnected = function () {
    if (cleverapps.paymentsHistory.isVIP()) {
        RewardedAdsManager.ACTIVE_ADS.forEach(function (name) {
            if (name === RewardedAdsManager.REWARDED) {
                this.trigger("changeLoaderState:" + name, this.plugin.loaderState[name]);
            }
        }.bind(this));
    }

    this.checkCacheQueue();
    new cleverapps.Interval(this.checkCacheQueue.bind(this), cleverapps.parseInterval("30 seconds"));
};

RewardedAdsManager.prototype.createPlugin = function () {
    var PluginClass;
    if (MultiAdsPlugin.isAppropriate()) {
        PluginClass = MultiAdsPlugin;
    } else if (GDComAds.isAppropriate()) {
        PluginClass = GDComAds;
    } else if (CrazyAds.isAppropriate()) {
        PluginClass = CrazyAds;
    } else if (PlingaAds.isAppropriate()) {
        PluginClass = PlingaAds;
    } else if (YandexAppAds.isAppropriate()) {
        PluginClass = YandexAppAds;
    } else if (AppLovinAds.isAppropriate()) {
        PluginClass = AppLovinAds;
    } else if (AdMobAds.isAppropriate()) {
        PluginClass = AdMobAds;
    } else if (OKAds.isAppropriate()) {
        PluginClass = OKAds;
    } else if (VKAds.isAppropriate()) {
        PluginClass = VKAds;
    } else if (InstantAds.isAppropriate()) {
        PluginClass = InstantAds;
    } else if (GoogleWebAds.isAppropriate()) {
        PluginClass = GoogleWebAds;
    } else if (YandexAds.isAppropriate()) {
        PluginClass = YandexAds;
    } else if (MSStartAds.isAppropriate()) {
        PluginClass = MSStartAds;
    } else if (WortalAds.isAppropriate()) {
        PluginClass = WortalAds;
    } else if (SamsungAds.isAppropriate()) {
        PluginClass = SamsungAds;
    } else if (WechatAds.isAppropriate()) {
        PluginClass = WechatAds;
    } else if (VideoAds.isAppropriate()) {
        PluginClass = VideoAds;
    }

    var currentPluginClass = this.plugin && this.plugin.constructor;

    if (PluginClass && PluginClass !== currentPluginClass) {
        this.plugin = new PluginClass();

        return this.plugin;
    }
};

RewardedAdsManager.prototype.askPermission = function (f) {
    if (this.plugin) {
        this.plugin.askPermission(f);
    } else {
        f();
    }
};

RewardedAdsManager.prototype.init = function () {
    if (!this.isEnabled()) {
        return;
    }

    cleverapps.playSession.set(cleverapps.EVENTS.STATS.REWARDED_AVAILABLE_DAU, true);

    this.noadsTimeout = new cleverapps.LongTimeout((function () {
        cleverapps.playSession.set(cleverapps.EVENTS.STATS.REWARDED_NOADS_DAU, true);
        if (this.plugin.loadErrorCode) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.NOADS_ERROR + this.plugin.loadErrorCode);
        }
    }.bind(this)), cleverapps.parseInterval(RewardedAdsManager.REWARDED_NOADS_TIMEOUT));

    this.plugin.onChangeLoaderState = this.onChangeLoaderState.bind(this);
    this.plugin.onChangeVideoState = this.onChangeVideoState.bind(this);
    this.plugin._onCancel = this.onCancel.bind(this);
};

RewardedAdsManager.prototype.onChangeLoaderState = function (name) {
    console.log("onChangeLoaderState " + name, this.plugin.loaderState[name]);
    this.trigger("changeLoaderState:" + name, this.plugin.loaderState[name]);

    if (this.plugin.loaderState[name] === AdsPlugin.LOADER_STATE.READY) {
        this.lastAvailable[name] = Date.now();

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.ADS.READY);
        cleverapps.abTest.allLogEvent(cleverapps.EVENTS.ADS.READY);
    }

    if (name === RewardedAdsManager.REWARDED && this.plugin.loaderState[name] === AdsPlugin.LOADER_STATE.READY) {
        if (this.noadsTimeout) {
            clearTimeout(this.noadsTimeout);
            delete this.noadsTimeout;
        }

        cleverapps.playSession.set(cleverapps.EVENTS.STATS.REWARDED_LOADED_DAU, true);
    }
};

RewardedAdsManager.prototype.onChangeVideoState = function (name) {
    console.log("onChangeVideoState " + name, this.plugin.videoState[name]);
    this.trigger("changeVideoState:" + name, this.plugin.videoState[name]);
    if (this.plugin.videoState[name] === AdsPlugin.VIDEO_STATE.PLAY) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.ADS.START + "_" + name);

        if (name === RewardedAdsManager.INTERSTITIAL) {
            cleverapps.eventBus.trigger("taskEvent", DailyTasks.WATCH_ADS);
            cleverapps.thinkingData && cleverapps.thinkingData.logWatchAds();
        }

        if (name === RewardedAdsManager.REWARDED) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.TARGET_FOR_BUYING.AD_START);
        }

        if (cleverapps.gravityEngine) {
            cleverapps.gravityEngine.logAd(name);
        }
    } else {
        if (name === RewardedAdsManager.INTERSTITIAL && !this.plugin.isFakeImpression()) {
            var impressionCost = (this.plugin.getECPM() || 0) / 1000;
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.ADS.TYPE + name, {
                value: impressionCost
            });
        }

        this.removeAdOverlay();
        this.cacheNextAd(name);
    }
};

RewardedAdsManager.prototype.onCancel = function () {
    console.log("AdsPlugin._onCancel");
    this.removeAdOverlay();
    this.onFinish(false);
};

RewardedAdsManager.prototype.checkCacheQueue = function () {
    if (!this.isEnabled() || !cleverapps.platform.isConnected(Platform.ADS)) {
        return;
    }

    RewardedAdsManager.ACTIVE_ADS.forEach(function (name) {
        if (!this.isAvailable(name)) {
            this.cacheNextAd(name);
        } else if (this.plugin.expired(name)) {
            this.plugin.reset(name);
            this.cacheNextAd(name);
        }
    }.bind(this));
};

RewardedAdsManager.prototype.cacheNextAd = function (name) {
    if (!cleverapps.paymentsHistory.isVIP() && cleverapps.platform.isConnected(Platform.ADS) && this.plugin.canCache(name)) {
        console.log("RewardedAdsManager caching " + name);

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.ADS.CACHE);
        cleverapps.abTest.allLogEvent(cleverapps.EVENTS.ADS.CACHE);

        this.plugin.cache(name);
    }
};

RewardedAdsManager.prototype.isEnabled = function () {
    return this.plugin !== undefined;
};

RewardedAdsManager.prototype.isAvailable = function (name) {
    if (!this.isEnabled() || !cleverapps.platform.isConnected(Platform.ADS)) {
        return false;
    }

    if (cleverapps.paymentsHistory.isVIP()) {
        return name === RewardedAdsManager.REWARDED;
    }

    if (!this.plugin.isAvailable(name)) {
        return false;
    }

    if (name === RewardedAdsManager.INTERSTITIAL) {
        return levels.user.checkAvailable(RewardedAdsManager.INTERSTITIAL_AVAILABLE);
    }

    return true;
};

RewardedAdsManager.prototype.loadAndPlay = function (options) {
    var onCancelCallback = cleverapps.once(options.onCancelCallback);

    if (this.adIsRunning()) {
        onCancelCallback();

        cleverapps.notification.create("AdsRunning");
        return;
    }

    if (!RewardedAdsManager.ACTIVE_ADS.includes(options.type) || (options.type === RewardedAdsManager.INTERSTITIAL
        && (cleverapps.paymentsHistory.isVIP() || !levels.user.checkAvailable(RewardedAdsManager.INTERSTITIAL_AVAILABLE)
        || cleverapps.paymentsHistory.classify() !== cleverapps.PaymentsHistory.BRACKET_NONE))) {
        onCancelCallback();
        return;
    }

    if (this.isAvailable(options.type)) {
        if (options.type === RewardedAdsManager.REWARDED) {
            this.playRewarded(options.adLimit, options.callback, onCancelCallback);
        } else {
            this.showInterstitial(options.callback);
        }
        return;
    }

    cleverapps.rewardedAdsManager.cacheNextAd(options.type);

    var waitWindow;

    if (cleverapps.meta.isFocused()) {
        waitWindow = new WaitWindow();
    } else {
        cleverapps.meta.display({
            focus: "LoadingAds",
            action: function (f) {
                waitWindow = new WaitWindow();
                cleverapps.meta.onceNoWindowsListener = f;
            }
        });
    }

    var waitTimeout, loadHandler;

    var clear = function () {
        loadHandler.clear();
        clearTimeout(waitTimeout);
        waitWindow.close(true);
    };

    waitTimeout = setTimeout(function () {
        clear();

        if (!cleverapps.platform.isConnected(Platform.ADS)) {
            cleverapps.notification.create("PluginNotInited");
        } else if (!this.isAvailable(options.type)) {
            cleverapps.notification.create("NoAdsFound");
        }

        onCancelCallback();
    }.bind(this), 10000);

    loadHandler = this.on("changeLoaderState:" + options.type, function (state) {
        if (state === AdsPlugin.LOADER_STATE.READY) {
            clear();
            if (options.type === RewardedAdsManager.REWARDED) {
                this.playRewarded(options.adLimit, options.callback, onCancelCallback);
            } else if (this.canShowInterstitial()) {
                this.showInterstitial(options.callback);
            } else {
                onCancelCallback();
            }
        }
    }.bind(this));
};

RewardedAdsManager.prototype.removeAdOverlay = function (targetOverlay) {
    cleverapps.audio.unmute();
    cleverapps.CountDownManager.unmute();

    if (!targetOverlay || targetOverlay === this.rewardOverlay) {
        targetOverlay = this.rewardOverlay;
        this.rewardOverlay = undefined;
    }

    if (targetOverlay) {
        targetOverlay.removeFromParent();
    }

    if (RewardedAdsManager.onceOnRemoveOverlay) {
        RewardedAdsManager.onceOnRemoveOverlay();
        RewardedAdsManager.onceOnRemoveOverlay = undefined;
    }
};

RewardedAdsManager.prototype.createVipRewarded = function () {
    var onReward = function () {
        this.plugin.rewardAndFinish(true);
    }.bind(this);

    var onCancel = function () {
        this.onFinish(false);

        this.plugin.setFinished(RewardedAdsManager.REWARDED, true);
    }.bind(this);

    this.plugin.setPlaying(RewardedAdsManager.REWARDED);
    if (cleverapps.meta.isFocused()) {
        new VIPRewardedWindow(onReward, onCancel);
    } else {
        cleverapps.meta.display({
            focus: "VIPRewardWindow",
            action: function (f) {
                new VIPRewardedWindow(onReward, onCancel);
                cleverapps.meta.onceNoWindowsListener = f;
            }
        });
    }
};

RewardedAdsManager.prototype.createAdOverlay = function (name) {
    cleverapps.audio.mute();
    cleverapps.CountDownManager.mute();
    this.lastPlay[name] = Date.now();

    var action = function () {
        var overlay;

        var onFinish = cleverapps.once(function (data) {
            var cancel = data && data.cancel;

            if (this.plugin.adIsRunning(name)) {
                if (name === RewardedAdsManager.REWARDED && !cancel) {
                    this.plugin.rewardAndFinish();
                } else {
                    this.plugin.setFinished(name);
                    this.plugin._onCancel();
                }
            } else {
                this.removeAdOverlay(overlay);
            }
        }.bind(this));

        overlay = new RewardedAdOverlay(onFinish);
        this.rewardOverlay = overlay;
        cleverapps.scenes.getRunningScene().addChild(this.rewardOverlay);
    }.bind(this);

    if (cleverapps.meta.isFocused()) {
        action();
    } else {
        cleverapps.meta.display({
            focus: "ShowReward",
            action: function (f) {
                action();
                RewardedAdsManager.onceOnRemoveOverlay = f;
            }
        });
    }
};

RewardedAdsManager.prototype.adIsRunning = function () {
    if (!this.isEnabled()) {
        return false;
    }

    var running = false;
    RewardedAdsManager.ACTIVE_ADS.forEach(function (name) {
        if (this.plugin.adIsRunning(name)) {
            running = true;
        }
    }.bind(this));
    return running;
};

RewardedAdsManager.prototype.onReward = function () {
    if (!cleverapps.paymentsHistory.isVIP()) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.ADS.FINISH + "_" + RewardedAdsManager.REWARDED);
        cleverapps.playSession.set(cleverapps.EVENTS.STATS.REWARDED_DAU, true);
        cleverapps.playSession.inc(cleverapps.EVENTS.ADS.SESSION_FINISH + "_" + RewardedAdsManager.REWARDED);
        if (cleverapps.user.getDaysSinceRegistration() < 1) {
            cleverapps.playSession.inc(cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_WATCHED_15_ADS);
            if (cleverapps.playSession.get(cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_WATCHED_15_ADS) >= 15) {
                cleverapps.playSession.set(cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_WATCHED_15_ADS, -1000);
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_WATCHED_15_ADS);
            }
            cleverapps.playSession.inc(cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_ADS_COUNT);
        }

        cleverapps.abTest.allLogEvent(cleverapps.EVENTS.ADS.FINISH);
    }

    this.baseWatchCounter++;
    if (this.baseWatchCounter % 5 === 0) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.TARGET_FOR_BUYING.BASE_WATCH_5);
    }

    if (this.baseWatchCounter % 3 === 0) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.TARGET_FOR_BUYING.BASE_PLAY_WATCH);
    }

    this.totalWatchCounter++;
    if (cleverapps.EVENTS.TARGET_FOR_BUYING["WATCHED_" + this.totalWatchCounter]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.TARGET_FOR_BUYING["WATCHED_" + this.totalWatchCounter]);
    }
    cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.AD_WATCH_COUNTER, this.totalWatchCounter);

    cleverapps.eventBus.trigger("taskEvent", DailyTasks.WATCH_ADS);
    cleverapps.thinkingData && cleverapps.thinkingData.logWatchAds();

    var impressionCost = cleverapps.paymentsHistory.isVIP() ? undefined : this.plugin.getECPM();
    var fakeImpression = this.plugin.isFakeImpression();

    if (impressionCost && !fakeImpression) {
        impressionCost /= 1000;
        if (cleverapps.user.getDaysSinceRegistration() < 1) {
            cleverapps.playSession.inc(cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_ADS_VALUE, impressionCost);
        }

        cleverapps.abTest.allLogEvent(cleverapps.EVENTS.ADS.COST, {
            value: impressionCost
        });

        if (cleverapps.adjust) {
            cleverapps.adjust.logAdRevenue(impressionCost, this.plugin.code);
        }

        if (cleverapps.googleAnalytics) {
            cleverapps.googleAnalytics.logAdRevenue(RewardedAdsManager.REWARDED, impressionCost);
        }
    }

    if (!this.lastAdStarter && cleverapps.config.debugMode) {
        throw "No ad starter placement defined!";
    }

    if (!fakeImpression) {
        cleverapps.eventLogger.logEvent(this.lastAdStarter, { value: (impressionCost || 0) });
    }

    this.onFinish(true);
};

RewardedAdsManager.prototype.getLastAdStarter = function (adLimit) {
    adLimit = adLimit || "none";
    if ([AdsLimits.TYPES.ENERGY_SHORT, AdsLimits.TYPES.ENERGY_1_SHORT, AdsLimits.TYPES.ENERGY_2_SHORT].includes(adLimit)) {
        adLimit = "lives_short";
    }
    if ([AdsLimits.TYPES.ENERGY, AdsLimits.TYPES.ENERGY_1, AdsLimits.TYPES.ENERGY_2].includes(adLimit)) {
        adLimit = AdsLimits.TYPES.LIVES;
    }
    var expeditionPrefix = cleverapps.travelBook.isExpedition() ? cleverapps.travelBook.getCurrentPage().id + "_" : "";

    return cleverapps.EVENTS.ADS.TYPE + expeditionPrefix + adLimit;
};

RewardedAdsManager.prototype.onFinish = function (success) {
    var onRewardListener = this.onRewardListener || function () {};
    var onCancelListener = this.onCancelListener || function () {};

    this.onRewardListener = undefined;
    this.onCancelListener = undefined;

    if (success) {
        onRewardListener();
    } else {
        onCancelListener();
    }
};

RewardedAdsManager.prototype.playRewarded = function (adLimit, onSuccessCallback, onCancelCallback) {
    onSuccessCallback = onSuccessCallback || function () {};
    onCancelCallback = onCancelCallback || function () {};

    if (this.adIsRunning()) {
        onCancelCallback();

        cleverapps.notification.create("AdsRunning");
        return;
    }

    this.lastAdStarter = this.getLastAdStarter(adLimit);

    if (cleverapps.paymentsHistory.isVIP()) {
        this.onRewardListener = onSuccessCallback;
        this.onCancelListener = onCancelCallback;

        this.createVipRewarded();
        return;
    }

    if (!this.isAvailable(RewardedAdsManager.REWARDED)) {
        onCancelCallback();

        cleverapps.notification.create("NoAdsFound");
        return;
    }

    cleverapps.whenGameActive(function () {
        this.onRewardListener = onSuccessCallback;
        this.onCancelListener = onCancelCallback;

        this.createAdOverlay(RewardedAdsManager.REWARDED);
        this.plugin.playAd(RewardedAdsManager.REWARDED);
        this.cacheNextAd(RewardedAdsManager.REWARDED);
    }.bind(this));
};

RewardedAdsManager.prototype.canShowInterstitial = function () {
    if (!this.isEnabled() || RewardedAdsManager.ACTIVE_ADS.indexOf(RewardedAdsManager.INTERSTITIAL) === -1
        || !this.isAvailable(RewardedAdsManager.INTERSTITIAL)) {
        return false;
    }

    var availableBrackets = [cleverapps.PaymentsHistory.BRACKET_NONE];
    if (!availableBrackets.includes(cleverapps.paymentsHistory.classify())) {
        return false;
    }

    var lastInterstitial = this.lastPlay[RewardedAdsManager.INTERSTITIAL] || 0;
    if (lastInterstitial + cleverapps.parseInterval(RewardedAdsManager.INTERSTITIAL_INTERVAL) > Date.now()) {
        return false;
    }

    return true;
};

RewardedAdsManager.prototype.showInterstitial = function (callback) {
    callback = callback || function () {};

    if (this.adIsRunning()) {
        cleverapps.notification.create("AdsRunning");
        callback();
        return;
    }

    if (!this.canShowInterstitial()) {
        callback();
        return;
    }

    cleverapps.whenGameActive(function () {
        this.onCancelListener = callback;
        this.onRewardListener = callback;

        this.createAdOverlay(RewardedAdsManager.INTERSTITIAL);
        this.plugin.playAd(RewardedAdsManager.INTERSTITIAL);
        this.cacheNextAd(RewardedAdsManager.INTERSTITIAL);
    }.bind(this));
};

RewardedAdsManager.prototype.showPreroll = function (callback) {
    callback = cleverapps.once(callback);

    if (this.prerollPlayed) {
        callback();
        return;
    }
    this.prerollPlayed = true;

    var prerollPlayed = cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.PREROLL_PLAYED) || 0;
    if (cleverapps.config.editorMode || cleverapps.config.adminMode || cleverapps.config.wysiwygMode || cleverapps.loadedSnapshot
        || prerollPlayed + cleverapps.parseInterval(RewardedAdsManager.PREROLL_TIMEOUT) > Date.now()) {
        callback();
        return;
    }

    var watchHandler = this.on("changeVideoState:" + RewardedAdsManager.INTERSTITIAL, function (state) {
        if (state === AdsPlugin.VIDEO_STATE.PLAY) {
            cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.PREROLL_PLAYED, Date.now());
            watchHandler.clear();
        }
    });
    var callbackAndClear = cleverapps.once(function () {
        watchHandler.clear();
        callback();
    });

    cleverapps.rewardedAdsManager.loadAndPlay({
        type: RewardedAdsManager.INTERSTITIAL,
        callback: callbackAndClear,
        onCancelCallback: callbackAndClear
    });
};

RewardedAdsManager.prototype.getNoAdsTime = function (name) {
    return Date.now() - this.lastAvailable[name];
};

RewardedAdsManager.prototype.showBanner = function (callback) {
    if (!cleverapps.platform.isConnected(Platform.ADS)) {
        callback(cleverapps.CODE_FAILED);
        return;
    }

    if (this.plugin && this.plugin.showBanner) {
        this.plugin.showBanner(callback);
    }
};

RewardedAdsManager.prototype.hideBanner = function (callback) {
    if (!cleverapps.platform.isConnected(Platform.ADS)) {
        callback(cleverapps.CODE_FAILED);
        return;
    }

    if (this.plugin && this.plugin.hideBanner) {
        this.plugin.hideBanner(callback);
    }
};

RewardedAdsManager.REWARDED = "rewarded";
RewardedAdsManager.INTERSTITIAL = "interstitial";

RewardedAdsManager.ACTIVE_ADS = [RewardedAdsManager.REWARDED];

RewardedAdsManager.INTERSTITIAL_AVAILABLE = { level: 1.5 };

RewardedAdsManager.INTERSTITIAL_INTERVAL = "15 minutes";
RewardedAdsManager.PREROLL_TIMEOUT = "10 minutes";

RewardedAdsManager.REWARDED_NOADS_TIMEOUT = "3 minutes";

RewardedAdsManager.initialize = function () {
    if (cleverapps.platform.oneOf(TestPlatform)) {
        if (cleverapps.platform.getUserID() === TestSocial.USERS.beta.id) {
            RewardedAdsManager.ACTIVE_ADS = [RewardedAdsManager.REWARDED, RewardedAdsManager.INTERSTITIAL];
        } else if (cleverapps.platform.getUserID() === TestSocial.USERS.gamma.id) {
            RewardedAdsManager.ACTIVE_ADS = [];
        } else {
            RewardedAdsManager.ACTIVE_ADS = [RewardedAdsManager.REWARDED];
        }

        return;
    }

    if (cleverapps.platform.oneOf(VKPlatform, OKPlatform, GDCom, Yandex, Plinga, Crazy, MSStart)
        || cleverapps.platform.oneOf(Instant) && cleverapps.platform.info.isMobile && cleverapps.config.type !== "merge") {
        RewardedAdsManager.ACTIVE_ADS = [RewardedAdsManager.REWARDED, RewardedAdsManager.INTERSTITIAL];
    }

    if (cleverapps.platform.oneOf(GDCom)) {
        RewardedAdsManager.INTERSTITIAL_AVAILABLE = { level: 0 };
    }
};

RewardedAdsManager.eCPM = {
    Instant: 2.06,
    WEB_OK: 50 / cleverapps.EXCHANGE_RATES.RUB,
    MOBILE_OK: 58 / cleverapps.EXCHANGE_RATES.RUB,
    GDCom: 0.85 / cleverapps.EXCHANGE_RATES.EUR,
    Plinga: 0.85 / cleverapps.EXCHANGE_RATES.EUR,
    VK: 75 / cleverapps.EXCHANGE_RATES.RUB,
    Yandex: 68 / cleverapps.EXCHANGE_RATES.RUB,
    YandexApp: 143 / cleverapps.EXCHANGE_RATES.RUB,
    GoogleWeb: 2.66 / cleverapps.EXCHANGE_RATES.SGD,
    MSStart: 2.0,
    Crazy: 2.0,
    Wechat: 50 / cleverapps.EXCHANGE_RATES.CNY
};
