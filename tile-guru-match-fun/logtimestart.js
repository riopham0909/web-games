/**
 * Created by slava on 7/17/17.
 */

var LogTimeStart = function () {
    this.started = Date.now();

    this.timeout = setTimeout(this.stop.bind(this), 60000);
};

LogTimeStart.prototype.save = function () {
    if (!cleverapps.platform || !cleverapps.user || !cleverapps.RestClient) {
        console.log("Skip logging time start, no platform or user or RestClient found after timeout");
        return;
    }

    var source = cleverapps.platform.source;
    var id = cleverapps.platform.getUserID();

    var passedTime = Math.round((Date.now() - this.started) / 1000);

    cleverapps.RestClient.post("/timestart/" + encodeURIComponent(id) + "/" + passedTime + "/" + source, {});
};

LogTimeStart.prototype.stop = function () {
    if (this.timeout === undefined) {
        return;
    }

    clearTimeout(this.timeout);
    this.timeout = undefined;
    this.save();
};

if (!cc.sys.isNative) {
    LogTimeStart.active = new LogTimeStart();
}
