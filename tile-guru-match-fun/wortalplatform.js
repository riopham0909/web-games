/**
 * https://sdk.html5gameportal.com/wortal-html5/#initialization
 *
 * Created by anatoly on 01/09/2023
 */

var WortalPlatform = function (options) {
    Platform.call(this, options, "wortal");
};

WortalPlatform.prototype = Object.create(Platform.prototype);
WortalPlatform.prototype.constructor = WortalPlatform;

WortalPlatform.prototype._connect = function (callback) {
    window.addEventListener("wortal-sdk-initialized", function () {
        if (!this.isSupportedApi("context.inviteAsync")) {
            cleverapps.flags.noinvites = true;
        }

        if (!this.isSupportedApi("context.shareAsync")) {
            cleverapps.flags.noshares = true;
        }

        this.debugMode = Wortal.session.getPlatform() === "debug"
            || window.location.href.includes("/debug/")
            || cleverapps.config.debugMode;

        this.reportProgress(100);
        
        callback(Platform.STATUS_CONNECTED);
    }.bind(this));

    cleverapps.loadSdk("//storage.googleapis.com/html5gameportal.com/wortal-sdk/wortal-core-1.6.13.js", {
        onFailure: function () {
            console.log("Failed to load wortal sdk");

            callback(Platform.STATUS_DISCONNECTED);
        }
    });
};

WortalPlatform.prototype.reportProgress = function (progress) {
    if (this.isConnected(Platform.PLATFORM)) {
        Wortal.setLoadingProgress(progress);
    }
};

WortalPlatform.prototype.getCurrentTournamentId = function (callback) {
    Wortal.tournament.getCurrentAsync().then(function (tournament) {
        var expired = new Date(tournament.endTime * 1000) < new Date();
        callback(expired ? undefined : String(tournament.id));
    }).catch(function () {
        callback();
    });
};

WortalPlatform.prototype._reportScore = function (score, callback) {
    Wortal.tournament.postScoreAsync(score).then(function () {
        this.getCurrentTournamentId(callback);
    }.bind(this)).catch(function () {
        callback();
    });
};

WortalPlatform.prototype.isSupportedApi = function (method) {
    var supportedApiMethods = Wortal.getSupportedAPIs();
    return supportedApiMethods.indexOf(method) !== -1;
};