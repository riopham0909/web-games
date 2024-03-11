/**
 * Created by slava on 4/21/17.
 */

var FacebookPayments = function () {
    RestPayments.call(this);

    for (var j in cleverapps.config.products) {
        var product = cleverapps.config.products[j];
        product.loadedId = product.id.facebook.replace(".html", "");
    }
};

FacebookPayments.prototype = Object.create(RestPayments.prototype);
FacebookPayments.prototype.constructor = FacebookPayments;

FacebookPayments.UserCanceled = 1383010;
FacebookPayments.SuccessStatuses = ["completed", "active"];

FacebookPayments.prototype.purchaseOpen = function (product, callback) {
    if (!cleverapps.platform.isConnected(Platform.SOCIAL)) {
        if (callback) {
            callback(cleverapps.CODE_FAILED);
        }
        return;
    }

    var options = {
        product: product.id.facebook,
        type: product.type
    };

    if (product.type === "subscription") {
        options.action = "create_subscription";
    }

    cleverapps.platform.exitFullscreen(function () {
        plugin.FacebookAgent.getInstance().canvas.pay(options, function (errorCode, result) {
            if (errorCode === FacebookPayments.UserCanceled) {
                console.log("Payment " + product.itemId + " error " + result.error_message);
                callback(cleverapps.CODE_CANCELLED, result);
            } else if (result && FacebookPayments.SuccessStatuses.indexOf(result.status) === -1) {
                console.log("Payment " + product.itemId + " status: ", result.status, (result.error_message ? ", error: " + result.error_message : ""));
                callback(cleverapps.CODE_CANCELLED, result);
            } else {
                console.log("Payment " + product.itemId + " success", result);

                product.paymentId = product.paymentId || result.payment_id;
                callback(cleverapps.CODE_SUCCEED, product);
            }
        });
    });
};

FacebookPayments.isAppropriate = function () {
    return !cleverapps.platform.info.isNative;
};
