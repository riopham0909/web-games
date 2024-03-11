/**
 * Created by vladislav on 1/11/2024
 */

var Connectable = function () {
    cleverapps.EventEmitter.call(this);
};

Connectable.prototype = Object.create(cleverapps.EventEmitter.prototype);
Connectable.prototype.constructor = Connectable;

Connectable.prototype.connect = function (callback) {
    if (this.connecting) {
        return;
    }

    this.connecting = true;
    this._connect(cleverapps.waitNoMore(Platform.WAIT_CONNECT_TIMEOUT, function (status) {
        this.connecting = false;

        callback(status);
    }.bind(this)));
};

Connectable.prototype._connect = function (callback) {
    callback(Platform.STATUS_CONNECTED);
};