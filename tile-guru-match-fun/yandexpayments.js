/**
 * Created by iamso on 22.07.21
 */

var YandexPayments = function () {
    Payments.call(this);

    for (var i in cleverapps.config.products) {
        var product = cleverapps.config.products[i];

        product.loadedPrice = this.calcLoadedPrice(product.price);
        product.loadedId = product.id.yandex;
    }
};

YandexPayments.prototype = Object.create(Payments.prototype);
YandexPayments.prototype.constructor = YandexPayments;

YandexPayments.prototype.calcLoadedPrice = function (price) {
    return Math.floor(price * cleverapps.RUB_DISCOUNTED_RATE) + (cleverapps.platform.isPlayhop() ? "}}" : "&&");
};

YandexPayments.prototype._loadProducts = function (callback) {
    cleverapps.platform.ysdk.getPayments({ signed: true }).then(function (payments) {
        this.yaPayments = payments;

        if (cleverapps.config.debugMode || cleverapps.Random.nextDouble() < 0.01) {
            this.checkPrices();
        }

        callback(cleverapps.CODE_SUCCEED);
    }.bind(this)).catch(function (err) {
        console.log("Payments unavailable", err);
    });
};

YandexPayments.prototype.checkPrices = function () {
    this.yaPayments.getCatalog().then(function (products) {
        var errors = [];

        this.catalogProductIds = {};

        products.forEach(function (product) {
            this.catalogProductIds[product.id] = true;

            var ourProduct = Product.Create(product.id);
            if (ourProduct && parseInt(ourProduct.loadedPrice) !== parseInt(product.priceValue)) {
                errors.push(product.id);
            }
        }, this);

        if (errors.length > 0) {
            cleverapps.throwAsync("Yandex inconsistent products prices: " + errors.join(","));
        }
    }.bind(this)).catch(function (err) {
        console.log("Failed prices check", err);
    });
};

YandexPayments.prototype.purchase = function (product, callback) {
    if (!this.yaPayments) {
        console.log("Payments unavailable");
        return;
    }

    if (!product.id.yandex || this.catalogProductIds && !this.catalogProductIds[product.id.yandex]) {
        cleverapps.throwAsync("Unregistered yandex product: " + product.itemId
            + ", catalogProducts - " + JSON.stringify(Object.keys(this.catalogProductIds)));
        callback(cleverapps.CODE_FAILED);
        return;
    }

    this.yaPayments.purchase({
        id: product.id.yandex,
        developerPayload: JSON.stringify({
            userId: cleverapps.platform.getUserID(),
            itemId: product.itemId
        })
    }).then(function (purchase) {
        purchase.paymentId = purchase.purchaseToken;
        purchase.productId = product.itemId;
        console.log("success", purchase);
        callback(cleverapps.CODE_SUCCEED, purchase);
    }).catch(function (e) {
        console.log("error", e);
        callback(cleverapps.CODE_FAILED);
    });
};

YandexPayments.prototype.consume = function (purchase) {
    // console.log("consume start", purchase);

    this.yaPayments.consumePurchase(purchase.purchaseToken).then(function () {
        console.log("consume success", purchase);
    }).catch(function (e) {
        console.log("consume error", e);
    });
};

YandexPayments.prototype.isRestoreAvailable = function () {
    return cleverapps.social.isLoggedIn() && Boolean(this.yaPayments);
};

YandexPayments.prototype.restore = function (callback) {
    this.yaPayments.getPurchases().then(function (purchases) {
        console.log("getPurchases", purchases);

        if (purchases.length === 0) {
            callback(cleverapps.CODE_FAILED);
            return;
        }

        var purchase = purchases[0];
        var data = JSON.parse(purchase.developerPayload);

        purchase.paymentId = purchase.purchaseToken;
        purchase.productId = data.itemId;
        purchase.signature = purchases.signature;

        callback(cleverapps.CODE_SUCCEED, purchase);
    }).catch(function (e) {
        callback(cleverapps.CODE_FAILED);
        console.log("error getPurchases", e);
    });
};

YandexPayments.prototype.validate = function (purchase, callback) {
    var data = {
        signature: purchase.signature,
        purchaseToken: purchase.purchaseToken
    };

    cleverapps.RestClient.post("/yandexpayments/validate", data, function (res) {
        var code = res === "ok" ? cleverapps.CODE_SUCCEED : cleverapps.CODE_FAILED;
        callback(code, purchase);
    }, function () {
        callback(cleverapps.CODE_CANCELLED, purchase);
    });
};

YandexPayments.isAppropriate = function () {
    return cleverapps.platform instanceof Yandex;
};
