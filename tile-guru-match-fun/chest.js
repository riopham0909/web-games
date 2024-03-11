/**
 * Created by andrey on 01.06.17.
 */

cleverapps.Chest = function (options) {
    this.locked = false;

    this.changeLockedListener = function () {
    };

    this.storage = options.storage;
    this.serverTaskName = options.serverTaskName;

    if (options.isNewUser) {
        this.initializeForNewUser();
        this.save();
    } else {
        this.load();
    }
};

cleverapps.Chest.prototype.fromJSON = function (data) {
    this.locked = data;
};

cleverapps.Chest.prototype.toJSON = function () {
    return this.locked;
};

cleverapps.Chest.prototype.load = function () {
    var data = cleverapps.DataLoader.load(this.storage);

    if (data === undefined) {
        this.initializeForNewUser();
        this.save();
    } else {
        this.fromJSON(data);
    }
};

cleverapps.Chest.prototype.save = function (updateServer) {
    cleverapps.DataLoader.save(this.storage, this.toJSON());

    if (this.serverTaskName) {
        if (updateServer !== false) cleverapps.synchronizer.addUpdateTask(this.serverTaskName);
    }
};

cleverapps.Chest.prototype.initializeForNewUser = function () {
    this.locked = false;
};

cleverapps.Chest.prototype.unlock = function () {
    this.locked = false;
    this.changeLockedListener();
};

cleverapps.Chest.prototype.open = function () {
    this.locked = true;
    this.changeLockedListener();
};