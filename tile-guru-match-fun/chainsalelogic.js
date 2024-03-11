/**
 * Created by olga on 24.01.2024
 */

var ChainSaleLogic = function (mission, isNewMission) {
    this.mission = mission;
    this.packs = RewardsConfig.ChainSale;

    if (isNewMission) {
        cleverapps.forces.clearForce(Forces.CHAIN_SALE.id);
    }

    this.checkIfComplete();
};

ChainSaleLogic.prototype.lotBought = function () {
    this.mission.increaseResult(1);
    this.checkIfComplete();
};

ChainSaleLogic.prototype.checkIfComplete = function () {
    if (this.isAllSold()) {
        this.mission.complete();
    }
};

ChainSaleLogic.prototype.getStage = function () {
    return this.mission.result; 
};

ChainSaleLogic.prototype.canRemoveSilently = function () {
    return true;
};

ChainSaleLogic.prototype.skipNext = function () {
    return this.mission.iconForce && !cleverapps.forces.isShown(this.mission.iconForce.id);
};

ChainSaleLogic.prototype.currentLots = function () {
    var stage = this.getStage();
    var stages = [];

    for (var i = stage; i < stage + ChainSaleLogic.VISIBLE_LOTS; i++) {
        if (this.packs[i]) {
            stages.push(i);
        }
    }
    return stages;
};

ChainSaleLogic.prototype.isLast = function (stage) {
    return stage === this.packs.length - 1;
};

ChainSaleLogic.prototype.isOpened = function (stage) {
    return stage <= this.getStage();
};

ChainSaleLogic.prototype.isSold = function (stage) {
    return stage < this.getStage();
};

ChainSaleLogic.prototype.getReward = function (stage) {
    return this.packs[stage].reward;
};

ChainSaleLogic.prototype.getProduct = function (stage) {
    return this.packs[stage].product;
};

ChainSaleLogic.prototype.isAvailable = function () {
    return !cleverapps.flags.videoAdsMainMonetization;
};

ChainSaleLogic.prototype.isAllSold = function () {
    return this.currentLots().length === 0;
};

ChainSaleLogic.VISIBLE_LOTS = 3;
