/**
 * Created by iamso on 24.04.19.
 */

var BuyEnergyTileModel = function (data) {
    TileModel.call(this, data);

    this.timeout = this.product.timeout || 0;
    this.buyTimeEnergyProducts = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.ENERGY_PRODUCTS) || {};

    if (cleverapps.config.debugMode && this.timeout) {
        this.timeout = cleverapps.parseInterval("5 minutes");
    }
};

BuyEnergyTileModel.prototype = Object.create(TileModel.prototype);
BuyEnergyTileModel.prototype.constructor = BuyEnergyTileModel;

BuyEnergyTileModel.prototype.getTitle = function () {
    return Messages.getLocalized(this.product.title, {
        restoreAmount: this.getRestoreAmount()
    });
};

BuyEnergyTileModel.prototype.isEnabled = function () {
    if (!this.isAvailable()) {
        return true;
    }
    return this.checkDisabledProducts();
};

BuyEnergyTileModel.prototype.getRestoreAmount = function () {
    return this.product.reward;
};

BuyEnergyTileModel.prototype.isAvailable = function () {
    return this.product.price === 0 || Date.now() >= this.getNextBuyTime();
};

BuyEnergyTileModel.prototype.getBadge = function () {
    if (this.badge) {
        return this.badge;
    }

    if (this.product.price && this.product.discount) {
        return {
            type: "discount",
            text: this.product.discount
        };
    }
};

BuyEnergyTileModel.prototype.getProductDescription = function () {
    return {
        text: "BuyEnergyProduct.description",
        countdown: Math.max(0, this.getNextBuyTime() - Date.now())
    };
};

BuyEnergyTileModel.prototype.getNextBuyTime = function () {
    return this.timeout + (this.buyTimeEnergyProducts[this.product.key + cleverapps.lives.slot] || 0);
};

BuyEnergyTileModel.prototype.buy = function (closeShopCallback) {
    if (!this.isAvailable()) {
        return false;
    }

    if (cleverapps.user.spendSoft(cleverapps.EVENTS.SPENT.LIVES, this.product.price, { source: this.onGetView() })) {
        if (this.product.price !== 0 && this.timeout) {
            this.buyTimeEnergyProducts[this.product.key + cleverapps.lives.slot] = Date.now();
            cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.ENERGY_PRODUCTS, this.buyTimeEnergyProducts);
        }

        this.product.logBuyItem();

        if (cleverapps.forces.isRunningForce()) {
            cleverapps.forces.closeRunningForce();
        }
        new RewardWindow({ energy: this.getRestoreAmount() }, { event: "buy_soft", softPrice: this.product.price });
        closeShopCallback();
        return true;
    }

    return false;
};
