/**
 * Created by Andrey Popov on 5/5/21
 */

var XsollaPayments = function () {
    RestPayments.call(this);

    this.withSdk = true;

    this.sandbox = Boolean(cleverapps.config.debugMode);

    for (var itemId in cleverapps.config.products) {
        var product = cleverapps.config.products[itemId];
        product.loadedId = itemId;
    }

    this.route = cleverapps.platform.oneOf(Crazy) ? "/crazypayments/" : "/xsollapayments/";
};

XsollaPayments.prototype = Object.create(RestPayments.prototype);
XsollaPayments.prototype.constructor = XsollaPayments;

XsollaPayments.prototype._connect = function (callback) {
    cleverapps.loadSdk("//cdn.xsolla.net/embed/paystation/1.2.7/widget.min.js", {
        onSuccess: function () {
            callback(Platform.STATUS_CONNECTED);
        },
        onFailure: function () {
            callback(Platform.STATUS_DISCONNECTED);
        }
    });
};

XsollaPayments.prototype.stopPurchaseActions = function () {
    RestPayments.prototype.stopPurchaseActions.apply(this, arguments);

    this.stopStatusChecker();
};

XsollaPayments.prototype.purchase = function (product, callback) {
    this.getAuthToken(function (code, auth) {
        if (code !== cleverapps.CODE_SUCCEED) {
            callback(code);
            return;
        }

        this.getPaymentToken(auth, product, function (code, order) {
            if (code !== cleverapps.CODE_SUCCEED) {
                callback(code);
                return;
            }

            this.openWidget(product, order, callback);
        }.bind(this));
    }.bind(this));
};

XsollaPayments.prototype.getPaymentToken = function (auth, product, callback) {
    if (XsollaPayments.DEBUG_IDS.includes(cleverapps.platform.getUserID()) && product.price < 10) {
        product.loadedId = product.itemId = "testProduct";
    }

    // https://developers.xsolla.com/ru/doc/pay-station/how-to/how-to-get-payment-token/
    cleverapps.RestClient.post("https://store.xsolla.com/api/v2/project/" + auth.project + "/payment/item/" + product.itemId, {
        quantity: 1,
        sandbox: this.sandbox
    }, function (response) {
        console.log("payment token", response);

        if (!response || !response.token) {
            console.log("getPaymentToken emoty token");
            callback(cleverapps.CODE_FAILED);
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.XSOLLA.INIT_WIDGET_FAILED);
            return;
        }

        callback(cleverapps.CODE_SUCCEED, response.token);
    }, function (error) {
        callback(cleverapps.CODE_CANCELLED);
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.XSOLLA.INIT_WIDGET_FAILED);
        console.log("Failed to create Xsolla order: " + error);
    }, {
        authorization: "Bearer " + auth.token
    });
};

XsollaPayments.prototype.getAuthToken = function (callback) {
    var data = {
        userid: cleverapps.platform.getUserID(),
        name: cleverapps.info.getValue("name")
    };

    var auth = cleverapps.platform.dataLoader.load(SimpleDataLoader.TYPES.XSOLLA2_PAYMENTS_AUTH);

    if (auth && JSON.stringify(auth.data) === JSON.stringify(data)
        && auth.created + XsollaPayments.AUTH_TOKEN_LIFETIME > Date.now() && auth.created < Date.now()) {
        console.log("auth cache", auth);

        callback(cleverapps.CODE_SUCCEED, auth);
        return;
    }

    cleverapps.RestClient.post(
        this.route + "auth/",
        data,
        function (response) {
            console.log("auth response", JSON.stringify(response.error || response.auth || response));

            if (response.error || !response.auth) {
                console.log("getAuthToken error - " + (response.error || "empty auth"));
                callback(cleverapps.CODE_CANCELLED);
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.XSOLLA.INIT_WIDGET_FAILED);
                return;
            }

            var auth = response.auth;
            auth.data = data;
            auth.created = Date.now();

            cleverapps.platform.dataLoader.save(SimpleDataLoader.TYPES.XSOLLA2_PAYMENTS_AUTH, auth);

            callback(cleverapps.CODE_SUCCEED, auth);
        },
        function (error) {
            console.log("getAuthToken error", error);
            callback(cleverapps.CODE_CANCELLED);
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.XSOLLA.INIT_WIDGET_FAILED);
        }
    );
};

XsollaPayments.prototype.openWidget = function (product, paymentToken, callback) {
    var result = false;

    XPayStationWidget.init({
        lightbox: {
            spinner: "round",
            width: null,
            height: null
        },
        sandbox: this.sandbox,
        access_token: paymentToken
    });

    var onOpen = cleverapps.once(function () {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.XSOLLA.OPEN_WIDGET);
    });
    XPayStationWidget.on(XPayStationWidget.eventTypes.OPEN, onOpen);

    XPayStationWidget.open();

    XPayStationWidget.on(XPayStationWidget.eventTypes.STATUS, function (event, data) {
        var paymentInfo = data && data.paymentInfo;
        if (!paymentInfo) {
            return;
        }

        if (cleverapps.config.debugMode) {
            console.log("Xsolla payment event: " + JSON.stringify(paymentInfo));
        }

        var paymentStatus = paymentInfo.status;
        var paymentId = paymentInfo.invoice;

        if (["invoice", "done", "delivering"].includes(paymentStatus) && paymentId) {
            product.paymentId = product.paymentId || paymentId;
        }

        if (paymentStatus === "done") {
            result = true;
        } else if (paymentStatus === "troubled") {
            callback(cleverapps.CODE_CANCELLED, product);
        }
    });

    var onClose = cleverapps.once(function () {
        XPayStationWidget.off(XPayStationWidget.eventTypes.OPEN);
        XPayStationWidget.off(XPayStationWidget.eventTypes.CLOSE);
        XPayStationWidget.off(XPayStationWidget.eventTypes.STATUS);

        if (!result || !product.paymentId) {
            callback(cleverapps.CODE_CANCELLED);
            return;
        }

        if (this.getPurchaseState() === PaymentsManager.STATE_PURCHASE) {
            this.startStatusChecker(product, callback);
        }
    }.bind(this));
    XPayStationWidget.on(XPayStationWidget.eventTypes.CLOSE, onClose);
};

XsollaPayments.prototype.stopStatusChecker = function () {
    if (this.statusChecker) {
        this.statusChecker.stop();
        delete this.statusChecker;
    }
};

XsollaPayments.prototype.startStatusChecker = function (product, callback) {
    this.stopStatusChecker();

    var running;

    var check = function () {
        if (running) {
            return;
        }
        running = true;
        var onFinish = cleverapps.waitNoMore(10000, cleverapps.once(function () {
            running = false;
        }));

        console.log("statusCheck: " + product.paymentId);
        cleverapps.RestClient.get(this.route + "get/" + product.paymentId, {}, function (response) {
            onFinish();

            if (response.error || !response.payment) {
                console.log(response.error || "no payment");
                return;
            }

            var payment = response.payment;

            console.log("statusCheck success: " + JSON.stringify(payment));

            if (["paid", "done"].includes(payment.status)) {
                product.loadedPrice = payment.textPrice || product.loadedPrice;
                callback(cleverapps.CODE_SUCCEED, product);
            }
        });
    }.bind(this);

    this.statusChecker = this.startChecker({
        check: check
    });
};

XsollaPayments.isAppropriate = function () {
    return cleverapps.platform.oneOf(MSStart, CleverApps, Crazy);
};

XsollaPayments.AUTH_TOKEN_LIFETIME = cleverapps.parseInterval("1 hour");

if (cleverapps.config.debugMode) {
    XsollaPayments.AUTH_TOKEN_LIFETIME = cleverapps.parseInterval("1 second");
}

XsollaPayments.DEBUG_IDS = [
    "e913873c-3848-4155-a881-edb315e30692", // andrey k tripeaks,
    "6e83dcbf-29fd-40f9-abed-83cf80d6194a", // andrey k mergecraft
    "54de395d-d6e0-4f83-8ed9-7b68e4de19e0", // andrey k riddles
    "c869c9f1-1729-4247-882e-fc1e0c37fbc6", // andrey k mergecraft staging
    "5fb5e261-5781-4730-ac0e-b5984c8e89d3" // alexandrina mergecraft staging
];
