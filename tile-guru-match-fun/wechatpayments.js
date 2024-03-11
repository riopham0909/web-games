/**
 * Created by andrey on 25.10.2023
 */

var WechatPayments = function () {
    RestPayments.call(this);

    console.log("wechat payments");

    for (var i in cleverapps.config.products) {
        var product = cleverapps.config.products[i];

        product.loadedPrice = this.calcLoadedPrice(product.price);

        product.loadedPriceAmount = this.getLoadedPriceAmount(product.loadedPrice);
        product.loadedCurrencyCode = "CNY";

        product.loadedPriceGems = product.loadedPriceAmount * WechatPayments.CNY_GEMS_RATE;
        // product.loadedId = product.id.yandex;
    }
};

WechatPayments.prototype = Object.create(RestPayments.prototype);
WechatPayments.prototype.constructor = WechatPayments;

WechatPayments.prototype._connect = function (callback) {
    callback(cleverapps.platform.info.os === PlatformInfo.OS_IOS ? Platform.STATUS_DISABLED : Platform.STATUS_CONNECTED);
};

WechatPayments.prototype.calcLoadedPrice = function (price) {
    var loadedPrice = Math.floor(price * cleverapps.WECHAT_PAYMENTS_RATE);

    loadedPrice = WechatPayments.getLevelPrice(loadedPrice);

    // if (cleverapps.config.debugMode) {
    //     loadedPrice = Math.max(1, Math.round(price / 3)) + "**";
    // }

    return WechatPayments.CURRENCY + loadedPrice;
};

WechatPayments.prototype.getLoadedPriceAmount = function (loadedPrice) {
    return parseInt(loadedPrice.replace(WechatPayments.CURRENCY, ""));
};

WechatPayments.prototype.purchaseOpen = function (product, callback) {
    var balance;

    var player = new ActionPlayer([
        function (f, reject) {
            this.getBalance(function (response) {
                balance = response.balance || 0;
                f();
            }, reject);
        }.bind(this),

        function (f) {
            if (balance >= product.loadedPriceGems) {
                this.pay(product, callback);
            } else {
                this.requestMidasPayment(balance, product, callback);
            }

            f();
        }.bind(this)
    ]);

    player.onFailure(function () {
        callback(cleverapps.CODE_FAILED);
    });

    player.play();
};

WechatPayments.prototype.requestMidasPayment = function (balance, product, callback) {
    var levelAmount = WechatPayments.getLevelAmount(product.loadedPriceAmount - balance / WechatPayments.CNY_GEMS_RATE);

    console.log("requestMidasPayment - " + levelAmount);

    var success;

    var orientation = cleverapps.platform.getOrientation();
    var player = new ActionPlayer([
        function (f) {
            if (orientation !== "portrait") {
                console.log("Switch to vertical");
                wx.setDeviceOrientation({
                    value: "portrait",
                    success: function () {
                        console.log("Switch to vertical SUCCESS");

                        f();
                    },
                    fail: function (err) {
                        console.log("Switch to vertical FAIL", err);

                        f();
                    }
                });
            } else {
                f();
            }
        },

        function (f) {
            wx.requestMidasPayment({
                mode: "game",
                offerId: "1450100764",
                currencyType: "CNY",
                buyQuantity: levelAmount * WechatPayments.CNY_GEMS_RATE,
                env: cleverapps.config.debugMode ? WechatPayments.ENV_SANDBOX : WechatPayments.ENV_RELEASE,

                success: function (response) {
                    console.log("midas payment success", response);
                    cleverapps.config.debugMode && cleverapps.notification.create("payment - " + JSON.stringify(response));
                    success = true;
                    f();
                },

                fail: function (err) {
                    console.log("midas payment fail", err);
                    cleverapps.config.debugMode && cleverapps.notification.create("payment fail - " + JSON.stringify(err));
                    f();
                }
            });
        },

        function (f) {
            if (cleverapps.platform.getOrientation() !== orientation) {
                console.log("Switch back to horizontal");
                wx.setDeviceOrientation({
                    value: orientation,
                    success: function () {
                        console.log("Switch back to horizontal SUCCESS");

                        f();
                    },
                    fail: function (err) {
                        console.log("Switch back to horizontal FAIL", err);

                        f();
                    }
                });
            } else {
                f();
            }
        },

        function (f) {
            if (success) {
                this.waitBalance(product, callback);
            } else {
                callback(cleverapps.CODE_FAILED);
            }

            f();
        }.bind(this)
    ]);

    player.play();
};

WechatPayments.prototype.stopPurchaseActions = function () {
    RestPayments.prototype.stopPurchaseActions.call(this);

    this.stopWaitBalance();
};

WechatPayments.prototype.stopWaitBalance = function () {
    if (this.balanceChecker) {
        this.balanceChecker.stop();
        delete this.balanceChecker;
    }
};

WechatPayments.prototype.waitBalance = function (product, callback) {
    this.stopWaitBalance();

    this.setCancelTimeout(cleverapps.parseInterval("30 seconds"), callback);

    this.balanceChecker = this.startChecker({
        timeouts: cleverapps.arrayFill(15, "2 seconds"),
        check: function () {
            this.getBalance(function (response) {
                if (this.getPurchaseState() === PaymentsManager.STATE_PURCHASE
                    && response.balance && product.loadedPriceGems <= response.balance) {
                    this.stopWaitBalance();

                    this.pay(product, callback);
                }
            }.bind(this));
        }.bind(this)
    });
};

WechatPayments.prototype.getBalance = function (onSuccess, onFailure) {
    var path = "/wechat/getbalance/" + encodeURIComponent(cleverapps.platform.getUserID());
    cleverapps.RestClient.post(path, {}, function (response) {
        console.log("getbalance - " + JSON.stringify(response));

        if (response.errcode || response.balance === undefined) {
            cleverapps.config.debugMode && cleverapps.notification.create("balance - " + JSON.stringify(response));
            onFailure && onFailure();
        } else {
            onSuccess(response);
        }
    }, function (response) {
        console.log("getbalance fail", response);
        onFailure && onFailure();
    });
};

WechatPayments.prototype.pay = function (product, callback) {
    var path = "/wechat/pay/" + encodeURIComponent(cleverapps.platform.getUserID());
    var data = {
        product: product
    };

    cleverapps.RestClient.post(path, data, function (response) {
        console.log("pay", response);

        product.paymentId = response.paymentId;

        var code = response.errcode === 0 && response.paymentId ? cleverapps.CODE_SUCCEED : cleverapps.CODE_FAILED;

        if (code !== cleverapps.CODE_SUCCEED && cleverapps.config.debugMode) {
            cleverapps.notification.create("pay - " + JSON.stringify(response));
        }

        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.PAY_RESULT, {
            platform: "wechat",
            pr_id: product.itemId,
            name_of_the_package: product.title,
            pay_amount: product.loadedPriceAmount,
            currency: product.loadedCurrencyCode,
            result: code === cleverapps.CODE_SUCCEED
        });

        callback(code, product);
    }, function (response) {
        console.log("pay fail", response);
        callback(cleverapps.CODE_FAILED);
    });
};

WechatPayments.getLevelPrice = function (price) {
    var prices = WechatPayments.PRICE_LEVELS;

    for (var i = 1; i < prices.length; i++) {
        if (price < prices[i]) {
            return prices[i - 1];
        }
    }

    return prices[prices.length - 1];
};

WechatPayments.getLevelAmount = function (amount) {
    var prices = WechatPayments.PRICE_LEVELS;

    return prices.find(function (price) {
        return price >= amount;
    }) || prices[prices.length - 1];
};

WechatPayments.isAppropriate = function () {
    return cleverapps.platform.oneOf(Wechat);
};

WechatPayments.ENV_RELEASE = 0;
WechatPayments.ENV_SANDBOX = 1;

WechatPayments.CURRENCY = "￥";

WechatPayments.CNY_GEMS_RATE = 10;

WechatPayments.PRICE_LEVELS = [
    1, 3, 6, 8, 12, 18, 25, 30, 40, 45, 50, 60, 68, 73, 78, 88, 98, 108,
    118, 128, 148, 168, 188, 198, 328, 648
];
