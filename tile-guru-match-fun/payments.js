/**
 * Created by andrey on 05.10.2020.
 */

var Payments = function () {
    Connectable.call(this);
};

Payments.prototype = Object.create(Connectable.prototype);
Payments.prototype.constructor = Payments;

Payments.prototype.clear = function () {

};

Payments.prototype.freeFromLoginToPay = function () {
    if (this.oneOf(XsollaPayments) && cleverapps.platform.oneOf(Crazy)) {
        return false;
    }

    return this.oneOf(
        MicrosoftPayments,
        PlingaPayments,
        WebViewPayments,
        YandexPayments,
        YooKassaPayments,
        TestPayments,
        XsollaPayments
    );
};

Payments.prototype.requiresEmailToPay = function () {
    return this.oneOf(YooKassaPayments);
};

Payments.prototype.setPurchaseState = function (purchaseState) {
    if (this.purchaseState !== purchaseState) {
        this.purchaseState = purchaseState;
    }
};

Payments.prototype.getPurchaseState = function () {
    return this.purchaseState;
};

Payments.prototype.restore = function (callback) {
    callback(cleverapps.CODE_FAILED);
};

Payments.prototype.consume = function () {
};

Payments.prototype.purchase = function (product, callback) {
    callback(cleverapps.CODE_FAILED, product);
};

Payments.prototype.validate = function (purchase, callback) {
    callback(cleverapps.CODE_SUCCEED, purchase);
};

Payments.prototype.isProductExists = function (key) {
    return cleverapps.config.products[key];
};

Payments.prototype.getSubscriptionStatus = function (options, callback) {
    var source = Subscription.calcSource();
    if (["android", "ios", "macos"].includes(source) && Object.keys(options.tokens).length === 0) {
        return;
    }

    if (cleverapps.platform.haveTmpId() && ["facebook", "web_ok", "mobile_ok"].includes(source)) {
        return;
    }

    var params = { source: source, tokens: options.tokens };
    cleverapps.RestClient.post("/subscriptions/get/" + cleverapps.platform.getUserID(), params, callback);
};

Payments.prototype.loadProducts = function (callback) {
    if (cleverapps.platform.isConnected(Platform.PAYMENTS)) {
        this._loadProducts(callback);
    } else {
        callback(cleverapps.CODE_FAILED);
    }
};

Payments.prototype._loadProducts = function (callback) {
    callback(cleverapps.CODE_SUCCEED);
};

Payments.prototype.loadSubscriptions = function (callback) {
    callback(cleverapps.CODE_SUCCEED);
};

Payments.prototype.loadSubscriptionsTokens = function (callback) {
    callback(cleverapps.CODE_SUCCEED);
};

Payments.prototype.isAvailable = function () {
    return cleverapps.platform.isConnected(Platform.PAYMENTS);
};

Payments.prototype.isRestoreAvailable = function () {
    return this.isAvailable();
};

Payments.prototype.oneOf = function (arr) {
    return cleverapps.oneOf(this, Array.isArray(arr) ? arr : Array.prototype.slice.call(arguments));
};

Payments.prototype.notifyActive = function () {

};

Payments.CONSUMED_STORAGE_LIMIT = 30;
