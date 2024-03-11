/**
 * Created by iamso on 19.09.2019.
 */

var DraugiemPayments = function () {
    RestPayments.call(this);

    DraugiemProducts = DraugiemProducts[cleverapps.config.name];

    for (var itemId in cleverapps.config.products) {
        var product = cleverapps.config.products[itemId];

        product.loadedPrice = this.calcLoadedPrice(product.price);
        product.loadedId = (DraugiemProducts[itemId] || "") + "";
    }
};

DraugiemPayments.prototype = Object.create(RestPayments.prototype);
DraugiemPayments.prototype.constructor = DraugiemPayments;

DraugiemPayments.prototype.calcLoadedPrice = function (price) {
    return price + " €";
};

DraugiemPayments.prototype.isProductExists = function (key) {
    var product = cleverapps.config.products[key];
    return product && DraugiemProducts[key];
};

DraugiemPayments.prototype.stopSocialChecker = function () {
    if (this.socialChecker) {
        this.socialChecker.stop();
        delete this.socialChecker;
    }
};

DraugiemPayments.prototype.startSocialChecker = function (product, callback, options) {
    this.stopSocialChecker();

    var check = function () {
        console.log("ask transaction status: " + product.paymentId);
        cleverapps.social.api("transactions/check", { id: product.paymentId }, function (code, response) {
            if (response === undefined) {
                return;
            }

            console.log("status: ", response.status);
            if (response.status === "FAILED") {
                callback(cleverapps.CODE_FAILED);
            } else if (response.status === "OK") {
                callback(cleverapps.CODE_SUCCEED);
            }
        });
    };

    this.socialChecker = this.startChecker(Object.assign({}, options || {}, {
        check: check
    }));
};

DraugiemPayments.prototype.purchaseOpen = function (product, callback) {
    if (!DraugiemProducts[product.key]) {
        callback(cleverapps.CODE_FAILED);
        cleverapps.throwAsync("Draugiem payment configuration error for " + product.key);
        return;
    }

    var params = {
        price: Math.round(parseFloat(product.loadedPrice) * 100),
        service: DraugiemProducts[product.key]
    };

    if (DraugiemPayments.TESTERS.includes(cleverapps.platform.getUserID())) {
        params.price = 1;
    }

    cleverapps.social.api("transactions/create", params, function (code, response) {
        console.log(DraugiemProducts[product.key], code, response);
        if (code !== cleverapps.CODE_SUCCEED) {
            callback(cleverapps.CODE_FAILED);
            return;
        }

        product.paymentId = response.transaction.id;

        this.setCancelTimeout(cleverapps.parseInterval("15 minutes"), callback);
        this.startSocialChecker(product, callback);

        this.setNotifyActiveListener(function () {
            var timeouts = cleverapps.arrayFill(15, "1 seconds");
            this.startPurchaseChecker(product, callback, { timeouts: timeouts });
            this.startSocialChecker(product, callback, { timeouts: timeouts });
            this.setCancelTimeout(cleverapps.parseInterval("15 seconds"), callback);
        }.bind(this));

        draugiemWindowOpen(response.transaction.link, 350, 400, function () {
            console.log("Draugiem payment window close", product.itemId);
            this.notifyActive();
        }.bind(this));
    }.bind(this));
};

DraugiemPayments.prototype.stopPurchaseActions = function () {
    RestPayments.prototype.stopPurchaseActions.call(this);

    this.stopSocialChecker();
};

DraugiemPayments.isAppropriate = function () {
    return cleverapps.platform instanceof Draugiem;
};

DraugiemPayments.TESTERS = [
    "5531190", // Romanov Viacheslav
    "5531196", // Spepa
    "5533303", // Andrey Kargapolov
    "5536860" // Bogdan
];
