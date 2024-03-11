/**
 * Created by slava on 4/21/17.
 */

var InstantPayments = function () {
    Payments.call(this);

    for (var j in cleverapps.config.products) {
        var product = cleverapps.config.products[j];
        product.loadedId = product.id.instant;
    }
};

InstantPayments.prototype = Object.create(Payments.prototype);
InstantPayments.prototype.constructor = InstantPayments;

InstantPayments.prototype._connect = function (callback) {
    cleverapps.whenAllInitialized(function () {
        var apis = FBInstant.getSupportedAPIs();
        console.log("Searching payments.purchaseAsync", apis);
        if (!apis.includes("payments.purchaseAsync")) {
            callback(Platform.STATUS_DISCONNECTED);

            return;
        }

        if (apis.includes("payments.purchaseSubscriptionAsync")) {
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION_API);
        }

        console.log("Found payments.purchaseAsync support!");
        FBInstant.payments.onReady(function () {
            console.log("Payments ready!");

            callback(Platform.STATUS_CONNECTED);
        });
    });
};

InstantPayments.prototype.getSubscriptionStatus = function (options, callback) {
    FBInstant.payments.getSubscriptionsAsync().then(function (subscriptions) {
        console.log(subscriptions);
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION_LIST + "SUCCESS");

        callback({
            active: subscriptions.length > 0
        });
    }).catch(function (e) {
        console.log("error listing subscriptions", e);

        switch (e.code) {
            case "CLIENT_UNSUPPORTED_OPERATION":
            case "NETWORK_FAILURE":
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION_LIST + e.code);
                break;
            default:
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION_LIST + "OTHER");
                cleverapps.throwAsync({ group: "DebugMessage", message: cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION_LIST + e.code + " message: " + e.message });
        }
        callback({});
    });
};

InstantPayments.prototype.isSubscriptionsAvailable = function () {
    if (typeof FBInstant === "undefined") {
        return false;
    }

    var apis = FBInstant.getSupportedAPIs();
    console.log("Searching payments.purchaseSubscriptionAsync", apis);
    return apis.indexOf("payments.purchaseSubscriptionAsync") !== -1;
};

InstantPayments.prototype.openSubscription = function (product, callback) {
    FBInstant.payments.purchaseSubscriptionAsync(product.id.instant).then(function (purchase) {
        console.log("success subscription", purchase);
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION + "SUCCESS");
        purchase.productId = product.itemId;
        callback(cleverapps.CODE_SUCCEED, purchase);
    }).catch(function (e) {
        console.log("error purchase", e);

        var code = cleverapps.CODE_FAILED;
        if (e && e.code === "USER_INPUT") {
            code = cleverapps.CODE_CANCELLED;
        }

        switch (e.code) {
            case "CLIENT_UNSUPPORTED_OPERATION":
            case "PAYMENTS_NOT_INITIALIZED":
            case "INVALID_PARAM":
            case "NETWORK_FAILURE":
            case "INVALID_OPERATION":
            case "USER_INPUT":
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION + e.code);
                break;
            default:
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION + "OTHER");
                cleverapps.throwAsync({ group: "DebugMessage", message: cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION + e.code + " message: " + e.message });
        }
        callback(code, product);
    });
};

InstantPayments.prototype.purchase = function (product, callback) {
    if (!this.isAvailable()) {
        callback(cleverapps.CODE_FAILED, product, "InstantPayments.NotAvailable");
        return;
    }

    if (product.type === "subscription") {
        this.openSubscription(product, callback);
        return;
    }

    FBInstant.payments.purchaseAsync({
        productID: product.id.instant
    }).then(function (purchase) {
        console.log("success purchase", purchase);
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.PAYMENT + "SUCCESS");
        purchase.paymentId = purchase.paymentID;
        purchase.productId = product.itemId;
        callback(cleverapps.CODE_SUCCEED, purchase);
    }).catch(function (e) {
        console.log("error purchase", e);

        var code = cleverapps.CODE_FAILED;
        if (e && e.code === "USER_INPUT") {
            code = cleverapps.CODE_CANCELLED;
        }

        switch (e.code) {
            case "CLIENT_UNSUPPORTED_OPERATION":
            case "PAYMENTS_NOT_INITIALIZED":
            case "INVALID_PARAM":
            case "NETWORK_FAILURE":
            case "INVALID_OPERATION":
            case "USER_INPUT":
            case "PAYMENTS_PURCHASE_CREATION_FAILED":
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.PAYMENT + e.code);
                break;
            default:
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.PAYMENT + "OTHER");
                cleverapps.throwAsync({ group: "DebugMessage", message: cleverapps.EVENTS.STATS.INSTANT.PAYMENT + e.code + " message: " + e.message });
        }
        callback(code, product);
    });
};

InstantPayments.prototype.isAvailable = function () {
    if (["1832499670188919",
        "1920167364724450",
        "2076714912381045",
        "2585442014807608" // Andrey Kargapolov
    ].indexOf(cleverapps.platform.getUserID()) !== -1) {
        return true;
    }

    return cleverapps.platform.isConnected(Platform.PAYMENTS);
}; 

InstantPayments.isAppropriate = function () {
    return cleverapps.platform.oneOf(Instant);
};

InstantPayments.prototype._loadProducts = function (callback) {
    var apis = FBInstant.getSupportedAPIs();
    console.log("Searching payments.getCatalogAsync", apis);
    if (apis.indexOf("payments.getCatalogAsync") === -1) {
        console.log("No support for getCatalogAsync, skip");
        callback(cleverapps.CODE_SUCCEED);
        return;
    }

    FBInstant.payments.getCatalogAsync().then(function (catalog) {
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
    }.bind(this)).catch(function (e) {
        if (!this.loadProductsErrorReported) {
            switch (e.code) {
                case "PENDING_REQUEST":
                case "CLIENT_UNSUPPORTED_OPERATION":
                case "PAYMENTS_NOT_INITIALIZED":
                case "NETWORK_FAILURE":
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.CATALOG + e.code);
                    break;
                default:
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.CATALOG + "OTHER");
                    cleverapps.throwAsync({ group: "DebugMessage", message: cleverapps.EVENTS.STATS.INSTANT.CATALOG + e.code + " message: " + e.message });
            }

            this.loadProductsErrorReported = true;
        }

        callback(cleverapps.CODE_FAILED);
    }.bind(this));
};

InstantPayments.prototype.loadSubscriptions = function (callback) {
    var apis = FBInstant.getSupportedAPIs();
    console.log("Searching payments.getSubscribableCatalogAsync", apis);
    if (apis.indexOf("payments.getSubscribableCatalogAsync") === -1) {
        console.log("No support for getSubscribableCatalogAsync, skip");
        callback(cleverapps.CODE_SUCCEED);
        return;
    }

    FBInstant.payments.getSubscribableCatalogAsync().then(function (catalog) {
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
    }.bind(this)).catch(function (e) {
        if (!this.loadSubscriptionsErrorReported) {
            switch (e.code) {
                case "CLIENT_UNSUPPORTED_OPERATION":
                case "NETWORK_FAILURE":
                case "PENDING_REQUEST":
                case "PAYMENTS_NOT_INITIALIZED":
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION_CATALOG + e.code);
                    break;
                default:
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION_CATALOG + "OTHER");
                    cleverapps.throwAsync({ group: "DebugMessage", message: cleverapps.EVENTS.STATS.INSTANT.SUBSCRIPTION_CATALOG + e.code + " message: " + e.message });
            }

            this.loadSubscriptionsErrorReported = true;
        }

        callback(cleverapps.CODE_FAILED);
    }.bind(this));
};

InstantPayments.prototype.consume = function (purchase) {
    var ourProduct = Product.Create(purchase.productID);

    if (ourProduct.type === "subscription") {
        cleverapps.RestClient.post("/instantpayments/addsubscriptions/", {
            userId: cleverapps.platform.getUserID(),
            subscription: purchase
        });
        return;
    }

    FBInstant.payments.consumePurchaseAsync(purchase.purchaseToken)
        .then(function () {
            console.log("consume success", purchase);
            cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.CONSUME + "SUCCESS");
        })
        .catch(function (e) {
            console.log("consume error", e);

            switch (e.code) {
                case "CLIENT_UNSUPPORTED_OPERATION":
                case "PAYMENTS_NOT_INITIALIZED":
                case "NETWORK_FAILURE":
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.CONSUME + e.code);
                    break;
                default:
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.CONSUME + "OTHER");
                    cleverapps.throwAsync({ group: "DebugMessage", message: cleverapps.EVENTS.STATS.INSTANT.CONSUME + e.code + " message: " + e.message });
            }
        });
};

InstantPayments.prototype._validate = function (purchase, callback) {
    var data = {
        signedRequest: purchase.signedRequest,
        userId: cleverapps.platform.getUserID()
    };

    cleverapps.RestClient.post("/instantpayments/validate/", data, function (response) {
        if (response === "ok") {
            callback(cleverapps.CODE_SUCCEED, purchase);
            console.log("Purchase validation success");
        } else {
            console.log("Purchase validation error", response);
            callback(cleverapps.CODE_FAILED, purchase);
        }
    }, function () {
        console.log("Purchase validation network error");
        callback(cleverapps.CODE_CANCELLED, purchase);
    });
};

InstantPayments.prototype.restore = function (callback) {
    if (!this.ready) {
        callback(cleverapps.CODE_FAILED);
        return;
    }

    FBInstant.payments.getPurchasesAsync().then(function (purchases) {
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

        switch (e.code) {
            case "CLIENT_UNSUPPORTED_OPERATION":
            case "PAYMENTS_NOT_INITIALIZED":
            case "NETWORK_FAILURE":
            case "UNKNOWN":
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.LIST_PURCHASES + e.code);
                break;
            default:
                cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.INSTANT.LIST_PURCHASES + "OTHER");
                cleverapps.throwAsync({ group: "DebugMessage", message: cleverapps.EVENTS.STATS.INSTANT.LIST_PURCHASES + e.code + " message: " + e.message });
        }
    });
};
