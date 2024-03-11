/**
 * Created by vladislav on 03.09.2019
 */

var Lantern = function (mission) {
    this.mission = mission;

    this.load();
};

Lantern.prototype.isActive = function (level) {
    return level ? level.isCurrentLevel() : levels.user.isCurrentLevel(cleverapps.environment.levelNo, cleverapps.environment.episodeNo);
};

Lantern.getMaxStreak = function () {
    return 3;
};

Lantern.prototype.save = function () {
    this.mission.result = 0;
    this.mission.update(this.streak);
};

Lantern.prototype.load = function () {
    this.streak = this.mission.result;
    this.savedStreak = this.streak;
};

Lantern.prototype.getCurrentStreak = function () {
    return this.savedStreak;
};

Lantern.prototype.restoreSavedStreak = function () {
    this.streak = this.savedStreak;
    this.save();
};

Lantern.prototype.onStart = function () {
    this.savedStreak = this.streak;
    this.streak = 0;
    this.save();
};

Lantern.prototype.onWin = function () {
    this.streak = Math.min(this.savedStreak + 1, Lantern.getMaxStreak());
    this.savedStreak = this.streak;
    this.save();
};

Lantern.prototype.onLose = function () {
    this.streak = 0;
    this.savedStreak = 0;
    this.save();
};

Lantern.Get = function () { 
    var lanternMission = cleverapps.missionManager.findRunningMission(Mission.TYPE_LANTERN);
    return lanternMission && lanternMission.logic.lantern;
};

Lantern.IsActive = function (level) {
    var lantern = Lantern.Get();
    return lantern && lantern.isActive(level);
};

Lantern.GetStreak = function (level) {
    var lantern = Lantern.Get();
    return lantern && lantern.isActive(level) && lantern.streak > 0 ? lantern.streak : 0;
};

Lantern.GetBoosterBonus = function (level, booster) {
    var lantern = Lantern.Get();
    var boosters = cleverapps.boosters.listBoostersBefore();
    var index = boosters.indexOf(booster);
    if (lantern && lantern.isActive(level) && lantern.getCurrentStreak() > index) {
        return 1;
    }
    return 0;
};