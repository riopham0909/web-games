/**
 * Created by vladislav on 04/04/2022
 */

var Caravan = function (mission, isNewMission) {
    this.mission = mission;

    if (!isNewMission) {
        return;
    }

    var unit = Game.currentGame.shipsPlanner.spawnUnit();
    if (!unit) {
        return;
    }

    var unitStory = Game.currentGame.unitStories.findStory(Unit.GetKey(unit));
    if (!unitStory) {
        return;
    }

    this.unitStory = {
        story: unitStory,
        unit: unit
    };
};

Caravan.prototype.buyProduct = function (product) {
    product.onBuyed();
};

Caravan.prototype.beforeRemove = function () {
    if (Game.currentGame) {
        Game.currentGame.shipsPlanner.removeUnit();
    }
};

Caravan.PRODUCTS = ["caravan0", "caravan1", "caravan2"];