/**
 * Created by andrey on 15.10.19.
 */

var WebViewPayments = function () {
    Payments.call(this);

    this.startTime = Date.now();

    for (var j in cleverapps.config.products) {
        var product = cleverapps.config.products[j];
        product.loadedId = product.id[cleverapps.platform.oneOf(Apple) ? "ios" : cleverapps.platform.source];
    }
};

WebViewPayments.prototype = Object.create(Payments.prototype);
WebViewPayments.prototype.constructor = WebViewPayments;

WebViewPayments.prototype.loadSubscriptionsTokens = function (callback) {
    if (cleverapps.platform.oneOf(Rustore, Amazon)) {
        callback(cleverapps.CODE_SUCCEED);
        return;
    }

    cleverapps.platform.callNative("PurchasesPlugin.loadSubscriptionsTokens", function (code, response) {
        if (code !== cleverapps.CODE_SUCCEED) {
            return;
        }

        var purchases = response.purchases || [];

        if (purchases) {
            console.log("WebViewPayments.onLoadSubscriptionsTokensResult purchases - " + purchases);
            this.addSubscriptionTokens(purchases);
        }

        callback(cleverapps.CODE_SUCCEED);
    }.bind(this));
};

WebViewPayments.prototype.addSubscriptionTokens = function (products, restore) {
    if (!Array.isArray(products)) {
        products = [products];
    }

    if (!cleverapps.platform.oneOf(AndroidPlatform, IOS, MacOS) || !cleverapps.subscription) {
        return;
    }

    var tokens = products.map(function (product) {
        var ourProduct = Product.Create(Product.SearchProductId(product.productId));
        if (ourProduct && ourProduct.type === "subscription") {
            var token = {
                name: ourProduct.key
            };

            if (cleverapps.platform.oneOf(AndroidPlatform)) {
                token.purchaseToken = product.purchaseToken || product.receipt.purchaseToken;
                token.packageName = product.packageName || product.receipt.packageName;
                token.productId = product.productId || product.receipt.productId;
            } else {
                token.purchaseToken = product.receipt;
                token.packageName = product.packageName;
                token.productId = product.productId;
            }

            return token;
        }
        return undefined;
    }).filter(function (token) {
        return token;
    });

    if (tokens.length > 0) {
        cleverapps.subscription.addPurchaseTokens(tokens, restore);
    }
};

WebViewPayments.prototype._connect = function (callback) {
    if (cleverapps.platform.oneOf(Apple)) {
        callback(Platform.STATUS_CONNECTED);
        return;
    }

    cleverapps.platform.nativeEventListeners.WebViewPayments = this.onNativeEvent.bind(this);
    this.connectCallback = callback;
    cleverapps.platform.callNative("PurchasesPlugin.connect");
};

WebViewPayments.prototype.clear = function () {
    delete cleverapps.platform.nativeEventListeners.WebViewPayments;
};

WebViewPayments.prototype.onNativeConnected = function (connected) {
    console.log("WebViewPayments.updateConnected - " + connected);

    if (this.connectCallback) {
        this.connectCallback(connected ? Platform.STATUS_CONNECTED : Platform.STATUS_DISCONNECTED);
        delete this.connectCallback;
    } else {
        cleverapps.platform.setStatus(Platform.PAYMENTS, connected ? Platform.STATUS_CONNECTED : Platform.STATUS_DISCONNECTED);
    }
};

WebViewPayments.prototype.onNativeEvent = function (name, options) {
    switch (name) {
        case "updateConnected":
            this.onNativeConnected(options.connected); break;
        case "requestRestore":
            cleverapps.paymentsManager.restoreThrottled(); break;
    }
};

WebViewPayments.prototype.getStoreProductIds = function (type) {
    var productIds = [];
    for (var id in cleverapps.config.products) {
        var product = cleverapps.config.products[id];
        var productType = product.type || "consumable";
        if (productType === type) {
            productIds.push(product.loadedId);
        }
    }
    return productIds.join(",");
};

WebViewPayments.prototype._loadProducts = function (callback) {
    cleverapps.platform.callNative("PurchasesPlugin.loadProducts", { productIds: this.getStoreProductIds("consumable") }, function (code, response) {
        this.onLoadResult(code, "consumable", response.products || []);

        callback(code);
    }.bind(this));
};

WebViewPayments.prototype.loadSubscriptions = function (callback) {
    if (cleverapps.platform.oneOf(Rustore, Amazon)) {
        callback(cleverapps.CODE_SUCCEED);
        return;
    }

    cleverapps.platform.callNative("PurchasesPlugin.loadSubscriptions", { productIds: this.getStoreProductIds("subscription") }, function (code, response) {
        this.onLoadResult(code, "subscription", response.products || []);

        callback(code);
    }.bind(this));
};

WebViewPayments.prototype.onLoadResult = function (code, type, products) {
    console.log("WebViewPayments.onLoadResult code - " + code + " type - " + type);
    if (code !== cleverapps.CODE_SUCCEED) {
        console.log("WebViewPayments.onLoadResult failure");
        return;
    }

    products = products || [];
    console.log("WebViewPayments.onLoadResult products - " + JSON.stringify(products));

    var loadedCurrencyCode;

    products.forEach(function (product) {
        var ourProduct = cleverapps.config.products[Product.SearchProductId(product.productId)];
        var currency = product.price_currency_code;
        loadedCurrencyCode = loadedCurrencyCode || currency;

        if (ourProduct !== undefined) {
            ourProduct.loadedPrice = product.price;
            ourProduct.loadedCurrencyCode = currency;
            ourProduct.loadedPriceAmount = Math.round(product.price_amount_micros / 1000) / 1000;

            console.log("WebViewPayments product " + product.productId + " " + ourProduct.loadedPrice + " " + ourProduct.loadedCurrencyCode + " " + ourProduct.loadedPriceAmount);
        }
    });

    if (loadedCurrencyCode && !this.loadedCurrencyCode) {
        this.loadedCurrencyCode = loadedCurrencyCode;
        cleverapps.paymentsCountry.setCurrency(loadedCurrencyCode);
    }
};

WebViewPayments.prototype.purchase = function (product, callback) {
    if (!cleverapps.platform.isConnected(Platform.PAYMENTS)) {
        console.log("WebViewPayments.purchase not connected error");
        callback(cleverapps.CODE_FAILED);
        return;
    }
    if (!product.loadedId) {
        console.log("Product without loadedId: " + product.key);
        callback(cleverapps.CODE_FAILED);
        return;
    }

    cleverapps.platform.callNative("PurchasesPlugin.purchase", { productId: product.loadedId }, function (code, response) {
        var product = response.product;
        var ourProduct;

        if (product) {
            ourProduct = Product.Create(Product.SearchProductId(product.productId));
            console.log("WebViewPayments.purchase orderId - " + product.orderId);
            console.log("WebViewPayments.purchase product - " + JSON.stringify(product, cleverapps.cutStringsReplacer));
        }

        switch (code) {
            case cleverapps.CODE_SUCCEED:
                this.addSubscriptionTokens(product);
                product.itemId = ourProduct && ourProduct.itemId;
                break;
            case cleverapps.CODE_PENDING:
                product.pending = true;
                this.validate(product);
                break;
        }

        if (product) {
            product.paymentId = (product.orderId || product.receipt.orderId || "").substring(0, 50);
            if (cleverapps.platform.oneOf(MacOS)) {
                product.transactionId = cleverapps.platform.getUserID() + "_" + Date.now();
            }

            product.loadedPriceAmount = ourProduct ? ourProduct.price : 0;
            product.loadedCurrencyCode = "USD";

            if (product.price_amount_micros && product.price_currency_code) {
                product.loadedPriceAmount = Math.round(product.price_amount_micros / 1000) / 1000;
                product.loadedCurrencyCode = product.price_currency_code;
            } else if (ourProduct && ourProduct.loadedPriceAmount && ourProduct.loadedCurrencyCode) {
                product.loadedPriceAmount = ourProduct.loadedPriceAmount;
                product.loadedCurrencyCode = ourProduct.loadedCurrencyCode;
            }
        }

        callback(code, product);
    }.bind(this));
};

WebViewPayments.prototype.isAvailable = function () {
    var isBlocked = cleverapps.platform.oneOf(AndroidPlatform) && ["RUB"].includes(this.loadedCurrencyCode)
        && !WebViewPayments.DEBUG_IDFA.includes(cleverapps.platform.device.idfa);

    var result = cleverapps.platform.isConnected(Platform.PAYMENTS) && !isBlocked;

    if (cleverapps.platform.oneOf(Apple, AndroidPlatform) && !this.productsLoaded) {
        result = false;
    }

    // console.log("WebViewPayments.isAvailable - " + JSON.stringify({
    //     result: result,
    //     isBlocked: isBlocked,
    //     initialized: this.initialized,
    //     connected: this.connected,
    //     productsLoaded: this.productsLoaded,
    //     subscriptionsLoaded: this.subscriptionsLoaded
    // }));

    return result;
};

WebViewPayments.prototype.validate = function (product, callback) {
    if (!cleverapps.platform.oneOf(AndroidPlatform, IOS, MacOS, GPG)) {
        callback(cleverapps.CODE_SUCCEED, product);
        return;
    }

    var data = {
        userid: cleverapps.platform.getUserID(),
        restore: product.restore,
        itemId: product.itemId,
        pending: product.pending
    };

    if (cleverapps.platform.oneOf(IOS, MacOS)) {
        data.receipt = product.receipt;
        data.productId = product.productId;
        data.packageName = product.packageName;
        data.platform = "apple";
    } else {
        data.receipt = product.receipt.purchaseToken;
        data.packageName = product.receipt.packageName;
        data.productId = product.receipt.productId;
        data.platform = "google";
        data.purchaseState = product.purchaseState;
    }

    product.paymentId = product.paymentId || product.orderId;

    data.errorInJson = true;

    var ourProduct = Product.Create(Product.SearchProductId(product.productId));
    data.type = ourProduct && ourProduct.type;

    // console.log("WebViewPayments.validate - " + JSON.stringify(data));
    cleverapps.RestClient.post("/purchasevalidator/validate/", data, function (response) {
        if (response.error) {
            console.log("WebViewPayments.validate Failure: " + response.error);
            callback(cleverapps.CODE_FAILED, product);
            return;
        }

        product.paymentId = product.paymentId
            || response.receipt && response.receipt.orderId
            || response.transaction_id || response.transactionId;
        console.log("WebViewPayments.validate Success: " + JSON.stringify(response));
        callback(cleverapps.CODE_SUCCEED, product);
    }, function () {
        console.log("WebViewPayments.validate onError");
        callback(cleverapps.CODE_CANCELLED, product);
    });
};

WebViewPayments.prototype.calcLoadedPrice = function (price) {
    var exchangeRate = cleverapps.EXCHANGE_RATES[this.loadedCurrencyCode];
    if (exchangeRate) {
        var sign = Product.CURRENCY_CODE === this.loadedCurrencyCode ? Product.CURRENCY : this.loadedCurrencyCode;
        return Math.ceil(price * exchangeRate) + ".00 " + sign;
    }
    return Product.CURRENCY + " " + price;
};

WebViewPayments.isAppropriate = function () {
    return cleverapps.platform.oneOf(AndroidPlatform, Amazon, IOS, MacOS);
};

WebViewPayments.prototype.restore = function (callback) {
    if (!cleverapps.platform.oneOf(AndroidPlatform, GPG, IOS, MacOS)) {
        callback(cleverapps.CODE_FAILED);
        return;
    }

    cleverapps.platform.callNative("PurchasesPlugin.restore", function (code, response) {
        var purchase = response.purchase;

        if (!purchase) {
            callback(cleverapps.CODE_FAILED);
            return;
        }

        var orderId = purchase.orderId;
        if (!orderId) {
            callback(cleverapps.CODE_FAILED);
            return;
        }

        purchase.paymentId = orderId;
        callback(cleverapps.CODE_SUCCEED, purchase);
    });
};

WebViewPayments.prototype.consume = function (purchase) {
    if (!purchase || !purchase.orderId) {
        return;
    }

    if (cleverapps.platform.oneOf(AndroidPlatform, IOS, MacOS)) {
        cleverapps.platform.callNative("PurchasesPlugin.consumePurchase", {
            orderId: purchase.orderId,
            productId: purchase.productId
        });
    }
};

WebViewPayments.prototype.restoreSubscriptions = function (callback) {
    callback = cleverapps.once(callback);

    if (!cleverapps.platform.isConnected(Platform.PAYMENTS)) {
        callback(cleverapps.CODE_FAILED);
        return;
    }

    cleverapps.platform.callNative("PurchasesPlugin.restoreSubscriptions", function (code, response) {
        var purchases = response.purchases;

        console.log("WebViewPayments.onRestoreSubscriptionsResult code - " + code);

        if (purchases) {
            console.log("IOSPayments.onRestoreSubscriptionsResult purchases - " + purchases.length, purchases);
        }

        if (code === cleverapps.CODE_SUCCEED) {
            callback(cleverapps.CODE_SUCCEED);
            this.addSubscriptionTokens(purchases, true);
        } else {
            callback(cleverapps.CODE_FAILED);
        }
    }.bind(this));
};

WebViewPayments.DEBUG_IDFA = [
    "45f0caa5-d1ab-4b03-8e09-a0b63b17c181", // andrey k m31s
    "839d10f8-0da0-40fa-a4e9-02885ff0973a", // andrey k s21
    "17ef0ac8-71fa-47d1-941b-70924e8a031e", // anna
    "217ac5d3-6b67-48e8-8fe8-0fff1108c808", // alex_read
    "75f21832-7a24-47cc-9e88-8c4f461fc06d", // dmitriy
    "aca92164-3f00-4115-84c3-2ab54ed7ba7b", // samsung tab a android 9
    "1572cd26-1b38-4b85-8346-258e171b388c", // spepa
    "b1ae8117-ff55-4159-b9ad-18e4d05a9da8", // michail
    "cb3ed72f-c604-4c51-84fa-2ffaa9acb849", // vlad
    "85c137ac-0a55-45cd-bd8a-b8be552beea8", // bogdan
    "d2d82613-36c4-4d5c-aef5-43e62e938a48", // artem
    "2105ba80-4607-4ae3-a3a8-866aa7fb63b9", // denis
    "24280e2d-6603-415e-a064-d794cbda6437", // anatoly
    "c07beae6-3277-4c72-83ec-26cba72eeb36", // denis kuzin
    "668c1ab3-456f-4f31-a734-afdbc034c759" // ivan m
];
