/**
 * Created by Aleksandr on 06.10.2022.
 */

var Plinga = function (options) {
    Platform.call(this, options, "plng");
};

Plinga.prototype = Object.create(Platform.prototype);
Plinga.prototype.constructor = Plinga;

Plinga.prototype._connect = function (callback) {
    console.log("Plinga init");

    // eslint-disable-next-line no-unused-vars, camelcase
    plingaRpc_pauseGame = function () {
        this.pause();
    }.bind(this);

    // eslint-disable-next-line no-unused-vars, camelcase
    plingaRpc_resumeGame = function () {
        this.resume();
    }.bind(this);

    var onFailure = function () {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.DEBUG.PLINGA_INIT_ERROR);

        callback(Platform.STATUS_DISCONNECTED);
    };

    cleverapps.loadSdk("//s3.amazonaws.com/imgs3.plinga.de/general/easyXDM.min.js", {
        onSuccess: function () {
            console.log("easyXDM loaded");
            easyXDM.DomHelper.requiresJSON("//s3.amazonaws.com/imgs3.plinga.de/general/json2.min.js");
            cleverapps.loadSdk("//s3.amazonaws.com/imgs3.plinga.de/plingaRpc/plingaRpc.js", {
                onSuccess: function () {
                    plingaRpc.init(function () {
                        console.log("plingaRPC inited");

                        plingaRpc.setAllowFullscreen();
                        callback(Platform.STATUS_CONNECTED);
                    });
                },
                onFailure: onFailure
            });
        },
        onFailure: onFailure
    });
};

Plinga.prototype.getLocalStoragePreffix = function () {
    return "_plinga";
};

// Plinga.prototype.toggleFullScreen = function () {
//     plingaRpc.toggleFullscreen();
// };
//
// Plinga.prototype.exitFullscreen = function () {
//     if (this.isFullScreen()) {
//         this.toggleFullScreen();
//     }
// };

Plinga.prototype.isFullscreenAvailable = function () {
    return false;
};
