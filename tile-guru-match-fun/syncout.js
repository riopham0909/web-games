/**
 * Created by slava on 4/12/17.
 */

cleverapps.SyncOut = function () {
    this.task = {};
    this.currentTask = {};
    this.onTasksEmptyListener = function () {};
    this.inProgress = false;
    this.sendNextUpdate = cleverapps.accumulate(cleverapps.SyncOut.FAST_ACCUMULATE_TIMEOUT, this._sendUpdateInner.bind(this));

    var syncKeys = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.SYNC) || [];
    syncKeys.forEach(function (type) {
        if (!CustomSyncers.extractors[type]) {
            return;
        }
        this.task[type] = true;
    }, this);
};

cleverapps.SyncOut.prototype.getAccumulateTimeout = function () {
    var payer = cleverapps.paymentsHistory.isPayer();
    var newbie = cleverapps.user.registered + cleverapps.parseInterval("3 days") > Date.now();

    var timeout = cleverapps.SyncOut.MEDIUM_ACCUMULATE_TIMEOUT;
    if (cleverapps.config.debugMode || payer || newbie) {
        timeout = cleverapps.SyncOut.FAST_ACCUMULATE_TIMEOUT;
    } else if (cleverapps.synchronizer._zeroSession || cleverapps.platform.oneOf(GDCom)) {
        timeout = cleverapps.SyncOut.SLOW_ACCUMULATE_TIMEOUT;
    }

    return timeout;
};

cleverapps.SyncOut.prototype.run = function () {
    this.sendNextUpdate();
};

cleverapps.SyncOut.prototype.save = function () {
    var totalTasks = Object.assign(this.currentTask, this.task);
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.SYNC, Object.keys(totalTasks));
};

cleverapps.SyncOut.prototype.reset = function () {
    this.task = {};
    this.currentTask = {};
    this.save();
};

cleverapps.SyncOut.prototype.nextTask = function () {
    this.currentTask = this.task;
    this.task = {};
};

cleverapps.SyncOut.prototype.addUpdateTask = function (type) {
    if (!CustomSyncers.extractors[type] || this.task[type] || cleverapps.userDelete.isPlanned()) {
        return;
    }

    this.task[type] = true;
    this.save();

    if (!cleverapps.synchronizer.synced || !cleverapps.allInitialized) {
        return;
    }

    this.sendNextUpdate();
};

cleverapps.SyncOut.prototype.onSuccess = function (response) {
    this.inProgress = false;
    
    if (!cleverapps.synchronizer.synced) {
        return;
    }

    if (response.error && response.error === cleverapps.Synchronizer.SESSION_EXPIRED) {
        console.log("onUpdate: session needs renewal");
        cleverapps.synchronizer.reset();
        cleverapps.synchronizer.syncWhenReady();
        return;
    }

    if (response === 0) {
        // TODO: ???
        console.log("error saving object");
    }

    // console.log("Success: ", response);
    this.currentTask = {};
    this.save();

    cleverapps.synchronizer._onSyncOutCompleted();

    this.sendNextUpdate();
};

cleverapps.SyncOut.prototype.onFailure = function (code) {
    this.inProgress = false;

    if (!cleverapps.synchronizer.synced) {
        return;
    }

    console.log("Failure: ", code);

    this.task = Object.assign(this.currentTask, this.task);
    this.currentTask = {};

    cleverapps.synchronizer._onSyncOutCompleted();

    setTimeout(this.sendNextUpdate.bind(this), cleverapps.SyncOut.RETRY_TIMEOUT);
};

cleverapps.SyncOut.prototype._sendUpdateInner = function () {
    cleverapps.DataLoader.onSaved(function () {
        if (this.inProgress) {
            return;
        }

        if (!cleverapps.synchronizer.synced || cleverapps.userDelete.isDeleted()) {
            return;
        }

        cleverapps.DataLoader.checkClientSession();

        if (cleverapps.synchronizer._clientSessionExpired) {
            return;
        }

        this.nextTask();
        if (Object.keys(this.currentTask).length === 0) {
            this.onTasksEmptyListener();
            return;
        }

        var sendValue = {};
        for (var type in this.currentTask) {
            var task = CustomSyncers.extractors[type]();
            sendValue[type] = task;
        }

        this.inProgress = true;

        console.log("Sending update ", sendValue);

        sendValue.version = cleverapps.config.version;

        cleverapps.RestClient.post(cleverapps.synchronizer._getPath("sync"), sendValue, this.onSuccess.bind(this), this.onFailure.bind(this));

        var sendValueLength = JSON.stringify(sendValue).length;
        if (sendValueLength > 65536) {
            var keyLengths = Object.keys(sendValue).map(function (key) {
                return key + " - " + JSON.stringify(sendValue[key]).length;
            }).join(", ");

            cleverapps.throwAsync("synchronizer sync entity too large - " + sendValueLength + ", " + keyLengths);
        }
    }.bind(this));

    this.sendNextUpdate = cleverapps.accumulate(this.getAccumulateTimeout(), this._sendUpdateInner.bind(this));
};

cleverapps.SyncOut.prototype.sendAllData = function () {
    for (var type in CustomSyncers.extractors) {
        this.addUpdateTask(type);
    }
};

cleverapps.SyncOut.prototype.getAllData = function () {
    try {
        var data = {};
        for (var type in CustomSyncers.extractors) {
            data[type] = CustomSyncers.extractors[type] && CustomSyncers.extractors[type]();
        }
        return data;
    } catch (e) {
        cleverapps.throwAsync("SyncOut.getAllData error", e);
    }
};

cleverapps.SyncOut.prototype.process = function () {
    if (!cleverapps.userDelete.isPlanned()) {
        for (var type in CustomSyncers.extractors) {
            this.task[type] = true;
        }
    }
    cleverapps.synchronizer.on();
};

cleverapps.SyncOut.RETRY_TIMEOUT = 60000;

cleverapps.SyncOut.FAST_ACCUMULATE_TIMEOUT = 2000;
cleverapps.SyncOut.MEDIUM_ACCUMULATE_TIMEOUT = 10000;
cleverapps.SyncOut.SLOW_ACCUMULATE_TIMEOUT = 60000;
