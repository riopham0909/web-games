/**
 * Created by andrey on 15.05.17.
 */

levels.GameHints = function () {
    var save = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.LEVEL_HINTS);
    this.usedHints = typeof save === "number" ? save : 0;
};

levels.GameHints.prototype.reset = function () {
    if (this.isCurrentLevel()) {
        this.usedHints = 0;
        this.save();
    }
};

levels.GameHints.prototype.isCurrentLevel = function () {
    return Game.currentGame && Game.currentGame.level.isCurrentLevel();
};

levels.GameHints.prototype.addHint = function () {
    if (this.isCurrentLevel()) {
        this.usedHints++;
        this.save();
    }
};

levels.GameHints.prototype.save = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.LEVEL_HINTS, this.usedHints);
};