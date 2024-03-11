/**
 * Created by andrey on 26.04.2021.
 */

cleverapps.NativeFbEventsLogger = function () {
    this.batch = [];
};

cleverapps.NativeFbEventsLogger.prototype.logEvent = function (name, params) {
    if (cleverapps.flags.nofacebookevents) {
        return;
    }

    this.batch.push({
        name: name,
        params: params
    });
    this.logEventsBatch();
};

cleverapps.NativeFbEventsLogger.prototype.logEventsBatch = cleverapps.accumulate(1000, function () {
    if (cleverapps.flags.nofacebookevents) {
        return;
    }

    if (cleverapps.platform.oneOf(AndroidBase, IOS, IOSCh)) {
        cleverapps.platform.callNative("FacebookPlugin.logEventsBatch", { events: this.batch });
    }
    this.batch = [];
});