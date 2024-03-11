/**
 * Created by spepa on 20.12.2022
 */

var PeriodicSaleLogic = function (mission, isNewMission) {
    this.mission = mission;

    if (isNewMission) {
        cleverapps.forces.clearForce(Forces.PERIODIC_SALE.id);
    }
};

PeriodicSaleLogic.prototype.getLots = function () {
    var packs = RewardsConfig.PeriodicBonusSale;

    var payerClass = this.mission.details.payer;
    if (payerClass === undefined) {
        payerClass = cleverapps.paymentsHistory.classify();
        if (payerClass === cleverapps.PaymentsHistory.BRACKET_UNDECIDED) {
            payerClass = cleverapps.PaymentsHistory.BRACKET_NONE;
        }
        payerClass = Math.min(payerClass, packs.length - 2);
        this.mission.update(0, { payer: payerClass });
    }

    return packs.slice(payerClass, payerClass + 2);
};

PeriodicSaleLogic.prototype.isSoldLot = function (lotId) {
    return this.mission.result & (1 << lotId);
};

PeriodicSaleLogic.prototype.countSoldLots = function () {
    return this.getLots().filter(function (lot) {
        return this.isSoldLot(lot.id);
    }.bind(this)).length;
};

PeriodicSaleLogic.prototype.isAllSold = function () {
    return this.getLots().length === this.countSoldLots();
};

PeriodicSaleLogic.prototype.lotBought = function (lotId) {
    var newValue = this.mission.result ^ (1 << lotId);
    var delta = newValue - this.mission.result;
    this.mission.update(delta);
};

PeriodicSaleLogic.prototype.isAvailable = function () {
    return !cleverapps.flags.videoAdsMainMonetization;
};

PeriodicSaleLogic.FindProductLot = function (productId) {
    var sale = cleverapps.missionManager.findByType(Mission.TYPE_PERIODIC_SALE);
    if (sale && sale.isAvailable() && sale.isRunning()) {
        var lots = sale.logic.getLots();
        var hasEnergy = lots.some(function (lot) {
            return lot.reward.energy;
        });

        if (!hasEnergy || cleverapps.travelBook.getCurrentPage().withEnergy()) {
            return lots.find(function (lot) {
                return lot.product === productId && !sale.logic.isSoldLot(lot.id);
            });
        }
    }
};

PeriodicSaleLogic.NeedTileDecor = function (tileModel) {
    return PeriodicSaleLogic.FindProductLot(tileModel.product.key) !== undefined;
};

PeriodicSaleLogic.addProductBonus = function (product) {
    var lot = PeriodicSaleLogic.FindProductLot(product.key);
    if (lot) {
        cleverapps.missionManager.findByType(Mission.TYPE_PERIODIC_SALE).logic.lotBought(lot.id);
        return Product.AddUpRewards(product.reward, cleverapps.clone(lot.reward));
    }
};

PeriodicSaleLogic.TileDecorGenerator = function (product) {
    var lot = PeriodicSaleLogic.FindProductLot(product.key);
    var styles = cleverapps.styles.Decorators.shop_bonusSale_decor.content;

    return new RewardsListComponent(lot.reward, {
        columns: 2,
        noPrefix: true,
        small: true,
        font: cleverapps.styles.FONTS.BONUSSALE_REWARDS,
        textDirection: cleverapps.UI.HORIZONTAL,
        margin: styles.margin,
        textMargin: styles.textMargin,
        iconWrap: styles.iconWrap
    });
};
