/**
 * Created by slava on 4/21/17.
 */

var MyMailRuPayments = function () {
    RestPayments.call(this);

    for (var j in cleverapps.config.products) {
        var product = cleverapps.config.products[j];

        product.loadedPrice = this.calcLoadedPrice(product.price);
        product.loadedId = product.id.mymailru + "";
    }
};

MyMailRuPayments.prototype = Object.create(RestPayments.prototype);
MyMailRuPayments.prototype.constructor = MyMailRuPayments;

MyMailRuPayments.prototype._connect = function (callback) {
    this.listeners = {
        status: function () {
        },
        income: function () {
        }
    };

    mailru.events.listen(mailru.app.events.paymentDialogStatus, function (event) {
        this.listeners.status(event);
    }.bind(this));

    mailru.events.listen(mailru.app.events.incomingPayment, function (event) {
        this.listeners.income(event);
    }.bind(this));

    callback(Platform.STATUS_CONNECTED);
};

MyMailRuPayments.prototype.calcLoadedPrice = function (price) {
    var loadedPrice = Math.floor(price * cleverapps.RUB_DISCOUNTED_RATE) + " млк";

    if (cleverapps.config.debugMode && price < 10) {
        loadedPrice = "1 млк";
    }

    return loadedPrice;
};

MyMailRuPayments.prototype.purchaseOpen = function (product, callback) {
    this.listeners.status = function (event) {
        console.log("PAYMENT DIALOG", event);

        if (event.status === "closed") {
            this.setCancelTimeout(500, callback);
        }
    }.bind(this);

    this.listeners.income = function (event) {
        console.log("INCOM", event);
        
        if (event.status === "success") {
            callback(cleverapps.CODE_SUCCEED, product);
        } else {
            callback(cleverapps.CODE_CANCELLED);
        }
    };

    cleverapps.platform.exitFullscreen(function () {
        mailru.app.payments.showDialog({
            service_id: product.id.mymailru,
            service_name: product.title,
            mailiki_price: parseInt(product.loadedPrice)
        });
    });
};

MyMailRuPayments.isAppropriate = function () {
    return cleverapps.platform instanceof MyMailRu;
};
