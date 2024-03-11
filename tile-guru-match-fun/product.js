/**
 * Created by mac on 7/19/18
 */

var Product = function (data) {
    Object.assign(this, data);

    this.title = Messages.getLocalized(this.title);
    this.description = Messages.getLocalized(this.description);

    if (cleverapps.flags.videoAdsMainMonetization) {
        this.videoProduct = ["gold500", "gold1800", "gold3800", "gold6000", "gold25000", "sweetPack", "jamPack", "tastyPack", "honeyPack", "epicPack"].indexOf(this.key) !== -1;
    }

    if (this.videoProduct) {
        this.prepareVideoProduct();
    }

    if (this.id) {
        var lang = cleverapps.settings.language;
        var langPath = (lang + "/");
        var basePath = langPath + (cleverapps.config.debugMode === 0 ? "production/" : "");

        var filename = "res/fbproducts/" + basePath + this.id.facebook;

        this.id.facebook = cleverapps.platform.getExternalUrl(filename);
    }
};

Product.SearchProductId = function (id) {
    for (var key in cleverapps.config.products) {
        var product = cleverapps.config.products[key];
        if (product.loadedId === id) {
            return key;
        }
    }
    return id;
};

Product.FormatTimePeriod = function (period, fullText) {
    if (typeof period === "object") {
        return period;
    }

    if (typeof period === "string") {
        period = cleverapps.parseInterval(period);
    }

    var secondsInHour = 60 * 60;
    var secondsInDay = secondsInHour * 24;

    var seconds = period / 1000;
    var minutes, days;

    if (fullText) {
        var codes = {
            days: {
                1: "1 day",
                2: "2 day",
                3: "3 day",
                5: "5 day",
                7: "7 day",
                9: "9 day",
                10: "10 day"
            },

            minutes: {
                15: "15 minutes",
                10: "10 minutes",
                30: "30 minutes",
                45: "45 minutes",
                60: "OneHour",
                120: "TwoHours",
                180: "ThreeHours",
                360: "6 hours",
                720: "12 hours"
            }
        };

        minutes = Math.round(seconds / 60);
        days = Math.floor(seconds / secondsInDay);

        return {
            title: "TimePeriod." + (codes.days[days] || codes.minutes[minutes]),
            time: period
        };
    }

    days = Math.floor(seconds / secondsInDay);
    seconds %= secondsInDay;

    var hours = Math.floor(seconds / secondsInHour);
    seconds %= secondsInHour;

    minutes = Math.round(seconds / 60);

    var toReplace = {
        day: days,
        hr: hours,
        min: minutes
    };

    var code = "minutesString";
    if (days > 0 && hours > 0) {
        code = "dayTimeString";
    } else if (days > 0) {
        code = "daysString";
    } else if (hours > 0 && minutes > 0) {
        code = "hoursMinutesString";
    } else if (hours > 0) {
        code = "hoursString";
    }

    return {
        title: Messages.get(code, toReplace),
        time: period
    };
};

Product.AddUpRewards = function (rewards, total) {
    total = total || {};

    for (var type in rewards) {
        var reward = rewards[type];
        if (type === "unlimitedLives") {
            total[type] = total[type] ? total[type] + cleverapps.parseInterval(reward) : cleverapps.parseInterval(reward);
        } else if (type === "boosters") {
            if (!total.boosters) {
                total.boosters = {};
            }
            for (var boost in reward) {
                total.boosters[boost] = total.boosters[boost] ? total.boosters[boost] + parseInt(reward[boost]) : parseInt(reward[boost]);
            }
        } else {
            total[type] = total[type] ? total[type] + parseInt(reward) : parseInt(reward);
        }
    }

    return total;
};

Product.UnlimitedToHours = function (data) {
    if (data.unlimitedLives) {
        var hours = Math.round(data.unlimitedLives / 1000 / 60 / 60);
        data.unlimitedLives = {
            title: Messages.get("AMOUNT_HOURS", { amount: hours }),
            interval: hours + " hours"
        };
    }
    return data;
};

Product.ReplaceIconCodes = function (currentPrice) {
    var codes = {
        "**": "OK",
        "&&": "YAN",
        "}}": "HOP"
    };

    for (var code in codes) {
        currentPrice = currentPrice.replace(code, " " + codes[code]);
    }

    return currentPrice;
};

Product.prototype.prepareVideoProduct = function () {
    var coef = 1;

    if (this.reward) {
        coef = 1 / 4;
        ["hard", "soft", "energy", "wands"].forEach(function (key) {
            if (this.reward[key]) {
                this.reward[key] = Math.ceil(this.reward[key] * coef / 10) * 10;
            }
        }, this);

        if (this.reward.boosters) {
            Object.keys(this.reward.boosters).forEach(function (key) {
                this.reward.boosters[key] = Math.ceil(this.reward.boosters[key] * coef);
            }, this);
        }
    }

    this.videoPrice = Math.ceil(this.price * coef * 2) * 5;
};

Product.prototype.getCurrentPrice = function () {
    return this.loadedPrice ? this.loadedPrice : (Product.CURRENCY + " " + this.price);
};

Product.prototype.showBoughtMessage = function (reward) {
    if (!this.image) {
        return;
    }

    var message = this.boughtMessage || "Product.YouBought";
    var toReplace = this.boughtMessageParams || {};
    toReplace.moves = this.moves;

    if (reward && (reward.hard || reward.soft)) {
        toReplace.coins = reward.hard || reward.soft;
    }

    var imageUrl = cleverapps.platform.getExternalUrl(this.image);
    cc.loader.load(imageUrl, function (status) {
        var image = undefined;
        if (!status) {
            image = new cc.Sprite(imageUrl);
        }
        cleverapps.notification.create(message, {
            toReplace: toReplace,
            image: image
        });
    });
};

Product.prototype.onBuyed = function (options) {
    options = options || {};
    var restore = options.restore;
    var restoreLogic = this.restoreLogic || {};

    var reward = restore && (restoreLogic.GetRestoreReward && restoreLogic.GetRestoreReward(this) || this.restoreReward)
        || PeriodicSaleLogic.addProductBonus(this) || this.reward;

    this.showBoughtMessage(reward);
    if (reward && !options.noRewardWindow) { // addMoves, subscription, growthFund
        if (!cleverapps.meta.isFocused()) {
            cleverapps.meta.display({
                focus: (restore ? "restore" : "purchase") + "RewardWindow",
                action: function (f) {
                    RewardWindow.createPurchaseWindow(reward);
                    cleverapps.meta.onceNoWindowsListener = f;
                }
            });
        } else {
            RewardWindow.createPurchaseWindow(reward);
        }
    }

    if (cleverapps.userClan && cleverapps.userClan.id !== undefined && this.clanGift && !this.videoProduct) {
        cleverapps.clans.sendGift({ purchase: this.itemId });
    }

    cleverapps.user.incProgressCompare(50);

    cleverapps.audio.playSound(bundles.main.urls.shop_buy_effect);
};

Product.prototype.logBuyItem = function () {
    var window = cleverapps.windows.findWindow(ShopWindow);

    var properties = {
        store_type: window && window.getTitle(),
        item_name: this.constructor === Product ? this.title : undefined,
        item_price: this.price,
        cost_type: this.currency || this.loadedCurrencyCode
    };

    var rewardId = Object.keys(this.reward || {})[0];
    if (rewardId) {
        properties.item_id = rewardId;
        properties.item_num = this.reward[rewardId];
    }

    if (this.itemId.startsWith("buyEnergy")) {
        properties.item_id = "energy";
        properties.item_num = this.reward;
    }

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.BUY_ITEM, properties);
};

Product.prototype.buy = function (f, options) {
    cleverapps.paymentsManager.purchase(this, f, options);
};

Product.Create = function (id) {
    id = Product.SearchProductId(id);
    var data = cleverapps.config.products[id] || VirtualProducts[id];

    if (!data) {
        return;
    }

    data = cleverapps.clone(data, true);
    data.itemId = id;
    if (cleverapps.config.products[id]) {
        return new Product(data);
    }
    return new VirtualProduct(data);
};

Product.WAIT_NO_MORE = 4000;
Product.CURRENCY = "$";
Product.CURRENCY_CODE = "USD";

Product.PENDING_PURCHASE = "pendingPurchase";
Product.OVERLAY_CANCEL = "overlayCancel";
Product.TIMEOUT_CANCEL = "timeoutCancel";
Product.PURCHASE_PROCESSING = "purchaseProcessing";
Product.RESTORE_CHECK = "restoreCheck";

Product.CURRENCY_SIGNS = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    RUB: "₽"
};
