/**
 * Created by andrey on 23.12.2022
 */

var RestPayments = function () {
    Payments.call(this);
};

RestPayments.prototype = Object.create(Payments.prototype);
RestPayments.prototype.constructor = RestPayments;

RestPayments.prototype.purchase = function (product, callback) {
    this.startPurchaseChecker(product, callback);

    this.purchaseOpen(product, callback);
};

RestPayments.prototype.purchaseOpen = function (product, callback) {
    callback(cleverapps.CODE_FAILED, product);
};

RestPayments.prototype.restore = function (callback) {
    var path = "/payments/restore/" + cleverapps.platform.source + "/" + encodeURIComponent(cleverapps.platform.getUserID());
    var data = {
        version: 2,
        yookassa: cleverapps.payments instanceof YooKassaPayments
    };

    cleverapps.RestClient.post(path, data, function (payment) {
        var productId = payment && payment.productId;
        var purchase = productId && Product.Create(productId);

        if (purchase) {
            purchase.paymentId = payment.paymentId;
            purchase.productId = productId;
        }

        callback(purchase ? cleverapps.CODE_SUCCEED : cleverapps.CODE_FAILED, purchase);
    }, function () {
        callback(cleverapps.CODE_FAILED);
    });
};

RestPayments.prototype.validate = function (purchase, callback) {
    this.startPurchaseChecker(purchase, callback);

    this.setCancelTimeout(cleverapps.parseInterval("3 minutes"), callback);
};

RestPayments.prototype.consume = function (purchase) {
    this.startChecker({
        method: "consume",
        product: purchase,
        timeouts: RestPayments.CONSUME_TIMEOUTS
    });
};

RestPayments.prototype.stopPurchaseChecker = function () {
    if (this.purchaseChecker) {
        this.purchaseChecker.stop();
        delete this.purchaseChecker;
    }
};

RestPayments.prototype.startPurchaseChecker = function (product, callback, options) {
    this.stopPurchaseChecker();

    options = options || {};
    this.purchaseChecker = this.startChecker(Object.assign({}, options, {
        method: "validate",
        product: product,
        onSuccess: function () {
            callback(cleverapps.CODE_SUCCEED, product);
        }
    }));
};

RestPayments.prototype.startChecker = function (options) {
    options = options || {};

    var timeout;
    var onSuccess = cleverapps.once(options.onSuccess);
    var timeouts = options.timeouts || RestPayments.TIMEOUTS;
    timeouts = timeouts.slice().reverse();

    var clearTimeout = function () {
        if (timeout) {
            cleverapps.timeouts.clearTimeout(timeout);
            timeout = undefined;
        }
    };

    var check = options.check || function () {
        var path = "/payments/" + options.method + "/" + cleverapps.platform.source + "/" + encodeURIComponent(cleverapps.platform.getUserID());
        var product = options.product;

        var data = {
            type: product.type,
            restore: product.restore,
            paymentId: !RestPayments.IsTmpPaymentId(product.paymentId) ? product.paymentId : undefined,
            productId: product.loadedId,
            itemId: product.itemId,
            version: 3,
            yookassa: cleverapps.payments instanceof YooKassaPayments
        };

        if (product.openTime) {
            data.openInterval = Math.ceil((Date.now() - product.openTime + 1) / 60000);
        }

        cleverapps.RestClient.post(path, data, function (response) {
            // console.log("postWithTimeouts response", response);
            if (typeof response === "object" && response.paymentId) {
                if (!product.paymentId || RestPayments.IsTmpPaymentId(product.paymentId)) {
                    product.paymentId = response.paymentId;
                }
                response = "ok";
            }
            if (response === "ok") {
                onSuccess();
                checker.stop();
            }
        });
    };

    var runOnce = function () {
        check();

        clearTimeout();

        if (timeouts.length > 0) {
            timeout = cleverapps.timeouts.setTimeout(runOnce, cleverapps.parseInterval(timeouts.pop()));
        }
    };

    runOnce();

    var checker = { stop: clearTimeout };
    return checker;
};

RestPayments.prototype.notifyActive = function () {
    if (this.notifyActiveListener) {
        console.log("Payments notifyActive");
        this.notifyActiveListener();
        delete this.notifyActiveListener;
    }
};

RestPayments.IsTmpPaymentId = function (paymentId) {
    return (paymentId + "").startsWith("tmp");
};

RestPayments.prototype.setNotifyActiveListener = function (notifyActiveListener) {
    this.notifyActiveListener = notifyActiveListener;
};

RestPayments.prototype.setPurchaseState = function (purchaseState) {
    if (this.purchaseState !== purchaseState) {
        this.purchaseState = purchaseState;
        this.stopPurchaseActions();
    }
};

RestPayments.prototype.stopPurchaseActions = function () {
    this.stopPurchaseChecker();
    this.clearCancelTimeout();

    delete this.notifyActiveListener;
};

RestPayments.prototype.setCancelTimeout = function (timeout, callback) {
    this.clearCancelTimeout();

    this.cancelTimeout = cleverapps.timeouts.setTimeout(function () {
        console.log("Payment timeout cancel");
        callback(cleverapps.CODE_CANCELLED);
    }, timeout);
};

RestPayments.prototype.clearCancelTimeout = function () {
    cleverapps.timeouts.clearTimeout(this.cancelTimeout);
    delete this.cancelTimeout;
};

RestPayments.TIMEOUTS = [
    "1 second", "1 second", "3 seconds"
].concat(cleverapps.arrayFill(12, "5 seconds")).concat([
    "10 seconds", "10 seconds", "10 seconds",
    "20 seconds", "20 seconds", "20 seconds",
    "1 minute", "1 minute", "3 minutes", "5 minutes", "5 minutes"
]);

RestPayments.CONSUME_TIMEOUTS = [
    "5 seconds"
].concat(cleverapps.arrayFill(6, "10 seconds")).concat([
    "20 seconds", "20 seconds", "20 seconds",
    "1 minute", "1 minute", "3 minutes", "5 minutes", "5 minutes"
]);
