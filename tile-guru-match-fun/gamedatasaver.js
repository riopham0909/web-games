/**
 * Created by andrey on 21.12.2021.
 */

var GameDataSaver = function (key) {
    this.key = key;
};

GameDataSaver.prototype.save = function (data) {
    var current = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.GAME_DATA) || {};
    current[this.key] = data;
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.GAME_DATA, current);
};

GameDataSaver.prototype.load = function () {
    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.GAME_DATA);
    return data && data[this.key];
};

GameDataSaver.prototype.add = function (data) {
    var current = this.load() || {};
    current = Object.assign({}, current, data);
    this.save(current);
};

GameDataSaver.prototype.clear = function () {
    this.save();
};

GameDataSaver.prototype.loadAndClear = function () {
    var data = this.load();
    if (data) {
        this.clear();
    }
    return data;
};

GameDataSaver.Reset = function () {
    cleverapps.DataLoader.remove(cleverapps.DataLoaderTypes.GAME_DATA);
};

GameDataSaver.Create = function (key) {
    var slot = Game.currentGame && Game.currentGame.slot || CustomSyncers.SLOT_MAIN;
    return new GameDataSaver(key + slot);
};