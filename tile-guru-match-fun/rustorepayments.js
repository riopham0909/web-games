var RuStorePayments = function () {
    WebViewPayments.call(this);

    this.startTime = Date.now();

    for (var i in cleverapps.config.products) {
        var product = cleverapps.config.products[i];
        product.loadedId = product.id.rustore;
        product.loadedCurrencyCode = "RUB";
    }
};

RuStorePayments.prototype = Object.create(WebViewPayments.prototype);
RuStorePayments.prototype.constructor = RuStorePayments;

RuStorePayments.prototype.calcLoadedPrice = function (price) {
    return price + " RUB";
};

RuStorePayments.prototype.onLoadResult = function (code, type, products) {
    console.log("WebViewPayments.onLoadResult code - " + code + " type - " + type);

    if (code !== cleverapps.CODE_SUCCEED) {
        console.log("WebViewPayments.onLoadResult failure");
        return;
    }

    products = products || [];
    console.log("WebViewPayments.onLoadResult products - " + JSON.stringify(products));

    products.forEach(function (product) {
        var ourProduct = cleverapps.config.products[Product.SearchProductId(product.productId)];

        if (ourProduct !== undefined) {
            ourProduct.loadedPrice = this.calcLoadedPrice(product.price);

            console.log("WebViewPayments product " + product.productId + " " + ourProduct.loadedPrice);
        }
    }.bind(this));
};

RuStorePayments.isAppropriate = function () {
    return cleverapps.platform.oneOf(Rustore);
};