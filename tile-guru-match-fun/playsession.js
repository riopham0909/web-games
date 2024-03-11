/**
 * Created by mac on 3/14/18
 */

// TODO: avg level per day

var PlaySession = function () {
    this.load();

    this.onEndSessionListeners = [
        PlaySession.RewardedReporter,
        PlaySession.BannerAdReporter,
        PlaySession.DailyTasksReporter,
        PlaySession.HelpByAttemptsReporter,
        PlaySession.SettingsReporter,
        PlaySession.CupsReporter,
        PlaySession.MiniGameReporter,
        PlaySession.MissionReporter,
        PlaySession.BonusWorldReporter,
        PlaySession.GrowthFundReporter,
        PlaySession.ExpeditionReporter,
        PlaySession.DebugReporter,
        PlaySession.ClansReporter,
        PlaySession.UnitsReporter,
        PlaySession.ActiveTimeReporter,
        PlaySession.AbtestReporter,
        PlaySession.LocalPushesReporter,
        PlaySession.YooKassaReporter,
        PlaySession.ContextLostReporter,
        PlaySession.OkSessionReporter
    ];
};

PlaySession.prototype.load = function () {
    var info = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.PLAY_SESSION);
    if (!info) {
        info = {};
    }

    this.data = info;
};

PlaySession.prototype.save = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.PLAY_SESSION, this.data);
};

PlaySession.prototype.endSession = function () {
    this.onEndSessionListeners.forEach(function (listener) {
        listener(this.data);
    }, this);

    this.data = {};
    this.save();
};

PlaySession.prototype.inc = function (key, value, field) {
    if (value === undefined) {
        value = 1;
    }
    var oldValue = this.data[key];
    if (oldValue === undefined) {
        oldValue = 0;
    }

    if (field) {
        oldValue = oldValue || {};
        oldValue[field] = oldValue[field] ? oldValue[field] + value : value;
    }
    var newValue = field ? oldValue : oldValue + value;
    this.set(key, newValue);
};

PlaySession.prototype.set = function (key, value, field) {
    if (field !== undefined) {
        this.data[key] = this.data[key] || {};
        this.data[key][field] = value;
    } else {
        this.data[key] = value;
    }

    this.save();
};

PlaySession.prototype.get = function (key) {
    return this.data[key];
};

PlaySession.prototype.notifyActive = cleverapps.throttle(cleverapps.parseInterval("1 minute"), function () {
    this.inc(cleverapps.EVENTS.STATS.ACTIVE_TIME);

    var expedition = cleverapps.travelBook.getCurrentExpedition();
    if (expedition) {
        this.inc("expActive", 1, expedition.id);
    }
});

PlaySession.AbtestReporter = function (data) {
    var expedition, page, prefix;

    for (expedition in data.expActive) {
        page = TravelBook.findPageById(expedition);
        prefix = page && page.prefix ? "_" + page.prefix : "";
        cleverapps.abTest.allLogEvent(cleverapps.EVENTS.STATS.ACTIVE_TIME + prefix, { value: data.expActive[expedition], expedition: expedition });
        cleverapps.abTest.allLogEvent(cleverapps.EVENTS.STATS.ACTIVE_TIME_DAU + prefix, { expedition: expedition });
    }

    var activeTime = data[cleverapps.EVENTS.STATS.ACTIVE_TIME];
    if (activeTime) {
        cleverapps.abTest.allLogEvent(cleverapps.EVENTS.STATS.ACTIVE_TIME, { value: activeTime, expedition: "main" });
        cleverapps.abTest.allLogEvent(cleverapps.EVENTS.STATS.ACTIVE_TIME_DAU, { expedition: "main" });
    }

    cleverapps.abTest.allLogEvent(cleverapps.EVENTS.STATS.DAU, { expedition: "main" });

    for (expedition in data[cleverapps.EVENTS.EXPEDITION_DAU]) {
        page = TravelBook.findPageById(expedition);
        prefix = page && page.prefix ? "_" + page.prefix : "";
        cleverapps.abTest.allLogEvent(cleverapps.EVENTS.EXPEDITION_DAU + prefix, { expedition: expedition });
    }
};

PlaySession.ActiveTimeReporter = function (data) {
    var activeTime = data[cleverapps.EVENTS.STATS.ACTIVE_TIME] || 0;

    var days = cleverapps.user.getDaysSinceRegistration();
    var group = days <= 3 ? "new" : "old";

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.ACTIVE_TIME + "_" + group, { value: activeTime });
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.ACTIVE_TIME_DAU + "_" + group);
};

PlaySession.SettingsReporter = function () {
    cleverapps.whenAllInitialized(function () {
        var webpSupport = Boolean(cleverapps.config.webpSupport);

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.RESOLUTION + cleverapps.resolution.resolutionName);
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.WEBP + webpSupport);
    });
};

PlaySession.RewardedReporter = function (data) {
    if (data[cleverapps.EVENTS.STATS.REWARDED_AVAILABLE_DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.REWARDED_AVAILABLE_DAU);
    }

    if (data[cleverapps.EVENTS.STATS.REWARDED_NOADS_DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.REWARDED_NOADS_DAU);
    }

    if (data[cleverapps.EVENTS.STATS.REWARDED_ERROR_DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.REWARDED_ERROR_DAU);
    }

    if (data[cleverapps.EVENTS.STATS.REWARDED_DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.REWARDED_DAU);
    }

    if (data[cleverapps.EVENTS.STATS.REWARDED_LOADED_DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.REWARDED_LOADED_DAU);
    }

    if (data[cleverapps.EVENTS.ADS.SESSION_FINISH + "_" + RewardedAdsManager.REWARDED]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.ADS.SESSION_FINISH + "_" + RewardedAdsManager.REWARDED, {
            value: data[cleverapps.EVENTS.ADS.SESSION_FINISH + "_" + RewardedAdsManager.REWARDED]
        });
    }

    if (data[cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_ADS_COUNT] >= 5) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_ADS_COUNT, {
            value: data[cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_ADS_COUNT]
        });

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.DAY_1_ADS_COUNT_DAU);
    }

    if (data[cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_ADS_VALUE]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_ADS_VALUE, {
            value: data[cleverapps.EVENTS.TARGET_FOR_BUYING.DAY_1_ADS_VALUE],
            currency: "USD"
        });
    }

    var vipRewardedWatched = data[cleverapps.EVENTS.STATS.VIP_REWARDED_WATCHED];
    if (vipRewardedWatched) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.VIP_REWARDED_WATCHED, { value: vipRewardedWatched });
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.VIP_REWARDED_DAU);
    }
};

PlaySession.BannerAdReporter = function (data) {
    if (data[cleverapps.EVENTS.STATS.BANNER.DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.BANNER.DAU);
    }

    var impressionEvent = cleverapps.EVENTS.ADS.TYPE + "banner";
    if (data[impressionEvent]) {
        cleverapps.eventLogger.logEvent(impressionEvent, {
            value: data[impressionEvent],
            impressions: data[cleverapps.EVENTS.ADS.TYPE + "banner-impressions"]
        });
    }
};

PlaySession.HelpByAttemptsReporter = function (data) {
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.HELP_BY_ATTEMPTS_DAU);
    var amount = data[cleverapps.EVENTS.HELP_BY_FIVE_ATTEMPTS];
    if (amount >= 1) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.HELP_BY_ATTEMPTS_ONE_AND_MORE);
    }
    if (amount >= 3) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.HELP_BY_ATTEMPTS_THREE_AND_MORE);
    }
    if (amount >= 5) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.HELP_BY_ATTEMPTS_FIVE_AND_MORE);
    }
};

PlaySession.DailyTasksReporter = function (data) {
    if (!cleverapps.dailyTasks || !cleverapps.dailyTasks.isAvailable()) {
        return;
    }

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SESSION_DAILY_TASK_AVAILABLE);

    if (data[cleverapps.EVENTS.SESSION_DAILY_TASK_OPEN_WINDOW]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SESSION_DAILY_TASK_OPEN_WINDOW);
    }

    if (cleverapps.dailyTasks.getFinishedTasks().length > 0) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SESSION_DAILY_TASK_FINISH + "_" + cleverapps.dailyTasks.getFinishedTasks().length);
    }

    var amount = data[cleverapps.EVENTS.SESSION_DAILY_TASK_REWARD];
    if (amount) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.SESSION_DAILY_TASK_REWARD + "_" + amount);
    }
};

PlaySession.CupsReporter = function (data) {
    Object.keys(data).forEach(function (event) {
        if (!data[event]) {
            return;
        }

        if (event.indexOf(cleverapps.EVENTS.CUP_DAU) === 0 || event.indexOf(cleverapps.EVENTS.CUP_PLAYERS) === 0) {
            cleverapps.eventLogger.logEvent(event);
        }
    });
};

PlaySession.MiniGameReporter = function (data) {
    Object.keys(data).forEach(function (event) {
        if (event.indexOf(cleverapps.EVENTS.MINIGAME_FINISH) === 0 && data[event]) {
            cleverapps.eventLogger.logEvent(event + "_dau");
        }
    });
};

PlaySession.MissionReporter = function (data) {
    Object.keys(data).forEach(function (event) {
        if (event.indexOf(cleverapps.EVENTS.MISSION_DAU) === 0 && data[event]) {
            cleverapps.eventLogger.logEvent(event);
        }
    });
};

PlaySession.BonusWorldReporter = function (data) {
    if (data[cleverapps.EVENTS.BONUS_WORLD_DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.BONUS_WORLD_DAU);
    }

    if (data[cleverapps.EVENTS.BONUS_WORLD_LEVEL_DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.BONUS_WORLD_LEVEL_DAU);
    }
};

PlaySession.GrowthFundReporter = function (data) {
    if (data[cleverapps.EVENTS.FUND_DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.FUND_DAU);
    }
};

PlaySession.ExpeditionReporter = function (data) {
    for (var expedition in data[cleverapps.EVENTS.EXPEDITION_DAU]) {
        var page = TravelBook.findPageById(expedition);
        var prefix = page && page.prefix ? "_" + page.prefix : "";
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.EXPEDITION_DAU + prefix);
    }
};

PlaySession.DebugReporter = function (data) {
    for (var value in data[cleverapps.EVENTS.DEBUG.MERGE.UNKNOWN_UNIT_DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.MERGE.UNKNOWN_UNIT_DAU + "-" + value);
    }

    if (data[cleverapps.EVENTS.DEBUG.UNKNOWN_MISSION_DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.UNKNOWN_MISSION_DAU);
    }
};

PlaySession.ClansReporter = function (data) {
    if (data[cleverapps.EVENTS.CLANS_DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.CLANS_DAU);
    }
};

PlaySession.UnitsReporter = function (data) {
    var unitsAmount = data[cleverapps.EVENTS.UNITS_AMOUNT];
    if (unitsAmount) {
        for (var key in unitsAmount.amount) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.UNITS_AMOUNT + "_" + key + "_" + unitsAmount.level, {
                value: unitsAmount.amount[key]
            });
        }

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.UNITS_AMOUNT_DAU + "_" + unitsAmount.level);
    }

    if (data[cleverapps.EVENTS.EARNED_MAGICPLANT]) {
        for (var level in data[cleverapps.EVENTS.EARNED_MAGICPLANT]) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.EARNED_MAGICPLANT + "_" + level, {
                value: data[cleverapps.EVENTS.EARNED_MAGICPLANT][level]
            });
        }
    }

    var events = [cleverapps.EVENTS.EARNED_COINSPLANT, cleverapps.EVENTS.EARNED_RUBIESPLANT,
        cleverapps.EVENTS.EARNED_ENERGYPLANT];

    events.forEach(function (event) {
        var stages = [0, 1, 2];
        for (var stage = 0; stage < stages.length; stage++) {
            if (data[event + "_" + stage]) {
                for (level in data[event + "_" + stage]) {
                    cleverapps.eventLogger.logEvent(event + "_" + stage + "_" + level, {
                        value: data[event + "_" + stage][level]
                    });
                }
            }
        }
    });

    if (data[cleverapps.EVENTS.CASTLE_PRIZES]) {
        for (level in data[cleverapps.EVENTS.CASTLE_PRIZES]) {
            for (var code in data[cleverapps.EVENTS.CASTLE_PRIZES][level]) {
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.CASTLE_PRIZES + "_" + code + "_" + level, {
                    value: data[cleverapps.EVENTS.CASTLE_PRIZES][level][code]
                });
            }
        }
    }

    if (data[cleverapps.EVENTS.PET_RATE]) {
        for (var tier in data[cleverapps.EVENTS.PET_RATE]) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.PET_RATE + tier.replace("clpet", ""), {
                value: data[cleverapps.EVENTS.PET_RATE][tier]
            });
        }
    }
};

PlaySession.LocalPushesReporter = function () {
    if (cleverapps.localPushes.permitted) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.PUSHES.PERMITTED_DAU);
    }
};

PlaySession.YooKassaReporter = function (data) {
    if (data[cleverapps.EVENTS.STATS.YOOKASSA.DAU]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.YOOKASSA.DAU);
    }
};

PlaySession.ContextLostReporter = function (data) {
    var event = cleverapps.EVENTS.STATS.ERROR_CONTEXT_LOST;
    var value = data[event];
    if (value > 0) {
        cleverapps.eventLogger.logEvent(event + "_dau");

        if (value >= 2) {
            cleverapps.eventLogger.logEvent(event + "_2");
        }
    }
};

PlaySession.OkSessionReporter = function (data) {
    if (data[cleverapps.EVENTS.DEBUG.OK_SESSION_EXPIRED]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.OK_SESSION_EXPIRED);
    }

    if (data[cleverapps.EVENTS.DEBUG.OK_SESSION_RESTORED]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.OK_SESSION_RESTORED);
    }
};

PlaySession.ACTIVE_TIME_INTERVAL = "1 minute";
