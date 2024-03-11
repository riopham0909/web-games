/**
 * Created by r4zi4l on 03.08.2021
 */

var AdsLimits = function () {
    cleverapps.EventEmitter.call(this);

    AdsLimits.initialize();

    this.load();

    this.dirty = false;
    this.update();

    cleverapps.rewardedAdsManager.on("changeLoaderState:" + RewardedAdsManager.REWARDED, this.notifyUpdated.bind(this));
    new cleverapps.Interval(this.update.bind(this), cleverapps.parseInterval(AdsLimits.CHECK_INTERVAL));
};

AdsLimits.prototype = Object.create(cleverapps.EventEmitter.prototype);
AdsLimits.prototype.constructor = AdsLimits;

AdsLimits.prototype.save = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.ADS_LIMITS_DATA, this.data);
};

AdsLimits.prototype.load = function () {
    this.data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.ADS_LIMITS_DATA) || {};

    // cleanup: remove obsolete data
    var types = cleverapps.values(AdsLimits.TYPES);
    Object.keys(this.data).forEach(function (type) {
        if (types.indexOf(type) === -1) {
            delete this.data[type];
        }
    }, this);
};

AdsLimits.prototype._updateType = function (type) {
    var limit = this.getLimit(type);
    var data = this.data[type];

    if (data && data.watchCount > 0 && data.lastRefresh + limit.timeout <= Date.now()) {
        delete this.data[type];

        this.save();
        this.dirty = true;
    }
};

AdsLimits.prototype.notifyUpdated = function () {
    this.trigger("update");
};

AdsLimits.prototype.update = function () {
    for (var key in AdsLimits.TYPES) {
        this._updateType(AdsLimits.TYPES[key]);
    }
    if (this.dirty) {
        this.dirty = false;
        this.notifyUpdated();
    }
};

AdsLimits.prototype.state = function (type) {
    this._updateType(type);
    var limit = this.getLimit(type);

    if (limit.disabled) {
        return AdsLimits.STATE_DISABLED;
    }

    if (!cleverapps.user.checkAvailable(limit.available)) {
        return AdsLimits.STATE_UNAVAILABLE;
    }

    if (this.getLimitLeftCount(type) === 0) {
        return AdsLimits.STATE_LIMITED;
    }

    if (!cleverapps.rewardedAdsManager.isAvailable(RewardedAdsManager.REWARDED)) {
        return AdsLimits.STATE_NOADS;
    }

    return AdsLimits.STATE_READY;
};

AdsLimits.prototype.getLimit = function (type) {
    var data = AdsLimits.LIMITS[type] || { disabled: true };

    if (data && data.nonpayer) {
        var status = cleverapps.paymentsHistory.classify();

        if (status === cleverapps.PaymentsHistory.BRACKET_NONE) {
            return data.nonpayer;
        } if (status === cleverapps.PaymentsHistory.BRACKET_UNDECIDED) {
            return data.undecided;
        }

        return data.payer;
    }

    return data;
};

AdsLimits.prototype.getLimitLeftTime = function (type) {
    var data = this.data[type] || {
        lastRefresh: 0
    };
    var limit = this.getLimit(type);
    return Math.max(0, data.lastRefresh + limit.timeout - Date.now());
};

AdsLimits.prototype.getWatchCount = function (type) {
    return this.data[type] && this.data[type].watchCount || 0;
};

AdsLimits.prototype.getLimitLeftCount = function (type) {
    var limit = this.getLimit(type);

    if (limit.limit === AdsLimits.UNLIMITED) {
        return 1;
    }

    var data = this.data[type] || {
        watchCount: 0
    };
    return Math.max(0, limit.limit - data.watchCount);
};

AdsLimits.prototype.getLimitLevel = function (type) {
    var limit = this.getLimit(type);

    return cleverapps.humanReadableNumber({ floatLevel: limit.available.level });
};

AdsLimits.prototype.watch = function (type) {
    if (this.data[type]) {
        this.data[type].watchCount++;
    } else {
        this.data[type] = {
            watchCount: 1,
            lastRefresh: Date.now()
        };
    }

    this.save();
    cleverapps.timeouts.setTimeout(this.update.bind(this), this.getLimit(type).timeout);

    this.notifyUpdated();
};

AdsLimits.prototype.reset = function (type) {
    delete this.data[type];
    this.save();
};

AdsLimits.STATE_UNAVAILABLE = 0;
AdsLimits.STATE_LIMITED = 1;
AdsLimits.STATE_NOADS = 2;
AdsLimits.STATE_READY = 3;
AdsLimits.STATE_DISABLED = 4;

AdsLimits.CHECK_INTERVAL = "1 minute";

AdsLimits.UNLIMITED = "unlimited";

AdsLimits.LIMITS = {};
AdsLimits.TYPES = {
    HARD: "hard",
    WORKER: "worker",
    LIVES: "lives",
    ENERGY_SHORT: "lives_short",
    BARREL: "barrel",
    SPEEDUP: "speedup",
    SPECIAL_OFFER: "special",
    PIXEL: "pixel",
    OPEN_CHEST: "chest",
    BOOSTERS_BEFORE: "before",
    FLYING_HINT: "hint",
    FLYING_STAR: "star",
    FLYING_BOOSTER: "combo",
    FLYING_DISCOVER: "discover",
    FLYING_MOVES: "flying_moves",
    FLYING_HARD_SOFT: "flying_gold",
    TOOLBAR: "toolbar",
    POINTS_SPECIAL_OFFER: "special_points",
    ANIMALS_SPECIAL_OFFER: "special_animals",
    BANK: "bank",
    FREEX2: "freex2",
    PRODUCT: "product",
    CINEMA: "cinema",
    PROLONGATION: "extend",
    CHOICE: "choice",
    ENERGY: "energy",
    ENERGY_2: "energy_2",
    ENERGY_2_SHORT: "energy_short_2",
    ENERGY_1: "energy_1",
    ENERGY_1_SHORT: "energy_short_1",
    ENERGY_3: "energy_3",
    ENERGY_3_SHORT: "energy_short_3",
    BOOSTER_1: "booster_1",
    BOOSTER_2: "booster_2",
    BOOSTER_3: "booster_3"
};

AdsLimits.initialize = function () {
    AdsLimits.LIMITS = {};

    AdsLimits.LIMITS[AdsLimits.TYPES.HARD] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "1 hour" : "12 hours"),
            limit: 2
        },
        undecided: {
            disabled: true
        },
        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.LIVES] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "10 minutes" : "6 hours"),
            limit: 3
        },
        undecided: {
            disabled: true
        },
        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.BOOSTERS_BEFORE] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "30 minutes" : "1 day"),
            limit: 3
        },
        undecided: {
            disabled: true
        },
        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.FLYING_HINT] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode || cleverapps.flags.videoAdsMainMonetization ? "5 minutes" : "15 minutes"),
            limit: 1,
            available: {
                types: ["board"]
            }
        },
        undecided: {
            disabled: true
        },
        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.FLYING_STAR] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "5 minutes" : "1 hours"),
            limit: 1,
            available: {
                meta: [Metha.SIMPLE]
            }
        },
        undecided: {
            disabled: true
        },
        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.FLYING_BOOSTER] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode || cleverapps.flags.videoAdsMainMonetization ? "5 minutes" : "15 minutes"),
            limit: 1,
            available: {
                level: 0.67,
                types: ["match3"]
            }
        },
        undecided: {
            disabled: true
        },
        payer: {
            disabled: true
        }

    };

    AdsLimits.LIMITS[AdsLimits.TYPES.FLYING_DISCOVER] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode || cleverapps.flags.videoAdsMainMonetization ? "5 minutes" : "15 minutes"),
            limit: 1,
            available: {
                types: ["differences"]
            }
        },
        undecided: {
            disabled: true
        },
        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.FLYING_MOVES] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "5 minutes" : "1 hour"),
            limit: 1,
            available: {
                level: 3,
                types: ["match3", "solitaire"]
            }
        },
        undecided: {
            disabled: true
        },
        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.FLYING_HARD_SOFT] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "5 minutes" : "1 hour"),
            limit: 4,
            available: { level: 2.5 }
        },
        undecided: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "1 hour" : "22 hours"),
            limit: 4,
            available: { level: 2.5 }
        },
        payer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "1 hour" : "22 hours"),
            limit: 4,
            available: { level: 2.5 }
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.TOOLBAR] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "5 minutes" : "3 hour"),
            limit: 10,
            available: { level: 2.5 }
        },
        undecided: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "5 minutes" : "22 hours"),
            limit: 1,
            available: { level: 2.5 }
        },
        payer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "5 minutes" : "22 hours"),
            limit: 1,
            available: { level: 2.5 }
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.PROLONGATION] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "1 minute" : "10 minutes"),
            limit: 3
        },
        undecided: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "10 minute" : "22 hours"),
            limit: 1,
            available: {
                level: 2
            }
        },
        payer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "10 minute" : "22 hours"),
            limit: 1,
            available: {
                level: 2
            }
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.WORKER] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "1 hour" : "24 hours"),
            limit: 3,
            available: {
                level: 6,
                types: ["merge"]
            }
        },

        undecided: {
            disabled: true
        },
        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.ENERGY] = AdsLimits.LIMITS[AdsLimits.TYPES.ENERGY_1] = AdsLimits.LIMITS[AdsLimits.TYPES.ENERGY_2] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "10 minutes" : "1 hour"),
            limit: 1,
            available: { level: 7, types: ["merge"] }
        },

        undecided: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "10 minutes" : "3 hour"),
            limit: 1,
            available: { level: 7, types: ["merge"] }
        },

        payer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "10 minutes" : "22 hours"),
            limit: 1,
            available: { level: 7, types: ["merge"] }
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.ENERGY_SHORT] = AdsLimits.LIMITS[AdsLimits.TYPES.ENERGY_1_SHORT] = AdsLimits.LIMITS[AdsLimits.TYPES.ENERGY_2_SHORT] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "30 minutes" : "3 hour"),
            limit: 10,
            available: {
                level: 8,
                types: ["merge"]
            }
        },
        undecided: {
            disabled: true
        },
        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.BARREL] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "3 minute" : "1 hour"),
            limit: 1,
            available: { level: 6, types: ["merge"] }
        },
        undecided: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "3 minute" : "5 hour"),
            limit: 1,
            available: { level: 6, types: ["merge"] }
        },
        payer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "3 minute" : "22 hours"),
            limit: 1,
            available: { level: 6, types: ["merge"] }
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.SPEEDUP] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode || cleverapps.flags.videoAdsMainMonetization ? "1 minute" : "30 minutes"),
            limit: 2,
            available: { types: ["merge"] }
        },
        undecided: {
            disabled: true
        },
        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.SPECIAL_OFFER] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode || cleverapps.flags.videoAdsMainMonetization ? "1 minute" : "10 minutes"),
            limit: 1,
            available: { level: 7, types: ["merge"] }
        },

        undecided: {
            disabled: true
        },

        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.POINTS_SPECIAL_OFFER] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode || cleverapps.flags.videoAdsMainMonetization ? "5 minutes" : "30 minutes"),
            limit: 1
        },

        undecided: {
            disabled: true
        },

        payer: {
            disabled: true
        }

    };

    AdsLimits.LIMITS[AdsLimits.TYPES.ANIMALS_SPECIAL_OFFER] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode || cleverapps.flags.videoAdsMainMonetization ? "5 minutes" : "30 minutes"),
            limit: 1
        },

        undecided: {
            disabled: true
        },

        payer: {
            disabled: true
        }

    };

    AdsLimits.LIMITS[AdsLimits.TYPES.PIXEL] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode || cleverapps.flags.videoAdsMainMonetization ? "1 minute" : "5 minutes"),
            limit: 1,
            available: { level: 6, types: ["merge"] }
        },

        undecided: {
            disabled: true
        },

        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.OPEN_CHEST] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode || cleverapps.flags.videoAdsMainMonetization ? "1 minute" : "5 minutes"),
            limit: 1,
            available: { level: 6, types: ["merge"] }
        },

        undecided: {
            disabled: true
        },

        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.BANK] = {
        nonpayer: {
            timeout: 0,
            limit: AdsLimits.UNLIMITED,
            available: { types: ["merge"] }
        },

        undecided: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "1 minute" : "3 hour"),
            limit: 1,
            available: { types: ["merge"] }
        },

        payer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "1 hour" : "22 hours"),
            limit: 1,
            available: { types: ["merge"] }
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.BOOSTER_1] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "1 minutes" : "5 minutes"),
            limit: 1
        },

        undecided: {
            disabled: true
        },

        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.BOOSTER_2] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "2 minutes" : "10 minutes"),
            limit: 1
        },

        undecided: {
            disabled: true
        },

        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.BOOSTER_3] = {
        nonpayer: {
            timeout: cleverapps.parseInterval(cleverapps.config.debugMode ? "3 minutes" : "30 minutes"),
            limit: 1
        },

        undecided: {
            disabled: true
        },

        payer: {
            disabled: true
        }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.FREEX2] = {
        timeout: 0,
        limit: AdsLimits.UNLIMITED,
        available: { types: ["merge"] }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.PRODUCT] = {
        timeout: 0,
        limit: AdsLimits.UNLIMITED
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.CINEMA] = {
        timeout: 0,
        limit: AdsLimits.UNLIMITED,
        available: { types: ["merge"] }
    };

    AdsLimits.LIMITS[AdsLimits.TYPES.CHOICE] = {
        timeout: 0,
        limit: AdsLimits.UNLIMITED,
        available: { types: ["merge"] }
    };
};
