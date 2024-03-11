/**
 * Created by iamso on 24.04.19.
 */

var SoftCurrencyTileModel = function (data) {
    if (cleverapps.flags.softCurrencyRealProduct) {
        data = Product.Create(data.realProductId);
        this.realProduct = true;
    }

    TileModel.call(this, data);
};

SoftCurrencyTileModel.prototype = Object.create(TileModel.prototype);
SoftCurrencyTileModel.prototype.constructor = SoftCurrencyTileModel;

SoftCurrencyTileModel.prototype.getTitle = function () {
    if (this.realProduct) {
        return this.product.title;
    }
    return Messages.getLocalized(this.product.title, {
        amount: this.getReward()
    });
};

SoftCurrencyTileModel.prototype.buy = function (closeShopCallback) {
    if (this.realProduct) {
        return this.product.buy(function (success) {
            if (success) {
                this.product.logBuyItem();

                closeShopCallback();
            }
        }.bind(this));
    }

    if (levels.user.spendHard(cleverapps.EVENTS.SPENT.SOFT, this.getPrice())) {
        var soft = this.getReward();

        this.product.logBuyItem();

        if (cleverapps.meta.isFocused()) {
            new RewardWindow(soft);
        } else {
            cleverapps.meta.display({
                focus: "SoftCurrencyRewardWindow",
                action: function (f) {
                    new RewardWindow(soft);
                    cleverapps.meta.onceNoWindowsListener = f;
                }
            });
        }

        closeShopCallback();

        return true;
    }

    return false;
};