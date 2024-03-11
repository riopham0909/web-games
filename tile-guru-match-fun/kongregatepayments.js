/**
 * Created by Aleksandr on 02.02.2023
 */

if (typeof cleverapps === "undefined" && typeof window === "undefined") {
    var cleverapps = require("../../utils");
    RestPayments = function () {};
}

var KongregatePayments = function () {
    RestPayments.call(this);

    for (var itemId in cleverapps.config.products) {
        var product = cleverapps.config.products[itemId];
        product.loadedPrice = this.calcLoadedPrice(product.price);
        product.loadedId = itemId;
    }
};

KongregatePayments.prototype = Object.create(RestPayments.prototype);
KongregatePayments.prototype.constructor = KongregatePayments;

KongregatePayments.prototype.calcLoadedPrice = function (price) {
    return Math.ceil(price) * 10 + " {{";
};

KongregatePayments.prototype.purchaseOpen = function (product, callback) {
    cleverapps.platform.exitFullscreen(function () {
        kongregate.mtx.purchaseItemsRemote(product.itemId, function (result) {
            if (result.success) {
                callback(cleverapps.CODE_SUCCEED);
            } else {
                callback(cleverapps.CODE_FAILED);
            }
        });
    });
};

KongregatePayments.isAppropriate = function () {
    return cleverapps.platform instanceof Kongregate;
};
