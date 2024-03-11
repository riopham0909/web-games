/**
 * Created by Aleksandr on 29.09.2022.
 */

var PlingaPayments = function () {
    RestPayments.call(this);

    for (var itemId in cleverapps.config.products) {
        var product = cleverapps.config.products[itemId];
        product.loadedId = itemId;
    }
};

PlingaPayments.prototype = Object.create(RestPayments.prototype);
PlingaPayments.prototype.constructor = PlingaPayments;

PlingaPayments.prototype.purchaseOpen = function (product, callback) {
    cleverapps.platform.exitFullscreen(function () {
        plingaRpc.purchasePackage(product.itemId, function (data) {
            if (data.paymentStatus === "paid") {
                product.packageName = data.packageName;
                callback(cleverapps.CODE_SUCCEED, product);
            } else {
                callback(cleverapps.CODE_FAILED);
            }
        });
    });
};

PlingaPayments.isAppropriate = function () {
    return cleverapps.platform instanceof Plinga;
};
