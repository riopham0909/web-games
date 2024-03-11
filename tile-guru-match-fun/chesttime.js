/**
 * Created by r4zi4l on 22.07.2021
 */

var ChestTime = function (mission) {
    this.mission = mission;
};

ChestTime.prototype.onAdded = function () {
    this.forEachChest(function (chest) {
        chest.onUpdateState();
    });
};

ChestTime.prototype.canRemoveSilently = function () {
    return true;
};

ChestTime.prototype.stop = function () {
    this.forEachChest(function (chest) {
        if (!Chest.AlwaysWithEnergy(chest.unit)) {
            chest.onUpdateState();
        }
    });
};

ChestTime.prototype.forEachChest = function (callback) {
    if (Game.currentGame) {
        Game.currentGame.map.listAvailableUnits().forEach(function (unit) {
            var chest = unit.findComponent(Chest);
            if (chest) {
                callback(chest);
            }
        });
    }
};