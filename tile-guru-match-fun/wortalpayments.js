/**
 * Created by anatoly on 20/09/2023
 */

var WortalPayments = function () {
    Payments.call(this);

    for (var j in cleverapps.config.products) {
        var product = cleverapps.config.products[j];
        product.loadedId = product.id.wortal;
    }
};

WortalPayments.prototype = Object.create(Payments.prototype);
WortalPayments.prototype.constructor = WortalPayments;

WortalPayments.prototype._connect = function (callback) {
    callback(Wortal.iap.isEnabled() ? Platform.STATUS_CONNECTED : Platform.STATUS_DISABLED);
};

WortalPayments.prototype._loadProducts = function (callback) {
    Wortal.iap.getCatalogAsync().then(function (catalog) {
        console.log(catalog);

        catalog.forEach(function (product) {
            var ourProduct = cleverapps.config.products[Product.SearchProductId(product.productID)];
            if (ourProduct) {
                ourProduct.loadedPrice = product.price;
            } else {
                cleverapps.throwAsync({ group: "DebugInstantMessage", message: product.productID + " not found" });
            }
        }, this);

        callback(cleverapps.CODE_SUCCEED);
    }.bind(this));
};

WortalPayments.isAppropriate = function () {
    return cleverapps.platform.oneOf(WortalPlatform);
};

WortalPayments.prototype.purchase = function (product, callback) {
    if (!this.isAvailable()) {
        callback(cleverapps.CODE_FAILED, product, "InstantPayments.NotAvailable");
        return;
    }

    var suffix = cleverapps.platform.debugMode ? ".test" : "";

    Wortal.iap.makePurchaseAsync({
        productID: product.id.wortal + suffix
    }).then(function (purchase) {
        console.log("success purchase", purchase);
        purchase.paymentId = purchase.paymentID;
        purchase.productId = product.itemId;
        callback(cleverapps.CODE_SUCCEED, purchase);
    }).catch(function (e) {
        console.log("error purchase", e);

        var code = cleverapps.CODE_FAILED;
        if (e && e.code === "USER_INPUT") {
            code = cleverapps.CODE_CANCELLED;
        }

        callback(code, product);
    });
};

WortalPayments.prototype.consume = function (purchase) {
    Wortal.iap.consumePurchaseAsync(purchase.purchaseToken)
        .then(function () {
            console.log("consume success", purchase);
        })
        .catch(function (e) {
            console.log("consume error", e);
        });
};

WortalPayments.prototype.restore = function (callback) {
    Wortal.iap.getPurchasesAsync().then(function (purchases) {
        if (purchases.length === 0) {
            callback(cleverapps.CODE_FAILED);
            return;
        }

        var purchase = purchases[0];

        purchase.paymentId = purchase.paymentID;
        purchase.productId = purchase.productID;

        callback(cleverapps.CODE_SUCCEED, purchase);
    }).catch(function (e) {
        callback(cleverapps.CODE_FAILED);

        console.log("error getPurchasesAsync", e);
    });
};