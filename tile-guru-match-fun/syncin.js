/**
 * Created by slava on 4/12/17.
 */

cleverapps.SyncIn = function () {
};

cleverapps.SyncIn.prototype.executeSync = function (sync) {
    if (cleverapps.synchronizer._clientSessionExpired) {
        cleverapps.DataLoader.resetClientSession();
        cleverapps.synchronizer._clientSessionExpired = false;
    }
    cleverapps.synchronizer._syncOut.reset();

    // if (cleverapps.config.debugMode) {
    //     cleverapps.throwAsync({ group: "SyncIn.executeSync", message: cleverapps.platform.getUserID() + " " + JSON.stringify(Object.keys(sync)) });
    // }

    for (var type in sync) {
        var data = sync[type];

        // if (cleverapps.config.debugMode) {
        //     cleverapps.throwAsync({ group: "SyncIn.executeSync", message: cleverapps.platform.getUserID() + " " + type + " - " + JSON.stringify(data) });
        // }

        var processor = CustomSyncers.importerData[type];
        if (!processor) {
            console.log("No importer for " + type);
        } else {
            processor(data);
        }
    }

    GameDataSaver.Reset();

    cleverapps.DataLoader.processSaveQueue();

    cleverapps.localPushes.reset();

    cleverapps.abTest.updateGroups();
};

cleverapps.SyncIn.prototype.needShowReloadWindow = function () {
    return cleverapps.synchronizer._loadedSync;
};

cleverapps.SyncIn.prototype.isReloadInProcess = function () {
    return this._reloadInProgress;
};

cleverapps.SyncIn.prototype.reloadAction = function (f) {
    this._reloadInProgress = true;

    new ReloadWindow(function () {
        if (this.needShowReloadWindow()) {
            this.executeSync(cleverapps.synchronizer._loadedSync);

            cleverapps.synchronizer.on();

            cleverapps.scenes.sceneRefresh();

            this._reloadInProgress = false;
        }

        f();
    }.bind(this));
};

cleverapps.SyncIn.prototype.distractToReloadWindow = function () {
    if (cleverapps.config.wysiwygMode) {
        return;
    }

    cleverapps.meta.distract({
        focus: "ReloadWindow",
        action: function (f) {
            this.reloadAction(f);
        }.bind(this)
    });
};

cleverapps.SyncIn.prototype.showReloadWindow = function () {
    if (cleverapps.config.wysiwygMode) {
        return;
    }

    cleverapps.meta.display({
        focus: "ReloadWindow",
        action: function (f) {
            this.reloadAction(f);
        }.bind(this)
    });
};

cleverapps.SyncIn.prototype.process = function () {
    if (!cleverapps.allInitialized) {
        this.executeSync(cleverapps.synchronizer._loadedSync);
        cleverapps.synchronizer.on();
    } else if (!cleverapps.meta.isFocused()) {
        this.showReloadWindow();
    } else if (!this.isReloadInProcess() && !cleverapps.windows.findWindow(FbConnectWindow)) {
        this.distractToReloadWindow();
    }
};
