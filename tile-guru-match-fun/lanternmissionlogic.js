/**
 * Created by vladislav on 25.02.2020
 */

var LanternMissionLogic = function (mission) {
    this.mission = mission;
    this.lantern = new Lantern(mission);
};