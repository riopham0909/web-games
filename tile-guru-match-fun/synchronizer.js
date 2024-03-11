/**
 * Created by slava on 4/12/17.
 */

cleverapps.Synchronizer = function () {
    this._session = "a";
    var session = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.SESSION_SAVE_KEY, { raw: true });
    if (session !== null && session !== undefined) {
        this._session = session;
    }

    this._syncIn = new cleverapps.SyncIn();
    this._syncOut = new cleverapps.SyncOut();
    this._syncInProgress = false;
    this._needResync = false;
    this._syncId = 0;
    this._clientSessionExpired = false;
    this._clientChecksumDifferent = cleverapps.DataLoader.checksumMatch === false;

    this.lastSyncIn = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.LAST_SYNC_IN) || 0;

    if (cleverapps.isLocalhost() || cleverapps.config.debugMode) {
        delete this._clientChecksumDifferent;
    }

    this.synced = false;
    if (!cleverapps.DataLoader.checkClientSession()) {
        this.clientSessionExpired();
    }
};

cleverapps.Synchronizer.prototype.updateLastSyncIn = function () {
    this.lastSyncIn = Date.now();
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.LAST_SYNC_IN, this.lastSyncIn);
};

cleverapps.Synchronizer.prototype._startCheckInterval = function () {
    if (!this._checkIntervalRunned) {
        this._checkIntervalRunned = true;
        var minute = 0;
        setInterval(function () {
            minute++;
            if (!this.synced || minute % 15 === 0) {
                this.syncWhenReady();
            }
        }.bind(this), 60000);
        return true;
    }
    return false;
};

cleverapps.Synchronizer.prototype.needClientSessionExpiredWindow = function () {
    return this._clientSessionExpired;
};

cleverapps.Synchronizer.prototype.showClientSessionExpiredWindow = function () {
    cleverapps.meta.display({
        focus: "clientSessionExpired",
        action: function () {
            new RestartWindow({
                title: "ClientSessionExpired.title",
                contentMessage: "ClientSessionExpired.message"
            });
        }
    });
};

cleverapps.Synchronizer.prototype.clientSessionExpired = function () {
    if (!this._clientSessionExpired) {
        this.synced = false;
        this._clientSessionExpired = true;

        if (cleverapps.allInitialized) {
            if (!cleverapps.meta.isFocused()) {
                this.showClientSessionExpiredWindow();
            }
        }
    }
};

cleverapps.Synchronizer.prototype.reset = function () {
    this.synced = false;

    this._loadedSession = undefined;
    this._loadedSync = undefined;
    this._session = "a";
    this._syncInProgress = false;
    this._needResync = false;

    cleverapps.DataLoader.remove(cleverapps.DataLoaderTypes.SESSION_SAVE_KEY);
    this._syncOut.reset();
};

cleverapps.Synchronizer.prototype.isReady = function () {
    return !this._syncIn.isReloadInProcess() && !this._syncInProgress && !this._inGetProgress;
};

cleverapps.Synchronizer.prototype.syncWhenReady = function () {
    if (this._syncIn.isReloadInProcess()) {
        return;
    }

    cleverapps.DataLoader.checkClientSession();

    if (!this._syncInProgress) {
        this._sync();
    } else {
        this._needResync = true;
    }
};

cleverapps.Synchronizer.prototype.addUpdateTask = function (type) {
    if (cleverapps.flags.norest) {
        return;
    }

    this._syncOut.addUpdateTask(type);
};

cleverapps.Synchronizer.prototype.on = function () {
    if (this._clientSessionExpired) {
        return;
    }

    if (this._loadedSession !== undefined) {
        this._session = this._loadedSession;
        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.SESSION_SAVE_KEY, this._session, { raw: true });
        cleverapps.DataLoader.processSaveQueue();
    }

    this._loadedSession = undefined;
    this._loadedSync = undefined;
    this.synced = true;

    this._syncOut.run();

    if (this._inGetProgress) {
        this._syncOut.sendAllData();
        this._syncOut.onTasksEmptyListener = function () {
            this._syncInProgress = false;
            this._inGetProgress = undefined;
        }.bind(this);
    }

    this._onSyncProcessed();

    if (this.onceSyncCompletedListener) {
        this.onceSyncCompletedListener();
        this.onceSyncCompletedListener = undefined;
    }

    if (this._needResync) {
        this._needResync = false;
        this.syncWhenReady();
    }
};

// inner functions

cleverapps.Synchronizer.prototype._getPath = function (path) {
    return "/" + path + "/" + encodeURIComponent(cleverapps.platform.getUserID()) + "/" + this._session;
};

cleverapps.Synchronizer.prototype._syncCallback = function (callback) {
    var syncId = this._syncId;
    return function () {
        if (this._syncId === syncId && !this._clientSessionExpired) {
            callback.apply(this, arguments);
        }
    }.bind(this);
};

cleverapps.Synchronizer.prototype.getProgress = function (fromId, options) {
    var path = "/getprogress/" + encodeURIComponent(cleverapps.platform.getUserID()) + "/" + encodeURIComponent(fromId);
    var data = {
        version: cleverapps.config.version
    };

    options = options || {};

    this._syncInProgress = true;
    this._inGetProgress = true;

    var isBetter = function (sUser) {
        if (!sUser) {
            return false;
        }
        if (sUser.episode !== cleverapps.user.episode) {
            return sUser.episode > cleverapps.user.episode;
        }
        if (sUser.level !== cleverapps.user.level) {
            return sUser.level > cleverapps.user.level;
        }
        if (cleverapps.config.type === "merge" && sUser.exp !== cleverapps.exp.getExp()) {
            return sUser.exp > cleverapps.exp.getExp();
        }
        return false;
    };

    var fail = function (err) {
        console.log("Error", err);
        this._syncInProgress = false;
        this._inGetProgress = undefined;
        cleverapps.notification.create("Error load progress");
    }.bind(this);

    var success = function (response) {
        if (options.acceptOnlyIfBetter && !isBetter(response.sync.users)) {
            this._syncInProgress = false;
            this._inGetProgress = undefined;
            options.callback && options.callback();
            return;
        }

        this.synced = false;
        this._loadedSync = response.sync;
        this._loadedSession = response.key;
        if (!options.progressLoadOnly) {
            this._syncIn.process();
        }
        options.callback && options.callback();
    }.bind(this);

    cleverapps.RestClient.post(path, data, success, fail);
};

cleverapps.Synchronizer.prototype.getAccessToken = function () {
    return cleverapps.platform.haveDeviceId() ? cleverapps.platform.getAccessToken() : cleverapps.social.getAccessToken();
};

cleverapps.Synchronizer.prototype._sync = function () {
    if (this._syncInProgress || this._clientSessionExpired) {
        return;
    }

    var isFirstSync = this._startCheckInterval();
    this._syncId++;
    this._syncInProgress = true;
    var syncedOnBegin = this.synced;
    this.synced = false;

    var accessToken = this.getAccessToken() || "undefined";

    var path = this._getPath("newsync") + "/" + encodeURIComponent(accessToken);
    var data = {
        episode: levels.user.episode,
        level: levels.user.level,
        progress: levels.user.progress,
        source: cleverapps.platform.source,
        progressCompare: cleverapps.user.progressCompare,
        exp: cleverapps.expBySlots[CustomSyncers.SLOT_MAIN].getExp(),
        registered: levels.user.registered,
        loggedIn: levels.user.loggedIn,
        localStorageEnabled: cleverapps.DataLoader.enabled,
        localStorageCorrupted: cleverapps.DataLoader.corrupted,
        version: cleverapps.config.version,
        clientChecksumDifferent: this._clientChecksumDifferent
    };

    // if (this._clientChecksumDifferent) {
    //     data.syncOut = this._syncOut.getAllData();
    // }

    var syncSuccess = this._syncCallback(function (response) {
        this._syncInProgress = false;
        delete this._clientChecksumDifferent;

        this._loadedSession = response.key;
        this._loadedSync = response.sync;
        this._zeroSession = response.zeroSession;

        if (response.cheater) {
            cleverapps.user.cheater = true;
            cleverapps.flags.update();
        }

        cleverapps.userDelete.updateDeleted(response.deleted);

        if (this._loadedSession !== undefined) {
            // session not equal
            if (this._loadedSync) {
                // server higher
                console.log("sync in");
                this._syncIn.process();
                this.updateLastSyncIn();
            } else {
                // client higher
                this._syncOut.process();
            }
        } else {
            // session equal
            this.on();
        }

        this._onSyncLoaded();
    }).bind(this);

    var syncFail = this._syncCallback(function (err) {
        this._syncInProgress = false;

        if (err && err.status === 403) {
            if (accessToken === "undefined" && this.getAccessToken()) {
                this.syncWhenReady();
                return;
            }
            if (cleverapps.social.onTokenValidateFailure) {
                cleverapps.social.onTokenValidateFailure();
            }
            if (!cleverapps.social.isLoggedIn()) {
                this.wantsSocialConnectWindow = true;
                this.displaySocialConnectWindow();
            }
        } else if (isFirstSync || syncedOnBegin) {
            if (cleverapps.config.debugMode) {
                setTimeout(function () {
                    cleverapps.notification.create("Error saving progress");
                }, isFirstSync ? 2500 : 0);
            }
        }
        this._onSyncProcessed();
        this._onSyncLoaded();
    }).bind(this);

    cleverapps.RestClient.post(path, data, syncSuccess, syncFail);
};

cleverapps.Synchronizer.prototype.overrideProgress = function (snapshot) {
    var actions = [
        function (f) {
            this.whenSyncCompleted(f);
        }.bind(this),

        function (f) {
            this._syncInProgress = true;
            this._needResync = false;

            new ReloadWindow(f);
        }.bind(this),

        function () {
            cleverapps.snapshots.importData(snapshot);

            cleverapps.scenes.sceneRefresh();

            this._syncInProgress = false;
            this._syncOut.sendAllData();
        }.bind(this)
    ];

    if (cleverapps.meta.isFocused()) {
        cleverapps.meta.distract({
            focus: "override",
            actions: actions
        });
    } else {
        cleverapps.meta.display({
            focus: "override",
            actions: actions
        });
    }
};

cleverapps.Synchronizer.prototype.displaySocialConnectWindow = function () {
    console.trace();

    cleverapps.meta.display({
        focus: "SynchronizerCheckConnection",
        actions: [
            function (f) {
                cleverapps.social.checkConnection(function () {
                    f();
                    this.syncWhenReady();
                }.bind(this), f, {
                    withWindow: true,
                    errorMessage: "FbConnectWindow.TryAgain"
                });
            }.bind(this),

            function (f) {
                this.wantsSocialConnectWindow = false;
                f();
            }.bind(this)
        ]
    });
};

cleverapps.Synchronizer.prototype._onSyncProcessed = function () {
    if (this._onceFirstSyncCompletedListener) {
        console.log("first sync");
        this._onceFirstSyncCompletedListener();
        this._onceFirstSyncCompletedListener = undefined;
    }
};

cleverapps.Synchronizer.prototype._onSyncLoaded = function () {
    if (this._onceNextSyncCompletedListener) {
        this._onceNextSyncCompletedListener();
        this._onceNextSyncCompletedListener = undefined;
    }
};

cleverapps.Synchronizer.prototype._onSyncOutCompleted = function () {
    if (this._onceSyncOutCompleted) {
        this._onceSyncOutCompleted();
        this._onceSyncOutCompleted = undefined;
    }
};

cleverapps.Synchronizer.prototype.whenSyncCompleted = function (callback) {
    if (this._syncInProgress) {
        this.onceSyncCompletedListener = callback;
    } else {
        callback();
    }
};

cleverapps.Synchronizer.SESSION_EXPIRED = 99;
