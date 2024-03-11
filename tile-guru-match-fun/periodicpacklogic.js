/**
 * Created by spepa on 19.12.2022
 */

var PeriodicPackLogic = function (mission, isNewMission) {
    this.mission = mission;

    if (isNewMission) {
        cleverapps.forces.clearForce(Forces.PERIODIC_PACK.id);
    }
};

PeriodicPackLogic.prototype.offerBought = function () {
    cleverapps.missionManager.remove(this.mission);
};