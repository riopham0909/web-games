/**
 * Created by iamso on 30.08.2021
 */

var GrowthFundTileModel = function (data) {
    TileModel.call(this, data);

    cleverapps.growthFund.on("updateState", this.updateModelState.bind(this));
};

GrowthFundTileModel.prototype = Object.create(TileModel.prototype);
GrowthFundTileModel.prototype.constructor = GrowthFundTileModel;

GrowthFundTileModel.prototype.isAttention = function () {
    return cleverapps.growthFund && cleverapps.growthFund.needsAttention();
};

GrowthFundTileModel.prototype.isEnabled = function () {
    return cleverapps.growthFund && cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition()
        && (cleverapps.growthFund.isBought() || !cleverapps.flags.videoAdsMainMonetization);
};

GrowthFundTileModel.prototype.isAvailable = function () {
    return cleverapps.growthFund && cleverapps.growthFund.isActive(); 
};

GrowthFundTileModel.prototype.getProductDescription = function () {
    var msg = "";
    var toReplace = undefined;

    if (!cleverapps.growthFund.isBought()) {
        msg = "TileShop.growthFund.info";
    } else if (cleverapps.growthFund.findFirst(GrowthFund.STATE.READY)) {
        msg = "TileShop.growthFund.ready";
    } else {
        var nextLevel = cleverapps.growthFund.findFirst(GrowthFund.STATE.INSUFFICIENT);
        if (nextLevel) {
            msg = "TileShop.growthFund.reachLevel";
            toReplace = {
                level: nextLevel.levelNo + 1
            };
        } else {
            msg = "TileShop.growthFund.allReceived";
        }
    }

    return Messages.get(msg, toReplace);
};

GrowthFundTileModel.prototype.isSmall = function () {
    return false;
};

GrowthFundTileModel.prototype.getRewardsIcon = function () {
    if (cleverapps.config.name === "mergecraft") {
        return bundles.tile_shop.frames.growth_key;
    }
};