/**
 * Created by razial on 14.10.2022
 */

var UserDelete = function () {
    this.load();
};

UserDelete.prototype.load = function () {
    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.USER_DELETE) || {};
    this.planned = data.planned;
};

UserDelete.prototype.save = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.USER_DELETE, this.getInfo());
};

UserDelete.prototype.getInfo = function () {
    return {
        planned: this.planned
    };
};

UserDelete.prototype.updateInfo = function (data) {
    this.planned = data.planned;
    this.save();
};

UserDelete.prototype.updateDeleted = function (data) {
    this.deleted = data && data.deleted;
};

UserDelete.prototype.isAvailable = function () {
    if (cleverapps.platform.oneOf(IOS, MacOS)) {
        return cleverapps.social.isLoggedIn();
    }

    return cleverapps.config.debugMode;
};

UserDelete.prototype.startDeletion = function () {
    cleverapps.meta.distract({
        focus: "DeleteAccount",
        actions: [
            function (f) {
                cleverapps.windows.reset();
                cleverapps.scenes.replaceScene(new LoaderScene([], function () {}), f);
            },

            function (f) {
                cleverapps.user.incProgressCompare(100);
                cleverapps.synchronizer.addUpdateTask("userdelete");

                this.planned = Date.now() + this.getFullTime();
                this.save();

                this.checkDeletion(f);
            }.bind(this)
        ]
    });
};

UserDelete.prototype.cancelDeletion = function () {
    var waitWindow;

    cleverapps.meta.distract({
        focus: "CancelDeleteAccount",
        actions: [
            function (f) {
                waitWindow = new WaitWindow();

                cleverapps.synchronizer._onceNextSyncCompletedListener = cleverapps.waitNoMore(15000, cleverapps.once(f));
                cleverapps.synchronizer.syncWhenReady();
            },

            function (f) {
                waitWindow.close();

                this.planned = undefined;
                this.save();

                cleverapps.user.incProgressCompare(100);
                cleverapps.synchronizer.addUpdateTask("userdelete");

                this.checkDeletion(f);
            }.bind(this),

            function (f) {
                cleverapps.Plot.onStartup(f);
            }
        ]
    });
};

UserDelete.prototype.checkDeletion = function (f) {
    if (this.isDeleted()) {
        cleverapps.DataLoader.cleanAll();
        new DeleteAccountRestartWindow();
        return;
    }

    if (this.isPlanned()) {
        new DeleteAccountInformationWindow();
        return;
    }

    f();
};

UserDelete.prototype.getFullTime = function () {
    return cleverapps.config.debugMode ? cleverapps.parseInterval("5 minutes") : cleverapps.parseInterval("90 days");
};

UserDelete.prototype.getTimeLeft = function () {
    var timeLeft = this.planned - Date.now() || 0;
    return Math.max(0, timeLeft);
};

UserDelete.prototype.isDeleted = function () {
    return this.deleted > cleverapps.user.registered || this.planned <= Date.now();
};

UserDelete.prototype.isPlanned = function () {
    return this.planned > Date.now();
};
