/**
 * Created by slava on 4/21/17.
 */

var TestPayments = function () {
    Payments.call(this);
};

TestPayments.prototype = Object.create(Payments.prototype);
TestPayments.prototype.constructor = TestPayments;

TestPayments.prototype.purchase = function (product, callback) {
    setTimeout(function () {
        if (confirm(Messages.get("FakePayments.Buying") + " " + product.title + " for " + product.price)) {
            setTimeout(function () {
                callback(cleverapps.CODE_SUCCEED);
            }, TestPayments.PROCESS_TIMEOUT);
        } else {
            setTimeout(function () {
                console.log(Messages.get("FakePayments.Cancelled"));
                callback(cleverapps.CODE_CANCELLED);
            }, TestPayments.PROCESS_TIMEOUT);
        }
    }, 1000);
};

TestPayments.prototype.validate = function (purchase, callback) {
    setTimeout(function () {
        callback(cleverapps.CODE_SUCCEED, purchase);
    }, 1000);
};

TestPayments.prototype.restore = function (callback) {
    callback(cleverapps.CODE_FAILED);
    // var productId = "addMoves";
    // this.restoreProduct = Product.Create(productId);
    // this.restorePurchase = Product.Create(productId);
    // this.restorePurchase.restore = true;
};

TestPayments.isAppropriate = function () {
    return TestSocial.isAppropriate();
};

TestPayments.PROCESS_TIMEOUT = 0;