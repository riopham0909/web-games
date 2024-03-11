/**
 * Created by andrey on 15.05.17.
 */

cleverapps.ServerFlags = function() {
    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.SERVER_FLAGS);
    if (!data) {
        this.flags = [];
    } else {
        this.flags = data;
    }
};

cleverapps.ServerFlags.prototype.reset = function() {
    this.flags = [];
    this.save();
};

cleverapps.ServerFlags.prototype.hasFlag = function (flag) {
    return this.flags.indexOf(flag) >= 0;
};

cleverapps.ServerFlags.prototype.setFlag = function (flag) {
    if (!this.hasFlag(flag)) {
        this.flags.push(flag);
        this.save();
    }
};

cleverapps.ServerFlags.prototype.clearFlag = function (flag) {
    var index = this.flags.indexOf(flag);
    if (index !== -1) {
        this.flags.splice(index, 1);
        this.save();
    }
};

cleverapps.ServerFlags.prototype.getInfo = function () {
    return this.flags;
};

cleverapps.ServerFlags.prototype.updateInfo = function (data, fromServer) {
    this.flags = data;
    this.save(fromServer);
};

cleverapps.ServerFlags.prototype.save = function (fromServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.SERVER_FLAGS, this.flags);

    if (!fromServer) {
        cleverapps.synchronizer.addUpdateTask("serverflags");
    }
};

cleverapps.ServerFlags.PAGE_LIKED = 2;
cleverapps.ServerFlags.EXPEDITION_COMPENSATION = 5;
