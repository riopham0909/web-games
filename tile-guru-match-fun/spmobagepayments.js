/**
 * Created by iamso on 24.01.19.
 */

var SPMobagePayments = function () {
    RestPayments.call(this);

    for (var j in cleverapps.config.products) {
        var product = cleverapps.config.products[j];

        product.loadedPrice = MobagePayments.calcLoadedPrice(product.price);
        product.loadedId = product.id.mbga;
    }
};

SPMobagePayments.prototype = Object.create(RestPayments.prototype);
SPMobagePayments.prototype.constructor = SPMobagePayments;

SPMobagePayments.prototype.calcLoadedPrice = function (price) {
    return MobagePayments.calcLoadedPrice(price);
};

SPMobagePayments.prototype.purchaseOpen = function (product, callback) {
    this.createTransaction(product, function (payment) {
        mobage.ui.open(
            "payment",
            {
                "transactionId": payment.transactionId,
                "orderId": payment.orderId
            },
            function (error, result) {
                if (error) {
                    this.reportPaymentResult(payment, error);
                    mobage.bank.clearPaymentBacklog(payment.transactionId);
                    callback(cleverapps.CODE_FAILED, result);
                } else {
                    this.reportPaymentResult(payment);
                    callback(cleverapps.CODE_SUCCEED, product);
                }
            }.bind(this)
        );
    }.bind(this));
};

SPMobagePayments.prototype.createTransaction = function (product, callback) {
    cleverapps.social.checkAccessToken(function () {
        var productInfo = {
            userId: cleverapps.platform.getUserID().substring(cleverapps.platform.getUserID().indexOf(":") + 1),
            id: product.id.mbga,
            name: product.title,
            price: parseInt(product.loadedPrice.replace("MC", "").replace(" ", "")),
            description: cleverapps.settings.language === "ja" ? product.description : product.description.substring(0, product.description.lastIndexOf("!")),
            imageUrl: cleverapps.config.deployment + product.image,
            accessToken: cleverapps.social.clientData.token.accessToken
        };

        var paramsArray = [];
        for (var paramName in productInfo) {
            if (Object.prototype.hasOwnProperty.call(productInfo, paramName)) {
                paramsArray.push(paramName + "=" + productInfo[paramName]);
            }
        }

        cleverapps.RestClient.get("/spmbgapayments?" + paramsArray.join("&"), {}, function (response) {
            callback(response);
        });
    });
};

SPMobagePayments.prototype.reportPaymentResult = function (payment, error) {
    var params = {
        orderId: payment.orderId,
        transactionId: payment.transactionId
    };

    if (error) {
        params.error = true;
    }

    var paramsArray = [];
    for (var paramName in params) {
        if (Object.prototype.hasOwnProperty.call(params, paramName)) {
            paramsArray.push(paramName + "=" + params[paramName]);
        }
    }
    cleverapps.RestClient.post("/spmbgapayments/old?" + paramsArray.join("&"), {}, function (response) {
        if (response && response.transactionId) {
            mobage.bank.clearPaymentBacklog(response.transactionId);
        }
    });
};

SPMobagePayments.isAppropriate = function () {
    return cleverapps.platform instanceof SPMobage;
};
