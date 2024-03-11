/**
 * Created by slava on 4/21/17.
 */

var OKPayments = function () {
    RestPayments.call(this);

    for (var itemId in cleverapps.config.products) {
        var product = cleverapps.config.products[itemId];

        product.loadedPrice = this.calcLoadedPrice(product.price);
        product.loadedId = product.id.ok || itemId;
    }
};

OKPayments.prototype = Object.create(RestPayments.prototype);
OKPayments.prototype.constructor = OKPayments;

OKPayments.prototype.calcLoadedPrice = function (price) {
    var loadedPrice = Math.floor(price * cleverapps.RUB_DISCOUNTED_RATE) + "**";
    
    if (cleverapps.config.debugMode) {
        loadedPrice = Math.max(1, Math.round(price / 3)) + "**";
    }

    return loadedPrice;
};

OKPayments.prototype.purchaseOpen = function (product, callback) {
    var listener = function (result) {
        if (result !== cleverapps.OKSocial.CODE_SUCCEED) {
            callback(result === "cancel" ? cleverapps.CODE_CANCELLED : cleverapps.CODE_FAILED);
            return;
        }

        if (product.type === "subscription" || product.paymentId) {
            callback(cleverapps.CODE_SUCCEED, product);
            return;
        }

        this.startPurchaseChecker(product, callback, {
            timeouts: cleverapps.arrayFill(15, "1 seconds")
        });

        this.setWaitPaymentIdTimeout(5500, product, callback);
    }.bind(this);

    cleverapps.platform.exitFullscreen(function () {
        if (product.type === "subscription") {
            cleverapps.platform.listeners.showPaymentSubscription = listener;
            FAPI.invokeUIMethod("showPaymentSubscription", product.id.ok, parseInt(product.loadedPrice));
        } else {
            cleverapps.platform.listeners.showPayment = listener;
            FAPI.UI.showPayment(
                product.description, 
                product.title, 
                product.itemId, 
                parseInt(product.loadedPrice), 
                null,
                JSON.stringify({ type: cleverapps.platform.oneOf(MobileOK) ? "mobile" : "social" }), 
                "ok", 
                "true"
            );
        }
    });
};

OKPayments.prototype.stopPurchaseActions = function () {
    RestPayments.prototype.stopPurchaseActions.call(this);

    this.clearWaitPaymentIdTimeout();
};

OKPayments.prototype.clearWaitPaymentIdTimeout = function () {
    cleverapps.timeouts.clearTimeout(this.waitPaymentIdTimeout);
    delete this.waitPaymentIdTimeout;
};

OKPayments.prototype.setWaitPaymentIdTimeout = function (timeout, product, callback) {
    this.clearWaitPaymentIdTimeout();

    this.waitPaymentIdTimeout = cleverapps.timeouts.setTimeout(function () {
        product.paymentId = product.paymentId || ("tmp" + cleverapps.platform.getUserID() + "_" + Date.now());
        product.state = 0;

        console.log("create tmp PaymentId", product.paymentId);

        cleverapps.RestClient.post("/payments/add/" + cleverapps.platform.source + "/" + encodeURIComponent(cleverapps.platform.getUserID()), {
            purchase: product,
            price: product.price,
            textPrice: product.getCurrentPrice(),
            itemId: product.itemId
        });

        callback(cleverapps.CODE_SUCCEED, product);
    }, timeout);
};

OKPayments.isAppropriate = function () {
    return cleverapps.platform.oneOf(OKPlatform, MobileOK);
};
