/**
 * Created by mac on 5/11/20
 */

var Alarm = function () {
    this.on = false;
    this.alarms = {};

    this.priority = 0;

    this.onChangeListeners = {};
};

Alarm.prototype.isOn = function() {
    return this.priority > 0;
};

Alarm.prototype.start = function (name, priority) {
    this.alarms[name] = priority || 1;
    this.onChange();
};

Alarm.prototype.stop = function (name) {
    delete this.alarms[name];
    this.onChange();
};

Alarm.prototype.clear = function() {
    this.alarms = {};
    this.onChange();
};

Alarm.prototype.onChange = function () {
    var priority = 0;
    for (var i in this.alarms) {
        if (this.alarms[i] > priority) {
            priority = this.alarms[i];
        }
    }

    if (priority !== this.priority) {
        this.priority = priority;
        for (var i in this.onChangeListeners) {
            this.onChangeListeners[i](priority);
        }
    }
};