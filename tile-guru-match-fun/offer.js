/**
 * Created by r4zi4l on 04.05.2022
 */

var Offer = function (offerType) {
    var data = Offers[offerType];

    this.type = data.type;
    this.mission = data.mission;
    this.hero = data.hero;
    this.product = data.product;
    this.force = data.force;
    this.price = data.price;
    this.reward = data.reward;

    this.sideBarJson = data.sideBarJson;
    this.name = data.name;
    this.bundle = data.bundle;

    this.onBought = function () {};
};

Offer.prototype.getPriceText = function () {
    if (this.product) {
        var product = Product.Create(this.product);
        return product.getCurrentPrice();
    }
    return "$$" + this.price;
};

Offer.prototype.hasProperMission = function () {
    var type = Mission.GetParentType(this.mission) || Mission.GetChildType(this.mission);
    var mission = Missions[type];

    if (!mission) {
        return false;
    }

    var expedition = cleverapps.travelBook.getCurrentExpedition();

    return expedition
        ? expedition.missionType === type
        : !cleverapps.travelBook.getPageById(mission.id);
};

Offer.prototype.getTimeLeft = function () {
    var mission = cleverapps.missionManager.findByType(this.mission);
    return mission && mission.getTimeLeft() || 0;
};

Offer.prototype.buy = function () {
    if (this.reward.unit) {
        var unitsAmount = this.reward.unit.reduce(function (sum, unit) {
            return sum + (unit.amount || 0);
        }, 0);

        var notEnough = unitsAmount - Game.currentGame.map.countEmptySlots();
        if (notEnough > 0) {
            Game.currentGame.centerHint.createTextHint("Spawn.nospace", { left: notEnough });
            return;
        }
    }

    var processBought = function () {
        if (!this.product) {
            new RewardWindow(this.reward);
        }

        var mission = cleverapps.missionManager.findByType(this.mission);
        if (mission && mission.logic && mission.logic.offerBought) {
            mission.logic.offerBought();
        }

        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.OFFER_PURCHASE_TIME + this.type, Date.now());
        cleverapps.offerManager.refreshOffer(this.type);

        this.onBought();
    }.bind(this);

    var event = cleverapps.EVENTS.SPENT.MISSION_OFFER + this.name;

    if (this.product) {
        var product = Product.Create(this.product);
        product.reward = this.reward;
        product.buy(function (success) {
            if (success) {
                cleverapps.eventLogger.logEvent(event);
                processBought();
            }
        });
        return;
    }

    if (cleverapps.user.spendHard(event, this.price)) {
        processBought();
    }
};

Offer.GetRestoreReward = function (product) {
    var offer = cleverapps.offerManager.findOffer({ product: product.key });
    if (!offer) {
        return;
    }

    var reward = cleverapps.clone(offer.reward, true);

    if (reward.unit) {
        var expeditionMission = cleverapps.missionManager.findByType(offer.mission);
        var level = Game.currentGame && Game.currentGame.level;

        var units = [];
        var pocketUnits = [];

        cleverapps.toArray(reward.unit).forEach(function (unit) {
            if (level && level.families[unit.code]) {
                units.push(unit);
            } else if (expeditionMission) {
                pocketUnits.push(unit);
            }
        });

        if (expeditionMission && pocketUnits.length) {
            var pocket = new Pocket(expeditionMission.slot);
            pocket.addUnits(pocketUnits);
        }

        delete reward.unit;
        if (units.length) {
            reward.unit = units;
        }
    }

    if (Object.keys(reward).length) {
        return reward;
    }
};

Offer.OnRestoreSuccess = function (product) {
    var offer = cleverapps.offerManager.findOffer({ product: product.key });
    if (offer) {
        cleverapps.offerManager.refreshOffer(offer.type);
    }
};
