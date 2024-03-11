/**
 * Created by slava on 4/21/17.
 */

var MobagePayments = function () {
    RestPayments.call(this);

    for (var j in cleverapps.config.products) {
        var product = cleverapps.config.products[j];
        product.loadedPrice = MobagePayments.calcLoadedPrice(product.price);
        product.loadedId = product.id.mbga + "";
    }
};

MobagePayments.prototype = Object.create(RestPayments.prototype);
MobagePayments.prototype.constructor = MobagePayments;

MobagePayments.prototype.calcLoadedPrice = function (price) {
    return MobagePayments.calcLoadedPrice(price);
};

MobagePayments.calcLoadedPrice = function (price) {
    if (MobagePayments.TESTER_IDS.indexOf(cleverapps.platform.getUserID()) !== -1) {
        return "1 MC";
    }

    return cleverapps.formatAmount(Math.ceil(price * 100)) + " MC";
};

MobagePayments.prototype.purchaseOpen = function (product, callback) {
    var itemParams = {};
    itemParams[opensocial.BillingItem.Field.SKU_ID] = product.id.mbga;
    itemParams[opensocial.BillingItem.Field.PRICE] = parseInt(product.loadedPrice.replace(" ", ""));
    itemParams[opensocial.BillingItem.Field.COUNT] = 1;
    itemParams[mbga.BillingItem.Field.NAME] = product.title;
    itemParams[mbga.BillingItem.Field.IMAGE_URL] = cleverapps.platform.getExternalUrl(product.image);
    var item = opensocial.newBillingItem(itemParams);

    var params = {};
    params[opensocial.Payment.Field.ITEMS] = [item];
    params[opensocial.Payment.Field.AMOUNT] = itemParams[opensocial.BillingItem.Field.PRICE] * itemParams[opensocial.BillingItem.Field.COUNT];
    var payment = opensocial.newPayment(params);

    opensocial.requestPayment(payment, function (response) {
        if (response.hadError()) {
            callback(cleverapps.CODE_FAILED, response);
        } else {
            console.log("opensocial.requestPayment response", response.getData());
            callback(cleverapps.CODE_SUCCEED, product);
        }
    });
};

MobagePayments.isAppropriate = function () {
    return cleverapps.platform instanceof Mobage;
};

MobagePayments.TESTER_IDS = [
    "mbga.jp:155776208",
    "sb.mbga.jp:189574",
    "sb.mbga.jp:195164",
    "mbga.jp:157478302" // Andrey Kargapolov
];