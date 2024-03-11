/**
 * Created by andrey on 15.05.2023
 */

var YooKassaPayments = function () {
    RestPayments.call(this);

    for (var itemId in cleverapps.config.products) {
        var product = cleverapps.config.products[itemId];

        product.loadedPrice = this.calcLoadedPrice(product.price);
        product.loadedPriceAmount = parseInt(product.loadedPrice);
        product.loadedCurrencyCode = "RUB";
        product.loadedId = itemId;
    }

    cleverapps.playSession.set(cleverapps.EVENTS.STATS.YOOKASSA.DAU, true);

    cleverapps.platform.nativeEventListeners.YooKassaPayments = this.onNativeEvent.bind(this);
};

YooKassaPayments.prototype = Object.create(RestPayments.prototype);
YooKassaPayments.prototype.constructor = YooKassaPayments;

YooKassaPayments.prototype.calcLoadedPrice = function (price) {
    var loadedPrice = Math.floor(price * cleverapps.RUB_YOOKASSA_RATE) + " RUB";

    if (cleverapps.config.debugMode || WebViewPayments.DEBUG_IDFA.includes(cleverapps.platform.device.idfa) || XsollaPayments.DEBUG_IDS.includes(cleverapps.platform.getUserID())) {
        loadedPrice = Math.max(1, Math.round(price / 3)) + " RUB";
    }

    return loadedPrice;
};

YooKassaPayments.prototype.purchase = function (product, callback) {
    if (product.type === "subscription") {
        callback(cleverapps.CODE_FAILED);
        return;
    }

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.YOOKASSA.OPEN);

    var idfa = cleverapps.platform.device.idfa;
    var email = cleverapps.info.getValue("email");
    var merchantCustomerId = undefined;
    if (!cleverapps.platform.haveTmpId() || idfa && !idfa.startsWith("0000")) {
        merchantCustomerId = cleverapps.platform.getUserID() + "_" + idfa + "_" + email;
    }

    var purchase = {
        itemId: product.loadedId,
        price: product.loadedPriceAmount,
        loadedPriceAmount: product.loadedPriceAmount,
        email: email,
        merchantCustomerId: merchantCustomerId
    };

    var data = {
        userid: cleverapps.platform.getUserID(),
        source: cleverapps.platform.source,
        purchase: purchase
    };

    console.log("YooKassaPayments.create", JSON.stringify(data));

    var onError = function (error) {
        console.log("purchase error", error);
        callback(cleverapps.CODE_FAILED);
    };

    cleverapps.RestClient.post("/yookassapayments/create", data, function (response) {
        console.log("YooKassaPayments.create response", JSON.stringify(response.error || response.payment || response));

        if (response.error && response.parameter === "receipt.customer.email") {
            cleverapps.notification.create("PurchaseCancelled.InvalidEmail");
            cleverapps.info.setKeyValue("email", "");
        }

        if (response.error || !response.payment) {
            onError(response.error || "empty payment");
            return;
        }

        response = response.payment;
        product.paymentId = response.paymentId;
        product.confirmation_type = response.confirmation && response.confirmation.type;
        product.confirmation_url = response.confirmation && response.confirmation.confirmation_url;
        product.confirmation_token = response.confirmation && response.confirmation.confirmation_token;

        console.log("YooKassaPayments.create Success: " + JSON.stringify(response));

        if (["waiting_for_capture", "succeeded"].includes(response.status)) {
            callback(cleverapps.CODE_SUCCEED, product);
        } else if (["canceled"].includes(response.status)) {
            callback(cleverapps.CODE_CANCELLED, product);
        } else if (response.status === "pending" && product.paymentId) {
            this.openWidget(product, callback);
        } else {
            onError();
        }
    }.bind(this), onError);
};

YooKassaPayments.prototype.getFinishUrl = function (product) {
    var finishUrl = (cleverapps.isLocalhost() ? "" : cleverapps.config.deployment) + cleverapps.config.restApiURL
        + "/yookassapayments/finish/" + encodeURIComponent(cleverapps.platform.getUserID());

    var params = new URLSearchParams();
    if (cleverapps.platform.info.isNative) {
        var appLink = "cleverapps://" + cleverapps.config.name;
        if (cleverapps.config.debugMode) {
            appLink += "staging";
        }
        params.set("app_link", appLink);
    }

    if (product && product.paymentId) {
        params.set("paymentId", product.paymentId);
    }

    if (params.size > 0) {
        finishUrl += "?" + params.toString();
    }

    return finishUrl;
};

YooKassaPayments.prototype.getWidgetUrl = function (product) {
    var base = location.href.substring(0, location.href.lastIndexOf("/") + 1);
    if (cleverapps.platform.info.isNative) {
        base = cleverapps.config.staticUrl || (cleverapps.config.deployment + (cleverapps.config.debugMode ? "/publish/html5-staging/" : "/publish/html5/"));
    }

    return base + "cleverapps/res/yookassa-widget.html"
        + "?confirmation_token=" + product.confirmation_token
        + "&payment_id=" + product.paymentId
        + "&finish_url=" + encodeURIComponent(this.getFinishUrl(product))
        + "&modal=" + (cleverapps.platform.oneOf(CleverApps, TestPlatform));
};

YooKassaPayments.prototype.openWidget = function (product, callback) {
    this.onWidgetClosedListener = function () {
        console.log("YooKassaPayments.onWidgetClosedListener - " + this.getPurchaseState());
        if (this.getPurchaseState() === PaymentsManager.STATE_PURCHASE) {
            this.startStatusChecker(product, callback);
        }
    }.bind(this);

    this.setNotifyActiveListener(this.onWidgetClosed.bind(this));

    var widgetUrl = this.getWidgetUrl(product);
    if (cleverapps.platform.oneOf(AndroidPlatform)) {
        cleverapps.platform.callNative("YooKassaPlugin.openWidget", { widgetUrl: widgetUrl });
        return;
    }

    var frame = document.createElement("iframe");
    frame.style.height = "100%";
    frame.style.width = "100%";
    frame.style.zIndex = "1000000000";
    frame.style.border = "none";
    frame.src = widgetUrl;
    frame.id = "YooKassaFrame";
    frame.allow = "payment";
    document.body.appendChild(frame);

    var closeHandler = window.addEventListener("message", function (event) {
        if (event.data.action === "close") {
            window.removeEventListener("message", closeHandler);
            if (frame.parentNode) {
                frame.parentNode.removeChild(frame);
            }
            this.onWidgetClosed();
        }
    }.bind(this));
};

YooKassaPayments.prototype.onWidgetClosed = function () {
    if (this.onWidgetClosedListener) {
        this.onWidgetClosedListener();
        delete this.onWidgetClosedListener;
    }
};

YooKassaPayments.prototype.stopStatusChecker = function () {
    if (this.statusChecker) {
        this.statusChecker.stop();
        delete this.statusChecker;
    }
};

YooKassaPayments.prototype.startStatusChecker = function (product, callback) {
    this.stopStatusChecker();

    var waitPurchaseStateEndTime = Date.now() + YooKassaPayments.WAIT_PURCHASE_STATE_TIMEOUT;

    var check = function () {
        console.log("YooKassaPayments.statusCheck: " + product.paymentId);
        cleverapps.RestClient.get("/yookassapayments/get/" + product.paymentId, {}, function (response) {
            if (response.error || !response.payment) {
                console.log(response.error || "no payment");
                return;
            }

            var payment = response.payment;

            console.log("YooKassaPayments.statusCheck success: " + JSON.stringify(payment));

            if (["waiting_for_capture", "succeeded"].includes(payment.status)) {
                callback(cleverapps.CODE_SUCCEED, product);
            } else if (["canceled"].includes(payment.status) || payment.purchaseState === "cancel") {
                callback(cleverapps.CODE_CANCELLED);
            } else if (["initialize_error", "fail"].includes(payment.purchaseState)) {
                callback(cleverapps.CODE_FAILED);
            } else if (Date.now() > waitPurchaseStateEndTime && !["finished", "success"].includes(payment.purchaseState)) {
                console.log("YooKassaPayments.statusCheck wait purchaseState timeout");
                callback(cleverapps.CODE_FAILED);
            }
        });
    };

    this.statusChecker = this.startChecker({
        check: check,
        timeouts: cleverapps.arrayFill(5, "1 seconds").concat(RestPayments.TIMEOUTS)
    });
    this.setCancelTimeout(YooKassaPayments.WAIT_SUCCEEDED_TIMEOUT, callback);
};

YooKassaPayments.prototype.stopPurchaseActions = function () {
    RestPayments.prototype.stopPurchaseActions.apply(this, arguments);

    this.stopStatusChecker();
    delete this.onWidgetClosedListener;
};

YooKassaPayments.prototype.onNativeEvent = function (name) {
    switch (name) {
        case "widgetClosed":
            this.onWidgetClosed();
            break;
    }
};

YooKassaPayments.isAppropriate = function () {
    return cleverapps.paymentsCountry.isInitialized() && cleverapps.paymentsCountry.isRussia()
        && (cleverapps.platform.oneOf(AndroidPlatform)
        || cleverapps.platform.oneOf(CleverApps));
};

YooKassaPayments.WAIT_PURCHASE_STATE_TIMEOUT = cleverapps.parseInterval("2 seconds");
YooKassaPayments.WAIT_SUCCEEDED_TIMEOUT = cleverapps.parseInterval("60 seconds");
