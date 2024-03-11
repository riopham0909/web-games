/**
 * Created by andrey on 03.05.17.
 */

cleverapps.EventsLogger = function () {
    this.pool = {
        names: [],
        data: []
    };

    this.externalEvents = cleverapps.createSet(
        cleverapps.values(cleverapps.EVENTS.GENERAL).concat(cleverapps.values(cleverapps.EVENTS.TARGET_FOR_BUYING)
            .concat([cleverapps.EVENTS.SPENT.HARD, cleverapps.EVENTS.EARN.HARD]))
    );

    this.statsEvents = cleverapps.createSet(cleverapps.values(cleverapps.EVENTS.STATS));
};

cleverapps.EventsLogger.prototype.logEvent = function (name, params) {
    if (cleverapps.flags && cleverapps.flags.noLogEvents) {
        return;
    }

    if (params === undefined) {
        params = {};
    }

    if (name.length > 40) {
        console.log("WARN: Invalid event name: " + name
            + "!. It must be between 1 and 40 characters, and must be contain only alphanumerics, , - or spaces, starting with alphanumeric or _.");
    }

    if (cleverapps.EventsLogger.IGNORED_EVENTS.indexOf(name) === -1) {
        this._storeEvent(name, params);
    }

    var externalName = name.indexOf("hard-") === 0 ? cleverapps.EVENTS.SPENT.HARD : name;
    if (this.externalEvents[externalName]) {
        if (cleverapps.adjust) {
            cleverapps.adjust.logEvent(externalName, params);
        }

        if (cleverapps.adOcean && AdOcean.EVENTS_MAP[externalName] !== undefined) {
            cleverapps.adOcean.logEvent(AdOcean.EVENTS_MAP[externalName], params);
        }

        var googleRename = cleverapps.EventsLogger.GOOGLE_EVENTS[externalName] ? cleverapps.EventsLogger.GOOGLE_EVENTS[externalName] : externalName;

        if (cleverapps.firebase) {
            cleverapps.firebase.logEvent(googleRename, params);
        }

        if (cleverapps.googleAnalytics) {
            cleverapps.googleAnalytics.logEvent(googleRename, params);
        }

        var fbRename = cleverapps.EventsLogger.FACEBOOK_EVENTS[externalName];
        var fbEventName = fbRename ? fbRename.eventName : externalName;
        var fbEventParams = {};

        if (fbRename) {
            Object.keys(fbRename.params).forEach(function (fbParamName) {
                fbEventParams[fbParamName] = params[fbRename.params[fbParamName]];
            });
        } else {
            Object.keys(params).forEach(function (paramName) {
                fbEventParams[paramName === "value" ? paramName : "fb_" + paramName] = params[paramName];
            });
        }

        if (cc.sys.isNative) {
            cleverapps.nativeFbEventsLogger.logEvent(fbEventName, fbEventParams);
        } else if (typeof FBInstant !== "undefined") {
            FBInstant.logEvent(fbEventName, fbEventParams.value || 1, fbEventParams);
        } else if (typeof GSInstant !== "undefined") {
            GSInstant.logEvent(externalName, "string", JSON.stringify(params));
        }
    }

    if (cleverapps.thinkingData && (this.externalEvents[externalName] || this.statsEvents[externalName]
        || externalName.startsWith(cleverapps.EVENTS.STATS.SHOP_OPEN))) {
        var thinkingDataName = cleverapps.EventsLogger.THINKINGDATA_EVENTS[externalName] || externalName;
        if (thinkingDataName.startsWith(cleverapps.EVENTS.STATS.SHOP_OPEN)) {
            thinkingDataName = "shop_enter";
        }
        cleverapps.thinkingData.logEvent(thinkingDataName, params);
    }
};

cleverapps.EventsLogger.prototype._storeEvent = function (name, params) {
    if (name === undefined || name.startsWith("undefined")) {
        if (cleverapps.config.debugMode) {
            throw 1;
        }
    }
    this.pool.names.push(name);
    this.pool.data.push(params);

    var data = this.getBaseParameters();
    setTimeout(this.sendEvents.bind(this, data), 0);
};

cleverapps.EventsLogger.prototype.sendEvents = function (data) {
    if (this.pool.names.length > 0) {
        var events = this.pool.names.join(",");
        console.log("Sending events - " + events);

        data = Object.assign(data, this.getBaseParameters());
        data.events = events;
        data.params = this.pool.data;

        cleverapps.RestClient.post("/events/", data, function () {
            // console.log("Success event - " + data.events.join(','));
        }, function () {
            console.log("Failure event - " + events);
        });

        this.pool.names = [];
        this.pool.data = [];
    }
};

cleverapps.EventsLogger.prototype.getBaseParameters = function () {
    var params = {};

    if (cleverapps.user && cleverapps.platform.getUserID()) {
        params.id = cleverapps.platform.getUserID();
    }

    if (cleverapps.environment) {
        if (cleverapps.environment.levelNo !== undefined) {
            params.level = cleverapps.environment.levelNo;
        }

        if (cleverapps.environment.episodeNo !== undefined) {
            params.episode = cleverapps.environment.episodeNo;
        }
    }

    if (cleverapps.config && cleverapps.config.type === "merge") {
        if (cleverapps.user) {
            params.level = cleverapps.user.level;
        }
    }

    var level = Game.currentGame && Game.currentGame.level;
    if (level) {
        if (level.hash) {
            params.hash = level.hash;
        }
    }

    params.source = cleverapps.platform.source;

    return params;
};

cleverapps.EventsLogger.FACEBOOK_EVENTS = {};
cleverapps.EventsLogger.FACEBOOK_EVENTS[cleverapps.EVENTS.GENERAL.TUTORIAL_COMPLETE] = {
    eventName: "fb_mobile_tutorial_completion",
    params: {}
};
cleverapps.EventsLogger.FACEBOOK_EVENTS[cleverapps.EVENTS.GENERAL.LEVEL_UP] = {
    eventName: "fb_mobile_level_achieved",
    params: {
        "fb_level": "level"
    }
};
cleverapps.EventsLogger.FACEBOOK_EVENTS[cleverapps.EVENTS.SPENT.HARD] = {
    eventName: "fb_mobile_spent_credits",
    params: {
        "value": "value"
    }
};

cleverapps.EventsLogger.GOOGLE_EVENTS = {};
cleverapps.EventsLogger.GOOGLE_EVENTS[cleverapps.EVENTS.SPENT.HARD] = "spend_virtual_currency";
cleverapps.EventsLogger.GOOGLE_EVENTS[cleverapps.EVENTS.EARN.HARD] = "earn_virtual_currency";

cleverapps.EventsLogger.THINKINGDATA_EVENTS = {};
cleverapps.EventsLogger.THINKINGDATA_EVENTS[cleverapps.EVENTS.STATS.SHOP_OPEN] = "shop_enter";
cleverapps.EventsLogger.THINKINGDATA_EVENTS[cleverapps.EVENTS.STATS.SHOP_CLOSE] = "shop_stay";

cleverapps.EventsLogger.IGNORED_EVENTS = [
    cleverapps.EVENTS.GENERAL.LEVEL_UP
];