/**
 * Created by anatoly on 09/12/2023
 */

var SamsungPayments = function () {
    Payments.call(this);

    for (var j in cleverapps.config.products) {
        var product = cleverapps.config.products[j];
        product.loadedId = product.id.instant;
    }
};

SamsungPayments.prototype = Object.create(Payments.prototype);
SamsungPayments.prototype.constructor = SamsungPayments;

SamsungPayments.prototype._connect = function (callback) {
    window.addEventListener("iapReady", function () {
        console.log("Samsung iap is ready");

        callback(Platform.STATUS_CONNECTED);
    });
};

SamsungPayments.prototype._loadProducts = function (callback) {
    if (!this.isAvailable()) {
        console.log("Iap is not ready");
    }

    GSInstantIAP.getProductListAsync()
        .then(function (products) {
            products.forEach(function (product) {
                var ourProduct = cleverapps.config.products[Product.SearchProductId(product.mItemId)];
                if (ourProduct) {
                    ourProduct.loadedPrice = product.price;
                } else {
                    cleverapps.throwAsync({ group: "DebugInstantMessage", message: product.mItemId + " not found" });
                }
            });

            callback(cleverapps.CODE_SUCCEED);
        });
};

SamsungPayments.isAppropriate = function () {
    return cleverapps.platform.oneOf(Samsung);
};

SamsungPayments.prototype.purchase = function (product, callback) {
    GSInstantIAP.purchaseItemAsync({
        itemID: product.id.samsung
    }).then(function (purchase) {
        purchase.paymentId = purchase.mPaymentId;
        purchase.productId = product.itemId;
        callback(cleverapps.CODE_SUCCEED, purchase);
    }).catch(function (err) {
        console.log("purchase error: ", err);
        cleverapps.config.debugMode && cleverapps.notification.create("purchase error - " + JSON.stringify(err));

        callback(cleverapps.CODE_FAILED, product);
    });
};

SamsungPayments.prototype.consume = function (purchase) {
    GSInstantIAP.consumeItemsAsync(purchase.purchaseToken)
        .then(function (consumeItem) {
            console.log("consume success: ", consumeItem);
            cleverapps.config.debugMode && cleverapps.notification.create("consume success - " + JSON.stringify(consumeItem));
        })
        .catch(function (err) {
            console.log("consume error: ", err);
            cleverapps.config.debugMode && cleverapps.notification.create("consume error - " + JSON.stringify(err));
        });
};

SamsungPayments.prototype.restore = function (callback) {
    GSInstantIAP.getOwnedListAsync()
        .then(function (purchases) {
            if (purchases.length === 0) {
                callback(cleverapps.CODE_FAILED);
                return;
            }

            var purchase = purchases[0];

            purchase.paymentId = purchase.mPaymentId;
            purchase.productId = purchase.mItemId;

            callback(cleverapps.CODE_SUCCEED, purchase);
        })
        .catch(function (err) {
            callback(cleverapps.CODE_FAILED);

            console.log("getOwnedAsync error: ", err);
            cleverapps.config.debugMode && cleverapps.notification.create("getOwnedAsync error - " + JSON.stringify(err));
        });
};