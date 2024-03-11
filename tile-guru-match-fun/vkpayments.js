/**
 * Created by slava on 4/21/17.
 */
if (typeof cleverapps === "undefined" && typeof cc === "undefined") {
    var cleverapps = require("../../utils");
    RestPayments = function () {};
}

var VKPayments = function () {
    RestPayments.call(this);

    for (var itemId in cleverapps.config.products) {
        var product = cleverapps.config.products[itemId];
        product.loadedPrice = this.calcLoadedPrice(product.price);
        product.loadedId = itemId;
    }
};

VKPayments.prototype = Object.create(RestPayments.prototype);
VKPayments.prototype.constructor = VKPayments;

VKPayments.GOLOS_TO_RUB = 7;
VKPayments.CalcVkPrice = function (price) {
    return Math.floor(price * cleverapps.RUB_DISCOUNTED_RATE / VKPayments.GOLOS_TO_RUB);
};

VKPayments.prototype.calcLoadedPrice = function (price) {
    var amount = VKPayments.CalcVkPrice(price);
    var ld = amount % 10;
    if (ld === 1) {
        return amount + " голос";
    }
    if (ld > 1 && ld < 5 && (amount < 10 || amount > 20)) {
        return amount + " голоса";
    }
    return amount + " голосов";
};

VKPayments.prototype.purchaseOpen = function (product, callback) {
    if (!this.isAvailable()) {
        callback(cleverapps.CODE_FAILED, product, "InstantPayments.NotAvailable");
        return;
    }

    cleverapps.platform.exitFullscreen(function () {
        cleverapps.social.showOrderBox({
            type: "item",
            item: product.itemId + "_v2"
        }, function (code, data) {
            if (code === cleverapps.CODE_SUCCEED) {
                product.paymentId = data.order_id;
                callback(code, product);
            } else if (data && data.error_data && data.error_data.error_reason === "User denied") {
                callback(cleverapps.CODE_CANCELLED);
            } else {
                callback(code, data);
            }
        });
    });
};

VKPayments.isAppropriate = function () {
    return cleverapps.platform instanceof VKPlatform;
};

if (typeof cc === "undefined") {
    module.exports = VKPayments.CalcVkPrice;
}
