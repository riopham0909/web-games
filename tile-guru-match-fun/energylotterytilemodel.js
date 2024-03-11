/**
 * Created by r4zi4l on 18.03.2021
 */

var EnergyLotteryTileModel = function (data) {
    TileModel.call(this, data);

    if (Game.currentGame.energyLottery && Game.currentGame.energyLottery.isAvailable()) {
        Game.currentGame.energyLottery.onLotteryTileChanged = this.updateModelState.bind(this);
    }
};

EnergyLotteryTileModel.prototype = Object.create(TileModel.prototype);
EnergyLotteryTileModel.prototype.constructor = EnergyLotteryTileModel;

EnergyLotteryTileModel.prototype.getTitle = function () {
    return Messages.getLocalized(this.product.title, {
        restoreAmount: Game.currentGame.energyLottery.maxValue()
    });
};

EnergyLotteryTileModel.prototype.getCurrentPrice = function () {
    return "Claim";
};

EnergyLotteryTileModel.prototype.getDisabledPrice = function () {
    if (!Game.currentGame.energyLottery.isAvailable()) {
        return Messages.get("TileShop.tile.level", {
            level: cleverapps.humanReadableNumber({ floatLevel: EnergyLottery.AVAILABLE.level })
        });
    }
    return "Claimed";
};

EnergyLotteryTileModel.prototype.isAvailable = function () {
    return Game.currentGame.energyLottery && Game.currentGame.energyLottery.isReady();
};

EnergyLotteryTileModel.prototype.getProductDescription = function () {
    return {
        text: "EnergyLotteryProduct.description",
        countdown: Game.currentGame.energyLottery.getTimeLeft()
    };
};

EnergyLotteryTileModel.prototype.buy = function () {
    if (!this.isAvailable()) {
        return false;
    }

    if (["wondermerge", "fairy"].indexOf(cleverapps.config.name) !== -1) {
        new WheelLotteryWindow(Game.currentGame.energyLottery);
    } else {
        new EnergyLotteryWindow(Game.currentGame.energyLottery);
    }
    return true;
};
