/**
 * Created by vladislav on 9/6/2022
 */

var MSStart = function (options) {
    Platform.call(this, options, "msstart");
};

MSStart.prototype = Object.create(Platform.prototype);
MSStart.prototype.constructor = MSStart;

MSStart.prototype._connect = function (callback) {
    var onFailure = function () {
        console.error("MSStart Social Init failed");
        callback(Platform.STATUS_DISCONNECTED);
    };

    // cleverapps.loadSdk("//assets.msn.com/staticsb/statics/latest/msstart-games-sdk/msstart-v1.0.0-rc.12.min.js", {
    cleverapps.loadSdk(cleverapps.config.staticUrl + "cleverapps/res/msstart-v1.0.0-rc.12.min.js", {
        onSuccess: function () {
            callback(Platform.STATUS_CONNECTED);
        },
        onFailure: onFailure
    });
};

MSStart.prototype.getLocalStoragePreffix = function () {
    return "_msstart";
};

MSStart.prototype.getCurrentTournamentId = function (callback) {
    callback(1);
};

MSStart.prototype._reportScore = function (score, callback) {
    if (!cleverapps.social.isLoggedIn()) {
        callback();
        return;
    }

    $msstart.submitGameResultsAsync(score).then(function (result) {
        callback(result);
    });
};

MSStart.prototype.isFullscreenAvailable = function () {
    return false;
};
