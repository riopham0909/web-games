/**
 * Created by iamso on 03.06.21
 */

var LivesFeast = function (mission, isNewMission) {
    this.mission = mission;

    if (isNewMission) {
        Game.currentGame.pixelsPlanner.restart();
    }
};

var SoftFeast = function (mission, isNewMission) {
    this.mission = mission;

    if (isNewMission) {
        Game.currentGame.pixelsPlanner.restart();
    }
};

var KrakenFeast = function (mission, isNewMission) {
    this.mission = mission;

    if (isNewMission) {
        Game.currentGame.monstersPlanner.spawnToAllSlots(true);
    }
};

KrakenFeast.prototype.stop = function () {
    if (Game.currentGame && MissionManager.hasProperParent(this.mission)) {
        Game.currentGame.monstersPlanner.stop();
        Game.currentGame.quests.applyDynamicFilter();
    }
};
