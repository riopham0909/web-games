/**
 * Created by andrey on 19.05.17.
 */

if (typeof cc === "undefined") {
    var cleverapps = require("../../utils");
}

cleverapps.PaymentsHistory = function () {
    this.ids = [];
    this.time = [];
    this.price = [];

    this.load();
    this.trim();

    this.onAddPaymentListeners = {};
};

cleverapps.PaymentsHistory.prototype.trim = function () {
    if (this.ids.length > cleverapps.PaymentsHistory.STORAGE_LIMIT) {
        this.ids = this.ids.slice(-cleverapps.PaymentsHistory.STORAGE_LIMIT);
    }
    if (this.time.length > this.ids.length) {
        this.time = this.time.slice(-this.ids.length);
    }
    if (this.price.length > this.ids.length) {
        this.price = this.price.slice(-this.ids.length);
    }
};

cleverapps.PaymentsHistory.prototype.addPayment = function (product) {
    this.ids.push(product.itemId);
    this.time.push(Date.now());
    this.price.push(product.price);

    this.save();

    cleverapps.values(this.onAddPaymentListeners).forEach(cleverapps.callFunc);
};

cleverapps.PaymentsHistory.prototype.isPayer = function () {
    return this.ids.length > 0;
};

cleverapps.PaymentsHistory.prototype.getLastPaymentTime = function () {
    return this.time.length > 0 ? this.time[this.time.length - 1] : undefined;
};

cleverapps.PaymentsHistory.prototype.load = function (stored) {
    var save = stored || cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.PAYMENTS_HISTORY);

    if (save && save.payments || Array.isArray(save)) {
        this.migrateOldFormat(save);
        this.migratePrice();
        this.save();
        return;
    }

    if (save && save.ids) {
        this.ids = save.ids;
        this.time = save.time.map(cleverapps.expandTime);

        if (save.price) {
            this.price = save.price.map(function (price) {
                return price / 100;
            });
        } else {
            this.migratePrice();
        }
    }
};

cleverapps.PaymentsHistory.prototype.migrateOldFormat = function (save) {
    var payments = Array.isArray(save) ? save : save.payments;

    var toProductId = function (payment) {
        var id = payment && payment.productId && payment.productId.facebook;
        id = id && id.substring(id.lastIndexOf("/") + 1);
        return id && Product.SearchProductId(id);
    };

    payments = payments.filter(toProductId);

    this.time = payments.map(function (payment) {
        return payment.time;
    });

    this.ids = payments.map(toProductId);
};

cleverapps.PaymentsHistory.prototype.migratePrice = function () {
    this.price = this.ids.map(function (id) {
        var product = cleverapps.config.products[id] || Products.DEPRECATED[id];
        return product && product.price || 0;
    });
};

cleverapps.PaymentsHistory.prototype.getInfo = function () {
    return {
        time: this.time.map(cleverapps.compactTime),
        ids: this.ids,
        price: this.price.map(function (price) {
            return Math.floor(price * 100);
        })
    };
};

cleverapps.PaymentsHistory.prototype.updateInfo = function (serverData) {
    if (!serverData) {
        return;
    }

    this.load(serverData);
    this.save(true);
};

cleverapps.PaymentsHistory.prototype.save = function (fromServer) {
    this.trim();

    cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.PAYMENTS_HISTORY, this.getInfo());

    if (!fromServer) {
        cleverapps.synchronizer.addUpdateTask("paymentshistory");
    }
};

cleverapps.PaymentsHistory.BRACKET_UNDECIDED = -1;
cleverapps.PaymentsHistory.BRACKET_NONE = 0;
cleverapps.PaymentsHistory.BRACKET_WEAK = 1;
cleverapps.PaymentsHistory.BRACKET_MEDIUM = 2;
cleverapps.PaymentsHistory.BRACKET_WHALE = 3;
cleverapps.PaymentsHistory.BRACKET_BIGWHALE = 4;

cleverapps.PaymentsHistory.BRACKETS = [2.99, 9.99, 29.99, 99.99];

cleverapps.PaymentsHistory.STORAGE_LIMIT = 25;

cleverapps.PaymentsHistory.VIP_THRESHOLD = 29.99;

cleverapps.PaymentsHistory.UNDECIDED_LEVEL_THRESHOLD = 6.5;

cleverapps.PaymentsHistory.initialize = function () {
    if (cleverapps.platform.oneOf(Wechat)) {
        cleverapps.PaymentsHistory.UNDECIDED_LEVEL_THRESHOLD = 0;
    }
};

cleverapps.PaymentsHistory.prototype.isVIP = function () {
    return this.getVIPStatus().status;
};

cleverapps.PaymentsHistory.prototype.getVIPStatus = function () {
    if (cleverapps.flags.videoAdsMainMonetization) {
        return {
            status: false
        };
    }

    if (cleverapps.subscription && cleverapps.subscription.isActive()) {
        return {
            status: true,
            end: Date.now() + cleverapps.parseInterval("1 day")
        };
    }

    var MONTH = cleverapps.parseInterval("1 month");

    var MONTH_AGO = Date.now() - MONTH;

    var i = this.ids.length - 1;
    var j = this.ids.length - 1;

    var lastPeriodTotal = 0;

    for (; i >= 0 && this.time[i] + MONTH >= MONTH_AGO; i--) {
        lastPeriodTotal += this.price[i];

        while (this.time[i] + MONTH < this.time[j]) {
            lastPeriodTotal -= this.price[j];
            j--;
        }

        if (this.time[j] < MONTH_AGO) {
            break;
        }

        if (lastPeriodTotal >= cleverapps.PaymentsHistory.VIP_THRESHOLD) {
            var dateEnd = this.time[j] + MONTH;
            return {
                status: true,
                end: dateEnd
            };
        }
    }

    return {
        status: false
    };
};

cleverapps.PaymentsHistory.prototype.calculateMinimalVipSum = function () {
    var vipProduct = Product.Create("gold6000");
    if (vipProduct.loadedPriceAmount && vipProduct.loadedCurrencyCode) {
        return Math.ceil(vipProduct.loadedPriceAmount + 0.01) + " " + vipProduct.loadedCurrencyCode;
    }

    var vipProductPrice = Math.ceil(vipProduct.price + 0.01);
    var vipProductTextPrice = cleverapps.payments.calcLoadedPrice
        ? cleverapps.payments.calcLoadedPrice(vipProductPrice)
        : Product.CURRENCY + " " + vipProductPrice;
    return Product.ReplaceIconCodes(vipProductTextPrice);
};

cleverapps.PaymentsHistory.prototype.classify = function () {
    var lastPeriodTotal = 0;
    var MONTH_AGO = Date.now() - cleverapps.parseInterval("1 month");
    for (var i = this.ids.length - 1; i >= 0; i--) {
        if (this.time[i] < MONTH_AGO) {
            break;
        }

        lastPeriodTotal += this.price[i];
    }

    if (cleverapps.subscription && cleverapps.subscription.isActive()) {
        lastPeriodTotal += 9.99;
    }

    var bracket = 0;
    for (; bracket < cleverapps.PaymentsHistory.BRACKETS.length; bracket++) {
        if (lastPeriodTotal < cleverapps.PaymentsHistory.BRACKETS[bracket] + 0.001) {
            break;
        }
    }

    if (bracket === cleverapps.PaymentsHistory.BRACKET_NONE
        && cleverapps.user.getFloatLevel() < cleverapps.PaymentsHistory.UNDECIDED_LEVEL_THRESHOLD
        && cleverapps.flags.highMonetization) {
        return cleverapps.PaymentsHistory.BRACKET_UNDECIDED;
    }

    return bracket;
};

if (typeof cc === "undefined") {
    module.exports = cleverapps.PaymentsHistory;
}