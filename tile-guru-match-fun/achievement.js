/**
 * Created by spepa on 10.04.2023
 */

var Achievement = function (data, completed) {
    this.type = data.type;
    this.config = data;
    this.completed = Boolean(completed);
};

Achievement.prototype.complete = function () {
    if (!this.completed) {
        this.completed = true;
        this.save();
        cleverapps.social.markAchievement(this.config);
    }
};

Achievement.prototype.isComplete = function () {
    return this.completed; 
};

Achievement.prototype.getConfig = function () {
    return this.config;
};

Achievement.prototype.save = function () {
    cleverapps.achievements.save();
};

Achievement.prototype.getIcon = function () {
    return new cc.Sprite(bundles.achievements.frames[this.config.title]);
};

Achievement.prototype.getTitle = function () {
    return Messages.get("Achievements." + this.config.title + ".title");
};

Achievement.prototype.getDescription = function () {
    return Messages.get("Achievements." + this.config.title + ".description");
};