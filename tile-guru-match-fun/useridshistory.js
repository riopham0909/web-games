/**
 * Created by olga on 01.08.2023
 */
UserIdsHistory = function () {
    this.ids = [];
    this.diff = [];

    this.load();
    this.sendToServer();
};

UserIdsHistory.prototype.load = function () {
    var save = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.USER_IDS_HISTORY);

    if (save) {
        this.ids = save.ids || [];
        this.diff = save.diff || [];
    }
};

UserIdsHistory.prototype.add = function (id) {
    if (Platform.isTmpId(id) && cleverapps.user.getFloatLevel() === 0 && !cleverapps.paymentsHistory.isPayer()) {
        return;
    }

    if (id !== cleverapps.platform.getUserID() && !this.ids.includes(id)) {
        console.log("UserIdsHistory add", id);
        this.ids.push(id);
        this.diff.push(id);
        this.save();
        this.sendToServer();
    }
};

UserIdsHistory.prototype.sendToServer = function () {
    if (this.diff.length) {
        cleverapps.RestClient.post("/useridshistory/" + encodeURIComponent(cleverapps.platform.getUserID()), {
            ids: this.diff
        }, function () {
            console.log("UserIdsHistory send success");
            this.diff = [];
            this.save();
        }.bind((this)), function () {
            console.log("UserIdsHistory send failed");
        });
    }
};

UserIdsHistory.prototype.save = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.USER_IDS_HISTORY, {
        ids: this.ids,
        diff: this.diff
    });
};