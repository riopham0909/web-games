/**
 * Created by vladislav on 26.12.2019
 */

var UserStatus = function () {
    cleverapps.EventEmitter.call(this);

    if (cleverapps.environment.isSceneWithPreview() || cleverapps.config.wysiwygMode) {
        this.timeouts = [];
    } else {
        this.timeouts = [
            new UserStatusTimeout(cleverapps.parseInterval("10 seconds"), function (type, order) {
                this.trigger("inactive_very_short", order);
            }.bind(this)),

            new UserStatusTimeout(cleverapps.parseInterval("20 seconds"), function (type, order) {
                this.trigger("inactive_short", order);
            }.bind(this)),

            new UserStatusTimeout(cleverapps.parseInterval("60 seconds"), function (type, order) {
                this.trigger("inactive_long", order);
            }.bind(this))
        ];
    }
};

UserStatus.prototype = Object.create(cleverapps.EventEmitter.prototype);
UserStatus.prototype.constructor = UserStatus;

UserStatus.prototype.destructor = function () {
    this.timeouts.forEach(function (timeout) {
        timeout.destructor();
    });
    this.timeouts = [];
};

UserStatus.prototype.reportUserAction = function () {
    this.trigger("active");

    this.timeouts.forEach(function (timeout) {
        timeout.reset();
    });
};

var UserStatusTimeout = function (time, callback) {
    this.time = time;
    this.callback = callback;

    this.reset();
};

UserStatusTimeout.prototype.reset = function () {
    this.clear();

    this.hintTimeout = cleverapps.timeouts.setTimeout(function () {
        this.callback();
        this.reset();
    }.bind(this), this.time);
};

UserStatusTimeout.prototype.clear = function () {
    cleverapps.timeouts.clearTimeout(this.hintTimeout);
};

UserStatusTimeout.prototype.destructor = function () {
    this.clear();
};