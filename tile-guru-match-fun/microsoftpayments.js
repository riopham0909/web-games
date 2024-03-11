/**
 * Created by iamso on 24.09.2021
 */

var MicrosoftPayments = function () {
    Payments.call(this);
    Product.WAIT_NO_MORE = 20000;
};

MicrosoftPayments.prototype = Object.create(Payments.prototype);
MicrosoftPayments.prototype.constructor = MicrosoftPayments;

MicrosoftPayments.prototype._connect = function (callback) {
    cleverapps.platform.callNative("store.init", function (code, response) {
        console.log("MicrosoftPayments.onInit - " + JSON.stringify(response));
        if (response.error) {
            callback(Platform.STATUS_DISCONNECTED);

            console.log("Error requesting microsoft products", response.error);
            return;
        }

        var config = cleverapps.config.microsoft.iap;
        if (config.testProduct && MicrosoftPayments.Devs.includes(cleverapps.platform.getDeviceId())) {
            config.gold500 = config.testProduct.id || config.testProduct;
            if (cleverapps.config.debugMode && config.testProduct.debugId) {
                config.gold500 = config.testProduct.debugId;
            }
        }

        var products = response.products;
        for (var ourProductId in config) {
            var msId = config[ourProductId];
            var ourProduct = cleverapps.config.products[ourProductId];
            var msProduct = products[msId];

            if (ourProduct && msProduct) {
                ourProduct.loadedPrice = msProduct.price;
                ourProduct.loadedCurrencyCode = msProduct.currencyCode;
                ourProduct.loadedId = msId;
                console.log("MicrosoftPayments product " + ourProductId + " " + msId + " " + ourProduct.loadedPrice);
            }
        }

        callback(Platform.STATUS_CONNECTED);
    });
};

MicrosoftPayments.prototype.purchase = function (product, callback) {
    if (!product.loadedId) {
        console.log("MicrosoftPayments.open " + product.itemId + " loadedId not available");
        callback(cleverapps.CODE_FAILED);
        return;
    }

    cleverapps.platform.callNative("store.purchase", {
        productId: product.loadedId
    }, function (code, data) {
        var product = Product.Create(data.productId) || {};
        var purchase;

        if (data.canceled) {
            console.log("MicrosoftPayments.onPurchaseCancelled", product.key);
            code = cleverapps.CODE_CANCELLED;
        } else if (data.error) {
            console.log("MicrosoftPayments.onPurchaseFailure", product.key, data.error);
            code = cleverapps.CODE_FAILED;
        } else {
            console.log("MicrosoftPayments.onPurchaseSuccess", product.key, data);
            code = cleverapps.CODE_SUCCEED;
            purchase = product;
            purchase.trackingId = data.trackingId;

            purchase.loadedCurrencyCode = purchase.loadedCurrencyCode || "USD";
            purchase.loadedPriceAmount = parseFloat(product.loadedPrice.replace(",", ".").replace(/[^\d.]/g, "")) || product.price;
            purchase.transactionId = data.trackingId;
        }

        callback(code, purchase);
    });
};

MicrosoftPayments.isAppropriate = function () {
    return cleverapps.platform instanceof Microsoft;
};

MicrosoftPayments.Devs = [
    "MS_d1005317-92e5-4a83-11a9-d927877edd08", // spepa
    "MS_af64328e-3371-73c1-367c-92bb6d560ed5",
    "MS_3c940659-7a68-99e0-0ef2-0e4369a5372f",
    "MS_bafafe21-499a-26aa-44dc-f74662bff405",
    "MS_9c82c0be-a17d-a981-11b7-4a85ec0661a4", // Dmitriy
    "MS_089e6329-8b28-c5e4-7b60-1f56b5b4b126",
    "MS_34390e45-0500-febc-5829-27c92a3481b5", // Anna Keda
    "MS_428f0900-1986-514e-b40e-3c8b70235374", // Alexandrina Read
    "MS_459d1c26-a293-f56b-b56c-84f410e3830b", // Bogdan
    "MS_3ff4887f-2eaa-81d3-e99e-d6495ee64e85", // Artem Vinokurov
    "MS_13c53147-883c-b6e0-6c56-2aae159ed6d1", // Sergei Bogdanov,
    "MS_c8d2d30b-2a32-573b-219f-eaa7cbbd6f35" // Petr Isakov
];