/**
 * Created by anatoly on 18/08/2023
 */

var Ton = function (options) {
    Platform.call(this, options, "ton");

    this.initCallback = undefined;

    window.addEventListener("message", function (event) {
        var data = event.data;
        var pdData = data && data.playdeck;

        if (!pdData) {
            return;
        }

        if (pdData.method === "play") {
            if (this.initCallback) {
                this.initCallback(Platform.STATUS_CONNECTED);
                this.initCallback = undefined;
            }
            return;
        }

        this.callCallback(pdData.method, 0, pdData);
    }.bind(this));
};

Ton.prototype = Object.create(Platform.prototype);
Ton.prototype.constructor = Ton;

Ton.prototype.reportProgress = function (value) {
    this.callNative("loading", { value: value });
};

Ton.prototype._connect = function (callback) {
    this.initCallback = callback;
};

Ton.prototype._reportScore = function (score, callback) {
    this.callNative("setScore", { value: score, isForce: false }, callback);
};

Ton.prototype._callNative = function (method, options) {
    var params = Object.assign({
        method: method
    }, options);

    window.parent[Ton.POST_MESSAGE]({
        playdeck: params
    }, "*");
};

Ton.POST_MESSAGE = "postMessage";