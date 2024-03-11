/**
 * Created by olga on 27.02.2023
 */

var VirtualProduct = function (data) {
    Product.call(this, data);
};

VirtualProduct.prototype = Object.create(Product.prototype);
VirtualProduct.prototype.constructor = VirtualProduct;

VirtualProduct.prototype.getCurrentPrice = function () {
    return this.currency === "hard" ? "$$" + this.price : "@@" + this.price;
};

VirtualProduct.prototype.buy = function (closeShopCallback) {
    var spendCurrency = this.currency === "hard" ? levels.user.spendHard : levels.user.spendSoft;
    var eventName = this.currency === "hard" ? "buy_hard" : "buy_soft";

    if (spendCurrency.call(levels.user, this.spentEvent, this.price)) {
        new RewardWindow(this.reward, { event: eventName });

        cleverapps.audio.playSound(bundles.main.urls.shop_buy_effect);
        closeShopCallback(true);

        return true;
    }

    return false;
};
