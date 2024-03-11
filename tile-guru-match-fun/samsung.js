/**
 * https://drive.google.com/file/d/1230-w1t5Tp35lNj61OL3y1yBU4dujNp0/view
 *
 * Created by anatoly on 03/12/2023
 */

var Samsung = function (options) {
    Platform.call(this, options, "samsung");
};

Samsung.prototype = Object.create(Platform.prototype);
Samsung.prototype.constructor = Samsung;

Samsung.prototype.removeLoadingProgress = function (callback) {
    if (this.isConnected(Platform.PLATFORM)) {
        GSInstant.startGameAsync().then(function () {
            cleverapps.timeouts.setTimeout(callback, 3000);
        });
    } else {
        var listener = this.on("changeStatus:" + Platform.PLATFORM, function (status) {
            if (status === Platform.STATUS_CONNECTED) {
                listener.clear();

                GSInstant.startGameAsync().then(function () {
                    cleverapps.timeouts.setTimeout(callback, 3000);
                });
            }
        });
    }
};

Samsung.prototype._connect = function (callback) {
    GSInstant.setOnPauseCallback(this.pause.bind(this));
    GSInstant.setOnResumeCallback(this.resume.bind(this));

    cleverapps.loadSdk("https://img.samsungapps.com/gsinstant-sdk/iapinstant.1.0.js", {
        onSuccess: function () {
            GSInstant.initializeAsync().then(function () {
                console.log(GSInstant.getSupportedAPIs());
                callback(Platform.STATUS_CONNECTED);
            }).catch(function () {
                callback(Platform.STATUS_DISCONNECTED);
            });
        },
        onFailure: function () {
            console.log("Error in load sdk");

            callback(Platform.STATUS_DISCONNECTED);
        },
        crossorigin: false
    });
};

Samsung.prototype.reportProgress = function (progress) {
    if (this.isConnected(Platform.PLATFORM)) {
        GSInstant.setLoadingProgress(progress);
    }
};

Samsung.prototype.getLocalStoragePreffix = function () {
    return "_samsung";
};

Samsung.prototype._canCreateShortcut = function () {
    return !GSInstant.canCreateShortCut().err;
};

Samsung.prototype.createShortcut = function () {
    GSInstant.createShortCut();
};

Samsung.prototype.getCurrentTournamentId = function (callback) {
    callback(1);
};

Samsung.prototype._reportScore = function (score, callback) {
    GSInstant.setScoreAsync(score).then(function () {
        this.getCurrentTournamentId(callback);
    }.bind(this)).catch(function () {
        callback();
    });
};